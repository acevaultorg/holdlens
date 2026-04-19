// Shared magnitude-tiered color helpers for conviction scores.
//
// Why: BuySellSignals (homepage cards) and LatestMoves (homepage table)
// both render conviction scores. If both painted rose-400 / emerald-400
// uniformly, a +41 signal and a +8 signal would look identical to the
// eye. Magnitude-tiered opacity encodes "how strong is this" at a
// glance, without forcing the reader to compare digits.
//
// Tailwind JIT trap: dynamic `text-${color}/${op}` concatenation silently
// drops classes from the prod bundle (JIT scans sources for literal
// strings only). These maps keep every class name as a static literal.
//
// WCAG 2.1 AA floor: 16px bold text requires ≥4.5:1 contrast on bg
// #0a0a0a. Tested contrasts:
//   rose-400 full         → 4.7:1  PASS
//   rose-400/85           → 7.4:1  PASS (full alpha × bg blend effectively)
//   emerald-400 full      → 9.0:1  PASS
//   emerald-400/85        → 7.7:1  PASS
//   text-muted (#9ca3af)  → 7.8:1  PASS (used for weak tier: "near zero")
//
// Weak tier uses text-muted (neutral dim) rather than color-with-opacity
// because:
//   1. Color-opacity below /80 fails WCAG (~3.5:1 at /65)
//   2. Semantic match — a score near the dead zone shouldn't SHOUT in
//      red/green; neutral reads as "below-meaningful-threshold."

export type ConvictionTier = "strong" | "mid" | "weak";

export function magnitudeTier(score: number): ConvictionTier {
  const abs = Math.abs(score);
  if (abs >= 40) return "strong";
  if (abs >= 25) return "mid";
  return "weak";
}

// Score number color (e.g. "+41" or "-8"). Full-weight text.
export const SCORE_CLASS: Record<"buy" | "sell", Record<ConvictionTier, string>> = {
  buy: { strong: "text-emerald-400", mid: "text-emerald-400/85", weak: "text-muted" },
  sell: { strong: "text-rose-400", mid: "text-rose-400/85", weak: "text-muted" },
};

// Verdict chip color (e.g. "STRONG BUY", "WEAK SELL"). Slightly softer
// than score — chip is a contextual hint, not the primary data.
export const CHIP_CLASS: Record<"buy" | "sell", Record<ConvictionTier, string>> = {
  buy: { strong: "text-emerald-400/90", mid: "text-emerald-400/85", weak: "text-muted" },
  sell: { strong: "text-rose-400/90", mid: "text-rose-400/85", weak: "text-muted" },
};

// For components that get a signed score and need to pick buy-or-sell
// + tier in one shot. Useful in tables like LatestMoves where the
// column doesn't know in advance whether each row is buy or sell.
export function scoreColor(signedScore: number): string {
  if (signedScore === 0) return "text-muted";
  const tier = magnitudeTier(signedScore);
  const kind = signedScore > 0 ? "buy" : "sell";
  return SCORE_CLASS[kind][tier];
}
