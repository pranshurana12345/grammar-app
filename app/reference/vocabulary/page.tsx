"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import EmojiPic from "@/components/EmojiPic";
import { VOCAB } from "@/data/vocabulary";

const ACCENT = "#0d9488"; // teal — the Vocabulary theme colour

export default function VocabularyPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return VOCAB;
    return VOCAB.filter(
      (w) =>
        w.phrase.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q) ||
        w.synonyms?.some((s) => s.toLowerCase().includes(q)) ||
        w.antonyms?.some((a) => a.toLowerCase().includes(q)),
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
              <h1 className="text-lg font-black text-slate-800">Vocabulary</h1>
              <p className="text-[11px] text-slate-400 font-semibold">{VOCAB.length} AFCAT previous-year words · meaning + syn/ant</p>
            </div>
            <PrintButton />
          </div>

          {/* Search */}
          <div className="no-print mt-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search words, meanings, synonyms…"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-teal-400 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-6 pt-5">
        {search && (
          <p className="text-xs text-slate-400 font-semibold mb-3">{filtered.length} result{filtered.length === 1 ? "" : "s"} for &quot;{search}&quot;</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((w) => (
            <div key={w.phrase}
              className="bg-white rounded-2xl border border-slate-100 p-4 flex items-start gap-3.5 print-avoid-break"
              style={{ boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}22` }}>
                <EmojiPic pic={w.pic} single={28} filter={w.picFilter} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-[15px] font-black text-slate-900 tracking-tight leading-tight">{w.phrase}</h2>
                <p className="text-[13px] text-slate-600 leading-snug mt-0.5">{w.meaning}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                  {w.synonyms && w.synonyms.length > 0 && (
                    <p className="text-[11.5px] leading-snug"><span className="font-black text-emerald-600">Syn</span> <span className="text-slate-500 font-medium">{w.synonyms.join(", ")}</span></p>
                  )}
                  {w.antonyms && w.antonyms.length > 0 && (
                    <p className="text-[11.5px] leading-snug"><span className="font-black text-rose-500">Ant</span> <span className="text-slate-500 font-medium">{w.antonyms.join(", ")}</span></p>
                  )}
                </div>
                <p className="text-[12px] text-slate-400 italic leading-snug mt-1.5">“{w.example}”</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-slate-400 text-sm py-12">No words match “{search}”.</div>
        )}

        <div className="mt-6 px-5 py-4 rounded-2xl bg-teal-50 border border-teal-200">
          <p className="text-[12.5px] text-teal-800 leading-relaxed">
            💡 These words come from <b>real AFCAT papers (2015–2019)</b> — the exam recycles its word bank,
            so knowing these gives you a real edge. Flip through them reel-style in the <b>Reels</b> tab.
          </p>
        </div>
      </div>
    </div>
  );
}
