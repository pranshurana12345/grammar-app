"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import {
  EXCEPTION_GROUPS, EXCEPTION_COUNT, EXCEPTION_CASE_COUNT,
} from "@/data/exceptions";

export default function ExceptionsPage() {
  const [activeGroup, setActiveGroup] = useState("all");
  const [search, setSearch] = useState("");
  const [openNote, setOpenNote] = useState<string | null>(null);

  const groups = useMemo(() => {
    const q = search.toLowerCase().trim();
    return EXCEPTION_GROUPS.map((g) => ({
      ...g,
      notes: g.notes.filter((n) =>
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.normally.toLowerCase().includes(q) ||
        (n.trap ?? "").toLowerCase().includes(q) ||
        n.cases.some((c) =>
          c.when.toLowerCase().includes(q) ||
          c.note.toLowerCase().includes(q) ||
          [...(c.right ?? []), ...(c.wrong ?? [])].some((e) => e.toLowerCase().includes(q)))),
    })).filter((g) => (activeGroup === "all" || g.id === activeGroup) && g.notes.length > 0);
  }, [search, activeGroup]);

  const hits = groups.reduce((n, g) => n + g.notes.length, 0);

  return (
    <div className="min-h-screen pb-20" style={{ background: "#f0f4ff" }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20 print-static"
        style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/reference" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm press lg:hidden">←</Link>
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/reference" className="text-slate-400 text-sm hover:text-slate-600 press">Study Hub</Link>
              <span className="text-slate-300">/</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800">Special Cases</h1>
              <p className="text-[11px] text-slate-400 font-semibold">
                {EXCEPTION_COUNT} notes · {EXCEPTION_CASE_COUNT} exceptions to the rules
              </p>
            </div>
            <div className="ml-auto"><PrintButton label="PDF" /></div>
          </div>

          <div className="no-print mt-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search (e.g. which, police, lest, prefer)…"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>

          <div className="no-print flex gap-2 mt-2 flex-wrap">
            <button onClick={() => setActiveGroup("all")}
              className="px-3 py-1.5 rounded-xl text-xs font-bold press"
              style={activeGroup === "all" ? { background: "#0f172a", color: "#fff" } : { background: "#f1f5f9", color: "#64748b" }}>
              All
            </button>
            {EXCEPTION_GROUPS.map((g) => (
              <button key={g.id} onClick={() => setActiveGroup(g.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold press"
                style={activeGroup === g.id ? { background: g.color, color: "#fff" } : { background: "#f1f5f9", color: "#64748b" }}>
                {g.emoji} {g.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-4">
        {/* What this page is */}
        <div className="no-print mb-5 px-4 py-3 rounded-2xl bg-white border border-slate-100"
          style={{ boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
          <p className="text-[12.5px] text-slate-600 leading-relaxed">
            <b className="text-slate-800">The rules tell you what usually happens.</b> This page is the other
            half — the words that break their own rule. That is exactly where the paper sets its questions.
          </p>
        </div>

        {search && (
          <p className="text-xs text-slate-400 font-semibold mb-3">{hits} notes match &quot;{search}&quot;</p>
        )}

        {groups.map((g) => (
          <div key={g.id} className="mb-7">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{g.emoji}</span>
              <h2 className="text-base font-black text-slate-800">{g.label}</h2>
              <span className="text-xs text-slate-400 font-semibold">{g.notes.length} notes</span>
            </div>

            <div className="space-y-3">
              {g.notes.map((n) => {
                const isOpen = openNote === n.id || !!search;
                return (
                  <div key={n.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden print-avoid-break"
                    style={{ boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>

                    {/* Title + the normal rule */}
                    <button onClick={() => setOpenNote(isOpen && !search ? null : n.id)}
                      className="w-full text-left px-4 pt-3.5 pb-3 press">
                      <div className="flex items-start gap-2">
                        <h3 className="flex-1 text-[14.5px] font-black text-slate-800 leading-snug">{n.title}</h3>
                        <span className="text-slate-300 text-xs mt-1 no-print flex-shrink-0">{isOpen ? "▲" : "▼"}</span>
                      </div>
                      <div className="mt-2 flex items-start gap-2 rounded-xl px-3 py-2"
                        style={{ background: "#f8fafc", border: "1px solid #eef2f7" }}>
                        <span className="text-[9.5px] font-black uppercase tracking-widest text-slate-400 mt-0.5 flex-shrink-0">Rule</span>
                        <p className="text-[12px] text-slate-500 leading-snug font-medium">{n.normally}</p>
                      </div>
                    </button>

                    {/* Kept in the DOM when collapsed so the PDF still carries
                        every exception — see .print-open in globals.css. */}
                    <div className={`px-4 pb-4 space-y-3 ${isOpen ? "" : "hidden print-open"}`}>
                        {n.cases.map((c, ci) => (
                          <div key={ci} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${g.color}22` }}>
                            <div className="px-3 py-2 flex items-start gap-2" style={{ background: `${g.color}0d` }}>
                              <span className="text-[10px] font-black flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white mt-0.5"
                                style={{ background: g.color }}>{ci + 1}</span>
                              <p className="text-[12.5px] font-bold leading-snug" style={{ color: g.color }}>{c.when}</p>
                            </div>
                            <div className="px-3 py-2.5">
                              <p className="text-[12.5px] text-slate-700 leading-relaxed">{c.note}</p>

                              {(c.right?.length || c.wrong?.length) ? (
                                <div className="mt-2.5 space-y-1.5">
                                  {c.right?.map((ex) => (
                                    <div key={ex} className="flex items-start gap-2">
                                      <span className="text-emerald-500 text-[12px] font-black flex-shrink-0 mt-px">✓</span>
                                      <p className="text-[12px] text-slate-600 leading-snug">{ex}</p>
                                    </div>
                                  ))}
                                  {c.wrong?.map((ex) => (
                                    <div key={ex} className="flex items-start gap-2">
                                      <span className="text-rose-400 text-[12px] font-black flex-shrink-0 mt-px">✗</span>
                                      <p className="text-[12px] text-slate-400 leading-snug line-through decoration-rose-200">{ex}</p>
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ))}

                        {n.trap && (
                          <div className="rounded-xl px-3 py-2.5 flex items-start gap-2 bg-amber-50 border border-amber-200">
                            <span className="text-sm flex-shrink-0">🎯</span>
                            <div>
                              <p className="text-[9.5px] font-black text-amber-700 uppercase tracking-widest mb-0.5">In the exam</p>
                              <p className="text-[12px] text-amber-800 leading-snug">{n.trap}</p>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-slate-500 font-semibold">No notes match &quot;{search}&quot;</p>
            <button onClick={() => setSearch("")} className="mt-2 text-blue-600 text-sm font-bold press">Clear search</button>
          </div>
        )}

        <div className="no-print mt-2 px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-semibold">Tap a note to open its exceptions · PDF prints them all</p>
        </div>
      </div>
    </div>
  );
}
