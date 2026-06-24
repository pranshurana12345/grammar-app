"use client";

import { useEffect, useState } from "react";
import { rules } from "@/data/rules";
import { getProgress, setRuleStatus, RuleStatus } from "@/lib/storage";
import RuleCard from "@/components/RuleCard";
import Link from "next/link";

export default function RevisePage() {
  const [progress, setProgress] = useState<Record<number, RuleStatus>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const reviseRules = rules.filter((r) => progress[r.id] === "revise");

  const handleStatus = (id: number, status: RuleStatus) => {
    setRuleStatus(id, status);
    setProgress((prev) => ({ ...prev, [id]: status }));
  };

  if (reviseRules.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8 text-center pb-24" style={{ background: "#f0f4ff" }}>
        <div className="w-20 h-20 rounded-3xl bg-emerald-100 flex items-center justify-center text-4xl mb-2">🎉</div>
        <h2 className="text-2xl font-black text-slate-800">Nothing to revise!</h2>
        <p className="text-slate-500">All caught up. Keep learning more rules.</p>
        <Link href="/feed">
          <div className="mt-4 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black press"
            style={{ boxShadow: "0 4px 16px rgba(37,99,235,0.3)" }}>
            Continue Learning →
          </div>
        </Link>
      </div>
    );
  }

  const safeIndex = Math.min(currentIndex, reviseRules.length - 1);
  const rule = reviseRules[safeIndex];
  const status = progress[rule.id] ?? "revise";

  return (
    <div className="fixed inset-0 page-fixed flex flex-col" style={{ background: "#fefce8", paddingBottom: "64px" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100"
        style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
        <Link href="/" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm press">←</Link>
        <div className="text-center">
          <p className="text-sm font-black text-amber-600">🔄 Revision Mode</p>
          <p className="text-[10px] text-slate-400 font-semibold">{safeIndex + 1} of {reviseRules.length} rules</p>
        </div>
        <div className="w-8" />
      </div>

      <div className="flex-1 overflow-hidden">
        <RuleCard
          rule={rule}
          status={status}
          onMarkSeen={() => {
            handleStatus(rule.id, "seen");
            setCurrentIndex((i) => Math.min(i, reviseRules.length - 2));
          }}
          onRevise={() => {
            setCurrentIndex((i) => (i + 1) % reviseRules.length);
          }}
        />
      </div>

      <div className="absolute bottom-20 right-4 flex flex-col gap-2 z-20">
        <button onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={safeIndex === 0}
          className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-slate-500 disabled:opacity-25 press"
          style={{ boxShadow: "0 4px 12px rgba(15,23,42,0.1)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 11L8 6L13 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <button onClick={() => setCurrentIndex((i) => Math.min(reviseRules.length - 1, i + 1))} disabled={safeIndex >= reviseRules.length - 1}
          className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-slate-500 disabled:opacity-25 press"
          style={{ boxShadow: "0 4px 12px rgba(15,23,42,0.1)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 5L8 10L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  );
}
