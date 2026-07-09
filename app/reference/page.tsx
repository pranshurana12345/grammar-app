"use client";

import Link from "next/link";

type Motif = "concepts" | "tenses" | "verbs" | "confusables" | "idioms" | "vocab";

const SECTIONS: {
  href: string; title: string; overview: string; count: string;
  color: string; gradient: string; motif: Motif; soon?: boolean;
}[] = [
  {
    href: "/concepts",
    title: "Concepts",
    overview: "Visual mind-maps connecting the rules.",
    count: "Mind maps",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg,#5b21b6 0%,#8b5cf6 100%)",
    motif: "concepts",
  },
  {
    href: "/reference/tenses",
    title: "Learn Tenses",
    overview: "All 12 tenses, compared side by side.",
    count: "12 tenses",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg,#6d28d9 0%,#9333ea 100%)",
    motif: "tenses",
  },
  {
    href: "/reference/verb-forms",
    title: "Verb Forms",
    overview: "V1 · V2 · V3 for 130+ irregular verbs.",
    count: "130+ verbs",
    color: "#2d7ff9",
    gradient: "linear-gradient(135deg,#1257d6 0%,#5aa0ff 100%)",
    motif: "verbs",
  },
  {
    href: "/reference/confusables",
    title: "Confusable Words",
    overview: "35+ word pairs people mix up.",
    count: "35+ pairs",
    color: "#dc2626",
    gradient: "linear-gradient(135deg,#e11d48 0%,#fb7185 100%)",
    motif: "confusables",
  },
  {
    href: "/reference/idioms",
    title: "Idioms & Phrases",
    overview: "Picture-based idioms that stick.",
    count: "75+ idioms",
    color: "#d97706",
    gradient: "linear-gradient(135deg,#d97706 0%,#f59e0b 100%)",
    motif: "idioms",
  },
  {
    href: "/reference/vocabulary",
    title: "Vocabulary",
    overview: "Real AFCAT previous-year words.",
    count: "70 words",
    color: "#0d9488",
    gradient: "linear-gradient(135deg,#0f766e 0%,#14b8a6 100%)",
    motif: "vocab",
  },
];

/* Themed banner artwork drawn with SVG (no image files — works offline). */
function BannerArt({ motif }: { motif: Motif }) {
  if (motif === "concepts")
    return (
      <svg width="140" height="78" viewBox="0 0 140 78" fill="none">
        <path d="M70 39L30 18M70 39l40-21M70 39L34 62M70 39l38 22" stroke="white" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="70" cy="39" r="13" fill="white" fillOpacity="0.95" />
        <circle cx="30" cy="18" r="8" fill="white" fillOpacity="0.75" />
        <circle cx="110" cy="18" r="8" fill="white" fillOpacity="0.75" />
        <circle cx="34" cy="62" r="8" fill="white" fillOpacity="0.75" />
        <circle cx="108" cy="61" r="8" fill="white" fillOpacity="0.75" />
        <text x="70" y="44" fill="#6d28d9" fontSize="13" fontWeight="900" textAnchor="middle">💡</text>
      </svg>
    );
  if (motif === "tenses")
    return (
      <svg width="140" height="78" viewBox="0 0 140 78" fill="none">
        <line x1="16" y1="42" x2="124" y2="42" stroke="white" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
        <path d="M119 37l7 5-7 5" stroke="white" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {[18, 70, 120].map((x, i) => (
          <circle key={x} cx={x} cy="42" r={i === 1 ? 10 : 7} fill="white" fillOpacity={i === 1 ? 1 : 0.8} />
        ))}
        <text x="18" y="20" fill="white" fillOpacity="0.85" fontSize="11" fontWeight="800" textAnchor="middle">P</text>
        <text x="70" y="20" fill="white" fontSize="11" fontWeight="800" textAnchor="middle">Pr</text>
        <text x="120" y="20" fill="white" fillOpacity="0.85" fontSize="11" fontWeight="800" textAnchor="middle">F</text>
      </svg>
    );
  if (motif === "verbs")
    return (
      <svg width="150" height="70" viewBox="0 0 150 70" fill="none">
        {["V1", "V2", "V3"].map((t, i) => (
          <g key={t} transform={`translate(${8 + i * 48}, 16)`}>
            <rect width="42" height="40" rx="9" fill="white" fillOpacity={0.94 - i * 0.13} />
            <text x="21" y="26" fill="#1257d6" fontSize="16" fontWeight="900" textAnchor="middle">{t}</text>
          </g>
        ))}
      </svg>
    );
  if (motif === "confusables")
    return (
      <svg width="128" height="76" viewBox="0 0 128 76" fill="none">
        <text x="26" y="34" fill="white" fontSize="28" fontWeight="900" textAnchor="middle">A</text>
        <text x="104" y="56" fill="white" fillOpacity="0.85" fontSize="28" fontWeight="900" textAnchor="middle">B</text>
        <path d="M44 28h36M73 21l9 7-9 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M86 50H50M57 43l-9 7 9 7" stroke="white" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (motif === "idioms")
    return (
      <svg width="124" height="80" viewBox="0 0 124 80" fill="none">
        <rect x="20" y="12" width="84" height="46" rx="13" fill="white" fillOpacity="0.92" />
        <path d="M38 56 L31 72 L54 56 Z" fill="white" fillOpacity="0.92" />
        <text x="62" y="46" fill="#b45309" fontSize="30" fontWeight="900" textAnchor="middle">“ ”</text>
      </svg>
    );
  // vocab — big "Aa" with dictionary lines
  return (
    <svg width="146" height="78" viewBox="0 0 146 78" fill="none">
      <text x="32" y="52" fill="white" fontSize="40" fontWeight="900" textAnchor="middle">Aa</text>
      <rect x="78" y="24" width="54" height="7" rx="3.5" fill="white" fillOpacity="0.9" />
      <rect x="78" y="38" width="40" height="7" rx="3.5" fill="white" fillOpacity="0.7" />
      <rect x="78" y="52" width="48" height="7" rx="3.5" fill="white" fillOpacity="0.55" />
    </svg>
  );
}

export default function StudyHubPage() {
  return (
    <div className="min-h-screen pb-28 lg:pb-10" style={{ background: "#f0f4ff" }}>

      {/* ── Compact header banner ── */}
      <div className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#312e81 0%,#4f46e5 55%,#7c3aed 100%)", borderRadius: "0 0 24px 24px" }}>
        <div className="absolute top-0 right-0 w-44 h-44 rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(30%,-35%)" }} />
        <div className="relative px-5 lg:px-10 pt-9 lg:pt-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.18)" }}>
              🎯
            </div>
            <div>
              <p className="text-violet-200 text-[10px] font-bold uppercase tracking-[0.18em] mb-0.5">AFCAT English Prep</p>
              <h1 className="text-[24px] lg:text-3xl font-black text-white leading-none tracking-tight">Study Hub</h1>
            </div>
          </div>
          <p className="text-[12.5px] lg:text-[14px] text-indigo-100 leading-snug mt-2.5">
            Everything beyond the 100 rules — guided lessons, tables, and word traps.
          </p>
        </div>
      </div>

      {/* ── Tool cards: ~75% banner image, ~25% white strip ── */}
      <div className="px-4 lg:px-10 pt-5">
        {/* Mobile: compact 2-col square tiles */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          {SECTIONS.map((s) => {
            const tile = (
              <div className="relative aspect-square rounded-2xl overflow-hidden" style={{ background: s.gradient, boxShadow: "0 2px 8px rgba(15,23,42,0.08)" }}>
                <div className="absolute inset-0 opacity-90" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)", backgroundSize: "11px 11px" }} />
                <div className="absolute -top-8 -right-6 w-28 h-28 rounded-full opacity-25" style={{ background: "radial-gradient(circle, white, transparent)" }} />
                <div className="absolute inset-x-0 top-2 bottom-11 flex items-center justify-center">
                  <div style={{ transform: "scale(0.7)" }}><BannerArt motif={s.motif} /></div>
                </div>
                <span className="absolute top-2.5 right-2.5 text-[8.5px] font-black px-1.5 py-0.5 rounded text-white" style={{ background: s.soon ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)" }}>
                  {s.soon ? "SOON" : s.count}
                </span>
                <h2 className="absolute left-3 right-3 bottom-3 text-white text-[15px] font-black leading-tight tracking-tight" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.30)" }}>
                  {s.title}
                </h2>
              </div>
            );
            return s.soon ? (
              <div key={s.href} className="cursor-default select-none">{tile}</div>
            ) : (
              <Link key={s.href} href={s.href} className="press block">{tile}</Link>
            );
          })}
        </div>

        {/* Desktop: banner cards */}
        <div className="hidden lg:grid grid-cols-2 gap-5 max-w-4xl">
          {SECTIONS.map((s) => {
            const card = (
              <div className={`bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col h-[256px] transition-shadow ${s.soon ? "" : "group-hover:shadow-lg"}`}
                style={{ boxShadow: "0 2px 10px rgba(15,23,42,0.06)" }}>

                {/* Banner image — ~75% */}
                <div className="relative flex-shrink-0 overflow-hidden" style={{ height: "75%", background: s.gradient }}>
                  {/* dotted texture */}
                  <div className="absolute inset-0 opacity-90"
                    style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)", backgroundSize: "11px 11px" }} />
                  {/* glow */}
                  <div className="absolute -top-10 -right-8 w-36 h-36 rounded-full opacity-25"
                    style={{ background: "radial-gradient(circle, white, transparent)" }} />
                  {/* motif */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-95">
                    <BannerArt motif={s.motif} />
                  </div>
                  {/* count / soon chip */}
                  <span className="absolute top-3.5 right-3.5 text-[10px] font-black px-2 py-0.5 rounded-md text-white"
                    style={{ background: s.soon ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)" }}>
                    {s.soon ? "COMING SOON" : s.count}
                  </span>
                  {/* title */}
                  <h2 className="absolute left-4 bottom-3.5 text-white text-[23px] font-black tracking-tight"
                    style={{ textShadow: "0 1px 10px rgba(0,0,0,0.28)" }}>
                    {s.title}
                  </h2>
                </div>

                {/* White strip — ~25% */}
                <div className="flex-1 px-4 flex items-center justify-between gap-3">
                  <p className="text-[12.5px] text-slate-500 leading-snug font-medium min-w-0">{s.overview}</p>
                  {s.soon ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold text-slate-400 bg-slate-100 flex-shrink-0">
                      Soon
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold text-white flex-shrink-0"
                      style={{ background: s.color, boxShadow: `0 3px 10px ${s.color}40` }}>
                      Open
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            );

            return s.soon ? (
              <div key={s.href} className="block cursor-default select-none" aria-disabled="true" title="Coming soon">
                {card}
              </div>
            ) : (
              <Link key={s.href} href={s.href} className="block press group">
                {card}
              </Link>
            );
          })}
        </div>

        {/* Slim tip */}
        <p className="max-w-4xl mt-5 text-[12px] text-slate-400 leading-relaxed px-1">
          💡 Each page has a <b className="text-slate-500">Download PDF</b> button — print and revise offline.
        </p>
      </div>
    </div>
  );
}
