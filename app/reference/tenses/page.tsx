"use client";

import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { ASPECTS, TIMES, CONSTANT_COLOR, type Aspect } from "@/data/tenses";

/* Render **changing** (time colour) and __constant__ (green) markers in a sentence. */
function Marked({ text, hot }: { text: string; hot: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**"))
          return <b key={i} style={{ color: hot }}>{p.slice(2, -2)}</b>;
        if (p.startsWith("__") && p.endsWith("__"))
          return <b key={i} className="underline decoration-2 underline-offset-2" style={{ color: CONSTANT_COLOR }}>{p.slice(2, -2)}</b>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

/* Render the aspect pattern: a [ slot ] chip + __constant__ + plain text. */
function PatternLine({ pattern, color }: { pattern: string; color: string }) {
  const parts = pattern.split(/(\[[^\]]+\]|__[^_]+__)/g);
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono-ex text-[13px] lg:text-[14px]">
      {parts.map((p, i) => {
        if (p.startsWith("[") && p.endsWith("]"))
          return (
            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md font-bold"
              style={{ color, background: `${color}14`, border: `1.5px dashed ${color}80` }}>
              {p.slice(1, -1).trim()}
            </span>
          );
        if (p.startsWith("__") && p.endsWith("__"))
          return <b key={i} className="underline decoration-2 underline-offset-2" style={{ color: CONSTANT_COLOR }}>{p.slice(2, -2)}</b>;
        return <span key={i} className="text-slate-500 font-semibold">{p}</span>;
      })}
    </span>
  );
}

export default function LearnTensesPage() {
  return (
    <div className="min-h-screen pb-28 lg:pb-12" style={{ background: "#f0f4ff" }}>

      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10 print-static" style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-3.5 flex items-center gap-3">
          <Link href="/reference" className="no-print w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm flex-shrink-0 press lg:hidden">←</Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg lg:text-2xl font-black text-slate-900 tracking-tight">Learn Tenses</h1>
            <p className="text-[12px] lg:text-[13px] text-slate-400 mt-0.5">All 12 tenses · compared side by side</p>
          </div>
          <PrintButton />
        </div>
      </div>

      <div className="px-4 lg:px-8 pt-5 max-w-5xl mx-auto space-y-5">

        {/* Intro — the big idea */}
        <div className="rounded-3xl p-5 lg:p-6 text-white print-avoid-break"
          style={{ background: "linear-gradient(135deg,#1e3a8a,#4f46e5)", boxShadow: "0 10px 30px -10px rgba(37,99,235,0.5)" }}>
          <h2 className="text-[17px] lg:text-xl font-black mb-2">Every tense = <span className="text-blue-200">Time</span> × <span className="text-violet-200">Aspect</span></h2>
          <p className="text-[13px] lg:text-[14px] text-blue-100 leading-relaxed mb-4">
            Pick <b className="text-white">when</b> (past · present · future) and <b className="text-white">how</b> (simple · continuous · perfect · perfect continuous).
            Inside each aspect, the three times are almost identical — <b className="text-white">only the helping verb changes</b>. Learn that one difference instead of 12 separate rules.
          </p>
          <div className="flex flex-wrap gap-2">
            {TIMES.map((t) => (
              <span key={t.key} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-bold"
                style={{ background: "rgba(255,255,255,0.14)" }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.soft }} />
                {t.label} = changes
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-bold" style={{ background: "rgba(255,255,255,0.14)" }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#6ee7b7" }} />
              Green = stays the same
            </span>
          </div>
        </div>

        {/* Cheat-sheet matrix */}
        <div className="rounded-3xl bg-white border border-slate-100 overflow-hidden print-avoid-break print-flat" style={{ boxShadow: "0 2px 12px -4px rgba(15,23,42,0.08)" }}>
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h3 className="font-black text-slate-800 text-[15px]">At a glance</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">Read each row left → right: same structure, only the helper moves.</p>
          </div>
          <div className="overflow-x-auto print-full">
            <table className="w-full border-collapse" style={{ minWidth: 640 }}>
              <thead>
                <tr>
                  <th className="text-left text-[11px] font-black text-slate-400 uppercase tracking-wider px-4 py-2.5 sticky left-0 bg-white">Aspect</th>
                  {TIMES.map((t) => (
                    <th key={t.key} className="text-left text-[12px] font-black uppercase tracking-wider px-4 py-2.5"
                      style={{ color: t.color, background: t.bg }}>{t.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ASPECTS.map((a) => (
                  <tr key={a.key} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-3 sticky left-0 bg-white">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: a.color }} />
                        <span className="text-[13px] font-bold text-slate-700 leading-tight">{a.name}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 mt-1 ml-4.5 font-mono-ex">{a.core}</p>
                    </td>
                    {TIMES.map((t) => {
                      const e = a.entries[t.key];
                      return (
                        <td key={t.key} className="px-4 py-3" style={{ background: `${t.bg}80` }}>
                          <p className="font-mono-ex text-[12px] font-bold text-slate-700">{e.formula}</p>
                          <p className="text-[12px] text-slate-600 mt-1.5 leading-snug"><Marked text={e.example} hot={t.color} /></p>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deep-dive cards */}
        {ASPECTS.map((a) => <AspectCard key={a.key} a={a} />)}

        {/* Exam tips */}
        <div className="rounded-3xl bg-amber-50 border border-amber-200 p-5 print-avoid-break">
          <p className="text-[13px] font-black text-amber-900 mb-2.5">⚡ Spot the tense in 3 seconds</p>
          <ul className="text-[12.5px] text-amber-800 space-y-2 leading-relaxed">
            <li><b>See “have / has / had”?</b> It’s a Perfect tense → look for a V3 (written). The form of “have” tells the time.</li>
            <li><b>See a form of “be” + “-ing”?</b> It’s Continuous → the action is in progress.</li>
            <li><b>See “have/has/had + been + -ing”?</b> Perfect Continuous → it’s about <i>duration</i> (for / since).</li>
            <li><b>No helper, verb stands alone?</b> Simple → just a fact or habit.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── One aspect: meaning + pattern + a 3-stop timeline + a trap ── */
function AspectCard({ a }: { a: Aspect }) {
  const c = a.color;
  return (
    <div className="rounded-3xl bg-white border border-slate-100 overflow-hidden print-avoid-break print-flat" style={{ boxShadow: "0 2px 12px -4px rgba(15,23,42,0.08)" }}>
      {/* Accent bar */}
      <div className="h-1.5 w-full" style={{ background: c }} />

      <div className="p-5 lg:p-6">
        {/* Title + meaning */}
        <div className="flex items-start justify-between gap-3 mb-1.5 flex-wrap">
          <h2 className="text-[20px] lg:text-[22px] font-black tracking-tight" style={{ color: c }}>{a.name}</h2>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg font-mono-ex flex-shrink-0"
            style={{ background: `${CONSTANT_COLOR}14`, color: CONSTANT_COLOR }}>
            stays: {a.core}
          </span>
        </div>
        <p className="text-[13.5px] text-slate-600 leading-relaxed mb-4">{a.meaning}</p>

        {/* Pattern box */}
        <div className="rounded-2xl px-4 py-3.5 mb-5" style={{ background: `${c}08`, border: `1px solid ${c}1f` }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: c }}>The pattern</p>
          <PatternLine pattern={a.pattern} color={c} />
          <p className="text-[12px] text-slate-500 mt-2.5 leading-snug">{a.insight}</p>
        </div>

        {/* Timeline of the 3 times */}
        <div className="space-y-2.5">
          {TIMES.map((t) => {
            const e = a.entries[t.key];
            return (
              <div key={t.key} className="rounded-2xl pl-3.5 pr-4 py-3" style={{ background: t.bg, borderLeft: `4px solid ${t.color}` }}>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white" style={{ background: t.color }}>
                    {t.label}
                  </span>
                  <span className="text-[12.5px] font-bold text-slate-700">{e.name}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md font-mono-ex" style={{ background: `${t.color}1a`, color: t.color }}>
                    {e.helper}
                  </span>
                </div>
                <p className="text-[14px] lg:text-[15px] text-slate-800 leading-snug font-medium">
                  <Marked text={e.example} hot={t.color} />
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-0.5 mt-1.5">
                  <p className="text-[11.5px] text-slate-500"><span className="font-bold text-slate-400">Use: </span>{e.use}</p>
                  <p className="text-[11.5px] text-slate-500"><span className="font-bold text-slate-400">Signals: </span><span className="font-mono-ex" style={{ color: t.color }}>{e.signals}</span></p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Watch-out trap */}
        <div className="mt-5 rounded-2xl overflow-hidden border border-slate-200">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">⚠ Common trap</p>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="flex items-start gap-2.5 px-4 py-2.5 bg-rose-50/50">
              <span className="text-rose-500 font-black flex-shrink-0 mt-0.5">✗</span>
              <p className="text-[13px] text-rose-900 font-medium line-through decoration-rose-300">{a.watch.wrong}</p>
            </div>
            <div className="flex items-start gap-2.5 px-4 py-2.5 bg-emerald-50/50">
              <span className="text-emerald-600 font-black flex-shrink-0 mt-0.5">✓</span>
              <p className="text-[13px] text-emerald-900 font-semibold">{a.watch.right}</p>
            </div>
          </div>
          <p className="text-[12px] text-slate-600 px-4 py-2.5 leading-snug bg-white">
            <span className="font-bold text-slate-400">Why: </span>{a.watch.why}
          </p>
        </div>
      </div>
    </div>
  );
}
