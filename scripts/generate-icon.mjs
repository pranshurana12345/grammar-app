/**
 * Generates public/icon.png (512x512) using only Node.js built-ins.
 * Creates a deep indigo gradient with a white "G" rendered as circles.
 */
import { deflateSync } from "zlib";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SIZE = 512;

// CRC32 table
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
function u32(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n >>> 0, 0);
  return b;
}
function pngChunk(type, data) {
  const tb = Buffer.from(type, "ascii");
  const crc = crc32(Buffer.concat([tb, data]));
  return Buffer.concat([u32(data.length), tb, data, u32(crc)]);
}

// Build RGBA pixel buffer
const pixels = new Uint8Array(SIZE * SIZE * 4);

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const idx = (y * SIZE + x) * 4;
    const fx = x / SIZE;
    const fy = y / SIZE;

    // Base gradient: indigo (#1e1b4b) → near-black (#04060f)
    const t = fx * 0.4 + fy * 0.6;
    let r = Math.round(0x1e + (0x04 - 0x1e) * t);
    let g = Math.round(0x1b + (0x06 - 0x1b) * t);
    let b = Math.round(0x4b + (0x0f - 0x4b) * t);

    // Violet ambient blob (top-left)
    const d1 = Math.sqrt((fx - 0.15) ** 2 + (fy - 0.1) ** 2);
    const blob1 = Math.max(0, 1 - d1 / 0.5) ** 2 * 0.55;
    r = Math.min(255, r + Math.round(blob1 * (0x7c - r)));
    g = Math.min(255, g + Math.round(blob1 * (0x3a - g)));
    b = Math.min(255, b + Math.round(blob1 * (0xed - b)));

    // Cobalt blob (bottom-right)
    const d2 = Math.sqrt((fx - 0.88) ** 2 + (fy - 0.88) ** 2);
    const blob2 = Math.max(0, 1 - d2 / 0.45) ** 2 * 0.45;
    r = Math.min(255, Math.round(r * (1 - blob2) + 0x1d * blob2));
    g = Math.min(255, Math.round(g * (1 - blob2) + 0x4e * blob2));
    b = Math.min(255, Math.round(b * (1 - blob2) + 0xd8 * blob2));

    // Diagonal gloss (top-left sweep)
    const gloss = Math.max(0, 1 - (fx + fy) / 0.9) * 0.18;
    r = Math.min(255, Math.round(r + (255 - r) * gloss));
    g = Math.min(255, Math.round(g + (255 - g) * gloss));
    b = Math.min(255, Math.round(b + (255 - b) * gloss));

    // Draw "G" letterform as filled shape
    // Centre the G at (256, 256), radius ~150
    const cx = SIZE / 2;
    const cy = SIZE / 2 + 20;
    const R = 150;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx); // -π to π

    // Outer ring: circle annulus (donut)
    const thickness = 38;
    const inRing = dist >= R - thickness && dist <= R;

    // Cut the right side to form the C shape (open from ~-15° to 90°)
    const openStart = -0.25; // radians
    const openEnd = Math.PI * 0.5;
    const inCut = angle >= openStart && angle <= openEnd;

    // Crossbar: horizontal bar from centre to right inside the G
    const inBar =
      y >= cy - 18 && y <= cy + 18 &&
      x >= cx && x <= cx + R - thickness + 4;

    const inG = (inRing && !inCut) || inBar;

    if (inG) {
      // White to lavender gradient for the G
      const gProgress = (y - (cy - R)) / (R * 2);
      const gr = Math.round(255 - gProgress * (255 - 165));
      const gg = Math.round(255 - gProgress * (255 - 180));
      const gb = Math.round(255 - gProgress * (255 - 252));
      const alpha = Math.min(1, (1 - Math.abs(dist - (R - thickness / 2)) / (thickness / 2)) * 1.5);
      r = Math.round(r * (1 - alpha) + gr * alpha);
      g = Math.round(g * (1 - alpha) + gg * alpha);
      b = Math.round(b * (1 - alpha) + gb * alpha);
    }

    // Top specular edge
    if (y === 0) {
      r = Math.min(255, Math.round(r + (255 - r) * 0.5));
      g = Math.min(255, Math.round(g + (255 - g) * 0.5));
      b = Math.min(255, Math.round(b + (255 - b) * 0.5));
    }

    pixels[idx] = r;
    pixels[idx + 1] = g;
    pixels[idx + 2] = b;
    pixels[idx + 3] = 255;
  }
}

// Build PNG scanlines (filter type 0 = None per row)
const rawRows = [];
for (let y = 0; y < SIZE; y++) {
  const row = Buffer.alloc(1 + SIZE * 4);
  row[0] = 0; // filter none
  for (let x = 0; x < SIZE; x++) {
    const src = (y * SIZE + x) * 4;
    row[1 + x * 4] = pixels[src];
    row[2 + x * 4] = pixels[src + 1];
    row[3 + x * 4] = pixels[src + 2];
    row[4 + x * 4] = pixels[src + 3];
  }
  rawRows.push(row);
}
const raw = Buffer.concat(rawRows);
const compressed = deflateSync(raw, { level: 6 });

// IHDR
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8;  // bit depth
ihdr[9] = 6;  // RGBA
ihdr[10] = 0; // compression
ihdr[11] = 0; // filter
ihdr[12] = 0; // interlace

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // signature
  pngChunk("IHDR", ihdr),
  pngChunk("IDAT", compressed),
  pngChunk("IEND", Buffer.alloc(0)),
]);

const outPath = join(__dirname, "..", "public", "icon.png");
writeFileSync(outPath, png);
console.log(`✓ Generated ${outPath} (${(png.length / 1024).toFixed(1)} KB)`);
