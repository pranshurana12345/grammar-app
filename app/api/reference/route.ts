import { searchRules, CORS_HEADERS, corsPreflight, jsonResponse, errorResponse } from "@/lib/ai";
import { triggersFor } from "@/data/triggers";
import { IDIOMS } from "@/data/idioms";
import { VOCAB } from "@/data/vocabulary";
import { EXCEPTION_GROUPS } from "@/data/exceptions";

// ── Public reference API ─────────────────────────────────────────────────────
// The app's study material as data, for an assistant outside the app to ground
// its answers on — a ChatGPT Action, an MCP client, anything that speaks HTTP.
//
// Why this exists: the in-app AI runs on free-tier models with a per-minute
// token ceiling, so long question-and-answer sessions run out of budget and the
// small models hallucinate. Moving the reasoning to whatever model the student
// already pays for, while keeping OUR rulebook as the source of truth, fixes
// both — and this route costs nothing to serve, so there is no limit on it.
//
// No AI is called here. It is a search over data/ and nothing else.

// Query-driven, so it can never be prerendered. The Android build runs with
// `output: "export"`, which refuses a GET handler that isn't static unless it
// is told outright — and there the app talks to the deployed API anyway.
export const dynamic = "force-dynamic";

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const norm = (s: string) => ` ${s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()} `;

// Callers send whole questions — "what does cut no ice mean", "the police has
// arrested him" — not keywords. Matching the entire query as a substring found
// almost nothing, so entries are scored on overlap instead: every significant
// word that appears counts, and an entry whose own name appears in the question
// wins outright.
const SKIP = new Set(["the", "and", "for", "with", "that", "this", "what", "does", "mean", "meaning", "which", "why", "how", "is", "are", "was", "were", "in", "on", "at", "of", "to", "a", "an", "it", "its", "you", "your", "my", "me", "correct", "wrong", "sentence", "word", "use", "used", "here"]);

function queryTerms(q: string): string[] {
  return [...new Set(norm(q).trim().split(" "))].filter((w) => w.length >= 3 && !SKIP.has(w));
}

/** Overlap score, with a large bonus when `name` appears in the question. */
function score(q: string, terms: string[], name: string, text: string): number {
  const hay = norm(`${name} ${text}`);
  let s = terms.reduce((n, t) => n + (hay.includes(` ${t} `) ? 1 : 0), 0);
  const n = norm(name).trim();
  if (n.length >= 4 && norm(q).includes(` ${n} `)) s += 10;
  return s;
}

function topBy<T>(items: T[], limit: number, scorer: (x: T) => number) {
  return items
    .map((x) => ({ x, s: scorer(x) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((r) => r.x);
}

function ruleShape(r: ReturnType<typeof searchRules>[number]) {
  return {
    id: r.id,
    rule_number: r.ruleNumber,
    section: r.section,
    title: r.title,
    rule: r.rule,
    trigger_words: triggersFor(r.id),
    correct_examples: r.correct?.slice(0, 4) ?? [],
    wrong_examples: r.wrong?.slice(0, 4) ?? [],
    hinglish_tip: r.hinglishTip ?? undefined,
    app_link: `https://grammar-app-pink.vercel.app/feed?rule=${r.id}`,
  };
}

function searchIdioms(q: string, terms: string[], limit: number) {
  return topBy(IDIOMS, limit, (i) => score(q, terms, i.phrase, i.meaning))
    .map((i) => ({ phrase: i.phrase, meaning: i.meaning, origin: i.story ?? undefined, group: i.group ?? undefined }));
}

function searchWords(q: string, terms: string[], limit: number) {
  return topBy(VOCAB, limit, (w) =>
    score(q, terms, w.phrase, `${w.meaning} ${(w.synonyms ?? []).join(" ")} ${(w.antonyms ?? []).join(" ")}`))
    .map((w) => ({ word: w.phrase, meaning: w.meaning, synonyms: w.synonyms ?? [], antonyms: w.antonyms ?? [], example: w.example ?? undefined }));
}

function searchExceptions(q: string, terms: string[], limit: number) {
  const notes = EXCEPTION_GROUPS.flatMap((g) => g.notes.map((note) => ({ g, note })));
  return topBy(notes, limit, ({ note }) =>
    score(q, terms, note.title, [note.normally, note.trap ?? "",
      ...note.cases.map((c) => `${c.when} ${c.note} ${(c.right ?? []).join(" ")} ${(c.wrong ?? []).join(" ")}`)].join(" ")))
    .map(({ g, note }) => ({
      group: g.label,
      title: note.title,
      normal_rule: note.normally,
      exceptions: note.cases.map((c) => ({ when: c.when, what_to_do: c.note, correct: c.right ?? [], wrong: c.wrong ?? [] })),
      exam_trap: note.trap ?? undefined,
    }));
}

export async function OPTIONS() { return corsPreflight(); }

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").trim().slice(0, 400);
    const kind = (url.searchParams.get("kind") ?? "all").toLowerCase();
    const limit = clamp(Number(url.searchParams.get("limit")) || 5, 1, 10);

    if (!q) {
      return jsonResponse({ error: "Pass ?q= with the sentence, word or grammar point you are asking about." }, 400);
    }

    const want = (k: string) => kind === "all" || kind === k;
    const body: Record<string, unknown> = {
      query: q,
      source: "Grammy — AFCAT English (grammar-app-pink.vercel.app)",
    };

    const terms = queryTerms(q);
    if (want("rules")) body.rules = searchRules(q, limit).map(ruleShape);
    if (want("idioms")) body.idioms = searchIdioms(q, terms, limit);
    if (want("words")) body.words = searchWords(q, terms, limit);
    if (want("exceptions")) body.exceptions = searchExceptions(q, terms, limit);

    return new Response(JSON.stringify(body), {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
        // Same question from the same student twice shouldn't re-run the search.
        "Cache-Control": "public, max-age=300, s-maxage=3600",
      },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
