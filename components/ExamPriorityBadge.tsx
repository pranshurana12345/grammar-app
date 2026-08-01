"use client";

import { useState } from "react";
import { examPriorityFor, TIER_META } from "@/data/examPriority";

const PAPER_LABEL: Record<string, string> = {
  M1: "Model Paper 1",
  M2: "Model Paper 2",
  ACTUAL: "AFCAT 01 2026 — real paper",
};

/** Small chip for the rule header — tier only, no detail. */
export function ExamTierChip({ ruleId }: { ruleId: number }) {
  const p = examPriorityFor(ruleId);
  if (!p) return null;
  const m = TIER_META[p.tier];
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded border whitespace-nowrap"
      style={{ background: m.bg, borderColor: m.border, color: m.fg }}
    >
      {m.icon} {m.short}
    </span>
  );
}

/**
 * The full panel that sits under the rule. Shows WHY this rule is rated the
 * way it is — and for confirmed rules, the exact fragment from the paper.
 * Deliberately shows the family reasoning too, because with only three papers
 * the type is more trustworthy than any single rule's hit count.
 */
export default function ExamPriorityBadge({ ruleId }: { ruleId: number }) {
  const [open, setOpen] = useState(false);
  const p = examPriorityFor(ruleId);
  if (!p) return null;

  const m = TIER_META[p.tier];
  const { family, evidence } = p;
  const familyEv = family.familyEvidence ?? [];
  const hasDetail = evidence.length > 0 || familyEv.length > 0;

  return (
    <div
      className="mt-3 rounded-xl px-3.5 py-3"
      style={{ background: m.bg, border: `1px solid ${m.border}` }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left press"
        aria-expanded={open}
      >
        <p
          className="text-[9.5px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1"
          style={{ color: m.fg }}
        >
          <span className="text-[11px]">{m.icon}</span> {m.label}
          <span className="ml-auto text-[9px] font-bold opacity-60">
            {open ? "HIDE" : "WHY?"}
          </span>
        </p>
        <p className="text-[12px] font-semibold leading-snug" style={{ color: m.fg }}>
          {family.label}
        </p>
      </button>

      {open && (
        <div className="mt-2.5 space-y-2.5">
          <p className="text-[12px] leading-relaxed text-slate-700">
            {family.whatGetsAsked}
          </p>

          {evidence.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[9.5px] font-black uppercase tracking-widest text-slate-500">
                Asked as
              </p>
              {evidence.map((e, i) => (
                <div
                  key={i}
                  className="rounded-lg px-3 py-2 bg-white/70"
                  style={{ border: `1px solid ${m.border}` }}
                >
                  <p className="text-[10px] font-bold text-slate-500 mb-1">
                    {PAPER_LABEL[e.paper]} · {e.q}
                  </p>
                  <p className="text-[12px] font-medium text-slate-800 font-mono-ex leading-snug">
                    “{e.fragment}”
                  </p>
                  <p className="text-[11.5px] mt-1 font-semibold" style={{ color: m.fg }}>
                    → {e.fix}
                  </p>
                </div>
              ))}
            </div>
          )}

          {evidence.length === 0 && familyEv.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[9.5px] font-black uppercase tracking-widest text-slate-500">
                This family was asked as
              </p>
              {familyEv.slice(0, 3).map((e, i) => (
                <div
                  key={i}
                  className="rounded-lg px-3 py-2 bg-white/70"
                  style={{ border: `1px solid ${m.border}` }}
                >
                  <p className="text-[10px] font-bold text-slate-500 mb-1">
                    {PAPER_LABEL[e.paper]} · {e.q}
                  </p>
                  <p className="text-[12px] font-medium text-slate-800 font-mono-ex leading-snug">
                    “{e.fragment}”
                  </p>
                  <p className="text-[11.5px] mt-1 font-semibold" style={{ color: m.fg }}>
                    → {e.fix}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!hasDetail && (
            <p className="text-[11.5px] leading-relaxed text-slate-600 italic">
              No question in the three papers tested this rule. That is thin
              evidence, not proof — only ~23 of the 90 questions test a discrete
              rule, so most rules show zero by arithmetic alone. Learn it last,
              not never.
            </p>
          )}

          <p className="text-[10.5px] leading-relaxed text-slate-500 pt-1 border-t border-slate-200/70">
            Based on 90 English questions: EdCIL Model Papers 1 &amp; 2 and the
            real AFCAT 01 2026 paper.
          </p>
        </div>
      )}
    </div>
  );
}
