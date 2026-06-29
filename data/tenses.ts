// ── Learn Tenses: comparison-first study data ────────────────────────────────
// Teaching idea: every tense = TIME (past/present/future) × ASPECT (simple /
// continuous / perfect / perfect continuous). Within an aspect the three times
// share ONE skeleton — only the helping verb changes, while the core form
// (V3 "written", or "-ing") stays fixed. We keep ONE verb (write · wrote ·
// written · writing) across every example so the moving part is obvious.
//
// In example strings:  **bold** = the part that CHANGES across time (helper)
//                      __underline__ = the core that STAYS THE SAME.

export type TimeKey = "past" | "present" | "future";

export const TIMES: { key: TimeKey; label: string; color: string; soft: string; bg: string }[] = [
  { key: "past",    label: "Past",    color: "#b45309", soft: "#fde68a", bg: "#fffbeb" },
  { key: "present", label: "Present", color: "#047857", soft: "#a7f3d0", bg: "#ecfdf5" },
  { key: "future",  label: "Future",  color: "#4f46e5", soft: "#c7d2fe", bg: "#eef2ff" },
];

export const CONSTANT_COLOR = "#059669"; // colour used for the __unchanging__ core

export type TenseEntry = {
  name: string;
  helper: string;   // the changing helper, shown as a chip (e.g. "had", "has / have")
  formula: string;  // compact formula for the cheat-sheet (e.g. "S + had + V3 + O")
  example: string;  // full sentence with **changing** / __constant__ markers
  use: string;      // when to use it
  signals: string;  // signal / time-marker words
};

export type Watch = { wrong: string; right: string; why: string };

export type Aspect = {
  key: string;
  name: string;
  color: string;      // accent for this aspect card
  meaning: string;    // what the aspect expresses
  core: string;       // the constant structure, e.g. "have + V3"
  pattern: string;    // skeleton with the [ helper ] slot
  insight: string;    // one-line "what changes"
  entries: Record<TimeKey, TenseEntry>;
  watch: Watch;       // a correct-vs-wrong trap
};

export const ASPECTS: Aspect[] = [
  {
    key: "simple",
    name: "Simple",
    color: "#2563eb",
    meaning: "A plain fact, a habit, or a single completed action — with no focus on duration or on a link to another event.",
    core: "the main verb changes",
    pattern: "Subject  +  [ verb ]  +  Object",
    insight: "No helping verb — the main verb itself changes form.",
    entries: {
      past:    { name: "Past Simple",    helper: "V2 · wrote",   formula: "S + V2 + O",          example: "She **wrote** the report yesterday.",   use: "A finished action at a definite past time.", signals: "yesterday · ago · last week · in 2020" },
      present: { name: "Present Simple", helper: "V1 · writes",  formula: "S + V1(+s/es) + O",    example: "She **writes** a report every week.",   use: "Habits, routines, and general truths.",      signals: "always · usually · often · every day" },
      future:  { name: "Future Simple",  helper: "will + write", formula: "S + will + V1 + O",    example: "She **will write** the report tomorrow.", use: "A decision, promise, or prediction.",       signals: "tomorrow · soon · next week · later" },
    },
    watch: {
      wrong: "She write a report every week.",
      right: "She writes a report every week.",
      why: "In the present simple, he / she / it needs an -s on the verb.",
    },
  },
  {
    key: "continuous",
    name: "Continuous",
    color: "#7c3aed",
    meaning: "An action in progress — happening around a particular moment and not yet finished.",
    core: "be + V-ing",
    pattern: "Subject  +  [ be ]  +  __writing__  +  Object",
    insight: "Only the “be” helper changes. The “-ing” word never changes.",
    entries: {
      past:    { name: "Past Continuous",    helper: "was / were",   formula: "S + was/were + V-ing + O",   example: "At 8 pm she **was** __writing__ the report.",      use: "In progress at a past moment (often interrupted).", signals: "while · when · at that time · all evening" },
      present: { name: "Present Continuous", helper: "is / am / are", formula: "S + is/am/are + V-ing + O",  example: "She **is** __writing__ the report right now.",      use: "Happening now or around now.",                      signals: "now · right now · at the moment · currently" },
      future:  { name: "Future Continuous",  helper: "will be",      formula: "S + will be + V-ing + O",    example: "At 8 pm she **will be** __writing__ the report.",  use: "Will be in progress at a future moment.",           signals: "at this time tomorrow · all day · still" },
    },
    watch: {
      wrong: "She is knowing the answer.",
      right: "She knows the answer.",
      why: "Stative verbs (know, like, believe, want) are not used in the continuous.",
    },
  },
  {
    key: "perfect",
    name: "Perfect",
    color: "#0d9488",
    meaning: "Connects two times — an action finished before, or whose result reaches up to, another point. Always “have + V3”.",
    core: "have + V3",
    pattern: "Subject  +  [ have ]  +  __written__  +  Object",
    insight: "Only the “have” helper changes: had → has/have → will have. The V3 stays the same.",
    entries: {
      past:    { name: "Past Perfect",    helper: "had",        formula: "S + had + V3 + O",        example: "She **had** __written__ the report before the meeting.", use: "The earlier of two past actions.",                                  signals: "before · after · by the time · already" },
      present: { name: "Present Perfect", helper: "has / have", formula: "S + has/have + V3 + O",    example: "She **has** just __written__ the report.",               use: "A past action with a present result, or an unfinished time period.", signals: "just · already · yet · ever · never · since · for" },
      future:  { name: "Future Perfect",  helper: "will have",  formula: "S + will have + V3 + O",   example: "She **will have** __written__ the report by noon.",      use: "Completed before a future deadline.",                               signals: "by · by then · by the time · before" },
    },
    watch: {
      wrong: "I have finished my work before he came.",
      right: "I had finished my work before he came.",
      why: "With two past actions, the earlier one takes Past Perfect (had), not Present Perfect (have).",
    },
  },
  {
    key: "perfect-continuous",
    name: "Perfect Continuous",
    color: "#dc2626",
    meaning: "Stresses how long an action has been going on up to a point in time. Always “have + been + V-ing”.",
    core: "have + been + V-ing",
    pattern: "Subject  +  [ have ]  +  __been writing__  +  Object",
    insight: "Only the “have” helper changes. “been + -ing” stays the same.",
    entries: {
      past:    { name: "Past Perfect Continuous",    helper: "had",        formula: "S + had been + V-ing + O",       example: "She **had** __been writing__ for two hours when the power went out.", use: "How long something had gone on before a past point.", signals: "for · since · how long" },
      present: { name: "Present Perfect Continuous", helper: "has / have", formula: "S + has/have been + V-ing + O",   example: "She **has** __been writing__ since morning.",                          use: "Started in the past and is still going on.",          signals: "since · for · lately · recently" },
      future:  { name: "Future Perfect Continuous",  helper: "will have",  formula: "S + will have been + V-ing + O",  example: "By 5 pm she **will have** __been writing__ for six hours.",            use: "Duration up to a future point.",                      signals: "for … by · by the time" },
    },
    watch: {
      wrong: "She is writing since morning.",
      right: "She has been writing since morning.",
      why: "“Since / for + duration” needs a perfect continuous, not a simple continuous.",
    },
  },
];
