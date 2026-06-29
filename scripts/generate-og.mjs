/**
 * Generates public/og-image.png (1200x630) — social preview card.
 * Pure Node.js, no dependencies.
 */
import { deflateSync } from "zlib";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const W = 1200, H = 630;

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
function chunk(type, data) {
  const tb = Buffer.from(type, "ascii");
  return Buffer.concat([u32(data.length), tb, data, u32(crc32(Buffer.concat([tb, data])))]);
}

const pixels = new Uint8Array(W * H * 4);

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4;
    const fx = x / W, fy = y / H;

    // Background: deep navy → slate-black gradient
    const t = fx * 0.3 + fy * 0.7;
    let r = Math.round(15 + (4 - 15) * t);
    let g = Math.round(23 + (6 - 23) * t);
    let b = Math.round(42 + (15 - 42) * t);

    // Violet glow top-left
    const d1 = Math.sqrt((fx - 0.1) ** 2 + (fy - 0.1) ** 2);
    const blob1 = Math.max(0, 1 - d1 / 0.55) ** 2.5 * 0.5;
    r = Math.min(255, Math.round(r + (124 - r) * blob1));
    g = Math.min(255, Math.round(g + (58 - g) * blob1));
    b = Math.min(255, Math.round(b + (237 - b) * blob1));

    // Blue glow bottom-right
    const d2 = Math.sqrt((fx - 0.9) ** 2 + (fy - 0.9) ** 2);
    const blob2 = Math.max(0, 1 - d2 / 0.45) ** 2.5 * 0.4;
    r = Math.min(255, Math.round(r + (29 - r) * blob2));
    g = Math.min(255, Math.round(g + (78 - g) * blob2));
    b = Math.min(255, Math.round(b + (216 - b) * blob2));

    // Diagonal gloss sweep (top-left corner)
    const gloss = Math.max(0, 1 - (fx * 0.5 + fy * 0.5) / 0.35) * 0.1;
    r = Math.min(255, Math.round(r + (255 - r) * gloss));
    g = Math.min(255, Math.round(g + (255 - g) * gloss));
    b = Math.min(255, Math.round(b + (255 - b) * gloss));

    // ── "GrammarFeed" text block (left side) ──
    // Big "G" mark: circle 120px, centered at (130, 220)
    const gCx = 130, gCy = 220, gR = 90, gThick = 22;
    const gdx = x - gCx, gdy = y - gCy;
    const gdist = Math.sqrt(gdx * gdx + gdy * gdy);
    const gAngle = Math.atan2(gdy, gdx);
    const inGRing = gdist >= gR - gThick && gdist <= gR;
    const inGCut = gAngle >= -0.2 && gAngle <= Math.PI * 0.55;
    const inGBar = y >= gCy - 12 && y <= gCy + 12 && x >= gCx && x <= gCx + gR - gThick + 5;
    const inG = (inGRing && !inGCut) || inGBar;
    if (inG) {
      const alpha = Math.min(1, (1 - Math.abs(gdist - (gR - gThick / 2)) / (gThick / 2 + 1)) * 2);
      const gr = Math.round(r * (1 - alpha) + 255 * alpha);
      const gg = Math.round(g * (1 - alpha) + 255 * alpha);
      const gb = Math.round(b * (1 - alpha) + 255 * alpha);
      r = gr; g = gg; b = gb;
    }

    // Accent line under G
    if (y >= 330 && y <= 334 && x >= 50 && x <= 200) {
      const lx = (x - 50) / 150;
      const la = Math.min(1, Math.sin(lx * Math.PI) * 1.5) * 0.9;
      r = Math.min(255, Math.round(r + (99 - r) * la));
      g = Math.min(255, Math.round(g + (102 - g) * la));
      b = Math.min(255, Math.round(b + (241 - b) * la));
    }

    // "GRAMMARFEED" text rows (pixel-drawn characters are complex — use a thick bar instead)
    // Title bar representing text
    if (y >= 370 && y <= 396 && x >= 50 && x <= 450) {
      const barAlpha = 0.85;
      r = Math.min(255, Math.round(r + (255 - r) * barAlpha));
      g = Math.min(255, Math.round(g + (255 - g) * barAlpha));
      b = Math.min(255, Math.round(b + (255 - b) * barAlpha));
    }
    // Subtitle bar
    if (y >= 412 && y <= 428 && x >= 50 && x <= 320) {
      const barAlpha = 0.35;
      r = Math.min(255, Math.round(r + (255 - r) * barAlpha));
      g = Math.min(255, Math.round(g + (255 - g) * barAlpha));
      b = Math.min(255, Math.round(b + (255 - b) * barAlpha));
    }

    // Right side: 3 rule card outlines
    for (let card = 0; card < 3; card++) {
      const cx1 = 700, cy1 = 120 + card * 155;
      const cx2 = 1130, cy2 = cy1 + 130;
      const inCard = x >= cx1 && x <= cx2 && y >= cy1 && y <= cy2;
      const onBorder = inCard && (x - cx1 < 2 || cx2 - x < 2 || y - cy1 < 2 || cy2 - y < 2);
      const inAccent = inCard && x - cx1 < 5;

      if (inAccent) {
        const colors = [[37, 99, 235], [124, 58, 237], [16, 185, 129]];
        const [cr, cg, cb] = colors[card];
        r = cr; g = cg; b = cb;
      } else if (onBorder) {
        r = Math.round(r + (255 - r) * 0.08);
        g = Math.round(g + (255 - g) * 0.08);
        b = Math.round(b + (255 - b) * 0.08);
      } else if (inCard) {
        r = Math.round(r + (255 - r) * 0.04);
        g = Math.round(g + (255 - g) * 0.04);
        b = Math.round(b + (255 - b) * 0.04);
      }

      // Fake text lines inside each card
      if (inCard && !inAccent && !onBorder) {
        const lineY1 = cy1 + 28, lineY2 = cy1 + 50, lineY3 = cy1 + 72;
        const lineAlpha = [0.4, 0.25, 0.18];
        const lineLens = [180, 280, 200];
        [[lineY1, lineAlpha[0], lineLens[0]], [lineY2, lineAlpha[1], lineLens[1]], [lineY3, lineAlpha[2], lineLens[2]]].forEach(([ly, la, ll]) => {
          if (y >= ly && y <= ly + 10 && x >= cx1 + 20 && x <= cx1 + 20 + ll) {
            r = Math.min(255, Math.round(r + (255 - r) * la));
            g = Math.min(255, Math.round(g + (255 - g) * la));
            b = Math.min(255, Math.round(b + (255 - b) * la));
          }
        });
      }
    }

    // Top specular edge
    if (y === 0) { r = Math.min(255, r + 60); g = Math.min(255, g + 60); b = Math.min(255, b + 60); }

    pixels[idx] = r; pixels[idx + 1] = g; pixels[idx + 2] = b; pixels[idx + 3] = 255;
  }
}

const rawRows = [];
for (let y = 0; y < H; y++) {
  const row = Buffer.alloc(1 + W * 4);
  row[0] = 0;
  for (let x = 0; x < W; x++) {
    const src = (y * W + x) * 4;
    row[1 + x * 4] = pixels[src]; row[2 + x * 4] = pixels[src + 1];
    row[3 + x * 4] = pixels[src + 2]; row[4 + x * 4] = pixels[src + 3];
  }
  rawRows.push(row);
}
const compressed = deflateSync(Buffer.concat(rawRows), { level: 6 });
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 6;
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr),
  chunk("IDAT", compressed),
  chunk("IEND", Buffer.alloc(0)),
]);
const outPath = join(__dirname, "..", "public", "og-image.png");
writeFileSync(outPath, png);
console.log(`✓ OG image: ${outPath} (${(png.length / 1024).toFixed(1)} KB)`);
