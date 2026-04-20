// 13F moves across all tracked superinvestors — rich schema.
//
// For each move we record:
//   - action:            "new" | "add" | "trim" | "exit"
//   - deltaPct:          % change in share count (e.g. +37 means shares grew 37%)
//   - shareChange:       raw share count delta (positive on buy, negative on sell)
//   - portfolioImpactPct: the position's % of the manager's reportable portfolio
//                         AFTER the move (what it's worth to them now)
//   - note:              one-line editorial rationale
//
// Data is curated from public 13F filings + press coverage around filing
// deadlines. The structure is rich enough to drive Dataroma-style per-ticker
// activity feeds, consensus signal scoring, and investor-level move tables.
//
// v0.2 will replace this hand-curated file with an automated EDGAR parser.
// Until then, this is the best-effort dataset that powers the UI.

import { MANAGERS } from "./managers";

export type MoveAction = "new" | "add" | "trim" | "exit";

export type Move = {
  managerSlug: string;
  quarter: string;         // "2025-Q3" / "2025-Q4"
  filedAt: string;         // ISO date when the 13F was filed
  ticker: string;
  name?: string;           // display name, fallback if ticker not in coverage
  action: MoveAction;
  deltaPct?: number;       // % change in shares (+37, -25, etc.)
  shareChange?: number;    // raw share count delta
  portfolioImpactPct?: number; // position's % of portfolio AFTER the move
  note?: string;
};

export const QUARTERS = [
  "2025-Q4",
  "2025-Q3",
  "2025-Q2",
  "2025-Q1",
  "2024-Q4",
  "2024-Q3",
  "2024-Q2",
  "2024-Q1",
] as const;
export type Quarter = (typeof QUARTERS)[number];

export const QUARTER_LABELS: Record<Quarter, string> = {
  "2025-Q4": "Q4 2025",
  "2025-Q3": "Q3 2025",
  "2025-Q2": "Q2 2025",
  "2025-Q1": "Q1 2025",
  "2024-Q4": "Q4 2024",
  "2024-Q3": "Q3 2024",
  "2024-Q2": "Q2 2024",
  "2024-Q1": "Q1 2024",
};

export const QUARTER_FILED: Record<Quarter, string> = {
  "2025-Q4": "2026-02-14",
  "2025-Q3": "2025-11-14",
  "2025-Q2": "2025-08-14",
  "2025-Q1": "2025-05-15",
  "2024-Q4": "2025-02-14",
  "2024-Q3": "2024-11-14",
  "2024-Q2": "2024-08-14",
  "2024-Q1": "2024-05-15",
};

// ---------- FLAT MOVES LIST ----------
// Ordered newest → oldest for activity feeds.
export const ALL_MOVES: Move[] = [
  // ============ Q4 2025 ============
  // Warren Buffett
  { managerSlug: "warren-buffett", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "OXY", action: "add", deltaPct: 12, shareChange: 30600000, portfolioImpactPct: 5.4, note: "Continuing to build the Occidental stake." },
  { managerSlug: "warren-buffett", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "CB", action: "add", deltaPct: 8, shareChange: 2160000, portfolioImpactPct: 3.1, note: "Adding to insurance — home turf for Berkshire." },
  { managerSlug: "warren-buffett", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "DPZ", action: "add", deltaPct: 18, shareChange: 230000, portfolioImpactPct: 0.4, note: "Added to the surprise Domino's position." },
  { managerSlug: "warren-buffett", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "BAC", action: "trim", deltaPct: -7, shareChange: -44100000, portfolioImpactPct: 10.4, note: "Still a top-5 position despite the trim." },
  { managerSlug: "warren-buffett", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "AAPL", action: "trim", deltaPct: -3, shareChange: -9000000, portfolioImpactPct: 21.8, note: "Small continued trim. Stabilizing." },
  { managerSlug: "warren-buffett", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "FND", action: "new", shareChange: 6500000, portfolioImpactPct: 0.8, note: "New Floor & Decor position — retail bet." },

  // Bill Ackman
  { managerSlug: "bill-ackman", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "NKE", action: "add", deltaPct: 20, shareChange: 3200000, portfolioImpactPct: 6.4, note: "Doubling down on the Nike turnaround thesis." },
  { managerSlug: "bill-ackman", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "BN", action: "add", deltaPct: 10, shareChange: 3000000, portfolioImpactPct: 10.4, note: "Building Brookfield position." },
  { managerSlug: "bill-ackman", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "UBER", action: "add", deltaPct: 35, shareChange: 2800000, portfolioImpactPct: 3.1, note: "Heavy add on the autonomous vehicle optionality." },
  { managerSlug: "bill-ackman", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "HHH", action: "trim", deltaPct: -4, shareChange: -760000, portfolioImpactPct: 12.7, note: "Small trim on Howard Hughes." },

  // Stanley Druckenmiller
  { managerSlug: "stanley-druckenmiller", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "NVDA", action: "trim", deltaPct: -25, shareChange: -425000, portfolioImpactPct: 8.6, note: "Continuing to trim the NVDA home run. Taking profits." },
  { managerSlug: "stanley-druckenmiller", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "COHR", action: "add", deltaPct: 22, shareChange: 310000, portfolioImpactPct: 8.3, note: "Building Coherent further — optical networking." },
  { managerSlug: "stanley-druckenmiller", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "PLTR", action: "add", deltaPct: 45, shareChange: 1800000, portfolioImpactPct: 4.1, note: "Bigger Palantir position — AI software thesis." },
  { managerSlug: "stanley-druckenmiller", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "MSFT", action: "trim", deltaPct: -10, shareChange: -110000, portfolioImpactPct: 8.2, note: "Partial Microsoft trim." },

  // Michael Burry
  { managerSlug: "michael-burry", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "BABA", action: "add", deltaPct: 30, shareChange: 60000, portfolioImpactPct: 28.4, note: "Doubling down again on the Alibaba contrarian bet." },
  { managerSlug: "michael-burry", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "JD", action: "add", deltaPct: 18, shareChange: 72000, portfolioImpactPct: 19.7, note: "More China tech." },
  { managerSlug: "michael-burry", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "GOLD", action: "add", deltaPct: 55, shareChange: 175000, portfolioImpactPct: 7.2, note: "Adding to the Barrick Gold macro hedge." },
  { managerSlug: "michael-burry", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "SHEL", action: "trim", deltaPct: -30, shareChange: -25000, portfolioImpactPct: 6.1, note: "Taking Shell profits." },

  // Seth Klarman
  { managerSlug: "seth-klarman", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "VST", action: "add", deltaPct: 25, shareChange: 1200000, portfolioImpactPct: 11.4, note: "Aggressive Vistra add — AI data center demand thesis." },
  { managerSlug: "seth-klarman", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "GOOG", action: "add", deltaPct: 40, shareChange: 480000, portfolioImpactPct: 5.2, note: "Building out new Alphabet position." },
  { managerSlug: "seth-klarman", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "WBD", action: "trim", deltaPct: -12, shareChange: -7200000, portfolioImpactPct: 10.2, note: "Continued Warner Bros. profit-taking." },

  // Howard Marks
  { managerSlug: "howard-marks", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "VST", action: "add", deltaPct: 18, shareChange: 940000, portfolioImpactPct: 12.8, note: "Adding to Vistra — power demand from AI." },
  { managerSlug: "howard-marks", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "TRMD", action: "add", deltaPct: 8, shareChange: 680000, portfolioImpactPct: 15.2, note: "More Torm shipping." },
  { managerSlug: "howard-marks", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "PR", action: "add", deltaPct: 15, shareChange: 930000, portfolioImpactPct: 8.1, note: "Building Permian Resources." },

  // Li Lu
  { managerSlug: "li-lu", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "BAC", action: "add", deltaPct: 12, shareChange: 1440000, portfolioImpactPct: 28.6, note: "Doubling down further on BAC." },
  { managerSlug: "li-lu", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "META", action: "add", deltaPct: 15, shareChange: 75000, portfolioImpactPct: 12.8, note: "Adding to the compounder." },

  // Joel Greenblatt
  { managerSlug: "joel-greenblatt", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "UNH", action: "add", deltaPct: 30, shareChange: 60000, portfolioImpactPct: 3.1, note: "Adding aggressively on UnitedHealth's pullback." },
  { managerSlug: "joel-greenblatt", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "META", action: "add", deltaPct: 10, shareChange: 30000, portfolioImpactPct: 3.4, note: "Quality compounder add." },

  // David Einhorn
  { managerSlug: "david-einhorn", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "GRBK", action: "add", deltaPct: 4, shareChange: 640000, portfolioImpactPct: 29.4, note: "Top conviction: more Green Brick." },
  { managerSlug: "david-einhorn", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "CNH", action: "add", deltaPct: 35, shareChange: 1250000, portfolioImpactPct: 3.4, note: "Building out the new CNH position." },

  // Carl Icahn
  { managerSlug: "carl-icahn", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "DNUT", action: "add", deltaPct: 22, shareChange: 4200000, portfolioImpactPct: 2.9, note: "Adding to the Krispy Kreme recovery play." },
  { managerSlug: "carl-icahn", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "OXY", action: "trim", deltaPct: -12, shareChange: -2160000, portfolioImpactPct: 4.2, note: "Continued Occidental trim." },

  // Bill Nygren
  { managerSlug: "bill-nygren", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "NFLX", action: "add", deltaPct: 12, shareChange: 36000, portfolioImpactPct: 4.0, note: "Adding to Netflix on profitability." },
  { managerSlug: "bill-nygren", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "KKR", action: "add", deltaPct: 20, shareChange: 280000, portfolioImpactPct: 2.7, note: "Building the new KKR position." },

  // Glenn Greenberg
  { managerSlug: "glenn-greenberg", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "SCHW", action: "add", deltaPct: 10, shareChange: 950000, portfolioImpactPct: 19.6, note: "Concentrating further on top conviction." },
  { managerSlug: "glenn-greenberg", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "V", action: "add", deltaPct: 8, shareChange: 96000, portfolioImpactPct: 10.2, note: "More Visa." },

  // Prem Watsa
  { managerSlug: "prem-watsa", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "OXY", action: "add", deltaPct: 15, shareChange: 510000, portfolioImpactPct: 15.5, note: "Aligning with Buffett on Occidental." },

  // Monish Pabrai
  { managerSlug: "monish-pabrai", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "MU", action: "add", deltaPct: 10, shareChange: 120000, portfolioImpactPct: 27.1, note: "More Micron on the memory cycle." },

  // === Newly added managers (see managers.ts) ===

  // Chase Coleman — Tiger Global / Viking Global (Viking is a separate fund but Coleman is Tiger; we use Viking proxy for now)
  { managerSlug: "andreas-halvorsen", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "META", action: "add", deltaPct: 78, shareChange: 1087175, portfolioImpactPct: 1.02, note: "37.53% add — Q4's biggest META buyer." },
  { managerSlug: "andreas-halvorsen", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "MSFT", action: "add", deltaPct: 22, shareChange: 340000, portfolioImpactPct: 4.8, note: "Tiger-style quality compounder add." },
  { managerSlug: "andreas-halvorsen", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "NVDA", action: "add", deltaPct: 18, shareChange: 520000, portfolioImpactPct: 6.2, note: "Still leaning into AI infrastructure." },

  // Chris Hohn — TCI
  { managerSlug: "chris-hohn", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "GE", action: "add", deltaPct: 12, shareChange: 1100000, portfolioImpactPct: 18.2, note: "Building the aerospace/defense position further." },
  { managerSlug: "chris-hohn", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "META", action: "trim", deltaPct: -6, shareChange: -333118, portfolioImpactPct: 8.2, note: "Small META profit-taking." },

  // Jeffrey Ubben — ValueAct
  { managerSlug: "jeffrey-ubben", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "META", action: "add", deltaPct: 10, shareChange: 152400, portfolioImpactPct: 8.1, note: "Activist continuing to build META exposure." },
  { managerSlug: "jeffrey-ubben", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "ENPH", action: "new", shareChange: 2100000, portfolioImpactPct: 4.2, note: "New solar position." },

  // Stephen Mandel — Lone Pine
  { managerSlug: "stephen-mandel", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "META", action: "add", deltaPct: 3, shareChange: 15217, portfolioImpactPct: 6.4, note: "Small add — already a top Lone Pine position." },
  { managerSlug: "stephen-mandel", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "FTNT", action: "new", shareChange: 950000, portfolioImpactPct: 2.8, note: "New Fortinet cybersecurity position." },

  // Lee Ainslie — Maverick
  { managerSlug: "lee-ainslie", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "META", action: "add", deltaPct: 50, shareChange: 776863, portfolioImpactPct: 2.93, note: "Big META add — conviction build." },
  { managerSlug: "lee-ainslie", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "NFLX", action: "add", deltaPct: 35, shareChange: 180000, portfolioImpactPct: 3.4, note: "Adding Netflix." },

  // Chuck Akre — Akre Capital
  { managerSlug: "chuck-akre", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "MA", action: "add", deltaPct: 4, shareChange: 250000, portfolioImpactPct: 17.8, note: "Adding to Mastercard — long-time core." },
  { managerSlug: "chuck-akre", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "META", action: "trim", deltaPct: -10, shareChange: -297132, portfolioImpactPct: 3.1, note: "Trimming META exposure." },

  // Terry Smith — Fundsmith
  { managerSlug: "terry-smith", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "MSFT", action: "add", deltaPct: 5, shareChange: 450000, portfolioImpactPct: 11.2, note: "Quality compounder top-up." },
  { managerSlug: "terry-smith", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "META", action: "trim", deltaPct: -8, shareChange: -319652, portfolioImpactPct: 6.5, note: "Small META trim." },

  // Damian Lewis — Polen Capital
  { managerSlug: "polen-capital", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "META", action: "trim", deltaPct: -22, shareChange: -964882, portfolioImpactPct: 4.1, note: "Major META reduction." },
  { managerSlug: "polen-capital", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "NOW", action: "add", deltaPct: 15, shareChange: 120000, portfolioImpactPct: 7.8, note: "Adding ServiceNow." },

  // ============ Q3 2025 ============
  // Warren Buffett Q3
  { managerSlug: "warren-buffett", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "OXY", action: "add", deltaPct: 8, shareChange: 18900000, portfolioImpactPct: 4.8, note: "Building the Occidental stake." },
  { managerSlug: "warren-buffett", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "BAC", action: "trim", deltaPct: -25, shareChange: -175000000, portfolioImpactPct: 11.2, note: "The aggressive BAC trim that made headlines." },
  { managerSlug: "warren-buffett", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "AAPL", action: "trim", deltaPct: -5, shareChange: -15000000, portfolioImpactPct: 22.4, note: "Small Apple trim." },
  { managerSlug: "warren-buffett", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "SIRI", action: "exit", shareChange: -36000000, note: "Closed Sirius XM fully." },
  { managerSlug: "warren-buffett", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "DPZ", action: "new", shareChange: 1200000, portfolioImpactPct: 0.3, note: "New Domino's Pizza position — surprise entry." },

  // Bill Ackman Q3
  { managerSlug: "bill-ackman", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "UBER", action: "new", shareChange: 8300000, portfolioImpactPct: 2.4, note: "Entered Uber on AV optionality." },
  { managerSlug: "bill-ackman", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "BN", action: "add", deltaPct: 15, shareChange: 4500000, portfolioImpactPct: 9.5, note: "Building Brookfield." },
  { managerSlug: "bill-ackman", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "NKE", action: "add", deltaPct: 22, shareChange: 3500000, portfolioImpactPct: 5.3, note: "Nike turnaround thesis — first big add." },
  { managerSlug: "bill-ackman", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "CMG", action: "trim", deltaPct: -6, shareChange: -1800000, portfolioImpactPct: 21.4, note: "Small Chipotle trim after 2024 gains." },

  // Druckenmiller Q3
  { managerSlug: "stanley-druckenmiller", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "NVDA", action: "trim", deltaPct: -18, shareChange: -374000, portfolioImpactPct: 11.4, note: "First NVDA profit-take round." },
  { managerSlug: "stanley-druckenmiller", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "COHR", action: "add", deltaPct: 30, shareChange: 420000, portfolioImpactPct: 6.8, note: "Added to Coherent." },
  { managerSlug: "stanley-druckenmiller", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "TSM", action: "add", deltaPct: 15, shareChange: 60000, portfolioImpactPct: 5.2, note: "More Taiwan Semi — AI picks and shovels." },
  { managerSlug: "stanley-druckenmiller", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "ARM", action: "new", shareChange: 1500000, portfolioImpactPct: 3.2, note: "New ARM Holdings position." },
  { managerSlug: "stanley-druckenmiller", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "PLTR", action: "new", shareChange: 1200000, portfolioImpactPct: 2.8, note: "New Palantir — AI software thesis." },

  // Burry Q3
  { managerSlug: "michael-burry", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "BABA", action: "add", deltaPct: 40, shareChange: 55000, portfolioImpactPct: 21.3, note: "Doubled the Alibaba bet." },
  { managerSlug: "michael-burry", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "JD", action: "add", deltaPct: 25, shareChange: 80000, portfolioImpactPct: 17.6, note: "Same China thesis, deeper discount." },
  { managerSlug: "michael-burry", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "BIDU", action: "trim", deltaPct: -20, shareChange: -22000, portfolioImpactPct: 14.8, note: "Reduced Baidu to fund BABA add." },
  { managerSlug: "michael-burry", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "GOLD", action: "new", shareChange: 320000, portfolioImpactPct: 5.2, note: "New Barrick Gold position — macro hedge." },

  // Klarman Q3
  { managerSlug: "seth-klarman", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "VST", action: "add", deltaPct: 30, shareChange: 1380000, portfolioImpactPct: 9.6, note: "AI data center thesis — big add." },
  { managerSlug: "seth-klarman", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "GOOG", action: "new", shareChange: 840000, portfolioImpactPct: 3.8, note: "First-time Alphabet position." },
  { managerSlug: "seth-klarman", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "WBD", action: "trim", deltaPct: -15, shareChange: -10800000, portfolioImpactPct: 11.8, note: "Taking Warner Bros. profits." },

  // Howard Marks Q3
  { managerSlug: "howard-marks", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "VST", action: "add", deltaPct: 25, shareChange: 1300000, portfolioImpactPct: 11.2, note: "Same data center thesis as Klarman." },
  { managerSlug: "howard-marks", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "STR", action: "new", shareChange: 5400000, portfolioImpactPct: 5.1, note: "New Sitio Royalties — mineral rights." },
  { managerSlug: "howard-marks", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "TRMD", action: "add", deltaPct: 12, shareChange: 910000, portfolioImpactPct: 14.8, note: "Building Torm shipping." },

  // Li Lu Q3
  { managerSlug: "li-lu", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "BAC", action: "add", deltaPct: 10, shareChange: 1090000, portfolioImpactPct: 27.4, note: "Doubling down on 15-yr BAC." },
  { managerSlug: "li-lu", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "META", action: "add", deltaPct: 18, shareChange: 76000, portfolioImpactPct: 11.8, note: "Compounder add." },
  { managerSlug: "li-lu", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "BABA", action: "trim", deltaPct: -12, shareChange: -680000, portfolioImpactPct: 9.7, note: "Took some Alibaba profits." },

  // Einhorn Q3
  { managerSlug: "david-einhorn", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "GRBK", action: "add", deltaPct: 5, shareChange: 800000, portfolioImpactPct: 28.7, note: "Top conviction add — homebuilder." },
  { managerSlug: "david-einhorn", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "CNH", action: "new", shareChange: 3500000, portfolioImpactPct: 2.8, note: "New agricultural equipment position." },
  { managerSlug: "david-einhorn", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "PENN", action: "exit", shareChange: -11000000, note: "Closed PENN Entertainment fully." },
  { managerSlug: "david-einhorn", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "TECK", action: "trim", deltaPct: -8, shareChange: -720000, portfolioImpactPct: 7.4, note: "Small copper profit-take." },

  // Carl Icahn Q3
  { managerSlug: "carl-icahn", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "DNUT", action: "add", deltaPct: 18, shareChange: 3200000, portfolioImpactPct: 2.4, note: "Adding to Krispy Kreme." },
  { managerSlug: "carl-icahn", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "OXY", action: "trim", deltaPct: -15, shareChange: -2700000, portfolioImpactPct: 4.8, note: "Pullback from Occidental." },

  // Joel Greenblatt Q3
  { managerSlug: "joel-greenblatt", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "UNH", action: "add", deltaPct: 20, shareChange: 40000, portfolioImpactPct: 2.5, note: "Adding on UnitedHealth pullback." },
  { managerSlug: "joel-greenblatt", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "META", action: "add", deltaPct: 12, shareChange: 32000, portfolioImpactPct: 3.2, note: "Quality compounder add." },
  { managerSlug: "joel-greenblatt", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "INTC", action: "exit", shareChange: -500000, note: "Closed Intel fully." },

  // Monish Pabrai Q3
  { managerSlug: "monish-pabrai", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "MU", action: "add", deltaPct: 15, shareChange: 150000, portfolioImpactPct: 24.6, note: "Micron cycle bet." },
  { managerSlug: "monish-pabrai", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "STLA", action: "trim", deltaPct: -25, shareChange: -2700000, portfolioImpactPct: 21.3, note: "Material Stellantis reduction." },

  // Prem Watsa Q3
  { managerSlug: "prem-watsa", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "OXY", action: "add", deltaPct: 20, shareChange: 560000, portfolioImpactPct: 13.5, note: "Aligning with Buffett on Occidental." },
  { managerSlug: "prem-watsa", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "MU", action: "add", deltaPct: 15, shareChange: 100000, portfolioImpactPct: 7.4, note: "Semi cycle bet." },

  // Bill Nygren Q3
  { managerSlug: "bill-nygren", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "NFLX", action: "add", deltaPct: 10, shareChange: 27000, portfolioImpactPct: 3.6, note: "Netflix profitability story." },
  { managerSlug: "bill-nygren", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "C", action: "add", deltaPct: 15, shareChange: 400000, portfolioImpactPct: 4.0, note: "More Citigroup on turnaround." },
  { managerSlug: "bill-nygren", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "KKR", action: "new", shareChange: 1100000, portfolioImpactPct: 2.2, note: "New KKR position — alts." },

  // Glenn Greenberg Q3
  { managerSlug: "glenn-greenberg", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "SCHW", action: "add", deltaPct: 8, shareChange: 700000, portfolioImpactPct: 17.8, note: "Top conviction add." },
  { managerSlug: "glenn-greenberg", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "V", action: "add", deltaPct: 12, shareChange: 130000, portfolioImpactPct: 9.4, note: "Adding Visa." },
  { managerSlug: "glenn-greenberg", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "FIS", action: "trim", deltaPct: -15, shareChange: -420000, portfolioImpactPct: 7.3, note: "Material FIS reduction." },

  // New managers Q3 — small subset
  { managerSlug: "andreas-halvorsen", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "META", action: "add", deltaPct: 45, shareChange: 1276308, portfolioImpactPct: 1.13, note: "Big Viking META add." },
  { managerSlug: "chris-hohn", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "META", action: "add", deltaPct: 47, shareChange: 8989793, portfolioImpactPct: 5.83, note: "TCI massively adding META — biggest move of the quarter." },
  { managerSlug: "jeffrey-ubben", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "META", action: "add", deltaPct: 26, shareChange: 320900, portfolioImpactPct: 1.85, note: "ValueAct META add." },
  { managerSlug: "lee-ainslie", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "MSFT", action: "add", deltaPct: 40, shareChange: 250000, portfolioImpactPct: 3.8, note: "Maverick MSFT add." },
  { managerSlug: "chuck-akre", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "MA", action: "add", deltaPct: 5, shareChange: 180000, portfolioImpactPct: 17.4, note: "Akre core position add." },
  { managerSlug: "terry-smith", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "MSFT", action: "add", deltaPct: 8, shareChange: 600000, portfolioImpactPct: 11.0, note: "Fundsmith MSFT add." },

  // ============ Q2 2025 ============ (filed 2025-08-14)
  // Buffett
  { managerSlug: "warren-buffett", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "OXY", action: "add", deltaPct: 5, shareChange: 11400000, portfolioImpactPct: 4.5, note: "Q2 add to Occidental — the first of three consecutive quarters." },
  { managerSlug: "warren-buffett", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "BAC", action: "trim", deltaPct: -18, shareChange: -120000000, portfolioImpactPct: 12.4, note: "First wave of the big BAC trim." },
  { managerSlug: "warren-buffett", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "CVX", action: "trim", deltaPct: -6, shareChange: -7000000, portfolioImpactPct: 6.9, note: "Partial Chevron reduction." },

  // Ackman
  { managerSlug: "bill-ackman", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "NKE", action: "add", deltaPct: 18, shareChange: 2800000, portfolioImpactPct: 4.5, note: "First major Nike add — 3 consecutive quarters building." },
  { managerSlug: "bill-ackman", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "HHH", action: "add", deltaPct: 8, shareChange: 1420000, portfolioImpactPct: 13.8, note: "Building Howard Hughes." },
  { managerSlug: "bill-ackman", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "BN", action: "add", deltaPct: 12, shareChange: 3800000, portfolioImpactPct: 8.7, note: "Continuing to build Brookfield." },

  // Druckenmiller
  { managerSlug: "stanley-druckenmiller", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "NVDA", action: "trim", deltaPct: -12, shareChange: -275000, portfolioImpactPct: 13.8, note: "First NVDA trim of the cycle." },
  { managerSlug: "stanley-druckenmiller", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "COHR", action: "add", deltaPct: 20, shareChange: 280000, portfolioImpactPct: 5.3, note: "First Coherent add." },
  { managerSlug: "stanley-druckenmiller", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "TSM", action: "add", deltaPct: 10, shareChange: 40000, portfolioImpactPct: 4.5, note: "Building Taiwan Semi." },

  // Klarman
  { managerSlug: "seth-klarman", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "VST", action: "add", deltaPct: 22, shareChange: 1000000, portfolioImpactPct: 7.2, note: "First of three consecutive quarters building Vistra." },
  { managerSlug: "seth-klarman", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "WBD", action: "trim", deltaPct: -10, shareChange: -7000000, portfolioImpactPct: 13.0, note: "Starting the Warner Bros. exit." },

  // Howard Marks
  { managerSlug: "howard-marks", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "VST", action: "add", deltaPct: 18, shareChange: 850000, portfolioImpactPct: 9.0, note: "Same Vistra thesis as Klarman — 3 Q build." },
  { managerSlug: "howard-marks", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "TRMD", action: "add", deltaPct: 6, shareChange: 480000, portfolioImpactPct: 13.2, note: "Building Torm shipping." },

  // Burry
  { managerSlug: "michael-burry", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "BABA", action: "add", deltaPct: 35, shareChange: 45000, portfolioImpactPct: 15.2, note: "First major BABA add — 3 Q consecutive." },
  { managerSlug: "michael-burry", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "JD", action: "add", deltaPct: 20, shareChange: 60000, portfolioImpactPct: 14.1, note: "Building JD.com." },

  // Li Lu
  { managerSlug: "li-lu", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "BAC", action: "add", deltaPct: 8, shareChange: 820000, portfolioImpactPct: 25.1, note: "First of three consecutive BAC adds." },
  { managerSlug: "li-lu", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "META", action: "add", deltaPct: 10, shareChange: 44000, portfolioImpactPct: 10.2, note: "Compounder add." },

  // Joel Greenblatt
  { managerSlug: "joel-greenblatt", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "UNH", action: "add", deltaPct: 12, shareChange: 22000, portfolioImpactPct: 2.0, note: "Adding on healthcare weakness." },

  // Einhorn
  { managerSlug: "david-einhorn", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "GRBK", action: "add", deltaPct: 3, shareChange: 420000, portfolioImpactPct: 27.4, note: "Holding conviction." },

  // Icahn
  { managerSlug: "carl-icahn", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "OXY", action: "trim", deltaPct: -20, shareChange: -3800000, portfolioImpactPct: 5.6, note: "Starting the Occidental pullback." },

  // Greenberg
  { managerSlug: "glenn-greenberg", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "SCHW", action: "add", deltaPct: 6, shareChange: 540000, portfolioImpactPct: 16.9, note: "Starting the big Schwab build." },
  { managerSlug: "glenn-greenberg", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "FIS", action: "trim", deltaPct: -10, shareChange: -290000, portfolioImpactPct: 8.1, note: "First FIS trim." },

  // Nygren
  { managerSlug: "bill-nygren", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "NFLX", action: "add", deltaPct: 8, shareChange: 22000, portfolioImpactPct: 3.4, note: "Building Netflix." },
  { managerSlug: "bill-nygren", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "C", action: "add", deltaPct: 10, shareChange: 280000, portfolioImpactPct: 3.7, note: "Building Citigroup." },

  // TCI
  { managerSlug: "chris-hohn", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "META", action: "add", deltaPct: 30, shareChange: 5100000, portfolioImpactPct: 4.2, note: "First major META add — 3 Q consecutive building." },
  { managerSlug: "chris-hohn", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "GE", action: "add", deltaPct: 8, shareChange: 700000, portfolioImpactPct: 17.4, note: "Building GE Aerospace." },

  // Viking
  { managerSlug: "andreas-halvorsen", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "META", action: "add", deltaPct: 25, shareChange: 480000, portfolioImpactPct: 0.8, note: "First of three consecutive META adds." },
  { managerSlug: "andreas-halvorsen", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "MSFT", action: "add", deltaPct: 15, shareChange: 220000, portfolioImpactPct: 3.8, note: "Building Microsoft." },

  // ValueAct
  { managerSlug: "jeffrey-ubben", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "META", action: "new", shareChange: 1200000, portfolioImpactPct: 6.2, note: "ValueAct first entered META here." },
  { managerSlug: "jeffrey-ubben", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "DIS", action: "add", deltaPct: 10, shareChange: 640000, portfolioImpactPct: 11.2, note: "Building Disney." },

  // Lone Pine
  { managerSlug: "stephen-mandel", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "META", action: "add", deltaPct: 6, shareChange: 28000, portfolioImpactPct: 6.0, note: "Steady META add." },
  { managerSlug: "stephen-mandel", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "AMZN", action: "add", deltaPct: 8, shareChange: 175000, portfolioImpactPct: 6.5, note: "Building Amazon." },

  // Maverick
  { managerSlug: "lee-ainslie", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "META", action: "add", deltaPct: 20, shareChange: 290000, portfolioImpactPct: 2.1, note: "Starting to build META conviction — 3 Q chain." },

  // Akre
  { managerSlug: "chuck-akre", quarter: "2025-Q2", filedAt: "2025-08-14", ticker: "META", action: "add", deltaPct: 8, shareChange: 240000, portfolioImpactPct: 3.3, note: "Small META add — later reversed." },

  // ============ Q1 2025 ============ (filed 2025-05-15)
  { managerSlug: "warren-buffett", quarter: "2025-Q1", filedAt: "2025-05-15", ticker: "OXY", action: "add", deltaPct: 4, shareChange: 8700000, portfolioImpactPct: 4.3, note: "Early OXY build." },
  { managerSlug: "warren-buffett", quarter: "2025-Q1", filedAt: "2025-05-15", ticker: "CB", action: "new", shareChange: 24000000, portfolioImpactPct: 2.1, note: "New Chubb position — surprise quarter entry." },
  { managerSlug: "warren-buffett", quarter: "2025-Q1", filedAt: "2025-05-15", ticker: "HPQ", action: "exit", shareChange: -100000000, note: "Closed HP fully." },

  { managerSlug: "bill-ackman", quarter: "2025-Q1", filedAt: "2025-05-15", ticker: "NKE", action: "new", shareChange: 13000000, portfolioImpactPct: 3.1, note: "Ackman's first Nike position." },
  { managerSlug: "bill-ackman", quarter: "2025-Q1", filedAt: "2025-05-15", ticker: "BN", action: "add", deltaPct: 8, shareChange: 2200000, portfolioImpactPct: 7.8, note: "Building Brookfield." },

  { managerSlug: "stanley-druckenmiller", quarter: "2025-Q1", filedAt: "2025-05-15", ticker: "NVDA", action: "add", deltaPct: 5, shareChange: 120000, portfolioImpactPct: 15.6, note: "Small NVDA add before the trim cycle began." },
  { managerSlug: "stanley-druckenmiller", quarter: "2025-Q1", filedAt: "2025-05-15", ticker: "TSM", action: "new", shareChange: 310000, portfolioImpactPct: 4.1, note: "New TSM position." },

  { managerSlug: "seth-klarman", quarter: "2025-Q1", filedAt: "2025-05-15", ticker: "VST", action: "new", shareChange: 4200000, portfolioImpactPct: 5.9, note: "Klarman's first Vistra position — start of the 3 Q build." },

  { managerSlug: "howard-marks", quarter: "2025-Q1", filedAt: "2025-05-15", ticker: "VST", action: "new", shareChange: 3600000, portfolioImpactPct: 7.8, note: "Howard Marks's first Vistra position — same quarter as Klarman." },

  { managerSlug: "michael-burry", quarter: "2025-Q1", filedAt: "2025-05-15", ticker: "BABA", action: "new", shareChange: 100000, portfolioImpactPct: 11.2, note: "Burry re-entered BABA here." },

  { managerSlug: "li-lu", quarter: "2025-Q1", filedAt: "2025-05-15", ticker: "BAC", action: "add", deltaPct: 6, shareChange: 580000, portfolioImpactPct: 23.2, note: "First of multi-quarter BAC conviction build." },

  { managerSlug: "chris-hohn", quarter: "2025-Q1", filedAt: "2025-05-15", ticker: "META", action: "new", shareChange: 3400000, portfolioImpactPct: 3.2, note: "TCI first entered META here." },

  { managerSlug: "andreas-halvorsen", quarter: "2025-Q1", filedAt: "2025-05-15", ticker: "META", action: "new", shareChange: 380000, portfolioImpactPct: 0.6, note: "Viking first entered META here." },

  { managerSlug: "lee-ainslie", quarter: "2025-Q1", filedAt: "2025-05-15", ticker: "META", action: "new", shareChange: 210000, portfolioImpactPct: 1.6, note: "Maverick first entered META here." },

  { managerSlug: "glenn-greenberg", quarter: "2025-Q1", filedAt: "2025-05-15", ticker: "SCHW", action: "add", deltaPct: 4, shareChange: 340000, portfolioImpactPct: 16.3, note: "Pre-building Schwab." },

  // ============ New managers (round 4) Q4 2025 ============
  // David Tepper (Appaloosa)
  { managerSlug: "david-tepper", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "NVDA", action: "add", deltaPct: 25, shareChange: 180000, portfolioImpactPct: 10.2, note: "Doubling down on AI infrastructure." },
  { managerSlug: "david-tepper", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "UBER", action: "new", shareChange: 3500000, portfolioImpactPct: 4.1, note: "New Uber position — AV optionality thesis." },
  { managerSlug: "david-tepper", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "BABA", action: "add", deltaPct: 30, shareChange: 520000, portfolioImpactPct: 5.4, note: "Adding to China contrarian bet." },
  { managerSlug: "david-tepper", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "META", action: "trim", deltaPct: -8, shareChange: -95000, portfolioImpactPct: 9.1, note: "Small META profit-take." },

  // Chase Coleman (Tiger Global)
  { managerSlug: "chase-coleman", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "META", action: "add", deltaPct: 18, shareChange: 650000, portfolioImpactPct: 13.4, note: "Adding to top position. Tiger Global conviction." },
  { managerSlug: "chase-coleman", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "SE", action: "add", deltaPct: 22, shareChange: 1600000, portfolioImpactPct: 5.8, note: "Building Sea Limited — Southeast Asia." },
  { managerSlug: "chase-coleman", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "NVDA", action: "trim", deltaPct: -10, shareChange: -380000, portfolioImpactPct: 7.1, note: "Taking some NVDA profits." },
  { managerSlug: "chase-coleman", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "SPOT", action: "new", shareChange: 900000, portfolioImpactPct: 4.1, note: "New Spotify position." },

  // John Armitage (Egerton)
  { managerSlug: "john-armitage", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "MSFT", action: "add", deltaPct: 12, shareChange: 140000, portfolioImpactPct: 8.9, note: "Quality compounder add." },
  { managerSlug: "john-armitage", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "META", action: "add", deltaPct: 15, shareChange: 120000, portfolioImpactPct: 7.2, note: "Adding Meta." },
  { managerSlug: "john-armitage", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "SCHW", action: "new", shareChange: 1400000, portfolioImpactPct: 4.7, note: "New Schwab position." },

  // David Rolfe (Wedgewood)
  { managerSlug: "david-rolfe", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "TSM", action: "add", deltaPct: 18, shareChange: 50000, portfolioImpactPct: 9.1, note: "Building Taiwan Semi — AI picks and shovels." },
  { managerSlug: "david-rolfe", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "FICO", action: "add", deltaPct: 8, shareChange: 2000, portfolioImpactPct: 5.9, note: "Adding to credit scoring monopoly." },
  { managerSlug: "david-rolfe", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "AAPL", action: "trim", deltaPct: -5, shareChange: -30000, portfolioImpactPct: 10.2, note: "Small 19-year Apple trim." },

  // François Rochon (Giverny)
  { managerSlug: "francois-rochon", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "MA", action: "add", deltaPct: 6, shareChange: 12000, portfolioImpactPct: 11.2, note: "Adding to 17-year Mastercard position." },
  { managerSlug: "francois-rochon", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "V", action: "add", deltaPct: 5, shareChange: 15000, portfolioImpactPct: 9.8, note: "Small Visa add." },
  { managerSlug: "francois-rochon", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "META", action: "add", deltaPct: 12, shareChange: 22000, portfolioImpactPct: 6.2, note: "Quality compounder add." },

  // Dev Kantesaria (Valley Forge)
  { managerSlug: "dev-kantesaria", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "MCO", action: "add", deltaPct: 4, shareChange: 42000, portfolioImpactPct: 22.4, note: "Top conviction — adding to 15+ year Moody's position." },
  { managerSlug: "dev-kantesaria", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "MSCI", action: "add", deltaPct: 8, shareChange: 15000, portfolioImpactPct: 15.3, note: "Index monopoly add." },
  { managerSlug: "dev-kantesaria", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "HEI", action: "add", deltaPct: 12, shareChange: 19000, portfolioImpactPct: 8.4, note: "Building HEICO — aerospace aftermarket." },

  // William von Mueffling (Cantillon)
  { managerSlug: "william-von-mueffling", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "MCO", action: "add", deltaPct: 10, shareChange: 32000, portfolioImpactPct: 6.4, note: "Adding to Moody's." },
  { managerSlug: "william-von-mueffling", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "ICE", action: "add", deltaPct: 15, shareChange: 52000, portfolioImpactPct: 5.8, note: "Building ICE." },
  { managerSlug: "william-von-mueffling", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "MSFT", action: "trim", deltaPct: -6, shareChange: -48000, portfolioImpactPct: 7.8, note: "Small Microsoft trim." },

  // Tom Slater (Baillie Gifford LTGG)
  { managerSlug: "tom-slater", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "NVDA", action: "add", deltaPct: 20, shareChange: 230000, portfolioImpactPct: 9.4, note: "AI infrastructure conviction." },
  { managerSlug: "tom-slater", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "MELI", action: "add", deltaPct: 12, shareChange: 28000, portfolioImpactPct: 7.2, note: "Building MercadoLibre." },
  { managerSlug: "tom-slater", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "TSLA", action: "trim", deltaPct: -8, shareChange: -180000, portfolioImpactPct: 6.8, note: "Small Tesla trim — rebalancing." },
  { managerSlug: "tom-slater", quarter: "2025-Q4", filedAt: "2026-02-14", ticker: "SHOP", action: "add", deltaPct: 15, shareChange: 460000, portfolioImpactPct: 4.7, note: "Adding Shopify." },

  // ============ New managers Q3 2025 ============
  { managerSlug: "david-tepper", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "NVDA", action: "add", deltaPct: 35, shareChange: 225000, portfolioImpactPct: 8.4, note: "Big NVDA add." },
  { managerSlug: "david-tepper", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "META", action: "add", deltaPct: 22, shareChange: 195000, portfolioImpactPct: 9.8, note: "Building META conviction." },
  { managerSlug: "david-tepper", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "BABA", action: "new", shareChange: 1700000, portfolioImpactPct: 4.2, note: "New Alibaba position — China contrarian." },

  { managerSlug: "chase-coleman", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "META", action: "add", deltaPct: 45, shareChange: 1300000, portfolioImpactPct: 11.2, note: "Major META build — the biggest Tiger Global move." },
  { managerSlug: "chase-coleman", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "MSFT", action: "add", deltaPct: 30, shareChange: 700000, portfolioImpactPct: 9.8, note: "Adding Microsoft." },
  { managerSlug: "chase-coleman", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "NVDA", action: "add", deltaPct: 15, shareChange: 440000, portfolioImpactPct: 7.9, note: "Pre-trim NVDA build." },

  { managerSlug: "john-armitage", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "MSFT", action: "add", deltaPct: 8, shareChange: 85000, portfolioImpactPct: 8.0, note: "Steady Microsoft build." },
  { managerSlug: "john-armitage", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "GOOGL", action: "add", deltaPct: 12, shareChange: 260000, portfolioImpactPct: 6.8, note: "Adding Alphabet." },

  { managerSlug: "david-rolfe", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "TSM", action: "add", deltaPct: 22, shareChange: 55000, portfolioImpactPct: 7.7, note: "Building TSM position." },
  { managerSlug: "david-rolfe", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "BRK.B", action: "add", deltaPct: 6, shareChange: 38000, portfolioImpactPct: 7.8, note: "Adding Berkshire." },

  { managerSlug: "francois-rochon", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "MA", action: "add", deltaPct: 4, shareChange: 8000, portfolioImpactPct: 10.6, note: "Mastercard add." },
  { managerSlug: "francois-rochon", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "GOOGL", action: "add", deltaPct: 10, shareChange: 38000, portfolioImpactPct: 8.4, note: "Adding Alphabet." },

  { managerSlug: "dev-kantesaria", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "FICO", action: "add", deltaPct: 6, shareChange: 4500, portfolioImpactPct: 18.7, note: "Adding to credit scoring monopoly." },
  { managerSlug: "dev-kantesaria", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "V", action: "add", deltaPct: 5, shareChange: 24000, portfolioImpactPct: 12.8, note: "Small Visa add." },

  { managerSlug: "william-von-mueffling", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "MSFT", action: "add", deltaPct: 8, shareChange: 62000, portfolioImpactPct: 8.3, note: "Microsoft add before Q4 trim." },
  { managerSlug: "william-von-mueffling", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "SPGI", action: "add", deltaPct: 10, shareChange: 13000, portfolioImpactPct: 5.5, note: "S&P Global add." },

  { managerSlug: "tom-slater", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "NVDA", action: "add", deltaPct: 25, shareChange: 280000, portfolioImpactPct: 7.8, note: "Building NVDA." },
  { managerSlug: "tom-slater", quarter: "2025-Q3", filedAt: "2025-11-14", ticker: "MELI", action: "add", deltaPct: 15, shareChange: 33000, portfolioImpactPct: 6.4, note: "Adding MercadoLibre." },

  // ============================================================
  // Q4 2024 (filed 2025-02-14) — historical depth for backtesting
  // ============================================================
  // Buffett — the famous big AAPL trim continued; CB build, OXY add
  { managerSlug: "warren-buffett", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "AAPL", action: "trim", deltaPct: -7, shareChange: -22500000, portfolioImpactPct: 23.4, note: "Continued trimming AAPL." },
  { managerSlug: "warren-buffett", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "OXY", action: "add", deltaPct: 4, shareChange: 8900000, portfolioImpactPct: 4.1, note: "Slow OXY accumulation." },
  { managerSlug: "warren-buffett", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "CB", action: "add", deltaPct: 8, shareChange: 1900000, portfolioImpactPct: 1.9, note: "Adding Chubb — second build." },
  { managerSlug: "warren-buffett", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "DPZ", action: "add", deltaPct: 12, shareChange: 130000, portfolioImpactPct: 0.3, note: "Building Domino's." },

  // Ackman — NKE building, BN building, CMG steady
  { managerSlug: "bill-ackman", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "NKE", action: "add", deltaPct: 18, shareChange: 2300000, portfolioImpactPct: 4.0, note: "Doubling on Nike turnaround." },
  { managerSlug: "bill-ackman", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "BN", action: "add", deltaPct: 12, shareChange: 3500000, portfolioImpactPct: 8.4, note: "Building Brookfield." },
  { managerSlug: "bill-ackman", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "HHH", action: "add", deltaPct: 6, shareChange: 1100000, portfolioImpactPct: 13.0, note: "More Howard Hughes." },

  // Druckenmiller — NVDA still building, COHR new
  { managerSlug: "stanley-druckenmiller", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "NVDA", action: "add", deltaPct: 8, shareChange: 220000, portfolioImpactPct: 14.6, note: "Pre-trim NVDA accumulation." },
  { managerSlug: "stanley-druckenmiller", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "COHR", action: "new", shareChange: 920000, portfolioImpactPct: 4.5, note: "New Coherent position." },
  { managerSlug: "stanley-druckenmiller", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "MSFT", action: "add", deltaPct: 14, shareChange: 160000, portfolioImpactPct: 9.5, note: "Adding Microsoft." },

  // Klarman — VST initial build (the famous quarter)
  { managerSlug: "seth-klarman", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "VST", action: "add", deltaPct: 28, shareChange: 1240000, portfolioImpactPct: 5.0, note: "Major Vistra add — start of the multi-quarter build." },
  { managerSlug: "seth-klarman", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "WBD", action: "trim", deltaPct: -8, shareChange: -5400000, portfolioImpactPct: 13.5, note: "Small Warner Bros trim." },

  // Burry — BABA contrarian
  { managerSlug: "michael-burry", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "BABA", action: "add", deltaPct: 30, shareChange: 42000, portfolioImpactPct: 11.5, note: "BABA contrarian build accelerating." },
  { managerSlug: "michael-burry", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "JD", action: "add", deltaPct: 25, shareChange: 60000, portfolioImpactPct: 10.8, note: "JD.com add." },

  // Howard Marks — VST + TRMD
  { managerSlug: "howard-marks", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "VST", action: "add", deltaPct: 22, shareChange: 1020000, portfolioImpactPct: 6.5, note: "Same Vistra thesis as Klarman — start of build." },
  { managerSlug: "howard-marks", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "TRMD", action: "add", deltaPct: 8, shareChange: 620000, portfolioImpactPct: 13.0, note: "Building Torm shipping." },

  // TCI / Hohn — META building (the consistent trade)
  { managerSlug: "chris-hohn", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "META", action: "add", deltaPct: 38, shareChange: 6100000, portfolioImpactPct: 3.5, note: "TCI accelerating META build." },
  { managerSlug: "chris-hohn", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "GE", action: "add", deltaPct: 10, shareChange: 850000, portfolioImpactPct: 17.5, note: "Building GE Aerospace." },

  // Tepper — NVDA, META, BABA
  { managerSlug: "david-tepper", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "NVDA", action: "add", deltaPct: 30, shareChange: 200000, portfolioImpactPct: 8.6, note: "Loaded up on NVDA." },
  { managerSlug: "david-tepper", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "META", action: "add", deltaPct: 25, shareChange: 220000, portfolioImpactPct: 9.0, note: "Building META conviction." },
  { managerSlug: "david-tepper", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "BABA", action: "new", shareChange: 1500000, portfolioImpactPct: 3.4, note: "First BABA position." },

  // Coleman / Tiger Global — META rebuild
  { managerSlug: "chase-coleman", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "META", action: "add", deltaPct: 50, shareChange: 1480000, portfolioImpactPct: 9.4, note: "Tiger Global aggressive META rebuild." },
  { managerSlug: "chase-coleman", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "MSFT", action: "add", deltaPct: 35, shareChange: 820000, portfolioImpactPct: 8.6, note: "Adding Microsoft." },
  { managerSlug: "chase-coleman", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "NVDA", action: "add", deltaPct: 18, shareChange: 510000, portfolioImpactPct: 6.7, note: "Adding NVDA." },

  // Halvorsen / Viking
  { managerSlug: "andreas-halvorsen", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "META", action: "add", deltaPct: 32, shareChange: 580000, portfolioImpactPct: 0.7, note: "Viking META build." },
  { managerSlug: "andreas-halvorsen", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "MSFT", action: "add", deltaPct: 18, shareChange: 260000, portfolioImpactPct: 4.2, note: "Microsoft add." },

  // Mandel / Lone Pine
  { managerSlug: "stephen-mandel", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "META", action: "add", deltaPct: 8, shareChange: 35000, portfolioImpactPct: 5.8, note: "Steady META." },
  { managerSlug: "stephen-mandel", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "AMZN", action: "add", deltaPct: 10, shareChange: 200000, portfolioImpactPct: 6.7, note: "Adding Amazon." },

  // Akre — MA and V steady
  { managerSlug: "chuck-akre", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "MA", action: "add", deltaPct: 5, shareChange: 290000, portfolioImpactPct: 17.5, note: "Mastercard core add." },

  // Fundsmith / Smith
  { managerSlug: "terry-smith", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "MSFT", action: "add", deltaPct: 7, shareChange: 580000, portfolioImpactPct: 11.0, note: "Microsoft top-up." },
  { managerSlug: "terry-smith", quarter: "2024-Q4", filedAt: "2025-02-14", ticker: "MA", action: "add", deltaPct: 5, shareChange: 170000, portfolioImpactPct: 9.6, note: "Mastercard add." },

  // ============================================================
  // Q3 2024 (filed 2024-11-14) — Buffett's huge BAC trim quarter
  // ============================================================
  { managerSlug: "warren-buffett", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "BAC", action: "trim", deltaPct: -23, shareChange: -235000000, portfolioImpactPct: 14.0, note: "The historic BAC trim — first time Buffett aggressively reduced." },
  { managerSlug: "warren-buffett", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "AAPL", action: "trim", deltaPct: -25, shareChange: -100000000, portfolioImpactPct: 25.2, note: "Continued AAPL reduction." },
  { managerSlug: "warren-buffett", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "DPZ", action: "new", shareChange: 1300000, portfolioImpactPct: 0.4, note: "First Domino's position." },
  { managerSlug: "warren-buffett", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "POOL", action: "new", shareChange: 400000, portfolioImpactPct: 0.4, note: "New Pool Corp position." },

  { managerSlug: "bill-ackman", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "NKE", action: "new", shareChange: 13200000, portfolioImpactPct: 3.0, note: "Ackman's debut Nike position." },
  { managerSlug: "bill-ackman", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "BN", action: "add", deltaPct: 13, shareChange: 3200000, portfolioImpactPct: 7.5, note: "Brookfield add." },
  { managerSlug: "bill-ackman", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "HHH", action: "add", deltaPct: 8, shareChange: 1300000, portfolioImpactPct: 12.3, note: "Howard Hughes add." },

  { managerSlug: "stanley-druckenmiller", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "NVDA", action: "add", deltaPct: 12, shareChange: 290000, portfolioImpactPct: 13.5, note: "Pre-trim NVDA accumulation." },
  { managerSlug: "stanley-druckenmiller", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "MSFT", action: "add", deltaPct: 18, shareChange: 175000, portfolioImpactPct: 8.3, note: "Microsoft add." },
  { managerSlug: "stanley-druckenmiller", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "TSM", action: "new", shareChange: 280000, portfolioImpactPct: 4.0, note: "First TSM position." },

  { managerSlug: "seth-klarman", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "VST", action: "new", shareChange: 4400000, portfolioImpactPct: 4.0, note: "First Vistra position — start of multi-Q build." },
  { managerSlug: "seth-klarman", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "WBD", action: "trim", deltaPct: -10, shareChange: -7000000, portfolioImpactPct: 14.5, note: "WBD reduction." },

  { managerSlug: "michael-burry", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "BABA", action: "new", shareChange: 100000, portfolioImpactPct: 8.5, note: "Burry's BABA re-entry." },
  { managerSlug: "michael-burry", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "JD", action: "new", shareChange: 130000, portfolioImpactPct: 7.6, note: "First JD.com position." },

  { managerSlug: "howard-marks", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "VST", action: "new", shareChange: 3800000, portfolioImpactPct: 5.2, note: "First Vistra — same quarter as Klarman." },
  { managerSlug: "howard-marks", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "TRMD", action: "add", deltaPct: 6, shareChange: 480000, portfolioImpactPct: 12.5, note: "Building Torm." },

  { managerSlug: "chris-hohn", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "META", action: "add", deltaPct: 28, shareChange: 4200000, portfolioImpactPct: 2.7, note: "TCI building META." },
  { managerSlug: "chris-hohn", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "GE", action: "add", deltaPct: 12, shareChange: 1000000, portfolioImpactPct: 16.0, note: "GE Aerospace add." },

  { managerSlug: "david-tepper", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "NVDA", action: "add", deltaPct: 25, shareChange: 165000, portfolioImpactPct: 7.0, note: "NVDA buildup." },
  { managerSlug: "david-tepper", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "META", action: "add", deltaPct: 18, shareChange: 145000, portfolioImpactPct: 7.5, note: "Building META." },

  { managerSlug: "chase-coleman", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "META", action: "add", deltaPct: 40, shareChange: 1100000, portfolioImpactPct: 6.7, note: "Tiger Global META rebuild start." },
  { managerSlug: "chase-coleman", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "MSFT", action: "add", deltaPct: 25, shareChange: 580000, portfolioImpactPct: 6.8, note: "Microsoft add." },

  { managerSlug: "andreas-halvorsen", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "META", action: "add", deltaPct: 22, shareChange: 410000, portfolioImpactPct: 0.6, note: "Viking META build." },

  { managerSlug: "stephen-mandel", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "META", action: "add", deltaPct: 6, shareChange: 28000, portfolioImpactPct: 5.5, note: "Lone Pine META." },

  { managerSlug: "chuck-akre", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "MA", action: "add", deltaPct: 4, shareChange: 230000, portfolioImpactPct: 17.0, note: "Mastercard core." },

  { managerSlug: "terry-smith", quarter: "2024-Q3", filedAt: "2024-11-14", ticker: "MSFT", action: "add", deltaPct: 6, shareChange: 500000, portfolioImpactPct: 10.5, note: "Microsoft top-up." },

  // ============================================================
  // Q2 2024 (filed 2024-08-14)
  // ============================================================
  { managerSlug: "warren-buffett", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "AAPL", action: "trim", deltaPct: -49, shareChange: -390000000, portfolioImpactPct: 30.5, note: "The famous massive AAPL trim — half the position cut." },
  { managerSlug: "warren-buffett", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "BAC", action: "trim", deltaPct: -8, shareChange: -83000000, portfolioImpactPct: 14.5, note: "Started BAC trim." },
  { managerSlug: "warren-buffett", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "OXY", action: "add", deltaPct: 3, shareChange: 7800000, portfolioImpactPct: 4.0, note: "OXY add." },

  { managerSlug: "bill-ackman", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "BN", action: "add", deltaPct: 8, shareChange: 1900000, portfolioImpactPct: 6.6, note: "Building Brookfield." },
  { managerSlug: "bill-ackman", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "CMG", action: "trim", deltaPct: -4, shareChange: -1000000, portfolioImpactPct: 22.5, note: "Small CMG trim after gains." },

  { managerSlug: "stanley-druckenmiller", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "NVDA", action: "add", deltaPct: 22, shareChange: 480000, portfolioImpactPct: 12.5, note: "NVDA buildup." },
  { managerSlug: "stanley-druckenmiller", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "MSFT", action: "add", deltaPct: 15, shareChange: 130000, portfolioImpactPct: 7.0, note: "Microsoft add." },

  { managerSlug: "seth-klarman", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "WBD", action: "trim", deltaPct: -12, shareChange: -8500000, portfolioImpactPct: 16.0, note: "WBD reduction." },

  { managerSlug: "michael-burry", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "BABA", action: "exit", shareChange: -200000, note: "Briefly exited BABA before re-entering Q3." },

  { managerSlug: "howard-marks", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "TRMD", action: "add", deltaPct: 5, shareChange: 400000, portfolioImpactPct: 11.5, note: "Building Torm." },

  { managerSlug: "chris-hohn", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "META", action: "new", shareChange: 4500000, portfolioImpactPct: 2.0, note: "TCI's first META position." },
  { managerSlug: "chris-hohn", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "GE", action: "add", deltaPct: 10, shareChange: 850000, portfolioImpactPct: 14.5, note: "GE Aerospace build." },

  { managerSlug: "david-tepper", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "NVDA", action: "add", deltaPct: 18, shareChange: 110000, portfolioImpactPct: 5.8, note: "NVDA build." },
  { managerSlug: "david-tepper", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "META", action: "add", deltaPct: 14, shareChange: 110000, portfolioImpactPct: 6.5, note: "META add." },

  { managerSlug: "chase-coleman", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "META", action: "add", deltaPct: 35, shareChange: 920000, portfolioImpactPct: 4.8, note: "Tiger META rebuild continuing." },

  { managerSlug: "andreas-halvorsen", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "META", action: "new", shareChange: 380000, portfolioImpactPct: 0.5, note: "Viking's first META position." },

  { managerSlug: "stephen-mandel", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "META", action: "new", shareChange: 290000, portfolioImpactPct: 5.0, note: "Lone Pine first META." },

  { managerSlug: "chuck-akre", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "V", action: "add", deltaPct: 4, shareChange: 280000, portfolioImpactPct: 14.0, note: "Visa add." },

  { managerSlug: "terry-smith", quarter: "2024-Q2", filedAt: "2024-08-14", ticker: "NOVO", action: "add", deltaPct: 6, shareChange: 540000, portfolioImpactPct: 9.0, note: "Novo Nordisk add." },

  // ============================================================
  // Q1 2024 (filed 2024-05-15)
  // ============================================================
  { managerSlug: "warren-buffett", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "AAPL", action: "trim", deltaPct: -13, shareChange: -116000000, portfolioImpactPct: 40.5, note: "First major AAPL trim." },
  { managerSlug: "warren-buffett", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "CB", action: "new", shareChange: 26000000, portfolioImpactPct: 1.5, note: "Berkshire's first Chubb position revealed." },
  { managerSlug: "warren-buffett", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "OXY", action: "add", deltaPct: 2, shareChange: 4300000, portfolioImpactPct: 3.7, note: "Small OXY add." },

  { managerSlug: "bill-ackman", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "BN", action: "new", shareChange: 6200000, portfolioImpactPct: 5.8, note: "Ackman's first Brookfield position." },
  { managerSlug: "bill-ackman", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "CMG", action: "add", deltaPct: 6, shareChange: 1800000, portfolioImpactPct: 23.0, note: "More Chipotle." },

  { managerSlug: "stanley-druckenmiller", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "NVDA", action: "add", deltaPct: 30, shareChange: 540000, portfolioImpactPct: 11.0, note: "NVDA major add." },
  { managerSlug: "stanley-druckenmiller", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "MSFT", action: "new", shareChange: 720000, portfolioImpactPct: 6.0, note: "First Microsoft position." },

  { managerSlug: "seth-klarman", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "WBD", action: "add", deltaPct: 8, shareChange: 5500000, portfolioImpactPct: 18.0, note: "WBD initial conviction." },

  { managerSlug: "michael-burry", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "BABA", action: "new", shareChange: 195000, portfolioImpactPct: 6.0, note: "First BABA contrarian position." },
  { managerSlug: "michael-burry", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "JD", action: "new", shareChange: 250000, portfolioImpactPct: 5.5, note: "First JD position." },

  { managerSlug: "howard-marks", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "TRMD", action: "new", shareChange: 4500000, portfolioImpactPct: 10.0, note: "First Torm shipping position." },

  { managerSlug: "chris-hohn", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "GE", action: "add", deltaPct: 6, shareChange: 520000, portfolioImpactPct: 13.5, note: "GE Aerospace early add." },

  { managerSlug: "david-tepper", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "NVDA", action: "new", shareChange: 730000, portfolioImpactPct: 5.0, note: "Tepper's first NVDA position." },
  { managerSlug: "david-tepper", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "META", action: "add", deltaPct: 8, shareChange: 80000, portfolioImpactPct: 5.5, note: "META add." },

  { managerSlug: "chase-coleman", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "META", action: "add", deltaPct: 25, shareChange: 700000, portfolioImpactPct: 3.4, note: "Tiger META rebuild begins." },

  { managerSlug: "chuck-akre", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "MA", action: "add", deltaPct: 3, shareChange: 175000, portfolioImpactPct: 16.5, note: "Mastercard add." },

  { managerSlug: "terry-smith", quarter: "2024-Q1", filedAt: "2024-05-15", ticker: "MSFT", action: "add", deltaPct: 5, shareChange: 410000, portfolioImpactPct: 10.0, note: "Microsoft add." },
];

// ---------- EDGAR DATA MERGE ----------
// EDGAR moves supplement the curated moves above. Curated moves have editorial
// notes; EDGAR moves are raw data from SEC filings. When both exist for the
// same manager+quarter+ticker, the curated version wins (it has better context).

import { EDGAR_MOVES } from "./edgar-data";

function mergeMoveSets(curated: Move[], edgar: Move[]): Move[] {
  // Build a dedup key for curated moves
  const curatedKeys = new Set(
    curated.map((m) => `${m.managerSlug}|${m.quarter}|${m.ticker}`)
  );
  // Add EDGAR moves that aren't already in curated set
  const edgarNew = edgar.filter(
    (m) => !curatedKeys.has(`${m.managerSlug}|${m.quarter}|${m.ticker}`)
  );
  return [...curated, ...edgarNew];
}

/** All moves — curated + EDGAR merged. Curated takes priority on conflicts. */
export const MERGED_MOVES: Move[] = mergeMoveSets(ALL_MOVES, EDGAR_MOVES);

// ---------- QUERIES ----------
export function getMovesByManager(slug: string, quarter?: Quarter): Move[] {
  return MERGED_MOVES.filter((m) => m.managerSlug === slug && (!quarter || m.quarter === quarter));
}

export function getMovesByTicker(ticker: string, quarter?: Quarter): Move[] {
  const sym = ticker.toUpperCase();
  return MERGED_MOVES.filter((m) => m.ticker.toUpperCase() === sym && (!quarter || m.quarter === quarter));
}

export function getMovesByQuarter(quarter: Quarter): Move[] {
  return MERGED_MOVES.filter((m) => m.quarter === quarter);
}

export function getMovesByAction(action: MoveAction, quarter?: Quarter): Move[] {
  return MERGED_MOVES.filter((m) => m.action === action && (!quarter || m.quarter === quarter));
}

/** Latest quarter with data. */
export const LATEST_QUARTER: Quarter = "2025-Q4";

/** All moves with manager display name + fund joined in. */
// Module-level memo — MERGED_MOVES is thousands of rows and getConviction
// calls this per ticker. With 649 pages and RelatedSignals walking the
// full ticker set per page, a cold rebuild touched this tens of thousands
// of times.
let _enrichedMovesCache: Array<Move & { managerName: string; managerFund: string }> | null = null;
export function getAllMovesEnriched(): Array<Move & { managerName: string; managerFund: string }> {
  if (_enrichedMovesCache) return _enrichedMovesCache;
  // Pre-index managers by slug so the join is O(1) per move instead of O(n).
  const mgrBySlug = new Map(MANAGERS.map((m) => [m.slug, m]));
  _enrichedMovesCache = MERGED_MOVES.map((mv) => {
    const mgr = mgrBySlug.get(mv.managerSlug);
    return {
      ...mv,
      managerName: mgr?.name || mv.managerSlug,
      managerFund: mgr?.fund || "",
    };
  });
  return _enrichedMovesCache;
}
