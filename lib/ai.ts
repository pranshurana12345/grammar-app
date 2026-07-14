// Server-side AI helpers shared by the API routes. (Do NOT import from client code.)
//
// Providers: Groq (primary — fast + generous free tier) with OpenRouter as an
// automatic fallback. Both speak the OpenAI-compatible chat completions API,
// so we use plain fetch — no SDK needed. Keys live in env vars only.
import { rules, SECTIONS } from "@/data/rules";

type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

type Provider = { name: string; url: string; key: string | undefined; model: string };

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// A single attempt must not be allowed to hang: Vercel caps the route at 60s,
// and a stalled upstream used to eat the whole budget before we fell through.
const ATTEMPT_TIMEOUT_MS = 20_000; // whole non-streaming call
const FIRST_TOKEN_TIMEOUT_MS = 12_000; // streaming: give up if it won't start
const TOTAL_BUDGET_MS = 50_000; // leave headroom under maxDuration = 60

// Quality-ordered fallback chain. Groq rate limits are PER MODEL *and* per key,
// so each Groq model is tried on every key (best model first) before falling
// through to the OpenRouter free tier (flakier upstreams, heavier queues).
function providers(): Provider[] {
  const groqKeys = [process.env.GROQ_API_KEY, process.env.GROQ_API_KEY_2].filter(Boolean);
  const openrouter = process.env.OPENROUTER_API_KEY;
  const groqModels = [
    process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    "llama-3.3-70b-versatile",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "qwen/qwen3-32b",
    "openai/gpt-oss-20b",
    "llama-3.1-8b-instant",
  ];
  // NOTE: "openai/gpt-oss-120b:free" was removed — OpenRouter retired the free
  // slug and now 404s it ("unavailable for free"), so it burned a round trip on
  // every single request. nemotron is first because it is the one free model
  // that reliably answers; the rest are frequently rate-limited (429).
  const openrouterModels = [
    process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-super-120b-a12b:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "google/gemma-4-31b-it:free",
    "nousresearch/hermes-3-llama-3.1-405b:free",
  ];
  return [
    ...groqModels.flatMap((model) =>
      groqKeys.map((key) => ({ name: "groq", url: GROQ_URL, key, model })),
    ),
    ...openrouterModels.map((model) => ({ name: "openrouter", url: OPENROUTER_URL, key: openrouter, model })),
  ].filter((p) => !!p.key);
}

function requestBody(
  p: Provider, messages: ChatMsg[],
  opts: { json: boolean; maxTokens: number; temperature: number; stream?: boolean },
) {
  return JSON.stringify({
    model: p.model,
    messages,
    // gpt-oss is a reasoning model — its thinking eats into max_tokens, so
    // give it headroom and keep the reasoning short.
    max_tokens: p.model.includes("gpt-oss") ? opts.maxTokens + 2048 : opts.maxTokens,
    ...(p.name === "groq" && p.model.includes("gpt-oss") ? { reasoning_effort: "low" } : {}),
    // Qwen models on Groq are reasoning models — hide the <think> stream.
    ...(p.name === "groq" && p.model.includes("qwen") ? { reasoning_format: "hidden" } : {}),
    // Several OpenRouter fallbacks (nemotron, qwen3-next) are reasoning models
    // too, and without this their raw chain-of-thought leaks into the reply.
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

async function failure(p: Provider, res: Response): Promise<Error> {
  const text = await res.text().catch(() => "");
  return new Error(`${p.name}/${p.model} ${res.status}: ${text.slice(0, 160).replace(/\s+/g, " ")}`);
}

async function callProvider(
  p: Provider, messages: ChatMsg[],
  opts: { json: boolean; maxTokens: number; temperature: number },
): Promise<string> {
  const res = await fetch(p.url, {
    method: "POST",
    headers: headersFor(p),
    body: requestBody(p, messages, opts),
    signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
  });
  if (!res.ok) throw await failure(p, res);
  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error(`${p.name}/${p.model} returned an empty response`);
  return content;
}

// Try each configured provider in order; return the first success.
export async function aiChat({
  system, messages, json = false, maxTokens = 2000, temperature = 0.7,
}: {
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
  json?: boolean;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const list = providers();
  if (list.length === 0) {
    throw new Error("No AI provider configured (set GROQ_API_KEY or OPENROUTER_API_KEY)");
  }
  const full: ChatMsg[] = [{ role: "system", content: system }, ...messages];
  const errors: string[] = [];
  const deadline = Date.now() + TOTAL_BUDGET_MS;

  for (const p of list) {
    if (Date.now() > deadline) {
      errors.push("out of time before trying " + p.model);
      break;
    }
    const t0 = Date.now();
    try {
      const out = await callProvider(p, full, { json, maxTokens, temperature });
      console.log(`[ai] served by ${p.name}/${p.model} in ${Date.now() - t0}ms`);
      return out;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // Log every failure — these used to be swallowed, which is why a silently
      // degraded chain (and its latency) was invisible in production.
      console.warn(`[ai] FAILED ${p.name}/${p.model} after ${Date.now() - t0}ms: ${msg}`);
      errors.push(msg);
    }
  }
  throw new Error(errors.join(" | "));
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
  messages: { role: "user" | "assistant"; content: string }[];
  maxTokens?: number;
  temperature?: number;
}): Promise<{ model: string; provider: string; stream: AsyncGenerator<string> }> {
  const list = providers();
  if (list.length === 0) {
    throw new Error("No AI provider configured (set GROQ_API_KEY or OPENROUTER_API_KEY)");
  }
  const full: ChatMsg[] = [{ role: "system", content: system }, ...messages];
  const errors: string[] = [];
  const deadline = Date.now() + TOTAL_BUDGET_MS;

  for (const p of list) {
    if (Date.now() > deadline) {
      errors.push("out of time before trying " + p.model);
      break;
    }
    const t0 = Date.now();
    const controller = new AbortController();
    const watchdog = setTimeout(() => controller.abort(), FIRST_TOKEN_TIMEOUT_MS);
    try {
      const res = await fetch(p.url, {
        method: "POST",
        headers: headersFor(p),
        body: requestBody(p, full, { json: false, maxTokens, temperature, stream: true }),
        signal: controller.signal,
      });
      if (!res.ok) throw await failure(p, res);
      if (!res.body) throw new Error(`${p.name}/${p.model} sent no body`);

      // Pull the first delta here so a provider that accepts the connection but
      // never produces a token still falls through to the next one.
      const iterator = parseSSE(res.body);
      const first = await iterator.next();
      clearTimeout(watchdog);
      if (first.done) throw new Error(`${p.name}/${p.model} streamed nothing`);

      console.log(`[ai] streaming from ${p.name}/${p.model}, first token in ${Date.now() - t0}ms`);

      async function* withFirst(): AsyncGenerator<string> {
        yield first.value as string;
        yield* iterator;
      }
      return { model: p.model, provider: p.name, stream: withFirst() };
    } catch (e) {
      clearTimeout(watchdog);
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`[ai] FAILED ${p.name}/${p.model} after ${Date.now() - t0}ms: ${msg}`);
      errors.push(msg);
    }
  }
  throw new Error(errors.join(" | "));
}

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
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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
export const RULE_INDEX = rules
  .map((r) => `Rule ${r.ruleNumber} [${r.section}] — ${r.title}`)
  .join("\n");

// FULL knowledge base: every rule with its complete text. ~20k chars / ~5.5k
// tokens — far too big to send on every chat turn, so /api/ask uses
// relevantRules() below instead and keeps this for offline/batch use.
export const RULE_KB = rules
  .map((r) => `Rule ${r.ruleNumber} [${r.section}] ${r.title}: ${r.rule}`)
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
export function relevantRules(query: string, k = 6): string {
  const terms = tokenize(query);
  if (terms.length === 0) return "";
  const counts = new Map<string, number>();
  for (const t of terms) counts.set(t, (counts.get(t) ?? 0) + 1);

  const scored = rules.map((r) => {
    const haystack = tokenize(`${r.title} ${r.rule} ${r.section}`);
    const bag = new Set(haystack);
    let score = 0;
    for (const [term, n] of counts) {
      if (bag.has(term)) score += n;
      // a term appearing in the TITLE is a much stronger signal than in the body
      if (tokenize(r.title).includes(term)) score += 2 * n;
    }
    return { r, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  return scored
    .map(({ r }) => `Rule ${r.ruleNumber} [${r.section}] ${r.title}: ${r.rule}`)
    .join("\n");
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
- AI Coach: tracks practice accuracy per topic, analyzes mistakes, and suggests what to study.
- Study Hub: Concepts (mind-maps), Learn Tenses, Verb Forms (V1/V2/V3), Confusable Words, Idioms & Phrases.
- Quizzes and section tests exist for every rule and topic.`;
