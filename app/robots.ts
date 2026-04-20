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
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "Diffbot",
  "DuckAssistBot",
  "YouBot",
  "FacebookBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/_next/"] },
      ...LLM_BOTS.map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: [
      "https://holdlens.com/sitemap.xml",
      "https://holdlens.com/feed.xml",
    ],
    host: "https://holdlens.com",
  };
}
