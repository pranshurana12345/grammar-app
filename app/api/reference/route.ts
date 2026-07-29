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
const norm = (s: string) => s.toLowerCase();

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

function searchIdioms(q: string, limit: number) {
  const n = norm(q);
  return IDIOMS
    .filter((i) => norm(i.phrase).includes(n) || norm(i.meaning).includes(n))
    .slice(0, limit)
    .map((i) => ({ phrase: i.phrase, meaning: i.meaning, origin: i.story ?? undefined, group: i.group ?? undefined }));
}

function searchWords(q: string, limit: number) {
  const n = norm(q);
  return VOCAB
    .filter((w) => norm(w.phrase).includes(n) || norm(w.meaning).includes(n)
      || (w.synonyms ?? []).some((s) => norm(s).includes(n))
      || (w.antonyms ?? []).some((s) => norm(s).includes(n)))
    .slice(0, limit)
    .map((w) => ({ word: w.phrase, meaning: w.meaning, synonyms: w.synonyms ?? [], antonyms: w.antonyms ?? [], example: w.example ?? undefined }));
}

function searchExceptions(q: string, limit: number) {
  const n = norm(q);
  const out: unknown[] = [];
  for (const g of EXCEPTION_GROUPS) {
    for (const note of g.notes) {
      const hay = norm([note.title, note.normally, note.trap ?? "",
        ...note.cases.map((c) => `${c.when} ${c.note} ${(c.right ?? []).join(" ")} ${(c.wrong ?? []).join(" ")}`)].join(" "));
      if (!hay.includes(n)) continue;
      out.push({
        group: g.label,
        title: note.title,
        normal_rule: note.normally,
        exceptions: note.cases.map((c) => ({ when: c.when, what_to_do: c.note, correct: c.right ?? [], wrong: c.wrong ?? [] })),
        exam_trap: note.trap ?? undefined,
      });
      if (out.length >= limit) return out;
    }
  }
  return out;
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

    if (want("rules")) body.rules = searchRules(q, limit).map(ruleShape);
    if (want("idioms")) body.idioms = searchIdioms(q, limit);
    if (want("words")) body.words = searchWords(q, limit);
    if (want("exceptions")) body.exceptions = searchExceptions(q, limit);

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
