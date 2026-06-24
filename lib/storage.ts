"use client";

import { pushRuleStatus, pushQuizScore } from "./cloudSync";

const PROGRESS_KEY = "grammar_progress";
const QUIZ_KEY = "grammar_quiz_scores";

export type RuleStatus = "unseen" | "seen" | "confident" | "revise";

type Progress = Record<number, RuleStatus>;
type QuizScores = Record<number, number>; // best score 0-100

// ─── Progress ───────────────────────────────────────────────────────────────

export function getProgress(): Progress {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setRuleStatus(id: number, status: RuleStatus) {
  const progress = getProgress();
  progress[id] = status;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  pushRuleStatus(id, status); // fire-and-forget cloud sync
}

export function getRuleStatus(id: number): RuleStatus {
  return getProgress()[id] ?? "unseen";
}

/** Auto-mark a rule as "seen" when first viewed (only if currently unseen) */
export function markSeen(id: number) {
  const current = getRuleStatus(id);
  if (current === "unseen") setRuleStatus(id, "seen");
}

// ─── Quiz Scores ─────────────────────────────────────────────────────────────

export function getQuizScores(): QuizScores {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(QUIZ_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getQuizScore(id: number): number {
  return getQuizScores()[id] ?? 0;
}

/**
 * Save a quiz score. If score >= 75, mark rule as "confident"
 * (overrides unseen/seen/revise but never downgrades from confident)
 */
export function saveQuizScore(id: number, score: number) {
  const scores = getQuizScores();
  const prev = scores[id] ?? 0;
  scores[id] = Math.max(prev, score);
  localStorage.setItem(QUIZ_KEY, JSON.stringify(scores));

  if (score >= 80) {
    setRuleStatus(id, "confident");
  }
  pushQuizScore(id, score, score >= 80); // fire-and-forget cloud sync
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export function getStats(totalRules: number) {
  const progress = getProgress();
  const vals = Object.values(progress);
  const confident = vals.filter((v) => v === "confident").length;
  const seen = vals.filter((v) => v === "seen").length;
  const revise = vals.filter((v) => v === "revise").length;
  const unseen = totalRules - confident - seen - revise;
  return { confident, seen, revise, unseen, total: totalRules };
}
