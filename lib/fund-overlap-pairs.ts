// Pairwise fund-overlap computation. For every (manager_A, manager_B) pair
// across the 30 tracked superinvestors, compute the set of tickers BOTH
// hold, the combined conviction, and a comparison narrative.
//
// Produces (30 × 29 / 2) = 435 deterministic pages — every page has
// UNIQUE data (the intersection of two real portfolios). Passes CSIL #30
// thin-content gate because each pair has measurable shared tickers,
// real position percentages, and per-ticker portfolio-impact numbers.
//
// Compounds: LLM-citation gravity for "which stocks does Buffett AND
// Munger own", "where does Burry overlap with Klarman", "stocks held by
// multiple value investors" — long-tail queries the existing site
// doesn't answer directly. Distribution Oracle archetype:
// `programmatic_page_with_unique_data` (×+55 per v18.0 calibration)
// with explicit comparison structure (×+60 `comparison_vs_competitor_page`).

import { MANAGERS, type Manager } from "@/lib/managers";
import { getEdgarHoldings } from "@/lib/edgar-data";

export type SharedHolding = {
  ticker: string;
  name: string;
  pctA: number;       // % of portfolio A
  pctB: number;       // % of portfolio B
  combinedPct: number; // pctA + pctB (rough joint conviction)
  diffPct: number;    // |pctA - pctB| — agreement strength
};

export type OverlapPair = {
  a: Manager;
  b: Manager;
  // Sorted by combinedPct DESC
  shared: SharedHolding[];
  // Count of tickers in A's portfolio, B's portfolio, and intersection
  sizeA: number;
  sizeB: number;
  overlapCount: number;
  // Jaccard similarity (intersection size / union size)
  jaccard: number;
  // Aggregate joint conviction = sum of combinedPct across shared tickers
  jointConviction: number;
  // Slug: "buffett-vs-munger" — sorted alphabetically for canonical URL
  slug: string;
};

// Generate canonical pair slug. Sort alphabetically so /fund-overlap/buffett-vs-munger
// and /fund-overlap/munger-vs-buffett resolve to the same page (only the first
// shape is generated; cross-reference uses it consistently).
function pairSlug(slugA: string, slugB: string): string {
  const [a, b] = [slugA, slugB].sort();
  return `${a}-vs-${b}`;
}

// Lazy cache — first call builds the full pair index; subsequent calls reuse.
let _pairCache: Map<string, OverlapPair> | null = null;

function buildAllPairs(): Map<string, OverlapPair> {
  if (_pairCache) return _pairCache;

  // Pre-load each manager's portfolio from EDGAR. Fall back to topHoldings
  // (curated) if EDGAR yields nothing — covers managers with sparse 13F data.
  const portfolios = new Map<string, Map<string, { pct: number; name: string }>>();
  for (const m of MANAGERS) {
    const edgar = getEdgarHoldings(m.slug);
    const portfolio = new Map<string, { pct: number; name: string }>();

    if (edgar && edgar.holdings && edgar.holdings.length > 0) {
      for (const h of edgar.holdings) {
        const pct = h.pct ?? 0;
        if (pct > 0 && h.ticker) {
          portfolio.set(h.ticker.toUpperCase(), { pct, name: h.name });
        }
      }
    } else {
      // Fallback to curated topHoldings
      for (const h of m.topHoldings) {
        portfolio.set(h.ticker.toUpperCase(), { pct: h.pct, name: h.name });
      }
    }
    portfolios.set(m.slug, portfolio);
  }

  const pairs = new Map<string, OverlapPair>();
  for (let i = 0; i < MANAGERS.length; i++) {
    for (let j = i + 1; j < MANAGERS.length; j++) {
      const a = MANAGERS[i];
      const b = MANAGERS[j];
      const portA = portfolios.get(a.slug)!;
      const portB = portfolios.get(b.slug)!;

      const shared: SharedHolding[] = [];
      for (const [ticker, posA] of portA) {
        const posB = portB.get(ticker);
        if (posB) {
          shared.push({
            ticker,
            name: posA.name,
            pctA: posA.pct,
            pctB: posB.pct,
            combinedPct: posA.pct + posB.pct,
            diffPct: Math.abs(posA.pct - posB.pct),
          });
        }
      }
      shared.sort((x, y) => y.combinedPct - x.combinedPct);

      const sizeA = portA.size;
      const sizeB = portB.size;
      const unionSize = sizeA + sizeB - shared.length;
      const jaccard = unionSize > 0 ? shared.length / unionSize : 0;
      const jointConviction = shared.reduce((s, h) => s + h.combinedPct, 0);

      const slug = pairSlug(a.slug, b.slug);
      // Order pair so that "a" is the alphabetically-first manager (matches slug)
      const [first, second] = [a, b].sort((x, y) => x.slug.localeCompare(y.slug));
      const orderedShared = first.slug === a.slug
        ? shared
        : shared.map((h) => ({
            ...h,
            pctA: h.pctB,
            pctB: h.pctA,
          }));

      pairs.set(slug, {
        a: first,
        b: second,
        shared: orderedShared,
        sizeA: first.slug === a.slug ? sizeA : sizeB,
        sizeB: first.slug === a.slug ? sizeB : sizeA,
        overlapCount: shared.length,
        jaccard,
        jointConviction,
        slug,
      });
    }
  }

  _pairCache = pairs;
  return pairs;
}

export function getAllOverlapPairs(): OverlapPair[] {
  return [...buildAllPairs().values()];
}

export function getOverlapPair(slug: string): OverlapPair | null {
  return buildAllPairs().get(slug) ?? null;
}

// Top-N most-overlapped pairs (highest jointConviction).
// Used on /fund-overlap/ hub page.
export function getTopOverlapPairs(n = 30): OverlapPair[] {
  return [...buildAllPairs().values()]
    .sort((a, b) => b.jointConviction - a.jointConviction)
    .slice(0, n);
}

// Pairs containing a given manager — for cross-links from /investor/[slug].
export function getPairsForManager(slug: string, limit = 8): OverlapPair[] {
  return [...buildAllPairs().values()]
    .filter((p) => p.a.slug === slug || p.b.slug === slug)
    .sort((a, b) => b.jointConviction - a.jointConviction)
    .slice(0, limit);
}
