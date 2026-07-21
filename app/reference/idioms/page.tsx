"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import EmojiPic from "@/components/EmojiPic";
import PatternAnalysis from "@/components/PatternAnalysis";
import IdiomDetail from "@/components/IdiomDetail";
import { IDIOMS, IDIOM_GROUPS, type Idiom } from "@/data/idioms";

const ACCENT = "#d97706"; // amber — the Idioms theme colour

// ── Notes view ───────────────────────────────────────────────────────────────
// Deliberately quiet: one line per idiom (picture · name · meaning) grouped by
// theme, because that is how you revise 400 of them without drowning. Everything
// else — where the phrase comes from, the hard words inside it — lives one tap
// away in the detail sheet.
export default function IdiomsPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<Idiom | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const q = search.toLowerCase().trim();
  const groups = useMemo(() => {
    if (!q) return IDIOM_GROUPS;
    return IDIOM_GROUPS
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (i) => i.phrase.toLowerCase().includes(q) || i.meaning.toLowerCase().includes(q) ||
            (i.story ?? "").toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [q]);

  const resultCount = groups.reduce((n, g) => n + g.items.length, 0);

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
              <p className="text-[11px] text-slate-400 font-semibold">
                {IDIOMS.length} idioms · {IDIOM_GROUPS.length} themes · tap any one for its story
              </p>
            </div>
            <PrintButton />
          </div>

          {/* Search */}
          <div className="no-print mt-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search idioms, meanings or stories…"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 outline-none focus:border-amber-400 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-6 pt-5">
        <PatternAnalysis
          accent={ACCENT}
          subject="idioms & phrases"
          points={[
            { icon: "🔢", head: "Weight", body: "Usually 3–5 idiom questions per AFCAT paper, 10 in CDS, 5–7 in NDA. Easy-to-moderate difficulty — among the fastest marks in the paper." },
            { icon: "🧩", head: "Why grouped", body: "The exam's trap is putting four idioms with SIMILAR meanings in the options. Learning them in families — every 'defeat' idiom together, every 'ear' idiom together — is what stops you second-guessing." },
            { icon: "🪤", head: "The trap", body: "One option is always the LITERAL word-for-word reading ('rain cats and dogs' → 'cats and dogs fight'; 'smell a rat' → 'to smell a bad odour'). Eliminate it first." },
            { icon: "📖", head: "Learn the story", body: "Tap any idiom for where it came from. 'Keep the wolf from the door' sounds like danger and actually means hunger — you only remember which once you know why." },
          ]}
          tip="Always think FIGURATIVE: picture the emoji, not the words. In sentence-format questions, plug each option into the sentence — only the true meaning keeps it natural."
        />

        {search && (
          <p className="text-xs text-slate-400 font-semibold mb-3">
            {resultCount} result{resultCount === 1 ? "" : "s"} for &quot;{search}&quot;
          </p>
        )}

        <div className="space-y-4">
          {groups.map((g) => {
            const isCollapsed = !q && collapsed[g.name];
            return (
              <section key={g.name} className="print-avoid-break">
                {/* group header */}
                <button
                  onClick={() => setCollapsed((c) => ({ ...c, [g.name]: !c[g.name] }))}
                  className="w-full text-left press mb-2"
                  aria-expanded={!isCollapsed}>
                  <div className="flex items-center gap-2.5 px-1">
                    <span className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                      style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}30` }}>{g.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-[14px] font-black text-slate-800 leading-tight">{g.name}</h2>
                      <p className="text-[10.5px] font-bold text-slate-400">{g.items.length} idioms</p>
                    </div>
                    <span className="no-print text-slate-300 text-sm flex-shrink-0"
                      style={{ transform: isCollapsed ? "rotate(-90deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                  </div>
                </button>

                {/* why these sit together */}
                {!isCollapsed && (
                  <p className="text-[11.5px] text-slate-500 leading-snug mb-2.5 px-1 italic">{g.note}</p>
                )}

                {!isCollapsed && (
                  <div className="bg-white rounded-2xl overflow-hidden divide-y divide-slate-50"
                    style={{ border: "1px solid #eef2f7", boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}>
                    {g.items.map((idi) => (
                      <button key={idi.phrase} onClick={() => setOpen(idi)}
                        className="w-full text-left press flex items-center gap-3 px-3.5 py-2.5 hover:bg-slate-50 transition-colors">
                        <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${ACCENT}10` }}>
                          <EmojiPic pic={idi.pic} single={19} filter={idi.picFilter} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[13.5px] font-black text-slate-900 leading-tight truncate">{idi.phrase}</span>
                          <span className="block text-[12px] text-slate-500 leading-snug truncate">{idi.meaning}</span>
                        </span>
                        <span className="no-print text-slate-200 text-base flex-shrink-0">›</span>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {resultCount === 0 && (
          <div className="text-center text-slate-400 text-sm py-12">No idioms match “{search}”.</div>
        )}

        <div className="mt-6 px-5 py-4 rounded-2xl bg-amber-50 border border-amber-200">
          <p className="text-xs font-bold text-amber-800 mb-1.5">Tip</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            Tap any idiom to see where it came from — the story is what makes it stick. For the swipeable version, open the <b>Reels</b> tab from the bottom bar.
          </p>
        </div>
      </div>

      <IdiomDetail idiom={open} onClose={() => setOpen(null)} />
    </div>
  );
}
