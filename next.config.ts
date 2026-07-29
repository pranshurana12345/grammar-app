import type { NextConfig } from "next";

// `output: "export"` produces the static bundle that Capacitor wraps into the
// Android app. It cannot carry server routes at all — any API route handler
// that isn't fully static fails the build — so it is opt-in, set only by
// scripts/build-android.mjs (which also parks app/api for the duration).
//
// It used to be the other way round: on unless VERCEL was set. That made a
// plain local `npm run build` attempt the static export and fail on the API
// routes, which looked like the app was broken when it wasn't.
const isCapacitorBuild = process.env.CAPACITOR === "1";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  ...(isCapacitorBuild ? { output: "export" } : {}),
};

export default nextConfig;
