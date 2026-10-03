#!/usr/bin/env node
// hold-officer-overflow.mjs <holdDir> [--target N] — keep a deploy under the CF Pages file cap by holding
// back the LEAST-ACTIVE /insiders/officer/<slug>/ pages, only as many as needed (2026-10-03).
//
// WHY: the 10-02 EDGAR ingest (+5,256 Form 4 rows) took out/ to 20,579 files after the three earlier
// holds (deploy-cf-locked.sh), over CF's hard 20,000 per deployment. The rest of out/ is HTML that
// shipped pages link to: 10,179 of the 10,255 officer pages are linked from a page that ships, so the
// "zero references" test the earlier holds used finds nothing more. The officer class grows with every
// ingest, so a fixed exclusion would just move the wall. This holds the overflow, smallest first.
//
// WHICH: officer pages whose meta description says "— 1 tracked SEC Form 4 transactions", that have
// NO traffic in fleet.promptprio.com ga4-pages.csv / gsc-pages.csv (the same sources the fleet traffic
// veto check-safe-to-delete.mjs reads; any row for the URL vetoes it), and whose company page
// out/insiders/company/<ticker>/index.html exists. functions/_middleware.ts 302s a held officer URL to
// that company page, which lists the same filing; 302 because the page comes back when there is room.
//
// FAIL-CLOSED: if the traffic CSVs cannot be read or hold no holdlens rows, nothing is held and the
// cap check in deploy-cf-locked.sh refuses the deploy exactly as before. Moves are recorded in
// <holdDir>/officer-held.txt; deploy-cf-locked.sh restores them on exit.
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const holdDir = process.argv[2];
if (!holdDir) { console.error("usage: hold-officer-overflow.mjs <holdDir> [--target N]"); process.exit(2); }
const ti = process.argv.indexOf("--target");
const TARGET = ti > 0 ? Number(process.argv[ti + 1]) : 19500;
const OUT = "out";

function countFiles(dir) {
  let n = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) n += e.isDirectory() ? countFiles(join(dir, e.name)) : 1;
  return n;
}
const total = countFiles(OUT);
const need = total - TARGET;
if (need <= 0) { console.log(`[hold-officer-overflow] ${total} files <= target ${TARGET}; nothing held`); process.exit(0); }

const HDR = { "x-ingest-token": process.env.FLEET_DASHBOARD_INGEST_TOKEN || process.env.INGEST_TOKEN || "" };
async function csv(name) {
  const r = await fetch(`https://fleet.promptprio.com/${name}.csv`, { headers: HDR, signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`${name}.csv HTTP ${r.status}`);
  return (await r.text()).split("\n").filter((l) => l.startsWith("holdlens.com,"));
}
let rows;
try { rows = [...(await csv("ga4-pages")), ...(await csv("gsc-pages"))]; }
catch (e) { console.error(`[hold-officer-overflow] traffic CSVs unreadable (${e.message}); holding nothing`); process.exit(0); }
if (rows.length < 100) { console.error(`[hold-officer-overflow] only ${rows.length} holdlens traffic rows; holding nothing`); process.exit(0); }
const trafficked = new Set();
for (const l of rows) { const m = l.match(/\/insiders\/officer\/([^/",?#]+)/); if (m) trafficked.add(m[1]); }

const base = join(OUT, "insiders", "officer");
const cands = [];
for (const slug of readdirSync(base).sort()) {
  if (trafficked.has(slug)) continue;
  const f = join(base, slug, "index.html");
  if (!existsSync(f)) continue;
  const ticker = slug.slice(slug.lastIndexOf("-") + 1);
  if (!ticker || !existsSync(join(OUT, "insiders", "company", ticker, "index.html"))) continue;
  if (readdirSync(join(base, slug)).length !== 1) continue; // one file per page; anything else is not ours to move
  const m = readFileSync(f, "utf8").match(/— (\d+) tracked SEC Form 4 transactions/);
  if (!m || Number(m[1]) !== 1) continue;
  cands.push({ slug, size: statSync(f).size });
}
cands.sort((a, b) => a.size - b.size || a.slug.localeCompare(b.slug));
const take = cands.slice(0, need);
if (take.length < need) console.error(`[hold-officer-overflow] only ${take.length} eligible of ${need} needed; the cap check decides`);
const dest = join(holdDir, "__officer");
mkdirSync(dest, { recursive: true });
for (const { slug } of take) renameSync(join(base, slug), join(dest, slug));
writeFileSync(join(holdDir, "officer-held.txt"), take.map((t) => t.slug).join("\n") + "\n");
console.log(`[hold-officer-overflow] ${total} files, target ${TARGET}: held ${take.length} single-filing officer pages ` +
  `(eligible ${cands.length}; ${trafficked.size} officer URLs with traffic always ship)`);
