// Build-time guard for the static quiz bank.
//
// Runs in `prebuild` (see package.json), so `next build` — and therefore every
// Vercel deploy — FAILS if any question in data/questions.ts has a broken answer
// key: wrong option count, an out-of-range/duplicate answer index, a duplicate or
// empty option, leaked ✓/❌ "working note" markup, or an unknown ruleId.
//
// This is why a wrong answer key can no longer ship silently: the same defect that
// marked a correct answer wrong in the practice reel now stops the build instead.
//
// Node (24+) imports these .ts modules directly by stripping the types; keep the
// imported files free of non-erasable TS syntax so this stays true.

import { QUIZ_BANK } from "../data/questions.ts";
import { rules } from "../data/rules.ts";
import { questionProblems } from "../lib/questionCheck.ts";

const ruleIds = new Set(rules.map((r) => r.id));
let failures = 0;

for (const entry of QUIZ_BANK) {
  if (!ruleIds.has(entry.ruleId)) {
    console.error(`✗ ruleId ${entry.ruleId}: no matching rule in data/rules.ts`);
    failures++;
  }
  entry.questions.forEach((q, i) => {
    const problems = questionProblems(q);
    if (problems.length) {
      failures++;
      console.error(`✗ rule ${entry.ruleId} q${i}: ${q.q}`);
      for (const p of problems) console.error(`      • ${p}`);
    }
  });
}

const total = QUIZ_BANK.reduce((n, e) => n + e.questions.length, 0);

if (failures) {
  console.error(`\n✗ QUIZ_BANK validation FAILED — ${failures} problem(s) across ${total} questions.`);
  console.error(`  Fix data/questions.ts (or data/rules.ts) and rebuild.\n`);
  process.exit(1);
}

console.log(`✓ QUIZ_BANK: ${total} questions across ${QUIZ_BANK.length} rules — all answer keys valid.`);
