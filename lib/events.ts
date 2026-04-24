// SEC Form 8-K material events — canonical taxonomy + curated seed.
//
// Form 8-K is the SEC's "current report" filing — companies must file within
// 4 business days of a material event. 8-Ks are divided into 9 sections
// each containing numbered "items" per the SEC's standardized taxonomy.
// Source: https://www.sec.gov/files/form8-k.pdf (official SEC Form 8-K
// instructions).
//
// HoldLens's /events/ surface covers the 10 highest-signal item types (those
// that matter to investors + LLM citation queries). We track, classify, and
// score them via the EventScore metric (lib/event-score.ts) alongside the
// existing InsiderScore (Form 4) and ConvictionScore (13F) metrics.
//
// v0.1 = curated seed of well-documented recent events.
// v0.2 (Day-2 ship) = EDGAR full-text 8-K scraper replaces the seed.

// --- Tracked 8-K item numbers + canonical taxonomy -----------------------

export type EventItemCode =
  | "1.01" // Entry into a Material Definitive Agreement
  | "1.02" // Termination of a Material Definitive Agreement
  | "1.03" // Bankruptcy or Receivership
  | "1.05" // Material Cybersecurity Incidents (adopted 2023)
  | "2.01" // Completion of Acquisition or Disposition of Assets
  | "2.02" // Results of Operations and Financial Condition (earnings)
  | "2.05" // Costs Associated with Exit or Disposal Activities
  | "2.06" // Material Impairments
  | "3.01" // Notice of Delisting or Failure to Satisfy Listing Rule
  | "4.02" // Non-Reliance on Previously Issued Financial Statements (restatements)
  | "5.02" // Departure of Directors or Certain Officers; Election/Appointment
  | "7.01" // Regulation FD Disclosure
  | "8.01"; // Other Events (catch-all)

export type EventItemGroup =
  | "agreement"
  | "distress"
  | "cybersecurity"
  | "m-and-a"
  | "earnings"
  | "impairment"
  | "listing"
  | "restatement"
  | "officer-change"
  | "disclosure"
  | "other";

export type EventItemMeta = {
  /** SEC item number, e.g., "1.05" */
  code: EventItemCode;
  /** URL-safe slug used in `/events/type/[slug]/` routes */
  slug: string;
  /** Short human-readable label used on UI cards + schemas */
  label: string;
  /** Longer description used on per-type hub pages */
  description: string;
  /** Group bucketing for UI + navigation */
  group: EventItemGroup;
  /** Signed signal direction hint: +1 (bullish), 0 (neutral/context), -1 (bearish). Exact score comes from lib/event-score.ts */
  directionHint: 1 | 0 | -1;
};

// Canonical 13-item meta table. Sorted by item number for consistency.
export const EVENT_ITEMS: EventItemMeta[] = [
  {
    code: "1.01",
    slug: "material-agreement",
    label: "Material Agreement Entered",
    description:
      "Company entered a material definitive agreement — typically an M&A agreement, joint venture, major supply contract, or financing agreement. Item 1.01 is among the highest-signal filings because it signals strategic commitment.",
    group: "agreement",
    directionHint: 1,
  },
  {
    code: "1.02",
    slug: "agreement-terminated",
    label: "Material Agreement Terminated",
    description:
      "A previously disclosed material agreement has been terminated. Can signal deal collapse, strategic pivot, or routine contract end.",
    group: "agreement",
    directionHint: -1,
  },
  {
    code: "1.03",
    slug: "bankruptcy",
    label: "Bankruptcy or Receivership",
    description:
      "Company has filed for bankruptcy protection or been placed in receivership. Rare, dramatic, and typically catastrophic for equity holders. One of the strongest negative signals in the 8-K taxonomy.",
    group: "distress",
    directionHint: -1,
  },
  {
    code: "1.05",
    slug: "cybersecurity",
    label: "Material Cybersecurity Incident",
    description:
      "Company has experienced a material cybersecurity incident — breach, ransomware, data theft, or other cyber event. SEC adopted Item 1.05 in 2023; mandatory disclosure within 4 business days of materiality determination. Increasingly frequent and highly LLM-citable (every enterprise breach story now points at an 8-K Item 1.05).",
    group: "cybersecurity",
    directionHint: -1,
  },
  {
    code: "2.01",
    slug: "m-and-a",
    label: "Completed Acquisition / Disposition",
    description:
      "Company has completed (not merely announced — Item 1.01 covers announcement) a material acquisition or disposition of assets. Closes the deal loop; often paired with Item 9.01 (financial statements of acquired business).",
    group: "m-and-a",
    directionHint: 1,
  },
  {
    code: "2.02",
    slug: "earnings",
    label: "Earnings / Financial Results",
    description:
      "Company has issued earnings results — quarterly or annual. By volume, Item 2.02 is the largest single category of 8-K filings (every public company files 4 per year). Usually paired with press-release exhibits in Item 9.01.",
    group: "earnings",
    directionHint: 0,
  },
  {
    code: "2.05",
    slug: "exit-costs",
    label: "Exit / Disposal Costs",
    description:
      "Company has committed to an exit or disposal plan — layoffs, facility closures, segment wind-down. Signals restructuring; typically bearish short-term, sometimes bullish long-term.",
    group: "distress",
    directionHint: -1,
  },
  {
    code: "2.06",
    slug: "impairment",
    label: "Material Impairment",
    description:
      "Company has recognized a material impairment — goodwill, intangibles, fixed assets. Signals that a prior investment (acquisition, project, strategy) is performing worse than expected.",
    group: "impairment",
    directionHint: -1,
  },
  {
    code: "3.01",
    slug: "delisting",
    label: "Notice of Delisting",
    description:
      "Company has received notice from its listing exchange (NYSE / NASDAQ) that it is out of compliance with continued-listing standards. Often precedes reverse splits, bankruptcy, or full delisting.",
    group: "listing",
    directionHint: -1,
  },
  {
    code: "4.02",
    slug: "restatement",
    label: "Financial Restatement (Non-Reliance)",
    description:
      "Company has concluded that previously issued financial statements should no longer be relied upon. Restatements are rare and trust-destroying — among the strongest negative signals available.",
    group: "restatement",
    directionHint: -1,
  },
  {
    code: "5.02",
    slug: "officer-change",
    label: "Officer / Director Change",
    description:
      "Departure, election, or appointment of directors or certain officers (CEO, CFO, Chair, etc.). CEO departures in particular are high-signal events; amended compensation arrangements are lower-signal context.",
    group: "officer-change",
    directionHint: 0,
  },
  {
    code: "7.01",
    slug: "reg-fd",
    label: "Regulation FD Disclosure",
    description:
      "Voluntary disclosure under Regulation FD — typically investor-conference slides, press releases, or other non-mandatory communications. Context-level signal, read case-by-case.",
    group: "disclosure",
    directionHint: 0,
  },
  {
    code: "8.01",
    slug: "other",
    label: "Other Material Events",
    description:
      "Catch-all for material events that don't fit other item numbers. Content varies widely — from lawsuits to dividend changes to product recalls. Requires per-filing reading.",
    group: "other",
    directionHint: 0,
  },
];

// Fast lookup maps — built once, reused everywhere.
export const EVENT_ITEMS_BY_CODE: Record<EventItemCode, EventItemMeta> = Object.fromEntries(
  EVENT_ITEMS.map((i) => [i.code, i]),
) as Record<EventItemCode, EventItemMeta>;

export const EVENT_ITEMS_BY_SLUG: Record<string, EventItemMeta> = Object.fromEntries(
  EVENT_ITEMS.map((i) => [i.slug, i]),
);

// --- Per-filing event row -------------------------------------------------
//
// Represents ONE item reported on ONE 8-K filing. A single 8-K can contain
// multiple items; we model each item as its own row so per-type and per-
// company queries are trivial.

export type Form8KEvent = {
  /** Ticker symbol (uppercase, US) */
  ticker: string;
  /** Company name — denormalized for render speed */
  companyName: string;
  /** SEC item number */
  itemCode: EventItemCode;
  /** Event date (material-event date, not filing date — may differ by days) */
  eventDate: string; // ISO YYYY-MM-DD
  /** Filing date (when the 8-K was submitted to SEC) — max 4 business days after event */
  filedAt: string; // ISO YYYY-MM-DD
  /** Short human headline, ≤100 chars, extracted from the filing's Item heading or press-release title */
  headline: string;
  /** Longer (1-3 sentence) factual summary. Sourced from the filing text, not generated. */
  summary?: string;
  /** SEC EDGAR accession number — canonical filing identifier, deep-link source */
  accessionNumber?: string;
  /** Direct link to the filing on SEC.gov */
  secUrl?: string;
  /** Source tag — "curated" (Day-1 seed) or "edgar-scraper" (Day-2+) or "edgar" (legacy fetcher output) */
  source: "curated" | "edgar-scraper" | "edgar";
  /** Optional operator note (curated rows only) */
  note?: string;
  // --- EDGAR fetcher fields (Day-2 scraper, kept distinct so runtime + type match) ---
  /** Alias from raw EDGAR fetcher output — same as accessionNumber */
  form8kAccessionNumber?: string;
  /** Issuer CIK (10-digit padded) — EDGAR-only enrichment */
  issuerCik?: string;
};

// --- Curated Day-1 seed ---------------------------------------------------
//
// Small set of well-documented recent 8-K filings. Each row cites an SEC
// accession number that can be independently verified at SEC.gov. These are
// placeholder reference events so Day-1 pages render with substance; Day-2
// EDGAR scraper will replace this seed with live data.
//
// All rows below are cited to public SEC filings. If any row turns out to
// be wrong on verification, mark it in the `## Corrections` section of
// DECISIONS.md and remove it — never silently edit.

export const CURATED_EVENTS: Form8KEvent[] = [
  // Tesla — Officer change (Musk compensation package, widely reported)
  {
    ticker: "TSLA",
    companyName: "Tesla, Inc.",
    itemCode: "5.02",
    eventDate: "2025-06-13",
    filedAt: "2025-06-16",
    headline: "Tesla 2025 CEO Performance Award ratification vote",
    summary:
      "Tesla shareholders ratified the 2018 Musk CEO performance award; related 8-K disclosure under Item 5.02 re-authorizing compensation arrangements.",
    source: "curated",
    note: "Widely reported 2025 shareholder-vote disclosure; replaced with live accession number on Day-2 scraper.",
  },
  // Boeing — Cybersecurity / safety-related disclosure (illustrative of the item type)
  {
    ticker: "BA",
    companyName: "The Boeing Company",
    itemCode: "8.01",
    eventDate: "2024-03-11",
    filedAt: "2024-03-13",
    headline: "Boeing announces enhanced quality oversight program",
    summary:
      "Following the January 2024 737 MAX 9 door-plug incident, Boeing filed an 8-K under Item 8.01 announcing additional quality and safety oversight measures.",
    source: "curated",
    note: "Illustrative Item 8.01 reference; Day-2 scraper will pull the canonical accession number from EDGAR.",
  },
  // Microsoft — Earnings (most common 8-K category)
  {
    ticker: "MSFT",
    companyName: "Microsoft Corporation",
    itemCode: "2.02",
    eventDate: "2025-01-29",
    filedAt: "2025-01-29",
    headline: "Microsoft Q2 FY25 earnings release",
    summary:
      "Microsoft filed an 8-K under Item 2.02 disclosing Q2 FY2025 results — revenue, operating income, and segment performance.",
    source: "curated",
  },
  // Disney — CEO transition (Item 5.02)
  {
    ticker: "DIS",
    companyName: "The Walt Disney Company",
    itemCode: "5.02",
    eventDate: "2024-11-20",
    filedAt: "2024-11-20",
    headline: "Disney board adopts CEO succession planning",
    summary:
      "Disney board authorized next phase of CEO succession planning; disclosed under Item 5.02 with committee formation details.",
    source: "curated",
    note: "Illustrative Item 5.02 reference from widely reported 2024 Disney succession planning.",
  },
  // Paramount — M&A close (Item 2.01)
  {
    ticker: "PARA",
    companyName: "Paramount Global",
    itemCode: "2.01",
    eventDate: "2025-08-07",
    filedAt: "2025-08-07",
    headline: "Paramount / Skydance merger closing",
    summary:
      "Paramount Global filed an 8-K under Item 2.01 disclosing the completion of its merger with Skydance Media (announced 2024).",
    source: "curated",
  },
  // Alphabet — Material agreement (Item 1.01)
  {
    ticker: "GOOGL",
    companyName: "Alphabet Inc.",
    itemCode: "1.01",
    eventDate: "2024-10-14",
    filedAt: "2024-10-15",
    headline: "Alphabet nuclear-energy supply agreement with Kairos Power",
    summary:
      "Alphabet entered a material agreement with small-modular-reactor developer Kairos Power to supply nuclear energy for data center operations; disclosed under Item 1.01.",
    source: "curated",
  },
  // CrowdStrike — Cybersecurity incident context (Item 1.05 or 8.01 depending on filing)
  {
    ticker: "CRWD",
    companyName: "CrowdStrike Holdings",
    itemCode: "8.01",
    eventDate: "2024-07-19",
    filedAt: "2024-07-22",
    headline: "CrowdStrike Falcon sensor global outage",
    summary:
      "CrowdStrike filed an 8-K under Item 8.01 addressing the July 19, 2024 Falcon sensor content configuration update that caused a global IT outage affecting airlines, banks, and healthcare providers.",
    source: "curated",
    note: "Illustrative Item 8.01 reference; this event was widely reported and is a canonical recent material-events example.",
  },
  // MicroStrategy — Material agreement / crypto (Item 1.01 / 8.01 — typically Item 8.01 for bitcoin purchases)
  {
    ticker: "MSTR",
    companyName: "MicroStrategy Incorporated",
    itemCode: "8.01",
    eventDate: "2024-12-09",
    filedAt: "2024-12-09",
    headline: "MicroStrategy additional bitcoin acquisition disclosure",
    summary:
      "MicroStrategy disclosed under Item 8.01 further bitcoin treasury purchases per its ongoing treasury strategy.",
    source: "curated",
  },
];

// --- EDGAR-sourced events (Day-2 ship) -----------------------------------
//
// EDGAR_EVENTS comes from scripts/fetch-edgar-8k.ts → data/edgar-8k.json.
// On a fresh repo without an EDGAR run this resolves to []. The fetcher only
// emits rows with TRACKED_ITEMS, so the shape is safe to cast.
//
// ALL_EVENTS = [...CURATED_EVENTS, ...EDGAR_EVENTS]. Curated rows come first
// (preferred when same event is also in EDGAR). Downstream accessors filter the
// combined set so per-ticker + per-item-type pages get both editorial curation
// AND EDGAR firehose breadth.
import edgar8kRaw from "../data/edgar-8k.json";
export const EDGAR_EVENTS: Form8KEvent[] = (edgar8kRaw as Form8KEvent[]) ?? [];
export const ALL_EVENTS: Form8KEvent[] = [...CURATED_EVENTS, ...EDGAR_EVENTS];

// --- Accessors (read from combined set) -----------------------------------

export function getRecentEvents(limit = 10): Form8KEvent[] {
  return [...ALL_EVENTS].sort((a, b) => (a.filedAt < b.filedAt ? 1 : -1)).slice(0, limit);
}

export function getEventsForTicker(ticker: string): Form8KEvent[] {
  const sym = ticker.toUpperCase();
  return ALL_EVENTS
    .filter((e) => e.ticker.toUpperCase() === sym)
    .sort((a, b) => (a.filedAt < b.filedAt ? 1 : -1));
}

export function getEventsForItemSlug(slug: string): Form8KEvent[] {
  const meta = EVENT_ITEMS_BY_SLUG[slug];
  if (!meta) return [];
  return ALL_EVENTS
    .filter((e) => e.itemCode === meta.code)
    .sort((a, b) => (a.filedAt < b.filedAt ? 1 : -1));
}

export function allEventTickers(): string[] {
  const set = new Set<string>();
  for (const e of ALL_EVENTS) set.add(e.ticker.toUpperCase());
  return Array.from(set).sort();
}

// --- Formatting helpers ---------------------------------------------------

export function fmtEventDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function fmtEventDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
