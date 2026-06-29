"use client";

import { useState } from "react";

// Force-update for installed PWAs: there's no browser address bar to hard-refresh,
// so this unregisters the service worker, clears its caches, then reloads from the
// network — pulling the latest deployed version. User data (localStorage) is kept.
export default function RefreshButton() {
  const [busy, setBusy] = useState(false);

  async function update() {
    if (busy) return;
    setBusy(true);
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch {
      /* ignore — still reload below */
    }
    window.location.reload();
  }

  return (
    <button
      onClick={update}
      disabled={busy}
      title="Get the latest version"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white press"
      style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.22)" }}
    >
      <svg className={busy ? "animate-spin" : ""} width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path d="M12.2 7a5.2 5.2 0 1 1-1.6-3.7" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M12.5 1.5V4.5H9.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {busy ? "Updating…" : "Update"}
    </button>
  );
}
