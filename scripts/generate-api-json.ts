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
 *   /api/v1/sector/[slug].json            — per-sector tickers + top owners + 4Q flow
 *   /api/v1/alerts.json                   — high-impact moves (>5% portfolio shift), ranked
 *   /api/v1/consensus.json                — widely-held + bullish + net-buying tickers
 *   /api/v1/crowded.json                  — highest-ownership tickers with unwind signal
 *   /api/v1/contrarian.json               — tickers where ≥2 buy AND ≥2 sell, last 4Q
 *   /api/v1/concentration.json            — managers ranked by top-1/3/5 position weight
 *   /api/v1/exits.json                    — every "exit" action move, ranked by prior bet size
 *   /api/v1/overlap.json                  — manager pair overlap (shared holdings counts)
 *   /api/v1/best-now.json                 — top 50 buy candidates
 *   /api/v1/value.json                    — smart money × 52w low combo
 *   /api/v1/changelog.json               — top 200 moves this quarter ranked by portfolio impact
 *   /api/v1/quarters.json                 — available 13F quarters
 *
 * All responses are a thin envelope: { data, meta }.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { TICKER_INDEX, topTickers } from "../lib/tickers";
import { SECTOR_MAP } from "../lib/tickers";
import { MANAGERS } from "../lib/managers";
import { MANAGER_QUALITY } from "../lib/signals";
import { getConviction, convictionLabel, formatSignedScore } from "../lib/conviction";
import { getAllMovesEnriched, MERGED_MOVES, QUARTERS, QUARTER_LABELS, LATEST_QUARTER } from "../lib/moves";
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
    license: "Free for individual humans browsing with a real browser. Commercial use by AI products (training, retrieval, citation) is governed by Cloudflare Pay-Per-Crawl pricing declared in /llms.txt and https://holdlens.com/api-terms. Bulk programmatic access: enterprise tier, see https://holdlens.com/for-ai.",
    license_url: "https://holdlens.com/api-terms",
    docs: "https://holdlens.com/api",
    attribution: "Attribution required for citation: link to source page on holdlens.com.",
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

  // ---------- /sector/[slug].json — per-sector drilldown ----------
  // One file per sector. Each contains:
  //   - sector name + slug
  //   - aggregate stats (ticker count, total owners, avg conviction, recent net flow)
  //   - top tickers in sector ranked by ConvictionScore
  //   - top managers overweight in the sector (sum of their positionPct in this sector)
  //   - per-quarter flow (same shape as /rotation.json row, for deep-link consumers)
  //
  // Why this matters: /rotation.json gives you the heatmap view. /sector/[slug].json
  // gives the one-click drilldown — which tickers drive the sector signal and who's
  // the biggest holder. Completes the API rotation story Dataroma has no answer to.
  function slugifySector(s: string): string {
    return s.toLowerCase().replace(/\s+/g, "-");
  }
  const LAST_4Q = new Set<string>(QUARTERS.slice(0, 4));
  const sectorTickers = new Map<string, string[]>();
  for (const [sym, sec] of Object.entries(SECTOR_MAP)) {
    const arr = sectorTickers.get(sec) ?? [];
    arr.push(sym);
    sectorTickers.set(sec, arr);
  }
  // Pre-compute conviction once per ticker to avoid re-walking moves
  // inside the sector loop.
  const convBySym = new Map<string, ReturnType<typeof getConviction>>();
  for (const sym of Object.keys(TICKER_INDEX)) {
    convBySym.set(sym, getConviction(sym));
  }
  for (const sector of sectorOrder) {
    const syms = sectorTickers.get(sector) ?? [];
    if (syms.length === 0 && sector !== "Other") continue;

    // Tickers ranked by conviction
    type SectorTickerRow = {
      ticker: string;
      name: string;
      owner_count: number;
      conviction_score: number;
      direction: "BUY" | "SELL" | "NEUTRAL";
    };
    const rows: SectorTickerRow[] = [];
    for (const sym of syms) {
      const td = TICKER_INDEX[sym];
      if (!td) continue;
      const conv = convBySym.get(sym);
      rows.push({
        ticker: sym,
        name: td.name,
        owner_count: td.ownerCount ?? 0,
        conviction_score: conv?.score ?? 0,
        direction: conv?.direction ?? "NEUTRAL",
      });
    }
    rows.sort((a, b) => b.conviction_score - a.conviction_score);

    // Top managers overweight in sector — sum positionPct across all topHoldings
    // whose ticker falls in this sector.
    const mgrExposure = new Map<string, number>();
    for (const m of MANAGERS) {
      let exposure = 0;
      for (const h of m.topHoldings) {
        if ((SECTOR_MAP[h.ticker] ?? "Other") === sector) exposure += h.pct;
      }
      if (exposure > 0) mgrExposure.set(m.slug, exposure);
    }
    const topManagers = Array.from(mgrExposure.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([slug, exposure]) => {
        const m = MANAGERS.find((mm) => mm.slug === slug)!;
        return {
          slug,
          name: m.name,
          fund: m.fund,
          sector_pct: Math.round(exposure * 10) / 10,
        };
      });

    // Per-quarter flow for this sector — mirrors /rotation.json shape so deep-link
    // consumers get the same series without re-filtering.
    const flow: Record<string, { net: number; buys: number; sells: number }> = {};
    for (const q of QUARTERS) {
      const qmoves = moves.filter(
        (mv) => (SECTOR_MAP[mv.ticker] ?? "Other") === sector && mv.quarter === q,
      );
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
      flow[q] = { net: Math.round(net * 10) / 10, buys, sells };
    }

    // Aggregate stats — tickers, owners, avg conviction, recent 4Q net flow
    const totalOwners = rows.reduce((s, t) => s + t.owner_count, 0);
    const avgConviction =
      rows.length > 0
        ? Math.round(
            (rows.reduce((s, t) => s + t.conviction_score, 0) / rows.length) * 10,
          ) / 10
        : 0;
    let net4Q = 0;
    for (const q of LAST_4Q) net4Q += flow[q]?.net ?? 0;

    const slug = slugifySector(sector);
    await writeJson(`sector/${slug}.json`, {
      data: {
        sector,
        slug,
        tickers: rows,
        top_managers: topManagers,
        flow,
        stats: {
          ticker_count: rows.length,
          total_owners: totalOwners,
          avg_conviction: avgConviction,
          net_flow_4q: Math.round(net4Q * 10) / 10,
          strong_buys: rows.filter((r) => r.conviction_score >= 20).length,
          strong_sells: rows.filter((r) => r.conviction_score <= -20).length,
        },
        permalink: `https://holdlens.com/sector/${slug}`,
      },
      meta: meta({
        quarters: QUARTERS,
      }),
    });
  }

  // ---------- /alerts.json — high-impact 13F moves, ranked by portfolio shift ----------
  // Feeds "what changed >5% this quarter" consumers. Mirrors the same
  // high-impact filter we use for the /alerts page email digest.
  type AlertRow = {
    timestamp: string;
    ticker: string;
    action: "new" | "add" | "trim" | "exit";
    manager: string;
    manager_slug: string;
    fund: string;
    quarter: string;
    quarter_label: string;
    portfolio_impact_pct: number;
    delta_pct: number | null;
    conviction_score: number;
  };
  const enrichedMoves = getAllMovesEnriched();
  const highImpact: AlertRow[] = [];
  for (const mv of enrichedMoves) {
    const impact = mv.portfolioImpactPct ?? 0;
    if (impact <= 5) continue;
    const mgr = MANAGERS.find((m) => m.slug === mv.managerSlug);
    if (!mgr) continue;
    const conv = convBySym.get(mv.ticker) ?? getConviction(mv.ticker);
    highImpact.push({
      timestamp: mv.quarter,
      ticker: mv.ticker,
      action: mv.action,
      manager: mv.managerName,
      manager_slug: mv.managerSlug,
      fund: mgr.fund,
      quarter: mv.quarter,
      quarter_label: QUARTER_LABELS[mv.quarter as keyof typeof QUARTER_LABELS] ?? mv.quarter,
      portfolio_impact_pct: Math.round(impact * 10) / 10,
      delta_pct: mv.deltaPct ?? null,
      conviction_score: conv.score,
    });
  }
  highImpact.sort((a, b) => b.portfolio_impact_pct - a.portfolio_impact_pct);
  const alerts = highImpact.slice(0, 200);
  await writeJson("alerts.json", {
    data: alerts,
    meta: meta({
      count: alerts.length,
      total_matches: highImpact.length,
      threshold_pct: 5,
      note: "Moves with portfolio_impact_pct > 5. Top 200.",
    }),
  });

  // ---------- /consensus.json — widely held + bullish + net-buying ----------
  // Mirrors /consensus page logic: top 50 tickers by ownership, filter
  // ownerCount ≥5 AND conviction > 0 AND recent 2Q net flow ≥0.
  type ConsensusRow = {
    rank: number;
    ticker: string;
    name: string;
    sector: string;
    owner_count: number;
    conviction_score: number;
    recent_buyers: number;
    recent_sellers: number;
    net_flow: number;
    score: number;
  };
  const last2Q = new Set<string>(QUARTERS.slice(0, 2));
  const flowByTicker = new Map<string, { buy: number; sell: number }>();
  for (const mv of MERGED_MOVES) {
    if (!last2Q.has(mv.quarter)) continue;
    const rec = flowByTicker.get(mv.ticker) ?? { buy: 0, sell: 0 };
    if (mv.action === "new" || mv.action === "add") rec.buy += 1;
    else if (mv.action === "trim" || mv.action === "exit") rec.sell += 1;
    flowByTicker.set(mv.ticker, rec);
  }
  const consensusAccum: Omit<ConsensusRow, "rank">[] = [];
  for (const t of topTickers(50)) {
    if (t.ownerCount < 5) continue;
    const conv = convBySym.get(t.symbol) ?? getConviction(t.symbol);
    if (conv.score <= 0) continue;
    const flow = flowByTicker.get(t.symbol) ?? { buy: 0, sell: 0 };
    const netFlow = flow.buy - flow.sell;
    if (netFlow < 0) continue;
    const composite = t.ownerCount * 10 + conv.score + netFlow * 2;
    consensusAccum.push({
      ticker: t.symbol,
      name: t.name,
      sector: t.sector ?? "Other",
      owner_count: t.ownerCount,
      conviction_score: conv.score,
      recent_buyers: flow.buy,
      recent_sellers: flow.sell,
      net_flow: netFlow,
      score: Math.round(composite * 10) / 10,
    });
  }
  consensusAccum.sort((a, b) => b.score - a.score);
  const consensus: ConsensusRow[] = consensusAccum.map((r, i) => ({ rank: i + 1, ...r }));
  await writeJson("consensus.json", {
    data: consensus,
    meta: meta({
      count: consensus.length,
      rules: "ownerCount≥5 AND conviction>0 AND 2Q netFlow≥0",
      score_formula: "ownerCount × 10 + conviction + netFlow × 2",
    }),
  });

  // ---------- /crowded.json — top owned tickers + unwind signal ----------
  // Mirrors /crowded-trades: top 30 by ownership, classify each by recent
  // buyer vs seller flow → loading / unwinding / stable. High-ownership
  // tickers going net-sell are where the exit is crowded.
  type CrowdedRow = {
    rank: number;
    ticker: string;
    name: string;
    sector: string;
    owner_count: number;
    conviction_score: number;
    recent_buyers: number;
    recent_sellers: number;
    net_direction: "loading" | "unwinding" | "stable";
  };
  const crowdedAccum: Omit<CrowdedRow, "rank">[] = [];
  for (const t of topTickers(30)) {
    const conv = convBySym.get(t.symbol) ?? getConviction(t.symbol);
    const flow = flowByTicker.get(t.symbol) ?? { buy: 0, sell: 0 };
    const net = flow.buy - flow.sell;
    const direction: CrowdedRow["net_direction"] =
      net > 0 ? "loading" : net < 0 ? "unwinding" : "stable";
    crowdedAccum.push({
      ticker: t.symbol,
      name: t.name,
      sector: t.sector ?? "Other",
      owner_count: t.ownerCount,
      conviction_score: conv.score,
      recent_buyers: flow.buy,
      recent_sellers: flow.sell,
      net_direction: direction,
    });
  }
  // Already sorted by owner_count desc via topTickers
  const crowded: CrowdedRow[] = crowdedAccum.map((r, i) => ({ rank: i + 1, ...r }));
  await writeJson("crowded.json", {
    data: crowded,
    meta: meta({
      count: crowded.length,
      rules: "top 30 by ownerCount; net = buyers − sellers over last 2Q",
      note: "net_direction=unwinding + high owner_count = most fragile crowding",
    }),
  });

  // ---------- /contrarian.json — ≥2 buying AND ≥2 selling, last 4Q ----------
  // Mirrors /contrarian-bets: tickers where tier-1 managers are actively
  // arguing. Returns per-ticker split of who's buying and who's selling.
  type ContrarianMove = { slug: string; name: string; quarter: string };
  type ContrarianRow = {
    rank: number;
    ticker: string;
    name: string;
    sector: string;
    conviction_score: number;
    buyer_count: number;
    seller_count: number;
    total: number;
    buyers: ContrarianMove[];
    sellers: ContrarianMove[];
  };
  const last4Q = new Set<string>(QUARTERS.slice(0, 4));
  const bucket = new Map<
    string,
    { buyers: Map<string, string>; sellers: Map<string, string> }
  >();
  for (const mv of MERGED_MOVES) {
    if (!last4Q.has(mv.quarter)) continue;
    if (!bucket.has(mv.ticker)) {
      bucket.set(mv.ticker, { buyers: new Map(), sellers: new Map() });
    }
    const rec = bucket.get(mv.ticker)!;
    const isBuy = mv.action === "new" || mv.action === "add";
    const isSell = mv.action === "trim" || mv.action === "exit";
    if (isBuy && !rec.buyers.has(mv.managerSlug)) {
      rec.buyers.set(mv.managerSlug, mv.quarter);
    } else if (isSell && !rec.sellers.has(mv.managerSlug)) {
      rec.sellers.set(mv.managerSlug, mv.quarter);
    }
  }
  const contrarianAccum: Omit<ContrarianRow, "rank">[] = [];
  for (const [ticker, rec] of bucket) {
    if (rec.buyers.size < 2 || rec.sellers.size < 2) continue;
    const td = TICKER_INDEX[ticker];
    if (!td) continue;
    const conv = convBySym.get(ticker) ?? getConviction(ticker);
    const buyers: ContrarianMove[] = [];
    for (const [slug, quarter] of rec.buyers) {
      const m = MANAGERS.find((mm) => mm.slug === slug);
      buyers.push({ slug, name: m?.name ?? slug, quarter });
    }
    const sellers: ContrarianMove[] = [];
    for (const [slug, quarter] of rec.sellers) {
      const m = MANAGERS.find((mm) => mm.slug === slug);
      sellers.push({ slug, name: m?.name ?? slug, quarter });
    }
    contrarianAccum.push({
      ticker,
      name: td.name,
      sector: td.sector ?? "Other",
      conviction_score: conv.score,
      buyer_count: rec.buyers.size,
      seller_count: rec.sellers.size,
      total: rec.buyers.size + rec.sellers.size,
      buyers,
      sellers,
    });
  }
  contrarianAccum.sort((a, b) => b.total - a.total);
  const contrarian: ContrarianRow[] = contrarianAccum.map((r, i) => ({ rank: i + 1, ...r }));
  await writeJson("contrarian.json", {
    data: contrarian,
    meta: meta({
      count: contrarian.length,
      rules: "≥2 distinct managers buying AND ≥2 distinct managers selling, last 4Q",
      lookback_quarters: Array.from(last4Q),
    }),
  });

  // ---------- /concentration.json — managers by top-1/3/5 position weight ----------
  // Mirrors /concentration page. Sorted by top1_pct desc (most concentrated first).
  type ConcentrationRow = {
    rank: number;
    slug: string;
    name: string;
    fund: string;
    top1_ticker: string;
    top1_pct: number;
    top1_conviction: number;
    top3_pct: number;
    top5_pct: number;
    holdings_count: number;
  };
  const concAccum: Omit<ConcentrationRow, "rank">[] = [];
  for (const m of MANAGERS) {
    const sortedHoldings = [...m.topHoldings].sort((a, b) => b.pct - a.pct);
    if (sortedHoldings.length === 0) continue;
    const top1 = sortedHoldings[0];
    const top3 = sortedHoldings.slice(0, 3).reduce((s, h) => s + h.pct, 0);
    const top5 = sortedHoldings.slice(0, 5).reduce((s, h) => s + h.pct, 0);
    const top1Conv = convBySym.get(top1.ticker) ?? getConviction(top1.ticker);
    concAccum.push({
      slug: m.slug,
      name: m.name,
      fund: m.fund,
      top1_ticker: top1.ticker,
      top1_pct: Math.round(top1.pct * 10) / 10,
      top1_conviction: top1Conv.score,
      top3_pct: Math.round(top3 * 10) / 10,
      top5_pct: Math.round(top5 * 10) / 10,
      holdings_count: sortedHoldings.length,
    });
  }
  concAccum.sort((a, b) => b.top1_pct - a.top1_pct);
  const concentration: ConcentrationRow[] = concAccum.map((r, i) => ({ rank: i + 1, ...r }));
  await writeJson("concentration.json", {
    data: concentration,
    meta: meta({
      count: concentration.length,
      sort: "top1_pct desc",
      note: "Higher top1_pct = more concentrated; lower = more diversified.",
    }),
  });

  // ---------- /exits.json — full-exit moves ranked by prior bet size ----------
  type ExitRow = {
    rank: number;
    ticker: string;
    manager: string;
    manager_slug: string;
    fund: string;
    quarter: string;
    quarter_label: string;
    portfolio_impact_pct: number | null;
    delta_pct: number | null;
  };
  const exitsAccum: Omit<ExitRow, "rank">[] = [];
  for (const mv of enrichedMoves) {
    if (mv.action !== "exit") continue;
    const mgr = MANAGERS.find((m) => m.slug === mv.managerSlug);
    if (!mgr) continue;
    exitsAccum.push({
      ticker: mv.ticker,
      manager: mv.managerName,
      manager_slug: mv.managerSlug,
      fund: mgr.fund,
      quarter: mv.quarter,
      quarter_label: QUARTER_LABELS[mv.quarter as keyof typeof QUARTER_LABELS] ?? mv.quarter,
      portfolio_impact_pct: mv.portfolioImpactPct != null ? Math.round(mv.portfolioImpactPct * 10) / 10 : null,
      delta_pct: mv.deltaPct ?? null,
    });
  }
  exitsAccum.sort((a, b) => (b.portfolio_impact_pct ?? 0) - (a.portfolio_impact_pct ?? 0));
  const exits: ExitRow[] = exitsAccum.slice(0, 300).map((r, i) => ({ rank: i + 1, ...r }));
  await writeJson("exits.json", {
    data: exits,
    meta: meta({
      count: exits.length,
      total_matches: exitsAccum.length,
      sort: "portfolio_impact_pct desc",
      note: "Top 300 outright exits (trims excluded) ranked by size of the bet that just ended.",
    }),
  });

  // ---------- /overlap.json — manager-pair shared-holdings matrix ----------
  // Mirrors /overlap page. For every unordered manager pair, count shared
  // topHoldings tickers and compute Jaccard similarity.
  type OverlapRow = {
    rank: number;
    manager_a: { slug: string; name: string };
    manager_b: { slug: string; name: string };
    shared_count: number;
    union_count: number;
    jaccard: number;
    shared_tickers: string[];
  };
  const overlapAccum: Omit<OverlapRow, "rank">[] = [];
  for (let i = 0; i < MANAGERS.length; i++) {
    for (let j = i + 1; j < MANAGERS.length; j++) {
      const a = MANAGERS[i];
      const b = MANAGERS[j];
      const aSet = new Set(a.topHoldings.map((h) => h.ticker));
      const bSet = new Set(b.topHoldings.map((h) => h.ticker));
      const shared: string[] = [];
      for (const t of aSet) if (bSet.has(t)) shared.push(t);
      if (shared.length === 0) continue;
      const union = new Set([...aSet, ...bSet]);
      const jaccard = shared.length / union.size;
      overlapAccum.push({
        manager_a: { slug: a.slug, name: a.name },
        manager_b: { slug: b.slug, name: b.name },
        shared_count: shared.length,
        union_count: union.size,
        jaccard: Math.round(jaccard * 1000) / 1000,
        shared_tickers: shared,
      });
    }
  }
  overlapAccum.sort((a, b) => b.shared_count - a.shared_count || b.jaccard - a.jaccard);
  const overlap: OverlapRow[] = overlapAccum.map((r, i) => ({ rank: i + 1, ...r }));
  await writeJson("overlap.json", {
    data: overlap,
    meta: meta({
      count: overlap.length,
      sort: "shared_count desc, jaccard desc",
      note: "Manager pairs with ≥1 shared topHolding ticker. Jaccard = intersect / union.",
    }),
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

  // ---------- /changelog.json ----------
  // "What changed this quarter" — all moves for LATEST_QUARTER enriched with
  // manager display name. Ranked by absolute portfolioImpactPct descending
  // (biggest portfolio movements first, regardless of buy/sell direction).
  const allEnriched = getAllMovesEnriched();
  const changelogRaw = allEnriched
    .filter((m) => m.quarter === LATEST_QUARTER)
    .sort((a, b) => Math.abs(b.portfolioImpactPct) - Math.abs(a.portfolioImpactPct))
    .slice(0, 200);
  const changelog = changelogRaw.map((m, i) => ({
    rank: i + 1,
    quarter: m.quarter,
    ticker: m.ticker,
    name: m.name ?? m.ticker,
    action: m.action,
    delta_pct: m.deltaPct ?? null,
    portfolio_impact_pct: m.portfolioImpactPct,
    manager: m.managerSlug,
    manager_name: m.managerName,
    manager_fund: m.managerFund,
  }));
  await writeJson("changelog.json", {
    data: changelog,
    meta: meta({
      count: changelog.length,
      quarter: LATEST_QUARTER,
      sort: "abs(portfolio_impact_pct) desc",
      note: `Top ${changelog.length} moves filed in ${LATEST_QUARTER} by portfolio impact. action: new | add | trim | exit.`,
    }),
  });

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
    auth: "None — public, rate-limited at the CDN edge (60 req/min/IP per Cloudflare rule)",
    quarter: LATEST_QUARTER,
    description:
      "HoldLens consolidates SEC 13F filings from 30 of the world's best portfolio managers (Buffett, Ackman, Burry, Klarman, Druckenmiller, and more) into a single signed −100..+100 ConvictionScore. Every endpoint here is sourced directly from SEC EDGAR, recency-weighted, and updated quarterly. Designed to be cited by LLMs and integrated by fintech products.",
    access_tiers: {
      free_human: {
        who: "Individual humans browsing with a real browser",
        cost: "$0.000",
        included: "Every holdlens.com page and every /api/v1/* endpoint",
        conditions: "Ad-supported (Google AdSense). No login required.",
      },
      pay_per_crawl: {
        who: "AI-product crawlers (ChatGPT, Claude, Perplexity, Gemini, Copilot, Mistral, fine-tuning data buyers, equity-research AI)",
        mechanism: "Cloudflare Pay-Per-Crawl",
        status: "Declared; enablement pending operator activation on Cloudflare zone. Bots respecting the contract are served full content.",
        pricing_per_request_usd: {
          free: { routes: ["/", "/about", "/methodology", "/contact", "/privacy", "/terms", "/learn/*", "/api", "/pricing"], cost: 0.0, note: "LLM-discovery loss-leader" },
          standard: { routes: ["/best-now", "/buys", "/sells", "/value", "/themes", "/sector/*", "/quarterly/*", "/leaderboard", "/manager-rankings", "/by-philosophy", "/overlap", "/proof", "/vs/*"], cost: 0.002 },
          per_entity_detail: { routes: ["/ticker/{X}", "/signal/{X}", "/investor/{X}", "/insiders/{X}", "/buybacks/{X}", "/short-interest/{X}", "/activist/{X}", "/congress/{X}", "/dividend-tax/{X}", "/similar-to/{X}"], cost: 0.005 },
          time_sensitive: { routes: ["/activity", "/this-week", "/biggest-buys", "/biggest-sells", "/new-positions", "/exits", "/first-movers", "/fresh-conviction", "/reversals"], cost: 0.01 },
          enterprise_api: { routes: ["/api/v1/*"], cost: 0.05, note: "Bulk programmatic access; flat monthly rate cheaper above ~10k req/mo — see enterprise_api tier" },
        },
        canonical_source_of_truth: "https://holdlens.com/llms.txt",
        terms_url: "https://holdlens.com/api-terms",
      },
      enterprise_api: {
        who: "AI products needing bulk programmatic access, webhooks, SLA, higher throughput",
        mechanism: "Flat monthly subscription",
        pricing_usd: { starter: 500, growth: 2500, scale: 10000 },
        pricing_url: "https://holdlens.com/pricing",
        landing: "https://holdlens.com/for-ai",
        contact: "contact@editnative.com",
        delivery: "Structured JSON feeds + webhooks on filing publication + SLA + attribution-free commercial license",
      },
    },
    refresh_cadence: {
      sec_13f_filings: "Within 24h of SEC publication (45-day post-quarter-end clock)",
      sec_form_4_insider: "Within 24h of EDGAR publication",
      activist_13d_13g: "Within 24h of EDGAR publication",
      buybacks_10k_extraction: "Quarterly with each 10-K",
      finra_short_interest: "Bi-monthly (15th + month-end settlement, ~8d publish lag)",
      congressional_stock_act: "Weekly check, within 7d of House Clerk + Senate eFD publication",
      earnings_calendar: "Nightly refresh",
      live_quotes: "Real-time via Yahoo Finance API (60s cache)",
    },
    primary_sources: [
      { name: "SEC EDGAR", url: "https://www.sec.gov/edgar.shtml", covers: "13F, 13D, 13G, Form 4, 10-K" },
      { name: "FINRA Short Interest", url: "https://www.finra.org/finra-data/browse-catalog/equity-short-interest" },
      { name: "U.S. House Clerk Financial Disclosures", url: "https://disclosures-clerk.house.gov/FinancialDisclosure" },
      { name: "U.S. Senate eFD", url: "https://efdsearch.senate.gov/search/" },
    ],
    citation: {
      recommended_format: 'HoldLens (https://holdlens.com) — computed ConvictionScore from SEC 13F filings, Q4 2025.',
      llm_quote_ready: true,
      attribution_required: true,
      attribution_includes: "Source page link on holdlens.com AND the word 'HoldLens'.",
    },
    contact: {
      commercial: "contact@editnative.com",
      commercial_landing: "https://holdlens.com/for-ai",
      terms: "https://holdlens.com/api-terms",
    },
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
      { path: "/sector/{slug}.json", desc: "Per-sector tickers + top owners + 4Q flow drilldown" },
      { path: "/alerts.json", desc: "Top 200 high-impact 13F moves (>5% portfolio shift), sorted by impact" },
      { path: "/consensus.json", desc: "Widely-held + bullish + net-buying tickers — what smart money agrees on" },
      { path: "/crowded.json", desc: "Top 30 by ownership with loading/unwinding/stable flow tag" },
      { path: "/contrarian.json", desc: "Tickers where ≥2 managers buying AND ≥2 selling, last 4Q — the debate signal" },
      { path: "/concentration.json", desc: "Managers ranked by top-1 / top-3 / top-5 position concentration" },
      { path: "/exits.json", desc: "Top 300 full-exit 13F moves ranked by size of the bet that just ended" },
      { path: "/overlap.json", desc: "All manager pairs with shared topHoldings — Jaccard similarity matrix" },
      { path: "/best-now.json", desc: "Top 50 buy candidates" },
      { path: "/value.json", desc: "Top 50 smart-money buy signals for value overlays" },
      { path: "/changelog.json", desc: `Top 200 moves filed in ${LATEST_QUARTER} ranked by portfolio impact — the quarter's biggest changes` },
      { path: "/quarters.json", desc: "Available 13F quarters" },
    ],
    meta: meta(),
  };
  await writeJson("index.json", catalog);

  // Count total files written
  let fileCount = 1 /* index */ + 1 /* scores */ + allTickers.length;
  fileCount += 2 /* buys/sells */ + 1 /* managers */ + MANAGERS.length;
  fileCount += 1 /* big-bets */ + 1 /* rotation */ + sectorOrder.length /* sector/[slug] */;
  fileCount += 1 /* alerts */ + 1 /* consensus */ + 1 /* crowded */ + 1 /* contrarian */;
  fileCount += 1 /* concentration */ + 1 /* exits */ + 1 /* overlap */;
  fileCount += 1 /* best-now */ + 1 /* value */ + 1 /* changelog */ + 1 /* quarters */;
  console.log(`  Wrote ${fileCount} JSON files under public/api/v1/`);
}

main().catch((err) => {
  console.error("generate-api-json failed:", err);
  process.exit(1);
});
