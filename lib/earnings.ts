// Client-side earnings calendar fetcher. Uses Yahoo Finance quoteSummary API
// which returns calendarEvents.earnings including the next earnings date.
// Falls back to corsproxy.io on CORS failure. sessionStorage cache 1 hour.

export type EarningsInfo = {
  symbol: string;
  nextEarningsDate: number | null; // epoch seconds
  lastEarningsDate: number | null;
  epsEstimate: number | null;
  epsActual: number | null;
  revenueEstimate: number | null;
  currency: string;
};

const CACHE_KEY = (sym: string) => `hl_earnings_${sym.toUpperCase()}`;
const TTL_MS = 60 * 60 * 1000; // 1 hour

type Cached = { data: EarningsInfo; exp: number };

function cacheGet(symbol: string): EarningsInfo | null {
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

function cacheSet(symbol: string, data: EarningsInfo) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY(symbol), JSON.stringify({ data, exp: Date.now() + TTL_MS }));
  } catch {
    // ignore quota
  }
}

const PROXY_BASE = "https://holdlens-yahoo-proxy.paulomdevries.workers.dev";

async function fetchFromYahoo(symbol: string): Promise<EarningsInfo> {
  const base = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(
    symbol
  )}?modules=calendarEvents,earnings,defaultKeyStatistics`;
  const endpoints = [
    `${PROXY_BASE}/summary/${encodeURIComponent(symbol)}`,
    base,
    `https://corsproxy.io/?url=${encodeURIComponent(base)}`,
  ];

  let lastErr: unknown = null;
  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const result = data?.quoteSummary?.result?.[0];
      if (!result) throw new Error("no quoteSummary result");

      const calEarn = result?.calendarEvents?.earnings;
      const earnings = result?.earnings;
      const keyStats = result?.defaultKeyStatistics;

      const nextDates: number[] = Array.isArray(calEarn?.earningsDate)
        ? calEarn.earningsDate.map((d: { raw?: number }) => Number(d?.raw ?? 0)).filter(Boolean)
        : [];
      const nextEarningsDate = nextDates[0] ?? null;
      const epsEstimate = Number(calEarn?.earningsAverage?.raw ?? 0) || null;
      const revenueEstimate = Number(calEarn?.revenueAverage?.raw ?? 0) || null;

      const lastQuarterly = earnings?.earningsChart?.quarterly;
      const lastRow = Array.isArray(lastQuarterly) ? lastQuarterly[lastQuarterly.length - 1] : null;
      const epsActual = Number(lastRow?.actual?.raw ?? 0) || null;

      const lastEarningsDate = Number(keyStats?.lastFiscalYearEnd?.raw ?? 0) || null;

      return {
        symbol: symbol.toUpperCase(),
        nextEarningsDate,
        lastEarningsDate,
        epsEstimate,
        epsActual,
        revenueEstimate,
        currency: "USD",
      };
    } catch (e) {
      lastErr = e;
      continue;
    }
  }
  throw lastErr || new Error("earnings endpoints failed");
}

export async function getEarnings(symbol: string): Promise<EarningsInfo | null> {
  const sym = symbol.toUpperCase();
  const cached = cacheGet(sym);
  if (cached) return cached;
  try {
    const data = await fetchFromYahoo(sym);
    cacheSet(sym, data);
    return data;
  } catch {
    return null;
  }
}

/** Format an earnings date as "in 5 days" / "8 days ago" / exact date */
export function fmtEarningsRelative(epochSec: number | null): string {
  if (!epochSec) return "";
  const diffDays = Math.round((epochSec - Date.now() / 1000) / 86400);
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays > 0 && diffDays <= 14) return `in ${diffDays} days`;
  if (diffDays < 0 && diffDays >= -14) return `${Math.abs(diffDays)} days ago`;
  const d = new Date(epochSec * 1000);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Absolute date formatter */
export function fmtEarningsDate(epochSec: number | null): string {
  if (!epochSec) return "—";
  const d = new Date(epochSec * 1000);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
