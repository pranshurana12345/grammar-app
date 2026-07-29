"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { PAIR_GROUPS, PAIR_COUNT } from "@/data/wordPairs";

// Notes sheet, not a rule page: word on the left, what it takes on the right.
//
// The printout is the SAME markup as the screen, only quieter — no separate
// print-only table. The idioms page builds a second, two-per-row DOM for
// printing and that is exactly how its rows ended up overlapping and clipped.
// One list, one column, bigger type, and every row kept whole.
export default function WordPairsPage() {
  const [activeGroup, setActiveGroup] = useState("all");
  const [search, setSearch] = useState("");

  const groups = useMemo(() => {
    const q = search.toLowerCase().trim();
    return PAIR_GROUPS.map((g) => ({
      ...g,
      pairs: g.pairs.filter((p) =>
        !q ||
        p.word.toLowerCase().includes(q) ||
        p.takes.toLowerCase().includes(q) ||
        (p.example ?? "").toLowerCase().includes(q) ||
        (p.note ?? "").toLowerCase().includes(q)),
    })).filter((g) => (activeGroup === "all" || g.id === activeGroup) && g.pairs.length > 0);
  }, [search, activeGroup]);

  const shown = groups.reduce((n, g) => n + g.pairs.length, 0);

  return (
    <div className="min-h-screen pb-20" style={{ background: "#f0f4ff" }}>
      <style>{`
        @media print {
          /* One row per line, three fixed columns. The min-widths that keep the
             columns aligned on screen would force every row onto two lines on
             paper, so they are dropped here rather than left to wrap. */
          .pairs-row { break-inside: avoid; page-break-inside: avoid; padding: 2.5px 0 !important; border-top: 1px solid #e5e7eb !important; flex-wrap: nowrap !important; }
          .pairs-group { break-inside: auto; margin-bottom: 14px !important; }
          .pairs-head { break-after: avoid; page-break-after: avoid; }
          .pairs-sheet { font-size: 9.5pt; }
          .pairs-sheet .w { min-width: 0 !important; width: 26% !important; flex: 0 0 26% !important; }
          .pairs-sheet .t { min-width: 0 !important; width: 30% !important; flex: 0 0 30% !important; }
          .pairs-sheet .e { min-width: 0 !important; width: 44% !important; flex: 1 1 auto !important; }
          .pairs-sheet .rounded-2xl { border: none !important; border-radius: 0 !important; }
        }
      `}</style>

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
              <h1 className="text-lg font-black text-slate-800">Which Word Takes What</h1>
              <p className="text-[11px] text-slate-400 font-semibold">{PAIR_COUNT} notes · prepositions · fixed pairs</p>
            </div>
            <div className="ml-auto"><PrintButton label="PDF" /></div>
          </div>

          <div className="no-print mt-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a word (e.g. senior, deprive, afraid, no sooner)…"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>

          <div className="no-print flex gap-2 mt-2 flex-wrap">
            <button onClick={() => setActiveGroup("all")}
              className="px-3 py-1.5 rounded-xl text-xs font-bold press"
              style={activeGroup === "all" ? { background: "#0f172a", color: "#fff" } : { background: "#f1f5f9", color: "#64748b" }}>
              All
            </button>
            {PAIR_GROUPS.map((g) => (
              <button key={g.id} onClick={() => setActiveGroup(g.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold press"
                style={activeGroup === g.id ? { background: g.color, color: "#fff" } : { background: "#f1f5f9", color: "#64748b" }}>
                {g.emoji} {g.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-4 pairs-sheet">
        {search && <p className="text-xs text-slate-400 font-semibold mb-3">{shown} matches for &quot;{search}&quot;</p>}

        {groups.map((g) => (
          <div key={g.id} className="mb-6 pairs-group">
            <div className="pairs-head mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{g.emoji}</span>
                <h2 className="text-base font-black text-slate-800">{g.label}</h2>
                <span className="text-xs text-slate-400 font-semibold no-print">{g.pairs.length}</span>
              </div>
              <p className="text-[11.5px] text-slate-500 leading-snug mt-0.5 ml-7">{g.note}</p>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 print-flat"
              style={{ boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
              {g.pairs.map((p, i) => (
                <div key={p.word}
                  className="pairs-row flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2.5"
                  style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9" }}>
                  <span className="w font-black text-[13.5px] text-slate-800" style={{ minWidth: "8.5rem" }}>
                    {p.word}
                  </span>
                  <span className="t font-bold text-[13px]" style={{ color: g.color, minWidth: "8rem" }}>
                    {p.takes}
                  </span>
                  {p.example && (
                    <span className="e text-[12.5px] text-slate-500 italic flex-1" style={{ minWidth: "12rem" }}>
                      {p.example}
                    </span>
                  )}
                  {p.note && (
                    <span className="w-full text-[11.5px] text-amber-700 mt-0.5">↳ {p.note}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-slate-500 font-semibold">Nothing matches &quot;{search}&quot;</p>
            <button onClick={() => setSearch("")} className="mt-2 text-blue-600 text-sm font-bold press">Clear search</button>
          </div>
        )}
      </div>
    </div>
  );
}
