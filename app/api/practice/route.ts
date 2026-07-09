import {
  aiChat, extractJSON, RULE_INDEX, SECTION_NAMES,
  corsPreflight, jsonResponse, errorResponse,
} from "@/lib/ai";

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

// The AFCAT exam demonstrably recycles its word bank — these words were asked
// in real papers (2015–2019). The generator draws on them to stay authentic.
const AFCAT_WORD_BANK = "affluent, pilfer, debacle, parochial, inquisitive, allegiance, abash, altruism, narcissist, elucidate, mitigate, luscious, allure, naive, cajole, sporadic, intrinsic, adroit, vague, exodus, placidity, incandescent, dwindle, thrifty, salubrious, desolate, barren, infamy, intrepid, apprehend, momentous, preposterous, dissemble, raucous, abrogate, luxuriant, cantankerous, onus, derision, nebulous, debilitate, anathema, penchant, genesis, intransigent, intimidate, mutinous, foe, insipid, hasten, forthright, fallible, beguile, ameliorate, feckless, cacophonous, evanescent, devious, refractory, insolent, acrimonious, sceptic, clemency, malevolent, spurious, pernicious, benign, astute, frugality, audacity, taciturn, fickle";

const SYSTEM = `You are an AFCAT (Air Force Common Admission Test) English question setter. You write original MCQs indistinguishable in style and difficulty from real AFCAT papers. You have studied the actual papers (2015–2020) and follow their exact patterns.

Question categories (use these exact strings): ${CATEGORIES.join(" | ")}
App topics for the "section" field (use these exact strings): ${SECTION_NAMES.join(" | ")}

AUTHENTIC AFCAT FORMAT RULES (follow strictly):
- Stems are SHORT, like the real exam. Synonym: "Choose the word similar in meaning to: AFFLUENT". Antonym: "Choose the word opposite in meaning to: MITIGATE". Options are single common words.
- ANTONYM trap (the exam's signature): 2–3 of the wrong options should be SYNONYMS of the headword (e.g. antonym of "Cajole": persuade / wheedle / coax / bully → bully is correct).
- SYNONYM distractors: include one antonym of the word, one sound-alike or spelling look-alike (cantankerous→cancerous style), one unrelated word.
- The headword may be hard, but options must be easier, common words (recognition, not production).
- Draw roughly half of your synonym/antonym headwords from this real AFCAT word bank (the exam recycles it): ${AFCAT_WORD_BANK}.
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

The app's rule list (cite these names when applicable):
${RULE_INDEX}`;

export async function OPTIONS() { return corsPreflight(); }

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const count = Math.min(Math.max(Number(body.count) || 5, 1), 8);
    const exclude: string[] = Array.isArray(body.exclude) ? body.exclude.slice(-100) : [];
    const focus: string = typeof body.focus === "string" ? body.focus : "";

    const parts = [
      `Write ${count} fresh AFCAT English MCQs as JSON.`,
      focus
        ? `The student is weak in: ${focus}. Most questions should test these topics.`
        : "Mix the categories — at most 2 questions of the same category.",
      exclude.length
        ? `Do NOT reuse or closely paraphrase any of these already-asked questions:\n${exclude.map((s) => `- ${s}`).join("\n")}`
        : "",
    ].filter(Boolean);

    const raw = await aiChat({
      system: SYSTEM,
      messages: [{ role: "user", content: parts.join("\n\n") }],
      json: true,
      maxTokens: 4000,
      temperature: 0.9, // variety across batches
    });

    const parsed = extractJSON<{ questions: Omit<PracticeQuestion, "id">[] }>(raw);
    const questions: PracticeQuestion[] = (parsed.questions || [])
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
    return jsonResponse({ questions });
  } catch (err) {
    return errorResponse(err);
  }
}
