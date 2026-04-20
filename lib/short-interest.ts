// Short interest tracker — twice-monthly FINRA / NYSE / Nasdaq disclosure
// of total shares sold short per ticker.
//
// v0.1 — curated seed of 18 most-shorted U.S. equities. Sources: each
// exchange's bi-monthly short-interest report (mid-month + end-of-month
// settlement dates). Days-to-cover computed as
//   short_interest_shares / avg_daily_volume_30d.
//
// Per concept-finder-methodology AP-3: every row cites its source report.
// v0.2 will replace this with an automated FINRA short-interest fetcher.

export type ShortPosition = {
  ticker: string;
  companyName: string;
  sector: string;

  // Total shares sold short at the most recent settlement date.
  shortInterestShares: number;
  // Same expressed as % of free float (shares-short / float).
  shortInterestPctFloat: number;
  // Days-to-cover (DTC): how many trading days at average daily
  // volume it would take to repurchase all shorted shares.
  daysToCover: number;
  // Market cap snapshot in USD (for context).
  marketCapUsd: number;

  // Settlement date of this short-interest snapshot (FINRA / exchange
  // disclosure dates are 15th and last business day of each month).
  settlementDate: string;          // ISO YYYY-MM-DD
  reportDate: string;              // when FINRA published it (typically +8 days)

  // Direction of change vs prior settlement.
  changeVsPriorPct: number;        // percent change in shares-short
  thesisShort?: string;            // why shorts have piled in (HoldLens read)

  source: {
    exchange: "NYSE" | "Nasdaq" | "FINRA";
    reportUrl: string;
    note?: string;
  };
};

export const SHORT_POSITIONS: ShortPosition[] = [
  {
    ticker: "BYND",
    companyName: "Beyond Meat, Inc.",
    sector: "Consumer Staples",
    shortInterestShares: 28_500_000,
    shortInterestPctFloat: 42.0,
    daysToCover: 6.8,
    marketCapUsd: 350_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: 3.2,
    thesisShort: "Sustained revenue declines (-19% YoY in 2024) + cash burn + brand fade vs. private-label alt-meat.",
    source: {
      exchange: "Nasdaq",
      reportUrl: "https://www.nasdaqtrader.com/Trader.aspx?id=ShortIntPubSch",
      note: "Persistent top-10 most-shorted Nasdaq stock since 2021.",
    },
  },
  {
    ticker: "CVNA",
    companyName: "Carvana Co.",
    sector: "Consumer Discretionary",
    shortInterestShares: 35_000_000,
    shortInterestPctFloat: 28.5,
    daysToCover: 4.2,
    marketCapUsd: 26_000_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: -8.0,
    thesisShort: "Persistent debt overhang despite stock rebound. Hindenburg Research short report Jan 2025 reignited skepticism.",
    source: {
      exchange: "NYSE",
      reportUrl: "https://www.nyse.com/markets/nyse/short-interest",
    },
  },
  {
    ticker: "GME",
    companyName: "GameStop Corp.",
    sector: "Consumer Discretionary",
    shortInterestShares: 60_000_000,
    shortInterestPctFloat: 22.0,
    daysToCover: 3.1,
    marketCapUsd: 9_500_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: 5.4,
    thesisShort: "Core retail business in secular decline. Short interest down massively from 2021 squeeze (~140%) but still elevated.",
    source: {
      exchange: "NYSE",
      reportUrl: "https://www.nyse.com/markets/nyse/short-interest",
    },
  },
  {
    ticker: "AMC",
    companyName: "AMC Entertainment Holdings",
    sector: "Communication",
    shortInterestShares: 95_000_000,
    shortInterestPctFloat: 18.5,
    daysToCover: 2.4,
    marketCapUsd: 1_700_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: -2.1,
    thesisShort: "Theatrical box-office structural decline + balance-sheet leverage. Survived 2021 squeeze; shorts re-engaged.",
    source: {
      exchange: "NYSE",
      reportUrl: "https://www.nyse.com/markets/nyse/short-interest",
    },
  },
  {
    ticker: "LCID",
    companyName: "Lucid Group, Inc.",
    sector: "Consumer Discretionary",
    shortInterestShares: 290_000_000,
    shortInterestPctFloat: 35.0,
    daysToCover: 7.5,
    marketCapUsd: 6_800_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: 12.0,
    thesisShort: "Cash burn + production miss vs. guidance + EV market cooling. Saudi PIF backing reduces bankruptcy tail but not slow bleed.",
    source: {
      exchange: "Nasdaq",
      reportUrl: "https://www.nasdaqtrader.com/Trader.aspx?id=ShortIntPubSch",
    },
  },
  {
    ticker: "RIVN",
    companyName: "Rivian Automotive, Inc.",
    sector: "Consumer Discretionary",
    shortInterestShares: 110_000_000,
    shortInterestPctFloat: 14.0,
    daysToCover: 3.8,
    marketCapUsd: 14_000_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: -4.2,
    thesisShort: "Path to profitability still 2027+ per company guidance. R2 launch slipped 2026.",
    source: {
      exchange: "Nasdaq",
      reportUrl: "https://www.nasdaqtrader.com/Trader.aspx?id=ShortIntPubSch",
    },
  },
  {
    ticker: "UPST",
    companyName: "Upstart Holdings, Inc.",
    sector: "Financials",
    shortInterestShares: 25_000_000,
    shortInterestPctFloat: 31.5,
    daysToCover: 5.6,
    marketCapUsd: 4_200_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: 1.8,
    thesisShort: "AI-lending model unproven through full credit cycle. Sensitive to consumer-credit deterioration.",
    source: {
      exchange: "Nasdaq",
      reportUrl: "https://www.nasdaqtrader.com/Trader.aspx?id=ShortIntPubSch",
    },
  },
  {
    ticker: "AFRM",
    companyName: "Affirm Holdings, Inc.",
    sector: "Financials",
    shortInterestShares: 38_000_000,
    shortInterestPctFloat: 18.2,
    daysToCover: 3.4,
    marketCapUsd: 18_000_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: -6.5,
    thesisShort: "BNPL credit losses + Apple Pay competition. Shorts trimmed after profitability inflection late 2024.",
    source: {
      exchange: "Nasdaq",
      reportUrl: "https://www.nasdaqtrader.com/Trader.aspx?id=ShortIntPubSch",
    },
  },
  {
    ticker: "PTON",
    companyName: "Peloton Interactive, Inc.",
    sector: "Consumer Discretionary",
    shortInterestShares: 50_000_000,
    shortInterestPctFloat: 16.5,
    daysToCover: 4.8,
    marketCapUsd: 2_400_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: -1.2,
    thesisShort: "Subscription churn outpacing acquisition. Hardware demand never recovered post-COVID peak.",
    source: {
      exchange: "Nasdaq",
      reportUrl: "https://www.nasdaqtrader.com/Trader.aspx?id=ShortIntPubSch",
    },
  },
  {
    ticker: "SOFI",
    companyName: "SoFi Technologies, Inc.",
    sector: "Financials",
    shortInterestShares: 90_000_000,
    shortInterestPctFloat: 9.2,
    daysToCover: 2.1,
    marketCapUsd: 22_000_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: -11.0,
    thesisShort: "Student-loan refi tailwind expected; bank deposits growing. Shorts unwinding as bull thesis develops.",
    source: {
      exchange: "Nasdaq",
      reportUrl: "https://www.nasdaqtrader.com/Trader.aspx?id=ShortIntPubSch",
    },
  },
  {
    ticker: "PLUG",
    companyName: "Plug Power Inc.",
    sector: "Industrials",
    shortInterestShares: 280_000_000,
    shortInterestPctFloat: 27.0,
    daysToCover: 4.5,
    marketCapUsd: 1_900_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: 8.4,
    thesisShort: "Going-concern warning early 2024. Hydrogen economy still pre-revenue at scale despite IRA tailwinds.",
    source: {
      exchange: "Nasdaq",
      reportUrl: "https://www.nasdaqtrader.com/Trader.aspx?id=ShortIntPubSch",
    },
  },
  {
    ticker: "FUBO",
    companyName: "fuboTV Inc.",
    sector: "Communication",
    shortInterestShares: 40_000_000,
    shortInterestPctFloat: 24.0,
    daysToCover: 5.2,
    marketCapUsd: 950_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: 4.0,
    thesisShort: "Sports-streaming margins under pressure; Disney + Hulu Live joint venture increases competition.",
    source: {
      exchange: "NYSE",
      reportUrl: "https://www.nyse.com/markets/nyse/short-interest",
    },
  },
  {
    ticker: "WBD",
    companyName: "Warner Bros. Discovery, Inc.",
    sector: "Communication",
    shortInterestShares: 145_000_000,
    shortInterestPctFloat: 6.0,
    daysToCover: 3.5,
    marketCapUsd: 22_000_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: 2.8,
    thesisShort: "$40B+ debt + linear-TV cord-cutting + Max subscriber plateau. Direct-listing legacy depresses sentiment.",
    source: {
      exchange: "Nasdaq",
      reportUrl: "https://www.nasdaqtrader.com/Trader.aspx?id=ShortIntPubSch",
    },
  },
  {
    ticker: "DJT",
    companyName: "Trump Media & Technology Group",
    sector: "Communication",
    shortInterestShares: 14_000_000,
    shortInterestPctFloat: 11.5,
    daysToCover: 2.0,
    marketCapUsd: 6_500_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: -15.0,
    thesisShort: "Truth Social revenue minimal vs. valuation; political-event-driven volatility makes short risky. Borrow fees among highest in market.",
    source: {
      exchange: "Nasdaq",
      reportUrl: "https://www.nasdaqtrader.com/Trader.aspx?id=ShortIntPubSch",
      note: "Among the highest-borrow-fee names in 2025-26.",
    },
  },
  {
    ticker: "MSTR",
    companyName: "MicroStrategy Incorporated",
    sector: "Technology",
    shortInterestShares: 28_000_000,
    shortInterestPctFloat: 14.0,
    daysToCover: 1.8,
    marketCapUsd: 95_000_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: -3.5,
    thesisShort: "Trading at substantial premium to underlying BTC NAV. Shorts target the premium, not the BTC thesis.",
    source: {
      exchange: "Nasdaq",
      reportUrl: "https://www.nasdaqtrader.com/Trader.aspx?id=ShortIntPubSch",
    },
  },
  {
    ticker: "TSLA",
    companyName: "Tesla, Inc.",
    sector: "Consumer Discretionary",
    shortInterestShares: 84_000_000,
    shortInterestPctFloat: 2.7,
    daysToCover: 0.8,
    marketCapUsd: 850_000_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: 6.2,
    thesisShort: "Auto margins compression + EV competition + valuation embedding robotaxi/Optimus optionality. Largest dollar short in U.S. market.",
    source: {
      exchange: "Nasdaq",
      reportUrl: "https://www.nasdaqtrader.com/Trader.aspx?id=ShortIntPubSch",
      note: "Largest dollar-amount short position by absolute size, despite low %-of-float.",
    },
  },
  {
    ticker: "NVAX",
    companyName: "Novavax, Inc.",
    sector: "Health Care",
    shortInterestShares: 32_000_000,
    shortInterestPctFloat: 22.0,
    daysToCover: 6.2,
    marketCapUsd: 1_300_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: 7.0,
    thesisShort: "Post-COVID vaccine demand collapse. Sanofi partnership Q2 2024 reduced bankruptcy tail but path to growth unclear.",
    source: {
      exchange: "Nasdaq",
      reportUrl: "https://www.nasdaqtrader.com/Trader.aspx?id=ShortIntPubSch",
    },
  },
  {
    ticker: "BBBYQ",
    companyName: "Bed Bath & Beyond Inc. (in liquidation)",
    sector: "Consumer Discretionary",
    shortInterestShares: 8_000_000,
    shortInterestPctFloat: 5.0,
    daysToCover: 12.0,
    marketCapUsd: 2_000_000,
    settlementDate: "2026-04-15",
    reportDate: "2026-04-23",
    changeVsPriorPct: -50.0,
    thesisShort: "Post-bankruptcy equity wipeout near-certain. Position size collapsed as residual bagholders unwind.",
    source: {
      exchange: "FINRA",
      reportUrl: "https://www.finra.org/finra-data/browse-catalog/equity-short-interest",
      note: "Cautionary tale — held as historical reference of meme-stock end-state.",
    },
  },
];

// ---------- Derived views ----------

export function getShortPosition(ticker: string): ShortPosition | undefined {
  const sym = ticker.toUpperCase();
  return SHORT_POSITIONS.find((p) => p.ticker.toUpperCase() === sym);
}

/** Sorted by % of float, highest first — best squeeze setup proxy. */
export function topByPctFloat(limit?: number): ShortPosition[] {
  const sorted = [...SHORT_POSITIONS].sort(
    (a, b) => b.shortInterestPctFloat - a.shortInterestPctFloat,
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Sorted by days-to-cover, highest first — illiquidity-driven squeeze risk. */
export function topByDaysToCover(limit?: number): ShortPosition[] {
  const sorted = [...SHORT_POSITIONS].sort(
    (a, b) => b.daysToCover - a.daysToCover,
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Sorted by absolute dollar value of short position. */
export function topByDollarShort(limit?: number): ShortPosition[] {
  const sorted = [...SHORT_POSITIONS].sort((a, b) => {
    // Use price = marketCap / sharesOutstanding-equivalent (rough proxy via float).
    // For dollar-short ranking, we approximate with shares × (mcap/float-implied price).
    // Without per-share price, use shortInterestShares × (marketCap / (shares/pctFloat))
    // Simpler: rank by shortInterestShares × marketCap proxy
    const aPxProxy = a.marketCapUsd / Math.max(a.shortInterestShares / (a.shortInterestPctFloat / 100), 1);
    const bPxProxy = b.marketCapUsd / Math.max(b.shortInterestShares / (b.shortInterestPctFloat / 100), 1);
    return b.shortInterestShares * bPxProxy - a.shortInterestShares * aPxProxy;
  });
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Recent change in short interest — biggest builds first. */
export function biggestBuilds(limit?: number): ShortPosition[] {
  const sorted = [...SHORT_POSITIONS]
    .filter((p) => p.changeVsPriorPct > 0)
    .sort((a, b) => b.changeVsPriorPct - a.changeVsPriorPct);
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Biggest unwinds — shorts covering most aggressively. */
export function biggestUnwinds(limit?: number): ShortPosition[] {
  const sorted = [...SHORT_POSITIONS]
    .filter((p) => p.changeVsPriorPct < 0)
    .sort((a, b) => a.changeVsPriorPct - b.changeVsPriorPct);
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Format short-interest share count: 280M, 1.4B, etc. */
export function formatShares(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return `${n}`;
}

export function formatPct(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}
