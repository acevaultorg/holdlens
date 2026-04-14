import type { MetadataRoute } from "next";
import { MANAGERS } from "@/lib/managers";
import { TICKER_INDEX, topTickers } from "@/lib/tickers";

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
  for (const a of topN) {
    for (const b of topN) {
      if (a < b) {
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

  return [...staticUrls, ...sectorUrls, ...compareUrls, ...managerUrls, ...tickerUrls];
}
