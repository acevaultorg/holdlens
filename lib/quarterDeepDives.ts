// Single source of truth for per-investor quarterly deep-dive analyses.
//
// These /learn/[investor]-q1-2026-moves pages are the freshest, most-cited
// GEO winners (per Plausible entry data). They were orphaned: not linked from
// the /quarterly/[period] recap covering the same quarter, and missing from
// the LearnReadNext sequence. This registry connects them bidirectionally so
// the whole "Q1 2026 superinvestor moves" query cluster concentrates topical
// authority instead of scattering across disconnected pages.
//
// When a new quarter ships (e.g. 2026-q2), add the analyses here once — the
// /quarterly page section and the LearnReadNext recap block both read from
// this list, so no second edit is needed.

export type QuarterDeepDive = {
  slug: string; // /learn/[slug]
  investor: string;
  investorSlug: string; // /investor/[investorSlug]
  fund: string;
  hook: string;
  period: string; // matches PERIODS slug in app/quarterly/[period]/page.tsx
};

export const QUARTER_DEEP_DIVES: QuarterDeepDive[] = [
  {
    slug: "buffett-q1-2026-moves",
    investor: "Warren Buffett",
    investorSlug: "warren-buffett",
    fund: "Berkshire Hathaway",
    hook: "Most active quarter in years — Delta re-entry, Alphabet add, V/MA/UNH/AON exits.",
    period: "2026-q1",
  },
  {
    slug: "ackman-q1-2026-moves",
    investor: "Bill Ackman",
    investorSlug: "bill-ackman",
    fund: "Pershing Square",
    hook: "Microsoft new at 15% of book, Alphabet near-exit — the most assertive entry in years.",
    period: "2026-q1",
  },
  {
    slug: "tepper-q1-2026-moves",
    investor: "David Tepper",
    investorSlug: "david-tepper",
    fund: "Appaloosa Management",
    hook: "Amazon to #1, China unwind, memory + semis adds.",
    period: "2026-q1",
  },
  {
    slug: "druckenmiller-q1-2026-moves",
    investor: "Stanley Druckenmiller",
    investorSlug: "stanley-druckenmiller",
    fund: "Duquesne Family Office",
    hook: "Natera at 18%, YPF + Alcoa + STMicro adds — diversification pivot, AUM down 25%.",
    period: "2026-q1",
  },
  {
    slug: "hohn-q1-2026-moves",
    investor: "Chris Hohn",
    investorSlug: "chris-hohn",
    fund: "TCI Fund Management",
    hook: "TCI guts Microsoft, deepens GE + Visa to 58% of the book.",
    period: "2026-q1",
  },
];

export function deepDivesForPeriod(period: string): QuarterDeepDive[] {
  return QUARTER_DEEP_DIVES.filter((d) => d.period === period);
}

export function deepDiveBySlug(slug: string): QuarterDeepDive | undefined {
  return QUARTER_DEEP_DIVES.find((d) => d.slug === slug);
}

// Maps a deep-dive period slug to its human label + recap URL, for backlinks.
export const PERIOD_LABELS: Record<string, string> = {
  "2026-q1": "Q1 2026",
  "2025-q4": "Q4 2025",
};
