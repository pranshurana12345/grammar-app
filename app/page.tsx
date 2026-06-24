"use client";

import { useEffect, useState } from "react";
import { rules, SECTIONS } from "@/data/rules";
import { getStats, getProgress, RuleStatus } from "@/lib/storage";
import Link from "next/link";

export default function Home() {
  const [stats, setStats] = useState({ confident: 0, seen: 0, revise: 0, unseen: rules.length, total: rules.length });
  const [progress, setProgress] = useState<Record<number, RuleStatus>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(getStats(rules.length));
    setProgress(getProgress());
  }, []);

  const pct = Math.round((stats.confident / stats.total) * 100);
  const circumference = 2 * Math.PI * 38;

  return (
    <>
      {/* ════════════════════════════════════
          MOBILE layout (< md)
      ════════════════════════════════════ */}
      <div className="md:hidden min-h-screen pb-6" style={{ background: "#f0f4ff" }}>
        {/* Hero */}
        <div className="relative overflow-hidden" style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)",
          borderRadius: "0 0 36px 36px",
        }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(30%,-30%)" }} />
          <div className="relative px-5 pt-14 pb-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
                  <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">AFCAT English Prep</span>
                </div>
                <h1 className="text-3xl font-black text-white leading-none" style={{ letterSpacing: "-0.04em" }}>Grammar<br /><span className="text-blue-300">Feed</span></h1>
              </div>
              {mounted && (
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
                    <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
                    <circle cx="44" cy="44" r="38" fill="none" stroke="white" strokeWidth="7"
                      strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct / 100)}
                      strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white leading-none">{pct}%</span>
                    <span className="text-[9px] text-blue-200 font-bold mt-0.5">DONE</span>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Confident", value: stats.confident, color: "#4ade80" },
                { label: "To Revise", value: stats.revise, color: "#fbbf24" },
                { label: "Remaining", value: stats.unseen, color: "rgba(255,255,255,0.4)" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl px-3 py-2.5 text-center" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="text-xl font-black" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[10px] text-blue-200 font-semibold mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 mt-5 space-y-3">
          <Link href="/feed" className="block press">
            <div className="rounded-3xl p-5 flex items-center justify-between overflow-hidden relative"
              style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)", boxShadow: "0 8px 32px -4px rgba(37,99,235,0.4)" }}>
              <div className="absolute right-0 top-0 w-32 h-32 rounded-full opacity-20" style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(30%,-30%)" }} />
              <div className="relative">
                <p className="text-[11px] font-bold text-blue-200 uppercase tracking-widest mb-0.5">Continue learning</p>
                <p className="text-xl font-black text-white">{stats.confident === 0 ? "Start Learning →" : `Rule ${Math.min(stats.confident + 1, rules.length)} →`}</p>
              </div>
              <div className="relative w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0"><span className="text-2xl">📖</span></div>
            </div>
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/starred" className="press block">
              <div className="rounded-3xl p-4" style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)", border: "1.5px solid #fcd34d" }}>
                <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center mb-3"><span className="text-lg">⭐</span></div>
                <p className="font-black text-amber-900 text-sm">High Priority</p>
                <p className="text-amber-700 text-[11px] mt-0.5">Most asked rules</p>
              </div>
            </Link>
            <Link href="/revise" className="press block">
              <div className="rounded-3xl p-4" style={{ background: stats.revise > 0 ? "linear-gradient(135deg,#fef9c3,#fef08a)" : "linear-gradient(135deg,#f8fafc,#f1f5f9)", border: stats.revise > 0 ? "1.5px solid #fde047" : "1.5px solid #e2e8f0" }}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${stats.revise > 0 ? "bg-yellow-500" : "bg-slate-200"}`}><span className="text-lg">🔄</span></div>
                <p className={`font-black text-sm ${stats.revise > 0 ? "text-yellow-900" : "text-slate-400"}`}>Revision</p>
                <p className={`text-[11px] mt-0.5 ${stats.revise > 0 ? "text-yellow-700" : "text-slate-400"}`}>{stats.revise > 0 ? `${stats.revise} rules waiting` : "Nothing yet"}</p>
              </div>
            </Link>
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 mt-2">Topics</p>
            <div className="space-y-2">
              {SECTIONS.map((sec) => {
                const sr = rules.filter((r) => r.section === sec.name);
                const done = sr.filter((r) => progress[r.id] === "confident").length;
                const p = sr.length > 0 ? (done / sr.length) * 100 : 0;
                return (
                  <Link key={sec.name} href={`/sections/${encodeURIComponent(sec.name)}`} className="press block">
                    <div className="bg-white rounded-3xl px-4 py-3.5 flex items-center gap-4" style={{ boxShadow: "0 2px 8px -2px rgba(15,23,42,0.06)" }}>
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${sec.color}18`, border: `1.5px solid ${sec.color}30` }}>
                        <span className="text-[11px] font-black" style={{ color: sec.color }}>{done}/{sr.length}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-[13px] truncate">{sec.name}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${p}%`, background: sec.color }} />
                          </div>
                          <span className="text-[10px] font-bold" style={{ color: sec.color }}>{Math.round(p)}%</span>
                        </div>
                      </div>
                      <span className="text-slate-200 text-lg">›</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════
          DESKTOP layout (≥ md)
      ════════════════════════════════════ */}
      <div className="hidden md:block min-h-screen p-8" style={{ background: "#f0f4ff" }}>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900" style={{ letterSpacing: "-0.04em" }}>Dashboard</h1>
          <p className="text-slate-400 mt-1">Track your progress across all 100 grammar rules.</p>
        </div>

        {/* Stat cards row */}
        {mounted && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Confident", value: stats.confident, sub: `of ${stats.total}`, color: "#10b981", bg: "#d1fae5", icon: "⭐" },
              { label: "To Revise", value: stats.revise, sub: "flagged", color: "#f59e0b", bg: "#fef3c7", icon: "🔄" },
              { label: "Not Seen Yet", value: stats.unseen, sub: "remaining", color: "#6366f1", bg: "#ede9fe", icon: "○" },
              { label: "Progress", value: `${pct}%`, sub: "overall", color: "#2563eb", bg: "#dbeafe", icon: "↗" },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-3xl p-6" style={{ boxShadow: "0 2px 12px -4px rgba(15,23,42,0.08)" }}>
                <div className="flex items-start justify-between mb-4">
                  <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg font-bold" style={{ background: card.bg, color: card.color }}>
                    {card.icon}
                  </div>
                </div>
                <p className="text-4xl font-black text-slate-900" style={{ letterSpacing: "-0.04em" }}>{card.value}</p>
                <p className="text-xs text-slate-400 font-semibold mt-1">{card.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Main 2-col grid */}
        <div className="grid grid-cols-3 gap-6">

          {/* Section progress table */}
          <div className="col-span-2 bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 2px 12px -4px rgba(15,23,42,0.08)" }}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-black text-slate-800 text-lg">Section Progress</h2>
              <Link href="/feed">
                <button className="text-sm font-bold text-blue-600 hover:text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">
                  Continue Learning →
                </button>
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {SECTIONS.map((sec) => {
                const sr = rules.filter((r) => r.section === sec.name);
                const done = sr.filter((r) => progress[r.id] === "confident").length;
                const revising = sr.filter((r) => progress[r.id] === "revise").length;
                const p = sr.length > 0 ? (done / sr.length) * 100 : 0;
                return (
                  <Link key={sec.name} href={`/sections/${encodeURIComponent(sec.name)}`}>
                    <div className="px-6 py-4 flex items-center gap-5 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: sec.color }} />
                      <div className="w-44 flex-shrink-0">
                        <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{sec.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{sr.length} rules</p>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${p}%`, background: p === 100 ? "#10b981" : sec.color }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 w-32">
                        <span className="text-xs font-black" style={{ color: p === 100 ? "#10b981" : sec.color }}>{Math.round(p)}%</span>
                        <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">{done} ✓</span>
                        {revising > 0 && <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-semibold">{revising} 🔄</span>}
                      </div>
                      <span className="text-slate-200 group-hover:text-slate-400 transition-colors">›</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="col-span-1 space-y-4">
            {/* Continue card */}
            <Link href="/feed">
              <div className="rounded-3xl p-6 cursor-pointer press overflow-hidden relative"
                style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb)", boxShadow: "0 8px 32px -4px rgba(37,99,235,0.4)" }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(30%,-30%)" }} />
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2 relative">Next Up</p>
                <p className="text-white font-black text-2xl mb-1 relative" style={{ letterSpacing: "-0.03em" }}>
                  {stats.confident === 0 ? "Get Started" : `Rule ${Math.min(stats.confident + 1, rules.length)}`}
                </p>
                <p className="text-blue-200 text-sm relative">
                  {stats.confident === 0
                    ? "Start your AFCAT prep"
                    : rules[Math.min(stats.confident, rules.length - 1)]?.title}
                </p>
                <div className="mt-4 relative inline-flex items-center gap-2 bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-xl">
                  Open Feed <span>→</span>
                </div>
              </div>
            </Link>

            {/* Priority rules */}
            <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 2px 12px -4px rgba(15,23,42,0.08)" }}>
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-800">⭐ High Priority</h3>
                <Link href="/starred"><span className="text-xs font-bold text-blue-500 hover:underline">View all</span></Link>
              </div>
              <div className="divide-y divide-slate-50">
                {rules.filter(r => r.star).slice(0, 8).map((r) => (
                  <Link key={r.id} href={`/feed`}>
                    <div className="px-5 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 cursor-pointer">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: r.sectionColor }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{r.title}</p>
                        <p className="text-[10px] text-slate-400">{r.ruleNumber}</p>
                      </div>
                      {progress[r.id] === "confident" && <span className="text-emerald-500 text-xs">✓</span>}
                      {progress[r.id] === "revise" && <span className="text-amber-500 text-xs">🔄</span>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
