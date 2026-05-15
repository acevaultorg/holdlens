#!/usr/bin/env node

/**
 * wayback-archive.mjs — submit priority /learn pages + brand-essential URLs
 * to the Internet Archive (Wayback Machine) on every production deploy.
 *
 * Why: Wikipedia editors strongly prefer external links that have a Wayback
 * snapshot. The IA `{{cite web|archive-url=...}}` parameter is standard.
 * Pre-archiving establishes the citation trail BEFORE Wikipedia editors
 * encounter the link, raising landing-rate + revert-resistance.
 *
 * Non-blocking: failures (IA rate limits, transient 503s) log but do not
 * fail the postbuild. The script is fire-and-forget signal, not a hard gate.
 *
 * Tier: ships in postbuild AFTER prune-sitemap (so the URL list reflects
 * the current live sitemap), BEFORE perf-budget-check (which is the final
 * deploy gate).
 *
 * Rate: IA's save endpoint accepts ~5 req/min/IP before back-pressure.
 * We pace at 1 req per 12s for the priority list (~30 URLs × 12s = 6min).
 *
 * Idempotent: re-running on the same content produces a fresh snapshot
 * tagged with the new datetime, which is the desired behavior — every
 * deploy gets its own provenance-stamped archive.
 */

import { setTimeout as sleep } from "node:timers/promises";

const BASE = "https://holdlens.com";
const PACE_MS = 12_000; // 12s between requests = ~5/min, IA's soft cap

// Priority URLs — trust + brand + the /learn pages most likely to attract
// Wikipedia citation. Mirrors the curated sitemap-ai.xml subset.
const PRIORITY_URLS = [
  // Trust + identity
  "/",
  "/about",
  "/methodology",
  "/partners",
  "/contact",
  // Brand-distinct synthesis
  "/learn/conviction-score-explained",
  "/learn/insider-score-explained",
  "/learn/event-score-explained",
  "/learn/sec-signals-trilogy",
  // High-LLM-question /learn explainers
  "/learn/what-is-a-13f",
  "/learn/13f-vs-13d-vs-13g",
  "/learn/how-to-read-a-13f",
  "/learn/45-day-lag-explained",
  "/learn/form-4-vs-13f",
  "/learn/13d-vs-13g-activist-filings",
  "/learn/survivorship-bias-in-hedge-funds",
  "/learn/do-hedge-fund-signals-work",
  "/learn/copy-trading-myth",
  "/learn/superinvestor-handbook",
  "/learn/warren-buffett-method",
  "/learn/what-is-alpha",
  "/learn/etf-overlap-explained",
  "/learn/buybacks-vs-dividends",
  "/learn/how-to-read-buyback-disclosures",
  "/learn/short-interest-explained",
  "/learn/congressional-stock-trading-stock-act",
];

const SKIP = process.env.SKIP_WAYBACK === "1" || process.env.CI_FAST === "1";

async function submitOne(path) {
  const target = `${BASE}${path}`;
  const saveUrl = `https://web.archive.org/save/${target}`;
  try {
    const ctl = AbortSignal.timeout(20_000);
    const res = await fetch(saveUrl, {
      method: "GET",
      headers: {
        "User-Agent": "HoldLens-Postbuild-Archive/1.0 (+https://holdlens.com)",
        Accept: "text/html",
      },
      signal: ctl,
      redirect: "manual",
    });
    // IA returns 200 (snapshot complete), 302 (redirect to result), or 429 (rate-limited)
    if (res.status === 200 || res.status === 302) {
      console.log(`  ✓ archived ${path}`);
      return { path, status: "ok", http: res.status };
    } else if (res.status === 429) {
      console.log(`  ⏸ rate-limited ${path}; will be archived next deploy`);
      return { path, status: "rate-limited", http: res.status };
    } else {
      console.log(`  ⚠ ${path} → HTTP ${res.status}`);
      return { path, status: "warn", http: res.status };
    }
  } catch (err) {
    console.log(`  ⚠ ${path} → ${err?.name || "error"}: ${(err?.message || "").slice(0, 60)}`);
    return { path, status: "error", err: String(err?.message || err) };
  }
}

async function main() {
  if (SKIP) {
    console.log("wayback-archive: SKIP_WAYBACK=1 or CI_FAST=1 — skipping");
    return;
  }
  console.log(
    `wayback-archive: submitting ${PRIORITY_URLS.length} priority URLs to Internet Archive ...`
  );
  const start = Date.now();
  const results = [];
  for (const path of PRIORITY_URLS) {
    const r = await submitOne(path);
    results.push(r);
    // Pace between requests to respect IA's soft cap
    if (path !== PRIORITY_URLS[PRIORITY_URLS.length - 1]) {
      await sleep(PACE_MS);
    }
  }
  const ok = results.filter((r) => r.status === "ok").length;
  const rl = results.filter((r) => r.status === "rate-limited").length;
  const warn = results.filter((r) => r.status === "warn" || r.status === "error").length;
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(
    `wayback-archive: ${ok} archived · ${rl} rate-limited · ${warn} warn/error · ${elapsed}s`
  );
}

main().catch((err) => {
  console.error("wayback-archive: unexpected fatal error (non-blocking):", err?.message || err);
  process.exit(0); // Non-blocking — never fail deploys on IA hiccups
});
