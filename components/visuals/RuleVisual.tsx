"use client";

import React from "react";

/* ── Reusable primitives ─────────────────────────────── */

const Box = ({
  label,
  sub,
  color,
  light,
}: {
  label: string;
  sub?: string;
  color: string;
  light?: string;
}) => (
  <div
    className="rounded-2xl p-3 flex flex-col items-center text-center"
    style={{ background: light ?? `${color}18`, border: `1.5px solid ${color}40` }}
  >
    <span className="text-xs font-bold" style={{ color }}>
      {label}
    </span>
    {sub && <span className="text-xs text-slate-500 mt-0.5 leading-tight">{sub}</span>}
  </div>
);

const Arrow = ({ dir = "right", color = "#94a3b8" }: { dir?: "right" | "down"; color?: string }) =>
  dir === "right" ? (
    <svg width="28" height="14" viewBox="0 0 28 14" className="flex-shrink-0">
      <path d="M0 7h22M16 1l8 6-8 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ) : (
    <svg width="14" height="24" viewBox="0 0 14 24" className="flex-shrink-0 self-center">
      <path d="M7 0v18M1 12l6 8 6-8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );

const SectionLabel = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>
    {children}
  </p>
);

/* ══════════════════════════════════════════════════════
   VISUAL: Has / Have / Had — 2×2 tense grid (Rule 2)
══════════════════════════════════════════════════════ */
export function HasHaveHadGrid({ color }: { color: string }) {
  return (
    <div>
      <SectionLabel color={color}>Tense Identification Chart</SectionLabel>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl p-3 text-center" style={{ background: "#dbeafe", border: "1.5px solid #93c5fd" }}>
          <div className="text-xs font-black text-blue-700 mb-1">HAS / HAVE</div>
          <div className="text-[10px] text-blue-500">(alone, no V3)</div>
          <div className="mt-2 text-sm font-bold text-blue-800">Simple Present</div>
        </div>
        <div className="rounded-2xl p-3 text-center" style={{ background: "#d1fae5", border: "1.5px solid #6ee7b7" }}>
          <div className="text-xs font-black text-emerald-700 mb-1">HAS/HAVE + V3</div>
          <div className="text-[10px] text-emerald-500">(+ past participle)</div>
          <div className="mt-2 text-sm font-bold text-emerald-800">Present Perfect</div>
        </div>
        <div className="rounded-2xl p-3 text-center" style={{ background: "#fef3c7", border: "1.5px solid #fcd34d" }}>
          <div className="text-xs font-black text-amber-700 mb-1">HAD</div>
          <div className="text-[10px] text-amber-500">(alone, no V3)</div>
          <div className="mt-2 text-sm font-bold text-amber-800">Simple Past</div>
        </div>
        <div className="rounded-2xl p-3 text-center" style={{ background: "#ede9fe", border: "1.5px solid #c4b5fd" }}>
          <div className="text-xs font-black text-violet-700 mb-1">HAD + V3</div>
          <div className="text-[10px] text-violet-500">(+ past participle)</div>
          <div className="mt-2 text-sm font-bold text-violet-800">Past Perfect</div>
        </div>
      </div>
      <div className="mt-3 rounded-xl p-2.5 text-center text-[11px] text-slate-500" style={{ background: "#f8fafc" }}>
        ⚠️ has/have as <strong>main verb</strong> (no other verb) → tag uses <strong>don't/doesn't/didn't</strong>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL: Half Girlfriend Rule (Rule 19)
══════════════════════════════════════════════════════ */
export function HalfGirlfriendVisual({ color }: { color: string }) {
  return (
    <div>
      <SectionLabel color={color}>The Half Girlfriend Formula</SectionLabel>
      <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${color}30` }}>
        {/* Formula row */}
        <div className="p-3" style={{ background: `${color}10` }}>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <div className="rounded-xl px-3 py-2 text-center" style={{ background: color }}>
              <div className="text-[10px] text-white/70 font-semibold">Choose</div>
              <div className="text-xs font-black text-white">One of / Either of</div>
              <div className="text-xs font-black text-white">Each of / Neither of</div>
            </div>
            <Arrow color={color} />
            <div className="rounded-xl px-3 py-2 text-center" style={{ background: "#dbeafe" }}>
              <div className="text-[10px] text-blue-500 font-semibold">Noun must be</div>
              <div className="text-sm font-black text-blue-700">PLURAL</div>
              <div className="text-[10px] text-blue-400">the boys / students</div>
            </div>
            <Arrow color={color} />
            <div className="rounded-xl px-3 py-2 text-center" style={{ background: "#d1fae5" }}>
              <div className="text-[10px] text-emerald-500 font-semibold">Verb must be</div>
              <div className="text-sm font-black text-emerald-700">SINGULAR</div>
              <div className="text-[10px] text-emerald-400">is / was / has</div>
            </div>
          </div>
        </div>
        {/* Extra Laddu */}
        <div className="p-3 border-t" style={{ borderColor: `${color}20`, background: "#fffbeb" }}>
          <div className="text-[10px] font-bold text-amber-600 mb-1.5">⭐ EXTRA LADDU — With Relative Pronoun (who/which/that):</div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] rounded-lg px-2 py-1 font-semibold text-violet-700 bg-violet-50 border border-violet-200">He is one of the students</span>
            <span className="text-[11px] rounded-lg px-2 py-1 font-bold text-amber-700 bg-amber-50 border border-amber-200">who</span>
            <span className="text-[11px] rounded-lg px-2 py-1 font-bold text-blue-700 bg-blue-50 border border-blue-200">are intelligent ✅</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5">Verb follows the PLURAL noun "students", not "one"</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL: Doctor vs Patient Timeline (Rule 24)
══════════════════════════════════════════════════════ */
export function DoctorPatientTimeline({ color }: { color: string }) {
  return (
    <div>
      <SectionLabel color={color}>Two-Action Timeline</SectionLabel>
      <div className="rounded-2xl p-4" style={{ background: `${color}10`, border: `1.5px solid ${color}30` }}>
        {/* Timeline bar */}
        <div className="relative mb-2">
          <div className="h-1 rounded-full mx-8" style={{ background: `${color}40` }} />
          {/* Left dot */}
          <div className="absolute top-1/2 -translate-y-1/2 left-6 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center" style={{ background: color }}>
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          {/* Right dot */}
          <div className="absolute top-1/2 -translate-y-1/2 right-6 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center bg-slate-400">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          {/* Arrow tip */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">→</div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="rounded-xl p-2.5 text-center" style={{ background: color, boxShadow: `0 4px 12px ${color}40` }}>
            <div className="text-[10px] font-bold text-white/70 mb-0.5">FIRST EVENT</div>
            <div className="text-xs font-black text-white">Past Perfect</div>
            <div className="text-[10px] text-white/80 mt-0.5 font-mono">had + V3</div>
          </div>
          <div className="rounded-xl p-2.5 text-center bg-slate-100 border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 mb-0.5">SECOND EVENT</div>
            <div className="text-xs font-black text-slate-700">Simple Past</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">V2</div>
          </div>
        </div>

        {/* Key insight */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
          <div className="rounded-lg p-2 bg-white text-center">
            <div className="font-bold text-slate-600">With AFTER</div>
            <div className="text-slate-400 mt-0.5">…after the doctor <span className="font-bold text-orange-600">had come</span></div>
          </div>
          <div className="rounded-lg p-2 bg-white text-center">
            <div className="font-bold text-slate-600">With BEFORE</div>
            <div className="text-slate-400 mt-0.5">…<span className="font-bold text-orange-600">had died</span> before the doctor came</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL: Conditionals (Rule 26)
══════════════════════════════════════════════════════ */
export function ConditionalsTable({ color }: { color: string }) {
  const rows = [
    { type: "Real / Possible", if: "Simple Present", main: "will + V1", ex: "If it rains, I will stay." },
    { type: "Unreal / Present", if: "Simple Past", main: "would + V1", ex: "If it rained, I would stay." },
    { type: "Unreal / Past", if: "Past Perfect (had+V3)", main: "would have + V3", ex: "If it had rained, I would have stayed." },
  ];
  return (
    <div>
      <SectionLabel color={color}>Conditional Sentence Types</SectionLabel>
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: `${color}30` }}>
        <div className="grid grid-cols-3 text-[10px] font-bold text-white px-3 py-2" style={{ background: color }}>
          <span>Type</span>
          <span>IF-clause</span>
          <span>Main clause</span>
        </div>
        {rows.map((r, i) => (
          <div key={i} className={`px-3 py-2.5 border-t`} style={{ borderColor: `${color}15`, background: i % 2 === 0 ? "white" : `${color}06` }}>
            <div className="grid grid-cols-3 gap-1 mb-1.5">
              <span className="text-[10px] font-bold text-slate-700">{r.type}</span>
              <span className="text-[10px] font-semibold rounded-md px-1.5 py-0.5 bg-blue-50 text-blue-700 text-center">{r.if}</span>
              <span className="text-[10px] font-semibold rounded-md px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-center">{r.main}</span>
            </div>
            <div className="text-[10px] text-slate-400 italic">{r.ex}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-xl px-3 py-2 text-[10px] text-rose-700 font-semibold" style={{ background: "#fff1f2", border: "1px solid #fecdd3" }}>
        ❌ NEVER: Two "will" or two "would" in one sentence. IF-clause can NEVER have "will".
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL: Non-Finite Verbs (Rule 38)
══════════════════════════════════════════════════════ */
export function NonFiniteComparison({ color }: { color: string }) {
  const cols = [
    {
      name: "GERUND",
      form: "V-ing",
      role: "NOUN",
      sound: "नाना / गाना sound",
      ex: "He enjoys reading.",
      sub: "पढ़ना enjoy करता है",
      bg: "#dbeafe",
      border: "#93c5fd",
      text: "#1d4ed8",
    },
    {
      name: "INFINITIVE",
      form: "to + V1",
      role: "NOUN",
      sound: "करना sound",
      ex: "To err is human.",
      sub: "गलती करना = human",
      bg: "#d1fae5",
      border: "#6ee7b7",
      text: "#065f46",
    },
    {
      name: "PARTICIPLE",
      form: "V-ing / V3",
      role: "ADJECTIVE",
      sound: "हुए / हुआ sound",
      ex: "I saw her studying.",
      sub: "पढ़ते हुए देखा",
      bg: "#ede9fe",
      border: "#c4b5fd",
      text: "#6d28d9",
    },
  ];
  return (
    <div>
      <SectionLabel color={color}>The 3 Non-Finite Verbs — Spot the Difference</SectionLabel>
      <div className="grid grid-cols-3 gap-2">
        {cols.map((c) => (
          <div key={c.name} className="rounded-2xl p-2.5 flex flex-col gap-1" style={{ background: c.bg, border: `2px solid ${c.border}` }}>
            <div className="text-[10px] font-black" style={{ color: c.text }}>{c.name}</div>
            <div className="rounded-lg px-2 py-0.5 text-[10px] font-bold text-white text-center" style={{ background: c.text }}>{c.form}</div>
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Acts as {c.role}</div>
            <div className="text-[10px] font-semibold" style={{ color: c.text }}>{c.sound}</div>
            <div className="mt-1 rounded-lg p-1.5 bg-white/70 text-[10px]">
              <div className="font-semibold text-slate-700 italic">"{c.ex}"</div>
              <div className="text-slate-400">{c.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL: EMPT Adverb Order (Rule 55)
══════════════════════════════════════════════════════ */
export function EMPTFlow({ color }: { color: string }) {
  const steps = [
    { letter: "E", word: "Emphasis", ex: "really", color: "#7c3aed", bg: "#ede9fe" },
    { letter: "M", word: "Manner", ex: "slowly", color: "#0891b2", bg: "#cffafe" },
    { letter: "P", word: "Place", ex: "home", color: "#059669", bg: "#d1fae5" },
    { letter: "T", word: "Time", ex: "yesterday", color: "#c2410c", bg: "#ffedd5" },
  ];
  return (
    <div>
      <SectionLabel color={color}>Adverb Order — E·M·P·T</SectionLabel>
      <div className="flex items-center gap-1.5">
        {steps.map((s, i) => (
          <React.Fragment key={s.letter}>
            <div className="flex-1 rounded-2xl p-2.5 text-center" style={{ background: s.bg, border: `1.5px solid ${s.color}40` }}>
              <div className="text-lg font-black" style={{ color: s.color }}>{s.letter}</div>
              <div className="text-[10px] font-bold text-slate-600">{s.word}</div>
              <div className="text-[9px] text-slate-400 mt-0.5 italic">"{s.ex}"</div>
            </div>
            {i < steps.length - 1 && (
              <svg width="14" height="12" viewBox="0 0 14 12" className="flex-shrink-0">
                <path d="M0 6h10M6 1l6 5-6 5" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-2 rounded-xl p-2.5 text-[11px]" style={{ background: `${color}10` }}>
        <span className="font-bold" style={{ color }}>Example: </span>
        <span className="text-slate-600">He walked </span>
        <span className="font-bold text-cyan-700">slowly</span>
        <span className="text-slate-600"> (M) </span>
        <span className="font-bold text-emerald-700">home</span>
        <span className="text-slate-600"> (P) </span>
        <span className="font-bold text-orange-700">yesterday</span>
        <span className="text-slate-600"> (T)</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL: A vs AN Decision Tree (Rule 56)
══════════════════════════════════════════════════════ */
export function ArticleDecisionTree({ color }: { color: string }) {
  return (
    <div>
      <SectionLabel color={color}>A vs AN — It's About SOUND, Not Spelling</SectionLabel>
      <div className="rounded-2xl p-3" style={{ background: `${color}08`, border: `1.5px solid ${color}25` }}>
        {/* Root */}
        <div className="flex justify-center mb-3">
          <div className="rounded-xl px-4 py-2 text-sm font-bold text-white" style={{ background: color }}>
            Next word starts with…?
          </div>
        </div>
        {/* Branch */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-3" style={{ background: "#d1fae5", border: "1.5px solid #6ee7b7" }}>
            <div className="text-center text-xs font-black text-emerald-700 mb-2">🔊 VOWEL SOUND</div>
            <div className="text-2xl font-black text-center text-emerald-600 mb-2">AN</div>
            <div className="space-y-1 text-[10px]">
              {[["an hour", "h is silent → ow sound"], ["an MA", "em sound"], ["an X-ray", "eks sound"], ["an honest man", "silent h"]].map(([ex, why]) => (
                <div key={ex} className="flex justify-between gap-1 bg-white/70 rounded-lg px-2 py-1">
                  <span className="font-bold text-emerald-700">{ex}</span>
                  <span className="text-slate-400 text-right">{why}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-3" style={{ background: "#dbeafe", border: "1.5px solid #93c5fd" }}>
            <div className="text-center text-xs font-black text-blue-700 mb-2">🔊 CONSONANT SOUND</div>
            <div className="text-2xl font-black text-center text-blue-600 mb-2">A</div>
            <div className="space-y-1 text-[10px]">
              {[["a European", "yu sound"], ["a university", "yu sound"], ["a one-eyed man", "wun sound"], ["a year", "yuh sound"]].map(([ex, why]) => (
                <div key={ex} className="flex justify-between gap-1 bg-white/70 rounded-lg px-2 py-1">
                  <span className="font-bold text-blue-700">{ex}</span>
                  <span className="text-slate-400 text-right">{why}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL: For vs Since (Rule 60)
══════════════════════════════════════════════════════ */
export function ForSinceTimeline({ color }: { color: string }) {
  return (
    <div>
      <SectionLabel color={color}>For vs Since — Duration vs Starting Point</SectionLabel>
      <div className="rounded-2xl p-4" style={{ background: `${color}08`, border: `1.5px solid ${color}25` }}>
        {/* Timeline */}
        <div className="relative h-10 mx-4 mb-4">
          {/* Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 rounded-full bg-slate-200" />
          {/* Start point */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
          {/* NOW point */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          {/* FOR span */}
          <div className="absolute top-0 left-2 right-2 flex items-center justify-center">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 rounded-full" style={{ background: color, opacity: 0.3 }} />
            <span className="relative text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ background: color }}>
              FOR (duration)
            </span>
          </div>
          {/* Labels */}
          <div className="absolute bottom-0 left-0 -translate-x-1/2 text-[9px] text-blue-600 font-bold whitespace-nowrap">Starting point</div>
          <div className="absolute bottom-0 right-0 translate-x-1/2 text-[9px] text-emerald-600 font-bold">NOW</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl p-2.5" style={{ background: "#dbeafe" }}>
            <div className="text-xs font-black text-blue-700 mb-1">FOR</div>
            <div className="text-[10px] text-blue-600 mb-1.5">Period / Duration (कितने समय से)</div>
            {["for two hours", "for a week", "for last 3 months"].map(ex => (
              <div key={ex} className="text-[10px] font-bold text-blue-800 bg-white/70 rounded-lg px-2 py-1 mb-1">{ex}</div>
            ))}
          </div>
          <div className="rounded-xl p-2.5" style={{ background: "#d1fae5" }}>
            <div className="text-xs font-black text-emerald-700 mb-1">SINCE</div>
            <div className="text-[10px] text-emerald-600 mb-1.5">Point of time (कब से शुरू)</div>
            {["since morning", "since Monday", "since 2020"].map(ex => (
              <div key={ex} className="text-[10px] font-bold text-emerald-800 bg-white/70 rounded-lg px-2 py-1 mb-1">{ex}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL: Died of / in / from / by (Rule 61)
══════════════════════════════════════════════════════ */
export function DiedGrid({ color }: { color: string }) {
  const items = [
    { prep: "OF", causes: "Disease, Hunger, Starvation", ex: "died of cancer", color: "#dc2626", bg: "#fee2e2" },
    { prep: "IN", causes: "Accident, Battle, War", ex: "died in an accident", color: "#2563eb", bg: "#dbeafe" },
    { prep: "FROM", causes: "Injury, Wounds", ex: "died from his wounds", color: "#7c3aed", bg: "#ede9fe" },
    { prep: "BY", causes: "Violence, Sword, Hanging", ex: "died by the sword", color: "#b45309", bg: "#fef3c7" },
    { prep: "WITH", causes: "Anger, Grief, Cold", ex: "died with anger", color: "#0891b2", bg: "#cffafe" },
  ];
  return (
    <div>
      <SectionLabel color={color}>Died + Preposition — Cause of Death</SectionLabel>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.prep} className="flex items-center gap-2 rounded-xl p-2.5" style={{ background: item.bg }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs flex-shrink-0" style={{ background: item.color }}>
              {item.prep}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold" style={{ color: item.color }}>{item.causes}</div>
              <div className="text-[10px] text-slate-500 italic mt-0.5">e.g. "{item.ex}"</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL: At / In / On (Rule 68)
══════════════════════════════════════════════════════ */
export function TimePrepositions({ color }: { color: string }) {
  const cols = [
    {
      prep: "AT",
      desc: "Exact point in time",
      items: ["at 7 o'clock", "at midnight", "at dawn", "at noon", "at night"],
      color: "#7c3aed", bg: "#ede9fe",
    },
    {
      prep: "IN",
      desc: "Larger period",
      items: ["in the morning", "in January", "in 1990", "in summer", "in this century"],
      color: "#0891b2", bg: "#cffafe",
    },
    {
      prep: "ON",
      desc: "Day / Date / Festival",
      items: ["on Monday", "on 5th March", "on Holi", "on my birthday", "on Christmas"],
      color: "#059669", bg: "#d1fae5",
    },
  ];
  return (
    <div>
      <SectionLabel color={color}>Time Prepositions — At / In / On</SectionLabel>
      <div className="grid grid-cols-3 gap-2">
        {cols.map((c) => (
          <div key={c.prep} className="rounded-2xl p-2.5" style={{ background: c.bg, border: `1.5px solid ${c.color}40` }}>
            <div className="text-xl font-black text-center mb-1" style={{ color: c.color }}>{c.prep}</div>
            <div className="text-[9px] text-center text-slate-500 mb-2 font-semibold">{c.desc}</div>
            {c.items.map((item) => (
              <div key={item} className="text-[10px] font-medium text-slate-700 bg-white/60 rounded-lg px-1.5 py-1 mb-1 text-center">{item}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-xl p-2 text-[10px] text-slate-600 bg-amber-50 border border-amber-100">
        ⚠️ <strong>Night special:</strong> at night (general) | in the night (specific: "in the night when we walked")
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL: Inversion Pattern (Rule 81)
══════════════════════════════════════════════════════ */
export function InversionPattern({ color }: { color: string }) {
  return (
    <div>
      <SectionLabel color={color}>Inversion Formula — Sentence Structure</SectionLabel>
      <div className="rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${color}30` }}>
        {/* Formula */}
        <div className="p-3" style={{ background: `${color}10` }}>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {[
              { label: "Negative Word", sub: "No sooner / Hardly / Scarcely", color: "#dc2626", bg: "#fee2e2" },
              { label: "HAD / DID / AUX", sub: "inverted", color: "#7c3aed", bg: "#ede9fe" },
              { label: "SUBJECT", sub: "he / I / she", color: "#0891b2", bg: "#cffafe" },
              { label: "V3 / V1", sub: "past participle", color: "#059669", bg: "#d1fae5" },
            ].map((b, i) => (
              <React.Fragment key={b.label}>
                <div className="rounded-xl px-2.5 py-2 text-center" style={{ background: b.bg, border: `1.5px solid ${b.color}40` }}>
                  <div className="text-[10px] font-black" style={{ color: b.color }}>{b.label}</div>
                  <div className="text-[9px] text-slate-400">{b.sub}</div>
                </div>
                {i < 3 && <span className="text-slate-300 text-sm">+</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Examples */}
        <div className="divide-y" style={{ borderColor: `${color}15` }}>
          {[
            { pair: "No sooner … THAN", ex: "No sooner had he entered THAN everyone stood up." },
            { pair: "Hardly … WHEN", ex: "Hardly had I fallen asleep WHEN the phone rang." },
            { pair: "Scarcely … WHEN", ex: "Scarcely had she left WHEN it rained." },
          ].map((r) => (
            <div key={r.pair} className="px-3 py-2.5 bg-white">
              <div className="text-[10px] font-black text-rose-600 mb-0.5">{r.pair}</div>
              <div className="text-[11px] text-slate-600 italic">{r.ex}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL: Simple Past vs Present Perfect (Rule 86)
══════════════════════════════════════════════════════ */
export function TenseFocusRule({ color }: { color: string }) {
  return (
    <div>
      <SectionLabel color={color}>Which Tense? — The Focus Rule</SectionLabel>
      {/* Decision split */}
      <div className="rounded-2xl p-4" style={{ background: `${color}08`, border: `1.5px solid ${color}25` }}>
        <div className="flex justify-center mb-3">
          <div className="rounded-xl px-4 py-2.5 text-center" style={{ background: color }}>
            <div className="text-xs font-black text-white">Does the sentence mention WHEN?</div>
            <div className="text-[10px] text-white/70">(yesterday / last year / ago / in 1990)</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-3 text-center" style={{ background: "#d1fae5", border: "1.5px solid #6ee7b7" }}>
            <div className="text-[10px] font-black text-emerald-600 mb-1">✅ YES — Time Marker Present</div>
            <div className="text-sm font-black text-emerald-800">Simple Past</div>
            <div className="text-[10px] text-emerald-600 mt-1 font-mono">V2</div>
            <div className="mt-2 text-[10px] italic text-slate-600 bg-white/70 rounded-lg p-1.5">
              "I <strong>watched</strong> this movie yesterday."
            </div>
          </div>
          <div className="rounded-2xl p-3 text-center" style={{ background: "#dbeafe", border: "1.5px solid #93c5fd" }}>
            <div className="text-[10px] font-black text-blue-600 mb-1">❌ NO — Just the Action</div>
            <div className="text-sm font-black text-blue-800">Present Perfect</div>
            <div className="text-[10px] text-blue-600 mt-1 font-mono">have/has + V3</div>
            <div className="mt-2 text-[10px] italic text-slate-600 bg-white/70 rounded-lg p-1.5">
              "I <strong>have watched</strong> this movie."
            </div>
          </div>
        </div>
        <div className="mt-2 rounded-xl p-2 text-center text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-100">
          ❌ NEVER: "I have watched this movie yesterday." (time marker + perfect = always wrong)
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL: Superfluous Words (Rule 87)
══════════════════════════════════════════════════════ */
export function SuperfluousGrid({ color }: { color: string }) {
  const pairs = [
    ["Previous record", "Record is past by definition"],
    ["Free gift", "Gifts are always free"],
    ["Future plans", "Plans = future"],
    ["Past history", "History = past"],
    ["End result", "Result = end"],
    ["Final conclusion", "Conclusion = final"],
    ["Mutual agreement", "Agreement = mutual"],
    ["Retreat back", "Retreat = go back"],
    ["Advance planning", "Planning = advance"],
    ["Wet water", "Water is always wet"],
    ["Added bonus", "Bonus = addition"],
    ["Suppose if", "Both mean the same"],
  ];
  return (
    <div>
      <SectionLabel color={color}>Redundant Expressions — Spot & Remove!</SectionLabel>
      <div className="grid grid-cols-2 gap-1.5">
        {pairs.map(([wrong, why]) => (
          <div key={wrong} className="rounded-xl p-2.5 bg-rose-50 border border-rose-100">
            <div className="flex items-start gap-1">
              <span className="text-rose-500 text-xs mt-0.5 flex-shrink-0">✕</span>
              <div>
                <div className="text-[11px] font-bold text-rose-700 line-through">{wrong}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">{why}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL: Made of vs Made from (Rule 71)
══════════════════════════════════════════════════════ */
export function MadeOfFrom({ color }: { color: string }) {
  return (
    <div>
      <SectionLabel color={color}>Made OF vs Made FROM — The Key Difference</SectionLabel>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-3" style={{ background: "#d1fae5", border: "1.5px solid #6ee7b7" }}>
          <div className="text-center mb-2">
            <div className="text-xs font-black text-emerald-700">MADE OF</div>
            <div className="text-[10px] text-emerald-600 mt-0.5">Physical / Reversible change</div>
            <div className="text-[10px] text-slate-500">वापस मिल सकता है ✅</div>
          </div>
          <div className="space-y-1">
            {["Almirah → iron", "Glass → sand", "Ring → gold"].map((ex) => (
              <div key={ex} className="text-[10px] font-medium bg-white/70 rounded-lg px-2 py-1 text-emerald-800">{ex}</div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-3" style={{ background: "#fef3c7", border: "1.5px solid #fcd34d" }}>
          <div className="text-center mb-2">
            <div className="text-xs font-black text-amber-700">MADE FROM</div>
            <div className="text-[10px] text-amber-600 mt-0.5">Chemical / Irreversible change</div>
            <div className="text-[10px] text-slate-500">वापस नहीं मिल सकता ❌</div>
          </div>
          <div className="space-y-1">
            {["Paper ← wood", "Curd ← milk", "Flour ← wheat"].map((ex) => (
              <div key={ex} className="text-[10px] font-medium bg-white/70 rounded-lg px-2 py-1 text-amber-800">{ex}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL: Question Tag Flowchart (Rules 1-7)
══════════════════════════════════════════════════════ */
export function QuestionTagFlow({ color }: { color: string }) {
  return (
    <div>
      <SectionLabel color={color}>Question Tag — Decision Flow</SectionLabel>
      <div className="rounded-2xl p-3 space-y-2" style={{ background: `${color}08`, border: `1.5px solid ${color}25` }}>
        {/* Start */}
        <div className="flex justify-center">
          <div className="rounded-xl px-4 py-2 text-xs font-bold text-white" style={{ background: color }}>
            Sentence has an auxiliary verb?
          </div>
        </div>
        <div className="flex justify-center">
          <Arrow dir="down" color={color} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* YES path */}
          <div className="rounded-2xl p-3" style={{ background: "#d1fae5", border: "1.5px solid #6ee7b7" }}>
            <div className="text-[10px] font-black text-emerald-600 mb-2">✅ YES</div>
            <div className="text-xs font-bold text-emerald-800">Use that auxiliary in the tag</div>
            <div className="mt-2 text-[10px] text-slate-600 bg-white/70 rounded-lg p-1.5 italic space-y-0.5">
              <div>He is tall, <strong>isn't he?</strong></div>
              <div>She can swim, <strong>can't she?</strong></div>
              <div>They have gone, <strong>haven't they?</strong></div>
            </div>
          </div>
          {/* NO path */}
          <div className="rounded-2xl p-3" style={{ background: "#dbeafe", border: "1.5px solid #93c5fd" }}>
            <div className="text-[10px] font-black text-blue-600 mb-2">❌ NO → Use do/does/did</div>
            <div className="space-y-1 text-[10px]">
              <div className="bg-white/70 rounded-lg px-2 py-1"><strong>Past</strong> → <span className="text-blue-700 font-bold">did</span></div>
              <div className="bg-white/70 rounded-lg px-2 py-1"><strong>Present + Singular</strong> → <span className="text-blue-700 font-bold">does</span></div>
              <div className="bg-white/70 rounded-lg px-2 py-1"><strong>Present + Plural</strong> → <span className="text-blue-700 font-bold">do</span></div>
            </div>
          </div>
        </div>
        {/* Special cases */}
        <div className="rounded-xl p-2.5 bg-amber-50 border border-amber-100 text-[10px] space-y-0.5">
          <div className="font-bold text-amber-700 mb-1">Special Cases:</div>
          <div className="text-slate-600">• <strong>Let's</strong> → shall we?</div>
          <div className="text-slate-600">• <strong>Negative words</strong> (seldom, hardly…) → positive tag</div>
          <div className="text-slate-600">• <strong>Persons</strong> (everybody, nobody…) → they | <strong>Things</strong> → it</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL: Subject-Verb Agreement — As Well As (Rule 15)
══════════════════════════════════════════════════════ */
export function AsWellAsVisual({ color }: { color: string }) {
  return (
    <div>
      <SectionLabel color={color}>Verb Follows the FIRST Subject</SectionLabel>
      <div className="rounded-2xl p-3" style={{ background: `${color}08`, border: `1.5px solid ${color}25` }}>
        <div className="flex items-center gap-2 flex-wrap justify-center mb-3">
          <div className="rounded-xl px-3 py-2 text-center" style={{ background: color }}>
            <div className="text-[10px] text-white/70">1st Subject</div>
            <div className="text-sm font-black text-white">FOOD</div>
          </div>
          <div className="rounded-xl px-3 py-2 text-center bg-slate-100 border-2 border-dashed border-slate-300">
            <div className="text-[10px] text-slate-400">Connector (bracket)</div>
            <div className="text-xs font-black text-slate-500">as well as water</div>
          </div>
          <div className="rounded-xl px-3 py-2 text-center" style={{ background: color }}>
            <div className="text-[10px] text-white/70">Verb matches 1st</div>
            <div className="text-sm font-black text-white">IS essential</div>
          </div>
        </div>
        <div className="space-y-1.5 text-[11px]">
          {[
            { con: "as well as", ex: "Food, as well as water, IS essential." },
            { con: "along with", ex: "He, along with his friends, WAS there." },
            { con: "together with", ex: "She, together with her team, HAS won." },
            { con: "no less than", ex: "Ram, no less than Shyam, IS guilty." },
          ].map((r) => (
            <div key={r.con} className="bg-white rounded-xl px-3 py-2 flex gap-2 items-start">
              <span className="rounded-lg px-1.5 py-0.5 text-[9px] font-black text-white flex-shrink-0" style={{ background: color }}>{r.con}</span>
              <span className="text-slate-600 italic">{r.ex}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VISUAL DISPATCHER
══════════════════════════════════════════════════════ */
export type VisualType =
  | "question-tag-flow"
  | "has-have-had-grid"
  | "as-well-as"
  | "half-girlfriend"
  | "doctor-patient"
  | "conditionals"
  | "non-finite-three"
  | "empt-flow"
  | "article-choice"
  | "for-since"
  | "died-grid"
  | "at-in-on"
  | "inversion-pattern"
  | "tense-focus"
  | "superfluous-grid"
  | "made-of-from";

export function RuleVisual({ type, color }: { type: VisualType; color: string }) {
  switch (type) {
    case "question-tag-flow": return <QuestionTagFlow color={color} />;
    case "has-have-had-grid": return <HasHaveHadGrid color={color} />;
    case "as-well-as": return <AsWellAsVisual color={color} />;
    case "half-girlfriend": return <HalfGirlfriendVisual color={color} />;
    case "doctor-patient": return <DoctorPatientTimeline color={color} />;
    case "conditionals": return <ConditionalsTable color={color} />;
    case "non-finite-three": return <NonFiniteComparison color={color} />;
    case "empt-flow": return <EMPTFlow color={color} />;
    case "article-choice": return <ArticleDecisionTree color={color} />;
    case "for-since": return <ForSinceTimeline color={color} />;
    case "died-grid": return <DiedGrid color={color} />;
    case "at-in-on": return <TimePrepositions color={color} />;
    case "inversion-pattern": return <InversionPattern color={color} />;
    case "tense-focus": return <TenseFocusRule color={color} />;
    case "superfluous-grid": return <SuperfluousGrid color={color} />;
    case "made-of-from": return <MadeOfFrom color={color} />;
    default: return null;
  }
}
