// ── Practice blueprint ───────────────────────────────────────────────────────
// Deals every question in a batch its own assignment — category, the exact
// grammar point / word / idiom it must test, the structural variant, and the
// difficulty — before the model sees anything.
//
// The model used to pick all of that itself, and small models pick whatever
// their prompt showed them: four consecutive live batches came back with error
// spotting on subject–verb agreement every single time, the blank on
// prepositions every single time, "at daggers drawn" twice, and the same three
// names throughout. Choosing the content here, from the app's own 400 idioms,
// 118 exam words and ~75 grammar points, is what makes two batches differ.

import { IDIOMS } from "@/data/idioms";
import { VOCAB } from "@/data/vocabulary";
import {
  GRAMMAR_POINTS, ONE_WORD_ITEMS, SPELLING_SETS, NAMES, SETTINGS,
  type GrammarPoint,
} from "@/data/practicePool";

export type PlanItem = {
  category: string;
  section: string;
  /** The line handed to the model. */
  line: string;
  /** Content the stem MUST contain if the model actually followed the
   *  assignment — used to drop questions it invented instead. Empty when the
   *  assignment is a grammar point, which has no fixed surface form. */
  expect: string[];
};

export type Plan = {
  items: PlanItem[];
  names: string[];
  setting: string;
  /** How many questions of each category were asked for. */
  quota: Map<string, number>;
  /** The grammar-point wording used in this batch's blueprint. Meta-language,
   *  never legitimate question content — see leaksBlueprint(). */
  points: string[];
};

// AFCAT's own weighting, as a repeating cycle: vocabulary-heavy, with error
// spotting and blanks as the backbone. A random start into the cycle means
// consecutive batches don't open with the same category.
const MIXED_CYCLE = [
  "Error Spotting", "Synonym", "Fill in the Blank", "Idiom/Phrase",
  "Antonym", "Sentence Improvement", "Error Spotting", "One-Word Substitution",
  "Fill in the Blank", "Synonym", "Spelling", "Antonym",
  "Error Spotting", "Idiom/Phrase", "Fill in the Blank", "Sentence Improvement",
];

const GRAMMAR_CYCLE = [
  "Error Spotting", "Fill in the Blank", "Sentence Improvement",
  "Error Spotting", "Sentence Improvement", "Fill in the Blank",
];

/** Successive picks from a pool, starting somewhere random and never repeating
 *  inside one batch. */
function dealer<T>(pool: T[]): () => T {
  let i = Math.floor(Math.random() * pool.length);
  return () => pool[i++ % pool.length];
}

function shuffled<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const upper = (s: string) => s.toUpperCase();
const list = (xs: string[] = []) => xs.join(", ");

/** Grammar points to draw on. When the student is weak in named sections we
 *  bias towards those, but never exclusively — a batch that only ever tests one
 *  section is the problem we are fixing. */
function pointPool(focus: string): GrammarPoint[] {
  if (!focus) return GRAMMAR_POINTS;
  const wanted = GRAMMAR_POINTS.filter((p) =>
    focus.toLowerCase().includes(p.section.toLowerCase()));
  // Weight the weak sections ~2:1 against everything else.
  return wanted.length >= 3 ? [...wanted, ...wanted, ...GRAMMAR_POINTS] : GRAMMAR_POINTS;
}

export function buildPlan(
  count: number, opts: { grammarOnly?: boolean; focus?: string } = {},
): Plan {
  const cycle = opts.grammarOnly ? GRAMMAR_CYCLE : MIXED_CYCLE;
  const start = Math.floor(Math.random() * cycle.length);
  const categories = shuffled(
    Array.from({ length: count }, (_, i) => cycle[(start + i) % cycle.length]),
  );

  const points: string[] = [];
  const dealPoint = dealer(shuffled(pointPool(opts.focus || "")));
  const nextPoint = (): GrammarPoint => {
    const p = dealPoint();
    points.push(p.point);
    return p;
  };
  const nextWord = dealer(VOCAB);
  const nextIdiom = dealer(IDIOMS);
  const nextOneWord = dealer(ONE_WORD_ITEMS);
  const nextSpelling = dealer(SPELLING_SETS);
  const nextSetting = dealer(SETTINGS);

  // Error spotting: rotate which part carries the error, and make "No error"
  // the right answer roughly once every six questions, as the real paper does.
  const errorSlots = shuffled(["(a)", "(b)", "(c)", "(a)", "(b)", "(c)", "NO ERROR"]);
  let errorSlot = 0;

  const quota = new Map<string, number>();
  const items = categories.map((category, i): PlanItem => {
    quota.set(category, (quota.get(category) || 0) + 1);
    // Two questions a batch are pitched hard; the rest sit at real AFCAT level.
    const hard = i % 3 === 1;
    const diff = hard ? "hard" : "moderate";

    switch (category) {
      case "Error Spotting": {
        const p = nextPoint();
        const slot = errorSlots[errorSlot++ % errorSlots.length];
        const where = slot === "NO ERROR"
          ? `the sentence must be fully CORRECT, so option (d) "No error" is the answer — but every part must still look temptingly wrong`
          : `put the single error in part ${slot}`;
        return {
          category, section: p.section, expect: [],
          line: `Error Spotting | tests: ${p.point} | ${where} | ${diff}`,
        };
      }

      case "Sentence Improvement": {
        const p = nextPoint();
        return {
          category, section: p.section, expect: [],
          line: `Sentence Improvement | tests: ${p.point} | ${diff}`,
        };
      }

      case "Fill in the Blank": {
        // Alternate a grammar blank with a vocabulary blank, and ask for a
        // double blank now and then — the real paper does both.
        if (i % 2 === 0) {
          const p = nextPoint();
          const dbl = i % 6 === 0
            ? ' | two gaps in the one sentence, each written as "........."; every option is a pair of words separated by a comma, and only one pair fits both gaps'
            : "";
          return {
            category, section: p.section, expect: [],
            line: `Fill in the Blank | tests: ${p.point}${dbl} | ${diff}`,
          };
        }
        const w = nextWord();
        return {
          category, section: "Vocabulary", expect: [w.phrase],
          line: `Fill in the Blank | the missing word is "${w.phrase.toLowerCase()}" (${w.meaning}) — write a sentence only that word fits; distractors must be near-misses that break collocation or shade of meaning | ${diff}`,
        };
      }

      case "Synonym": {
        const w = nextWord();
        return {
          category, section: "Vocabulary", expect: [w.phrase],
          line: `Synonym | headword: ${upper(w.phrase)} (${w.meaning}) | correct option means ${list(w.synonyms) || "the same thing"} | distractors: one that means the OPPOSITE (${list(w.antonyms) || "…"}), one word that merely looks or sounds like the headword, one unrelated word | all four options must be commoner words than the headword | ${diff}`,
        };
      }

      case "Antonym": {
        const w = nextWord();
        return {
          category, section: "Vocabulary", expect: [w.phrase],
          line: `Antonym | headword: ${upper(w.phrase)} (${w.meaning}) | correct option means ${list(w.antonyms) || "the opposite"} | THE EXAM'S SIGNATURE TRAP: the other three options must all be near-SYNONYMS of the headword (${list(w.synonyms) || "…"}) | ${diff}`,
        };
      }

      case "Idiom/Phrase": {
        const idiom = nextIdiom();
        const inSentence = i % 2 === 1;
        return {
          category, section: "Idioms & Phrases", expect: [idiom.phrase],
          line: `Idiom/Phrase | idiom: "${idiom.phrase}" (means: ${idiom.meaning}) | ${inSentence ? "put the idiom in quotes inside a one-line sentence and ask what it means" : 'ask directly: What is the meaning of the idiom "…"?'} | one distractor must be the LITERAL reading of the words | ${diff}`,
        };
      }

      case "One-Word Substitution": {
        const it = nextOneWord();
        return {
          category, section: "Vocabulary", expect: [it.answer],
          line: `One-Word Substitution | definition: ${it.def} | answer: ${it.answer} | the other three options must be exactly: ${list(it.family)} | ${diff}`,
        };
      }

      case "Spelling": {
        const set = nextSpelling();
        const target = set[Math.floor(Math.random() * set.length)];
        return {
          category, section: "Vocabulary", expect: set.filter((w) => w !== target).slice(0, 2),
          line: `Spelling | "Find the wrongly spelt word." | use these four words: ${list(set)} | misspell ONLY "${target}" — drop or double a consonant, swap ie/ei, or change one unstressed vowel — and it is the answer | the other three must appear spelt exactly as given | ${diff}`,
        };
      }

      default: {
        const p = nextPoint();
        return {
          category, section: p.section, expect: [],
          line: `${category} | tests: ${p.point} | ${diff}`,
        };
      }
    }
  });

  const names = shuffled(NAMES).slice(0, 3);
  return { items, names, setting: nextSetting(), quota, points };
}

/** Renders the blueprint for the prompt. */
export function planPrompt(plan: Plan): string {
  return plan.items
    .map((it, i) => `Q${i + 1}. [section: ${it.section}] ${it.line}`)
    .join("\n");
}

// ── Did the model actually follow its assignment? ────────────────────────────
// Loose on purpose: headwords get inflected (CAJOLE → "cajoles") and idioms get
// conjugated inside a sentence, so we match on a stem prefix of the longest
// word rather than the whole phrase.

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ");

function keyFragments(expected: string): string[] {
  const words = expected.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/)
    .filter((w) => w.length > 3);
  if (!words.length) return [expected.toLowerCase().slice(0, 5)];
  // Longest word first — nouns inflect least.
  const longest = words.sort((a, b) => b.length - a.length)[0];
  return [longest.slice(0, Math.min(5, longest.length))];
}

/** True when the question looks like it used the content it was dealt (or was
 *  dealt none, e.g. a grammar-point question). */
export function followsAssignment(text: string, expect: string[]): boolean {
  if (!expect.length) return true;
  const hay = norm(text);
  return expect.some((e) => keyFragments(e).every((f) => hay.includes(f)));
}

// ── Two failures worth failing loudly on ─────────────────────────────────────

/**
 * The blueprint's shorthand pasted into the question itself. Seen live:
 * "Shalini ___ ___ a BARE infinitive before the deadline." A real exam stem is
 * an ordinary English sentence — it never names the machinery being tested, so
 * grammar jargon in a stem means the model copied its instructions.
 */
const JARGON = /\b(bare infinitive|past participle|present perfect|past perfect|singular verb|plural verb|collective noun|uncountable noun|question tag|reflexive pronoun|object pronoun|subject pronoun|auxiliary verb|gerund|subjunctive|antecedent|correlative|adverbial|comparative degree|superlative degree|blueprint|distractor)\b/i;

export function leaksInstructions(stem: string): boolean {
  return JARGON.test(stem);
}

/**
 * The blunter version of the same failure, seen in the options rather than the
 * stem: 'we "each other" to exchange ideas' with options "each other for two" /
 * "one another for more than two" — the blueprint's own phrasing, pasted.
 * Caught by looking for any four consecutive words of a grammar point in the
 * question. Points are meta-language ("takes a singular verb", "for more than
 * two"), so a four-word match is a paste, not a coincidence.
 *
 * Only the POINT wording is checked — never the assigned idiom, definition or
 * word list, which the question is supposed to reproduce.
 */
export function leaksBlueprint(text: string, points: string[]): boolean {
  const shingles = (s: string, n = 4): string[] => {
    const w = norm(s).trim().split(/\s+/).filter(Boolean);
    return w.length < n ? [] : w.slice(0, w.length - n + 1).map((_, i) => w.slice(i, i + n).join(" "));
  };
  const hay = new Set(shingles(text));
  return points.some((p) => shingles(p).some((sh) => hay.has(sh)));
}

/**
 * The fourth option a model reaches for when it has run out of real distractors:
 * "TIMID → shy / bold / timed / apple". An everyday concrete noun among the
 * options of a vocabulary item is never a real exam distractor — it just tells
 * the student which options to ignore.
 */
const FILLER = new Set([
  "apple", "banana", "orange", "mango", "potato", "table", "chair", "door",
  "window", "house", "car", "bus", "train", "dog", "cat", "cow", "bird",
  "tree", "flower", "river", "mountain", "book", "pen", "pencil", "shoe",
  "shirt", "water", "milk", "bread", "stone", "clock", "phone",
]);

export function hasFillerOption(options: string[]): boolean {
  return options.some((o) => FILLER.has(o.trim().toLowerCase().replace(/[^a-z]/g, "")));
}

/**
 * In error spotting the options ARE the sentence's three fragments, so each one
 * has to be findable in the stem. Seen live: a stem reading "(a) Zoya is more
 * intelligent than (b) any other student in the class (c) with whom she has
 * studied" offered "in Zoya's class" as option (b) — you cannot answer that.
 * Tolerant of one mismatched fragment so a stray comma doesn't bin the question.
 */
export function fragmentsMissing(stem: string, options: string[]): boolean {
  const hay = norm(stem);
  const parts = options.slice(0, 3).map(norm).map((s) => s.trim());
  const found = parts.filter((p) => p.length > 6 && hay.includes(p)).length;
  return found < 2;
}

/**
 * A blank whose answer is sitting in its own sentence — "The ......... of the
 * world is the longest river, the Amazon" with "longest river" as the key.
 * Only meaningful for Fill in the Blank: every other category legitimately
 * repeats stem text in an option.
 */
export function answerIsInStem(stem: string, answer: string): boolean {
  const a = norm(answer).trim();
  return a.length >= 4 && norm(stem).includes(a);
}

/**
 * A synonym/antonym question that offers the headword itself as an option —
 * "…similar in meaning to: NOVICE → Tyro / Veteran / Novice / Novelty", or the
 * same word in another form ("ADROIT → skillful / clumsy / adroitly / brave").
 * Nonsense as an item, and the model reached for it whenever it ran short of a
 * fourth option. Matched on a 5-letter stem so inflections are caught too.
 */
export function repeatsHeadword(stem: string, options: string[]): boolean {
  const letters = (s: string) => s.trim().toLowerCase().replace(/[^a-z]/g, "");
  const head = letters(stem.split(":").pop() || "");
  if (head.length < 3) return false;
  const root = head.slice(0, 5);
  return options.some((o) => {
    const w = letters(o);
    return w === head || (head.length >= 5 && w.startsWith(root));
  });
}
