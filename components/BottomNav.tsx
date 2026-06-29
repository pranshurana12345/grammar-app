"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
        <path d="M3 9.5L11 3L19 9.5V19C19 19.6 18.6 20 18 20H14V15H8V20H4C3.4 20 3 19.6 3 19V9.5Z"
          fill={active ? "#2d7ff9" : "none"}
          stroke={active ? "#2d7ff9" : "#94a3b8"}
          strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/feed",
    label: "Learn",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="16" height="16" rx="4"
          fill={active ? "#2d7ff9" : "none"}
          stroke={active ? "#2d7ff9" : "#94a3b8"}
          strokeWidth="1.8" />
        <path d="M7 8H15M7 12H13M7 16H11"
          stroke={active ? "white" : "#94a3b8"}
          strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/reels",
    label: "Reels",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="16" height="16" rx="5"
          fill={active ? "#e11d48" : "none"}
          stroke={active ? "#e11d48" : "#94a3b8"}
          strokeWidth="1.8" />
        <path d="M9 7.5L14.5 11L9 14.5V7.5Z"
          fill={active ? "white" : "#94a3b8"}
          stroke={active ? "white" : "#94a3b8"}
          strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
    color: "#e11d48",
  },
  {
    href: "/concepts",
    label: "Concepts",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke={active ? "#7c3aed" : "#94a3b8"} strokeWidth="1.8" />
        <circle cx="11" cy="11" r="3" fill={active ? "#7c3aed" : "#94a3b8"} />
        <path d="M11 3V6M11 16V19M3 11H6M16 11H19" stroke={active ? "#7c3aed" : "#94a3b8"} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    color: "#7c3aed",
  },
  {
    href: "/reference",
    label: "Study",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="16" height="16" rx="3"
          fill={active ? "#0d9488" : "none"}
          stroke={active ? "#0d9488" : "#94a3b8"}
          strokeWidth="1.8" />
        <path d="M7 8h8M7 12h8M7 16h5"
          stroke={active ? "white" : "#94a3b8"}
          strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    color: "#0d9488",
  },
];

const DEFAULT_COLOR = "#2d7ff9";

function itemColor(item: (typeof items)[number]) {
  if ("color" in item && item.color) return item.color;
  return DEFAULT_COLOR;
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(15,23,42,0.07)",
        boxShadow: "0 -4px 24px -4px rgba(15,23,42,0.10)",
        paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
      }}
    >
      <div className="flex max-w-lg mx-auto px-1 pt-1">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const color = itemColor(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center pt-2 pb-2 gap-1 relative press"
            >
              {active && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full"
                  style={{ background: color }}
                />
              )}
              <div className="flex items-center justify-center w-7 h-7">
                {item.icon(active)}
              </div>
              <span
                className="text-[10px] font-bold tracking-tight leading-none"
                style={{ color: active ? color : "#94a3b8" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
