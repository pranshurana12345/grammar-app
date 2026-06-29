import type { NextConfig } from "next";

// `output: "export"` produces the static bundle that Capacitor wraps into the
// Android app. It is INCOMPATIBLE with middleware.ts (Supabase auth), so we only
// enable it for local/Android builds — never on Vercel, where we want the normal
// server build. Vercel always sets the VERCEL env var during its builds.
const isVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isVercel ? {} : { output: "export" }),
};

export default nextConfig;
