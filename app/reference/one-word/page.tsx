"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { ONE_WORD_GROUPS, ONE_WORD_COUNT } from "@/data/oneWord";
import { WORD_TABLES, WORD_TABLE_ROW_COUNT } from "@/data/oneWordTables";

// Definition on the left, the word on the right — the direction the exam asks
// it in. Grouped by family, because the four options always come from one.
//
// Print layout follows /reference/pairs: the same markup as the screen, one
// item per line. No second print-only DOM (see the idioms page for why not).
export default function OneWordPage() {
  const [activeGroup, setActiveGroup] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "tables">("list");

  // Table view: same vocabulary, organised by shared stem so one row teaches
  // three or four words instead of one. Search filters whole rows.
  const tables = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return WORD_TABLES;
    return WORD_TABLES
      .map((t) => ({ ...t, rows: t.rows.filter((r) => r.some((c) => c.toLowerCase().includes(q))) }))
      .filter((t) => t.rows.length > 0);
  }, [search]);

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
          /* Table view: print the same markup, just quieter. The scroll
             container must not clip, and rows must not split across pages. */
          .ows-sheet .overflow-x-auto { overflow: visible !important; }
          .ows-sheet table { width: 100% !important; min-width: 0 !important; font-size: 9pt; }
          .ows-sheet thead { display: table-header-group; }
          .ows-sheet th, .ows-sheet td { padding: 2.5px 6px !important; }
          .ows-sheet tr.ows-row { padding: 0 !important; }
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
              <p className="text-[11px] text-slate-400 font-semibold">
                {view === "list"
                  ? `${ONE_WORD_COUNT} words · grouped by family`
                  : `${WORD_TABLE_ROW_COUNT} rows · learn the stem, get every form`}
              </p>
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

          {/* Same words, two ways in: the exam's grouping, or the stem's. */}
          <div className="no-print mt-3 flex gap-1 p-1 rounded-xl bg-slate-100">
            {([["list", "📋", "By family"], ["tables", "🔗", "Paired tables"]] as const).map(([v, icon, label]) => (
              <button key={v} onClick={() => setView(v)}
                className="flex-1 px-3 py-1.5 rounded-lg text-xs font-bold press transition-colors"
                style={view === v ? { background: "#fff", color: "#0f172a", boxShadow: "0 1px 3px rgba(15,23,42,0.1)" } : { color: "#64748b" }}>
                {icon} {label}
              </button>
            ))}
          </div>

          <div className={`no-print flex gap-2 mt-2 flex-wrap ${view === "tables" ? "hidden" : ""}`}>
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
        {search && view === "list" && <p className="text-xs text-slate-400 font-semibold mb-3">{shown} matches for &quot;{search}&quot;</p>}

        {view === "tables" && tables.map((t) => (
          <div key={t.id} className="mb-6 ows-group">
            <div className="ows-head mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{t.emoji}</span>
                <h2 className="text-base font-black text-slate-800">{t.label}</h2>
              </div>
              <p className="text-[11.5px] text-slate-500 leading-snug mt-0.5 ml-7">{t.note}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-x-auto print-flat"
              style={{ boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
              <table className="w-full" style={{ borderCollapse: "collapse", minWidth: t.columns.length > 3 ? "34rem" : undefined }}>
                <thead>
                  <tr>
                    {t.columns.map((col, ci) => (
                      <th key={col}
                        className="text-left px-3 py-2 text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                        style={{ background: `${t.color}0d`, color: t.color, borderBottom: `1px solid ${t.color}22` }}>
                        {ci === 0 ? col : `→ ${col}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((row, ri) => (
                    <tr key={ri} className="ows-row">
                      {row.map((cell, ci) => (
                        <td key={ci}
                          className={ci === 0
                            ? "px-3 py-2 text-[12.5px] text-slate-600 align-top"
                            : "px-3 py-2 text-[13px] font-bold align-top"}
                          style={{
                            borderTop: ri === 0 ? "none" : "1px solid #f1f5f9",
                            color: ci === 0 ? undefined : cell === "—" ? "#cbd5e1" : t.color,
                          }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {t.irregulars && t.irregulars.length > 0 && (
              <div className="mt-2 rounded-xl px-3.5 py-3" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
                <p className="text-[9.5px] font-black uppercase tracking-widest text-orange-600 mb-1.5">
                  ⚠️ Breaks the pattern — where the marks are lost
                </p>
                <div className="space-y-1">
                  {t.irregulars.map((ir) => (
                    <p key={ir.word} className="text-[12px] leading-snug text-slate-700">
                      <span className="font-black text-orange-800">{ir.word}</span>
                      <span className="text-slate-500"> — {ir.why}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {view === "tables" && tables.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-slate-500 font-semibold">No row matches &quot;{search}&quot;</p>
            <button onClick={() => setSearch("")} className="mt-2 text-blue-600 text-sm font-bold press">Clear search</button>
          </div>
        )}

        {view === "list" && groups.map((g) => (
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

        {view === "list" && groups.length === 0 && (
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
