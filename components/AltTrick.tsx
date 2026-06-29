"use client";

import { useState } from "react";

/* Render **bold**, _italic_, and \n line breaks inside a trick string. */
function TrickText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, li) => (
        <span key={li} className="block">
          {line.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).map((p, i) => {
            if (p.startsWith("**") && p.endsWith("**"))
              return <b key={i} className="font-extrabold text-violet-900">{p.slice(2, -2)}</b>;
            if (p.startsWith("_") && p.endsWith("_"))
              return <i key={i} className="text-slate-500 font-mono-ex not-italic">{p.slice(1, -1)}</i>;
            return <span key={i}>{p}</span>;
          })}
        </span>
      ))}
    </>
  );
}

export default function AltTrick({ trick }: { trick: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl press transition-all"
        style={{ background: open ? "#ede9fe" : "#f5f3ff", border: "1px solid #ddd6fe" }}
      >
        <span className="flex items-center gap-2 text-[13px] font-bold text-violet-700">
          <span>💡</span> {open ? "Hide trick" : "See alternative trick"}
        </span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-violet-400 flex-shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="mt-1.5 rounded-xl px-4 py-3 text-[13px] leading-relaxed text-slate-700 space-y-0.5"
          style={{ background: "#faf5ff", border: "1px solid #ede9fe" }}>
          <TrickText text={trick} />
        </div>
      )}
    </div>
  );
}
