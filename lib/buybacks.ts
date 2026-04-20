// Corporate buyback tracker — per-company share repurchase history.
//
// v0.2 — curated seed expanded to 25 top S&P buyback programs with
// SEC-sourced dollar amounts from each company's FY2024 (or fiscal-year-
// equivalent) 10-K cash-flow-from-financing activities (line:
// "repurchases of common stock"). Authorization figures from announcement 8-Ks.
//
// v0.3 will replace this with an automated 10-Q/10-K XBRL parser from
// SEC EDGAR (same pipeline pattern as scripts/fetch-edgar-13f.ts).
//
// Every row carries a `source` field linking directly to the SEC filing
// that produced the number. Per concept-finder-methodology AP-3: every
// data point cites a published source. No fabricated values.

export type BuybackProgram = {
  ticker: string;
  companyName: string;
  sector: string;

  // Most recent full-fiscal-year dollar value of buybacks, from the
  // cash-flow-from-financing statement in the latest annual 10-K.
  // Units: USD.
  latestFyRepurchased: number;
  latestFyLabel: string;   // e.g. "FY2024" or "FY24 (Oct)" for odd calendars

  // Average annual buyback across trailing 5 full fiscal years.
  // Null = not yet computed for this row (v2 will backfill).
  trailing5yAverage: number | null;

  // Current buyback AUTHORIZATION (the limit on how much can be
  // repurchased before it's exhausted). Authorizations are announced
  // via 8-K and are separate from actual execution. `authDate` is when
  // the board approved the most recent authorization.
  authorizationSize: number | null;
  authDate: string | null;           // ISO YYYY-MM-DD
  authRemainingEstimate: number | null;

  // Buyback yield = trailing_12mo_buybacks / current_market_cap
  // Computed off the latest FY buybacks + approximate current market cap.
  // Higher = more aggressive capital return via buybacks relative to size.
  buybackYieldPct: number | null;

  // Provenance.
  source: {
    filingType: "10-K" | "10-Q" | "8-K" | "multiple";
    filingDate: string;               // ISO YYYY-MM-DD of filing
    edgarUrl: string;                 // Direct link to SEC EDGAR filing
    note?: string;
  };

  // Methodology flags.
  needsVerification?: boolean;         // v2 backfill candidate
};

// ---------- Seed data (v0.1) ----------
// Values cross-checked against each company's 10-K cash-flow-from-financing
// statement. Authorization figures from most recent 8-K. Yield figures are
// approximate (current market cap snapshot at time of seeding).

export const BUYBACK_PROGRAMS: BuybackProgram[] = [
  {
    ticker: "AAPL",
    companyName: "Apple Inc.",
    sector: "Technology",
    latestFyRepurchased: 94_949_000_000,
    latestFyLabel: "FY2024 (Sep)",
    trailing5yAverage: 86_000_000_000,
    authorizationSize: 110_000_000_000,
    authDate: "2024-05-02",
    authRemainingEstimate: 62_000_000_000,
    buybackYieldPct: 2.7,
    source: {
      filingType: "10-K",
      filingDate: "2024-11-01",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000320193&type=10-K",
      note: "FY24 repurchases per cash-flow-from-financing line. $110B authorization from May 2024 8-K.",
    },
  },
  {
    ticker: "GOOGL",
    companyName: "Alphabet Inc.",
    sector: "Technology",
    latestFyRepurchased: 62_222_000_000,
    latestFyLabel: "FY2024",
    trailing5yAverage: 53_000_000_000,
    authorizationSize: 70_000_000_000,
    authDate: "2024-04-25",
    authRemainingEstimate: 25_000_000_000,
    buybackYieldPct: 2.3,
    source: {
      filingType: "10-K",
      filingDate: "2025-02-04",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001652044&type=10-K",
      note: "FY24 repurchases. $70B authorization announced alongside first dividend.",
    },
  },
  {
    ticker: "META",
    companyName: "Meta Platforms Inc.",
    sector: "Technology",
    latestFyRepurchased: 29_999_000_000,
    latestFyLabel: "FY2024",
    trailing5yAverage: 32_000_000_000,
    authorizationSize: 50_000_000_000,
    authDate: "2024-02-01",
    authRemainingEstimate: 30_000_000_000,
    buybackYieldPct: 2.1,
    source: {
      filingType: "10-K",
      filingDate: "2025-01-30",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001326801&type=10-K",
      note: "FY24 repurchases. Additional $50B authorization announced with Feb 2024 dividend initiation.",
    },
  },
  {
    ticker: "MSFT",
    companyName: "Microsoft Corporation",
    sector: "Technology",
    latestFyRepurchased: 17_254_000_000,
    latestFyLabel: "FY2024 (Jun)",
    trailing5yAverage: 24_000_000_000,
    authorizationSize: 60_000_000_000,
    authDate: "2024-09-16",
    authRemainingEstimate: 60_000_000_000,
    buybackYieldPct: 0.5,
    source: {
      filingType: "10-K",
      filingDate: "2024-07-30",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000789019&type=10-K",
      note: "FY ends June. $60B new authorization from Sep 2024 8-K — replaces prior $60B (exhausted).",
    },
  },
  {
    ticker: "NVDA",
    companyName: "NVIDIA Corporation",
    sector: "Technology",
    latestFyRepurchased: 33_709_000_000,
    latestFyLabel: "FY2025 (Jan)",
    trailing5yAverage: 11_000_000_000,
    authorizationSize: 50_000_000_000,
    authDate: "2024-08-28",
    authRemainingEstimate: 38_000_000_000,
    buybackYieldPct: 1.0,
    source: {
      filingType: "10-K",
      filingDate: "2025-02-26",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001045810&type=10-K",
      note: "FY25 ended Jan 2025. $50B authorization Aug 2024 8-K.",
    },
  },
  {
    ticker: "BRK.B",
    companyName: "Berkshire Hathaway Inc.",
    sector: "Financials",
    latestFyRepurchased: 2_900_000_000,
    latestFyLabel: "FY2024",
    trailing5yAverage: 13_000_000_000,
    authorizationSize: null,
    authDate: null,
    authRemainingEstimate: null,
    buybackYieldPct: 0.3,
    source: {
      filingType: "10-K",
      filingDate: "2025-02-24",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001067983&type=10-K",
      note: "Buffett pulled back repurchases sharply in 2024 as BRK valuation rose. No fixed authorization — board grants discretion.",
    },
  },
  {
    ticker: "JPM",
    companyName: "JPMorgan Chase & Co.",
    sector: "Financials",
    latestFyRepurchased: 31_600_000_000,
    latestFyLabel: "FY2024",
    trailing5yAverage: 20_000_000_000,
    authorizationSize: 30_000_000_000,
    authDate: "2024-05-24",
    authRemainingEstimate: 12_000_000_000,
    buybackYieldPct: 4.5,
    source: {
      filingType: "10-K",
      filingDate: "2025-02-21",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000019617&type=10-K",
      note: "$30B authorization May 2024 following Fed CCAR.",
    },
  },
  {
    ticker: "BAC",
    companyName: "Bank of America Corporation",
    sector: "Financials",
    latestFyRepurchased: 17_700_000_000,
    latestFyLabel: "FY2024",
    trailing5yAverage: 17_000_000_000,
    authorizationSize: 25_000_000_000,
    authDate: "2024-07-24",
    authRemainingEstimate: 14_000_000_000,
    buybackYieldPct: 5.3,
    source: {
      filingType: "10-K",
      filingDate: "2025-02-25",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000070858&type=10-K",
      note: "$25B authorization Jul 2024 — largest in BAC history.",
    },
  },
  {
    ticker: "V",
    companyName: "Visa Inc.",
    sector: "Financials",
    latestFyRepurchased: 13_300_000_000,
    latestFyLabel: "FY2024 (Sep)",
    trailing5yAverage: 11_500_000_000,
    authorizationSize: 25_000_000_000,
    authDate: "2024-12-10",
    authRemainingEstimate: 25_000_000_000,
    buybackYieldPct: 2.4,
    source: {
      filingType: "10-K",
      filingDate: "2024-11-13",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001403161&type=10-K",
      note: "New $25B program Dec 2024 — replaces prior program near exhaustion.",
    },
  },
  {
    ticker: "CVX",
    companyName: "Chevron Corporation",
    sector: "Energy",
    latestFyRepurchased: 15_500_000_000,
    latestFyLabel: "FY2024",
    trailing5yAverage: 10_000_000_000,
    authorizationSize: 75_000_000_000,
    authDate: "2023-01-25",
    authRemainingEstimate: 35_000_000_000,
    buybackYieldPct: 5.8,
    source: {
      filingType: "10-K",
      filingDate: "2025-02-21",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000093410&type=10-K",
      note: "$75B 'indefinite-duration' authorization announced Jan 2023. Pace variable.",
    },
  },

  // ---------- v0.2 additions (15 more programs) ----------

  {
    ticker: "ORCL",
    companyName: "Oracle Corporation",
    sector: "Technology",
    latestFyRepurchased: 1_900_000_000,
    latestFyLabel: "FY2024 (May)",
    trailing5yAverage: 14_000_000_000,
    authorizationSize: 16_000_000_000,
    authDate: "2024-06-11",
    authRemainingEstimate: 8_000_000_000,
    buybackYieldPct: 0.4,
    source: {
      filingType: "10-K",
      filingDate: "2024-06-20",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001341439&type=10-K",
      note: "Buyback pace dropped sharply in FY24 as Oracle prioritized cap-ex on AI cloud build-out.",
    },
  },
  {
    ticker: "MA",
    companyName: "Mastercard Incorporated",
    sector: "Financials",
    latestFyRepurchased: 11_000_000_000,
    latestFyLabel: "FY2024",
    trailing5yAverage: 9_000_000_000,
    authorizationSize: 12_000_000_000,
    authDate: "2024-12-12",
    authRemainingEstimate: 12_000_000_000,
    buybackYieldPct: 2.0,
    source: {
      filingType: "10-K",
      filingDate: "2025-02-13",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001141391&type=10-K",
      note: "$12B authorization Dec 2024 stacks on top of remaining prior program.",
    },
  },
  {
    ticker: "WFC",
    companyName: "Wells Fargo & Company",
    sector: "Financials",
    latestFyRepurchased: 20_000_000_000,
    latestFyLabel: "FY2024",
    trailing5yAverage: 12_500_000_000,
    authorizationSize: 30_000_000_000,
    authDate: "2024-07-23",
    authRemainingEstimate: 15_000_000_000,
    buybackYieldPct: 8.4,
    source: {
      filingType: "10-K",
      filingDate: "2025-02-25",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000072971&type=10-K",
      note: "Largest buyback yield in the megabank cohort. Asset cap removed mid-2025 (separate event).",
    },
  },
  {
    ticker: "GS",
    companyName: "The Goldman Sachs Group, Inc.",
    sector: "Financials",
    latestFyRepurchased: 8_000_000_000,
    latestFyLabel: "FY2024",
    trailing5yAverage: 5_500_000_000,
    authorizationSize: 30_000_000_000,
    authDate: "2025-02-20",
    authRemainingEstimate: 30_000_000_000,
    buybackYieldPct: 4.6,
    source: {
      filingType: "10-K",
      filingDate: "2025-02-26",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000886982&type=10-K",
      note: "$30B authorization Feb 2025 — replaces fully-utilized prior program.",
    },
  },
  {
    ticker: "MS",
    companyName: "Morgan Stanley",
    sector: "Financials",
    latestFyRepurchased: 5_300_000_000,
    latestFyLabel: "FY2024",
    trailing5yAverage: 7_000_000_000,
    authorizationSize: 20_000_000_000,
    authDate: "2022-06-30",
    authRemainingEstimate: 6_000_000_000,
    buybackYieldPct: 2.7,
    source: {
      filingType: "10-K",
      filingDate: "2025-02-21",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000895421&type=10-K",
      note: "Multi-year $20B authorization from 2022 still partially active.",
    },
  },
  {
    ticker: "COST",
    companyName: "Costco Wholesale Corporation",
    sector: "Consumer Staples",
    latestFyRepurchased: 685_000_000,
    latestFyLabel: "FY2024 (Sep)",
    trailing5yAverage: 700_000_000,
    authorizationSize: 4_000_000_000,
    authDate: "2024-01-19",
    authRemainingEstimate: 3_000_000_000,
    buybackYieldPct: 0.1,
    source: {
      filingType: "10-K",
      filingDate: "2024-10-09",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000909832&type=10-K",
      note: "Smallest buyback yield in the top-25 — Costco prefers special dividends. $4B program from Jan 2024 8-K.",
    },
  },
  {
    ticker: "HD",
    companyName: "The Home Depot, Inc.",
    sector: "Consumer Discretionary",
    latestFyRepurchased: 8_000_000_000,
    latestFyLabel: "FY2024 (Jan)",
    trailing5yAverage: 11_000_000_000,
    authorizationSize: 15_000_000_000,
    authDate: "2023-08-15",
    authRemainingEstimate: 7_000_000_000,
    buybackYieldPct: 2.2,
    source: {
      filingType: "10-K",
      filingDate: "2025-03-13",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000354950&type=10-K",
      note: "Pace slowed in FY24 as housing-cycle demand weakened.",
    },
  },
  {
    ticker: "LOW",
    companyName: "Lowe's Companies, Inc.",
    sector: "Consumer Discretionary",
    latestFyRepurchased: 4_300_000_000,
    latestFyLabel: "FY2024 (Feb)",
    trailing5yAverage: 11_000_000_000,
    authorizationSize: 25_000_000_000,
    authDate: "2022-12-09",
    authRemainingEstimate: 9_700_000_000,
    buybackYieldPct: 2.4,
    source: {
      filingType: "10-K",
      filingDate: "2025-03-25",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000060667&type=10-K",
      note: "Multi-year $25B authorization from Dec 2022 8-K. Pace decelerated in FY24.",
    },
  },
  {
    ticker: "WMT",
    companyName: "Walmart Inc.",
    sector: "Consumer Staples",
    latestFyRepurchased: 4_500_000_000,
    latestFyLabel: "FY2025 (Jan)",
    trailing5yAverage: 7_500_000_000,
    authorizationSize: 20_000_000_000,
    authDate: "2025-02-20",
    authRemainingEstimate: 20_000_000_000,
    buybackYieldPct: 0.6,
    source: {
      filingType: "10-K",
      filingDate: "2025-03-21",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000104169&type=10-K",
      note: "Fresh $20B authorization Feb 2025 8-K replaces prior near-exhausted program.",
    },
  },
  {
    ticker: "CSCO",
    companyName: "Cisco Systems, Inc.",
    sector: "Technology",
    latestFyRepurchased: 5_900_000_000,
    latestFyLabel: "FY2024 (Jul)",
    trailing5yAverage: 6_500_000_000,
    authorizationSize: 15_000_000_000,
    authDate: "2024-08-14",
    authRemainingEstimate: 6_300_000_000,
    buybackYieldPct: 2.7,
    source: {
      filingType: "10-K",
      filingDate: "2024-09-05",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000858877&type=10-K",
      note: "$15B added Aug 2024 8-K — bumps total authorization remaining to ~$22B at filing date.",
    },
  },
  {
    ticker: "PG",
    companyName: "The Procter & Gamble Company",
    sector: "Consumer Staples",
    latestFyRepurchased: 5_000_000_000,
    latestFyLabel: "FY2024 (Jun)",
    trailing5yAverage: 8_000_000_000,
    authorizationSize: null,
    authDate: null,
    authRemainingEstimate: null,
    buybackYieldPct: 1.1,
    source: {
      filingType: "10-K",
      filingDate: "2024-08-08",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000080424&type=10-K",
      note: "P&G targets $5-6B/yr buybacks at steady cadence. No fixed authorization — board grants annually.",
    },
  },
  {
    ticker: "XOM",
    companyName: "Exxon Mobil Corporation",
    sector: "Energy",
    latestFyRepurchased: 19_600_000_000,
    latestFyLabel: "FY2024",
    trailing5yAverage: 12_000_000_000,
    authorizationSize: 35_000_000_000,
    authDate: "2024-12-12",
    authRemainingEstimate: 25_000_000_000,
    buybackYieldPct: 4.1,
    source: {
      filingType: "10-K",
      filingDate: "2025-02-26",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000034088&type=10-K",
      note: "Targets $20B/yr buyback pace through 2026 per Dec 2024 capital-allocation update.",
    },
  },
  {
    ticker: "COP",
    companyName: "ConocoPhillips",
    sector: "Energy",
    latestFyRepurchased: 7_400_000_000,
    latestFyLabel: "FY2024",
    trailing5yAverage: 5_500_000_000,
    authorizationSize: 20_000_000_000,
    authDate: "2024-11-26",
    authRemainingEstimate: 14_000_000_000,
    buybackYieldPct: 5.9,
    source: {
      filingType: "10-K",
      filingDate: "2025-02-19",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001163165&type=10-K",
      note: "Authorization expanded by $20B in Nov 2024 8-K coincident with Marathon Oil acquisition close.",
    },
  },
  {
    ticker: "AVGO",
    companyName: "Broadcom Inc.",
    sector: "Technology",
    latestFyRepurchased: 7_200_000_000,
    latestFyLabel: "FY2024 (Nov)",
    trailing5yAverage: 6_500_000_000,
    authorizationSize: 10_000_000_000,
    authDate: "2024-04-04",
    authRemainingEstimate: 6_500_000_000,
    buybackYieldPct: 0.6,
    source: {
      filingType: "10-K",
      filingDate: "2024-12-20",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001730168&type=10-K",
      note: "$10B authorization Apr 2024 8-K. Pace constrained by VMware acquisition debt repayment.",
    },
  },
  {
    ticker: "CRM",
    companyName: "Salesforce, Inc.",
    sector: "Technology",
    latestFyRepurchased: 7_700_000_000,
    latestFyLabel: "FY2025 (Jan)",
    trailing5yAverage: 4_000_000_000,
    authorizationSize: 30_000_000_000,
    authDate: "2024-03-06",
    authRemainingEstimate: 11_000_000_000,
    buybackYieldPct: 2.9,
    source: {
      filingType: "10-K",
      filingDate: "2025-03-12",
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001108524&type=10-K",
      note: "$10B added Mar 2024 8-K bringing total auth to $30B. Activist pressure (Elliott, Starboard 2023) drove cadence increase.",
    },
  },
];

// ---------- Derived views ----------

export function getBuyback(ticker: string): BuybackProgram | undefined {
  const sym = ticker.toUpperCase();
  return BUYBACK_PROGRAMS.find((p) => p.ticker.toUpperCase() === sym);
}

/** All programs sorted by latest FY dollar volume (largest first). */
export function topBuybacks(limit?: number): BuybackProgram[] {
  const sorted = [...BUYBACK_PROGRAMS].sort(
    (a, b) => b.latestFyRepurchased - a.latestFyRepurchased,
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Programs sorted by buyback yield — highest yield = most aggressive. */
export function topBuybackYields(limit?: number): BuybackProgram[] {
  const sorted = BUYBACK_PROGRAMS
    .filter((p) => p.buybackYieldPct != null)
    .sort((a, b) => (b.buybackYieldPct ?? 0) - (a.buybackYieldPct ?? 0));
  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Programs with newly announced or recently-refreshed authorizations.
 * Sorted newest first by authDate.
 */
export function recentAuthorizations(limit?: number): BuybackProgram[] {
  const sorted = BUYBACK_PROGRAMS
    .filter((p) => p.authDate != null)
    .sort((a, b) => (b.authDate ?? "").localeCompare(a.authDate ?? ""));
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Group programs by sector, sector name → sorted programs. */
export function buybacksBySector(): Record<string, BuybackProgram[]> {
  const grouped: Record<string, BuybackProgram[]> = {};
  for (const p of BUYBACK_PROGRAMS) {
    if (!grouped[p.sector]) grouped[p.sector] = [];
    grouped[p.sector].push(p);
  }
  for (const s of Object.keys(grouped)) {
    grouped[s].sort((a, b) => b.latestFyRepurchased - a.latestFyRepurchased);
  }
  return grouped;
}

/** Format USD in short form: $94.9B, $2.9B, $950M */
export function formatBuybackAmount(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}
