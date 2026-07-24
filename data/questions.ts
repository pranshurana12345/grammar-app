export type Question = {
  q: string;
  options: [string, string, string, string];
  answer: number; // 0-3
};

export type RuleQuiz = {
  ruleId: number;
  questions: Question[];
};

export const QUIZ_BANK: RuleQuiz[] = [
  {
    ruleId: 0,
    questions: [
      { q: "Walk carefully, lest you ___.", options: ["should fall", "may fall", "should not fall", "will fall"], answer: 0 },
      { q: "Which sentence uses LEST correctly?", options: ["Run fast, lest you should miss the bus.", "Run fast, lest you may miss the bus.", "Run fast, lest you should not miss the bus.", "Run fast, lest you will miss the bus."], answer: 0 },
      { q: "LEST already carries a ___ meaning, so 'not' must never follow it.", options: ["negative", "positive", "conditional", "future"], answer: 0 },
      { q: "After LEST, only ___ can follow as a modal verb.", options: ["should", "may", "can", "would"], answer: 0 },
    ],
  },
  {
    ruleId: 1,
    questions: [
      { q: "Riya plays well, ___ she?", options: ["doesn't", "don't", "isn't", "hasn't"], answer: 0 },
      { q: "The earth revolves around the sun, ___ it?", options: ["doesn't", "isn't", "hasn't", "don't"], answer: 0 },
      { q: "She teaches maths, ___ she?", options: ["doesn't", "isn't", "don't", "hasn't"], answer: 0 },
      { q: "When a sentence has NO auxiliary verb, the question tag uses ___.", options: ["do / does / did", "is / are / was", "has / have / had", "will / would"], answer: 0 },
    ],
  },
  {
    ruleId: 2,
    questions: [
      { q: "I have a beautiful pen, ___ I?", options: ["don't", "haven't", "hasn't", "isn't"], answer: 0 },
      { q: "I have written a letter, ___ I?", options: ["haven't", "don't", "didn't", "isn't"], answer: 0 },
      { q: "She had a cold, ___ she?", options: ["didn't", "hadn't", "wasn't", "doesn't"], answer: 0 },
      { q: "When 'have' is followed by a V3 (past participle), it is an ___.", options: ["auxiliary verb (use haven't/didn't)", "main verb (use don't/didn't)", "stative verb", "irregular verb"], answer: 0 },
    ],
  },
  {
    ruleId: 3,
    questions: [
      { q: "Barking dogs seldom bite, ___ they?", options: ["do", "don't", "are", "aren't"], answer: 0 },
      { q: "He has little patience, ___ he?", options: ["does", "doesn't", "has", "hasn't"], answer: 0 },
      { q: "Few students passed, ___ they?", options: ["did", "didn't", "were", "weren't"], answer: 0 },
      { q: "Words like seldom, hardly, never, and few make a sentence ___, so the tag must be ___.", options: ["negative, positive", "positive, negative", "neutral, neutral", "conditional, conditional"], answer: 0 },
    ],
  },
  {
    ruleId: 4,
    questions: [
      { q: "Let's go to the park, ___ we?", options: ["shall", "will", "don't", "won't"], answer: 0 },
      { q: "Let's not argue, ___ we?", options: ["shall", "will", "don't", "shan't"], answer: 0 },
      { q: "Let's sing a song, ___ we?", options: ["shall", "will", "won't", "can"], answer: 0 },
      { q: "For ALL 'Let's' sentences — positive or negative — the tag is ALWAYS ___.", options: ["shall we?", "will we?", "can we?", "won't we?"], answer: 0 },
    ],
  },
  {
    ruleId: 5,
    questions: [
      { q: "He should stay, ___ he?", options: ["shouldn't", "won't", "didn't", "doesn't"], answer: 0 },
      { q: "He need not go, ___ he?", options: ["need", "doesn't", "won't", "isn't"], answer: 0 },
      { q: "You used to smoke, ___ you?", options: ["didn't", "used to", "wouldn't", "don't"], answer: 0 },
      { q: "I am correct, ___ I? (no 'amn't' in English!)", options: ["aren't", "amn't", "isn't", "am"], answer: 0 },
    ],
  },
  {
    ruleId: 6,
    questions: [
      { q: "Nobody was present, ___ they?", options: ["were", "was", "are", "weren't"], answer: 0 },
      { q: "Nothing was available, ___ it?", options: ["was", "were", "is", "isn't"], answer: 0 },
      { q: "Everybody agrees, ___ they?", options: ["don't", "doesn't", "do", "aren't"], answer: 0 },
      { q: "PERSONS (Everybody/Nobody) → tag uses ___ | THINGS (Everything/Nothing) → tag uses ___.", options: ["they, it", "it, they", "he, she", "she, he"], answer: 0 },
    ],
  },
  {
    ruleId: 7,
    questions: [
      { q: "Shut the window, ___ you? (affirmative imperative)", options: ["will you / won't you (both OK)", "shall we", "do you", "would you"], answer: 0 },
      { q: "Don't shut the window, ___ you? (negative imperative)", options: ["will", "won't", "shall", "would"], answer: 0 },
      { q: "Get out of here, ___ you?", options: ["can you / can't you (both OK)", "will you only", "shall we", "do you"], answer: 0 },
      { q: "For NEGATIVE imperatives (Don't…), only ___ tag is allowed.", options: ["will you?", "won't you?", "shall we?", "can you?"], answer: 0 },
    ],
  },
  {
    ruleId: 8,
    questions: [
      { q: "Which sentence is CORRECT?", options: ["I love you.", "I am loving you.", "I am knowing him.", "She is seeming tired."], answer: 0 },
      { q: "The food tastes ___. (stative verb → adjective)", options: ["bitter", "bitterly", "bitterest", "more bitterly"], answer: 0 },
      { q: "Stative verbs (love, know, think) cannot be used in ___ form.", options: ["continuous (-ing)", "simple past", "perfect", "infinitive"], answer: 0 },
      { q: "Which is a STATIVE (non-action) verb?", options: ["know", "run", "jump", "write"], answer: 0 },
    ],
  },
  {
    ruleId: 9,
    questions: [
      { q: "He fought ___ the wolf. (intransitive)", options: ["with", "directly", "for", "at"], answer: 0 },
      { q: "A TRANSITIVE verb requires ___.", options: ["a direct object", "a preposition", "no object", "only an indirect object"], answer: 0 },
      { q: "Which verb is INTRANSITIVE in: 'He ran fast'?", options: ["ran (no direct object)", "He", "fast", "None"], answer: 0 },
      { q: "She presented ___ a ring. (transitive)", options: ["him", "to him", "for him", "at him"], answer: 0 },
    ],
  },
  {
    ruleId: 10,
    questions: [
      { q: "V3 (past participle) of a verb is used in ___ tenses.", options: ["Perfect tenses and passive", "Simple past only", "Continuous tense only", "Simple present only"], answer: 0 },
      { q: "The V4 form (e.g., 'giving') is used in ___.", options: ["continuous tenses and as gerund/participle", "simple past", "perfect tenses", "simple present singular"], answer: 0 },
      { q: "'Gives' is which form of 'give'?", options: ["V5 (singular present)", "V1", "V2", "V3"], answer: 0 },
      { q: "How many forms does every regular/irregular verb have?", options: ["5", "3", "4", "6"], answer: 0 },
    ],
  },
  {
    ruleId: 11,
    questions: [
      { q: "The news was ___ last night.", options: ["broadcast", "broadcasted", "broadcasting", "broadcasts"], answer: 0 },
      { q: "Which is WRONG?", options: ["The program was telecasted.", "She cut the paper.", "He put the book down.", "The teacher taught us well."], answer: 0 },
      { q: "He ___ the paper carefully.", options: ["cut", "cutted", "cuted", "had cut"], answer: 0 },
      { q: "Verbs like broadcast, cast, cut, put, shut have the SAME form for V2 and V3. So you should NEVER add ___.", options: ["-ed", "-s", "-ing", "'s"], answer: 0 },
    ],
  },
  {
    ruleId: 12,
    questions: [
      { q: "The river has ___ its banks.", options: ["overflowed", "overflown", "overflow", "overflies"], answer: 0 },
      { q: "Poor Tom ___ in the shade. (past of 'lie' = recline)", options: ["lay", "lied", "laid", "lain"], answer: 0 },
      { q: "Raj has ___ the trees. (cut them down)", options: ["felled", "fallen", "flew", "flown"], answer: 0 },
      { q: "Which is CORRECT for 'lie' (recline)?  V1 → V2 → V3", options: ["lie → lay → lain", "lie → lied → lied", "lie → lay → laid", "lie → lain → lain"], answer: 0 },
    ],
  },
  {
    ruleId: 13,
    questions: [
      { q: "The ship has ___. (verb use)", options: ["sunk", "sunken", "sank", "sinked"], answer: 0 },
      { q: "I saw a ___ ship. (adjective before noun)", options: ["sunken", "sunk", "sank", "sunked"], answer: 0 },
      { q: "A ___ driver caused the accident. (adjective use)", options: ["drunken", "drunk", "drinked", "drunked"], answer: 0 },
      { q: "The 'adjective V3' form (sunken, drunken) is used ___.", options: ["before a noun", "after 'have'", "in passive voice", "in questions"], answer: 0 },
    ],
  },
  {
    ruleId: 14,
    questions: [
      { q: "Which is NOT a form of the 'be' verb?", options: ["done", "been", "being", "were"], answer: 0 },
      { q: "How many forms does the 'be' verb have?", options: ["8", "5", "3", "6"], answer: 0 },
      { q: "V3 of 'be' is ___.", options: ["been", "being", "was", "is"], answer: 0 },
      { q: "V4 (-ing) of 'be' is ___.", options: ["being", "been", "is", "were"], answer: 0 },
    ],
  },
  {
    ruleId: 15,
    questions: [
      { q: "Food, as well as water, ___ essential.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "The owner, as well as his servants, ___ present.", options: ["was", "were", "have been", "are"], answer: 0 },
      { q: "Sita, with all her sisters, ___ there.", options: ["was", "were", "have been", "are"], answer: 0 },
      { q: "With 'as well as', 'along with', 'together with', verb agrees with ___.", options: ["the FIRST (main) subject", "the SECOND subject", "the NEAREST subject", "always plural"], answer: 0 },
    ],
  },
  {
    ruleId: 16,
    questions: [
      { q: "Many a student ___ here.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "More than one student ___ present.", options: ["was", "were", "have been", "are"], answer: 0 },
      { q: "Which is CORRECT?", options: ["Many a man has tried.", "Many a men have tried.", "Many a men has tried.", "Many men has tried."], answer: 0 },
      { q: "'Many students ARE here' uses plural because ___.", options: ["there is no 'a' before students", "'many' is always plural", "the noun is plural", "No specific rule"], answer: 0 },
    ],
  },
  {
    ruleId: 17,
    questions: [
      { q: "A number of people ___ here.", options: ["are", "is", "was", "has been"], answer: 0 },
      { q: "The number of jobs ___ decreasing.", options: ["is", "are", "have been", "were"], answer: 0 },
      { q: "Which is CORRECT?", options: ["The number of accidents is rising.", "The number of accidents are rising.", "A number of accident is rising.", "A number of accidents is rising."], answer: 0 },
      { q: "'A number of' → ___ verb | 'The number of' → ___ verb", options: ["plural, singular", "singular, plural", "both plural", "both singular"], answer: 0 },
    ],
  },
  {
    ruleId: 18,
    questions: [
      { q: "A set of keys ___ missing.", options: ["are", "is", "was", "has been"], answer: 0 },
      { q: "A crowd of people ___ gathered.", options: ["were", "was", "is", "has been"], answer: 0 },
      { q: "Which phrase ALWAYS takes a plural verb?", options: ["A crowd of", "The number of", "The group of (acting as unit)", "Mathematics"], answer: 0 },
      { q: "A band of musicians ___ performing tonight.", options: ["are", "is", "was", "has been"], answer: 0 },
    ],
  },
  {
    ruleId: 19,
    questions: [
      { q: "One of the boys ___ here.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "He is one of the students who ___ intelligent.", options: ["are", "is", "was", "has been"], answer: 0 },
      { q: "Neither of the candidates ___ suitable.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "In 'One of the boys IS here' — what form does 'boys' take?", options: ["Plural noun (boys) + singular verb", "Singular noun + singular verb", "Plural noun + plural verb", "No fixed rule"], answer: 0 },
    ],
  },
  {
    ruleId: 20,
    questions: [
      { q: "Nobody ___ present at the meeting.", options: ["was", "were", "have been", "are"], answer: 0 },
      { q: "No one ___ right.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "'Nobody was there' — what is the correct tag?", options: ["were they?", "was they?", "weren't they?", "wasn't it?"], answer: 0 },
      { q: "Negative-sounding subjects (nobody, no one, never) take ___ verb.", options: ["singular", "plural", "either", "depends on noun"], answer: 0 },
    ],
  },
  {
    ruleId: 21,
    questions: [
      { q: "Either Vikas or his friends ___ going.", options: ["are", "is", "was", "has been"], answer: 0 },
      { q: "Neither the operator nor the foreman ___ present.", options: ["was", "were", "are", "have been"], answer: 0 },
      { q: "Either he or I ___ mistaken.", options: ["am", "are", "is", "was"], answer: 0 },
      { q: "With 'Either…or / Neither…nor', the verb agrees with the ___ subject.", options: ["NEAREST", "FIRST", "always singular", "always plural"], answer: 0 },
    ],
  },
  {
    ruleId: 22,
    questions: [
      { q: "Five miles ___ a long distance.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "Ten thousand rupees ___ not enough.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "Two hours ___ a long time.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "When money/time/distance is treated as a ___, it takes a singular verb.", options: ["single unit", "collection", "measurement", "quantity"], answer: 0 },
    ],
  },
  {
    ruleId: 23,
    questions: [
      { q: "Most of the students ___ done their work.", options: ["have", "has", "is", "was"], answer: 0 },
      { q: "Most of the milk ___ spilled.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "'Most of' + uncountable noun → ___ verb", options: ["singular", "plural", "either", "depends on context"], answer: 0 },
      { q: "'Most of' + plural countable noun → ___ verb", options: ["plural", "singular", "either", "depends on context"], answer: 0 },
    ],
  },
  {
    ruleId: 24,
    questions: [
      { q: "The patient died after the doctor ___.", options: ["had come", "came", "has come", "was coming"], answer: 0 },
      { q: "The patient ___ before the doctor came.", options: ["had died", "died", "has died", "was dying"], answer: 0 },
      { q: "Which uses past perfect CORRECTLY?", options: ["He had left before she arrived.", "He left before she had arrived.", "He was leaving before she had arrived.", "He left when she arrived."], answer: 0 },
      { q: "Of two past actions, the one that happened FIRST gets ___.", options: ["Past Perfect (had + V3)", "Simple Past (V2)", "Present Perfect", "Past Continuous"], answer: 0 },
    ],
  },
  {
    ruleId: 25,
    questions: [
      { q: "It's time Rahul ___.", options: ["went", "goes", "is going", "has gone"], answer: 0 },
      { q: "It's high time she ___ her work.", options: ["did", "does", "is doing", "will do"], answer: 0 },
      { q: "It's about time you ___ studying.", options: ["started", "start", "are starting", "will start"], answer: 0 },
      { q: "After 'It's time / It's high time', always use ___.", options: ["V2 (past tense form)", "V1 (base form)", "V3 (past participle)", "V4 (-ing form)"], answer: 0 },
    ],
  },
  {
    ruleId: 26,
    questions: [
      { q: "If it ___, I will stay home. (Type 1 conditional)", options: ["rains", "will rain", "would rain", "has rained"], answer: 0 },
      { q: "If it rained, I ___ stay home. (Type 2 conditional)", options: ["would", "will", "shall", "did"], answer: 0 },
      { q: "If I had taught, you ___ eaten. (Type 3 conditional)", options: ["would have", "will have", "had", "should"], answer: 0 },
      { q: "In conditional sentences, the IF clause must NEVER contain ___.", options: ["will", "would", "should", "could"], answer: 0 },
    ],
  },
  {
    ruleId: 27,
    questions: [
      { q: "Though he is poor, ___ he is honest.", options: ["yet", "but", "however", "still"], answer: 0 },
      { q: "Which is CORRECT?", options: ["Though she is tired, yet she works.", "Though she is tired, but she works.", "Although she is tired, yet she works.", "Though she is tired, yet but she works."], answer: 0 },
      { q: "'Though…but' is WRONG because ___.", options: ["you can't use two contrast conjunctions together", "but is a preposition", "though cannot start a sentence", "yet is wrong in formal writing"], answer: 0 },
      { q: "'Though' pairs with ___ (or nothing).", options: ["yet", "but", "however", "while"], answer: 0 },
    ],
  },
  {
    ruleId: 28,
    questions: [
      { q: "She will come ___ it rains. (future hypothetical)", options: ["even if", "even though", "although", "despite"], answer: 0 },
      { q: "He went to work ___ it was raining. (already happened)", options: ["even though", "even if", "unless", "lest"], answer: 0 },
      { q: "'Even if' is used for ___ situations.", options: ["hypothetical / future possibilities", "completed / real actions", "both", "neither"], answer: 0 },
      { q: "'Even though' is used for ___ situations.", options: ["completed / real actions", "hypothetical future", "impossible conditions", "general truths"], answer: 0 },
    ],
  },
  {
    ruleId: 29,
    questions: [
      { q: "Unless you work hard, you will ___.", options: ["fail", "not fail", "succeed", "never fail"], answer: 0 },
      { q: "Which is CORRECT?", options: ["Unless you come, I won't go.", "Unless you don't come, I won't go.", "Until he doesn't come, don't leave.", "Unless if he doesn't come, I'll go."], answer: 0 },
      { q: "'Unless' means ___.", options: ["if not", "although", "because", "when"], answer: 0 },
      { q: "Why can't 'not' follow 'unless' or 'until'?", options: ["They are already negative in meaning.", "They are positive conjunctions.", "Grammar tradition only.", "They work only in questions."], answer: 0 },
    ],
  },
  {
    ruleId: 30,
    questions: [
      { q: "I don't know ___ she loves me or not.", options: ["whether", "if", "that", "when"], answer: 0 },
      { q: "I don't know ___ she loves me. (both options?)", options: ["whether / if (both OK)", "only 'whether'", "only 'if'", "neither"], answer: 0 },
      { q: "With 'or not', you MUST use ___.", options: ["whether", "if", "both are OK", "neither"], answer: 0 },
      { q: "Which is WRONG?", options: ["I don't know if she will come or not.", "I don't know whether she will come.", "I don't know whether or not she will come.", "I don't know if she will come."], answer: 0 },
    ],
  },
  {
    ruleId: 31,
    questions: [
      { q: "If I ___ you, I would study harder.", options: ["were", "was", "am", "had been"], answer: 0 },
      { q: "I wish I ___ taller.", options: ["were", "was", "am", "had been"], answer: 0 },
      { q: "If he ___ rich, he would help everyone.", options: ["were", "was", "is", "has been"], answer: 0 },
      { q: "In wish / suppose / unreal if-clauses, use ___ for ALL subjects (including he/she/it).", options: ["were", "was", "is", "had"], answer: 0 },
    ],
  },
  {
    ruleId: 32,
    questions: [
      { q: "Each of the students ___ here.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "Everyone ___ done their work.", options: ["has", "have", "are", "were"], answer: 0 },
      { q: "Neither of them ___ qualified.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "Pronouns like each, either, neither, everyone take a ___ verb.", options: ["singular", "plural", "either", "depends on context"], answer: 0 },
    ],
  },
  {
    ruleId: 33,
    questions: [
      { q: "I met the person ___ everybody loves. (everybody=subject, loves=verb — matched)", options: ["whom", "who", "which", "that"], answer: 0 },
      { q: "I met the person ___ I think was arrested. (was needs a subject)", options: ["who", "whom", "which", "that"], answer: 0 },
      { q: "The quick test for WHO vs WHOM: if every verb already has a subject, use ___.", options: ["whom", "who", "which", "that"], answer: 0 },
      { q: "For non-living things, which pronoun replaces 'who/whom'?", options: ["which / that", "what", "whose", "where"], answer: 0 },
    ],
  },
  {
    ruleId: 34,
    questions: [
      { q: "All ___ glitters is not gold.", options: ["that", "which", "who", "what"], answer: 0 },
      { q: "This is the same girl ___ met me yesterday.", options: ["that", "who", "which", "whom"], answer: 0 },
      { q: "He is the best student ___ I have seen.", options: ["that", "who", "which", "whom"], answer: 0 },
      { q: "After superlatives (best, first, only, same), which relative pronoun is COMPULSORY?", options: ["that", "who", "which", "whom"], answer: 0 },
    ],
  },
  {
    ruleId: 35,
    questions: [
      { q: "Both brothers love ___.", options: ["each other", "one another", "themselves", "himself"], answer: 0 },
      { q: "All five students help ___.", options: ["one another", "each other", "themselves", "himself"], answer: 0 },
      { q: "'Each other' is used for exactly ___ people.", options: ["two", "three", "four or more", "any group"], answer: 0 },
      { q: "The two friends helped ___.", options: ["each other", "one another", "themselves", "themselves each"], answer: 0 },
    ],
  },
  {
    ruleId: 36,
    questions: [
      { q: "I want a favour ___ you.", options: ["from", "of your", "your", "by"], answer: 0 },
      { q: "Mention ___ him was made at the meeting.", options: ["of", "about his", "his", "by"], answer: 0 },
      { q: "Which is CORRECT?", options: ["In the sight of him", "In his sight", "In him's sight", "At his sight"], answer: 0 },
      { q: "Words like 'favour', 'mention', 'sight', 'report' (SEMFLRS) cannot take a ___ before them.", options: ["possessive adjective (his/your/her)", "preposition", "article", "adjective"], answer: 0 },
    ],
  },
  {
    ruleId: 37,
    questions: [
      { q: "In a POSITIVE sentence, the correct person-order is ___.", options: ["2nd → 3rd → 1st (You, He, I)", "1st → 2nd → 3rd", "3rd → 2nd → 1st", "Any order is fine"], answer: 0 },
      { q: "Which is CORRECT? (positive sentence)", options: ["You, Ram, and I went to the market.", "Ram, you, and I went to the market.", "I, you, and Ram went to the market.", "Ram, I, and you went to the market."], answer: 0 },
      { q: "In NEGATIVE sentences, the person-order is ___.", options: ["1st → 2nd → 3rd (I, you, he)", "2nd → 3rd → 1st", "3rd → 2nd → 1st", "Any order"], answer: 0 },
      { q: "Which is CORRECT? (taking responsibility — negative)", options: ["I, you, and Ram are responsible.", "You, Ram, and I are responsible.", "Ram, you, and I are responsible.", "He, you, and I are responsible."], answer: 0 },
    ],
  },
  {
    ruleId: 38,
    questions: [
      { q: "I saw her ___ at night. (doing something — participle)", options: ["studying", "study", "to study", "studied"], answer: 0 },
      { q: "He enjoys ___. (as noun — gerund)", options: ["reading", "read", "to read", "reads"], answer: 0 },
      { q: "___ is human. (as subject — infinitive)", options: ["To err", "Erring", "Error", "Erred"], answer: 0 },
      { q: "A gerund functions as a ___.", options: ["noun", "adjective", "adverb", "helping verb"], answer: 0 },
    ],
  },
  {
    ruleId: 39,
    questions: [
      { q: "I am looking forward to ___ you.", options: ["meeting", "meet", "met", "meetings"], answer: 0 },
      { q: "He is used to ___.", options: ["smoking", "smoke", "smoked", "smokes"], answer: 0 },
      { q: "I can't help ___.", options: ["laughing", "laugh", "to laugh", "laughed"], answer: 0 },
      { q: "After 'with a view to', 'looking forward to', 'is used to', always use ___ form.", options: ["V-ing (gerund)", "V1 (base)", "V3 (participle)", "to + V1 (infinitive)"], answer: 0 },
    ],
  },
  {
    ruleId: 40,
    questions: [
      { q: "I don't mind ___ studying late.", options: ["his", "him", "he", "himself"], answer: 0 },
      { q: "___ singing is beautiful.", options: ["Your", "You", "Yourself", "You're"], answer: 0 },
      { q: "I appreciate ___ coming early.", options: ["his", "him", "he", "himself"], answer: 0 },
      { q: "Before a gerund (V-ing used as noun), use ___.", options: ["possessive adjective (my/his/her/their)", "objective pronoun (me/him/her)", "reflexive pronoun", "subject pronoun"], answer: 0 },
    ],
  },
  {
    ruleId: 41,
    questions: [
      { q: "Divya planned ___ home.", options: ["not to go", "to not go", "not going", "to going"], answer: 0 },
      { q: "He decided ___ early.", options: ["not to leave", "to not leave", "to leaving", "not leaving"], answer: 0 },
      { q: "Which is a SPLIT INFINITIVE (incorrect)?", options: ["to boldly go", "not to go", "to go quickly", "to have gone"], answer: 0 },
      { q: "In 'not to go', 'not' comes ___ 'to' — this is correct.", options: ["before", "after", "inside", "either side of"], answer: 0 },
    ],
  },
  {
    ruleId: 42,
    questions: [
      { q: "I heard her ___.", options: ["sing", "to sing", "singing", "sung"], answer: 0 },
      { q: "He let me ___.", options: ["go", "to go", "going", "gone"], answer: 0 },
      { q: "I bade him ___ the work.", options: ["do", "to do", "doing", "done"], answer: 0 },
      { q: "He would rather ___ than beg.", options: ["die", "to die", "dying", "died"], answer: 0 },
    ],
  },
  {
    ruleId: 43,
    questions: [
      { q: "I had better ___ him now.", options: ["help", "helped", "helping", "to help"], answer: 0 },
      { q: "May you ___ long.", options: ["live", "lived", "living", "to live"], answer: 0 },
      { q: "Should he ___, I will go.", options: ["come", "came", "coming", "to come"], answer: 0 },
      { q: "All modal verbs (can, should, would, must…) are followed by ___.", options: ["V1 (base form)", "V2 (past form)", "V3 (past participle)", "V4 (-ing form)"], answer: 0 },
    ],
  },
  {
    ruleId: 44,
    questions: [
      { q: "Plural of 'father-in-law' is ___.", options: ["fathers-in-law", "father-in-laws", "fathers-in-laws", "father-in-law's"], answer: 0 },
      { q: "Plural of 'commander-in-chief' is ___.", options: ["commanders-in-chief", "commander-in-chiefs", "commanders-in-chiefs", "commander-in-chieves"], answer: 0 },
      { q: "For possession, 'father-in-law' becomes ___.", options: ["father-in-law's (apostrophe on last word)", "father's-in-law", "fathers-in-law's", "fathers'-in-law"], answer: 0 },
      { q: "In hyphenated compound nouns, add '-s' to ___.", options: ["the MAIN/HEAD word", "the last word always", "every word", "the first word"], answer: 0 },
    ],
  },
  {
    ruleId: 45,
    questions: [
      { q: "The jury ___ called. (acting as a unit)", options: ["was", "were", "are", "have been"], answer: 0 },
      { q: "The jury ___ divided in opinion. (individuals disagreeing)", options: ["were", "was", "is", "has been"], answer: 0 },
      { q: "The jury gave a unanimous verdict, ___ it? (as unit)", options: ["didn't", "didn't they?", "weren't they?", "wasn't they?"], answer: 0 },
      { q: "Collective nouns (jury, committee, team) take ___ when acting as individuals.", options: ["plural verb", "singular verb", "either form", "no verb"], answer: 0 },
    ],
  },
  {
    ruleId: 46,
    questions: [
      { q: "Day ___ day he is becoming weaker.", options: ["by", "after", "with", "to"], answer: 0 },
      { q: "Page ___ page was filled with notes.", options: ["after", "by", "with", "in"], answer: 0 },
      { q: "Which is CORRECT?", options: ["Day by day IS correct.", "Days by days is correct.", "Day by days is correct.", "Days by day is correct."], answer: 0 },
      { q: "When the same noun is repeated with a preposition, use ___ form and ___ verb.", options: ["singular noun, singular verb", "plural noun, plural verb", "plural noun, singular verb", "singular noun, plural verb"], answer: 0 },
    ],
  },
  {
    ruleId: 47,
    questions: [
      { q: "'Rahul is the Virat Kohli of our class' means ___.", options: ["Rahul is the best cricketer in the class", "Rahul personally knows Virat Kohli", "Rahul looks like Virat Kohli", "Rahul plays for the same team as Virat"], answer: 0 },
      { q: "Adding THE before a proper noun turns it into a ___.", options: ["common noun / category", "specific proper noun", "superlative", "title"], answer: 0 },
      { q: "'She is the Mother Teresa of our school' implies she is ___.", options: ["very kind and selfless", "from Kolkata", "a nun", "very old"], answer: 0 },
      { q: "Which is grammatically CORRECT?", options: ["He is the Shakespeare of his generation.", "He is a Shakespeare of his generation.", "He is Shakespeare of his generation.", "He is an Shakespeare."], answer: 0 },
    ],
  },
  {
    ruleId: 48,
    questions: [
      { q: "Which sentence implies almost nobody came?", options: ["Few people came.", "A few people came.", "The few people came.", "Some people came."], answer: 0 },
      { q: "Which is HOPEFUL / POSITIVE?", options: ["A few people were present.", "Few people were present.", "The few people were present.", "Very few were present."], answer: 0 },
      { q: "'The few friends he has came to help' — 'the few' means ___.", options: ["all of his small number of friends", "almost no friends", "some friends", "many friends"], answer: 0 },
      { q: "'Little money' vs 'A little money' — which implies NO hope?", options: ["Little money (= almost none)", "A little money (= some)", "The little money", "Both are the same"], answer: 0 },
    ],
  },
  {
    ruleId: 49,
    questions: [
      { q: "The news ___ good today.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "This equipment ___ broken.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "Which word is COUNTABLE (can take plural '-s')?", options: ["book", "furniture", "luggage", "information"], answer: 0 },
      { q: "Which is WRONG?", options: ["These furnitures are new.", "The furniture is new.", "This luggage is heavy.", "The information is useful."], answer: 0 },
    ],
  },
  {
    ruleId: 50,
    questions: [
      { q: "Mathematics ___ an interesting subject.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "Statistics ___ compulsory in this course. (as a subject)", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "'Mathematics tell us he has a lot of money' — here 'tell' is used because Mathematics = ___.", options: ["calculations / data", "the teacher", "the textbook", "a student"], answer: 0 },
      { q: "When does 'Statistics' take a PLURAL verb?", options: ["When referring to data or calculations", "Always", "Never", "When it appears at the end"], answer: 0 },
    ],
  },
  {
    ruleId: 51,
    questions: [
      { q: "The data ___ clear.", options: ["are", "is", "was", "has been"], answer: 0 },
      { q: "The singular of 'phenomena' is ___.", options: ["phenomenon", "phenomenas", "phenomene", "phenomenons"], answer: 0 },
      { q: "The singular of 'criteria' is ___.", options: ["criterion", "criterium", "criterias", "critera"], answer: 0 },
      { q: "The singular of 'alumni' (male) is ___.", options: ["alumnus", "alumna", "alumnos", "alumni (no change)"], answer: 0 },
    ],
  },
  {
    ruleId: 52,
    questions: [
      { q: "He advised ___ his friend. (no preposition after 'advise')", options: ["(directly — no preposition)", "to his friend", "for his friend", "about his friend"], answer: 0 },
      { q: "Neha attacked ___ Rahul.", options: ["(directly — no 'on')", "on Rahul", "at Rahul", "to Rahul"], answer: 0 },
      { q: "She invited ___ me. (no preposition)", options: ["(directly — no preposition)", "to me", "for me", "upon me"], answer: 0 },
      { q: "Which verb takes NO preposition before its object?", options: ["attack", "listen", "look", "aim"], answer: 0 },
    ],
  },
  {
    ruleId: 53,
    questions: [
      { q: "He stood ___ in class.", options: ["the first", "the one", "first", "one"], answer: 0 },
      { q: "He won ___ position in the competition.", options: ["the ninth", "ninth", "the nine", "nine"], answer: 0 },
      { q: "Which numbers take THE?", options: ["Ordinal (first, second, third…)", "Cardinal (one, two, three…)", "Both", "Neither"], answer: 0 },
      { q: "Which sentence is correct?", options: ["He stood the first in class.", "He stood the one in class.", "He stood firstly in class.", "He stood a first in class."], answer: 0 },
    ],
  },
  {
    ruleId: 54,
    questions: [
      { q: "This is ___ book. (before a noun)", options: ["my", "mine", "me", "myself"], answer: 0 },
      { q: "This book is ___. (stands alone — no noun after)", options: ["mine", "my", "me", "myself"], answer: 0 },
      { q: "Possessive ADJECTIVE (my/her/his) goes ___ a noun. Possessive PRONOUN (mine/hers/his) ___ alone.", options: ["before, stands", "after, stands", "before, comes before", "after, comes after"], answer: 0 },
      { q: "Before a gerund (V-ing as noun), use ___.", options: ["possessive adjective (my/his/her)", "objective pronoun (me/him/her)", "subject pronoun (I/he/she)", "reflexive pronoun (myself)"], answer: 0 },
    ],
  },
  {
    ruleId: 55,
    questions: [
      { q: "He walked ___ (correct adverb order: M-P-T)", options: ["slowly home yesterday", "home slowly yesterday", "yesterday home slowly", "slowly yesterday home"], answer: 0 },
      { q: "EMPT stands for ___.", options: ["Emphasis, Manner, Place, Time", "Emphasis, Movement, Position, Time", "Early, Middle, Place, Tense", "Exact, Manner, Place, Tense"], answer: 0 },
      { q: "What is the correct order of multiple adverbs?", options: ["Manner → Place → Time", "Time → Place → Manner", "Place → Manner → Time", "Any order is acceptable"], answer: 0 },
      { q: "Which is CORRECT?", options: ["She sang beautifully in the hall yesterday.", "She sang yesterday in the hall beautifully.", "She beautifully in the hall yesterday sang.", "She in the hall sang beautifully yesterday."], answer: 0 },
    ],
  },
  {
    ruleId: 56,
    questions: [
      { q: "___ hour (h is silent)", options: ["an", "a", "the", "no article"], answer: 0 },
      { q: "___ European ('yu' sound at the start)", options: ["a", "an", "the", "no article"], answer: 0 },
      { q: "___ X-ray ('eks' sound)", options: ["an", "a", "the", "no article"], answer: 0 },
      { q: "The rule for A/AN is based on ___.", options: ["the SOUND of the first syllable", "the first letter of the word", "whether the word is a noun", "the number of syllables"], answer: 0 },
    ],
  },
  {
    ruleId: 57,
    questions: [
      { q: "He went to ___ school. (to study — primary purpose)", options: ["school (no 'the')", "the school", "a school", "his school"], answer: 0 },
      { q: "He went to ___ school to meet the principal. (secondary purpose)", options: ["the school", "school", "a school", "one school"], answer: 0 },
      { q: "She was taken to ___ hospital. (as a patient)", options: ["hospital (no 'the')", "the hospital", "a hospital", "her hospital"], answer: 0 },
      { q: "Using 'the' before school/hospital implies the person is there for ___.", options: ["a secondary purpose (not the primary one)", "the primary purpose", "a first-time visit", "the best-known place"], answer: 0 },
    ],
  },
  {
    ruleId: 58,
    questions: [
      { q: "She studied ___ for three years.", options: ["English (no article)", "the English", "an English", "a English"], answer: 0 },
      { q: "'The English' (with THE) refers to ___.", options: ["the people of England", "the English language", "English food", "an English person"], answer: 0 },
      { q: "'The poor need our help' — 'the poor' means ___.", options: ["the whole community of poor people", "a specific poor person", "some poor people", "those who are a little poor"], answer: 0 },
      { q: "Which is CORRECT?", options: ["She speaks French fluently.", "She speaks the French fluently.", "She speaks a French fluently.", "She speaks French's fluently."], answer: 0 },
    ],
  },
  {
    ruleId: 59,
    questions: [
      { q: "He prefers coffee ___ tea.", options: ["to", "than", "over", "from"], answer: 0 },
      { q: "I am senior ___ him.", options: ["to", "than", "of", "from"], answer: 0 },
      { q: "This product is inferior ___ that one.", options: ["to", "than", "from", "of"], answer: 0 },
      { q: "Words ending in -ior (superior, inferior, junior, senior) + the verb PREFER use ___ for comparison.", options: ["to", "than", "from", "over"], answer: 0 },
    ],
  },
  {
    ruleId: 60,
    questions: [
      { q: "I have been studying ___ two hours.", options: ["for", "since", "from", "during"], answer: 0 },
      { q: "I have been here ___ Monday.", options: ["since", "for", "from", "during"], answer: 0 },
      { q: "I have been here ___ last week.", options: ["since", "for", "from", "during"], answer: 0 },
      { q: "FOR → duration | SINCE → point. Which uses FOR correctly?", options: ["for two days", "for Monday", "for morning", "for last year"], answer: 0 },
    ],
  },
  {
    ruleId: 61,
    questions: [
      { q: "He died ___ cancer.", options: ["of", "from", "by", "in"], answer: 0 },
      { q: "He died ___ an accident.", options: ["in", "of", "by", "from"], answer: 0 },
      { q: "He died ___ his wounds.", options: ["from", "of", "by", "in"], answer: 0 },
      { q: "He died ___ the sword.", options: ["by", "with", "of", "from"], answer: 0 },
    ],
  },
  {
    ruleId: 62,
    questions: [
      { q: "He came ___ foot.", options: ["on", "by", "in", "with"], answer: 0 },
      { q: "He travelled ___ train.", options: ["by", "on", "in", "with"], answer: 0 },
      { q: "He travelled ___ Vande Bharat. (specific named vehicle)", options: ["in", "by", "on", "with"], answer: 0 },
      { q: "He went ___ bicycle. (exception — not 'by'!)", options: ["on", "by", "in", "with"], answer: 0 },
    ],
  },
  {
    ruleId: 63,
    questions: [
      { q: "Neha ordered ___. (verb — no preposition)", options: ["coffee (nothing in between)", "for coffee", "a coffee for", "towards coffee"], answer: 0 },
      { q: "Which is CORRECT?", options: ["She ordered lunch.", "She ordered for lunch.", "She ordered to lunch.", "She ordered at lunch."], answer: 0 },
      { q: "Neha gave an order ___ coffee. ('order' as noun)", options: ["for", "(nothing)", "of", "to"], answer: 0 },
      { q: "When 'order' is a VERB, use ___ preposition between it and its object.", options: ["no", "for", "to", "of"], answer: 0 },
    ],
  },
  {
    ruleId: 64,
    questions: [
      { q: "He jumped ___ the well. (was outside, now inside)", options: ["into", "in", "upon", "onto"], answer: 0 },
      { q: "Translate the passage ___ Hindi.", options: ["into", "in", "to", "for"], answer: 0 },
      { q: "'Into' implies ___.", options: ["movement from outside to inside", "static location", "movement within the same area", "upward movement"], answer: 0 },
      { q: "The water was ___ the bottle. (static location)", options: ["in", "into", "onto", "upon"], answer: 0 },
    ],
  },
  {
    ruleId: 65,
    questions: [
      { q: "The rain fell ___ the ground. (from above downward)", options: ["upon", "on", "onto", "into"], answer: 0 },
      { q: "He climbed ___ the roof. (from below upward)", options: ["onto", "upon", "on", "into"], answer: 0 },
      { q: "The cat sat ___ the mat. (resting / static)", options: ["on", "upon", "onto", "into"], answer: 0 },
      { q: "'Onto' implies movement from ___ to ___.", options: ["below, above (upward)", "above, below (downward)", "outside, inside", "inside, outside"], answer: 0 },
    ],
  },
  {
    ruleId: 66,
    questions: [
      { q: "He is ___ intelligent. (qualifies adjective)", options: ["so", "such", "very much", "too much"], answer: 0 },
      { q: "He is ___ an idiot. (qualifies noun)", options: ["such", "so", "very", "too"], answer: 0 },
      { q: "SO qualifies ___ and SUCH qualifies ___.", options: ["adjectives/adverbs, nouns", "nouns, adjectives", "both nouns, only adverbs", "neither"], answer: 0 },
      { q: "Which is CORRECT?", options: ["She spoke so clearly.", "She spoke such clearly.", "He is such intelligent.", "She is so an idiot."], answer: 0 },
    ],
  },
  {
    ruleId: 67,
    questions: [
      { q: "There was ___ snow. (qualifies noun 'snow')", options: ["too much", "much too", "very much", "so much"], answer: 0 },
      { q: "The task was ___ difficult. (qualifies adjective)", options: ["much too", "too much", "very too", "so too"], answer: 0 },
      { q: "'Too much' qualifies ___.", options: ["NOUNS", "adjectives", "adverbs", "verbs"], answer: 0 },
      { q: "'Much too' qualifies ___.", options: ["ADJECTIVES and ADVERBS", "nouns", "verbs", "prepositions"], answer: 0 },
    ],
  },
  {
    ruleId: 68,
    questions: [
      { q: "___ 7 o'clock", options: ["at", "in", "on", "by"], answer: 0 },
      { q: "___ Monday", options: ["on", "at", "in", "by"], answer: 0 },
      { q: "___ January / ___ 1990", options: ["in", "on", "at", "by"], answer: 0 },
      { q: "___ midnight / ___ dawn", options: ["at", "in", "on", "by"], answer: 0 },
    ],
  },
  {
    ruleId: 69,
    questions: [
      { q: "He was killed ___ a snake ___ a stick.", options: ["by, with", "with, by", "by, by", "with, with"], answer: 0 },
      { q: "'By' is used for ___.", options: ["the DOER (living being who performed the action)", "the instrument (non-living thing used)", "the location", "the time"], answer: 0 },
      { q: "I wrote the answers ___ black ink.", options: ["in (for ink/pen writing)", "with", "by", "using"], answer: 0 },
      { q: "'With' is used for ___.", options: ["the INSTRUMENT (non-living thing used)", "the doer (living being)", "the location", "the time"], answer: 0 },
    ],
  },
  {
    ruleId: 70,
    questions: [
      { q: "___, humans didn't know how to cook. (long historical period)", options: ["In the beginning", "At the beginning", "In beginning", "At beginning"], answer: 0 },
      { q: "___ of the movie, there is a song. (specific point)", options: ["At the beginning", "In the beginning", "At beginning", "In beginning"], answer: 0 },
      { q: "'At the beginning' implies ___.", options: ["a short / specific point in time", "a long historical period", "an indefinite time", "a repeated action"], answer: 0 },
      { q: "'In the beginning' implies ___.", options: ["a long duration when something first started", "a specific moment", "the near future", "an ongoing action"], answer: 0 },
    ],
  },
  {
    ruleId: 71,
    questions: [
      { q: "The almirah is made ___ iron. (can get iron back — physical change)", options: ["of", "from", "with", "by"], answer: 0 },
      { q: "Paper is made ___ wood. (can't get wood back — chemical change)", options: ["from", "of", "with", "by"], answer: 0 },
      { q: "Curd is made ___ milk. (irreversible change)", options: ["from", "of", "with", "by"], answer: 0 },
      { q: "The key question for 'made of vs from': ___?", options: ["Can you get the original material back?", "Is it a natural material?", "Is it expensive?", "Is it a liquid?"], answer: 0 },
    ],
  },
  {
    ruleId: 72,
    questions: [
      { q: "Plural possessive of 'boys' hostel' — apostrophe goes ___.", options: ["boys' (after the S)", "boy's (before the S)", "boys's", "boys (no apostrophe)"], answer: 0 },
      { q: "Possessive of 'children's park' — 'children' gets ___.", options: ["'s (not ending in S)", "s' (would be wrong)", "s", "no apostrophe"], answer: 0 },
      { q: "Neha and Priya share ONE bank account. Correct form: ___.", options: ["Neha and Priya's account (joint)", "Neha's and Priya's account (separate)", "Neha and Priya account", "Neha's and Priya account"], answer: 0 },
      { q: "For non-living things like 'table', use ___ instead of apostrophe 's'.", options: ["'of' (leg of the table)", "table's leg", "tables' leg", "table leg's"], answer: 0 },
    ],
  },
  {
    ruleId: 73,
    questions: [
      { q: "My college is ___ the lake. (next to)", options: ["beside", "besides", "by", "near to"], answer: 0 },
      { q: "___ maths, I study English. (in addition to)", options: ["besides", "beside", "except", "apart"], answer: 0 },
      { q: "'Besides' means ___.", options: ["in addition to", "next to", "instead of", "between"], answer: 0 },
      { q: "'Beside' means ___.", options: ["next to / by the side of", "in addition to", "except for", "despite"], answer: 0 },
    ],
  },
  {
    ruleId: 74,
    questions: [
      { q: "___ you and ME. (after preposition — objective case)", options: ["between", "among", "amid", "besides"], answer: 0 },
      { q: "___ the students. (3+ unknown count)", options: ["among", "between", "amid", "besides"], answer: 0 },
      { q: "Between 4 PM ___ 5 PM.", options: ["and", "to", "till", "until"], answer: 0 },
      { q: "'Between' is used for ___ and 'Among' for ___.", options: ["2 or known/specific parties, 3+ unknown", "3+, 2 only", "known, unknown (any count)", "any group, specific group"], answer: 0 },
    ],
  },
  {
    ruleId: 75,
    questions: [
      { q: "A ___ pencil. (compound adjective)", options: ["5-inch", "5-inches", "5 inch", "5 inches"], answer: 0 },
      { q: "A ___ hotel.", options: ["five-star", "five-stars", "5 stars", "five star"], answer: 0 },
      { q: "A ___ boy.", options: ["5-year-old", "5-years-old", "5 year old", "5-years old"], answer: 0 },
      { q: "In compound adjectives (number + unit + noun), the unit is always ___.", options: ["singular and hyphenated", "plural (add -s)", "hyphenated and plural", "no hyphen needed"], answer: 0 },
    ],
  },
  {
    ruleId: 76,
    questions: [
      { q: "Which is CORRECT?", options: ["hundreds of thousands", "thousands of hundreds", "millions of thousands", "billions of millions"], answer: 0 },
      { q: "When nesting units for approximation, the order is ___.", options: ["ascending (smaller → larger)", "descending (larger → smaller)", "alphabetical", "any order"], answer: 0 },
      { q: "Which is WRONG?", options: ["billions of millions", "hundreds of thousands", "millions of billions", "thousands of millions"], answer: 0 },
      { q: "'Hundreds of thousands' is correct because hundreds (smaller) comes ___ thousands (larger).", options: ["before", "after", "equal to", "inside"], answer: 0 },
    ],
  },
  {
    ruleId: 77,
    questions: [
      { q: "I seldom ___ never go there.", options: ["or", "if", "and", "nor"], answer: 0 },
      { q: "He seldom ___ ever reads.", options: ["if", "or", "and", "nor"], answer: 0 },
      { q: "'Seldom or ever' is ___.", options: ["WRONG", "correct in formal writing", "correct in all contexts", "acceptable in spoken English"], answer: 0 },
      { q: "Which combination means 'occasionally'?", options: ["seldom if ever", "seldom or never", "seldom or ever", "seldom and never"], answer: 0 },
    ],
  },
  {
    ruleId: 78,
    questions: [
      { q: "Both Ram ___ Shyam came. (correct pair)", options: ["and", "as well as", "along with", "in addition to"], answer: 0 },
      { q: "Which is CORRECT?", options: ["Both Ram and Shyam came.", "Both Ram as well as Shyam came.", "Both Ram along with Shyam came.", "Both of Ram and of Shyam came."], answer: 0 },
      { q: "To say 'not both', use ___ instead.", options: ["neither", "both not", "none", "not both"], answer: 0 },
      { q: "BOTH must be followed by ___, never 'as well as'.", options: ["and", "or", "but", "nor"], answer: 0 },
    ],
  },
  {
    ruleId: 79,
    questions: [
      { q: "He gave me ___ (NOUN form).", options: ["advice", "advise", "advices", "advisement"], answer: 0 },
      { q: "He ___ me about the exam. (VERB form)", options: ["advised", "adviced", "advice", "advise"], answer: 0 },
      { q: "I ___ daily. (VERB form of practise/practice)", options: ["practise", "practice", "practises", "practiced"], answer: 0 },
      { q: "NOUN form ends in ___, VERB form ends in ___.", options: ["-ce, -se (advice/advise)", "-se, -ce (advise/advice)", "both use -ce", "both use -se"], answer: 0 },
    ],
  },
  {
    ruleId: 80,
    questions: [
      { q: "I have ___ money. (before noun — adjective use)", options: ["enough", "to enough", "enough of", "very enough"], answer: 0 },
      { q: "He is smart ___. (after adjective — adverb use)", options: ["enough", "to enough", "quite", "much"], answer: 0 },
      { q: "She ran fast ___. (after adverb)", options: ["enough", "quite", "very", "so"], answer: 0 },
      { q: "Which is CORRECT?", options: ["He is confident enough.", "He is enough confident.", "He has enough of money.", "He is quite enough confident."], answer: 0 },
    ],
  },
  {
    ruleId: 81,
    questions: [
      { q: "No sooner had he entered the room ___ everyone stood up.", options: ["than", "then", "when", "that"], answer: 0 },
      { q: "Hardly had I fallen asleep ___ the phone rang.", options: ["when", "then", "than", "that"], answer: 0 },
      { q: "Which is CORRECT?", options: ["Hardly had I sat down when he arrived.", "Hardly I had sat down when he arrived.", "Hardly did I sat down than he arrived.", "Hardly had I sat down then he arrived."], answer: 0 },
      { q: "After 'No sooner' (inversion), the paired word is ___.", options: ["than", "when", "then", "but"], answer: 0 },
    ],
  },
  {
    ruleId: 82,
    questions: [
      { q: "Seldom ___ I ___ such beauty.", options: ["had, seen", "I had, seen", "I had seen", "had seen, I"], answer: 0 },
      { q: "Seldom ___ he ___ the truth.", options: ["does, speak", "he does, speak", "he speaks", "speaks, he"], answer: 0 },
      { q: "When 'seldom' starts a sentence, use ___.", options: ["inversion (auxiliary before subject)", "normal word order", "passive voice", "question form with '?'"], answer: 0 },
      { q: "Which is CORRECT?", options: ["Seldom does he lie.", "Seldom he lies.", "Seldom he does lie.", "Seldom lies he."], answer: 0 },
    ],
  },
  {
    ruleId: 83,
    questions: [
      { q: "He is ___ good ___ Rahul. (positive comparison)", options: ["as, as", "so, as", "as, than", "so, than"], answer: 0 },
      { q: "He is NOT ___ good ___ Rahul. (negative — so...as is OK)", options: ["so, as (OR as, as — both OK)", "as, than", "so, than", "neither, as"], answer: 0 },
      { q: "Which is WRONG?", options: ["He is so good as Rahul.", "He is as good as Rahul.", "He is not so good as Rahul.", "He is not as good as Rahul."], answer: 0 },
      { q: "'So...as' is used ONLY in ___ comparisons.", options: ["negative", "positive", "both positive and negative", "superlative"], answer: 0 },
    ],
  },
  {
    ruleId: 84,
    questions: [
      { q: "The population of Delhi is greater than ___ of Chandigarh.", options: ["that", "this", "which", "those"], answer: 0 },
      { q: "The rivers of India are longer than ___ of England. (plural → those)", options: ["those", "that", "this", "which"], answer: 0 },
      { q: "Which is WRONG?", options: ["The population of Delhi is greater than Chandigarh.", "The population of Delhi is greater than that of Chandigarh.", "Rivers of India are longer than those of England.", "His income is higher than that of his brother."], answer: 0 },
      { q: "'That of' is for ___ nouns. 'Those of' is for ___ nouns.", options: ["singular, plural", "plural, singular", "countable, uncountable", "persons, things"], answer: 0 },
    ],
  },
  {
    ruleId: 85,
    questions: [
      { q: "He prefers tea ___ coffee.", options: ["to", "than", "over", "instead of"], answer: 0 },
      { q: "I am junior ___ him.", options: ["to", "than", "from", "of"], answer: 0 },
      { q: "Which word does NOT follow the '-ior' rule (does NOT use 'to')?", options: ["older (uses 'than')", "superior", "inferior", "prior"], answer: 0 },
      { q: "Latin-origin comparison words (superior, inferior, senior, junior, prefer) use ___ for comparison.", options: ["to", "than", "as...as", "more...than"], answer: 0 },
    ],
  },
  {
    ruleId: 86,
    questions: [
      { q: "I ___ this movie yesterday.", options: ["watched", "have watched", "had watched", "was watching"], answer: 0 },
      { q: "I ___ this movie. (no time marker, focus on the action)", options: ["have watched", "watched", "had watched", "was watching"], answer: 0 },
      { q: "Which is WRONG?", options: ["I have watched this movie yesterday.", "I watched this movie yesterday.", "I have watched this movie.", "I had watched this before she arrived."], answer: 0 },
      { q: "When there is ANY time marker (yesterday, ago, last week, in 1990), ALWAYS use ___.", options: ["Simple Past", "Present Perfect", "Past Perfect", "Present Continuous"], answer: 0 },
    ],
  },
  {
    ruleId: 87,
    questions: [
      { q: "Which is a SUPERFLUOUS (redundant) expression?", options: ["past history", "best example", "clear explanation", "simple question"], answer: 0 },
      { q: "Why is 'free gift' wrong?", options: ["A gift is always free by definition.", "Gifts cost money.", "'free' is an adverb, not adjective.", "It should be 'gifted for free'."], answer: 0 },
      { q: "Which is NOT superfluous? (adds genuine meaning)", options: ["advance notice", "advance planning", "future plans", "end result"], answer: 0 },
      { q: "Which is a SUPERFLUOUS expression?", options: ["mutual agreement", "simple solution", "clear answer", "good plan"], answer: 0 },
    ],
  },
  {
    ruleId: 88,
    questions: [
      { q: "Please be ___.", options: ["quiet (silent/calm)", "quite (fairly)", "quietly", "quieted"], answer: 0 },
      { q: "It is ___ good.", options: ["quite (fairly/completely)", "quiet", "quieter", "quiets"], answer: 0 },
      { q: "'Quite' means ___.", options: ["fairly / completely", "silent", "calm", "reserved"], answer: 0 },
      { q: "'Quiet' means ___.", options: ["silent / calm", "fairly", "completely", "rather"], answer: 0 },
    ],
  },
  {
    ruleId: 89,
    questions: [
      { q: "We have ___ books. (each person has their own)", options: ["our", "each our", "himself", "themselves"], answer: 0 },
      { q: "Students submitted ___ papers.", options: ["their", "themselves", "its", "each"], answer: 0 },
      { q: "We took ___ seats.", options: ["our", "each our", "themselves", "his"], answer: 0 },
      { q: "When each member of a group individually possesses something, use ___ possessive.", options: ["plural (our/their)", "singular (my/his)", "reflexive", "no possessive needed"], answer: 0 },
    ],
  },
  {
    ruleId: 90,
    questions: [
      { q: "You should avail ___ of this opportunity.", options: ["yourself", "you", "your", "ourselves"], answer: 0 },
      { q: "They enjoyed ___.", options: ["themselves", "very much", "a lot", "really much"], answer: 0 },
      { q: "He absented ___ from the meeting.", options: ["himself", "him", "his", "he"], answer: 0 },
      { q: "Which verb MUST take a reflexive pronoun (myself/yourself/himself)?", options: ["avail", "help", "see", "think"], answer: 0 },
    ],
  },
  {
    ruleId: 91,
    questions: [
      { q: "One must not boast of ___ own success.", options: ["one's", "his", "their", "its"], answer: 0 },
      { q: "One should do ___ duty.", options: ["one's", "his", "their", "its"], answer: 0 },
      { q: "Which is CORRECT?", options: ["One must love one's country.", "One must love his country.", "One must love their country.", "One must love its country."], answer: 0 },
      { q: "When 'one' is used as a pronoun, continue the sentence with ___.", options: ["one's (stay consistent)", "his/her (switch)", "their (switch)", "its (switch)"], answer: 0 },
    ],
  },
  {
    ruleId: 92,
    questions: [
      { q: "Ram and ___ went there. (both must be subjective)", options: ["I", "me", "myself", "mine"], answer: 0 },
      { q: "These books are for you and ___. (both must be objective)", options: ["me", "I", "myself", "mine"], answer: 0 },
      { q: "Which is CORRECT?", options: ["Between you and me.", "Between you and I.", "Between I and you.", "Between me and I."], answer: 0 },
      { q: "When two pronouns are joined by AND/OR, they must be in the ___ case.", options: ["same (both subject or both object)", "opposite cases", "always objective", "always subjective"], answer: 0 },
    ],
  },
  {
    ruleId: 93,
    questions: [
      { q: "It is ___. (formal English — after 'be' verb)", options: ["I", "me", "myself", "mine"], answer: 0 },
      { q: "Who is it? It is ___.", options: ["he", "him", "his", "himself"], answer: 0 },
      { q: "After 'be' verb, use ___ pronoun in formal English.", options: ["subjective / nominative (I, he, she, they)", "objective (me, him, her, them)", "possessive (my, his)", "reflexive (myself)"], answer: 0 },
      { q: "'It is me' in formal English is ___.", options: ["incorrect (should be 'It is I')", "correct and preferred", "acceptable in all registers", "only wrong in writing"], answer: 0 },
    ],
  },
  {
    ruleId: 94,
    questions: [
      { q: "He threw the ball ___ the river. (through context — use 'in' not 'into')", options: ["in", "into", "onto", "upon"], answer: 0 },
      { q: "He passed a thread ___ the needle.", options: ["in", "into", "onto", "through"], answer: 0 },
      { q: "When 'through' is present in context, use ___ (not 'into').", options: ["in", "into", "onto", "upon"], answer: 0 },
      { q: "'Through' already implies movement, so adding 'into' would ___.", options: ["make the preposition redundant", "add clarification", "be grammatically correct", "be acceptable in informal English"], answer: 0 },
    ],
  },
  {
    ruleId: 95,
    questions: [
      { q: "I saw the girl and the bicycle ___ you mentioned.", options: ["that", "who", "which", "whom"], answer: 0 },
      { q: "The man and his dog ___ came yesterday are here.", options: ["that", "who", "which", "whom"], answer: 0 },
      { q: "When referring to BOTH a person AND a thing together, use ___.", options: ["that", "who", "which", "either who or which"], answer: 0 },
      { q: "Which is WRONG?", options: ["The girl and the bike which came.", "The girl and the bike that came.", "The man and the car that passed.", "The boy and his phone that fell."], answer: 0 },
    ],
  },
  {
    ruleId: 96,
    questions: [
      { q: "Either of the students ___ here.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "Neither of them ___ wrong.", options: ["is", "are", "were", "have been"], answer: 0 },
      { q: "Either of / Neither of + plural noun → ___ verb.", options: ["singular", "plural", "either", "depends"], answer: 0 },
      { q: "This rule is the same as Rule 19, also called the ___.", options: ["Half Girlfriend Rule", "Doctor Patient Rule", "EMPT Rule", "As Well As Rule"], answer: 0 },
    ],
  },
  {
    ruleId: 97,
    questions: [
      { q: "___ one-eyed man ('one' sounds like 'wun' — consonant sound)", options: ["a", "an", "the", "no article"], answer: 0 },
      { q: "___ 18-year-old girl ('eighteen' starts with vowel 'e' sound)", options: ["an", "a", "the", "no article"], answer: 0 },
      { q: "___ 8-hour flight ('eight' starts with vowel sound)", options: ["an", "a", "the", "no article"], answer: 0 },
      { q: "The article before numbers depends on ___.", options: ["the SOUND of the number when spoken", "whether the number is odd or even", "the size of the number", "the letter it starts with in writing"], answer: 0 },
    ],
  },
  {
    ruleId: 98,
    questions: [
      { q: "He seldom ___ never tells the truth.", options: ["or", "if", "and", "nor"], answer: 0 },
      { q: "She seldom ___ ever goes out.", options: ["if", "or", "and", "nor"], answer: 0 },
      { q: "Which is WRONG?", options: ["seldom or ever", "seldom or never", "seldom if ever", "he seldom comes"], answer: 0 },
      { q: "'Seldom if ever' means ___.", options: ["occasionally / very rarely", "never", "always", "sometimes"], answer: 0 },
    ],
  },
  {
    ruleId: 99,
    questions: [
      { q: "A ___ hotel.", options: ["five-star", "five-stars", "five star", "fives-star"], answer: 0 },
      { q: "A ___ note.", options: ["ten-rupee", "ten-rupees", "ten rupees", "tens-rupee"], answer: 0 },
      { q: "A ___ exam.", options: ["two-hour", "two-hours", "two hour", "twos-hour"], answer: 0 },
      { q: "In compound adjectives (number + unit) before nouns, the unit is always ___.", options: ["singular (no -s)", "plural (with -s)", "hyphenated and plural", "separated with a space"], answer: 0 },
    ],
  },
  {
    ruleId: 100,
    questions: [
      { q: "He divided the prize ___ the two winners.", options: ["between", "among", "amid", "beside"], answer: 0 },
      { q: "He divided the prize ___ the ten participants. (10 = unknown group)", options: ["among", "between", "amid", "besides"], answer: 0 },
      { q: "___ you and ME — (not 'I'! After a preposition → objective case)", options: ["between", "among", "amid", "besides"], answer: 0 },
      { q: "Which is CORRECT?", options: ["He divided it among the three friends.", "He divided it between the three friends.", "He divided it beside the three friends.", "He divided it besides the three friends."], answer: 0 },
    ],
  },
];

/** Get quiz questions for a specific rule (returns [] if none exist) */
export function getQuestionsForRule(ruleId: number): Question[] {
  return QUIZ_BANK.find((r) => r.ruleId === ruleId)?.questions ?? [];
}
