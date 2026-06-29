/**
 * Generates public/icon.png (512x512) using only Node.js built-ins.
 * A clean Freeform-blue rounded canvas with a white "A" (alphabet / language /
 * grammar) and a small playful accent dot. Keep public/icon.svg in sync.
 */
import { deflateSync } from "zlib";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SIZE = 512;
const AA = 0.0026;

// ── PNG plumbing ──────────────────────────────────────────────────────────────
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; CRC_TABLE[n] = c; }
function crc32(buf) { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function u32(n) { const b = Buffer.alloc(4); b.writeUInt32BE(n >>> 0, 0); return b; }
function pngChunk(type, data) { const tb = Buffer.from(type, "ascii"); const crc = crc32(Buffer.concat([tb, data])); return Buffer.concat([u32(data.length), tb, data, u32(crc)]); }

// ── shape helpers (fractions 0..1) ─────────────────────────────────────────────
function smoothstep(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
function circleCov(fx, fy, cx, cy, r) { return 1 - smoothstep(r - AA, r + AA, Math.hypot(fx - cx, fy - cy)); }
function capsuleCov(fx, fy, ax, ay, bx, by, r) {
  const pax = fx - ax, pay = fy - ay, bax = bx - ax, bay = by - ay;
  const h = Math.min(1, Math.max(0, (pax * bax + pay * bay) / (bax * bax + bay * bay)));
  return 1 - smoothstep(r - AA, r + AA, Math.hypot(pax - bax * h, pay - bay * h));
}

// "A" geometry
const APEX = [0.5, 0.28], LFOOT = [0.30, 0.74], RFOOT = [0.70, 0.74];
const LEG_R = 0.058, BAR_R = 0.042;
const BAR_A = [0.40, 0.585], BAR_B = [0.60, 0.585];
const DOT = [0.70, 0.31, 0.045];
const AMBER = [0xf5, 0x9e, 0x0b];

function letterCov(fx, fy) {
  return Math.max(
    capsuleCov(fx, fy, APEX[0], APEX[1], LFOOT[0], LFOOT[1], LEG_R),
    capsuleCov(fx, fy, APEX[0], APEX[1], RFOOT[0], RFOOT[1], LEG_R),
    capsuleCov(fx, fy, BAR_A[0], BAR_A[1], BAR_B[0], BAR_B[1], BAR_R)
  );
}

// ── render ─────────────────────────────────────────────────────────────────────
const pixels = new Uint8Array(SIZE * SIZE * 4);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const fx = (x + 0.5) / SIZE, fy = (y + 0.5) / SIZE;

    // Freeform-blue background gradient (#2d7ff9 → #1257d6) + soft top gloss
    const t = fx * 0.35 + fy * 0.65;
    let r = 0x2d + (0x12 - 0x2d) * t;
    let g = 0x7f + (0x57 - 0x7f) * t;
    let b = 0xf9 + (0xd6 - 0xf9) * t;
    const gloss = Math.max(0, 1 - (fx + fy) / 0.85) * 0.16;
    r += (255 - r) * gloss; g += (255 - g) * gloss; b += (255 - b) * gloss;

    // amber accent dot
    const dc = circleCov(fx, fy, DOT[0], DOT[1], DOT[2]);
    if (dc > 0) { r = r * (1 - dc) + AMBER[0] * dc; g = g * (1 - dc) + AMBER[1] * dc; b = b * (1 - dc) + AMBER[2] * dc; }

    // white "A"
    const lc = letterCov(fx, fy);
    if (lc > 0) { r = r * (1 - lc) + 255 * lc; g = g * (1 - lc) + 255 * lc; b = b * (1 - lc) + 255 * lc; }

    const idx = (y * SIZE + x) * 4;
    pixels[idx] = Math.round(r); pixels[idx + 1] = Math.round(g); pixels[idx + 2] = Math.round(b); pixels[idx + 3] = 255;
  }
}

// ── encode ───────────────────────────────────────────────────────────────────
const rawRows = [];
for (let y = 0; y < SIZE; y++) {
  const row = Buffer.alloc(1 + SIZE * 4); row[0] = 0;
  for (let x = 0; x < SIZE; x++) {
    const src = (y * SIZE + x) * 4;
    row[1 + x * 4] = pixels[src]; row[2 + x * 4] = pixels[src + 1]; row[3 + x * 4] = pixels[src + 2]; row[4 + x * 4] = pixels[src + 3];
  }
  rawRows.push(row);
}
const compressed = deflateSync(Buffer.concat(rawRows), { level: 6 });
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0); ihdr.writeUInt32BE(SIZE, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), pngChunk("IHDR", ihdr), pngChunk("IDAT", compressed), pngChunk("IEND", Buffer.alloc(0))]);

const outPath = join(__dirname, "..", "public", "icon.png");
writeFileSync(outPath, png);
console.log(`✓ Generated ${outPath} (${(png.length / 1024).toFixed(1)} KB)`);
