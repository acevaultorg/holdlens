import type { MetadataRoute } from "next";
import { MANAGERS } from "@/lib/managers";
import { TICKER_INDEX } from "@/lib/tickers";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://holdlens.com";
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/simulate/buffett`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/investor`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/ticker`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

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

  return [...staticUrls, ...managerUrls, ...tickerUrls];
}
