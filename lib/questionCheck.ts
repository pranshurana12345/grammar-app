// Shared answer-key sanity checks for MCQ questions.
//
// Used by:
//   • scripts/validate-questions.mjs — build-time guard over the static QUIZ_BANK
//     (runs in `prebuild`, so a broken key fails `next build` before it can deploy).
//   • app/api/practice/route.ts — drops malformed AI-generated questions at runtime.
//
// Kept import-free on purpose so the Node build script can import this .ts file
// directly (Node strips the types), and so there is ONE definition of "what a
// valid answer key looks like" instead of two that can drift apart.

// Editorial "working notes" that must never reach a student. These are the tell of
// a hand-authored key gone wrong (a ✓/❌ next to an option, or a parenthetical hint
// like "(correct full form)" / "(wrong V3)"). If any option contains one, either the
// answer was given away or — worse — the integer key points at the wrong option.
export const ANSWER_MARKUP = /[✓✔✅❌❎✗🗴]|\((?:correct|right|wrong|ans(?:wer)?|full form)\b/i;

type OptionLike = string | { text?: unknown } | null | undefined;

export type CheckableQuestion = {
  options: OptionLike[];
  answer: number; // index of the correct option
};

function optionText(o: OptionLike): string {
  if (typeof o === "string") return o;
  if (o && typeof o === "object" && typeof o.text === "string") return o.text;
  return "";
}

// ── Topic classification ─────────────────────────────────────────────────────
// Used by the "Grammar only" reel toggle and the practice API. A question is
// "grammar" unless it's a vocabulary or idiom question. We key off BOTH the
// category and the app "section" the practice API assigns (vocab/spelling →
// "Vocabulary", idioms → "Idioms & Phrases"), so a mislabel on either field
// can't leak a non-grammar question into Grammar-only mode.
export const NON_GRAMMAR_CATEGORIES = [
  "Synonym", "Antonym", "Idiom/Phrase", "One-Word Substitution", "Spelling",
];
export const NON_GRAMMAR_SECTIONS = ["Vocabulary", "Idioms & Phrases"];

export function isGrammarQuestion(q: { category?: string; section?: string }): boolean {
  return !NON_GRAMMAR_CATEGORIES.includes(q.category ?? "") &&
    !NON_GRAMMAR_SECTIONS.includes(q.section ?? "");
}

// Returns a list of human-readable problems. Empty array = the key is well-formed.
export function questionProblems(q: CheckableQuestion): string[] {
  const problems: string[] = [];
  const opts = Array.isArray(q.options) ? q.options : [];

  if (opts.length !== 4) problems.push(`must have exactly 4 options (has ${opts.length})`);

  const texts = opts.map(optionText);
  texts.forEach((t, i) => {
    if (!t.trim()) problems.push(`option ${i} is empty`);
    if (ANSWER_MARKUP.test(t)) problems.push(`option ${i} leaks answer markup: "${t.trim()}"`);
  });

  const seen = new Map<string, number>();
  texts.forEach((t, i) => {
    const k = t.trim().toLowerCase();
    if (!k) return;
    if (seen.has(k)) problems.push(`option ${i} duplicates option ${seen.get(k)}: "${t.trim()}"`);
    else seen.set(k, i);
  });

  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= opts.length)
    problems.push(`answer index ${q.answer} is out of range for ${opts.length} options`);

  return problems;
}
