#!/usr/bin/env node
// predeploy-guard — block deploy if generators haven't run.
//
// Cause this exists: 2026-05-12 fleet-wide root-cause investigation found that
// stale ad_hoc deploys can overwrite working CI deployments with out/ directories
// pre-dating generator runs. Result: production loses sitemap.xml / llms.txt /
// canonical-content artifacts. For HoldLens specifically, this is HIGH RISK
// during the AdSense review window (Google re-crawl during review must see the
// hardened Pivot A compliance state; a stale-deploy clobber would surface old
// verdict-labels + thin-content templates to the reviewer).
//
// Wire-up: invoked as predeploy + as part of CI deploy step + as a safety check
// in any future deploy automation. Pattern replicated from sourcescore-org.

import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const required = [
  "out/index.html",
  "out/sitemap.xml",
  "out/llms.txt",
  "out/robots.txt",
];

const missing = required.filter((p) => !existsSync(resolve(root, p)));

if (missing.length > 0) {
  console.error("❌ predeploy-guard: deploy blocked — out/ is missing generator artifacts:");
  for (const p of missing) console.error(`   - ${p}`);
  console.error("");
  console.error("Fix: run `npm run build` first (which runs prebuild + postbuild generators), then retry deploy.");
  console.error("Or use `npm run deploy` which does clean → build → wrangler → indexnow as one chain.");
  process.exit(1);
}

// Freshness check — out/ should be no more than 24h old to avoid stale deploys
const indexMtime = statSync(resolve(root, "out/index.html")).mtimeMs;
const ageHours = (Date.now() - indexMtime) / 3600_000;
if (ageHours > 24) {
  console.error(`⚠️  predeploy-guard: out/ is ${ageHours.toFixed(1)}h old — likely stale.`);
  console.error("Fix: run `npm run build` to refresh, then retry deploy.");
  process.exit(1);
}

// HoldLens-specific compliance integrity check (AdSense review window hardening):
// Verify Pivot A state holds — no verdict labels leaked into out/signal/ pages.
import { readFileSync, readdirSync } from "node:fs";
const signalDir = resolve(root, "out/signal");
if (existsSync(signalDir)) {
  const verdictPattern = /(STRONG BUY|STRONG SELL|WEAK BUY|WEAK SELL)/i;
  const sampleTickers = readdirSync(signalDir).slice(0, 5);
  for (const ticker of sampleTickers) {
    const idx = resolve(signalDir, ticker, "index.html");
    if (existsSync(idx)) {
      const html = readFileSync(idx, "utf-8");
      if (verdictPattern.test(html)) {
        console.error(`❌ predeploy-guard: COMPLIANCE BREACH — verdict label found in out/signal/${ticker}/index.html`);
        console.error("This would surface to Google during AdSense review window. Block deploy.");
        console.error("Investigate: did a recent commit reintroduce STRONG BUY/SELL/WEAK BUY/WEAK SELL labels?");
        process.exit(1);
      }
    }
  }
}

console.log(`✓ predeploy-guard: out/ has all required artifacts (${required.length} checked, age ${ageHours.toFixed(1)}h, Pivot A compliance verified)`);
