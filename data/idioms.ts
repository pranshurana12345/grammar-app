// ── Idioms & Phrases ─────────────────────────────────────────────────────────
// High-frequency exam idioms. Each has a big emoji "picture" to make it stick,
// the meaning, and a natural example. The second block is sourced from the
// Arihant AFCAT question bank — idioms actually asked in previous-year papers.

export type Idiom = {
  phrase: string;
  meaning: string;
  pic: string;        // emoji picture (1–3 emojis)
  example: string;
  picFilter?: string; // optional CSS filter, e.g. to recolour an emoji
  // Vocabulary cards reuse this shape in the reel (see data/vocabulary.ts):
  kind?: "word";      // set for vocab words; idioms leave it unset
  synonyms?: string[];
  antonyms?: string[];
};

export const IDIOMS: Idiom[] = [
  { phrase: "A piece of cake", meaning: "Something very easy to do.", pic: "🍰", example: "The test was a piece of cake after all that practice." },
  { phrase: "Break the ice", meaning: "To start a conversation and ease the tension.", pic: "🔨🧊", example: "He cracked a joke to break the ice with the new team." },
  { phrase: "Cost an arm and a leg", meaning: "To be very expensive.", pic: "💸", example: "That new phone costs an arm and a leg." },
  { phrase: "Hit the books", meaning: "To study hard.", pic: "👊📚", example: "I need to hit the books before the exam." },
  { phrase: "Under the weather", meaning: "Feeling slightly ill.", pic: "🌧️🤒", example: "She stayed home, feeling a bit under the weather." },
  { phrase: "Once in a blue moon", meaning: "Very rarely.", pic: "🌕", picFilter: "saturate(1.8) hue-rotate(200deg) brightness(1.05)", example: "He visits his hometown once in a blue moon." },
  { phrase: "Spill the beans", meaning: "To reveal a secret.", pic: "🫘", example: "Come on, spill the beans about the surprise party!" },
  { phrase: "Bite the bullet", meaning: "To face something difficult or unpleasant bravely.", pic: "😬", example: "I bit the bullet and finally went to the dentist." },
  { phrase: "The ball is in your court", meaning: "It is now your turn to decide or act.", pic: "🎾", example: "I've done my part — the ball is in your court now." },
  { phrase: "Let the cat out of the bag", meaning: "To reveal a secret by accident.", pic: "🐱👜", example: "He let the cat out of the bag about the wedding." },
  { phrase: "Burn the midnight oil", meaning: "To work or study late into the night.", pic: "🌙🕯️", example: "She burned the midnight oil to finish the report." },
  { phrase: "A blessing in disguise", meaning: "A good thing that seemed bad at first.", pic: "🎭", example: "Missing that bus was a blessing in disguise." },
  { phrase: "Cut corners", meaning: "To do something cheaply or carelessly to save time or money.", pic: "✂️", example: "Never cut corners when it comes to safety." },
  { phrase: "Beat around the bush", meaning: "To avoid getting to the main point.", pic: "🌳🥊", example: "Stop beating around the bush and tell me what happened." },
  { phrase: "Hit the nail on the head", meaning: "To say or do exactly the right thing.", pic: "🔨📌", example: "You hit the nail on the head with that explanation." },
  { phrase: "Kill two birds with one stone", meaning: "To solve two problems with a single action.", pic: "🐦🐦🪨", example: "Cycling to work kills two birds with one stone — fitness and travel." },
  { phrase: "Add fuel to the fire", meaning: "To make a bad situation worse.", pic: "⛽🔥", example: "Shouting back only added fuel to the fire." },
  { phrase: "Out of the blue", meaning: "Suddenly and unexpectedly.", pic: "🌀", example: "She called me out of the blue after ten years." },
  { phrase: "When pigs fly", meaning: "Something that will never happen.", pic: "🪽🐷🪽", example: "He'll tidy his room when pigs fly." },
  { phrase: "The last straw", meaning: "The final problem that makes you lose patience.", pic: "🐫🌾", example: "His rude reply was the last straw." },
  { phrase: "Cry over spilt milk", meaning: "To waste time regretting what can't be undone.", pic: "😢🥛", example: "It's gone now — no use crying over spilt milk." },
  { phrase: "Every cloud has a silver lining", meaning: "Every difficult situation has a hopeful side.", pic: "🌈", example: "Cheer up — every cloud has a silver lining." },
  { phrase: "Bite off more than you can chew", meaning: "To take on more than you can handle.", pic: "🍔😬", example: "He bit off more than he could chew with three projects." },
  { phrase: "Raining cats and dogs", meaning: "Raining very heavily.", pic: "🌧️🐱🐶", example: "Take an umbrella — it's raining cats and dogs." },
  { phrase: "A storm in a teacup", meaning: "A lot of fuss over a small matter.", pic: "🫖", example: "Their quarrel was just a storm in a teacup." },
  { phrase: "Call it a day", meaning: "To stop working for the day.", pic: "🌇", example: "We've done enough — let's call it a day." },
  { phrase: "Keep your fingers crossed", meaning: "To hope for good luck.", pic: "🤞", example: "Keep your fingers crossed — results come out today." },
  { phrase: "Pull someone's leg", meaning: "To tease or joke with someone.", pic: "🦵", example: "Relax, I'm only pulling your leg." },
  { phrase: "Get cold feet", meaning: "To become nervous before a big event.", pic: "🥶🦶", example: "He got cold feet just before the interview." },
  { phrase: "On cloud nine", meaning: "Extremely happy.", pic: "☁️", example: "She was on cloud nine after clearing the exam." },

  // ── AFCAT previous-year idioms (from the Arihant question bank) ────────────
  { phrase: "To smell a rat", meaning: "To be suspicious that something is wrong.", pic: "👃🐀", example: "I smelt a rat in the bargain he made with my brother." },
  { phrase: "A bolt from the blue", meaning: "A sudden, completely unexpected shock.", pic: "🌩️", example: "The news of his accident came as a bolt from the blue." },
  { phrase: "Read between the lines", meaning: "To find a hidden meaning beyond the actual words.", pic: "🧐📜", example: "Read between the lines — her letter says more than it seems." },
  { phrase: "Put one's foot down", meaning: "To assert authority firmly.", pic: "🦶💥", example: "The students wanted a holiday, but the Principal put his foot down." },
  { phrase: "To take after", meaning: "To resemble a parent or relative.", pic: "👨👦", example: "Ramesh takes after his father." },
  { phrase: "A close shave", meaning: "A narrow, lucky escape.", pic: "🪒😅", example: "He had a close shave in an accident yesterday." },
  { phrase: "Follow suit", meaning: "To do the same as someone else has just done.", pic: "🃏👣", example: "When one bank cut rates, the others followed suit." },
  { phrase: "At the crossroads", meaning: "At a point where an important decision must be made.", pic: "🛣️🤔", example: "After graduation, she stood at the crossroads of her career." },
  { phrase: "Make one's blood boil", meaning: "To make somebody furious.", pic: "🩸♨️", example: "The referee's unfair decision made his blood boil." },
  { phrase: "To lose ground", meaning: "To become less powerful or successful.", pic: "📉🏳️", example: "The party is losing ground among young voters." },
  { phrase: "To fall back on", meaning: "To turn to something for support when needed.", pic: "🛟", example: "If the business fails, she has her teaching degree to fall back on." },
  { phrase: "A damp squib", meaning: "Something that disappoints after big expectations.", pic: "🎆💧", example: "The much-hyped launch turned out to be a damp squib." },
  { phrase: "Heads will roll", meaning: "People will be punished or dismissed.", pic: "🚪🧳", example: "After the scandal, heads will roll in the Secretariat." },
  { phrase: "Give a piece of one's mind", meaning: "To scold or reprimand someone frankly.", pic: "🧠🗯️", example: "If he phones again, I'll give him a piece of my mind." },
  { phrase: "All agog", meaning: "Full of interest and excitement.", pic: "🤩", example: "The children were all agog to see the magician." },
  { phrase: "Lose one's marbles", meaning: "To go insane; to lose one's sanity.", pic: "🤪", example: "Talking to walls? Has he lost his marbles?" },
  { phrase: "See eye to eye", meaning: "To agree completely with someone.", pic: "👁️🤝👁️", example: "He could never see eye to eye with his father." },
  { phrase: "Kick the bucket", meaning: "To die.", pic: "🦵🪣", example: "Mr. Verma kicked the bucket after a long illness." },
  { phrase: "A snake in the grass", meaning: "A hidden enemy; a treacherous person.", pic: "🐍🌿", example: "His most trusted friend proved to be a snake in the grass." },
  { phrase: "Bury the hatchet", meaning: "To end a quarrel and make peace.", pic: "🪓🕊️", example: "The teacher asked us to bury the hatchet and be friends." },
  { phrase: "Burn one's fingers", meaning: "To suffer for interfering or acting rashly.", pic: "🔥🖐️", example: "He burnt his fingers by meddling in his neighbour's affairs." },
  { phrase: "Flog a dead horse", meaning: "To waste effort on something that cannot succeed.", pic: "🐴🪦", example: "Reopening that settled debate is flogging a dead horse." },
  { phrase: "Get into hot water", meaning: "To get into trouble.", pic: "♨️😰", example: "He got into hot water for missing the deadline." },
  { phrase: "Throw up the sponge", meaning: "To surrender or give up a contest.", pic: "🧽🏳️", example: "Trailing by a huge margin, the team threw up the sponge." },
  { phrase: "A bull in a china shop", meaning: "A clumsy person in a place needing skill and care.", pic: "🐂🏺", example: "He handled the delicate talks like a bull in a china shop." },
  { phrase: "The alpha and the omega", meaning: "The beginning and the end.", pic: "🌅🌇", example: "Discipline is the alpha and the omega of military life." },
  { phrase: "A fool's errand", meaning: "A useless task with no hope of success.", pic: "🃏🏃", example: "Searching for the lost ring on the beach was a fool's errand." },
  { phrase: "Square pegs in round holes", meaning: "People in jobs that don't suit them.", pic: "🟥⭕", example: "Half the staff are square pegs in round holes." },
  { phrase: "In a jiffy", meaning: "Very quickly; in a moment.", pic: "⚡⏱️", example: "Wait here — I'll be back in a jiffy." },
  { phrase: "Up to the hilt", meaning: "Completely; to the maximum.", pic: "🗡️", example: "He is mortgaged up to the hilt." },
  { phrase: "A man of letters", meaning: "A literary person; a scholar.", pic: "📚✒️", example: "Tagore was a true man of letters." },
  { phrase: "Sangfroid", meaning: "Composure and calmness in danger.", pic: "🧊😎", example: "The pilot showed remarkable sangfroid during the emergency." },
  { phrase: "In weal and woe", meaning: "In prosperity and adversity alike.", pic: "🌞⛈️", example: "True friends stand by you in weal and woe." },
  { phrase: "A globetrotter", meaning: "A person who travels all over the world.", pic: "🌍✈️", example: "The globetrotter has visited forty countries." },
  { phrase: "A white elephant", meaning: "A costly but useless possession.", pic: "🐘", picFilter: "grayscale(1) brightness(1.55)", example: "The old factory is a white elephant draining our funds." },
  { phrase: "Leave no stone unturned", meaning: "To try every possible means.", pic: "🪨🔄", example: "She left no stone unturned to clear the AFCAT." },
  { phrase: "Through thick and thin", meaning: "Under all conditions, good or bad.", pic: "🥾⛰️", example: "They stayed friends through thick and thin." },
  { phrase: "Born with a silver spoon", meaning: "Born into a wealthy family.", pic: "👶🥄", example: "He never worked hard — born with a silver spoon in his mouth." },
  { phrase: "Take to one's heels", meaning: "To run away.", pic: "🏃💨", example: "Seeing the police, the thief took to his heels." },
  { phrase: "An axe to grind", meaning: "A private interest or selfish motive to serve.", pic: "🪓⚙️", example: "He supports the plan only because he has an axe to grind." },
  { phrase: "At sixes and sevens", meaning: "In complete confusion and disorder.", pic: "6️⃣🌀7️⃣", example: "After the transfer orders, the office was at sixes and sevens." },
  { phrase: "Part and parcel", meaning: "An essential, inseparable part.", pic: "📦🧩", example: "Discipline is part and parcel of a soldier's life." },
  { phrase: "Talk through one's hat", meaning: "To talk nonsense.", pic: "🎩💬", example: "Ignore him — he's talking through his hat." },
  { phrase: "Yeoman's service", meaning: "Excellent, loyal work or help.", pic: "💪🏅", example: "The volunteers did yeoman's service during the floods." },
  { phrase: "To catch up with", meaning: "To reach the same level as others.", pic: "🏃🏁", example: "I joined late and found it hard to catch up with the class." },
  { phrase: "The man in the street", meaning: "The ordinary, common person.", pic: "🚶🏙️", example: "How do these reforms affect the man in the street?" },
];

// How many emoji "glyphs" are in a pic string (1, 2 or 3). Used to scale the
// font size down when a pic uses 2–3 emojis so it stays compact.
export function emojiUnits(pic: string): number {
  try {
    return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(pic)].length || 1;
  } catch {
    return [...pic].length || 1;
  }
}

// Font size for a pic given the size used for a single emoji.
export function emojiSize(pic: string, single: number): number {
  return Math.round(single / (0.5 * emojiUnits(pic) + 0.5));
}
