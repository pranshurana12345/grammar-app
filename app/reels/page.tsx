"use client";

import { IDIOMS } from "@/data/idioms";
import IdiomReel from "@/components/IdiomReel";

// Reels tab: a mix of idioms (and, later, vocabulary) shown reel-style.
// For now it's idioms only.
export default function ReelsPage() {
  return (
    <>
      {/* Mobile: full-screen swipeable reel */}
      <IdiomReel idioms={IDIOMS} />

      {/* Desktop: reels are a mobile experience */}
      <div className="hidden lg:flex min-h-screen items-center justify-center p-10" style={{ background: "#f0f4ff" }}>
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🎬</div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Reels</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Swipe through idioms reel-style — it’s built for your phone. Open the app on mobile to flip
            through them, practise, and mark the ones you know. (You can also read the full list under
            Study Hub → Idioms &amp; Phrases.)
          </p>
        </div>
      </div>
    </>
  );
}
