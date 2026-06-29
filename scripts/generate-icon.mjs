/**
 * Generates public/icon.png (512x512) using only Node.js built-ins.
 * "Liquid glass" look: iridescent colour blobs glowing through a glass tile,
 * with a glossy diagonal sheen and bevelled edges. Keep public/icon.svg in sync.
 */
import { deflateSync } from "zlib";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SIZE = 512;

// ── PNG plumbing ──────────────────────────────────────────────────────────────
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; CRC_TABLE[n] = c; }
function crc32(buf) { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function u32(n) { const b = Buffer.alloc(4); b.writeUInt32BE(n >>> 0, 0); return b; }
function pngChunk(type, data) { const tb = Buffer.from(type, "ascii"); const crc = crc32(Buffer.concat([tb, data])); return Buffer.concat([u32(data.length), tb, data, u32(crc)]); }

function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function smoothstep(a, b, x) { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); }

// colour blobs (centre x,y, [r,g,b] 0..1, radius, intensity)
const BLOBS = [
  { x: 0.28, y: 0.30, c: [0x3b / 255, 0x82 / 255, 0xf6 / 255], r: 0.62, i: 1.0 },  // blue
  { x: 0.76, y: 0.24, c: [0x8b / 255, 0x5c / 255, 0xf6 / 255], r: 0.55, i: 0.95 }, // violet
  { x: 0.66, y: 0.80, c: [0x22 / 255, 0xd3 / 255, 0xee / 255], r: 0.55, i: 0.9 },  // cyan
  { x: 0.26, y: 0.82, c: [0xf4 / 255, 0x72 / 255, 0xb6 / 255], r: 0.45, i: 0.6 },  // pink
];
const BASE = [0x10 / 255, 0x1c / 255, 0x4e / 255]; // deep navy

const pixels = new Uint8Array(SIZE * SIZE * 4);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const fx = (x + 0.5) / SIZE, fy = (y + 0.5) / SIZE;

    // start from deep base, screen-blend the glowing colour blobs
    let r = BASE[0], g = BASE[1], b = BASE[2];
    for (const bl of BLOBS) {
      const d = Math.hypot(fx - bl.x, fy - bl.y);
      const w = Math.pow(Math.max(0, 1 - d / bl.r), 2) * bl.i;
      if (w <= 0) continue;
      r = 1 - (1 - r) * (1 - bl.c[0] * w);
      g = 1 - (1 - g) * (1 - bl.c[1] * w);
      b = 1 - (1 - b) * (1 - bl.c[2] * w);
    }

    // soft corner glow (upper-left)
    const sheen = Math.pow(clamp01(1 - (fx * 0.7 + fy) / 0.95), 1.8) * 0.32;
    r += (1 - r) * sheen; g += (1 - g) * sheen; b += (1 - b) * sheen;

    // bright glossy reflection STREAK running diagonally (the glass surface)
    const diag = fx + fy;
    const streak = Math.exp(-Math.pow((diag - 0.62) / 0.10, 2)) * 0.5
                 + Math.exp(-Math.pow((diag - 0.42) / 0.05, 2)) * 0.25;
    r += (1 - r) * streak; g += (1 - g) * streak; b += (1 - b) * streak;

    // soft round specular hotspot, upper-left
    const hs = Math.pow(Math.max(0, 1 - Math.hypot(fx - 0.33, fy - 0.26) / 0.40), 2.4) * 0.4;
    r += (1 - r) * hs; g += (1 - g) * hs; b += (1 - b) * hs;

    // bevel: bright top edge, darker bottom edge (glass thickness)
    const topLit = smoothstep(0.05, 0.0, fy) * 0.35;
    r += (1 - r) * topLit; g += (1 - g) * topLit; b += (1 - b) * topLit;
    const botDark = smoothstep(0.95, 1.0, fy) * 0.28;
    r *= 1 - botDark; g *= 1 - botDark; b *= 1 - botDark;

    // gentle vignette for depth
    const vig = 1 - Math.pow(Math.max(0, Math.hypot(fx - 0.5, fy - 0.5) - 0.35) / 0.4, 2) * 0.22;
    r *= vig; g *= vig; b *= vig;

    const idx = (y * SIZE + x) * 4;
    pixels[idx] = Math.round(clamp01(r) * 255);
    pixels[idx + 1] = Math.round(clamp01(g) * 255);
    pixels[idx + 2] = Math.round(clamp01(b) * 255);
    pixels[idx + 3] = 255;
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
