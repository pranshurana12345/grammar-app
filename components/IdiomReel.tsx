"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Idiom } from "@/data/idioms";
import EmojiPic from "@/components/EmojiPic";

const GRADIENTS = [
  "linear-gradient(160deg,#6d28d9 0%,#4f46e5 100%)",
  "linear-gradient(160deg,#0ea5e9 0%,#2d7ff9 100%)",
  "linear-gradient(160deg,#f59e0b 0%,#d97706 100%)",
  "linear-gradient(160deg,#ec4899 0%,#be185d 100%)",
  "linear-gradient(160deg,#10b981 0%,#0d9488 100%)",
  "linear-gradient(160deg,#f43f5e 0%,#e11d48 100%)",
  "linear-gradient(160deg,#8b5cf6 0%,#6d28d9 100%)",
  "linear-gradient(160deg,#14b8a6 0%,#0891b2 100%)",
];

const KNOWN_KEY = "idioms_known";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function loadKnown(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(KNOWN_KEY) || "[]")); }
  catch { return new Set(); }
}

// Full-screen swipeable reel of idioms (mobile). Used by the Reels tab.
export default function IdiomReel({ idioms }: { idioms: Idiom[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const appendingRef = useRef(false);

  const [order, setOrder] = useState<Idiom[]>(() => shuffle(idioms));
  const [known, setKnown] = useState<Set<string>>(() => (typeof window !== "undefined" ? loadKnown() : new Set()));
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [practice, setPractice] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const toggleKnown = useCallback((p: string) => {
    setKnown((prev) => {
      const n = new Set(prev);
      if (n.has(p)) n.delete(p); else n.add(p);
      try { localStorage.setItem(KNOWN_KEY, JSON.stringify([...n])); } catch { /* ignore */ }
      return n;
    });
  }, []);
  const toggleReveal = useCallback((p: string) => {
    setRevealed((prev) => { const n = new Set(prev); if (n.has(p)) n.delete(p); else n.add(p); return n; });
  }, []);

  function reshuffle() {
    setRevealed(new Set());
    setOrder(shuffle(idioms));
    scrollRef.current?.scrollTo({ top: 0 });
  }
  function speak(idi: Idiom) {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(practice ? idi.phrase : `${idi.phrase}. ${idi.meaning}`);
      u.lang = "en-US"; u.rate = 0.95;
      synth.speak(u);
    } catch { /* ignore */ }
  }
  function onScroll() {
    const el = scrollRef.current;
    if (!el || appendingRef.current) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < el.clientHeight * 1.5) {
      appendingRef.current = true;
      setOrder((prev) => [...prev, ...shuffle(idioms)]);
      setTimeout(() => { appendingRef.current = false; }, 300);
    }
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden bg-black">
      <div ref={scrollRef} onScroll={onScroll} className="reel-scroll h-full overflow-y-scroll">
        {order.map((idi, i) => {
          const show = !practice || revealed.has(idi.phrase);
          const isKnown = known.has(idi.phrase);
          return (
            <section key={`${idi.phrase}-${i}`} data-reel={i}
              className="reel-page relative overflow-hidden flex flex-col justify-center pl-6 pr-[86px] pb-28"
              style={{ height: "100dvh", background: GRADIENTS[i % GRADIENTS.length] }}>

              {/* hero emoji */}
              <EmojiPic pic={idi.pic} single={132} className="self-start mb-5 idiom-float"
                filter={idi.picFilter} style={{ filter: "drop-shadow(0 12px 26px rgba(0,0,0,0.30))" }} />

              {/* caption */}
              <div className="text-left idiom-rise">
                <h2 className="text-white text-[31px] font-black tracking-tight leading-[1.08] mb-2.5" style={{ textShadow: "0 2px 14px rgba(0,0,0,0.30)" }}>
                  {idi.phrase}
                </h2>
                {show ? (
                  <>
                    <p className="text-white text-[17px] font-semibold leading-snug mb-3">{idi.meaning}</p>
                    <p className="text-white/70 text-[14px] italic leading-snug">“{idi.example}”</p>
                  </>
                ) : (
                  <div>
                    <p className="text-white/85 text-[15px] font-semibold mb-3">🤔 Recall the meaning…</p>
                    <button onClick={() => toggleReveal(idi.phrase)}
                      className="px-5 py-2 rounded-full text-[13px] font-bold text-white press"
                      style={{ background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.35)" }}>
                      Tap to reveal
                    </button>
                  </div>
                )}
              </div>

              {/* Right action rail */}
              <div className="absolute right-2.5 bottom-28 flex flex-col items-center gap-4">
                <RailBtn onClick={() => toggleKnown(idi.phrase)} active={isKnown} label={isKnown ? "Known" : "Know"}>
                  <Heart filled={isKnown} />
                </RailBtn>
                {practice && (
                  <RailBtn onClick={() => toggleReveal(idi.phrase)} active={show} label={show ? "Hide" : "Reveal"}>
                    {show ? <EyeOff /> : <Eye />}
                  </RailBtn>
                )}
                <RailBtn onClick={() => speak(idi)} label="Hear"><Speaker /></RailBtn>
                <RailBtn onClick={reshuffle} label="Shuffle"><Shuffle /></RailBtn>
                <RailBtn onClick={() => setPractice((p) => !p)} active={practice} label="Practice"><Target /></RailBtn>
              </div>

              {i === 0 && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/65 pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 22 22" fill="none" className="idiom-float">
                    <path d="M11 16V5M6 10l5-5 5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[11px] font-bold mt-0.5">swipe up</span>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function RailBtn({ children, label, active, onClick }: {
  children: React.ReactNode; label: string; active?: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 press">
      <span className="w-11 h-11 rounded-full flex items-center justify-center"
        style={{ background: active ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.28)", backdropFilter: "blur(6px)", color: active ? "#e11d48" : "#fff" }}>
        {children}
      </span>
      <span className="text-white text-[10px] font-bold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>{label}</span>
    </button>
  );
}

function Heart({ filled }: { filled?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"}>
      <path d="M10 17s-6.2-4.1-6.2-8.4A3.4 3.4 0 0 1 10 6.2a3.4 3.4 0 0 1 6.2 2.4C16.2 12.9 10 17 10 17z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function Eye() {
  return (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10z" stroke="currentColor" strokeWidth="1.6" /><circle cx="10" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.6" /></svg>);
}
function EyeOff() {
  return (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.2 7.3A2.3 2.3 0 0 0 10 12.3M3 3l14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M6.3 6.4C3.7 7.8 2 10 2 10s3 5.5 8 5.5c1.2 0 2.3-.3 3.3-.8M9 4.6c.3 0 .7-.1 1-.1 5 0 8 5.5 8 5.5a15 15 0 0 1-2 2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>);
}
function Speaker() {
  return (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 7.5v5h3l4 3v-11l-4 3H4z" fill="currentColor" /><path d="M14 7a4 4 0 0 1 0 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>);
}
function Shuffle() {
  return (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h3.5l7 10H17M3 15h3.5l2-3M13 9l1.5-2H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 3l2 2-2 2M15 13l2 2-2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}
function Target() {
  return (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6" /><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" /><circle cx="10" cy="10" r="0.6" fill="currentColor" /></svg>);
}
