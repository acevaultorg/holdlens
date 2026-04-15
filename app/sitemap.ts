import type { MetadataRoute } from "next";
import { MANAGERS } from "@/lib/managers";
import { TICKER_INDEX, topTickers } from "@/lib/tickers";
import { QUARTERS } from "@/lib/moves";

const SECTORS = [
  "Technology", "Financials", "Energy", "Healthcare",
  "Consumer Discretionary", "Consumer Staples", "Industrials",
  "Materials", "Real Estate", "Communication", "Utilities",
];

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://holdlens.com";
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    // High-priority conversion surfaces — the unified score rankings
    { url: `${base}/best-now`, lastModified: now, changeFrequency: "daily", priority: 0.98 },
    { url: `${base}/buys`, lastModified: now, changeFrequency: "daily", priority: 0.97 },
    { url: `${base}/sells`, lastModified: now, changeFrequency: "daily", priority: 0.97 },
    { url: `${base}/this-week`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${base}/what-to-buy`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/what-to-sell`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/top-picks`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    // New pages added in v0.27
    { url: `${base}/insiders`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/changelog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    // Already-live routes that were never in the sitemap
    { url: `${base}/activity`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    // Learn hub — evergreen SEO content, high long-term value
    { url: `${base}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/learn/superinvestor-handbook`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/learn/what-is-a-13f`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/copy-trading-myth`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/conviction-score-explained`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/grand`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/screener`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/leaderboard`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/proof`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/compare/managers`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/portfolio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/watchlist`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/profile`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/alerts`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/docs`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/press-kit`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    // Backtests
    { url: `${base}/simulate`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/simulate/buffett`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/simulate/ackman`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/simulate/druckenmiller`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/simulate/klarman`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/simulate/burry`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    // Learn
    { url: `${base}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/learn/what-is-a-13f`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/copy-trading-myth`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/conviction-score-explained`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/quarterly`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/quarterly/2026-q1`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/quarterly/2025-q4`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/investor`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/ticker`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    // Support
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/press`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    // Legal + contact (required for AdSense + GDPR compliance)
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const sectorUrls: MetadataRoute.Sitemap = SECTORS.map((s) => ({
    url: `${base}/sector/${s.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const topN = topTickers(15).map((t) => t.symbol);
  const compareUrls: MetadataRoute.Sitemap = [];
  // Both orderings — matches the route generator that ships pages both ways so
  // Google indexes each direction.
  for (const a of topN) {
    for (const b of topN) {
      if (a !== b) {
        compareUrls.push({
          url: `${base}/compare/${a.toLowerCase()}-vs-${b.toLowerCase()}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  }

  const managerUrls: MetadataRoute.Sitemap = MANAGERS.map((m) => ({
    url: `${base}/investor/${m.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const tickerUrls: MetadataRoute.Sitemap = Object.keys(TICKER_INDEX).map((sym) => ({
    url: `${base}/ticker/${sym}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // /signal/[ticker] — per-ticker smart-money signal pages.
  const signalUrls: MetadataRoute.Sitemap = Object.keys(TICKER_INDEX).map((sym) => ({
    url: `${base}/signal/${sym}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // /investor/[slug]/q/[quarter] — 29 dynamic managers × 8 quarters = 232 pages.
  // Warren Buffett is excluded (hand-crafted /investor/warren-buffett page).
  const investorQuarterUrls: MetadataRoute.Sitemap = [];
  for (const m of MANAGERS) {
    if (m.slug === "warren-buffett") continue;
    for (const q of QUARTERS) {
      investorQuarterUrls.push({
        url: `${base}/investor/${m.slug}/q/${q.toLowerCase()}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }
  }

  // /quarter/[slug] — per-quarter full digests.
  const quarterUrls: MetadataRoute.Sitemap = QUARTERS.map((q) => ({
    url: `${base}/quarter/${q.toLowerCase()}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticUrls,
    ...sectorUrls,
    ...compareUrls,
    ...managerUrls,
    ...tickerUrls,
    ...signalUrls,
    ...investorQuarterUrls,
    ...quarterUrls,
  ];
}
