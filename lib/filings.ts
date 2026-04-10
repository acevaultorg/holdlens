// Approximate latest 13F filing dates per manager. 13F filings are due 45 days
// after quarter-end, so for Q3 2025 (ending 2025-09-30), the deadline is 2025-11-14.
// This is a curated snapshot — production v0.2 will scrape EDGAR directly.
export type Filing = {
  slug: string;
  latestDate: string; // ISO YYYY-MM-DD
  quarter: string;    // e.g. "Q3 2025"
  edgarUrl?: string;
};

export const LATEST_FILINGS: Record<string, Filing> = {
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
