"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import EmojiPic from "@/components/EmojiPic";
import type { Idiom } from "@/data/idioms";

// The detail half of the notes view: the list shows only picture, name and
// meaning, and everything else lives here — where the phrase came from, and a
// gloss for any hard word inside the phrase itself ("hay", "squib", "gauntlet").
export default function IdiomDetail({ idiom, onClose }: { idiom: Idiom | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Close on Escape, and don't let the page behind scroll while this is open.
  useEffect(() => {
    if (!idiom) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [idiom, onClose]);

  if (!idiom || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[85] flex items-end sm:items-center sm:justify-center"
      onClick={onClose} role="dialog" aria-modal="true"
      style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)", animation: "idiom-fade 0.2s ease" }}>
      <style>{`@keyframes idiom-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes idiom-slide { from { transform: translateY(24px); opacity: 0.5 } to { transform: translateY(0); opacity: 1 } }`}</style>

      <div onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[88vh] flex flex-col"
        style={{ animation: "idiom-slide 0.28s cubic-bezier(0.2,0.8,0.25,1)", paddingBottom: "env(safe-area-inset-bottom)" }}>

        {/* drag handle (mobile) */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center flex-shrink-0">
          <span className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        <div className="overflow-y-auto px-5 pb-5 pt-2">
          {/* picture + phrase + meaning */}
          <div className="flex flex-col items-center text-center pt-2 pb-4">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-3"
              style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)", border: "1px solid #fcd34d" }}>
              <EmojiPic pic={idiom.pic} single={40} filter={idiom.picFilter} />
            </div>
            {idiom.group && (
              <p className="text-[9.5px] font-black uppercase tracking-[0.18em] text-amber-600 mb-1.5">{idiom.group}</p>
            )}
            <h2 className="text-[19px] font-black text-slate-900 leading-tight">{idiom.phrase}</h2>
            <p className="text-[14px] text-slate-600 font-semibold leading-snug mt-1.5">{idiom.meaning}</p>
          </div>

          {/* where it comes from */}
          {idiom.story && (
            <div className="rounded-2xl p-4 mb-3" style={{ background: "#f8fafc", border: "1px solid #e9eef6" }}>
              <p className="text-[9.5px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                📖 Where it comes from
              </p>
              <p className="text-[13px] text-slate-700 leading-relaxed">{idiom.story}</p>
            </div>
          )}

          {/* gloss for hard words inside the phrase */}
          {idiom.hardWords && idiom.hardWords.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background: "#eff6ff", border: "1px solid #dbeafe" }}>
              <p className="text-[9.5px] font-black uppercase tracking-widest text-blue-500 mb-2">
                🔤 Word notes
              </p>
              <div className="space-y-1.5">
                {idiom.hardWords.map((w) => (
                  <p key={w.word} className="text-[12.5px] leading-relaxed">
                    <span className="font-black text-blue-900">{w.word}</span>
                    <span className="text-blue-400"> — </span>
                    <span className="text-slate-600">{w.meaning}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* vocabulary cards reuse this component */}
          {(idiom.synonyms?.length || idiom.antonyms?.length) ? (
            <div className="mt-3 space-y-1.5">
              {idiom.synonyms && idiom.synonyms.length > 0 && (
                <p className="text-[12.5px]"><span className="font-black text-emerald-600">Syn</span> <span className="text-slate-600">{idiom.synonyms.join(" · ")}</span></p>
              )}
              {idiom.antonyms && idiom.antonyms.length > 0 && (
                <p className="text-[12.5px]"><span className="font-black text-rose-500">Ant</span> <span className="text-slate-600">{idiom.antonyms.join(" · ")}</span></p>
              )}
            </div>
          ) : null}

          <button onClick={onClose}
            className="w-full mt-4 py-3 rounded-2xl text-[13.5px] font-black text-slate-500 press"
            style={{ background: "#f1f5f9" }}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
