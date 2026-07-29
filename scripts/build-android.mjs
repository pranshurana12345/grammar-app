// Capacitor build.
//
// `output: "export"` cannot host a route handler that isn't static. Next fails
// outright collecting /api/ai/health and /api/reference — "export const dynamic
// = force-static / revalidate not configured" — and marking them force-dynamic
// doesn't help, because that combination is rejected too. So
// `npm run build:android` had been failing since /api/ai/health was added.
//
// The Android app never uses the bundled routes anyway: apiBase() in
// lib/practice.ts points a Capacitor build at https://grammar-app-pink.vercel.app
// precisely because the static export has no server. So the API folder is
// lifted out for the duration of the export and put straight back afterwards.
//
// Run with --skip-sync to produce out/ without touching the android project.

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const API = path.join(ROOT, "app", "api");
const PARKED = path.join(ROOT, ".api-parked");
const skipSync = process.argv.includes("--skip-sync");

// CAPACITOR=1 is what switches next.config.ts into `output: "export"`.
const run = (cmd) =>
  execSync(cmd, { stdio: "inherit", cwd: ROOT, env: { ...process.env, CAPACITOR: "1" } });

// A previous run may have been killed between the move and the restore.
if (fs.existsSync(PARKED)) {
  if (fs.existsSync(API)) {
    throw new Error(
      `Both app/api and .api-parked exist. A previous build was interrupted — merge them by hand before continuing.`,
    );
  }
  console.log("Restoring app/api left behind by an interrupted build…");
  fs.renameSync(PARKED, API);
}

let parked = false;
try {
  // Stale .next/types keeps type-checking routes that are about to disappear.
  fs.rmSync(path.join(ROOT, ".next"), { recursive: true, force: true });

  if (fs.existsSync(API)) {
    fs.renameSync(API, PARKED);
    parked = true;
    console.log("app/api parked — the static export cannot carry server routes.");
  }

  // Via npm so `prebuild` still runs: that is what validates the answer keys.
  run("npm run build");
} finally {
  if (parked) {
    fs.renameSync(PARKED, API);
    console.log("app/api restored.");
  }
}

if (skipSync) {
  console.log("\nStatic export written to out/ — skipping cap sync (--skip-sync).");
} else if (!fs.existsSync(path.join(ROOT, "android"))) {
  console.log("\nNo android/ directory here — run `npx cap add android` first. out/ is ready.");
} else {
  run("npx cap sync android");
}
