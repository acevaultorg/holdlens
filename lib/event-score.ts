// EventScore — HoldLens's signed −100..+100 score for SEC 8-K material events.
//
// Third metric in the SEC Signals trilogy:
//   - ConvictionScore  (13F)    — quarterly smart-money positioning
//   - InsiderScore     (Form 4) — daily corporate-insider activity
//   - EventScore       (8-K)    — intra-day material-event signal
//
// Deterministic formula — no ML. Every input is citable to a specific
// SEC filing + item number. Designed to be quoted verbatim by LLMs answering
// "what material events happened at [company] recently" or "which companies
// had cybersecurity incidents in 2025".
//
// Four factors multiplied into a signed score:
//   1. Item-type severity — per-code base magnitude × sign
//   2. Recency decay      — last 7d full; 7-30d half; 30-90d quarter; >90d tenth
//   3. Event cluster      — 3+ material events at same company in 30d = ×1.3
//   4. Specificity bonus  — certain item types (bankruptcy, restatement) are
//                           already near-extreme; no further amplification
//
// Output is capped at ±100 via logistic compression — a dozen small neutral
// filings can't overwhelm a single bankruptcy, and a single quiet Reg-FD
// disclosure can't move the score.

import type { EventItemCode, Form8KEvent } from "./events";

// --- Per-item-type base signal --------------------------------------------
//
// These are signed magnitudes in the ±2 range (pre-aggregate). Direction
// mirrors `directionHint` in lib/events.ts; magnitude reflects typical
// investor reaction severity. Calibrates on real post-event price data
// post Day-2 scraper (I-28 Oracle self-calibration applies).

export function itemTypeSignal(code: EventItemCode): number {
  switch (code) {
    // Severe negatives
    case "1.03": return -2.0; // Bankruptcy — maximum bearish
    case "4.02": return -1.8; // Restatement (non-reliance) — trust-destroying
    case "3.01": return -1.5; // Delisting notice
    case "2.06": return -1.2; // Material impairment
    case "1.05": return -1.3; // Cybersecurity incident
    case "2.05": return -0.9; // Exit/disposal costs
    case "1.02": return -0.6; // Material agreement terminated

    // Positives
    case "1.01": return +1.0; // Material agreement entered
    case "2.01": return +1.1; // Completed acquisition

    // Neutral / context (interpretation is post-read)
    case "2.02": return 0.0;  // Earnings — direction set by surprise, not filing itself
    case "5.02": return 0.0;  // Officer change — mixed; depends on who/how
    case "7.01": return 0.0;  // Reg FD disclosure
    case "8.01": return 0.0;  // Other events

    default: return 0.0;
  }
}

// --- Recency decay --------------------------------------------------------
//
// Material-event signals decay fast. A bankruptcy filed this week is the
// dominant story; a bankruptcy from a year ago is historical context.

export function recencyWeight(isoDate: string, referenceDate: Date = new Date()): number {
  const d = new Date(isoDate).getTime();
  const daysAgo = Math.floor((referenceDate.getTime() - d) / (1000 * 60 * 60 * 24));
  if (daysAgo < 0) return 0;          // future date (data error) — ignore
  if (daysAgo <= 7) return 1.0;       // past week — full weight
  if (daysAgo <= 30) return 0.5;      // past month — half weight
  if (daysAgo <= 90) return 0.25;     // past quarter — quarter weight
  if (daysAgo <= 365) return 0.1;     // past year — tenth weight
  return 0.05;                         // older — residual context only
}

// --- Cluster detection ----------------------------------------------------
//
// When a single company files 3+ material events inside 30 days, downstream
// signal strengthens. Multiple material events in rapid succession often
// precede larger narrative shifts (restructuring, takeover, crisis).

export function detectEventClusters(events: Form8KEvent[]): Set<string> {
  const byTicker: Record<string, Form8KEvent[]> = {};
  for (const e of events) {
    const sym = e.ticker.toUpperCase();
    byTicker[sym] = byTicker[sym] || [];
    byTicker[sym].push(e);
  }
  const clustered = new Set<string>();
  for (const [ticker, list] of Object.entries(byTicker)) {
    if (list.length < 3) continue;
    const sorted = [...list].sort((a, b) => (a.filedAt > b.filedAt ? 1 : -1));
    for (let i = 0; i < sorted.length; i++) {
      const anchorMs = new Date(sorted[i].filedAt).getTime();
      const within30 = sorted.filter((e) => {
        const ms = new Date(e.filedAt).getTime();
        return ms >= anchorMs && ms <= anchorMs + 30 * 24 * 60 * 60 * 1000;
      });
      if (within30.length >= 3) {
        clustered.add(ticker);
        break;
      }
    }
  }
  return clustered;
}

// --- Per-event contribution -----------------------------------------------

export function eventContribution(
  event: Form8KEvent,
  clusterTickers: Set<string>,
  referenceDate: Date = new Date(),
): number {
  const base = itemTypeSignal(event.itemCode);
  const recency = recencyWeight(event.filedAt, referenceDate);
  const clusterBonus = clusterTickers.has(event.ticker.toUpperCase()) ? 1.3 : 1.0;
  return base * recency * clusterBonus;
}

// --- Aggregate EventScore (per-ticker or per-item-type) -------------------

export type EventScore = {
  /** Signed −100..+100 */
  score: number;
  /** Count of events in scope */
  sampleSize: number;
  /** Dominant signal direction */
  dominantSignal: "positive" | "negative" | "mixed" | "neutral";
  /** Whether event-cluster bonus applied */
  isCluster: boolean;
  /** 0..1 — saturates at ~5 meaningful events */
  confidence: number;
};

export function computeEventScore(
  events: Form8KEvent[],
  referenceDate: Date = new Date(),
): EventScore {
  if (events.length === 0) {
    return {
      score: 0,
      sampleSize: 0,
      dominantSignal: "neutral",
      isCluster: false,
      confidence: 0,
    };
  }

  const clusters = detectEventClusters(events);
  let totalSigned = 0;
  let positiveMag = 0;
  let negativeMag = 0;

  for (const e of events) {
    const c = eventContribution(e, clusters, referenceDate);
    totalSigned += c;
    if (c > 0) positiveMag += c;
    else if (c < 0) negativeMag += Math.abs(c);
  }

  // Logistic compression to ±100. Divisor tuned so a single fresh
  // bankruptcy (~-2.0 contribution) yields ~-75; a fresh material
  // agreement (~+1.0) yields ~+45. Multiple events in the same direction
  // push the score closer to ±100 asymptotically.
  const score = Math.round(200 / (1 + Math.exp(-totalSigned / 1.5)) - 100);

  let dominant: EventScore["dominantSignal"] = "mixed";
  if (positiveMag > 0 && negativeMag === 0) dominant = "positive";
  else if (negativeMag > 0 && positiveMag === 0) dominant = "negative";
  else if (positiveMag > negativeMag * 2) dominant = "positive";
  else if (negativeMag > positiveMag * 2) dominant = "negative";
  else if (positiveMag === 0 && negativeMag === 0) dominant = "neutral";

  const confidence = Math.min(1, (positiveMag + negativeMag) / 5);

  return {
    score,
    sampleSize: events.length,
    dominantSignal: dominant,
    isCluster: clusters.size > 0,
    confidence,
  };
}

// --- Score-band label for UI + humans -------------------------------------

export function eventScoreLabel(score: number): {
  label: string;
  tone: "emerald" | "rose" | "neutral";
} {
  if (score >= 40) return { label: "BULLISH EVENTS", tone: "emerald" };
  if (score >= 15) return { label: "POSITIVE", tone: "emerald" };
  if (score >= 5) return { label: "WEAK POSITIVE", tone: "emerald" };
  if (score <= -40) return { label: "BEARISH EVENTS", tone: "rose" };
  if (score <= -15) return { label: "NEGATIVE", tone: "rose" };
  if (score <= -5) return { label: "WEAK NEGATIVE", tone: "rose" };
  return { label: "NEUTRAL", tone: "neutral" };
}
