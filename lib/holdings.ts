// Berkshire Hathaway — top 13F holdings snapshot (approximate, based on latest public 13F).
// Used for investor profile page. Replace with live EDGAR parse in v1.
export type Holding = {
  ticker: string;
  name: string;
  pctPortfolio: number; // approximate % of 13F reportable portfolio
  sharesMn: number;
  thesis: string; // short editorial line
};

export const BUFFETT_TOP: Holding[] = [
  { ticker: "AAPL", name: "Apple Inc.",           pctPortfolio: 22.4, sharesMn: 300,  thesis: "The consumer brand Buffett called 'probably the best business I know in the world'." },
  { ticker: "AXP",  name: "American Express",      pctPortfolio: 16.8, sharesMn: 151,  thesis: "50-year holding — fee-based moat, premium customer base." },
  { ticker: "BAC",  name: "Bank of America",       pctPortfolio: 11.2, sharesMn: 630,  thesis: "Trimmed aggressively in 2024 but still a top-5 position." },
  { ticker: "KO",   name: "Coca-Cola",             pctPortfolio:  9.1, sharesMn: 400,  thesis: "Held since 1988. Dividend alone now exceeds original cost basis." },
  { ticker: "CVX",  name: "Chevron",               pctPortfolio:  6.4, sharesMn: 118,  thesis: "Energy exposure; buffer against inflation." },
  { ticker: "OXY",  name: "Occidental Petroleum",  pctPortfolio:  4.9, sharesMn: 255,  thesis: "Building toward a potential majority stake." },
  { ticker: "MCO",  name: "Moody's Corp",          pctPortfolio:  4.4, sharesMn:  24,  thesis: "Duopoly credit-rating franchise. Held since 2000." },
  { ticker: "KHC",  name: "Kraft Heinz",           pctPortfolio:  3.7, sharesMn: 326,  thesis: "Buffett has publicly called this one a mistake but still holds." },
  { ticker: "CB",   name: "Chubb",                 pctPortfolio:  2.9, sharesMn:  27,  thesis: "Insurance — Buffett's home turf. Recent build." },
  { ticker: "DVA",  name: "DaVita",                pctPortfolio:  1.8, sharesMn:  36,  thesis: "Largest US dialysis provider. Long-term demographic bet." },
];
