"use client";

import Link from "next/link";
import { CONCEPTS, CATEGORY_META, ConceptCategory } from "@/data/concepts";

const CATEGORY_ORDER: ConceptCategory[] = [
  "parts-of-speech",
  "verb-forms",
  "tenses",
  "modals",
  "sentence-structure",
  "other",
];

export default function ConceptsPage() {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    meta: CATEGORY_META[cat],
    concepts: CONCEPTS.filter((c) => c.category === cat),
  }));

  return (
    <div className="min-h-screen pb-24" style={{ background: "#f0f4ff" }}>

      {/* Header */}
      <div className="bg-white border-b border-slate-100" style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
        <div className="max-w-4xl mx-auto px-5 py-6">
          <Link href="/" className="text-slate-400 text-sm font-bold hover:text-slate-600 mb-3 inline-block">← Dashboard</Link>
          <h1 className="text-3xl font-black text-slate-900" style={{ letterSpacing: "-0.04em" }}>Grammar Concepts</h1>
          <p className="text-slate-400 mt-1 text-sm">Tap any concept to learn it in depth. Concepts link to rules that use them.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8 space-y-10">
        {grouped.map(({ cat, meta, concepts }) => (
          <div key={cat}>
            {/* Category header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-4 w-4 rounded-full" style={{ background: meta.color }} />
              <h2 className="text-[13px] font-black text-slate-500 uppercase tracking-widest">{meta.label}</h2>
              <div className="flex-1 h-px" style={{ background: `${meta.color}20` }} />
              <span className="text-[11px] font-bold text-slate-400">{concepts.length} topics</span>
            </div>

            {/* Concept cards grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {concepts.map((concept) => (
                <Link key={concept.slug} href={`/concept/${concept.slug}`} className="block press">
                  <div className="bg-white rounded-2xl p-4 h-full hover:shadow-md transition-all"
                    style={{ border: `1.5px solid ${concept.color}20`, boxShadow: "0 2px 8px -2px rgba(15,23,42,0.06)" }}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{concept.emoji}</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md text-white"
                        style={{ background: concept.color }}>{concept.category.split("-").map(w => w[0].toUpperCase()).join("")}</span>
                    </div>
                    <p className="font-black text-slate-900 text-sm mb-1">{concept.title}</p>
                    <p className="text-[11px] text-slate-500 leading-snug">{concept.shortDef}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
