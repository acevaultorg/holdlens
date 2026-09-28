#!/usr/bin/env node
// Resolve every 13F CUSIP in data/edgar-holdings.json to its US-listed ticker via
// OpenFIGI (free, no key: 25 requests/min, 10 jobs per request) and cache the
// answer in data/cusip-ticker-figi.json. Incremental: cached CUSIPs are skipped,
// so the quarterly 13F refresh only asks for new ones.
//
// Why: the hand-written CUSIP_TO_TICKER map in fetch-edgar-13f.ts carried wrong
// entries (11135F101 Broadcom -> "BN" Brookfield, 78462F103 SPDR S&P 500 -> "SPG"
// Simon Property, 171340102 Church & Dwight -> "CHK", 46120E602 Intuitive
// Surgical -> "IONQ") and fell back to issuer-name words ("BLOCK", "HOME DEPOT")
// for everything it did not know. OpenFIGI is the authority; this cache wins.
//
// Cache value: { ticker, name, type } or null (OpenFIGI has no US listing).
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const DATA = new URL("../data/", import.meta.url);
const CACHE = new URL("cusip-ticker-figi.json", DATA);
const holdings = JSON.parse(readFileSync(new URL("edgar-holdings.json", DATA)));
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE)) : {};

const all = [...new Set(holdings.flatMap((f) => f.holdings.map((h) => h.cusip.toUpperCase())))].sort();
const todo = all.filter((c) => !(c in cache) && /^[0-9A-Z]{9}$/.test(c));
console.log(`cusips: ${all.length} · cached: ${all.length - todo.length} · to resolve: ${todo.length}`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const save = () => writeFileSync(CACHE, JSON.stringify(Object.fromEntries(Object.entries(cache).sort()), null, 0) + "\n");

// Prefer the primary US common/ADR line when OpenFIGI returns several.
function pick(data) {
  if (!data?.length) return null;
  const rank = (d) =>
    (d.exchCode === "US" ? 0 : 10) +
    (/Common Stock|ADR|REIT|ETP|Mutual Fund|Closed-End Fund|MLP/.test(d.securityType2 || d.securityType || "") ? 0 : 5);
  const best = [...data].sort((a, b) => rank(a) - rank(b))[0];
  return best.ticker ? { ticker: best.ticker, name: best.name, type: best.securityType2 || best.securityType || null } : null;
}

async function post(jobs) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch("https://api.openfigi.com/v3/mapping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobs),
    });
    if (res.status === 429) { await sleep(15000 * (attempt + 1)); continue; }
    if (!res.ok) throw new Error(`OpenFIGI HTTP ${res.status}`);
    return res.json();
  }
  throw new Error("OpenFIGI: rate-limited 6 times in a row");
}

let done = 0;
for (let i = 0; i < todo.length; i += 10) {
  const batch = todo.slice(i, i + 10);
  // Letter-first identifiers are CINS (non-US issuers listed in the US).
  const jobs = batch.map((c) => ({ idType: /^[A-Z]/.test(c) ? "ID_CINS" : "ID_CUSIP", idValue: c, exchCode: "US" }));
  const out = await post(jobs);
  if (!Array.isArray(out) || out.length !== batch.length) throw new Error(`unexpected response shape: ${JSON.stringify(out).slice(0, 200)}`);
  batch.forEach((c, j) => { cache[c] = out[j].error && !/No identifier found/.test(out[j].error) ? undefined : pick(out[j].data); });
  for (const c of batch) if (cache[c] === undefined) delete cache[c]; // transient error: retry next run
  done += batch.length;
  if ((i / 10) % 10 === 0) { save(); console.log(`  ${done}/${todo.length}`); }
  await sleep(2600); // 25 req/min without a key
}
save();
const vals = all.map((c) => cache[c]);
console.log(`resolved: ${vals.filter(Boolean).length} · no US listing: ${vals.filter((v) => v === null).length} · missing: ${vals.filter((v) => v === undefined).length}`);
