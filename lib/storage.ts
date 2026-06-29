"use client";

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

function progressKey() { return `grammar_progress_${getCurrentStudentId()}`; }
function quizKey()     { return `grammar_quiz_${getCurrentStudentId()}`; }

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
  localStorage.setItem(progressKey(), JSON.stringify(progress));
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
  const prev = scores[id] ?? 0;
  scores[id] = Math.max(prev, score);
  localStorage.setItem(quizKey(), JSON.stringify(scores));
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
