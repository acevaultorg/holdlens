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

/** Format the usual five-day filing window around a deadline. */
export function formatFilingWindow(deadlineIso: string): string {
  const end = new Date(`${deadlineIso}T00:00:00Z`);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 4);
  const year = end.getUTCFullYear();
  const endMonth = end.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  const startMonth = start.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  const startDay = start.getUTCDate();
  const endDay = end.getUTCDate();
  if (startMonth === endMonth) return `${endMonth} ${startDay}\u2013${endDay}, ${year}`;
  return `${startMonth} ${startDay} \u2013 ${endMonth} ${endDay}, ${year}`;
}

/** Format a single filing deadline for the pre-deadline status. */
export function formatFilingDate(deadlineIso: string): string {
  return new Date(`${deadlineIso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Copy for surfaces that describe the latest ingested quarter.
 *
 * Once that quarter's deadline has passed, calling it "live · deadline …"
 * is misleading. Keep the hero/meta wording on the same calendar as the
 * FilingWaveBanner so the site consistently says what is current and what is
 * next.
 */
export function latestFilingStatusLabel(
  latestQuarterLabel: string,
  latestDeadlineIso: string,
  now = new Date(),
): string {
  const latestDeadline = new Date(`${latestDeadlineIso}T00:00:00Z`);
  if (latestDeadline <= now) {
    const next = nextFilingDeadline(now);
    return `${latestQuarterLabel} 13F filings in \u00b7 next wave ${formatFilingWindow(next.date)}`;
  }
  return `${latestQuarterLabel} 13F filings live \u00b7 deadline ${formatFilingDate(latestDeadlineIso)}`;
}

/** Human-readable days since a filing. */
export function daysSince(isoDate: string, now = new Date()): number {
  const d = new Date(isoDate);
  const diffMs = now.getTime() - d.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}
