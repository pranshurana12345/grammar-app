// ── Exam priority ────────────────────────────────────────────────────────────
// Which rules actually earn marks in AFCAT English.
//
// Evidence base: 90 real English questions —
//   • EdCIL Official AFCAT Model Question Paper 1   (referred to as M1)
//   • EdCIL Official AFCAT Model Question Paper 2   (M2)
//   • AFCAT 01 2026, the actual paper of 31 Jan 2026 (ACTUAL)
//
// IMPORTANT — why this is grouped by FAMILY and not by individual rule.
// Only ~23 of those 90 questions test a discrete grammar rule (12 error
// detection + 11 fill-in-the-blank). 23 data points spread across 101 rules
// means MOST rules would show zero hits by arithmetic alone. So "this exact
// rule appeared" is a weak signal, and treating it as a syllabus would be
// wrong — you would study four rules and be blindsided by the fifth.
//
// What IS reliable at this sample size is the TYPE. If the exam tested
// subject-verb concord across an intervening phrase twice, then concord is a
// live area and every concord rule is worth knowing — not just the two that
// happened to appear. That is what a family encodes:
//
//   confirmed → this exact rule was tested; the fragment is quoted below
//   family    → same family as a confirmed hit; the exam asks THIS KIND of
//               thing, so treat it as live even though this rule wasn't seen
//   unseen    → no evidence in 90 questions. NOT "don't learn it" — learn it
//               last. One paper cannot prove a rule will never come.

export type ExamTier = "confirmed" | "family" | "unseen";

export type Evidence = {
  paper: "M1" | "M2" | "ACTUAL";
  q: string;
  fragment: string;
  fix: string;
};

export type ExamFamily = {
  key: string;
  label: string;
  live: boolean;
  ruleIds: number[];
  /** What the exam actually does in this area — the TYPE, not the instance. */
  whatGetsAsked: string;
  /** Hits anywhere in the family that don't pin to one rule (collocations etc). */
  familyEvidence?: Evidence[];
};

/** Direct hits — this exact rule was tested, with the offending fragment. */
export const RULE_EVIDENCE: Record<number, Evidence[]> = {
  15: [
    { paper: "ACTUAL", q: "Q1", fragment: "The chairperson of the ethics committee, as well as several senior advisors, WERE present", fix: "was — 'as well as' does not make the subject plural" },
    { paper: "ACTUAL", q: "Q20", fragment: "An understanding of how competing theoretical paradigms intersect, rather than their individual merits alone, ___ shaped … and ___ decisive", fix: "has / was — 'rather than' is ignored; verb follows 'An understanding'" },
  ],
  19: [
    { paper: "M1", q: "Q6", fragment: "One of my friend came running to me", fix: "one of my friendS — plural noun, singular verb" },
  ],
  40: [
    { paper: "ACTUAL", q: "Q15", fragment: "The supervisor disapproved of the researcher submitting sensitive data", fix: "the researcher'S submitting" },
    { paper: "ACTUAL", q: "Q17", fragment: "objected to the ___ of critical data during peer review", fix: "the researcher's withholding" },
  ],
  49: [
    { paper: "M2", q: "Q8", fragment: "This candidate lacks an experience", fix: "lacks experience — no article before an uncountable noun" },
  ],
  52: [
    { paper: "M2", q: "Q7", fragment: "not able to cope up with the new syllabus", fix: "cope WITH — no 'up'" },
    { paper: "M1", q: "Q7", fragment: "adequate attention has not been focused to this vital area", fix: "focused ON" },
  ],
  90: [
    { paper: "M2", q: "Q4", fragment: "He is trying to earn money for myself and him", fix: "for him and me — a reflexive cannot be the object here" },
  ],
  92: [
    { paper: "M2", q: "Q4", fragment: "for myself and him", fix: "both pronouns must share the same case" },
  ],
  101: [
    { paper: "M1", q: "Q4", fragment: "The ebb and flow of the tides ARE now understood", fix: "IS — two nouns expressing one idea take a singular verb" },
  ],
  102: [
    { paper: "M1", q: "Q5", fragment: "Since his arrival at his native town he is trying to spread education", fix: "he HAS BEEN TRYING — 'since' forces the perfect" },
  ],
  103: [
    { paper: "M2", q: "Q6", fragment: "As soon as I shall reach Mumbai, I shall send you the file", fix: "As soon as I REACH — no future tense inside a time clause" },
  ],
  104: [
    { paper: "ACTUAL", q: "Q15", fragment: "disapproved of the researcher submitting", fix: "the researcher'S submitting — possessive works on NOUNS too, not just pronouns" },
    { paper: "ACTUAL", q: "Q17", fragment: "the ___ of critical data", fix: "the researcher's withholding" },
  ],
  105: [
    { paper: "ACTUAL", q: "Q21", fragment: "When the researcher realised that the data were inconsistent, she revised the analytical framework.", fix: "On realising the inconsistency of the data, she revised … — clause collapses to a phrase" },
    { paper: "ACTUAL", q: "Q7", fragment: "Though the theoretical framework appeared robust, anomalies … necessitated a reassessment", fix: "reduce the subordinate clause; a simple sentence has ONE finite verb" },
  ],
  106: [
    { paper: "ACTUAL", q: "Q12", fragment: "______ the researcher went _____ a _____ review, she deliberately _____ the outdated assumptions aside", fix: "Though / through / thorough / threw" },
  ],
};

export const EXAM_FAMILIES: ExamFamily[] = [
  {
    key: "concord",
    label: "Subject–verb concord",
    live: true,
    ruleIds: [15, 16, 17, 18, 19, 20, 21, 22, 23, 32, 45, 46, 50, 51, 96, 101],
    whatGetsAsked:
      "The exam hides the real subject behind a phrase, then makes the verb agree with the WRONG noun. Highest-yield area in the paper — 4 hits across all three papers, and it also powers the disguised fill-in-the-blank questions. Delete everything between the commas and the answer appears.",
  },
  {
    key: "gerund",
    label: "Gerund & non-finite verbs",
    live: true,
    ruleIds: [38, 39, 40, 41, 42, 104],
    whatGetsAsked:
      "Possessive before an -ing noun. Absent from both model papers, then tested TWICE in the real 2026 paper — the clearest rising trend in the data. Note the real paper used a NOUN (the researcher's submitting), not the pronoun form the notes teach.",
  },
  {
    key: "preposition",
    label: "Verb + preposition collocation",
    live: true,
    ruleIds: [52, 59, 60, 61, 62, 63, 64, 65, 68, 69, 70, 71, 73, 74, 85, 94],
    whatGetsAsked:
      "Which preposition a verb takes, and phrasal verbs. Highest raw count in the data (6 hits) but memorisation-heavy — the exam picks whichever pair it likes, so no rule list can cover it fully. Drill the frequent pairs; don't try to be exhaustive.",
    familyEvidence: [
      { paper: "M1", q: "Q8", fragment: "Fortune continued to smile ___ me", fix: "on" },
      { paper: "M1", q: "Q9", fragment: "gave many examples to ___ the idea in the poem", fix: "bring out" },
      { paper: "M1", q: "Q10", fragment: "Hundreds of workers are ___ a protest", fix: "staging" },
      { paper: "ACTUAL", q: "Q23", fragment: "Managers ___ criticism but decide to ___ training programs", fix: "bristle at / beef up" },
    ],
  },
  {
    key: "tense",
    label: "Tense inside clauses",
    live: true,
    ruleIds: [24, 25, 26, 29, 31, 86, 102, 103],
    whatGetsAsked:
      "A subordinate clause forces the tense of the main verb — 'since' forces the perfect, a time clause forbids the future. Two hits, both in model papers. Cheap to learn, so worth it despite the modest count.",
  },
  {
    key: "pronoun",
    label: "Pronoun case & reflexives",
    live: true,
    ruleIds: [33, 34, 35, 36, 37, 54, 89, 90, 91, 92, 93, 95],
    whatGetsAsked:
      "A reflexive used where an object pronoun belongs, or two joined pronouns in mismatched cases. One hit — thin evidence, but the fix is a single habit: after a preposition, use the objective case.",
  },
  {
    key: "article",
    label: "Articles & countability",
    live: true,
    ruleIds: [47, 48, 49, 53, 56, 57, 58],
    whatGetsAsked:
      "An article stuck in front of an uncountable noun. One hit. The trap is that the noun looks countable in everyday speech (experience, information, advice).",
  },
  {
    key: "confusable",
    label: "Confusable words & homonyms",
    live: true,
    ruleIds: [27, 28, 30, 66, 67, 79, 80, 88, 106],
    whatGetsAsked:
      "Near-identical words separated by one letter or one sound. NEW in the real 2026 paper — a four-blank homonym question the model papers never contained.",
  },
  {
    key: "transformation",
    label: "Sentence transformation",
    live: true,
    ruleIds: [105],
    whatGetsAsked:
      "Complex sentence → simple sentence. Entirely NEW in the real 2026 paper and worth 2 marks there, with nothing equivalent in either model paper. Mechanical once you know it: collapse the subordinate clause into a participial or prepositional phrase.",
  },
  {
    key: "tags",
    label: "Question tags",
    live: false,
    ruleIds: [1, 2, 3, 4, 5, 6, 7],
    whatGetsAsked:
      "Not asked. This is the strongest negative finding in the data — question tags are not a question TYPE in the AFCAT English section at all, in any of the three papers. That is structural, not sample noise, so this is the safest section to deprioritise. Keep it for other exams (SSC does ask it).",
  },
  {
    key: "verbforms",
    label: "Verb forms & tricky pairs",
    live: false,
    ruleIds: [8, 9, 10, 11, 12, 13, 14, 43],
    whatGetsAsked:
      "No hits in 90 questions. Treat with caution rather than dismissal — error detection is the single biggest question type, and a wrong V2/V3 (lie/lay, broadcast, overflown) is a classic way to build one. Low priority, not zero.",
  },
  {
    key: "inversion",
    label: "Inversions",
    live: false,
    ruleIds: [81, 82],
    whatGetsAsked:
      "No hits. 'No sooner … than' and 'Hardly … when' never appeared in any of the three papers.",
  },
  {
    key: "comparison",
    label: "Comparisons",
    live: false,
    ruleIds: [83, 84],
    whatGetsAsked:
      "No hits. Note that 'prefer to' and the -ior words DO stay live — they sit in the preposition family, which is confirmed.",
  },
  {
    key: "misc",
    label: "Drill rules & recaps",
    live: false,
    ruleIds: [0, 44, 55, 72, 75, 76, 77, 78, 87, 97, 98, 99, 100],
    whatGetsAsked:
      "No hits. Redundant-word lists, number+unit forms, seldom-pairs, apostrophes and the recap rules. Learn these last — several are recaps of rules you already know.",
  },
];

const FAMILY_BY_RULE = new Map<number, ExamFamily>();
for (const fam of EXAM_FAMILIES) {
  for (const id of fam.ruleIds) FAMILY_BY_RULE.set(id, fam);
}

export type ExamPriority = {
  tier: ExamTier;
  family: ExamFamily;
  evidence: Evidence[];
};

export function examPriorityFor(ruleId: number): ExamPriority | null {
  const family = FAMILY_BY_RULE.get(ruleId);
  if (!family) return null;
  const evidence = RULE_EVIDENCE[ruleId] ?? [];
  const tier: ExamTier = evidence.length > 0 ? "confirmed" : family.live ? "family" : "unseen";
  return { tier, family, evidence };
}

export const TIER_META: Record<ExamTier, { label: string; short: string; bg: string; border: string; fg: string; icon: string }> = {
  confirmed: { label: "Asked in a real paper", short: "Asked", bg: "#ecfdf5", border: "#6ee7b7", fg: "#047857", icon: "🎯" },
  family:    { label: "This type gets asked",  short: "Live type", bg: "#eff6ff", border: "#93c5fd", fg: "#1d4ed8", icon: "📈" },
  unseen:    { label: "Not seen in 3 papers",  short: "Later", bg: "#f8fafc", border: "#e2e8f0", fg: "#64748b", icon: "🕓" },
};

/** Counts for the summary strip on the Learn/Study screens. */
export function tierCounts(ruleIds: number[]) {
  let confirmed = 0, family = 0, unseen = 0;
  for (const id of ruleIds) {
    const p = examPriorityFor(id);
    if (!p) continue;
    if (p.tier === "confirmed") confirmed++;
    else if (p.tier === "family") family++;
    else unseen++;
  }
  return { confirmed, family, unseen };
}
