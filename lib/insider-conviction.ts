// Ship #2 v1 — per-insider conviction scoring + slug routing for the
// /insiders/[insider]/ programmatic pages.
//
// Thesis: the current /insiders/ hub shows transactions by date. What
// users actually want to know is "is this CEO buying a lot lately"
// — a person-centric score. This lib synthesizes that from the
// curated INSIDER_TX data.
//
// Static-export-safe: all computation at build time. No runtime data
// fetching. Pure derivation over lib/insiders.ts.

import { INSIDER_TX, type InsiderTx } from "./insiders";

export type InsiderSummary = {
  slug: string;              // url-safe slug
  name: string;              // display
  title: string;             // most-recent observed title
  tickers: string[];         // distinct tickers they have tx for
  buy_count: number;
  sell_count: number;
  buy_value: number;         // sum $
  sell_value: number;        // sum $
  discretionary_sell_value: number;  // sells NOT flagged as 10b5-1
  latest_date: string;       // ISO, most recent tx
  conviction_score: number;  // -100..+100
  role_weight: number;       // 0.0-1.0
  transactions: InsiderTx[]; // all tx for this insider, date-desc
};

/**
 * Role weighting — how much signal does this person's trade carry?
 * Based on how much they know about the company + how discretionary
 * their compensation is. CEOs + Chairs + Founders carry most signal;
 * directors + former execs less.
 */
function roleWeight(title: string): number {
  const t = title.toLowerCase();
  if (/\b(founder|chairman & ceo|ceo & chairman|ceo & founder)\b/.test(t)) return 1.0;
  if (/\b(ceo|chair & ceo)\b/.test(t)) return 0.95;
  if (/\b(chair|chairman|chairwoman|chairperson)\b/.test(t)) return 0.9;
  if (/\bcfo\b/.test(t)) return 0.8;
  if (/\b(president|cio|coo)\b/.test(t)) return 0.7;
  if (/\b10%\b|\bbeneficial owner\b/.test(t)) return 0.6;
  if (/\bdirector\b/.test(t)) return 0.5;
  if (/\bformer\b/.test(t)) return 0.3;
  return 0.4; // default for unknown titles
}

/**
 * Slugify a person's display name for /insiders/[slug] routes.
 * Handles unicode accents, spaces, punctuation.
 */
export function insiderSlug(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Is this transaction note consistent with a pre-arranged 10b5-1
 * selling plan? If so, it carries much less signal than a discretionary
 * trade.
 */
function is10b51(tx: InsiderTx): boolean {
  const note = (tx.note || "").toLowerCase();
  return /10b5-?1/.test(note);
}

let CACHED: Map<string, InsiderSummary> | null = null;

/**
 * Build the full map of insiders → summary. Memoized — every page
 * that uses it shares the same compute.
 */
export function computeInsiderSummaries(): Map<string, InsiderSummary> {
  if (CACHED) return CACHED;

  const groups = new Map<string, InsiderTx[]>();
  for (const tx of INSIDER_TX) {
    const slug = insiderSlug(tx.insiderName);
    if (!groups.has(slug)) groups.set(slug, []);
    groups.get(slug)!.push(tx);
  }

  const out = new Map<string, InsiderSummary>();
  for (const [slug, txs] of groups) {
    const sorted = [...txs].sort((a, b) => (a.date < b.date ? 1 : -1));
    const latest = sorted[0];
    const title = latest.insiderTitle;
    const rw = roleWeight(title);
    const tickers = Array.from(new Set(sorted.map((t) => t.ticker))).sort();

    let buyCount = 0;
    let sellCount = 0;
    let buyValue = 0;
    let sellValue = 0;
    let discretionarySellValue = 0;

    for (const tx of sorted) {
      if (tx.action === "buy") {
        buyCount++;
        buyValue += tx.value;
      } else {
        sellCount++;
        sellValue += tx.value;
        if (!is10b51(tx)) discretionarySellValue += tx.value;
      }
    }

    // Conviction score v1 — intent: buys are RARE and signal-heavy
    // (CEOs get paid in stock; buying more with their own money is
    // meaningful). Sells are mostly 10b5-1 and carry much less
    // signal unless discretionary.
    //
    //   raw = (buyValue - 0.2 * discretionarySellValue) * roleWeight
    //   score = logistic(raw / $10M) * 200 - 100
    //
    // Clamped to -100..+100. Buy of $1M by a CEO ≈ +25. Buy of
    // $40M+ by a Chairman ≈ +90. Pure 10b5-1 sells barely move it.
    const raw = (buyValue - 0.2 * discretionarySellValue) * rw;
    const logistic = 1 / (1 + Math.exp(-raw / 10_000_000));
    const convictionScore = Math.round(Math.max(-100, Math.min(100, logistic * 200 - 100)));

    out.set(slug, {
      slug,
      name: latest.insiderName,
      title,
      tickers,
      buy_count: buyCount,
      sell_count: sellCount,
      buy_value: buyValue,
      sell_value: sellValue,
      discretionary_sell_value: discretionarySellValue,
      latest_date: latest.date,
      conviction_score: convictionScore,
      role_weight: rw,
      transactions: sorted,
    });
  }

  CACHED = out;
  return out;
}

/**
 * Look up a single insider by slug.
 */
export function getInsiderSummary(slug: string): InsiderSummary | undefined {
  return computeInsiderSummaries().get(slug);
}

/**
 * All insiders ordered by conviction score descending (highest signal
 * first). Used by the /insiders/ hub's new "top conviction buyers"
 * section.
 */
export function allInsidersByConviction(): InsiderSummary[] {
  return [...computeInsiderSummaries().values()].sort(
    (a, b) => b.conviction_score - a.conviction_score,
  );
}
