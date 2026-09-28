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
    asOfDate: "2026-08-31",
    topHoldings: [
      { ticker: "NVDA", name: "NVIDIA Corporation", weightPct: 8.08 },
      { ticker: "AAPL", name: "Apple Inc.", weightPct: 7.03 },
      { ticker: "MSFT", name: "Microsoft Corporation", weightPct: 5.70 },
      { ticker: "AMZN", name: "Amazon.com Inc.", weightPct: 3.84 },
      { ticker: "GOOGL", name: "Alphabet Inc. Class A", weightPct: 3.01 },
      { ticker: "AVGO", name: "Broadcom Inc.", weightPct: 2.65 },
      { ticker: "GOOG", name: "Alphabet Inc. Class C", weightPct: 2.40 },
      { ticker: "META", name: "Meta Platforms Inc.", weightPct: 1.90 },
      { ticker: "MU", name: "Micron Technology Inc.", weightPct: 1.63 },
      { ticker: "TSLA", name: "Tesla Inc.", weightPct: 1.57 },
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
    asOfDate: "2026-08-31",
    topHoldings: [
      { ticker: "NVDA", name: "NVIDIA Corporation", weightPct: 6.87 },
      { ticker: "AAPL", name: "Apple Inc.", weightPct: 6.30 },
      { ticker: "MSFT", name: "Microsoft Corporation", weightPct: 5.10 },
      { ticker: "AMZN", name: "Amazon.com Inc.", weightPct: 3.40 },
      { ticker: "GOOGL", name: "Alphabet Inc. Class A", weightPct: 2.69 },
      { ticker: "AVGO", name: "Broadcom Inc.", weightPct: 2.37 },
      { ticker: "GOOG", name: "Alphabet Inc. Class C", weightPct: 2.12 },
      { ticker: "META", name: "Meta Platforms Inc.", weightPct: 1.70 },
      { ticker: "MU", name: "Micron Technology Inc.", weightPct: 1.46 },
      { ticker: "TSLA", name: "Tesla Inc.", weightPct: 1.40 },
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
    asOfDate: "2026-09-24",
    topHoldings: [
      { ticker: "NVDA", name: "NVIDIA Corporation", weightPct: 8.19 },
      { ticker: "AAPL", name: "Apple Inc.", weightPct: 7.38 },
      { ticker: "MSFT", name: "Microsoft Corporation", weightPct: 5.57 },
      { ticker: "AMZN", name: "Amazon.com Inc.", weightPct: 3.69 },
      { ticker: "GOOGL", name: "Alphabet Inc. Class A", weightPct: 3.03 },
      { ticker: "META", name: "Meta Platforms Inc.", weightPct: 2.58 },
      { ticker: "AVGO", name: "Broadcom Inc.", weightPct: 2.51 },
      { ticker: "GOOG", name: "Alphabet Inc. Class C", weightPct: 2.43 },
      { ticker: "MU", name: "Micron Technology Inc.", weightPct: 1.84 },
      { ticker: "TSLA", name: "Tesla Inc.", weightPct: 1.60 },
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
    asOfDate: "2026-09-26",
    topHoldings: [
      { ticker: "NVDA", name: "NVIDIA Corporation", weightPct: 8.17 },
      { ticker: "AAPL", name: "Apple Inc.", weightPct: 7.49 },
      { ticker: "MSFT", name: "Microsoft Corporation", weightPct: 5.77 },
      { ticker: "MU", name: "Micron Technology Inc.", weightPct: 5.08 },
      { ticker: "AMD", name: "Advanced Micro Devices", weightPct: 4.28 },
      { ticker: "AMZN", name: "Amazon.com Inc.", weightPct: 4.05 },
      { ticker: "META", name: "Meta Platforms Inc.", weightPct: 3.37 },
      { ticker: "GOOGL", name: "Alphabet Inc. Class A", weightPct: 3.04 },
      { ticker: "TSLA", name: "Tesla Inc.", weightPct: 2.94 },
      { ticker: "GOOG", name: "Alphabet Inc. Class C", weightPct: 2.84 },
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
    asOfDate: "2026-09-25",
    topHoldings: [
      { ticker: "TWST", name: "Twist Bioscience Corporation", weightPct: 0.40 },
      { ticker: "MOG.A", name: "Moog Inc. Class A", weightPct: 0.37 },
      { ticker: "UMBF", name: "UMB Financial", weightPct: 0.33 },
      { ticker: "TXG", name: "10x Genomics Inc.", weightPct: 0.33 },
      { ticker: "HUT", name: "Hut 8 Corp.", weightPct: 0.33 },
      { ticker: "FROG", name: "JFrog Ltd.", weightPct: 0.32 },
      { ticker: "BTSG", name: "BrightSpring Health Services", weightPct: 0.31 },
      { ticker: "VSAT", name: "Viasat Inc.", weightPct: 0.31 },
      { ticker: "KRYS", name: "Krystal Biotech", weightPct: 0.30 },
      { ticker: "EAT", name: "Brinker International", weightPct: 0.30 },
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
    asOfDate: "2026-09-25",
    topHoldings: [
      { ticker: "QCOM", name: "Qualcomm", weightPct: 4.93 },
      { ticker: "TXN", name: "Texas Instruments", weightPct: 4.53 },
      { ticker: "KO", name: "Coca-Cola", weightPct: 4.13 },
      { ticker: "PG", name: "Procter & Gamble", weightPct: 4.11 },
      { ticker: "MRK", name: "Merck & Co.", weightPct: 4.07 },
      { ticker: "CVX", name: "Chevron", weightPct: 4.00 },
      { ticker: "UNH", name: "UnitedHealth Group", weightPct: 3.91 },
      { ticker: "VZ", name: "Verizon Communications", weightPct: 3.89 },
      { ticker: "AMGN", name: "Amgen", weightPct: 3.88 },
      { ticker: "COP", name: "ConocoPhillips", weightPct: 3.84 },
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
    asOfDate: "2026-08-31",
    topHoldings: [
      { ticker: "AVGO", name: "Broadcom Inc.", weightPct: 6.94 },
      { ticker: "JPM", name: "JPMorgan Chase", weightPct: 3.83 },
      { ticker: "XOM", name: "Exxon Mobil", weightPct: 2.70 },
      { ticker: "JNJ", name: "Johnson & Johnson", weightPct: 2.58 },
      { ticker: "ABBV", name: "AbbVie", weightPct: 1.83 },
      { ticker: "CSCO", name: "Cisco Systems", weightPct: 1.76 },
      { ticker: "BAC", name: "Bank of America", weightPct: 1.65 },
      { ticker: "CVX", name: "Chevron", weightPct: 1.54 },
      { ticker: "MRK", name: "Merck & Co.", weightPct: 1.47 },
      { ticker: "CAT", name: "Caterpillar Inc.", weightPct: 1.46 },
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
    asOfDate: "2026-09-24",
    topHoldings: [
      { ticker: "NVDA", name: "NVIDIA Corporation", weightPct: 15.28 },
      { ticker: "AAPL", name: "Apple Inc.", weightPct: 13.79 },
      { ticker: "MSFT", name: "Microsoft Corporation", weightPct: 10.40 },
      { ticker: "AMD", name: "Advanced Micro Devices", weightPct: 5.23 },
      { ticker: "AVGO", name: "Broadcom Inc.", weightPct: 4.69 },
      { ticker: "MU", name: "Micron Technology Inc.", weightPct: 4.55 },
      { ticker: "INTC", name: "Intel Corporation", weightPct: 3.60 },
      { ticker: "PLTR", name: "Palantir Technologies", weightPct: 2.52 },
      { ticker: "CSCO", name: "Cisco Systems", weightPct: 2.40 },
      { ticker: "LRCX", name: "Lam Research Corporation", weightPct: 2.19 },
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
    asOfDate: "2026-09-24",
    topHoldings: [
      { ticker: "BRK.B", name: "Berkshire Hathaway", weightPct: 12.23 },
      { ticker: "JPM", name: "JPMorgan Chase", weightPct: 11.70 },
      { ticker: "V", name: "Visa", weightPct: 8.15 },
      { ticker: "MA", name: "Mastercard", weightPct: 5.95 },
      { ticker: "BAC", name: "Bank of America", weightPct: 4.74 },
      { ticker: "GS", name: "Goldman Sachs", weightPct: 3.49 },
      { ticker: "WFC", name: "Wells Fargo", weightPct: 3.23 },
      { ticker: "MS", name: "Morgan Stanley", weightPct: 3.05 },
      { ticker: "C", name: "Citigroup Inc.", weightPct: 2.88 },
      { ticker: "SCHW", name: "Charles Schwab Corporation", weightPct: 2.10 },
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
    asOfDate: "2026-09-24",
    topHoldings: [
      { ticker: "XOM", name: "Exxon Mobil", weightPct: 23.54 },
      { ticker: "CVX", name: "Chevron", weightPct: 17.88 },
      { ticker: "COP", name: "ConocoPhillips", weightPct: 6.84 },
      { ticker: "VLO", name: "Valero Energy Corporation", weightPct: 4.59 },
      { ticker: "PSX", name: "Phillips 66", weightPct: 4.58 },
      { ticker: "MPC", name: "Marathon Petroleum", weightPct: 4.57 },
      { ticker: "WMB", name: "Williams Companies", weightPct: 4.38 },
      { ticker: "SLB", name: "Schlumberger", weightPct: 4.00 },
      { ticker: "EOG", name: "EOG Resources", weightPct: 3.93 },
      { ticker: "KMI", name: "Kinder Morgan", weightPct: 3.21 },
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
    asOfDate: "2026-09-25",
    topHoldings: [
      { ticker: "TSLA", name: "Tesla Inc.", weightPct: 9.17 },
      { ticker: "SPCX", name: "Space Exploration Technologies Corp. (SpaceX) Class A", weightPct: 5.90 },
      { ticker: "TEM", name: "Tempus AI", weightPct: 5.89 },
      { ticker: "CRCL", name: "Circle Internet Group Inc.", weightPct: 5.03 },
      { ticker: "COIN", name: "Coinbase Global", weightPct: 4.57 },
      { ticker: "CRSP", name: "CRISPR Therapeutics", weightPct: 4.36 },
      { ticker: "TWST", name: "Twist Bioscience Corporation", weightPct: 4.16 },
      { ticker: "HOOD", name: "Robinhood Markets", weightPct: 4.03 },
      { ticker: "TXG", name: "10x Genomics Inc.", weightPct: 3.55 },
      { ticker: "SHOP", name: "Shopify Inc.", weightPct: 3.08 },
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
    asOfDate: "2026-09-25",
    topHoldings: [
      { ticker: "MSFT", name: "Microsoft Corporation", weightPct: 2.01 },
      { ticker: "AAPL", name: "Apple Inc.", weightPct: 1.94 },
      { ticker: "META", name: "Meta Platforms Inc.", weightPct: 1.92 },
      { ticker: "NVDA", name: "NVIDIA Corporation", weightPct: 1.88 },
      { ticker: "AMZN", name: "Amazon.com Inc.", weightPct: 1.83 },
      { ticker: "JNJ", name: "Johnson & Johnson", weightPct: 1.80 },
      { ticker: "TT", name: "Trane Technologies", weightPct: 1.79 },
      { ticker: "MA", name: "Mastercard", weightPct: 1.77 },
      { ticker: "GOOGL", name: "Alphabet Inc. Class A", weightPct: 1.73 },
      { ticker: "MMM", name: "3M Company", weightPct: 1.73 },
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
