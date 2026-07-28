// ── "Only one option can be defended" ────────────────────────────────────────
// The complaint this exists for, in the user's own words across several
// sessions: answers that were marked wrong when they were arguable, and options
// where more than one looked right. Two live examples from the practice reel:
//
//   The plan was ......... → vague / ambiguous / unclear / nebulous
//   Inspector Gill felt ......... → invincible / unbeatable / indomitable / unstoppable
//
// Every option in those is defensible, so the key is a coin toss. Telling the
// model "exactly one option can be defended" helps but does not hold — small
// models reach for the nearest word when they run out of ideas.
//
// So we check it instead, using the thesaurus the app already ships:
// data/vocabulary.ts gives 118 words with their synonyms and antonyms. Two
// options that sit in the same synonym cluster cannot both be wrong, so the
// question is thrown away rather than shown to a student.

import { VOCAB } from "@/data/vocabulary";

/**
 * Families the vocabulary file doesn't connect on its own — words that reached
 * the reel as co-defensible options, plus the clusters the exam draws on most.
 * Each row is a set of words that would all be arguable in the same blank.
 */
const NEAR_SYNONYMS: string[][] = [
  // improve/strengthen sit in one row on purpose: as options in the same
  // question they are mutually arguable, which is the only thing that matters
  // here. "DEBILITATE → strengthen / weaken / enfeeble / improve" had two
  // defensible answers because they were treated as different ideas.
  ["improve", "better", "ameliorate", "enhance", "upgrade", "refine", "strengthen", "fortify", "reinforce", "bolster", "invigorate"],
  ["weaken", "enfeeble", "debilitate", "sap", "undermine"],
  ["unbeatable", "invincible", "unconquerable", "indomitable", "unstoppable", "insuperable"],
  ["vague", "unclear", "ambiguous", "nebulous", "hazy", "obscure", "imprecise"],
  ["clear", "lucid", "coherent", "distinct", "explicit"],
  ["brave", "courageous", "valiant", "gallant", "intrepid", "fearless", "dauntless"],
  ["cowardly", "timid", "craven", "fearful"],
  ["stubborn", "obstinate", "headstrong", "intransigent", "unyielding", "adamant", "refractory"],
  ["angry", "furious", "irate", "livid", "enraged", "incensed"],
  ["calm", "serene", "placid", "tranquil", "composed", "unruffled"],
  ["sad", "gloomy", "morose", "melancholy", "despondent", "dejected", "disheartened", "sullen"],
  ["happy", "joyful", "elated", "jubilant", "cheerful", "jovial", "merry", "overjoyed"],
  ["praise", "laud", "extol", "acclaim", "commend", "applaud", "eulogise", "eulogize"],
  ["criticise", "criticize", "censure", "condemn", "denounce", "decry", "rebuke", "reprimand", "castigate", "admonish"],
  ["kind", "benevolent", "compassionate", "merciful", "humane", "benign"],
  ["cruel", "ruthless", "merciless", "heartless", "callous", "malevolent"],
  ["talkative", "garrulous", "loquacious", "voluble", "chatty"],
  ["silent", "taciturn", "reticent", "reserved", "quiet"],
  ["rich", "wealthy", "affluent", "prosperous", "opulent"],
  ["poor", "destitute", "impoverished", "penniless", "indigent"],
  ["stingy", "miserly", "niggardly", "parsimonious", "frugal", "thrifty"],
  ["wasteful", "extravagant", "prodigal", "profligate", "spendthrift"],
  ["increase", "augment", "enlarge", "boost", "amplify", "expand"],
  ["decrease", "diminish", "dwindle", "wane", "abate", "subside", "lessen", "shrink"],
  ["worsen", "aggravate", "exacerbate", "intensify"],
  ["soothe", "alleviate", "allay", "mitigate", "assuage", "pacify", "placate", "mollify", "appease"],
  ["fake", "spurious", "counterfeit", "bogus", "sham"],
  ["genuine", "authentic", "real", "bona fide"],
  ["clever", "astute", "shrewd", "canny", "adroit", "sharp"],
  ["foolish", "stupid", "idiotic", "inane", "asinine"],
  ["harmful", "pernicious", "injurious", "deleterious", "detrimental", "ruinous"],
  ["short-lived", "fleeting", "transient", "evanescent", "ephemeral", "transitory"],
  ["permanent", "lasting", "enduring", "perpetual", "everlasting"],
  ["abundant", "plentiful", "copious", "profuse", "ample", "luxuriant"],
  ["scarce", "scanty", "meagre", "sparse", "paltry"],
  ["begin", "commence", "start", "initiate", "inaugurate"],
  ["end", "conclude", "terminate", "finish", "cease"],
  ["honest", "candid", "forthright", "truthful", "frank", "upright"],
  ["dishonest", "devious", "deceitful", "crooked", "duplicitous"],
];

// word → the ids of every cluster it belongs to.
const clusters = (() => {
  const map = new Map<string, Set<number>>();
  let id = 0;
  const add = (word: string, cid: number) => {
    const w = word.trim().toLowerCase();
    if (!w) return;
    if (!map.has(w)) map.set(w, new Set());
    map.get(w)!.add(cid);
  };

  for (const row of NEAR_SYNONYMS) {
    const cid = id++;
    row.forEach((w) => add(w, cid));
  }
  // A word and its synonyms are one cluster; its antonyms are another. Both
  // sides matter: two synonyms of the headword are equally right, and two
  // antonyms are equally right.
  for (const v of VOCAB) {
    const syn = id++;
    add(v.phrase, syn);
    (v.synonyms ?? []).forEach((w) => add(w, syn));
    if (v.antonyms?.length) {
      const ant = id++;
      v.antonyms.forEach((w) => add(w, ant));
    }
  }
  return map;
})();

const clean = (s: string) => s.trim().toLowerCase().replace(/^(a|an|the|to)\s+/, "").replace(/[^a-z\s-]/g, "").trim();

/** The clusters a single option belongs to (empty when we don't know the word). */
function clustersOf(option: string): Set<number> {
  return clusters.get(clean(option)) ?? new Set();
}

/**
 * True when a WRONG option is a near-synonym of the correct one — so the
 * student can defend two answers and the key is a coin toss.
 *
 * Deliberately not "any two options clash": the exam's signature antonym item
 * makes every wrong option a synonym of the headword ("CAJOLE → bully /
 * wheedle / coax / persuade"). Those wrong options are near-synonyms of EACH
 * OTHER by design, and none of them is arguable against the answer. Only the
 * answer's own family matters.
 *
 * Single-word options only — multi-word options are phrases we can't judge
 * this way.
 */
export function answerArguable(options: string[], correctIndex: number): boolean {
  const answer = options[correctIndex];
  if (!answer) return false;
  const mine = clustersOf(answer);
  if (mine.size === 0 || clean(answer).includes(" ")) return false;

  return options.some((o, i) => {
    if (i === correctIndex) return false;
    const c = clean(o);
    if (!c || c.includes(" ")) return false;
    for (const id of clustersOf(o)) if (mine.has(id)) return true;
    return false;
  });
}

/** True when the two words would be arguable against each other. */
export function sameFamily(a: string, b: string): boolean {
  const ca = clustersOf(a);
  if (ca.size === 0) return false;
  for (const id of clustersOf(b)) if (ca.has(id)) return true;
  return false;
}
