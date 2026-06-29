"use client";

import { getSupabase } from "./supabase";

// Cross-device sync, keyed by the local PIN "student" id (s1..s5) — no real auth.
// Each student's state is stored as one JSON blob per key in a single table:
//   app_state(student_id text, key text, value jsonb, updated_at timestamptz)
// If Supabase env vars aren't set, every function is a safe no-op and the app
// keeps working purely on localStorage.

const TABLE = "app_state";

export async function pushState(studentId: string, key: string, value: unknown): Promise<void> {
  const sb = getSupabase();
  if (!sb || !studentId || studentId === "guest") return;
  try {
    await sb
      .from(TABLE)
      .upsert(
        { student_id: studentId, key, value, updated_at: new Date().toISOString() },
        { onConflict: "student_id,key" }
      );
  } catch {
    /* offline / not configured — ignore */
  }
}

export async function pullState(
  studentId: string,
  key: string
): Promise<{ value: unknown; updatedAt: string } | null> {
  const sb = getSupabase();
  if (!sb || !studentId || studentId === "guest") return null;
  try {
    const { data, error } = await sb
      .from(TABLE)
      .select("value, updated_at")
      .eq("student_id", studentId)
      .eq("key", key)
      .maybeSingle();
    if (error || !data) return null;
    return { value: data.value, updatedAt: data.updated_at as string };
  } catch {
    return null;
  }
}
