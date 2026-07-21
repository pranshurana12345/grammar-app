import { transcribeAudio, corsPreflight, jsonResponse, errorResponse } from "@/lib/ai";

export const maxDuration = 60;

// ── Mic → text ──────────────────────────────────────────────────────────────
// The browser records a clip (MediaRecorder) and posts it here; Groq's Whisper
// turns it into text in about a second. We do this server-side rather than with
// the browser's SpeechRecognition API because that API doesn't exist in the
// Android WebView build, and Whisper handles Indian-accented English and
// Hinglish noticeably better.
const MAX_BYTES = 12 * 1024 * 1024;

export async function OPTIONS() { return corsPreflight(); }

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const audio = form.get("audio");
    if (!(audio instanceof Blob)) {
      return jsonResponse({ error: "No audio received" }, 400);
    }
    if (audio.size === 0) {
      return jsonResponse({ error: "That recording was empty — hold the mic a moment longer." }, 400);
    }
    if (audio.size > MAX_BYTES) {
      return jsonResponse({ error: "That recording is too long — keep it under a minute." }, 413);
    }

    const name = audio instanceof File && audio.name ? audio.name : "clip.webm";
    const text = await transcribeAudio(audio, name);
    return jsonResponse({ text });
  } catch (err) {
    return errorResponse(err);
  }
}
