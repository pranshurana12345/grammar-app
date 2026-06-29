"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { rules } from "@/data/rules";
import { getQuestionsForRule, Question } from "@/data/questions";
import { saveQuizScore, getQuizScore, getRuleStatus } from "@/lib/storage";
import Link from "next/link";
import RulePoints from "@/components/RulePoints";

export default function QuizPageClient() {
  const params = useParams();
  const router = useRouter();
  const ruleId = parseInt(params.ruleId as string, 10);

  const rule = rules.find((r) => r.id === ruleId);
  const questions = getQuestionsForRule(ruleId);

  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    setBestScore(getQuizScore(ruleId));
  }, [ruleId]);

  if (!rule || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-slate-500 mb-4">No quiz available for this rule yet.</p>
          <Link href="/feed" className="text-blue-600 font-bold underline">← Back to Learn</Link>
        </div>
      </div>
    );
  }

  const q: Question = questions[current];
  const totalQ = questions.length;
  const c = rule.sectionColor;

  function handleSelect(idx: number) {
    if (revealed) return;
    setSelected(idx);
  }

  function handleConfirm() {
    if (selected === null) return;
    setRevealed(true);
  }

  function handleNext() {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    setRevealed(false);

    if (current + 1 >= totalQ) {
      const correct = newAnswers.filter((a, i) => a === questions[i].answer).length;
      const score = Math.round((correct / totalQ) * 100);
      saveQuizScore(ruleId, score);
      setBestScore(Math.max(bestScore, score));
      setPhase("result");
    } else {
      setCurrent(current + 1);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setRevealed(false);
    setPhase("quiz");
  }

  const finalCorrect = answers.filter((a, i) => a === questions[i].answer).length;
  const finalScore = Math.round((finalCorrect / totalQ) * 100);
  const passed = finalScore >= 75;

  if (phase === "intro") {
    const prevBest = bestScore;
    const prevStatus = getRuleStatus(ruleId);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: "#f0f4ff" }}>
        <div className="w-full max-w-lg">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 text-sm font-bold mb-6 press hover:text-slate-700">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            Back
          </button>

          <div className="bg-white rounded-3xl p-8" style={{ boxShadow: "0 8px 40px rgba(15,23,42,0.10)" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-base"
                style={{ background: c }}>?</div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">{rule.ruleNumber}</p>
                <p className="text-sm font-bold text-slate-700">{rule.section}</p>
              </div>
            </div>

            <h1 className="text-2xl font-black text-slate-900 mb-2" style={{ letterSpacing: "-0.03em" }}>
              Test: {rule.title}
            </h1>
            <p className="text-slate-500 text-sm mb-8">{totalQ} questions · Score ≥75% to unlock <span className="text-emerald-600 font-bold">Confident ✓</span></p>

            {prevBest > 0 && (
              <div className={`rounded-2xl p-4 mb-6 flex items-center gap-3 ${prevBest >= 75 ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
                <span className="text-2xl">{prevBest >= 75 ? "🏆" : "📊"}</span>
                <div>
                  <p className="text-xs font-black text-slate-500 uppercase">Your Best Score</p>
                  <p className={`text-xl font-black ${prevBest >= 75 ? "text-emerald-700" : "text-amber-700"}`}>{prevBest}%</p>
                </div>
                {prevBest >= 75 && (
                  <span className="ml-auto text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">CONFIDENT ✓</span>
                )}
              </div>
            )}

            <div className="rounded-2xl p-4 mb-8 text-sm text-slate-700" style={{ background: `${c}10`, borderLeft: `3px solid ${c}` }}>
              <p className="font-bold text-xs text-slate-400 uppercase tracking-wide mb-1">Quick Recap</p>
              <RulePoints text={rule.rule} color={c} size="sm" />
            </div>

            <button onClick={() => setPhase("quiz")}
              className="w-full py-4 rounded-2xl font-black text-white text-base press"
              style={{ background: `linear-gradient(135deg, ${c}, ${c}cc)`, boxShadow: `0 6px 20px ${c}40` }}>
              Start Quiz →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    const progressPct = ((current) / totalQ) * 100;
    const isCorrect = revealed && selected === q.answer;
    const isWrong = revealed && selected !== q.answer;

    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#f0f4ff" }}>
        <div className="flex-shrink-0 bg-white border-b border-slate-100 px-4 py-4" style={{ boxShadow: "0 1px 0 rgba(15,23,42,0.04)" }}>
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setPhase("intro")} className="text-slate-400 text-sm font-semibold press hover:text-slate-600">✕ Quit</button>
              <span className="text-xs font-black text-slate-400">{current + 1} / {totalQ}</span>
              <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: `${c}15`, color: c }}>{rule.ruleNumber}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, background: c }} />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-black"
                style={{ background: c }}>Q{current + 1}</div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Question {current + 1}</span>
            </div>

            <h2 className="text-xl font-black text-slate-900 leading-tight mb-6" style={{ letterSpacing: "-0.02em" }}>
              {q.q}
            </h2>

            <div className="space-y-3 mb-6">
              {q.options.map((opt, i) => {
                let bg = "bg-white border-2 border-slate-100 text-slate-700";
                if (selected === i && !revealed) bg = "border-2 text-white font-bold";
                else if (revealed && i === q.answer) bg = "bg-emerald-50 border-2 border-emerald-400 text-emerald-800 font-bold";
                else if (revealed && selected === i && i !== q.answer) bg = "bg-rose-50 border-2 border-rose-400 text-rose-700 line-through";
                else if (revealed) bg = "bg-white border-2 border-slate-100 text-slate-400 opacity-60";

                return (
                  <button key={i} onClick={() => handleSelect(i)}
                    className={`w-full text-left px-5 py-4 rounded-2xl transition-all press text-sm font-semibold leading-snug ${bg} ${!revealed ? "hover:border-slate-300" : "cursor-default"}`}
                    style={selected === i && !revealed ? { background: c, borderColor: c } : {}}>
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-black mr-3 flex-shrink-0 ${
                      selected === i && !revealed ? "bg-white/25 text-white" :
                      revealed && i === q.answer ? "bg-emerald-200 text-emerald-700" :
                      revealed && selected === i ? "bg-rose-200 text-rose-700" :
                      "bg-slate-100 text-slate-500"
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {revealed && (
              <div className={`rounded-2xl p-4 mb-4 flex items-center gap-3 ${isCorrect ? "bg-emerald-50 border border-emerald-200" : "bg-rose-50 border border-rose-200"}`}>
                <span className="text-2xl">{isCorrect ? "✅" : "❌"}</span>
                <div>
                  <p className={`font-black text-sm ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
                    {isCorrect ? "Correct! Great work." : "Not quite."}
                  </p>
                  {!isCorrect && (
                    <p className="text-xs text-slate-600 mt-0.5">
                      Correct answer: <strong>{q.options[q.answer]}</strong>
                    </p>
                  )}
                </div>
              </div>
            )}

            {!revealed ? (
              <button onClick={handleConfirm} disabled={selected === null}
                className="w-full py-4 rounded-2xl font-black text-white text-base disabled:opacity-40 press"
                style={{ background: `linear-gradient(135deg, ${c}, ${c}cc)` }}>
                Confirm Answer
              </button>
            ) : (
              <button onClick={handleNext}
                className="w-full py-4 rounded-2xl font-black text-white text-base press"
                style={{ background: current + 1 >= totalQ ? "#16a34a" : `linear-gradient(135deg, ${c}, ${c}cc)` }}>
                {current + 1 >= totalQ ? "See Results →" : "Next Question →"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: "#f0f4ff" }}>
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl p-8 text-center" style={{ boxShadow: "0 8px 40px rgba(15,23,42,0.10)" }}>
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg width="128" height="128" viewBox="0 0 128 128" className="rotate-[-90deg]">
              <circle cx="64" cy="64" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle cx="64" cy="64" r="52" fill="none"
                stroke={passed ? "#16a34a" : "#f59e0b"} strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - finalScore / 100)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${passed ? "text-emerald-700" : "text-amber-600"}`}>{finalScore}%</span>
              <span className="text-xs font-bold text-slate-400">{finalCorrect}/{totalQ} correct</span>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-2" style={{ letterSpacing: "-0.03em" }}>
            {passed ? "🎉 Confident Unlocked!" : "Keep Practicing!"}
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            {passed
              ? `You've mastered "${rule.title}". It's now marked as Confident! ✓`
              : `You need 75% to unlock Confident. Score was ${finalScore}%. Try again!`}
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-600">{finalCorrect}</div>
              <div className="text-xs text-slate-400 font-semibold">Correct</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <div className="text-2xl font-black text-rose-500">{totalQ - finalCorrect}</div>
              <div className="text-xs text-slate-400 font-semibold">Wrong</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <div className="text-2xl font-black" style={{ color: c }}>{totalQ}</div>
              <div className="text-xs text-slate-400 font-semibold">Total</div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {!passed && (
              <button onClick={handleRestart}
                className="w-full py-4 rounded-2xl font-black text-white press"
                style={{ background: `linear-gradient(135deg, ${c}, ${c}cc)`, boxShadow: `0 6px 20px ${c}40` }}>
                Try Again →
              </button>
            )}
            <button onClick={() => router.back()}
              className="w-full py-4 rounded-2xl font-black text-slate-700 press bg-slate-100 hover:bg-slate-200">
              ← Back to Rule
            </button>
            <Link href="/feed"
              className="w-full py-4 rounded-2xl font-bold text-blue-600 text-center press bg-blue-50 hover:bg-blue-100 block">
              Continue Learning →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
