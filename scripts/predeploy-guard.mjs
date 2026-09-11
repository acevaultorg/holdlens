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
// Wire-up: invoked by postbuild and again inside scripts/deploy-cf.sh after its
// upload-set pruning, immediately before the chunked uploader. It is deliberately
// not an npm `predeploy` lifecycle hook: npm runs that hook before the deploy
// script has performed its fresh build. Pattern replicated from sourcescore-org.

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
  console.error("Or use `npm run deploy` which does clean → build → guard → chunked Cloudflare upload → IndexNow as one chain.");
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

// Compliance integrity check (AdSense review window hardening):
// Verify Pivot A holds — no verdict labels in any user-facing surface.
// Extended 2026-05-29 to /sector + /insiders: a residual "Strong buy/sell signal"
// leak survived there because the guard previously scanned ONLY /signal. The
// pattern matches verdict phrasings ("STRONG BUY" also matches "strong buy
// signal" / "strong buys"); descriptive cohort labels ("Net accumulation",
// "strongly accumulated") are intentionally allowed.
import { readFileSync, readdirSync } from "node:fs";
const verdictPattern = /(STRONG BUY|STRONG SELL|WEAK BUY|WEAK SELL)/i;
for (const dir of ["signal", "sector", "insiders"]) {
  const scanDir = resolve(root, "out", dir);
  if (!existsSync(scanDir)) continue;
  const samples = readdirSync(scanDir)
    .filter((s) => existsSync(resolve(scanDir, s, "index.html")))
    .slice(0, 8);
  for (const s of samples) {
    const idx = resolve(scanDir, s, "index.html");
    const html = readFileSync(idx, "utf-8");
    if (verdictPattern.test(html)) {
      console.error(`❌ predeploy-guard: COMPLIANCE BREACH — verdict label found in out/${dir}/${s}/index.html`);
      console.error("This would surface to Google during the AdSense review window. Block deploy.");
      console.error("Investigate: did a recent commit reintroduce BUY/SELL/STRONG/WEAK verdict labels? (Pivot A / I-43)");
      process.exit(1);
    }
  }
}

// ── Analytics-tag guard (2026-09-10, fleet port of askedwell ab43f30) ─────────
// deploy-truth.md § "a detached worktree builds tracked code but drops UNTRACKED
// env files": a worktree/CI checkout without the gitignored env file builds a
// perfectly normal out/ whose <head> carries NO GA4 and NO Clarity, deploys with
// exit 0, and the tracker only notices days later. Measured 2026-09-10 on
// askedwell.com (deploy 080855fa shipped untagged). This block resolves each tag
// ID the way the layout does (process.env -> env files -> hardcoded fallback) and
// refuses to deploy unless the BUILT index.html carries every resolved ID.
import { readFileSync as __rfTag, existsSync as __exTag } from "node:fs";
import { resolve as __rsTag } from "node:path";
{
  const root = __rsTag(process.cwd());
  const ENV_FILES = [".env.production.local", ".env.local"];
  const TAGS = [["GA4", "NEXT_PUBLIC_GA4_ID", null], ["Clarity", "NEXT_PUBLIC_CLARITY_ID", null]]; // [name, envKey, fallback]
  const fileEnv = {};
  for (const f of ENV_FILES) {
    const p = __rsTag(root, f);
    if (!__exTag(p)) continue;
    for (const l of __rfTag(p, "utf8").split("\n")) {
      if (!/^[A-Z0-9_]+=/.test(l)) continue;
      const i = l.indexOf("=");
      const k = l.slice(0, i);
      if (!(k in fileEnv)) fileEnv[k] = l.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  const idx = __rsTag(root, "out/index.html");
  if (!__exTag(idx)) {
    console.error("❌ predeploy-guard: analytics check — out/index.html missing; run the build first.");
    process.exit(1);
  }
  const html = __rfTag(idx, "utf8");
  const missingEnv = ENV_FILES.filter((f) => !__exTag(__rsTag(root, f)));
  const lost = [];
  for (const [name, key, fallback] of TAGS) {
    const id = (process.env[key] || fileEnv[key] || fallback || "").trim();
    if (!id) {
      console.error(`❌ predeploy-guard: deploy blocked — ${name} ID unresolvable (${key} not in process.env, not in ${ENV_FILES.join(" / ")}, no fallback).`);
      if (missingEnv.length) console.error(`   Missing env file(s) in this checkout: ${missingEnv.join(", ")} — a detached worktree / fresh clone drops untracked env files.`);
      console.error(`   Fix: copy the env file from the main checkout, rebuild, retry. Never deploy an untagged site.`);
      process.exit(1);
    }
    if (!html.includes(id)) lost.push(`${name} ${key}=${id}`);
  }
  if (lost.length) {
    console.error("❌ predeploy-guard: deploy blocked — built out/index.html does not carry the analytics IDs the layout should emit:");
    for (const l of lost) console.error(`   - ${l}`);
    if (missingEnv.length) console.error(`   Missing env file(s) in this checkout: ${missingEnv.join(", ")} — the build ran without them.`);
    console.error("   Fix: ensure the env file is present, run the build again, retry deploy.");
    process.exit(1);
  }
  console.log(`✓ predeploy-guard: analytics tags present in out/index.html (${TAGS.map(([n, k, fb]) => n + "=" + (process.env[k] || fileEnv[k] || fb)).join(", ")})`);
}

console.log(`✓ predeploy-guard: out/ has all required artifacts (${required.length} checked, age ${ageHours.toFixed(1)}h, Pivot A compliance verified)`);
