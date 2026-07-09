"use client";

import Link from "next/link";
import { Rule } from "@/data/rules";
import { RuleStatus } from "@/lib/storage";
import { RuleVisual, VisualType } from "@/components/visuals/RuleVisual";
import { detectConcepts } from "@/data/concepts";
import { useState, useEffect, useRef } from "react";
import RulePoints from "@/components/RulePoints";
import AltTrick from "@/components/AltTrick";
import { ALT_TRICKS } from "@/data/altTricks";
import AskAISheet from "@/components/AskAISheet";

type Props = {
  rule: Rule;
  status: RuleStatus;
  onMarkSeen: () => void;
  onRevise: () => void;
};

// Long-press sentence that reveals a plain-English explanation
function ExplainableExample({
  text, why, accent, strikethrough = false,
}: { text: string; why?: string; accent: string; strikethrough?: boolean }) {
  const [open, setOpen] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didHold = useRef(false);

  function startHold() {
    didHold.current = false;
    holdTimer.current = setTimeout(() => {
      didHold.current = true;
      if (why) setOpen(true);
    }, 480);
  }

  function endHold() {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (!didHold.current) setOpen(false); // short tap closes if open
  }

  const cleanText = text.replace(/\s*\(.*?\)\s*/g, "").replace(/[✅❌]\s*/g, "").trim();

  return (
    <div className="rounded-xl overflow-hidden select-none"
      style={{ background: strikethrough ? "#fff1f2" : "#f0fdf4", borderLeft: `3px solid ${accent}` }}
      onTouchStart={startHold} onTouchEnd={endHold} onTouchCancel={endHold}
      onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold}>
      <div className="px-4 py-3 flex items-center gap-2.5">
        <p className={`text-[14px] font-medium leading-snug font-mono-ex flex-1 ${
          strikethrough ? "line-through decoration-rose-300 decoration-2 text-slate-400" : "text-slate-800"
        }`}>
          {cleanText}
        </p>
        {why && (
          <span className="flex-shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-md"
            style={{ background: `${accent}18`, color: accent }}>
            WHY?
          </span>
        )}
      </div>
      {open && why && (
        <div className="mx-3 mb-3 rounded-xl px-4 py-3" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
          <p className="text-[12px] font-semibold leading-relaxed" style={{ color: strikethrough ? "#9f1239" : "#065f46" }}>
            💡 {why}
          </p>
        </div>
      )}
    </div>
  );
}

export default function RuleCard({ rule, status, onMarkSeen, onRevise }: Props) {
  const c = rule.sectionColor;
  const [langMode, setLangMode] = useState<"closed" | "hindi" | "hinglish">("closed");
  const [askOpen, setAskOpen] = useState(false);

  useEffect(() => { setLangMode("closed"); setAskOpen(false); }, [rule.id]);

  const hasLang = !!(rule.hindiTip || rule.hinglishTip);
  const chips = detectConcepts(rule.title, rule.rule, rule.extras?.join(" ")).slice(0, 5);

  return (
    <div className="relative w-full h-full flex flex-col bg-white overflow-hidden">

      {/* Top accent bar */}
      <div className="h-[4px] w-full flex-shrink-0" style={{ background: c }} />

      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold" style={{ color: c }}>
            {rule.section}
          </span>
          <div className="flex items-center gap-2.5">
            {rule.star && (
              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Priority
              </span>
            )}
            <span className="text-[11px] text-slate-300 font-medium">{rule.ruleNumber}</span>
          </div>
        </div>
        <h2 className="text-[22px] font-bold text-slate-900 leading-snug tracking-tight">
          {rule.title}
        </h2>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 scroll-area pb-36">

        {/* Rule */}
        <div className="mx-5 mt-5 mb-5">
          <div className="px-4 py-1.5 rounded-t-xl flex items-center"
            style={{ background: c }}>
            <span className="text-white text-[11px] font-semibold tracking-wide">Rule</span>
          </div>
          <div className="px-5 py-4 rounded-b-xl" style={{ background: `${c}09`, border: `1px solid ${c}25`, borderTop: 0 }}>
            <RulePoints text={rule.rule} color={c} />
          </div>
          {ALT_TRICKS[rule.ruleNumber] && <AltTrick trick={ALT_TRICKS[rule.ruleNumber]} />}
        </div>

        {/* Concept chips */}
        {chips.length > 0 && (
          <div className="px-5 mb-5 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <Link key={chip.slug} href={`/concept/${chip.slug}`}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium press"
                style={{ background: `${chip.color}10`, color: chip.color, border: `1px solid ${chip.color}20` }}>
                <span>{chip.title}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Visual Diagram */}
        {rule.visual && (
          <div className="mx-5 mb-5 rounded-xl overflow-hidden p-4"
            style={{ background: `${c}05`, border: `1px solid ${c}18` }}>
            <RuleVisual type={rule.visual as VisualType} color={c} />
          </div>
        )}

        {/* Table */}
        {rule.table && !rule.visual && (
          <div className="mx-5 mb-5 rounded-xl overflow-hidden"
            style={{ border: `1px solid ${c}20` }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: c }}>
                  {rule.table.headers.map((h) => (
                    <th key={h} className="text-white font-semibold px-4 py-2.5 text-left text-[12px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rule.table.rows.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 !== 0 ? `${c}05` : "white" }}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-2.5 text-slate-700 text-[13px] border-t" style={{ borderColor: `${c}12` }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Correct Examples */}
        {rule.correct.length > 0 && (
          <div className="px-5 mb-4">
            <div className="flex items-center gap-2 mb-2 ml-1">
              <p className="text-[11px] font-semibold text-emerald-600">Correct</p>
              {rule.correctWhy && <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Hold to explain</span>}
            </div>
            <div className="space-y-2">
              {rule.correct.map((ex, i) => (
                <ExplainableExample key={i} text={ex} why={rule.correctWhy?.[i]} accent="#10b981" />
              ))}
            </div>
          </div>
        )}

        {/* Wrong Examples */}
        {rule.wrong && rule.wrong.length > 0 && (
          <div className="px-5 mb-4">
            <div className="flex items-center gap-2 mb-2 ml-1">
              <p className="text-[11px] font-semibold text-rose-500">Incorrect</p>
              {rule.wrongWhy && <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Hold to explain</span>}
            </div>
            <div className="space-y-2">
              {rule.wrong.map((ex, i) => (
                <ExplainableExample key={i} text={ex} why={rule.wrongWhy?.[i]} accent="#f43f5e" strikethrough />
              ))}
            </div>
          </div>
        )}

        {/* Also Note */}
        {rule.extras && rule.extras.length > 0 && (
          <div className="px-5 mb-4">
            <p className="text-[11px] font-semibold text-sky-600 mb-2 ml-1">Note</p>
            <div className="space-y-2">
              {rule.extras.map((ex, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3"
                  style={{ background: "#f0f9ff", borderLeft: "3px solid #38bdf8" }}>
                  <p className="text-[14px] text-slate-700 font-medium leading-snug">{ex}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Language Tips */}
        {hasLang && (
          <div className="px-5 mb-4">
            <button
              onClick={() => setLangMode(langMode === "closed" ? "hindi" : "closed")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
              style={{
                background: langMode !== "closed" ? "#fff7ed" : "#fafafa",
                border: "1px solid #fed7aa",
              }}>
              <div className="flex items-center gap-2.5">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="#f97316" strokeWidth="1.2" />
                  <path d="M5 8.5C5.5 6 7 5 8 5C9 5 10 5.5 10 6.5C10 8 8 8.5 8 10" stroke="#f97316" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="8" cy="12" r="0.7" fill="#f97316" />
                </svg>
                <div className="text-left">
                  <p className="text-[12px] font-semibold text-orange-700">Language tips</p>
                  <p className="text-[10px] text-orange-400">
                    {[rule.hindiTip && "Hindi", rule.hinglishTip && "Hinglish"].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-orange-400"
                style={{ transform: langMode !== "closed" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {langMode !== "closed" && (
              <div className="mt-1.5 rounded-xl overflow-hidden" style={{ border: "1px solid #fed7aa" }}>
                {rule.hindiTip && rule.hinglishTip && (
                  <div className="flex border-b border-orange-100">
                    <button onClick={() => setLangMode("hindi")}
                      className={`flex-1 py-2 text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all ${langMode === "hindi" ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-600"}`}>
                      Hindi
                    </button>
                    <button onClick={() => setLangMode("hinglish")}
                      className={`flex-1 py-2 text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all border-l border-orange-100 ${langMode === "hinglish" ? "bg-orange-400 text-white" : "bg-orange-50 text-orange-500"}`}>
                      Hinglish
                    </button>
                  </div>
                )}
                {(langMode === "hindi" || !rule.hinglishTip) && rule.hindiTip && (
                  <div className="px-5 py-4 bg-orange-50">
                    <RulePoints text={rule.hindiTip} color="#f97316" size="sm" lang="hi" />
                  </div>
                )}
                {(langMode === "hinglish" || !rule.hindiTip) && rule.hinglishTip && (
                  <div className="px-5 py-4 bg-amber-50">
                    <RulePoints text={rule.hinglishTip} color="#d97706" size="sm" lang="hi" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Ask AI */}
        <div className="px-5 mb-4">
          <button onClick={() => setAskOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl press"
            style={{ background: "linear-gradient(135deg,#eff6ff,#ede9fe)", border: "1px solid #c7d2fe" }}>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl flex items-center justify-center text-[15px] flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#2d7ff9,#7c3aed)" }}>✨</span>
              <div className="text-left">
                <p className="text-[12.5px] font-bold text-indigo-800">Still don&apos;t understand?</p>
                <p className="text-[10.5px] text-indigo-400 font-semibold">Ask AI to explain this rule your way</p>
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-indigo-400 flex-shrink-0">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <AskAISheet
          open={askOpen}
          onClose={() => setAskOpen(false)}
          title={rule.title}
          seed="Please explain this rule to me in a simpler way, with an easy example."
          context={[
            `Grammar rule the student is reading — Rule ${rule.ruleNumber} (${rule.section}): ${rule.title}`,
            `Rule text: ${rule.rule}`,
            rule.correct.length ? `Correct examples: ${rule.correct.slice(0, 3).join(" | ")}` : "",
            rule.wrong?.length ? `Wrong examples: ${rule.wrong.slice(0, 3).join(" | ")}` : "",
          ].filter(Boolean).join("\n")}
        />
      </div>

      {/* Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 flex-shrink-0 safe-bottom"
        style={{ background: "linear-gradient(to top, white 80%, transparent)" }}>
        <div className="px-5 pb-4 pt-7">

          {/* Status strip */}
          {status !== "unseen" && (
            <div className={`flex items-center justify-center gap-2 text-center text-[11px] font-semibold mb-3 py-1.5 rounded-lg ${
              status === "confident" ? "bg-emerald-50 text-emerald-700" :
              status === "seen" ? "bg-sky-50 text-sky-600" :
              "bg-amber-50 text-amber-700"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
                background: status === "confident" ? "#10b981" : status === "seen" ? "#0ea5e9" : "#f59e0b"
              }} />
              {status === "confident" ? "Confident" :
               status === "seen" ? "Marked as read" :
               "Flagged for revision"}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2.5">
            <button onClick={onRevise}
              className={`flex-1 py-3 rounded-xl font-semibold text-[13px] flex items-center justify-center transition-all press border ${
                status === "revise"
                  ? "bg-amber-400 border-amber-400 text-white"
                  : "bg-white border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600"
              }`}>
              Revise
            </button>

            {status === "confident" ? (
              <div className="flex-[2] py-3 rounded-xl font-semibold text-[13px] text-center bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                Confident
              </div>
            ) : (
              <button onClick={onMarkSeen}
                className="flex-[2] py-3 rounded-xl font-semibold text-[13px] text-white press flex items-center justify-center"
                style={{
                  background: status === "seen" ? "#0ea5e9" : c,
                  boxShadow: `0 4px 14px ${status === "seen" ? "#0ea5e925" : c + "35"}`,
                }}>
                {status === "seen" ? "Read" : "Mark as read"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
