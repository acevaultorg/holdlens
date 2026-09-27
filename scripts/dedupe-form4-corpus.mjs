// scripts/dedupe-form4-corpus.mjs
//
// One-time repair of data/edgar-form4.json (2026-09-27, card mue3scew2g5ppr).
//
// The May 2026 backfill parsed each filing once per daily-index row, and the
// index lists a filing once per filer (issuer + every reporting owner). Each
// filing's transactions were therefore written k times, k = number of index
// rows for that accession. fetch-edgar-form4.ts now fetches each accession once;
// this script removes the repeats already in the corpus.
//
// It does NOT dedupe on the whole row globally. A single filing can legitimately
// carry two identical transaction lines, so per accession it divides every
// row's multiplicity by the gcd of that accession's multiplicities: a filing
// multiplied 2x with one genuinely repeated line ([2, 4]) becomes [1, 2], not
// [1, 1]. Row order is preserved (first occurrences kept).
//
// Usage: node scripts/dedupe-form4-corpus.mjs data/edgar-form4.json [--write]

import { readFileSync, writeFileSync } from "node:fs";

const [, , file, flag] = process.argv;
if (!file) {
  console.error("usage: dedupe-form4-corpus.mjs <edgar-form4.json> [--write]");
  process.exit(2);
}

const rows = JSON.parse(readFileSync(file, "utf-8"));
if (!Array.isArray(rows)) throw new Error("not an array");

const keyOf = (r) => JSON.stringify(r, Object.keys(r).sort());
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

// multiplicity per (accession, row)
const byAcc = new Map();
for (const r of rows) {
  const acc = r.form4AccessionNumber ?? "";
  if (!byAcc.has(acc)) byAcc.set(acc, new Map());
  const m = byAcc.get(acc);
  const k = keyOf(r);
  m.set(k, (m.get(k) ?? 0) + 1);
}

// how many copies of each row to keep
const keep = new Map();
let multiplied = 0;
for (const [acc, m] of byAcc) {
  const g = [...m.values()].reduce(gcd);
  if (g > 1) multiplied++;
  for (const [k, n] of m) keep.set(acc + "\u0000" + k, n / g);
}

const out = [];
for (const r of rows) {
  const id = (r.form4AccessionNumber ?? "") + "\u0000" + keyOf(r);
  const left = keep.get(id);
  if (left > 0) {
    out.push(r);
    keep.set(id, left - 1);
  }
}

console.log(
  `form4: ${rows.length} rows -> ${out.length} (${rows.length - out.length} repeats removed) · ` +
    `${byAcc.size} accessions, ${multiplied} were multiplied`,
);

if (flag === "--write") {
  writeFileSync(file, JSON.stringify(out, null, 2));
  console.log(`wrote ${file}`);
}
