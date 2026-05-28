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
  {
    slug: "li-lu-q1-2026-moves",
    investor: "Li Lu",
    investorSlug: "li-lu",
    fund: "Himalaya Capital",
    hook: "Cuts the 15-year Bank of America anchor 71% (28.6%→4.6%) — opens Moody's, MSCI, Tencent Music, H&R Block.",
    period: "2026-q1",
  },
  {
    slug: "coleman-q1-2026-moves",
    investor: "Chase Coleman",
    investorSlug: "chase-coleman",
    fund: "Tiger Global Management",
    hook: "Piles into AI hardware (Nvidia, TSMC +49%, Applied Materials +85%) and halves Microsoft (−54% to 4.1%); trims software + fintech. Alphabet stays #1.",
    period: "2026-q1",
  },
  {
    slug: "halvorsen-q1-2026-moves",
    investor: "Andreas Halvorsen",
    investorSlug: "andreas-halvorsen",
    fund: "Viking Global Investors",
    hook: "Pushes Visa to #1 (+59%), builds quality industrials (Danaher, Fortive, Thermo Fisher +110%, Air Products new); trims Microsoft + Alphabet. New Apple.",
    period: "2026-q1",
  },
  {
    slug: "mandel-q1-2026-moves",
    investor: "Stephen Mandel",
    investorSlug: "stephen-mandel",
    fund: "Lone Pine Capital",
    hook: "Bets on AI's infrastructure — Vistra + Talen (power), ASML + new Teradyne/Corning/MasTec (equipment + materials) — while halving TSMC.",
    period: "2026-q1",
  },
  {
    slug: "klarman-q1-2026-moves",
    investor: "Seth Klarman",
    investorSlug: "seth-klarman",
    fund: "Baupost Group",
    hook: "Makes Amazon the top holding (+47%, 12.7%), adds Alphabet + Ferguson, opens new Aon / Visa / Teleflex. A value legend leaning into quality.",
    period: "2026-q1",
  },
  {
    slug: "pabrai-q1-2026-moves",
    investor: "Mohnish Pabrai",
    investorSlug: "monish-pabrai",
    fund: "Pabrai Investment Funds",
    hook: "A three-stock US book — 68% metallurgical coal (Warrior + Alpha), Transocean trimmed, Valaris exited. The most concentrated 13F we track.",
    period: "2026-q1",
  },
  {
    slug: "terry-smith-q1-2026-moves",
    investor: "Terry Smith",
    investorSlug: "terry-smith",
    fund: "Fundsmith",
    hook: "The 'English Buffett' trims almost his entire US book — Marriott, Stryker, Visa, Alphabet, Pfizer all reduced. A uniform pullback.",
    period: "2026-q1",
  },
  {
    slug: "ainslie-q1-2026-moves",
    investor: "Lee Ainslie",
    investorSlug: "lee-ainslie",
    fund: "Maverick Capital",
    hook: "Trims broadly (Carpenter −61%, MasTec −65%, Live Nation −73%) and opens new Meta + Alphabet + Hut 8. Rotation into mega-cap tech.",
    period: "2026-q1",
  },
];

export function deepDivesForPeriod(period: string): QuarterDeepDive[] {
  return QUARTER_DEEP_DIVES.filter((d) => d.period === period);
}

export function deepDiveBySlug(slug: string): QuarterDeepDive | undefined {
  return QUARTER_DEEP_DIVES.find((d) => d.slug === slug);
}

// Latest deep-dive for an investor's /investor/[slug] page. When multiple
// quarters ship for the same investor, returns the most recent by period.
export function deepDiveByInvestorSlug(
  investorSlug: string,
): QuarterDeepDive | undefined {
  return QUARTER_DEEP_DIVES.filter((d) => d.investorSlug === investorSlug).sort(
    (a, b) => b.period.localeCompare(a.period),
  )[0];
}

// Maps a deep-dive period slug to its human label + recap URL, for backlinks.
export const PERIOD_LABELS: Record<string, string> = {
  "2026-q1": "Q1 2026",
  "2025-q4": "Q4 2025",
};
