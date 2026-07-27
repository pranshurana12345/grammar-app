import {
  aiChat, extractJSON, ruleIndexSample, SECTION_NAMES,
  corsPreflight, jsonResponse, errorResponse,
} from "@/lib/ai";
import { questionProblems, isGrammarQuestion } from "@/lib/questionCheck";
import { offlineQuestions } from "@/lib/practiceOffline";
import {
  buildPlan, planPrompt, followsAssignment, leaksInstructions, leaksBlueprint,
  repeatsHeadword, answerIsInStem, fragmentsMissing, hasFillerOption, type Plan,
} from "@/lib/practicePlan";

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

// NOTE ON EXAMPLES: this prompt deliberately contains NO sample words, idioms,
// sentences or names. It used to, and the models simply reused them — four
// consecutive live batches came back with "at daggers drawn", "discussed
// about", "a person who loves books" and the same three names, because that is
// what the prompt showed them. What each question tests is now dealt by
// lib/practicePlan.ts from the app's own content banks; the model only writes.
const SYSTEM_TEMPLATE = `You are an AFCAT (Air Force Common Admission Test) English question setter. You write original MCQs indistinguishable in style and difficulty from real AFCAT papers.

Question categories (use these exact strings): ${CATEGORIES.join(" | ")}
App topics for the "section" field (use these exact strings): ${SECTION_NAMES.join(" | ")}

THE BLUEPRINT IS BINDING. The user message lists one line per question: its category, the exact grammar point / headword / idiom / words it must test, the structural variant and the difficulty. Write exactly those questions, in that order. Never swap in a different word, idiom or topic of your own, and never merge two lines into one question.

THE BLUEPRINT'S WORDING IS INSTRUCTIONS, NOT CONTENT. A blueprint line names the machinery to test; your question is an ordinary English sentence that happens to test it. Never copy the line's phrasing into a stem or an option — a real exam sentence never contains words like "bare infinitive", "past participle" or "singular verb".

FORMAT OF EACH CATEGORY (structure only — the content comes from the blueprint):
- ERROR SPOTTING: take ONE sentence and cut it into three consecutive fragments. The stem is "(a) frag1 (b) frag2 (c) frag3", the fragments reading as that one sentence when joined in order. Options (a)/(b)/(c) repeat their fragment verbatim, in that order, and the fourth option is exactly "No error". A fragment is never a whole sentence of its own, the stem never shows a corrected version, and an option is never an explanation.
- FILL IN THE BLANK: one natural sentence of 12–25 words containing "........." where the missing word goes. The answer word must NOT appear anywhere in the sentence. Distractors fail on collocation, preposition or shade of meaning — never absurd.
- SENTENCE IMPROVEMENT: the stem is one ordinary sentence with exactly one phrase inside double quotes; the four options are replacements for that phrase alone. The stem must not mention improving, replacing or correcting anything.
- SYNONYM / ANTONYM: the stem is exactly "Choose the word similar in meaning to: HEADWORD" / "Choose the word opposite in meaning to: HEADWORD" and NOTHING else — never add the meaning, a hint or a sentence. Options are single words, all of the same part of speech as the headword, all commoner than it. The headword itself is never one of the options, in any form.
- IDIOM/PHRASE: options are meanings, not other idioms.
- ONE-WORD SUBSTITUTION: the definition phrase is the stem; the options are the four words the blueprint gives, in any order.
- SPELLING: stem is "Find the wrongly spelt word."; options are the four words the blueprint gives, with exactly the one it names misspelt.

EVERY OPTION MUST BE REAL. Never invent a word, never pad with a word from an unrelated subject. All four options must be the same kind of thing — same part of speech, same length of phrase, equally plausible at a glance.

EXACTLY ONE OPTION CAN BE DEFENDED. Before you write "correctIndex", check the other three: if a careful candidate could argue for one of them — a second near-synonym, a paraphrase of the key, a meaning that also fits the sentence — replace it with something that is close but decidedly wrong.

DIFFICULTY — this is a competitive exam, not a school worksheet:
- A "moderate" question must still punish a careless reader: at least one distractor has to be what an under-prepared candidate would pick.
- A "hard" question uses a longer sentence, a less obvious trap, or a fine distinction between two near-right options.
- Never signal the answer in the stem, and never make three options obviously silly.

STYLE: Indian names, places and situations. Use ONLY the names given in the blueprint block for this batch. Vary the situations — service life, college, offices, markets, travel, sport, home.

FIELD RULES:
- Exactly 4 options, exactly one correct. "correctIndex" is 0-based and must point at the correct option; put the correct option in a different position across questions.
- "why": one short sentence per option — why it is right, or exactly why it is wrong.
- "rule": the grammar rule tested — cite the app's rule by its exact name from the list below whenever one applies; for vocab/idiom/spelling questions give the word or idiom with its meaning instead.
- "explanation": 2–3 sentences reasoning from the rule, like a good answer key.
- "section": copy the section the blueprint gives for that question.
- Never repeat or paraphrase anything in the exclusion list.

Respond with JSON only, exactly this shape:
{"questions":[{"category":"...","section":"...","question":"...","options":[{"text":"...","why":"..."},{"text":"...","why":"..."},{"text":"...","why":"..."},{"text":"...","why":"..."}],"correctIndex":0,"rule":"...","explanation":"..."}]}

Rules from the app you may cite by name when one applies (if none fits, describe the point tested in a few words):
{{RULE_INDEX}}`;

// Built per request so the rule slice rotates — and so the prompt stays inside
// the free tier's per-minute token ceiling.
function systemPrompt(): string {
  return SYSTEM_TEMPLATE.replace("{{RULE_INDEX}}", ruleIndexSample(30, Date.now()));
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 100);
const rand = () => Math.random().toString(36).slice(2, 7);

// ── Keeping the batch honest ────────────────────────────────────────────────
// Models label a category loosely ("Idioms & Phrases", "Fill in the blanks"),
// and the Grammar-only toggle filters on that exact string — so snap it back to
// one of ours before anything downstream reads it.
function canonicalCategory(raw: unknown): string {
  const s = String(raw ?? "").toLowerCase();
  const exact = CATEGORIES.find((c) => c.toLowerCase() === s);
  if (exact) return exact;
  if (s.includes("idiom") || s.includes("phrase")) return "Idiom/Phrase";
  if (s.includes("synonym")) return "Synonym";
  if (s.includes("antonym")) return "Antonym";
  if (s.includes("spell")) return "Spelling";
  if (s.includes("one word") || s.includes("one-word") || s.includes("substitut")) return "One-Word Substitution";
  if (s.includes("error")) return "Error Spotting";
  if (s.includes("improve")) return "Sentence Improvement";
  if (s.includes("blank") || s.includes("fill")) return "Fill in the Blank";
  return "Fill in the Blank";
}

/**
 * Drop questions the model invented instead of writing the one it was dealt —
 * a parroted "at daggers drawn" when the blueprint asked for a different idiom
 * is exactly the repetition this whole change exists to kill — and trim any
 * category it over-produced beyond its quota.
 *
 * Both filters are advisory: if applying one would gut the batch, the batch is
 * kept as-is. A slightly off-plan question still beats an empty reel.
 */
function enforcePlan(questions: PracticeQuestion[], plan: Plan): PracticeQuestion[] {
  // Questions are matched back to the plan by category, not by position — the
  // model reorders freely. So a category is only checkable when EVERY question
  // planned under it was dealt fixed content: "Fill in the Blank" comes in a
  // vocabulary flavour (assigned word) and a grammar flavour (assigned point,
  // nothing fixed to look for), and requiring the word of a batch's vocabulary
  // blank threw away its perfectly good grammar blank.
  const expectsFor = new Map<string, string[]>();
  for (const it of plan.items) {
    if (expectsFor.get(it.category)?.length === 0) continue; // already unusable
    if (!it.expect.length) { expectsFor.set(it.category, []); continue; }
    expectsFor.set(it.category, [...(expectsFor.get(it.category) || []), ...it.expect]);
  }

  const drop = (why: string, q: PracticeQuestion) =>
    console.warn(`[practice] dropped (${why}): ${q.question.slice(0, 80)}`);

  // Unconditional: these two are broken questions, not merely off-plan ones, so
  // they go even if it leaves the batch short.
  questions = questions.filter((q) => {
    const whole = `${q.question} ${q.options.map((o) => o.text).join(" ")}`;
    if (leaksInstructions(q.question)) { drop("instruction leak", q); return false; }
    if (leaksBlueprint(whole, plan.points)) { drop("blueprint pasted in", q); return false; }
    const isVocabPair = q.category === "Synonym" || q.category === "Antonym";
    if (isVocabPair && repeatsHeadword(q.question, q.options.map((o) => o.text))) {
      drop("headword among options", q); return false;
    }
    if (isVocabPair && hasFillerOption(q.options.map((o) => o.text))) {
      drop("filler option", q); return false;
    }
    if (q.category === "Fill in the Blank" &&
        answerIsInStem(q.question, q.options[q.correctIndex]?.text ?? "")) {
      drop("answer given away in the stem", q); return false;
    }
    if (q.category === "Error Spotting" &&
        fragmentsMissing(q.question, q.options.map((o) => o.text))) {
      drop("options aren't the stem's fragments", q); return false;
    }
    return true;
  });

  const onPlan = questions.filter((q) =>
    // Match against the options too: for a vocabulary blank the assigned word
    // is deliberately absent from the sentence and sits among the options.
    followsAssignment(
      `${q.question} ${q.options.map((o) => o.text).join(" ")}`,
      expectsFor.get(q.category) || [],
    ));
  const kept = onPlan.length >= Math.max(2, Math.ceil(questions.length / 2))
    ? onPlan : questions;
  if (kept === onPlan) {
    questions.filter((q) => !onPlan.includes(q)).forEach((q) => drop("off blueprint", q));
  }

  const used = new Map<string, number>();
  return kept.filter((q) => {
    const n = (used.get(q.category) || 0) + 1;
    used.set(q.category, n);
    // Unplanned categories are allowed one slot rather than none.
    if (n > (plan.quota.get(q.category) ?? 1)) { drop(`over quota for ${q.category}`, q); return false; }
    return true;
  });
}

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
    const grammarOnly = body.grammarOnly === true;

    // Every question's topic, word or idiom is dealt here, not chosen by the
    // model — see lib/practicePlan.ts for why.
    const plan = buildPlan(count, { grammarOnly, focus });

    const parts = [
      `Write ${count} fresh AFCAT English MCQs as JSON — one per blueprint line, in this order.`,
      `BLUEPRINT:\n${planPrompt(plan)}`,
      `Names to use in this batch (and no others): ${plan.names.join(", ")}. One sentence may be set at ${plan.setting}.`,
      grammarOnly
        ? `GRAMMAR ONLY: never write a Synonym, Antonym, Idiom/Phrase, One-Word Substitution or Spelling question, and never use the "Vocabulary" or "Idioms & Phrases" section.`
        : "",
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
        // Variety now comes from the blueprint, not from sampling noise, so we
        // can trade the old 0.9 for tighter obedience to the format rules —
        // which is what the sloppy stems (missing blanks, options that were
        // explanations rather than sentence fragments) were costing us.
        temperature: 0.7,
      });

      const parsed = extractJSON<{ questions: Omit<PracticeQuestion, "id">[] }>(raw);
      questions = (parsed.questions || [])
        .filter((q) =>
          q && typeof q.question === "string" &&
          Array.isArray(q.options) && q.options.length === 4 &&
          q.options.every((o) => o && typeof o.text === "string") &&
          Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex <= 3 &&
          // Same answer-key sanity checks the build applies to the static bank:
          // drop any AI question that leaks ✓/❌ markup, duplicates an option, etc.
          questionProblems({ options: q.options, answer: q.correctIndex }).length === 0)
        .map((q, i) => ({
          ...q,
          // Models write the gap as "___" or "____" about as often as the
          // "........." the paper uses. Same question either way — normalise it
          // instead of throwing it away.
          question: q.question.replace(/_{2,}/g, "........."),
          category: canonicalCategory(q.category),
          section: SECTION_NAMES.includes(q.section) ? q.section : "Miscellaneous",
          id: `${Date.now()}-${i}-${rand()}`,
        }))
        // Grammar-only mode: drop any vocab/idiom question the model slipped in.
        .filter((q) => !grammarOnly || isGrammarQuestion(q));

      const wellFormed = questions.length;
      questions = enforcePlan(questions, plan);
      // Visible in `vercel logs`: a batch that keeps losing questions means the
      // model is drifting off its blueprint, not that the reel is broken.
      if (questions.length < count) {
        console.warn(`[practice] asked ${count}, model returned ${(parsed.questions || []).length}, well-formed ${wellFormed}, on-plan ${questions.length}`);
      }
      if (questions.length === 0) throw new Error("AI returned no usable questions");
    } catch (aiErr) {
      // Don't fail the reel — build the batch from the app's own content banks
      // instead (lib/practiceOffline.ts). Free-tier providers are all rate-
      // limited at once often enough that this path has to be worth sitting.
      console.warn("[practice] AI unavailable, generating offline questions:", aiErr);
      questions = offlineQuestions(count, {
        exclude: new Set(exclude.map(normalize)),
        grammarOnly,
      });
      if (questions.length === 0) throw aiErr;
      return jsonResponse({ questions, source: "bank" });
    }

    return jsonResponse({ questions, source: "ai" });
  } catch (err) {
    return errorResponse(err);
  }
}
