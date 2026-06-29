"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { getConceptBySlug, CATEGORY_META, CONCEPTS } from "@/data/concepts";
import { rules } from "@/data/rules";
import { detectConcepts } from "@/data/concepts";
import { getConnectionsFor } from "@/data/conceptConnections";
import ConceptConnectionMap from "@/components/ConceptConnectionMap";
import RulePoints from "@/components/RulePoints";

export default function ConceptPageClient({ slug }: { slug: string }) {
  const router = useRouter();
  const concept = getConceptBySlug(slug);

  if (!concept) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: "#0f172a" }}>
        <div className="text-center">
          <p className="text-6xl mb-4">🤔</p>
          <p className="text-slate-300 font-semibold mb-4">Concept not found.</p>
          <button onClick={() => router.back()} className="text-blue-400 font-bold underline">← Go back</button>
        </div>
      </div>
    );
  }

  const c = concept.color;
  const catMeta = CATEGORY_META[concept.category];

  const relatedRules = rules.filter((r) => {
    const detected = detectConcepts(r.title, r.rule, r.extras?.join(" "));
    return detected.some((d) => d.slug === slug);
  }).slice(0, 6);

  const relatedConcepts = concept.relatedSlugs
    .map((s) => CONCEPTS.find((cc) => cc.slug === s))
    .filter(Boolean) as typeof CONCEPTS;

  const dotIdx = concept.definition.indexOf(". ");
  const defLead = dotIdx > -1 ? concept.definition.slice(0, dotIdx + 1) : concept.definition;
  const defBody = dotIdx > -1 ? concept.definition.slice(dotIdx + 2) : "";

  const { outgoing, incoming } = getConnectionsFor(slug);
  const hasConnections = outgoing.length > 0 || incoming.length > 0;

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          MOBILE  (< md)
      ══════════════════════════════════════════════════════ */}
      <div className="lg:hidden min-h-screen pb-24" style={{ background: "#0f172a" }}>

        {/* Nav */}
        <div className="sticky top-0 z-40" style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)" }}>
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 text-sm font-bold press">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              Back
            </button>
            <span className="text-[11px] font-black px-3 py-1.5 rounded-full text-white" style={{ background: catMeta.color }}>{catMeta.label}</span>
          </div>
        </div>

        {/* Hero */}
        <div className="relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${c}40 0%, #0f172a 70%)` }}>
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${c}30, transparent 70%)`, transform: "translate(-30%,-30%)" }} />
          <div className="px-6 pt-8 pb-12 relative">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5"
              style={{ background: `${c}25`, border: `1.5px solid ${c}40` }}>
              {concept.emoji}
            </div>
            <h1 className="text-5xl font-black text-white mb-2" style={{ letterSpacing: "-0.04em", lineHeight: 1.05 }}>
              {concept.title}
            </h1>
            <p className="text-slate-400 text-base font-medium mb-7">{concept.shortDef}</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { n: concept.examples.length, label: "Examples" },
                { n: concept.tips.length, label: "Exam tips" },
                { n: relatedConcepts.length, label: "Connected" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span className="text-sm font-black text-white">{s.n}</span>
                  <span className="text-[11px] font-semibold text-slate-400">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Light content panel */}
        <div style={{ background: "#f0f4ff", borderRadius: "28px 28px 0 0", marginTop: "-20px" }}>
          <div className="px-4 pt-8 pb-8 space-y-8">
            <MobileSection label="What is it?" color={c}>
              <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 4px 24px -4px rgba(15,23,42,0.10)" }}>
                <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${c}, ${c}60)` }} />
                <div className="p-6">
                  <p className="text-[19px] font-bold text-slate-900 leading-snug mb-4" style={{ fontFamily: "Georgia,'Times New Roman',serif" }}>
                    {defLead}
                  </p>
                  {defBody && (
                    <div className="border-t border-slate-100 pt-4">
                      <RulePoints text={defBody} color={c} size="sm" />
                    </div>
                  )}
                </div>
              </div>
            </MobileSection>

            {concept.structure && (
              <MobileSection label="The Formula" color={c}>
                <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 4px 24px -4px rgba(15,23,42,0.10)" }}>
                  <div className="flex flex-wrap items-center gap-2">
                    {concept.structure.split(/(\+|\|)/).map((part, i) => {
                      const t = part.trim();
                      if (!t) return null;
                      if (t === "+") return <span key={i} className="text-slate-300 font-black text-lg">+</span>;
                      if (t === "|") return (
                        <div key={i} className="flex items-center gap-2">
                          <div className="h-px w-3 bg-slate-200" />
                          <span className="text-[10px] font-black text-slate-400 uppercase">or</span>
                          <div className="h-px w-3 bg-slate-200" />
                        </div>
                      );
                      return (
                        <span key={i} className="px-4 py-2.5 rounded-2xl text-sm font-black text-white"
                          style={{ background: c, boxShadow: `0 4px 12px ${c}40` }}>
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </MobileSection>
            )}

            {hasConnections && (
              <MobileSection label="How it connects" color={c}>
                <p className="text-[12px] text-slate-400 font-semibold mb-3">
                  Visual grammar equations — tap any card to explore that concept.
                </p>
                <ConceptConnectionMap
                  slug={slug}
                  color={c}
                  outgoing={outgoing}
                  incoming={incoming}
                />
              </MobileSection>
            )}

            <MobileSection label="See it in action" color={c}>
              <div className="space-y-3">
                {concept.examples.map((ex, i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 4px 24px -4px rgba(15,23,42,0.08)" }}>
                    <div className="flex gap-4 p-5 pb-4">
                      <div className="flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm text-white mt-1" style={{ background: c }}>{i + 1}</div>
                      <p className="text-[17px] font-semibold text-slate-900 leading-snug flex-1" style={{ fontFamily: "Georgia,'Times New Roman',serif" }}>
                        &ldquo;{ex.sentence}&rdquo;
                      </p>
                    </div>
                    {ex.note && (
                      <div className="mx-4 mb-4 rounded-2xl px-4 py-3" style={{ background: `${c}0d` }}>
                        <RulePoints text={ex.note} color={c} size="sm" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </MobileSection>

            <MobileSection label="AFCAT Exam Traps" color={c}>
              <div className="space-y-2.5">
                {concept.tips.map((tip, i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden" style={{ border: "1.5px solid #fef3c7" }}>
                    <div className="flex gap-4 p-5">
                      <div className="flex-shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm text-white bg-amber-400">{i + 1}</div>
                      <div className="flex-1 pt-1">
                        <RulePoints text={tip} color="#d97706" size="sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </MobileSection>

            {relatedConcepts.length > 0 && (
              <MobileSection label="Connected Concepts" color={c}>
                <p className="text-[12px] text-slate-400 font-semibold mb-3">Learn these alongside {concept.title}.</p>
                <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
                  {relatedConcepts.map((rc) => (
                    <Link key={rc.slug} href={`/concept/${rc.slug}`} className="flex-shrink-0 press block">
                      <div className="w-40 rounded-2xl p-4" style={{ background: `${rc.color}12`, border: `1.5px solid ${rc.color}30` }}>
                        <span className="text-2xl">{rc.emoji}</span>
                        <p className="text-[13px] font-black text-slate-800 mt-2 leading-tight">{rc.title}</p>
                        <p className="text-[10px] font-bold mt-1" style={{ color: rc.color }}>{CATEGORY_META[rc.category].label}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-1.5 leading-snug line-clamp-2">{rc.shortDef}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </MobileSection>
            )}

            {relatedRules.length > 0 && (
              <MobileSection label="Practice in the 100 Rules" color={c}>
                <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 4px 24px -4px rgba(15,23,42,0.08)" }}>
                  {relatedRules.map((r, i) => (
                    <Link key={r.id} href="/feed" className="press block">
                      <div className={`flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors ${i > 0 ? "border-t border-slate-50" : ""}`}>
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.sectionColor }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-slate-800 truncate">{r.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{r.ruleNumber} · {r.section}</p>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 text-slate-300"><path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </MobileSection>
            )}

            <MobileSection label="All Concepts" color={c}>
              <div className="flex flex-wrap gap-2">
                {CONCEPTS.map((cc) => (
                  <Link key={cc.slug} href={`/concept/${cc.slug}`} className="press block">
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold"
                      style={cc.slug === slug
                        ? { background: cc.color, color: "white" }
                        : { background: "white", color: "#475569", border: "1.5px solid #e2e8f0" }}>
                      <span>{cc.emoji}</span>
                      <span>{cc.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </MobileSection>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          DESKTOP  (≥ md) — two-panel split layout
      ══════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex" style={{ minHeight: "100vh" }}>

        {/* ── LEFT PANEL — dark, sticky identity + navigation ── */}
        <div className="w-[320px] xl:w-[360px] flex-shrink-0 sticky top-0 h-screen flex flex-col overflow-y-auto"
          style={{ background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.06)", scrollbarWidth: "none" }}>

          {/* Back */}
          <div className="px-5 pt-5 pb-3 flex-shrink-0">
            <button onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 text-sm font-semibold hover:text-white transition-colors press group">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L5 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Back to Concepts
            </button>
          </div>

          {/* Glow + identity */}
          <div className="relative px-5 pb-5 flex-shrink-0">
            <div className="absolute top-0 left-0 w-56 h-56 pointer-events-none"
              style={{ background: `radial-gradient(circle at 0% 0%, ${c}25, transparent 70%)` }} />

            <span className="relative inline-block text-[10px] font-black px-2.5 py-1 rounded-full text-white mb-4"
              style={{ background: catMeta.color }}>
              {catMeta.label}
            </span>

            <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
              style={{ background: `${c}20`, border: `1.5px solid ${c}35` }}>
              {concept.emoji}
            </div>

            <h1 className="relative text-3xl font-black text-white mb-2" style={{ letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              {concept.title}
            </h1>
            <p className="relative text-slate-400 text-[13px] font-medium leading-relaxed">{concept.shortDef}</p>
          </div>

          {/* Stats row */}
          <div className="px-5 pb-4 flex-shrink-0">
            <div className="grid grid-cols-3 gap-2">
              {[
                { n: concept.examples.length, label: "Examples" },
                { n: concept.tips.length, label: "Exam tips" },
                { n: relatedConcepts.length, label: "Connected" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl p-3 text-center"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  <p className="text-lg font-black text-white">{s.n}</p>
                  <p className="text-[10px] font-semibold text-slate-500 mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-5 h-px flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }} />

          {/* Formula */}
          {concept.structure && (
            <>
              <div className="px-5 py-4 flex-shrink-0">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Formula</p>
                <div className="flex flex-wrap gap-2 items-center">
                  {concept.structure.split(/(\+|\|)/).map((part, i) => {
                    const t = part.trim();
                    if (!t) return null;
                    if (t === "+") return <span key={i} className="text-slate-600 font-black text-sm">+</span>;
                    if (t === "|") return <span key={i} className="text-slate-600 font-bold text-[10px] uppercase tracking-wide">or</span>;
                    return (
                      <span key={i} className="px-3 py-1.5 rounded-xl text-[12px] font-black text-white"
                        style={{ background: `${c}70` }}>
                        {t}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="mx-5 h-px flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }} />
            </>
          )}

          {/* Connected concepts */}
          {relatedConcepts.length > 0 && (
            <>
              <div className="px-5 py-4 flex-shrink-0">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Connected Concepts</p>
              </div>
              <div className="px-3 flex-1 overflow-y-auto pb-4" style={{ scrollbarWidth: "none" }}>
                {relatedConcepts.map((rc) => (
                  <Link key={rc.slug} href={`/concept/${rc.slug}`} className="press block">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/5 transition-colors group">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                        style={{ background: `${rc.color}20` }}>
                        {rc.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-slate-300 group-hover:text-white transition-colors leading-tight">{rc.title}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">{rc.shortDef}</p>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 text-slate-700 group-hover:text-slate-400 transition-colors">
                        <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Footer */}
          <div className="px-5 py-4 flex-shrink-0 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <Link href="/concepts" className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-[12px] font-semibold transition-colors press">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="7.5" y="1" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="1" y="7.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3" /></svg>
              Browse all concepts
            </Link>
          </div>
        </div>

        {/* ── RIGHT PANEL — light, scrollable main content ── */}
        <div className="flex-1 overflow-y-auto" style={{ background: "#f0f4ff", scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>
          <div className="max-w-4xl mx-auto px-10 py-10 space-y-12">

            {/* 1. DEFINITION */}
            <section>
              <DesktopSectionTitle color={c}>What is it?</DesktopSectionTitle>
              <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 4px 32px -8px rgba(15,23,42,0.12)" }}>
                <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${c}, ${c}40)` }} />
                <div className="p-8 lg:p-10">
                  <p className="text-2xl font-bold text-slate-900 leading-snug mb-5"
                    style={{ fontFamily: "Georgia,'Times New Roman',serif" }}>
                    {defLead}
                  </p>
                  {defBody && (
                    <div className="border-t border-slate-100 pt-5">
                      <RulePoints text={defBody} color={c} size="sm" />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 2. CONNECTIONS */}
            {hasConnections && (
              <section>
                <DesktopSectionTitle color={c}>How it Connects</DesktopSectionTitle>
                <p className="text-[13px] text-slate-400 font-semibold mb-4">
                  Visual grammar equations — click any card to explore that concept.
                </p>
                <ConceptConnectionMap slug={slug} color={c} outgoing={outgoing} incoming={incoming} />
              </section>
            )}

            {/* 3. EXAMPLES */}
            <section>
              <DesktopSectionTitle color={c}>Examples</DesktopSectionTitle>
              <div className="space-y-4">
                {concept.examples.map((ex, i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden"
                    style={{ boxShadow: "0 4px 24px -6px rgba(15,23,42,0.10)" }}>
                    <div className="flex min-h-[120px]">
                      {/* Sentence side */}
                      <div className="flex-1 p-7 flex flex-col justify-center">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black mb-4 flex-shrink-0"
                          style={{ background: c }}>
                          {i + 1}
                        </div>
                        <p className="text-[20px] font-semibold text-slate-900 leading-snug"
                          style={{ fontFamily: "Georgia,'Times New Roman',serif" }}>
                          &ldquo;{ex.sentence}&rdquo;
                        </p>
                      </div>
                      {/* Annotation side */}
                      {ex.note && (
                        <div className="w-72 xl:w-80 flex-shrink-0 p-6 flex items-start"
                          style={{ background: `${c}08`, borderLeft: `3px solid ${c}20` }}>
                          <div className="w-full">
                            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: `${c}90` }}>Note</p>
                            <RulePoints text={ex.note} color={c} size="sm" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. EXAM TIPS */}
            <section>
              <DesktopSectionTitle color={c}>AFCAT Exam Traps</DesktopSectionTitle>
              <div className="grid grid-cols-2 gap-4">
                {concept.tips.map((tip, i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 flex flex-col"
                    style={{ border: "1.5px solid #fef3c7", boxShadow: "0 2px 16px -4px rgba(217,119,6,0.12)" }}>
                    <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-white font-black text-sm mb-4 flex-shrink-0">
                      {i + 1}
                    </div>
                    <RulePoints text={tip} color="#d97706" size="sm" />
                  </div>
                ))}
              </div>
            </section>

            {/* 5. PRACTICE RULES */}
            {relatedRules.length > 0 && (
              <section>
                <DesktopSectionTitle color={c}>Practice in the 100 Rules</DesktopSectionTitle>
                <p className="text-[13px] text-slate-400 font-semibold mb-4">
                  These grammar rules directly use {concept.title} — revisit them in context.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {relatedRules.map((r) => (
                    <Link key={r.id} href="/feed" className="press block">
                      <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3 hover:shadow-md transition-all"
                        style={{ border: `1.5px solid ${r.sectionColor}20` }}>
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: r.sectionColor }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-slate-800 truncate">{r.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{r.ruleNumber} · {r.section}</p>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 text-slate-300">
                          <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 6. ALL CONCEPTS */}
            <section>
              <DesktopSectionTitle color={c}>All Grammar Concepts</DesktopSectionTitle>
              <div className="flex flex-wrap gap-2">
                {CONCEPTS.map((cc) => (
                  <Link key={cc.slug} href={`/concept/${cc.slug}`} className="press block">
                    <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all"
                      style={cc.slug === slug
                        ? { background: cc.color, color: "white" }
                        : { background: "white", color: "#475569", border: "1.5px solid #e2e8f0" }}>
                      <span>{cc.emoji}</span>
                      <span>{cc.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}

function MobileSection({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</p>
      {children}
    </div>
  );
}

function DesktopSectionTitle({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{children}</h2>
      <div className="flex-1 h-px" style={{ background: `${color}25` }} />
    </div>
  );
}
