#!/usr/bin/env node
// Rewrite tickers in data/edgar-holdings.json and data/edgar-moves.json from the
// OpenFIGI cache (data/cusip-ticker-figi.json, built by resolve-cusips-openfigi.mjs).
// Idempotent. fetch-edgar-13f.ts already prefers the cache for new pulls; this
// repairs the data that was written before the cache existed.
//
// Holdings carry a CUSIP, so they remap directly (two rows that land on the same
// ticker in one filing are merged). Moves carry no CUSIP: each move is matched to
// the same manager's holding with the same old ticker in that quarter or the one
// before; failing that, an old ticker whose every CUSIP resolves to ONE new ticker
// is remapped globally. Anything ambiguous stays as it was and is counted.
import { readFileSync, writeFileSync } from "node:fs";

const DATA = new URL("../data/", import.meta.url);
const read = (f) => JSON.parse(readFileSync(new URL(f, DATA)));
const cache = read("cusip-ticker-figi.json");
const holdings = read("edgar-holdings.json");
const moves = read("edgar-moves.json");
const figi = (cusip) => cache[cusip.toUpperCase()]?.ticker?.replace("/", ".");

const prevQuarter = (q) => { const [y, n] = q.split("-Q").map(Number); return n === 1 ? `${y - 1}-Q4` : `${y}-Q${n - 1}`; };
const byMgrQ = new Map(); // `${slug}|${quarter}|${oldTicker}` -> newTicker
const globalMap = new Map(); // oldTicker -> Set(newTicker)
let rows = 0, changed = 0, merged = 0;

for (const f of holdings) {
  const out = new Map();
  for (const h of f.holdings) {
    rows++;
    const next = figi(h.cusip) ?? h.ticker;
    const old = h.ticker;
    byMgrQ.set(`${f.managerSlug}|${f.quarter}|${old}`, next);
    if (!globalMap.has(old)) globalMap.set(old, new Set());
    globalMap.get(old).add(next);
    if (next !== old) changed++;
    const prev = out.get(next);
    if (prev) {
      merged++;
      prev.shares += h.shares;
      prev.valueMn += h.valueMn;
      prev.pctPortfolio = Math.round((prev.pctPortfolio + h.pctPortfolio) * 10) / 10;
    } else out.set(next, { ...h, ticker: next });
  }
  f.holdings = [...out.values()].sort((a, b) => b.valueMn - a.valueMn);
  f.holdingCount = f.holdings.length;
}

let mChanged = 0, mAmbiguous = 0;
for (const m of moves) {
  const hit = byMgrQ.get(`${m.managerSlug}|${m.quarter}|${m.ticker}`) ?? byMgrQ.get(`${m.managerSlug}|${prevQuarter(m.quarter)}|${m.ticker}`);
  let next = hit;
  if (!next) {
    const g = globalMap.get(m.ticker);
    if (g?.size === 1) next = [...g][0];
    else if (g && g.size > 1) mAmbiguous++;
  }
  if (next && next !== m.ticker) { m.ticker = next; mChanged++; }
}

// Tickers that only ever sit on a debt-coded or unresolved CUSIP row are issuer-name
// words or an issuer's stock symbol attached to its notes ("FIVE9", "Q2", "KW"). A
// live quote for them is either a 404 or the wrong instrument, so lib/live.ts skips
// them. Only the short ones matter there: its shape guard already drops the rest.
const SHAPE = /^[A-Z0-9]{1,5}([.\-/][A-Z0-9]{1,3})?$/;
// Kept narrow on purpose: a ticker goes on the list only if it IS the issuer's name
// word (FIVE9 for "FIVE9 INC") and SEC does not list it as a symbol. That keeps real
// symbols quoted elsewhere on the site (TEVA on insider pages, KW on a manager page).
const secTickers = new Set(Object.values(read("sec-ticker-map.json")).map((v) => String(v.ticker).toUpperCase()));
const nameWord = (t, name) => (name || "").toUpperCase().replace(/[^A-Z0-9.& ]/g, " ").trim().startsWith(t);
const quoted = new Set(), unq = new Set();
for (const f of holdings) for (const h of f.holdings) {
  const t = h.ticker.toUpperCase();
  if (cache[h.cusip.toUpperCase()]?.ticker) quoted.add(t);
  else if (SHAPE.test(t) && nameWord(t, h.name) && !secTickers.has(t)) unq.add(t);
}
const unquotable = [...unq].filter((t) => !quoted.has(t)).sort();
writeFileSync(new URL("unquotable-tickers.json", DATA), JSON.stringify(unquotable) + "\n");
console.log(`unquotable short tickers: ${unquotable.length} -> data/unquotable-tickers.json`);

writeFileSync(new URL("edgar-holdings.json", DATA), JSON.stringify(holdings, null, 2) + "\n");
writeFileSync(new URL("edgar-moves.json", DATA), JSON.stringify(moves, null, 2) + "\n");
console.log(`holdings: ${rows} rows · ${changed} ticker changes · ${merged} merged into a sibling row`);
console.log(`moves: ${moves.length} rows · ${mChanged} ticker changes · ${mAmbiguous} left unchanged (ambiguous)`);
