"use client";

import { useEffect, useState } from "react";
import { rules } from "@/data/rules";
import { getProgress, setRuleStatus, RuleStatus } from "@/lib/storage";
import RuleCard from "@/components/RuleCard";
import Link from "next/link";
import { use } from "react";

export default function SectionPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const sectionName = decodeURIComponent(name);
  const [progress, setProgress] = useState<Record<number, RuleStatus>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const sectionRules = rules.filter((r) => r.section === sectionName);
  const rule = sectionRules[currentIndex];
  const status = progress[rule?.id] ?? "unseen";
  const color = rule?.sectionColor ?? "#2563eb";
  const done = sectionRules.filter((r) => progress[r.id] === "confident").length;

  const handleStatus = (id: number, s: RuleStatus) => {
    setRuleStatus(id, s);
    setProgress((prev) => ({ ...prev, [id]: s }));
  };

  if (sectionRules.length === 0) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-500">Section not found.</p></div>;
  }

  return (
    <div className="fixed inset-0 page-fixed flex flex-col" style={{ background: `${color}08`, paddingBottom: "64px" }}>
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100"
        style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
        <Link href="/" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm press">←</Link>
        <div className="text-center flex-1 mx-3">
          <p className="text-sm font-black truncate" style={{ color }}>{sectionName}</p>
          <div className="flex items-center gap-2 justify-center mt-0.5">
            <div className="flex-1 max-w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(done / sectionRules.length) * 100}%`, background: color }} />
            </div>
            <span className="text-[10px] font-bold text-slate-400">{currentIndex + 1}/{sectionRules.length}</span>
          </div>
        </div>
        <Link href={`/test/${encodeURIComponent(sectionName)}`}
          className="px-3 py-1.5 rounded-xl text-[11px] font-black text-white press flex-shrink-0"
          style={{ background: color, boxShadow: `0 2px 8px ${color}40` }}>
          Take Test
        </Link>
      </div>

      <div className="flex-1 overflow-hidden">
        {rule && (
          <RuleCard
            rule={rule}
            status={status}
            onMarkSeen={() => {
              handleStatus(rule.id, "seen");
              setTimeout(() => setCurrentIndex((i) => Math.min(sectionRules.length - 1, i + 1)), 350);
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
        <button onClick={() => setCurrentIndex((i) => Math.min(sectionRules.length - 1, i + 1))} disabled={currentIndex >= sectionRules.length - 1}
          className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-slate-500 disabled:opacity-25 press"
          style={{ boxShadow: "0 4px 12px rgba(15,23,42,0.1)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 5L8 10L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  );
}
