/**
 * Homepage dedupe audit — postbuild guardrail.
 *
 * Catches the regression class fixed in commits e92e0e385 + a12f2e1cb:
 * curated-N-row homepage widgets that collapse to <N unique tickers when
 * cluster events (multiple insiders / 8-Ks at the same company on the
 * same day) dominate the data. Symptom: /insiders/company/srfm/ × 5 in
 * static homepage HTML; cause: missing top-1-per-ticker dedupe.
 *
 * Bug class signature (homepage ONLY):
 *   For each /section/ in {/insiders/company/, /events/company/,
 *   /signal/, /investor/, /ticker/}: count distinct slugs vs total link
 *   occurrences. If a section has >=4 total links AND a single slug
 *   accounts for >50% of them OR ratio > 2.5x, it's the bug class.
 *
 * Why ONLY homepage: activity feeds (/activity, /insiders/live) are
 * intentional firehose pages where repetition IS the data — those would
 * false-positive. The bugs we care about are curated N-row widgets on
 * the marketing-prominent homepage.
 *
 * Behavior: WARN on stdout (does not fail the build). Operator can
 * decide whether to investigate or accept. Failing the build would risk
 * blocking deploys on legitimate one-day cluster signal where the
 * widget hasn't been deduped yet — the dedupe is a UX/SEO improvement,
 * not a correctness bug, so warn-not-fail is the right ergonomics.
 *
 * Pairs with: prune-sitemap.ts (also postbuild) — both keep the static
 * export honest without modifying source pages.
 */

import * as fs from "node:fs";
import * as path from "node:path";

const OUT_DIR = "out";
const HOMEPAGE = path.join(OUT_DIR, "index.html");

// Sections where the dedupe bug class can appear. These are the per-entity
// page roots that homepage curated widgets typically link to.
const SECTIONS = [
  "/insiders/company/",
  "/events/company/",
  "/signal/",
  "/investor/",
  "/ticker/",
];

// Heuristic thresholds — tuned to catch the e92e0e385 + a12f2e1cb regressions
// without false-positiving on intentional cross-references (e.g. multiple
// homepage widgets each linking to the same tier-1 manager page).
const MIN_OCCURRENCES = 4; // at least 4 links to flag (avoid noise on tiny widgets)
const MIN_TOP_COUNT = 3; // top slug must repeat ≥3x (avoids 1-or-2-extra noise)
const MAX_DOMINATION = 0.5; // a single slug holding >50% of section's links
const MAX_RATIO = 2.0; // total/unique ≥ 2.0 catches both SRFM(5x) and OFAL(2.5x)

type Finding = {
  section: string;
  unique: number;
  total: number;
  ratio: number;
  topSlug: string;
  topCount: number;
  domination: number;
};

function auditSection(html: string, section: string): Finding | null {
  // Match href="/section/SLUG/" or href="/section/SLUG"
  const re = new RegExp(`"(${section.replace(/\//g, "\\/")}[a-zA-Z0-9._-]+)/?"`, "g");
  const matches = [...html.matchAll(re)];
  const slugs = matches.map((m) => m[1].slice(section.length).replace(/\/$/, ""));
  if (slugs.length < MIN_OCCURRENCES) return null;

  const counts: Record<string, number> = {};
  for (const s of slugs) counts[s] = (counts[s] ?? 0) + 1;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [topSlug, topCount] = sorted[0];
  const unique = sorted.length;
  const total = slugs.length;
  const ratio = total / unique;
  const domination = topCount / total;

  // Trigger when EITHER (a) ratio is suspicious AND top slug repeats meaningfully,
  // OR (b) one slug dominates the section regardless of ratio.
  // Both branches require MIN_TOP_COUNT to filter "1 or 2 extra" noise.
  const ratioBug = ratio >= MAX_RATIO && topCount >= MIN_TOP_COUNT;
  const dominationBug = domination > MAX_DOMINATION && topCount >= MIN_TOP_COUNT;
  if (ratioBug || dominationBug) {
    return { section, unique, total, ratio, topSlug, topCount, domination };
  }
  return null;
}

function main(): void {
  if (!fs.existsSync(HOMEPAGE)) {
    console.warn(`[audit-homepage-dedupe] ${HOMEPAGE} not found — skipping (run after build).`);
    return;
  }

  const html = fs.readFileSync(HOMEPAGE, "utf8");
  const findings: Finding[] = [];
  for (const section of SECTIONS) {
    const f = auditSection(html, section);
    if (f) findings.push(f);
  }

  if (findings.length === 0) {
    console.log("[audit-homepage-dedupe] ✓ homepage clean — no dedupe-bug pattern detected.");
    return;
  }

  console.log("[audit-homepage-dedupe] ⚠ potential dedupe bug(s) on homepage:");
  for (const f of findings) {
    console.log(
      `  ${f.section.padEnd(24)} ` +
        `${f.unique} unique / ${f.total} total ` +
        `(ratio ${f.ratio.toFixed(1)}x, ` +
        `${f.section}${f.topSlug}/ holds ${(f.domination * 100).toFixed(0)}% with ${f.topCount} links)`,
    );
  }
  console.log(
    "  → fix pattern: top-1-per-ticker dedupe before slicing (see commits e92e0e385 + a12f2e1cb).",
  );
  console.log(
    "  → audit warns; build does NOT fail. Investigate or accept; cluster days may legitimately produce this.",
  );
}

main();
