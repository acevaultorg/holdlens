// Top tickers by superinvestor ownership. Pre-computed from MANAGERS data.
import { MANAGERS } from "./managers";

export type TickerOwner = { manager: string; slug: string; pct: number; thesis: string };
export type TickerData = {
  symbol: string;
  name: string;
  ownerCount: number;
  owners: TickerOwner[];
  totalConviction: number; // sum of pct across managers (rough conviction proxy)
  sector?: string;
};

export const SECTOR_MAP: Record<string, string> = {
  AAPL: "Technology",
  MSFT: "Technology",
  GOOGL: "Technology",
  GOOG: "Technology",
  META: "Technology",
  NVDA: "Technology",
  AMZN: "Technology",
  AXP: "Financials",
  BAC: "Financials",
  JPM: "Financials",
  ALLY: "Financials",
  LNC: "Financials",
  FNF: "Financials",
  KO: "Consumer Staples",
  CMG: "Consumer Discretionary",
  NKE: "Consumer Discretionary",
  HLT: "Consumer Discretionary",
  QSR: "Consumer Discretionary",
  CVX: "Energy",
  OXY: "Energy",
  CVI: "Energy",
  VST: "Utilities",
  FE: "Utilities",
  MCO: "Financials",
  KHC: "Consumer Staples",
  CB: "Financials",
  DVA: "Healthcare",
  UNH: "Healthcare",
  BHC: "Healthcare",
  VTRS: "Healthcare",
  HHH: "Real Estate",
  GRBK: "Real Estate",
  BN: "Financials",
  CP: "Industrials",
  CNDT: "Industrials",
  IEP: "Financials",
  TECK: "Materials",
  CC: "Materials",
  PENN: "Consumer Discretionary",
  LBTYK: "Communication",
  WBD: "Communication",
  DNUT: "Consumer Discretionary",
  BABA: "Technology",
  JD: "Technology",
  BIDU: "Technology",
  SHEL: "Energy",
  ESTC: "Technology",
  COHR: "Technology",
  TSM: "Technology",
  KMI: "Energy",
  "BRK.B": "Financials",
  MU: "Technology",
  STLA: "Consumer Discretionary",
  FCAU: "Financials",
  TRMD: "Industrials",
  PR: "Energy",
  WMB: "Energy",
  STR: "Energy",
  BB: "Technology",
  KW: "Real Estate",
  CVS: "Healthcare",
  COF: "Financials",
  C: "Financials",
  CMCSA: "Communication",
  NFLX: "Communication",
  SCHW: "Financials",
  PM: "Consumer Staples",
  BRO: "Financials",
  V: "Financials",
  FIS: "Technology",
};

export function buildTickerIndex(): Record<string, TickerData> {
  const idx: Record<string, TickerData> = {};
  for (const m of MANAGERS) {
    for (const h of m.topHoldings) {
      if (!idx[h.ticker]) {
        idx[h.ticker] = {
          symbol: h.ticker,
          name: h.name,
          ownerCount: 0,
          owners: [],
          totalConviction: 0,
          sector: SECTOR_MAP[h.ticker] || "Other",
        };
      }
      idx[h.ticker].owners.push({ manager: m.name, slug: m.slug, pct: h.pct, thesis: h.thesis });
      idx[h.ticker].ownerCount++;
      idx[h.ticker].totalConviction += h.pct;
    }
  }
  return idx;
}

export const TICKER_INDEX = buildTickerIndex();

export function topTickers(limit = 25): TickerData[] {
  return Object.values(TICKER_INDEX)
    .sort((a, b) => b.ownerCount - a.ownerCount || b.totalConviction - a.totalConviction)
    .slice(0, limit);
}

export function getTicker(symbol: string): TickerData | undefined {
  return TICKER_INDEX[symbol.toUpperCase()];
}
