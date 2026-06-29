"use client";

import { useState, useMemo } from "react";
import { CONFUSABLE_CATEGORIES } from "@/data/confusables";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";

export default function ConfusablesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim();
    return CONFUSABLE_CATEGORIES.map((cat) => ({
      ...cat,
      pairs: cat.pairs.filter(
        (p) =>
          !q ||
          p.words.some(
            (w) =>
              w.word.toLowerCase().includes(q) ||
              w.meaning.toLowerCase().includes(q) ||
              w.example.toLowerCase().includes(q)
          ) ||
          p.tip.toLowerCase().includes(q)
      ),
    })).filter((cat) => (activeCategory === "all" || cat.id === activeCategory) && cat.pairs.length > 0);
  }, [search, activeCategory]);

  const totalPairs = CONFUSABLE_CATEGORIES.reduce((s, c) => s + c.pairs.length, 0);

  return (
    <div className="min-h-screen pb-20" style={{ background: "#f0f4ff" }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20 print-static" style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/reference" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm press lg:hidden">←</Link>
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/reference" className="text-slate-400 text-sm hover:text-slate-600 press">Study Hub</Link>
              <span className="text-slate-300">/</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800">Confusable Words</h1>
              <p className="text-[11px] text-slate-400 font-semibold">{totalPairs} pairs · sound-alikes · spelling traps</p>
            </div>
            <div className="ml-auto"><PrintButton label="PDF" /></div>
          </div>

          {/* Search */}
          <div className="no-print mt-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search words (e.g. affect, between, loose)..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>

          {/* Category filters */}
          <div className="no-print flex gap-2 mt-2 flex-wrap">
            <button
              onClick={() => setActiveCategory("all")}
              className="px-3 py-1.5 rounded-xl text-xs font-bold press"
              style={activeCategory === "all" ? { background: "#0f172a", color: "#fff" } : { background: "#f1f5f9", color: "#64748b" }}
            >
              All
            </button>
            {CONFUSABLE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold press"
                style={activeCategory === cat.id ? { background: cat.color, color: "#fff" } : { background: "#f1f5f9", color: "#64748b" }}
              >
                {cat.emoji} {cat.label.split(" ")[cat.label.split(" ").length > 2 ? 1 : 0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-4">
        {search && (
          <p className="text-xs text-slate-400 font-semibold mb-3">
            {filteredCategories.reduce((s, c) => s + c.pairs.length, 0)} results for &quot;{search}&quot;
          </p>
        )}

        {filteredCategories.map((cat) => (
          <div key={cat.id} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{cat.emoji}</span>
              <h2 className="text-base font-black text-slate-800">{cat.label}</h2>
              <span className="text-xs text-slate-400 font-semibold">{cat.pairs.length} pairs</span>
            </div>

            <div className="space-y-3">
              {cat.pairs.map((pair, pi) => {
                const key = `${cat.id}-${pi}`;
                const isExpanded = expandedIndex === key;

                return (
                  <div
                    key={pi}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
                    style={{ boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}
                  >
                    {/* Word pills row */}
                    <div className="px-4 pt-4 pb-3">
                      <div className="flex items-start gap-3 flex-wrap">
                        {pair.words.map((w, wi) => (
                          <div key={wi} className="flex-1 min-w-0" style={{ minWidth: "140px" }}>
                            <div className="flex items-baseline gap-1.5 mb-1">
                              <span className="font-black text-base text-slate-800">{w.word}</span>
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                style={{ background: `${cat.color}15`, color: cat.color }}
                              >
                                {w.partOfSpeech}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-snug">{w.meaning}</p>
                            <p className="text-[11px] text-slate-400 mt-1 italic">{w.example}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tip bar */}
                    <div
                      className="px-4 py-3 cursor-pointer press flex items-start gap-2"
                      style={{ background: `${cat.color}08`, borderTop: `1px solid ${cat.color}20` }}
                      onClick={() => setExpandedIndex(isExpanded ? null : key)}
                    >
                      <span className="text-sm mt-0.5">💡</span>
                      <p className="text-xs font-semibold text-slate-700 leading-snug flex-1">{pair.tip}</p>
                      <span className="text-slate-400 text-sm ml-2 flex-shrink-0">{isExpanded ? "▲" : "▼"}</span>
                    </div>

                    {/* AFCAT note — expandable */}
                    {isExpanded && pair.afcatNote && (
                      <div className="px-4 py-3 bg-amber-50 border-t border-amber-200">
                        <div className="flex items-start gap-2">
                          <span className="text-sm flex-shrink-0">🎯</span>
                          <div>
                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-wide mb-0.5">AFCAT Note</p>
                            <p className="text-xs text-amber-800">{pair.afcatNote}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {isExpanded && !pair.afcatNote && (
                      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
                        <p className="text-xs text-slate-400 italic">No specific AFCAT note for this pair.</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-slate-500 font-semibold">No matches for &quot;{search}&quot;</p>
            <button onClick={() => setSearch("")} className="mt-2 text-blue-600 text-sm font-bold press">Clear search</button>
          </div>
        )}

        <div className="mt-2 px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-semibold">Tap any card&apos;s tip to reveal the AFCAT-specific note</p>
        </div>
      </div>
    </div>
  );
}
