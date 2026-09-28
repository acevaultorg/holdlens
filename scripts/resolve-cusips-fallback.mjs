#!/usr/bin/env node
// Second pass for CUSIPs that resolve-cusips-openfigi.mjs cached as null.
//
// Why: that pass asks OpenFIGI with exchCode "US" (the US composite line). For
// some large issuers OpenFIGI has no composite line at all and answers
// "No identifier found" (measured 2026-09-28: 30231G102 Exxon, 143658300
// Carnival), although it does list the security on individual US exchanges.
// This pass:
//   1. marks debt-coded CUSIPs (letters in issue chars 7-8, e.g. convertibles)
//      as { debt: true } - they have no quote and must never be looked up;
//   2. re-asks OpenFIGI WITHOUT exchCode and takes a clean ticker listed on a
//      US exchange (exchCode U*);
//   3. falls back to an exact normalized-name match in SEC company_tickers.json
//      (only when the name maps to exactly one ticker).
// Anything left stays null: the page shows no live quote rather than a guess.
// A control set must resolve, or the script refuses to write.
import { readFileSync, writeFileSync } from "node:fs";

const DATA = new URL("../data/", import.meta.url);
const CACHE = new URL("cusip-ticker-figi.json", DATA);
const cache = JSON.parse(readFileSync(CACHE));
const CONTROLS = { "30231G102": "XOM" }; // Exxon: no US composite line in OpenFIGI
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const CLEAN = /^[A-Z]{1,5}([./][A-Z]{1,2})?$/;
const isDebt = (c) => /[A-Z]/.test(c.slice(6, 8));

const nulls = Object.keys(cache).filter((c) => cache[c] === null);
let debt = 0;
for (const c of nulls) if (isDebt(c)) { cache[c] = { debt: true }; debt++; }
const todo = [...new Set([...nulls.filter((c) => !isDebt(c)), ...Object.keys(CONTROLS)])];
console.log(`null: ${nulls.length} · debt-coded: ${debt} · equity to retry: ${todo.length}`);

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

function pickUS(data) {
  const us = (data || []).filter((d) => /^U/.test(d.exchCode || "") && CLEAN.test(d.ticker || ""));
  const tickers = [...new Set(us.map((d) => d.ticker))];
  if (tickers.length !== 1) return null; // none, or ambiguous
  const d = us[0];
  return { ticker: tickers[0], name: d.name, type: d.securityType2 || d.securityType || null, via: "figi-us-exchange" };
}

const found = {};
for (let i = 0; i < todo.length; i += 10) {
  const batch = todo.slice(i, i + 10);
  const out = await post(batch.map((c) => ({ idType: /^[A-Z]/.test(c) ? "ID_CINS" : "ID_CUSIP", idValue: c })));
  if (!Array.isArray(out) || out.length !== batch.length) throw new Error(`unexpected response shape: ${JSON.stringify(out).slice(0, 200)}`);
  batch.forEach((c, j) => { found[c] = { hit: pickUS(out[j].data), name: out[j].data?.[0]?.name || null }; });
  await sleep(2600);
}

// SEC name fallback: exact match after normalization, unique ticker only.
const norm = (s) => (s || "").toUpperCase().replace(/[.,&']/g, " ").replace(/\b(INC|CORP|CORPORATION|CO|LTD|PLC|THE|COM)\b/g, " ").replace(/\s+/g, " ").trim();
const sec = await (await fetch("https://www.sec.gov/files/company_tickers.json", { headers: { "User-Agent": "HoldLens research contact@holdlens.com" } })).json();
const byName = new Map();
for (const r of Object.values(sec)) {
  const k = norm(r.title);
  if (!byName.has(k)) byName.set(k, new Set());
  byName.get(k).add(r.ticker);
}


// A candidate is kept only if the live quote proxy knows the symbol, it traded
// in the last 30 days, it is not a note/bond line, and its long name starts with
// the same 5 letters as the 13F issuer name. Guards against name-match collisions
// (e.g. "Meridian Holdings" -> Meridian Corp) and note tickers (SWKHL).
const PROXY = "https://holdlens-yahoo-proxy.paulomdevries.workers.dev/quote/";
// First 5 letters with spaces removed: "ExxonMobil Holdings" and "EXXON MOBIL CORP" agree.
const firstWord = (s) => (s || "").toUpperCase().replace(/^THE\s+/, "").replace(/[^A-Z0-9]/g, "").slice(0, 5);
const rejected = [];
async function quoteMatches(ticker, name) {
  try {
    const r = await fetch(PROXY + encodeURIComponent(ticker.replace(/[./]/g, "-")) + "?range=5d");
    if (!r.ok) return false;
    const m = (await r.json())?.chart?.result?.[0]?.meta;
    if (!m) return false;
    const ln = m.longName || m.shortName || "";
    if (/\b(NOTES?|SENIOR|DEBENTURES?)\b|%/i.test(ln)) return false;
    if (!m.regularMarketTime || Date.now() / 1000 - m.regularMarketTime > 30 * 86400) return false;
    return firstWord(ln) === firstWord(name);
  } catch { return false; }
}

let viaFigi = 0, viaSec = 0, still = 0;
for (const c of todo) {
  const f = found[c];
  let v = f?.hit || null;
  if (v) viaFigi++;
  else if (f?.name) {
    const t = byName.get(norm(f.name));
    if (t?.size === 1 && CLEAN.test([...t][0].replace("-", "."))) { v = { ticker: [...t][0].replace("-", "."), name: f.name, type: null, via: "sec-name" }; viaSec++; }
  }
  if (v && !(await quoteMatches(v.ticker, v.name))) { rejected.push(`${c} ${v.ticker} (${v.name})`); v = null; }
  if (!v) still++;
  if (cache[c] === null) cache[c] = v; // never overwrite a primary-pass answer
}
if (rejected.length) console.log(`rejected by live-quote check (${rejected.length}): ${rejected.join("; ")}`);

for (const [c, t] of Object.entries(CONTROLS)) {
  const got = cache[c]?.ticker;
  if (got !== t) { console.error(`CONTROL FAILED: ${c} expected ${t}, got ${got}. Not writing.`); process.exit(1); }
}
writeFileSync(CACHE, JSON.stringify(Object.fromEntries(Object.entries(cache).sort()), null, 0) + "\n");
console.log(`control ok · resolved via OpenFIGI US exchange: ${viaFigi} · via SEC name: ${viaSec} · still unresolved: ${still}`);
