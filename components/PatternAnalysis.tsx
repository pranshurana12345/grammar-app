"use client";

import { useState } from "react";
import AskAISheet from "@/components/AskAISheet";

export type PatternPoint = { icon: string; head: string; body: string };

// Collapsible "AFCAT exam pattern" analysis card shown at the top of the
// Vocabulary / Idioms study pages. Content comes from analyzing real papers
// (2015–2020) + the Arihant question bank; the Ask-AI button opens a chat
// seeded with the same analysis.
export default function PatternAnalysis({
  accent, subject, points, tip,
}: {
  accent: string;
  subject: string; // e.g. "vocabulary" / "idioms & phrases"
  points: PatternPoint[];
  tip: string;
}) {
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const contextText = `AFCAT ${subject} pattern analysis (from real papers 2015–2020 and the Arihant question bank):\n${points.map((p) => `- ${p.head}: ${p.body}`).join("\n")}\nTip: ${tip}`;

  return (
    <div className="mb-4">
      <div className="rounded-2xl overflow-hidden bg-white" style={{ border: `1.5px solid ${accent}30`, boxShadow: "0 2px 10px -4px rgba(15,23,42,0.08)" }}>
        {/* toggle header */}
        <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-3 px-4 py-3.5 press text-left">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center text-[16px] flex-shrink-0"
            style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}>📊</span>
          <span className="flex-1 min-w-0">
            <span className="block text-[13px] font-black text-slate-800">AFCAT Pattern Analysis</span>
            <span className="block text-[10.5px] font-semibold" style={{ color: accent }}>How the exam actually asks {subject}</span>
          </span>
          <svg width="15" height="15" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 text-slate-400"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <div className="px-4 pb-4 border-t border-slate-50">
            <div className="space-y-3 pt-3.5">
              {points.map((p) => (
                <div key={p.head} className="flex gap-2.5 items-start">
                  <span className="text-[15px] flex-shrink-0 mt-px">{p.icon}</span>
                  <p className="text-[12.5px] leading-relaxed text-slate-600">
                    <span className="font-black text-slate-800">{p.head}: </span>{p.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3.5 rounded-xl px-3.5 py-2.5" style={{ background: `${accent}0d`, border: `1px solid ${accent}22` }}>
              <p className="text-[12px] leading-relaxed font-semibold" style={{ color: accent }}>💡 {tip}</p>
            </div>

            <button onClick={() => setChatOpen(true)}
              className="mt-3 w-full press rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 text-white text-[12.5px] font-black"
              style={{ background: `linear-gradient(135deg, ${accent}, #7c3aed)` }}>
              ✨ Ask AI about this pattern
            </button>
          </div>
        )}
      </div>

      <AskAISheet
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        title="Exam Pattern"
        contextPreview={`AFCAT ${subject} pattern — question counts, formats, traps and what the exam recycles`}
        context={contextText}
        suggestions={[
          "How many marks can I expect from this topic?",
          "What's the smartest way to prepare this in a week?",
          "Show me an example question with the trap",
          "Kya yeh topic skip kar sakte hain?",
        ]}
      />
    </div>
  );
}
