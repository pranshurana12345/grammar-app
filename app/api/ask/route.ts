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
function systemPrompt(topic: string): string {
  const relevant = relevantRules(topic);
  return `You are Grammy AI — the friendly English tutor inside the Grammy app, used by AFCAT/SSC aspirants in India. You know the app's complete rulebook, the AFCAT exam, and the app itself — the student can ask you anything about any of these.

If a CONTEXT block is present, it describes what the student is currently looking at (a grammar rule, or a practice question they just attempted) — anchor your answer to it, but you may bring in any related rule.

How to answer:
- Be warm, encouraging and CONCISE — 2 to 6 short sentences, or a tiny list. This renders in a small chat sheet on a phone.
- Explain in simple English. If the student writes in Hindi/Hinglish, reply in easy Hinglish.
- Use one tiny example sentence where it helps. Mnemonics and tricks are welcome.
- Quote rules by their exact names (e.g. "Rule 23 — …") so the student can revisit them in the Learn tab.
- Stay on-topic: English grammar, vocabulary, the AFCAT exam, study strategy, and this app. Politely decline anything else.
- Plain text only — no markdown headings or bold markers.

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
      system: systemPrompt(topic),
      messages,
      maxTokens: 700,
      temperature: 0.5,
    });

    // Stream straight through to the client, stripping any markdown emphasis the
    // model sneaks in (the sheet renders plain text).
    const encoder = new TextEncoder();
    const out = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const delta of stream) {
            controller.enqueue(encoder.encode(delta.replace(/\*\*|__/g, "")));
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
