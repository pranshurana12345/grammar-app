"use client";

import { pushState } from "./cloudSync";

// ── AI Practice history ───────────────────────────────────────────────────────
// Every answered AI-practice question is recorded here (per student, synced to
// the cloud like progress/quiz). The AI Coach and the home-page Topics readiness
// are computed from these records.

export type PracticeRecord = {
  q: string;        // question stem (trimmed) — used to avoid repeats
  category: string; // AFCAT question type, e.g. "Error Spotting"
  section: string;  // app grammar section, e.g. "Prepositions" / "Vocabulary"
  correct: boolean;
  ts: string;       // ISO timestamp
};

const MAX_RECORDS = 1000;

function getCurrentStudentId(): string {
  if (typeof window === "undefined") return "guest";
  try {
    const raw = localStorage.getItem("grammar_current_student");
    if (raw) return (JSON.parse(raw) as { id: string }).id;
  } catch { /* ignore */ }
  return "guest";
}

export const practiceKey = (id = getCurrentStudentId()) => `grammar_practice_${id}`;
const practiceTsKey = (id = getCurrentStudentId()) => `grammar_practice_ts_${id}`;

export function getPracticeHistory(): PracticeRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(practiceKey());
    return raw ? (JSON.parse(raw) as PracticeRecord[]) : [];
  } catch { return []; }
}

export function recordPracticeAnswer(rec: PracticeRecord) {
  const history = getPracticeHistory();
  history.push(rec);
  const trimmed = history.slice(-MAX_RECORDS);
  const sid = getCurrentStudentId();
  try {
    localStorage.setItem(practiceKey(sid), JSON.stringify(trimmed));
    localStorage.setItem(practiceTsKey(sid), new Date().toISOString());
  } catch { /* ignore */ }
  void pushState(sid, "practice", trimmed); // cloud sync (no-op if unconfigured)
}

// ── Readiness ─────────────────────────────────────────────────────────────────
// Per-section accuracy over the last `days` days of AI practice.

export type SectionReadiness = Record<string, { attempts: number; correct: number; pct: number }>;

export function sectionReadiness(days = 7): SectionReadiness {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const out: SectionReadiness = {};
  for (const r of getPracticeHistory()) {
    if (new Date(r.ts).getTime() < cutoff) continue;
    const s = r.section || "Miscellaneous";
    if (!out[s]) out[s] = { attempts: 0, correct: 0, pct: 0 };
    out[s].attempts += 1;
    if (r.correct) out[s].correct += 1;
  }
  for (const s of Object.keys(out)) {
    out[s].pct = Math.round((out[s].correct / out[s].attempts) * 100);
  }
  return out;
}

export function practiceStats(days = 7) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const all = getPracticeHistory();
  const recent = all.filter((r) => new Date(r.ts).getTime() >= cutoff);
  const correct = recent.filter((r) => r.correct).length;
  return {
    total: all.length,
    recent: recent.length,
    recentCorrect: correct,
    recentPct: recent.length ? Math.round((correct / recent.length) * 100) : 0,
  };
}

// Blend the rule-based topic progress (tests/confidence) with the last-7-days
// AI-practice accuracy for that section. Counts from the very first answered
// question, but its weight grows with attempts (up to 50% at 5+ attempts) so a
// single lucky/unlucky answer can't swing the bar wildly.
export function blendedTopicPct(rulePct: number, section: string, readiness: SectionReadiness): {
  pct: number; fromAI: boolean;
} {
  const r = readiness[section];
  if (!r || r.attempts === 0) return { pct: Math.round(rulePct), fromAI: false };
  const w = Math.min(r.attempts / 5, 1) * 0.5;
  return { pct: Math.round(rulePct * (1 - w) + r.pct * w), fromAI: true };
}

// ── API base ──────────────────────────────────────────────────────────────────
// The Android (Capacitor) build is a static export with no server — its AI
// calls go to the deployed Vercel app. Web/dev use same-origin routes.
export function apiBase(): string {
  if (typeof window === "undefined") return "";
  if ((window as unknown as { Capacitor?: unknown }).Capacitor) {
    return "https://grammar-app-pink.vercel.app";
  }
  return "";
}
