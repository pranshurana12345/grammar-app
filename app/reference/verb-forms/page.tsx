"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { VERB_GROUPS, INVARIANT_NOUNS, IRREGULAR_NOUNS } from "@/data/verbForms";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";

type Tab = "verbs" | "invariant" | "irregular";
type Slot = "v1" | "v2" | "v3";
type HideMode = "none" | "v2" | "v3" | "both";

// ─── Practice test ────────────────────────────────────────────────────────────
const ALL_VERBS = VERB_GROUPS.flatMap((g) =>
  g.verbs.map((v) => ({ ...v, groupId: g.id, groupLabel: g.label, groupPattern: g.pattern, groupColor: g.color, groupDesc: g.description }))
);
const SLOTS: Slot[] = ["v1", "v2", "v3"];
function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function PracticeTest({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState(() => ({ verb: pickRandom(ALL_VERBS), givenSlot: pickRandom(SLOTS) }));
  const [answers, setAnswers] = useState<Record<Slot, string>>({ v1: "", v2: "", v3: "" });
  const [phase, setPhase] = useState<"asking" | "result">("asking");
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const [timeLeft, setTimeLeft] = useState(15);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const nextQ = useCallback(() => {
    const nq = { verb: pickRandom(ALL_VERBS), givenSlot: pickRandom(SLOTS) };
    setQ(nq); setAnswers({ v1: "", v2: "", v3: "" });
    setPhase("asking"); setTimeLeft(15); setShowHint(false);
    setTimeout(() => inputRefs.current[SLOTS.find(s => s !== nq.givenSlot)!]?.focus(), 60);
  }, []);

  const submit = useCallback((timedOut = false) => {
    if (phase !== "asking") return;
    if (timerRef.current) clearInterval(timerRef.current);
    const askSlots = SLOTS.filter(s => s !== q.givenSlot);
    const ok = !timedOut && askSlots.every(s => answers[s].trim().toLowerCase() === q.verb[s].toLowerCase());
    setCorrect(ok);
    setScore(p => ({ right: p.right + (ok ? 1 : 0), total: p.total + 1 }));
    setPhase("result");
    setTimeout(nextQ, 2500);
  }, [phase, q, answers, nextQ]);

  useEffect(() => {
    if (phase !== "asking") return;
    timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current!); submit(true); return 0; } return t - 1; }), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, q, submit]);

  useEffect(() => { setTimeout(() => inputRefs.current[SLOTS.find(s => s !== q.givenSlot)!]?.focus(), 100); }, []);

  const pct = (timeLeft / 15) * 100;
  const timerColor = timeLeft > 8 ? "#10b981" : timeLeft > 4 ? "#f59e0b" : "#ef4444";

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(15,23,42,0.94)", backdropFilter: "blur(16px)" }}>
      <div className="flex items-center justify-between px-6 pt-6 pb-3 flex-shrink-0">
        <div>
          <p className="text-white font-bold text-lg">Practice Test</p>
          {score.total > 0 && <p className="text-slate-400 text-sm">{score.right}/{score.total} · {Math.round(score.right/score.total*100)}%</p>}
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center press" style={{ background: "rgba(255,255,255,0.08)", color: "#94a3b8" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div className="mx-6 h-1.5 rounded-full mb-6 flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: timerColor }}/>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-10">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <span className="font-bold tabular-nums" style={{ fontSize: 72, color: timerColor, lineHeight: 1 }}>{timeLeft}</span>
            <p className="text-slate-500 text-sm mt-1">seconds</p>
          </div>
          {showHint && (
            <div className="mb-5 px-4 py-3 rounded-xl mb-4" style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}>
              <p className="text-violet-400 text-xs font-semibold mb-1">Pattern</p>
              <p className="text-violet-100 text-sm font-medium">{q.verb.groupPattern} — {q.verb.groupDesc}</p>
              {q.verb.note && <p className="text-amber-300 text-xs mt-1">{q.verb.note}</p>}
            </div>
          )}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {SLOTS.map((slot) => {
              const isGiven = slot === q.givenSlot;
              const showResult = phase === "result";
              const userAns = answers[slot]; const correctAns = q.verb[slot];
              const wasCorrect = userAns.trim().toLowerCase() === correctAns.toLowerCase();
              return (
                <div key={slot} className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-medium text-center" style={{ color: isGiven ? q.verb.groupColor : "#64748b" }}>
                    {slot === "v1" ? "Base" : slot === "v2" ? "Past Simple" : "Past Participle"}
                  </p>
                  {isGiven ? (
                    <div className="rounded-xl px-3 py-4 text-center font-bold text-xl" style={{ background: `${q.verb.groupColor}20`, border: `2px solid ${q.verb.groupColor}`, color: q.verb.groupColor }}>{q.verb[slot]}</div>
                  ) : showResult ? (
                    <div className="rounded-xl px-3 py-4 text-center flex flex-col items-center gap-1" style={{ background: wasCorrect ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", border: `2px solid ${wasCorrect ? "#10b981" : "#ef4444"}` }}>
                      {!wasCorrect && <p className="text-[11px] line-through text-rose-400 font-medium">{userAns || "—"}</p>}
                      <p className="font-bold text-base" style={{ color: "#10b981" }}>{correctAns}</p>
                    </div>
                  ) : (
                    <input ref={el => { inputRefs.current[slot] = el; }} value={answers[slot]}
                      onChange={e => setAnswers(a => ({ ...a, [slot]: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter") submit(); }}
                      placeholder="type here"
                      className="rounded-xl px-3 py-4 text-center font-medium text-base text-white outline-none w-full"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", caretColor: "#fff" }}/>
                  )}
                </div>
              );
            })}
          </div>
          {phase === "result" && (
            <div className="rounded-xl px-4 py-3 text-center mb-5 flex items-center justify-center gap-3" style={{ background: correct ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", border: `1px solid ${correct ? "#10b981" : "#ef4444"}` }}>
              <span className="text-xl">{correct ? "✓" : "✗"}</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: correct ? "#10b981" : "#ef4444" }}>{correct ? "Correct" : "Not quite"}</p>
                <p className="text-slate-500 text-xs">Next in 2 seconds</p>
              </div>
            </div>
          )}
          {phase === "asking" && (
            <div className="flex gap-3">
              <button onClick={() => setShowHint(h => !h)} className="flex-1 py-3.5 rounded-xl font-medium text-sm press" style={{ background: showHint ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.1)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.25)" }}>{showHint ? "Hide hint" : "Hint"}</button>
              <button onClick={() => submit()} className="flex-[2] py-3.5 rounded-xl font-semibold text-sm text-white press" style={{ background: q.verb.groupColor }}>Submit</button>
              <button onClick={nextQ} className="flex-1 py-3.5 rounded-xl font-medium text-sm press" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>Skip</button>
            </div>
          )}
          {phase === "result" && <button onClick={nextQ} className="w-full py-3.5 rounded-xl font-semibold text-sm text-white press" style={{ background: q.verb.groupColor }}>Next</button>}
        </div>
      </div>
    </div>
  );
}

// ─── Hidden cell ──────────────────────────────────────────────────────────────
function HiddenCell({ color, value, isRevealed, onToggle }: { color: string; value: string; isRevealed: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="text-left press w-full">
      {isRevealed
        ? <span className="font-semibold text-sm" style={{ color }}>{value}</span>
        : <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold select-none" style={{ background: `${color}12`, color: `${color}80`, border: `1.5px dashed ${color}40`, letterSpacing: 3 }}>···</span>
      }
    </button>
  );
}

// ─── Left nav item ────────────────────────────────────────────────────────────
function NavItem({ label, active, color, onClick }: { label: string; active: boolean; color?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all press"
      style={active
        ? { background: color ? `${color}15` : "#eff6ff", color: color || "#2d7ff9", fontWeight: 600 }
        : { color: "#64748b" }}>
      {label}
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function VerbFormsPage() {
  const [tab, setTab] = useState<Tab>("verbs");
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [hideMode, setHideMode] = useState<HideMode>("none");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const toggleReveal = useCallback((key: string) => {
    setRevealed(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }, []);

  const resetHide = () => setRevealed(new Set());
  const cycleHide = () => {
    setRevealed(new Set());
    setHideMode(m => m === "none" ? "both" : m === "both" ? "v2" : m === "v2" ? "v3" : "none");
  };

  const hideV2 = hideMode === "both" || hideMode === "v2";
  const hideV3 = hideMode === "both" || hideMode === "v3";

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase().trim();
    return VERB_GROUPS.map((g) => ({
      ...g,
      verbs: g.verbs.filter((v) => !q || v.v1.toLowerCase().includes(q) || v.v2.toLowerCase().includes(q) || v.v3.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q)),
    })).filter((g) => (activeGroup === "all" || g.id === activeGroup) && g.verbs.length > 0);
  }, [search, activeGroup]);

  const totalVerbs = VERB_GROUPS.reduce((sum, g) => sum + g.verbs.length, 0);

  const hideModeLabel = hideMode === "none" ? "Hide forms" : hideMode === "both" ? "Hiding V2 + V3" : hideMode === "v2" ? "Hiding V2" : "Hiding V3";
  const hideModeColor = hideMode === "none" ? "#94a3b8" : "#7c3aed";

  return (
    <>
      {practiceOpen && <PracticeTest onClose={() => setPracticeOpen(false)} />}

      {/* Full-height flex column */}
      <div className="flex flex-col print-full" style={{ height: "100vh" }}>

        {/* ── Sticky header ── */}
        <div className="flex-shrink-0 bg-white border-b border-slate-100 z-20" style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
          <div className="px-4 lg:px-6 py-3 flex items-center gap-3">
            <Link href="/reference" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 press lg:hidden flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L5 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <div className="hidden lg:flex items-center gap-1.5 text-sm text-slate-400 flex-shrink-0">
              <Link href="/reference" className="hover:text-slate-600 press">Study Hub</Link>
              <span>/</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-slate-900 leading-none">Verb Forms</h1>
              <p className="text-[11px] text-slate-400 mt-0.5">{totalVerbs} verbs · {INVARIANT_NOUNS.length} invariant · {IRREGULAR_NOUNS.length} irregular plurals</p>
            </div>
            {/* Hide toggle — always visible when on verbs tab */}
            {tab === "verbs" && (
              <button onClick={cycleHide} className="no-print flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold press flex-shrink-0 transition-all"
                style={hideMode !== "none"
                  ? { background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe" }
                  : { background: "#f8fafc", color: "#94a3b8", border: "1px solid #e2e8f0" }}>
                {/* Eye icon */}
                {hideMode === "none"
                  ? <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1 7.5C1 7.5 3.5 3 7.5 3C11.5 3 14 7.5 14 7.5C14 7.5 11.5 12 7.5 12C3.5 12 1 7.5 1 7.5Z" stroke="currentColor" strokeWidth="1.4"/><circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor"><path d="M2 2L13 13M6 5.3A2 2 0 0 1 9.7 9M5.4 10.3C6.1 10.7 6.8 11 7.5 11C11.5 11 14 7.5 14 7.5C13.2 6.3 12.2 5.3 11 4.6M3.5 9.5C2.6 8.7 1.8 7.8 1 7.5C1 7.5 3.5 3 7.5 3C8.3 3 9.1 3.2 9.8 3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
                }
                <span>{hideModeLabel}</span>
                {hideMode !== "none" && (
                  <button onClick={e => { e.stopPropagation(); resetHide(); }} className="ml-0.5 text-violet-400 hover:text-violet-600 press" title="Show all">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 2l7 7M9 2L2 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                )}
              </button>
            )}
            {tab === "verbs" && (
              <button onClick={() => setPracticeOpen(true)} className="no-print flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold press text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#7c3aed,#2d7ff9)" }}>
                Practice test
              </button>
            )}
            <PrintButton label="PDF" />
          </div>
        </div>

        {/* ── Two-panel body ── */}
        <div className="flex flex-1 min-h-0">

          {/* LEFT NAV — desktop only */}
          <div className="no-print hidden lg:flex flex-col flex-shrink-0 border-r border-slate-100 overflow-y-auto" style={{ width: 200, background: "#fafafa" }}>
            <div className="p-3 space-y-0.5">

              {/* Main tabs */}
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 pt-2 pb-1">Sections</p>
              <NavItem label="Verb Forms" active={tab === "verbs"} onClick={() => setTab("verbs")} />
              <NavItem label="Same S/P" active={tab === "invariant"} onClick={() => setTab("invariant")} />
              <NavItem label="Irregular Nouns" active={tab === "irregular"} onClick={() => setTab("irregular")} />

              {/* Group filters — only when on verbs tab */}
              {tab === "verbs" && (
                <>
                  <div className="h-px bg-slate-200 my-2 mx-1" />
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 pt-1 pb-1">Groups</p>
                  <NavItem label="All groups" active={activeGroup === "all"} onClick={() => setActiveGroup("all")} />
                  {VERB_GROUPS.map((g) => (
                    <NavItem key={g.id} label={g.label.split(" — ")[0]} active={activeGroup === g.id} color={g.color} onClick={() => setActiveGroup(g.id)} />
                  ))}
                </>
              )}

              {/* Hide mode selector — only when on verbs tab */}
              {tab === "verbs" && (
                <>
                  <div className="h-px bg-slate-200 my-2 mx-1" />
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 pt-1 pb-1">Hide forms</p>
                  {(["none", "v2", "v3", "both"] as HideMode[]).map((m) => (
                    <NavItem key={m} label={m === "none" ? "Show all" : m === "v2" ? "Hide V2" : m === "v3" ? "Hide V3" : "Hide V2 + V3"}
                      active={hideMode === m}
                      color={m !== "none" ? "#7c3aed" : undefined}
                      onClick={() => { setHideMode(m); resetHide(); }} />
                  ))}
                  {hideMode !== "none" && (
                    <button onClick={resetHide} className="w-full text-left px-3 py-1.5 text-[12px] text-violet-500 font-medium press">Reset revealed</button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT CONTENT — scrollable */}
          <div className="flex-1 overflow-y-auto print-full" style={{ WebkitOverflowScrolling: "touch" }}>

            {/* Mobile tab + group bar */}
            <div className="no-print lg:hidden sticky top-0 bg-white border-b border-slate-100 z-10">
              <div className="flex gap-1.5 px-4 py-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                <button onClick={() => setTab("verbs")} className="px-3 py-1.5 rounded-lg text-xs font-semibold press flex-shrink-0"
                  style={tab === "verbs" ? { background: "#2d7ff9", color: "#fff" } : { background: "#f1f5f9", color: "#64748b" }}>Verb Forms</button>
                <button onClick={() => setTab("invariant")} className="px-3 py-1.5 rounded-lg text-xs font-semibold press flex-shrink-0"
                  style={tab === "invariant" ? { background: "#2d7ff9", color: "#fff" } : { background: "#f1f5f9", color: "#64748b" }}>Same S/P</button>
                <button onClick={() => setTab("irregular")} className="px-3 py-1.5 rounded-lg text-xs font-semibold press flex-shrink-0"
                  style={tab === "irregular" ? { background: "#2d7ff9", color: "#fff" } : { background: "#f1f5f9", color: "#64748b" }}>Irregular Nouns</button>
              </div>
              {tab === "verbs" && (
                <div className="flex gap-1.5 px-4 pb-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                  <button onClick={() => setActiveGroup("all")} className="px-2.5 py-1 rounded-lg text-xs font-semibold press flex-shrink-0"
                    style={activeGroup === "all" ? { background: "#0f172a", color: "#fff" } : { background: "#f1f5f9", color: "#64748b" }}>All</button>
                  {VERB_GROUPS.map((g) => (
                    <button key={g.id} onClick={() => setActiveGroup(g.id)} className="px-2.5 py-1 rounded-lg text-xs font-semibold press flex-shrink-0"
                      style={activeGroup === g.id ? { background: g.color, color: "#fff" } : { background: "#f1f5f9", color: "#64748b" }}>
                      {g.label.split(" — ")[0]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* VERB FORMS */}
            {tab === "verbs" && (
              <div className="p-4 lg:p-6 space-y-8">

                {/* Hide mode hint */}
                {hideMode !== "none" && (
                  <div className="px-4 py-2.5 rounded-xl text-xs font-medium" style={{ background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe" }}>
                    Tap any <span className="font-bold">···</span> cell to reveal the word. Tap again to hide it.
                  </div>
                )}

                {/* Search */}
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search verbs — e.g. go, knew, broken"
                  className="no-print w-full max-w-md px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 outline-none focus:border-blue-400 transition-colors" />

                {filteredGroups.map((group) => (
                  <div key={group.id}>
                    <div className="flex items-center gap-2.5 mb-1">
                      <h2 className="text-[15px] font-bold text-slate-800">{group.label}</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white" style={{ background: group.color }}>{group.pattern}</span>
                      <span className="text-xs text-slate-400">{group.verbs.length} verbs</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{group.description}</p>

                    <div className="rounded-xl overflow-hidden bg-white border border-slate-200">
                      <div className="grid grid-cols-4 px-4 py-2.5 text-[11px] font-semibold text-slate-400 border-b border-slate-100" style={{ background: `${group.color}07` }}>
                        <span>V1 — Base</span>
                        <span>V2 — Past Simple {hideV2 && <span className="text-violet-400">· hidden</span>}</span>
                        <span>V3 — Past Participle {hideV3 && <span className="text-violet-400">· hidden</span>}</span>
                        <span>Meaning</span>
                      </div>
                      {group.verbs.map((verb, i) => {
                        const kv2 = `${group.id}-${i}-v2`, kv3 = `${group.id}-${i}-v3`;
                        return (
                          <div key={i} className="grid grid-cols-4 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors items-center">
                            <span className="font-bold text-sm text-slate-800">{verb.v1}</span>
                            {hideV2
                              ? <HiddenCell color={group.color} value={verb.v2} isRevealed={revealed.has(kv2)} onToggle={() => toggleReveal(kv2)} />
                              : <span className="font-semibold text-sm" style={{ color: group.color }}>{verb.v2}</span>
                            }
                            {hideV3
                              ? <HiddenCell color={group.color} value={verb.v3} isRevealed={revealed.has(kv3)} onToggle={() => toggleReveal(kv3)} />
                              : <span className="font-semibold text-sm" style={{ color: group.color }}>{verb.v3}</span>
                            }
                            <div>
                              <p className="text-xs text-slate-500">{verb.meaning}</p>
                              {verb.note && <p className="text-[10px] text-amber-600 mt-0.5">{verb.note}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {filteredGroups.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-slate-400 text-sm">No verbs found for &ldquo;{search}&rdquo;</p>
                    <button onClick={() => setSearch("")} className="mt-2 text-blue-600 text-sm font-semibold press">Clear</button>
                  </div>
                )}

                <div className="px-4 py-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-xs font-semibold text-amber-800 mb-2">AFCAT strategy</p>
                  <ul className="text-xs text-amber-700 space-y-1.5">
                    <li>AAA — never add -ed: cut/cut/cut, not "cutted"</li>
                    <li>ABB — V2 = V3. Most common in tense questions.</li>
                    <li>lie/lay/lain vs lay/laid/laid — top error-spotting trap.</li>
                    <li>rise/rose/risen (alone) vs raise/raised/raised (you lift it).</li>
                  </ul>
                </div>
              </div>
            )}

            {/* SAME S/P */}
            {tab === "invariant" && (
              <div className="p-4 lg:p-6">
                <p className="text-sm text-slate-600 mb-4">These words do not change in plural — no "-s" added. Commonly tested in Subject-Verb Agreement questions.</p>
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                  <div className="grid grid-cols-2 px-4 py-2.5 text-[11px] font-semibold text-slate-400 border-b border-slate-100 bg-blue-50">
                    <span>Word</span><span>Example</span>
                  </div>
                  {INVARIANT_NOUNS.map((n, i) => (
                    <div key={i} className="grid grid-cols-2 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                      <span className="font-bold text-sm text-slate-800">{n.word}</span>
                      <span className="text-xs text-slate-500">{n.example}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 px-4 py-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-xs font-semibold text-amber-800 mb-1">SVA rule</p>
                  <p className="text-xs text-amber-700">"The sheep <strong>is</strong> in the field." (one) · "The sheep <strong>are</strong> in the field." (many)</p>
                </div>
              </div>
            )}

            {/* IRREGULAR NOUNS */}
            {tab === "irregular" && (
              <div className="p-4 lg:p-6">
                <p className="text-sm text-slate-600 mb-4">These nouns form plurals in unusual ways. Greek and Latin borrowings are commonly tested in AFCAT.</p>
                <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                  <div className="grid grid-cols-2 px-4 py-2.5 text-[11px] font-semibold text-slate-400 border-b border-slate-100 bg-purple-50">
                    <span>Singular</span><span>Plural</span>
                  </div>
                  {IRREGULAR_NOUNS.map((n, i) => (
                    <div key={i} className="grid grid-cols-2 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                      <span className="font-bold text-sm text-slate-800">{n.singular}</span>
                      <div>
                        <span className="font-semibold text-sm text-purple-700">{n.plural}</span>
                        {n.note && <p className="text-[10px] text-slate-400 mt-0.5">{n.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 px-4 py-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-xs font-semibold text-amber-800 mb-2">Patterns</p>
                  <ul className="text-xs text-amber-700 space-y-1.5">
                    <li>-um → -a: datum/data, medium/media</li>
                    <li>-us → -i: alumnus/alumni, cactus/cacti</li>
                    <li>-is → -es: analysis/analyses, crisis/crises</li>
                    <li>-on → -a: criterion/criteria, phenomenon/phenomena</li>
                    <li>-fe/-f → -ves: knife/knives, life/lives</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
