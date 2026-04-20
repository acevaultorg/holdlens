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

  // 2026-04-20 — SECTOR_MAP gap fix: these 29 tickers exist in lib/moves.ts
  // but were missing from SECTOR_MAP, causing all their positions to fall
  // to "Other" in the /rotation heatmap. Classifications follow S&P GICS
  // canonical sector assignments. The bug manifested as "Other" dominating
  // every row of /rotation with triple-digit net flow while named sectors
  // showed single-digit flow — mathematically impossible if the dataset
  // were classified correctly.
  ARM: "Technology",          // Arm Holdings — semiconductor design
  CNH: "Industrials",         // CNH Industrial — ag/construction equipment
  DIS: "Communication",       // Walt Disney
  DPZ: "Consumer Discretionary", // Domino's Pizza
  ENPH: "Technology",         // Enphase Energy — per GICS = IT (semis+equip)
  FICO: "Technology",         // Fair Isaac — analytics software
  FND: "Consumer Discretionary", // Floor & Decor
  FTNT: "Technology",         // Fortinet — cybersecurity
  GE: "Industrials",          // GE Aerospace
  GOLD: "Materials",          // Barrick Gold
  HEI: "Industrials",         // HEICO — aerospace components
  HPQ: "Technology",          // HP Inc
  ICE: "Financials",          // Intercontinental Exchange
  INTC: "Technology",         // Intel
  KKR: "Financials",          // KKR & Co — alternative asset management
  MA: "Financials",           // Mastercard
  MELI: "Consumer Discretionary", // MercadoLibre — e-commerce LatAm
  MSCI: "Financials",         // MSCI Inc — index provider
  NOVO: "Healthcare",         // Novo Nordisk
  NOW: "Technology",          // ServiceNow
  PLTR: "Technology",         // Palantir
  POOL: "Consumer Discretionary", // Pool Corp
  SE: "Consumer Discretionary", // Sea Limited — Shopee e-commerce dominant
  SHOP: "Technology",         // Shopify — per GICS = IT
  SIRI: "Communication",      // Sirius XM
  SPGI: "Financials",         // S&P Global
  SPOT: "Communication",      // Spotify
  TSLA: "Consumer Discretionary", // Tesla — autos per GICS
  UBER: "Industrials",        // Uber — transportation services
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

// True if the ticker has a pre-rendered /signal/[ticker] + /ticker/[symbol] page.
// Use to gate internal links — rendering a link to a ticker without a page
// produces a 404, which leaks PageRank and frustrates users.
export function hasTickerPage(symbol: string): boolean {
  return symbol.toUpperCase() in TICKER_INDEX;
}
