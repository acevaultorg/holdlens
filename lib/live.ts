// Client-side live quote + chart fetcher.
// Primary: Yahoo Finance v8 chart endpoint (direct, works from most browsers).
// Fallback: corsproxy.io wrap.
// Cache: sessionStorage with 60s TTL — avoids refetching the same ticker.

export type LiveQuote = {
  symbol: string;
  price: number;
  prevClose: number;
  dayChange: number;
  dayChangePct: number;
  weekHigh52: number;
  weekLow52: number;
  marketCap: number | null;
  currency: string;
  exchange: string;
  // chart data: last N closes + timestamps (daily)
  chart: { t: number; c: number }[];
  fetchedAt: number;
};

const TTL_MS = 60 * 1000;
// Cache is keyed by symbol + range so a short-range fetch (e.g. /best-now with
// 1y) doesn't poison a long-range fetch (e.g. /proof with 2y for Q4 2024).
const CACHE_KEY = (sym: string, range: string) => `hl_quote_${sym.toUpperCase()}_${range}`;

type CachedQuote = { data: LiveQuote; exp: number };

function cacheGet(symbol: string, range: string): LiveQuote | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY(symbol, range));
    if (!raw) return null;
    const parsed: CachedQuote = JSON.parse(raw);
    if (parsed.exp < Date.now()) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function cacheSet(symbol: string, range: string, data: LiveQuote) {
  if (typeof window === "undefined") return;
  try {
    const entry: CachedQuote = { data, exp: Date.now() + TTL_MS };
    sessionStorage.setItem(CACHE_KEY(symbol, range), JSON.stringify(entry));
  } catch {
    // quota exceeded or disabled — ignore
  }
}

// Cloudflare Worker proxy — adds the User-Agent header that Yahoo requires
// from non-browser clients. See workers/yahoo-proxy/src/index.ts.
const PROXY_BASE = "https://holdlens-yahoo-proxy.paulomdevries.workers.dev";

/**
 * Convert a HoldLens ticker (e.g. "BRK.B", "BF.B") to the form Yahoo
 * Finance accepts (e.g. "BRK-B", "BF-B"). Our data layer stores the
 * "canonical" SEC/press format with a dot; Yahoo's URL routing uses a
 * dash. Without this conversion, every dotted class-B ticker returns
 * "Chart unavailable" + empty quote.
 *
 * Also handles preferred-share tickers with slashes (e.g. "BAC/PH" →
 * "BAC-PH") and forward-trailing spaces.
 */
function toYahooSymbol(symbol: string): string {
  return symbol.toUpperCase().trim().replace(/[./]/g, "-");
}

async function fetchFromYahoo(symbol: string, range: string): Promise<LiveQuote> {
  const yahooSym = toYahooSymbol(symbol);
  const endpoints = [
    `${PROXY_BASE}/quote/${encodeURIComponent(yahooSym)}?range=${range}`,
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSym)}?interval=1d&range=${range}`,
    `https://corsproxy.io/?url=${encodeURIComponent(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSym}?interval=1d&range=${range}`
    )}`,
  ];

  let lastErr: unknown = null;
  for (const url of endpoints) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const result = data?.chart?.result?.[0];
      if (!result) throw new Error("no chart result");
      const meta = result.meta;
      const timestamps: number[] = result.timestamp || [];
      const closes: (number | null)[] = result.indicators?.quote?.[0]?.close || [];

      const chart: { t: number; c: number }[] = [];
      for (let i = 0; i < timestamps.length; i++) {
        const c = closes[i];
        if (c != null && Number.isFinite(c)) {
          chart.push({ t: timestamps[i], c });
        }
      }

      const price = Number(meta.regularMarketPrice ?? chart[chart.length - 1]?.c ?? 0);
      const prevClose = Number(meta.chartPreviousClose ?? meta.previousClose ?? price);
      const dayChange = price - prevClose;
      const dayChangePct = prevClose > 0 ? (dayChange / prevClose) * 100 : 0;

      return {
        symbol: String(meta.symbol || symbol).toUpperCase(),
        price,
        prevClose,
        dayChange,
        dayChangePct,
        weekHigh52: Number(meta.fiftyTwoWeekHigh ?? 0),
        weekLow52: Number(meta.fiftyTwoWeekLow ?? 0),
        marketCap: meta.marketCap ?? null,
        currency: String(meta.currency || "USD"),
        exchange: String(meta.fullExchangeName || meta.exchangeName || ""),
        chart,
        fetchedAt: Date.now(),
      };
    } catch (e) {
      lastErr = e;
      continue;
    }
  }
  throw lastErr || new Error("all endpoints failed");
}

/**
 * Fetch a live quote for a symbol. Client-side only.
 * Uses sessionStorage cache with 60s TTL.
 * Returns null on failure (caller decides fallback UI).
 */
export async function getQuote(symbol: string, range: "1mo" | "3mo" | "6mo" | "1y" | "2y" | "5y" = "1y"): Promise<LiveQuote | null> {
  const sym = symbol.toUpperCase();
  const cached = cacheGet(sym, range);
  if (cached) return cached;
  try {
    const q = await fetchFromYahoo(sym, range);
    cacheSet(sym, range, q);
    return q;
  } catch {
    return null;
  }
}

/**
 * Batch fetch multiple quotes in parallel. Returns a map of symbol → quote (or null).
 */
export async function getQuotes(symbols: string[], range: "1mo" | "3mo" | "6mo" | "1y" | "2y" | "5y" = "1mo"): Promise<Record<string, LiveQuote | null>> {
  const out: Record<string, LiveQuote | null> = {};
  const results = await Promise.all(symbols.map((s) => getQuote(s, range).then((q) => [s, q] as const)));
  for (const [s, q] of results) out[s.toUpperCase()] = q;
  return out;
}

export function fmtPrice(n: number, currency = "USD"): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: n >= 100 ? 2 : n >= 1 ? 2 : 4,
  });
}

export function fmtPct(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function fmtMarketCap(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toLocaleString("en-US")}`;
}
