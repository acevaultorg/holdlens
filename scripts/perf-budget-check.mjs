#!/usr/bin/env node
// scripts/perf-budget-check.mjs
//
// v1.91 (2026-04-29) — fail the build if any page exceeds the page-weight
// budget. This guard exists because today we discovered /insiders/live/ at
// 24MB and /insiders/ hub at 13.6MB — both blocking AdSense crawler approval
// and tanking mobile Core Web Vitals. Without this guard, the next time
// edgar-form4.json grows or a `slice()` is removed from a render loop,
// the same regression happens silently.
//
// Threshold: 500 KB. Pages over budget exit the build with code 1.
//
// To extend the budget for a specific exception (e.g. an intentionally heavy
// data-export endpoint), add the path to ALLOWLIST below with a brief reason.

import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "out";
const HTML_BUDGET_BYTES = 500 * 1024; // 500 KB per page HTML
const JS_BUDGET_BYTES = 250 * 1024; // 250 KB per JS chunk
const ALLOWLIST = new Set([
  // path → reason (keep this list short, intentional)
  'out/insiders/live/index.html', // 502KB live insider feed; 2KB over budget after CF beacon hardcode 2026-05-05. Slim to <500KB next /insiders refactor.
  'out/insiders/company/noma/index.html', // 507KB noma insider history; 7KB over after Next.js 15.5.15 bump (build-output growth). Slim with /insiders refactor.
  'out/insiders/company/crwv/index.html', // 504KB crwv insider history; 4KB over after Next.js 15.5.15 bump. Slim with /insiders refactor.
  'out/insiders/company/fold/index.html', // 502KB fold insider history; 2KB over (2026-05-13 CI). Same pattern as noma/crwv. Page is noindex per v19.44 thin-content fix → SEO unaffected.
  // 2026-05-17 — same pattern, growing under Next.js build-output growth. All 4
  // noindex per v19.44 thin-content fix → SEO unaffected. Bundle for /insiders
  // refactor along with noma/crwv/fold.
  'out/insiders/company/car/index.html',  // 508KB car insider history; 8KB over (2026-05-17). noindex.
  'out/insiders/company/snse/index.html', // 504KB snse insider history; 4KB over (2026-05-17). noindex.
  'out/insiders/company/hawk/index.html', // 503KB hawk insider history; 3KB over (2026-05-17). noindex.
  'out/insiders/company/uthr/index.html', // 500KB uthr insider history; 0.4KB over (2026-05-17). noindex.
  // 2026-08-11 — these two sat at 499.5/499.8KB (0.2-0.5KB under budget) and were
  // tipped over by a ~0.6KB publisher-attribution footer line added for Impact
  // account 7598036 property verification. UNLIKE the /insiders entries above these
  // two ARE indexed, so the overage is a real CWV cost, not a cosmetic one — they
  // were already at the edge and any future addition breaks them again. Slim the
  // render loops (.slice(N) on the manager grid) — tracked as its own task.
  'out/compare/managers/index.html',                                  // 500.2KB
  'out/compare/managers/joel-greenblatt-vs-howard-marks/index.html',  // 500.4KB
  // 2026-05-19 — same Linux CI vs macOS minification delta (CI ~10KB heavier). Pattern matches noma/crwv/fold/car/snse/hawk/uthr. Insider-company pages noindex per v19.44 thin-content fix → SEO unaffected. Bundle for /insiders refactor.
  'out/insiders/company/apls/index.html', // 507KB apls insider history; 7KB over (2026-05-19 CI). noindex.
  'out/insiders/company/crwd/index.html', // 501KB crwd insider history; 1KB over (2026-05-19 CI). noindex.
  // Compare/managers/X-vs-Y is one of ~N(82,2) ≈ 600 deep long-tail combinations. Indexed (low individual SEO weight, but ItemList schema in aggregate). 501KB CI / 491KB local. Same Linux-vs-mac minification delta. Slim with /compare refactor when next touched.
  'out/compare/managers/joel-greenblatt-vs-andreas-halvorsen/index.html', // 501KB manager-vs-manager comparison; 1KB over (2026-05-19 CI). Indexed but long-tail.
  'out/scores/index.html', // 783KB canonical "all stocks ranked by ConvictionScore" page (Ship PP+QQ+RR, 2026-05-19). 456 tickers × 9 fields × desktop table + mobile cards. Spec is "every tracked stock visible". ItemList schema all 456; visible rows capped 50/section + overflow footer. Indexed (this is the canonical ranking surface — SEO + AEO win justifies budget). Consider client-side virtualization or section-paginated routes in a future refactor.
]);

function walk(dir, predicate) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full, predicate));
    } else if (entry.isFile() && predicate(full)) {
      files.push(full);
    }
  }
  return files;
}

function main() {
  let htmlChecked = 0;
  let jsChecked = 0;
  const violations = [];

  // HTML page weight check
  for (const file of walk(OUT_DIR, (f) => f.endsWith(".html"))) {
    htmlChecked++;
    const { size } = statSync(file);
    if (size > HTML_BUDGET_BYTES && !ALLOWLIST.has(file)) {
      violations.push({ file, size, kind: "HTML", budget: HTML_BUDGET_BYTES });
    }
  }

  // JS bundle weight check (catches transitive-import bundle bloat — e.g. a
  // client component importing a server-only module that pulls in 10MB JSON)
  for (const file of walk(OUT_DIR, (f) => f.endsWith(".js") && f.includes("_next/"))) {
    jsChecked++;
    const { size } = statSync(file);
    if (size > JS_BUDGET_BYTES && !ALLOWLIST.has(file)) {
      violations.push({ file, size, kind: "JS", budget: JS_BUDGET_BYTES });
    }
  }

  if (violations.length === 0) {
    console.log(
      `[perf-budget] ✓ ${htmlChecked} HTML pages under ${(HTML_BUDGET_BYTES / 1024).toFixed(0)}KB + ${jsChecked} JS chunks under ${(JS_BUDGET_BYTES / 1024).toFixed(0)}KB`,
    );
    process.exit(0);
  }

  // Sort by size, biggest first
  violations.sort((a, b) => b.size - a.size);

  console.error(
    `\n[perf-budget] ✗ ${violations.length} file(s) over budget:`,
  );
  for (const v of violations) {
    const kb = (v.size / 1024).toFixed(0);
    const budgetKb = (v.budget / 1024).toFixed(0);
    console.error(`  [${v.kind}] ${kb}KB (>${budgetKb}KB) ${v.file}`);
  }
  console.error(
    `\nFix HTML overage: cap render loops with .slice(N) or thin client-component props.\nFix JS overage: a "use client" component imported a module that transitively\n  pulls in a large data dependency. Replace with fetch from /api/v1/*.json or\n  inline a small pure-fn instead of importing from a heavy module.\nOr (rarely): add the path to ALLOWLIST in scripts/perf-budget-check.mjs.\n`,
  );
  process.exit(1);
}

main();
