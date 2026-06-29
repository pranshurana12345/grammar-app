"use client";

import { useEffect } from "react";

export default function PWAInit() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // In development the service worker serves stale cached build files, which
    // causes an endless reload loop. Actively remove any worker + caches in dev.
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      });
      if ("caches" in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  return null;
}
