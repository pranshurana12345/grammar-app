export type ConceptCategory =
  | "parts-of-speech"
  | "tenses"
  | "modals"
  | "verb-forms"
  | "sentence-structure"
  | "other";

export type Concept = {
  slug: string;
  title: string;
  emoji: string;
  shortDef: string;
  category: ConceptCategory;
  color: string;
  keywords: string[];
  definition: string;
  structure?: string;
  examples: Array<{ sentence: string; note?: string }>;
  tips: string[];
  relatedSlugs: string[];
};

export const CATEGORY_META: Record<ConceptCategory, { label: string; color: string }> = {
  "parts-of-speech": { label: "Parts of Speech", color: "#7c3aed" },
  "tenses":          { label: "Tenses",           color: "#0284c7" },
  "modals":          { label: "Modals",            color: "#0d9488" },
  "verb-forms":      { label: "Verb Forms",        color: "#2563eb" },
  "sentence-structure": { label: "Sentence Structure", color: "#dc2626" },
  "other":           { label: "Other",             color: "#d97706" },
};

export const CONCEPTS: Concept[] = [
  // ─── PARTS OF SPEECH ────────────────────────────────────────────────────────

  {
    slug: "noun",
    title: "Noun",
    emoji: "🏷️",
    shortDef: "Word that names a person, place, thing, or idea",
    category: "parts-of-speech",
    color: "#7c3aed",
    keywords: [
      "noun", "nouns", "noun phrase", "collective noun", "abstract noun",
      "proper noun", "common noun", "countable noun", "uncountable noun",
      "compound noun",
    ],
    definition:
      "A noun is a word that names a person, place, thing, quality, or idea. In English, nouns can be proper (specific names like 'India') or common (general names like 'soldier'), and they function as the subject or object in a sentence. AFCAT passages frequently test collective nouns, abstract nouns, and correct article usage before nouns.",
    examples: [
      { sentence: "The regiment marched through the valley.", note: "'regiment' is a collective noun; 'valley' is a common noun." },
      { sentence: "Courage is the most valued quality in a soldier.", note: "'Courage' is an abstract noun used as the subject." },
      { sentence: "The Air Force Academy is situated in Dundigal.", note: "'Air Force Academy' is a proper noun; no article before proper nouns." },
    ],
    tips: [
      "Collective nouns (army, committee, jury) take a singular verb when acting as one unit: 'The jury has delivered its verdict.'",
      "Abstract nouns (courage, honesty, loyalty) are usually uncountable — do not add 'a/an' or pluralise them: say 'show courage', NOT 'show a courage'.",
      "AFCAT often tests whether a gerund (-ing form used as a noun) agrees with a singular verb: 'Flying jets requires skill.'",
    ],
    relatedSlugs: ["pronoun", "article", "countable-uncountable", "subject"],
  },

  {
    slug: "pronoun",
    title: "Pronoun",
    emoji: "👤",
    shortDef: "Word that replaces a noun to avoid repetition",
    category: "parts-of-speech",
    color: "#7c3aed",
    keywords: [
      "pronoun", "pronouns", "personal pronoun", "reflexive pronoun",
      "relative pronoun", "indefinite pronoun", "possessive pronoun",
      "demonstrative pronoun", "interrogative pronoun",
    ],
    definition:
      "A pronoun is a word used in place of a noun to avoid repetition and ensure fluency. English pronouns are classified as personal (I, he, she, they), reflexive (himself, themselves), relative (who, which, that), possessive (mine, his, theirs), demonstrative (this, those), and indefinite (everyone, nobody). AFCAT tests pronoun–antecedent agreement and the correct case of pronouns (subject vs. object).",
    examples: [
      { sentence: "The commanding officer submitted his report before the deadline.", note: "'his' is a possessive pronoun referring to 'commanding officer'." },
      { sentence: "The pilots who were selected reported to the base immediately.", note: "'who' is a relative pronoun introducing a defining clause." },
      { sentence: "Neither the sergeant nor the recruits completed their drills on time.", note: "With 'neither…nor', the pronoun agrees with the nearer noun ('recruits' → 'their')." },
    ],
    tips: [
      "Use 'who' for persons and 'which' for things; 'that' can refer to both but is preferred in defining clauses.",
      "Reflexive pronouns (himself, themselves) cannot be used as standalone subjects: say 'He and I attended', NOT 'Himself and I attended'.",
      "With indefinite pronouns (everyone, nobody, each), always use a singular verb and singular possessive: 'Everyone has submitted his/her application.'",
    ],
    relatedSlugs: ["noun", "subject", "relative-clause", "reported-speech"],
  },

  {
    slug: "verb",
    title: "Verb",
    emoji: "⚡",
    shortDef: "Word expressing action, state, or occurrence",
    category: "parts-of-speech",
    color: "#7c3aed",
    keywords: [
      "verb", "verbs", "action verb", "linking verb", "stative verb",
      "transitive verb", "intransitive verb", "verb form", "verb tense",
      "subject-verb agreement",
    ],
    definition:
      "A verb is the central element of a sentence that expresses an action (run, attack, deploy), a state (be, seem, remain), or an occurrence (happen, result). Verbs must agree with their subject in number and person. AFCAT extensively tests subject–verb agreement, correct verb forms, and the distinction between transitive and intransitive verbs.",
    examples: [
      { sentence: "The squadron leader briefs his pilots every morning.", note: "Third-person singular subject requires '-s' on the verb." },
      { sentence: "The committee has approved the new training schedule.", note: "Collective noun 'committee' takes a singular verb." },
      { sentence: "The recruits were exhausted after the obstacle course.", note: "'were exhausted' — linking verb 'were' + adjective complement." },
    ],
    tips: [
      "Intervening phrases do not change subject-verb agreement: 'The list of requirements is long', NOT 'are long'.",
      "Stative verbs (know, believe, consist, belong) are rarely used in continuous tenses: say 'I know the answer', NOT 'I am knowing the answer'.",
      "AFCAT Error-Spotting frequently places a plural-looking collective noun before a verb — check whether the noun acts as a unit (singular verb) or as individuals (plural verb).",
    ],
    relatedSlugs: ["auxiliary-verb", "subject", "tenses", "modal-verb"],
  },

  {
    slug: "adjective",
    title: "Adjective",
    emoji: "🎨",
    shortDef: "Word that describes or modifies a noun",
    category: "parts-of-speech",
    color: "#7c3aed",
    keywords: [
      "adjective", "adjectives", "adjective phrase", "attributive adjective",
      "predicative adjective", "comparative adjective", "superlative adjective",
      "ordinal adjective", "demonstrative adjective",
    ],
    definition:
      "An adjective is a word that modifies a noun or pronoun by describing its quality, quantity, or identity. Adjectives can appear before the noun (attributive: 'a skilled officer') or after a linking verb (predicative: 'The officer is skilled'). AFCAT tests degree of comparison, correct position of adjectives, and misuse of adjective vs. adverb.",
    examples: [
      { sentence: "The new recruit showed remarkable discipline during training.", note: "'new' (attributive) modifies 'recruit'; 'remarkable' (attributive) modifies 'discipline'." },
      { sentence: "The terrain was rough and treacherous.", note: "Predicative adjectives 'rough' and 'treacherous' follow the linking verb 'was'." },
      { sentence: "This is the most efficient route to the forward operating base.", note: "Superlative form 'most efficient' used for comparing more than two options." },
    ],
    tips: [
      "Do not add '-er'/'-est' to adjectives already in comparative/superlative form: say 'more careful', NOT 'more carefuller'.",
      "Use 'fewer' for countable nouns and 'less' for uncountable: 'fewer soldiers', 'less ammunition' — a common AFCAT trap.",
      "Adjectives do not change form for plural nouns in English: 'two heavy tanks', NOT 'two heavies tanks'.",
    ],
    relatedSlugs: ["adverb", "degree-of-comparison", "noun", "article"],
  },

  {
    slug: "adverb",
    title: "Adverb",
    emoji: "🔧",
    shortDef: "Word that modifies a verb, adjective, or another adverb",
    category: "parts-of-speech",
    color: "#7c3aed",
    keywords: [
      "adverb", "adverbs", "adverb phrase", "adverb of manner",
      "adverb of frequency", "adverb of time", "adverb of place",
      "adverb of degree", "conjunctive adverb",
    ],
    definition:
      "An adverb modifies a verb, an adjective, or another adverb by indicating manner, time, place, frequency, or degree. Most adverbs of manner are formed by adding '-ly' to adjectives (quick → quickly). AFCAT tests the placement of adverbs (especially frequency adverbs), the adjective-vs-adverb distinction, and flat adverbs that can mislead candidates.",
    examples: [
      { sentence: "The pilot landed the aircraft extremely carefully in poor visibility.", note: "'extremely' modifies the adverb 'carefully'; 'carefully' modifies the verb 'landed'." },
      { sentence: "The officer always files his mission reports on time.", note: "Frequency adverb 'always' placed before the main verb, after auxiliary verbs." },
      { sentence: "The decision was made quite hastily by the committee.", note: "'quite' is an adverb of degree modifying 'hastily'." },
    ],
    tips: [
      "Frequency adverbs (always, never, often, seldom) go between the subject and main verb but AFTER auxiliaries: 'He has never failed', NOT 'He never has failed'.",
      "Do not use an adjective where an adverb is needed: 'She spoke clearly', NOT 'She spoke clear'.",
      "AFCAT tests 'hard' vs 'hardly' — 'hard' means with effort; 'hardly' means scarcely/barely. They are NOT interchangeable.",
    ],
    relatedSlugs: ["adjective", "degree-of-comparison", "verb", "clause"],
  },

  {
    slug: "preposition",
    title: "Preposition",
    emoji: "📍",
    shortDef: "Word showing relationship between noun and other words",
    category: "parts-of-speech",
    color: "#7c3aed",
    keywords: [
      "preposition", "prepositions", "prepositional phrase", "preposition of time",
      "preposition of place", "preposition of direction", "phrasal preposition",
      "preposition error",
    ],
    definition:
      "A preposition is a word placed before a noun or pronoun to show its relationship with another word in the sentence in terms of time, place, direction, manner, or cause. Common prepositions include in, on, at, by, for, with, about, and between. AFCAT frequently tests the correct choice of preposition in idiomatic expressions, phrasal verbs, and fixed collocations.",
    examples: [
      { sentence: "The general presided over the award ceremony at the Air Force Station.", note: "'over' and 'at' are prepositions indicating role and location." },
      { sentence: "The aircraft arrived on time despite adverse weather conditions.", note: "'on time' is a fixed prepositional phrase; 'despite' is a complex preposition." },
      { sentence: "The soldiers are trained to operate under extreme pressure.", note: "'under pressure' is an idiomatic prepositional phrase tested in AFCAT fill-in-the-blanks." },
    ],
    tips: [
      "Learn collocations with prepositions: 'interested in', 'responsible for', 'capable of', 'differ from', 'comply with' — mixing these is a common AFCAT error.",
      "Do not end formal written sentences with a preposition in AFCAT grammar-correction questions if an alternative is available.",
      "Distinguish 'between' (two items) and 'among' (three or more): 'between two bases', 'among several candidates'.",
    ],
    relatedSlugs: ["noun", "adjective", "clause", "phrasal-verb"],
  },

  {
    slug: "conjunction",
    title: "Conjunction",
    emoji: "🔗",
    shortDef: "Word that joins words, phrases, or clauses",
    category: "parts-of-speech",
    color: "#7c3aed",
    keywords: [
      "conjunction", "conjunctions", "coordinating conjunction", "subordinating conjunction",
      "correlative conjunction", "conjunction pair", "connective",
    ],
    definition:
      "A conjunction is a word that connects words, phrases, or clauses. Coordinating conjunctions (FANBOYS: for, and, nor, but, or, yet, so) join grammatically equal elements. Subordinating conjunctions (although, because, unless, until) introduce dependent clauses. Correlative conjunctions work in pairs (either…or, neither…nor, not only…but also). AFCAT tests parallel structure with conjunctions and correct correlative pairing.",
    examples: [
      { sentence: "The base commander not only reviewed the plan but also approved the budget.", note: "Correlative pair 'not only…but also' requires parallel structure (verb + noun)." },
      { sentence: "Although the mission was dangerous, the team completed it successfully.", note: "'Although' is a subordinating conjunction introducing a concessive clause." },
      { sentence: "The recruits must pass the written test and the physical assessment.", note: "'and' coordinates two noun phrases as objects of 'pass'." },
    ],
    tips: [
      "Correlative conjunctions require strict parallelism: 'Either the captain or the lieutenant IS responsible', NOT 'are' (verb agrees with the nearer subject).",
      "Do not use 'although' and 'but' together: 'Although he tried, he failed' OR 'He tried, but he failed' — never combine both.",
      "AFCAT tests 'unless' = 'if not' — 'Unless you study' means 'If you do not study'. Never use 'unless…not' together.",
    ],
    relatedSlugs: ["clause", "conditional", "subject", "verb"],
  },

  {
    slug: "article",
    title: "Article",
    emoji: "📰",
    shortDef: "Determiner (a, an, the) placed before a noun",
    category: "parts-of-speech",
    color: "#7c3aed",
    keywords: [
      "article", "articles", "definite article", "indefinite article",
      "article usage", "omission of article", "zero article",
    ],
    definition:
      "Articles are determiners placed before nouns: the definite article 'the' refers to a specific known noun, while the indefinite articles 'a' and 'an' refer to any one member of a category. 'A' precedes words beginning with a consonant sound; 'an' precedes words beginning with a vowel sound. Some nouns take no article (zero article) — proper nouns, uncountable nouns used generically, and plural countable nouns used generically.",
    examples: [
      { sentence: "An honest officer is an asset to the armed forces.", note: "'An' before 'honest' because 'h' is silent — the vowel sound is /ɒ/." },
      { sentence: "The Himalayas form a natural barrier along the northern border.", note: "'The' used with mountain ranges (plural proper nouns)." },
      { sentence: "Courage and discipline are essential for military service.", note: "No article before abstract nouns used in a general sense." },
    ],
    tips: [
      "Use 'an' based on SOUND, not spelling: 'an MBA degree' (sound: em-), 'a university' (sound: you-), 'an hour' (h is silent).",
      "Use 'the' with unique things (the sun, the sky), superlatives (the best), and ordinals (the first).",
      "AFCAT trap: Do NOT use 'the' before proper nouns of people and most countries, but DO use 'the' before rivers (the Ganga), seas, and mountain ranges.",
    ],
    relatedSlugs: ["noun", "adjective", "countable-uncountable", "degree-of-comparison"],
  },

  // ─── VERB FORMS ─────────────────────────────────────────────────────────────

  {
    slug: "infinitive",
    title: "Infinitive",
    emoji: "🎯",
    shortDef: "Base form of verb, often with 'to'",
    category: "verb-forms",
    color: "#2563eb",
    keywords: [
      "infinitive", "infinitives", "to-infinitive", "bare infinitive",
      "split infinitive", "infinitive phrase", "infinitive clause",
    ],
    definition:
      "The infinitive is the base form of a verb, appearing either with 'to' (to-infinitive: to run, to decide) or without 'to' (bare infinitive: run, decide). To-infinitives are used after certain verbs (want, decide, hope), adjectives (eager, able, ready), and to express purpose. Bare infinitives follow modal auxiliaries and causative verbs (let, make, help). AFCAT tests the correct choice between to-infinitive and gerund after specific verbs.",
    structure: "to + V1 (to-infinitive) | V1 (bare infinitive)",
    examples: [
      { sentence: "The officer decided to reorganise the logistics department.", note: "'decide' is followed by to-infinitive, NOT a gerund." },
      { sentence: "The commanding general made the soldiers repeat the drill.", note: "Causative 'make' + bare infinitive (no 'to')." },
      { sentence: "He was the first cadet to complete the marathon under three hours.", note: "Infinitive of result/description after ordinals." },
    ],
    tips: [
      "After 'let', 'make', 'help', 'need', and 'dare' (as auxiliaries), use bare infinitive: 'Let him go', NOT 'Let him to go'.",
      "Verbs followed by to-infinitive: want, wish, decide, agree, refuse, hope, expect, promise — memorise this list for AFCAT.",
      "Split infinitives ('to boldly go') are grammatically accepted but AFCAT may test correcting them in formal writing contexts.",
    ],
    relatedSlugs: ["gerund", "verb", "modal-verb", "auxiliary-verb"],
  },

  {
    slug: "gerund",
    title: "Gerund",
    emoji: "🔄",
    shortDef: "-ing verb form used as a noun",
    category: "verb-forms",
    color: "#2563eb",
    keywords: [
      "gerund", "gerunds", "gerund phrase", "gerund subject",
      "gerund object", "verb followed by gerund", "-ing form as noun",
    ],
    definition:
      "A gerund is the -ing form of a verb used as a noun. It can function as a subject ('Swimming is good exercise'), an object ('She enjoys reading'), or the object of a preposition ('He is good at planning'). Many verbs are exclusively followed by gerunds. AFCAT tests the distinction between gerund and present participle (both -ing), and which verbs take gerunds vs. infinitives.",
    structure: "V + -ing (functioning as a noun)",
    examples: [
      { sentence: "Maintaining physical fitness is mandatory for Air Force personnel.", note: "Gerund phrase 'Maintaining physical fitness' is the subject; takes a singular verb." },
      { sentence: "The candidate avoided making careless mistakes in the test.", note: "'avoid' is always followed by a gerund, never an infinitive." },
      { sentence: "He is responsible for briefing the new recruits on safety protocols.", note: "Gerund after preposition 'for'." },
    ],
    tips: [
      "Prepositions are ALWAYS followed by gerunds, never infinitives: 'interested in joining', 'good at solving', 'instead of leaving'.",
      "Verbs followed only by gerunds: avoid, consider, deny, enjoy, finish, keep, mind, practise, suggest, recommend — a critical AFCAT list.",
      "To test whether -ing is a gerund or participle: if it acts as a noun (subject/object), it is a gerund; if it modifies a noun, it is a participle.",
    ],
    relatedSlugs: ["infinitive", "participle", "noun", "verb"],
  },

  {
    slug: "participle",
    title: "Participle",
    emoji: "✂️",
    shortDef: "-ing or -ed verb form used as an adjective",
    category: "verb-forms",
    color: "#2563eb",
    keywords: [
      "participle", "participles", "present participle", "past participle",
      "participle phrase", "dangling participle", "misplaced participle",
      "participial phrase",
    ],
    definition:
      "A participle is a verb form used as an adjective or to form compound tenses. The present participle (V + -ing) describes ongoing action or modifies nouns (a running soldier). The past participle (V3: broken, written) is used in perfect tenses and passive constructions. A participial phrase must clearly refer to the subject of the main clause; otherwise it becomes a 'dangling participle' — a classic AFCAT error-spotting target.",
    examples: [
      { sentence: "Exhausted by the long march, the soldiers rested at the camp.", note: "Past participial phrase correctly modifies the subject 'soldiers'." },
      { sentence: "The coded message, sent by the intelligence unit, was decoded within hours.", note: "Past participle 'sent' in a reduced relative clause." },
      { sentence: "Running through the obstacle course, the recruit tripped on the final hurdle.", note: "Present participial phrase — subject of main clause ('recruit') is the runner." },
    ],
    tips: [
      "Dangling participle error: 'Walking down the street, the monument was visible.' — the monument cannot walk. Fix: 'Walking down the street, he could see the monument.'",
      "Past participles of irregular verbs must be memorised: write→written, break→broken, do→done, go→gone — AFCAT tests these in perfect tense and passive questions.",
      "A participle phrase at the start of a sentence MUST refer to the grammatical subject of the following main clause.",
    ],
    relatedSlugs: ["gerund", "passive-voice", "present-perfect", "past-perfect"],
  },

  {
    slug: "auxiliary-verb",
    title: "Auxiliary Verb",
    emoji: "🛠️",
    shortDef: "Helper verb forming tense, aspect, or voice",
    category: "verb-forms",
    color: "#2563eb",
    keywords: [
      "auxiliary verb", "auxiliary verbs", "helping verb", "primary auxiliary",
      "modal auxiliary", "do auxiliary", "be auxiliary", "have auxiliary",
    ],
    definition:
      "An auxiliary (helping) verb is used alongside a main verb to form tense, aspect, mood, or voice. Primary auxiliaries are 'be' (am, is, are, was, were), 'have' (has, have, had), and 'do' (do, does, did). They help form continuous tenses (is running), perfect tenses (has completed), passive voice (was ordered), and questions/negatives. Modal auxiliaries (can, will, shall, must) express possibility, obligation, or permission.",
    structure: "Auxiliary + main verb (V1 / V2 / V3 / V-ing)",
    examples: [
      { sentence: "The mission has been completed successfully by the task force.", note: "'has been' = have (perfect) + be (passive); 'completed' is the past participle." },
      { sentence: "Did the squadron leader approve the new flight plan?", note: "'Did' as auxiliary inverts for question formation." },
      { sentence: "The recruits are being evaluated on their performance this week.", note: "'are being' forms present continuous passive." },
    ],
    tips: [
      "Never use 'do/does/did' with other auxiliaries or modals: 'Did he go?' is correct, but NEVER 'Did he could go?'",
      "In perfect tenses, 'have' is the auxiliary; in passive, 'be' is the auxiliary — these can combine: 'has been selected'.",
      "AFCAT tests: auxiliary must match subject in number and tense: 'He was going' (not 'He were going'); 'They have arrived' (not 'They has arrived').",
    ],
    relatedSlugs: ["verb", "modal-verb", "passive-voice", "tenses"],
  },

  // ─── TENSES ─────────────────────────────────────────────────────────────────

  {
    slug: "present-simple",
    title: "Present Simple",
    emoji: "📅",
    shortDef: "Habitual actions or permanent truths in present",
    category: "tenses",
    color: "#0284c7",
    keywords: [
      "present simple", "simple present", "present tense", "habitual action",
      "general truth", "universal truth", "third person singular",
      "subject-verb agreement present",
    ],
    definition:
      "The Present Simple tense is used to express habitual actions, universal truths, permanent states, and scheduled future events. It uses the base form of the verb for most subjects and adds '-s' or '-es' for third-person singular. This tense is fundamental to AFCAT grammar, particularly in subject-verb agreement questions and error-spotting tasks.",
    structure: "Subject + V1 (+ -s/-es for he/she/it)",
    examples: [
      { sentence: "The Air Force conducts regular training exercises to maintain combat readiness.", note: "'conducts' — third-person singular present simple." },
      { sentence: "Water boils at 100 degrees Celsius under standard atmospheric pressure.", note: "Universal scientific truth expressed in present simple." },
      { sentence: "The aircraft departs for the forward base at 0600 hours tomorrow.", note: "Scheduled future event expressed using present simple (timetable)." },
    ],
    tips: [
      "Third-person singular (he/she/it/one) always takes '-s/-es': 'The officer writes', 'He watches' — a routine AFCAT error.",
      "Stative verbs (know, believe, contain, own) are almost always in simple, not continuous form: 'He knows the code', NOT 'He is knowing the code'.",
      "For frequency in present simple: adverbs go between subject and verb: 'She always completes her reports.'",
    ],
    relatedSlugs: ["present-continuous", "present-perfect", "verb", "adverb"],
  },

  {
    slug: "present-continuous",
    title: "Present Continuous",
    emoji: "▶️",
    shortDef: "Action happening right now or temporarily",
    category: "tenses",
    color: "#0284c7",
    keywords: [
      "present continuous", "present progressive", "is doing", "are doing",
      "am doing", "ongoing action", "temporary action", "continuous tense",
    ],
    definition:
      "The Present Continuous tense describes an action that is in progress at the time of speaking or a temporary situation around the present time. It is formed with 'am/is/are + present participle'. It also describes definite future arrangements. AFCAT tests the key distinction between simple and continuous tenses, especially with stative verbs that cannot normally appear in continuous form.",
    structure: "Subject + am/is/are + V-ing",
    examples: [
      { sentence: "The defence ministry is reviewing the new procurement policy this month.", note: "Temporary ongoing activity around the present — 'this month' is a clue." },
      { sentence: "The pilot is approaching the runway for an emergency landing.", note: "Action in progress at the moment of speaking." },
      { sentence: "We are meeting the selection board next Wednesday.", note: "Present continuous for a definite future arrangement." },
    ],
    tips: [
      "Stative verbs NOT used in continuous: know, want, need, love, hate, see, hear, belong, consist — 'I need help', NOT 'I am needing help'.",
      "Time markers for present continuous: now, at the moment, currently, this week, today — use these as clues in fill-in-the-blank questions.",
      "AFCAT trap: 'always' with present continuous expresses irritation/habit, not mere frequency: 'He is always losing his equipment!' (irritation).",
    ],
    relatedSlugs: ["present-simple", "present-perfect", "auxiliary-verb", "participle"],
  },

  {
    slug: "present-perfect",
    title: "Present Perfect",
    emoji: "✅",
    shortDef: "Past action with relevance to the present",
    category: "tenses",
    color: "#0284c7",
    keywords: [
      "present perfect", "has done", "have done", "just", "already",
      "yet", "ever", "never", "recently", "since", "for",
      "perfect tense",
    ],
    definition:
      "The Present Perfect tense connects a past action to the present — the action has just finished, or its result is relevant now, or it occurred at an unspecified time before now. It uses 'has/have + past participle'. Key time expressions are: just, already, yet, ever, never, recently, so far, since (point in time), and for (duration). AFCAT tests the correct use of 'since' vs. 'for' and distinguishes this tense from past simple.",
    structure: "Subject + has/have + V3 (+ Object)",
    examples: [
      { sentence: "The Armed Forces have deployed additional units along the border since January.", note: "'since January' = point in time → present perfect, NOT past simple." },
      { sentence: "The candidate has already submitted all the required documents.", note: "'already' in positive sentences confirms an action before expectation." },
      { sentence: "Has the reconnaissance team returned from the forward position yet?", note: "'yet' used in questions and negatives with present perfect." },
    ],
    tips: [
      "'Since' is used with a point in time (since 2019, since Monday); 'for' is used with a duration (for two years, for a week) — mixing these is a top AFCAT mistake.",
      "Never use present perfect with specific past time expressions: say 'He joined last year', NOT 'He has joined last year'.",
      "AFCAT Error-Spotting: look for 'yesterday', 'ago', 'last year', 'in 1999' — these ALWAYS require past simple, not present perfect.",
    ],
    relatedSlugs: ["past-simple", "past-perfect", "auxiliary-verb", "participle"],
  },

  {
    slug: "past-simple",
    title: "Past Simple",
    emoji: "⏪",
    shortDef: "Completed action at a specific past time",
    category: "tenses",
    color: "#0284c7",
    keywords: [
      "past simple", "simple past", "past tense", "past action",
      "completed action", "irregular past", "regular past",
      "yesterday", "last year", "ago",
    ],
    definition:
      "The Past Simple tense describes a completed action that happened at a specific time in the past. Regular verbs add '-ed'; irregular verbs have unique past forms (go→went, write→wrote, see→saw). This tense is used for narratives, sequences of past events, and actions completed before now. AFCAT tests irregular past forms, spelling of regular past forms, and the time expressions that demand past simple over present perfect.",
    structure: "Subject + V2 (past form)",
    examples: [
      { sentence: "The Indian Air Force formally inducted the Rafale jets in September 2020.", note: "Specific time 'September 2020' requires past simple, not present perfect." },
      { sentence: "The unit commander briefed the troops and then inspected the equipment.", note: "Sequence of completed actions: 'briefed' then 'inspected'." },
      { sentence: "She wrote the technical report and submitted it an hour ago.", note: "'an hour ago' = specific past time → past simple." },
    ],
    tips: [
      "Time markers that demand past simple: yesterday, last week, ago, in [year], when, then — NEVER use present perfect with these.",
      "Irregular verbs are frequently tested in AFCAT: go→went, come→came, take→took, give→gave, write→wrote, break→broke, choose→chose.",
      "In reported speech, present simple shifts to past simple: 'He said, \"I work here\"' → 'He said that he worked there'.",
    ],
    relatedSlugs: ["present-perfect", "past-perfect", "reported-speech", "verb"],
  },

  {
    slug: "past-perfect",
    title: "Past Perfect",
    emoji: "⏮️",
    shortDef: "Action completed before another past action",
    category: "tenses",
    color: "#0284c7",
    keywords: [
      "past perfect", "had done", "had been", "before", "after",
      "already past", "by the time", "pluperfect",
    ],
    definition:
      "The Past Perfect tense describes an action that was completed before another action or a specific point in the past. It uses 'had + past participle'. When two past actions are mentioned, the earlier one takes past perfect and the later one takes past simple. This sequence signal is critical in AFCAT sentence-completion and error-spotting questions.",
    structure: "Subject + had + V3 (+ Object)",
    examples: [
      { sentence: "By the time the reinforcements arrived, the battalion had already secured the perimeter.", note: "'had secured' happened before 'arrived' — past perfect for the earlier action." },
      { sentence: "The pilot had completed more than 200 flight hours before he applied for the instructor post.", note: "Past perfect 'had completed' is earlier; past simple 'applied' is later." },
      { sentence: "The committee noticed that the previous commandant had not filed the annual report.", note: "Past perfect in a reported/embedded clause." },
    ],
    tips: [
      "The key trigger: two past actions where one precedes the other — the EARLIER action takes past perfect ('had + V3').",
      "With 'before' and 'after', past perfect is technically optional since the conjunction shows sequence, but AFCAT may expect it: 'He had left before she arrived.'",
      "Do not use past perfect if only one past action is mentioned — past simple is correct: 'She submitted the report yesterday', NOT 'She had submitted'.",
    ],
    relatedSlugs: ["past-simple", "present-perfect", "conditional", "reported-speech"],
  },

  {
    slug: "future-simple",
    title: "Future Simple",
    emoji: "🔮",
    shortDef: "Prediction, promise, or spontaneous decision about future",
    category: "tenses",
    color: "#0284c7",
    keywords: [
      "future simple", "will", "shall", "going to", "future tense",
      "prediction", "future plan", "spontaneous decision",
      "tomorrow", "next year", "future",
    ],
    definition:
      "The Future Simple expresses predictions, promises, decisions made at the moment of speaking, and offers. 'Will + V1' is used for predictions, promises, and spontaneous decisions. 'Shall' is traditionally used with I/we for offers and suggestions (formal/AFCAT context). 'Be going to + V1' expresses prior plans and predictions based on present evidence. AFCAT tests the distinction between 'will' and 'shall', and 'will' vs. 'going to'.",
    structure: "Subject + will/shall + V1 (base form)",
    examples: [
      { sentence: "The Air Force will commission fifty new fighter jets by the end of the financial year.", note: "Prediction/planned future — 'will' for formal future statements." },
      { sentence: "Shall we proceed with the debrief after the mission review?", note: "'Shall' with 'we' for a formal offer or suggestion." },
      { sentence: "The forecast indicates that it is going to rain heavily over the western sector.", note: "'going to' based on present evidence (the forecast)." },
    ],
    tips: [
      "Traditionally, 'shall' is used with I/we (first person) and 'will' with he/she/they in formal contexts — AFCAT follows this convention.",
      "In conditional sentences (Type 1), 'will' goes in the main clause, NEVER in the 'if-clause': 'If he qualifies, he will be selected', NOT 'If he will qualify'.",
      "'Going to' signals a prior intention or plan; 'will' signals a spontaneous decision: 'I've decided — I'm going to apply' vs. 'There's the phone — I'll answer it.'",
    ],
    relatedSlugs: ["conditional", "modal-verb", "auxiliary-verb", "present-continuous"],
  },

  // ─── MODALS ─────────────────────────────────────────────────────────────────

  {
    slug: "modal-verb",
    title: "Modal Verb",
    emoji: "🎛️",
    shortDef: "Auxiliary expressing ability, permission, or obligation",
    category: "modals",
    color: "#0d9488",
    keywords: [
      "modal verb", "modal verbs", "modal auxiliary", "can", "could",
      "may", "might", "must", "shall", "should", "will", "would",
      "ought to", "need to", "dare", "used to",
    ],
    definition:
      "Modal verbs (can, could, may, might, must, shall, should, will, would, ought to) are auxiliary verbs that express ability, permission, possibility, obligation, advice, or deduction. They are invariable in form (no -s, -ing, or -ed), always followed by a bare infinitive, and cannot be combined with each other. AFCAT tests the precise meaning differences between modals, especially must vs. should, can vs. may, and would vs. used to.",
    structure: "Subject + modal + V1 (bare infinitive)",
    examples: [
      { sentence: "Candidates must submit their applications before the closing date.", note: "'must' = strong obligation/requirement — no alternative." },
      { sentence: "Officers should maintain a high standard of physical fitness at all times.", note: "'should' = moral obligation/advice — less forceful than 'must'." },
      { sentence: "When I was a cadet, we would run ten kilometres every morning.", note: "'would' for past habitual actions (= 'used to run')." },
    ],
    tips: [
      "Modals have NO third-person -s: 'He can fly' (never 'He cans fly'); no to-infinitive after them: 'must go' (never 'must to go').",
      "Distinguish 'must' (speaker's obligation) from 'have to' (external obligation): 'You must report' (I say so) vs. 'You have to report' (the rules say so).",
      "AFCAT tests 'can' (ability) vs. 'may' (permission) in formal contexts: 'May I enter?' is correct in formal writing; 'Can I enter?' is informal.",
    ],
    relatedSlugs: ["auxiliary-verb", "infinitive", "conditional", "future-simple"],
  },

  // ─── SENTENCE STRUCTURE ──────────────────────────────────────────────────────

  {
    slug: "subject",
    title: "Subject",
    emoji: "👑",
    shortDef: "The noun or pronoun performing the action",
    category: "sentence-structure",
    color: "#dc2626",
    keywords: [
      "subject", "subjects", "sentence subject", "grammatical subject",
      "subject complement", "subject-verb", "complete subject",
      "compound subject",
    ],
    definition:
      "The subject of a sentence is the noun, pronoun, or noun phrase that performs or experiences the action expressed by the verb. Identifying the true subject is critical for subject-verb agreement. In complex sentences with intervening phrases or clauses, the subject can be obscured. AFCAT error-spotting questions frequently hinge on finding the real subject and checking verb agreement.",
    examples: [
      { sentence: "The group of officers was briefed on the new operational strategy.", note: "Subject is 'group' (singular), not 'officers' — singular verb 'was'." },
      { sentence: "Neither the training schedule nor the new recruits were adjusted.", note: "Compound subject with 'neither…nor': verb agrees with nearer subject 'recruits' (plural)." },
      { sentence: "What the commander requires is total commitment from his team.", note: "Noun clause 'What the commander requires' functions as a singular subject." },
    ],
    tips: [
      "Cross out prepositional phrases to find the true subject: 'The quality of the reports [is/are] excellent' → subject is 'quality' → singular verb 'is'.",
      "Compound subjects joined by 'and' usually take a plural verb; but if they refer to the same entity: 'Bread and butter is her breakfast.'",
      "With 'either…or' / 'neither…nor', the verb agrees with the subject closer to it (proximity rule).",
    ],
    relatedSlugs: ["verb", "object", "clause", "noun"],
  },

  {
    slug: "object",
    title: "Object",
    emoji: "🎯",
    shortDef: "Noun receiving the action of the verb",
    category: "sentence-structure",
    color: "#dc2626",
    keywords: [
      "object", "objects", "direct object", "indirect object",
      "object of preposition", "object pronoun", "transitive",
      "object complement",
    ],
    definition:
      "The object of a sentence is the noun, pronoun, or noun phrase that receives the action of the verb. A direct object answers 'what?' or 'whom?'; an indirect object answers 'to whom?' or 'for whom?'. Object pronouns (me, him, her, us, them) must be used in object positions, not subject pronouns. AFCAT tests pronoun case errors (using 'I' where 'me' is needed) and sentence transformation into passive voice.",
    examples: [
      { sentence: "The general awarded the pilot a medal for outstanding bravery.", note: "'pilot' is indirect object (awarded to whom?); 'medal' is direct object (awarded what?)." },
      { sentence: "The new policy affects all officers and their families.", note: "'all officers and their families' is the direct object of 'affects'." },
      { sentence: "Between you and me, the selection process was not entirely fair.", note: "'me' not 'I' — object position after preposition 'between'." },
    ],
    tips: [
      "After a preposition, always use object pronouns: 'between you and me', 'for him and her', NEVER 'between you and I'.",
      "To convert active to passive, the direct object of the active sentence becomes the subject of the passive sentence.",
      "Intransitive verbs (arrive, sleep, die, go, come) cannot have a direct object — 'He arrived the station' is WRONG.",
    ],
    relatedSlugs: ["subject", "passive-voice", "active-voice", "pronoun"],
  },

  {
    slug: "clause",
    title: "Clause",
    emoji: "🏗️",
    shortDef: "Group of words with subject and verb",
    category: "sentence-structure",
    color: "#dc2626",
    keywords: [
      "clause", "clauses", "main clause", "subordinate clause",
      "relative clause", "noun clause", "adverbial clause",
      "independent clause", "dependent clause", "clause connector",
    ],
    definition:
      "A clause is a group of words containing a subject and a verb. An independent (main) clause expresses a complete thought; a subordinate (dependent) clause does not stand alone and depends on the main clause for its meaning. Clauses are linked by subordinating conjunctions (although, because, when, if) or relative pronouns (who, which, that). AFCAT tests clause identification, punctuation, and the use of connectors.",
    examples: [
      { sentence: "The report was filed after the mission had been completed.", note: "'The report was filed' = main clause; 'after the mission had been completed' = adverbial clause." },
      { sentence: "The candidate who scored highest in the written test was selected for the interview.", note: "'who scored highest in the written test' = defining relative clause modifying 'candidate'." },
      { sentence: "What the committee decided surprised everyone at the headquarters.", note: "'What the committee decided' = noun clause acting as the subject." },
    ],
    tips: [
      "A sentence fragment is a dependent clause used alone — AFCAT error-spotting tests this: 'Because he was late.' is not a sentence.",
      "Defining (restrictive) relative clauses use 'that' or 'who/which' without commas; non-defining (non-restrictive) clauses use 'who/which' WITH commas.",
      "Comma splice error (joining two independent clauses with only a comma) is a common AFCAT correction target: use a semicolon or coordinating conjunction instead.",
    ],
    relatedSlugs: ["conjunction", "subject", "conditional", "reported-speech"],
  },

  {
    slug: "passive-voice",
    title: "Passive Voice",
    emoji: "🔀",
    shortDef: "Sentence where subject receives the action",
    category: "sentence-structure",
    color: "#dc2626",
    keywords: [
      "passive voice", "passive", "passive sentence", "is done", "was done",
      "be verb", "by agent", "passive construction", "passive form",
    ],
    definition:
      "In the passive voice, the subject of the sentence receives the action rather than performing it. The passive is formed with the appropriate tense of 'be' + past participle. The original subject (doer) becomes the agent, introduced by 'by'. Passive is used when the doer is unknown, unimportant, or deliberately omitted — common in formal and military writing. AFCAT tests active-passive transformation, agent omission, and tense in passive.",
    structure: "Subject + be (correct tense) + V3 (+ by + agent)",
    examples: [
      { sentence: "The strategic plan was approved by the Chief of Air Staff.", note: "Past simple passive: 'was approved'; agent 'by the Chief of Air Staff' is included." },
      { sentence: "All candidates will be notified of the results by the selection board.", note: "Future passive: 'will be notified'; agent included." },
      { sentence: "The damaged aircraft has been repaired and returned to service.", note: "Present perfect passive: 'has been repaired'; agent omitted (unimportant)." },
    ],
    tips: [
      "Passive voice transformation: Active: S + V + O → Passive: O + be(tense) + V3 + by + S. The tense of 'be' must match the tense of the original active verb.",
      "Intransitive verbs (arrive, die, go, come) CANNOT be made passive because they have no object.",
      "AFCAT commonly tests: 'The work was being done' (past continuous passive) and 'The order has been given' (present perfect passive) — memorise these structures.",
    ],
    relatedSlugs: ["active-voice", "auxiliary-verb", "participle", "object"],
  },

  // ─── OTHER ───────────────────────────────────────────────────────────────────

  {
    slug: "conditional",
    title: "Conditional",
    emoji: "🔁",
    shortDef: "If-then structure expressing conditions and results",
    category: "other",
    color: "#d97706",
    keywords: [
      "conditional", "conditionals", "if clause", "unless clause",
      "zero conditional", "first conditional", "second conditional",
      "third conditional", "hypothetical", "condition",
    ],
    definition:
      "Conditional sentences express a condition and its result. Type 0 (zero) expresses universal truths. Type 1 (real/possible) uses 'if + present simple, will + V1'. Type 2 (hypothetical present/future) uses 'if + past simple, would + V1'. Type 3 (hypothetical past) uses 'if + past perfect, would have + V3'. AFCAT tests correct tense combinations in conditional sentences, especially Type 2 and Type 3.",
    structure: "If + [condition tense], [result modal + V]",
    examples: [
      { sentence: "If the candidate meets all the requirements, he will be called for the interview.", note: "Type 1 conditional: real future possibility." },
      { sentence: "If the pilot had received the warning earlier, he would have diverted the aircraft.", note: "Type 3 conditional: hypothetical past — both the condition and result are in the past perfect/would have." },
      { sentence: "If the army were better equipped, it would respond more effectively.", note: "Type 2 conditional: 'were' (not 'was') is correct for hypothetical — 'were' is used for all persons." },
    ],
    tips: [
      "NEVER use 'will' in the if-clause: 'If he comes' (not 'If he will come') — this is the most common AFCAT conditional error.",
      "Type 2 hypothetical uses 'were' for ALL subjects (I, he, she, it were): 'If I were the commandant…' — 'was' is informal and should be avoided in AFCAT.",
      "Mixed conditionals combine Type 2 (present) and Type 3 (past): 'If I had studied harder, I would be an officer now' — condition in past, result in present.",
    ],
    relatedSlugs: ["modal-verb", "past-perfect", "future-simple", "clause"],
  },

  {
    slug: "reported-speech",
    title: "Reported Speech",
    emoji: "💬",
    shortDef: "Reporting what someone said without quoting directly",
    category: "other",
    color: "#d97706",
    keywords: [
      "reported speech", "indirect speech", "direct speech",
      "backshift", "tense backshift", "reporting verb",
      "say said tell told", "reported question",
    ],
    definition:
      "Reported (indirect) speech conveys what someone said without using their exact words. It requires: removing quotation marks, using a reporting verb (say, tell, ask, order), changing pronouns to match the new speaker's perspective, and backshifting tenses (present→past, past→past perfect, will→would, can→could). Time and place expressions also change (now→then, here→there, today→that day). AFCAT frequently tests tense backshift in reported statements and reported questions.",
    structure: "Reporting verb + that + [backshifted clause]",
    examples: [
      { sentence: "The commanding officer said that the mission had been a complete success.", note: "Direct: 'The mission has been a success.' Present perfect → Past perfect in reported speech." },
      { sentence: "The recruiter asked the candidate whether he had completed his graduation.", note: "Yes/no question reported with 'whether'; 'has completed' → 'had completed'." },
      { sentence: "The general ordered the troops to advance towards the objective immediately.", note: "Reporting an order uses 'ordered + object + to-infinitive'; 'advance' becomes 'to advance'." },
    ],
    tips: [
      "Tense backshift: present simple → past simple; present perfect → past perfect; will → would; can → could; may → might. Universal truths do NOT backshift.",
      "'Tell' always needs an object ('told him that…'); 'say' does not need one ('said that…') — mixing these is a very common AFCAT error.",
      "Reported questions use statement word order (subject + verb), NOT question word order: 'He asked where she was going', NOT 'He asked where was she going'.",
    ],
    relatedSlugs: ["past-simple", "past-perfect", "modal-verb", "pronoun"],
  },

  {
    slug: "degree-of-comparison",
    title: "Degree of Comparison",
    emoji: "📊",
    shortDef: "Positive, comparative, superlative forms of adjectives/adverbs",
    category: "other",
    color: "#d97706",
    keywords: [
      "degree of comparison", "comparative", "superlative", "positive degree",
      "comparative degree", "superlative degree", "more", "most",
      "than", "the most", "adjective comparison",
    ],
    definition:
      "Degrees of comparison are forms of adjectives and adverbs used to compare qualities. The positive degree describes without comparison (tall, quickly). The comparative degree compares two items, using '-er' or 'more' (taller, more quickly). The superlative degree identifies the highest degree among three or more, using '-est' or 'most' (tallest, most quickly). Irregular comparisons (good-better-best, bad-worse-worst) must be memorised.",
    structure: "Positive | Comparative (-er / more +) | Superlative (-est / most +)",
    examples: [
      { sentence: "The Rafale is faster than most aircraft currently in service.", note: "Comparative 'faster' used to compare two (or a general group of) items; followed by 'than'." },
      { sentence: "Of all the candidates, she is the most disciplined and the most articulate.", note: "Superlative used when comparing within a group of three or more; preceded by 'the'." },
      { sentence: "The new fighter jet performs better than its predecessor in all parameters.", note: "Irregular comparative 'better' from 'good'." },
    ],
    tips: [
      "Never use double comparatives or superlatives: 'more faster', 'most quickest' are WRONG — choose one method (inflection OR 'more/most').",
      "Use comparative (not superlative) when comparing exactly two things: 'She is the taller of the two', NOT 'She is the tallest of the two'.",
      "Irregular forms tested in AFCAT: good→better→best, bad→worse→worst, little→less→least, many/much→more→most, far→farther/further→farthest/furthest.",
    ],
    relatedSlugs: ["adjective", "adverb", "article", "noun"],
  },

  {
    slug: "countable-uncountable",
    title: "Countable & Uncountable Nouns",
    emoji: "🔢",
    shortDef: "Whether nouns can be counted or not",
    category: "other",
    color: "#d97706",
    keywords: [
      "countable", "uncountable", "count noun", "mass noun",
      "few", "fewer", "less", "many", "much", "a number of",
      "the amount of", "some", "any",
    ],
    definition:
      "Countable nouns can be counted individually and have both singular and plural forms (soldier/soldiers, report/reports). Uncountable (mass) nouns refer to substances, qualities, or abstractions that cannot be counted individually (information, luggage, advice, equipment, furniture). This distinction determines which determiners and pronouns to use. AFCAT tests 'few/many' (countable) vs. 'little/much' (uncountable) and article use.",
    examples: [
      { sentence: "The headquarters received little information about the enemy's movements.", note: "'information' is uncountable → 'little', not 'few'." },
      { sentence: "Fewer recruits than expected reported for duty on the first day.", note: "'recruits' is countable (plural) → 'fewer', not 'less'." },
      { sentence: "The officer gave us a great deal of advice on the selection process.", note: "'advice' is uncountable → 'a great deal of / much advice', never 'an advice' or 'advices'." },
    ],
    tips: [
      "Use 'many/few/a number of' with countable nouns; 'much/little/a great deal of' with uncountable nouns — AFCAT tests these frequently.",
      "Common uncountable nouns that students wrongly pluralise: information, advice, luggage, baggage, equipment, furniture, news, accommodation, staff, knowledge.",
      "'Less' vs. 'fewer': 'less' for uncountable (less water), 'fewer' for countable (fewer errors) — a classic AFCAT error-correction question.",
    ],
    relatedSlugs: ["noun", "article", "adjective", "degree-of-comparison"],
  },

  {
    slug: "active-voice",
    title: "Active Voice",
    emoji: "💪",
    shortDef: "Subject performs the action of the verb",
    category: "other",
    color: "#d97706",
    keywords: [
      "active voice", "active sentence", "active construction",
      "subject performs", "doer", "agent subject",
    ],
    definition:
      "In the active voice, the subject performs the action denoted by the verb. Active sentences follow the standard Subject + Verb + Object order. Active voice is generally preferred for clarity, directness, and conciseness in English. In AFCAT, transformation between active and passive voice is a standard question type, requiring knowledge of tense, object/subject swap, and auxiliary 'be' forms.",
    structure: "Subject (doer) + Verb + Object",
    examples: [
      { sentence: "The Chief of Air Staff addressed the graduating officers at the ceremony.", note: "Active: subject 'Chief of Air Staff' performs 'addressed'; 'officers' is direct object." },
      { sentence: "The engineering team has repaired all three aircraft ahead of schedule.", note: "Present perfect active; can be converted to 'All three aircraft have been repaired…'" },
      { sentence: "The selection board will announce the results next week.", note: "Future simple active; passive would be 'The results will be announced…'" },
    ],
    tips: [
      "To convert active to passive: Object of active → Subject of passive; main verb → be (correct tense) + past participle; Subject of active → by + agent (optional).",
      "If the active sentence has both a direct and indirect object, either can become the subject of the passive — AFCAT may test both options.",
      "Active voice uses fewer words and is stronger — prefer it unless the doer is unknown or unimportant.",
    ],
    relatedSlugs: ["passive-voice", "subject", "object", "verb"],
  },
];

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────

/**
 * Returns the Concept matching the given slug, or undefined if not found.
 */
export function getConceptBySlug(slug: string): Concept | undefined {
  return CONCEPTS.find((c) => c.slug === slug);
}

/**
 * Detects which grammar concepts are discussed in a given rule.
 *
 * Matches each concept's keywords against the combined text using
 * word-boundary regex so partial-word false positives are avoided.
 * Returns at most 6 concepts ordered by number of keyword hits (descending).
 *
 * @param ruleTitle - The heading / title of the grammar rule
 * @param ruleText  - The body text of the rule
 * @param extras    - Any additional text to include in matching (optional)
 */
export function detectConcepts(
  ruleTitle: string,
  ruleText: string,
  extras?: string,
): Concept[] {
  const combined = [ruleTitle, ruleText, extras ?? ""]
    .join(" ")
    .toLowerCase();

  const scored = CONCEPTS.map((concept) => {
    let hits = 0;
    for (const kw of concept.keywords) {
      // Escape special regex characters in the keyword
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // Use word boundaries; for multi-word keywords use a flexible space match
      const pattern = new RegExp(`\\b${escaped}\\b`, "i");
      if (pattern.test(combined)) {
        hits += 1;
      }
    }
    return { concept, hits };
  });

  return scored
    .filter(({ hits }) => hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 6)
    .map(({ concept }) => concept);
}
