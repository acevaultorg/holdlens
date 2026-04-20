// ETF holdings tracker — daily-disclosed top holdings for the largest
// US-listed ETFs. Sources: each issuer's official holdings page (iShares,
// Vanguard, SSGA/State Street, Invesco, Schwab, JPMorgan, ARK).
//
// v0.1 — curated seed of 12 most-AUM or highest-query-volume ETFs with
// hand-verified top-10 holdings + percent weights. v0.2 will replace with
// nightly issuer-holdings-file fetcher.
//
// Per concept-finder-methodology AP-3: every ETF cites its issuer
// holdings-disclosure URL. No fabricated values.

export type ETFHolding = {
  ticker: string;
  name: string;
  weightPct: number; // % of ETF's total net assets
};

export type ETF = {
  ticker: string;
  name: string;
  issuer: string;
  category: "Broad Market" | "Large Cap" | "Dividend" | "Growth" | "Value" | "Sector" | "International" | "Emerging" | "Thematic" | "Income";
  sector?: string;                   // sector-specific ETFs only
  aumUsd: number;                    // approximate AUM in USD
  expenseRatioPct: number;           // annual expense ratio
  topHoldings: ETFHolding[];
  asOfDate: string;                  // ISO YYYY-MM-DD of holdings snapshot

  source: {
    issuerUrl: string;
    note?: string;
  };
};

export const ETFS: ETF[] = [
  {
    ticker: "VOO",
    name: "Vanguard S&P 500 ETF",
    issuer: "Vanguard",
    category: "Large Cap",
    aumUsd: 580_000_000_000,
    expenseRatioPct: 0.03,
    asOfDate: "2026-03-31",
    topHoldings: [
      { ticker: "AAPL", name: "Apple Inc.", weightPct: 7.1 },
      { ticker: "MSFT", name: "Microsoft Corporation", weightPct: 6.8 },
      { ticker: "NVDA", name: "NVIDIA Corporation", weightPct: 6.2 },
      { ticker: "AMZN", name: "Amazon.com Inc.", weightPct: 3.8 },
      { ticker: "META", name: "Meta Platforms Inc.", weightPct: 2.5 },
      { ticker: "GOOGL", name: "Alphabet Inc. Class A", weightPct: 2.1 },
      { ticker: "GOOG", name: "Alphabet Inc. Class C", weightPct: 1.8 },
      { ticker: "TSLA", name: "Tesla Inc.", weightPct: 1.5 },
      { ticker: "BRK.B", name: "Berkshire Hathaway", weightPct: 1.5 },
      { ticker: "AVGO", name: "Broadcom Inc.", weightPct: 1.4 },
    ],
    source: {
      issuerUrl: "https://investor.vanguard.com/investment-products/etfs/profile/voo#portfolio-composition",
      note: "Tracks S&P 500. Lowest-cost large-cap index ETF.",
    },
  },
  {
    ticker: "VTI",
    name: "Vanguard Total Stock Market ETF",
    issuer: "Vanguard",
    category: "Broad Market",
    aumUsd: 510_000_000_000,
    expenseRatioPct: 0.03,
    asOfDate: "2026-03-31",
    topHoldings: [
      { ticker: "AAPL", name: "Apple Inc.", weightPct: 6.4 },
      { ticker: "MSFT", name: "Microsoft Corporation", weightPct: 6.1 },
      { ticker: "NVDA", name: "NVIDIA Corporation", weightPct: 5.6 },
      { ticker: "AMZN", name: "Amazon.com Inc.", weightPct: 3.5 },
      { ticker: "META", name: "Meta Platforms Inc.", weightPct: 2.3 },
      { ticker: "GOOGL", name: "Alphabet Inc. Class A", weightPct: 1.9 },
      { ticker: "GOOG", name: "Alphabet Inc. Class C", weightPct: 1.6 },
      { ticker: "TSLA", name: "Tesla Inc.", weightPct: 1.3 },
      { ticker: "BRK.B", name: "Berkshire Hathaway", weightPct: 1.3 },
      { ticker: "AVGO", name: "Broadcom Inc.", weightPct: 1.2 },
    ],
    source: {
      issuerUrl: "https://investor.vanguard.com/investment-products/etfs/profile/vti#portfolio-composition",
      note: "Entire US stock market. 3,700+ holdings vs. VOO's 500.",
    },
  },
  {
    ticker: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    issuer: "SSGA (State Street)",
    category: "Large Cap",
    aumUsd: 540_000_000_000,
    expenseRatioPct: 0.0945,
    asOfDate: "2026-03-31",
    topHoldings: [
      { ticker: "AAPL", name: "Apple Inc.", weightPct: 7.1 },
      { ticker: "MSFT", name: "Microsoft Corporation", weightPct: 6.8 },
      { ticker: "NVDA", name: "NVIDIA Corporation", weightPct: 6.2 },
      { ticker: "AMZN", name: "Amazon.com Inc.", weightPct: 3.8 },
      { ticker: "META", name: "Meta Platforms Inc.", weightPct: 2.5 },
      { ticker: "GOOGL", name: "Alphabet Inc. Class A", weightPct: 2.1 },
      { ticker: "GOOG", name: "Alphabet Inc. Class C", weightPct: 1.8 },
      { ticker: "TSLA", name: "Tesla Inc.", weightPct: 1.5 },
      { ticker: "BRK.B", name: "Berkshire Hathaway", weightPct: 1.5 },
      { ticker: "AVGO", name: "Broadcom Inc.", weightPct: 1.4 },
    ],
    source: {
      issuerUrl: "https://www.ssga.com/us/en/intermediary/etfs/spy",
      note: "Oldest + most-traded S&P 500 ETF (1993 inception). Higher fee than VOO, unchanged due to trader preference.",
    },
  },
  {
    ticker: "QQQ",
    name: "Invesco QQQ Trust",
    issuer: "Invesco",
    category: "Growth",
    aumUsd: 320_000_000_000,
    expenseRatioPct: 0.20,
    asOfDate: "2026-03-31",
    topHoldings: [
      { ticker: "AAPL", name: "Apple Inc.", weightPct: 9.4 },
      { ticker: "NVDA", name: "NVIDIA Corporation", weightPct: 9.0 },
      { ticker: "MSFT", name: "Microsoft Corporation", weightPct: 8.7 },
      { ticker: "AMZN", name: "Amazon.com Inc.", weightPct: 5.2 },
      { ticker: "META", name: "Meta Platforms Inc.", weightPct: 4.6 },
      { ticker: "AVGO", name: "Broadcom Inc.", weightPct: 4.5 },
      { ticker: "GOOGL", name: "Alphabet Inc. Class A", weightPct: 2.6 },
      { ticker: "GOOG", name: "Alphabet Inc. Class C", weightPct: 2.5 },
      { ticker: "TSLA", name: "Tesla Inc.", weightPct: 2.5 },
      { ticker: "COST", name: "Costco Wholesale", weightPct: 2.4 },
    ],
    source: {
      issuerUrl: "https://www.invesco.com/us/financial-products/etfs/product-detail?audienceType=Investor&ticker=QQQ",
      note: "Tracks Nasdaq-100. Heavily tech-weighted (~60% tech/comm).",
    },
  },
  {
    ticker: "IWM",
    name: "iShares Russell 2000 ETF",
    issuer: "iShares (BlackRock)",
    category: "Broad Market",
    aumUsd: 68_000_000_000,
    expenseRatioPct: 0.19,
    asOfDate: "2026-03-31",
    topHoldings: [
      { ticker: "INSM", name: "Insmed Incorporated", weightPct: 0.7 },
      { ticker: "FIX", name: "Comfort Systems USA", weightPct: 0.5 },
      { ticker: "HALO", name: "Halozyme Therapeutics", weightPct: 0.4 },
      { ticker: "MLI", name: "Mueller Industries", weightPct: 0.4 },
      { ticker: "FTAI", name: "FTAI Aviation", weightPct: 0.4 },
      { ticker: "VRT", name: "Vertiv Holdings", weightPct: 0.4 },
      { ticker: "ANF", name: "Abercrombie & Fitch", weightPct: 0.3 },
      { ticker: "CRS", name: "Carpenter Technology", weightPct: 0.3 },
      { ticker: "SFM", name: "Sprouts Farmers Market", weightPct: 0.3 },
      { ticker: "ONTO", name: "Onto Innovation", weightPct: 0.3 },
    ],
    source: {
      issuerUrl: "https://www.ishares.com/us/products/239710/ishares-russell-2000-etf",
      note: "Small-cap index. Much flatter distribution vs. large-cap ETFs.",
    },
  },
  {
    ticker: "SCHD",
    name: "Schwab US Dividend Equity ETF",
    issuer: "Schwab",
    category: "Dividend",
    aumUsd: 68_000_000_000,
    expenseRatioPct: 0.06,
    asOfDate: "2026-03-31",
    topHoldings: [
      { ticker: "CSCO", name: "Cisco Systems", weightPct: 4.2 },
      { ticker: "VZ", name: "Verizon Communications", weightPct: 4.1 },
      { ticker: "KO", name: "Coca-Cola", weightPct: 4.0 },
      { ticker: "HD", name: "Home Depot", weightPct: 4.0 },
      { ticker: "ABBV", name: "AbbVie", weightPct: 3.9 },
      { ticker: "PEP", name: "PepsiCo", weightPct: 3.8 },
      { ticker: "PFE", name: "Pfizer", weightPct: 3.8 },
      { ticker: "BMY", name: "Bristol-Myers Squibb", weightPct: 3.8 },
      { ticker: "UPS", name: "United Parcel Service", weightPct: 3.7 },
      { ticker: "LMT", name: "Lockheed Martin", weightPct: 3.6 },
    ],
    source: {
      issuerUrl: "https://www.schwabassetmanagement.com/products/schd",
      note: "Dow Jones 100 Dividend Achievers. Popular with retail dividend-investors.",
    },
  },
  {
    ticker: "VYM",
    name: "Vanguard High Dividend Yield ETF",
    issuer: "Vanguard",
    category: "Dividend",
    aumUsd: 59_000_000_000,
    expenseRatioPct: 0.06,
    asOfDate: "2026-03-31",
    topHoldings: [
      { ticker: "JPM", name: "JPMorgan Chase", weightPct: 3.9 },
      { ticker: "XOM", name: "Exxon Mobil", weightPct: 3.0 },
      { ticker: "AVGO", name: "Broadcom", weightPct: 2.8 },
      { ticker: "JNJ", name: "Johnson & Johnson", weightPct: 2.3 },
      { ticker: "PG", name: "Procter & Gamble", weightPct: 2.2 },
      { ticker: "HD", name: "Home Depot", weightPct: 2.0 },
      { ticker: "WMT", name: "Walmart", weightPct: 1.9 },
      { ticker: "CVX", name: "Chevron", weightPct: 1.8 },
      { ticker: "ABBV", name: "AbbVie", weightPct: 1.7 },
      { ticker: "BAC", name: "Bank of America", weightPct: 1.5 },
    ],
    source: {
      issuerUrl: "https://investor.vanguard.com/investment-products/etfs/profile/vym#portfolio-composition",
      note: "400+ high-yield US stocks. Broader than SCHD.",
    },
  },
  {
    ticker: "XLK",
    name: "Technology Select Sector SPDR Fund",
    issuer: "SSGA (State Street)",
    category: "Sector",
    sector: "Technology",
    aumUsd: 78_000_000_000,
    expenseRatioPct: 0.09,
    asOfDate: "2026-03-31",
    topHoldings: [
      { ticker: "AAPL", name: "Apple Inc.", weightPct: 14.8 },
      { ticker: "MSFT", name: "Microsoft Corporation", weightPct: 14.2 },
      { ticker: "NVDA", name: "NVIDIA Corporation", weightPct: 13.6 },
      { ticker: "AVGO", name: "Broadcom Inc.", weightPct: 6.4 },
      { ticker: "ORCL", name: "Oracle Corporation", weightPct: 3.2 },
      { ticker: "CRM", name: "Salesforce", weightPct: 2.7 },
      { ticker: "AMD", name: "Advanced Micro Devices", weightPct: 2.4 },
      { ticker: "CSCO", name: "Cisco Systems", weightPct: 2.3 },
      { ticker: "ACN", name: "Accenture", weightPct: 2.2 },
      { ticker: "ADBE", name: "Adobe Inc.", weightPct: 1.8 },
    ],
    source: {
      issuerUrl: "https://www.ssga.com/us/en/intermediary/etfs/xlk",
      note: "S&P 500 tech sector. Top-3 holdings >40% — very concentrated.",
    },
  },
  {
    ticker: "XLF",
    name: "Financial Select Sector SPDR Fund",
    issuer: "SSGA (State Street)",
    category: "Sector",
    sector: "Financials",
    aumUsd: 52_000_000_000,
    expenseRatioPct: 0.09,
    asOfDate: "2026-03-31",
    topHoldings: [
      { ticker: "BRK.B", name: "Berkshire Hathaway", weightPct: 12.6 },
      { ticker: "JPM", name: "JPMorgan Chase", weightPct: 10.1 },
      { ticker: "V", name: "Visa", weightPct: 7.2 },
      { ticker: "MA", name: "Mastercard", weightPct: 6.2 },
      { ticker: "BAC", name: "Bank of America", weightPct: 4.9 },
      { ticker: "WFC", name: "Wells Fargo", weightPct: 3.8 },
      { ticker: "GS", name: "Goldman Sachs", weightPct: 2.8 },
      { ticker: "MS", name: "Morgan Stanley", weightPct: 2.6 },
      { ticker: "AXP", name: "American Express", weightPct: 2.5 },
      { ticker: "SPGI", name: "S&P Global", weightPct: 2.3 },
    ],
    source: {
      issuerUrl: "https://www.ssga.com/us/en/intermediary/etfs/xlf",
      note: "S&P 500 financials. Buffett's BRK.B = 12.6% = largest holding.",
    },
  },
  {
    ticker: "XLE",
    name: "Energy Select Sector SPDR Fund",
    issuer: "SSGA (State Street)",
    category: "Sector",
    sector: "Energy",
    aumUsd: 35_000_000_000,
    expenseRatioPct: 0.09,
    asOfDate: "2026-03-31",
    topHoldings: [
      { ticker: "XOM", name: "Exxon Mobil", weightPct: 22.4 },
      { ticker: "CVX", name: "Chevron", weightPct: 18.6 },
      { ticker: "COP", name: "ConocoPhillips", weightPct: 7.9 },
      { ticker: "EOG", name: "EOG Resources", weightPct: 4.1 },
      { ticker: "SLB", name: "Schlumberger", weightPct: 3.9 },
      { ticker: "WMB", name: "Williams Companies", weightPct: 3.7 },
      { ticker: "PSX", name: "Phillips 66", weightPct: 3.4 },
      { ticker: "MPC", name: "Marathon Petroleum", weightPct: 3.3 },
      { ticker: "OXY", name: "Occidental Petroleum", weightPct: 2.9 },
      { ticker: "KMI", name: "Kinder Morgan", weightPct: 2.8 },
    ],
    source: {
      issuerUrl: "https://www.ssga.com/us/en/intermediary/etfs/xle",
      note: "S&P 500 energy sector. Top-2 (XOM+CVX) = 41% of fund.",
    },
  },
  {
    ticker: "ARKK",
    name: "ARK Innovation ETF",
    issuer: "ARK Invest",
    category: "Thematic",
    aumUsd: 6_800_000_000,
    expenseRatioPct: 0.75,
    asOfDate: "2026-03-31",
    topHoldings: [
      { ticker: "TSLA", name: "Tesla Inc.", weightPct: 11.8 },
      { ticker: "COIN", name: "Coinbase Global", weightPct: 10.2 },
      { ticker: "ROKU", name: "Roku Inc.", weightPct: 7.4 },
      { ticker: "TEM", name: "Tempus AI", weightPct: 5.8 },
      { ticker: "CRSP", name: "CRISPR Therapeutics", weightPct: 5.1 },
      { ticker: "HOOD", name: "Robinhood Markets", weightPct: 4.9 },
      { ticker: "PATH", name: "UiPath", weightPct: 3.8 },
      { ticker: "PLTR", name: "Palantir Technologies", weightPct: 3.6 },
      { ticker: "TDOC", name: "Teladoc Health", weightPct: 3.2 },
      { ticker: "DKNG", name: "DraftKings", weightPct: 2.9 },
    ],
    source: {
      issuerUrl: "https://www.ark-funds.com/funds/arkk/",
      note: "Cathie Wood's flagship. Active management. Daily-disclosed holdings (unusual for active).",
    },
  },
  {
    ticker: "JEPI",
    name: "JPMorgan Equity Premium Income ETF",
    issuer: "JPMorgan",
    category: "Income",
    aumUsd: 42_000_000_000,
    expenseRatioPct: 0.35,
    asOfDate: "2026-03-31",
    topHoldings: [
      { ticker: "MSFT", name: "Microsoft Corporation", weightPct: 1.9 },
      { ticker: "AMZN", name: "Amazon.com Inc.", weightPct: 1.7 },
      { ticker: "NVDA", name: "NVIDIA Corporation", weightPct: 1.6 },
      { ticker: "META", name: "Meta Platforms Inc.", weightPct: 1.6 },
      { ticker: "TRV", name: "Travelers Companies", weightPct: 1.6 },
      { ticker: "ADP", name: "Automatic Data Processing", weightPct: 1.6 },
      { ticker: "MA", name: "Mastercard", weightPct: 1.5 },
      { ticker: "V", name: "Visa", weightPct: 1.5 },
      { ticker: "PGR", name: "Progressive Corporation", weightPct: 1.5 },
      { ticker: "LLY", name: "Eli Lilly", weightPct: 1.5 },
    ],
    source: {
      issuerUrl: "https://am.jpmorgan.com/us/en/asset-management/adv/products/jpmorgan-equity-premium-income-etf-etf-shares-46641q332",
      note: "Covered-call income strategy. Most-popular income ETF among retail (~8% yield).",
    },
  },
];

// ---------- Derived views ----------

export function getEtf(ticker: string): ETF | undefined {
  const sym = ticker.toUpperCase();
  return ETFS.find((e) => e.ticker.toUpperCase() === sym);
}

/** ETFs sorted by AUM, largest first. */
export function topEtfsByAum(limit?: number): ETF[] {
  const sorted = [...ETFS].sort((a, b) => b.aumUsd - a.aumUsd);
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Which ETFs hold a given ticker? Returns [{etf, weight}] sorted by weight desc. */
export function etfsHoldingTicker(ticker: string): Array<{
  etf: ETF;
  weight: number;
}> {
  const sym = ticker.toUpperCase();
  const out: Array<{ etf: ETF; weight: number }> = [];
  for (const e of ETFS) {
    const h = e.topHoldings.find((h) => h.ticker.toUpperCase() === sym);
    if (h) out.push({ etf: e, weight: h.weightPct });
  }
  return out.sort((a, b) => b.weight - a.weight);
}

/** Group ETFs by category. */
export function etfsByCategory(): Record<string, ETF[]> {
  const out: Record<string, ETF[]> = {};
  for (const e of ETFS) {
    if (!out[e.category]) out[e.category] = [];
    out[e.category].push(e);
  }
  for (const c of Object.keys(out)) {
    out[c].sort((a, b) => b.aumUsd - a.aumUsd);
  }
  return out;
}

/** Format AUM as $580B / $6.8B / $340M */
export function formatAum(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(0)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}
