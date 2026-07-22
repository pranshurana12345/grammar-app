// Renders the idiom print table to a standalone HTML file using the SAME
// markup and print CSS the app uses, so the printed PDF can be checked with
// headless Chrome without going through the app's PIN gate.
//
//   npx tsx scripts/print-preview.mts   →  scripts/.print-preview.html
import fs from "node:fs";
import path from "node:path";
import { IDIOM_GROUPS, IDIOMS } from "../data/idioms.ts";

const css = fs.readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");
// Lift the print block out of globals.css verbatim — if it changes there, this
// preview changes with it.
const start = css.indexOf("@media print {");
let depth = 0, end = start;
for (let i = start; i < css.length; i++) {
  if (css[i] === "{") depth++;
  else if (css[i] === "}") { depth--; if (depth === 0) { end = i + 1; break; } }
}
const printBlock = css.slice(start, end);

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

let rows = "";
for (const g of IDIOM_GROUPS) {
  rows += `<tr class="grp"><td colspan="2">${esc(g.icon)} ${esc(g.name)}</td></tr>\n`;
  for (let i = 0; i < g.items.length; i += 2) {
    const cell = (idi?: (typeof g.items)[number]) =>
      idi ? `<span class="ph">${esc(idi.pic)} ${esc(idi.phrase)}</span><br><span class="mn">${esc(idi.meaning)}</span>` : "";
    rows += `<tr><td>${cell(g.items[i])}</td><td>${cell(g.items[i + 1])}</td></tr>\n`;
  }
}

const html = `<!doctype html><html><head><meta charset="utf-8">
<title>Idioms &amp; Phrases — ${IDIOMS.length} idioms</title>
<style>
  body { font-family: system-ui, "Segoe UI", sans-serif; margin: 0; }
  h1 { font-size: 14pt; margin: 0 0 2mm; }
  .sub { font-size: 9pt; color: #64748b; margin: 0 0 4mm; }
  .print-table { display: none; }
  ${printBlock}
  /* preview only: show the table on screen too */
  @media screen { .print-table { display: table; width: 100%; table-layout: fixed; border-collapse: collapse; } }
</style></head><body>
<h1>Idioms &amp; Phrases</h1>
<p class="sub">${IDIOMS.length} idioms · ${IDIOM_GROUPS.length} themes</p>
<table class="print-table"><tbody>
${rows}</tbody></table>
</body></html>`;

const out = path.join(process.cwd(), "scripts/.print-preview.html");
fs.writeFileSync(out, html);
console.log("wrote", out, "-", IDIOMS.length, "idioms in", IDIOM_GROUPS.length, "groups");
