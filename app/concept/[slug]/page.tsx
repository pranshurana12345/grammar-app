"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getConceptBySlug, CATEGORY_META, CONCEPTS } from "@/data/concepts";
import { rules } from "@/data/rules";
import { detectConcepts } from "@/data/concepts";

export default function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const concept = getConceptBySlug(slug);

  if (!concept) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-6xl mb-4">🤔</p>
          <p className="text-slate-600 font-semibold mb-4">Concept not found.</p>
          <button onClick={() => router.back()} className="text-blue-600 font-bold underline">← Go back</button>
        </div>
      </div>
    );
  }

  const c = concept.color;
  const catMeta = CATEGORY_META[concept.category];

  // Rules that reference this concept
  const relatedRules = rules.filter((r) => {
    const detected = detectConcepts(r.title, r.rule, r.extras?.join(" "));
    return detected.some((d) => d.slug === slug);
  }).slice(0, 8);

  // Related concepts (from relatedSlugs)
  const relatedConcepts = concept.relatedSlugs
    .map((s) => CONCEPTS.find((cc) => cc.slug === s))
    .filter(Boolean) as typeof CONCEPTS;

  return (
    <div className="min-h-screen pb-24" style={{ background: "#f0f4ff" }}>

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-100"
        style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center gap-3">
          <button onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm press flex-shrink-0">
            ←
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg flex-shrink-0">{concept.emoji}</span>
            <span className="font-black text-slate-900 text-sm truncate">{concept.title}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0"
              style={{ background: catMeta.color }}>{catMeta.label}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-8 space-y-8">

        {/* ── Hero ── */}
        <div className="rounded-3xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${c}15, ${c}06)`, border: `2px solid ${c}25` }}>
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0 text-3xl"
                style={{ background: `${c}20`, border: `2px solid ${c}30` }}>
                {concept.emoji}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                  style={{ background: catMeta.color }}>{catMeta.label}</span>
                <h1 className="text-4xl font-black text-slate-900 mt-2" style={{ letterSpacing: "-0.04em" }}>
                  {concept.title}
                </h1>
                <p className="text-slate-500 text-sm mt-1 font-semibold">{concept.shortDef}</p>
              </div>
            </div>

            {/* Definition */}
            <div className="rounded-2xl p-5" style={{ background: `${c}10`, borderLeft: `4px solid ${c}` }}>
              <p className="text-[15px] text-slate-800 leading-relaxed font-medium">{concept.definition}</p>
            </div>
          </div>

          {/* Structure formula */}
          {concept.structure && (
            <div className="px-8 pb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Structure / Formula</p>
              <div className="rounded-2xl px-5 py-3.5 font-mono text-base font-bold text-white"
                style={{ background: c }}>
                {concept.structure}
              </div>
            </div>
          )}
        </div>

        {/* ── Examples ── */}
        <div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">✅ Examples</p>
          <div className="space-y-3">
            {concept.examples.map((ex, i) => (
              <div key={i} className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 8px -2px rgba(15,23,42,0.06)", border: `1.5px solid ${c}15` }}>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-black mt-0.5"
                    style={{ background: c }}>{i + 1}</div>
                  <div>
                    <p className="text-base font-bold text-slate-800 leading-snug mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {ex.sentence}
                    </p>
                    {ex.note && (
                      <p className="text-[12px] text-slate-500 font-medium">→ {ex.note}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── AFCAT Tips ── */}
        <div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">📌 AFCAT Exam Tips</p>
          <div className="space-y-2.5">
            {concept.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
                <span className="text-amber-500 font-black text-sm flex-shrink-0 mt-0.5">💡</span>
                <p className="text-[13px] text-amber-900 font-medium leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Related Concepts ── */}
        {relatedConcepts.length > 0 && (
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">🔗 Related Concepts</p>
            <div className="flex flex-wrap gap-2">
              {relatedConcepts.map((rc) => (
                <Link key={rc.slug} href={`/concept/${rc.slug}`}>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm press transition-all"
                    style={{ background: `${rc.color}12`, border: `1.5px solid ${rc.color}30`, color: rc.color }}>
                    <span>{rc.emoji}</span>
                    <span>{rc.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Rules that use this concept ── */}
        {relatedRules.length > 0 && (
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">📚 Rules Using This Concept</p>
            <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 2px 12px -4px rgba(15,23,42,0.08)" }}>
              {relatedRules.map((r, i) => (
                <Link key={r.id} href={`/feed?rule=${r.id}`}>
                  <div className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer ${i > 0 ? "border-t border-slate-50" : ""}`}>
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: r.sectionColor }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{r.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{r.ruleNumber} · {r.section}</p>
                    </div>
                    <span className="text-slate-300 flex-shrink-0">›</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── All Concepts nav ── */}
        <div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">🗺 All Grammar Concepts</p>
          <div className="flex flex-wrap gap-2">
            {CONCEPTS.map((cc) => (
              <Link key={cc.slug} href={`/concept/${cc.slug}`}>
                <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold press transition-all ${cc.slug === slug ? "text-white" : "text-slate-600 bg-white hover:bg-slate-50"}`}
                  style={cc.slug === slug ? { background: cc.color } : { border: "1.5px solid #e2e8f0" }}>
                  <span className="text-xs">{cc.emoji}</span>
                  <span>{cc.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
