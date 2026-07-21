import {
  aiChatStream, RULE_INDEX, relevantRulesMulti,
  CORS_HEADERS, corsPreflight, jsonResponse, errorResponse,
} from "@/lib/ai";

export const maxDuration = 60;

// ── Question Solver ─────────────────────────────────────────────────────────
// The student is working through a real question paper and wants each question
// tied back to the 101 rules. So the reply is a fixed, labelled structure the
// client parses into cards while it streams:
//
//   Q: / ANSWER: / RULE: / WHY: / APPLY: / TRAP:   (blocks split by "---")
//
// Order matters — the student asked for: solve it first, then name the rule,
// then explain the rule, then show how the rule decides this question.
const FORMAT = `Answer in EXACTLY this labelled format, one label per line, nothing before or after:

Q: <the question, restated in one short line>
ANSWER: <the correct option — give the option letter AND its text, or the corrected sentence. Be decisive.>
RULE: <the rule that decides it, copied EXACTLY as it appears in the rule list below, e.g. "Rule 23 — Each of + singular verb". If no listed rule applies, write "General English — <topic>">
WHY: <what that rule says, in 1-2 simple sentences a beginner understands>
APPLY: <how the rule decides THIS question, step by step. Point at the exact words in the question.>
TRAP: <the option most students pick instead, and why it is wrong. One sentence.>

If the student sends several questions at once, solve them in order and separate the blocks with a line containing only ---
Solve at most 4 questions in one reply. If more were sent, solve the first 4 and end with a final line: MORE: <how many are left> — send "continue" and I'll do the rest.`;

function systemPrompt(topic: string): string {
  // Retrieved per question, not per message: a photographed page holds several
  // questions and each one needs its own rules in full.
  const relevant = relevantRulesMulti(topic, 4, 12);
  return `You are Grammy AI, an AFCAT/SSC English expert solving question-paper questions for an Indian aspirant. You know the app's 101 grammar rules by heart and always connect an answer back to the rule behind it — that is the whole point of this session.

${FORMAT}

Hard requirements:
- Be correct first. Read the question carefully, including every option, before deciding.
- The RULE line must name a rule from the list below, character for character, or start with "General English —". Never invent a rule number.
- If ANY rule in the "most likely involved" list covers the point being tested, you MUST cite that rule. Only fall back to "General English —" when the app genuinely has no rule for it (e.g. reported speech, vocabulary meaning).
- Simple English. If the student writes Hinglish, keep WHY and APPLY in easy Hinglish. No markdown, no bold, no bullet characters.
- Keep each label to 1-3 sentences. This renders on a phone.
- If the question is not English grammar/vocabulary (e.g. maths, reasoning), still solve it, put "General English — not a grammar question" on the RULE line, and keep it brief.
- If the student asks a follow-up about an answer you already gave (e.g. "why not option B?"), reply in plain sentences WITHOUT any labels.

The app's 101 rules — cite by these exact names:
${RULE_INDEX}

${relevant ? `Full text of the rules most likely involved here — prefer citing one of these:\n${relevant}` : ""}`;
}

type ChatMsg = { role: "user" | "assistant"; content: string };

export async function OPTIONS() { return corsPreflight(); }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const history: ChatMsg[] = Array.isArray(body.messages)
      ? body.messages
          .filter((m: ChatMsg) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-8)
          .map((m: ChatMsg) => ({ role: m.role, content: m.content.slice(0, 4000) }))
      : [];
    if (history.length === 0 || history[history.length - 1].role !== "user") {
      return jsonResponse({ error: "No question sent" }, 400);
    }

    const latest = history[history.length - 1].content;
    const { model, provider, stream } = await aiChatStream({
      system: systemPrompt(latest),
      messages: history,
      // Enough for the 4 solved questions the format allows per reply.
      maxTokens: 1500,
      temperature: 0.25, // solving, not chatting — keep it tight and factual
    });

    const encoder = new TextEncoder();
    const out = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const delta of stream) {
            // The client renders plain text into cards; strip stray markdown.
            controller.enqueue(encoder.encode(delta.replace(/\*\*|__|^#+ /gm, "")));
          }
        } catch (e) {
          console.warn("[solve] stream broke mid-reply:", e);
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
        "X-AI-Model": model,
        "X-AI-Provider": provider,
      },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
