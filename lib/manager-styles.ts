// Heuristic style classification of tracked superinvestors. v0 mapping
// derived from each manager's `philosophy` + `bio` keyword fingerprint.
// Operator can refine via direct edit of STYLE_OF_MANAGER below; styles
// that aren't represented are filtered out of the hub view.
//
// Why this lives separate from MANAGERS:
//   - Manager type stays minimal (slug/name/fund/role/etc.)
//   - Style classifications can be revised without touching base data
//   - Multiple styles per manager is allowed (some are growth+activist)

import { MANAGERS, type Manager } from "@/lib/managers";

export type InvestingStyle =
  | "value"
  | "activist"
  | "growth"
  | "macro"
  | "long-short"
  | "contrarian"
  | "special-situations";

export type StyleMeta = {
  slug: InvestingStyle;
  name: string;
  description: string;
  /** Headline metric / signature observable behavior. */
  signature: string;
  /** What makes this style distinct from the others. */
  contrast: string;
};

export const STYLES: StyleMeta[] = [
  {
    slug: "value",
    name: "Value",
    description:
      "Buy below intrinsic value. Hold for re-rating or compounding. Margin of safety dominates the position-sizing math.",
    signature: "Patient capital. Concentrated portfolios. Long average holding period.",
    contrast: "Indifferent to short-term price action; tolerates multi-year underperformance.",
  },
  {
    slug: "activist",
    name: "Activist",
    description:
      "Build concentrated positions in companies where a specific catalyst (board change, capital allocation, divestiture, M&A) can unlock value the public market hasn't priced in.",
    signature: "Public letters, proxy fights, board nominations, settlement agreements.",
    contrast: "Can't tolerate passive ownership when management is destroying value.",
  },
  {
    slug: "growth",
    name: "Growth",
    description:
      "Pay full price for businesses compounding above the cost of capital. The math: a high-quality compounder at 30× earnings beats a 10× value trap once the time horizon stretches.",
    signature: "Tech-heavy. Concentrated. Holds through volatility on quality conviction.",
    contrast: "Refuses to anchor on backward-looking multiples; buys what others call expensive.",
  },
  {
    slug: "macro",
    name: "Macro",
    description:
      "Trade themes that cross asset classes — currencies, commodities, sovereign rates, equity indexes — based on top-down reads of monetary policy, geopolitics, and cycle position.",
    signature: "Multi-asset book; size flexes with conviction; willing to short.",
    contrast: "Bottom-up stock pickers ignore the cycle; macro investors trade the cycle.",
  },
  {
    slug: "long-short",
    name: "Long-Short",
    description:
      "Hold conviction longs and conviction shorts simultaneously. Generate alpha on both sides; control net exposure to manage market risk.",
    signature: "Pair trades, sector-neutral books, gross exposure 150–200% with net 30–60%.",
    contrast: "Long-only managers can't profit from broken thesis; long-short can.",
  },
  {
    slug: "contrarian",
    name: "Contrarian",
    description:
      "Buy what the market hates. Sell what the market loves. Often deep-value, often shorting bubbles. Tolerates being early, which is indistinguishable from being wrong on a 1-year view.",
    signature: "Visible-from-orbit thesis bets. Comfortable with isolation. Patient.",
    contrast: "Trend-followers ride momentum; contrarians take the other side.",
  },
  {
    slug: "special-situations",
    name: "Special Situations",
    description:
      "Trade the technical structure of corporate events: spin-offs, mergers, bankruptcies, distressed credit, recapitalizations. The edge is process: legal, accounting, and price-discovery work most managers won't do.",
    signature: "Concentrated event-driven book; high turnover; broad mandate.",
    contrast: "Generalists chase headlines; special-situations managers chase filings.",
  },
];

export const STYLES_BY_SLUG: Record<InvestingStyle, StyleMeta> = Object.fromEntries(
  STYLES.map((s) => [s.slug, s]),
) as Record<InvestingStyle, StyleMeta>;

// Heuristic v0 classification (one primary style per manager). Each row
// is operator-editable; the heuristic was philosophy+bio keyword match
// then manual review. Edge cases (Burry = macro?contrarian, Marks =
// special-situations?credit) chose the most-publicly-known posture.
export const STYLE_OF_MANAGER: Record<string, InvestingStyle> = {
  "warren-buffett": "value",
  "bill-ackman": "activist",
  "carl-icahn": "activist",
  "david-einhorn": "long-short",
  "seth-klarman": "value",
  "joel-greenblatt": "special-situations",
  "michael-burry": "contrarian",
  "stanley-druckenmiller": "macro",
  "li-lu": "value",
  "monish-pabrai": "value",
  "howard-marks": "special-situations",
  "prem-watsa": "value",
  "bill-nygren": "value",
  "glenn-greenberg": "value",
  "andreas-halvorsen": "long-short",
  "chris-hohn": "activist",
  "jeffrey-ubben": "activist",
  "stephen-mandel": "growth",
  "lee-ainslie": "long-short",
  "chuck-akre": "growth",
  "terry-smith": "growth",
  "polen-capital": "growth",
  "david-tepper": "macro",
  "chase-coleman": "growth",
  "john-armitage": "long-short",
  "david-rolfe": "growth",
  "francois-rochon": "value",
  "dev-kantesaria": "growth",
  "william-von-mueffling": "value",
  "tom-slater": "growth",
};

export function styleOf(slug: string): InvestingStyle | undefined {
  return STYLE_OF_MANAGER[slug];
}

export function managersByStyle(style: InvestingStyle): Manager[] {
  return MANAGERS.filter((m) => STYLE_OF_MANAGER[m.slug] === style);
}

export function styleCounts(): Array<{ style: StyleMeta; count: number }> {
  return STYLES.map((s) => ({
    style: s,
    count: managersByStyle(s.slug).length,
  })).filter((row) => row.count > 0);
}
