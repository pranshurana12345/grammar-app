"use client";

import { useEffect, useRef } from "react";
import type { Idiom } from "@/data/idioms";

// Distinct gradient per reel so each idiom feels like its own "story".
const GRADIENTS = [
  "linear-gradient(160deg,#6d28d9 0%,#4f46e5 100%)",
  "linear-gradient(160deg,#0ea5e9 0%,#2563eb 100%)",
  "linear-gradient(160deg,#f59e0b 0%,#d97706 100%)",
  "linear-gradient(160deg,#ec4899 0%,#be185d 100%)",
  "linear-gradient(160deg,#10b981 0%,#0d9488 100%)",
  "linear-gradient(160deg,#f43f5e 0%,#e11d48 100%)",
  "linear-gradient(160deg,#8b5cf6 0%,#6d28d9 100%)",
  "linear-gradient(160deg,#14b8a6 0%,#0891b2 100%)",
];

export default function IdiomReel({
  idioms, startIndex, onClose,
}: { idioms: Idiom[]; startIndex: number; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lock background scroll + jump to the tapped idiom on open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const el = scrollRef.current?.querySelector(`[data-reel="${startIndex}"]`);
    el?.scrollIntoView({ block: "start" });
    return () => { document.body.style.overflow = prev; };
  }, [startIndex]);

  return (
    <div className="fixed inset-0 z-[60] lg:hidden bg-black">
      {/* Close */}
      <button onClick={onClose} aria-label="Close"
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white press"
        style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)" }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 3l10 10M13 3L3 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div ref={scrollRef} className="reel-scroll h-full overflow-y-scroll">
        {idioms.map((idi, i) => (
          <section key={idi.phrase} data-reel={i}
            className="reel-page relative flex flex-col items-center justify-center text-center px-9"
            style={{ height: "100dvh", background: GRADIENTS[i % GRADIENTS.length] }}>

            {/* progress */}
            <span className="absolute top-4 left-4 text-white/85 text-[11px] font-black bg-black/25 px-2.5 py-1 rounded-full tabular-nums">
              {i + 1} / {idioms.length}
            </span>

            {/* picture */}
            <div className="text-[118px] leading-none mb-7 idiom-float" style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.25))" }}>
              {idi.pic}
            </div>

            {/* phrase + meaning + example */}
            <div className="idiom-rise">
              <h2 className="text-white text-[30px] font-black tracking-tight leading-tight mb-4" style={{ textShadow: "0 2px 14px rgba(0,0,0,0.25)" }}>
                {idi.phrase}
              </h2>
              <p className="text-white/95 text-[17px] font-semibold leading-snug mb-5 max-w-sm mx-auto">
                {idi.meaning}
              </p>
              <p className="text-white/75 text-[14px] italic leading-snug max-w-xs mx-auto">
                “{idi.example}”
              </p>
            </div>

            {/* swipe hint on the first-opened reel */}
            {i === startIndex && i < idioms.length - 1 && (
              <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/80 pointer-events-none">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="idiom-float">
                  <path d="M11 16V5M6 10l5-5 5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[11px] font-bold mt-0.5">swipe up</span>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
