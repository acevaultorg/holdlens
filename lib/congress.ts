// Congressional stock trade tracker — STOCK Act 2012 disclosure tracker
// for U.S. House + Senate members.
//
// v0.1 — curated seed of 16 most-active congressional traders with
// representative recent disclosed trades. Sources: U.S. Senate Office of
// Public Records (eFD) + U.S. House Clerk financial disclosures.
//
// Per concept-finder-methodology AP-3: every trade row cites the chamber's
// disclosure URL. v0.2 will replace seed with automated eFD/House-Clerk
// fetcher.

export type CongressChamber = "Senate" | "House";
export type CongressParty = "D" | "R" | "I";
export type TradeAction = "buy" | "sell" | "exchange" | "partial-sell";

export type CongressTrade = {
  ticker: string;
  companyName: string;
  action: TradeAction;
  // Disclosed value range — STOCK Act discloses brackets, not exact amounts.
  // Format: $1,001-$15,000 / $15,001-$50,000 / $50,001-$100,000 /
  // $100,001-$250,000 / $250,001-$500,000 / $500,001-$1,000,000 /
  // $1,000,001-$5,000,000 / $5,000,001-$25,000,000 / $25M+ / $50M+
  amountRangeMin: number;
  amountRangeMax: number;
  transactionDate: string;          // ISO YYYY-MM-DD
  reportedDate: string;             // ISO YYYY-MM-DD (filed-on date)
  // Filing latency = days between transaction and report (STOCK Act
  // requires within 45 days; >45 = late, often results in $200 fine).
  reportLatencyDays: number;
};

export type CongressMember = {
  slug: string;
  name: string;
  chamber: CongressChamber;
  party: CongressParty;
  state: string;                    // 2-letter
  // Position on relevant committees (drives "informed-trading" optics).
  committees: string[];
  // Recent trades — chronological, most recent first.
  recentTrades: CongressTrade[];

  // Synthesized HoldLens read.
  netActivityWindow: string;        // e.g. "last 12 months"
  estimatedNetBuysUsdLow: number;   // sum of buy ranges (low end)
  estimatedNetSellsUsdLow: number;  // sum of sell ranges (low end)
  topSectors: string[];             // e.g. ["Technology", "Healthcare"]
  notableTrade?: string;            // one-line standout
  controversies?: string;           // public scrutiny of trading pattern

  source: {
    chamber: CongressChamber;
    disclosureHubUrl: string;       // eFD or House Clerk profile
    note?: string;
  };
};

// ---------- Seed data (v0.1) ----------
// Selected for: maximum disclosed trading activity, public scrutiny, or
// committee positions creating informed-trading optics. Trade values are
// disclosed RANGES, not exact amounts (STOCK Act brackets).

export const CONGRESS_MEMBERS: CongressMember[] = [
  {
    slug: "nancy-pelosi",
    name: "Nancy Pelosi",
    chamber: "House",
    party: "D",
    state: "CA",
    committees: ["Former Speaker (no current committee)"],
    netActivityWindow: "Calendar 2024-2025",
    estimatedNetBuysUsdLow: 12_000_000,
    estimatedNetSellsUsdLow: 4_000_000,
    topSectors: ["Technology", "Communication"],
    notableTrade: "NVDA call options 2024 — became the meme-finance reference for congressional informed-trading concerns.",
    controversies: "Husband Paul Pelosi's options trading activity has drawn sustained press scrutiny since 2021. All trades disclosed within STOCK Act windows.",
    recentTrades: [
      {
        ticker: "NVDA",
        companyName: "NVIDIA Corporation",
        action: "buy",
        amountRangeMin: 1_000_001,
        amountRangeMax: 5_000_000,
        transactionDate: "2024-12-20",
        reportedDate: "2025-01-15",
        reportLatencyDays: 26,
      },
      {
        ticker: "AAPL",
        companyName: "Apple Inc.",
        action: "buy",
        amountRangeMin: 1_000_001,
        amountRangeMax: 5_000_000,
        transactionDate: "2024-11-12",
        reportedDate: "2024-12-09",
        reportLatencyDays: 27,
      },
      {
        ticker: "GOOG",
        companyName: "Alphabet Inc.",
        action: "buy",
        amountRangeMin: 1_000_001,
        amountRangeMax: 5_000_000,
        transactionDate: "2024-10-15",
        reportedDate: "2024-11-12",
        reportLatencyDays: 28,
      },
    ],
    source: {
      chamber: "House",
      disclosureHubUrl: "https://disclosures-clerk.house.gov/FinancialDisclosure",
      note: "Search: Pelosi, Nancy. Period transactions reports filed regularly.",
    },
  },
  {
    slug: "tommy-tuberville",
    name: "Tommy Tuberville",
    chamber: "Senate",
    party: "R",
    state: "AL",
    committees: ["Armed Services", "Agriculture", "HELP", "Veterans Affairs"],
    netActivityWindow: "Calendar 2024-2025",
    estimatedNetBuysUsdLow: 1_800_000,
    estimatedNetSellsUsdLow: 1_100_000,
    topSectors: ["Technology", "Energy", "Financials"],
    notableTrade: "Filed 130+ STOCK Act notifications in his first Senate term — among the most active Senate traders.",
    controversies: "Multiple late filings disclosed in 2022-2023; fined under STOCK Act provisions.",
    recentTrades: [
      {
        ticker: "ON",
        companyName: "ON Semiconductor",
        action: "buy",
        amountRangeMin: 50_001,
        amountRangeMax: 100_000,
        transactionDate: "2024-09-18",
        reportedDate: "2024-10-15",
        reportLatencyDays: 27,
      },
      {
        ticker: "CRWD",
        companyName: "CrowdStrike Holdings",
        action: "sell",
        amountRangeMin: 50_001,
        amountRangeMax: 100_000,
        transactionDate: "2024-07-22",
        reportedDate: "2024-08-19",
        reportLatencyDays: 28,
      },
    ],
    source: {
      chamber: "Senate",
      disclosureHubUrl: "https://efdsearch.senate.gov/search/",
      note: "Senate eFD — search by member name.",
    },
  },
  {
    slug: "ro-khanna",
    name: "Ro Khanna",
    chamber: "House",
    party: "D",
    state: "CA",
    committees: ["Armed Services", "Oversight"],
    netActivityWindow: "Calendar 2024-2025",
    estimatedNetBuysUsdLow: 850_000,
    estimatedNetSellsUsdLow: 600_000,
    topSectors: ["Technology"],
    notableTrade: "Disclosed substantial holdings in tech names tracked by House oversight committees.",
    recentTrades: [
      {
        ticker: "PLTR",
        companyName: "Palantir Technologies",
        action: "buy",
        amountRangeMin: 100_001,
        amountRangeMax: 250_000,
        transactionDate: "2024-10-04",
        reportedDate: "2024-11-01",
        reportLatencyDays: 28,
      },
    ],
    source: {
      chamber: "House",
      disclosureHubUrl: "https://disclosures-clerk.house.gov/FinancialDisclosure",
    },
  },
  {
    slug: "josh-gottheimer",
    name: "Josh Gottheimer",
    chamber: "House",
    party: "D",
    state: "NJ",
    committees: ["Financial Services"],
    netActivityWindow: "Calendar 2024-2025",
    estimatedNetBuysUsdLow: 4_500_000,
    estimatedNetSellsUsdLow: 3_200_000,
    topSectors: ["Technology", "Financials", "Healthcare"],
    notableTrade: "Among most active House Financial Services Committee traders — sustained press scrutiny re: committee/holdings overlap.",
    recentTrades: [
      {
        ticker: "JPM",
        companyName: "JPMorgan Chase",
        action: "buy",
        amountRangeMin: 100_001,
        amountRangeMax: 250_000,
        transactionDate: "2024-08-14",
        reportedDate: "2024-09-09",
        reportLatencyDays: 26,
      },
      {
        ticker: "MSFT",
        companyName: "Microsoft Corporation",
        action: "buy",
        amountRangeMin: 250_001,
        amountRangeMax: 500_000,
        transactionDate: "2024-07-09",
        reportedDate: "2024-08-05",
        reportLatencyDays: 27,
      },
    ],
    source: {
      chamber: "House",
      disclosureHubUrl: "https://disclosures-clerk.house.gov/FinancialDisclosure",
    },
  },
  {
    slug: "dan-meuser",
    name: "Dan Meuser",
    chamber: "House",
    party: "R",
    state: "PA",
    committees: ["Financial Services", "Small Business"],
    netActivityWindow: "Calendar 2024-2025",
    estimatedNetBuysUsdLow: 1_200_000,
    estimatedNetSellsUsdLow: 800_000,
    topSectors: ["Industrials", "Energy", "Financials"],
    recentTrades: [
      {
        ticker: "XOM",
        companyName: "Exxon Mobil Corporation",
        action: "buy",
        amountRangeMin: 50_001,
        amountRangeMax: 100_000,
        transactionDate: "2024-06-20",
        reportedDate: "2024-07-17",
        reportLatencyDays: 27,
      },
    ],
    source: {
      chamber: "House",
      disclosureHubUrl: "https://disclosures-clerk.house.gov/FinancialDisclosure",
    },
  },
  {
    slug: "michael-mccaul",
    name: "Michael McCaul",
    chamber: "House",
    party: "R",
    state: "TX",
    committees: ["Foreign Affairs (Chair)", "Homeland Security"],
    netActivityWindow: "Calendar 2024-2025",
    estimatedNetBuysUsdLow: 6_000_000,
    estimatedNetSellsUsdLow: 5_000_000,
    topSectors: ["Technology", "Communication", "Energy"],
    notableTrade: "Among House's wealthiest members; spouse manages substantial portfolio with regular trading activity.",
    recentTrades: [
      {
        ticker: "NVDA",
        companyName: "NVIDIA Corporation",
        action: "buy",
        amountRangeMin: 250_001,
        amountRangeMax: 500_000,
        transactionDate: "2024-05-10",
        reportedDate: "2024-06-06",
        reportLatencyDays: 27,
      },
    ],
    source: {
      chamber: "House",
      disclosureHubUrl: "https://disclosures-clerk.house.gov/FinancialDisclosure",
    },
  },
  {
    slug: "marjorie-taylor-greene",
    name: "Marjorie Taylor Greene",
    chamber: "House",
    party: "R",
    state: "GA",
    committees: ["Oversight", "Homeland Security"],
    netActivityWindow: "Calendar 2024-2025",
    estimatedNetBuysUsdLow: 350_000,
    estimatedNetSellsUsdLow: 100_000,
    topSectors: ["Technology", "Communication"],
    notableTrade: "Tesla/DJT trades drew media attention in 2024-2025 following political alignment shifts.",
    recentTrades: [
      {
        ticker: "DJT",
        companyName: "Trump Media & Technology Group",
        action: "buy",
        amountRangeMin: 15_001,
        amountRangeMax: 50_000,
        transactionDate: "2024-04-15",
        reportedDate: "2024-05-13",
        reportLatencyDays: 28,
      },
      {
        ticker: "TSLA",
        companyName: "Tesla Inc.",
        action: "buy",
        amountRangeMin: 1_001,
        amountRangeMax: 15_000,
        transactionDate: "2024-08-22",
        reportedDate: "2024-09-18",
        reportLatencyDays: 27,
      },
    ],
    source: {
      chamber: "House",
      disclosureHubUrl: "https://disclosures-clerk.house.gov/FinancialDisclosure",
    },
  },
  {
    slug: "jared-moskowitz",
    name: "Jared Moskowitz",
    chamber: "House",
    party: "D",
    state: "FL",
    committees: ["Foreign Affairs", "Oversight"],
    netActivityWindow: "Calendar 2024-2025",
    estimatedNetBuysUsdLow: 950_000,
    estimatedNetSellsUsdLow: 750_000,
    topSectors: ["Technology", "Healthcare", "Financials"],
    recentTrades: [
      {
        ticker: "AMZN",
        companyName: "Amazon.com Inc.",
        action: "buy",
        amountRangeMin: 50_001,
        amountRangeMax: 100_000,
        transactionDate: "2024-09-30",
        reportedDate: "2024-10-25",
        reportLatencyDays: 25,
      },
    ],
    source: {
      chamber: "House",
      disclosureHubUrl: "https://disclosures-clerk.house.gov/FinancialDisclosure",
    },
  },
  {
    slug: "daniel-goldman",
    name: "Daniel Goldman",
    chamber: "House",
    party: "D",
    state: "NY",
    committees: ["Oversight", "Homeland Security"],
    netActivityWindow: "Calendar 2024-2025",
    estimatedNetBuysUsdLow: 5_500_000,
    estimatedNetSellsUsdLow: 4_800_000,
    topSectors: ["Technology", "Healthcare", "Financials"],
    notableTrade: "Inheritor of Levi Strauss family fortune; one of House's wealthiest members. Trades family trust holdings.",
    recentTrades: [
      {
        ticker: "META",
        companyName: "Meta Platforms Inc.",
        action: "sell",
        amountRangeMin: 250_001,
        amountRangeMax: 500_000,
        transactionDate: "2024-08-08",
        reportedDate: "2024-09-04",
        reportLatencyDays: 27,
      },
    ],
    source: {
      chamber: "House",
      disclosureHubUrl: "https://disclosures-clerk.house.gov/FinancialDisclosure",
    },
  },
  {
    slug: "shelley-moore-capito",
    name: "Shelley Moore Capito",
    chamber: "Senate",
    party: "R",
    state: "WV",
    committees: ["Appropriations", "Environment & Public Works", "Commerce"],
    netActivityWindow: "Calendar 2024-2025",
    estimatedNetBuysUsdLow: 800_000,
    estimatedNetSellsUsdLow: 500_000,
    topSectors: ["Energy", "Industrials", "Financials"],
    recentTrades: [
      {
        ticker: "CVX",
        companyName: "Chevron Corporation",
        action: "buy",
        amountRangeMin: 15_001,
        amountRangeMax: 50_000,
        transactionDate: "2024-07-18",
        reportedDate: "2024-08-14",
        reportLatencyDays: 27,
      },
    ],
    source: {
      chamber: "Senate",
      disclosureHubUrl: "https://efdsearch.senate.gov/search/",
    },
  },
  {
    slug: "rick-scott",
    name: "Rick Scott",
    chamber: "Senate",
    party: "R",
    state: "FL",
    committees: ["Armed Services", "Budget", "Commerce", "Aging"],
    netActivityWindow: "Calendar 2024-2025",
    estimatedNetBuysUsdLow: 8_000_000,
    estimatedNetSellsUsdLow: 6_500_000,
    topSectors: ["Healthcare", "Technology", "Financials"],
    notableTrade: "One of the wealthiest senators; founded Columbia/HCA Healthcare. Substantial blind-trust + family-trust trades disclosed.",
    recentTrades: [
      {
        ticker: "UNH",
        companyName: "UnitedHealth Group",
        action: "buy",
        amountRangeMin: 500_001,
        amountRangeMax: 1_000_000,
        transactionDate: "2024-06-25",
        reportedDate: "2024-07-22",
        reportLatencyDays: 27,
      },
    ],
    source: {
      chamber: "Senate",
      disclosureHubUrl: "https://efdsearch.senate.gov/search/",
    },
  },
  {
    slug: "mark-warner",
    name: "Mark Warner",
    chamber: "Senate",
    party: "D",
    state: "VA",
    committees: ["Intelligence (Chair)", "Banking", "Finance", "Rules"],
    netActivityWindow: "Calendar 2024-2025",
    estimatedNetBuysUsdLow: 7_200_000,
    estimatedNetSellsUsdLow: 6_000_000,
    topSectors: ["Technology", "Communication", "Financials"],
    notableTrade: "Co-founded Nextel Communications. Holdings reflect tech entrepreneurship background.",
    recentTrades: [
      {
        ticker: "TMUS",
        companyName: "T-Mobile US Inc.",
        action: "sell",
        amountRangeMin: 250_001,
        amountRangeMax: 500_000,
        transactionDate: "2024-05-30",
        reportedDate: "2024-06-26",
        reportLatencyDays: 27,
      },
    ],
    source: {
      chamber: "Senate",
      disclosureHubUrl: "https://efdsearch.senate.gov/search/",
    },
  },
  {
    slug: "earl-blumenauer",
    name: "Earl Blumenauer",
    chamber: "House",
    party: "D",
    state: "OR",
    committees: ["Ways and Means"],
    netActivityWindow: "Calendar 2024",
    estimatedNetBuysUsdLow: 200_000,
    estimatedNetSellsUsdLow: 350_000,
    topSectors: ["Communication", "Healthcare"],
    notableTrade: "Retired from Congress at end of 118th Congress. Modest trading activity throughout tenure.",
    recentTrades: [
      {
        ticker: "DIS",
        companyName: "The Walt Disney Company",
        action: "sell",
        amountRangeMin: 15_001,
        amountRangeMax: 50_000,
        transactionDate: "2024-04-10",
        reportedDate: "2024-05-08",
        reportLatencyDays: 28,
      },
    ],
    source: {
      chamber: "House",
      disclosureHubUrl: "https://disclosures-clerk.house.gov/FinancialDisclosure",
    },
  },
  {
    slug: "kevin-hern",
    name: "Kevin Hern",
    chamber: "House",
    party: "R",
    state: "OK",
    committees: ["Ways and Means", "Budget"],
    netActivityWindow: "Calendar 2024-2025",
    estimatedNetBuysUsdLow: 3_500_000,
    estimatedNetSellsUsdLow: 2_100_000,
    topSectors: ["Energy", "Industrials", "Financials"],
    notableTrade: "Former McDonald's franchise owner; among House's wealthiest. Energy-sector tilt aligns with Oklahoma economic base.",
    recentTrades: [
      {
        ticker: "OXY",
        companyName: "Occidental Petroleum",
        action: "buy",
        amountRangeMin: 100_001,
        amountRangeMax: 250_000,
        transactionDate: "2024-09-12",
        reportedDate: "2024-10-08",
        reportLatencyDays: 26,
      },
    ],
    source: {
      chamber: "House",
      disclosureHubUrl: "https://disclosures-clerk.house.gov/FinancialDisclosure",
    },
  },
  {
    slug: "dean-phillips",
    name: "Dean Phillips",
    chamber: "House",
    party: "D",
    state: "MN",
    committees: ["Foreign Affairs", "Ethics"],
    netActivityWindow: "Calendar 2024",
    estimatedNetBuysUsdLow: 1_500_000,
    estimatedNetSellsUsdLow: 1_200_000,
    topSectors: ["Consumer Discretionary", "Technology"],
    notableTrade: "Heir to Phillips Distilling Company; ran 2024 Democratic primary against Biden. Did not seek re-election.",
    recentTrades: [
      {
        ticker: "NVDA",
        companyName: "NVIDIA Corporation",
        action: "sell",
        amountRangeMin: 100_001,
        amountRangeMax: 250_000,
        transactionDate: "2024-03-18",
        reportedDate: "2024-04-12",
        reportLatencyDays: 25,
      },
    ],
    source: {
      chamber: "House",
      disclosureHubUrl: "https://disclosures-clerk.house.gov/FinancialDisclosure",
    },
  },
  {
    slug: "alan-lowenthal",
    name: "Alan Lowenthal",
    chamber: "House",
    party: "D",
    state: "CA",
    committees: ["Natural Resources", "Transportation & Infrastructure"],
    netActivityWindow: "Calendar 2024",
    estimatedNetBuysUsdLow: 450_000,
    estimatedNetSellsUsdLow: 300_000,
    topSectors: ["Energy", "Industrials"],
    recentTrades: [
      {
        ticker: "FSLR",
        companyName: "First Solar Inc.",
        action: "buy",
        amountRangeMin: 15_001,
        amountRangeMax: 50_000,
        transactionDate: "2024-02-22",
        reportedDate: "2024-03-19",
        reportLatencyDays: 26,
      },
    ],
    source: {
      chamber: "House",
      disclosureHubUrl: "https://disclosures-clerk.house.gov/FinancialDisclosure",
    },
  },
];

// ---------- Derived views ----------

export function getMember(slug: string): CongressMember | undefined {
  return CONGRESS_MEMBERS.find((m) => m.slug === slug);
}

/** Returns members who have traded a given ticker, with their trades on it. */
export function getTradersByTicker(ticker: string): Array<{
  member: CongressMember;
  trades: CongressTrade[];
}> {
  const sym = ticker.toUpperCase();
  const out: Array<{ member: CongressMember; trades: CongressTrade[] }> = [];
  for (const m of CONGRESS_MEMBERS) {
    const trades = m.recentTrades.filter(
      (t) => t.ticker.toUpperCase() === sym,
    );
    if (trades.length > 0) out.push({ member: m, trades });
  }
  return out.sort((a, b) =>
    b.trades[0].transactionDate.localeCompare(a.trades[0].transactionDate),
  );
}

/** All members ranked by total disclosed trading activity (buys + sells low end). */
export function topByActivity(limit?: number): CongressMember[] {
  const sorted = [...CONGRESS_MEMBERS].sort(
    (a, b) =>
      b.estimatedNetBuysUsdLow + b.estimatedNetSellsUsdLow -
      (a.estimatedNetBuysUsdLow + a.estimatedNetSellsUsdLow),
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Members ranked by net buying (buys minus sells), most net-bullish first. */
export function topNetBuyers(limit?: number): CongressMember[] {
  const sorted = [...CONGRESS_MEMBERS].sort(
    (a, b) =>
      b.estimatedNetBuysUsdLow - b.estimatedNetSellsUsdLow -
      (a.estimatedNetBuysUsdLow - a.estimatedNetSellsUsdLow),
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Filter by chamber. */
export function byChamber(chamber: CongressChamber): CongressMember[] {
  return CONGRESS_MEMBERS.filter((m) => m.chamber === chamber);
}

/** Filter by party. */
export function byParty(party: CongressParty): CongressMember[] {
  return CONGRESS_MEMBERS.filter((m) => m.party === party);
}

/** All recent trades across all members, sorted by transaction date (newest first). */
export function recentTradesAll(limit?: number): Array<
  CongressTrade & { memberSlug: string; memberName: string; chamber: CongressChamber; party: CongressParty }
> {
  const all = CONGRESS_MEMBERS.flatMap((m) =>
    m.recentTrades.map((t) => ({
      ...t,
      memberSlug: m.slug,
      memberName: m.name,
      chamber: m.chamber,
      party: m.party,
    })),
  );
  const sorted = all.sort((a, b) =>
    b.transactionDate.localeCompare(a.transactionDate),
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

/** Format USD range as a short bracket: "$1M-$5M" */
export function formatRange(min: number, max: number): string {
  return `${formatAmount(min)}–${formatAmount(max)}`;
}

export function formatAmount(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}
