// Reports manifest — drives /reports/ archive listing + per-report metadata.
// Each shipped report has a hand-curated entry here. The actual article body
// lives in app/reports/[slug]/page.tsx as a static file (one per slug).

export type Report = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO YYYY-MM-DD
  category: "weekly" | "quarterly" | "monthly-special";
  wordCount: number;
  topics: string[]; // for cross-link routing + LLM topic extraction
};

export const REPORTS: Report[] = [
  {
    slug: "2026-04-q4-2025-13f-signal-summary",
    title: "Q4 2025 13F signal summary — 3,713 moves, 27 managers, the 9 patterns that mattered",
    description:
      "The Q4 2025 filing cycle closed February 17, 2026. Across the 27 superinvestors who filed, HoldLens normalized 3,713 position changes: 2,186 buys, 1,527 sells, 353 first-time positions, 296 full exits. One ticker (AMZN) split the room 6-to-7. Buffett cut AMZN 77%. Ackman bought AMZN 65% and opened META. Three managers independently started MEDLINE. Here's what the ConvictionScore v5 inputs told us.",
    publishedAt: "2026-04-24",
    category: "quarterly",
    wordCount: 2100,
    topics: [
      "13f",
      "q4-2025",
      "superinvestors",
      "buffett",
      "ackman",
      "amzn",
      "meta",
      "medline",
      "intu",
      "cb",
      "consensus-buy",
      "divergence",
      "convictionscore",
    ],
  },
  {
    slug: "2026-04-q1-2026-pre-wave-primer",
    title: "Q1 2026 13F pre-wave primer — what to watch May 11-15",
    description:
      "21 days before the next 13F filing window. What 30 superinvestors filed at the Q4 2025 deadline (Feb 17), how Q1 disclosures typically diverge from prior quarters, and the cross-investor patterns HoldLens will be tracking live as filings hit.",
    publishedAt: "2026-04-24",
    category: "monthly-special",
    wordCount: 1800,
    topics: ["13f", "filings-window", "buffett", "ackman", "burry", "q1-2026", "superinvestors"],
  },
  {
    slug: "2026-04-week-17-insider-cluster-roundup",
    title: "Week 17 (Apr 16-22) — what 3,001 insider trades told us",
    description:
      "First HoldLens weekly commentary backed by full EDGAR Form 4 ingestion. ROKU's 50-trade cluster, HOMB's $2.7M Chairman buy, FLUT's $318M positioning, and the broader 1,296-buy / 1,705-sell split across the week.",
    publishedAt: "2026-04-23",
    category: "weekly",
    wordCount: 1500,
    topics: ["insider-trading", "form-4", "cluster-buy", "ROKU", "HOMB", "FLUT"],
  },
  {
    slug: "2026-04-week-17-8k-event-distribution",
    title: "Week 17 (Apr 16-22) — 1,429 SEC 8-K filings, 5 patterns worth flagging",
    description:
      "Distribution of 8-K material events across one full filing week. Item 8.01 ('Other Events') leads at 340 filings; 4 bankruptcies; cybersecurity quiet at 0; 17 contract terminations.",
    publishedAt: "2026-04-23",
    category: "weekly",
    wordCount: 1400,
    topics: ["8-k", "material-events", "earnings", "officer-change", "bankruptcy"],
  },
];

export function getReport(slug: string): Report | undefined {
  return REPORTS.find((r) => r.slug === slug);
}

export function getReportsByCategory(category: Report["category"]): Report[] {
  return REPORTS.filter((r) => r.category === category).sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1
  );
}

export function getRecentReports(limit = 10): Report[] {
  return [...REPORTS]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, limit);
}
