import { aiChat, corsPreflight, jsonResponse, errorResponse } from "@/lib/ai";

export const maxDuration = 60;

// ── Camera → text ───────────────────────────────────────────────────────────
// The student photographs a question in their paper. We only use the vision
// model to TRANSCRIBE it — the solving is then done by the (much stronger, much
// faster) text chain in /api/solve. Two reasons: the free vision pool is slow
// and flaky, and the student gets to see and correct the transcription before
// spending a solve on it.
const PROMPT = `Transcribe every exam question visible in this image, exactly as printed.

Rules:
- Keep the question numbers, the full question text, and ALL options with their (a) (b) (c) (d) labels.
- Preserve blanks as they appear (......... or ____).
- If the image shows an instruction line (e.g. "Find the part with an error"), keep it.
- Ignore page headers, footers, watermarks, and anything not part of a question.
- Output ONLY the transcription. No commentary, no answers, no explanations.
- If no question text is legible, output exactly: NO_TEXT_FOUND`;

export async function OPTIONS() { return corsPreflight(); }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const image: string = typeof body.image === "string" ? body.image : "";
    if (!image.startsWith("data:image/")) {
      return jsonResponse({ error: "Send an image as a data URL" }, 400);
    }
    // The client downscales before upload; this is a backstop against a huge
    // payload burning the whole request budget.
    if (image.length > 4_000_000) {
      return jsonResponse({ error: "That photo is too large — try again, a bit closer in." }, 413);
    }

    const text = await aiChat({
      vision: true,
      system: "You are an OCR engine for exam papers. You transcribe, you never answer.",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: PROMPT },
          { type: "image_url", image_url: { url: image } },
        ],
      }],
      maxTokens: 900,
      temperature: 0,
    });

    const cleaned = text.replace(/```/g, "").trim();
    if (!cleaned || cleaned.includes("NO_TEXT_FOUND")) {
      return jsonResponse({ error: "Couldn't read any question in that photo. Try again with better light, closer in." }, 422);
    }
    return jsonResponse({ text: cleaned });
  } catch (err) {
    return errorResponse(err);
  }
}
