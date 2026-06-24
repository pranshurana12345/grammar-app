export type ConfusableEntry = {
  words: Array<{
    word: string;
    partOfSpeech: string;
    meaning: string;
    example: string;
  }>;
  tip: string;
  afcatNote?: string;
};

export type ConfusableCategory = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  pairs: ConfusableEntry[];
};

export const CONFUSABLE_CATEGORIES: ConfusableCategory[] = [
  {
    id: "verb-pairs",
    label: "Commonly Confused Verbs",
    emoji: "⚡",
    color: "#dc2626",
    pairs: [
      {
        words: [
          { word: "affect", partOfSpeech: "verb", meaning: "to influence or have an impact on something", example: "The rain affected the match." },
          { word: "effect", partOfSpeech: "noun/verb", meaning: "a result or outcome (noun); to bring about (verb)", example: "The rain had a negative effect. / They effected a change." },
        ],
        tip: "AFFECT is almost always a VERB. EFFECT is almost always a NOUN. Trick: RAVEN — Remember Affect Verb Effect Noun.",
        afcatNote: "Effect as a verb is rare; AFCAT typically tests affect (verb) vs effect (noun).",
      },
      {
        words: [
          { word: "lie", partOfSpeech: "verb (intransitive)", meaning: "to recline / be in a flat position — no object needed", example: "She lay on the bed. / He has lain here for hours." },
          { word: "lay", partOfSpeech: "verb (transitive)", meaning: "to put or place something down — always needs an object", example: "Lay the book on the table. / She laid the child to sleep." },
        ],
        tip: "LIE = no object (you lie down). LAY = needs an object (you lay something). Tricky: past tense of 'lie' is 'lay' — 'He lay on the sofa yesterday.'",
        afcatNote: "One of the most frequently tested pairs in AFCAT error-spotting. 'He laid on the bed' is WRONG — should be 'He lay on the bed.'",
      },
      {
        words: [
          { word: "rise", partOfSpeech: "verb (intransitive)", meaning: "to go up by itself", example: "The sun rises in the east. / Prices rose sharply." },
          { word: "raise", partOfSpeech: "verb (transitive)", meaning: "to lift something / make something go up", example: "Raise your hand. / They raised the flag." },
        ],
        tip: "RISE = no object needed. RAISE = needs something to raise. Forms: rise/rose/risen; raise/raised/raised.",
        afcatNote: "Active voice vs passive: 'The flag was raised' (raise). 'Prices have risen' (rise).",
      },
      {
        words: [
          { word: "accept", partOfSpeech: "verb", meaning: "to receive or agree to something", example: "She accepted the offer." },
          { word: "except", partOfSpeech: "preposition/conjunction", meaning: "excluding / not including", example: "Everyone came except him." },
        ],
        tip: "ACCEPT starts with AC (to acknowledge/take). EXCEPT starts with EX (to exclude).",
      },
      {
        words: [
          { word: "ensure", partOfSpeech: "verb", meaning: "to make certain that something happens", example: "Ensure you reach on time." },
          { word: "insure", partOfSpeech: "verb", meaning: "to take out insurance against loss", example: "Insure your car against theft." },
          { word: "assure", partOfSpeech: "verb", meaning: "to tell someone with confidence; to remove doubt", example: "I assure you it is true." },
        ],
        tip: "ASSURE = promise someone. ENSURE = make sure (a result). INSURE = protect with insurance policy.",
        afcatNote: "AFCAT typically asks: 'He ___ me that the work was done.' Answer: assured.",
      },
      {
        words: [
          { word: "precede", partOfSpeech: "verb", meaning: "to come before in time or order", example: "A comes before B — A precedes B." },
          { word: "proceed", partOfSpeech: "verb", meaning: "to continue or move forward", example: "Please proceed with the plan." },
        ],
        tip: "preCEDE has 'cede' = to go before. proCEED has 'ceed' = to go forward/continue.",
      },
      {
        words: [
          { word: "imply", partOfSpeech: "verb", meaning: "to suggest something indirectly (the speaker implies)", example: "He implied that I was lying." },
          { word: "infer", partOfSpeech: "verb", meaning: "to conclude from evidence (the listener infers)", example: "I inferred from his tone that he was angry." },
        ],
        tip: "The SPEAKER implies. The LISTENER infers. You infer FROM what someone implies.",
        afcatNote: "Common error: 'What did the author imply from the passage?' should be 'What can we INFER from the passage?'",
      },
    ],
  },
  {
    id: "noun-pairs",
    label: "Noun Confusables",
    emoji: "📦",
    color: "#7c3aed",
    pairs: [
      {
        words: [
          { word: "advice", partOfSpeech: "noun (uncountable)", meaning: "a recommendation or suggestion", example: "She gave me good advice." },
          { word: "advise", partOfSpeech: "verb", meaning: "to give advice / recommend", example: "I advise you to study daily." },
        ],
        tip: "adVICE (noun) — the ICE is cold and solid. adVISE (verb) — the S sounds like a Z (action). 'I advise you to take my advice.'",
        afcatNote: "Do not write 'give advise' — always 'give advice'. The verb is 'advise'.",
      },
      {
        words: [
          { word: "council", partOfSpeech: "noun", meaning: "a group of people elected to govern or advise", example: "The city council approved the plan." },
          { word: "counsel", partOfSpeech: "noun/verb", meaning: "advice; a lawyer; to give advice", example: "The counsel for the defence spoke. / He counselled patience." },
        ],
        tip: "COUNCIL = a committee (ends in -cil). COUNSEL = advice or lawyer (ends in -sel, like 'sell advice').",
      },
      {
        words: [
          { word: "principal", partOfSpeech: "noun/adjective", meaning: "the head of a school; most important", example: "The school principal / the principal reason" },
          { word: "principle", partOfSpeech: "noun", meaning: "a rule, belief, or moral law", example: "She stood by her principles. / the principle of equality" },
        ],
        tip: "principAL = a person or adjective (the principal IS your PAL). principlE = a rule (it Ends with E like rulE).",
        afcatNote: "Frequently tested: 'a man of principle' vs 'the principal cause'. Remember: you can have multiple principles but the principal is singular.",
      },
      {
        words: [
          { word: "complement", partOfSpeech: "noun/verb", meaning: "something that completes or goes well with something else", example: "The wine complements the food perfectly." },
          { word: "compliment", partOfSpeech: "noun/verb", meaning: "an expression of praise or admiration", example: "He paid her a compliment." },
        ],
        tip: "compLEment = compLEte. compLIment = I like (praise). A compliment is nice; a complement completes.",
      },
      {
        words: [
          { word: "stationary", partOfSpeech: "adjective", meaning: "not moving; fixed in position", example: "The car was stationary at the signal." },
          { word: "stationery", partOfSpeech: "noun", meaning: "writing materials: paper, pens, envelopes", example: "Buy some stationery for the office." },
        ],
        tip: "stationERY = papER (both have ER). stationARY = stAy (A for staying in place).",
        afcatNote: "Common spelling error in AFCAT — always check which spelling is required.",
      },
      {
        words: [
          { word: "desert", partOfSpeech: "noun/verb", meaning: "a dry, sandy area; to abandon someone", example: "the Sahara Desert / He deserted his post." },
          { word: "dessert", partOfSpeech: "noun", meaning: "a sweet dish eaten after the main course", example: "We had ice cream for dessert." },
        ],
        tip: "desSERT has two S's — 'Strawberry Shortcake' (something sweet). deseRT has one S — sandy.",
      },
      {
        words: [
          { word: "moral", partOfSpeech: "noun/adjective", meaning: "a lesson from a story; relating to right and wrong", example: "The moral of the story is honesty. / a moral dilemma" },
          { word: "morale", partOfSpeech: "noun", meaning: "the confidence and spirit of a group of people", example: "The team's morale was high after the victory." },
        ],
        tip: "MORAL = ethics or lesson. MORALE = the mood/spirit of a group (especially army/team). MoralE ends in E — think of E for Enthusiasm.",
        afcatNote: "Frequently confused in military/defence contexts: 'The army's morale was low' NOT 'moral'.",
      },
      {
        words: [
          { word: "access", partOfSpeech: "noun/verb", meaning: "the means of entering; to gain entry", example: "He has access to the files. / Access the database." },
          { word: "excess", partOfSpeech: "noun/adjective", meaning: "too much of something; extra", example: "Excess luggage / in excess of the limit" },
        ],
        tip: "aCCess = approach (one C to enter). eXCess = eXtra (X for extra).",
      },
    ],
  },
  {
    id: "adjective-pairs",
    label: "Adjective Confusables",
    emoji: "🎨",
    color: "#0284c7",
    pairs: [
      {
        words: [
          { word: "eminent", partOfSpeech: "adjective", meaning: "famous and respected; distinguished", example: "an eminent scientist" },
          { word: "imminent", partOfSpeech: "adjective", meaning: "about to happen very soon", example: "A storm is imminent." },
          { word: "immanent", partOfSpeech: "adjective", meaning: "inherent; existing within", example: "immanent qualities (philosophical term)" },
        ],
        tip: "EMinent = famous person (EM = Excellent Man). IMMinent = IMMediate danger (MM = happening soon).",
        afcatNote: "AFCAT tests eminent vs imminent in fill-in-the-blank. 'The __ scholar' = eminent. 'Danger is __' = imminent.",
      },
      {
        words: [
          { word: "historic", partOfSpeech: "adjective", meaning: "famous or important in history", example: "a historic victory" },
          { word: "historical", partOfSpeech: "adjective", meaning: "relating to history or the past", example: "historical records / historical accuracy" },
        ],
        tip: "HISTORIC = important enough to be IN history. HISTORICAL = of or relating to history (as a subject or field).",
      },
      {
        words: [
          { word: "economic", partOfSpeech: "adjective", meaning: "relating to economics or the economy", example: "economic policy / economic growth" },
          { word: "economical", partOfSpeech: "adjective", meaning: "not wasteful; giving good value for money", example: "an economical car / She is very economical." },
        ],
        tip: "ECONOMIC = about the economy. ECONOMICAL = saves money / not wasteful.",
      },
      {
        words: [
          { word: "sensible", partOfSpeech: "adjective", meaning: "practical and wise; showing good judgement", example: "a sensible decision" },
          { word: "sensitive", partOfSpeech: "adjective", meaning: "easily affected; quick to detect or respond", example: "She is sensitive to criticism." },
        ],
        tip: "SENSIBLE = good sense (practical). SENSITIVE = feels deeply (emotional or physical reactions).",
      },
      {
        words: [
          { word: "alternate", partOfSpeech: "adjective/verb", meaning: "every other one; to take turns", example: "on alternate days / They alternate between the two options." },
          { word: "alternative", partOfSpeech: "noun/adjective", meaning: "another option to choose from", example: "Is there an alternative route?" },
        ],
        tip: "ALTERNATE = taking turns (A then B then A). ALTERNATIVE = another choice (you can choose this instead).",
        afcatNote: "Do not say 'There is no alternate' when you mean 'There is no alternative'. These are frequently misused.",
      },
    ],
  },
  {
    id: "preposition-pairs",
    label: "Preposition & Usage Pairs",
    emoji: "🔗",
    color: "#0d9488",
    pairs: [
      {
        words: [
          { word: "between", partOfSpeech: "preposition", meaning: "used when referring to two things or two distinct groups", example: "between you and me / between India and Pakistan" },
          { word: "among", partOfSpeech: "preposition", meaning: "used when referring to more than two (a group)", example: "among the soldiers / among the top students" },
        ],
        tip: "BETWEEN = two things. AMONG = more than two / a group. 'Divide between two people; distribute among the class.'",
        afcatNote: "Classic AFCAT question: 'Distribute the medals ___ the winners.' If there are 3+ winners, the answer is 'among'.",
      },
      {
        words: [
          { word: "beside", partOfSpeech: "preposition", meaning: "next to / at the side of", example: "She sat beside me." },
          { word: "besides", partOfSpeech: "preposition/adverb", meaning: "in addition to / moreover", example: "Besides English, he knows French. / It's too late. Besides, I'm tired." },
        ],
        tip: "beSIDE = by the side (one thing next to another). beSIDES = + something extra (the S is for 'something more').",
      },
      {
        words: [
          { word: "farther", partOfSpeech: "adjective/adverb", meaning: "a greater physical distance", example: "The camp is farther than I thought." },
          { word: "further", partOfSpeech: "adjective/adverb/verb", meaning: "to a greater degree; additional (figurative/abstract)", example: "No further questions. / Let's discuss this further." },
        ],
        tip: "FARTHER = physical distance (has FAR in it). FURTHER = metaphorical distance or 'additional' (further study, further notice).",
        afcatNote: "In AFCAT and formal writing, 'further' is used for abstract/figurative use. 'Farther' is only for literal distance.",
      },
      {
        words: [
          { word: "less", partOfSpeech: "adjective/adverb", meaning: "a smaller amount of — used with uncountable nouns", example: "less water / less time / less noise" },
          { word: "fewer", partOfSpeech: "adjective", meaning: "a smaller number of — used with countable nouns", example: "fewer students / fewer mistakes / fewer cars" },
        ],
        tip: "FEWER = countable (you can count them). LESS = uncountable (you can't count: water, time, money). 'Less than 10 items' (common use) is technically incorrect but acceptable in informal speech.",
        afcatNote: "Grammar error-spotting favourite: 'He made less mistakes' is WRONG. Correct: 'He made fewer mistakes.'",
      },
      {
        words: [
          { word: "in", partOfSpeech: "preposition", meaning: "used for months, years, seasons, long periods", example: "in January / in 2024 / in the morning" },
          { word: "on", partOfSpeech: "preposition", meaning: "used for specific days and dates", example: "on Monday / on 15 August / on my birthday" },
          { word: "at", partOfSpeech: "preposition", meaning: "used for specific times and times of day", example: "at 5 o'clock / at noon / at midnight" },
        ],
        tip: "Think funnel: IN (large: year/month) → ON (medium: day/date) → AT (small: exact time). 'In 2024, on Monday, at 3 PM.'",
        afcatNote: "Very common AFCAT fill-in-blank: '___ the evening' = in. '___ Monday evening' = on. '___ 6 PM' = at.",
      },
    ],
  },
  {
    id: "spelling-sound",
    label: "Sound-alike / Spelling Traps",
    emoji: "🔊",
    color: "#d97706",
    pairs: [
      {
        words: [
          { word: "passed", partOfSpeech: "verb (past tense of pass)", meaning: "went by; succeeded; handed over", example: "He passed the exam. / The car passed me." },
          { word: "past", partOfSpeech: "noun/adjective/preposition", meaning: "a previous time; gone by; beyond", example: "in the past / past mistakes / He walked past the building." },
        ],
        tip: "PASSED is a VERB (past tense of 'pass'). PAST is everything else — noun, adjective, preposition, adverb.",
        afcatNote: "If you can replace the word with 'went by' → use PASSED. Otherwise use PAST.",
      },
      {
        words: [
          { word: "loose", partOfSpeech: "adjective/verb", meaning: "not tight; to set free", example: "a loose screw / loose clothing / loose the dogs" },
          { word: "lose", partOfSpeech: "verb", meaning: "to fail to win; to misplace", example: "We might lose the match. / Don't lose your keys." },
        ],
        tip: "LOOSE rhymes with 'goose' (long oo). LOSE rhymes with 'news' (short oo). Loose has a double O because it's more than it should be — it's not tight.",
        afcatNote: "Common AFCAT spelling error: students write 'loose' when they mean 'lose'. 'We will lose the match' NOT 'loose the match'.",
      },
      {
        words: [
          { word: "than", partOfSpeech: "conjunction/preposition", meaning: "used in comparisons", example: "She is taller than me." },
          { word: "then", partOfSpeech: "adverb", meaning: "at that time; after that; in that case", example: "First study, then rest. / If you are ready, then let's begin." },
        ],
        tip: "THAN is for comparisons (greater THAN). THEN is for time or sequence (THEN we left).",
      },
      {
        words: [
          { word: "quiet", partOfSpeech: "adjective", meaning: "making little or no noise", example: "Please be quiet in the library." },
          { word: "quite", partOfSpeech: "adverb", meaning: "fairly; to a certain extent; completely", example: "The exam was quite difficult." },
          { word: "quit", partOfSpeech: "verb", meaning: "to stop doing something", example: "He quit smoking last year." },
        ],
        tip: "QUIET = no noise (has 'ui' in the middle). QUITE = degree/extent. QUIT = stop. They look similar but mean completely different things.",
      },
      {
        words: [
          { word: "their", partOfSpeech: "possessive pronoun", meaning: "belonging to them", example: "It is their house." },
          { word: "there", partOfSpeech: "adverb/pronoun", meaning: "in that place; used to introduce a sentence", example: "She is over there. / There is a problem." },
          { word: "they're", partOfSpeech: "contraction", meaning: "they are", example: "They're coming tomorrow." },
        ],
        tip: "THEIR = possession (the word HEIr is inside — belongs to them). THERE = location (has HERE inside it). THEY'RE = they + are (apostrophe = letters removed).",
      },
      {
        words: [
          { word: "weather", partOfSpeech: "noun/verb", meaning: "atmospheric conditions; to survive/endure", example: "The weather is hot. / They weathered the storm." },
          { word: "whether", partOfSpeech: "conjunction", meaning: "if; used to introduce alternatives", example: "I don't know whether to go or stay." },
        ],
        tip: "WEATHER = clouds, rain, sun (has 'eat' inside — you weather elements). WHETHER = if/or (whether A or B — it introduces a choice).",
      },
      {
        words: [
          { word: "who's", partOfSpeech: "contraction", meaning: "who is / who has", example: "Who's coming? / Who's seen the film?" },
          { word: "whose", partOfSpeech: "possessive pronoun", meaning: "belonging to whom", example: "Whose bag is this?" },
        ],
        tip: "WHO'S = who + is/has (apostrophe = missing letters). WHOSE = possession (similar to his/her but for who).",
      },
    ],
  },
  {
    id: "formal-informal",
    label: "Formal English Traps",
    emoji: "🎓",
    color: "#2563eb",
    pairs: [
      {
        words: [
          { word: "may", partOfSpeech: "modal verb", meaning: "used for permission or possibility (more formal)", example: "May I come in? / It may rain today." },
          { word: "might", partOfSpeech: "modal verb", meaning: "used for remote possibility; past form of may", example: "He might come. / She said I might leave early." },
        ],
        tip: "MAY = more likely or formal permission. MIGHT = less certain / remote possibility. 'It may rain' (50% chance) vs 'It might rain' (less certain).",
        afcatNote: "Formal letters and reports: use 'may' for permission. Error-spotting: 'Might I come in?' is less natural than 'May I come in?'",
      },
      {
        words: [
          { word: "will", partOfSpeech: "modal verb", meaning: "certain future; strong intention; offers", example: "I will finish it today. / Will you help me?" },
          { word: "shall", partOfSpeech: "modal verb", meaning: "formal future (I/We); suggestions; obligations in rules", example: "We shall overcome. / Shall we begin? / Candidates shall report by 9 AM." },
        ],
        tip: "WILL = determination/certainty (all persons). SHALL = formal/legal (I/we), or suggestions. In legal/official language, SHALL expresses obligation.",
        afcatNote: "Military and official instructions often use SHALL to express obligation: 'Officers shall carry ID at all times.'",
      },
      {
        words: [
          { word: "can", partOfSpeech: "modal verb", meaning: "ability / informal permission", example: "I can swim. / Can I go now?" },
          { word: "could", partOfSpeech: "modal verb", meaning: "past ability; polite requests; possibility", example: "I could run fast as a child. / Could you help me?" },
        ],
        tip: "CAN = present ability. COULD = past ability or more polite/uncertain version. 'Could you please help?' is more polite than 'Can you help?'",
      },
      {
        words: [
          { word: "since", partOfSpeech: "preposition/conjunction", meaning: "from a point in the past until now; because", example: "I have lived here since 2010. / Since you're here, let's start." },
          { word: "for", partOfSpeech: "preposition", meaning: "used with a duration of time (how long)", example: "I have lived here for 10 years." },
        ],
        tip: "SINCE = a starting point in time (since 2010, since Monday). FOR = a duration of time (for 10 years, for 3 hours). Both are used with perfect tenses.",
        afcatNote: "Classic AFCAT fill-in: 'She has been working here ___ 2018.' Answer: SINCE (it's a point in time). 'She has been working here ___ five years.' Answer: FOR (duration).",
      },
    ],
  },
];
