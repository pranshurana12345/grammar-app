"use client";

// Renders an idiom "pic" that may contain 1–3 emojis.
// - Scales the font size down for 2–3 emojis so the group stays compact
//   (a bit wider than a single emoji, not bigger overall).
// - If the SAME emoji flanks both ends (e.g. 🪽🐷🪽), the leading one is
//   mirrored so the pair faces outward symmetrically — a more polished look.
function segments(pic: string): string[] {
  try {
    return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(pic)].map((s) => s.segment);
  } catch {
    return [...pic];
  }
}

export default function EmojiPic({
  pic, single, className, style, filter,
}: { pic: string; single: number; className?: string; style?: React.CSSProperties; filter?: string }) {
  const units = segments(pic);
  const size = Math.round(single / (0.5 * units.length + 0.5));
  const flank = units.length >= 3 && units[0] === units[units.length - 1];
  const mergedFilter = [style?.filter, filter].filter(Boolean).join(" ") || undefined;

  return (
    <span className={`inline-flex items-center whitespace-nowrap ${className ?? ""}`}
      style={{ fontSize: size, lineHeight: 1, ...style, filter: mergedFilter }}>
      {units.map((u, i) => (
        <span key={i} style={i === 0 && flank ? { display: "inline-block", transform: "scaleX(-1)" } : undefined}>
          {u}
        </span>
      ))}
    </span>
  );
}
