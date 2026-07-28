// ── Special Cases & Exceptions ───────────────────────────────────────────────
// The rules in data/rules.ts tell you what usually happens. This file is the
// other half: the words and structures that DON'T follow their own rule, which
// is precisely where AFCAT sets its questions.
//
// Every note is written the same way — what the rule normally says, then the
// cases that break it, then the trap the paper actually uses. Keep that shape
// when adding: a note without its exceptions is just a rule, and the rulebook
// already has those.

export type ExceptionCase = {
  when: string;      // the situation that breaks the normal rule
  note: string;      // what to do instead
  right?: string[];  // correct sentences
  wrong?: string[];  // what students write — shown struck through
};

export type ExceptionNote = {
  id: string;
  title: string;
  normally: string;  // the rule as it is usually taught
  cases: ExceptionCase[];
  trap?: string;     // how the exam uses this
};

export type ExceptionGroup = {
  id: string;
  label: string;
  emoji: string;
  color: string;
  notes: ExceptionNote[];
};

export const EXCEPTION_GROUPS: ExceptionGroup[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "relatives",
    label: "Which · That · Who",
    emoji: "🔗",
    color: "#7c3aed",
    notes: [
      {
        id: "which-that-who",
        title: "Which, That, Who — which one goes where",
        normally: "WHO for people, WHICH for things and animals, THAT for either.",
        cases: [
          {
            when: "After a superlative, or after all / only / any / none / same / first / last / very / no other",
            note: "Use THAT, not which or who. These words already narrow the noun to one thing, and THAT is the pronoun that narrows.",
            right: ["This is the best film that I have ever seen.", "All that glitters is not gold.", "He is the only student that passed."],
            wrong: ["This is the best film which I have ever seen.", "He is the only student who passed."],
          },
          {
            when: "When the noun is people AND things together",
            note: "Only THAT can cover both. Neither who nor which can.",
            right: ["The girl and her bicycle that were hit by the car…"],
            wrong: ["The girl and her bicycle who were hit…", "The girl and her bicycle which were hit…"],
          },
          {
            when: "After a comma (extra information)",
            note: "Use WHICH or WHO — never THAT. A comma means the clause is an aside you could delete; THAT cannot follow a comma.",
            right: ["My car, which I bought last year, is already giving trouble."],
            wrong: ["My car, that I bought last year, is already giving trouble."],
          },
          {
            when: "Straight after a preposition",
            note: "Use WHICH or WHOM. THAT can never sit directly after a preposition — move the preposition to the end if you want that.",
            right: ["The house in which he lives is old.", "The house that he lives in is old."],
            wrong: ["The house in that he lives is old."],
          },
          {
            when: "Possession",
            note: "WHOSE works for things as well as people. 'Of which' is correct but stiff, and the exam prefers whose.",
            right: ["The book whose cover is torn is mine."],
          },
        ],
        trap: "The single most-set version: a superlative or 'the only' in the sentence and 'which' in the options. If you see best/first/only/all/any/none, the answer is that.",
      },
      {
        id: "one-of-the-who",
        title: "One of the … who / that + which verb?",
        normally: "'One of the' + plural noun takes a SINGULAR verb: One of the boys is absent.",
        cases: [
          {
            when: "A relative clause follows — 'one of the X who…'",
            note: "The verb inside the who-clause is PLURAL, because who refers back to the plural noun, not to 'one'.",
            right: ["He is one of the students who are intelligent.", "This is one of the books that have been banned."],
            wrong: ["He is one of the students who is intelligent."],
          },
          {
            when: "'The only one of the X who…'",
            note: "Add 'the only' and it flips back to singular — now who refers to 'the only one'.",
            right: ["He is the only one of the students who is intelligent."],
          },
        ],
        trap: "Both versions appear in the same paper. Look for 'the only' — it decides the verb.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "nouns",
    label: "Noun Traps",
    emoji: "📦",
    color: "#0d9488",
    notes: [
      {
        id: "uncountables",
        title: "Nouns that never take 'a' or an -s",
        normally: "Countable nouns take a/an and add -s in the plural.",
        cases: [
          {
            when: "Uncountable nouns",
            note: "information, advice, furniture, luggage, baggage, machinery, equipment, stationery, scenery, poetry, jewellery, crockery, bread, work, traffic, evidence, knowledge, wastage, money, hair (on the head). No 'a', no plural -s.",
            right: ["He gave me some useful information.", "Two pieces of advice", "All the furniture was sold."],
            wrong: ["He gave me an useful information.", "Two advices", "All the furnitures were sold."],
          },
          {
            when: "You need to count them",
            note: "Put a counter in front: a piece of / an item of / a bit of.",
            right: ["Three pieces of luggage", "An item of furniture"],
          },
        ],
        trap: "Error spotting loves 'informations', 'advices', 'furnitures', 'equipments' — and 'a good news'.",
      },
      {
        id: "plural-form-singular-use",
        title: "Plural in form, singular in meaning",
        normally: "A noun ending in -s takes a plural verb.",
        cases: [
          {
            when: "Subjects, diseases, games and news",
            note: "mathematics, physics, economics, politics, ethics, statistics, linguistics; measles, mumps, rickets, diabetes; billiards, draughts, athletics; news, innings, summons, gallows, whereabouts. All take a SINGULAR verb.",
            right: ["Mathematics is my favourite subject.", "The news was shocking.", "Measles is contagious."],
            wrong: ["Mathematics are my favourite subject.", "The news were shocking."],
          },
          {
            when: "'Statistics' and 'politics' in their other sense",
            note: "When they mean figures / opinions rather than the subject, they turn plural.",
            right: ["Statistics is a dry subject.", "The statistics of the crash are alarming."],
          },
        ],
      },
      {
        id: "always-plural",
        title: "Nouns that are always plural",
        normally: "A pair of anything is one object, so it should be singular.",
        cases: [
          {
            when: "Tools and clothes made of two parts",
            note: "scissors, spectacles, trousers, pants, shorts, pliers, tongs, pincers, binoculars, tweezers. Always plural verb — unless you say 'a pair of', which makes it singular.",
            right: ["My spectacles are broken.", "A pair of spectacles is on the table."],
            wrong: ["My spectacles is broken."],
          },
          {
            when: "Other permanent plurals",
            note: "alms, thanks, riches, wages, premises, surroundings, belongings, valuables, savings, proceeds, particulars, arrears, congratulations, remains, annals, auspices, tidings, amends.",
            right: ["His riches are the talk of the town.", "The premises are locked."],
          },
        ],
      },
      {
        id: "singular-form-plural-use",
        title: "Singular in form, plural in meaning",
        normally: "No -s means a singular verb.",
        cases: [
          {
            when: "Group words with no plural form",
            note: "cattle, poultry, people, police, gentry, clergy, vermin, offspring, peasantry, infantry, cavalry. They take a PLURAL verb without any -s.",
            right: ["The cattle are grazing.", "The police have arrested him.", "Many people were waiting."],
            wrong: ["The cattle is grazing.", "The police has arrested him."],
          },
        ],
        trap: "'The police has' is one of the most repeated error-spotting items in the whole exam.",
      },
      {
        id: "compound-plurals",
        title: "Plurals of compound nouns",
        normally: "Add -s at the end of the word.",
        cases: [
          {
            when: "The compound has a main noun in it",
            note: "Pluralise the MAIN noun, not the tail: brothers-in-law, commanders-in-chief, passers-by, lookers-on, step-sons, maid-servants.",
            right: ["Three brothers-in-law", "Two commanders-in-chief"],
            wrong: ["Three brother-in-laws", "Two commander-in-chiefs"],
          },
          {
            when: "There is no noun inside (man-/woman- compounds)",
            note: "Both parts change: men-servants, women-doctors. And with numbers used as adjectives, the number word stays singular: a five-year-old boy, a ten-rupee note, a two-hour journey.",
            right: ["He is a five-year-old boy.", "She gave me a ten-rupee note."],
            wrong: ["He is a five-years-old boy.", "a ten-rupees note"],
          },
        ],
      },
      {
        id: "possessive-lifeless",
        title: "Apostrophe with lifeless things",
        normally: "'s shows possession for living beings; lifeless things use 'of'.",
        cases: [
          {
            when: "Time, distance, weight and value",
            note: "These take 's even though they are lifeless: a day's journey, a week's leave, a stone's throw, at arm's length, a rupee's worth.",
            right: ["He took two months' leave.", "The station is a stone's throw from here."],
          },
          {
            when: "Personification and countries",
            note: "Nature's law, Fortune's favourite, India's progress, the ship's crew, the court's order — allowed by long usage.",
            right: ["India's progress has been remarkable."],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "agreement",
    label: "Subject–Verb Exceptions",
    emoji: "⚖️",
    color: "#2d7ff9",
    notes: [
      {
        id: "joined-subjects",
        title: "Two subjects that don't make a plural",
        normally: "Two subjects joined by AND take a plural verb.",
        cases: [
          {
            when: "Joined by with / along with / as well as / together with / besides / in addition to / accompanied by / including",
            note: "These are not 'and'. The verb agrees with the FIRST subject only; the rest is extra information, usually inside commas.",
            right: ["The captain, along with his men, was killed.", "Ram as well as his friends is coming."],
            wrong: ["The captain, along with his men, were killed."],
          },
          {
            when: "The two nouns are one person or one idea",
            note: "One article, one verb: 'The collector and magistrate is…' (one officer) but 'The collector and the magistrate are…' (two officers). Same for bread and butter, slow and steady, rice and curry.",
            right: ["Bread and butter is a wholesome food.", "Slow and steady wins the race."],
          },
          {
            when: "Joined by or / nor / either…or / neither…nor",
            note: "The verb agrees with the NEARER subject.",
            right: ["Neither the teacher nor the students were present.", "Neither the students nor the teacher was present."],
          },
        ],
        trap: "The paper puts the plural noun right before the verb so the plural 'sounds' right: 'The captain, along with his men, were…' is wrong.",
      },
      {
        id: "a-number-of",
        title: "A number of vs The number of",
        normally: "Both look identical.",
        cases: [
          {
            when: "A NUMBER of",
            note: "Means 'many' — plural verb.",
            right: ["A number of students are absent."],
          },
          {
            when: "THE NUMBER of",
            note: "The number itself is one thing — singular verb.",
            right: ["The number of students is falling."],
          },
        ],
        trap: "Same trick with 'a lot of' / 'plenty of': they follow the noun after 'of' — a lot of water IS, a lot of boys ARE.",
      },
      {
        id: "collective-nouns",
        title: "Collective nouns can go either way",
        normally: "jury, committee, team, family, government, audience, crowd, public take a singular verb.",
        cases: [
          {
            when: "The group acts as one body",
            note: "Singular verb.",
            right: ["The committee has decided to postpone the exam.", "The jury was unanimous."],
          },
          {
            when: "The members act separately or disagree",
            note: "Plural verb — often signalled by words like divided, disagreed, quarrelled, among themselves.",
            right: ["The jury are divided in their opinion.", "The committee have been arguing among themselves."],
          },
        ],
      },
      {
        id: "amounts-singular",
        title: "Amounts that count as one",
        normally: "A plural subject takes a plural verb.",
        cases: [
          {
            when: "Money, distance, time, weight seen as a single quantity",
            note: "Singular verb, even with a plural-looking subject.",
            right: ["Ten miles is a long walk.", "Fifty thousand rupees is a big amount.", "Five years is a long time to wait."],
            wrong: ["Ten miles are a long walk."],
          },
          {
            when: "The + adjective, meaning a whole class of people",
            note: "Plural verb: the poor, the rich, the blind, the young, the accused.",
            right: ["The poor are always with us."],
            wrong: ["The poor is always with us."],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "articles",
    label: "Article Exceptions",
    emoji: "🅰️",
    color: "#dc2626",
    notes: [
      {
        id: "a-vs-an",
        title: "A or AN — sound decides, not the letter",
        normally: "A before a consonant, AN before a vowel.",
        cases: [
          {
            when: "A vowel letter that is pronounced like a consonant",
            note: "Use A: a university, a European, a useful book, a one-rupee note, a one-eyed man, a ewe, a unit, a uniform. They start with a 'yu' or 'wu' sound.",
            right: ["He is a university student.", "She gave me a one-rupee coin."],
            wrong: ["He is an university student."],
          },
          {
            when: "A consonant letter with a silent start",
            note: "Use AN: an hour, an honest man, an honour, an heir, an M.P., an M.L.A., an S.P., an F.I.R., an X-ray. The H is silent, and those letters are read 'em', 'ess', 'eff'.",
            right: ["I waited for an hour.", "He is an honest officer."],
            wrong: ["I waited for a hour."],
          },
          {
            when: "H that IS pronounced",
            note: "Back to A: a hotel, a historic day, a horse, a hospital, a house.",
            right: ["They stayed in a hotel."],
          },
        ],
      },
      {
        id: "no-article",
        title: "Where THE must NOT go",
        normally: "'The' points at something specific.",
        cases: [
          {
            when: "Languages, meals, games, subjects",
            note: "No article: He knows English. We had lunch. They play cricket. She teaches physics. (Add 'the' only when you narrow it: the English of Shakespeare, the lunch you cooked.)",
            right: ["They play cricket every evening."],
            wrong: ["They play the cricket every evening."],
          },
          {
            when: "Musical instruments",
            note: "Opposite rule — instruments DO take 'the': play the flute, play the guitar, play the piano.",
            right: ["She plays the violin beautifully."],
          },
          {
            when: "Abstract and material nouns in general",
            note: "No article: Honesty is the best policy. Gold is precious. Add 'the' only when you specify: the honesty of the clerk, the gold of this ring.",
            right: ["Wisdom is better than riches."],
          },
        ],
      },
      {
        id: "the-must",
        title: "Where THE is compulsory",
        normally: "Proper nouns don't take 'the'.",
        cases: [
          {
            when: "Rivers, seas, oceans, mountain ranges, deserts, groups of islands",
            note: "the Ganga, the Arabian Sea, the Himalayas, the Thar, the Andamans. But single mountains and lakes take none: Mount Everest, Lake Chilika.",
            right: ["The Ganga rises in the Himalayas."],
          },
          {
            when: "Holy books, newspapers, unique things, superlatives, ordinals",
            note: "the Gita, the Times of India, the sun, the moon, the earth, the best, the first, the same.",
            right: ["He is the best pilot in the squadron."],
          },
          {
            when: "One article or two — one person or two?",
            note: "'The Secretary and Principal has come' = one person holding both posts. 'The Secretary and the Principal have come' = two people.",
            right: ["The poet and philosopher is dead. (one man)", "The poet and the philosopher are dead. (two men)"],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "prepositions",
    label: "Preposition Exceptions",
    emoji: "➡️",
    color: "#22c55e",
    notes: [
      {
        id: "no-preposition",
        title: "Verbs that take NO preposition",
        normally: "Most verbs need a preposition before their object.",
        cases: [
          {
            when: "These verbs are already transitive",
            note: "discuss, describe, order, request, resemble, marry, comprise, reach, enter, accompany, attack, await, board, lack, resist, sign, stress, ventilate, investigate, emphasise. Adding a preposition is the error.",
            right: ["We discussed the problem.", "He resembles his father.", "The team reached Delhi.", "She married a doctor."],
            wrong: ["We discussed about the problem.", "He resembles to his father.", "The team reached at Delhi.", "She married with a doctor."],
          },
          {
            when: "'Comprise' and 'consist'",
            note: "comprise takes nothing; consist takes OF. Both mean the same thing, and the paper swaps them.",
            right: ["The team comprises eleven players.", "The team consists of eleven players."],
            wrong: ["The team comprises of eleven players."],
          },
          {
            when: "Before home, abroad, downstairs, upstairs, today, tomorrow, yesterday, last/next week",
            note: "No preposition at all.",
            right: ["He went home.", "She is coming next week."],
            wrong: ["He went to home.", "She is coming on next week."],
          },
        ],
        trap: "'discussed about' and 'reached at' are near-permanent residents of the error-spotting section.",
      },
      {
        id: "ior-to",
        title: "-IOR words take TO, never THAN",
        normally: "Comparatives are followed by 'than'.",
        cases: [
          {
            when: "Latin comparatives ending in -IOR",
            note: "senior, junior, superior, inferior, prior, posterior, anterior — all take TO. So do 'preferable to' and 'prefer X to Y'.",
            right: ["He is senior to me.", "This cloth is superior to that.", "I prefer tea to coffee."],
            wrong: ["He is senior than me.", "I prefer tea than coffee."],
          },
          {
            when: "Prefer with verbs",
            note: "Use 'prefer to + verb + rather than + verb' — not 'than to'.",
            right: ["I prefer to walk rather than cycle."],
            wrong: ["I prefer to walk than to cycle."],
          },
        ],
      },
      {
        id: "fixed-pairs",
        title: "Verbs married to one preposition",
        normally: "Choose whichever preposition fits the meaning.",
        cases: [
          {
            when: "These pairs are fixed by usage, not logic",
            note: "deprived OF · refrain FROM · abstain FROM · accused OF · charged WITH · suspect OF · blame FOR · insist ON · congratulate ON · confide IN · comply WITH · rely ON · consist OF · differ FROM (a thing) / WITH (a person) · die OF (disease) / FROM (a wound) / BY (violence)",
            right: ["He was accused of theft.", "He was charged with murder.", "She died of cancer."],
          },
          {
            when: "Angry, married, different",
            note: "angry WITH a person, angry AT a thing; married TO (not with); different FROM (not than).",
            right: ["She is angry with her brother.", "He is married to a teacher.", "Your view is different from mine."],
            wrong: ["He is married with a teacher.", "different than mine"],
          },
          {
            when: "In charge of vs in the charge of",
            note: "'X is in charge of Y' = X controls Y. 'Y is in the charge of X' = Y is under X. The little 'the' reverses who is boss.",
            right: ["The officer is in charge of the unit.", "The unit is in the charge of the officer."],
          },
        ],
      },
      {
        id: "since-for-from",
        title: "Since · For · From",
        normally: "All three mark time.",
        cases: [
          {
            when: "SINCE",
            note: "A point of time, and only with a perfect tense: since 2019, since Monday, since morning.",
            right: ["He has been ill since Monday."],
            wrong: ["He is ill since Monday."],
          },
          {
            when: "FOR",
            note: "A length of time: for two hours, for three years.",
            right: ["He has been ill for three days."],
            wrong: ["He has been ill since three days."],
          },
          {
            when: "FROM",
            note: "A starting point, used with any tense except the perfect — it needs an end point or another verb.",
            right: ["He will work from Monday.", "The shop is open from 9 a.m. to 6 p.m."],
          },
        ],
        trap: "'since three days' is deliberately planted in almost every practice set.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "verbs",
    label: "Verb Exceptions",
    emoji: "🔁",
    color: "#f97316",
    notes: [
      {
        id: "stative",
        title: "Verbs that refuse the -ing form",
        normally: "Any verb can go into the continuous tense.",
        cases: [
          {
            when: "State verbs — thinking, feeling, owning, sensing",
            note: "know, believe, understand, remember, forget, mean, doubt, suppose; like, love, hate, prefer, want, wish, need; own, possess, belong, contain, consist; seem, appear, resemble, matter, cost, weigh, hear, see, smell, taste. These describe a state, not an action.",
            right: ["I know the answer.", "This box contains books.", "She has a car."],
            wrong: ["I am knowing the answer.", "This box is containing books.", "She is having a car."],
          },
          {
            when: "The same verb used as an ACTION",
            note: "Then the -ing is correct, because the meaning has changed: 'She is having lunch' (eating), 'He is seeing the manager' (meeting), 'I am thinking of you' (considering), 'He is tasting the soup' (testing it), 'They are looking at the painting'.",
            right: ["She is having dinner with us.", "The chef is tasting the soup."],
          },
        ],
        trap: "'is having a car', 'am knowing', 'is belonging to' — the exam plants one of these and expects you to spot the state verb.",
      },
      {
        id: "bare-infinitive",
        title: "Verbs followed by a bare infinitive (no 'to')",
        normally: "An infinitive carries 'to'.",
        cases: [
          {
            when: "After make, let, bid, see, hear, watch, feel, help",
            note: "The 'to' is dropped in the ACTIVE voice.",
            right: ["He made me do it.", "I saw him leave.", "Let him go."],
            wrong: ["He made me to do it.", "I saw him to leave."],
          },
          {
            when: "The same sentence in the PASSIVE",
            note: "The 'to' comes back — this is the exception to the exception.",
            right: ["I was made to do it.", "He was seen to leave."],
            wrong: ["I was made do it."],
          },
          {
            when: "After had better, would rather, rather than, but, except, than",
            note: "Bare infinitive again.",
            right: ["You had better go now.", "I would rather stay than leave."],
            wrong: ["You had better to go now."],
          },
        ],
      },
      {
        id: "gerund-infinitive",
        title: "Verbs where -ing and 'to' mean different things",
        normally: "Gerund or infinitive — pick whichever sounds right.",
        cases: [
          {
            when: "stop / remember / forget / regret / try / go on",
            note: "The choice changes the meaning outright. stop smoking = give it up · stop to smoke = pause in order to smoke. remember posting = you did it · remember to post = don't forget. try knocking = experiment · try to knock = attempt. regret telling = sorry you told · regret to tell = sorry to be telling now.",
            right: ["He stopped smoking last year.", "He stopped to smoke on the way."],
          },
          {
            when: "Verbs that only ever take -ing",
            note: "avoid, enjoy, mind, suggest, deny, admit, finish, practise, risk, consider, postpone; and after 'look forward to', 'be used to', 'accustomed to', 'with a view to', 'averse to' — where 'to' is a preposition, not part of the infinitive.",
            right: ["I look forward to meeting you.", "He is used to working late."],
            wrong: ["I look forward to meet you.", "He is used to work late."],
          },
        ],
        trap: "'look forward to meet you' is a favourite. Test it by putting a noun after 'to' — if a noun fits, it's a preposition, so use -ing.",
      },
      {
        id: "causative",
        title: "Getting something done by someone else",
        normally: "The subject does the action.",
        cases: [
          {
            when: "have / get + object + past participle",
            note: "Someone else does the work. 'I repaired my car' = you did it. 'I had my car repaired' = a mechanic did.",
            right: ["I had my car repaired yesterday.", "She got her hair cut."],
            wrong: ["I had repaired my car by the mechanic."],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "comparison",
    label: "Comparison Exceptions",
    emoji: "📊",
    color: "#a855f7",
    notes: [
      {
        id: "absolutes",
        title: "Adjectives that cannot be compared",
        normally: "Any adjective can take more / most or -er / -est.",
        cases: [
          {
            when: "Absolute adjectives",
            note: "unique, perfect, ideal, complete, entire, universal, eternal, supreme, chief, extreme, round, square, circular, full, empty. They are already at the maximum — 'more unique' says nothing.",
            right: ["This design is unique.", "His work is almost perfect."],
            wrong: ["This design is more unique.", "His work is most perfect."],
          },
        ],
      },
      {
        id: "double-comparative",
        title: "Never compare twice",
        normally: "Add -er / -est or more / most.",
        cases: [
          {
            when: "Both at once",
            note: "One or the other, never both.",
            right: ["He is better than his brother.", "She is the tallest girl in the class."],
            wrong: ["He is more better than his brother.", "She is the most tallest girl."],
          },
          {
            when: "Comparing inside a group",
            note: "Use 'than any OTHER' when the thing is part of the group, and 'than any' when it is outside.",
            right: ["Delhi is bigger than any other city in India.", "Delhi is bigger than any city in Pakistan."],
            wrong: ["Delhi is bigger than any city in India."],
          },
          {
            when: "Comparing like with like",
            note: "You must compare the same kind of thing — add 'that of' or 'those of'.",
            right: ["The climate of Delhi is hotter than that of Shimla."],
            wrong: ["The climate of Delhi is hotter than Shimla."],
          },
        ],
      },
      {
        id: "elder-later",
        title: "Elder · Older · Later · Latter · Farther · Further",
        normally: "They look like the same word twice.",
        cases: [
          {
            when: "elder / older",
            note: "ELDER only for people of the same family, and never with 'than'. OLDER for everything else.",
            right: ["My elder brother is a pilot.", "He is older than me."],
            wrong: ["He is elder than me."],
          },
          {
            when: "later / latter · latest / last",
            note: "LATER = time, LATTER = the second of two. LATEST = most recent, LAST = final.",
            right: ["He came later than usual.", "Of tea and coffee, I prefer the latter.", "This is his latest novel."],
          },
          {
            when: "farther / further · nearest / next",
            note: "FARTHER = physical distance, FURTHER = additional. NEAREST = distance, NEXT = order.",
            right: ["Delhi is farther than Agra.", "I need further information.", "The nearest hospital is 2 km away.", "The next chapter is easier."],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "tags-pairs",
    label: "Tags & Fixed Pairs",
    emoji: "🏷️",
    color: "#3b82f6",
    notes: [
      {
        id: "tag-exceptions",
        title: "Question tags that break the rule",
        normally: "Positive statement → negative tag, and the tag repeats the auxiliary.",
        cases: [
          {
            when: "I am …",
            note: "The tag is AREN'T I, not amn't I.",
            right: ["I am late, aren't I?"],
          },
          {
            when: "Let's … / Let us …",
            note: "'Let's' → SHALL WE. But 'Let us' meaning 'allow us' → WILL YOU.",
            right: ["Let's go for a walk, shall we?", "Let us go, will you?"],
          },
          {
            when: "An order or request",
            note: "Imperatives take WILL YOU / WON'T YOU, whatever the sentence says.",
            right: ["Shut the door, will you?", "Don't be late, will you?"],
          },
          {
            when: "The sentence is negative in MEANING but not in form",
            note: "hardly, scarcely, barely, seldom, rarely, never, few, little, nothing, nobody, none — these already carry a 'no', so the tag is POSITIVE.",
            right: ["He hardly works, does he?", "Few students passed, did they?", "Nothing was said, was it?"],
            wrong: ["He hardly works, doesn't he?"],
          },
          {
            when: "Everyone / everybody / nobody as the subject",
            note: "The tag pronoun is THEY. For 'nothing / everything', it is IT. For 'There is…', the tag keeps THERE.",
            right: ["Everybody has arrived, haven't they?", "There is no water, is there?"],
          },
        ],
      },
      {
        id: "correlatives",
        title: "Pairs that only marry each other",
        normally: "Any linking word will do.",
        cases: [
          {
            when: "Fixed correlative pairs",
            note: "No sooner … THAN · Hardly / Scarcely … WHEN (or BEFORE) · Not only … BUT ALSO · Either … OR · Neither … NOR · Such … AS · The same … AS · So … THAT · Such … THAT · Would rather … THAN · Lest … SHOULD · No … BUT · Whether … OR",
            right: ["No sooner had he arrived than it started raining.", "Hardly had she slept when the phone rang."],
            wrong: ["No sooner had he arrived when it started raining.", "Hardly had she slept than the phone rang."],
          },
          {
            when: "LEST",
            note: "'Lest' already means 'for fear that' — it is negative. Never add NOT, and only SHOULD may follow it.",
            right: ["Walk carefully lest you should fall."],
            wrong: ["Walk carefully lest you should not fall.", "Walk carefully lest you will fall."],
          },
          {
            when: "Not only … but also",
            note: "Whatever follows the two halves must be the same kind of word — both verbs, or both nouns.",
            right: ["He not only sings but also dances."],
            wrong: ["He not only sings but also a dancer."],
          },
        ],
        trap: "'No sooner … when' and 'Hardly … than' are the two most common wrong pairings in the paper.",
      },
      {
        id: "inversion",
        title: "When the sentence turns itself around",
        normally: "Subject comes before the verb.",
        cases: [
          {
            when: "A negative adverb starts the sentence",
            note: "never, seldom, rarely, hardly, scarcely, no sooner, not only, little, nowhere, under no circumstances — the auxiliary jumps in front of the subject.",
            right: ["Never have I seen such a sight.", "Seldom does he come late.", "Little did he know the truth."],
            wrong: ["Never I have seen such a sight."],
          },
          {
            when: "Here / There / adverb of place first",
            note: "Inverted with a NOUN subject, but not with a pronoun.",
            right: ["Here comes the bus.", "Here he comes."],
            wrong: ["Here comes he."],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "quantifiers",
    label: "Quantifiers & Pronouns",
    emoji: "🔍",
    color: "#e11d48",
    notes: [
      {
        id: "few-little",
        title: "Few · A few · The few (and little)",
        normally: "They all mean 'not many'.",
        cases: [
          {
            when: "FEW / LITTLE",
            note: "Negative — hardly any, and the sentence has a disappointed tone.",
            right: ["Few students passed. (almost none)", "He has little money. (almost none)"],
          },
          {
            when: "A FEW / A LITTLE",
            note: "Positive — some, and that is enough.",
            right: ["A few students passed. (some did)", "He has a little money. (some)"],
          },
          {
            when: "THE FEW / THE LITTLE",
            note: "All there was, not much though it was.",
            right: ["The few friends he has are loyal."],
          },
        ],
        trap: "The question usually hangs on the tone: 'He has ___ money, so he cannot buy it' needs LITTLE, not A LITTLE.",
      },
      {
        id: "two-vs-more",
        title: "Words that count how many you are comparing",
        normally: "Use whichever word sounds right.",
        cases: [
          {
            when: "Exactly two",
            note: "between, either, neither, each other, the former / the latter, elder.",
            right: ["Divide it between the two brothers.", "The two friends love each other."],
          },
          {
            when: "More than two",
            note: "among, any, none, one another.",
            right: ["Divide it among the four boys.", "All the members greeted one another."],
            wrong: ["Divide it between the four boys."],
          },
        ],
      },
      {
        id: "pronoun-case",
        title: "Pronoun case traps",
        normally: "Use 'I' when speaking about yourself.",
        cases: [
          {
            when: "After a preposition or after 'let'",
            note: "Object form: me, him, her, us, them.",
            right: ["Between you and me…", "Let him and me go."],
            wrong: ["Between you and I…", "Let he and I go."],
          },
          {
            when: "After 'than' or 'as' in a comparison",
            note: "Subject form, because a verb is understood: 'taller than I (am)'.",
            right: ["He is taller than I.", "She sings as well as he."],
          },
          {
            when: "Before a gerund",
            note: "Possessive, not object: my going, his being late.",
            right: ["I don't mind his coming late."],
            wrong: ["I don't mind him coming late."],
          },
          {
            when: "Order of pronouns",
            note: "In a positive sentence: second, third, first (you, he and I). In a negative or a confession, 'I' comes first (I, you and he are to blame).",
            right: ["You, he and I are going together."],
          },
        ],
      },
      {
        id: "superfluous",
        title: "Words that say the same thing twice",
        normally: "Adding a word makes the meaning clearer.",
        cases: [
          {
            when: "Built-in repetition",
            note: "return back, revert back, repeat again, reverse back, cousin brother, cousin sister, more preferable, most unique, hurry up quickly, join together, close proximity, free gift, new innovation. Delete the second word.",
            right: ["He returned from Delhi yesterday.", "This option is preferable."],
            wrong: ["He returned back from Delhi.", "This option is more preferable."],
          },
          {
            when: "Double negatives",
            note: "Hardly, scarcely, barely, seldom already carry the 'no'. Never add another.",
            right: ["I could hardly see anything.", "He did not do anything."],
            wrong: ["I could hardly see nothing.", "He did not do nothing."],
          },
        ],
      },
    ],
  },
];

export const EXCEPTION_COUNT = EXCEPTION_GROUPS.reduce((n, g) => n + g.notes.length, 0);
export const EXCEPTION_CASE_COUNT = EXCEPTION_GROUPS.reduce(
  (n, g) => n + g.notes.reduce((m, note) => m + note.cases.length, 0), 0,
);
