"use client";

import { useEffect } from "react";
import { ensureQueue } from "@/lib/practiceQueue";

// Invisible. Mounted in the root layout: shortly after the app opens, quietly
// fills the practice-question queue so the Practice reel starts instantly.
export default function PracticePrefetch() {
  useEffect(() => {
    if (window.innerWidth >= 1024) return; // practice reels are mobile-only
    const t = setTimeout(() => { void ensureQueue(5); }, 2000);
    return () => clearTimeout(t);
  }, []);
  return null;
}
