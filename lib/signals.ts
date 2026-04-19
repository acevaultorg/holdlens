// Buy/Sell Recommendation Engine — single-scale unified score.
//
// Every ticker is assigned ONE signed score on a single −100..+100 scale:
//   • +100 = strongest possible BUY
//   •  0  = no signal
//   • −100 = strongest possible SELL
//
// The score itself is computed by `getConviction()` in `lib/conviction.ts`
// (the v4 ConvictionScore model — six signal layers minus dissent and
// crowding penalties). This file presents that score in two filtered views:
//
//   getBuySignals()  → tickers where score > +DEAD_ZONE, sorted desc
//   getSellSignals() → tickers where score < −DEAD_ZONE, sorted asc
//
// A ticker can appear in EXACTLY ONE list (or neither, if its score is in
// the dead zone). META with 9 buyers + 5 sellers will not show up on both
// rankings — its dissent-adjusted unified score determines a single home.
//
// The legacy per-quarter buyer/seller details (BuyerEntry / SellerEntry,
// fresh-money share, exit share, dump severity, concentration bonus) are
// preserved as descriptive metadata for the UI pills and CSV exports — they
// describe what happened in the latest quarter, while the SCORE itself
// reflects the full multi-quarter time-decayed conviction model.

import { MANAGERS } from "./managers";
import { ALL_MOVES, getAllMovesEnriched, LATEST_QUARTER, type Move, type MoveAction, type Quarter } from "./moves";
import { TICKER_INDEX } from "./tickers";
import { getQualityScore as getROIQuality, getManagerROI } from "./manager-roi";
import {
  getConviction,
  getAllConvictionScores,
  convictionLabel,
  formatSignedScore,
  classifyScore,
  DEAD_ZONE,
} from "./conviction";

// Re-export the canonical helpers so consumers can import everything from
// `@/lib/signals` without having to know about the conviction module.
export { convictionLabel, formatSignedScore, classifyScore, DEAD_ZONE };

// ---------- MANAGER QUALITY SCORES ----------
// Curated 1-10 based on: track record length, known alpha vs S&P, reputation
// in the value-investing community, and size of capital deployed under the
// strategy. Not a judgment of the person — a weight for the signal model.
export const MANAGER_QUALITY: Record<string, number> = {
  "warren-buffett":        10, // 60+ yrs, ~20% CAGR over lifetime
  "stanley-druckenmiller":  9, // 30+ yrs, no losing year
  "seth-klarman":           9, // Margin of Safety, rare humility
  "howard-marks":           9, // The Oaktree memos, 30+ yrs distressed
  "chris-hohn":             9, // TCI — Buffett-class returns with concentration
  "chuck-akre":             9, // 3-legged-stool, 30+ yrs quality compounder picks
  "terry-smith":            9, // Fundsmith — "do nothing" discipline, 14% CAGR
  "stephen-mandel":         9, // Lone Pine — 12x over 27 years
  "bill-ackman":            8, // Concentrated, activist, big wins + losses
  "carl-icahn":             8, // 40+ yrs activist
  "li-lu":                  8, // Munger's protégé, China edge
  "joel-greenblatt":        8, // Magic Formula, 50% annual returns 1985-94
  "andreas-halvorsen":      8, // Viking — Tiger Cub, long-short pedigree
  "jeffrey-ubben":          8, // ValueAct — constructive activism
  "lee-ainslie":            8, // Maverick — 30+ yrs long-short
  "polen-capital":          8, // 25+ yrs concentrated quality growth
  "david-tepper":           9, // Appaloosa — ~30% annualized net, called 2009 bottom
  "chase-coleman":          8, // Tiger Global — survived '22, rebuilt strong
  "john-armitage":          9, // Egerton — 15%+ for three decades, under-the-radar discipline
  "david-rolfe":            9, // Wedgewood — Berkshire-style concentration at scale
  "francois-rochon":        9, // Giverny — 14%+ for 25 years, Buffett-disciplined
  "dev-kantesaria":         9, // Valley Forge — 5-8 positions only, 20%+ since '07
  "william-von-mueffling":  8, // Cantillon — Lazard pedigree, low drawdowns
  "tom-slater":             8, // Baillie Gifford LTGG — early Amazon/Tesla conviction
  "prem-watsa":             7, // Fairfax, the Canadian Buffett
  "bill-nygren":            7, // Oakmark Select, disciplined
  "glenn-greenberg":        7, // 8-10 position conviction, 22% 25yr
  "david-einhorn":          7, // Long-short value, famous shorts
  "michael-burry":          7, // Big Short, highly volatile
  "monish-pabrai":          6, // Clone-investor, smaller AUM
};

function mgrQuality(slug: string): number {
  // Derived ROI-based quality score takes priority over the hand-curated map.
  // Falls back to the curated number, then to a neutral 6.
  const roi = getROIQuality(slug);
  if (roi != null && roi > 0) return roi;
  return MANAGER_QUALITY[slug] ?? 6;
}

/**
 * v4.2 (2026-04-19) — canonical quality-score accessor.
 *
 * Call this instead of `MANAGER_QUALITY[slug] ?? 6` in new code. Prefers
 * the return-derived 10y-ROI quality when available, falls back to the
 * hand-curated MANAGER_QUALITY, then to a neutral 6.
 *
 * Audit (see `.claude/state/CONVICTION_AUDIT.md`) showed hand-coded
 * MANAGER_QUALITY correlates only 0.232 with derived quality. Every
 * UI surface that displays a quality badge via direct `MANAGER_QUALITY`
 * access is showing a score with known >3-point mean absolute delta
 * from the actually-calibrated one. Progressive migration: call sites
 * that wire in this helper get accurate scores; legacy call sites
 * stay unchanged to bound this ship's blast radius.
 */
export function getManagerQuality(slug: string): number {
  return mgrQuality(slug);
}

// ---------- TYPES ----------
export type BuyerEntry = {
  managerSlug: string;
  managerName: string;
  action: "new" | "add";
  weight: number;
  quality: number;
  deltaPct?: number;
  note?: string;
  /** The buyer's % of portfolio in this ticker, if it's one of their tracked holdings */
  positionPct?: number;
};

export type SellerEntry = {
  managerSlug: string;
  managerName: string;
  action: "trim" | "exit";
  weight: number;
  quality: number;
  deltaPct?: number;
  note?: string;
  positionPct?: number;
};

export type BuySignal = {
  ticker: string;
  name: string;
  sector?: string;
  buyerCount: number;
  rawWeight: number;        // sum of action weights (descriptive)
  qualityScore: number;     // sum of quality × weight (descriptive)
  concentrationBonus: number;
  freshMoneyShare: number;  // 0-1
  /** SIGNED unified conviction score — always > +DEAD_ZONE for items in this list. */
  score: number;
  buyers: BuyerEntry[];
};

export type SellSignal = {
  ticker: string;
  name: string;
  sector?: string;
  sellerCount: number;
  rawWeight: number;
  qualityScore: number;
  dumpSeverity: number;
  exitShare: number;        // 0-1
  /** SIGNED unified conviction score — always < −DEAD_ZONE for items in this list. */
  score: number;
  sellers: SellerEntry[];
};

const ACTION_WEIGHT: Record<MoveAction, number> = {
  new: 2,
  add: 1,
  trim: 1,
  exit: 2,
};

// ---------- HELPERS ----------
function resolveName(ticker: string): { name: string; sector?: string } {
  const sym = ticker.toUpperCase();
  const t = TICKER_INDEX[sym];
  if (t) return { name: t.name, sector: t.sector };
  for (const m of MANAGERS) {
    const h = m.topHoldings.find((hx) => hx.ticker.toUpperCase() === sym);
    if (h) return { name: h.name };
  }
  return { name: sym };
}

function positionPct(managerSlug: string, ticker: string): number | undefined {
  const mgr = MANAGERS.find((m) => m.slug === managerSlug);
  if (!mgr) return undefined;
  const h = mgr.topHoldings.find((hx) => hx.ticker.toUpperCase() === ticker.toUpperCase());
  return h?.pct;
}

// ---------- BUYER / SELLER METADATA EXTRACTION ----------
//
// Walk all moves in the requested quarter and group them by ticker, returning
// the BuyerEntry / SellerEntry arrays the UI needs for the manager pills.
// These are PURE descriptive data — no scoring happens here. The scoring
// happens in lib/conviction.ts and is read back in via getConviction().

function buildBuyerMap(quarter: Quarter): Record<string, BuyerEntry[]> {
  const enriched = getAllMovesEnriched();
  const all = enriched.filter((m) => (m.action === "new" || m.action === "add") && m.quarter === quarter);
  const grouped: Record<string, BuyerEntry[]> = {};
  for (const mv of all) {
    const sym = mv.ticker.toUpperCase();
    if (!grouped[sym]) grouped[sym] = [];
    grouped[sym].push({
      managerSlug: mv.managerSlug,
      managerName: mv.managerName,
      action: mv.action as "new" | "add",
      weight: ACTION_WEIGHT[mv.action],
      quality: mgrQuality(mv.managerSlug),
      deltaPct: mv.deltaPct,
      note: mv.note,
      positionPct: mv.portfolioImpactPct ?? positionPct(mv.managerSlug, mv.ticker),
    });
  }
  return grouped;
}

function buildSellerMap(quarter: Quarter): Record<string, SellerEntry[]> {
  const enriched = getAllMovesEnriched();
  const all = enriched.filter((m) => (m.action === "trim" || m.action === "exit") && m.quarter === quarter);
  const grouped: Record<string, SellerEntry[]> = {};
  for (const mv of all) {
    const sym = mv.ticker.toUpperCase();
    if (!grouped[sym]) grouped[sym] = [];
    grouped[sym].push({
      managerSlug: mv.managerSlug,
      managerName: mv.managerName,
      action: mv.action as "trim" | "exit",
      weight: ACTION_WEIGHT[mv.action],
      quality: mgrQuality(mv.managerSlug),
      deltaPct: mv.deltaPct,
      note: mv.note,
      positionPct: mv.portfolioImpactPct ?? positionPct(mv.managerSlug, mv.ticker),
    });
  }
  return grouped;
}

// ---------- BUY SIGNALS (unified score, score > +DEAD_ZONE only) ----------
//
// Returns every ticker whose unified conviction score is positive enough to
// be a meaningful BUY signal. Score is the SIGNED −100..+100 value from
// getConviction() — for items in this list it's always > +DEAD_ZONE.
//
// Each ticker also carries the latest-quarter buyer pills for the UI. If a
// ticker has buyers this quarter but its conviction score is in the dead
// zone (mixed signals — strong dissent cancels the buys), it is NOT shown
// here. Conversely, a ticker with strong historical buyers + insider buys
// but no fresh Q4 activity can still appear (with an empty pill list).
export function getBuySignals(quarter: Quarter = LATEST_QUARTER): BuySignal[] {
  const buyerMap = buildBuyerMap(quarter);
  const sigs: BuySignal[] = [];

  for (const c of getAllConvictionScores()) {
    if (c.score <= DEAD_ZONE) continue;
    const sym = c.ticker.toUpperCase();
    const buyers = (buyerMap[sym] ?? []).sort(
      (a, b) => b.quality * b.weight - a.quality * a.weight
    );
    const rawWeight = buyers.reduce((s, b) => s + b.weight, 0);
    const qualityScore = buyers.reduce((s, b) => s + b.quality * b.weight, 0);
    const concentrationBonus = buyers.some((b) => (b.positionPct ?? 0) >= 10) ? 10 : 0;
    const newCount = buyers.filter((b) => b.action === "new").length;
    const freshMoneyShare = buyers.length > 0 ? newCount / buyers.length : 0;

    sigs.push({
      ticker: sym,
      name: c.name,
      sector: c.sector,
      buyerCount: buyers.length,
      rawWeight,
      qualityScore,
      concentrationBonus,
      freshMoneyShare,
      score: c.score, // SIGNED positive
      buyers,
    });
  }

  return sigs.sort((a, b) => b.score - a.score);
}

// ---------- SELL SIGNALS (unified score, score < −DEAD_ZONE only) ----------
//
// Mirror of getBuySignals for the negative side of the scale. Returns tickers
// with conviction score < −DEAD_ZONE, sorted ASCENDING (most negative = top).
export function getSellSignals(quarter: Quarter = LATEST_QUARTER): SellSignal[] {
  const sellerMap = buildSellerMap(quarter);
  const sigs: SellSignal[] = [];

  for (const c of getAllConvictionScores()) {
    if (c.score >= -DEAD_ZONE) continue;
    const sym = c.ticker.toUpperCase();
    const sellers = (sellerMap[sym] ?? []).sort(
      (a, b) => b.quality * b.weight - a.quality * a.weight
    );
    const rawWeight = sellers.reduce((s, x) => s + x.weight, 0);
    const qualityScore = sellers.reduce((s, x) => s + x.quality * x.weight, 0);
    const dumpSeverity = sellers.reduce((s, x) => s + Math.abs(x.deltaPct ?? 0), 0);
    const exitCount = sellers.filter((x) => x.action === "exit").length;
    const exitShare = sellers.length > 0 ? exitCount / sellers.length : 0;

    sigs.push({
      ticker: sym,
      name: c.name,
      sector: c.sector,
      sellerCount: sellers.length,
      rawWeight,
      qualityScore,
      dumpSeverity,
      exitShare,
      score: c.score, // SIGNED negative
      sellers,
    });
  }

  return sigs.sort((a, b) => a.score - b.score); // most-negative first
}

// ---------- CONVENIENCE ----------
export function topBuy(): BuySignal | null {
  return getBuySignals()[0] || null;
}

export function topSell(): SellSignal | null {
  return getSellSignals()[0] || null;
}

export function getTickerSignals(ticker: string) {
  const sym = ticker.toUpperCase();
  const buy = getBuySignals().find((s) => s.ticker === sym);
  const sell = getSellSignals().find((s) => s.ticker === sym);
  return { buy, sell };
}

// ---------- GRAND PORTFOLIO ----------
/**
 * Consensus-weighted holdings across all tracked managers. A stock's weight
 * is the sum of (position % × manager_quality) across every manager that
 * holds it. This is HoldLens's answer to Dataroma's "Grand Portfolio" — but
 * weighted by manager quality, not raw %.
 */
export function getGrandPortfolio(): Array<{
  ticker: string;
  name: string;
  sector?: string;
  ownerCount: number;
  aggregatePct: number;
  weightedScore: number;
  topOwners: { slug: string; name: string; pct: number; quality: number }[];
}> {
  return Object.values(TICKER_INDEX)
    .map((t) => {
      const weightedScore = t.owners.reduce(
        (s, o) => s + o.pct * mgrQuality(o.slug),
        0
      );
      return {
        ticker: t.symbol,
        name: t.name,
        sector: t.sector,
        ownerCount: t.ownerCount,
        aggregatePct: t.totalConviction,
        weightedScore,
        topOwners: t.owners
          .slice()
          .sort((a, b) => b.pct * mgrQuality(b.slug) - a.pct * mgrQuality(a.slug))
          .slice(0, 5)
          .map((o) => ({ slug: o.slug, name: o.manager, pct: o.pct, quality: mgrQuality(o.slug) })),
      };
    })
    .sort((a, b) => {
      if (b.weightedScore !== a.weightedScore) return b.weightedScore - a.weightedScore;
      return b.ownerCount - a.ownerCount;
    });
}

// ---------- NET SIGNAL (unified score wrapper) ----------
//
// NetSignal is now a thin wrapper around the canonical ConvictionScore from
// lib/conviction.ts. The score is the SAME single −100..+100 value used by
// every other ranking — there is no separate "v2" scoring formula anymore.
// The breakdown surfaces the underlying conviction layers so the /signal
// dossier page can show the math behind the score.

export type NetSignal = {
  ticker: string;
  name: string;
  sector?: string;
  score: number;          // SIGNED −100..+100
  direction: "BUY" | "SELL" | "NEUTRAL";
  buyerCount: number;
  sellerCount: number;
  netFlow: number;        // raw count delta (latest quarter)
  buyers: BuyerEntry[];
  sellers: SellerEntry[];
  breakdown: {
    buyComponent: number;       // smartMoney + trackRecord + insider + concentration + trend + contrarian
    sellComponent: number;      // dissent penalty (positive number)
    dissentPenalty: number;     // alias of sellComponent
    unanimityBonus: number;     // contrarian / streak bonus from conviction
    qualityDifferential: number;
    informationDensity: number;
  };
  buyScore: number;             // positive contributors only
  sellScore: number;            // negative contributors only (positive number)
};

export function getNetSignal(ticker: string, quarter: Quarter = LATEST_QUARTER): NetSignal | null {
  const sym = ticker.toUpperCase();
  const c = getConviction(sym);

  // Pull the latest-quarter buyer / seller pills (independent of the score
  // model — they're descriptive metadata for the dossier page).
  const buyerMap = buildBuyerMap(quarter);
  const sellerMap = buildSellerMap(quarter);
  const buyers = (buyerMap[sym] ?? []).sort(
    (a, b) => b.quality * b.weight - a.quality * a.weight
  );
  const sellers = (sellerMap[sym] ?? []).sort(
    (a, b) => b.quality * b.weight - a.quality * a.weight
  );

  // Nothing to show: no historical activity AND no fresh activity.
  if (
    c.buyerCount === 0 &&
    c.sellerCount === 0 &&
    buyers.length === 0 &&
    sellers.length === 0
  ) {
    return null;
  }

  const ticker_data = TICKER_INDEX[sym];

  // Decompose the conviction breakdown into buy / sell halves so the
  // /signal page UI can render "+X buy components" and "−Y sell components".
  const buyComponent =
    c.breakdown.smartMoney +
    c.breakdown.insiderBoost +
    c.breakdown.trackRecord +
    c.breakdown.trendStreak +
    c.breakdown.concentration +
    c.breakdown.contrarian;
  const sellComponent = c.breakdown.dissentPenalty + c.breakdown.crowdingPenalty;
  const avgBuyerQ =
    buyers.length > 0 ? buyers.reduce((s, b) => s + b.quality, 0) / buyers.length : 0;
  const avgSellerQ =
    sellers.length > 0 ? sellers.reduce((s, b) => s + b.quality, 0) / sellers.length : 0;

  return {
    ticker: sym,
    name: c.name ?? ticker_data?.name ?? sym,
    sector: c.sector ?? ticker_data?.sector,
    score: c.score,             // SIGNED −100..+100, the canonical scale
    direction: c.direction,
    buyerCount: buyers.length,
    sellerCount: sellers.length,
    netFlow: buyers.length - sellers.length,
    buyers,
    sellers,
    breakdown: {
      buyComponent: Math.round(buyComponent),
      sellComponent: Math.round(sellComponent),
      dissentPenalty: Math.round(c.breakdown.dissentPenalty),
      unanimityBonus: Math.round(c.breakdown.contrarian + c.breakdown.trendStreak),
      qualityDifferential: Math.round(
        avgBuyerQ > 0 && avgSellerQ > 0 ? (avgBuyerQ - avgSellerQ) * 3 : 0
      ),
      informationDensity: Math.round(c.breakdown.smartMoney),
    },
    buyScore: Math.round(buyComponent),
    sellScore: Math.round(sellComponent),
  };
}

/** All net signals across all tracked tickers, sorted highest score first. */
export function getAllNetSignals(_quarter: Quarter = LATEST_QUARTER): NetSignal[] {
  void _quarter;
  const out: NetSignal[] = [];
  for (const c of getAllConvictionScores()) {
    const s = getNetSignal(c.ticker);
    if (s) out.push(s);
  }
  return out.sort((a, b) => b.score - a.score);
}

// ---------- RATING BADGE ----------
//
// Sign-aware rating label. Works with the SIGNED −100..+100 unified score.
// Buy-side and sell-side strengths mirror each other so a +45 BUY and a
// −45 SELL read as equal-strength signals.
export function ratingLabel(score: number): { label: string; color: string } {
  const abs = Math.abs(score);
  if (score > 0) {
    if (abs >= 70) return { label: "STRONG", color: "emerald" };
    if (abs >= 40) return { label: "HIGH", color: "emerald" };
    if (abs > DEAD_ZONE) return { label: "MODERATE", color: "amber" };
    return { label: "NEUTRAL", color: "muted" };
  }
  if (score < 0) {
    if (abs >= 70) return { label: "STRONG", color: "rose" };
    if (abs >= 40) return { label: "HIGH", color: "rose" };
    if (abs > DEAD_ZONE) return { label: "MODERATE", color: "amber" };
    return { label: "NEUTRAL", color: "muted" };
  }
  return { label: "NEUTRAL", color: "muted" };
}

// ---------- TREND DETECTION ----------
/**
 * Consecutive-quarter conviction trend for a given manager × ticker.
 * Counts how many of the last N quarters the manager has been buying (new/add)
 * or selling (trim/exit). A 3+ consecutive streak in the same direction is a
 * much stronger signal than a single quarter.
 */
export type TrendDirection = "buying" | "selling" | "mixed" | "none";

export function getManagerTickerTrend(
  managerSlug: string,
  ticker: string
): { direction: TrendDirection; streak: number; quarters: string[] } {
  const sym = ticker.toUpperCase();
  // v0.23: 8 quarters — oldest → newest. A manager with a 6Q buy streak across
  // the 2024→2025 boundary gets full credit now.
  const ordered = ([
    "2024-Q1",
    "2024-Q2",
    "2024-Q3",
    "2024-Q4",
    "2025-Q1",
    "2025-Q2",
    "2025-Q3",
    "2025-Q4",
  ] as const);
  const moves = ALL_MOVES.filter(
    (m) => m.managerSlug === managerSlug && m.ticker.toUpperCase() === sym
  );

  let streak = 0;
  let lastDir: TrendDirection = "none";
  const hitQuarters: string[] = [];

  // Walk forward through time, counting consecutive same-direction moves
  for (const q of ordered) {
    const mv = moves.find((m) => m.quarter === q);
    if (!mv) {
      // gap breaks the streak
      if (streak > 0) {
        // keep what we have if we already have a streak
      }
      continue;
    }
    const dir: TrendDirection = mv.action === "new" || mv.action === "add" ? "buying" : "selling";
    if (lastDir === dir) {
      streak++;
      hitQuarters.push(q);
    } else if (lastDir === "none") {
      lastDir = dir;
      streak = 1;
      hitQuarters.push(q);
    } else {
      // direction changed — reset
      lastDir = dir;
      streak = 1;
      hitQuarters.length = 0;
      hitQuarters.push(q);
    }
  }

  return { direction: lastDir, streak, quarters: hitQuarters };
}

/**
 * For a ticker, compute aggregate trending signals across all managers:
 *   - consecutive-quarter buyers count (managers with 3+ buy streak)
 *   - consecutive-quarter sellers count
 *   - net-flow (positive = more Q-on-Q buying than selling)
 */
export function getTickerTrend(ticker: string): {
  consistentBuyers: { slug: string; streak: number }[];
  consistentSellers: { slug: string; streak: number }[];
  netFlow: number;
} {
  const sym = ticker.toUpperCase();
  const perManagerMoves: Record<string, Move[]> = {};
  for (const mv of ALL_MOVES) {
    if (mv.ticker.toUpperCase() !== sym) continue;
    if (!perManagerMoves[mv.managerSlug]) perManagerMoves[mv.managerSlug] = [];
    perManagerMoves[mv.managerSlug].push(mv);
  }

  const consistentBuyers: { slug: string; streak: number }[] = [];
  const consistentSellers: { slug: string; streak: number }[] = [];
  let netFlow = 0;

  for (const slug of Object.keys(perManagerMoves)) {
    const trend = getManagerTickerTrend(slug, sym);
    if (trend.streak >= 2 && trend.direction === "buying") {
      consistentBuyers.push({ slug, streak: trend.streak });
    }
    if (trend.streak >= 2 && trend.direction === "selling") {
      consistentSellers.push({ slug, streak: trend.streak });
    }
    for (const mv of perManagerMoves[slug]) {
      if (mv.action === "new") netFlow += 2;
      else if (mv.action === "add") netFlow += 1;
      else if (mv.action === "trim") netFlow -= 1;
      else if (mv.action === "exit") netFlow -= 2;
    }
  }

  consistentBuyers.sort((a, b) => b.streak - a.streak);
  consistentSellers.sort((a, b) => b.streak - a.streak);
  return { consistentBuyers, consistentSellers, netFlow };
}
