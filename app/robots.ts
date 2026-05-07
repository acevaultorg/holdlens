import type { MetadataRoute } from "next";
export const dynamic = "force-static";

// All LLM / AI / search crawlers explicitly allowed so HoldLens content
// surfaces in Google, Bing, ChatGPT, Claude, Perplexity, and AI Overviews.
// Commercial license + rate-limit discovery via HTTP headers (public/_headers)
// and the full policy page at /api-terms.
const LLM_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Googlebot-Extended",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
  "cohere-ai",
  "Bytespider",
  "Amazonbot",
  "Amzn-SearchBot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "Meta-Webindexer",
  "Diffbot",
  "DuckAssistBot",
  "YouBot",
  "FacebookBot",
  "Timpibot",
];

// Search + ads quality crawlers — explicitly listed per AdSense / Mediavine
// compliance best practice (rules/adsense-compliance.md). The wildcard '*'
// rule technically covers them but Google's docs request explicit listing
// to avoid ambiguity during AdSense review + ongoing ad-serving audits.
// Mediapartners-Google = AdSense content/relevance crawler (REQUIRED for
// AdSense approval); AdsBot-Google + AdsBot-Google-Mobile = landing-page
// quality scoring for Google Ads. Bingbot listed for Microsoft Ads parity.
// These crawlers DO execute JS — keep /_next/ accessible (do not disallow).
const SEARCH_AD_BOTS = [
  "Googlebot",
  "Googlebot-News",
  "Googlebot-Image",
  "Mediapartners-Google",
  "AdsBot-Google",
  "AdsBot-Google-Mobile",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // IMPORTANT: never disallow /_next/ for the wildcard — Googlebot /
      // Bingbot must fetch CSS + JS chunks under /_next/static/ to render
      // pages for ranking. /admin/ is the only real secret surface.
      { userAgent: "*", allow: "/", disallow: ["/admin/"] },
      // AI crawlers (LLM_BOTS) do NOT execute JS — the static export puts
      // all content in HTML, so /_next/static/* is pure waste for them.
      // CF AI Crawl Control 2026-04-20 observed 16.75k 404s (55% of 7d
      // crawler traffic) from AI bots chasing stale chunk hashes. Explicit
      // Disallow: /_next/ on LLM_BOTS stops the waste without affecting
      // Googlebot/Bingbot rendering (they're not in LLM_BOTS).
      ...LLM_BOTS.map((ua) => ({
        userAgent: ua,
        allow: "/",
        disallow: ["/_next/", "/admin/"],
      })),
      // Google + Bing search/ad bots — explicit allow with /_next/ ACCESSIBLE
      // (they render JS for ranking and ad-quality scoring).
      ...SEARCH_AD_BOTS.map((ua) => ({
        userAgent: ua,
        allow: "/",
        disallow: ["/admin/"],
      })),
    ],
    sitemap: [
      "https://holdlens.com/sitemap.xml",
      "https://holdlens.com/sitemap-ai.xml",
      "https://holdlens.com/feed.xml",
    ],
    host: "https://holdlens.com",
  };
}
