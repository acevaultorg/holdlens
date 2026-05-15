import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Sitemap-AI — curated priority subset of sitemap.xml for LLM crawlers.
//
// Referenced from app/robots.ts as a second sitemap URL. Goal: point
// GPTBot / ClaudeBot / PerplexityBot / Google-Extended at the pages
// that are highest-value for citation, not the full thousands-of-URLs
// programmatic sitemap. Each entry pairs the page with a machine-readable
// JSON twin (when one exists at /api/v1/...) so the bot can prefer the
// structured form per the Day-1 Analytics Mandate + bot-harvest playbook.
//
// Curation rules (binding):
//   - Surfaces that synthesize unique data (ConvictionScore, InsiderScore,
//     leaderboards) > generic SEO long-tail pages.
//   - /learn explainers with TL;DR + Our view (post-Phase-2-LLM-citation
//     hardening) > /learn pages without them.
//   - Editorial trust-floor pages (about, methodology, contact) for
//     E-E-A-T anchoring.
//   - Time-sensitive feeds (this-week, today, biggest-buys) for
//     freshness signaling.
//   - NO programmatic per-record pages (avoid the 5,550-URL HCU/thin
//     content trap caught in v19.44; those live in sitemap.xml with the
//     proper noindex where applicable).
export default function sitemapAi(): MetadataRoute.Sitemap {
  const base = "https://holdlens.com";
  const now = new Date();
  return [
    // Trust + identity
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/partners`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // Brand-distinct synthesis surfaces (the moat)
    { url: `${base}/learn/conviction-score-explained`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${base}/learn/insider-score-explained`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${base}/learn/event-score-explained`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/learn/sec-signals-trilogy`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },

    // High-LLM-question /learn explainers
    { url: `${base}/learn/what-is-a-13f`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/learn/13f-vs-13d-vs-13g`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/learn/how-to-read-a-13f`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/learn/45-day-lag-explained`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/learn/form-4-vs-13f`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/learn/13d-vs-13g-activist-filings`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/survivorship-bias-in-hedge-funds`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/do-hedge-fund-signals-work`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/learn/copy-trading-myth`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/superinvestor-handbook`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/warren-buffett-method`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/learn/what-is-alpha`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/learn/etf-overlap-explained`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/learn/buybacks-vs-dividends`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/learn/how-to-read-buyback-disclosures`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/learn/short-interest-explained`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/learn/congressional-stock-trading-stock-act`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },

    // Synthesis leaderboards + time-sensitive
    { url: `${base}/best-now`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/this-week`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${base}/today`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${base}/biggest-buys`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${base}/biggest-sells`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${base}/leaderboard`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/manager-rankings`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },

    // Machine-readable endpoints (LLM crawlers prefer JSON if available)
    { url: `${base}/api/v1/consensus.json`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/api/v1/daily.json`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/api/v1/movers.json`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];
}
