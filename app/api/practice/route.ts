import {
  aiChat, extractJSON, ruleIndexSample, SECTION_NAMES,
  corsPreflight, jsonResponse, errorResponse,
} from "@/lib/ai";
import { rules } from "@/data/rules";
import { QUIZ_BANK } from "@/data/questions";

export const maxDuration = 60;

export type PracticeQuestion = {
  id: string;
  category: string;
  section: string;
  question: string;
  options: { text: string; why: string }[];
  correctIndex: number;
  rule: string;
  explanation: string;
};

const CATEGORIES = [
  "Error Spotting",
  "Fill in the Blank",
  "Sentence Improvement",
  "Synonym",
  "Antonym",
  "Idiom/Phrase",
  "One-Word Substitution",
  "Spelling",
];

// The AFCAT exam demonstrably recycles its word bank. This list is the app's
// vocabulary data: real previous-year words plus predicted words from the same
// clusters the exam draws on. Single source of truth: data/vocabulary.ts.
//
// We send a ROTATING SAMPLE rather than all 118 words: the whole bank costs
// ~320 tokens of a budget that has to fit under an 8k/minute ceiling, and a
// different slice each batch gives better variety anyway.
import { VOCAB } from "@/data/vocabulary";
function wordBankSample(n = 40, seed = Date.now()): string {
  const start = Math.abs(seed) % VOCAB.length;
  return Array.from({ length: Math.min(n, VOCAB.length) }, (_, i) => VOCAB[(start + i) % VOCAB.length].phrase.toLowerCase())
    .join(", ");
}

const SYSTEM_TEMPLATE = `You are an AFCAT (Air Force Common Admission Test) English question setter. You write original MCQs indistinguishable in style and difficulty from real AFCAT papers. You have studied the actual papers (2015–2020) and follow their exact patterns.

Question categories (use these exact strings): ${CATEGORIES.join(" | ")}
App topics for the "section" field (use these exact strings): ${SECTION_NAMES.join(" | ")}

AUTHENTIC AFCAT FORMAT RULES (follow strictly):
- Stems are SHORT, like the real exam. Synonym: "Choose the word similar in meaning to: AFFLUENT". Antonym: "Choose the word opposite in meaning to: MITIGATE". Options are single common words.
- ANTONYM trap (the exam's signature): 2–3 of the wrong options should be SYNONYMS of the headword (e.g. antonym of "Cajole": persuade / wheedle / coax / bully → bully is correct).
- SYNONYM distractors: include one antonym of the word, one sound-alike or spelling look-alike (cantankerous→cancerous style), one unrelated word.
- The headword may be hard, but options must be easier, common words (recognition, not production).
- Draw roughly half of your synonym/antonym headwords from this real AFCAT word bank (the exam recycles it): {{WORD_BANK}}.
- IDIOM questions use both real formats: standalone ("What is the meaning of the idiom 'At daggers drawn'?") or a one-line sentence with the idiom in quotes. Always include one LITERAL-reading distractor (e.g. "rain cats and dogs" → "cats and dogs fight").
- ERROR SPOTTING uses the real paper format: one sentence split as (a) part one (b) part two (c) part three, and option (d) is "No error". Options a–c contain each part's text; option d is exactly "No error". Test the classic points: subject–verb agreement (each of + singular verb, many a + singular), tense with time markers, pronoun case ("Mohan and me"), redundant prepositions ("discussed about"), articles, question tags, who vs which. Occasionally make (d) "No error" the correct answer.
- FILL IN THE BLANK: one everyday sentence of 12–25 words, blank shown as "........."; distractors fail on collocation or preposition (possessed/punished/fined vs "confiscated"). Sometimes use a DOUBLE blank where each option is a word pair and only one pair fits both.
- SENTENCE IMPROVEMENT: a sentence with a phrase in quotes; options are replacements, one option may be "No improvement".
- ONE-WORD SUBSTITUTION: definition phrase → word; all 4 options from the SAME family (e.g. bureaucracy/oligarchy/aristocracy/plutocracy; somnambulist/somniloquist; fratricide/patricide/regicide/homicide; panacea, sinecure, stowaway, windfall, teetotaller, bibliophile, misanthrope).
- SPELLING: "Find the wrongly spelt word." — 4 words, exactly one misspelt by mutating ONE feature: dropped/doubled consonant (comittee, satelite, handicaped), ie/ei swap (decieve, seige), or wrong unstressed vowel (temparament, recomend).
- Use Indian names and settings in sentences (Ramesh, Sneha, Major Batra, Delhi, the cantonment…).
- Difficulty: moderate SSC/CDS tier overall; at most 1 hard question per batch.

FIELD RULES:
- Exactly 4 options, exactly one correct.
- "why": one short sentence per option — why right, or exactly why wrong.
- "rule": the grammar rule tested — cite the app's rule by its exact name from the list below whenever one applies; for vocab/idiom/spelling questions give the word with its meaning instead.
- "explanation": 2–3 sentences reasoning from the rule, like the book's answer keys ("'Each of' takes a singular verb, so…").
- "section": map the question to the app topic it belongs to (vocab/spelling → "Vocabulary", idioms → "Idioms & Phrases").
- Vary categories within a batch (at most 2 of the same). Never repeat or paraphrase anything in the exclusion list.

Respond with JSON only, exactly this shape:
{"questions":[{"category":"...","section":"...","question":"...","options":[{"text":"...","why":"..."},{"text":"...","why":"..."},{"text":"...","why":"..."},{"text":"...","why":"..."}],"correctIndex":0,"rule":"...","explanation":"..."}]}

Rules from the app you may cite by name when one applies (if none fits, describe the point tested in a few words):
{{RULE_INDEX}}`;

// Built per request so the word bank and rule slice rotate — and so the prompt
// stays inside the free tier's per-minute token ceiling.
function systemPrompt(): string {
  const seed = Date.now();
  return SYSTEM_TEMPLATE
    .replace("{{WORD_BANK}}", wordBankSample(40, seed))
    .replace("{{RULE_INDEX}}", ruleIndexSample(30, seed));
}

// ── Offline safety net ──────────────────────────────────────────────────────
// Every provider can be rate-limited at once (free tiers, shared org budget).
// When that happens the reel used to die with an error; instead we serve real
// questions from the app's own quiz bank so practice always works.
function bankQuestions(count: number, exclude: Set<string>): PracticeQuestion[] {
  const byRule = new Map(rules.map((r) => [r.id, r]));
  const pool = QUIZ_BANK.flatMap((entry) => {
    const rule = byRule.get(entry.ruleId);
    if (!rule) return [];
    return entry.questions.map((q) => ({ q, rule }));
  }).filter(({ q }) => !exclude.has(normalize(q.q)));

  // Shuffle so repeated fallbacks don't serve the same questions in order.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count).map(({ q, rule }, i) => ({
    id: `bank-${Date.now()}-${i}`,
    category: "Rule Practice",
    section: rule.section,
    question: q.q,
    options: q.options.map((text, oi) => ({
      text,
      why: oi === q.answer
        ? `Correct — this is what "${rule.title}" requires.`
        : "Doesn't follow the rule being tested here.",
    })),
    correctIndex: q.answer,
    rule: `Rule ${rule.ruleNumber} — ${rule.title}`,
    explanation: rule.rule,
  }));
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 100);

export async function OPTIONS() { return corsPreflight(); }

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const count = Math.min(Math.max(Number(body.count) || 5, 1), 8);
    // Only the most recent stems, shortened. The client dedupes again on
    // receipt, so a long exclusion list buys little and costs a lot: 100 stems
    // was ~1.2k tokens out of a per-minute ceiling as low as 6k.
    const exclude: string[] = (Array.isArray(body.exclude) ? body.exclude : [])
      .filter((s: unknown): s is string => typeof s === "string")
      .slice(-24)
      .map((s: string) => s.slice(0, 70));
    const focus: string = typeof body.focus === "string" ? body.focus.slice(0, 200) : "";

    const parts = [
      `Write ${count} fresh AFCAT English MCQs as JSON.`,
      focus
        ? `The student is weak in: ${focus}. Most questions should test these topics.`
        : "Mix the categories — at most 2 questions of the same category.",
      exclude.length
        ? `Do NOT reuse or closely paraphrase any of these already-asked questions:\n${exclude.map((s) => `- ${s}`).join("\n")}`
        : "",
    ].filter(Boolean);

    let questions: PracticeQuestion[] = [];
    try {
      const raw = await aiChat({
        system: systemPrompt(),
        messages: [{ role: "user", content: parts.join("\n\n") }],
        json: true,
        // ~300 tokens per question (4 options, each with a "why", plus the
        // explanation). Asking for a flat 4000 was what made every model reject
        // the request outright as "too large" for its per-minute ceiling.
        maxTokens: Math.min(count * 300 + 200, 2600),
        temperature: 0.9, // variety across batches
      });

      const parsed = extractJSON<{ questions: Omit<PracticeQuestion, "id">[] }>(raw);
      questions = (parsed.questions || [])
        .filter((q) =>
          q && typeof q.question === "string" &&
          Array.isArray(q.options) && q.options.length === 4 &&
          q.options.every((o) => o && typeof o.text === "string") &&
          Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex <= 3)
        .map((q, i) => ({
          ...q,
          section: SECTION_NAMES.includes(q.section) ? q.section : "Miscellaneous",
          id: `${Date.now()}-${i}`,
        }));
      if (questions.length === 0) throw new Error("AI returned no usable questions");
    } catch (aiErr) {
      // Don't fail the reel — fall back to the app's own question bank.
      console.warn("[practice] AI unavailable, serving bank questions:", aiErr);
      questions = bankQuestions(count, new Set(exclude.map(normalize)));
      if (questions.length === 0) throw aiErr;
      return jsonResponse({ questions, source: "bank" });
    }

    return jsonResponse({ questions, source: "ai" });
  } catch (err) {
    return errorResponse(err);
  }
}
