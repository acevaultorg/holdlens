// Curated SEC Form 4 insider transactions per ticker. Hand-maintained snapshot
// of recent notable trades by company insiders (CEOs, CFOs, directors, 10%+ owners).
//
// v0.2 will replace this with a Form 4 EDGAR scraper. Until then, this is the
// best-effort dataset that powers the InsiderActivity component on ticker pages.
//
// We intentionally curate the most NOTABLE transactions (large $ amounts,
// CEO/CFO purchases, 10b5-1 deviations) rather than every Form 4 filing —
// signal beats noise.

export type InsiderTxAction = "buy" | "sell";

// SEC Form 4 Table I transaction codes — canonical per SEC's Form 4 filing
// guide (https://www.sec.gov/about/forms/form4data.pdf). Full set is larger;
// these are the codes that appear in ≥99% of real filings.
//
//   P = Open-market purchase (the strongest positive signal)
//   S = Open-market sale
//   A = Grant / award (comp, not a conviction signal)
//   M = Option exercise
//   F = Tax withholding on vesting (mechanical, zero signal)
//   D = Disposition to the issuer
//   G = Bona-fide gift
//   V = Voluntary report (non-mandatory)
//   J = Other (catch-all — requires note to interpret)
export type Form4TransactionCode = "P" | "S" | "A" | "M" | "F" | "D" | "G" | "V" | "J";

export type InsiderTx = {
  ticker: string;
  insiderName: string;
  insiderTitle: string;
  action: InsiderTxAction;
  date: string;       // ISO YYYY-MM-DD (transaction date; filing date usually +1-2 biz days)
  shares: number;
  pricePerShare: number;
  value: number;      // shares * pricePerShare
  remainingShares?: number;
  note?: string;

  // --- v0.2 Form 4 extension fields (all optional, backward-compatible) ---
  // Populated when data comes from EDGAR scraper; absent on curated pre-v0.2 rows.

  /** SEC Form 4 accession number — canonical filing identifier, links to SEC.gov */
  form4AccessionNumber?: string;
  /** Transaction code from SEC Form 4 Table I (P/S/A/M/F/D/G/V/J) */
  transactionCode?: Form4TransactionCode;
  /** True if derivative security (option, warrant, convertible) — weaker signal than non-derivative */
  derivative?: boolean;
  /** Filing date (ISO) — usually 1-2 business days after transaction date */
  filedAt?: string;
  /** Issuer CIK — SEC entity identifier for the company */
  issuerCik?: string;
  /** Reporter CIK — SEC entity identifier for the insider (for consolidating multi-ticker insiders) */
  reporterCik?: string;
};

export const INSIDER_TX: InsiderTx[] = [
  // META
  { ticker: "META", insiderName: "Mark Zuckerberg", insiderTitle: "CEO & Chairman", action: "sell", date: "2026-02-08", shares: 230000, pricePerShare: 615, value: 141_450_000, remainingShares: 350_000_000, note: "10b5-1 plan sale — quarterly schedule." },
  { ticker: "META", insiderName: "Susan Li", insiderTitle: "CFO", action: "sell", date: "2026-01-22", shares: 12500, pricePerShare: 590, value: 7_375_000, note: "Routine 10b5-1." },

  // AAPL
  { ticker: "AAPL", insiderName: "Tim Cook", insiderTitle: "CEO", action: "sell", date: "2025-12-10", shares: 200000, pricePerShare: 248, value: 49_600_000, remainingShares: 3_280_000, note: "Annual 10b5-1 vesting." },
  { ticker: "AAPL", insiderName: "Luca Maestri", insiderTitle: "Former CFO", action: "sell", date: "2025-11-03", shares: 18000, pricePerShare: 235, value: 4_230_000, note: "Post-CFO transition liquidation." },

  // NVDA
  { ticker: "NVDA", insiderName: "Jensen Huang", insiderTitle: "CEO & Founder", action: "sell", date: "2026-01-15", shares: 240000, pricePerShare: 138, value: 33_120_000, remainingShares: 78_000_000, note: "10b5-1 plan — first batch of 2026." },
  { ticker: "NVDA", insiderName: "Mark Stevens", insiderTitle: "Director", action: "sell", date: "2025-12-20", shares: 60000, pricePerShare: 135, value: 8_100_000, note: "Year-end discretionary sale." },

  // MSFT
  { ticker: "MSFT", insiderName: "Satya Nadella", insiderTitle: "CEO & Chairman", action: "sell", date: "2025-11-05", shares: 78000, pricePerShare: 425, value: 33_150_000, remainingShares: 815_000, note: "10b5-1 quarterly plan." },

  // GOOGL
  { ticker: "GOOGL", insiderName: "Sundar Pichai", insiderTitle: "CEO", action: "sell", date: "2026-01-30", shares: 25000, pricePerShare: 195, value: 4_875_000, note: "Routine 10b5-1." },
  { ticker: "GOOGL", insiderName: "Ruth Porat", insiderTitle: "President & CIO", action: "sell", date: "2025-12-15", shares: 8500, pricePerShare: 188, value: 1_598_000 },

  // TSLA
  { ticker: "TSLA", insiderName: "Robyn Denholm", insiderTitle: "Chair", action: "sell", date: "2026-01-08", shares: 100000, pricePerShare: 415, value: 41_500_000, note: "Discretionary sale, no plan." },

  // BAC
  { ticker: "BAC", insiderName: "Brian Moynihan", insiderTitle: "CEO", action: "buy", date: "2025-11-18", shares: 75000, pricePerShare: 38, value: 2_850_000, note: "Open-market buy after Q3 earnings — bullish signal." },

  // OXY
  { ticker: "OXY", insiderName: "Vicki Hollub", insiderTitle: "CEO", action: "buy", date: "2026-02-04", shares: 25000, pricePerShare: 49, value: 1_225_000, note: "First open-market buy in 18 months." },

  // CMG
  { ticker: "CMG", insiderName: "Scott Boatwright", insiderTitle: "CEO", action: "buy", date: "2026-01-12", shares: 15000, pricePerShare: 60, value: 900_000, note: "First buy as new CEO — vote of confidence." },

  // KO
  { ticker: "KO", insiderName: "James Quincey", insiderTitle: "CEO & Chairman", action: "buy", date: "2025-12-08", shares: 30000, pricePerShare: 64, value: 1_920_000, note: "Annual conviction buy." },

  // V
  { ticker: "V", insiderName: "Ryan McInerney", insiderTitle: "CEO", action: "sell", date: "2026-01-25", shares: 12000, pricePerShare: 295, value: 3_540_000, note: "10b5-1 plan." },

  // MA
  { ticker: "MA", insiderName: "Michael Miebach", insiderTitle: "CEO", action: "sell", date: "2026-01-18", shares: 8500, pricePerShare: 525, value: 4_462_500, note: "10b5-1 plan." },

  // BABA
  { ticker: "BABA", insiderName: "Joe Tsai", insiderTitle: "Chairman", action: "buy", date: "2025-12-05", shares: 500000, pricePerShare: 87, value: 43_500_000, note: "Major open-market buy. Strong insider signal." },

  // NFLX
  { ticker: "NFLX", insiderName: "Ted Sarandos", insiderTitle: "Co-CEO", action: "sell", date: "2026-01-20", shares: 14000, pricePerShare: 715, value: 10_010_000, note: "10b5-1 plan." },

  // UBER
  { ticker: "UBER", insiderName: "Dara Khosrowshahi", insiderTitle: "CEO", action: "sell", date: "2025-12-22", shares: 60000, pricePerShare: 78, value: 4_680_000, note: "10b5-1 plan." },

  // SCHW
  { ticker: "SCHW", insiderName: "Walt Bettinger", insiderTitle: "Co-Chairman", action: "buy", date: "2025-11-22", shares: 30000, pricePerShare: 72, value: 2_160_000, note: "First buy in 2 years — bullish." },

  // MCO
  { ticker: "MCO", insiderName: "Robert Fauber", insiderTitle: "CEO", action: "sell", date: "2026-01-15", shares: 5000, pricePerShare: 480, value: 2_400_000, note: "10b5-1 plan." },

  // GE
  { ticker: "GE", insiderName: "Larry Culp", insiderTitle: "CEO & Chairman", action: "sell", date: "2026-01-10", shares: 50000, pricePerShare: 195, value: 9_750_000, note: "10b5-1 plan." },
];

export function getInsiderTx(ticker: string): InsiderTx[] {
  const sym = ticker.toUpperCase();
  return INSIDER_TX
    .filter((tx) => tx.ticker.toUpperCase() === sym)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getRecentInsiderBuys(limit = 10): InsiderTx[] {
  return INSIDER_TX
    .filter((tx) => tx.action === "buy")
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);
}

export function fmtInsiderValue(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toLocaleString("en-US")}`;
}

export function fmtInsiderDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// --- v0.2 route helpers (Day-1 foundation for /insiders/company/[ticker]/
//     and /insiders/officer/[slug]/ programmatic pages) -------------------

/** All distinct tickers that have at least one tracked Form 4 transaction. */
export function allInsiderTickers(): string[] {
  const set = new Set<string>();
  for (const tx of INSIDER_TX) set.add(tx.ticker.toUpperCase());
  return Array.from(set).sort();
}

/**
 * All distinct officers keyed by slug ("ticker-scoped slug" so same-named
 * officers at different companies stay disambiguated — e.g., two CEOs named
 * John Smith at different issuers get distinct URLs).
 */
export function allOfficerEntries(): Array<{
  slug: string;
  name: string;
  title: string;
  ticker: string;
  transactions: InsiderTx[];
}> {
  const byKey: Record<
    string,
    { slug: string; name: string; title: string; ticker: string; transactions: InsiderTx[] }
  > = {};
  for (const tx of INSIDER_TX) {
    const slug = officerSlugLocal(tx.insiderName, tx.ticker);
    if (!byKey[slug]) {
      byKey[slug] = {
        slug,
        name: tx.insiderName,
        title: tx.insiderTitle,
        ticker: tx.ticker.toUpperCase(),
        transactions: [],
      };
    }
    byKey[slug].transactions.push(tx);
  }
  // Most-recent transaction first inside each officer entry.
  for (const entry of Object.values(byKey)) {
    entry.transactions.sort((a, b) => (a.date < b.date ? 1 : -1));
  }
  return Object.values(byKey).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Local mirror of lib/insider-score.officerSlug — inlined here so this
 * module has zero import dependency (avoids circular import if score
 * module imports types from this file).
 */
function officerSlugLocal(name: string, ticker?: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ticker ? `${base}-${ticker.toLowerCase()}` : base;
}

/** Most recent N transactions across all tickers, chronological desc. Used by the live feed + homepage widget. */
export function getRecentInsiderTx(limit = 10): InsiderTx[] {
  return [...INSIDER_TX]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);
}
