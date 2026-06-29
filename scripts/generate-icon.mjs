/**
 * Generates public/icon.png (512x512) using only Node.js built-ins.
 * Original "liquid glass" icon inspired by the iOS glass style: a teal→blue→
 * purple gradient with layered frosted-glass shapes (a rounded panel + a circle),
 * glossy rim-light, a diagonal sheen, and a soft glass "A". Keep icon.svg in sync.
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

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smoothstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
function rrectSDF(px, py, hw, hh, cr) {
  const qx = Math.abs(px) - (hw - cr), qy = Math.abs(py) - (hh - cr);
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - cr;
}
function capDist(fx, fy, ax, ay, bx, by) {
  const pax = fx - ax, pay = fy - ay, bax = bx - ax, bay = by - ay;
  const h = clamp01((pax * bax + pay * bay) / (bax * bax + bay * bay));
  return Math.hypot(pax - bax * h, pay - bay * h);
}

// gradient stops (teal → blue → purple)
const TEAL = [0x10, 0x9f, 0xb4], BLUE = [0x1f, 0x4c, 0xb6], PURP = [0x33, 0x1a, 0x66];
function bgColor(fx, fy) {
  const t = clamp01(fx * 0.32 + fy * 0.68);
  let c;
  if (t < 0.5) { const u = t / 0.5; c = [mix(TEAL[0], BLUE[0], u), mix(TEAL[1], BLUE[1], u), mix(TEAL[2], BLUE[2], u)]; }
  else { const u = (t - 0.5) / 0.5; c = [mix(BLUE[0], PURP[0], u), mix(BLUE[1], PURP[1], u), mix(BLUE[2], PURP[2], u)]; }
  return c;
}

// "A" geometry
const APEX = [0.5, 0.345], LF = [0.40, 0.64], RF = [0.60, 0.64], BAR = [[0.445, 0.55], [0.555, 0.55]];
const A_R = 0.026, BAR_R = 0.02;
function letterDist(fx, fy) {
  return Math.min(capDist(fx, fy, APEX[0], APEX[1], LF[0], LF[1]),
                  capDist(fx, fy, APEX[0], APEX[1], RF[0], RF[1]),
                  capDist(fx, fy, BAR[0][0], BAR[0][1], BAR[1][0], BAR[1][1]) + (0.026 - BAR_R));
}

const pixels = new Uint8Array(SIZE * SIZE * 4);
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const fx = (x + 0.5) / SIZE, fy = (y + 0.5) / SIZE;
    let c = bgColor(fx, fy);
    let r = c[0], g = c[1], b = c[2];

    // ── frosted glass CIRCLE (behind, lower-left) ──
    {
      const d = Math.hypot(fx - 0.40, fy - 0.585) - 0.255;
      const inside = 1 - smoothstep(0, 0.006, d);
      if (inside > 0) { r = mix(r, mix(r, 255, 0.16), inside); g = mix(g, mix(g, 255, 0.16), inside); b = mix(b, mix(b, 255, 0.16), inside); }
      const rim = Math.exp(-Math.pow((d + 0.006) / 0.006, 2)) * 0.5;
      r = mix(r, 255, rim); g = mix(g, 255, rim); b = mix(b, 255, rim);
    }

    // ── frosted glass PANEL (rounded square, upper-right of centre) ──
    {
      const d = rrectSDF(fx - 0.555, fy - 0.45, 0.235, 0.235, 0.085);
      const inside = 1 - smoothstep(0, 0.006, d);
      if (inside > 0) {
        const lift = 0.20 + smoothstep(0.7, 0.2, fy) * 0.06; // brighter toward top
        r = mix(r, mix(r, 255, lift), inside); g = mix(g, mix(g, 255, lift), inside); b = mix(b, mix(b, 255, lift), inside);
      }
      // bright inner rim (glass edge)
      const rim = Math.exp(-Math.pow((d + 0.007) / 0.007, 2));
      const topBias = 0.45 + 0.55 * smoothstep(0.62, 0.30, fy); // stronger on top edge
      const rl = rim * topBias * 0.85;
      r = mix(r, 255, rl); g = mix(g, 255, rl); b = mix(b, 255, rl);
      // soft outer shadow (float)
      const sh = smoothstep(0.0, 0.05, d) * (1 - smoothstep(0.05, 0.12, d)) * 0.18;
      r *= 1 - sh; g *= 1 - sh; b *= 1 - sh;
    }

    // ── glass "A" hero ──
    {
      const d = letterDist(fx, fy);
      const inside = 1 - smoothstep(A_R, A_R + 0.006, d);
      if (inside > 0) {
        // translucent white-cyan glass with vertical gradient
        const top = smoothstep(0.66, 0.32, fy);
        const gr = mix(225, 255, top), gg = mix(245, 255, top), gb = 255;
        r = mix(r, gr, inside * 0.92); g = mix(g, gg, inside * 0.92); b = mix(b, gb, inside * 0.92);
      }
      // rim light on the A
      const rim = Math.exp(-Math.pow((d - (A_R - 0.006)) / 0.006, 2)) * smoothstep(0.66, 0.30, fy) * 0.6;
      r = mix(r, 255, rim); g = mix(g, 255, rim); b = mix(b, 255, rim);
    }

    // ── global diagonal gloss sheen ──
    const streak = Math.exp(-Math.pow((fx + fy - 0.5) / 0.13, 2)) * 0.22;
    r = mix(r, 255, streak); g = mix(g, 255, streak); b = mix(b, 255, streak);

    // top bevel + bottom depth
    r = mix(r, 255, smoothstep(0.04, 0, fy) * 0.25); g = mix(g, 255, smoothstep(0.04, 0, fy) * 0.25); b = mix(b, 255, smoothstep(0.04, 0, fy) * 0.25);
    const bd = smoothstep(0.96, 1, fy) * 0.25; r *= 1 - bd; g *= 1 - bd; b *= 1 - bd;

    const idx = (y * SIZE + x) * 4;
    pixels[idx] = Math.round(clamp01(r / 255) * 255);
    pixels[idx + 1] = Math.round(clamp01(g / 255) * 255);
    pixels[idx + 2] = Math.round(clamp01(b / 255) * 255);
    pixels[idx + 3] = 255;
  }
}

// ── encode ───────────────────────────────────────────────────────────────────
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
