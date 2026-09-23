// scripts/merge-edgar-window.mjs
//
// Merge a freshly-fetched EDGAR window into the existing corpus.
//
// Why this exists (2026-09-23):
//   scripts/fetch-edgar-form4.ts and scripts/fetch-edgar-8k.ts each write their
//   whole output file with writeFileSync — they replace the corpus, they do not
//   extend it. That is harmless for a one-off backfill and wrong for a
//   scheduled ingest: a nightly `--days 3` run would leave three days of rows
//   in the file, and every /insiders/company/[ticker]/ + /events/company/
//   [ticker]/ page whose ticker did not file in those three days would vanish
//   from the build and then from the sitemap. Silent mass de-indexing of live
//   pages, every night, as a side effect of refreshing them.
//
//   So the scheduled ingest fetches into a temp file and merges here: every
//   existing row is preserved verbatim and only rows not already present are
//   appended. Identity is the WHOLE ROW, and that is deliberate. A narrower key
//   looked right and was not — keying Form 4 on accession + ticker + name +
//   date + shares + price collapsed the corpus from 20,674 rows to 16,687,
//   because one filing legitimately emits a non-derivative buy leg and a
//   derivative sell leg carrying identical numbers.
//
//   Note while you are here: even whole-row identity dedupes that corpus to
//   9,565, i.e. ~54% of the rows already in data/edgar-form4.json are
//   byte-identical repeats, one transaction appearing up to sixteen times.
//   That is a real defect in scripts/fetch-edgar-form4.ts and it is NOT this
//   script's to fix — silently halving the corpus would change every count on
//   the insider surfaces as a side effect of a freshness job. Preserving
//   existing rows verbatim keeps that decision where it belongs.
//
// Usage:  node scripts/merge-edgar-window.mjs <existing.json> <fetched.json> <out.json> <form4|8k>

import { readFileSync, writeFileSync } from "node:fs";

const [, , existingFile, fetchedFile, outFile, kind] = process.argv;

if (!existingFile || !fetchedFile || !outFile || !kind) {
  console.error("usage: merge-edgar-window.mjs <existing> <fetched> <out> <form4|8k>");
  process.exit(2);
}
if (kind !== "form4" && kind !== "8k") {
  console.error(`unknown kind "${kind}" — expected form4 or 8k`);
  process.exit(2);
}

/** Missing/unreadable existing corpus is fine (first run); an unreadable FETCH is not. */
function read(file, required) {
  try {
    const rows = JSON.parse(readFileSync(file, "utf-8"));
    if (!Array.isArray(rows)) throw new Error("not an array");
    return rows;
  } catch (err) {
    if (required) {
      console.error(`FATAL: cannot read ${file}: ${err.message}`);
      process.exit(1);
    }
    return [];
  }
}

/** Whole-row identity — see the header for why a narrower key is wrong here. */
const keyOf = (r) => JSON.stringify(r, Object.keys(r).sort());

const dateOf = (r) => r.filedAt ?? r.date ?? "";

const existing = read(existingFile, false);
const fetched = read(fetchedFile, true);

// A fetch that returned nothing is an EDGAR outage or a parser regression, not
// an empty week — refuse rather than write an empty corpus over a good one.
if (fetched.length === 0 && existing.length > 0) {
  console.error("FATAL: fetched window is empty but existing corpus is not — refusing to merge");
  process.exit(1);
}

// Existing rows are kept exactly as they are — including the pre-existing
// duplicates described above. Only genuinely new rows are appended.
const seen = new Set(existing.map(keyOf));
const appended = [];
for (const row of fetched) {
  const k = keyOf(row);
  if (seen.has(k)) continue;
  seen.add(k);
  appended.push(row);
}

// Newest first. The comparator MUST return 0 on a tie: the obvious
// `a < b ? 1 : -1` one-liner (copied from the page-level sorts) never does, so
// it claims a > b AND b > a for equal dates, and V8's TimSort then produces a
// different permutation of the tied rows on every run. Measured 2026-09-23:
// re-running the ingest with ZERO new rows still rewrote both corpora and
// committed a 700,000-line diff of pure reordering. A scheduled job that does
// that three times a day is a repo-bloat machine. With a correct comparator the
// sort is stable, so an unchanged corpus serialises byte-identically and the
// ingest's "no new filings" branch can actually fire.
const merged = [...existing, ...appended].sort((a, b) => {
  const da = dateOf(a);
  const db = dateOf(b);
  return da === db ? 0 : da < db ? 1 : -1;
});

// The whole point of merging is that nothing is lost. Assert it.
if (merged.length < existing.length) {
  console.error(`FATAL: merge shrank the corpus ${existing.length} -> ${merged.length}`);
  process.exit(1);
}

writeFileSync(outFile, JSON.stringify(merged, null, 2));

const dates = merged.map(dateOf).filter(Boolean).sort();
console.log(
  `${kind}: ${existing.length} existing + ${fetched.length} fetched -> ${merged.length} rows ` +
    `(${appended.length} new) covering ${dates[0]} .. ${dates[dates.length - 1]}`,
);
