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
          fill={active ? "#2563eb" : "none"}
          stroke={active ? "#2563eb" : "#94a3b8"}
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
          fill={active ? "#2563eb" : "none"}
          stroke={active ? "#2563eb" : "#94a3b8"}
          strokeWidth="1.8" />
        <path d="M7 8H15M7 12H13M7 16H11"
          stroke={active ? "white" : "#94a3b8"}
          strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/starred",
    label: "Priority",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
        <path d="M11 2L13.5 8H20L14.5 11.8L16.7 18L11 14.3L5.3 18L7.5 11.8L2 8H8.5L11 2Z"
          fill={active ? "#f59e0b" : "none"}
          stroke={active ? "#f59e0b" : "#94a3b8"}
          strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
    color: "#f59e0b",
  },
  {
    href: "/revise",
    label: "Revise",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
        <path d="M4 11C4 7.1 7.1 4 11 4C14.9 4 18 7.1 18 11C18 14.9 14.9 18 11 18C9.1 18 7.4 17.2 6.2 16"
          stroke={active ? "#2563eb" : "#94a3b8"}
          strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 16V11M4 16H9"
          stroke={active ? "#2563eb" : "#94a3b8"}
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
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
    label: "Ref",
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

const DEFAULT_COLOR = "#2563eb";

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
