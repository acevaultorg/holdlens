import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://holdlens.com";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/simulate/buffett`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/investor/warren-buffett`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];
}
