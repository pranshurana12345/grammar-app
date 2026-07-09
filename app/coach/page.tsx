"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SECTIONS } from "@/data/rules";
import AskAISheet from "@/components/AskAISheet";
import {
  apiBase, getPracticeHistory, practiceStats, sectionReadiness,
  type SectionReadiness,
} from "@/lib/practice";

type Analysis = {
  headline: string;
  weakAreas: { area: string; note: string; tip: string }[];
  strengths: string[];
  plan: string[];
};

const EXTRA_TOPICS = [
  { name: "Vocabulary", color: "#0d9488" },
  { name: "Idioms & Phrases", color: "#d97706" },
];

export default function CoachPage() {
  const [mounted, setMounted] = useState(false);
  const [readiness, setReadiness] = useState<SectionReadiness>({});
  const [stats, setStats] = useState({ total: 0, recent: 0, recentCorrect: 0, recentPct: 0 });
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReadiness(sectionReadiness(7));
    setStats(practiceStats(7));
  }, []);

  async function analyze() {
    setAnalyzing(true);
    setError("");
    try {
      const res = await fetch(`${apiBase()}/api/practice/analyze/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: getPracticeHistory().slice(-300) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  const topics = [...SECTIONS, ...EXTRA_TOPICS];
  const withData = topics.filter((t) => readiness[t.name]?.attempts);
  const weakFocus = withData
    .filter((t) => readiness[t.name].attempts >= 3 && readiness[t.name].pct < 60)
    .map((t) => t.name)
    .slice(0, 4);
  const hasHistory = mounted && stats.total > 0;

  return (
    <div className="min-h-screen pb-28 lg:pb-10" style={{ background: "#f0f4ff" }}>

      {/* ── Header ── */}
      <div className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#2d7ff9 55%,#7c3aed 100%)", borderRadius: "0 0 24px 24px" }}>
        <div className="absolute top-0 right-0 w-44 h-44 rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(30%,-35%)" }} />
        <div className="relative px-5 lg:px-10 pt-9 lg:pt-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.18)" }}>
              ✨
            </div>
            <div>
              <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.18em] mb-0.5">Your Personal Tutor</p>
              <h1 className="text-[24px] lg:text-3xl font-black text-white leading-none tracking-tight">AI Coach</h1>
            </div>
          </div>

          {/* 7-day stats */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: "Total answered", value: mounted ? stats.total : "–" },
              { label: "This week", value: mounted ? stats.recent : "–" },
              { label: "7-day accuracy", value: mounted && stats.recent > 0 ? `${stats.recentPct}%` : "–" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl px-3 py-2.5 text-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                <div className="text-xl font-black text-white">{s.value}</div>
                <div className="text-[9.5px] text-blue-200 font-semibold mt-0.5 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-10 pt-5 space-y-5 max-w-2xl">

        {/* ── CTAs ── */}
        <div className="space-y-2.5">
          <Link href="/reels?tab=practice" className="block press lg:pointer-events-none">
            <div className="rounded-3xl p-5 flex items-center justify-between overflow-hidden relative"
              style={{ background: "linear-gradient(135deg,#2d7ff9,#7c3aed)", boxShadow: "0 8px 32px -4px rgba(37,99,235,0.4)" }}>
              <div className="absolute right-0 top-0 w-32 h-32 rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(30%,-30%)" }} />
              <div className="relative">
                <p className="text-[11px] font-bold text-blue-200 uppercase tracking-widest mb-0.5">AFCAT-style MCQs</p>
                <p className="text-xl font-black text-white">Practice with AI →</p>
                <p className="text-blue-100 text-[11.5px] mt-1 lg:block hidden">Open on your phone — it&apos;s a reel experience.</p>
              </div>
              <div className="relative w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0"><span className="text-2xl">🧠</span></div>
            </div>
          </Link>

          {/* Ask anything — full rulebook + AFCAT + app knowledge */}
          <button onClick={() => setChatOpen(true)} className="w-full press text-left">
            <div className="rounded-3xl p-4 flex items-center gap-3 bg-white" style={{ boxShadow: "0 2px 8px -2px rgba(15,23,42,0.06)", border: "1.5px solid #e0e7ff" }}>
              <span className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#2d7ff9,#7c3aed)" }}>💬</span>
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-800 text-sm">Ask me anything</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Any rule, any doubt, AFCAT pattern, strategy…</p>
              </div>
              <span className="text-slate-300 text-lg flex-shrink-0">›</span>
            </div>
          </button>

          {weakFocus.length > 0 && (
            <Link href={`/reels?tab=practice&focus=${encodeURIComponent(weakFocus.join(", "))}`} className="block press">
              <div className="rounded-3xl p-4 flex items-center justify-between"
                style={{ background: "linear-gradient(135deg,#fff1f2,#ffe4e6)", border: "1.5px solid #fecdd3" }}>
                <div>
                  <p className="font-black text-rose-900 text-sm">🎯 Train my weak areas</p>
                  <p className="text-rose-600 text-[11px] mt-0.5 truncate">{weakFocus.join(" · ")}</p>
                </div>
                <span className="text-rose-400 text-lg flex-shrink-0 ml-2">→</span>
              </div>
            </Link>
          )}
        </div>

        {/* ── Topic readiness ── */}
        <div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Topic readiness · last 7 days
          </p>
          {!hasHistory ? (
            <div className="bg-white rounded-3xl p-6 text-center" style={{ boxShadow: "0 2px 8px -2px rgba(15,23,42,0.06)" }}>
              <div className="text-4xl mb-2">🌱</div>
              <p className="font-black text-slate-700 text-sm mb-1">No practice yet</p>
              <p className="text-slate-400 text-[12px] leading-relaxed">
                Answer AI questions in the Reels tab and I&apos;ll track how ready you are in every topic.
              </p>
            </div>
          ) : withData.length === 0 ? (
            <div className="bg-white rounded-3xl p-5 text-center" style={{ boxShadow: "0 2px 8px -2px rgba(15,23,42,0.06)" }}>
              <p className="text-slate-400 text-[12.5px]">Nothing in the last 7 days — practice a bit and check back!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {withData
                .sort((a, b) => (readiness[a.name].pct - readiness[b.name].pct))
                .map((t) => {
                  const r = readiness[t.name];
                  const low = r.attempts >= 3 && r.pct < 60;
                  return (
                    <div key={t.name} className="bg-white rounded-3xl px-4 py-3.5" style={{ boxShadow: "0 2px 8px -2px rgba(15,23,42,0.06)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-slate-800 text-[13px] truncate">{t.name}</p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10.5px] font-semibold text-slate-400">{r.correct}/{r.attempts}</span>
                          <span className="text-[12px] font-black" style={{ color: low ? "#e11d48" : t.color }}>{r.pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: low ? "#f43f5e" : t.color, transition: "width 0.8s ease" }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* ── AI analysis ── */}
        <div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">AI analysis</p>

          {!analysis && (
            <button onClick={() => void analyze()} disabled={analyzing || !hasHistory || stats.total < 5}
              className="w-full press rounded-3xl p-4 flex items-center justify-center gap-2.5 text-white font-black text-[14px] disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#0f172a,#334155)", boxShadow: "0 6px 24px -6px rgba(15,23,42,0.5)" }}>
              {analyzing ? (
                <>
                  <span className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </span>
                  Analyzing your mistakes…
                </>
              ) : (
                <>✨ Analyze my mistakes</>
              )}
            </button>
          )}
          {!analysis && hasHistory && stats.total < 5 && (
            <p className="text-center text-[11.5px] text-slate-400 mt-2">Answer at least 5 questions to unlock analysis.</p>
          )}
          {error && <p className="text-center text-[12px] font-semibold text-rose-500 mt-2">{error}</p>}

          {analysis && (
            <div className="space-y-3">
              {/* headline */}
              <div className="rounded-3xl p-4" style={{ background: "linear-gradient(135deg,#eff6ff,#e0e7ff)", border: "1.5px solid #c7d2fe" }}>
                <p className="text-indigo-900 text-[13.5px] font-bold leading-relaxed">💬 {analysis.headline}</p>
              </div>

              {/* weak areas */}
              {analysis.weakAreas.length > 0 && (
                <div className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 2px 8px -2px rgba(15,23,42,0.06)" }}>
                  <p className="text-[11px] font-black text-rose-500 uppercase tracking-widest mb-3">⚠️ Working on</p>
                  <div className="space-y-3">
                    {analysis.weakAreas.map((w, i) => (
                      <div key={i} className="rounded-2xl p-3" style={{ background: "#fff1f2", border: "1px solid #fecdd3" }}>
                        <p className="font-black text-rose-900 text-[13px] mb-1">{w.area}</p>
                        <p className="text-rose-800/80 text-[12px] leading-relaxed mb-1.5">{w.note}</p>
                        <p className="text-[12px] leading-relaxed text-rose-700"><span className="font-black">Tip:</span> {w.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* strengths */}
              {analysis.strengths.length > 0 && (
                <div className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 2px 8px -2px rgba(15,23,42,0.06)" }}>
                  <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest mb-2.5">💪 Strengths</p>
                  <div className="space-y-1.5">
                    {analysis.strengths.map((s, i) => (
                      <p key={i} className="text-slate-700 text-[12.5px] leading-relaxed">✅ {s}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* plan */}
              {analysis.plan.length > 0 && (
                <div className="bg-white rounded-3xl p-4" style={{ boxShadow: "0 2px 8px -2px rgba(15,23,42,0.06)" }}>
                  <p className="text-[11px] font-black text-blue-500 uppercase tracking-widest mb-2.5">🗓️ Your plan</p>
                  <div className="space-y-2">
                    {analysis.plan.map((p, i) => (
                      <div key={i} className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 mt-0.5" style={{ background: "#2d7ff9" }}>{i + 1}</span>
                        <p className="text-slate-700 text-[12.5px] leading-relaxed">{p}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => { setAnalysis(null); }} className="w-full text-center text-[12px] font-bold text-slate-400 py-1 press">
                Re-analyze ↻
              </button>
            </div>
          )}
        </div>
      </div>

      <AskAISheet
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        title="Grammy AI Coach"
        context={`The student opened the general chat from the AI Coach page. They may ask about any grammar rule, vocabulary, the AFCAT exam, study strategy, or the app. Their recent practice: ${stats.recent} questions in the last 7 days at ${stats.recentPct}% accuracy (${stats.total} all-time).`}
      />
    </div>
  );
}
