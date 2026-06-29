// ── Idioms & Phrases ─────────────────────────────────────────────────────────
// High-frequency exam idioms. Each has a big emoji "picture" to make it stick,
// the meaning, and a natural example. (The AFCAT source book contains no idioms,
// so these are the most commonly-asked ones across AFCAT / SSC / bank exams.)

export type Idiom = {
  phrase: string;
  meaning: string;
  pic: string;        // emoji picture (1–3 emojis)
  example: string;
  picFilter?: string; // optional CSS filter, e.g. to recolour an emoji
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
