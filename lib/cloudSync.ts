"use client";

import { getSupabase } from "./supabase";
import type { RuleStatus } from "./storage";

// Push a single rule's status to the cloud (fire-and-forget, never throws)
export async function pushRuleStatus(ruleId: number, status: RuleStatus) {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("rule_progress")
      .upsert({ user_id: user.id, rule_id: ruleId, status, updated_at: new Date().toISOString() },
        { onConflict: "user_id,rule_id" });
  } catch {
    // Silently ignore — localStorage is the source of truth while offline
  }
}

// Push a quiz score to the cloud
export async function pushQuizScore(ruleId: number, score: number, passed: boolean) {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("quiz_scores").insert({
      user_id: user.id,
      rule_id: ruleId,
      score,
      passed,
      taken_at: new Date().toISOString(),
    });

    // Also upsert best score in rule_progress if confident
    if (passed) {
      await supabase
        .from("rule_progress")
        .upsert({ user_id: user.id, rule_id: ruleId, status: "confident", updated_at: new Date().toISOString() },
          { onConflict: "user_id,rule_id" });
    }
  } catch {
    // Silently ignore
  }
}

// Pull all progress from the cloud and write to localStorage
export async function pullProgress(): Promise<Record<number, RuleStatus> | null> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("rule_progress")
      .select("rule_id, status")
      .eq("user_id", user.id);

    if (error || !data) return null;

    const progress: Record<number, RuleStatus> = {};
    for (const row of data) {
      progress[row.rule_id] = row.status as RuleStatus;
    }
    return progress;
  } catch {
    return null;
  }
}

// Push all localStorage progress to the cloud (used on first login)
export async function pushAllProgress(progress: Record<number, RuleStatus>) {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const rows = Object.entries(progress).map(([ruleId, status]) => ({
      user_id: user.id,
      rule_id: parseInt(ruleId),
      status,
      updated_at: new Date().toISOString(),
    }));

    if (rows.length === 0) return;

    await supabase
      .from("rule_progress")
      .upsert(rows, { onConflict: "user_id,rule_id" });
  } catch {
    // Silently ignore
  }
}
