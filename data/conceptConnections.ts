/**
 * Defines the grammar transformation / relationship graph between concepts.
 * Each connection is a directed edge: fromSlug → toSlug with a label (via)
 * and a one-line explanation (note).
 *
 * These are rendered as visual "equation cards" on concept pages so students
 * can see HOW two concepts relate, not just that they are related.
 */

export type Connection = {
  fromSlug: string;
  toSlug: string;
  via: string;    // label on the arrow  e.g.  "+ -ing"
  note: string;   // one-line explanation shown below the visual
};

export const CONNECTIONS: Connection[] = [

  // ── VERB TRANSFORMATIONS ─────────────────────────────────────────────────
  {
    fromSlug: "verb",
    toSlug: "gerund",
    via: "+ -ing",
    note: "Verb's -ing form used as a noun (subject or object)",
  },
  {
    fromSlug: "verb",
    toSlug: "infinitive",
    via: "to + V1",
    note: "Base form with 'to' — acts as noun, adjective, or purpose",
  },
  {
    fromSlug: "verb",
    toSlug: "participle",
    via: "-ing / -ed form",
    note: "Same verb, different role — modifies nouns like an adjective",
  },
  {
    fromSlug: "verb",
    toSlug: "passive-voice",
    via: "be + V3",
    note: "Auxiliary 'be' + past participle converts active verb to passive",
  },

  // ── NOUN CONNECTIONS ─────────────────────────────────────────────────────
  {
    fromSlug: "adjective",
    toSlug: "noun",
    via: "describes",
    note: "Adjectives modify nouns to add detail (brave soldier, heavy rain)",
  },
  {
    fromSlug: "article",
    toSlug: "noun",
    via: "a / an / the +",
    note: "Articles always precede a noun to show definiteness or quantity",
  },
  {
    fromSlug: "noun",
    toSlug: "pronoun",
    via: "replaced by",
    note: "Pronouns stand in for nouns to avoid repeating the same word",
  },
  {
    fromSlug: "noun",
    toSlug: "subject",
    via: "acts as",
    note: "Nouns are the most common performers of action in a sentence",
  },
  {
    fromSlug: "gerund",
    toSlug: "noun",
    via: "functions as",
    note: "A gerund (-ing verb) fills every slot a noun can: subject, object, complement",
  },

  // ── GERUND vs INFINITIVE ─────────────────────────────────────────────────
  {
    fromSlug: "gerund",
    toSlug: "infinitive",
    via: "vs.  to + V1",
    note: "Both follow verbs as objects — but the main verb decides which one",
  },

  // ── ADJECTIVE / ADVERB ───────────────────────────────────────────────────
  {
    fromSlug: "adverb",
    toSlug: "verb",
    via: "modifies",
    note: "Adverbs tell HOW, WHEN, or WHERE a verb's action happens",
  },
  {
    fromSlug: "adverb",
    toSlug: "adjective",
    via: "intensifies",
    note: "Adverbs can strengthen or weaken adjectives (very tall, quite fast)",
  },
  {
    fromSlug: "adjective",
    toSlug: "degree-of-comparison",
    via: "-er / -est",
    note: "Adjectives change form to compare two or more things",
  },

  // ── PARTICIPLE ───────────────────────────────────────────────────────────
  {
    fromSlug: "participle",
    toSlug: "gerund",
    via: "same -ing form",
    note: "Gerund = noun role; Participle = adjective role — context decides which",
  },
  {
    fromSlug: "participle",
    toSlug: "passive-voice",
    via: "V3 (past participle)",
    note: "Every passive sentence needs a past participle (V3)",
  },
  {
    fromSlug: "participle",
    toSlug: "adjective",
    via: "acts like",
    note: "Participial phrases modify nouns exactly the way adjectives do",
  },

  // ── PASSIVE VOICE ────────────────────────────────────────────────────────
  {
    fromSlug: "passive-voice",
    toSlug: "active-voice",
    via: "reverse of",
    note: "Active: subject DOES the action. Passive: subject RECEIVES the action.",
  },
  {
    fromSlug: "active-voice",
    toSlug: "object",
    via: "object → subject",
    note: "When converting to passive, the active object becomes the new subject",
  },

  // ── AUXILIARY / MODAL ────────────────────────────────────────────────────
  {
    fromSlug: "auxiliary-verb",
    toSlug: "passive-voice",
    via: "be + V3",
    note: "The auxiliary 'be' (is/was/will be) forms all passive constructions",
  },
  {
    fromSlug: "auxiliary-verb",
    toSlug: "modal-verb",
    via: "special subtype",
    note: "Modals (can/must/will/should) are auxiliary verbs with unique meanings",
  },
  {
    fromSlug: "modal-verb",
    toSlug: "infinitive",
    via: "+ bare V1",
    note: "Modals always take bare infinitive — never 'to' (can go, NOT can to go)",
  },

  // ── ARTICLES / COUNTABILITY ──────────────────────────────────────────────
  {
    fromSlug: "countable-uncountable",
    toSlug: "article",
    via: "determines",
    note: "Countability decides article choice: a soldier / ✗ an information",
  },
  {
    fromSlug: "countable-uncountable",
    toSlug: "adjective",
    via: "few vs. little",
    note: "Countable → few/many/fewer. Uncountable → little/much/less",
  },

  // ── SUBJECT / OBJECT ─────────────────────────────────────────────────────
  {
    fromSlug: "subject",
    toSlug: "verb",
    via: "agrees with",
    note: "Subject and verb must match in number and person (he runs / they run)",
  },

  // ── PRONOUNS ─────────────────────────────────────────────────────────────
  {
    fromSlug: "pronoun",
    toSlug: "subject",
    via: "I / he / she / they",
    note: "Subject-form pronouns replace nouns in the subject position",
  },
  {
    fromSlug: "pronoun",
    toSlug: "object",
    via: "me / him / her / them",
    note: "Object-form pronouns follow verbs and prepositions",
  },

  // ── CLAUSE / CONJUNCTION ─────────────────────────────────────────────────
  {
    fromSlug: "conjunction",
    toSlug: "clause",
    via: "joins",
    note: "Conjunctions link independent or dependent clauses together",
  },
  {
    fromSlug: "clause",
    toSlug: "conditional",
    via: "if-clause +",
    note: "Conditional sentences are two clauses: an if-clause and a result clause",
  },

  // ── TENSES ───────────────────────────────────────────────────────────────
  {
    fromSlug: "present-simple",
    toSlug: "present-continuous",
    via: "→ in progress",
    note: "Simple = habit or truth. Continuous = happening right now",
  },
  {
    fromSlug: "present-perfect",
    toSlug: "past-simple",
    via: "vs. specific time",
    note: "Perfect = unspecified past. Simple = specific past moment (yesterday, 2020)",
  },
  {
    fromSlug: "past-simple",
    toSlug: "past-perfect",
    via: "earlier action →",
    note: "When two past actions occur, the earlier one uses past perfect",
  },

  // ── REPORTED SPEECH ──────────────────────────────────────────────────────
  {
    fromSlug: "reported-speech",
    toSlug: "past-simple",
    via: "backshift",
    note: "Present simple → Past simple when reporting what someone said",
  },
  {
    fromSlug: "reported-speech",
    toSlug: "past-perfect",
    via: "backshift",
    note: "Present perfect → Past perfect in reported speech",
  },

  // ── CONDITIONALS ─────────────────────────────────────────────────────────
  {
    fromSlug: "conditional",
    toSlug: "modal-verb",
    via: "result clause",
    note: "The result clause of a conditional uses would / will / can / could",
  },
  {
    fromSlug: "conditional",
    toSlug: "past-perfect",
    via: "Type 3 if-clause",
    note: "If + past perfect = hypothetical past condition (Type 3)",
  },
];

// ── HELPER: get connections where this slug is involved ──────────────────────

export function getConnectionsFor(slug: string): {
  outgoing: Connection[];   // this concept → other
  incoming: Connection[];   // other concept → this concept
} {
  return {
    outgoing: CONNECTIONS.filter((c) => c.fromSlug === slug),
    incoming: CONNECTIONS.filter((c) => c.toSlug === slug),
  };
}
