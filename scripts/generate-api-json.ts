/**
 * Pre-build script: generate static JSON API under public/api/v1/*.json.
 *
 * Usage: npx tsx scripts/generate-api-json.ts
 *
 * Why: HoldLens is statically exported. Dynamic route handlers are not
 * supported by `output: 'export'`. Writing JSON to public/ at prebuild
 * gives us a zero-runtime, CDN-edge-cached public JSON API that beats
 * Dataroma — they have NO API of any kind.
 *
 * Generated endpoints (all FREE, no auth):
 *   /api/v1/index.json                    — catalog of all endpoints
 *   /api/v1/scores.json                   — all tickers ranked by score
 *   /api/v1/scores/[ticker].json          — per-ticker full breakdown
 *   /api/v1/signals/buys.json             — buy signals sorted desc
 *   /api/v1/signals/sells.json            — sell signals sorted asc
 *   /api/v1/managers.json                 — all 30 tracked managers
 *   /api/v1/managers/[slug].json          — per-manager holdings + moves
 *   /api/v1/big-bets.json                 — conviction × size top 100
 *   /api/v1/rotation.json                 — 8Q × 12 sector heatmap
 *   /api/v1/best-now.json                 — top 50 buy candidates
 *   /api/v1/value.json                    — smart money × 52w low combo
 *   /api/v1/quarters.json                 — available 13F quarters
 *
 * All responses are a thin envelope: { data, meta }.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { TICKER_INDEX } from "../lib/tickers";
import { SECTOR_MAP } from "../lib/tickers";
import { MANAGERS } from "../lib/managers";
import { MANAGER_QUALITY } from "../lib/signals";
import { getConviction, convictionLabel, formatSignedScore } from "../lib/conviction";
import { getAllMovesEnriched, QUARTERS, QUARTER_LABELS, LATEST_QUARTER } from "../lib/moves";
import { getManagerROI } from "../lib/manager-roi";

const OUT_ROOT = join(process.cwd(), "public", "api", "v1");
const GENERATED_AT = new Date().toISOString();

async function writeJson(relPath: string, data: unknown): Promise<void> {
  const full = join(OUT_ROOT, relPath);
  const dir = full.substring(0, full.lastIndexOf("/"));
  await mkdir(dir, { recursive: true });
  await writeFile(full, JSON.stringify(data, null, 2), "utf-8");
}

function meta(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    generated_at: GENERATED_AT,
    quarter: LATEST_QUARTER,
    quarter_label: QUARTER_LABELS[LATEST_QUARTER],
    source: "HoldLens",
    license: "Free for personal and commercial use. Attribution appreciated.",
    docs: "https://holdlens.com/docs",
    ...extra,
  };
}

async function main(): Promise<void> {
  console.log("Generating JSON API under public/api/v1/ ...");

  // ---------- /scores.json ----------
  const allTickers = Object.keys(TICKER_INDEX);
  const scores = allTickers.map((ticker) => {
    const t = TICKER_INDEX[ticker];
    const c = getConviction(ticker);
    return {
      ticker,
      name: t.name,
      sector: SECTOR_MAP[ticker] ?? "Other",
      score: c.score,
      direction: c.direction,
      label: convictionLabel(c.score).label,
      buyer_count: c.buyerCount,
      seller_count: c.sellerCount,
      owner_count: t.ownerCount,
    };
  });
  scores.sort((a, b) => b.score - a.score);
  await writeJson("scores.json", { data: scores, meta: meta({ count: scores.length }) });

  // ---------- /scores/[ticker].json ----------
  for (const ticker of allTickers) {
    const t = TICKER_INDEX[ticker];
    const c = getConviction(ticker);
    await writeJson(`scores/${ticker}.json`, {
      data: {
        ticker,
        name: t.name,
        sector: SECTOR_MAP[ticker] ?? "Other",
        score: c.score,
        formatted_score: formatSignedScore(c.score),
        direction: c.direction,
        label: convictionLabel(c.score).label,
        buyer_count: c.buyerCount,
        seller_count: c.sellerCount,
        owner_count: t.ownerCount,
        breakdown: c.breakdown,
      },
      meta: meta(),
    });
  }

  // ---------- /signals/buys.json and /signals/sells.json ----------
  const buys = scores.filter((s) => s.direction === "BUY").slice(0, 100);
  const sells = [...scores].filter((s) => s.direction === "SELL").sort((a, b) => a.score - b.score).slice(0, 100);
  await writeJson("signals/buys.json", { data: buys, meta: meta({ count: buys.length }) });
  await writeJson("signals/sells.json", { data: sells, meta: meta({ count: sells.length }) });

  // ---------- /managers.json ----------
  const managers = MANAGERS.map((m) => {
    const roi = getManagerROI(m.slug);
    return {
      slug: m.slug,
      name: m.name,
      fund: m.fund,
      role: m.role,
      started_tracking: m.startedTracking,
      quality_score: MANAGER_QUALITY[m.slug] ?? 6,
      cagr_10y: roi?.cagr10y ?? null,
      holding_count: m.topHoldings.length,
      top_holding: m.topHoldings[0]?.ticker ?? null,
      top_holding_pct: m.topHoldings[0]?.pct ?? null,
      profile_url: `https://holdlens.com/investor/${m.slug}`,
    };
  });
  await writeJson("managers.json", { data: managers, meta: meta({ count: managers.length }) });

  // ---------- /managers/[slug].json ----------
  const movesAll = getAllMovesEnriched();
  for (const m of MANAGERS) {
    const roi = getManagerROI(m.slug);
    const moves = movesAll
      .filter((mv) => mv.managerSlug === m.slug)
      .map((mv) => ({
        quarter: mv.quarter,
        ticker: mv.ticker,
        action: mv.action,
        delta_pct: mv.deltaPct ?? null,
        portfolio_impact_pct: mv.portfolioImpactPct ?? null,
      }));
    await writeJson(`managers/${m.slug}.json`, {
      data: {
        slug: m.slug,
        name: m.name,
        fund: m.fund,
        role: m.role,
        philosophy: m.philosophy,
        bio: m.bio,
        longest_holding: m.longestHolding,
        quality_score: MANAGER_QUALITY[m.slug] ?? 6,
        cagr_10y: roi?.cagr10y ?? null,
        holdings: m.topHoldings.map((h) => ({
          ticker: h.ticker,
          name: h.name,
          pct: h.pct,
          shares_mn: h.sharesMn,
          thesis: h.thesis,
        })),
        recent_moves: moves.slice(0, 50),
      },
      meta: meta(),
    });
  }

  // ---------- /big-bets.json ----------
  type BigBet = {
    rank: number;
    manager: string;
    manager_slug: string;
    fund: string;
    ticker: string;
    name: string;
    position_pct: number;
    conviction_score: number;
    combined_score: number;
  };
  const bigBets: Omit<BigBet, "rank">[] = [];
  for (const m of MANAGERS) {
    for (const h of m.topHoldings) {
      if (h.name.toLowerCase().includes("(own)")) continue;
      const conv = getConviction(h.ticker);
      const combined = h.pct * Math.max(0, conv.score);
      if (combined > 0) {
        bigBets.push({
          manager: m.name,
          manager_slug: m.slug,
          fund: m.fund,
          ticker: h.ticker,
          name: h.name,
          position_pct: h.pct,
          conviction_score: conv.score,
          combined_score: Math.round(combined * 10) / 10,
        });
      }
    }
  }
  bigBets.sort((a, b) => b.combined_score - a.combined_score);
  const bigBetsRanked: BigBet[] = bigBets.slice(0, 100).map((b, i) => ({ rank: i + 1, ...b }));
  await writeJson("big-bets.json", { data: bigBetsRanked, meta: meta({ count: bigBetsRanked.length }) });

  // ---------- /rotation.json ----------
  type RotationRow = { sector: string; quarters: Record<string, { net: number; buys: number; sells: number }> };
  const sectorSet = new Set<string>(Object.values(SECTOR_MAP));
  sectorSet.add("Other");
  const sectorOrder = Array.from(sectorSet).sort();
  const rotationRows: RotationRow[] = [];
  const moves = getAllMovesEnriched();
  for (const sector of sectorOrder) {
    const row: RotationRow = { sector, quarters: {} };
    for (const q of QUARTERS) {
      const qmoves = moves.filter((mv) => (SECTOR_MAP[mv.ticker] ?? "Other") === sector && mv.quarter === q);
      let net = 0,
        buys = 0,
        sells = 0;
      for (const mv of qmoves) {
        const impact = mv.portfolioImpactPct ?? 2;
        const factor = Math.max(0.5, Math.min(3, impact / 2));
        const isBuy = mv.action === "new" || mv.action === "add";
        const isSell = mv.action === "trim" || mv.action === "exit";
        if (isBuy) {
          net += factor;
          buys += 1;
        }
        if (isSell) {
          net -= factor;
          sells += 1;
        }
      }
      row.quarters[q] = { net: Math.round(net * 10) / 10, buys, sells };
    }
    rotationRows.push(row);
  }
  await writeJson("rotation.json", {
    data: rotationRows,
    meta: meta({ quarters: QUARTERS, sectors: sectorOrder.length }),
  });

  // ---------- /best-now.json ----------
  const bestNow = [...scores].filter((s) => s.direction === "BUY").slice(0, 50);
  await writeJson("best-now.json", { data: bestNow, meta: meta({ count: bestNow.length }) });

  // ---------- /value.json — smart money buys that are also near 52w low ----------
  // Data-faithful: we don't have live 52w-low here at build time, so we
  // surface the top 50 buy signals and let the live /value page do the
  // price overlay client-side. Consumers can combine with their own price feed.
  const valueRows = [...scores].filter((s) => s.direction === "BUY").slice(0, 50);
  await writeJson("value.json", { data: valueRows, meta: meta({ note: "Combine with a live 52w-range feed client-side." }) });

  // ---------- /quarters.json ----------
  await writeJson("quarters.json", {
    data: QUARTERS.map((q) => ({ quarter: q, label: QUARTER_LABELS[q] })),
    meta: meta({ count: QUARTERS.length }),
  });

  // ---------- /index.json ----------
  const catalog = {
    name: "HoldLens Public JSON API",
    version: "v1",
    base_url: "https://holdlens.com/api/v1",
    auth: "None — public, free, rate-limited at the CDN edge",
    quarter: LATEST_QUARTER,
    endpoints: [
      { path: "/index.json", desc: "This catalog" },
      { path: "/scores.json", desc: `All ${scores.length} tickers ranked by ConvictionScore` },
      { path: "/scores/{ticker}.json", desc: "Single ticker with full breakdown" },
      { path: "/signals/buys.json", desc: "Top 100 buy signals sorted desc" },
      { path: "/signals/sells.json", desc: "Top 100 sell signals sorted asc" },
      { path: "/managers.json", desc: "All 30 tracked superinvestors" },
      { path: "/managers/{slug}.json", desc: "Single manager with holdings + recent moves" },
      { path: "/big-bets.json", desc: "Top 100 conviction × position-size ranked bets" },
      { path: "/rotation.json", desc: "8Q × 12-sector signed net-flow heatmap" },
      { path: "/best-now.json", desc: "Top 50 buy candidates" },
      { path: "/value.json", desc: "Top 50 smart-money buy signals for value overlays" },
      { path: "/quarters.json", desc: "Available 13F quarters" },
    ],
    meta: meta(),
  };
  await writeJson("index.json", catalog);

  // Count total files written
  let fileCount = 1 /* index */ + 1 /* scores */ + allTickers.length;
  fileCount += 2 /* buys/sells */ + 1 /* managers */ + MANAGERS.length;
  fileCount += 1 /* big-bets */ + 1 /* rotation */ + 1 /* best-now */ + 1 /* value */ + 1 /* quarters */;
  console.log(`  Wrote ${fileCount} JSON files under public/api/v1/`);
}

main().catch((err) => {
  console.error("generate-api-json failed:", err);
  process.exit(1);
});
