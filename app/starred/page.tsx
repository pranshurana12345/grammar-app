"use client";

import { useEffect, useState } from "react";
import { getStarRules } from "@/data/rules";
import { getProgress, setRuleStatus, RuleStatus } from "@/lib/storage";
import RuleCard from "@/components/RuleCard";
import Link from "next/link";

export default function StarredPage() {
  const [progress, setProgress] = useState<Record<number, RuleStatus>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const starRules = getStarRules();
  const rule = starRules[currentIndex];
  const status = progress[rule?.id] ?? "unseen";

  const handleStatus = (id: number, s: RuleStatus) => {
    setRuleStatus(id, s);
    setProgress((prev) => ({ ...prev, [id]: s }));
  };

  return (
    <div className="fixed inset-0 page-fixed flex flex-col" style={{ background: "#fffbeb", paddingBottom: "64px" }}>
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100"
        style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
        <Link href="/" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm press">←</Link>
        <div className="text-center">
          <p className="text-sm font-black text-amber-600">⭐ High-Priority Rules</p>
          <p className="text-[10px] text-slate-400 font-semibold">{currentIndex + 1} of {starRules.length} — Most asked in AFCAT</p>
        </div>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-hidden">
        {rule && (
          <RuleCard
            rule={rule}
            status={status}
            onMarkSeen={() => {
              handleStatus(rule.id, "seen");
              setTimeout(() => setCurrentIndex((i) => Math.min(starRules.length - 1, i + 1)), 350);
            }}
            onRevise={() => handleStatus(rule.id, "revise")}
          />
        )}
      </div>

      <div className="absolute bottom-20 right-4 flex flex-col gap-2 z-20">
        <button onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0}
          className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-slate-500 disabled:opacity-25 press"
          style={{ boxShadow: "0 4px 12px rgba(15,23,42,0.1)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 11L8 6L13 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <button onClick={() => setCurrentIndex((i) => Math.min(starRules.length - 1, i + 1))} disabled={currentIndex >= starRules.length - 1}
          className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-slate-500 disabled:opacity-25 press"
          style={{ boxShadow: "0 4px 12px rgba(15,23,42,0.1)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 5L8 10L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  );
}
