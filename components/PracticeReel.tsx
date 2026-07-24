"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AskAISheet from "@/components/AskAISheet";
import { recordPracticeAnswer } from "@/lib/practice";
import {
  fetchQuestions, loadQueue, saveQueue, normalizeStem,
  type PracticeQuestion,
} from "@/lib/practiceQueue";
import { isGrammarQuestion } from "@/lib/questionCheck";

export type { PracticeQuestion };

const GRADIENTS = [
  "linear-gradient(165deg,#1e1b4b 0%,#4338ca 100%)",
  "linear-gradient(165deg,#082f49 0%,#0369a1 100%)",
  "linear-gradient(165deg,#3b0764 0%,#7e22ce 100%)",
  "linear-gradient(165deg,#134e4a 0%,#0f766e 100%)",
  "linear-gradient(165deg,#4a044e 0%,#a21caf 100%)",
  "linear-gradient(165deg,#431407 0%,#c2410c 100%)",
];

const TIMER_SECONDS = 30;
const LETTERS = ["A", "B", "C", "D"];

// Full-screen swipeable reel of AI-generated AFCAT MCQs (mobile).
export default function PracticeReel({ focus }: { focus?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);

  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [picked, setPicked] = useState<Record<string, number>>({}); // -1 = timed out
  const [score, setScore] = useState({ right: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timerMode, setTimerMode] = useState(true); // auto-timer on by default
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [grammarOnly, setGrammarOnly] = useState(false); // false = all questions
  const [askFor, setAskFor] = useState<PracticeQuestion | null>(null);
  const questionsRef = useRef<PracticeQuestion[]>([]);
  questionsRef.current = questions;

  // What the student actually scrolls through. In Grammar-only mode, vocab/idiom
  // questions are hidden (belt-and-braces with the server, which also filters).
  const visible = grammarOnly ? questions.filter(isGrammarQuestion) : questions;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // grammarMode is passed in (not read from state) so this callback doesn't need
  // grammarOnly in its deps — that keeps the one-time initial-load effect from
  // re-firing and flashing the loader every time the student flips the toggle.
  const fetchBatch = useCallback(async (initial = false, grammarMode = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    if (initial) { setLoading(true); setError(""); }
    try {
      const onScreen = questionsRef.current.map((q) => q.question.slice(0, 120));
      const fresh = await fetchQuestions(5, focus || "", onScreen, grammarMode);
      if (fresh.length) {
        setQuestions((prev) => {
          const known = new Set(prev.map((q) => normalizeStem(q.question)));
          return [...prev, ...fresh.filter((q) => !known.has(normalizeStem(q.question)))];
        });
        // Keep the shared queue topped up for the next session — general mode only
        // (a grammar-only batch would otherwise bias the mixed "All" queue).
        if (!focus && !grammarMode) saveQueue([...loadQueue(), ...fresh]);
      }
    } catch (e) {
      if (initial && questionsRef.current.length === 0) {
        setError(e instanceof Error ? e.message : "Could not load questions");
      }
    } finally {
      fetchingRef.current = false;
      if (initial) setLoading(false);
    }
  }, [focus]);

  // Start instantly from the prefetched queue; only show the loader when empty.
  useEffect(() => {
    const cached = focus ? [] : loadQueue();
    if (cached.length > 0) {
      setQuestions(cached);
      setLoading(false);
    } else {
      void fetchBatch(true);
    }
  }, [focus, fetchBatch]);

  // Stay 3+ questions ahead of the student — fetch before they can catch up.
  // Keyed off `visible` so Grammar-only mode keeps fetching until enough grammar
  // questions have accumulated (filtered-out vocab/idioms don't count).
  useEffect(() => {
    if (loading || questions.length === 0) return;
    if (visible.length - currentIdx <= 4) void fetchBatch(false, grammarOnly);
  }, [loading, questions.length, visible.length, currentIdx, fetchBatch, grammarOnly]);

  const answer = useCallback((q: PracticeQuestion, idx: number) => {
    setPicked((prev) => {
      if (q.id in prev) return prev;
      const correct = idx === q.correctIndex;
      setScore((s) => ({ right: s.right + (correct ? 1 : 0), total: s.total + 1 }));
      recordPracticeAnswer({
        q: q.question.slice(0, 120),
        category: q.category,
        section: q.section,
        correct,
        ts: new Date().toISOString(),
      });
      return { ...prev, [q.id]: idx };
    });
  }, []);

  // ── Timer ──────────────────────────────────────────────────────────────────
  const current = visible[currentIdx];
  const currentAnswered = current ? current.id in picked : false;
  useEffect(() => {
    if (!timerMode || !current || currentAnswered) return;
    setTimeLeft(TIMER_SECONDS);
    const iv = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(iv);
          answer(current, -1); // time's up → counts as wrong, reveals answer
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [timerMode, current, currentAnswered, answer]);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    if (idx !== currentIdx) setCurrentIdx(idx);
  }

  function toggleGrammarOnly() {
    setGrammarOnly((g) => !g);
    // The visible list changes length; jump to the top so the scroll position
    // and currentIdx stay in sync instead of landing on a different question.
    setCurrentIdx(0);
    scrollRef.current?.scrollTo({ top: 0 });
  }

  function speak(q: PracticeQuestion) {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(q.question);
      u.lang = "en-US"; u.rate = 0.95;
      synth.speak(u);
    } catch { /* ignore */ }
  }

  // ── Loading / error screens ─────────────────────────────────────────────────
  if (loading) {
    return (
      <Shell>
        <div className="text-5xl mb-4 idiom-float">🧠</div>
        <p className="text-white text-lg font-black mb-1.5">Writing your questions…</p>
        <p className="text-white/60 text-[13px] font-semibold">AI is preparing fresh AFCAT-style MCQs</p>
        <div className="flex gap-1.5 mt-5">
          {[0, 1, 2].map((d) => (
            <span key={d} className="w-2.5 h-2.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
          ))}
        </div>
      </Shell>
    );
  }
  if (error) {
    return (
      <Shell>
        <div className="text-5xl mb-4">😵</div>
        <p className="text-white text-lg font-black mb-1.5">Couldn&apos;t load questions</p>
        <p className="text-white/60 text-[13px] font-semibold mb-5 px-8 text-center">{error}</p>
        <button onClick={() => void fetchBatch(true)}
          className="px-6 py-2.5 rounded-full text-[13px] font-bold text-white press"
          style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)" }}>
          Try again
        </button>
      </Shell>
    );
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden bg-black">
      <div ref={scrollRef} onScroll={onScroll} className="reel-scroll h-full overflow-y-scroll">
        {visible.map((q, i) => {
          const chosen = picked[q.id];
          const answered = q.id in picked;
          const timedOut = chosen === -1;
          return (
            <section key={q.id} data-reel={i}
              className="reel-page relative overflow-hidden flex flex-col"
              style={{ height: "100dvh", background: GRADIENTS[i % GRADIENTS.length] }}>

              <div className="flex-1 overflow-y-auto px-5 pt-20 pb-40">
                {/* topic is deliberately hidden until answered — no hints */}

                {/* question */}
                <h2 className="text-white text-[19px] font-extrabold leading-snug mb-5 whitespace-pre-wrap"
                  style={{ textShadow: "0 1px 10px rgba(0,0,0,0.25)" }}>
                  {q.question}
                </h2>

                {/* options */}
                <div className="space-y-2.5">
                  {q.options.map((opt, oi) => {
                    const isCorrect = oi === q.correctIndex;
                    const isChosen = oi === chosen;
                    let bg = "rgba(255,255,255,0.10)";
                    let border = "1px solid rgba(255,255,255,0.22)";
                    if (answered && isCorrect) { bg = "rgba(34,197,94,0.92)"; border = "1px solid #4ade80"; }
                    else if (answered && isChosen) { bg = "rgba(239,68,68,0.92)"; border = "1px solid #f87171"; }
                    else if (answered) { bg = "rgba(255,255,255,0.05)"; border = "1px solid rgba(255,255,255,0.10)"; }
                    const showWhy = answered && (isCorrect || isChosen);
                    return (
                      <button key={oi} onClick={() => answer(q, oi)} disabled={answered}
                        className="w-full text-left rounded-2xl px-3.5 py-3 press transition-colors duration-200"
                        style={{ background: bg, border, backdropFilter: "blur(4px)" }}>
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 mt-0.5"
                            style={{
                              background: answered && (isCorrect || isChosen) ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.15)",
                              color: answered && isCorrect ? "#15803d" : answered && isChosen ? "#b91c1c" : "#fff",
                            }}>
                            {answered && isCorrect ? "✓" : answered && isChosen ? "✗" : LETTERS[oi]}
                          </span>
                          <span className={`text-[14.5px] font-semibold leading-snug ${answered && !isCorrect && !isChosen ? "text-white/45" : "text-white"}`}>
                            {opt.text}
                          </span>
                        </div>
                        {showWhy && (
                          <p className="text-white/90 text-[12px] leading-snug mt-2 ml-[34px] font-medium">{opt.why}</p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* explanation */}
                {answered && (
                  <div className="mt-4 rounded-2xl p-4 idiom-rise"
                    style={{ background: "rgba(0,0,0,0.32)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(6px)" }}>
                    {timedOut && (
                      <p className="text-amber-300 text-[12px] font-black mb-1.5">⏰ Time&apos;s up!</p>
                    )}
                    <p className="text-[11px] font-black uppercase tracking-widest mb-1"
                      style={{ color: chosen === q.correctIndex ? "#4ade80" : "#fda4af" }}>
                      {chosen === q.correctIndex ? "Correct! 🎉" : `Answer: ${LETTERS[q.correctIndex]}`}
                    </p>
                    <p className="text-white text-[13px] font-bold mb-1.5">📘 {q.rule}</p>
                    <p className="text-white/85 text-[13px] leading-relaxed">{q.explanation}</p>
                    <p className="text-white/45 text-[10.5px] font-black uppercase tracking-wider mt-2.5">
                      {q.category} · {q.section}
                    </p>

                    {/* Ask AI entry — like a comment box */}
                    <button onClick={() => setAskFor(q)}
                      className="mt-3.5 w-full flex items-center gap-2.5 rounded-full px-4 py-2.5 press"
                      style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}>
                      <span className="text-[15px]">✨</span>
                      <span className="text-white/70 text-[13px] font-semibold">Still confused? Ask AI…</span>
                    </button>
                  </div>
                )}

                {answered && (
                  <div className="flex flex-col items-center mt-5 text-white/55 pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" className="idiom-float">
                      <path d="M11 16V5M6 10l5-5 5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[11px] font-bold mt-0.5">swipe up for next</span>
                  </div>
                )}
              </div>

              {/* top-right controls */}
              <div className="absolute top-16 right-4 flex flex-col items-end gap-2 pointer-events-none">
                <span className="px-3 py-1.5 rounded-full text-[12px] font-black text-white"
                  style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}>
                  {score.right}/{score.total}
                </span>
                {timerMode && i === currentIdx && !answered && (
                  <span className="px-3 py-1.5 rounded-full text-[13px] font-black"
                    style={{ background: timeLeft <= 10 ? "rgba(225,29,72,0.9)" : "rgba(0,0,0,0.35)", color: "#fff", backdropFilter: "blur(6px)" }}>
                    ⏱ {timeLeft}s
                  </span>
                )}
              </div>

              {/* bottom action rail */}
              <div className="absolute bottom-24 right-3 flex flex-col items-center gap-4">
                <RailBtn onClick={toggleGrammarOnly} active={grammarOnly} label={grammarOnly ? "Grammar" : "All"}>
                  <GrammarIcon />
                </RailBtn>
                <RailBtn onClick={() => setTimerMode((t) => !t)} active={timerMode} label={timerMode ? "Timed" : "Timer"}>
                  <ClockIcon />
                </RailBtn>
                <RailBtn onClick={() => speak(q)} label="Hear"><SpeakerIcon /></RailBtn>
              </div>
            </section>
          );
        })}

        {/* tail loader while appending */}
        <section className="reel-page flex items-center justify-center" style={{ height: "100dvh", background: "#0f172a" }}>
          <div className="flex flex-col items-center">
            <div className="flex gap-1.5 mb-3">
              {[0, 1, 2].map((d) => (
                <span key={d} className="w-2.5 h-2.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
              ))}
            </div>
            <p className="text-white/60 text-[13px] font-semibold">Loading more questions…</p>
          </div>
        </section>
      </div>

      <AskAISheet
        open={askFor !== null}
        onClose={() => setAskFor(null)}
        title={askFor ? askFor.rule : ""}
        suggestions={[
          "Explain this in a simpler way",
          "Why are the other options wrong?",
          "Give me a trick to remember this",
          "Ek aur example do na",
        ]}
        contextPreview={askFor ? `Q: ${askFor.question}\nAnswer: ${LETTERS[askFor.correctIndex]}) ${askFor.options[askFor.correctIndex].text}` : undefined}
        context={askFor ? [
          `Practice question (${askFor.category} / ${askFor.section}): ${askFor.question}`,
          `Options: ${askFor.options.map((o, i) => `${LETTERS[i]}) ${o.text}`).join("  ")}`,
          `Correct answer: ${LETTERS[askFor.correctIndex]}) ${askFor.options[askFor.correctIndex].text}`,
          `Rule: ${askFor.rule}`,
          `Explanation: ${askFor.explanation}`,
          picked[askFor.id] !== undefined && picked[askFor.id] >= 0
            ? `The student picked: ${LETTERS[picked[askFor.id]]}) ${askFor.options[picked[askFor.id]].text}`
            : "The student ran out of time on this question.",
        ].join("\n") : ""}
      />
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 lg:hidden flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(165deg,#1e1b4b 0%,#4338ca 100%)" }}>
      {children}
    </div>
  );
}

function RailBtn({ children, label, active, onClick }: {
  children: React.ReactNode; label: string; active?: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 press">
      <span className="w-11 h-11 rounded-full flex items-center justify-center"
        style={{ background: active ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.28)", backdropFilter: "blur(6px)", color: active ? "#2d7ff9" : "#fff" }}>
        {children}
      </span>
      <span className="text-white text-[10px] font-bold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>{label}</span>
    </button>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 6.5V10l2.5 1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function GrammarIcon() {
  // Stylised "A" — grammar vs. the broader vocab/idiom mix.
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 16L10 4l6 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.4 11.6h7.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function SpeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 7.5v5h3l4 3v-11l-4 3H4z" fill="currentColor" />
      <path d="M14 7a4 4 0 0 1 0 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
