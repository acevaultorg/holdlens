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
  // path → reason (none currently — keep this list short, intentional)
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
