import {
  aiChat, RULE_KB, APP_KB,
  corsPreflight, jsonResponse, errorResponse,
} from "@/lib/ai";

export const maxDuration = 60;

const SYSTEM = `You are Grammy AI — the friendly English tutor inside the Grammy app, used by AFCAT/SSC aspirants in India. You know the app's complete rulebook (all 101 rules, below), the AFCAT exam, and the app itself — the student can ask you anything about any of these.

If a CONTEXT block is present, it describes what the student is currently looking at (a grammar rule, or a practice question they just attempted) — anchor your answer to it, but you may bring in any related rule.

How to answer:
- Be warm, encouraging and CONCISE — 2 to 6 short sentences, or a tiny list. This renders in a small chat sheet on a phone.
- Explain in simple English. If the student writes in Hindi/Hinglish, reply in easy Hinglish.
- Use one tiny example sentence where it helps. Mnemonics and tricks are welcome.
- Quote rules by their exact names (e.g. "Rule 23 — …") so the student can revisit them in the Learn tab.
- Stay on-topic: English grammar, vocabulary, the AFCAT exam, study strategy, and this app. Politely decline anything else.
- Plain text only — no markdown headings or bold markers.

${APP_KB}

The complete rulebook:
${RULE_KB}`;

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

    const reply = await aiChat({
      system: SYSTEM,
      messages,
      maxTokens: 700,
      temperature: 0.5,
    });

    // The sheet renders plain text — strip any markdown emphasis the model sneaks in.
    return jsonResponse({ reply: reply.replace(/\*\*|__|^#+\s*/gm, "").trim() });
  } catch (err) {
    return errorResponse(err);
  }
}
