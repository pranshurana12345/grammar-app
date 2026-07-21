import { probeProviders, corsPreflight, jsonResponse, errorResponse } from "@/lib/ai";

export const maxDuration = 60;

// Diagnostics: pings every configured model with a one-token request and
// reports which are alive. When "the AI isn't working", this says which link in
// the chain is broken (dead model slug, exhausted key, rate limit) instead of
// leaving it to guesswork — and it can be opened from a phone.
//
// It exposes no keys: only provider names, model slugs and status codes.
export async function OPTIONS() { return corsPreflight(); }

export async function GET() {
  try {
    const results = await probeProviders();
    const configured = {
      groq: !!process.env.GROQ_API_KEY,
      groq2: !!process.env.GROQ_API_KEY_2,
      openrouter: !!process.env.OPENROUTER_API_KEY,
    };
    const healthy = results.filter((r) => r.ok);
    return jsonResponse({
      ok: healthy.length > 0,
      healthy: healthy.length,
      total: results.length,
      configured,
      models: results.sort((a, b) => Number(b.ok) - Number(a.ok) || a.ms - b.ms),
    });
  } catch (err) {
    return errorResponse(err);
  }
}
