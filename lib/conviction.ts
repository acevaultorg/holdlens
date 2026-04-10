// ConvictionScore v3 — the recommendation model that beats consensus.
//
// Six layers the previous NetSignal v2 didn't touch:
//   1. Insider activity weighting (CEO/CFO open-market buys = strongest equity signal)
//   2. Per-buyer expected ROI (using each manager's realized 10y CAGR, not just quality)
//   3. Anti-crowding penalty (signal value diminishes with ownership count)
//   4. Time decay across quarters (recent moves > old moves)
//   5. Concentration as conviction proof (15% position weighted heavier than 1%)
//   6. Trend streak compounding (3Q consecutive buys ≠ 1Q buy)
//
// OUTPUT
//   - score: 0–100 composite
//   - direction: BUY / SELL / NEUTRAL
//   - expectedReturnPct: annualized projection from buyer-CAGR-weighted average
//   - confidenceInterval: ± stddev of buyer CAGRs (narrow CI = agreement)
//   - breakdown: every component for the UI to display the math
//
// This is the model that answers "what's the highest expected ROI I should buy right now?"

import { ALL_MOVES, getAllMovesEnriched, LATEST_QUARTER, type Quarter } from "./moves";
import { TICKER_INDEX } from "./tickers";
import { getInsiderTx } from "./insiders";
import { getManagerROI } from "./manager-roi";
import { getManagerTickerTrend } from "./signals";

// ---------- TYPES ----------

export type ConvictionBreakdown = {
  smartMoney: number;          // 0–30 — NetSignal-style consensus + quality
  insiderBoost: number;        // 0–20 — CEO/CFO open-market buys
  trackRecord: number;         // 0–20 — buyer CAGR × concentration weighted
  trendStreak: number;         // 0–10 — multi-quarter compounding
  concentration: number;       // 0–10 — position-size as conviction proof
  contrarian: number;          // 0–10 — anti-crowding bonus for under-the-radar
  dissentPenalty: number;      // 0–40 — sells subtract
  crowdingPenalty: number;     // 0–10 — too many owners = priced in
  raw: number;                 // pre-clamp
};

export type ConvictionScore = {
  ticker: string;
  name: string;
  sector?: string;
  score: number;               // 0–100 (or −100 to +100 if direction matters)
  direction: "BUY" | "SELL" | "NEUTRAL";
  expectedReturnPct: number | null;     // annualized %, computed from buyer CAGRs
  confidenceIntervalPct: number | null; // ± standard deviation
  buyerCount: number;
  sellerCount: number;
  ownerCount: number;          // total managers holding (not just acting)
  breakdown: ConvictionBreakdown;
  // Derived display values
  expectedFiveYearMultiple: number | null; // (1 + roi/100)^5
  topBuyers: { slug: string; name: string; cagr: number; positionPct: number }[];
  topSellers: { slug: string; name: string; cagr: number; positionPct: number }[];
};

// ---------- HELPERS ----------

const TIME_DECAY: Record<string, number> = {
  "2025-Q4": 1.0,
  "2025-Q3": 0.6,
  "2025-Q2": 0.36,
  "2025-Q1": 0.22,
};

function decayWeight(quarter: string): number {
  return TIME_DECAY[quarter] ?? 0.1;
}

function stddev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

// ---------- CONVICTION COMPUTATION ----------

export function getConviction(ticker: string, quarter: Quarter = LATEST_QUARTER): ConvictionScore {
  const sym = ticker.toUpperCase();
  const tickerData = TICKER_INDEX[sym];

  // Pull all moves for this ticker — across all quarters, time-decayed
  const allMoves = getAllMovesEnriched().filter((m) => m.ticker.toUpperCase() === sym);
  const buyerMoves = allMoves.filter((m) => m.action === "new" || m.action === "add");
  const sellerMoves = allMoves.filter((m) => m.action === "trim" || m.action === "exit");

  const ownerCount = tickerData?.ownerCount ?? 0;

  // ----- LAYER 1: Smart money signal (consensus + quality, time-decayed) -----
  // Each buyer contributes: action_weight × manager_quality × decay × concentration_factor
  let smartMoneyRaw = 0;
  const buyerContribs: Array<{ slug: string; name: string; weight: number; cagr: number; pctImpact: number }> = [];

  for (const mv of buyerMoves) {
    const decay = decayWeight(mv.quarter);
    const roi = getManagerROI(mv.managerSlug);
    const quality = roi?.quality0to10 ?? 6;
    const cagr = roi?.cagr10y ?? 13;
    const actionWeight = mv.action === "new" ? 2 : 1;
    const pctImpact = mv.portfolioImpactPct ?? 0;
    const concentrationBoost = pctImpact > 5 ? 1 + Math.log10(pctImpact / 5) * 0.5 : 1;
    const contribution = actionWeight * quality * decay * concentrationBoost;
    smartMoneyRaw += contribution;
    buyerContribs.push({
      slug: mv.managerSlug,
      name: mv.managerName,
      weight: contribution,
      cagr,
      pctImpact,
    });
  }
  const smartMoney = clamp(smartMoneyRaw / 3, 0, 30); // normalize ~30 max

  // Sell pressure (the dissent penalty)
  let dissentRaw = 0;
  const sellerContribs: Array<{ slug: string; name: string; weight: number; cagr: number; pctImpact: number }> = [];
  for (const mv of sellerMoves) {
    const decay = decayWeight(mv.quarter);
    const roi = getManagerROI(mv.managerSlug);
    const quality = roi?.quality0to10 ?? 6;
    const cagr = roi?.cagr10y ?? 13;
    const actionWeight = mv.action === "exit" ? 2 : 1;
    const pctImpact = mv.portfolioImpactPct ?? 0;
    const contribution = actionWeight * quality * decay;
    dissentRaw += contribution;
    sellerContribs.push({
      slug: mv.managerSlug,
      name: mv.managerName,
      weight: contribution,
      cagr,
      pctImpact,
    });
  }
  const dissentPenalty = clamp((dissentRaw / 3) * 1.2, 0, 40); // sells weighted 1.2x because exits are conviction-negative

  // ----- LAYER 2: Insider activity -----
  const insiderTx = getInsiderTx(sym);
  const insiderBuys = insiderTx.filter((t) => t.action === "buy");
  const insiderSells = insiderTx.filter((t) => t.action === "sell");
  // CEO open-market buy = +5 per buy. CEO sell with note "10b5-1" = neutral.
  // Routine 10b5-1 sells don't count against (they're scheduled).
  const insiderBuyValue = insiderBuys.reduce((s, t) => s + t.value, 0);
  const insiderSellValueDiscretionary = insiderSells
    .filter((t) => !(t.note || "").toLowerCase().includes("10b5-1"))
    .reduce((s, t) => s + t.value, 0);
  // Score: log of net buy value, capped at 20
  const netInsider = insiderBuyValue - insiderSellValueDiscretionary;
  let insiderBoost = 0;
  if (netInsider > 0) {
    insiderBoost = clamp(Math.log10(netInsider / 1e6 + 1) * 6, 0, 20);
  } else if (netInsider < 0) {
    insiderBoost = -clamp(Math.log10(Math.abs(netInsider) / 1e6 + 1) * 4, 0, 15);
  }

  // ----- LAYER 3: Track record (buyer CAGR × concentration) -----
  // The killer: weight buyer CAGRs by position size, sum, normalize.
  let trackRecordRaw = 0;
  let totalConcWeight = 0;
  for (const b of buyerContribs) {
    const w = Math.max(0.5, b.pctImpact); // even small positions count for 0.5
    trackRecordRaw += b.cagr * w;
    totalConcWeight += w;
  }
  const trackRecord =
    totalConcWeight > 0
      ? clamp(((trackRecordRaw / totalConcWeight - 13) * 1.5), 0, 20) // alpha vs 13% S&P, 1.5pt per 1% alpha
      : 0;

  // ----- LAYER 4: Trend streak compounding -----
  // For each buyer, compute streak. Reward longest streak.
  let maxBuyStreak = 0;
  for (const b of buyerContribs) {
    const trend = getManagerTickerTrend(b.slug, sym);
    if (trend.direction === "buying" && trend.streak > maxBuyStreak) {
      maxBuyStreak = trend.streak;
    }
  }
  // 1Q = 0, 2Q = 4, 3Q = 7, 4Q+ = 10
  const trendStreak = maxBuyStreak === 0 ? 0 : clamp((maxBuyStreak - 1) * 3.5 + 1, 0, 10);

  // ----- LAYER 5: Concentration as conviction proof -----
  // If any single buyer has >10% in this stock, they're betting their book on it.
  let maxBuyerConcentration = 0;
  for (const b of buyerContribs) {
    if (b.pctImpact > maxBuyerConcentration) maxBuyerConcentration = b.pctImpact;
  }
  const concentration = clamp(maxBuyerConcentration * 0.5, 0, 10); // 20% = 10 points

  // ----- LAYER 6: Anti-crowding contrarian bonus -----
  // If FEW managers own this but the smart ones are buying, alpha is preserved.
  // Penalty for crowding: signal × (1 / (1 + ln(ownerCount)))
  // Bonus for under-the-radar: if ownerCount ≤ 5 and there are tier-1 buyers, +bonus
  const tierOneBuyers = buyerContribs.filter((b) => {
    const roi = getManagerROI(b.slug);
    return (roi?.quality0to10 ?? 0) >= 8;
  });
  const contrarian =
    ownerCount <= 5 && tierOneBuyers.length >= 1
      ? clamp(10 - ownerCount, 0, 10)
      : 0;

  // Crowding penalty: when ownerCount is high, the smart money signal is already priced in
  const crowdingPenalty =
    ownerCount > 8 ? clamp(Math.log2(ownerCount - 7) * 2, 0, 10) : 0;

  // ----- COMPOSITE SCORE -----
  const raw =
    smartMoney +
    insiderBoost +
    trackRecord +
    trendStreak +
    concentration +
    contrarian -
    dissentPenalty -
    crowdingPenalty;

  const score = Math.round(clamp(raw, -100, 100));

  let direction: "BUY" | "SELL" | "NEUTRAL" = "NEUTRAL";
  if (score >= 30) direction = "BUY";
  else if (score <= -10) direction = "SELL";

  // ----- EXPECTED RETURN PROJECTION -----
  // Weighted-average buyer CAGR, weighted by (concentration × quality)
  let expectedReturnPct: number | null = null;
  let confidenceIntervalPct: number | null = null;

  if (buyerContribs.length > 0) {
    let weightedSum = 0;
    let totalWeight = 0;
    const cagrs: number[] = [];
    for (const b of buyerContribs) {
      const w = Math.max(1, b.pctImpact);
      weightedSum += b.cagr * w;
      totalWeight += w;
      cagrs.push(b.cagr);
    }
    expectedReturnPct = totalWeight > 0 ? weightedSum / totalWeight : null;
    confidenceIntervalPct = stddev(cagrs);
  } else if (sellerContribs.length > 0) {
    // For sells, project the OPPOSITE — what the sellers think you'll lose
    let weightedSum = 0;
    let totalWeight = 0;
    for (const s of sellerContribs) {
      const w = Math.max(1, s.pctImpact);
      weightedSum += s.cagr * w;
      totalWeight += w;
    }
    expectedReturnPct = totalWeight > 0 ? -(weightedSum / totalWeight) * 0.4 : null;
  }

  const expectedFiveYearMultiple =
    expectedReturnPct != null ? Math.pow(1 + expectedReturnPct / 100, 5) : null;

  // Top 3 by weight
  const topBuyers = buyerContribs
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((b) => ({ slug: b.slug, name: b.name, cagr: b.cagr, positionPct: b.pctImpact }));
  const topSellers = sellerContribs
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((b) => ({ slug: b.slug, name: b.name, cagr: b.cagr, positionPct: b.pctImpact }));

  return {
    ticker: sym,
    name: tickerData?.name ?? sym,
    sector: tickerData?.sector,
    score,
    direction,
    expectedReturnPct: expectedReturnPct != null ? Math.round(expectedReturnPct * 10) / 10 : null,
    confidenceIntervalPct:
      confidenceIntervalPct != null ? Math.round(confidenceIntervalPct * 10) / 10 : null,
    expectedFiveYearMultiple:
      expectedFiveYearMultiple != null ? Math.round(expectedFiveYearMultiple * 100) / 100 : null,
    buyerCount: buyerContribs.length,
    sellerCount: sellerContribs.length,
    ownerCount,
    breakdown: {
      smartMoney: Math.round(smartMoney),
      insiderBoost: Math.round(insiderBoost),
      trackRecord: Math.round(trackRecord),
      trendStreak: Math.round(trendStreak),
      concentration: Math.round(concentration),
      contrarian: Math.round(contrarian),
      dissentPenalty: Math.round(dissentPenalty),
      crowdingPenalty: Math.round(crowdingPenalty),
      raw: Math.round(raw),
    },
    topBuyers,
    topSellers,
  };
}

/** All conviction scores across every ticker that had any move in any quarter. */
export function getAllConvictionScores(quarter: Quarter = LATEST_QUARTER): ConvictionScore[] {
  void quarter; // currently uses all quarters via time decay
  const tickers = new Set<string>();
  for (const m of ALL_MOVES) tickers.add(m.ticker.toUpperCase());
  // Also include all currently-owned tickers (no Q4 move = still relevant)
  for (const t of Object.keys(TICKER_INDEX)) tickers.add(t);

  const out: ConvictionScore[] = [];
  for (const t of tickers) {
    const c = getConviction(t);
    out.push(c);
  }
  return out.sort((a, b) => b.score - a.score);
}

/** Top N highest-ROI buy candidates. */
export function getTopBuys(n = 20): ConvictionScore[] {
  return getAllConvictionScores()
    .filter((c) => c.direction === "BUY")
    .sort((a, b) => {
      // Sort by score, then by expected return as tiebreaker
      if (b.score !== a.score) return b.score - a.score;
      return (b.expectedReturnPct ?? 0) - (a.expectedReturnPct ?? 0);
    })
    .slice(0, n);
}

/** Top N strongest sell candidates. */
export function getTopSells(n = 20): ConvictionScore[] {
  return getAllConvictionScores()
    .filter((c) => c.direction === "SELL")
    .sort((a, b) => a.score - b.score)
    .slice(0, n);
}

/** Quality label for a conviction score */
export function convictionLabel(score: number): { label: string; color: string } {
  if (score >= 70) return { label: "STRONG BUY", color: "emerald" };
  if (score >= 45) return { label: "BUY", color: "emerald" };
  if (score >= 30) return { label: "WEAK BUY", color: "emerald" };
  if (score >= -10) return { label: "HOLD / NEUTRAL", color: "muted" };
  if (score >= -30) return { label: "WEAK SELL", color: "rose" };
  if (score >= -60) return { label: "SELL", color: "rose" };
  return { label: "STRONG SELL", color: "rose" };
}

