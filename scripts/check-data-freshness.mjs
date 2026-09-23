// scripts/check-data-freshness.mjs
//
// WARNS (never fails by default) when an ingested EDGAR dataset is older than
// the cadence HoldLens publicly claims for it.
//
// Why this exists (2026-09-23):
//   secfilingdex shipped an eleven-day-old corpus behind green deploys because
//   no gate read the DATA — only the build. HoldLens has the same gap, and it
//   is worse here because HoldLens serves THREE datasets on THREE different
//   cadences, so a single "is the data old?" threshold is wrong for all of them:
//
//     data/edgar-holdings.json  13F     QUARTERLY — 39 days stale is MANDATORY,
//                                       not a fault. Must be measured against the
//                                       13F deadline calendar, never a day count.
//     data/edgar-form4.json     Form 4  DAILY — /insiders/live/ tells the reader
//                                       "this feed is re-indexed daily after
//                                       overnight EDGAR ingest".
//     data/edgar-8k.json        8-K     DAILY — /events/live/ tells the reader
//                                       "this feed re-indexes intra-day when new
//                                       filings post to EDGAR".
//
//   The two daily feeds print their own newest date on the page next to that
//   promise, so when the ingest stops the site contradicts itself in public.
//   Thousands of Form 4s and hundreds of 8-Ks are filed every business day:
//   a multi-day gap is a dead pipeline, not a quiet week.
//
//   The 13F check deliberately does NOT use a day threshold. A 13F is due 45
//   days after quarter end (Q1→May 15, Q2→Aug 14, Q3→Nov 14, Q4→Feb 14), so the
//   corpus is *supposed* to sit still for ~3 months. We compare against the most
//   recent deadline that is at least GRACE_DAYS in the past — before that, the
//   new quarter simply has not been filed yet and silence is correct.
//
// WARN, not fail, on purpose: a stale corpus is still a working site, and a hard
// failure here would block an unrelated copy fix from ever shipping.
// Set HOLDLENS_STALE_DATA_FATAL=1 to turn warnings into a build failure.
//
// Usage:  node scripts/check-data-freshness.mjs

import { readFileSync } from "node:fs";
import { join } from "node:path";

const FATAL = process.env.HOLDLENS_STALE_DATA_FATAL === "1";
const DATA_DIR = join(process.cwd(), "data");

/** Days after a 13F deadline before we expect the new quarter to be ingested. */
const QUARTERLY_GRACE_DAYS = 7;

const DATASETS = [
  {
    file: "edgar-form4.json",
    label: "Form 4 (insider transactions)",
    field: "filedAt",
    cadence: "daily",
    // Form 4 is due within 2 business days of the transaction; +1 for ingest.
    staleAfterBusinessDays: 3,
    surface: "/insiders/live/ — \"re-indexed daily after overnight EDGAR ingest\"",
    fix: "npx tsx scripts/fetch-edgar-form4.ts --days 30",
  },
  {
    file: "edgar-8k.json",
    label: "Form 8-K (material events)",
    field: "filedAt",
    cadence: "daily",
    // 8-K is due within 4 business days of the event; +1 for ingest.
    staleAfterBusinessDays: 5,
    surface: "/events/live/ — \"re-indexes intra-day when new filings post to EDGAR\"",
    fix: "npx tsx scripts/fetch-edgar-8k.ts --days 30",
  },
  {
    file: "edgar-holdings.json",
    label: "Form 13F (quarterly holdings)",
    field: "filingDate",
    cadence: "quarterly",
    surface: "sitewide — \"Updated every quarter\"",
    fix: "npm run fetch-edgar",
  },
];

/** Normalise "2026-05-15" and "20260515" to "2026-05-15". Anything else => null. */
function normaliseDay(v) {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  if (/^\d{8}$/.test(s)) return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  return null;
}

/** Business days strictly after `from`, up to and including `to`. Weekends only —
 *  SEC holidays are not modelled, so this can under-report staleness by a day
 *  around a holiday. That is the safe direction for a warning. */
function businessDaysBetween(fromDay, toDay) {
  let n = 0;
  const d = new Date(`${fromDay}T00:00:00Z`);
  const end = new Date(`${toDay}T00:00:00Z`);
  while (d < end) {
    d.setUTCDate(d.getUTCDate() + 1);
    const w = d.getUTCDay();
    if (w !== 0 && w !== 6) n++;
  }
  return n;
}

function addDays(day, n) {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** The 13F filing deadline for each quarter: 45 days after quarter end. */
function thirteenFDeadlines(year) {
  return [
    `${year}-02-17`, // Q4 prior year (Dec 31 + 45 = Feb 14; nearest business day varies)
    `${year}-05-15`, // Q1 (Mar 31 + 45)
    `${year}-08-14`, // Q2 (Jun 30 + 45)
    `${year}-11-14`, // Q3 (Sep 30 + 45)
  ];
}

/** The newest 13F deadline that is at least GRACE days in the past. Before that
 *  point the quarter has not been filed yet and an unchanged corpus is correct. */
function effectiveThirteenFDeadline(today) {
  const y = Number(today.slice(0, 4));
  const candidates = [...thirteenFDeadlines(y - 1), ...thirteenFDeadlines(y)]
    .filter((d) => addDays(d, QUARTERLY_GRACE_DAYS) <= today)
    .sort();
  return candidates[candidates.length - 1] ?? null;
}

/** Newest normalised day across a dataset's records. Returns {error} if the
 *  instrument could not read anything — an unread file must never report "fresh". */
function newestDay(file, field) {
  let raw;
  try {
    raw = readFileSync(join(DATA_DIR, file), "utf8");
  } catch {
    return { error: `unreadable: data/${file}` };
  }
  let rows;
  try {
    rows = JSON.parse(raw);
  } catch {
    return { error: `invalid JSON: data/${file}` };
  }
  if (!Array.isArray(rows)) return { error: `not an array: data/${file}` };
  if (rows.length === 0) return { error: `no records in data/${file}` };

  let newest = null;
  let withField = 0;
  for (const r of rows) {
    const day = normaliseDay(r?.[field]);
    if (!day) continue;
    withField++;
    if (newest === null || day > newest) newest = day;
  }
  if (newest === null) {
    return { error: `no usable "${field}" in ${rows.length} records of data/${file}` };
  }
  return { newest, withField, total: rows.length };
}

const today = new Date().toISOString().slice(0, 10);
const problems = [];
const lines = [];

for (const ds of DATASETS) {
  const r = newestDay(ds.file, ds.field);

  if (r.error) {
    problems.push(
      `CANNOT MEASURE — ${ds.label}: ${r.error}. This is NOT a pass.\n` +
        `    Fix with: ${ds.fix}`
    );
    continue;
  }

  if (ds.cadence === "quarterly") {
    const due = effectiveThirteenFDeadline(today);
    if (due && r.newest < due) {
      problems.push(
        `STALE — ${ds.label}: newest filing ${r.newest}, but the ${due} 13F deadline\n` +
          `    passed more than ${QUARTERLY_GRACE_DAYS} days ago, so that quarter should be ingested.\n` +
          `    Claimed on: ${ds.surface}\n` +
          `    ${r.withField} of ${r.total} records dated. Fix with: ${ds.fix}`
      );
    } else {
      lines.push(
        `[data-freshness] OK — ${ds.label}: newest ${r.newest} ` +
          `(current through the ${due ?? "n/a"} deadline; quarterly cadence).`
      );
    }
    continue;
  }

  const age = businessDaysBetween(r.newest, today);
  if (age > ds.staleAfterBusinessDays) {
    problems.push(
      `STALE — ${ds.label}: newest record ${r.newest}, ${age} business days old\n` +
        `    (threshold ${ds.staleAfterBusinessDays}). Thousands of these are filed every business day,\n` +
        `    so this is a pipeline fault, not a quiet week.\n` +
        `    Claimed on: ${ds.surface}\n` +
        `    ${r.withField} of ${r.total} records dated. Fix with: ${ds.fix}`
    );
  } else {
    lines.push(
      `[data-freshness] OK — ${ds.label}: newest ${r.newest} ` +
        `(${age} business day(s) old, ${r.withField} records).`
    );
  }
}

for (const l of lines) console.log(l);

if (problems.length > 0) {
  const msg =
    `\n[data-freshness] ⚠️  ${problems.length} dataset issue(s) — the site advertises ` +
    `these feeds as current:\n\n` +
    problems.map((p) => `[data-freshness]  ⚠️  ${p}`).join("\n\n") +
    `\n`;
  if (FATAL) {
    console.error(msg);
    console.error("[data-freshness] HOLDLENS_STALE_DATA_FATAL=1 — failing the build.\n");
    process.exit(1);
  }
  console.warn(msg);
}

process.exit(0);
