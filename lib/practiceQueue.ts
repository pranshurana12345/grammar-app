"use client";

import { apiBase, getPracticeHistory } from "./practice";

// ── Practice question queue ───────────────────────────────────────────────────
// A per-student buffer of AI questions in localStorage. Filled in the
// background (app open + while scrolling the practice reel) so the student
// never stares at a loading screen, and deduped against everything they have
// ever answered so questions don't repeat.

export type PracticeQuestion = {
  id: string;
  category: string;
  section: string;
  question: string;
  options: { text: string; why: string }[];
  correctIndex: number;
  rule: string;
  explanation: string;
};

const CACHE_CAP = 40;

function sid(): string {
  if (typeof window === "undefined") return "guest";
  try {
    const raw = localStorage.getItem("grammar_current_student");
    if (raw) return (JSON.parse(raw) as { id: string }).id;
  } catch { /* ignore */ }
  return "guest";
}

const queueKey = () => `grammar_practice_queue_${sid()}`;

export function normalizeStem(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 100);
}

function answeredStems(): Set<string> {
  return new Set(getPracticeHistory().map((r) => normalizeStem(r.q)));
}

// Cached questions the student has NOT answered yet.
export function loadQueue(): PracticeQuestion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(queueKey());
    const qs: PracticeQuestion[] = raw ? JSON.parse(raw) : [];
    const seen = answeredStems();
    return qs.filter((q) => !seen.has(normalizeStem(q.question)));
  } catch { return []; }
}

export function saveQueue(qs: PracticeQuestion[]) {
  try { localStorage.setItem(queueKey(), JSON.stringify(qs.slice(-CACHE_CAP))); } catch { /* ignore */ }
}

// One in-flight request per focus key, shared between callers.
const inflight = new Map<string, Promise<PracticeQuestion[]>>();

export function fetchQuestions(
  count: number, focus = "", extraExclude: string[] = [], grammarOnly = false,
): Promise<PracticeQuestion[]> {
  // Grammar-only batches must not share an in-flight request with mixed batches.
  const key = `${grammarOnly ? "grammar:" : ""}${focus}`;
  const existing = inflight.get(key);
  if (existing) return existing;

  const p = (async () => {
    try {
      const history = getPracticeHistory().slice(-80).map((r) => r.q);
      const queued = loadQueue().map((q) => q.question.slice(0, 120));
      const exclude = [...history, ...queued, ...extraExclude].slice(-100);

      const res = await fetch(`${apiBase()}/api/practice/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count, exclude, focus: focus || undefined, grammarOnly: grammarOnly || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load questions");

      // Belt-and-braces dedupe: drop anything we've answered, queued, or shown.
      const known = new Set(exclude.map(normalizeStem));
      return (data.questions as PracticeQuestion[]).filter((q) => {
        const n = normalizeStem(q.question);
        if (known.has(n)) return false;
        known.add(n);
        return true;
      });
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, p);
  return p;
}

// Background fill of the general queue (no focus). Safe to call often.
export async function ensureQueue(min = 5): Promise<void> {
  if (typeof window === "undefined") return;
  if (loadQueue().length >= min) return;
  try {
    const fresh = await fetchQuestions(5);
    if (fresh.length) saveQueue([...loadQueue(), ...fresh]);
  } catch { /* silent — this is opportunistic */ }
}
