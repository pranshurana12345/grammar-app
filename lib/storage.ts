"use client";

import { pushState, pullState } from "./cloudSync";

export type RuleStatus = "unseen" | "seen" | "confident" | "revise";

type Progress = Record<number, RuleStatus>;
type QuizScores = Record<number, number>;

// ── Per-student key helpers ───────────────────────────────────────────────────

function getCurrentStudentId(): string {
  if (typeof window === "undefined") return "guest";
  try {
    const raw = localStorage.getItem("grammar_current_student");
    if (raw) return (JSON.parse(raw) as { id: string }).id;
  } catch { /* ignore */ }
  return "guest";
}

const progressKey = (id = getCurrentStudentId()) => `grammar_progress_${id}`;
const quizKey = (id = getCurrentStudentId()) => `grammar_quiz_${id}`;
const tsKey = (kind: string, id = getCurrentStudentId()) => `grammar_${kind}_ts_${id}`;

// ── Progress ──────────────────────────────────────────────────────────────────

export function getProgress(): Progress {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(progressKey());
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function setRuleStatus(id: number, status: RuleStatus) {
  const progress = getProgress();
  progress[id] = status;
  const sid = getCurrentStudentId();
  localStorage.setItem(progressKey(sid), JSON.stringify(progress));
  localStorage.setItem(tsKey("progress", sid), new Date().toISOString());
  void pushState(sid, "progress", progress); // sync to cloud (no-op if unconfigured)
}

export function getRuleStatus(id: number): RuleStatus {
  return getProgress()[id] ?? "unseen";
}

export function markSeen(id: number) {
  if (getRuleStatus(id) === "unseen") setRuleStatus(id, "seen");
}

// ── Quiz Scores ───────────────────────────────────────────────────────────────

export function getQuizScores(): QuizScores {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(quizKey());
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function getQuizScore(id: number): number {
  return getQuizScores()[id] ?? 0;
}

export function saveQuizScore(id: number, score: number) {
  const scores = getQuizScores();
  scores[id] = Math.max(scores[id] ?? 0, score);
  const sid = getCurrentStudentId();
  localStorage.setItem(quizKey(sid), JSON.stringify(scores));
  localStorage.setItem(tsKey("quiz", sid), new Date().toISOString());
  void pushState(sid, "quiz", scores);
  if (score >= 80) setRuleStatus(id, "confident");
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export function getStats(totalRules: number) {
  const progress = getProgress();
  const vals = Object.values(progress);
  const confident = vals.filter((v) => v === "confident").length;
  const seen = vals.filter((v) => v === "seen").length;
  const revise = vals.filter((v) => v === "revise").length;
  const unseen = totalRules - confident - seen - revise;
  return { confident, seen, revise, unseen, total: totalRules };
}

// ── Cloud sync ─────────────────────────────────────────────────────────────────
// Pull the student's cloud state and merge into localStorage (last-write-wins by
// timestamp). If local is newer, push it up instead. Safe no-op when Supabase
// isn't configured (pull/push return immediately). Returns true if local changed.

export async function syncDown(studentId: string): Promise<boolean> {
  if (typeof window === "undefined" || !studentId || studentId === "guest") return false;
  let changed = false;

  for (const kind of ["progress", "quiz"] as const) {
    const key = kind === "progress" ? progressKey(studentId) : quizKey(studentId);
    const tk = tsKey(kind, studentId);
    const remote = await pullState(studentId, kind);
    const localTs = localStorage.getItem(tk) || "";

    if (remote && remote.updatedAt > localTs) {
      // remote is newer → adopt it
      localStorage.setItem(key, JSON.stringify(remote.value));
      localStorage.setItem(tk, remote.updatedAt);
      changed = true;
    } else {
      // local is newer (or no remote) → push local up so the cloud catches up
      const local = localStorage.getItem(key);
      if (local && (!remote || localTs > remote.updatedAt)) {
        await pushState(studentId, kind, JSON.parse(local));
      }
    }
  }

  return changed;
}
