import {
  aiChatStream, RULE_INDEX, APP_KB, relevantRules,
  CORS_HEADERS, corsPreflight, jsonResponse, errorResponse,
} from "@/lib/ai";

export const maxDuration = 60;

// The instructions are fixed; the rulebook part is assembled per request. We
// used to inline all 101 rules in full (~5.5k tokens) on every single message —
// re-sent on every retry in the fallback chain, which inflated latency and ate
// the Groq per-minute token limit. Now the tutor gets every rule TITLE (so it
// can still cite anything) plus the full text of only the relevant rules.
// "practice" is what the chat sheet's Fill-in-the-blanks / Quiz-me buttons send.
// Those need a longer, numbered answer with the key held back to the end, which
// is the opposite of the 2–6 sentence house style — so the style block swaps
// rather than being contradicted mid-prompt.
const CHAT_STYLE = `How to answer:
- Be warm, encouraging and CONCISE — 2 to 6 short sentences, or a tiny list. This renders in a small chat sheet on a phone.
- LEAD WITH THE TRIGGER WORD. This student learns by spotting the word that gives a rule away — "lest", "no sooner", "each of", "as well as", "-ior words". Where a rule has trigger words (the rule text below lists them), name them first and say what they force: "See 'lest' → only SHOULD can follow, and never 'not'." Then explain. An answer that explains the grammar without naming what to look for is the one they can't use in the exam.
- Explain in simple English. If the student writes in Hindi/Hinglish, reply in easy Hinglish.
- Use one tiny example sentence where it helps. Mnemonics and tricks are welcome.
- When they got something wrong, say plainly which word in the sentence should have tipped them off.
- Quote rules by their exact names (e.g. "Rule 23 — …") so the student can revisit them in the Learn tab.
- Stay on-topic: English grammar, vocabulary, the AFCAT exam, study strategy, and this app. Politely decline anything else.
- Plain text only — no markdown headings or bold markers.`;

const PRACTICE_STYLE = `How to answer — the student has asked you to SET PRACTICE, so length is fine here:
- Give exactly the number of questions asked for, numbered 1, 2, 3…
- Every question must test the rule or word in the CONTEXT block. Use fresh sentences, Indian names and settings, and AFCAT difficulty — one careless-reader trap in each.
- Before you write a question down, check that exactly ONE option can be defended. If you cannot make the others clearly wrong, throw that question away and write a different one.
- Never reveal an answer beside its question. Put a blank line, then "ANSWERS:", then the key — ONE line per question: the letter, then a short reason. Nothing else.
- Never think aloud, never argue with yourself, never explain your process. If something isn't working, fix it silently before you write. The student sees every word you produce.
- MCQs: four options labelled (a) (b) (c) (d), one correct, the other three plausible but definitely wrong.
- Blanks: write the gap as ......... and never leave the missing word visible elsewhere in the sentence.
- Plain text only — no markdown, no asterisks, no headings. No preamble, start at question 1.`;

function systemPrompt(topic: string, mode: string): string {
  const relevant = relevantRules(topic);
  return `You are Grammy AI — the friendly English tutor inside the Grammy app, used by AFCAT/SSC aspirants in India. You know the app's complete rulebook, the AFCAT exam, and the app itself — the student can ask you anything about any of these.

If a CONTEXT block is present, it describes what the student is currently looking at (a grammar rule, or a practice question they just attempted) — anchor your answer to it, but you may bring in any related rule.

${mode === "practice" ? PRACTICE_STYLE : CHAT_STYLE}

${APP_KB}

Every rule in the app's rulebook (cite these by name):
${RULE_INDEX}
${relevant ? `\nThe rules most relevant to what the student is asking, in full:\n${relevant}` : ""}`;
}

type ChatMsg = { role: "user" | "assistant"; content: string };

export async function OPTIONS() { return corsPreflight(); }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const context: string = typeof body.context === "string" ? body.context.slice(0, 4000) : "";
    const mode: string = body.mode === "practice" ? "practice" : "chat";
    const history: ChatMsg[] = Array.isArray(body.messages)
      ? body.messages
          .filter((m: ChatMsg) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-12)
      : [];
    if (history.length === 0 || history[history.length - 1].role !== "user") {
      return jsonResponse({ error: "No question asked" }, 400);
    }

    // Fold the context into the first user turn.
    const first = history[0];
    const messages: ChatMsg[] = first.role === "user"
      ? [
          { role: "user", content: `CONTEXT (what the student is looking at):\n${context}\n\nSTUDENT: ${first.content}` },
          ...history.slice(1),
        ]
      : history;

    // Retrieve against the context plus the live question, so follow-ups
    // ("what about neither?") still pull the right rules in.
    const topic = `${context}\n${history[history.length - 1].content}`;
    const { model, provider, stream } = await aiChatStream({
      system: systemPrompt(topic, mode),
      messages,
      // Five MCQs with an answer key don't fit in a chat reply's budget. Safe to
      // raise: budgetFor() in lib/ai.ts clamps this down to whatever a model's
      // per-minute ceiling can spare rather than sending a doomed request.
      maxTokens: mode === "practice" ? 1200 : 700,
      // Setting questions needs care, not flair — a hotter sample is what had
      // the model second-guessing itself out loud inside the answer key.
      temperature: mode === "practice" ? 0.55 : 0.5,
    });

    // Stream straight through to the client, stripping any markdown emphasis the
    // model sneaks in (the sheet renders plain text).
    const encoder = new TextEncoder();
    const out = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const delta of stream) {
            // The sheet renders plain text, so markdown emphasis arrives as
            // literal *stars* around the example sentences. Strip every
            // asterisk, not just the bold pairs.
            controller.enqueue(encoder.encode(delta.replace(/\*+|__/g, "")));
          }
        } catch (e) {
          console.warn("[ask] stream broke mid-reply:", e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(out, {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        // Lets the client (and us) see which model actually answered, instead of
        // the chain degrading silently.
        "X-AI-Model": model,
        "X-AI-Provider": provider,
      },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
