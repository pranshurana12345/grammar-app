"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { ONE_WORD_GROUPS, ONE_WORD_COUNT } from "@/data/oneWord";

// Definition on the left, the word on the right — the direction the exam asks
// it in. Grouped by family, because the four options always come from one.
//
// Print layout follows /reference/pairs: the same markup as the screen, one
// item per line. No second print-only DOM (see the idioms page for why not).
export default function OneWordPage() {
  const [activeGroup, setActiveGroup] = useState("all");
  const [search, setSearch] = useState("");

  const groups = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ONE_WORD_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) =>
        !q ||
        i.word.toLowerCase().includes(q) ||
        i.def.toLowerCase().includes(q) ||
        (i.family ?? []).some((f) => f.toLowerCase().includes(q))),
    })).filter((g) => (activeGroup === "all" || g.id === activeGroup) && g.items.length > 0);
  }, [search, activeGroup]);

  const shown = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="min-h-screen pb-20" style={{ background: "#f0f4ff" }}>
      <style>{`
        @media print {
          .ows-row { break-inside: avoid; page-break-inside: avoid; padding: 2.5px 0 !important; border-top: 1px solid #e5e7eb !important; flex-wrap: nowrap !important; }
          .ows-group { break-inside: auto; margin-bottom: 14px !important; }
          .ows-head { break-after: avoid; page-break-after: avoid; }
          .ows-sheet { font-size: 9.5pt; }
          .ows-sheet .d { min-width: 0 !important; flex: 1 1 auto !important; }
          .ows-sheet .w { min-width: 0 !important; width: 30% !important; flex: 0 0 30% !important; }
          .ows-sheet .fam { display: none !important; }
          .ows-sheet .rounded-2xl { border: none !important; border-radius: 0 !important; }
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
              <h1 className="text-lg font-black text-slate-800">One-Word Substitution</h1>
              <p className="text-[11px] text-slate-400 font-semibold">{ONE_WORD_COUNT} words · grouped by family</p>
            </div>
            <div className="ml-auto"><PrintButton label="PDF" /></div>
          </div>

          <div className="no-print mt-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a word or a definition (e.g. insects, king, sleep)…"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>

          <div className="no-print flex gap-2 mt-2 flex-wrap">
            <button onClick={() => setActiveGroup("all")}
              className="px-3 py-1.5 rounded-xl text-xs font-bold press"
              style={activeGroup === "all" ? { background: "#0f172a", color: "#fff" } : { background: "#f1f5f9", color: "#64748b" }}>
              All
            </button>
            {ONE_WORD_GROUPS.map((g) => (
              <button key={g.id} onClick={() => setActiveGroup(g.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold press"
                style={activeGroup === g.id ? { background: g.color, color: "#fff" } : { background: "#f1f5f9", color: "#64748b" }}>
                {g.emoji} {g.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-4 ows-sheet">
        {search && <p className="text-xs text-slate-400 font-semibold mb-3">{shown} matches for &quot;{search}&quot;</p>}

        {groups.map((g) => (
          <div key={g.id} className="mb-6 ows-group">
            <div className="ows-head mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{g.emoji}</span>
                <h2 className="text-base font-black text-slate-800">{g.label}</h2>
                <span className="text-xs text-slate-400 font-semibold no-print">{g.items.length}</span>
              </div>
              <p className="text-[11.5px] text-slate-500 leading-snug mt-0.5 ml-7">{g.note}</p>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 print-flat"
              style={{ boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
              {g.items.map((it, i) => (
                <div key={it.word}
                  className="ows-row flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2.5"
                  style={{ borderTop: i === 0 ? "none" : "1px solid #f1f5f9" }}>
                  <span className="d text-[13px] text-slate-600 flex-1" style={{ minWidth: "14rem" }}>
                    {it.def}
                  </span>
                  <span className="w font-black text-[13.5px]" style={{ color: g.color, minWidth: "9rem" }}>
                    {it.word}
                  </span>
                  {it.family && (
                    <span className="fam w-full text-[11px] text-slate-400 no-print">
                      often set against: {it.family.join(" · ")}
                    </span>
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
