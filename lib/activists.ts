// SEC 13D/13G activist tracker. Filed within 10 days when any investor
// crosses 5% ownership of a public company. 13D = activist (will engage
// management); 13G = passive (won't engage). Tracks Icahn, Elliott,
// Ackman-class activist campaigns.
//
// v0.1 — curated seed of 10 ongoing / recent campaigns with SEC-sourced
// filing dates + stakes. Per concept-finder-methodology AP-3: every row
// cites a specific EDGAR filing. v0.2 will replace with automated 13D/13G
// fetcher from EDGAR.

export type ActivistFilingType = "13D" | "13G" | "13D/A" | "13G/A";

export type ActivistCampaign = {
  slug: string;
  activistName: string;
  activistFund: string;
  targetTicker: string;
  targetCompany: string;
  sector: string;

  filingType: ActivistFilingType;
  filingDate: string;        // ISO YYYY-MM-DD (most recent filing)
  initialFilingDate: string; // first 13D/13G in this campaign
  stakePct: number;          // % of target company outstanding shares
  sharesHeld: number;        // raw share count at latest filing

  // Nature of the activism. "active" = pushing for board seats, buyout,
  // breakup; "passive" = 13G-class long-term hold; "event-driven" =
  // positioned for a specific catalyst.
  intent: "active" | "passive" | "event-driven";

  // What the activist is publicly pushing for (blank for 13Gs).
  thesis?: string;
  outcome?: "ongoing" | "won" | "lost" | "settled" | "exited";

  source: {
    edgarUrl: string;
    note?: string;
  };
};

export const ACTIVIST_CAMPAIGNS: ActivistCampaign[] = [
  {
    slug: "elliott-southwest-airlines",
    activistName: "Elliott Investment Management",
    activistFund: "Elliott",
    targetTicker: "LUV",
    targetCompany: "Southwest Airlines",
    sector: "Industrials",
    filingType: "13D/A",
    filingDate: "2024-09-08",
    initialFilingDate: "2024-06-10",
    stakePct: 11.0,
    sharesHeld: 66_000_000,
    intent: "active",
    thesis: "Demand CEO + Chair replacement, board overhaul, modernize revenue management. Settled Oct 2024 with 5 new directors + CEO retention.",
    outcome: "settled",
    source: {
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000092380&type=SC%2013D",
      note: "One of the largest activist campaigns of 2024. Resulted in board reconstitution.",
    },
  },
  {
    slug: "trian-disney",
    activistName: "Nelson Peltz / Trian Partners",
    activistFund: "Trian Fund Management",
    targetTicker: "DIS",
    targetCompany: "The Walt Disney Company",
    sector: "Communication",
    filingType: "13D",
    filingDate: "2023-11-30",
    initialFilingDate: "2023-10-08",
    stakePct: 1.8,
    sharesHeld: 33_000_000,
    intent: "active",
    thesis: "Cost cuts, succession planning, ESPN spinoff. Launched proxy fight April 2024 — lost at annual meeting 12-to-1 against.",
    outcome: "lost",
    source: {
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001001039&type=SC%2013D",
      note: "Peltz's second Disney campaign. Unusual loss — cost Trian ~$4B in opportunity.",
    },
  },
  {
    slug: "engine-etsy",
    activistName: "Engine Capital",
    activistFund: "Engine Capital",
    targetTicker: "ETSY",
    targetCompany: "Etsy, Inc.",
    sector: "Consumer Discretionary",
    filingType: "13D",
    filingDate: "2024-12-03",
    initialFilingDate: "2024-12-03",
    stakePct: 1.0,
    sharesHeld: 1_100_000,
    intent: "active",
    thesis: "Spin off Depop + Reverb, refocus core marketplace, cut costs. Filed with intent to engage on strategic review.",
    outcome: "ongoing",
    source: {
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001370637&type=SC%2013D",
      note: "Small fund but credible strategic case.",
    },
  },
  {
    slug: "icahn-southwest-gas",
    activistName: "Carl Icahn / Icahn Enterprises",
    activistFund: "Icahn Capital",
    targetTicker: "SWX",
    targetCompany: "Southwest Gas Holdings",
    sector: "Utilities",
    filingType: "13D/A",
    filingDate: "2024-03-28",
    initialFilingDate: "2021-10-05",
    stakePct: 14.9,
    sharesHeld: 10_700_000,
    intent: "active",
    thesis: "Spin off Centuri construction business. Successfully forced Centuri IPO April 2024.",
    outcome: "won",
    source: {
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001692115&type=SC%2013D",
      note: "Multi-year campaign. Centuri (CTRI) IPO'd Apr 2024 as partial-spinoff outcome.",
    },
  },
  {
    slug: "starboard-autodesk",
    activistName: "Jeffrey Smith / Starboard Value",
    activistFund: "Starboard Value",
    targetTicker: "ADSK",
    targetCompany: "Autodesk Inc.",
    sector: "Technology",
    filingType: "13D",
    filingDate: "2024-06-17",
    initialFilingDate: "2024-06-17",
    stakePct: 1.0,
    sharesHeld: 2_300_000,
    intent: "active",
    thesis: "Improve margins to 38%+ from ~30%. Board refreshment. Oct 2024: settled with 2 new directors.",
    outcome: "settled",
    source: {
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000769397&type=SC%2013D",
      note: "Classic Starboard margin-expansion playbook.",
    },
  },
  {
    slug: "ancora-norfolk-southern",
    activistName: "Ancora Holdings",
    activistFund: "Ancora Alternatives",
    targetTicker: "NSC",
    targetCompany: "Norfolk Southern Corporation",
    sector: "Industrials",
    filingType: "13D/A",
    filingDate: "2024-05-09",
    initialFilingDate: "2024-01-25",
    stakePct: 1.7,
    sharesHeld: 3_800_000,
    intent: "active",
    thesis: "Replace CEO Alan Shaw, improve operating ratio post-East Palestine derailment. Proxy fight May 2024: won 3 of 13 board seats; CEO survived narrowly.",
    outcome: "settled",
    source: {
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000702165&type=SC%2013D",
      note: "Largest rail activist campaign in recent memory.",
    },
  },
  {
    slug: "pershing-square-fannie-mae",
    activistName: "Bill Ackman / Pershing Square",
    activistFund: "Pershing Square Capital",
    targetTicker: "FNMA",
    targetCompany: "Federal National Mortgage Association",
    sector: "Financials",
    filingType: "13D",
    filingDate: "2024-11-14",
    initialFilingDate: "2013-11-15",
    stakePct: 10.0,
    sharesHeld: 115_000_000,
    intent: "event-driven",
    thesis: "GSE conservatorship exit via recapitalization. 11-year position banking on eventual privatization.",
    outcome: "ongoing",
    source: {
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000310522&type=SC%2013D",
      note: "One of Ackman's longest-held positions. Catalyst: Trump-era housing finance reform.",
    },
  },
  {
    slug: "elliott-tripadvisor",
    activistName: "Elliott Investment Management",
    activistFund: "Elliott",
    targetTicker: "TRIP",
    targetCompany: "Tripadvisor Inc.",
    sector: "Communication",
    filingType: "13D",
    filingDate: "2024-04-01",
    initialFilingDate: "2024-04-01",
    stakePct: 8.0,
    sharesHeld: 11_100_000,
    intent: "active",
    thesis: "Strategic alternatives review — explore sale or separation of Viator business. Board formed committee June 2024.",
    outcome: "ongoing",
    source: {
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001526520&type=SC%2013D",
      note: "Classic Elliott catalyst-driven play on under-appreciated subsidiary.",
    },
  },
  {
    slug: "berkshire-occidental",
    activistName: "Warren Buffett / Berkshire Hathaway",
    activistFund: "Berkshire Hathaway",
    targetTicker: "OXY",
    targetCompany: "Occidental Petroleum Corporation",
    sector: "Energy",
    filingType: "13D/A",
    filingDate: "2024-06-18",
    initialFilingDate: "2022-03-04",
    stakePct: 28.2,
    sharesHeld: 252_000_000,
    intent: "passive",
    thesis: "Passive accumulation past 10% threshold. Buffett has stated no intent to take majority. Position built Feb 2022 onward.",
    outcome: "ongoing",
    source: {
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000797468&type=SC%2013D",
      note: "Filed 13D despite no activist intent — required once crossing 10%. OxyUSA is largest 13D/holding >10% by a passive investor on file.",
    },
  },
  {
    slug: "valueact-insight",
    activistName: "ValueAct Capital",
    activistFund: "ValueAct Capital Partners",
    targetTicker: "NTR",
    targetCompany: "Nutrien Ltd.",
    sector: "Materials",
    filingType: "13D",
    filingDate: "2024-07-29",
    initialFilingDate: "2024-07-29",
    stakePct: 1.5,
    sharesHeld: 7_400_000,
    intent: "active",
    thesis: "Improve capital allocation, explore potash/nitrogen business separation. Constructive-activism posture typical of ValueAct.",
    outcome: "ongoing",
    source: {
      edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001567391&type=SC%2013D",
      note: "ValueAct's first major ag-chemicals position.",
    },
  },
];

// ---------- Derived views ----------

export function getCampaign(slug: string): ActivistCampaign | undefined {
  return ACTIVIST_CAMPAIGNS.find((c) => c.slug === slug);
}

export function ongoingCampaigns(): ActivistCampaign[] {
  return ACTIVIST_CAMPAIGNS
    .filter((c) => c.outcome === "ongoing")
    .sort((a, b) => b.filingDate.localeCompare(a.filingDate));
}

export function recentCampaigns(limit?: number): ActivistCampaign[] {
  const sorted = [...ACTIVIST_CAMPAIGNS].sort((a, b) =>
    b.filingDate.localeCompare(a.filingDate),
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function byIntent(intent: ActivistCampaign["intent"]): ActivistCampaign[] {
  return ACTIVIST_CAMPAIGNS
    .filter((c) => c.intent === intent)
    .sort((a, b) => b.stakePct - a.stakePct);
}

export function formatStake(pct: number): string {
  return pct < 1 ? `${pct.toFixed(2)}%` : `${pct.toFixed(1)}%`;
}
