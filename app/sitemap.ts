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
    { url: `${base}/simulate/buffett`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/simulate`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/simulate/ackman`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/simulate/druckenmiller`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/learn/what-is-a-13f`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/investor`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/ticker`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/top-picks`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
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
