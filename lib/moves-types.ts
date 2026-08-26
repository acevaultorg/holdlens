// Pure types + quarter constants for 13F moves. NO edgar-data or ALL_MOVES
// import — safe to use from client components. lib/moves.ts re-exports these
// plus the heavy data.

export type MoveAction = "new" | "add" | "trim" | "exit";

export type Move = {
  managerSlug: string;
  quarter: string;
  filedAt: string;
  ticker: string;
  name?: string;
  action: MoveAction;
  deltaPct?: number;
  shareChange?: number;
  portfolioImpactPct?: number;
  note?: string;
};

export const QUARTERS = [
  "2026-Q2",
  "2026-Q1",
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

// DERIVED from QUARTERS — do not hand-write these.
//
// These were two literal maps per file (plus LATEST_QUARTER, plus four constants in
// components/DataFreshness.tsx): 7 places that had to be edited together every quarter.
// On 2026-08-14 Q2 was ingested and none of them moved. Twelve days later the site was
// still stamping "Data current: Q1 2026" on every page, /quarter/2026-q2/ 404'd, and
// LATEST_QUARTER here still said 2025-Q4 — two quarters behind. Verified before replacing:
// this derivation reproduces all 37 previous hand-written literals exactly, zero mismatches.
//
// 13F deadline is quarter-end + 45 days (Q1 Mar31->May15, Q2 Jun30->Aug14,
// Q3 Sep30->Nov14, Q4 Dec31->Feb14 of the next year).
function quarterEndPlus45(q: string): string {
  const [y, n] = q.split("-Q").map(Number);
  const end = new Date(Date.UTC(y, [2, 5, 8, 11][n - 1] + 1, 0)); // last day of quarter-end month
  end.setUTCDate(end.getUTCDate() + 45);
  return end.toISOString().slice(0, 10);
}

export const QUARTER_LABELS = Object.fromEntries(
  QUARTERS.map((q) => [q, `Q${q.split("-Q")[1]} ${q.split("-Q")[0]}`]),
) as Record<Quarter, string>;

export const QUARTER_FILED = Object.fromEntries(
  QUARTERS.map((q) => [q, quarterEndPlus45(q)]),
) as Record<Quarter, string>;


export const LATEST_QUARTER: Quarter = QUARTERS[0];
