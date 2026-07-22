// ── Idioms & Phrases ─────────────────────────────────────────────────────────
// Grouped by THEME, because that is how they actually stick: every idiom that
// means "to lose" sits beside every other idiom that means "to lose", so in the
// exam you recognise the family instead of hunting through 250 unrelated
// phrases. (This is how the cds.journey "100 Most Asked Idioms" class teaches
// them, and where most of the origin stories below come from.)
//
// Each entry carries:
//   meaning   — the exam answer, in plain words
//   pic       — 1–3 emojis that actually depict it
//   story     — where the phrase comes from, or a memory hook when the origin is
//               lost. This REPLACES the old example sentence: knowing why a
//               phrase means what it means is what stops you second-guessing in
//               the exam. Shown in the reel and in the detail card.
//   hardWords — only when the phrase itself contains a word worth glossing
//               (hay, squib, gauntlet, pasture…). Rendered as a small word-note.

export type Idiom = {
  phrase: string;
  meaning: string;
  pic: string;        // emoji picture (1–3 emojis)
  story?: string;     // origin / backstory / memory trick
  hardWords?: { word: string; meaning: string }[];
  picFilter?: string; // optional CSS filter, e.g. to recolour an emoji
  group?: string;     // filled in from the group below — never set by hand
  // Vocabulary cards reuse this shape in the reel (see data/vocabulary.ts):
  kind?: "word";      // set for vocab words; idioms leave it unset
  example?: string;   // vocab keeps its example sentence; idioms use `story`
  synonyms?: string[];
  antonyms?: string[];
};

export type IdiomGroup = {
  name: string;
  icon: string;
  note: string;       // what ties the group together
  items: Idiom[];
};

export const IDIOM_GROUPS: IdiomGroup[] = [

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Ears & Listening",
    icon: "👂",
    note: "The exam loves these because they all contain the word EAR and mean completely different things. Learn them together and the options stop confusing you.",
    items: [
      { phrase: "One's ears are burning", meaning: "To sense that people are talking about you behind your back.", pic: "👂🔥", story: "The Romans were certain the body knew when it was being discussed. Pliny the Elder, a Roman naturalist who spent his life writing down everything people believed, recorded the rule in the first century AD: a burning right ear meant you were being praised, the left meant you were being insulted. Rome fell. The superstition did not." },
      { phrase: "Turn a deaf ear", meaning: "To deliberately ignore what someone says.", pic: "🙉", story: "Not real deafness — chosen deafness. Picture yourself nodding along to a scolding while hearing none of it: the ear works, you have simply switched it off." },
      { phrase: "All ears", meaning: "Listening with complete attention.", pic: "👂👀", story: "The image is a person made entirely of ears — no other part of them is doing anything, every bit is listening. \"Tell me, I'm all ears.\"" },
      { phrase: "Walls have ears", meaning: "Be careful what you say — someone may be listening.", pic: "🧱👂", story: "Catherine de' Medici was an Italian noblewoman who became queen of France in the 1500s, and she was sure the rival families at court were plotting against her sons. So she had narrow listening tubes built inside the walls of the Louvre, her palace in Paris, running from the guest rooms down to her own — whatever a visitor whispered, she heard it. English had the warning by 1620." },
      { phrase: "Prick up one's ears", meaning: "To suddenly start listening very carefully.", pic: "🐴👂", story: "From horses and dogs — their ears physically stand up the instant they catch a sound. Say something interesting and a human does the same thing invisibly." },
      { phrase: "Someone's ears are flapping", meaning: "Someone is trying to eavesdrop on a private conversation.", pic: "🦋👂", story: "Ears flapping like wings — straining so hard towards a conversation they seem to move. The person doing it is an eavesdropper.", hardWords: [{ word: "eavesdrop", meaning: "to secretly listen to other people's private talk" }] },
      { phrase: "Play it by ear", meaning: "To deal with a situation as it develops, without a plan.", pic: "🎹👂", story: "A musician who plays by ear performs a tune having only heard it — no sheet music, no rehearsal. Doing life that way means improvising as you go." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Defeat & Failure",
    icon: "💀",
    note: "Every one of these means 'to lose' or 'to fail'. If all four options look like defeat, they probably are — choose by shade of meaning.",
    items: [
      { phrase: "Meet one's Waterloo", meaning: "To suffer a final, crushing defeat you cannot come back from.", pic: "⚔️🏳️", story: "Napoleon Bonaparte conquered most of Europe and twice made himself ruler of France. In 1815, near a village called Waterloo in Belgium, a British and Prussian army beat him in a single day. He lost the battle, his army and his empire together, and was exiled to a rock in the middle of the Atlantic. He never came back — and neither does anyone who meets their Waterloo." },
      { phrase: "Bite the dust", meaning: "To be defeated, to fail, or to die.", pic: "😵🏜️", story: "From wrestling and battlefields alike: the loser ends face-down with his mouth in the dirt. Once your shoulders are in the dust, the fight is over." },
      { phrase: "Fall flat", meaning: "To fail completely to produce the intended effect.", pic: "🎤😐", story: "A joke that falls flat lands on the floor instead of landing with the audience — no laugh, no lift, just silence." },
      { phrase: "Go up in smoke", meaning: "To come to nothing; to fail completely.", pic: "💨🔥", story: "Everything you built, converted into smoke — you can watch it leaving and there is nothing left to hold. All that effort gone in vain." },
      { phrase: "Be on the ropes", meaning: "To be close to defeat and collapse.", pic: "🥊🪢", story: "In boxing, a fighter driven back onto the ring ropes has nowhere left to retreat and is taking every punch. Still standing — but only just." },
      { phrase: "Come a cropper", meaning: "To fail disastrously; to have a heavy fall.", pic: "🐎🤕", story: "Old hunting slang: to fall 'neck and crop' was to come off a horse headfirst, all in a heap. A spectacular failure, not a quiet one." },
      { phrase: "Go down like a lead balloon", meaning: "To be received very badly.", pic: "🎈🪨", story: "A balloon filled with lead does the exact opposite of what a balloon is for. Your idea did not float — it dropped." },
      { phrase: "Fizzle out", meaning: "To gradually lose momentum and end weakly.", pic: "🎆💧", story: "The sound of a firework that hisses, sputters and dies without the bang. Started with promise, finished with a shrug." },
      { phrase: "Go belly up", meaning: "To fail completely; to collapse.", pic: "🐟⬆️", story: "A dead fish floats upside down with its belly to the sky. Businesses that die do exactly the same thing." },
      { phrase: "Throw in the towel", meaning: "To admit defeat and give up.", pic: "🥊🤍", story: "A boxer's trainer throws the towel into the ring to stop the fight when his man cannot continue. The towel hitting the canvas IS the surrender." },
      { phrase: "Throw up the sponge", meaning: "To give up the struggle; to surrender.", pic: "🧽🏳️", story: "The older version of throwing in the towel — before towels, the corner man tossed up the water sponge to signal his fighter was finished." },
      { phrase: "Throw up one's hands", meaning: "To give up in despair or frustration.", pic: "🙌😩", story: "The universal gesture of surrender to circumstances: hands in the air, I am done trying." },
      { phrase: "Cry uncle", meaning: "To admit defeat and surrender.", pic: "🗣️🏳️", story: "American schoolyard wrestling — the pinned boy had to shout \"uncle!\" before he was let up. Saying the word is the confession that you lost." },
      { phrase: "Go down fighting", meaning: "To keep resisting until the very end, even in defeat.", pic: "⚔️🔥", story: "The opposite of throwing in the towel. You still lose — but nobody gets to say you stopped trying." },
      { phrase: "Eat humble pie", meaning: "To admit you were wrong and accept humiliation.", pic: "🥧😔", story: "'Umbles' were the liver, heart and entrails of a deer — the leftovers given to servants while the lord ate the good meat. Eating umble pie put you visibly at the bottom table.", hardWords: [{ word: "entrails", meaning: "the inner organs of an animal" }] },
      { phrase: "Lose ground", meaning: "To fall behind; to lose an advantage you had.", pic: "📉🏃", story: "From warfare — territory you captured is being taken back. Every step backwards is ground you already paid for once." },
      { phrase: "Hit below the belt", meaning: "To act unfairly, especially in a contest or argument.", pic: "🥊⬇️", story: "Boxing had almost no rules until the 1860s, when the Marquess of Queensberry lent his name to a written code. One of its rules banned punching below the waistband, because the area is too easy to injure. Attacking someone's family in an argument is the verbal version of the same foul." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Success & Brilliance",
    icon: "🏆",
    note: "The mirror image of the defeat family — all of these mean doing something remarkably well.",
    items: [
      { phrase: "Set the Thames on fire", meaning: "To do something remarkable and extraordinary.", pic: "🔥🌊", story: "The Thames is a wide, deep, thoroughly wet river — setting it alight is impossible. So it is usually said in the negative: \"he'll never set the Thames on fire.\"", hardWords: [{ word: "Thames", meaning: "the great river running through London — said 'temz'" }] },
      { phrase: "Have the Midas touch", meaning: "The ability to make a success of everything you take on.", pic: "👆✨", story: "Midas was a king in Greek legend who did a favour for a god and was offered any reward he liked. He asked that everything he touched turn to gold. It worked perfectly — his bread turned to gold, his wine turned to gold, and when his daughter ran to greet him she turned to gold too. He begged to have the gift taken back. The phrase kept only the golden half of the story." },
      { phrase: "A purple patch", meaning: "A period of outstanding success and good fortune.", pic: "💜🎽", story: "Purple dye was once so costly that only emperors wore it, so a purple patch marked the finest section of cloth. A run of brilliant form is your purple stretch." },
      { phrase: "Strike gold", meaning: "To achieve a sudden, unexpected success.", pic: "⛏️🪙", story: "From the gold rushes — months of digging through worthless rock, then one strike changes everything." },
      { phrase: "Ride the crest of a wave", meaning: "To enjoy peak popularity or success.", pic: "🏄🌊", story: "The surfer at the very top of the wave travels fastest and highest — and knows the wave will break. Enjoy the crest while it holds." },
      { phrase: "Come up roses", meaning: "To turn out successfully in the end.", pic: "🌹🌹", story: "A garden you worried over all season finally opening into roses. Whatever the trouble along the way, the result was beautiful." },
      { phrase: "A cut above", meaning: "Clearly better and superior to the rest.", pic: "✂️👑", story: "From tailoring — a master tailor's cut fitted so much more cleanly that the garment was visibly a cut above the others on the rail." },
      { phrase: "Cut the mustard", meaning: "To meet the required standard; to succeed at a task.", pic: "🌭✅", story: "Mustard was the sharp, high-grade seasoning of the 1800s, and 'the real mustard' meant the genuine best. To cut the mustard is to actually reach that standard." },
      { phrase: "Yeoman's service", meaning: "Excellent, loyal and valuable work.", pic: "🛡️🎯", story: "Yeomen were English farmers who owned their own small patch of land — below the gentry, above the labourers. In wartime they served as archers, and at Agincourt in 1415 their longbows destroyed a French army several times their size. The phrase is praise for solid, unglamorous, completely dependable work.", hardWords: [{ word: "yeoman", meaning: "a free farmer of old England who also served as a soldier" }] },
      { phrase: "Rest on one's laurels", meaning: "To rely on past success and stop making an effort.", pic: "🏅😴", story: "Victors in ancient Greece were crowned with laurel wreaths. Sitting back wearing last year's wreath is the warning — yesterday's crown wins nothing today.", hardWords: [{ word: "laurels", meaning: "a crown of leaves given to winners in ancient Greece" }] },
      { phrase: "Steal the show", meaning: "To attract the most attention and admiration.", pic: "🎭⭐", story: "The supporting actor whose scene is so good that the audience forgets the lead. He did not own the show — he took it." },
      { phrase: "Go the extra mile", meaning: "To make more effort than is required of you.", pic: "🏃➕", story: "Roman law allowed a soldier to order any civilian in occupied territory to carry his pack for one mile. It was a deeply resented rule. In the Sermon on the Mount, Jesus told listeners that when a soldier forces you to go one mile, go two — the second mile being the one nobody could make you walk." },
      { phrase: "Leave no stone unturned", meaning: "To make every possible effort to find or achieve something.", pic: "🪨🔎", story: "After the Persians were beaten at Plataea in 479 BC, a rumour spread that their general had buried a treasure under his tent. The man hunting for it dug and found nothing, so he asked the oracle at Delphi — the priestess Greeks travelled to for divine advice. Turn every stone, she told him. He did, and the treasure was there." },
      { phrase: "Above and beyond the call of duty", meaning: "To do far more than what is expected.", pic: "🎖️🌟", story: "The wording comes from military citations — the medal is not for doing the job, it is for what you did after the job was done." },
      { phrase: "Rise to the occasion", meaning: "To perform well in a difficult or challenging situation.", pic: "🧗🌟", story: "The pressure is the test. Anyone can do it on an easy day; rising means finding the extra level exactly when the day is hard." },
      { phrase: "Blaze a trail", meaning: "To be the first to do something new; to pioneer.", pic: "🌲🪓", story: "Explorers cut 'blazes' — chips of bark off trees — to mark a new route through forest so those behind could follow. The first one through does the cutting.", hardWords: [{ word: "blaze", meaning: "a mark cut into a tree to show a path" }] },
      { phrase: "Break new ground", meaning: "To do something innovative that has not been done before.", pic: "⛏️🌱", story: "The first spade into untouched earth. Nobody has built here before, which is exactly why it is harder and why it counts." },
      { phrase: "By leaps and bounds", meaning: "Very rapidly, of progress or growth.", pic: "🦘📈", story: "Two words for jumping, stacked together for emphasis — not walking, not running, but covering ground in bounds." },
      { phrase: "A Herculean task", meaning: "A job needing enormous strength or effort.", pic: "💪🏛️", story: "Hercules was the strongest hero in Greek myth, and as punishment for a crime committed in madness he was set twelve labours meant to be impossible: strangle a lion no weapon could cut, kill a nine-headed monster that grew two heads back for each one struck off, clean thirty years of dung out of a king's stables in a single day. He finished all twelve." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Short-lived Success",
    icon: "🎆",
    note: "Success that arrives fast and dies faster. A favourite AFCAT set because the options sound flattering but the meaning is negative.",
    items: [
      { phrase: "A flash in the pan", meaning: "A short-lived success that quickly fades.", pic: "🔫✨", story: "Flintlock muskets held a pinch of gunpowder in a small pan. Sometimes the powder flashed brightly but failed to fire the main charge — all flash, no shot." },
      { phrase: "A nine days' wonder", meaning: "Something that attracts great attention for only a short time.", pic: "📅🤩", story: "An English proverb of the 1500s: \"a wonder lasts nine days, and then the puppy's eyes are open.\" Newborn dogs open their eyes on the ninth day — and everyone stops staring." },
      { phrase: "Here today, gone tomorrow", meaning: "Popular or present for only a brief period.", pic: "👋💨", story: "Said of fame, fashion and money alike. The phrase is its own warning — whatever arrived this quickly can leave the same way." },
      { phrase: "A one-hit wonder", meaning: "Someone who achieves a single success and then fades into obscurity.", pic: "🎵1️⃣", story: "From the music charts — the singer with one unforgettable song and nothing after it, playing the same track forever.", hardWords: [{ word: "obscurity", meaning: "the state of being unknown or forgotten" }] },
      { phrase: "Rise like a rocket, fall like a stick", meaning: "To succeed very rapidly and then decline just as quickly.", pic: "🚀🪵", story: "The pamphleteer Thomas Paine wrote this about the politician Edmund Burke in 1791, after Burke turned against the French Revolution: he rose like a rocket, he fell like a stick. A firework climbs beautifully, burns out at the top, and the bare wooden stick drops straight back down." },
      { phrase: "A damp squib", meaning: "Something disappointing that fails to meet expectations.", pic: "🧨💧", story: "A squib is a small firework. Let it get damp and it gives a sad hiss instead of a bang — all the build-up, none of the explosion.", hardWords: [{ word: "squib", meaning: "a small firework that hisses, then explodes" }] },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Easy Targets",
    icon: "🎯",
    note: "All of these describe someone or something trivially easy to attack, beat or achieve.",
    items: [
      { phrase: "A sitting duck", meaning: "An easy target for attack or criticism.", pic: "🦆🎯", story: "Hunters knew a duck resting on the water was a far easier shot than one in flight. Anyone who cannot defend themselves is sitting on the water." },
      { phrase: "Low-hanging fruit", meaning: "The easiest target or the simplest task to complete.", pic: "🥭🙌", story: "You pick the mangoes you can reach from the ground before anyone fetches a ladder. Sensible — though the best fruit is usually higher up." },
      { phrase: "Like shooting fish in a barrel", meaning: "Something extremely easy to do or defeat.", pic: "🐟🛢️", story: "Fish packed into a barrel have nowhere to swim. There is no skill in the shot at all — which is the whole point of the insult." },
      { phrase: "Fair game", meaning: "Someone who may legitimately be attacked or criticised.", pic: "🦌⚖️", story: "Hunting law listed which animals were 'fair game' — legal to hunt that season. Say something publicly and you become fair game for the reply." },
      { phrase: "Dead meat", meaning: "Someone certain to be punished, defeated or to fail.", pic: "🥩💀", story: "Not a threat about the future — a verdict about the present. You are already finished, the paperwork just hasn't caught up." },
      { phrase: "A hard nut to crack", meaning: "A difficult problem, or a person difficult to deal with.", pic: "🥜🔨", story: "The opposite of this whole family. Some nuts open in your fingers; some take the hammer and still hold together." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Retirement & Past One's Best",
    icon: "🌅",
    note: "Being finished, obsolete or set aside — gentle words for a hard idea.",
    items: [
      { phrase: "Put out to pasture", meaning: "To retire someone considered too old or no longer useful.", pic: "🐴🌾", story: "Working horses and cattle too old for the plough were turned loose into the grazing field to live out their days. Kind — but unmistakably the end of the working life.", hardWords: [{ word: "pasture", meaning: "grassy land where animals are put out to graze" }] },
      { phrase: "Past one's prime", meaning: "Past the peak of one's ability, health or success.", pic: "🕰️📉", story: "Your 'prime' is the highest point of the curve. Past it you are still on the same curve — just on the way down." },
      { phrase: "Hang up one's boots", meaning: "To retire from a profession or sport.", pic: "👟🪝", story: "The footballer's boots go on a hook and stay there. Cricketers hang up their gloves, soldiers their uniform — same gesture, same meaning." },
      { phrase: "Go the way of the dodo", meaning: "To become extinct, obsolete and completely out of date.", pic: "🦤🚫", story: "The dodo of Mauritius was flightless and unafraid of humans, and was gone within a century of being found. It has been the byword for extinct ever since.", hardWords: [{ word: "obsolete", meaning: "no longer used; out of date" }] },
      { phrase: "Kick the bucket", meaning: "To die.", pic: "🪣🦶", story: "One explanation: a slaughtered pig hung from a wooden beam called a 'bucket' and kicked it in its last moments. Another: a person standing on an upturned bucket kicks it away. Grim either way — and always informal." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Firm Beliefs & Stubbornness",
    icon: "🪨",
    note: "Refusing to change your position — sometimes admirable, sometimes just obstinate.",
    items: [
      { phrase: "Dyed in the wool", meaning: "Having fixed beliefs that are very unlikely to change.", pic: "🐑🎨", story: "Wool dyed as raw fleece — before it is ever spun into thread — takes the colour right into the fibre and never fades. Dye the finished cloth instead and it washes out. Some beliefs were dyed at the fibre stage." },
      { phrase: "Stick to one's guns", meaning: "To refuse to change your opinion despite opposition.", pic: "🔫🛡️", story: "Naval gunners were expected to stay at their cannon under fire rather than abandon the position. Holding an unpopular opinion is the civilian version." },
      { phrase: "Dig in one's heels", meaning: "To refuse stubbornly to change your position.", pic: "🦶🪨", story: "Picture someone being pulled forward who plants both heels in the ground. No argument, no discussion — just weight and refusal." },
      { phrase: "Stand firm", meaning: "To hold your position with determination.", pic: "🧍🗻", story: "The plainest member of the family — feet planted, not moving, whatever is pushing." },
      { phrase: "Hold fast", meaning: "To remain loyal and steadfast.", pic: "⚓🤝", story: "A sailor's order: grip the rope and do not let go, whatever the sea does. Old sailors tattooed HOLD FAST across their knuckles for exactly that reason." },
      { phrase: "Be wedded to", meaning: "To be unwilling to abandon a belief or method.", pic: "💍💭", story: "Married to an idea — which is why giving it up feels like a divorce rather than a change of mind." },
      { phrase: "Have a bee in one's bonnet", meaning: "To be obsessed with one particular idea or topic.", pic: "🐝🎩", story: "A bee trapped under your hat leaves you exactly one thought and will not let it go. That is the person who brings every conversation back to their one subject.", hardWords: [{ word: "bonnet", meaning: "an old-fashioned hat tied under the chin" }] },
      { phrase: "A chip on one's shoulder", meaning: "To be habitually resentful and easily offended.", pic: "🪵🤨", story: "A 19th-century American custom — a boy spoiling for a fight balanced a wood chip on his shoulder and dared anyone to knock it off. Some people walk around permanently chipped." },
      { phrase: "Put one's foot down", meaning: "To firmly refuse to allow something.", pic: "🦶⛔", story: "From driving — the foot goes down on the brake and the discussion is finished. The gesture is the decision." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Horses",
    icon: "🐎",
    note: "Every horse idiom in one place — the exam sets them against each other precisely because they all say HORSE and mean entirely different things.",
    items: [
      { phrase: "A stalking horse", meaning: "A person or plan used to hide your real intentions.", pic: "🐴🎭", story: "Hunters in old Europe walked crouched behind a horse — sometimes a canvas one — to creep within range of birds. The horse was seen; the hunter was not." },
      { phrase: "Horse sense", meaning: "Sound practical judgement; basic common sense.", pic: "🐴🧠", story: "American frontier praise: a good horse will not walk off a cliff edge or drink bad water. Not clever — sensible, which is often rarer." },
      { phrase: "Work like a horse", meaning: "To work extremely hard.", pic: "🐴💪", story: "Before engines, the plough horse was the hardest worker anyone could name. This and 'eat like a horse' are cousins — both mean 'in enormous quantity'." },
      { phrase: "Eat like a horse", meaning: "To eat very large amounts of food.", pic: "🐴🍽️", story: "A working horse eats a serious fraction of its own weight in fodder every day. Said of a thin person, it becomes a joke about where it all goes." },
      { phrase: "Put the cart before the horse", meaning: "To do two things in the wrong order.", pic: "🛒🐴", story: "The horse pulls; the cart follows. Reverse them and nothing moves at all — a perfect picture of a plan built in the wrong sequence." },
      { phrase: "Get on one's high horse", meaning: "To behave arrogantly and self-righteously.", pic: "🐴👃", story: "Medieval nobles rode tall horses in processions, literally looking down on the crowd. Anyone lecturing you from a moral height is up on the same animal." },
      { phrase: "A dark horse", meaning: "Someone whose abilities are unknown until they surprise everyone.", pic: "🐎", picFilter: "grayscale(1) brightness(0.45)", story: "Racing slang for a horse whose form nobody knew, so nobody backed it — and then it won. Said of the quiet candidate who tops the merit list." },
      { phrase: "Flog a dead horse", meaning: "To waste effort on something already hopeless.", pic: "🐴🪅", story: "Whip a living horse and it pulls. Whip a dead one and you are only tiring your arm — the outcome was settled before you started." },
      { phrase: "A Trojan horse", meaning: "Something that appears harmless but is meant to destroy from within.", pic: "🐴🏛️", story: "The Greeks besieged the city of Troy for ten years and never broke in. So they built an enormous hollow horse of wood, hid soldiers inside it, and sailed off as though giving up, leaving the horse behind as a parting gift. The Trojans dragged it through their own gates and spent the night celebrating. The soldiers climbed out in the dark and opened the city to the returning fleet." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Secrets, Deceit & Disguise",
    icon: "🕵️",
    note: "Hiding the truth, or hiding what you really are. The biggest single family in the exam.",
    items: [
      { phrase: "A wolf in sheep's clothing", meaning: "A dangerous person who appears harmless and innocent.", pic: "🐺🐑", story: "Aesop was a storyteller in ancient Greece whose short animal fables were used to teach children right from wrong. In this one, a wolf drapes a sheep's fleece over himself and walks into the flock unnoticed, eating at his leisure. The danger is not that he looks dangerous — it is that he does not." },
      { phrase: "Show the cloven hoof", meaning: "To unintentionally reveal one's hidden evil nature.", pic: "🐐👹", story: "Christian folklore drew the Devil with split goat's hooves. However human he looked, the feet gave him away — so the phrase is about the slip that reveals the truth.", hardWords: [{ word: "cloven", meaning: "split into two parts" }, { word: "hoof", meaning: "the hard foot of a horse, goat or cow" }] },
      { phrase: "Cloak and dagger", meaning: "Involving secrecy, espionage and undercover activity.", pic: "🧥🗡️", story: "From a whole genre of European plays: the hero wrapped in a long cloak to hide his face, and a dagger under it. Both props say 'this is happening in secret'.", hardWords: [{ word: "espionage", meaning: "spying to get secret information" }] },
      { phrase: "A red herring", meaning: "A clue or topic that distracts attention from the real issue.", pic: "🐟🚩", story: "Smoking a herring turns it reddish-brown and gives it an overpowering smell. In 1807 William Cobbett, an English journalist known for attacking the government, wrote that as a boy he had dragged one across a trail to pull the hounds off a hare. His real target was the newspapers, which he said chased false stories the same way — and the phrase took his meaning." },
      { phrase: "A smoke screen", meaning: "Something used to conceal the truth or one's real intentions.", pic: "💨🛡️", story: "Warships released thick smoke to hide their movements from the enemy. A convenient distraction does the same job with words." },
      { phrase: "Whitewash", meaning: "To deliberately hide or cover up faults and wrongdoing.", pic: "🖌️🧱", story: "Cheap white lime paint over a stained wall — the marks are still underneath, but nobody can see them any more." },
      { phrase: "Sweep under the carpet", meaning: "To hide a problem instead of dealing with it.", pic: "🧹🪟", story: "The lazy servant's trick: the dust is out of sight, the room looks clean, and the pile is still growing under there." },
      { phrase: "Cover one's tracks", meaning: "To hide the evidence of what one has done.", pic: "👣🧹", story: "From hunting and warfare — brushing out your footprints so nobody can follow you back." },
      { phrase: "Paper over the cracks", meaning: "To make superficial repairs while avoiding the real problem.", pic: "📄🧱", story: "Wallpaper hides a cracked wall beautifully — until the crack moves. The wall did not get any stronger.", hardWords: [{ word: "superficial", meaning: "on the surface only; not deep or thorough" }] },
      { phrase: "A skeleton in the cupboard", meaning: "A shameful secret kept hidden from others.", pic: "💀🚪", story: "Victorian doctors sometimes kept a real skeleton for study — hardly something to show visitors. The image of a body locked in the wardrobe became every family's hidden shame." },
      { phrase: "A snake in the grass", meaning: "A treacherous person who pretends to be a friend.", pic: "🐍🌿", story: "The Roman poet Virgil wrote the line around 40 BC, as a warning to a boy picking flowers in a meadow: there is a snake hiding in the grass. The threat is invisible right up until the moment you have already put your foot down." },
      { phrase: "Cry wolf", meaning: "To raise a false alarm repeatedly so people stop believing you.", pic: "🐺📢", story: "Another of Aesop's fables. A shepherd boy, bored of watching sheep alone on a hillside, screamed that a wolf was attacking — and laughed as the whole village came running up to help. He did it a second time and they came again, angrier. The third time the wolf was real. He screamed, and nobody moved." },
      { phrase: "A Judas kiss", meaning: "An act of betrayal disguised as friendship and affection.", pic: "💋🗡️", story: "Judas was one of the twelve closest followers of Jesus. When he agreed to hand him over, the soldiers had a problem: it was dark, and they did not know which man to arrest. So Judas walked up and kissed him on the cheek in greeting, as a signal. The most affectionate gesture available, used to point out a target." },
      { phrase: "Thirty pieces of silver", meaning: "Money accepted for betraying someone's trust.", pic: "🪙🤝", story: "Thirty pieces of silver was what the priests paid Judas for identifying Jesus — roughly the price of a slave at the time, which is part of the insult. Ever since, the phrase names the payment rather than the crime: the sum somebody's loyalty turned out to cost." },
      { phrase: "Crocodile tears", meaning: "A false, insincere show of sorrow.", pic: "🐊💧", story: "Medieval travellers reported that crocodiles wept while devouring their prey. Their eyes really do water when they eat — which made the legend stick." },
      { phrase: "A cock and bull story", meaning: "An absurd, unbelievable excuse or tale.", pic: "🐓🐂", story: "Said to come from two coaching inns at Stony Stratford — The Cock and The Bull — whose travellers swapped ever taller tales between them." },
      { phrase: "To smell a rat", meaning: "To sense that something is wrong or dishonest.", pic: "👃🐀", story: "A dog can smell a rat hidden inside a wall long before anyone sees it. That instinct that something is off, before you have proof." },
      { phrase: "Let the cat out of the bag", meaning: "To reveal a secret by accident.", pic: "🐱👜", story: "A market trick: a piglet was sold in a sack, but a cat was swapped in. Open the bag before you get home and the fraud is out — along with the cat." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Punishment & Criticism",
    icon: "⚖️",
    note: "Being scolded, blamed or made to answer for what you did. Many share the same meaning — sort them by how harsh they are.",
    items: [
      { phrase: "Face the music", meaning: "To accept and endure the unpleasant consequences of one's actions.", pic: "🎵😬", story: "Two candidates: a disgraced officer was drummed out of the regiment to a beating drum, or an actor had to walk out and face the orchestra pit. Either way, you turn towards the sound and take it." },
      { phrase: "Run the gauntlet", meaning: "To endure a series of difficult attacks, criticisms or challenges.", pic: "🏃🥊", story: "A military punishment: the guilty soldier ran between two lines of his own comrades while every one of them struck him. There was no way through except through.", hardWords: [{ word: "gauntlet", meaning: "here, a double line of men striking a punished soldier" }] },
      { phrase: "Haul over the coals", meaning: "To criticise or reprimand someone severely.", pic: "🔥🗣️", story: "Medieval Europe tested the accused by dragging them over burning coals — survive and you were innocent. Now only the tongue does the burning.", hardWords: [{ word: "reprimand", meaning: "to scold someone officially" }] },
      { phrase: "Go through the mill", meaning: "To undergo a very difficult and painful experience.", pic: "⚙️😣", story: "Grain that goes through the millstones comes out completely transformed and utterly crushed on the way. Anyone who has been through the mill knows what it did." },
      { phrase: "Go through the wringer", meaning: "To experience severe stress and hardship.", pic: "🌀😵", story: "The wringer was the pair of rollers on an old washing machine that squeezed every drop out of the clothes. That is what the week did to you." },
      { phrase: "Bear the brunt", meaning: "To suffer the main force of an attack or hardship.", pic: "🛡️💥", story: "'Brunt' was the sharpest shock of a charge in battle. Someone in the line always takes it first and hardest — that person bears the brunt.", hardWords: [{ word: "brunt", meaning: "the main force or worst part of something" }] },
      { phrase: "Take someone to task", meaning: "To reprimand someone for a fault.", pic: "📋😠", story: "Originally to set a person a task as a punishment for wrongdoing. The scolding came bundled with the extra work." },
      { phrase: "Give someone a piece of one's mind", meaning: "To tell someone angrily what you think of them.", pic: "🧠💢", story: "You hand over a piece of your mind — unedited, unpolished, straight from the source. It is never a compliment." },
      { phrase: "Read someone the riot act", meaning: "To give someone a stern warning to stop behaving badly.", pic: "📜😤", story: "The British Riot Act of 1714 had to be read aloud to a crowd; anyone still gathered an hour later was arrested. Reading it was the final warning before consequences." },
      { phrase: "Dress someone down", meaning: "To scold someone severely.", pic: "👔😖", story: "Old military slang — the opposite of 'dressing up' a soldier for parade. A dressing-down strips him back down in front of everyone." },
      { phrase: "Pull someone up", meaning: "To correct and rebuke someone.", pic: "✋🗯️", story: "Like pulling up a horse mid-stride — you are stopped where you stand and told why." },
      { phrase: "Call someone to account", meaning: "To demand an explanation and hold someone responsible.", pic: "📒⚖️", story: "From bookkeeping — you are asked to produce your accounts and explain every entry. No explanation, no defence." },
      { phrase: "Heads will roll", meaning: "People will be severely punished or dismissed.", pic: "🪓😱", story: "A guillotine-era phrase, thankfully now metaphorical. In modern offices only careers are lost." },
      { phrase: "Take umbrage", meaning: "To take offence; to become resentful.", pic: "☂️😒", story: "'Umbra' is Latin for shade. To take umbrage is to feel someone has cast a shadow over you — a slight, real or imagined.", hardWords: [{ word: "umbrage", meaning: "offence or annoyance" }] },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Burdens & Constant Danger",
    icon: "⛓️",
    note: "Something heavy you cannot put down, or a threat that never goes away.",
    items: [
      { phrase: "An albatross around one's neck", meaning: "A heavy burden causing constant trouble and guilt.", pic: "🪶⛓️", story: "In Coleridge's poem The Rime of the Ancient Mariner (1798), a ship trapped in Antarctic ice is led out to open water by an albatross — an enormous seabird that sailors considered a sign of good luck. For no reason he can explain, one sailor shoots it. The wind dies, the ship is stranded, and the crew hang the dead bird around his neck so he has to wear his guilt where everyone can see it." },
      { phrase: "A millstone around one's neck", meaning: "A heavy and inescapable responsibility.", pic: "🪨⛓️", story: "A millstone weighs as much as a person. The Gospel image is of one tied to the neck of a wrongdoer — a burden you cannot possibly swim with.", hardWords: [{ word: "millstone", meaning: "a huge round stone used for grinding grain" }] },
      { phrase: "A cross to bear", meaning: "A difficult burden or trial one must endure.", pic: "✝️😔", story: "The condemned carried their own cross to the execution site. It names the private hardship each person carries without choosing it." },
      { phrase: "A monkey on one's back", meaning: "A persistent problem or addiction that will not leave.", pic: "🐒🎒", story: "In the Sinbad stories, an old man on a riverbank asks the sailor to carry him across on his shoulders. Once up, he locks his legs around Sinbad's neck and refuses to climb down, riding him for days until Sinbad tricks him off. The weight is bad; the fact that it will not let go is the point." },
      { phrase: "Carry the weight of the world on one's shoulders", meaning: "To be burdened with many worries and responsibilities.", pic: "🌍🏋️", story: "Atlas was a Titan who fought the Greek gods and lost. His punishment was to stand at the western edge of the world holding the entire sky on his shoulders, forever, never permitted to set it down. Anyone who looks permanently worn out by everybody else's problems has taken his job." },
      { phrase: "The sword of Damocles", meaning: "A constant threat of imminent danger.", pic: "🗡️👑", story: "Damocles was a flatterer at the court of Dionysius, the tyrant who ruled Syracuse in Sicily. He kept telling the king how lucky he was to have such power, so Dionysius offered to swap places for a day. Damocles took the throne and the feast delightedly — until he looked up and saw a sword hanging point-down over his head, tied by a single hair from a horse's tail. He asked to leave. That, said the king, is what my luck actually feels like.", hardWords: [{ word: "imminent", meaning: "about to happen at any moment" }] },
      { phrase: "A white elephant", meaning: "A costly possession that is useless and hard to maintain.", pic: "🐘🤍", story: "White elephants were sacred in Siam, today's Thailand — a king who owned one was seen as blessed, and the animal could never be put to work. Housing and feeding it could ruin whoever kept it. The tale that kings gifted them deliberately to bankrupt courtiers looks like a European invention of the 1800s, but the ruinous cost was real enough for the phrase to stick." },
      { phrase: "Hang by a thread", meaning: "To be in a very uncertain and dangerous situation.", pic: "🧵😰", story: "The single horse hair that held up the sword above Damocles' head. Nothing is technically wrong, and everything is technically fine — right up until the hair is not there any more." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Impossible Choices",
    icon: "🔀",
    note: "Trapped between two equally bad options — the classic AFCAT set, and they are near-synonyms.",
    items: [
      { phrase: "Between the devil and the deep blue sea", meaning: "Faced with two equally unpleasant choices.", pic: "😈🌊", story: "Sailor's talk: the 'devil' was the seam of the hull nearest the waterline. A man sealing it was wedged between that plank and the open ocean — no good direction." },
      { phrase: "Between Scylla and Charybdis", meaning: "Caught between two equally dangerous choices.", pic: "🐍🌀", story: "In Homer's Odyssey, Odysseus must sail a channel so narrow that both sides can reach his ship. On one cliff sits Scylla, a six-headed monster that plucks sailors off the deck; opposite her is Charybdis, a whirlpool that swallows whole vessels. He steers close to Scylla and loses six men, because losing six was better than losing everyone." },
      { phrase: "Out of the frying pan into the fire", meaning: "To escape one difficulty only to land in a worse one.", pic: "🍳🔥", story: "The fish leaps out of the hot pan feeling clever, and lands in the flames. Every escape is not an improvement." },
      { phrase: "On the horns of a dilemma", meaning: "Unable to choose between two difficult alternatives.", pic: "🐂🤔", story: "A charging bull has two horns — dodge one and you meet the other. Latin scholars called such an argument 'two-horned' long before it became English.", hardWords: [{ word: "dilemma", meaning: "a hard choice between two options" }] },
      { phrase: "Paint oneself into a corner", meaning: "To put oneself in a situation from which escape is difficult.", pic: "🎨📐", story: "Paint the floor working the wrong way and you end up in the far corner, wet paint on every side. Nobody did this to you." },
      { phrase: "In the same boat", meaning: "In the same difficult situation as others.", pic: "🛶👬", story: "At sea, everyone in the boat shares one fate — you cannot sink half of it. Small comfort, but genuine solidarity." },
      { phrase: "Sit on the fence", meaning: "To avoid taking a side in a dispute.", pic: "🤷🚧", story: "Standing on the boundary fence means you can drop into either field. Comfortable, briefly — until somebody insists you get down." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Irreversible Decisions",
    icon: "🌉",
    note: "The point of no return. Every one of these means 'you cannot undo this now'.",
    items: [
      { phrase: "Cross the Rubicon", meaning: "To take an irreversible step with serious consequences.", pic: "🌊⚔️", story: "The Rubicon was a small river marking the northern boundary of Italy, and Roman law forbade any general from bringing an army across it — that river was the line where a soldier became a rebel. In 49 BC Julius Caesar marched his legion over anyway. It meant civil war against Rome, and there was no version of the next morning in which he could take it back." },
      { phrase: "The die is cast", meaning: "An irrevocable decision has been made.", pic: "🎲✔️", story: "What Caesar is said to have called out as he crossed the Rubicon and started a civil war. A die is a single dice — once it has left your hand it is still rolling, and no amount of wishing changes the number it stops on.", hardWords: [{ word: "die", meaning: "one dice (the singular of dice)" }, { word: "irrevocable", meaning: "impossible to change or cancel" }] },
      { phrase: "Burn one's bridges", meaning: "To destroy any possibility of returning to an earlier situation.", pic: "🌉🔥", story: "Armies burned the bridge behind them so their own men could not retreat — and so knew they had to win. Also 'burn one's boats', from commanders who torched the fleet on landing." },
      { phrase: "Take the plunge", meaning: "To commit oneself to a risky or daunting action.", pic: "🏊💦", story: "There is no gradual way into cold water. At some point you stop testing it with your toe and go in." },
      { phrase: "Jump in at the deep end", meaning: "To undertake a difficult task without preparation.", pic: "🏊🕳️", story: "Learning to swim by being dropped where you cannot stand. Some people do learn this way — and some just swallow a lot of water." },
      { phrase: "Burn one's fingers", meaning: "To suffer loss because of a risky action.", pic: "🔥🤚", story: "Touch the pan once and you never do it absent-mindedly again. The loss is the lesson." },
      { phrase: "Take the bull by the horns", meaning: "To face a difficult situation boldly and directly.", pic: "🐂✊", story: "From bull-wrestling — the safest place is not far away, it is right up against the animal where the horns cannot swing at you. Terrifying, and correct." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Costly Victory & Self-harm",
    icon: "💔",
    note: "Winning in a way that costs more than losing, or damaging yourself while attacking someone else.",
    items: [
      { phrase: "A Pyrrhic victory", meaning: "A victory won at such a cost that it is not worth it.", pic: "🏆💀", story: "Pyrrhus was a Greek king who invaded Italy and beat the Romans in two great battles, in 280 and 279 BC. But Rome could replace its dead and he could not — he lost his best officers and most of his army winning. He is supposed to have said that one more victory like that would finish him. It did." },
      { phrase: "Win the battle but lose the war", meaning: "To gain a short-term success while suffering overall failure.", pic: "⚔️📉", story: "You made your point in the argument and lost the friendship. The scoreboard says you won." },
      { phrase: "Cut off one's nose to spite one's face", meaning: "To harm oneself while trying to harm someone else.", pic: "👃✂️", story: "A revenge so badly aimed that the damage lands on you. The medieval tale has nuns disfiguring themselves to repel raiders — protection at a permanent price." },
      { phrase: "Hoist by one's own petard", meaning: "To be harmed by the very trap one set for others.", pic: "💣🙃", story: "A petard was a small iron bomb that engineers strapped to a castle gate to blow it open. The fuses were unreliable and the man who lit one was regularly blown into the air by his own device. Shakespeare put the image into Hamlet around 1600, and it became the phrase for a trap that catches the person who set it.", hardWords: [{ word: "petard", meaning: "a small bomb used to blow open a door or gate" }, { word: "hoist", meaning: "lifted up (here, by an explosion)" }] },
      { phrase: "Add fuel to the fire", meaning: "To make a bad situation worse.", pic: "⛽🔥", story: "The fire was already burning. Every extra word you say is another log." },
      { phrase: "Add insult to injury", meaning: "To make a bad situation even more hurtful.", pic: "🤕🗯️", story: "From a Roman fable: a fly bites a bald man, he swats and misses, hitting himself. The bite was the injury — the laughter was the insult." },
      { phrase: "Twist the knife", meaning: "To make a painful situation even more upsetting.", pic: "🔪💔", story: "The stab was the damage; the twist is purely to increase it. That is what a needless reminder does." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Conflict & Enmity",
    icon: "⚔️",
    note: "Quarrels, challenges and long-running hostility. Watch for 'no love lost' — its meaning is the opposite of how it sounds.",
    items: [
      { phrase: "At daggers drawn", meaning: "In bitter hostility and open quarrel.", pic: "🗡️😠", story: "Not merely angry — the daggers are already out of their sheaths. The stage before the fight, with nothing left to hide." },
      { phrase: "Bad blood", meaning: "Feelings of anger, resentment and hostility between people.", pic: "🩸😤", story: "Older medicine believed the blood itself carried temperament, so ill feeling was literally bad blood. Careful in the exam: it means hostility, not disgrace — that is 'black sheep'." },
      { phrase: "At loggerheads", meaning: "In stubborn disagreement.", pic: "🔨🤬", story: "A loggerhead was a long iron tool with a heavy ball on the end, used for heating tar — and occasionally for hitting people. Two men at loggerheads were mid-brawl." },
      { phrase: "No love lost", meaning: "Mutual dislike and hostility between two people.", pic: "💔🙅", story: "A trap phrase. It once meant the opposite — that no affection was wasted — but sarcasm won, and today it means there was never any affection to lose." },
      { phrase: "Cross swords", meaning: "To enter into a dispute or argument.", pic: "⚔️🗣️", story: "The moment two blades meet is when the duel becomes real. Used now for arguments in meetings rather than courtyards." },
      { phrase: "Lock horns", meaning: "To enter into direct conflict with someone.", pic: "🐂🐂", story: "Two bulls fight by driving their horns together and pushing until one gives. Neither can walk away while they are locked." },
      { phrase: "Throw down the gauntlet", meaning: "To issue a bold challenge.", pic: "🧤⚔️", story: "A knight threw his armoured glove on the ground to challenge another. Picking it up accepted the duel — which is why we still 'take up' a challenge.", hardWords: [{ word: "gauntlet", meaning: "an armoured glove worn by a knight" }] },
      { phrase: "Beard the lion", meaning: "To confront a powerful, dangerous person fearlessly.", pic: "🦁✊", story: "Grabbing a lion by the beard, in its own den — the most direct possible way to face something that could destroy you." },
      { phrase: "Bell the cat", meaning: "To undertake a dangerous task that everyone else avoids.", pic: "🔔🐈", story: "In the fable, the mice agree that a bell on the cat would save them all. Then comes the only real question: who will put it on?" },
      { phrase: "A bone of contention", meaning: "The subject of a long-running dispute.", pic: "🐕🦴🐕", story: "Two dogs, one bone. The bone did nothing wrong — it is simply the thing they refuse to stop fighting over.", hardWords: [{ word: "contention", meaning: "argument or dispute" }] },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Making Peace",
    icon: "🕊️",
    note: "The reconciliation family — every one means to end a quarrel and be friends again.",
    items: [
      { phrase: "Bury the hatchet", meaning: "To end a quarrel and make peace.", pic: "🪓🕳️", story: "Native American peace ceremonies included burying weapons in the ground — the axe was put beyond reach so the agreement had a physical guarantee.", hardWords: [{ word: "hatchet", meaning: "a small axe" }] },
      { phrase: "Hold out an olive branch", meaning: "To offer peace and reconciliation after a conflict.", pic: "🕊️🌿", story: "In the Bible's flood story, Noah releases a dove to find out whether the water has gone down. It comes back with an olive leaf in its beak — proof that trees were standing above water again, and that the disaster was over. Greeks and Romans separately carried olive branches when approaching an enemy, to show the hands holding them were empty.", hardWords: [{ word: "reconciliation", meaning: "becoming friendly again after a quarrel" }] },
      { phrase: "Mend fences", meaning: "To restore friendly relations after a dispute.", pic: "🚧🔧", story: "Neighbouring farmers had to repair the boundary fence together, and the walk along it was where quarrels got settled. Good fences, good neighbours." },
      { phrase: "Patch up one's differences", meaning: "To settle a disagreement.", pic: "🩹🤝", story: "A patch is a repair, not a replacement — you both know the tear is there, and you have agreed to carry on anyway." },
      { phrase: "Let bygones be bygones", meaning: "To forget past quarrels and move on.", pic: "🕰️🤝", story: "A 'bygone' is simply a thing gone by. The phrase is an agreement to leave it in the past where it already is." },
      { phrase: "See eye to eye", meaning: "To agree completely with someone.", pic: "👁️👁️", story: "Two people at the same height, looking straight at one another — no looking up, no looking down, the same view of the matter." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Influence & Pulling Strings",
    icon: "🎭",
    note: "Getting things done through connections, power or money rather than merit.",
    items: [
      { phrase: "Pull strings", meaning: "To use influence to gain an unfair advantage.", pic: "🎭🧵", story: "Puppets move because someone above them pulls the strings — and the audience is meant to watch the puppet, not the hand." },
      { phrase: "Bob's your uncle", meaning: "And there it is — it will be that easy.", pic: "👨🎩", story: "The usual explanation: in 1887 the British prime minister Robert Cecil — Bob to the newspapers — handed his own nephew Arthur Balfour a major government post the young man had done nothing to earn. The country's verdict was that if Bob happens to be your uncle, the job is simply yours. It came to mean and there you go, done." },
      { phrase: "Grease the palm", meaning: "To bribe someone to gain favour.", pic: "🤝💰", story: "A greased hand slides — money pressed into the palm makes a decision move smoothly in your direction." },
      { phrase: "Throw one's weight around", meaning: "To use one's power and authority aggressively.", pic: "🏋️😤", story: "You have the weight; the point is that you keep making everyone feel it." },
      { phrase: "Line one's pockets", meaning: "To make money dishonestly.", pic: "👖💵", story: "Money going into a pocket that was never meant to hold it — quietly, and on the way past." },
      { phrase: "Feather one's own nest", meaning: "To enrich oneself, especially at others' expense.", pic: "🪶🪹", story: "Birds line their nests with soft feathers plucked from their own breast — but the human version uses somebody else's feathers." },
      { phrase: "Make a killing", meaning: "To earn a very large profit.", pic: "💰📈", story: "Hunting language moved into the stock market — one clean strike that feeds you for a long time." },
      { phrase: "Play to the gallery", meaning: "To seek popular approval through showy actions.", pic: "🎭👏", story: "The gallery was the cheapest, rowdiest tier of the theatre. Actors who overacted upwards for its cheers were ignoring everybody else in the room." },
      { phrase: "Blow one's own trumpet", meaning: "To boast about one's own achievements.", pic: "🎺😤", story: "Heralds once announced the arrival of important people with a trumpet. Do it for yourself and everyone can hear exactly who you think you are." },
      { phrase: "Put on airs", meaning: "To behave as though one is more important than one really is.", pic: "🎩💨", story: "The 'airs' are borrowed manners worn like a costume — grand gestures with nothing behind them." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Changing Sides",
    icon: "🔄",
    note: "Inconsistency and disloyalty — switching position for convenience.",
    items: [
      { phrase: "Turn one's coat", meaning: "To change sides or loyalty for personal advantage.", pic: "🧥🔄", story: "A soldier whose coat was one colour inside and another outside could change army by turning it inside out. 'Turncoat' is still the word for a traitor." },
      { phrase: "Jump on the bandwagon", meaning: "To join a popular trend or winning side.", pic: "🎪🚚", story: "American election parades put a band on a wagon; local politicians climbed aboard to be seen with the crowd-pleaser. Nobody ever climbs onto a losing wagon." },
      { phrase: "Change one's tune", meaning: "To suddenly change one's opinion or attitude to suit convenience.", pic: "🎵🔄", story: "The musician plays a completely different melody the moment the audience changes. Same instrument, new song." },
      { phrase: "Blow hot and cold", meaning: "To be inconsistent, changing one's attitude repeatedly.", pic: "🥵🥶", story: "In one of Aesop's fables a traveller is given shelter for the night by a satyr, who watches him blow on his hands to warm them and then, at dinner, blow on his soup to cool it. The satyr throws him out: a man whose same breath does two opposite things cannot be trusted." },
      { phrase: "Run with the hare and hunt with the hounds", meaning: "To support both opposing sides for one's own benefit.", pic: "🐇🐕", story: "The hunted and the hunters at the same time. Impossible in the field, common enough in offices and politics.", hardWords: [{ word: "hare", meaning: "a large wild animal like a rabbit" }, { word: "hound", meaning: "a hunting dog" }] },
      { phrase: "Sail with the wind", meaning: "To go along with whatever is currently favourable.", pic: "⛵🌬️", story: "Easy sailing, no principles required — the boat simply goes wherever the weather is pushing today." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Spoiling Someone's Plans",
    icon: "🔧",
    note: "Wrecking something that was running smoothly — a tight set of near-synonyms.",
    items: [
      { phrase: "Throw a spanner in the works", meaning: "To cause problems and disrupt a plan unexpectedly.", pic: "🔧⚙️", story: "Drop a steel spanner into moving factory gears and the whole machine seizes. One small object, complete stoppage.", hardWords: [{ word: "spanner", meaning: "a metal tool for turning nuts and bolts" }] },
      { phrase: "Put a spoke in someone's wheel", meaning: "To deliberately hinder someone's progress.", pic: "🎡🚫", story: "Old carts carried a wooden pin — a spoke — that was jammed into the wheel to stop it rolling downhill. Used on someone else's cart, it is sabotage." },
      { phrase: "Rain on someone's parade", meaning: "To spoil someone's plan or enjoyment.", pic: "🌧️🎊", story: "The parade was planned, rehearsed and looked forward to. Nobody can control the rain, which is why the phrase stings when a person does it deliberately." },
      { phrase: "Upset the applecart", meaning: "To ruin carefully laid plans.", pic: "🍎🛒", story: "A street seller's stacked cart takes an hour to build and one shove to destroy. The apples are not damaged — they are just everywhere." },
      { phrase: "Rock the boat", meaning: "To disturb a stable situation.", pic: "🚣😬", story: "Everyone in the boat is fine as long as nobody moves suddenly. The person rocking it is risking all the passengers, not just themselves." },
      { phrase: "Nip in the bud", meaning: "To stop something at an early stage.", pic: "✂️🌹", story: "A gardener pinching off a bud stops a flower that has not opened yet. Do it early and it costs a fingernail; do it late and it costs the whole branch." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Trouble & Difficulty",
    icon: "🌊",
    note: "Landing yourself in a mess. Most of these are informal and interchangeable.",
    items: [
      { phrase: "Get into hot water", meaning: "To get into trouble.", pic: "🛁🔥", story: "Boiling water was once thrown down on attackers at a castle wall. Being in it is not a comfortable place to be explaining yourself." },
      { phrase: "Be in a pickle", meaning: "To be in a difficult and awkward situation.", pic: "🥒😖", story: "A pickle was originally the salty vinegar a thing was preserved in. Being in it means being thoroughly, uncomfortably immersed." },
      { phrase: "Get into a scrape", meaning: "To get into an awkward or troublesome situation.", pic: "🚗😬", story: "The scrape is the damage on the paintwork — small, visible, and now requiring an explanation." },
      { phrase: "Open a can of worms", meaning: "To create or expose a complicated new problem.", pic: "🥫🪱", story: "Fishermen's bait tins — once the lid is off, the worms go everywhere and there is no getting them back in. Some questions are that lid." },
      { phrase: "Dig oneself into a hole", meaning: "To make one's situation worse through one's own actions.", pic: "🕳️⛏️", story: "The first rule of holes: when you are in one, stop digging. Most people keep going because they think they can dig their way out sideways." },
      { phrase: "A fine kettle of fish", meaning: "A complete mess or awkward situation.", pic: "🐟🫕", story: "Said entirely sarcastically — 'fine' means the opposite. Same trap as 'no love lost'; the exam likes these." },
      { phrase: "A bull in a china shop", meaning: "A clumsy person who causes damage in a delicate situation.", pic: "🐂🏺", story: "The bull is not malicious. That is precisely the problem — it simply turns around, and a shelf of porcelain is gone." },
      { phrase: "A storm in a teacup", meaning: "A great fuss made over a trivial matter.", pic: "🌪️🍵", story: "All the drama of a storm, contained in something you could drink. Enormous energy, tiny stakes." },
      { phrase: "The last straw", meaning: "The final small problem that makes you lose patience.", pic: "🐫🌾", story: "From 'the straw that broke the camel's back' — the animal carried an enormous load, and one final straw was one too many. The straw is never the real weight." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Wasted Effort",
    icon: "🌀",
    note: "Work that was never going to lead anywhere.",
    items: [
      { phrase: "A wild goose chase", meaning: "A hopeless search for something unattainable.", pic: "🪿💨", story: "Originally a horse race that followed a lead rider in the scattered formation of flying geese — impossible to follow properly, and going nowhere in particular." },
      { phrase: "A fool's errand", meaning: "A task that is pointless or impossible from the start.", pic: "🤡📜", story: "Apprentices were sent for 'a left-handed screwdriver' or 'a tin of striped paint' as a joke. The errand cannot succeed — that is the design." },
      { phrase: "Throw pearls before swine", meaning: "To offer something valuable to those who cannot appreciate it.", pic: "🫧🐖", story: "From the Sermon on the Mount — the advice not to hand what is precious to those with no way of recognising it. Offer a pig a pearl and it is neither insulted nor impressed. It simply has no idea what it has been given, and will treat it exactly like a stone." },
      { phrase: "A voice in the wilderness", meaning: "A warning or opinion that everyone ignores.", pic: "🏜️📢", story: "John the Baptist preached in the desert to almost nobody. The advice may be perfectly right — it is the audience that is missing." },
      { phrase: "Preach to the converted", meaning: "To argue for something to people who already agree.", pic: "⛪🙏", story: "The sermon is excellent and completely unnecessary — everyone in the room already believes it." },
      { phrase: "Throw good money after bad", meaning: "To waste more resources on a hopeless cause.", pic: "💸🕳️", story: "The first loss has already happened. The second is the one you choose, hoping to rescue the first." },
      { phrase: "Water off a duck's back", meaning: "Criticism or advice that has no effect at all.", pic: "🦆💧", story: "A duck's feathers are oiled, so water rolls straight off and it never gets wet. Some people are built the same way about criticism." },
      { phrase: "A blind alley", meaning: "A course of action that leads nowhere.", pic: "🚧🧱", story: "You walk it fully expecting a way through, and find a wall. The only option is to walk all the way back." },
      { phrase: "Flogging a dead horse", meaning: "Persisting with something that is already finished.", pic: "🐴😔", story: "Sits with 'flog a dead horse' in the Horses group — same futility, and a favourite exam pairing." },
      { phrase: "Tilt at windmills", meaning: "To fight imaginary enemies and pursue unrealistic causes.", pic: "🌬️🗡️", story: "In Cervantes' novel Don Quixote (1605), an ageing Spanish gentleman reads so many romances about knights that he decides he is one and rides out to find enemies. He sees a line of windmills, mistakes their turning sails for the swinging arms of giants, lowers his lance and charges. To tilt is to charge with a lance — and the giants were entirely in his reading.", hardWords: [{ word: "tilt", meaning: "to charge at an opponent with a lance" }] },
      { phrase: "Penelope's web", meaning: "A task deliberately never finished, causing endless delay.", pic: "🧵♾️", story: "While Odysseus was away at war for twenty years, suitors filled his house pressing his wife Penelope to declare him dead and marry one of them. She agreed — but only once she had finished weaving a burial cloth for his father. She wove all day in front of them, and every night she quietly unpicked the day's work. The cloth was never finished, and neither was the wait." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Body Parts",
    icon: "🦶",
    note: "Grouped by the body part they use — heels, feet, hands, teeth, neck. The exam builds whole questions out of confusing one for another.",
    items: [
      { phrase: "Achilles' heel", meaning: "A single fatal weakness in someone otherwise strong.", pic: "🦶🏹", story: "Achilles' mother wanted a son who could not be killed, so she dipped him as a baby into the Styx, the river of the underworld whose water made flesh invulnerable. She held him by one heel — the single patch of him the water never touched. He grew into the greatest warrior of the Trojan war and died from one arrow, to that heel.", hardWords: [{ word: "invulnerable", meaning: "impossible to harm" }] },
      { phrase: "Feet of clay", meaning: "A hidden weakness in someone who is greatly admired.", pic: "🗿🦶", story: "In the Book of Daniel, a king dreams of a huge statue with a head of gold and a chest of silver, standing on feet made of ordinary baked clay. A stone strikes the feet, and the entire magnificent thing comes down. The grander the figure, the more the feet matter." },
      { phrase: "Cool one's heels", meaning: "To be kept waiting a long time.", pic: "🦶🧊", story: "A ridden horse's hooves heat up, and it was made to stand until they cooled. Being made to wait outside an office is the human version." },
      { phrase: "Take to one's heels", meaning: "To run away quickly, especially to escape danger.", pic: "🦶💨", story: "All anyone chasing you sees is your heels going. Fast, undignified, effective." },
      { phrase: "Kick one's heels", meaning: "To wait around idly and impatiently.", pic: "🦶⏳", story: "Nothing to do but knock your heels together. Cousin of 'cool one's heels' — the difference is boredom rather than being kept waiting." },
      { phrase: "Find one's feet", meaning: "To become confident and comfortable in a new situation.", pic: "👶🦶", story: "A toddler wobbles, falls, and then one day simply walks. Every new job has the same three stages." },
      { phrase: "Get cold feet", meaning: "To lose one's nerve at the last moment.", pic: "🦶🧊", story: "Said of soldiers whose feet were too cold to advance — a reason not to move that sounds better than fear. Now it belongs mostly to weddings and interviews." },
      { phrase: "Hand in glove", meaning: "Working in extremely close, often secret, partnership.", pic: "🤝🧤", story: "Nothing fits a hand as exactly as its own glove. Used when two people are so closely joined that you cannot separate their motives." },
      { phrase: "Wash one's hands of", meaning: "To refuse any further responsibility for someone or something.", pic: "🚰🙌", story: "Pontius Pilate was the Roman governor who tried Jesus. Unable to find him guilty but unwilling to face the crowd demanding his death, he called for a bowl of water and washed his hands in front of them all, announcing that the decision was theirs and the blame was not his." },
      { phrase: "By the skin of one's teeth", meaning: "By the narrowest possible margin.", pic: "😬📏", story: "From the Book of Job, whose main character loses his family, his health and his fortune in a run of disasters and says he has escaped with the skin of his teeth. Teeth have no skin on them at all — which is exactly the size of the margin he means.", hardWords: [{ word: "margin", meaning: "the amount by which something is won or missed" }] },
      { phrase: "Pull someone's leg", meaning: "To tease someone playfully.", pic: "🦵😄", story: "Street thieves once tripped victims by the leg while an accomplice robbed them. The modern version only takes your dignity, briefly." },
      { phrase: "See eye to eye with someone", meaning: "To be in complete agreement.", pic: "👁️🤝", story: "Sits with the peace-making family — level eyes, level view." },
      { phrase: "The apple of one's eye", meaning: "A person cherished above all others.", pic: "🍎👁️", story: "The pupil was once called the 'apple' because people thought it was a solid round object — and it is the part of the body we protect most instinctively." },
      { phrase: "A green thumb", meaning: "An unusual talent for making plants grow.", pic: "🌱👍", story: "Gardeners who handle plants and pots all day end up with green-stained thumbs. The stain became the compliment." },
      { phrase: "Elbow room", meaning: "Enough space and freedom to move and act comfortably.", pic: "💪↔️", story: "The width of your elbows is the minimum space a person needs to work in. Ask for elbow room and you are asking not to be crowded." },
      { phrase: "Elbow grease", meaning: "Hard physical effort.", pic: "💪🧽", story: "A joke on apprentices sent to buy a tin of 'elbow grease'. There is no such product — the only thing that shines the surface is scrubbing." },
      { phrase: "Pay through the nose", meaning: "To pay an unreasonably high price.", pic: "👃💸", story: "The gruesome Danish nose-slitting tale you may have heard is false — the phrase only appears in the 1670s. Its real source is unknown; one good guess is 'rhino', 17th-century slang for money, from the Greek for nose." },
      { phrase: "Up in arms", meaning: "Angrily protesting about something.", pic: "🙋😡", story: "'Arms' here are weapons, not limbs — a population up in arms had literally taken them up. Now the protest is usually verbal." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Anger",
    icon: "💢",
    note: "Losing your temper, in ascending order of noise.",
    items: [
      { phrase: "Fly off the handle", meaning: "To suddenly lose one's temper.", pic: "🪓😡", story: "A loose axe head flies off its handle mid-swing — sudden, dangerous and completely out of the user's control. Exactly like the temper." },
      { phrase: "Hit the ceiling", meaning: "To become extremely angry.", pic: "🏠😤", story: "The anger has nowhere to go but up, and it goes all the way to the roof. Also 'hit the roof'." },
      { phrase: "Blow a fuse", meaning: "To lose one's temper suddenly.", pic: "⚡😠", story: "Too much current and the fuse melts to protect the circuit. Too much provocation and the person does the same thing, minus the protection." },
      { phrase: "Make one's blood boil", meaning: "To make someone extremely angry.", pic: "🌡️🩸", story: "Sits with the conflict family — the old idea that rage physically heats the blood." },
      { phrase: "Have a fit", meaning: "To react with extreme anger or shock.", pic: "😤💥", story: "Borrowed from the medical sense of a seizure and used, always exaggerating, for a spectacular loss of composure." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Beginnings & Getting Started",
    icon: "🚀",
    note: "Breaking the initial awkwardness or setting something in motion.",
    items: [
      { phrase: "Break the ice", meaning: "To start a conversation and reduce initial awkwardness.", pic: "🔨🧊", story: "Ships once carried ice-breakers to open a frozen trade route so the vessels behind could pass. The first joke in an awkward room does the same job." },
      { phrase: "Get the ball rolling", meaning: "To start an activity, discussion or process.", pic: "⚽▶️", story: "Nothing happens while the ball is sitting still. The first push is the hardest part, and after that momentum does its own work." },
      { phrase: "Hit it off", meaning: "To become friendly with someone immediately after meeting.", pic: "🤝⚡", story: "Some introductions take months to warm up and some take four minutes. No explanation available — it either happens or it does not." },
      { phrase: "Make small talk", meaning: "To engage in light, informal conversation, especially with strangers.", pic: "💬🫱", story: "Weather, travel, tea. The content is deliberately weightless — its only job is to make two strangers comfortable enough to say something real." },
      { phrase: "Turn over a new leaf", meaning: "To start behaving in a better way.", pic: "🍃📖", story: "The 'leaf' is a page of a book, not a tree. You turn to a fresh page and start writing a better chapter — the old one still exists, but you are done with it." },
      { phrase: "Call it a day", meaning: "To stop work and finish for now.", pic: "🌇🛑", story: "Labourers agreed the day's work was complete and stopped, whatever the clock said. Saying it is a decision, not an observation." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Family Resemblance",
    icon: "👨‍👦",
    note: "'He's just like his father' in eight different phrasings. Almost every AFCAT paper has one of these.",
    items: [
      { phrase: "A chip off the old block", meaning: "A person very similar to their parent in character and habits.", pic: "🪵👦", story: "A chip cut from a block of wood has exactly the same grain and colour as the block it came from. Small piece, same material." },
      { phrase: "Like father, like son", meaning: "Sons often resemble their fathers in character and behaviour.", pic: "👨👦", story: "A proverb old enough to appear in Latin. Simple, direct, and usually said with a smile or a sigh." },
      { phrase: "The apple doesn't fall far from the tree", meaning: "Children usually resemble their parents.", pic: "🍎🌳", story: "The apple can only land within the shade of the branches it grew on. Wherever it rolls, that is where it started." },
      { phrase: "Take after", meaning: "To resemble a parent in looks or qualities.", pic: "👧🪞", story: "The everyday phrasal verb of this family — 'she takes after her mother'. Note it means to RESEMBLE, not to chase." },
      { phrase: "Cut from the same cloth", meaning: "Having very similar qualities, attitudes and character.", pic: "🧵✂️", story: "A tailor cuts a coat and its matching waistcoat from a single bolt so the colour and weave match exactly. Two things, one origin." },
      { phrase: "Birds of a feather flock together", meaning: "People with similar interests and character stay together.", pic: "🐦🐦", story: "Birds of one species — one kind of feather — form the flock. Said approvingly of friends and disapprovingly of troublemakers." },
      { phrase: "Cast in the same mould", meaning: "Having the same nature or personality as another person.", pic: "🗿🗿", story: "Two castings from a single mould come out identical down to the flaws. Stronger than 'similar' — it says they were formed the same way.", hardWords: [{ word: "mould", meaning: "a hollow shape that liquid metal is poured into" }] },
      { phrase: "Kith and kin", meaning: "One's friends and relatives.", pic: "👨‍👩‍👧‍👦🏡", story: "'Kith' meant acquaintances and countrymen, 'kin' meant blood relatives. Only 'kin' survives on its own — 'kith' now lives entirely inside this phrase.", hardWords: [{ word: "kith", meaning: "friends and acquaintances" }, { word: "kin", meaning: "family; blood relatives" }] },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Following & Imitating",
    icon: "👣",
    note: "Taking someone else as your model — the positive counterpart of the family group.",
    items: [
      { phrase: "Take a leaf out of someone's book", meaning: "To follow someone's good example.", pic: "📖🍃", story: "Books were once copied by hand, page by page. Taking a leaf from someone's book meant copying their page word for word — their method becoming yours." },
      { phrase: "Follow in someone's footsteps", meaning: "To imitate someone's career or way of life.", pic: "👣👣", story: "Walking a path by putting your feet exactly where theirs went. Said most often of children entering a parent's profession." },
      { phrase: "Look up to someone", meaning: "To admire and respect someone as a role model.", pic: "👀⬆️", story: "The child physically looks up at the adult they admire. The posture became the feeling." },
      { phrase: "Lead by example", meaning: "To influence others through one's own actions rather than words.", pic: "🚶✨", story: "Telling a child to study for four hours does very little. Being visibly at work for four hours does the whole job silently." },
      { phrase: "Emulate someone", meaning: "To try to equal or surpass someone by imitation.", pic: "🪞🏆", story: "Stronger than copying — you imitate in order to eventually beat. The apprentice who wants the master's job.", hardWords: [{ word: "emulate", meaning: "to copy someone in order to match or beat them" }] },
      { phrase: "Follow suit", meaning: "To do the same thing as someone else has just done.", pic: "🃏➡️", story: "From card games — you must play a card of the same suit that was led. Everyone at the table follows the first card played." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Narrow Escapes",
    icon: "😅",
    note: "Getting away by the smallest possible margin — a very tight synonym set.",
    items: [
      { phrase: "A close shave", meaning: "A narrow escape from danger or failure.", pic: "🪒😰", story: "A barber's razor working a millimetre from your throat. Get it right and it is a shave; get it wrong and it is a wound." },
      { phrase: "By a hair's breadth", meaning: "By an extremely narrow margin.", pic: "🧵📏", story: "A single hair is about the thinnest thing anyone can measure by eye. That is how much room you had." },
      { phrase: "At the eleventh hour", meaning: "At the last possible moment.", pic: "🕚⏳", story: "From the parable of workers hired at the eleventh hour of a twelve-hour day, who still received full pay. Late — but not too late." },
      { phrase: "A bolt from the blue", meaning: "A complete and sudden surprise.", pic: "⚡🔵", story: "Lightning out of a clear sky, with no cloud to warn you. Used for news nobody could have seen coming." },
      { phrase: "Out of the blue", meaning: "Suddenly and unexpectedly.", pic: "🌀", story: "Same clear sky as the bolt — but this version can be good news as easily as bad. A call from someone after ten years." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Good Times & Health",
    icon: "🌈",
    note: "Happiness, prosperity and being in excellent condition.",
    items: [
      { phrase: "Halcyon days", meaning: "A peaceful, happy period in the past.", pic: "🐦🌊", story: "The Greeks believed the halcyon bird nested on the sea in midwinter, and that the gods calmed the waves for fourteen days so it could hatch its eggs. Those calm days were the halcyon days." },
      { phrase: "Palmy days", meaning: "A period of great prosperity and success.", pic: "🌴💰", story: "Palm branches were carried in triumph and victory processions. Your palmy days are the years when things flourished — the P links to prosperity." },
      { phrase: "In one's heyday", meaning: "At the time of one's greatest success, power and popularity.", pic: "🎉👑", story: "'Heyday' comes from an old cry of delight — heyda! It names the stretch of life you were at your loudest and best." },
      { phrase: "In the pink", meaning: "In excellent health and condition.", pic: "🌸😊", story: "Healthy cheeks flush pink; ill ones go grey. Doctors and gardeners have both used 'the pink' to mean the finest example of a thing." },
      { phrase: "On cloud nine", meaning: "Extremely happy.", pic: "☁️9️⃣", story: "The popular weather-bureau explanation does not stand up — the phrase is simply American, from the 1950s. Take the number as the memory hook: nine is the top of the scale, and so are you." },
      { phrase: "On top of the world", meaning: "Extremely happy, successful and confident.", pic: "🌍🙌", story: "Nothing above you and everything visible below. The view from a summit, applied to a mood." },
      { phrase: "A red-letter day", meaning: "A very special or memorable day.", pic: "📅🔴", story: "Church calendars printed feast days and saints' days in red ink and ordinary days in black. Your red-letter days are the ones written in a different colour." },
      { phrase: "A life of Riley", meaning: "An easy, comfortable and carefree life.", pic: "🛋️🍹", story: "From a comic music-hall song of the early 1900s about an Irishman named Riley who does no work whatsoever and enjoys everything. Nobody has ever identified a real Riley — but everyone who hears the song wants his schedule." },
      { phrase: "Every cloud has a silver lining", meaning: "Every difficult situation has a hopeful side.", pic: "🌈", story: "Sunlight behind a dark cloud edges it in silver. The cloud is still a cloud — but there is light on the other side of it." },
      { phrase: "A blessing in disguise", meaning: "Something that seemed bad at first but turned out good.", pic: "🎭", story: "The bus you missed, the job you did not get. The disguise is only that you could not tell at the time." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Simple vs Luxurious Living",
    icon: "🍞",
    note: "Two opposite lifestyles — austerity and indulgence. The exam pairs them as antonyms.",
    items: [
      { phrase: "A Spartan life", meaning: "A life of simplicity, discipline and self-denial.", pic: "🛡️🥣", story: "Sparta was a Greek city-state organised entirely around war. Boys were taken from their families at seven, fed deliberately too little so they would learn to steal food, and made to sleep on beds of cut reeds. The city's name became the English word for going without on purpose." },
      { phrase: "Hair shirt existence", meaning: "A life of hardship and self-imposed suffering.", pic: "🥼😖", story: "A shirt of coarse goat hair was worn next to the skin by penitents as a constant discomfort. Chosen suffering, not bad luck.", hardWords: [{ word: "penitent", meaning: "someone doing something to show they are sorry" }] },
      { phrase: "Live on bread and water", meaning: "To survive on the bare minimum.", pic: "🍞💧", story: "The prison ration — enough to keep a person alive and nothing whatsoever beyond it." },
      { phrase: "Simple living, high thinking", meaning: "A modest way of life combined with lofty ideals.", pic: "🪷📚", story: "The poet William Wordsworth wrote the line in 1802, complaining that England had lost it. Gandhi made it something closer to a rule for living. The two halves are meant to be connected — the less that goes on the outside, the more is available for the inside." },
      { phrase: "Born with a silver spoon", meaning: "Born into a wealthy family.", pic: "🥄👶", story: "Godparents once gave a silver christening spoon — only rich families could. The child who is fed from silver from day one never had to earn it." },
      { phrase: "Cost an arm and a leg", meaning: "To be extremely expensive.", pic: "💸", story: "The price is quoted in body parts because money did not sound painful enough." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Knowledge & Learning",
    icon: "📚",
    note: "Describing learned people — and the ones who only look learned.",
    items: [
      { phrase: "Know the ropes", meaning: "To have knowledge and experience of how something is done.", pic: "🪢🧭", story: "A sailing ship had dozens of ropes, each controlling a different sail. A sailor who knew the ropes could be trusted in the dark, in a storm, without being told." },
      { phrase: "A man of letters", meaning: "A learned, scholarly and literary man.", pic: "✍️📜", story: "In 17th-century Europe only the educated could write at all, so a man 'of letters' meant literally a man of the written word — a scholar." },
      { phrase: "A blue stocking", meaning: "An intellectual and literary woman.", pic: "🧦📘", story: "Elizabeth Montagu's London salon of the 1750s met for book talk instead of card games, and dressed plainly. One regular, Benjamin Stillingfleet, could not afford formal black silk and came in everyday blue worsted stockings — so the gatherings became the Blue Stocking Club." },
      { phrase: "A walking encyclopedia", meaning: "A person with an enormous store of knowledge.", pic: "🚶📚", story: "The reference book that follows you around and answers everything. Today's version is 'a walking Google'." },
      { phrase: "An ivory tower", meaning: "A place of study isolated from practical everyday realities.", pic: "🏰📖", story: "Once a Biblical image of purity, it became the label for scholars who lived among books and theories and never had to test either against the street." },
      { phrase: "A greenhorn", meaning: "An inexperienced beginner.", pic: "🌱🐂", story: "A young ox whose horns are still growing and soft. Untested, and it shows.", hardWords: [{ word: "greenhorn", meaning: "a complete beginner" }] },
      { phrase: "Wet behind the ears", meaning: "Inexperienced and immature.", pic: "💧👂", story: "A newborn calf takes a while to dry, and the hollow behind the ears is the last part to lose its wetness. Fresh out of the shed." },
      { phrase: "A raw recruit", meaning: "A new and untrained member of a force.", pic: "🪖🆕", story: "'Raw' as in uncooked — not yet processed by training. Every officer was one once." },
      { phrase: "The man in the street", meaning: "The ordinary, average person.", pic: "🚶👔", story: "Not the expert, not the minister — the person you would actually meet outside. Used when asking what normal people think." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Character Types",
    icon: "🎭",
    note: "One-phrase descriptions of a person. Several are Biblical and appear regularly in the exam.",
    items: [
      { phrase: "A man of straw", meaning: "A person of no substance and weak character.", pic: "🌾🧍", story: "A scarecrow looks like a man from a distance and holds nothing at all. A straw costs nothing and is thrown away — that is the judgement in the phrase." },
      { phrase: "A man of means", meaning: "A wealthy and financially secure person.", pic: "💼💰", story: "'Means' is simply money — the means to do what you like. Polite, slightly old-fashioned, and always complimentary." },
      { phrase: "The black sheep", meaning: "A person who is a disgrace to their family or group.", pic: "🐑🖤", story: "A black lamb in a white flock could not have its wool dyed, so it was worth less to the farmer and stood out from a distance. Both facts went into the phrase.", hardWords: [{ word: "disgrace", meaning: "shame brought on someone" }] },
      { phrase: "The blue-eyed boy", meaning: "Someone's favourite, given special treatment.", pic: "👦💙", story: "The pretty, favoured child everyone forgives. Usually said with a note of resentment by whoever is not the blue-eyed boy." },
      { phrase: "The prodigal son", meaning: "A person who returns home after wasting money and opportunities.", pic: "🏠🙇", story: "In the parable, the younger son spends his whole inheritance and comes home expecting nothing — and his father runs to meet him. The phrase carries the welcome, not only the waste.", hardWords: [{ word: "prodigal", meaning: "wastefully extravagant with money" }] },
      { phrase: "A globetrotter", meaning: "A person who travels widely all over the world.", pic: "🌍🧳", story: "'Trotting' the globe — moving over it at a steady pace, never staying long. Coined when circling the world first became possible for pleasure." },
      { phrase: "A rolling stone", meaning: "A person who never settles in one place or job.", pic: "🪨🌀", story: "From the proverb 'a rolling stone gathers no moss'. Keep moving and nothing sticks to you — including, the proverb warns, anything worth having." },
      { phrase: "A dog in the manger", meaning: "Someone who stops others using what they cannot use themselves.", pic: "🐕🌾", story: "In Aesop's fable a dog settles down to sleep in a manger, the wooden box that cattle feed from. A dog cannot eat hay and has no use for it. But when the oxen come in from the fields to feed, it snarls and snaps and drives them off — spite that costs it nothing and gains it nothing.", hardWords: [{ word: "manger", meaning: "the box that animal feed is put in" }] },
      { phrase: "A bag of bones", meaning: "An extremely thin person.", pic: "🦴👤", story: "Nothing between the skin and the skeleton. Blunt, and usually said with concern rather than cruelty.", hardWords: [{ word: "emaciated", meaning: "very thin from illness or hunger — the formal word" }] },
      { phrase: "Like a shag on a rock", meaning: "Looking lonely, isolated and out of place.", pic: "🐦🪨", story: "The shag is an Australian and New Zealand seabird often seen alone on a bare rock far out at sea. One bird, one stone, nothing else in the frame.", hardWords: [{ word: "shag", meaning: "a dark seabird similar to a cormorant" }] },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Living in a Dream",
    icon: "☁️",
    note: "Refusing to see reality, or inventing a nicer one.",
    items: [
      { phrase: "Have one's head in the clouds", meaning: "To be impractical and out of touch with reality.", pic: "🌥️🧠", story: "The body is in the meeting; the mind is somewhere above the weather. Affectionate rather than cruel — but still a criticism." },
      { phrase: "Build castles in the air", meaning: "To daydream about impossible plans.", pic: "🏰☁️", story: "A magnificent design with nothing underneath it. The building is not the problem — the missing foundation is." },
      { phrase: "Live in a fool's paradise", meaning: "To be happily unaware of unpleasant realities.", pic: "🤡🏝️", story: "The paradise is genuine while it lasts, which is exactly what makes it a fool's. The bill arrives later." },
      { phrase: "Bury one's head in the sand", meaning: "To refuse to face reality and unpleasant facts.", pic: "🦤🏖️", story: "Ostriches were wrongly believed to hide their heads when frightened. The bird was slandered — but the picture of a problem you have simply stopped looking at is perfect." },
      { phrase: "The elephant in the room", meaning: "An obvious problem that everyone is ignoring.", pic: "🐘🚪", story: "Something enormous is standing in the middle of the conversation. Everyone can see it; nobody will be the one to name it." },
      { phrase: "See through rose-coloured glasses", meaning: "To view everything with unrealistic optimism.", pic: "🌹👓", story: "Put a pink tint over the lens and the whole world looks warm and pleasant. Nothing outside changed at all." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Money Troubles",
    icon: "💸",
    note: "Financial hardship — a small, high-frequency exam group.",
    items: [
      { phrase: "In the red", meaning: "In debt; suffering a financial loss.", pic: "🔴📉", story: "Accountants wrote losses in red ink and profits in black. Being in the red says which column your name is in — which is also why a good day is 'in the black'." },
      { phrase: "Rob Peter to pay Paul", meaning: "To use one debt to settle another, solving nothing.", pic: "👤💰👤", story: "Said to date from when funds were taken from St Peter's church to repair St Paul's. The money moved; the shortage did not go away." },
      { phrase: "Keep the wolf from the door", meaning: "To earn just enough to avoid poverty and hunger.", pic: "🐺🚪", story: "A trap for exam candidates: this is about HUNGER, not danger. The wolf at the door is starvation, and you are earning just enough to keep it outside." },
      { phrase: "Feel the pinch", meaning: "To experience financial hardship.", pic: "🤏💵", story: "The first stage of trouble — not ruin, just a tight shoe. You can still walk, but you notice every step." },
      { phrase: "Be in dire straits", meaning: "To be in an extremely difficult situation.", pic: "🌊⚠️", story: "A 'strait' is a dangerous narrow sea passage. Dire straits are the ones with rocks on both sides and no room to turn.", hardWords: [{ word: "dire", meaning: "extremely serious or urgent" }, { word: "strait", meaning: "a narrow channel of sea between two land masses" }] },
      { phrase: "Go for a song", meaning: "To be sold at a very low price.", pic: "🎵🏷️", story: "Sold for the price of a street ballad — the cheapest thing anyone could buy. Said of a bargain and of a waste alike." },
      { phrase: "A dime a dozen", meaning: "Very common and of little value.", pic: "🪙🔟", story: "Twelve of them for ten cents. So plentiful that the price barely covers the counting." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Ordinary & Predictable",
    icon: "📦",
    note: "Nothing special about it. Near-synonyms — sort by the metaphor rather than the meaning.",
    items: [
      { phrase: "Run of the mill", meaning: "Ordinary, average and lacking anything special.", pic: "⚙️📦", story: "Cloth or grain straight off the mill run, before anyone sorts it for quality. Not bad — just whatever came out." },
      { phrase: "Par for the course", meaning: "What is normal and expected in the situation.", pic: "⛳📋", story: "Par is the score a golf course expects a good player to shoot. Hitting par is neither an achievement nor a failure — it is simply the day going as predicted." },
      { phrase: "Cut and dried", meaning: "Routine, predictable and lacking originality.", pic: "🌿📏", story: "Herbs cut and dried in advance, ready packaged, no freshness left. The decision was prepared before the discussion started." },
      { phrase: "Business as usual", meaning: "Normal routine conditions and activity.", pic: "🏪🔄", story: "A sign shopkeepers hung during building works or after a disaster. It is a reassurance — and sometimes an accusation that nothing changed when it should have." },
      { phrase: "Neither fish nor fowl", meaning: "Something that does not clearly belong to any category.", pic: "🐟🐔", story: "From an older list — 'neither fish, nor flesh, nor good red herring' — meaning it fitted none of the recognised kinds of food. Impossible to classify." },
      { phrase: "A baker's dozen", meaning: "Thirteen.", pic: "🥖1️⃣3️⃣", story: "Medieval bakers faced heavy fines for selling short weight, so they threw in a thirteenth loaf to be certain the dozen was never light." },
      { phrase: "All and sundry", meaning: "Everyone, without exception.", pic: "👥🌐", story: "'Sundry' means various separate people. The phrase deliberately covers both the group and every individual in it, leaving nobody out.", hardWords: [{ word: "sundry", meaning: "various; of several kinds" }] },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Early Rising",
    icon: "🌄",
    note: "The dawn family — four ways to say 'very early in the morning'.",
    items: [
      { phrase: "The wee hours", meaning: "The very early hours after midnight.", pic: "🕐🌙", story: "'Wee' is Scottish for small — the hours with the small numbers: one, two, three. The quietest part of the day." },
      { phrase: "At the crack of dawn", meaning: "Very early in the morning, as daylight begins.", pic: "🌅⏰", story: "The 'crack' is the first split of light along the horizon, the moment the dark breaks open." },
      { phrase: "Up with the lark", meaning: "To wake up very early in the morning.", pic: "🐦🌄", story: "The skylark is one of the first birds to sing, rising in the half-light before sunrise. If you are up with it, you are up very early indeed." },
      { phrase: "The early bird catches the worm", meaning: "Those who act early are more likely to succeed.", pic: "🐦🪱", story: "Worms surface at dawn and are gone by mid-morning. Whoever gets there first eats; everyone else finds the ground empty." },
      { phrase: "Burn the midnight oil", meaning: "To work or study late into the night.", pic: "🌙🕯️", story: "Before electricity, working after dark meant burning expensive lamp oil. The cost of the oil is what made the phrase mean serious dedication." },
      { phrase: "Burn the candle at both ends", meaning: "To overwork by staying busy day and night.", pic: "🕯️🔥", story: "A candle lit at both ends gives twice the light and lasts half as long. The arithmetic is the warning." },
      { phrase: "Hit the sack", meaning: "To go to bed.", pic: "🛏️😴", story: "Beds were once sacks stuffed with straw. Careful in the exam: 'hit the sack' is to sleep, but 'get the sack' is to be dismissed from a job." },
      { phrase: "Hit the books", meaning: "To study hard.", pic: "👊📚", story: "You are not opening them gently. Reserved for the kind of study that happens with a deadline approaching." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Restlessness & Wandering",
    icon: "🧭",
    note: "Never settling anywhere — physically or in purpose.",
    items: [
      { phrase: "From pillar to post", meaning: "To be sent from one place to another without achieving anything.", pic: "🏛️📍", story: "From real tennis, where the ball was driven between the posts and pillars of the court — knocked back and forth, never at rest." },
      { phrase: "Footloose and fancy free", meaning: "Free from responsibilities and able to go anywhere.", pic: "🦶🎈", story: "'Footloose' was a sailor's term for a sail flapping free at the bottom; 'fancy' meant romantic attachment. No rope and no sweetheart — nothing holding you." },
      { phrase: "On the move", meaning: "Constantly travelling and changing places.", pic: "🚶💨", story: "The neutral member of this family — no judgement, just motion." },
      { phrase: "Drift along", meaning: "To move through life without direction or purpose.", pic: "🍃🌊", story: "No oars, no destination, just the current. The danger is that drifting feels exactly like resting." },
      { phrase: "At a loose end", meaning: "With no clear purpose or occupation.", pic: "🧵❓", story: "Rope ends were 'made fast' on ship; anything left loose was flapping and useless. A person at a loose end has nothing tied down to do." },
      { phrase: "At the crossroads", meaning: "Facing an important decision between different courses of action.", pic: "🛣️🤔", story: "Standing where the paths divide, unable to take both. Every road looks equally reasonable from the junction." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Confusion & Disorder",
    icon: "🌀",
    note: "Things in a mess, or people talking past each other.",
    items: [
      { phrase: "At sixes and sevens", meaning: "In a state of confusion and disorder.", pic: "6️⃣7️⃣", story: "From the dice game hazard — Chaucer used it in 1374, and it is thought to be a mangling of the French 'cinque and six', the recklessly high numbers to stake on. Two London guilds also spent centuries arguing over which ranked sixth and which seventh." },
      { phrase: "At cross purposes", meaning: "Misunderstanding each other while trying to achieve different things.", pic: "❌🎯", story: "Two people having a perfectly reasonable conversation about two different subjects, neither realising it." },
      { phrase: "In a muddle", meaning: "Confused and disorganised.", pic: "🌫️📚", story: "'Muddle' comes from wading through mud — everything is still there, nothing is where it should be, and progress is slow." },
      { phrase: "Square pegs in round holes", meaning: "People placed in roles that do not suit them at all.", pic: "🔲⭕", story: "The peg is not faulty and the hole is not faulty. Force them together and you damage both." },
      { phrase: "It's all Greek to me", meaning: "Completely impossible to understand.", pic: "🇬🇷❓", story: "Medieval monks copying manuscripts by hand would hit a passage in Greek, which most of them could not read, and write in the margin: it is Greek, it cannot be read. Shakespeare put the line into Julius Caesar around 1599 and it became English." },
      { phrase: "Double Dutch", meaning: "Language that is completely impossible to understand.", pic: "🗣️❓", story: "English sailors and soldiers used 'Dutch' in a long list of insults; anything doubly incomprehensible was double Dutch." },
      { phrase: "Talk through one's hat", meaning: "To talk nonsense about something one knows nothing about.", pic: "🎩💬", story: "Nothing comes out of a hat unless a conjuror put it there. Whatever this person is saying, there is nothing behind it." },
      { phrase: "Mealy-mouthed", meaning: "Unwilling to speak clearly and directly.", pic: "😶🌾", story: "A mouth full of soft flour cannot produce a sharp word. Used for people who soften everything until nothing is actually said." },
      { phrase: "Beat about the bush", meaning: "To avoid getting to the main point.", pic: "🌳🥊", story: "Hunters hired beaters to thrash the bushes and drive birds out — but a nervous beater tapping around the edges never actually flushed anything." },
      { phrase: "Read between the lines", meaning: "To understand the hidden meaning behind what is said.", pic: "📄🔍", story: "From a real cipher: the secret message was written in invisible ink in the gaps of an innocent letter. What matters is not on the lines." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Secondary Roles",
    icon: "🎻",
    note: "Always the supporting act, never the lead.",
    items: [
      { phrase: "Play second fiddle", meaning: "To accept a less important, subordinate role.", pic: "🎻2️⃣", story: "In an orchestra the first violin leads and the second violin supports — an essential part, but never the one the audience watches.", hardWords: [{ word: "subordinate", meaning: "lower in rank or importance" }] },
      { phrase: "Take a back seat", meaning: "To accept a less active role.", pic: "🚗💺", story: "Somebody else is driving and choosing the route. You are still in the car, but not deciding where it goes." },
      { phrase: "Be in someone's shadow", meaning: "To receive less attention because of someone else's prominence.", pic: "🧍🌑", story: "Standing beside something taller means the light never reaches you. Common for the second sibling and the deputy.", hardWords: [{ word: "prominence", meaning: "the state of being famous or important" }] },
      { phrase: "Always a bridesmaid, never a bride", meaning: "Always in the supporting role, never the main one.", pic: "💐👰", story: "From a 1920s mouthwash advertisement about a woman forever attending other people's weddings. The runner-up who is always in the photograph and never at the centre of it." },
      { phrase: "The lion's share", meaning: "The largest part of something.", pic: "🦁🍰", story: "In Aesop's fable the lion goes hunting with other animals and helps bring down the prey. When it is time to divide it he takes the first portion for being king, the second for being strongest, the third for his family — and dares anyone to touch the fourth. Not a fair share: the whole thing." },
      { phrase: "Do one's bit", meaning: "To contribute one's own share to a common effort.", pic: "🧩🤝", story: "A wartime phrase — nobody could win it alone, so everyone was asked for their piece." },
      { phrase: "Pull one's weight", meaning: "To do one's fair share of the work.", pic: "🚣💪", story: "In a rowing eight, one person coasting is felt by the other seven immediately. The boat is an honest accountant." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Taking Risks",
    icon: "🎲",
    note: "Acting when the outcome is genuinely unknown.",
    items: [
      { phrase: "A leap in the dark", meaning: "A risky action with an uncertain outcome.", pic: "🌑🦘", story: "The philosopher Thomas Hobbes is said to have called dying 'a leap in the dark'. You cannot see the landing from where you are standing." },
      { phrase: "Roll the dice", meaning: "To take a chance on an uncertain outcome.", pic: "🎲🍀", story: "You control the throw and nothing after it. Deliberately handing the result to chance." },
      { phrase: "Throw caution to the wind", meaning: "To act boldly without worrying about the risk.", pic: "🍃😤", story: "Caution is not lost — it is deliberately released and allowed to blow away. The decision comes first, the recklessness second." },
      { phrase: "Walk a tightrope", meaning: "To be in a risky and delicate situation.", pic: "🎪🤸", story: "Every step is fine and every step could be the last one. The skill is real, and so is the drop." },
      { phrase: "Keep one's fingers crossed", meaning: "To hope for a good outcome.", pic: "🤞", story: "An old Christian gesture of protection — the crossed fingers made a small cross to ward off bad luck while you waited." },
      { phrase: "Bite the bullet", meaning: "To face something painful or unpleasant bravely.", pic: "😬🦷", story: "The famous story — surgeons giving wounded soldiers a lead bullet to clamp between their teeth — is doubtful, since anaesthetic was already in army use by 1849. The phrase is first found in Kipling's novel of 1891, where a character bites one during surgery.", hardWords: [{ word: "anaesthetic", meaning: "medicine that stops you feeling pain" }] },
      { phrase: "Bite off more than you can chew", meaning: "To take on more than you can manage.", pic: "🍔😰", story: "The mouth said yes before the jaw did the arithmetic. Ambition is not the problem; capacity is." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Being Ready & Holding Back",
    icon: "🏹",
    note: "Having resources in reserve — and the patience to wait for the right moment.",
    items: [
      { phrase: "A quiver full of arrows", meaning: "Having many skills, resources and options available.", pic: "🏹🎯", story: "An archer with a full quiver can miss and try again. Options are what let you survive a bad first shot.", hardWords: [{ word: "quiver", meaning: "the case that holds an archer's arrows" }] },
      { phrase: "Have many strings to one's bow", meaning: "To possess several skills or alternatives.", pic: "🏹🎻", story: "Archers carried spare bowstrings because a snapped string in battle meant a useless weapon. One skill is one string." },
      { phrase: "Keep something up one's sleeve", meaning: "To keep a hidden advantage in reserve.", pic: "🃏👔", story: "The card sharp's extra card. Perfectly useless unless nobody knows it is there — which is the whole idea." },
      { phrase: "Keep one's powder dry", meaning: "To stay prepared for future action while conserving resources.", pic: "🧨☂️", story: "Attributed to Oliver Cromwell, the general who led Parliament's armies in the English Civil War of the 1640s. Crossing a river before battle, he is said to have told his men to trust in God and keep their powder dry. Faith is all very well, but wet gunpowder does not fire." },
      { phrase: "Pull something out of the hat", meaning: "To produce an unexpected solution when it is needed.", pic: "🎩🐇", story: "The conjuror's rabbit — everyone watched the hat the whole time and still cannot explain it." },
      { phrase: "Bide one's time", meaning: "To wait patiently for the right opportunity.", pic: "⏳🧘", story: "'Bide' is an old word for wait or remain. Not inaction — waiting on purpose, with a plan for when the moment arrives.", hardWords: [{ word: "bide", meaning: "to wait for" }] },
      { phrase: "Play a waiting game", meaning: "To delay action until conditions become favourable.", pic: "♟️⏱️", story: "Chess players do it constantly: make no commitment, let your opponent create the weakness, then move." },
      { phrase: "A Fabian policy", meaning: "A strategy of achieving success through patience and gradual action.", pic: "🐢🎯", story: "Hannibal had marched an army into Italy and destroyed every Roman force sent against him. So Rome appointed Fabius Maximus, who simply refused to fight a battle at all — he shadowed Hannibal, cut off his supplies, and picked at his stragglers for years. Romans called him the Delayer and meant it as an insult, until they realised it was working." },
      { phrase: "Slow and steady wins the race", meaning: "Patience and persistence lead to success.", pic: "🐢🏁", story: "Aesop's hare laughs at the tortoise for being slow, and agrees to race it. He sprints so far ahead that he lies down for a nap halfway. The tortoise never stops walking, passes the sleeping hare, and is over the line before he wakes." },
      { phrase: "Win by inches", meaning: "To succeed through a gradual, hard-fought process.", pic: "📏🏆", story: "No single moment won it. The margin was assembled out of a hundred small gains." },
      { phrase: "Make hay while the sun shines", meaning: "To make the most of a good opportunity while it lasts.", pic: "🌾☀️", story: "Cut grass must dry in the sun to become hay. Rain at the wrong moment ruins the crop, so farmers work the dry days hard.", hardWords: [{ word: "hay", meaning: "dried grass stored as animal food" }] },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Disgrace & Suspicion",
    icon: "🌩️",
    note: "Losing your good name, or being suspected of something.",
    items: [
      { phrase: "Under a cloud", meaning: "Under suspicion or in disgrace.", pic: "🌧️🧍", story: "One personal patch of bad weather that follows you around while everyone else stands in the sun." },
      { phrase: "In bad odour", meaning: "Out of favour; regarded with disapproval.", pic: "👃🚫", story: "'Odour' is smell — the sense of a bad smell clinging to someone's name. Reputation described as something people can detect in the air.", hardWords: [{ word: "odour", meaning: "a smell, usually an unpleasant one" }] },
      { phrase: "Fall from grace", meaning: "To lose status, reputation and public respect.", pic: "😇📉", story: "Originally a theological fall from divine favour. Now used for anyone who was widely admired right up until they were not." },
      { phrase: "In the dock", meaning: "Being accused and called to account.", pic: "⚖️🧍", story: "The dock is the enclosure a defendant stands in during a trial. Being in it means the questions are now formal." },
      { phrase: "Give a dog a bad name", meaning: "Once someone gets a bad reputation, people keep judging them unfairly.", pic: "🐕🏷️", story: "The full proverb ends '…and hang him'. Once the label is attached, every later action is read through it." },
      { phrase: "Show the white feather", meaning: "To show cowardice.", pic: "🪶😨", story: "A white feather in a gamecock's tail marked it as poor breeding stock and a bad fighter. In 1914 women handed white feathers to men not in uniform — a cruel use of a cruel image.", hardWords: [{ word: "cowardice", meaning: "lack of courage" }] },
      { phrase: "Snap one's fingers at", meaning: "To treat someone or something with contempt.", pic: "🫰😒", story: "A gesture from Greece and Rome — a flick of the fingers to dismiss a person as beneath discussion.", hardWords: [{ word: "contempt", meaning: "the feeling that someone is worthless" }] },
      { phrase: "Cut no ice", meaning: "To have no influence or effect.", pic: "🧊🚫", story: "Blunt skates cut no line in the ice — all that motion leaving no mark at all. Your argument slid straight over them." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Avoiding Responsibility",
    icon: "🙅",
    note: "Handing the problem to somebody else.",
    items: [
      { phrase: "Pass the buck", meaning: "To shift responsibility to someone else.", pic: "🦌➡️", story: "In frontier American poker a marker — often a knife with a buckhorn handle — was placed in front of whoever had to deal next. Passing the buck passed the duty on. President Harry Truman kept a sign on his desk giving the other half of the idea: THE BUCK STOPS HERE." },
      { phrase: "Leave someone in the lurch", meaning: "To abandon someone in a difficult situation.", pic: "🚶😰", story: "'Lurch' was a losing position in an old French board game from which no recovery was possible. Walking away and leaving your partner there is the insult." },
      { phrase: "Turn one's back on", meaning: "To reject or abandon someone.", pic: "🔙🙍", story: "The most legible gesture there is. No argument, no explanation — just the back of a person leaving." },
      { phrase: "Wash one's hands of something", meaning: "To refuse all further responsibility.", pic: "🚿🙌", story: "Sits with the body-parts family — Pilate's basin, and the oldest way of saying 'not my problem'." },
      { phrase: "Play devil's advocate", meaning: "To argue the opposite side just for the sake of argument.", pic: "😈⚖️", story: "A real Vatican office: when someone was proposed for sainthood, an official was appointed to argue against them so the case was properly tested." },
      { phrase: "Sit on the fence about something", meaning: "To refuse to commit to either side.", pic: "🚧🤔", story: "Sits with the impossible-choices family — comfortable on the boundary, useless to both fields." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Warnings & Foresight",
    icon: "🔔",
    note: "Seeing trouble coming — or being told and not listening.",
    items: [
      { phrase: "A canary in the coal mine", meaning: "An early warning sign of danger.", pic: "🐤⛏️", story: "Miners carried caged canaries underground. The bird's small body reacted to carbon monoxide long before a man's did, so a silent canary meant get out now." },
      { phrase: "Let sleeping dogs lie", meaning: "To avoid stirring up an old problem.", pic: "🐕💤", story: "Wake a sleeping guard dog and you have created a problem that was, until that moment, asleep." },
      { phrase: "A dry run", meaning: "A practice or trial before the real event.", pic: "🚒📋", story: "Fire crews practised with the pumps but no water — everything about the drill was real except the consequences." },
      { phrase: "Have a lot on one's plate", meaning: "To have many responsibilities and tasks to handle.", pic: "🍽️📚", story: "You served yourself, and now the plate is full. Nothing on it is unreasonable — there is just no room for one more thing." },
      { phrase: "Cut someone some slack", meaning: "To be less critical and give someone leniency.", pic: "🪢🤲", story: "Slack is loose rope. Give someone slack and they have room to move without being pulled up sharply for it.", hardWords: [{ word: "leniency", meaning: "being gentle rather than strict in punishment" }] },
      { phrase: "The carrot and the stick", meaning: "Using reward and punishment together to influence behaviour.", pic: "🥕🏒", story: "The cart driver's two tools for a stubborn donkey — one dangled in front, one held behind. Neither works alone as well as both together." },
      { phrase: "A far cry from", meaning: "Very different from something else.", pic: "📢↔️", story: "Hunters judged distance by how faint a cry sounded. If it is a far cry, the two things are nowhere near each other." },
      { phrase: "Get the sack", meaning: "To be dismissed from a job.", pic: "💼🚪", story: "Tradesmen carried their own tools in a sack, left with the employer while they worked. Handing the sack back meant the job was over — collect your tools and go." },
      { phrase: "Gird up one's loins", meaning: "To prepare oneself for a difficult task or challenge.", pic: "🥋💪", story: "Men in long robes tucked and belted them up before battle or hard work so their legs could move freely. Preparation you could see from across the field.", hardWords: [{ word: "gird", meaning: "to fasten a belt around" }, { word: "loins", meaning: "the lower part of the body, around the waist and hips" }] },
      { phrase: "The alpha and the omega", meaning: "The beginning and the end; the most important part.", pic: "🅰️🔚", story: "The first and last letters of the Greek alphabet. Naming both ends is a way of saying 'and everything in between'." },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    name: "Everyday Favourites",
    icon: "⭐",
    note: "High-frequency idioms that do not sit in any one family — but turn up in every paper.",
    items: [
      { phrase: "A piece of cake", meaning: "Something very easy to do.", pic: "🍰", story: "Usually traced to American cakewalk contests, where a cake was the prize for the most graceful walk — though the phrase only really takes off with RAF pilots in the 1940s calling an easy mission a piece of cake." },
      { phrase: "Once in a blue moon", meaning: "Very rarely.", pic: "🌕", picFilter: "saturate(1.8) hue-rotate(200deg) brightness(1.05)", story: "The Maine Farmers' Almanac used 'blue moon' for the third full moon in a season that had four. A 1946 magazine article misread it as the second full moon in a month, and that is the version everyone uses now. Either way — about once every 2.7 years." },
      { phrase: "Spill the beans", meaning: "To reveal a secret.", pic: "🫘", story: "You will hear that Greeks voted with beans in a jar and spilling it revealed the result — etymologists call that folk etymology. The phrase is actually young: American slang first recorded around 1902, where 'spill' had long meant to let something out." },
      { phrase: "The ball is in your court", meaning: "It is now your turn to decide or act.", pic: "🎾", story: "In tennis you cannot play until the ball is on your side. Once it is, standing still is also a decision." },
      { phrase: "Hit the nail on the head", meaning: "To say or do exactly the right thing.", pic: "🔨📌", story: "A clean strike drives the nail straight in. Miss the head and you bend the nail — or the wall." },
      { phrase: "Kill two birds with one stone", meaning: "To solve two problems with a single action.", pic: "🐦🐦🪨", story: "A single throw, two results. The measure of an efficient plan." },
      { phrase: "When pigs fly", meaning: "Something that will never happen.", pic: "🪽🐷🪽", story: "A Scottish proverb of the 1600s. Pigs were chosen precisely because they are the least aerodynamic animal anyone could name." },
      { phrase: "Cry over spilt milk", meaning: "To waste time regretting what cannot be undone.", pic: "😢🥛", story: "The milk is already on the floor. Every second spent crying is a second not spent fetching more." },
      { phrase: "Raining cats and dogs", meaning: "Raining very heavily.", pic: "🌧️🐈🐕", story: "One explanation: heavy rain washed the bodies of street animals down 17th-century gutters, so it looked as though they had fallen from the sky." },
      { phrase: "Under the weather", meaning: "Feeling slightly ill.", pic: "🌧️🤒", story: "A seasick sailor was sent below deck, literally under the weather rail, out of the storm — sheltered because he was unwell." },
      { phrase: "Cut corners", meaning: "To do something cheaply or carelessly to save time or money.", pic: "✂️", story: "Taking the corner off a route saves distance and takes you off the proper road. Faster, and not what was agreed." },
      { phrase: "Through thick and thin", meaning: "Through all difficulties, whatever happens.", pic: "🤝🌲", story: "From travelling through thick forest and thin — dense woodland and open ground alike. Whatever the terrain, still walking together." },
      { phrase: "Part and parcel", meaning: "An essential and inseparable part of something.", pic: "📦🔗", story: "Both words mean 'a portion' — an old legal phrase that doubles the word for emphasis. Not an add-on; part of the thing itself." },
      { phrase: "By hook or by crook", meaning: "By any means possible, fair or unfair.", pic: "🪝🎯", story: "Medieval peasants could take deadwood from the forest using a shepherd's crook or a billhook — but no other tool. Over time it came to mean 'by whatever method works'." },
      { phrase: "In a jiffy", meaning: "In a very short time.", pic: "⚡⏱️", story: "In physics a 'jiffy' is a real unit — the time light takes to travel one centimetre. In conversation it means 'about a minute, honestly'." },
      { phrase: "Up to the hilt", meaning: "Completely; to the fullest extent.", pic: "🗡️💯", story: "The hilt is the handle of a sword. Driven in up to the hilt means the entire blade has gone — there is no further to go.", hardWords: [{ word: "hilt", meaning: "the handle of a sword or dagger" }] },
      { phrase: "The gift of the gab", meaning: "The talent of speaking fluently and persuasively.", pic: "🎁🗣️", story: "'Gab' is old slang for the mouth or for chatter. Some people were simply handed a better one." },
      { phrase: "Lose one's marbles", meaning: "To lose one's mind or good sense.", pic: "🔮🤪", story: "A boy who lost his marbles in the schoolyard had lost everything he owned. The joke transferred neatly to losing your wits." },
      { phrase: "All agog", meaning: "Very eager and excited.", pic: "😮✨", story: "From an old French phrase meaning 'in merriment'. Wide-eyed, leaning forward, waiting to hear the rest." },
      { phrase: "Sangfroid", meaning: "Calmness and composure in danger.", pic: "🧊😐", story: "French for 'cold blood'. While everyone else's blood is boiling, this person's temperature has not changed at all." },
      { phrase: "In weal and woe", meaning: "In good times and bad.", pic: "☀️🌧️", story: "'Weal' is an old word for wellbeing, the opposite of woe. The pair covers the whole range of fortune between them.", hardWords: [{ word: "weal", meaning: "wellbeing; prosperity" }, { word: "woe", meaning: "great sorrow or trouble" }] },
      { phrase: "To fall back on", meaning: "To rely on something as an alternative when needed.", pic: "🛟📚", story: "Retreating troops fell back on a prepared position behind them. Your fallback is what is waiting if the first plan does not hold." },
      { phrase: "To catch up with", meaning: "To reach the same level or standard as others.", pic: "🏃➡️", story: "You started behind; the gap is closing. Note the preposition — catch up WITH someone, catch up ON work." },
      { phrase: "A Greek gift", meaning: "A gift that brings harm to the person who receives it.", pic: "🎁⚠️", story: "From the warning shouted at the Trojans about the wooden horse: beware of Greeks bearing gifts. A present too generous to make sense from someone who has every reason to want you destroyed is worth inspecting before you take it through your gate." },
      { phrase: "The Greek calends", meaning: "A time that will never come.", pic: "📆🚫", story: "The calends was the first day of the Roman month, when debts fell due. The Greeks had no calends at all — so paying 'at the Greek calends' meant never.", hardWords: [{ word: "calends", meaning: "the first day of the month in the Roman calendar" }] },
      { phrase: "Toe the line", meaning: "To obey the rules and conform to expected standards.", pic: "🦶📏", story: "Runners and parliamentary members alike had to place their toes exactly at a marked line. Note the spelling — TOE, not tow; the exam tests this." },
    ],
  },

  // ─── END OF GROUPS — new groups are appended above this line ───────────────
];

// Flat list — the reel, the vocabulary mix, search and the PDF all consume this.
// Every idiom carries the name of the group it came from.
export const IDIOMS: Idiom[] = IDIOM_GROUPS.flatMap((g) =>
  g.items.map((i) => ({ ...i, group: g.name })),
);

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
