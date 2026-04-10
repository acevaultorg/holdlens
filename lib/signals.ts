// Buy/Sell Recommendation Engine — multi-factor signal computation.
//
// This is the core "what to buy / what to sell" model. A signal fires when
// tracked managers take the same direction on the same ticker in the same
// quarter. Strength is a weighted combination of multiple factors, not just
// a raw count.
//
// FACTORS (buy side):
//   1. Consensus weight:       sum of action weights across buyers
//                              new=2, add=1   (new conviction > adding to existing)
//   2. Manager quality:        sum of (quality × weight) across buyers
//                              A Buffett buy weighs more than an unknown buy.
//   3. Concentration:          bonus if any buyer holds >10% in this ticker
//                              (they put real money behind the conviction)
//   4. Fresh-money share:      % of buyers who are NEW positions vs adds
//                              (new positions = higher conviction than adds)
//
// FACTORS (sell side):
//   1. Consensus weight:       sum of action weights across sellers
//                              exit=2, trim=1   (fully out > trimming)
//   2. Manager quality:        same as buy
//   3. Dump severity:          sum of |deltaPct| where present
//   4. Exit share:             % of sellers who fully exited vs trimmed
//
// Score is normalized 0-100 so the badge reads like a rating.

import { MANAGERS } from "./managers";
import { ALL_MOVES, getAllMovesEnriched, LATEST_QUARTER, type Move, type MoveAction, type Quarter } from "./moves";
import { TICKER_INDEX } from "./tickers";
import { getQualityScore as getROIQuality, getManagerROI } from "./manager-roi";

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
  rawWeight: number;        // sum of action weights
  qualityScore: number;     // sum of quality × weight
  concentrationBonus: number;
  freshMoneyShare: number;  // 0-1
  score: number;            // 0-100 composite
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
  score: number;            // 0-100 composite
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

// ---------- BUY SIGNALS ----------
export function getBuySignals(quarter: Quarter = LATEST_QUARTER): BuySignal[] {
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

  // First pass: raw factors
  const pre: Omit<BuySignal, "score">[] = Object.entries(grouped).map(([ticker, buyers]) => {
    const { name, sector } = resolveName(ticker);
    const rawWeight = buyers.reduce((s, b) => s + b.weight, 0);
    const qualityScore = buyers.reduce((s, b) => s + b.quality * b.weight, 0);
    const concentrationBonus = buyers.some((b) => (b.positionPct ?? 0) >= 10) ? 10 : 0;
    const newCount = buyers.filter((b) => b.action === "new").length;
    const freshMoneyShare = newCount / buyers.length;
    return {
      ticker,
      name,
      sector,
      buyerCount: buyers.length,
      rawWeight,
      qualityScore,
      concentrationBonus,
      freshMoneyShare,
      buyers: buyers.sort((a, b) => b.quality * b.weight - a.quality * a.weight),
    };
  });

  // Normalize to 0-100
  const maxQuality = Math.max(1, ...pre.map((s) => s.qualityScore));
  const signals: BuySignal[] = pre.map((s) => {
    const normQuality = (s.qualityScore / maxQuality) * 70; // 70 pts max
    const consensus = Math.min(20, s.buyerCount * 7);       // 20 pts max, 3+ buyers caps
    const fresh = s.freshMoneyShare * 10;                   // 10 pts max
    const conc = s.concentrationBonus;                      // already 0 or 10
    const score = Math.round(Math.min(100, normQuality + consensus + fresh + conc));
    return { ...s, score };
  });

  return signals.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.buyerCount !== a.buyerCount) return b.buyerCount - a.buyerCount;
    return b.qualityScore - a.qualityScore;
  });
}

// ---------- SELL SIGNALS ----------
export function getSellSignals(quarter: Quarter = LATEST_QUARTER): SellSignal[] {
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

  const pre: Omit<SellSignal, "score">[] = Object.entries(grouped).map(([ticker, sellers]) => {
    const { name, sector } = resolveName(ticker);
    const rawWeight = sellers.reduce((s, x) => s + x.weight, 0);
    const qualityScore = sellers.reduce((s, x) => s + x.quality * x.weight, 0);
    const dumpSeverity = sellers.reduce((s, x) => s + Math.abs(x.deltaPct ?? 0), 0);
    const exitCount = sellers.filter((x) => x.action === "exit").length;
    const exitShare = exitCount / sellers.length;
    return {
      ticker,
      name,
      sector,
      sellerCount: sellers.length,
      rawWeight,
      qualityScore,
      dumpSeverity,
      exitShare,
      sellers: sellers.sort((a, b) => b.quality * b.weight - a.quality * a.weight),
    };
  });

  const maxQuality = Math.max(1, ...pre.map((s) => s.qualityScore));
  const signals: SellSignal[] = pre.map((s) => {
    const normQuality = (s.qualityScore / maxQuality) * 65;
    const consensus = Math.min(15, s.sellerCount * 6);
    const exits = s.exitShare * 10;
    const severity = Math.min(10, s.dumpSeverity / 10);
    const score = Math.round(Math.min(100, normQuality + consensus + exits + severity));
    return { ...s, score };
  });

  return signals.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.sellerCount !== a.sellerCount) return b.sellerCount - a.sellerCount;
    return b.qualityScore - a.qualityScore;
  });
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

// ---------- NET SIGNAL v2 ----------
//
// The Net Signal Score synthesizes buy + sell signals into a single number.
// Answers the question: "is this stock a better buy than that one?"
//
// Formula:
//   net = BuyScore - (SellScore × 0.6 dissent penalty)
//       + UnanimityBonus  (+15 if 0 sellers and ≥3 buyers)
//       + QualityDifferential ((avgBuyerQ − avgSellerQ) × 3)
//       + InformationDensity  (log2(totalActions+1) × 4)
//       clamped −100 to +100
//
// Why each component:
//   - BuyScore: existing 4-factor score from getBuySignals (the consensus)
//   - SellScore × 0.6: dissent partially offsets buys. Not 1:1 because buying
//     requires more conviction than trimming (sells include rebalances).
//   - UnanimityBonus: 5/0 unanimous beats 15/10 mixed even at the same net flow.
//   - QualityDifferential: Tier-1 buyers vs Tier-2 sellers >> opposite.
//   - InformationDensity: more total actions = more confidence in the signal direction.
//
// See getNetSignal(ticker) for the breakdown — every term is exposed for /signal page UI.

export type NetSignal = {
  ticker: string;
  name: string;
  sector?: string;
  score: number;          // -100 to +100
  direction: "BUY" | "SELL" | "NEUTRAL";
  buyerCount: number;
  sellerCount: number;
  netFlow: number;        // raw count delta
  buyers: BuyerEntry[];
  sellers: SellerEntry[];
  breakdown: {
    buyComponent: number;
    sellComponent: number;
    dissentPenalty: number;
    unanimityBonus: number;
    qualityDifferential: number;
    informationDensity: number;
  };
  // The raw component scores for transparency
  buyScore: number;
  sellScore: number;
};

export function getNetSignal(ticker: string, quarter: Quarter = LATEST_QUARTER): NetSignal | null {
  const sym = ticker.toUpperCase();
  const buys = getBuySignals(quarter);
  const sells = getSellSignals(quarter);
  const buy = buys.find((s) => s.ticker === sym);
  const sell = sells.find((s) => s.ticker === sym);

  if (!buy && !sell) return null;

  const buyScore = buy?.score ?? 0;
  const sellScore = sell?.score ?? 0;
  const buyerCount = buy?.buyerCount ?? 0;
  const sellerCount = sell?.sellerCount ?? 0;

  // Average buyer / seller quality
  const avgBuyerQ =
    buy && buy.buyers.length > 0
      ? buy.buyers.reduce((s, b) => s + b.quality, 0) / buy.buyers.length
      : 0;
  const avgSellerQ =
    sell && sell.sellers.length > 0
      ? sell.sellers.reduce((s, b) => s + b.quality, 0) / sell.sellers.length
      : 0;

  // Components
  const buyComponent = buyScore;
  const sellComponent = sellScore;
  const dissentPenalty = sellScore * 0.6;
  const unanimityBonus = sellerCount === 0 && buyerCount >= 3 ? 15 : 0;
  const qualityDifferential =
    avgBuyerQ > 0 && avgSellerQ > 0 ? (avgBuyerQ - avgSellerQ) * 3 : 0;
  const totalActions = buyerCount + sellerCount;
  const informationDensity = Math.log2(totalActions + 1) * 4;

  let raw = buyComponent - dissentPenalty + unanimityBonus + qualityDifferential + informationDensity;
  // If purely a sell, the raw is negative — invert for sell direction
  if (buyerCount === 0 && sellerCount > 0) {
    raw = -(sellComponent + sellComponent * 0.2 + (sellerCount >= 3 ? 10 : 0) + informationDensity);
  }

  const score = Math.max(-100, Math.min(100, raw));

  let direction: "BUY" | "SELL" | "NEUTRAL" = "NEUTRAL";
  if (score >= 30) direction = "BUY";
  else if (score <= -30) direction = "SELL";

  const ticker_data = TICKER_INDEX[sym];

  return {
    ticker: sym,
    name: buy?.name ?? sell?.name ?? ticker_data?.name ?? sym,
    sector: buy?.sector ?? sell?.sector ?? ticker_data?.sector,
    score: Math.round(score),
    direction,
    buyerCount,
    sellerCount,
    netFlow: buyerCount - sellerCount,
    buyers: buy?.buyers ?? [],
    sellers: sell?.sellers ?? [],
    breakdown: {
      buyComponent: Math.round(buyComponent),
      sellComponent: Math.round(sellComponent),
      dissentPenalty: Math.round(dissentPenalty),
      unanimityBonus,
      qualityDifferential: Math.round(qualityDifferential),
      informationDensity: Math.round(informationDensity),
    },
    buyScore: Math.round(buyScore),
    sellScore: Math.round(sellScore),
  };
}

/** All net signals across the latest quarter, sorted highest score first. */
export function getAllNetSignals(quarter: Quarter = LATEST_QUARTER): NetSignal[] {
  // Build a set of every ticker that had any move this quarter
  const enriched = getAllMovesEnriched();
  const tickers = new Set<string>();
  for (const m of enriched) {
    if (m.quarter === quarter) tickers.add(m.ticker.toUpperCase());
  }
  const out: NetSignal[] = [];
  for (const t of tickers) {
    const s = getNetSignal(t, quarter);
    if (s) out.push(s);
  }
  return out.sort((a, b) => b.score - a.score);
}

// ---------- RATING BADGE ----------
export function ratingLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "STRONG", color: "emerald" };
  if (score >= 60) return { label: "HIGH", color: "emerald" };
  if (score >= 40) return { label: "MODERATE", color: "amber" };
  if (score >= 20) return { label: "LOW", color: "slate" };
  return { label: "MINIMAL", color: "slate" };
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
  const ordered = (["2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4"] as const);
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
