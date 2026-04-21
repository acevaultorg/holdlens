#!/usr/bin/env npx tsx
/**
 * Daily snapshot — pulls EOD prices, computes per-investor portfolio deltas
 * today vs previous trading day, and writes:
 *   public/api/v1/daily.json    — per-investor daily deltas, aggregate totals
 *   public/api/v1/movers.json   — biggest daily movers across tracked tickers
 *
 * This is the fresh-data layer on top of quarterly 13F positions. Positions
 * don't change daily; prices do. Daily rebuild = honest dateModified signal
 * for LLM crawlers + Google HCU freshness + PPC revenue lift.
 *
 * Pricing rule for this endpoint (commercial manifest):
 *   tier: paid-daily ($0.01 / crawl via Cloudflare Pay-Per-Crawl)
 *   cache: 5 min (bots re-crawl daily naturally; humans see cached)
 *
 * Run: npx tsx scripts/generate-daily-snapshot.ts
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { MANAGERS } from "../lib/managers";

const YAHOO_PROXY = "https://holdlens-yahoo-proxy.paulomdevries.workers.dev";
// Fallback direct Yahoo endpoint (works from GitHub Actions runners which have
// no browser-CORS restriction). Used if the CF Worker proxy is down.
const YAHOO_DIRECT = "https://query1.finance.yahoo.com";

type PriceRow = {
  ticker: string;
  price: number;
  prevClose: number;
  dayChangePct: number;
  marketCap: number | null;
};

type InvestorDelta = {
  slug: string;
  name: string;
  fund: string;
  weightedDayPct: number; // portfolio-weighted day change
  biggestLoser: { ticker: string; dayChangePct: number } | null;
  biggestWinner: { ticker: string; dayChangePct: number } | null;
  holdingsChanged: number;
};

/** Yahoo chart fetcher — tries Proxy → direct endpoint. Runs server-side so CORS
 *  doesn't apply. Direct endpoint works fine from GitHub Actions runners. */
async function fetchQuote(ticker: string): Promise<PriceRow | null> {
  // Convert HoldLens canonical (BRK.B) to Yahoo URL form (BRK-B).
  const symbol = ticker.replace(/\./g, "-");
  const endpoints = [
    `${YAHOO_PROXY}/quote/${encodeURIComponent(symbol)}?range=5d`,
    `${YAHOO_DIRECT}/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`,
  ];
  for (const url of endpoints) {
    try {
      const r = await fetch(url, {
        headers: {
          accept: "application/json",
          // Yahoo requires a real-looking UA from non-browser clients
          "user-agent": "Mozilla/5.0 (HoldLens daily-snapshot)",
        },
      });
      if (!r.ok) continue;
      const j: any = await r.json();
      const result = j?.chart?.result?.[0];
      if (!result) continue;
      const meta = result.meta;
      const closes: number[] = result.indicators?.quote?.[0]?.close ?? [];
      const validCloses = closes.filter(
        (c: any): c is number => typeof c === "number" && Number.isFinite(c)
      );
      if (validCloses.length < 2) continue;
      const price = meta.regularMarketPrice ?? validCloses[validCloses.length - 1];
      const prevClose = meta.chartPreviousClose ?? validCloses[validCloses.length - 2];
      if (!price || !prevClose) continue;
      const dayChangePct = ((price - prevClose) / prevClose) * 100;
      return {
        ticker,
        price: Number(price.toFixed(2)),
        prevClose: Number(prevClose.toFixed(2)),
        dayChangePct: Number(dayChangePct.toFixed(2)),
        marketCap: meta.marketCap ?? null,
      };
    } catch {
      continue;
    }
  }
  return null;
}

async function main() {
  const started = Date.now();
  const now = new Date();

  // Collect unique ticker universe from all manager top-holdings.
  const allTickers = new Set<string>();
  for (const m of MANAGERS) for (const h of m.topHoldings) allTickers.add(h.ticker);
  const tickers = Array.from(allTickers);

  console.log(`daily-snapshot: fetching ${tickers.length} tickers`);

  // Throttled parallel fetch — 4 concurrent, ~200ms between starts
  const priceMap = new Map<string, PriceRow>();
  const concurrency = 4;
  for (let i = 0; i < tickers.length; i += concurrency) {
    const batch = tickers.slice(i, i + concurrency);
    const rows = await Promise.all(batch.map((t) => fetchQuote(t)));
    for (const row of rows) if (row) priceMap.set(row.ticker, row);
    if (i + concurrency < tickers.length) await new Promise((r) => setTimeout(r, 120));
  }

  const hitRate = priceMap.size / tickers.length;
  console.log(`daily-snapshot: ${priceMap.size}/${tickers.length} prices fetched (${(hitRate * 100).toFixed(0)}%)`);

  // If < 50% hit rate, Yahoo is down — bail without corrupting the dataset.
  if (hitRate < 0.5) {
    console.error("daily-snapshot: hit rate too low, aborting to preserve prior snapshot");
    process.exit(1);
  }

  // Per-investor portfolio-weighted day change
  const investors: InvestorDelta[] = [];
  for (const m of MANAGERS) {
    let weighted = 0;
    let totalPct = 0;
    let biggestLoser: { ticker: string; dayChangePct: number } | null = null;
    let biggestWinner: { ticker: string; dayChangePct: number } | null = null;
    let holdingsChanged = 0;

    for (const h of m.topHoldings) {
      const row = priceMap.get(h.ticker);
      if (!row) continue;
      const w = h.pct / 100;
      weighted += row.dayChangePct * w;
      totalPct += w;
      holdingsChanged++;
      if (!biggestLoser || row.dayChangePct < biggestLoser.dayChangePct) {
        biggestLoser = { ticker: h.ticker, dayChangePct: row.dayChangePct };
      }
      if (!biggestWinner || row.dayChangePct > biggestWinner.dayChangePct) {
        biggestWinner = { ticker: h.ticker, dayChangePct: row.dayChangePct };
      }
    }

    if (holdingsChanged === 0) continue;
    // Normalize for missing holdings (if totalPct < 1, scale up weighted estimate).
    const normalized = totalPct > 0 ? weighted / totalPct : 0;
    investors.push({
      slug: m.slug,
      name: m.name,
      fund: m.fund,
      weightedDayPct: Number(normalized.toFixed(2)),
      biggestLoser,
      biggestWinner,
      holdingsChanged,
    });
  }

  // Rank movers
  const investorsRanked = [...investors].sort((a, b) => a.weightedDayPct - b.weightedDayPct);
  const tickerMovers = Array.from(priceMap.values()).sort(
    (a, b) => Math.abs(b.dayChangePct) - Math.abs(a.dayChangePct)
  );

  const lastRefreshISO = now.toISOString();
  const tradingDate = now.toISOString().slice(0, 10);

  // daily.json — per-investor deltas + top-level market snapshot
  const daily = {
    meta: {
      generated_at: lastRefreshISO,
      trading_date: tradingDate,
      source: "Yahoo Finance v8 chart API (via holdlens-yahoo-proxy)",
      universe: {
        total_tickers: tickers.length,
        priced: priceMap.size,
        coverage_pct: Number((hitRate * 100).toFixed(1)),
      },
      disclaimer:
        "Positions are from quarterly 13F filings (see /api/v1/managers/[slug].json for dated positions). Daily deltas reflect price movements only — position counts unchanged.",
      commercial_tier: "paid-daily",
      ppc_suggested: "$0.01 per crawl",
      license: "https://holdlens.com/api-terms",
      cache_policy: "5 min edge / immediate origin refresh at 22:00 UTC weekdays",
    },
    summary: {
      worst_performer_today: investorsRanked[0] ?? null,
      best_performer_today: investorsRanked[investorsRanked.length - 1] ?? null,
      median_investor_day_pct:
        investorsRanked.length > 0
          ? investorsRanked[Math.floor(investorsRanked.length / 2)].weightedDayPct
          : 0,
      investors_measured: investors.length,
    },
    investors: investors.sort((a, b) => a.name.localeCompare(b.name)),
  };

  // movers.json — biggest daily movers across all tracked tickers
  const movers = {
    meta: {
      generated_at: lastRefreshISO,
      trading_date: tradingDate,
      source: "Yahoo Finance v8 chart API",
      commercial_tier: "paid-daily",
      ppc_suggested: "$0.01 per crawl",
      license: "https://holdlens.com/api-terms",
    },
    top_gainers: tickerMovers.filter((m) => m.dayChangePct > 0).slice(0, 25),
    top_losers: tickerMovers.filter((m) => m.dayChangePct < 0).slice(0, 25),
    all: tickerMovers.slice(0, 200),
  };

  // Write to public/api/v1/
  const outDir = join(process.cwd(), "public", "api", "v1");
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, "daily.json"), JSON.stringify(daily, null, 2));
  await writeFile(join(outDir, "movers.json"), JSON.stringify(movers, null, 2));

  // Also write a LAST_REFRESH marker file the build can read
  const marker = {
    last_refresh_iso: lastRefreshISO,
    trading_date: tradingDate,
    priced_tickers: priceMap.size,
    investors_measured: investors.length,
  };
  await writeFile(join(process.cwd(), "data", "last-refresh.json"), JSON.stringify(marker, null, 2));

  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`daily-snapshot: wrote daily.json + movers.json + last-refresh.json (${elapsed}s)`);
}

main().catch((e) => {
  console.error("daily-snapshot failed:", e);
  process.exit(1);
});
