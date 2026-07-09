import {
  aiChat, extractJSON, RULE_INDEX,
  corsPreflight, jsonResponse, errorResponse,
} from "@/lib/ai";

export const maxDuration = 60;

type Rec = { q: string; category: string; section: string; correct: boolean; ts: string };

const SYSTEM = `You are Grammy AI — a personal English coach for an AFCAT aspirant using a grammar app. You are given the student's AI-practice history (per-topic accuracy plus their recent wrong answers). Write a short, motivating performance analysis.

Respond with JSON only, exactly this shape:
{"headline":"...","weakAreas":[{"area":"...","note":"...","tip":"..."}],"strengths":["..."],"plan":["..."]}

Rules:
- "headline": one warm sentence summarising how they're doing (mention their overall recent accuracy).
- "weakAreas": up to 4, worst first. "area" is the topic; "note" says what's going wrong in plain words ("You were making mistakes in preposition pairs — 'married to', not 'married with'"); "tip" is one concrete trick or the app rule to revisit (cite rules by name from the list below when they apply).
- "strengths": up to 3 topics they're doing well in — keep them proud.
- "plan": 3–5 short, actionable study steps for the next few days, ordered.
- Only claim weakness/strength where the data supports it (at least 3 attempts). Simple English; Hinglish flavour is fine in tips. Plain text, no markdown.

App rule list:
${RULE_INDEX}`;

export async function OPTIONS() { return corsPreflight(); }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const history: Rec[] = Array.isArray(body.history) ? body.history.slice(-300) : [];
    if (history.length < 5) {
      return jsonResponse({ error: "Not enough practice yet — answer a few more questions first." }, 400);
    }

    // Aggregate per section + category so the model reasons over clean numbers.
    const bySection: Record<string, { a: number; c: number }> = {};
    const byCategory: Record<string, { a: number; c: number }> = {};
    for (const r of history) {
      (bySection[r.section] ??= { a: 0, c: 0 }).a += 1;
      if (r.correct) bySection[r.section].c += 1;
      (byCategory[r.category] ??= { a: 0, c: 0 }).a += 1;
      if (r.correct) byCategory[r.category].c += 1;
    }
    const fmt = (m: Record<string, { a: number; c: number }>) =>
      Object.entries(m)
        .map(([k, v]) => `${k}: ${v.c}/${v.a} correct (${Math.round((v.c / v.a) * 100)}%)`)
        .join("\n");
    const wrong = history.filter((r) => !r.correct).slice(-30)
      .map((r) => `- [${r.section} / ${r.category}] ${r.q}`)
      .join("\n");
    const sevenDays = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = history.filter((r) => new Date(r.ts).getTime() >= sevenDays);
    const recentPct = recent.length
      ? Math.round((recent.filter((r) => r.correct).length / recent.length) * 100)
      : 0;

    const raw = await aiChat({
      system: SYSTEM,
      messages: [{
        role: "user",
        content: `Analyse my practice performance. Respond as JSON.\n\nTotal questions answered: ${history.length}\nLast 7 days: ${recent.length} answered, ${recentPct}% correct\n\nAccuracy by topic:\n${fmt(bySection)}\n\nAccuracy by question type:\n${fmt(byCategory)}\n\nRecent wrong answers:\n${wrong || "(none)"}`,
      }],
      json: true,
      maxTokens: 1800,
      temperature: 0.4,
    });

    const parsed = extractJSON<{
      headline: string;
      weakAreas: { area: string; note: string; tip: string }[];
      strengths: string[];
      plan: string[];
    }>(raw);

    return jsonResponse({
      headline: parsed.headline || "",
      weakAreas: Array.isArray(parsed.weakAreas) ? parsed.weakAreas.slice(0, 4) : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3) : [],
      plan: Array.isArray(parsed.plan) ? parsed.plan.slice(0, 5) : [],
    });
  } catch (err) {
    return errorResponse(err);
  }
}
