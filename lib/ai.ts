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

// Quality-ordered fallback chain using EVERY suitable text model across the
// configured keys. Groq rate limits are PER MODEL *and* per key, so each Groq
// model is tried on every key (best model first) before falling through to
// the OpenRouter free tier (account-level quota, flakier upstreams).
function providers(): Provider[] {
  const groqKeys = [process.env.GROQ_API_KEY, process.env.GROQ_API_KEY_2].filter(Boolean);
  const openrouter = process.env.OPENROUTER_API_KEY;
  const groqModels = [
    process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    "llama-3.3-70b-versatile",
    "qwen/qwen3.6-27b",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "qwen/qwen3-32b",
    "openai/gpt-oss-20b",
    "llama-3.1-8b-instant",
  ];
  const openrouterModels = [
    process.env.OPENROUTER_MODEL || "openai/gpt-oss-120b:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
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

async function callProvider(
  p: Provider, messages: ChatMsg[],
  opts: { json: boolean; maxTokens: number; temperature: number },
): Promise<string> {
  const res = await fetch(p.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${p.key}`,
      ...(p.name === "openrouter"
        ? { "HTTP-Referer": "https://grammar-app-pink.vercel.app", "X-Title": "Grammy" }
        : {}),
    },
    body: JSON.stringify({
      model: p.model,
      messages,
      // gpt-oss is a reasoning model — its thinking eats into max_tokens, so
      // give it headroom and keep the reasoning short.
      max_tokens: p.model.includes("gpt-oss") ? opts.maxTokens + 2048 : opts.maxTokens,
      ...(p.name === "groq" && p.model.includes("gpt-oss") ? { reasoning_effort: "low" } : {}),
      // Qwen models on Groq are reasoning models — hide the <think> stream.
      ...(p.name === "groq" && p.model.includes("qwen") ? { reasoning_format: "hidden" } : {}),
      temperature: opts.temperature,
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${p.name} ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error(`${p.name} returned an empty response`);
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
  for (const p of list) {
    try {
      return await callProvider(p, full, { json, maxTokens, temperature });
    } catch (e) {
      errors.push(e instanceof Error ? e.message : String(e));
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

// FULL knowledge base: every rule with its complete text, so the tutor can
// answer anything about the 101 rules exactly as the app teaches them.
export const RULE_KB = rules
  .map((r) => `Rule ${r.ruleNumber} [${r.section}] ${r.title}: ${r.rule}`)
  .join("\n");

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
