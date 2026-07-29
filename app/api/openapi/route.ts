import { CORS_HEADERS, corsPreflight } from "@/lib/ai";

// The schema a ChatGPT Action (or any OpenAPI-driven client) imports to learn
// how to call /api/reference. Served from the app so it can never drift from
// the route it describes.
//
// ChatGPT's Action importer is strict: one server URL, operationIds required,
// no $ref cycles, and it ignores anything it doesn't understand — so this is
// deliberately flat and small.

// The response never varies, so it prerenders — which also keeps the Android
// `output: "export"` build happy, unlike the query-driven /api/reference.
export const dynamic = "force-static";

const BASE = "https://grammar-app-pink.vercel.app";

const SCHEMA = {
  openapi: "3.1.0",
  info: {
    title: "Grammy — AFCAT English rulebook",
    description:
      "Look up the grammar rules, trigger words, exceptions, idioms and exam vocabulary from the Grammy study app. Use it to ground every English answer in the student's own rulebook.",
    version: "1.0.0",
  },
  servers: [{ url: BASE }],
  paths: {
    // Trailing slash on purpose: next.config has trailingSlash:true, so the
    // slashless path 308-redirects, and redirects inside a GPT Action are a
    // good way to lose the query string.
    "/api/reference/": {
      get: {
        operationId: "searchRulebook",
        summary: "Search the AFCAT English rulebook",
        description:
          "Returns the grammar rules (with their trigger words and correct/wrong examples), special-case notes, idioms and vocabulary that match a query. Call this before answering ANY English grammar, idiom or vocabulary question so the answer cites the student's own rules.",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            description:
              "What the student is asking about — paste the whole sentence or question, or the word/idiom/grammar point.",
            schema: { type: "string" },
          },
          {
            name: "kind",
            in: "query",
            required: false,
            description: "Narrow the search. Use 'all' unless you know which one you need.",
            schema: { type: "string", enum: ["all", "rules", "exceptions", "idioms", "words"], default: "all" },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            description: "How many of each kind to return (1–10).",
            schema: { type: "integer", default: 5, minimum: 1, maximum: 10 },
          },
        ],
        responses: {
          "200": {
            description: "Matching entries from the rulebook.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    query: { type: "string" },
                    source: { type: "string" },
                    rules: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "integer" },
                          rule_number: { type: "string", description: "Cite this exactly, e.g. 'Rule 59'." },
                          section: { type: "string" },
                          title: { type: "string" },
                          rule: { type: "string", description: "The rule itself. Answer only from this text." },
                          trigger_words: {
                            type: "array",
                            items: { type: "string" },
                            description: "The words that give this rule away in a question. Name these first when explaining.",
                          },
                          correct_examples: { type: "array", items: { type: "string" } },
                          wrong_examples: { type: "array", items: { type: "string" } },
                          hinglish_tip: { type: "string" },
                          app_link: { type: "string", description: "Deep link to this rule in the app." },
                        },
                      },
                    },
                    exceptions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          group: { type: "string" },
                          title: { type: "string" },
                          normal_rule: { type: "string" },
                          exceptions: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                when: { type: "string" },
                                what_to_do: { type: "string" },
                                correct: { type: "array", items: { type: "string" } },
                                wrong: { type: "array", items: { type: "string" } },
                              },
                            },
                          },
                          exam_trap: { type: "string" },
                        },
                      },
                    },
                    idioms: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          phrase: { type: "string" },
                          meaning: { type: "string" },
                          origin: { type: "string" },
                          group: { type: "string" },
                        },
                      },
                    },
                    words: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          word: { type: "string" },
                          meaning: { type: "string" },
                          synonyms: { type: "array", items: { type: "string" } },
                          antonyms: { type: "array", items: { type: "string" } },
                          example: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export async function OPTIONS() { return corsPreflight(); }

export async function GET() {
  return new Response(JSON.stringify(SCHEMA, null, 2), {
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
