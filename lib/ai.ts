// Server-side AI helpers shared by the API routes. (Do NOT import from client code.)
//
// Providers: Groq (primary — fast, free tier) with OpenRouter as an automatic
// fallback. Both speak the OpenAI-compatible chat completions API, so we use
// plain fetch — no SDK needed. Keys live in env vars only.
//
// ── Why this file is so careful about token budgets ─────────────────────────
// Groq's free tier limits tokens-per-minute PER MODEL and PER ORGANIZATION,
// and it counts `max_tokens` (what we *might* generate) against that budget,
// not what we actually use. A request whose prompt + max_tokens exceeds the
// model's TPM ceiling is rejected outright with 413 "Request too large" — it
// never succeeds, no matter how long you wait. That is exactly what killed
// /api/practice: a ~5k-token prompt plus max_tokens 4000 (+2048 reasoning
// headroom) asked for ~11k against an 8k ceiling, on every single model.
//
// So: every model carries its TPM ceiling here, we estimate the prompt, and we
// clamp max_tokens (or skip the model) so a request is only ever sent when it
// can actually fit.
import { rules, SECTIONS } from "@/data/rules";

type TextPart = { type: "text"; text: string };
type ImagePart = { type: "image_url"; image_url: { url: string } };
export type MsgContent = string | (TextPart | ImagePart)[];
type ChatMsg = { role: "system" | "user" | "assistant"; content: MsgContent };

type Provider = {
  name: "groq" | "openrouter";
  url: string;
  key: string | undefined;
  model: string;
  /** Free-tier tokens-per-minute ceiling: prompt + max_tokens must fit under it. */
  tpm: number;
  /** Reasoning models burn tokens thinking before they answer. */
  reasoning?: boolean;
  vision?: boolean;
};

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_AUDIO_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// A single attempt must not be allowed to hang: Vercel caps the route at 60s,
// and a stalled upstream used to eat the whole budget before we fell through.
const ATTEMPT_TIMEOUT_MS = 20_000; // whole non-streaming call
const FIRST_TOKEN_TIMEOUT_MS = 12_000; // streaming: give up if it won't start
const TOTAL_BUDGET_MS = 50_000; // leave headroom under maxDuration = 60
const MAX_ATTEMPTS = 7; // bound worst-case latency across the chain

// Room left for the model's own overhead (chat template, tool preamble) when we
// squeeze a request under a TPM ceiling.
const TPM_SAFETY = 400;
// Below this many output tokens an answer isn't worth sending.
const MIN_USEFUL_TOKENS = 350;

/**
 * Model catalogue, verified against the live provider APIs (2026-07-21).
 *
 * Removed because the providers retired them (they 404'd on every request and
 * burned a round trip each): groq meta-llama/llama-4-scout-17b-16e-instruct,
 * groq qwen/qwen3-32b, and the OpenRouter free slugs for llama-3.3-70b,
 * qwen3-next-80b and hermes-3-405b ("unavailable for free").
 *
 * Ordered best-first. TPM figures are what the free tier actually reports in
 * its x-ratelimit-limit-tokens header.
 */
const GROQ_MODELS: { model: string; tpm: number; reasoning?: boolean }[] = [
  { model: "llama-3.3-70b-versatile", tpm: 12_000 },
  { model: "openai/gpt-oss-120b", tpm: 8_000, reasoning: true },
  // Not marked `reasoning` because we switch its thinking off outright above.
  { model: "qwen/qwen3.6-27b", tpm: 8_000 },
  { model: "openai/gpt-oss-20b", tpm: 8_000, reasoning: true },
  { model: "llama-3.1-8b-instant", tpm: 6_000 },
];

// OpenRouter's free pool: no TPM ceiling of this kind, but heavily queued, so
// it stays a safety net rather than a primary.
const OPENROUTER_MODELS: { model: string; tpm: number; reasoning?: boolean; vision?: boolean }[] = [
  { model: "openai/gpt-oss-20b:free", tpm: 100_000, reasoning: true },
  { model: "nvidia/nemotron-3-super-120b-a12b:free", tpm: 100_000, reasoning: true },
  { model: "nvidia/nemotron-3-nano-30b-a3b:free", tpm: 100_000, reasoning: true },
  { model: "google/gemma-4-26b-a4b-it:free", tpm: 100_000, vision: true },
  { model: "google/gemma-4-31b-it:free", tpm: 100_000, vision: true },
];

// Image understanding (the camera button in the question solver). Groq has no
// vision model any more, so these are OpenRouter-only. Ordered by what actually
// transcribed a photographed question paper correctly and fastest when tested.
const VISION_MODELS: { model: string; tpm: number }[] = [
  { model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free", tpm: 100_000 },
  { model: "google/gemma-4-26b-a4b-it:free", tpm: 100_000 },
  { model: "google/gemma-4-31b-it:free", tpm: 100_000 },
  { model: "nvidia/nemotron-nano-12b-v2-vl:free", tpm: 100_000 },
];

function groqKeys(): string[] {
  return [process.env.GROQ_API_KEY, process.env.GROQ_API_KEY_2].filter(Boolean) as string[];
}

/**
 * The text fallback chain: every Groq model on every Groq key (best model
 * first), then the OpenRouter free pool.
 *
 * NOTE both Groq keys usually belong to the same organization, and the token
 * limits are per-ORG — so the second key only helps for per-key request caps,
 * never for a 413/429. `runChain` knows that and skips the duplicate.
 */
function providers(): Provider[] {
  const keys = groqKeys();
  const openrouter = process.env.OPENROUTER_API_KEY;
  return [
    ...GROQ_MODELS.flatMap((m) =>
      keys.map((key) => ({ name: "groq" as const, url: GROQ_URL, key, ...m })),
    ),
    ...OPENROUTER_MODELS.map((m) => ({
      name: "openrouter" as const, url: OPENROUTER_URL, key: openrouter, ...m,
    })),
  ].filter((p) => !!p.key);
}

function visionProviders(): Provider[] {
  const openrouter = process.env.OPENROUTER_API_KEY;
  return VISION_MODELS
    .map((m) => ({ name: "openrouter" as const, url: OPENROUTER_URL, key: openrouter, vision: true, ...m }))
    .filter((p) => !!p.key);
}

// ── Token budgeting ─────────────────────────────────────────────────────────

/** Rough token count. English averages ~3.6 chars/token; we round down to be
 *  pessimistic (over-estimating the prompt is the safe direction here). */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3.4);
}

function messageTokens(messages: ChatMsg[]): number {
  let total = 0;
  for (const m of messages) {
    if (typeof m.content === "string") total += estimateTokens(m.content);
    else {
      for (const part of m.content) {
        // Images are billed as tokens too; a downscaled photo lands around here.
        total += part.type === "text" ? estimateTokens(part.text) : 1200;
      }
    }
    total += 4; // per-message framing
  }
  return total;
}

/**
 * How many output tokens this model can actually be asked for, given the
 * prompt. Returns 0 when the request cannot fit at all — skip the model rather
 * than eat a guaranteed 413.
 */
function budgetFor(p: Provider, promptTokens: number, want: number): number {
  const room = p.tpm - promptTokens - TPM_SAFETY;
  if (room < MIN_USEFUL_TOKENS) return 0;
  // Reasoning models think before answering, so they need headroom above the
  // visible answer — but only as much as the ceiling can spare.
  const ask = p.reasoning ? want + 1500 : want;
  return Math.min(ask, room);
}

// ── Request plumbing ────────────────────────────────────────────────────────

function requestBody(
  p: Provider, messages: ChatMsg[],
  opts: { json: boolean; maxTokens: number; temperature: number; stream?: boolean },
) {
  return JSON.stringify({
    model: p.model,
    messages,
    max_tokens: opts.maxTokens,
    // Keep reasoning short — we pay for thinking tokens out of the same ceiling.
    ...(p.name === "groq" && p.model.includes("gpt-oss") ? { reasoning_effort: "low" } : {}),
    // Qwen on Groq thinks at length by default, and hiding that stream doesn't
    // stop it BILLING against max_tokens — it just truncated the visible answer
    // instead. Groq only accepts "none" or "default" here; none it is.
    ...(p.name === "groq" && p.model.includes("qwen") ? { reasoning_effort: "none" } : {}),
    // Several OpenRouter fallbacks are reasoning models too, and without this
    // their raw chain-of-thought leaks into the reply.
    ...(p.name === "openrouter" ? { reasoning: { exclude: true } } : {}),
    temperature: opts.temperature,
    ...(opts.stream ? { stream: true } : {}),
    ...(opts.json ? { response_format: { type: "json_object" } } : {}),
  });
}

function headersFor(p: Provider) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${p.key}`,
    ...(p.name === "openrouter"
      ? { "HTTP-Referer": "https://grammar-app-pink.vercel.app", "X-Title": "Grammy" }
      : {}),
  };
}

/** How far a failure should propagate through the chain. */
type FailScope = "attempt" | "model" | "key";

class ProviderError extends Error {
  scope: FailScope;
  constructor(message: string, scope: FailScope) {
    super(message);
    this.scope = scope;
  }
}

async function failure(p: Provider, res: Response): Promise<ProviderError> {
  const text = await res.text().catch(() => "");
  const detail = text.slice(0, 160).replace(/\s+/g, " ");
  // 404 = model retired. 413/429 = limits, which are per-ORGANIZATION on Groq's
  // free tier — retrying the same model on our other key is guaranteed to fail
  // the same way, so give up on the model, not just the attempt.
  const scope: FailScope =
    res.status === 401 || res.status === 403 ? "key"
      : res.status === 404 || res.status === 413 || res.status === 429 ? "model"
        : "attempt";
  return new ProviderError(`${p.name}/${p.model} ${res.status}: ${detail}`, scope);
}

/**
 * Walk a provider chain, skipping models/keys that have already proved dead for
 * this request, and hand each live one to `attempt`. The first success wins.
 */
async function runChain<T>(
  list: Provider[],
  promptTokens: number,
  want: number,
  attempt: (p: Provider, maxTokens: number) => Promise<T>,
): Promise<T> {
  if (list.length === 0) {
    throw new Error("No AI provider configured (set GROQ_API_KEY or OPENROUTER_API_KEY)");
  }
  const errors: string[] = [];
  const deadModels = new Set<string>();
  const deadKeys = new Set<string>();
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  let tries = 0;

  for (const p of list) {
    if (deadModels.has(p.model) || (p.key && deadKeys.has(p.key))) continue;
    if (tries >= MAX_ATTEMPTS) { errors.push("attempt limit reached"); break; }
    if (Date.now() > deadline) { errors.push(`out of time before trying ${p.model}`); break; }

    const maxTokens = budgetFor(p, promptTokens, want);
    if (maxTokens === 0) {
      // Would be a certain 413 — don't spend the round trip discovering that.
      const msg = `${p.model} skipped: needs ${promptTokens + want} tokens, ceiling is ${p.tpm}`;
      console.warn(`[ai] ${msg}`);
      errors.push(msg);
      deadModels.add(p.model);
      continue;
    }

    tries += 1;
    const t0 = Date.now();
    try {
      const out = await attempt(p, maxTokens);
      console.log(`[ai] served by ${p.name}/${p.model} in ${Date.now() - t0}ms (prompt~${promptTokens}, max_tokens ${maxTokens})`);
      return out;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const scope: FailScope = e instanceof ProviderError ? e.scope : "attempt";
      console.warn(`[ai] FAILED ${p.name}/${p.model} after ${Date.now() - t0}ms [${scope}]: ${msg}`);
      errors.push(msg);
      if (scope === "model") deadModels.add(p.model);
      if (scope === "key" && p.key) deadKeys.add(p.key);
    }
  }
  throw new Error(errors.join(" | "));
}

// ── Chat (non-streaming) ────────────────────────────────────────────────────

export async function aiChat({
  system, messages, json = false, maxTokens = 1200, temperature = 0.7, vision = false,
}: {
  system: string;
  messages: { role: "user" | "assistant"; content: MsgContent }[];
  json?: boolean;
  maxTokens?: number;
  temperature?: number;
  /** Route to an image-capable model (the message must carry an image part). */
  vision?: boolean;
}): Promise<string> {
  const full: ChatMsg[] = [{ role: "system", content: system }, ...messages];
  const promptTokens = messageTokens(full);

  return runChain(
    vision ? visionProviders() : providers(),
    promptTokens,
    maxTokens,
    async (p, budget) => {
      const res = await fetch(p.url, {
        method: "POST",
        headers: headersFor(p),
        body: requestBody(p, full, { json, maxTokens: budget, temperature }),
        signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
      });
      if (!res.ok) throw await failure(p, res);
      const data = await res.json();
      const content: string | undefined = data?.choices?.[0]?.message?.content;
      if (!content?.trim()) throw new ProviderError(`${p.name}/${p.model} returned an empty response`, "attempt");
      return content;
    },
  );
}

// ── Streaming ────────────────────────────────────────────────────────────────

// Parse an OpenAI-compatible SSE body into text deltas.
async function* parseSSE(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") return;
        try {
          const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content;
          if (typeof delta === "string" && delta.length > 0) yield delta;
        } catch {
          // keep-alive / partial frame — ignore
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Stream the reply from the first provider that actually starts producing
 * tokens. Returns the chosen provider plus an async iterator of text deltas.
 *
 * Falling back only matters *before* the first token — once a model has started
 * talking we are committed to it, so the student never sees a reply restart.
 */
export async function aiChatStream({
  system, messages, maxTokens = 700, temperature = 0.5,
}: {
  system: string;
  messages: { role: "user" | "assistant"; content: MsgContent }[];
  maxTokens?: number;
  temperature?: number;
}): Promise<{ model: string; provider: string; stream: AsyncGenerator<string> }> {
  const full: ChatMsg[] = [{ role: "system", content: system }, ...messages];
  const promptTokens = messageTokens(full);

  return runChain(providers(), promptTokens, maxTokens, async (p, budget) => {
    const controller = new AbortController();
    const watchdog = setTimeout(() => controller.abort(), FIRST_TOKEN_TIMEOUT_MS);
    try {
      const res = await fetch(p.url, {
        method: "POST",
        headers: headersFor(p),
        body: requestBody(p, full, { json: false, maxTokens: budget, temperature, stream: true }),
        signal: controller.signal,
      });
      if (!res.ok) throw await failure(p, res);
      if (!res.body) throw new ProviderError(`${p.name}/${p.model} sent no body`, "attempt");

      // Pull the first delta here so a provider that accepts the connection but
      // never produces a token still falls through to the next one.
      const iterator = parseSSE(res.body);
      const first = await iterator.next();
      if (first.done) throw new ProviderError(`${p.name}/${p.model} streamed nothing`, "attempt");

      async function* withFirst(): AsyncGenerator<string> {
        yield first.value as string;
        yield* iterator;
      }
      return { model: p.model, provider: p.name, stream: withFirst() };
    } finally {
      clearTimeout(watchdog);
    }
  });
}

// ── Speech to text (the mic button) ─────────────────────────────────────────

/**
 * Transcribe recorded audio with Groq's Whisper. Fast (~1s for a short clip)
 * and it copes well with Indian-accented English and Hinglish.
 */
export async function transcribeAudio(audio: Blob, filename = "clip.webm"): Promise<string> {
  const keys = groqKeys();
  if (keys.length === 0) throw new Error("Voice input needs GROQ_API_KEY");
  const errors: string[] = [];

  for (const model of ["whisper-large-v3-turbo", "whisper-large-v3"]) {
    for (const key of keys) {
      const form = new FormData();
      form.append("file", audio, filename);
      form.append("model", model);
      form.append("response_format", "json");
      // The student may mix English and Hinglish — leaving language unset lets
      // Whisper detect it, but a hint keeps short clips from being mislabelled.
      form.append("prompt", "An English grammar question from an AFCAT exam paper.");
      try {
        const res = await fetch(GROQ_AUDIO_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${key}` },
          body: form,
          signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
        });
        if (!res.ok) {
          const detail = (await res.text().catch(() => "")).slice(0, 160).replace(/\s+/g, " ");
          throw new Error(`${model} ${res.status}: ${detail}`);
        }
        const data = await res.json();
        const text: string = (data?.text ?? "").trim();
        if (!text) throw new Error(`${model} heard nothing`);
        return text;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.warn(`[ai] transcribe FAILED ${model}: ${msg}`);
        errors.push(msg);
      }
    }
  }
  throw new Error(errors.join(" | "));
}

// ── Diagnostics ─────────────────────────────────────────────────────────────

/** Ping every configured model with a one-token request. Used by /api/ai/health
 *  so a broken chain can be diagnosed from a phone instead of guessed at. */
export async function probeProviders(): Promise<{ provider: string; model: string; ok: boolean; ms: number; detail?: string }[]> {
  const list = [...providers(), ...visionProviders()];
  const seen = new Set<string>();
  const unique = list.filter((p) => {
    const id = `${p.name}/${p.model}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  return Promise.all(unique.map(async (p) => {
    const t0 = Date.now();
    try {
      const res = await fetch(p.url, {
        method: "POST",
        headers: headersFor(p),
        body: requestBody(p, [{ role: "user", content: "hi" }], { json: false, maxTokens: 8, temperature: 0 }),
        signal: AbortSignal.timeout(15_000),
      });
      const ms = Date.now() - t0;
      if (!res.ok) {
        const detail = (await res.text().catch(() => "")).slice(0, 120).replace(/\s+/g, " ");
        return { provider: p.name, model: p.model, ok: false, ms, detail: `${res.status}: ${detail}` };
      }
      return { provider: p.name, model: p.model, ok: true, ms };
    } catch (e) {
      return {
        provider: p.name, model: p.model, ok: false, ms: Date.now() - t0,
        detail: e instanceof Error ? e.message : String(e),
      };
    }
  }));
}

// ── Helpers ─────────────────────────────────────────────────────────────────

// Models sometimes wrap JSON in markdown fences or add stray text — extract
// the outermost JSON object defensively.
export function extractJSON<T>(text: string): T {
  const cleaned = text.replace(/```(?:json)?/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI response was not valid JSON");
  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}

// ── CORS (the Capacitor/Android build calls these routes cross-origin) ───────

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Expose-Headers": "X-AI-Model, X-AI-Provider",
};

export function corsPreflight() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, { status, headers: CORS_HEADERS });
}

export function errorResponse(err: unknown) {
  const message = err instanceof Error ? err.message : "Something went wrong";
  const status = message.includes("provider configured") ? 503 : 500;
  return jsonResponse({ error: message }, status);
}

// ── App knowledge shared with the AI ─────────────────────────────────────────

// The app's grammar sections — the AI tags every question with one of these so
// practice performance maps back onto the app's Topics.
export const SECTION_NAMES = [
  ...SECTIONS.map((s) => s.name),
  "Vocabulary",
  "Idioms & Phrases",
];

// Compact index of the app's rules (titles only) — used where token budget is
// tight, e.g. question generation.
// NOTE `ruleNumber` already reads "Rule 23" (or "BONUS"), so it is NOT prefixed
// again — the old "Rule Rule 23" form taught the model to cite rules by a name
// that doesn't exist anywhere in the app.
const ruleLine = (r: (typeof rules)[number]) => `${r.ruleNumber} [${r.section}] — ${r.title}`;

export const RULE_INDEX = rules.map(ruleLine).join("\n");

/** A rotating slice of the rule index — same idea, a fifth of the tokens. Used
 *  by question generation, where a TPM ceiling is the binding constraint. */
export function ruleIndexSample(n = 32, seed = Date.now()): string {
  const start = Math.abs(seed) % rules.length;
  return Array.from({ length: Math.min(n, rules.length) }, (_, i) => ruleLine(rules[(start + i) % rules.length]))
    .join("\n");
}

// FULL knowledge base: every rule with its complete text. ~20k chars / ~5.5k
// tokens — far too big to send on every chat turn, so the chat routes use
// relevantRules() below instead and keep this for offline/batch use.
export const RULE_KB = rules
  .map((r) => `${ruleLine(r)}: ${r.rule}`)
  .join("\n");

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "am", "do", "does", "did",
  "and", "or", "but", "if", "then", "than", "of", "to", "in", "on", "at", "for", "with",
  "this", "that", "these", "those", "it", "its", "i", "you", "me", "my", "we", "us",
  "what", "why", "how", "when", "which", "who", "can", "please", "explain", "example",
  "rule", "rules", "grammar", "english", "simpler", "way", "easy", "student", "context",
]);

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/**
 * Pick the rules most relevant to what the student is asking about, by simple
 * lexical overlap. This replaces shipping all 101 rules on every message: the
 * tutor still sees every rule TITLE (via RULE_INDEX) so it can cite anything,
 * but only gets the full text of the handful that actually matter.
 */
// Indexed once per process: the token bag of every rule, plus how many rules
// each token appears in (its document frequency).
const RULE_DOCS = rules.map((r) => ({
  r,
  bag: new Set(tokenize(`${r.title} ${r.rule} ${r.section}`)),
  title: new Set(tokenize(r.title)),
}));

const DOC_FREQ = (() => {
  const df = new Map<string, number>();
  for (const doc of RULE_DOCS) for (const t of doc.bag) df.set(t, (df.get(t) ?? 0) + 1);
  return df;
})();

/**
 * Inverse document frequency, sharpened.
 *
 * Plain term-counting ranked a question about "Ramesh is senior ___ me" against
 * the rules for "Died of/in/from/by/with", because the MCQ option "from" was in
 * that rule's TITLE while the word that actually mattered — "senior" — was only
 * in the body of the -IOR rule. Weighting by rarity fixes that: "from" appears
 * in 5 rules, "senior" in 2, and squaring widens the gap enough to matter across
 * a corpus this small.
 */
function idf(term: string): number {
  const df = DOC_FREQ.get(term) ?? 0;
  if (df === 0) return 0;
  return Math.log(1 + rules.length / df) ** 2;
}

function scoreRules(query: string, k: number) {
  const terms = [...new Set(tokenize(query))];
  if (terms.length === 0) return [];

  return RULE_DOCS.map((doc) => {
    let score = 0;
    for (const term of terms) {
      if (!doc.bag.has(term)) continue;
      // A hit in the title still counts for more — just not enough to let a
      // common word outrank a rare one.
      score += idf(term) * (doc.title.has(term) ? 1.6 : 1);
    }
    return { r: doc.r, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => s.r);
}

export function relevantRules(query: string, k = 6): string {
  return scoreRules(query, k).map((r) => `${ruleLine(r)}: ${r.rule}`).join("\n");
}

/**
 * Retrieval for a message that may hold SEVERAL questions (a photographed page
 * of a paper, say). Scoring the whole blob at once lets the wordiest question
 * crowd the others out — question 1's vocabulary would pull in all six rules and
 * question 2 would be answered with no rule text at all. So: score each question
 * separately and merge.
 */
export function relevantRulesMulti(text: string, perChunk = 3, cap = 10): string {
  // Split on numbered question starts ("14.", "Q3)") or blank lines.
  const chunks = text
    .split(/\n\s*\n|\n(?=\s*(?:Q\s*)?\d{1,3}\s*[.):])/i)
    .map((c) => c.trim())
    .filter((c) => c.length > 8);

  const picked: typeof rules = [];
  const seen = new Set<number>();
  for (const chunk of chunks.length > 1 ? chunks : [text]) {
    for (const r of scoreRules(chunk, perChunk)) {
      if (seen.has(r.id) || picked.length >= cap) continue;
      seen.add(r.id);
      picked.push(r);
    }
  }
  return picked.map((r) => `${ruleLine(r)}: ${r.rule}`).join("\n");
}

// What the AI should know about the exam and the app itself.
export const APP_KB = `About the AFCAT exam (Air Force Common Admission Test, conducted by the Indian Air Force):
- Online CBT, 100 questions, 300 marks, 2 hours. Marking: +3 for correct, −1 for wrong.
- Sections: General Awareness, Verbal Ability in English, Numerical Ability, Reasoning & Military Aptitude.
- English is ~25 of the 100 questions. Every paper has synonyms, antonyms, reading comprehension and a cloze passage; most papers add error detection, fill in the blanks and idioms; some sessions ask spelling and one-word substitution instead. The exam recycles its vocabulary bank across years.
- Held roughly twice a year for Flying and Ground Duty (Technical & Non-Technical) branches.

About this app (called "Grammy" — the student is using it right now):
- Home: overall progress and per-topic readiness (test results blended with AI practice from the last 7 days).
- Learn (feed): the 101 grammar rules as swipeable cards, with Hindi/Hinglish tips, examples with explanations, and an "Ask AI" button (that's you).
- Reels: swipeable idiom reels, plus a Practice mode with AI-generated AFCAT-style MCQs where answers are explained with the rules.
- AI Coach: tracks practice accuracy per topic, analyzes mistakes, and suggests what to study. It also has a Question Solver where the student can type, speak or photograph a question from a paper and get it solved rule-by-rule.
- Study Hub: Concepts (mind-maps), Learn Tenses, Verb Forms (V1/V2/V3), Confusable Words, Idioms & Phrases.
- Quizzes and section tests exist for every rule and topic.`;
