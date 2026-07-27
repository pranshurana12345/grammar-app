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

/** One-word substitution items. All three distractors come from the SAME
 *  family as the answer — that is what makes the real exam item hard — and are
 *  deliberately NOT synonyms of it, so the key stays defensible. */
export type OneWordItem = { def: string; answer: string; family: string[] };

export const ONE_WORD_ITEMS: OneWordItem[] = [
  { def: "One who studies the origin and history of words", answer: "Etymologist", family: ["Entomologist", "Ethnologist", "Epistemologist"] },
  { def: "One who studies insects", answer: "Entomologist", family: ["Etymologist", "Ornithologist", "Anthropologist"] },
  { def: "A person who does not believe in the existence of God", answer: "Atheist", family: ["Agnostic", "Theist", "Heretic"] },
  { def: "A remedy for all diseases and ills", answer: "Panacea", family: ["Antidote", "Placebo", "Sedative"] },
  { def: "A post that brings good pay but almost no work", answer: "Sinecure", family: ["Honorarium", "Retainer", "Perquisite"] },
  { def: "A person who hides on a ship or aircraft to travel free", answer: "Stowaway", family: ["Vagabond", "Fugitive", "Truant"] },
  { def: "A sudden and unexpected piece of good fortune", answer: "Windfall", family: ["Bequest", "Dividend", "Stipend"] },
  { def: "One who abstains completely from alcoholic drink", answer: "Teetotaller", family: ["Ascetic", "Recluse", "Epicure"] },
  { def: "A lover of books", answer: "Bibliophile", family: ["Bibliographer", "Bibliopole", "Bibliomaniac"] },
  { def: "One who hates mankind", answer: "Misanthrope", family: ["Philanthropist", "Misogynist", "Misogamist"] },
  { def: "One who hates the institution of marriage", answer: "Misogamist", family: ["Misogynist", "Misanthrope", "Bigamist"] },
  { def: "The murder of a king", answer: "Regicide", family: ["Fratricide", "Patricide", "Genocide"] },
  { def: "The killing of one's own brother", answer: "Fratricide", family: ["Patricide", "Matricide", "Infanticide"] },
  { def: "A person who walks in his sleep", answer: "Somnambulist", family: ["Somniloquist", "Insomniac", "Narcoleptic"] },
  { def: "A person who talks in his sleep", answer: "Somniloquist", family: ["Somnambulist", "Ventriloquist", "Insomniac"] },
  { def: "Government by officials", answer: "Bureaucracy", family: ["Aristocracy", "Plutocracy", "Oligarchy"] },
  { def: "Government by the wealthy", answer: "Plutocracy", family: ["Oligarchy", "Aristocracy", "Autocracy"] },
  { def: "Government by a small privileged group", answer: "Oligarchy", family: ["Monarchy", "Anarchy", "Theocracy"] },
  { def: "A speech made without any preparation", answer: "Extempore", family: ["Soliloquy", "Eulogy", "Valediction"] },
  { def: "A speech made by a person to himself", answer: "Soliloquy", family: ["Monologue", "Colloquy", "Dialogue"] },
  { def: "Words inscribed on the tomb of a person", answer: "Epitaph", family: ["Epigram", "Epilogue", "Epithet"] },
  { def: "A poem or song of mourning for the dead", answer: "Elegy", family: ["Ode", "Sonnet", "Ballad"] },
  { def: "One who is present everywhere at the same time", answer: "Omnipresent", family: ["Omnipotent", "Omniscient", "Omnivorous"] },
  { def: "One who knows everything", answer: "Omniscient", family: ["Omnipotent", "Omnipresent", "Prescient"] },
  { def: "Animals that feed on both plants and flesh", answer: "Omnivorous", family: ["Carnivorous", "Herbivorous", "Insectivorous"] },
  { def: "A hater of women", answer: "Misogynist", family: ["Misanthrope", "Philogynist", "Philanderer"] },
  { def: "Something that can be believed", answer: "Credible", family: ["Credulous", "Creditable", "Incredulous"] },
  { def: "A person who is too ready to believe anything", answer: "Credulous", family: ["Credible", "Creditable", "Incredulous"] },
  { def: "A person who leaves his own country to settle in another", answer: "Emigrant", family: ["Immigrant", "Refugee", "Nomad"] },
  { def: "A person who comes into a foreign country to settle there", answer: "Immigrant", family: ["Emigrant", "Expatriate", "Alien"] },
  { def: "Fear of being shut in a small enclosed space", answer: "Claustrophobia", family: ["Agoraphobia", "Acrophobia", "Hydrophobia"] },
  { def: "Fear of great heights", answer: "Acrophobia", family: ["Agoraphobia", "Claustrophobia", "Xenophobia"] },
  { def: "A person who eats far too much", answer: "Glutton", family: ["Gourmet", "Epicure", "Ascetic"] },
  { def: "An alphabetical list of books, with details, on a subject", answer: "Bibliography", family: ["Anthology", "Almanac", "Catalogue"] },
  { def: "A published collection of poems or writings", answer: "Anthology", family: ["Bibliography", "Chronicle", "Compendium"] },
  { def: "A yearly table of dates, tides and astronomical events", answer: "Almanac", family: ["Chronicle", "Directory", "Ledger"] },
  { def: "A person who cannot be corrected or reformed", answer: "Incorrigible", family: ["Incongruous", "Incorruptible", "Inconsolable"] },
  { def: "Handwriting that cannot be read", answer: "Illegible", family: ["Ineligible", "Indelible", "Ineffable"] },
  { def: "Food that is not fit to be eaten", answer: "Inedible", family: ["Edible", "Indelible", "Ineffable"] },
  { def: "A person who is habitually unable to sleep", answer: "Insomniac", family: ["Somnambulist", "Narcoleptic", "Somniloquist"] },
  { def: "A word that reads the same backwards as forwards", answer: "Palindrome", family: ["Anagram", "Acronym", "Homonym"] },
  { def: "One who is new to a trade or profession", answer: "Novice", family: ["Veteran", "Connoisseur", "Maestro"] },
  { def: "A person appointed to settle a dispute between two parties", answer: "Arbitrator", family: ["Advocate", "Adjudicator", "Mediator"] },
  { def: "A place where birds are kept", answer: "Aviary", family: ["Apiary", "Granary", "Hatchery"] },
  { def: "A place where bees are kept", answer: "Apiary", family: ["Aviary", "Dairy", "Piggery"] },
  { def: "One who deliberately sets fire to property", answer: "Arsonist", family: ["Anarchist", "Assassin", "Saboteur"] },
  { def: "One who lives alone and avoids other people", answer: "Recluse", family: ["Ascetic", "Nomad", "Vagrant"] },
  { def: "Practice of having more than one wife or husband at a time", answer: "Polygamy", family: ["Monogamy", "Bigamy", "Misogamy"] },
];

/** Spelling sets: four correctly spelt exam words. The blueprint names which
 *  ONE the model must misspell, so the key is never in doubt. */
export const SPELLING_SETS: string[][] = [
  ["committee", "harassment", "occurrence", "privilege"],
  ["embarrass", "accommodate", "questionnaire", "millennium"],
  ["conscience", "definitely", "separate", "maintenance"],
  ["receive", "achieve", "siege", "mischievous"],
  ["rhythm", "liaison", "silhouette", "bureaucracy"],
  ["necessary", "recommend", "argument", "existence"],
  ["handkerchief", "exaggerate", "jewellery", "acquaintance"],
  ["temperament", "government", "environment", "parliament"],
  ["satellite", "guarantee", "restaurant", "lieutenant"],
  ["perseverance", "correspondence", "independence", "conscientious"],
  ["bachelor", "calendar", "grammar", "familiar"],
  ["omitted", "benefited", "occurred", "referred"],
  ["pronunciation", "exhilarate", "hierarchy", "reminiscence"],
  ["supersede", "irresistible", "indispensable", "permissible"],
  ["colonel", "sergeant", "marshal", "squadron"],
  ["vacuum", "tranquillity", "occasionally", "professional"],
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
