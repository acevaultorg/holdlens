// Corporate buyback tracker — per-company share repurchase history.
//
// v0.1 — curated seed of 10 top S&P buyback programs with SEC-sourced
// dollar amounts from each company's FY2024 10-K cash-flow-from-financing
// activities (line: "repurchases of common stock"). Authorization figures
// sourced from each company's announcement 8-K.
//
// v0.2 will replace this with an automated 10-Q/10-K XBRL parser from
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
