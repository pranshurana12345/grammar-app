"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { rules, SECTIONS } from "@/data/rules";
import { getProgress, RuleStatus } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".8" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".3" />
      </svg>
    ),
  },
  {
    href: "/feed",
    label: "Learn",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 6h8M4 9h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/starred",
    label: "High Priority",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5L9.8 5.8H14.5L10.8 8.5L12.4 13L8 10.3L3.6 13L5.2 8.5L1.5 5.8H6.2L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/revise",
    label: "Revision",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 11.3 14 8 14C6.3 14 4.8 13.3 3.7 12.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 12.5V8.5M2 12.5H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/concepts",
    label: "Concepts",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="8" r="2" fill="currentColor" />
        <path d="M8 2V4M8 12V14M2 8H4M12 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/reference",
    label: "Reference",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function DesktopSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [progress, setProgress] = useState<Record<number, RuleStatus>>({});
  const [sectionsOpen, setSectionsOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved === "1") {
      setCollapsed(true);
      document.documentElement.setAttribute("data-sidebar", "collapsed");
    }
  }, []);

  function toggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar_collapsed", next ? "1" : "0");
    document.documentElement.setAttribute("data-sidebar", next ? "collapsed" : "expanded");
  }

  const learned = Object.values(progress).filter((v) => v === "confident").length;
  const pct = Math.round((learned / rules.length) * 100);

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 transition-all duration-250"
      style={{
        width: collapsed ? "64px" : "252px",
        background: "#0f172a",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Logo + collapse button */}
      <div className="px-3 pt-5 pb-4 flex-shrink-0 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}>
              <span className="text-white text-sm font-black">G</span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-sm leading-none truncate">Grammy</p>
              <p className="text-slate-500 text-[10px] mt-0.5 font-semibold truncate">AFCAT English Prep</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto"
            style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}>
            <span className="text-white text-sm font-black">G</span>
          </div>
        )}
        {!collapsed && (
          <button onClick={toggleCollapse} title="Collapse sidebar"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/8 transition-all flex-shrink-0 ml-1">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L5 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Collapsed: expand button */}
      {collapsed && (
        <button onClick={toggleCollapse} title="Expand sidebar"
          className="mx-auto mb-2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/8 transition-all">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2L9 7L5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Progress mini-bar — hidden when collapsed */}
      {!collapsed && (
        <div className="mx-4 mb-4 rounded-2xl p-3 flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-400">Overall Progress</span>
            <span className="text-[11px] font-black text-blue-400">{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
            <div className="h-full rounded-full bg-blue-500 transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-emerald-400 font-semibold">{learned} confident</span>
            <span className="text-[10px] text-slate-500">{rules.length} total</span>
          </div>
        </div>
      )}

      {/* Progress ring — shown when collapsed */}
      {collapsed && (
        <div className="mx-auto mb-3 relative w-10 h-10 flex-shrink-0">
          <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
            <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle cx="20" cy="20" r="16" fill="none" stroke="#3b82f6" strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 16}`}
              strokeDashoffset={`${2 * Math.PI * 16 * (1 - pct / 100)}`}
              strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] font-black text-blue-400">{pct}%</span>
          </div>
        </div>
      )}

      {/* Main nav */}
      {!collapsed && (
        <div className="px-3 mb-2 flex-shrink-0">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-1">Main</p>
        </div>
      )}
      <div className={`${collapsed ? "px-2" : "px-3"} mb-2 flex-shrink-0`}>
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}>
              <div className={`flex items-center gap-2.5 rounded-xl mb-0.5 transition-all ${
                collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
              } ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}>
                <span className={active ? "text-white" : "text-slate-500"}>{item.icon}</span>
                {!collapsed && <span className="text-[13px] font-semibold">{item.label}</span>}
                {!collapsed && item.href === "/starred" && (
                  <span className="ml-auto text-[10px] font-black bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-md">
                    {rules.filter(r => r.star).length}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mx-4 my-2 h-px flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }} />

      {/* Sections list — hidden when collapsed */}
      {!collapsed && (
        <div className="px-3 flex-1 overflow-y-auto pb-4" style={{ scrollbarWidth: "none" }}>
          <div className="flex items-center justify-between px-2 mb-1">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Sections</p>
            <button onClick={() => setSectionsOpen(v => !v)} className="text-slate-600 hover:text-slate-400 text-xs">
              {sectionsOpen ? "▲" : "▼"}
            </button>
          </div>

          {sectionsOpen && SECTIONS.map((sec) => {
            const sectionRules = rules.filter((r) => r.section === sec.name);
            const done = sectionRules.filter((r) => progress[r.id] === "confident").length;
            const secPct = sectionRules.length > 0 ? (done / sectionRules.length) * 100 : 0;
            const active = pathname === `/sections/${encodeURIComponent(sec.name)}`;

            return (
              <Link key={sec.name} href={`/sections/${encodeURIComponent(sec.name)}`}>
                <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl mb-0.5 transition-all ${
                  active ? "bg-white/8" : "hover:bg-white/5"
                }`}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sec.color }} />
                  <span className="text-[12px] text-slate-400 flex-1 truncate">{sec.name}</span>
                  <span className="text-[10px] font-bold flex-shrink-0" style={{ color: secPct === 100 ? "#4ade80" : sec.color }}>
                    {secPct === 100 ? "✓" : `${done}/${sectionRules.length}`}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* User / sign-out footer */}
      {!collapsed && user && (
        <div className="px-4 py-3 flex-shrink-0 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-black text-white"
              style={{ background: user.color ?? "#2563eb" }}>
              {user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-slate-200 font-semibold truncate">{user.name}</p>
              <p className="text-[10px] text-slate-600">Tap to switch</p>
            </div>
            <button
              onClick={async () => { await signOut(); router.replace("/login"); }}
              title="Switch student"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-400 hover:bg-white/5 transition-all flex-shrink-0"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 2H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.5M8 8.5L11 6M11 6L8 3.5M11 6H4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
      {!collapsed && !user && (
        <div className="px-4 py-3 flex-shrink-0 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-[10px] text-slate-600 text-center">Built for AFCAT 2025 prep</p>
        </div>
      )}
    </aside>
  );
}
