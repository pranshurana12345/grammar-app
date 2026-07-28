// ── Offline question generator ───────────────────────────────────────────────
// What the practice reel serves when every AI provider is rate-limited at once,
// which on free tiers is a normal weekday evening, not an emergency.
//
// It used to serve the static QUIZ_BANK straight, which is a set of rule drills
// written to check that you remember a rule's wording ("LEST already carries a
// ___ meaning", "Collective nouns take ___ when acting as individuals"). Fine
// for revising a rule card; nothing like an AFCAT paper.
//
// The app now holds enough structured content to BUILD exam-shaped questions
// with keys that are correct by construction: 118 words with meanings, synonyms
// and antonyms, 400 idioms with meanings and origins, ~48 one-word items with
// their same-family distractors, and 16 spelling sets with authored
// misspellings. That is ~700 distinct questions — more than the AI path serves
// in a week — so the fallback stops being the moment practice gets worse.

import { IDIOMS, type Idiom } from "@/data/idioms";
import { VOCAB } from "@/data/vocabulary";
import { ONE_WORD_ITEMS, SPELLING_SETS } from "@/data/practicePool";
import { sameFamily } from "@/lib/optionQuality";
import { rules } from "@/data/rules";
import { QUIZ_BANK } from "@/data/questions";

export type OfflineQuestion = {
  id: string;
  category: string;
  section: string;
  question: string;
  options: { text: string; why: string }[];
  correctIndex: number;
  rule: string;
  explanation: string;
};

const rand = () => Math.random().toString(36).slice(2, 7);
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 100);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Places the correct option somewhere random and reports where it landed. */
function place(correct: { text: string; why: string }, wrong: { text: string; why: string }[]) {
  const options = shuffle([correct, ...wrong]);
  return { options, correctIndex: options.indexOf(correct) };
}

// Two words count as "far apart" when their meanings share no significant word.
// Crude, but it stops "improve" turning up as a distractor for AMELIORATE.
const STOP = new Set(["a", "an", "the", "to", "of", "or", "and", "in", "on", "for", "with", "something", "someone", "person", "who", "that", "very", "being", "make", "made"]);
const contentWords = (s: string) =>
  new Set(s.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w)));

function unrelated(a: string, b: string): boolean {
  const wa = contentWords(a);
  for (const w of contentWords(b)) if (wa.has(w)) return false;
  return true;
}

/**
 * Part of speech, read off the way data/vocabulary.ts writes its meanings:
 * verbs are glossed "To make something clear", nouns "A person who…". Options
 * of mixed word class give the game away — "PERNICIOUS → beneficial / thrift /
 * ruinous / injurious" tells you to ignore the noun before you've thought.
 */
function posOf(meaning: string): "verb" | "noun" | "adj" {
  const m = meaning.trim().toLowerCase();
  if (m.startsWith("to ")) return "verb";
  if (/^(a|an|the)\s/.test(m) && !/^(a|an)\s+(little|very|great deal)/.test(m)) return "noun";
  // Glosses that open with the noun itself — "Mockery; being laughed at…".
  if (/^\w+(ery|ness|ity|ty|ism|tion|sion|ment|ance|ence|ure|hood|ship)\b/.test(m)) return "noun";
  return "adj";
}

// ── Vocabulary ───────────────────────────────────────────────────────────────

function synonymQuestion(w: typeof VOCAB[number]): OfflineQuestion | null {
  const correct = w.synonyms?.[0];
  if (!correct) return null;
  const opposite = w.antonyms?.[0];

  const pos = posOf(w.meaning);
  const pool = shuffle(VOCAB).filter((o) =>
    o.phrase !== w.phrase && o.synonyms?.[0] &&
    posOf(o.meaning) === pos &&
    unrelated(o.meaning, w.meaning) &&
    !w.synonyms?.includes(o.synonyms[0]) &&
    // …and not arguable against the answer itself.
    !sameFamily(o.synonyms[0], correct));
  const fillers = pool.slice(0, opposite ? 2 : 3).map((o) => ({
    text: cap(o.synonyms![0]),
    why: `Means "${o.meaning.replace(/\.$/, "").toLowerCase()}" — a different idea altogether.`,
  }));
  if (fillers.length < (opposite ? 2 : 3)) return null;

  const wrong = opposite
    ? [{ text: cap(opposite), why: `This is the opposite of ${w.phrase.toLowerCase()}, not a synonym.` }, ...fillers]
    : fillers;

  const { options, correctIndex } = place(
    { text: cap(correct), why: `Correct — ${w.phrase.toLowerCase()} means "${w.meaning.replace(/\.$/, "").toLowerCase()}".` },
    wrong,
  );
  return {
    id: `off-syn-${rand()}`,
    category: "Synonym",
    section: "Vocabulary",
    question: `Choose the word similar in meaning to: ${w.phrase.toUpperCase()}`,
    options, correctIndex,
    rule: `${w.phrase} — ${w.meaning}`,
    explanation: `${w.phrase} means ${w.meaning.replace(/\.$/, "").toLowerCase()}${w.synonyms?.length ? ` (${w.synonyms.join(", ")})` : ""}. ${w.example ?? ""}`.trim(),
  };
}

function antonymQuestion(w: typeof VOCAB[number]): OfflineQuestion | null {
  const correct = w.antonyms?.[0];
  const traps = w.synonyms ?? [];
  if (!correct || traps.length < 2) return null;

  // The exam's signature: the wrong options are all synonyms of the headword,
  // so anyone reading in a hurry picks one of them.
  const pos = posOf(w.meaning);
  const pool = shuffle(VOCAB).filter((o) =>
    o.phrase !== w.phrase && o.synonyms?.[0] &&
    posOf(o.meaning) === pos && unrelated(o.meaning, w.meaning) &&
    // The filler must not be a second valid opposite: "DEBILITATE → strengthen /
    // weaken / enfeeble / improve" shipped with two defensible answers.
    !sameFamily(o.synonyms[0], correct));
  const third = pool[0]?.synonyms?.[0];
  if (!third) return null;

  const { options, correctIndex } = place(
    { text: cap(correct), why: `Correct — the opposite of ${w.phrase.toLowerCase()} ("${w.meaning.replace(/\.$/, "").toLowerCase()}").` },
    [
      { text: cap(traps[0]), why: `A synonym of ${w.phrase.toLowerCase()} — the trap, not the opposite.` },
      { text: cap(traps[1]), why: `Also close in meaning to ${w.phrase.toLowerCase()}, so it cannot be its opposite.` },
      { text: cap(third), why: `Unrelated to ${w.phrase.toLowerCase()}.` },
    ],
  );
  return {
    id: `off-ant-${rand()}`,
    category: "Antonym",
    section: "Vocabulary",
    question: `Choose the word opposite in meaning to: ${w.phrase.toUpperCase()}`,
    options, correctIndex,
    rule: `${w.phrase} — ${w.meaning}`,
    explanation: `${w.phrase} means ${w.meaning.replace(/\.$/, "").toLowerCase()}, so its opposite is "${correct}". The other options (${traps.join(", ")}) all mean much the same as the headword.`,
  };
}

// ── Idioms ───────────────────────────────────────────────────────────────────

function idiomQuestion(idiom: Idiom): OfflineQuestion | null {
  // Distractors come from OTHER theme groups: data/idioms.ts groups by meaning,
  // so a same-group idiom would be a second defensible answer.
  const others = shuffle(IDIOMS).filter((o) =>
    o.phrase !== idiom.phrase && (!idiom.group || o.group !== idiom.group) &&
    unrelated(o.meaning, idiom.meaning)).slice(0, 3);
  if (others.length < 3) return null;

  const { options, correctIndex } = place(
    { text: cap(idiom.meaning.replace(/\.$/, "")), why: "Correct." },
    others.map((o) => ({
      text: cap(o.meaning.replace(/\.$/, "")),
      why: `That is what "${o.phrase}" means.`,
    })),
  );
  return {
    id: `off-idm-${rand()}`,
    category: "Idiom/Phrase",
    section: "Idioms & Phrases",
    question: `What is the meaning of the idiom "${idiom.phrase}"?`,
    options, correctIndex,
    rule: `${idiom.phrase} — ${idiom.meaning}`,
    explanation: idiom.story ?? idiom.meaning,
  };
}

// ── One-word substitution & spelling ─────────────────────────────────────────

function oneWordQuestion(it: typeof ONE_WORD_ITEMS[number]): OfflineQuestion {
  const { options, correctIndex } = place(
    { text: it.answer, why: `Correct — ${it.def.toLowerCase()}.` },
    it.family.map((f) => ({ text: f, why: `From the same family, but it does not mean "${it.def.toLowerCase()}".` })),
  );
  return {
    id: `off-owd-${rand()}`,
    category: "One-Word Substitution",
    section: "Vocabulary",
    question: it.def,
    options, correctIndex,
    rule: `${it.answer} — ${it.def}`,
    explanation: `${it.answer}: ${it.def.toLowerCase()}. The distractors (${it.family.join(", ")}) come from the same family, which is exactly how the exam sets this question.`,
  };
}

function spellingQuestion(set: typeof SPELLING_SETS[number]): OfflineQuestion {
  const target = set[Math.floor(Math.random() * set.length)];
  const { options, correctIndex } = place(
    { text: target.wrong, why: `Misspelt — the correct spelling is "${target.word}".` },
    set.filter((w) => w !== target).map((w) => ({ text: w.word, why: "Spelt correctly." })),
  );
  return {
    id: `off-spl-${rand()}`,
    category: "Spelling",
    section: "Vocabulary",
    question: "Find the wrongly spelt word.",
    options, correctIndex,
    rule: `Spelling — ${target.word}`,
    explanation: `"${target.wrong}" is wrong; it is spelt "${target.word}". The other three are already correct.`,
  };
}

// ── Grammar, from the app's own quiz bank ────────────────────────────────────
// The bank mixes usage questions ("Walk carefully, lest you ___") with drills on
// the rule's wording ("LEST already carries a ___ meaning"). Only the first kind
// looks like an exam question, so those are served first and the drills are kept
// as a last resort rather than thrown away.

// A drill talks ABOUT grammar; an exam question is a sentence about people and
// things that happens to test it. Jargon alone wasn't enough of a tell — plenty
// of drills are plain English ("'Quite' means ___", "When there is ANY time
// marker, ALWAYS use ___") — so these look for the shape as well.
const DRILL_MARKS = [
  /\b(auxiliary|modal|singular|plural|tense|preposition|pronoun|adjective|adverb|clause|subject|transitive|intransitive|infinitive|gerund|participle|voice|degree|article|sentence)\b/i,
  /\b(is|are) used\b/i,          // "'Even if' is used for ___ situations."
  /\bmeans\b[^.?]*_{2,}/i,       // "'Quite' means ___."
  /\b(takes|pairs with|follows|carries|qualifies|implies|indicates|denotes|agrees with|stands for)\b/i,
  /[A-Z]{3,}/,                   // ANY / ALWAYS / NEVER / LEST / NOUN — editorial emphasis
  /^(which|why|what|how many)\b/i, // "Which is WRONG?", "Why is 'free gift' wrong?"
  /\(.+\)/,                      // parenthetical hints: "(transitive)", "(NOUN form)"
  /\b(correct|wrong|rule)\b/i,
  /^['"‘“]/,           // stem opens by quoting the term it is about
  /\bvs\.?\s/i,                  // "'Little money' vs 'A little money'"
  /\buse\s+_{2,}/i,              // "…, use ___ possessive."
  /_{2,}\s*(case|form|possessive|verb|tag|noun)\b/i,
  /\bV[1-5]\b/,                  // "V3 of 'be' is ___."
];
const looksLikeDrill = (stem: string) => DRILL_MARKS.some((re) => re.test(stem));

function grammarPool(exclude: Set<string>) {
  const byRule = new Map(rules.map((r) => [r.id, r]));
  const all = QUIZ_BANK.flatMap((entry) => {
    const rule = byRule.get(entry.ruleId);
    if (!rule) return [];
    return entry.questions.map((q) => ({ q, rule }));
  }).filter(({ q }) => !exclude.has(norm(q.q)));

  const usage = all.filter(({ q }) => !looksLikeDrill(q.q));
  const drills = all.filter(({ q }) => looksLikeDrill(q.q));
  return [...shuffle(usage), ...shuffle(drills)];
}

function grammarQuestion(entry: { q: { q: string; options: readonly string[]; answer: number }; rule: typeof rules[number] }): OfflineQuestion {
  const { q, rule } = entry;
  const correct = {
    text: q.options[q.answer],
    why: `Correct — this is what "${rule.title}" requires.`,
  };
  const { options, correctIndex } = place(
    correct,
    q.options.filter((_, i) => i !== q.answer).map((text) => ({
      text, why: "Doesn't follow the rule being tested here.",
    })),
  );
  return {
    id: `off-gra-${rand()}`,
    category: q.q.includes("___") ? "Fill in the Blank" : "Rule Practice",
    section: rule.section,
    question: q.q,
    options, correctIndex,
    rule: `${rule.ruleNumber} — ${rule.title}`,
    explanation: rule.rule,
  };
}

// ── The batch ────────────────────────────────────────────────────────────────

// Same weighting as the AI path's blueprint cycle, so a fallback batch feels
// like a normal one rather than a visibly different mode.
const CYCLE = [
  "grammar", "synonym", "grammar", "idiom",
  "antonym", "grammar", "oneword", "synonym",
  "grammar", "idiom", "spelling", "antonym",
];

export function offlineQuestions(
  count: number, opts: { exclude?: Set<string>; grammarOnly?: boolean } = {},
): OfflineQuestion[] {
  const exclude = opts.exclude ?? new Set<string>();
  const grammar = grammarPool(exclude);
  let gi = 0;

  const words = shuffle(VOCAB);
  const idioms = shuffle(IDIOMS).filter((i) => !exclude.has(norm(`What is the meaning of the idiom "${i.phrase}"?`)));
  const oneWords = shuffle(ONE_WORD_ITEMS);
  const spellings = shuffle(SPELLING_SETS);
  let wi = 0, ii = 0, oi = 0, si = 0;

  const kinds = opts.grammarOnly
    ? Array.from({ length: count }, () => "grammar")
    : (() => {
      const start = Math.floor(Math.random() * CYCLE.length);
      return Array.from({ length: count }, (_, k) => CYCLE[(start + k) % CYCLE.length]);
    })();

  const out: OfflineQuestion[] = [];
  const seen = new Set<string>(exclude);

  for (const kind of kinds) {
    let q: OfflineQuestion | null = null;
    // A generator can decline (a word with no antonym, say), so try a few before
    // falling back to grammar rather than returning a short batch.
    for (let attempt = 0; attempt < 6 && !q; attempt++) {
      switch (kind) {
        case "synonym": q = wi < words.length ? synonymQuestion(words[wi++]) : null; break;
        case "antonym": q = wi < words.length ? antonymQuestion(words[wi++]) : null; break;
        case "idiom": q = ii < idioms.length ? idiomQuestion(idioms[ii++]) : null; break;
        case "oneword": q = oi < oneWords.length ? oneWordQuestion(oneWords[oi++]) : null; break;
        case "spelling": q = si < spellings.length ? spellingQuestion(spellings[si++]) : null; break;
        default: q = gi < grammar.length ? grammarQuestion(grammar[gi++]) : null;
      }
    }
    if (!q && gi < grammar.length) q = grammarQuestion(grammar[gi++]);
    if (!q || seen.has(norm(q.question))) continue;
    seen.add(norm(q.question));
    out.push(q);
  }
  return out;
}
