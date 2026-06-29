"use client";

import React from "react";

function splitPoints(text: string, lang: "en" | "hi"): string[] {
  if (lang === "hi") {
    // Hindi/Hinglish: split on Devanagari danda (।), pipe (|), em dash, or period+space
    return text
      .split(/।|\s*\|\s*|\s+—\s+|(?<=[a-zA-Zऀ-ॿ\d])\.\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  // English: existing behaviour
  return text
    .split(/(?<=\.)\s+(?=[A-Z])/)
    .flatMap((s) => s.split(/\s+—\s+/))
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Splits a string into alternating plain/caps segments.
 * A "caps token" is a word that is ALL-UPPERCASE and at least 2 chars
 * (allowing digits and + - inside, e.g. V3, HAD+V3, V-ing).
 * Single letters like "I" and "A" are left plain to avoid over-highlighting.
 */
function tokenize(text: string): Array<{ caps: boolean; value: string }> {
  // Split on word boundaries but keep the separators
  const parts = text.split(/(\b[A-Z][A-Z0-9+\-]*[A-Z0-9]\b)/);
  return parts.map((part) => {
    // A caps token: 2+ chars, all uppercase (with digits/+/- inside)
    const isCaps = /^[A-Z][A-Z0-9+\-]*[A-Z0-9]$/.test(part);
    return { caps: isCaps, value: part };
  }).filter((t) => t.value !== "");
}

function HighlightedText({
  text,
  color,
  className,
}: {
  text: string;
  color: string;
  className?: string;
}) {
  const tokens = tokenize(text);
  const hasAnyCaps = tokens.some((t) => t.caps);

  if (!hasAnyCaps) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {tokens.map((token, i) =>
        token.caps ? (
          <span
            key={i}
            className="inline-flex items-center rounded px-1 py-0 font-black text-white mx-0.5 leading-tight"
            style={{
              background: color,
              fontSize: "0.85em",
              verticalAlign: "middle",
              letterSpacing: "0.03em",
            }}
          >
            {token.value}
          </span>
        ) : (
          <span key={i}>{token.value}</span>
        )
      )}
    </span>
  );
}

export default function RulePoints({
  text,
  color,
  size = "md",
  lang = "en",
}: {
  text: string;
  color: string;
  size?: "sm" | "md";
  lang?: "en" | "hi";
}) {
  const raw = splitPoints(text, lang);

  const textClass = size === "sm" ? "text-[13px]" : "text-[15px]";
  const dotClass = size === "sm" ? "w-4 h-4 text-[9px]" : "w-5 h-5 text-[11px]";

  if (raw.length <= 1) {
    return (
      <p className={`${textClass} font-semibold text-slate-800 leading-relaxed`}>
        <HighlightedText text={text} color={color} />
      </p>
    );
  }

  return (
    <ul className="space-y-2.5">
      {raw.map((point, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            className={`flex-shrink-0 ${dotClass} rounded-full flex items-center justify-center mt-0.5 text-white font-black`}
            style={{ background: color }}
          >
            {i + 1}
          </span>
          <HighlightedText
            text={point}
            color={color}
            className={`${textClass} font-semibold text-slate-800 leading-snug`}
          />
        </li>
      ))}
    </ul>
  );
}
