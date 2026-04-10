// Client-side news fetcher. Yahoo Finance search API returns news stories
// for any ticker without an API key. Falls back to corsproxy.io if direct
// fetch is CORS-blocked.

export type NewsItem = {
  uuid: string;
  title: string;
  publisher: string;
  link: string;
  publishedAt: number; // epoch seconds
  type: "STORY" | "VIDEO" | string;
};

const CACHE_KEY = (sym: string) => `hl_news_${sym.toUpperCase()}`;
const TTL_MS = 15 * 60 * 1000; // 15 min

type Cached = { data: NewsItem[]; exp: number };

function cacheGet(symbol: string): NewsItem[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY(symbol));
    if (!raw) return null;
    const parsed: Cached = JSON.parse(raw);
    if (parsed.exp < Date.now()) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function cacheSet(symbol: string, data: NewsItem[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY(symbol), JSON.stringify({ data, exp: Date.now() + TTL_MS }));
  } catch {
    // ignore quota
  }
}

const PROXY_BASE = "https://holdlens-yahoo-proxy.paulomdevries.workers.dev";

async function fetchYahooNews(symbol: string, count = 8): Promise<NewsItem[]> {
  const base = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
    symbol
  )}&quotesCount=0&newsCount=${count}&enableFuzzyQuery=false&lang=en-US&region=US`;
  const endpoints = [
    `${PROXY_BASE}/search/${encodeURIComponent(symbol)}?count=${count}`,
    base,
    `https://corsproxy.io/?url=${encodeURIComponent(base)}`,
  ];

  let lastErr: unknown = null;
  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items = data?.news;
      if (!Array.isArray(items)) throw new Error("no news array");
      return items
        .filter((n: { title?: string; link?: string }) => n?.title && n?.link)
        .map((n: {
          uuid?: string;
          title?: string;
          publisher?: string;
          link?: string;
          providerPublishTime?: number;
          type?: string;
        }) => ({
          uuid: String(n.uuid || `${symbol}-${n.providerPublishTime}`),
          title: String(n.title || ""),
          publisher: String(n.publisher || "Unknown"),
          link: String(n.link || ""),
          publishedAt: Number(n.providerPublishTime || 0),
          type: String(n.type || "STORY"),
        }));
    } catch (e) {
      lastErr = e;
      continue;
    }
  }
  throw lastErr || new Error("all news endpoints failed");
}

/**
 * Fetch news items for a symbol. Client-side only. Returns empty array on failure.
 */
export async function getNews(symbol: string, count = 8): Promise<NewsItem[]> {
  const sym = symbol.toUpperCase();
  const cached = cacheGet(sym);
  if (cached) return cached;
  try {
    const items = await fetchYahooNews(sym, count);
    cacheSet(sym, items);
    return items;
  } catch {
    return [];
  }
}

/** Relative time formatter — "2h ago", "3d ago" */
export function fmtRelativeTime(epochSec: number): string {
  if (!epochSec) return "";
  const diffSec = Math.floor(Date.now() / 1000) - epochSec;
  if (diffSec < 60) return "just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return `${Math.floor(diffSec / 604800)}w ago`;
}
