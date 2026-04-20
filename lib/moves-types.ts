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
