"use client";

import Link from "next/link";

const SECTIONS = [
  {
    href: "/reference/verb-forms",
    emoji: "⚡",
    title: "Verb Forms",
    subtitle: "V1 / V2 / V3 tables",
    description: "All irregular verb forms grouped by pattern: AAA, ABB, ABA, ABC, and tricky special cases like lie/lay.",
    color: "#2563eb",
    count: "130+ verbs",
    tags: ["V1 V2 V3", "irregular", "tenses", "error-spotting"],
  },
  {
    href: "/reference/confusables",
    emoji: "🔀",
    title: "Confusable Words",
    subtitle: "Sound-alikes · spelling traps",
    description: "Commonly confused pairs: affect/effect, lie/lay, principal/principle, fewer/less, stationary/stationery and more.",
    color: "#dc2626",
    count: "35+ pairs",
    tags: ["affect/effect", "spelling", "prepositions", "AFCAT traps"],
  },
];

export default function ReferencePage() {
  return (
    <div className="min-h-screen sidebar-offset pb-20" style={{ background: "#f0f4ff" }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10" style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-black text-slate-800">Reference</h1>
          <p className="text-sm text-slate-400 font-semibold mt-0.5">Quick-access tables for AFCAT exam prep</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Intro callout */}
        <div className="px-4 py-4 rounded-2xl bg-blue-50 border border-blue-200 mb-6">
          <p className="text-sm font-black text-blue-800 mb-1">📚 What is this section?</p>
          <p className="text-sm text-blue-700">
            Reference tables for things you need to memorise — verb forms, commonly confused words, and special cases. Use these alongside the Grammar Rules section.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="block press">
              <div
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 h-full"
                style={{ boxShadow: "0 4px 16px rgba(15,23,42,0.06)" }}
              >
                {/* Top accent */}
                <div className="h-1.5" style={{ background: s.color }} />
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `${s.color}15` }}
                    >
                      {s.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-black text-slate-800">{s.title}</h2>
                        <span
                          className="text-[10px] font-black px-2 py-0.5 rounded-full"
                          style={{ background: `${s.color}15`, color: s.color }}
                        >
                          {s.count}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-semibold mb-2">{s.subtitle}</p>
                      <p className="text-sm text-slate-600 leading-snug">{s.description}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-black" style={{ color: s.color }}>Open →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tip */}
        <div className="mt-6 px-4 py-4 rounded-2xl bg-amber-50 border border-amber-200">
          <p className="text-xs font-black text-amber-800 mb-1">🎯 How to use Reference</p>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• After learning a grammar rule, check the Verb Forms table to reinforce the correct V1/V2/V3</li>
            <li>• Before the exam, scan the Confusables list — these are the top error-spotting traps</li>
            <li>• The search bar in each section makes it fast to look up a specific word during revision</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
