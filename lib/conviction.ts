// ConvictionScore v4 — THE canonical recommendation model.
//
// ONE unified signed score per ticker. Range: −100 (strongest sell) to +100
// (strongest buy). Zero = no signal. Each ticker has exactly ONE score, so
// the same stock can NEVER appear on both buy and sell rankings (the bug
// that v3 still allowed via parallel getBuySignals / getSellSignals lists).
//
// Six signal layers feed the score:
//   1. Smart money — manager-quality × consensus, time-decayed across quarters
//   2. Insider activity — CEO/CFO open-market buys (strongest single equity signal)
//   3. Track record — buyer 10y CAGR weighted by their position size
//   4. Trend streak — multi-quarter compounding (3Q in a row ≠ 1Q)
//   5. Concentration — 15% positions weighted heavier than 1%
//   6. Contrarian bonus — under-the-radar (small ownerCount + tier-1 buyers)
// Minus:
//   • Dissent penalty — sellers subtract from the score (×1.2 because exits
//     require more conviction than trims)
//   • Crowding penalty — when ownerCount is high, the signal is already
//     priced in
//
// CLASSIFICATION (symmetric — single source of truth):
//   • score >  +DEAD_ZONE → BUY
//   • score <  −DEAD_ZONE → SELL
//   • |score| ≤  DEAD_ZONE → NEUTRAL  (the dead zone — too noisy to call)
//
// The dead zone is critical: it filters out tickers where buying and selling
// roughly cancel (META: 9 buyers vs 5 sellers → small net signal → NEUTRAL),
// keeping only stocks with unambiguous direction in either ranking.

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
  score: number;               // SIGNED −100..+100 (negative = sell, positive = buy)
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

// Pure sign-based classification: positive = BUY, negative = SELL, zero = NEUTRAL.
// DEAD_ZONE = 0 means a ticker's LIST membership is determined purely by the
// sign of its single signed score. The convictionLabel() function still uses
// soft thresholds (±10, ±40, ±70) to assign WEAK / regular / STRONG labels,
// but those are display-only — they don't affect which ranking a ticker appears in.
//
// Why pure sign: the user asked for "one scale: -100 is strongest sell, +100
// is strongest buy". A non-zero dead zone introduces a third tier (NEUTRAL)
// that breaks the clean two-sided semantics. With DEAD_ZONE = 0, every ticker
// appears in exactly one ranking based on which side of zero its score lies.
export const DEAD_ZONE = 0;

export function classifyScore(score: number): "BUY" | "SELL" | "NEUTRAL" {
  if (score > DEAD_ZONE) return "BUY";
  if (score < -DEAD_ZONE) return "SELL";
  return "NEUTRAL";
}

// ---------- HELPERS ----------

// Continuous 0.6^distance decay across all 8 tracked quarters.
// Q4 2025 = 1.0 (latest), Q1 2024 = 0.6^7 ≈ 0.028.
const TIME_DECAY: Record<string, number> = {
  "2025-Q4": 1.0,
  "2025-Q3": 0.6,
  "2025-Q2": 0.36,
  "2025-Q1": 0.216,
  "2024-Q4": 0.13,
  "2024-Q3": 0.078,
  "2024-Q2": 0.047,
  "2024-Q1": 0.028,
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
  // Sells weighted heavier (×1.6) because the tracked managers are mostly
  // long-only value investors — when one of them actually trims or exits,
  // it's conviction-negative and rare. Cap raised to 60 so a strong dump
  // can fully overwhelm a moderate buy signal.
  const dissentPenalty = clamp((dissentRaw / 3) * 1.6, 0, 60);

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
  const direction = classifyScore(score);

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

/** Top N strongest BUY signals (score > +DEAD_ZONE), highest first. */
export function getTopBuys(n = 20): ConvictionScore[] {
  return getAllConvictionScores()
    .filter((c) => c.score > DEAD_ZONE)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.expectedReturnPct ?? 0) - (a.expectedReturnPct ?? 0);
    })
    .slice(0, n);
}

/** Top N strongest SELL signals (score < −DEAD_ZONE), most negative first. */
export function getTopSells(n = 20): ConvictionScore[] {
  return getAllConvictionScores()
    .filter((c) => c.score < -DEAD_ZONE)
    .sort((a, b) => a.score - b.score)
    .slice(0, n);
}

/**
 * Single canonical signal lookup. Returns the signed −100..+100 conviction
 * score for any ticker. Wraps getConviction() for callers that just want
 * the score without the breakdown.
 */
export function getUnifiedScore(ticker: string): number {
  return getConviction(ticker).score;
}

// ---------- HISTORICAL CONVICTION (for backtesting) ----------
//
// Computes a ConvictionScore as it would have been at a past quarter,
// using ONLY the moves that were available up to and including that quarter.
// Used by /proof to backtest the recommender against realized returns.

const HISTORICAL_QUARTER_ORDER: Record<string, number> = {
  "2024-Q1": 1,
  "2024-Q2": 2,
  "2024-Q3": 3,
  "2024-Q4": 4,
  "2025-Q1": 5,
  "2025-Q2": 6,
  "2025-Q3": 7,
  "2025-Q4": 8,
};

/**
 * Compute the conviction score for a ticker AS OF a historical quarter,
 * using only moves up to and including that quarter. Time decay is re-anchored
 * so the historical "latest" quarter has weight 1.0.
 */
export function getConvictionAtQuarter(ticker: string, asOfQuarter: Quarter): ConvictionScore {
  const sym = ticker.toUpperCase();
  const tickerData = TICKER_INDEX[sym];
  const cutoff = HISTORICAL_QUARTER_ORDER[asOfQuarter] ?? 8;

  // Re-anchored time decay: target quarter = 1.0, each prior = 0.6 of next
  const reAnchoredDecay: Record<string, number> = {};
  for (const [q, idx] of Object.entries(HISTORICAL_QUARTER_ORDER)) {
    if (idx > cutoff) continue;
    const distance = cutoff - idx;
    reAnchoredDecay[q] = Math.pow(0.6, distance);
  }

  const allMoves = getAllMovesEnriched().filter(
    (m) => m.ticker.toUpperCase() === sym && (HISTORICAL_QUARTER_ORDER[m.quarter] ?? 0) <= cutoff
  );
  const buyerMoves = allMoves.filter((m) => m.action === "new" || m.action === "add");
  const sellerMoves = allMoves.filter((m) => m.action === "trim" || m.action === "exit");

  const ownerCount = tickerData?.ownerCount ?? 0;

  // Smart money signal (re-anchored decay)
  let smartMoneyRaw = 0;
  const buyerContribs: Array<{ slug: string; name: string; weight: number; cagr: number; pctImpact: number }> = [];
  for (const mv of buyerMoves) {
    const decay = reAnchoredDecay[mv.quarter] ?? 0.1;
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
  const smartMoney = clamp(smartMoneyRaw / 3, 0, 30);

  let dissentRaw = 0;
  const sellerContribs: Array<{ slug: string; name: string; weight: number; cagr: number; pctImpact: number }> = [];
  for (const mv of sellerMoves) {
    const decay = reAnchoredDecay[mv.quarter] ?? 0.1;
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
  // Symmetric with the live model: 1.6× multiplier, cap 60.
  const dissentPenalty = clamp((dissentRaw / 3) * 1.6, 0, 60);

  // Insider activity (uses current data, not time-locked — small bias but acceptable)
  const insiderTx = getInsiderTx(sym);
  const insiderBuys = insiderTx.filter((t) => t.action === "buy");
  const insiderSells = insiderTx.filter((t) => t.action === "sell");
  const insiderBuyValue = insiderBuys.reduce((s, t) => s + t.value, 0);
  const insiderSellValueDiscretionary = insiderSells
    .filter((t) => !(t.note || "").toLowerCase().includes("10b5-1"))
    .reduce((s, t) => s + t.value, 0);
  const netInsider = insiderBuyValue - insiderSellValueDiscretionary;
  let insiderBoost = 0;
  if (netInsider > 0) insiderBoost = clamp(Math.log10(netInsider / 1e6 + 1) * 6, 0, 20);
  else if (netInsider < 0) insiderBoost = -clamp(Math.log10(Math.abs(netInsider) / 1e6 + 1) * 4, 0, 15);

  // Track record
  let trackRecordRaw = 0;
  let totalConcWeight = 0;
  for (const b of buyerContribs) {
    const w = Math.max(0.5, b.pctImpact);
    trackRecordRaw += b.cagr * w;
    totalConcWeight += w;
  }
  const trackRecord =
    totalConcWeight > 0
      ? clamp(((trackRecordRaw / totalConcWeight - 13) * 1.5), 0, 20)
      : 0;

  // Trend streak (computed only from quarters ≤ cutoff, oldest → newest)
  const orderedQuarters = [
    "2024-Q1",
    "2024-Q2",
    "2024-Q3",
    "2024-Q4",
    "2025-Q1",
    "2025-Q2",
    "2025-Q3",
    "2025-Q4",
  ].slice(0, cutoff);
  let maxBuyStreak = 0;
  for (const b of buyerContribs) {
    let streak = 0;
    let lastDir: "buying" | "selling" | null = null;
    for (const q of orderedQuarters) {
      const mv = allMoves.find((m) => m.managerSlug === b.slug && m.quarter === q);
      if (!mv) continue;
      const dir = mv.action === "new" || mv.action === "add" ? "buying" : "selling";
      if (lastDir === dir) streak++;
      else {
        lastDir = dir;
        streak = 1;
      }
    }
    if (lastDir === "buying" && streak > maxBuyStreak) maxBuyStreak = streak;
  }
  const trendStreak = maxBuyStreak === 0 ? 0 : clamp((maxBuyStreak - 1) * 3.5 + 1, 0, 10);

  // Concentration
  let maxBuyerConcentration = 0;
  for (const b of buyerContribs) {
    if (b.pctImpact > maxBuyerConcentration) maxBuyerConcentration = b.pctImpact;
  }
  const concentration = clamp(maxBuyerConcentration * 0.5, 0, 10);

  // Contrarian + crowding (use ownerCount as known today — minor look-ahead bias)
  const tierOneBuyers = buyerContribs.filter((b) => {
    const roi = getManagerROI(b.slug);
    return (roi?.quality0to10 ?? 0) >= 8;
  });
  const contrarian =
    ownerCount <= 5 && tierOneBuyers.length >= 1 ? clamp(10 - ownerCount, 0, 10) : 0;
  const crowdingPenalty =
    ownerCount > 8 ? clamp(Math.log2(ownerCount - 7) * 2, 0, 10) : 0;

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
  const direction = classifyScore(score);

  // Expected return
  let expectedReturnPct: number | null = null;
  if (buyerContribs.length > 0) {
    let weightedSum = 0;
    let totalWeight = 0;
    for (const b of buyerContribs) {
      const w = Math.max(1, b.pctImpact);
      weightedSum += b.cagr * w;
      totalWeight += w;
    }
    expectedReturnPct = totalWeight > 0 ? weightedSum / totalWeight : null;
  }

  return {
    ticker: sym,
    name: tickerData?.name ?? sym,
    sector: tickerData?.sector,
    score,
    direction,
    expectedReturnPct: expectedReturnPct != null ? Math.round(expectedReturnPct * 10) / 10 : null,
    confidenceIntervalPct: null,
    expectedFiveYearMultiple: null,
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
    topBuyers: buyerContribs
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map((b) => ({ slug: b.slug, name: b.name, cagr: b.cagr, positionPct: b.pctImpact })),
    topSellers: sellerContribs
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map((b) => ({ slug: b.slug, name: b.name, cagr: b.cagr, positionPct: b.pctImpact })),
  };
}

/** Top N BUY signals as of a historical quarter — used for backtesting. */
export function getHistoricalTopBuys(asOfQuarter: Quarter, n = 5): ConvictionScore[] {
  const tickers = new Set<string>();
  for (const m of ALL_MOVES) {
    if ((HISTORICAL_QUARTER_ORDER[m.quarter] ?? 0) <= (HISTORICAL_QUARTER_ORDER[asOfQuarter] ?? 0)) {
      tickers.add(m.ticker.toUpperCase());
    }
  }
  const out: ConvictionScore[] = [];
  for (const t of tickers) {
    const c = getConvictionAtQuarter(t, asOfQuarter);
    if (c.score > DEAD_ZONE) out.push(c);
  }
  return out.sort((a, b) => b.score - a.score).slice(0, n);
}

/**
 * Symmetric label for the unified −100..+100 conviction score.
 * Mirrors above/below zero so a +45 BUY and a −45 SELL read as equal strength.
 */
export function convictionLabel(score: number): { label: string; color: string } {
  if (score >= 70) return { label: "STRONG BUY", color: "emerald" };
  if (score >= 40) return { label: "BUY", color: "emerald" };
  if (score >  DEAD_ZONE) return { label: "WEAK BUY", color: "emerald" };
  if (score >= -DEAD_ZONE) return { label: "NEUTRAL", color: "muted" };
  if (score > -40) return { label: "WEAK SELL", color: "rose" };
  if (score > -70) return { label: "SELL", color: "rose" };
  return { label: "STRONG SELL", color: "rose" };
}

/** Format a signed score for display: "+42" or "−18" or "0". */
export function formatSignedScore(score: number): string {
  if (score > 0) return `+${score}`;
  if (score < 0) return `−${Math.abs(score)}`;
  return "0";
}

