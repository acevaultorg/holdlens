// Latest 13F filing per manager.
//
// v1.37 — we now DERIVE latestDate + quarter from data/edgar-holdings.json so
// the "Latest 13F: QX · Nd ago" badge on /investor/[slug] always reflects what
// the ingested EDGAR data actually contains. Prior to v1.37 this was a
// hand-curated snapshot that stopped being refreshed after 2025-11-14 and
// quietly lied about filing freshness for 2+ months after Q4 2025 landed.
//
// The hand-curated map below (CURATED_FILINGS) is preserved as a fallback for
// managers with no EDGAR data and as the source of truth for edgarUrl (the
// CIK-specific SEC search URL).
import { EDGAR_FILINGS } from "./edgar-data";

export type Filing = {
  slug: string;
  latestDate: string; // ISO YYYY-MM-DD (filingDate from EDGAR, not quarter-end)
  quarter: string;    // e.g. "Q4 2025"
  edgarUrl?: string;
};

function quarterToHuman(q: string): string {
  // "2025-Q4" → "Q4 2025"
  const m = /^(\d{4})-Q([1-4])$/.exec(q);
  return m ? `Q${m[2]} ${m[1]}` : q;
}

const CURATED_FILINGS: Record<string, Filing> = {
  "warren-buffett": {
    slug: "warren-buffett",
    latestDate: "2025-11-14",
    quarter: "Q3 2025",
    edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001067983&type=13F-HR",
  },
  "bill-ackman": {
    slug: "bill-ackman",
    latestDate: "2025-11-14",
    quarter: "Q3 2025",
    edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001336528&type=13F-HR",
  },
  "carl-icahn": {
    slug: "carl-icahn",
    latestDate: "2025-11-14",
    quarter: "Q3 2025",
    edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000921669&type=13F-HR",
  },
  "david-einhorn": {
    slug: "david-einhorn",
    latestDate: "2025-11-14",
    quarter: "Q3 2025",
    edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001079114&type=13F-HR",
  },
  "seth-klarman": {
    slug: "seth-klarman",
    latestDate: "2025-11-14",
    quarter: "Q3 2025",
    edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001061768&type=13F-HR",
  },
  "joel-greenblatt": {
    slug: "joel-greenblatt",
    latestDate: "2025-11-14",
    quarter: "Q3 2025",
    edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001167557&type=13F-HR",
  },
  "michael-burry": {
    slug: "michael-burry",
    latestDate: "2025-11-14",
    quarter: "Q3 2025",
    edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001649339&type=13F-HR",
  },
  "stanley-druckenmiller": {
    slug: "stanley-druckenmiller",
    latestDate: "2025-11-14",
    quarter: "Q3 2025",
    edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001536411&type=13F-HR",
  },
  "li-lu": {
    slug: "li-lu",
    latestDate: "2025-11-14",
    quarter: "Q3 2025",
    edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001709323&type=13F-HR",
  },
  "monish-pabrai": {
    slug: "monish-pabrai",
    latestDate: "2025-11-14",
    quarter: "Q3 2025",
    edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001173334&type=13F-HR",
  },
  "howard-marks": {
    slug: "howard-marks",
    latestDate: "2025-11-14",
    quarter: "Q3 2025",
    edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000949509&type=13F-HR",
  },
  "prem-watsa": {
    slug: "prem-watsa",
    latestDate: "2025-11-14",
    quarter: "Q3 2025",
    edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000915191&type=13F-HR",
  },
  "bill-nygren": {
    slug: "bill-nygren",
    latestDate: "2025-11-14",
    quarter: "Q3 2025",
    edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000872323&type=13F-HR",
  },
  "glenn-greenberg": {
    slug: "glenn-greenberg",
    latestDate: "2025-11-14",
    quarter: "Q3 2025",
    edgarUrl: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001548914&type=13F-HR",
  },
};

// Derive the per-manager latest filing from EDGAR. Keep the curated edgarUrl
// (which encodes each manager's CIK) but overwrite latestDate + quarter with
// whatever the ingested 13F JSON actually has.
function buildLatestFilings(): Record<string, Filing> {
  const latestByMgr: Record<string, { quarter: string; filingDate: string }> = {};
  for (const f of EDGAR_FILINGS) {
    const prev = latestByMgr[f.managerSlug];
    if (!prev || f.quarter > prev.quarter) {
      latestByMgr[f.managerSlug] = { quarter: f.quarter, filingDate: f.filingDate };
    }
  }
  const out: Record<string, Filing> = { ...CURATED_FILINGS };
  for (const [slug, { quarter, filingDate }] of Object.entries(latestByMgr)) {
    const curated = CURATED_FILINGS[slug];
    out[slug] = {
      slug,
      latestDate: filingDate,
      quarter: quarterToHuman(quarter),
      edgarUrl: curated?.edgarUrl,
    };
  }
  return out;
}

export const LATEST_FILINGS: Record<string, Filing> = buildLatestFilings();

/** Next expected 13F filing deadline. 13Fs are due 45 days after quarter end. */
export function nextFilingDeadline(now = new Date()): { date: string; quarter: string } {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1; // 1-12
  // Quarter ends: Q4 Dec-31, Q1 Mar-31, Q2 Jun-30, Q3 Sep-30
  // Due: 45 days later → Feb 14, May 15, Aug 14, Nov 14 (approx)
  const deadlines = [
    { date: `${y}-02-14`, quarter: `Q4 ${y - 1}` },
    { date: `${y}-05-15`, quarter: `Q1 ${y}` },
    { date: `${y}-08-14`, quarter: `Q2 ${y}` },
    { date: `${y}-11-14`, quarter: `Q3 ${y}` },
    { date: `${y + 1}-02-14`, quarter: `Q4 ${y}` },
  ];
  for (const d of deadlines) {
    if (new Date(d.date) > now) return d;
  }
  return deadlines[deadlines.length - 1];
}

/** Human-readable days since a filing. */
export function daysSince(isoDate: string, now = new Date()): number {
  const d = new Date(isoDate);
  const diffMs = now.getTime() - d.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}
