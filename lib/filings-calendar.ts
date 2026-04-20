// Pure date utilities for 13F filing calendar. NO edgar-data import — safe
// to import from client components without dragging the 6MB EDGAR JSON into
// the client bundle. lib/filings.ts re-exports these and ALSO imports the
// EDGAR data for server-side use.

/** Next expected 13F filing deadline. 13Fs are due 45 days after quarter end. */
export function nextFilingDeadline(now = new Date()): { date: string; quarter: string } {
  const y = now.getUTCFullYear();
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
