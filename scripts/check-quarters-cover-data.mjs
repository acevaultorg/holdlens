// Fails the build when edgar-holdings.json holds a quarter NEWER than anything QUARTERS
// publishes, or when the published window has a hole in it.
//
// WHY THIS IS A SCRIPT AND NOT A COMMENT: Q2 2026 was ingested 2026-08-14 (26 of 27
// investors — a complete quarter) and sat in the data while every page rendered Q1 and
// /quarter/2026-q2/ returned 404. On a site whose whole value is quarterly freshness,
// read mostly by AI answer engines, that is the worst kind of silent failure: the data
// was right there and nothing said so. Nobody re-reads the top of a 663-line file when
// adding data, so a header comment would not have caught it.
//
// NOT a "every quarter in the data must be listed" check — that was the first version of
// this script and it FAILED ON A CORRECT REPO, because the data goes back to 2022-Q1 while
// the site deliberately publishes from 2024-Q1. An alarm that fires on a healthy state
// gets disabled, so it only flags the two things that are actually wrong:
//   1. data newer than the newest published quarter  (a quarter shipped but not published)
//   2. a gap inside the published window             (a quarter silently dropped)
//
// Two QUARTERS arrays exist on purpose: lib/moves.ts is server-only, lib/moves-types.ts is
// the client-safe copy imported by ValueClient / WatchlistClient / TickerActivity. They must
// agree — moves-types.ts had drifted a FULL YEAR behind. Both are checked.
import { readFileSync } from "node:fs";

const raw = JSON.parse(readFileSync(new URL("../data/edgar-holdings.json", import.meta.url)));
const rows = Array.isArray(raw) ? raw : Object.values(raw).find(Array.isArray) ?? [];
const inData = [...new Set(rows.map((r) => r.quarter).filter(Boolean))].sort().reverse();
const newestInData = inData[0];

const listed = (f) => {
  const src = readFileSync(new URL(f, import.meta.url), "utf8");
  const body = src.split("export const QUARTERS = [")[1]?.split("]")[0] ?? "";
  return [...body.matchAll(/"([0-9]{4}-Q[1-4])"/g)].map((m) => m[1]);
};
const step = (q) => { const [y, n] = q.split("-Q").map(Number); return n === 1 ? `${y - 1}-Q4` : `${y}-Q${n - 1}`; };

let bad = false;
for (const f of ["../lib/moves.ts", "../lib/moves-types.ts"]) {
  const name = f.replace("../", "");
  const have = listed(f);
  if (!have.length) { console.error(`  ✗ ${name}: no QUARTERS array found`); bad = true; continue; }
  const sorted = [...have].sort().reverse();

  if (newestInData > sorted[0]) {
    const behind = inData.filter((q) => q > sorted[0]);
    console.error(`\n  ✗ ${name} publishes up to ${sorted[0]}, but the data has ${behind.join(", ")}.`);
    console.error(`    Those pages will 404 and every "latest quarter" reads stale.`);
    console.error(`    Fix: add to the QUARTERS array AND QUARTER_LABELS in this file.`);
    bad = true;
  }
  // contiguity inside the published window only
  for (let i = 0; i < sorted.length - 1; i++) {
    if (step(sorted[i]) !== sorted[i + 1]) {
      console.error(`\n  ✗ ${name}: gap in published window — ${sorted[i]} is followed by ${sorted[i + 1]}.`);
      bad = true;
    }
  }
}
if (bad) { console.error(""); process.exit(1); }
console.log(`  ✓ quarters current: publishing through ${newestInData} (data has ${inData.length} quarters, window starts ${listed("../lib/moves.ts").sort()[0]})`);
