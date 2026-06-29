"use client";

import { useState, useMemo } from "react";
import { rules } from "@/data/rules";
import { QUIZ_BANK } from "@/data/questions";
import { setRuleStatus, getProgress } from "@/lib/storage";
import Link from "next/link";

const MIN_QUESTIONS = 10;

type Question = {
  q: string;
  options: [string, string, string, string];
  answer: number;
  ruleId: number;
  ruleTitle: string;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SectionTestPageClient({ sectionName }: { sectionName: string }) {
  const section = decodeURIComponent(sectionName);

  const questions = useMemo<Question[]>(() => {
    const sectionRules = rules.filter((r) => r.section === section);
    const pool: Question[] = [];

    for (const rule of sectionRules) {
      const bank = QUIZ_BANK.find((b) => b.ruleId === rule.id);
      if (!bank) continue;
      for (const q of bank.questions) {
        pool.push({ ...q, ruleId: rule.id, ruleTitle: rule.title });
      }
    }

    const shuffled = shuffle(pool);
    return shuffled.slice(0, Math.max(MIN_QUESTIONS, shuffled.length));
  }, [section]);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const sectionColor = rules.find((r) => r.section === section)?.sectionColor ?? "#2563eb";

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center pb-24">
        <p className="text-4xl">🚧</p>
        <h2 className="text-xl font-black text-slate-800">No questions yet</h2>
        <p className="text-slate-500 text-sm">This section doesn&apos;t have test questions added yet.</p>
        <Link href="/" className="mt-4 px-6 py-3 rounded-2xl bg-blue-600 text-white font-black text-sm press">← Back</Link>
      </div>
    );
  }

  const q = questions[current];
  const totalQ = questions.length;
  const correctCount = answers.filter(Boolean).length;
  const score = Math.round((correctCount / totalQ) * 100);
  const passed = score >= 80;

  function handleSelect(idx: number) {
    if (confirmed) return;
    setSelected(idx);
  }

  function handleConfirm() {
    if (selected === null) return;
    const isCorrect = selected === q.answer;
    setConfirmed(true);
    setAnswers((prev) => [...prev, isCorrect]);
  }

  function handleNext() {
    if (current + 1 >= totalQ) {
      if (passed) {
        const progress = getProgress();
        questions.forEach((q) => {
          if (progress[q.ruleId] !== "confident") {
            setRuleStatus(q.ruleId, "confident");
          }
        });
      }
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 text-center" style={{ background: "#f0f4ff" }}>
        <div className="w-full max-w-sm bg-white rounded-3xl p-8" style={{ boxShadow: "0 8px 32px rgba(15,23,42,0.10)" }}>
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-5 text-4xl"
            style={{ background: passed ? "#f0fdf4" : "#fff1f2" }}
          >
            {passed ? "🏆" : "📚"}
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-1">
            {passed ? "Well done!" : "Keep studying"}
          </h2>
          <p className="text-slate-500 text-sm mb-5">
            {passed
              ? `You scored ${score}% — this section is now marked Confident!`
              : `You scored ${score}%. Aim for 80% to reach Confident status.`}
          </p>

          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
              <circle cx="64" cy="64" r="52" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle cx="64" cy="64" r="52" fill="none"
                stroke={passed ? "#16a34a" : "#e11d48"}
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - score / 100)}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black" style={{ color: passed ? "#16a34a" : "#e11d48" }}>{score}%</span>
              <span className="text-[10px] text-slate-400 font-semibold">{correctCount}/{totalQ} correct</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <p className="text-xl font-black text-emerald-700">{correctCount}</p>
              <p className="text-xs text-emerald-600 font-semibold">Correct</p>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-red-50 border border-red-200">
              <p className="text-xl font-black text-red-700">{totalQ - correctCount}</p>
              <p className="text-xs text-red-600 font-semibold">Wrong</p>
            </div>
          </div>

          {!passed && (
            <div className="mb-5 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-left">
              <p className="text-xs font-black text-amber-800 mb-1">💡 Tip</p>
              <p className="text-xs text-amber-700">
                Go back to the <strong>{section}</strong> section, re-read the rules you&apos;re unsure about, then retake this test.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setCurrent(0); setSelected(null); setConfirmed(false);
                setAnswers([]); setDone(false);
              }}
              className="w-full py-3.5 rounded-2xl font-black text-sm text-white press"
              style={{ background: sectionColor, boxShadow: `0 4px 16px ${sectionColor}40` }}
            >
              Retake Test
            </button>
            <Link href={`/sections/${encodeURIComponent(section)}`}
              className="w-full py-3 rounded-2xl font-black text-sm text-slate-600 bg-slate-100 press text-center block">
              Back to Section
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: "#f0f4ff" }}>
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10" style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
        <div className="max-w-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href={`/sections/${encodeURIComponent(section)}`}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm press">
              ✕
            </Link>
            <div className="text-center">
              <p className="text-sm font-black truncate" style={{ color: sectionColor }}>{section}</p>
              <p className="text-[10px] text-slate-400 font-semibold">Question {current + 1} of {totalQ}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-slate-500">{answers.filter(Boolean).length}/{answers.length}</span>
            </div>
          </div>

          <div className="mt-2.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300"
              style={{ width: `${((current) / totalQ) * 100}%`, background: sectionColor }} />
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-auto w-full px-4 pt-6">
        <div className="bg-white rounded-3xl p-6 mb-5" style={{ boxShadow: "0 4px 16px rgba(15,23,42,0.06)" }}>
          <p className="text-base font-black text-slate-800 leading-snug">{q.q}</p>
        </div>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let bg = "bg-white";
            let border = "border-slate-200";
            let textColor = "text-slate-700";

            if (confirmed) {
              if (idx === q.answer) {
                bg = "bg-emerald-50"; border = "border-emerald-400"; textColor = "text-emerald-800";
              } else if (idx === selected && idx !== q.answer) {
                bg = "bg-red-50"; border = "border-red-400"; textColor = "text-red-800";
              }
            } else if (selected === idx) {
              border = "border-blue-400"; bg = "bg-blue-50"; textColor = "text-blue-800";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left px-5 py-4 rounded-2xl border-2 ${bg} ${border} ${textColor} font-semibold text-sm transition-all press flex items-center gap-3`}
                style={{ boxShadow: selected === idx && !confirmed ? "0 4px 12px rgba(37,99,235,0.15)" : "0 2px 6px rgba(15,23,42,0.04)" }}
              >
                <span className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-black"
                  style={{
                    borderColor: confirmed && idx === q.answer ? "#16a34a" : confirmed && idx === selected && idx !== q.answer ? "#e11d48" : selected === idx ? "#2563eb" : "#cbd5e1",
                    background: confirmed && idx === q.answer ? "#16a34a" : confirmed && idx === selected && idx !== q.answer ? "#e11d48" : selected === idx ? "#2563eb" : "transparent",
                    color: (confirmed && (idx === q.answer || idx === selected)) || selected === idx ? "white" : "#94a3b8",
                  }}>
                  {confirmed && idx === q.answer ? "✓" : confirmed && idx === selected && idx !== q.answer ? "✕" : ["A","B","C","D"][idx]}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {confirmed && (
          <div className={`mt-4 px-4 py-3 rounded-2xl border ${selected === q.answer ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
            <p className={`text-xs font-black mb-0.5 ${selected === q.answer ? "text-emerald-700" : "text-red-700"}`}>
              {selected === q.answer ? "✓ Correct!" : "✕ Incorrect"}
            </p>
            {selected !== q.answer && (
              <p className="text-xs text-slate-600">
                The correct answer is: <strong>{q.options[q.answer]}</strong>
              </p>
            )}
            <p className="text-[10px] text-slate-400 mt-1">Rule: {q.ruleTitle}</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 sidebar-offset" style={{ boxShadow: "0 -4px 12px rgba(15,23,42,0.06)" }}>
        <div className="max-w-xl mx-auto">
          {!confirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selected === null}
              className="w-full py-4 rounded-2xl font-black text-sm text-white press disabled:opacity-40 transition-all"
              style={{ background: sectionColor, boxShadow: `0 4px 16px ${sectionColor}40` }}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl font-black text-sm text-white press"
              style={{ background: sectionColor, boxShadow: `0 4px 16px ${sectionColor}40` }}
            >
              {current + 1 >= totalQ ? "See Results →" : "Next Question →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
