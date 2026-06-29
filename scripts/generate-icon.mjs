/**
 * Generates public/icon.png (512x512) using only Node.js built-ins.
 * Freeform-inspired: a clean light canvas with playful, colourful shapes
 * (circle, rounded square, capsule, squiggle) blended with "multiply" so the
 * overlaps mix like Apple's Freeform icon. Keep public/icon.svg in sync.
 */
import { deflateSync } from "zlib";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SIZE = 512;
const AA = 0.0026; // anti-alias width in fractional units

// ── PNG plumbing ──────────────────────────────────────────────────────────────
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function u32(n) { const b = Buffer.alloc(4); b.writeUInt32BE(n >>> 0, 0); return b; }
function pngChunk(type, data) {
  const tb = Buffer.from(type, "ascii");
  const crc = crc32(Buffer.concat([tb, data]));
  return Buffer.concat([u32(data.length), tb, data, u32(crc)]);
}

// ── shape coverage helpers (coords are fractions 0..1) ─────────────────────────
function smoothstep(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
function circleCov(fx, fy, cx, cy, r) { return 1 - smoothstep(r - AA, r + AA, Math.hypot(fx - cx, fy - cy)); }
function rrectCov(fx, fy, cx, cy, hw, hh, cr, theta) {
  const px = fx - cx, py = fy - cy;
  const c = Math.cos(theta), s = Math.sin(theta);
  const lx = px * c + py * s, ly = -px * s + py * c;
  const qx = Math.abs(lx) - (hw - cr), qy = Math.abs(ly) - (hh - cr);
  const out = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  const ins = Math.min(Math.max(qx, qy), 0);
  return 1 - smoothstep(-AA, AA, out + ins - cr);
}
function capsuleCov(fx, fy, ax, ay, bx, by, r) {
  const pax = fx - ax, pay = fy - ay, bax = bx - ax, bay = by - ay;
  const h = Math.min(1, Math.max(0, (pax * bax + pay * bay) / (bax * bax + bay * bay)));
  return 1 - smoothstep(r - AA, r + AA, Math.hypot(pax - bax * h, pay - bay * h));
}
// squiggle: distance to a sampled sine curve
const SQ = { x0: 0.17, x1: 0.83, baseY: 0.53, amp: 0.055, cycles: 1.5, half: 0.021 };
const SQ_PTS = [];
for (let i = 0; i <= 140; i++) {
  const t = i / 140;
  const x = SQ.x0 + (SQ.x1 - SQ.x0) * t;
  const y = SQ.baseY + SQ.amp * Math.sin(t * SQ.cycles * Math.PI * 2);
  SQ_PTS.push([x, y]);
}
function squiggleCov(fx, fy) {
  if (Math.abs(fy - SQ.baseY) > SQ.amp + SQ.half + AA) return 0;
  let best = 1e9;
  for (let i = 0; i < SQ_PTS.length; i++) {
    const dx = fx - SQ_PTS[i][0], dy = fy - SQ_PTS[i][1];
    const d = dx * dx + dy * dy;
    if (d < best) best = d;
  }
  return 1 - smoothstep(SQ.half - AA, SQ.half + AA, Math.sqrt(best));
}

// shapes, drawn in order with multiply blending
const SHAPES = [
  { kind: "circle", col: [0x25, 0x63, 0xeb], a: [0.34, 0.36, 0.190] },            // blue
  { kind: "rrect", col: [0xf5, 0x9e, 0x0b], a: [0.635, 0.40, 0.150, 0.150, 0.045, 0.23] }, // amber
  { kind: "circle", col: [0x7c, 0x3a, 0xed], a: [0.40, 0.655, 0.150] },           // violet
  { kind: "capsule", col: [0x10, 0xb9, 0x81], a: [0.56, 0.58, 0.745, 0.705, 0.072] }, // green
  { kind: "squiggle", col: [0xf4, 0x3f, 0x5e], a: [] },                           // rose
];

function coverage(sh, fx, fy) {
  const a = sh.a;
  switch (sh.kind) {
    case "circle": return circleCov(fx, fy, a[0], a[1], a[2]);
    case "rrect": return rrectCov(fx, fy, a[0], a[1], a[2], a[3], a[4], a[5]);
    case "capsule": return capsuleCov(fx, fy, a[0], a[1], a[2], a[3], a[4]);
    case "squiggle": return squiggleCov(fx, fy);
    default: return 0;
  }
}

// ── render ─────────────────────────────────────────────────────────────────────
const pixels = new Uint8Array(SIZE * SIZE * 4);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const fx = (x + 0.5) / SIZE, fy = (y + 0.5) / SIZE;

    // soft light background (top white → bottom faint cool grey)
    let r = 255 - 17 * fy;
    let g = 255 - 14 * fy;
    let b = 255 - 7 * fy;

    for (const sh of SHAPES) {
      const cov = coverage(sh, fx, fy);
      if (cov <= 0) continue;
      const mr = (r * sh.col[0]) / 255, mg = (g * sh.col[1]) / 255, mb = (b * sh.col[2]) / 255;
      r = r * (1 - cov) + mr * cov;
      g = g * (1 - cov) + mg * cov;
      b = b * (1 - cov) + mb * cov;
    }

    const idx = (y * SIZE + x) * 4;
    pixels[idx] = Math.round(r);
    pixels[idx + 1] = Math.round(g);
    pixels[idx + 2] = Math.round(b);
    pixels[idx + 3] = 255;
  }
}

// ── encode ───────────────────────────────────────────────────────────────────
const rawRows = [];
for (let y = 0; y < SIZE; y++) {
  const row = Buffer.alloc(1 + SIZE * 4);
  row[0] = 0;
  for (let x = 0; x < SIZE; x++) {
    const src = (y * SIZE + x) * 4;
    row[1 + x * 4] = pixels[src];
    row[2 + x * 4] = pixels[src + 1];
    row[3 + x * 4] = pixels[src + 2];
    row[4 + x * 4] = pixels[src + 3];
  }
  rawRows.push(row);
}
const compressed = deflateSync(Buffer.concat(rawRows), { level: 6 });

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  pngChunk("IHDR", ihdr),
  pngChunk("IDAT", compressed),
  pngChunk("IEND", Buffer.alloc(0)),
]);

const outPath = join(__dirname, "..", "public", "icon.png");
writeFileSync(outPath, png);
console.log(`✓ Generated ${outPath} (${(png.length / 1024).toFixed(1)} KB)`);
