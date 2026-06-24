"use client";

import Link from "next/link";
import { Rule } from "@/data/rules";
import { RuleStatus } from "@/lib/storage";
import { RuleVisual, VisualType } from "@/components/visuals/RuleVisual";
import { detectConcepts } from "@/data/concepts";
import { useState, useEffect } from "react";

type Props = {
  rule: Rule;
  status: RuleStatus;
  onMarkSeen: () => void;
  onRevise: () => void;
};

export default function RuleCard({ rule, status, onMarkSeen, onRevise }: Props) {
  const c = rule.sectionColor;
  const [langMode, setLangMode] = useState<"closed" | "hindi" | "hinglish">("closed");

  useEffect(() => { setLangMode("closed"); }, [rule.id]);

  const hasLang = !!(rule.hindiTip || rule.hinglishTip);
  const chips = detectConcepts(rule.title, rule.rule, rule.extras?.join(" ")).slice(0, 5);

  return (
    <div className="relative w-full h-full flex flex-col bg-white overflow-hidden">

      {/* ── Top accent ── */}
      <div className="h-[5px] w-full flex-shrink-0" style={{ background: c }} />

      {/* ── Header ── */}
      <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: c }} />
            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: c }}>
              {rule.section}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {rule.star && (
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                ⭐ PRIORITY
              </span>
            )}
            <span className="text-[11px] font-bold text-slate-400">{rule.ruleNumber}</span>
          </div>
        </div>
        <h2 className="text-[24px] font-black text-slate-900 leading-tight" style={{ letterSpacing: "-0.03em" }}>
          {rule.title}
        </h2>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 scroll-area pb-36">

        {/* Rule statement — the hero */}
        <div className="mx-5 mt-5 mb-6 rounded-2xl overflow-hidden"
          style={{ border: `1.5px solid ${c}30` }}>
          <div className="px-4 py-2 flex items-center gap-2"
            style={{ background: c }}>
            <span className="text-white text-xs font-black uppercase tracking-wider">The Rule</span>
          </div>
          <div className="px-5 py-4" style={{ background: `${c}08` }}>
            <p className="text-[16px] font-semibold text-slate-800 leading-relaxed">{rule.rule}</p>
          </div>
        </div>

        {/* Concept chips */}
        {chips.length > 0 && (
          <div className="px-5 mb-5 flex flex-wrap gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest self-center">Concepts:</span>
            {chips.map((chip) => (
              <Link key={chip.slug} href={`/concept/${chip.slug}`}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold press"
                style={{ background: `${chip.color}12`, color: chip.color, border: `1.5px solid ${chip.color}25` }}>
                <span>{chip.emoji}</span>
                <span>{chip.title}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Visual Diagram */}
        {rule.visual && (
          <div className="mx-5 mb-6 rounded-2xl overflow-hidden p-4"
            style={{ background: `${c}06`, border: `1.5px solid ${c}20` }}>
            <RuleVisual type={rule.visual as VisualType} color={c} />
          </div>
        )}

        {/* Table */}
        {rule.table && !rule.visual && (
          <div className="mx-5 mb-6 rounded-2xl overflow-hidden"
            style={{ border: `1.5px solid ${c}25` }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: c }}>
                  {rule.table.headers.map((h) => (
                    <th key={h} className="text-white font-bold px-4 py-3 text-left text-[12px] tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rule.table.rows.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 !== 0 ? `${c}06` : "white" }}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-slate-700 text-[13px] border-t" style={{ borderColor: `${c}15` }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Correct Examples */}
        {rule.correct.length > 0 && (
          <div className="px-5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-black">✓</span>
              </div>
              <span className="text-[12px] font-black text-emerald-700 uppercase tracking-wider">Correct Usage</span>
            </div>
            <div className="space-y-2">
              {rule.correct.map((ex, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3.5"
                  style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0" }}>
                  <span className="text-emerald-500 flex-shrink-0 font-black text-base leading-none mt-0.5">✓</span>
                  <p className="text-[14px] text-slate-800 font-medium leading-snug font-mono-ex">{ex}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wrong Examples */}
        {rule.wrong && rule.wrong.length > 0 && (
          <div className="px-5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-black">✕</span>
              </div>
              <span className="text-[12px] font-black text-rose-600 uppercase tracking-wider">Incorrect — Avoid These</span>
            </div>
            <div className="space-y-2">
              {rule.wrong.map((ex, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3.5"
                  style={{ background: "#fff1f2", border: "1.5px solid #fecdd3" }}>
                  <span className="text-rose-500 flex-shrink-0 font-black text-base leading-none mt-0.5">✕</span>
                  <p className="text-[14px] text-slate-500 font-medium leading-snug font-mono-ex line-through decoration-rose-400 decoration-2">{ex}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extras / Also Note */}
        {rule.extras && rule.extras.length > 0 && (
          <div className="px-5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-black">!</span>
              </div>
              <span className="text-[12px] font-black text-blue-600 uppercase tracking-wider">Also Note</span>
            </div>
            <div className="space-y-2">
              {rule.extras.map((ex, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3.5"
                  style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe" }}>
                  <span className="text-blue-400 flex-shrink-0 font-bold text-sm leading-none mt-0.5">→</span>
                  <p className="text-[14px] text-slate-700 font-medium leading-snug">{ex}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Language Tips — collapsed by default */}
        {hasLang && (
          <div className="px-5 mb-5">
            <button onClick={() => setLangMode(langMode === "closed" ? "hindi" : "closed")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
              style={{
                background: langMode !== "closed" ? "#fff7ed" : "#fafaf9",
                border: "1.5px solid #fed7aa",
              }}>
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🌐</span>
                <div className="text-left">
                  <p className="text-[12px] font-black text-orange-700">Language Tips</p>
                  <p className="text-[10px] text-orange-400 font-medium">
                    {[rule.hindiTip && "हिंदी", rule.hinglishTip && "Hinglish"].filter(Boolean).join(" + ")}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-orange-500 bg-orange-100 px-2.5 py-1 rounded-lg">
                {langMode !== "closed" ? "Hide ▲" : "Show ▼"}
              </span>
            </button>

            {langMode !== "closed" && (
              <div className="mt-2 rounded-xl overflow-hidden" style={{ border: "1.5px solid #fed7aa" }}>
                {rule.hindiTip && rule.hinglishTip && (
                  <div className="flex border-b border-orange-100">
                    <button onClick={() => setLangMode("hindi")}
                      className={`flex-1 py-2.5 text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all ${langMode === "hindi" ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-600"}`}>
                      🇮🇳 हिंदी
                    </button>
                    <button onClick={() => setLangMode("hinglish")}
                      className={`flex-1 py-2.5 text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all border-l border-orange-100 ${langMode === "hinglish" ? "bg-orange-400 text-white" : "bg-orange-50 text-orange-500"}`}>
                      🗣 Hinglish
                    </button>
                  </div>
                )}
                {(langMode === "hindi" || !rule.hinglishTip) && rule.hindiTip && (
                  <div className="px-5 py-4 bg-orange-50">
                    <p className="text-[14px] text-orange-900 leading-relaxed font-medium">{rule.hindiTip}</p>
                  </div>
                )}
                {(langMode === "hinglish" || !rule.hindiTip) && rule.hinglishTip && (
                  <div className="px-5 py-4 bg-amber-50">
                    <p className="text-[14px] text-amber-900 leading-relaxed font-medium">{rule.hinglishTip}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── Action Bar ── */}
      <div className="absolute bottom-0 left-0 right-0 flex-shrink-0 safe-bottom"
        style={{ background: "linear-gradient(to top, white 75%, transparent)" }}>
        <div className="px-5 pb-4 pt-6">

          {/* Status strip */}
          {status !== "unseen" && (
            <div className={`text-center text-[11px] font-bold mb-3 py-1.5 rounded-lg ${
              status === "confident" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
              status === "seen" ? "bg-sky-50 text-sky-700 border border-sky-200" :
              "bg-amber-50 text-amber-700 border border-amber-200"
            }`}>
              {status === "confident" ? "⭐ Confident — quiz passed" :
               status === "seen" ? "👁 Marked as Read" :
               "🔄 Flagged for Revision"}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2.5">
            <button onClick={onRevise}
              className={`flex-1 py-3 rounded-xl font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all press border-2 ${
                status === "revise"
                  ? "bg-amber-400 border-amber-400 text-white"
                  : "bg-white border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600"
              }`}>
              🔄 <span>Revise</span>
            </button>

            {status === "confident" ? (
              <div className="flex-[2] py-3 rounded-xl font-bold text-[12px] text-center bg-emerald-50 text-emerald-700 border-2 border-emerald-200 flex items-center justify-center gap-1.5">
                ⭐ Confident
              </div>
            ) : (
              <button onClick={onMarkSeen}
                className="flex-[2] py-3 rounded-xl font-bold text-[13px] text-white press flex items-center justify-center gap-1.5"
                style={{
                  background: status === "seen" ? "#0ea5e9" : c,
                  boxShadow: `0 4px 16px ${status === "seen" ? "#0ea5e930" : c + "40"}`,
                }}>
                {status === "seen" ? "✓ Read" : "Mark as Read"}
              </button>
            )}

            <Link href={`/quiz/${rule.id}`}
              className="flex-1 py-3 rounded-xl font-bold text-[12px] text-white press flex items-center justify-center gap-1"
              style={{
                background: status === "confident" ? "#16a34a" : "#6366f1",
                boxShadow: "0 4px 12px rgba(99,102,241,0.25)",
              }}>
              {status === "confident" ? "🏆" : "📝"}
              <span>{status === "confident" ? "Retake" : "Quiz"}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
