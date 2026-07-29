// ── Practice question pools ──────────────────────────────────────────────────
// Raw material the AI question setter is ASSIGNED from, one item per question.
//
// Why this file exists: the practice prompt used to describe each category with
// concrete examples ("cajole → persuade/wheedle/coax", "at daggers drawn",
// "discussed about", "a person who loves books"). Small models parrot the
// examples in their prompt, so every batch came back with the same handful of
// questions — same categories in the same order, error spotting always on
// subject–verb agreement, blanks always on prepositions, the same three names.
//
// So the model no longer chooses WHAT to test. The route deals it a blueprint
// from these pools (plus the 400 idioms in data/idioms.ts and the 118 words in
// data/vocabulary.ts) and the model only does the writing.

/** A grammar point a question can be built on, tagged with the app section it
 *  belongs to so practice performance still maps onto Topics. Section strings
 *  must match SECTIONS in data/rules.ts exactly. */
export type GrammarPoint = { section: string; point: string };

export const GRAMMAR_POINTS: GrammarPoint[] = [
  // ── Subject-Verb Agreement ────────────────────────────────────────────────
  { section: "Subject-Verb Agreement", point: "each / every / either / neither as the subject takes a singular verb" },
  { section: "Subject-Verb Agreement", point: "either…or / neither…nor — the verb agrees with the nearer subject" },
  { section: "Subject-Verb Agreement", point: "a collective noun takes a singular verb as one unit, plural when the members act separately" },
  { section: "Subject-Verb Agreement", point: "'one of the' + plural noun + singular verb" },
  { section: "Subject-Verb Agreement", point: "'a number of' takes a plural verb but 'the number of' takes a singular verb" },
  { section: "Subject-Verb Agreement", point: "money, distance or time seen as one quantity takes a singular verb (Ten miles is a long walk)" },
  { section: "Subject-Verb Agreement", point: "nouns plural in form but singular in sense — news, mathematics, physics, innings" },
  { section: "Subject-Verb Agreement", point: "with / along with / as well as / besides — the verb agrees with the first subject only" },
  { section: "Subject-Verb Agreement", point: "'the' + adjective for a class of people takes a plural verb (the poor are)" },

  // ── Tenses ────────────────────────────────────────────────────────────────
  { section: "Tenses", point: "since (point of time) vs for (period), both with the present perfect" },
  { section: "Tenses", point: "no future tense after when / if / until / as soon as — the simple present is used" },
  { section: "Tenses", point: "a finished past-time marker (yesterday, last year, in 1999) forces the simple past, not the present perfect" },
  { section: "Tenses", point: "state verbs — know, believe, belong, contain, resemble — are not used in continuous tenses" },
  { section: "Tenses", point: "the present continuous for a fixed near-future arrangement" },

  // ── Past Perfect ──────────────────────────────────────────────────────────
  { section: "Past Perfect", point: "past perfect for the earlier of two past actions, simple past for the later one" },
  { section: "Past Perfect", point: "No sooner … than / Hardly … when / Scarcely … when, with the past perfect inverted" },
  { section: "Past Perfect", point: "'before / after' with the past perfect — which clause carries 'had'" },

  // ── Verbs ─────────────────────────────────────────────────────────────────
  { section: "Verbs", point: "causative: get / have + object + past participle (had the roof repaired)" },
  { section: "Verbs", point: "make / let / bid / see + object + bare infinitive (no 'to')" },
  { section: "Verbs", point: "'used to' for a past habit vs 'be / get used to' + -ing for being accustomed" },
  { section: "Verbs", point: "lie / lay, rise / raise, sit / set — intransitive vs transitive pairs" },
  { section: "Verbs", point: "active–passive: which object becomes the subject, and 'by' vs 'with'" },

  // ── Modal Verbs ───────────────────────────────────────────────────────────
  { section: "Modal Verbs", point: "'need not have + V3' (it was done needlessly) vs 'did not need to' (it was never done)" },
  { section: "Modal Verbs", point: "should have / would have / could have + V3 for an unreal past" },
  { section: "Modal Verbs", point: "dare and need as modals take a bare infinitive in negatives and questions" },
  { section: "Modal Verbs", point: "must (own conclusion / obligation) vs have to (outside obligation)" },

  // ── Pronouns ──────────────────────────────────────────────────────────────
  { section: "Pronouns", point: "object case after a preposition and after 'let' — between you and me, let him and me" },
  { section: "Pronouns", point: "subject case after forms of 'be' and in comparisons with than / as (taller than I am)" },
  { section: "Pronouns", point: "a reflexive pronoun cannot be the subject or stand in for a personal pronoun" },
  { section: "Pronouns", point: "each other for two people, one another for more than two" },
  { section: "Pronouns", point: "a possessive, not an object pronoun, before a gerund (my going, his being late)" },
  { section: "Pronouns", point: "pronoun–antecedent agreement after everyone / each / anybody / none" },
  { section: "Pronouns", point: "the order of pronouns in a series — second, third, first person (you, he and I)" },

  // ── Articles & Nouns ──────────────────────────────────────────────────────
  { section: "Articles & Nouns", point: "a vs an decided by sound, not spelling (an hour, a university, an M.P., a one-rupee note)" },
  { section: "Articles & Nouns", point: "'the' with superlatives, rivers, ranges, oceans and newspapers" },
  { section: "Articles & Nouns", point: "uncountables take no plural and no 'a' — furniture, information, advice, luggage, scenery, poetry" },
  { section: "Articles & Nouns", point: "nouns used only in the plural — scissors, trousers, spectacles, premises, alms" },
  { section: "Articles & Nouns", point: "no article before a language, a meal or a game (play cricket, have lunch)" },
  { section: "Articles & Nouns", point: "omitting or repeating 'the' before two nouns changes whether one person or two is meant" },

  // ── Prepositions ──────────────────────────────────────────────────────────
  { section: "Prepositions", point: "verbs that take no preposition — discuss, order, describe, resemble, marry, comprise, reach" },
  { section: "Prepositions", point: "fixed pairs — deprived of, refrain from, accused of, charged with, angry with a person / at a thing" },
  { section: "Prepositions", point: "different from, prefer X to Y, prefer to + bare infinitive rather than" },
  { section: "Prepositions", point: "in / on / at for time and for place — narrowing from general to exact" },
  { section: "Prepositions", point: "'in charge of' vs 'in the charge of'; 'on behalf of' vs 'in behalf of'" },
  { section: "Prepositions", point: "between (two) vs among (more than two), and 'between' + object pronouns" },

  // ── Comparisons ───────────────────────────────────────────────────────────
  { section: "Comparisons", point: "-IOR words — senior, junior, superior, inferior, prior — take to, never 'than'" },
  { section: "Comparisons", point: "no double comparative or double superlative (more better, most tallest)" },
  { section: "Comparisons", point: "'than any other + singular noun' inside a group vs 'than any' outside it" },
  { section: "Comparisons", point: "as … as in the positive, so … as preferred in the negative" },
  { section: "Comparisons", point: "compare like with like — the climate of Delhi with that of Shimla" },
  { section: "Comparisons", point: "absolute adjectives — unique, perfect, ideal, circular — take no comparative" },

  // ── Question Tags ─────────────────────────────────────────────────────────
  { section: "Question Tags", point: "positive statement → negative tag and vice versa, repeating the auxiliary and a pronoun subject" },
  { section: "Question Tags", point: "special tags — imperative → will you, Let's → shall we, I am → aren't I" },
  { section: "Question Tags", point: "sentences already negative in sense — hardly, seldom, scarcely, never, no one — take a positive tag" },

  // ── Inversions ────────────────────────────────────────────────────────────
  { section: "Inversions", point: "a negative adverbial in front position inverts subject and auxiliary (Never have I, Seldom does he)" },
  { section: "Inversions", point: "Not only … but also — both halves must be parallel, and 'Not only' at the front inverts" },
  { section: "Inversions", point: "front-placed adverb of place — Here comes the bus, but Here he comes" },

  // ── Non-Finite Verbs ──────────────────────────────────────────────────────
  { section: "Non-Finite Verbs", point: "verbs taking a gerund (avoid, enjoy, mind, suggest, deny, look forward to) vs an infinitive (hope, decide, refuse)" },
  { section: "Non-Finite Verbs", point: "a dangling participle — the opening participle must belong to the subject that follows" },
  { section: "Non-Finite Verbs", point: "had better / would rather / rather than take a bare infinitive" },
  { section: "Non-Finite Verbs", point: "'to' as a preposition takes -ing — accustomed to, averse to, with a view to, addicted to" },

  // ── Special Constructions ─────────────────────────────────────────────────
  { section: "Special Constructions", point: "wish / if only / as if / as though + were, not 'was'" },
  { section: "Special Constructions", point: "It is (high) time + subject + past tense" },
  { section: "Special Constructions", point: "insist / suggest / demand / recommend + that + bare infinitive (subjunctive)" },
  { section: "Special Constructions", point: "conditional types — if + past + would, if + past perfect + would have" },

  // ── Bonus ─────────────────────────────────────────────────────────────────
  { section: "Bonus", point: "LEST is already negative — never 'not' after it, and only should may follow" },

  // ── Superfluous Words ─────────────────────────────────────────────────────
  { section: "Superfluous Words", point: "redundancy — return back, repeat again, revert back, cousin brother, more preferable" },
  { section: "Superfluous Words", point: "double negatives — hardly no, didn't do nothing — and 'the reason is because'" },
  { section: "Superfluous Words", point: "a needless preposition after a verb that already carries the sense (enter into, reach at, order for)" },

  // ── Compound Nouns ────────────────────────────────────────────────────────
  { section: "Compound Nouns", point: "plurals of compound nouns — brothers-in-law, passers-by, commanders-in-chief" },
  { section: "Compound Nouns", point: "a number used as an adjective stays singular — a five-year-old boy, a ten-rupee note" },

  // ── Miscellaneous ─────────────────────────────────────────────────────────
  { section: "Miscellaneous", point: "parallel structure across a list or after correlatives" },
  { section: "Miscellaneous", point: "misplaced modifier — only, almost, nearly must sit beside the word they limit" },
  { section: "Miscellaneous", point: "so … that vs such … that" },
  { section: "Miscellaneous", point: "few / a few / the few and little / a little / the little" },
  { section: "Miscellaneous", point: "either / neither for two, any / none for more than two" },
];

// One-word substitution moved to data/oneWord.ts, grouped by family so it can
// also be the Study Hub notes page. Re-exported here so the practice generator
// keeps one import and the questions can never drift from the notes.
export { ONE_WORD_ITEMS } from "./oneWord";
export type { OneWordItem } from "./oneWord";

/**
 * Spelling sets: four exam words, each paired with the misspelling to use when
 * it is the one to get wrong. Written out rather than mutated at runtime — a
 * generated "misspelling" can land on another real word (marshal → marshall),
 * and every variant here is wrong in both British and American spelling.
 */
export type SpellingSet = { word: string; wrong: string }[];

export const SPELLING_SETS: SpellingSet[] = [
  [{ word: "committee", wrong: "comittee" }, { word: "harassment", wrong: "harrassment" }, { word: "occurrence", wrong: "occurance" }, { word: "privilege", wrong: "priviledge" }],
  [{ word: "embarrass", wrong: "embarass" }, { word: "accommodate", wrong: "accomodate" }, { word: "questionnaire", wrong: "questionaire" }, { word: "millennium", wrong: "millenium" }],
  [{ word: "conscience", wrong: "concience" }, { word: "definitely", wrong: "definately" }, { word: "separate", wrong: "seperate" }, { word: "maintenance", wrong: "maintainance" }],
  [{ word: "receive", wrong: "recieve" }, { word: "achieve", wrong: "acheive" }, { word: "siege", wrong: "seige" }, { word: "mischievous", wrong: "mischievious" }],
  [{ word: "rhythm", wrong: "rythm" }, { word: "liaison", wrong: "liason" }, { word: "silhouette", wrong: "silhoutte" }, { word: "bureaucracy", wrong: "beaurocracy" }],
  [{ word: "necessary", wrong: "neccessary" }, { word: "recommend", wrong: "recomend" }, { word: "argument", wrong: "arguement" }, { word: "existence", wrong: "existance" }],
  [{ word: "handkerchief", wrong: "handkerchef" }, { word: "exaggerate", wrong: "exagerate" }, { word: "jewellery", wrong: "jewellary" }, { word: "acquaintance", wrong: "aquaintance" }],
  [{ word: "temperament", wrong: "temparament" }, { word: "government", wrong: "goverment" }, { word: "environment", wrong: "enviroment" }, { word: "parliament", wrong: "parliment" }],
  [{ word: "satellite", wrong: "satelite" }, { word: "guarantee", wrong: "guarentee" }, { word: "restaurant", wrong: "restaraunt" }, { word: "lieutenant", wrong: "leiutenant" }],
  [{ word: "perseverance", wrong: "perseverence" }, { word: "correspondence", wrong: "correspondance" }, { word: "independence", wrong: "independance" }, { word: "conscientious", wrong: "consciencious" }],
  [{ word: "bachelor", wrong: "batchelor" }, { word: "calendar", wrong: "calender" }, { word: "grammar", wrong: "grammer" }, { word: "familiar", wrong: "familliar" }],
  [{ word: "omitted", wrong: "ommitted" }, { word: "benefited", wrong: "benifited" }, { word: "occurred", wrong: "occured" }, { word: "referred", wrong: "refered" }],
  [{ word: "pronunciation", wrong: "pronounciation" }, { word: "exhilarate", wrong: "exhilerate" }, { word: "hierarchy", wrong: "heirarchy" }, { word: "reminiscence", wrong: "reminiscense" }],
  [{ word: "supersede", wrong: "supercede" }, { word: "irresistible", wrong: "irresistable" }, { word: "indispensable", wrong: "indispensible" }, { word: "permissible", wrong: "permissable" }],
  [{ word: "colonel", wrong: "colonal" }, { word: "sergeant", wrong: "sargeant" }, { word: "marshal", wrong: "marshel" }, { word: "squadron", wrong: "squadran" }],
  [{ word: "vacuum", wrong: "vaccum" }, { word: "tranquillity", wrong: "tranquilty" }, { word: "occasionally", wrong: "occassionally" }, { word: "professional", wrong: "proffessional" }],
];

/** Names and settings are rotated per batch so sentences stop reading like the
 *  same three people living the same day over and over. */
export const NAMES: string[] = [
  "Aarav", "Ishaan", "Rohit", "Kavya", "Meera", "Ananya", "Vikram", "Nikhil",
  "Farhan", "Zoya", "Arjun", "Pooja", "Manish", "Tanvi", "Rahul", "Divya",
  "Karan", "Neha", "Sameer", "Priya", "Aditya", "Riya", "Gaurav", "Shalini",
  "Deepak", "Ayesha", "Harsh", "Anjali", "Lakshmi", "Imran", "Vidya", "Tejas",
  "Squadron Leader Menon", "Wing Commander Rathore", "Flight Lieutenant Bose",
  "Havildar Yadav", "Dr Iyer", "Professor Chatterjee", "Inspector Gill",
];

export const SETTINGS: string[] = [
  "the academy hostel", "a Delhi metro station", "a village fair near Nashik",
  "the officers' mess", "a bookshop in Kolkata", "the college canteen",
  "an IT office in Pune", "a wedding in Jaipur", "the cantonment market",
  "an overnight train to Chennai", "a cricket ground in Indore",
  "a backwater cruise in Kerala", "the base hospital", "a Mumbai newsroom",
  "the flight line at dawn", "a trek in the Nilgiris", "a bank branch in Patna",
  "a school science fair", "the district collector's office", "a tea estate in Assam",
];
