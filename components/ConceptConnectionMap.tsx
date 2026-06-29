"use client";

import Link from "next/link";
import { CONCEPTS, CATEGORY_META, getConceptBySlug } from "@/data/concepts";
import type { Connection } from "@/data/conceptConnections";

type Props = {
  slug: string;
  color: string;
  outgoing: Connection[];
  incoming: Connection[];
};

export default function ConceptConnectionMap({ slug, color, outgoing, incoming }: Props) {
  const current = getConceptBySlug(slug)!;
  const all = [
    ...incoming.map((c) => ({ ...c, dir: "incoming" as const })),
    ...outgoing.map((c) => ({ ...c, dir: "outgoing" as const })),
  ];

  if (all.length === 0) return null;

  return (
    <div className="space-y-3">
      {all.map((conn, i) => {
        const otherSlug = conn.dir === "outgoing" ? conn.toSlug : conn.fromSlug;
        const other = getConceptBySlug(otherSlug);
        if (!other) return null;

        // Left box = source concept, right box = result concept
        const leftConcept  = conn.dir === "outgoing" ? current : other;
        const rightConcept = conn.dir === "outgoing" ? other   : current;
        const leftIsCurrent  = conn.dir === "outgoing";
        const rightIsCurrent = conn.dir === "incoming";

        return (
          <Link key={i} href={`/concept/${otherSlug}`} className="press block">
            <div
              className="bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all"
              style={{ border: `1.5px solid ${other.color}25` }}
            >
              {/* ── Visual equation row ── */}
              <div className="flex items-stretch min-h-[80px]">

                {/* Left concept box */}
                <ConceptBox
                  emoji={leftConcept.emoji}
                  title={leftConcept.title}
                  color={leftConcept.color}
                  isCurrent={leftIsCurrent}
                />

                {/* Arrow + label */}
                <div className="flex flex-col items-center justify-center px-3 py-3 flex-shrink-0 min-w-[80px]">
                  <span
                    className="text-[10px] font-black text-center leading-tight mb-1.5 px-2"
                    style={{ color: leftIsCurrent ? color : other.color }}
                  >
                    {conn.via}
                  </span>
                  {/* Arrow */}
                  <svg width="40" height="14" viewBox="0 0 40 14" fill="none">
                    <line
                      x1="2" y1="7" x2="34" y2="7"
                      stroke={leftIsCurrent ? color : other.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M28 2L36 7L28 12"
                      stroke={leftIsCurrent ? color : other.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>

                {/* Right concept box */}
                <ConceptBox
                  emoji={rightConcept.emoji}
                  title={rightConcept.title}
                  color={rightConcept.color}
                  isCurrent={rightIsCurrent}
                />
              </div>

              {/* ── Note row ── */}
              <div
                className="px-5 py-3 border-t flex items-center gap-2"
                style={{ background: `${other.color}06`, borderColor: `${other.color}15` }}
              >
                <span className="text-[11px] flex-shrink-0" style={{ color: other.color }}>↳</span>
                <p className="text-[12px] text-slate-500 font-medium leading-snug">{conn.note}</p>
                <span
                  className="ml-auto text-[10px] font-black px-2 py-0.5 rounded-lg text-white flex-shrink-0"
                  style={{ background: other.color }}
                >
                  {CATEGORY_META[other.category].label}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ── Concept box (left or right side of the equation) ── */
function ConceptBox({
  emoji, title, color, isCurrent,
}: {
  emoji: string;
  title: string;
  color: string;
  isCurrent: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-4 flex-1 text-center"
      style={
        isCurrent
          ? { background: color }
          : { background: `${color}10` }
      }
    >
      <span className="text-xl mb-1">{emoji}</span>
      <p
        className="text-[11px] font-black leading-tight uppercase tracking-wide"
        style={{ color: isCurrent ? "white" : color }}
      >
        {title}
      </p>
      {isCurrent && (
        <span className="text-[9px] font-bold text-white/60 mt-0.5 uppercase tracking-widest">you are here</span>
      )}
    </div>
  );
}
