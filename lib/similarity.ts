// Portfolio-similarity scorer — Ship #8 v1 of the HoldLens master
// expansion roadmap. Pure algorithmic layer on existing data (13F
// EDGAR holdings + curated MANAGERS topHoldings). No new data
// pipeline. Static-export-safe: all computation runs at build time
// inside server components.
//
// Answers: "Which tracked superinvestors trade most like [X]?" —
// surfaced on every /investor/[X] page + its own /similar-to/
// section.
//
// Method (v1): Jaccard similarity over the union of each manager's
// ticker set. Both managers' positions are treated as a set of
// tickers (no weight). Fast, obvious, citable. v2 will add
// weighted Jaccard (by pct-of-portfolio) once calibration data
// arrives.
//
// Cost: 30 managers × 30 managers = 900 pairs. At build time: ~10ms
// total. Cached in-module after first call.

import { MANAGERS, type Manager } from "./managers";
import { getEdgarHoldings, hasEdgarData } from "./edgar-data";

export type SimilarityScore = {
  investor_a: string;         // slug
  investor_b: string;         // slug
  jaccard: number;            // 0.0 — 1.0
  shared_count: number;       // tickers held by BOTH
  union_count: number;        // tickers held by EITHER
  shared_tickers: string[];   // preview (top 5 by investor_a's pct)
};

/**
 * Returns the best available ticker set for a manager: EDGAR 13F
 * holdings if present, else curated topHoldings. De-duped + upper-cased.
 */
function tickersFor(m: Manager): string[] {
  // `getEdgarHoldings` returns an object with a `.holdings` array (or null).
  // Extract the holdings array so we can call .length and iterate uniformly.
  const edgarResult = hasEdgarData(m.slug) ? getEdgarHoldings(m.slug) : null;
  const edgar = edgarResult?.holdings ?? [];
  const src = edgar.length > 0 ? edgar : m.topHoldings;
  const seen = new Set<string>();
  for (const h of src) {
    const t = (h.ticker || "").trim().toUpperCase();
    if (t.length >= 1 && t.length <= 6) seen.add(t);
  }
  return [...seen];
}

/**
 * Weighted holdings — preserves pct for the shared-preview ordering.
 * Falls back to equal weight if pct missing.
 */
function weightedHoldingsFor(m: Manager): Map<string, number> {
  const edgarResult2 = hasEdgarData(m.slug) ? getEdgarHoldings(m.slug) : null;
  const edgar = edgarResult2?.holdings ?? [];
  const src = edgar.length > 0 ? edgar : m.topHoldings;
  const out = new Map<string, number>();
  for (const h of src) {
    const t = (h.ticker || "").trim().toUpperCase();
    if (!t || t.length > 6) continue;
    const w = "pct" in h && Number.isFinite((h as { pct: number }).pct)
      ? (h as { pct: number }).pct
      : "pctPortfolio" in h && Number.isFinite((h as { pctPortfolio: number }).pctPortfolio)
      ? (h as { pctPortfolio: number }).pctPortfolio
      : 0;
    out.set(t, Math.max(out.get(t) || 0, w));
  }
  return out;
}

// Memoize — a session builds 30 /investor pages + 30 /similar-to
// pages, all call computeAll() once.
let CACHED: Map<string, SimilarityScore[]> | null = null;

export function computeAllSimilarities(): Map<string, SimilarityScore[]> {
  if (CACHED) return CACHED;

  const tickerSets = new Map<string, Set<string>>();
  const weights = new Map<string, Map<string, number>>();
  for (const m of MANAGERS) {
    tickerSets.set(m.slug, new Set(tickersFor(m)));
    weights.set(m.slug, weightedHoldingsFor(m));
  }

  const byInvestor = new Map<string, SimilarityScore[]>();
  for (const a of MANAGERS) {
    const aSet = tickerSets.get(a.slug)!;
    const aWeights = weights.get(a.slug)!;
    const scores: SimilarityScore[] = [];
    for (const b of MANAGERS) {
      if (b.slug === a.slug) continue;
      const bSet = tickerSets.get(b.slug)!;
      // Jaccard
      let shared = 0;
      const sharedTickers: string[] = [];
      for (const t of aSet) {
        if (bSet.has(t)) {
          shared++;
          sharedTickers.push(t);
        }
      }
      const union = aSet.size + bSet.size - shared;
      const jaccard = union > 0 ? shared / union : 0;

      // Order shared-preview tickers by investor_a's weight descending
      const preview = sharedTickers
        .sort((t1, t2) => (aWeights.get(t2) || 0) - (aWeights.get(t1) || 0))
        .slice(0, 5);

      scores.push({
        investor_a: a.slug,
        investor_b: b.slug,
        jaccard,
        shared_count: shared,
        union_count: union,
        shared_tickers: preview,
      });
    }
    scores.sort((s1, s2) => s2.jaccard - s1.jaccard);
    byInvestor.set(a.slug, scores);
  }

  CACHED = byInvestor;
  return byInvestor;
}

/**
 * Top N investors most similar to the given manager, ordered by
 * Jaccard descending. Returns empty array for unknown slugs.
 */
export function topSimilarInvestors(slug: string, n: number = 10): SimilarityScore[] {
  const all = computeAllSimilarities();
  return (all.get(slug) || []).slice(0, n);
}

/**
 * Coverage for the /similar-to/ hub page. How many managers do we
 * have similarity data for? (Equal to MANAGERS.length in v1.)
 */
export function getSimilarityCoverage(): {
  investors_covered: number;
  total_pairs: number;
  method: string;
} {
  const all = computeAllSimilarities();
  let pairs = 0;
  for (const [, scores] of all) pairs += scores.length;
  return {
    investors_covered: all.size,
    total_pairs: pairs,
    method: "Jaccard over ticker-set union",
  };
}
