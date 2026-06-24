"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { rules, Rule } from "@/data/rules";
import { getProgress, setRuleStatus, RuleStatus } from "@/lib/storage";
import RuleCard from "@/components/RuleCard";
import { RuleVisual, VisualType } from "@/components/visuals/RuleVisual";
import { detectConcepts } from "@/data/concepts";

export default function FeedPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<Record<number, RuleStatus>>({});
  const [filter, setFilter] = useState<"all" | "unseen" | "revise" | "star">("all");
  const [search, setSearch] = useState("");
  const startY = useRef(0);
  const isDragging = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProgress(getProgress());
    const saved = localStorage.getItem("feed_position");
    if (saved) setCurrentIndex(Math.min(parseInt(saved, 10), rules.length - 1));
  }, []);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(rules.length - 1, index));
    setCurrentIndex(clamped);
    localStorage.setItem("feed_position", String(clamped));
    setTimeout(() => {
      const el = listRef.current?.querySelector(`[data-index="${clamped}"]`);
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 50);
  }, []);

  const handleStatus = useCallback((id: number, status: RuleStatus) => {
    setRuleStatus(id, status);
    setProgress((prev) => ({ ...prev, [id]: status }));
  }, []);

  // Keyboard navigation on desktop
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "ArrowDown" || e.key === "j") goTo(currentIndex + 1);
      if (e.key === "ArrowUp" || e.key === "k") goTo(currentIndex - 1);
      if (e.key === "g" && !e.shiftKey) handleStatus(rules[currentIndex].id, "seen");
      if (e.key === "r") handleStatus(rules[currentIndex].id, "revise");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentIndex, goTo, handleStatus]);

  // Mobile touch swipe
  const handleTouchStart = (e: React.TouchEvent) => { startY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = startY.current - e.changedTouches[0].clientY;
    if (Math.abs(delta) > 50) goTo(currentIndex + (delta > 0 ? 1 : -1));
  };
  const handleMouseDown = (e: React.MouseEvent) => { isDragging.current = true; startY.current = e.clientY; };
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = startY.current - e.clientY;
    if (Math.abs(delta) > 60) goTo(currentIndex + (delta > 0 ? 1 : -1));
  };

  const rule = rules[currentIndex];
  const status = progress[rule.id] ?? "unseen";
  const doneCount = Object.values(progress).filter((v) => v === "confident").length;
  const progressPct = ((currentIndex + 1) / rules.length) * 100;

  // Filtered rule list for desktop
  const filteredRules = rules.filter((r) => {
    if (filter === "unseen" && progress[r.id] === "confident") return false;
    if (filter === "revise" && progress[r.id] !== "revise") return false;
    if (filter === "star" && !r.star) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.ruleNumber.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      {/* ════════════════════════════════════
          MOBILE feed (< md)
      ════════════════════════════════════ */}
      <div className="md:hidden fixed inset-0 flex flex-col" style={{ background: "#f0f4ff", paddingBottom: "64px" }}>
        {/* Top bar */}
        <div className="flex-shrink-0 bg-white border-b border-slate-100 px-4 py-3" style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
          <div className="flex items-center gap-3">
            <Link href="/" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm flex-shrink-0 press">←</Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progressPct}%`, background: rule.sectionColor }} />
                </div>
                <span className="text-[10px] font-black text-slate-400 flex-shrink-0 tabular-nums">{currentIndex + 1}<span className="text-slate-300">/{rules.length}</span></span>
              </div>
              <p className="text-[10px] font-bold truncate" style={{ color: rule.sectionColor }}>{rule.section}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-[9px] font-black text-emerald-600">{doneCount}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">learned</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <RuleCard rule={rule} status={status}
            onMarkSeen={() => { handleStatus(rule.id, "seen"); setTimeout(() => goTo(currentIndex + 1), 350); }}
            onRevise={() => handleStatus(rule.id, "revise")} />
        </div>

        {/* Nav arrows */}
        <div className="absolute right-4 bottom-24 flex flex-col gap-2 z-20">
          <button onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0}
            className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-slate-600 disabled:opacity-25 press"
            style={{ boxShadow: "0 4px 12px rgba(15,23,42,0.12)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 11L8 6L13 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <button onClick={() => goTo(currentIndex + 1)} disabled={currentIndex === rules.length - 1}
            className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-slate-600 disabled:opacity-25 press"
            style={{ boxShadow: "0 4px 12px rgba(15,23,42,0.12)" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 5L8 10L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        {currentIndex === 0 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-full pointer-events-none">
            Swipe up/down to navigate
          </div>
        )}
      </div>

      {/* ════════════════════════════════════
          DESKTOP feed (≥ md) — split pane
      ════════════════════════════════════ */}
      <div className="hidden md:flex h-screen overflow-hidden" style={{ background: "#f0f4ff" }}>

        {/* ── Left: Rule List Panel ── */}
        <div className="w-[300px] flex-shrink-0 flex flex-col bg-white border-r border-slate-100 h-full" style={{ boxShadow: "2px 0 8px -4px rgba(15,23,42,0.08)" }}>
          {/* List header */}
          <div className="px-4 pt-6 pb-4 flex-shrink-0 border-b border-slate-100">
            <h2 className="font-black text-slate-900 text-lg mb-3" style={{ letterSpacing: "-0.03em" }}>Learn</h2>
            {/* Search */}
            <div className="relative mb-3">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 flex-shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search rules…"
                className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-300 focus:bg-white transition-colors" />
            </div>
            {/* Filters */}
            <div className="flex gap-1.5 flex-wrap">
              {(["all","unseen","revise","star"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all capitalize ${
                    filter === f ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}>
                  {f === "star" ? "⭐ Priority" : f === "revise" ? "🔄 Revise" : f === "unseen" ? "New" : "All"}
                </button>
              ))}
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="px-4 py-2 flex-shrink-0 bg-slate-50 border-b border-slate-100">
            <p className="text-[10px] text-slate-400 font-semibold">
              ↑↓ navigate · <kbd className="bg-slate-200 text-slate-600 px-1 py-0.5 rounded text-[9px]">G</kbd> got it · <kbd className="bg-slate-200 text-slate-600 px-1 py-0.5 rounded text-[9px]">R</kbd> revise
            </p>
          </div>

          {/* Rule list */}
          <div ref={listRef} className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
            {filteredRules.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">No rules match this filter.</div>
            ) : filteredRules.map((r) => {
              const s = progress[r.id] ?? "unseen";
              const isActive = r.id === rule.id;
              return (
                <button key={r.id} data-index={r.id}
                  onClick={() => goTo(rules.indexOf(r))}
                  className={`w-full text-left px-4 py-3.5 border-b border-slate-50 flex items-start gap-3 transition-colors ${
                    isActive ? "bg-blue-50 border-l-2 border-l-blue-500" : "hover:bg-slate-50"
                  }`}>
                  {/* Status dot */}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    s === "confident" ? "bg-emerald-100" : s === "seen" ? "bg-sky-100" : s === "revise" ? "bg-amber-100" : "bg-slate-100"
                  }`}>
                    <span className={`text-[10px] font-black ${
                      s === "confident" ? "text-emerald-600" : s === "seen" ? "text-sky-500" : s === "revise" ? "text-amber-600" : "text-slate-400"
                    }`}>
                      {s === "confident" ? "⭐" : s === "seen" ? "👁" : s === "revise" ? "↺" : "·"}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold text-slate-400">{r.ruleNumber}</span>
                      {r.star && <span className="text-[9px] text-amber-500">⭐</span>}
                    </div>
                    <p className={`text-[13px] font-semibold leading-tight ${isActive ? "text-blue-800" : "text-slate-700"}`}>
                      {r.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: r.sectionColor }} />
                      <span className="text-[10px] text-slate-400">{r.section}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* List footer stats */}
          <div className="flex-shrink-0 px-4 py-3 border-t border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-emerald-600 font-bold">{doneCount} learned</span>
              <span className="text-slate-400">{filteredRules.length} shown</span>
              <span className="text-amber-600 font-bold">{Object.values(progress).filter(v => v === "revise").length} revise</span>
            </div>
          </div>
        </div>

        {/* ── Right: Rule Detail Panel ── */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Detail header bar */}
          <div className="flex-shrink-0 px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between"
            style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: rule.sectionColor }} />
              <span className="text-sm font-semibold text-slate-500">{rule.section}</span>
              <span className="text-slate-200">·</span>
              <span className="text-sm font-bold text-slate-700">{rule.ruleNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-30 transition-colors press">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 9L7 5L11 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
              <span className="text-xs font-bold text-slate-400 tabular-nums">{currentIndex + 1} / {rules.length}</span>
              <button onClick={() => goTo(currentIndex + 1)} disabled={currentIndex === rules.length - 1}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-30 transition-colors press">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
          </div>

          {/* Rule detail — desktop layout */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
            <DesktopRuleDetail
              rule={rule} status={status}
              onMarkSeen={() => { handleStatus(rule.id, "seen"); setTimeout(() => goTo(currentIndex + 1), 200); }}
              onRevise={() => handleStatus(rule.id, "revise")}
            />
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Desktop Rule Detail — not a card, a document
───────────────────────────────────────────── */
function DesktopRuleDetail({
  rule, status, onMarkSeen, onRevise,
}: {
  rule: Rule; status: RuleStatus; onMarkSeen: () => void; onRevise: () => void;
}) {
  const c = rule.sectionColor;
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => { setLangOpen(false); }, [rule.id]);

  return (
    <div className="max-w-3xl mx-auto px-10 py-10">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-white"
            style={{ background: c }}>{rule.section}</span>
          {rule.star && <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">⭐ HIGH PRIORITY</span>}
        </div>
        <h1 className="text-4xl font-black text-slate-900 leading-tight" style={{ letterSpacing: "-0.04em" }}>
          {rule.title}
        </h1>
        <p className="text-slate-400 text-sm mt-2 font-semibold">{rule.ruleNumber}</p>
      </div>

      {/* Rule box */}
      <div className="rounded-3xl p-6 mb-5" style={{ background: `linear-gradient(135deg, ${c}12, ${c}06)`, border: `1.5px solid ${c}25` }}>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
            style={{ background: c }}>📌</div>
          <p className="text-[15px] font-medium text-slate-800 leading-relaxed flex-1">{rule.rule}</p>
        </div>
      </div>

      {/* Concept chips */}
      {(() => {
        const chips = detectConcepts(rule.title, rule.rule, rule.extras?.join(" "));
        if (chips.length === 0) return null;
        return (
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest self-center mr-1">Concepts:</span>
            {chips.map((chip) => (
              <Link key={chip.slug} href={`/concept/${chip.slug}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold press transition-all hover:opacity-80"
                style={{ background: `${chip.color}12`, color: chip.color, border: `1.5px solid ${chip.color}25` }}>
                <span>{chip.emoji}</span>
                <span>{chip.title}</span>
              </Link>
            ))}
          </div>
        );
      })()}

      {/* Visual diagram — full width on desktop */}
      {rule.visual && (
        <div className="mb-8 rounded-3xl p-6" style={{ background: `${c}06`, border: `1.5px solid ${c}15` }}>
          <RuleVisual type={rule.visual as VisualType} color={c} />
        </div>
      )}

      {/* Table */}
      {rule.table && !rule.visual && (
        <div className="mb-8 rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${c}25` }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: c }}>
                {rule.table.headers.map((h) => (
                  <th key={h} className="text-white font-bold px-5 py-3 text-left text-sm tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rule.table.rows.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "white" : `${c}04` }}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-5 py-3 text-slate-700 text-sm border-t" style={{ borderColor: `${c}10` }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Language tips — collapsed by default */}
      {(rule.hindiTip || rule.hinglishTip) && (
        <div className="mb-8">
          <button onClick={() => setLangOpen(v => !v)}
            className="w-full flex items-center justify-between px-5 py-3 rounded-2xl border-2 border-orange-100 bg-orange-50 hover:bg-orange-100 transition-all">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🌐</span>
              <span className="text-xs font-black text-orange-600 uppercase tracking-wide">Language Tips</span>
              <span className="text-xs text-orange-400 font-semibold">
                {[rule.hindiTip && "हिंदी", rule.hinglishTip && "Hinglish"].filter(Boolean).join(" · ")}
              </span>
            </div>
            <span className="text-orange-400 text-xs font-black">{langOpen ? "▲ Hide" : "▼ Show"}</span>
          </button>

          {langOpen && (
            <div className={`mt-3 grid gap-4 ${rule.hindiTip && rule.hinglishTip ? "grid-cols-2" : "grid-cols-1"}`}>
              {rule.hindiTip && (
                <div className="rounded-2xl p-5 border-2" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🇮🇳</span>
                    <span className="text-xs font-black text-orange-600 uppercase tracking-wide">हिंदी</span>
                  </div>
                  <p className="text-sm text-orange-900 leading-relaxed font-medium">{rule.hindiTip}</p>
                </div>
              )}
              {rule.hinglishTip && (
                <div className="rounded-2xl p-5 border-2" style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🗣</span>
                    <span className="text-xs font-black text-amber-600 uppercase tracking-wide">Hinglish</span>
                  </div>
                  <p className="text-sm text-amber-900 leading-relaxed font-medium">{rule.hinglishTip}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Examples — desktop shows in 2-col when both correct+wrong exist */}
      <div className={`mb-8 ${rule.correct.length > 0 && rule.wrong && rule.wrong.length > 0 ? "grid grid-cols-2 gap-4" : ""}`}>
        {rule.correct.length > 0 && (
          <div>
            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-3">✅ Correct</p>
            <div className="space-y-2">
              {rule.correct.map((ex, i) => (
                <div key={i} className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3.5">
                  <span className="text-emerald-400 text-sm mt-0.5 flex-shrink-0">✓</span>
                  <p className="text-sm text-emerald-900 font-semibold font-mono-ex">{ex}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {rule.wrong && rule.wrong.length > 0 && (
          <div>
            <p className="text-xs font-black text-rose-500 uppercase tracking-widest mb-3">❌ Wrong</p>
            <div className="space-y-2">
              {rule.wrong.map((ex, i) => (
                <div key={i} className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-5 py-3.5">
                  <span className="text-rose-400 text-sm mt-0.5 flex-shrink-0">✕</span>
                  <p className="text-sm text-rose-900 font-semibold font-mono-ex line-through decoration-rose-300">{ex}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Extras */}
      {rule.extras && rule.extras.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-3">📌 Also Note</p>
          <div className="space-y-2">
            {rule.extras.map((ex, i) => (
              <div key={i} className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3.5">
                <span className="text-blue-400 text-sm mt-0.5 flex-shrink-0">→</span>
                <p className="text-sm text-blue-900 font-semibold">{ex}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons — desktop inline at bottom of content */}
      <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
        {status !== "unseen" && (
          <span className={`text-sm font-bold px-4 py-2 rounded-xl ${
            status === "confident" ? "bg-emerald-100 text-emerald-700" :
            status === "seen" ? "bg-sky-100 text-sky-700" :
            "bg-amber-100 text-amber-700"
          }`}>
            {status === "confident" ? "⭐ Confident" : status === "seen" ? "👁 Read" : "🔄 For Revision"}
          </span>
        )}
        <div className="flex gap-3 ml-auto">
          <button onClick={onRevise}
            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all press border-2 ${
              status === "revise"
                ? "bg-amber-400 border-amber-400 text-amber-900"
                : "border-amber-200 text-amber-600 hover:bg-amber-50"
            }`}>
            🔄 Revise Later
          </button>
          {status === "confident" ? (
            <div className="px-8 py-3 rounded-2xl font-black text-sm text-emerald-700 bg-emerald-100 border-2 border-emerald-200">
              ⭐ Confident
            </div>
          ) : (
            <button onClick={onMarkSeen}
              className="px-8 py-3 rounded-2xl font-black text-sm text-white transition-all press"
              style={{
                background: status === "seen" ? "#0ea5e9" : `linear-gradient(135deg, ${c}, ${c}cc)`,
                boxShadow: `0 4px 16px ${c}40`,
              }}>
              {status === "seen" ? "✓ Read" : "Mark as Read"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
