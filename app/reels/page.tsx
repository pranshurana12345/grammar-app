"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IDIOMS } from "@/data/idioms";
import IdiomReel from "@/components/IdiomReel";
import PracticeReel from "@/components/PracticeReel";

// Reels tab: swipeable idioms + AI practice questions, reel-style.
export default function ReelsPage() {
  return (
    <Suspense fallback={null}>
      <ReelsInner />
    </Suspense>
  );
}

function ReelsInner() {
  const params = useSearchParams();
  const [tab, setTab] = useState<"reels" | "practice">(
    params.get("tab") === "practice" ? "practice" : "reels",
  );
  const focus = params.get("focus") || undefined;

  return (
    <>
      {/* Mobile: full-screen reel with a mode switch on top */}
      <div className="lg:hidden">
        {tab === "reels" ? <IdiomReel idioms={IDIOMS} /> : <PracticeReel focus={focus} />}

        {/* Reels ⇄ Practice switch */}
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex rounded-full p-1"
          style={{ background: "rgba(0,0,0,0.38)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.18)" }}>
          {([
            { key: "reels", label: "🎬 Reels" },
            { key: "practice", label: "🧠 Practice" },
          ] as const).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-4 py-1.5 rounded-full text-[12.5px] font-black transition-colors press"
              style={tab === t.key
                ? { background: "rgba(255,255,255,0.95)", color: "#0f172a" }
                : { color: "rgba(255,255,255,0.85)" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: reels are a mobile experience */}
      <div className="hidden lg:flex min-h-screen items-center justify-center p-10" style={{ background: "#f0f4ff" }}>
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🎬</div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Reels</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Swipe through idioms — or switch to Practice and answer AI-made AFCAT questions,
            reel-style. It&apos;s built for your phone: open the app on mobile to flip through,
            answer MCQs, and get instant rule-based explanations.
          </p>
        </div>
      </div>
    </>
  );
}
