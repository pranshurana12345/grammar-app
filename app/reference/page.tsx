"use client";

import Link from "next/link";

const SECTIONS = [
  {
    href: "/reference/tenses",
    title: "Learn Tenses",
    subtitle: "Past · Present · Future, side by side",
    description: "All 12 tenses grouped by aspect so the only difference jumps out — e.g. Past Perfect (had + V3) vs Present Perfect (has/have + V3).",
    color: "#7c3aed",
    count: "12 tenses",
    tags: ["perfect", "continuous", "formulas", "compare"],
  },
  {
    href: "/reference/verb-forms",
    title: "Verb Forms",
    subtitle: "V1 · V2 · V3 tables",
    description: "All irregular verb forms grouped by pattern — AAA, ABB, ABA, ABC — plus tricky cases like lie/lay/lain.",
    color: "#2563eb",
    count: "130+ verbs",
    tags: ["V1 V2 V3", "irregular", "tenses", "error-spotting"],
  },
  {
    href: "/reference/confusables",
    title: "Confusable Words",
    subtitle: "Sound-alikes · spelling traps",
    description: "Commonly confused pairs: affect/effect, lie/lay, principal/principle, fewer/less, stationary/stationery.",
    color: "#dc2626",
    count: "35+ pairs",
    tags: ["affect/effect", "spelling", "prepositions", "AFCAT traps"],
  },
];

export default function ReferencePage() {
  return (
    <div className="min-h-screen pb-28 lg:pb-8" style={{ background: "#f0f4ff" }}>

      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10" style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
        <div className="px-6 lg:px-10 py-5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reference</h1>
          <p className="text-sm text-slate-400 mt-0.5">Quick-access tables for AFCAT exam preparation</p>
        </div>
      </div>

      <div className="px-6 lg:px-10 pt-8">

        {/* Cards — 2 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="block press group">
              <div
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 h-full transition-shadow group-hover:shadow-md"
                style={{ boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}
              >
                <div className="h-[3px]" style={{ background: s.color }} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">{s.title}</h2>
                      <p className="text-xs text-slate-400 mt-0.5 font-medium">{s.subtitle}</p>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg flex-shrink-0"
                      style={{ background: `${s.color}12`, color: s.color }}>
                      {s.count}
                    </span>
                  </div>

                  <p className="text-[13px] text-slate-600 leading-relaxed mb-4">{s.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {s.tags.map((t) => (
                      <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{t}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: s.color }}>
                    <span>Open</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tip */}
        <div className="mt-8 max-w-4xl px-5 py-4 rounded-2xl bg-amber-50 border border-amber-200">
          <p className="text-xs font-semibold text-amber-800 mb-2">How to use this section</p>
          <ul className="text-xs text-amber-700 space-y-1.5">
            <li>Confused by tenses? Open Learn Tenses and compare Past/Present/Future side by side.</li>
            <li>After learning a grammar rule, check Verb Forms to reinforce the correct V1/V2/V3.</li>
            <li>Before the exam, scan Confusables — these are the top error-spotting traps.</li>
            <li>Use the search bar in each section to look up a specific word quickly.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
