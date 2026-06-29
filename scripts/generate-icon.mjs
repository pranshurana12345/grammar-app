/**
 * Generates public/icon.png (512x512) using only Node.js built-ins.
 * Minimal liquid-glass icon: a #483ea8 indigo gradient with a frosted-glass
 * square (top-right) and circle (bottom-left) spaced apart, a bold glossy white
 * "G" between them, and a soft sheen. Keep public/icon.svg in sync.
 */
import { deflateSync } from "zlib";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SIZE = 512;
const AA = 0.003;

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; CRC_TABLE[n] = c; }
function crc32(buf) { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function u32(n) { const b = Buffer.alloc(4); b.writeUInt32BE(n >>> 0, 0); return b; }
function pngChunk(type, data) { const tb = Buffer.from(type, "ascii"); const crc = crc32(Buffer.concat([tb, data])); return Buffer.concat([u32(data.length), tb, data, u32(crc)]); }

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smoothstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
function rrectSDF(px, py, hw, hh, cr) {
  const qx = Math.abs(px) - (hw - cr), qy = Math.abs(py) - (hh - cr);
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - cr;
}

// indigo ramp around #483ea8
const LIGHT = [0x5f, 0x54, 0xc8], BASE = [0x48, 0x3e, 0xa8], DARK = [0x2c, 0x25, 0x6c];
function bg(fx, fy) {
  const t = clamp01(fx * 0.4 + fy * 0.6);
  if (t < 0.5) { const u = t / 0.5; return [mix(LIGHT[0], BASE[0], u), mix(LIGHT[1], BASE[1], u), mix(LIGHT[2], BASE[2], u)]; }
  const u = (t - 0.5) / 0.5; return [mix(BASE[0], DARK[0], u), mix(BASE[1], DARK[1], u), mix(BASE[2], DARK[2], u)];
}

// bold "G" coverage
function gCov(fx, fy) {
  const cx = 0.5, cy = 0.505, R = 0.20, T = 0.07, innerR = R - T;
  const dx = fx - cx, dy = fy - cy, dist = Math.hypot(dx, dy), ang = Math.atan2(dy, dx);
  let ring = smoothstep(R + AA, R - AA, dist) * smoothstep(innerR - AA, innerR + AA, dist);
  // gap on the RIGHT (centred at 0°), soft edges
  const inCut = smoothstep(-0.64, -0.50, ang) * smoothstep(0.64, 0.50, ang);
  ring *= 1 - inCut;
  const box = (x0, x1, y0, y1) =>
    smoothstep(x0 - AA, x0 + AA, fx) * smoothstep(x1 + AA, x1 - AA, fx) *
    smoothstep(y0 - AA, y0 + AA, fy) * smoothstep(y1 + AA, y1 - AA, fy);
  // horizontal arm in the lower half of the gap (centre → right edge)
  const arm = box(cx - 0.004, cx + R + 0.004, cy + 0.006, cy + 0.07);
  // short vertical upstroke (spur) at the inner end of the arm
  const spur = box(cx - 0.004, cx + 0.05, cy - 0.03, cy + 0.07);
  return Math.max(ring, Math.max(arm, spur));
}

const pixels = new Uint8Array(SIZE * SIZE * 4);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const fx = (x + 0.5) / SIZE, fy = (y + 0.5) / SIZE;
    let [r, g, b] = bg(fx, fy);

    // frosted circle (bottom-left, spaced away)
    {
      const d = Math.hypot(fx - 0.265, fy - 0.735) - 0.125;
      const inside = 1 - smoothstep(0, 0.006, d);
      if (inside > 0) { r = mix(r, mix(r, 255, 0.14), inside); g = mix(g, mix(g, 255, 0.14), inside); b = mix(b, mix(b, 255, 0.14), inside); }
      const rim = Math.exp(-Math.pow((d + 0.006) / 0.006, 2)) * 0.55;
      r = mix(r, 255, rim); g = mix(g, 255, rim); b = mix(b, 255, rim);
    }
    // frosted square (top-right, spaced away)
    {
      const d = rrectSDF(fx - 0.735, fy - 0.265, 0.125, 0.125, 0.045);
      const inside = 1 - smoothstep(0, 0.006, d);
      if (inside > 0) { r = mix(r, mix(r, 255, 0.16), inside); g = mix(g, mix(g, 255, 0.16), inside); b = mix(b, mix(b, 255, 0.16), inside); }
      const rim = Math.exp(-Math.pow((d + 0.006) / 0.006, 2)) * 0.6;
      r = mix(r, 255, rim); g = mix(g, 255, rim); b = mix(b, 255, rim);
    }
    // bold glossy white "G"
    {
      const cov = gCov(fx, fy);
      if (cov > 0) {
        const top = smoothstep(0.70, 0.30, fy);
        const gr = mix(228, 255, top), gg = mix(244, 255, top);
        r = mix(r, gr, cov); g = mix(g, gg, cov); b = mix(b, 255, cov);
      }
    }

    // diagonal gloss sheen + bevel
    const streak = Math.exp(-Math.pow((fx + fy - 0.55) / 0.14, 2)) * 0.16;
    r = mix(r, 255, streak); g = mix(g, 255, streak); b = mix(b, 255, streak);
    r = mix(r, 255, smoothstep(0.04, 0, fy) * 0.22); g = mix(g, 255, smoothstep(0.04, 0, fy) * 0.22); b = mix(b, 255, smoothstep(0.04, 0, fy) * 0.22);
    const bd = smoothstep(0.96, 1, fy) * 0.22; r *= 1 - bd; g *= 1 - bd; b *= 1 - bd;

    const idx = (y * SIZE + x) * 4;
    pixels[idx] = Math.round(clamp01(r / 255) * 255); pixels[idx + 1] = Math.round(clamp01(g / 255) * 255); pixels[idx + 2] = Math.round(clamp01(b / 255) * 255); pixels[idx + 3] = 255;
  }
}

const rawRows = [];
for (let y = 0; y < SIZE; y++) {
  const row = Buffer.alloc(1 + SIZE * 4); row[0] = 0;
  for (let x = 0; x < SIZE; x++) { const s = (y * SIZE + x) * 4; row[1 + x * 4] = pixels[s]; row[2 + x * 4] = pixels[s + 1]; row[3 + x * 4] = pixels[s + 2]; row[4 + x * 4] = pixels[s + 3]; }
  rawRows.push(row);
}
const compressed = deflateSync(Buffer.concat(rawRows), { level: 6 });
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0); ihdr.writeUInt32BE(SIZE, 4); ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), pngChunk("IHDR", ihdr), pngChunk("IDAT", compressed), pngChunk("IEND", Buffer.alloc(0))]);
writeFileSync(join(__dirname, "..", "public", "icon.png"), png);
console.log(`✓ Generated public/icon.png (${(png.length / 1024).toFixed(1)} KB)`);
