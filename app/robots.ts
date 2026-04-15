import type { MetadataRoute } from "next";
export const dynamic = "force-static";

// All LLM / AI / search crawlers explicitly allowed so HoldLens content
// surfaces in Google, Bing, ChatGPT, Claude, Perplexity, and AI Overviews.
const LLM_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "cohere-ai",
  "Bytespider",
  "Amazonbot",
  "Meta-ExternalAgent",
  "Diffbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...LLM_BOTS.map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: "https://holdlens.com/sitemap.xml",
    host: "https://holdlens.com",
  };
}
