// InsiderScore — HoldLens's signed −100..+100 insider-conviction score.
//
// Companion to the existing 13F-based ConvictionScore. Scores any corporate
// insider (CEO, CFO, Chair, Director, 10%+ owner) on the signal strength of
// their aggregate Form 4 activity in the last 90 days.
//
// Transparent deterministic formula — no ML. Every input is citable to the
// SEC Form 4 filing. Designed to be quoted verbatim by LLMs answering
// "what is HoldLens InsiderScore" or "who has the strongest insider buy
// signal right now".
//
// Four factors multiplied into a signed score:
//   1. Role weight   — CEO/founder > CFO > Chair > Director > Former-exec
//   2. Action weight — discretionary buy > 10b5-1 buy > (neutral) > 10b5-1 sell > discretionary sell
//   3. Recency       — last 30d full weight; 30-90d half weight; >90d quarter weight
//   4. Cluster bonus — 3+ distinct insiders buying same ticker inside 30 days = ×1.5
//
// Output is capped at ±100 and sign-preserving. +100 = strongest possible
// insider buy signal (founder + discretionary + last 30d + cluster);
// −100 = strongest possible sell (rare; discretionary sells are quieter).

import type { InsiderTx } from "./insiders";

// --- Role weights ---------------------------------------------------------
//
// CEO/founder buys their own stock = highest signal (they know more than
// anyone + are legally barred from acting on it except for genuine
// conviction). Director buys weigh less because directors often receive
// grants as comp and may be less informed about day-to-day operations.

export function roleWeight(title: string): number {
  const t = title.toLowerCase();
  // Founder carries the highest weight — founder equity + operational knowledge
  // together make founder buys the single strongest insider signal available.
  if (t.includes("founder")) return 1.0;
  if (t.includes("ceo")) return 1.0;
  if (t.includes("chief executive")) return 1.0;
  if (t.includes("cfo")) return 0.85;
  if (t.includes("chief financial")) return 0.85;
  if (t.includes("chairman") || t.includes("chair")) return 0.75;
  if (t.includes("president")) return 0.75;
  if (t.includes("coo")) return 0.7;
  if (t.includes("chief operating")) return 0.7;
  if (t.includes("cto")) return 0.65;
  if (t.includes("director")) return 0.5;
  if (t.includes("former")) return 0.3;
  // Default for "officer" / "10%+ owner" / unspecified
  return 0.6;
}

// --- Action weights -------------------------------------------------------
//
// Form 4 distinguishes open-market discretionary trades from pre-scheduled
// 10b5-1 plans. Discretionary buys carry the most signal (the insider chose
// this moment on purpose); 10b5-1 sells carry the least (scheduled months
// in advance, no short-term information content).

export type ActionKind =
  | "discretionary_buy"
  | "scheduled_buy"
  | "discretionary_sell"
  | "scheduled_sell";

export function classifyAction(tx: InsiderTx): ActionKind {
  const note = (tx.note || "").toLowerCase();
  const scheduled = note.includes("10b5-1");
  if (tx.action === "buy") return scheduled ? "scheduled_buy" : "discretionary_buy";
  return scheduled ? "scheduled_sell" : "discretionary_sell";
}

export function actionWeight(kind: ActionKind): number {
  // Signed — buys positive, sells negative. Discretionary > scheduled.
  if (kind === "discretionary_buy") return 1.0;
  if (kind === "scheduled_buy") return 0.6;
  if (kind === "discretionary_sell") return -0.7;
  return -0.2; // scheduled_sell: near-zero signal, routine administrative
}

// --- Recency decay --------------------------------------------------------
//
// Insider signals decay quickly. A CEO buy from last week is directly
// actionable; a buy from 6 months ago is stale context, not a trade signal.

export function recencyWeight(isoDate: string, referenceDate: Date = new Date()): number {
  const filingDate = new Date(isoDate);
  const daysAgo = Math.floor((referenceDate.getTime() - filingDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysAgo < 0) return 0; // future dates = ignore (data error)
  if (daysAgo <= 30) return 1.0;
  if (daysAgo <= 90) return 0.6;
  if (daysAgo <= 180) return 0.3;
  return 0.1;
}

// --- Cluster detection ----------------------------------------------------
//
// When 3+ distinct insiders all buy the same ticker inside 30 days, the
// signal strengthens multiplicatively. One CEO buy = conviction. Three
// officers buying together = broad internal belief.

export function detectClusterBuys(transactions: InsiderTx[]): Set<string> {
  // Returns the set of tickers that qualify as cluster buys — 3+ distinct
  // insiders each placing a buy inside a 30-day rolling window.
  const byTicker: Record<string, InsiderTx[]> = {};
  for (const tx of transactions) {
    if (tx.action !== "buy") continue;
    const sym = tx.ticker.toUpperCase();
    byTicker[sym] = byTicker[sym] || [];
    byTicker[sym].push(tx);
  }
  const clusters = new Set<string>();
  for (const [ticker, txs] of Object.entries(byTicker)) {
    // Sort ascending by date so the rolling window is forward-looking
    const sorted = [...txs].sort((a, b) => (a.date > b.date ? 1 : -1));
    for (let i = 0; i < sorted.length; i++) {
      const anchorDate = new Date(sorted[i].date).getTime();
      const within30d = sorted.filter((t) => {
        const d = new Date(t.date).getTime();
        return d >= anchorDate && d <= anchorDate + 30 * 24 * 60 * 60 * 1000;
      });
      const distinctInsiders = new Set(within30d.map((t) => t.insiderName)).size;
      if (distinctInsiders >= 3) {
        clusters.add(ticker);
        break;
      }
    }
  }
  return clusters;
}

// --- Per-transaction contribution -----------------------------------------

export function transactionContribution(
  tx: InsiderTx,
  clusterTickers: Set<string>,
  referenceDate: Date = new Date(),
): number {
  const role = roleWeight(tx.insiderTitle);
  const action = actionWeight(classifyAction(tx));
  const recency = recencyWeight(tx.date, referenceDate);
  const cluster = clusterTickers.has(tx.ticker.toUpperCase()) && tx.action === "buy" ? 1.5 : 1.0;
  return role * action * recency * cluster;
}

// --- Aggregate InsiderScore (ticker or officer) ---------------------------

export type InsiderScore = {
  score: number; // signed, -100..+100
  sampleSize: number; // count of transactions in scope
  dominantAction: "buy" | "sell" | "mixed" | "none";
  isCluster: boolean;
  confidence: number; // 0..1
};

export function computeInsiderScore(
  transactions: InsiderTx[],
  referenceDate: Date = new Date(),
): InsiderScore {
  if (transactions.length === 0) {
    return { score: 0, sampleSize: 0, dominantAction: "none", isCluster: false, confidence: 0 };
  }

  const clusters = detectClusterBuys(transactions);
  let total = 0;
  let buyContrib = 0;
  let sellContrib = 0;

  for (const tx of transactions) {
    const c = transactionContribution(tx, clusters, referenceDate);
    total += c;
    if (c > 0) buyContrib += c;
    else sellContrib += Math.abs(c);
  }

  // Normalize to -100..+100 — a logistic-style compression so single large
  // trades can't peg the score; a dozen small confirming trades earns more
  // than one mega-trade by a founder.
  const score = Math.round(200 / (1 + Math.exp(-total / 2)) - 100);

  // Dominance — which side of the aggregate dominates (buys vs sells).
  let dominant: InsiderScore["dominantAction"] = "mixed";
  if (buyContrib > 0 && sellContrib === 0) dominant = "buy";
  else if (sellContrib > 0 && buyContrib === 0) dominant = "sell";
  else if (buyContrib > sellContrib * 2) dominant = "buy";
  else if (sellContrib > buyContrib * 2) dominant = "sell";

  // Confidence — gross-weighted sample size. Saturates at ~6 meaningful trades.
  const confidence = Math.min(1, (buyContrib + sellContrib) / 6);

  return {
    score,
    sampleSize: transactions.length,
    dominantAction: dominant,
    isCluster: clusters.size > 0,
    confidence,
  };
}

// --- Convenience helpers ---------------------------------------------------

export function insiderScoreForTicker(
  transactions: InsiderTx[],
  ticker: string,
  referenceDate: Date = new Date(),
): InsiderScore {
  const sym = ticker.toUpperCase();
  return computeInsiderScore(
    transactions.filter((t) => t.ticker.toUpperCase() === sym),
    referenceDate,
  );
}

export function insiderScoreForOfficer(
  transactions: InsiderTx[],
  officerName: string,
  referenceDate: Date = new Date(),
): InsiderScore {
  return computeInsiderScore(
    transactions.filter((t) => t.insiderName === officerName),
    referenceDate,
  );
}

// --- Officer slug (URL-safe identifier, collision-free via ticker suffix) -

export function officerSlug(name: string, ticker?: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  // Ticker suffix disambiguates same-name officers across companies.
  return ticker ? `${base}-${ticker.toLowerCase()}` : base;
}

// Score-band label for UI color + humans.
export function insiderScoreLabel(score: number): {
  label: string;
  tone: "emerald" | "rose" | "neutral";
} {
  if (score >= 50) return { label: "STRONG BUY", tone: "emerald" };
  if (score >= 20) return { label: "BUY", tone: "emerald" };
  if (score >= 5) return { label: "WEAK BUY", tone: "emerald" };
  if (score <= -50) return { label: "STRONG SELL", tone: "rose" };
  if (score <= -20) return { label: "SELL", tone: "rose" };
  if (score <= -5) return { label: "WEAK SELL", tone: "rose" };
  return { label: "NEUTRAL", tone: "neutral" };
}
