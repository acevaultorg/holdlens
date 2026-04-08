// Top superinvestors tracked by HoldLens. Curated subset; v0.2 expands to full 82.
export type Manager = {
  slug: string;
  name: string;
  fund: string;
  role: string;
  netWorth: string;
  startedTracking: string;
  philosophy: string;
  bio: string;
  longestHolding: string;
  topHoldings: { ticker: string; name: string; pct: number; sharesMn: number; thesis: string }[];
};

export const MANAGERS: Manager[] = [
  {
    slug: "warren-buffett",
    name: "Warren Buffett",
    fund: "Berkshire Hathaway",
    role: "Chairman & CEO since 1970",
    netWorth: "~$140B",
    startedTracking: "1965",
    philosophy: "Buy wonderful companies at fair prices. Hold forever.",
    bio: "The Oracle of Omaha. Built Berkshire from a failing textile mill into a $900B+ holding company by compounding for six decades.",
    longestHolding: "Coca-Cola (since 1988)",
    topHoldings: [
      { ticker: "AAPL", name: "Apple Inc.",          pct: 22.4, sharesMn: 300, thesis: "The consumer brand Buffett called 'probably the best business I know in the world'." },
      { ticker: "AXP",  name: "American Express",     pct: 16.8, sharesMn: 151, thesis: "50-year holding — fee-based moat, premium customer base." },
      { ticker: "BAC",  name: "Bank of America",      pct: 11.2, sharesMn: 630, thesis: "Trimmed aggressively in 2024 but still a top-5 position." },
      { ticker: "KO",   name: "Coca-Cola",            pct:  9.1, sharesMn: 400, thesis: "Held since 1988. Annual dividend now exceeds original cost basis." },
      { ticker: "CVX",  name: "Chevron",              pct:  6.4, sharesMn: 118, thesis: "Energy exposure; buffer against inflation." },
      { ticker: "OXY",  name: "Occidental Petroleum", pct:  4.9, sharesMn: 255, thesis: "Building toward a potential majority stake." },
      { ticker: "MCO",  name: "Moody's Corp",         pct:  4.4, sharesMn:  24, thesis: "Duopoly credit-rating franchise. Held since 2000." },
      { ticker: "KHC",  name: "Kraft Heinz",          pct:  3.7, sharesMn: 326, thesis: "Buffett has called this one a mistake but still holds." },
      { ticker: "CB",   name: "Chubb",                pct:  2.9, sharesMn:  27, thesis: "Insurance — Buffett's home turf. Recent build." },
      { ticker: "DVA",  name: "DaVita",               pct:  1.8, sharesMn:  36, thesis: "Largest US dialysis provider. Long-term demographic bet." },
    ],
  },
  {
    slug: "bill-ackman",
    name: "Bill Ackman",
    fund: "Pershing Square Capital",
    role: "Founder & CEO",
    netWorth: "~$9B",
    startedTracking: "2004",
    philosophy: "Concentrated bets on high-quality businesses with activist catalysts.",
    bio: "Activist investor known for high-conviction, concentrated portfolios. Famous wins (General Growth) and famous losses (Valeant, Herbalife).",
    longestHolding: "Restaurant Brands International (since 2014)",
    topHoldings: [
      { ticker: "CMG",  name: "Chipotle Mexican Grill",         pct: 21.4, sharesMn: 28,  thesis: "Top position. Quality compounder thesis." },
      { ticker: "QSR",  name: "Restaurant Brands International", pct: 14.8, sharesMn: 23,  thesis: "Tim Hortons + Burger King + Popeyes parent." },
      { ticker: "HHH",  name: "Howard Hughes Holdings",         pct: 13.2, sharesMn: 19,  thesis: "Master-planned community real estate." },
      { ticker: "GOOG", name: "Alphabet Class C",                pct: 11.7, sharesMn:  9,  thesis: "Reentered position 2023 — AI thesis." },
      { ticker: "BN",   name: "Brookfield Corp",                pct:  9.5, sharesMn: 30,  thesis: "Alternative asset manager play." },
      { ticker: "HLT",  name: "Hilton Worldwide",                pct:  9.1, sharesMn:  8,  thesis: "Asset-light hotel franchise." },
      { ticker: "CP",   name: "Canadian Pacific Kansas City",    pct:  6.8, sharesMn: 14,  thesis: "Rail + freight — wide moat." },
      { ticker: "NKE",  name: "Nike",                            pct:  5.3, sharesMn:  16, thesis: "Recent reentry on turnaround thesis." },
    ],
  },
  {
    slug: "carl-icahn",
    name: "Carl Icahn",
    fund: "Icahn Enterprises",
    role: "Chairman",
    netWorth: "~$6B",
    startedTracking: "1990",
    philosophy: "Buy undervalued, force change, exit at fair value.",
    bio: "Wall Street's most feared activist. Made his name with corporate raids in the 80s; still running plays in his late 80s.",
    longestHolding: "CVR Energy (since 2012)",
    topHoldings: [
      { ticker: "IEP",  name: "Icahn Enterprises (own)",  pct: 65.0, sharesMn: 343, thesis: "His own holding company — dominant position." },
      { ticker: "CVI",  name: "CVR Energy",                pct: 14.2, sharesMn:  71, thesis: "Refining + nitrogen fertilizers — long held." },
      { ticker: "OXY",  name: "Occidental Petroleum",      pct:  4.8, sharesMn:  18, thesis: "Activist position vs management — scaled back." },
      { ticker: "BHC",  name: "Bausch Health",             pct:  4.1, sharesMn:  35, thesis: "Pharma turnaround bet." },
      { ticker: "FE",   name: "FirstEnergy",               pct:  3.6, sharesMn:  24, thesis: "Utility activist position." },
      { ticker: "DNUT", name: "Krispy Kreme",              pct:  2.4, sharesMn:  19, thesis: "Brand recovery play." },
    ],
  },
  {
    slug: "david-einhorn",
    name: "David Einhorn",
    fund: "Greenlight Capital",
    role: "President",
    netWorth: "~$1B",
    startedTracking: "1996",
    philosophy: "Long high-quality value, short fraud and overvaluation.",
    bio: "Value investor famous for shorting Lehman before the crash and calling out accounting fraud. Long-short equity specialist.",
    longestHolding: "Green Brick Partners (since 2014)",
    topHoldings: [
      { ticker: "GRBK", name: "Green Brick Partners",     pct: 28.7, sharesMn: 16, thesis: "Top conviction homebuilder. Held for a decade." },
      { ticker: "CNDT", name: "Conduent",                  pct:  9.8, sharesMn: 47, thesis: "Business process outsourcing turnaround." },
      { ticker: "TECK", name: "Teck Resources",            pct:  7.4, sharesMn:  9, thesis: "Copper exposure — long-term commodity bet." },
      { ticker: "LNC",  name: "Lincoln National",          pct:  6.1, sharesMn:  7, thesis: "Insurer at deep discount to book." },
      { ticker: "PENN", name: "PENN Entertainment",        pct:  5.5, sharesMn: 11, thesis: "Sports betting + regional casinos." },
      { ticker: "CC",   name: "Chemours",                  pct:  4.9, sharesMn:  9, thesis: "Specialty chemicals." },
    ],
  },
  {
    slug: "seth-klarman",
    name: "Seth Klarman",
    fund: "Baupost Group",
    role: "CEO",
    netWorth: "~$1.5B",
    startedTracking: "1982",
    philosophy: "Margin of safety. Cash is a position. Patience pays.",
    bio: "Author of Margin of Safety — the most cited value-investing book never reprinted. Famous for holding 30%+ cash for years.",
    longestHolding: "Liberty Global (since 2014)",
    topHoldings: [
      { ticker: "LBTYK", name: "Liberty Global Class C",   pct: 14.3, sharesMn: 47, thesis: "European cable — long activist position." },
      { ticker: "WBD",   name: "Warner Bros. Discovery",   pct: 11.8, sharesMn: 60, thesis: "Media turnaround / streaming consolidation." },
      { ticker: "VST",   name: "Vistra Corp",              pct:  9.6, sharesMn:  6, thesis: "Independent power producer + AI/data center thesis." },
      { ticker: "FNF",   name: "Fidelity National Financial", pct: 7.1, sharesMn:  8, thesis: "Title insurance — long compounder." },
      { ticker: "VTRS",  name: "Viatris",                  pct:  5.4, sharesMn: 28, thesis: "Generic pharma deep value." },
      { ticker: "ALLY",  name: "Ally Financial",           pct:  4.8, sharesMn: 13, thesis: "Auto lender at low multiples." },
    ],
  },
  {
    slug: "joel-greenblatt",
    name: "Joel Greenblatt",
    fund: "Gotham Asset Management",
    role: "Co-CIO",
    netWorth: "~$1B",
    startedTracking: "1985",
    philosophy: "Buy good companies at cheap prices. Magic Formula.",
    bio: "Founder of Gotham Capital, achieved 50% annual returns 1985-1994. Author of The Little Book That Beats the Market.",
    longestHolding: "Microsoft (since 2009)",
    topHoldings: [
      { ticker: "MSFT", name: "Microsoft",        pct: 4.1, sharesMn: 0.4, thesis: "Quality compounder. Magic Formula stalwart." },
      { ticker: "AAPL", name: "Apple",            pct: 3.8, sharesMn: 0.8, thesis: "High ROIC, reasonable multiple." },
      { ticker: "META", name: "Meta Platforms",   pct: 3.2, sharesMn: 0.3, thesis: "Cash flow machine post-2022 reset." },
      { ticker: "GOOGL", name: "Alphabet",        pct: 3.0, sharesMn: 0.6, thesis: "Search dominance + AI optionality." },
      { ticker: "JPM",  name: "JPMorgan Chase",   pct: 2.8, sharesMn: 0.5, thesis: "Best-in-class bank franchise." },
      { ticker: "UNH",  name: "UnitedHealth",     pct: 2.5, sharesMn: 0.2, thesis: "Healthcare scale + Optum." },
    ],
  },
];

export function getManager(slug: string) {
  return MANAGERS.find((m) => m.slug === slug);
}
