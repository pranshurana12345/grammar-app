"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import IdiomReel from "@/components/IdiomReel";
import { IDIOMS } from "@/data/idioms";

const ACCENT = "#d97706"; // amber — the Idioms theme colour

export default function IdiomsPage() {
  const [search, setSearch] = useState("");
  const [reelIndex, setReelIndex] = useState<number | null>(null);

  // Open the full-screen reel — mobile only.
  function openReel(i: number) {
    if (typeof window !== "undefined" && window.matchMedia("(min-width:1024px)").matches) return;
    setReelIndex(i);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return IDIOMS;
    return IDIOMS.filter(
      (i) => i.phrase.toLowerCase().includes(q) || i.meaning.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="min-h-screen pb-28 lg:pb-10" style={{ background: "#f0f4ff" }}>

      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10 print-static" style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/reference" className="no-print w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm flex-shrink-0 press lg:hidden">←</Link>
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <Link href="/reference" className="text-slate-400 text-sm hover:text-slate-600 press">Study Hub</Link>
              <span className="text-slate-300">/</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-black text-slate-800">Idioms &amp; Phrases</h1>
              <p className="text-[11px] text-slate-400 font-semibold">{IDIOMS.length} must-know idioms · picture + meaning</p>
            </div>
            <PrintButton />
          </div>

          {/* Search */}
          <div className="no-print mt-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search idioms (e.g. cake, ice, expensive)…"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-amber-400 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-6 pt-5">
        {search && (
          <p className="text-xs text-slate-400 font-semibold mb-3">{filtered.length} result{filtered.length === 1 ? "" : "s"} for &quot;{search}&quot;</p>
        )}

        {/* Mobile-only reel hint */}
        <p className="no-print lg:hidden text-[12px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2 mb-3 flex items-center gap-2">
          <span>▶️</span> Tap any idiom for a reel — random order, swipe to flip, 👁 to practice.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((idi, i) => (
            <div key={idi.phrase}
              onClick={() => openReel(i)}
              className="bg-white rounded-2xl border border-slate-100 p-4 flex items-start gap-3.5 print-avoid-break cursor-pointer active:scale-[0.98] transition-transform lg:cursor-default lg:active:scale-100"
              style={{ boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}>
              {/* Picture */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-[28px] leading-none"
                style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}22` }}>
                {idi.pic}
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <h2 className="text-[15px] font-black text-slate-900 tracking-tight leading-tight">{idi.phrase}</h2>
                <p className="text-[13px] text-slate-600 leading-snug mt-0.5">{idi.meaning}</p>
                <p className="text-[12px] text-slate-400 italic leading-snug mt-1.5">“{idi.example}”</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-slate-400 text-sm py-12">No idioms match “{search}”.</div>
        )}

        {/* Tip */}
        <div className="mt-6 px-5 py-4 rounded-2xl bg-amber-50 border border-amber-200">
          <p className="text-xs font-bold text-amber-800 mb-1.5">How to remember idioms</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            Link the <b>picture</b> to the <b>meaning</b>, then read the example aloud. The image is the hook —
            recall the emoji and the meaning follows. Use <b>Download PDF</b> to revise the full list offline.
          </p>
        </div>
      </div>

      {/* Full-screen reel (mobile) */}
      {reelIndex !== null && (
        <IdiomReel idioms={filtered} startIndex={reelIndex} onClose={() => setReelIndex(null)} />
      )}
    </div>
  );
}
