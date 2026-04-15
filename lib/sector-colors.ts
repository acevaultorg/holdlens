// Consistent sector color palette, shared across every page that renders
// a sector badge, label, or chart cell. SimplyWall.St + HedgeFollow use
// this pattern — the same sector keeps the same hue everywhere, so users
// build a visual grammar ("blue means tech") over repeat sessions.
//
// Why not inline colors: sector badges were drifting across pages, using
// different opacity/border combos. Centralizing prevents future drift and
// makes it trivial to retint the whole site if we ever need to.
//
// Tailwind utility classes only — no runtime styling, no css-in-js. Safe
// on the Next.js static export.

export type SectorPalette = {
  /** Pill-style background + border (e.g. `bg-sky-400/10 border-sky-400/30`). */
  badge: string;
  /** Text color class. */
  text: string;
  /** Pure background for chart cells (no border). */
  fill: string;
};

/**
 * Canonical 11-sector palette. Sector names are case-insensitive; the
 * lookup normalizes whitespace and case before dispatching.
 */
const PALETTE: Record<string, SectorPalette> = {
  technology: {
    badge: "bg-sky-400/10 border border-sky-400/30",
    text: "text-sky-400",
    fill: "bg-sky-400",
  },
  financials: {
    badge: "bg-emerald-400/10 border border-emerald-400/30",
    text: "text-emerald-400",
    fill: "bg-emerald-400",
  },
  energy: {
    badge: "bg-amber-500/10 border border-amber-500/30",
    text: "text-amber-400",
    fill: "bg-amber-500",
  },
  healthcare: {
    badge: "bg-rose-400/10 border border-rose-400/30",
    text: "text-rose-400",
    fill: "bg-rose-400",
  },
  "consumer discretionary": {
    badge: "bg-fuchsia-400/10 border border-fuchsia-400/30",
    text: "text-fuchsia-400",
    fill: "bg-fuchsia-400",
  },
  "consumer staples": {
    badge: "bg-orange-400/10 border border-orange-400/30",
    text: "text-orange-400",
    fill: "bg-orange-400",
  },
  industrials: {
    badge: "bg-slate-400/10 border border-slate-400/30",
    text: "text-slate-300",
    fill: "bg-slate-400",
  },
  materials: {
    badge: "bg-yellow-400/10 border border-yellow-400/30",
    text: "text-yellow-400",
    fill: "bg-yellow-400",
  },
  "real estate": {
    badge: "bg-teal-400/10 border border-teal-400/30",
    text: "text-teal-400",
    fill: "bg-teal-400",
  },
  communication: {
    badge: "bg-violet-400/10 border border-violet-400/30",
    text: "text-violet-400",
    fill: "bg-violet-400",
  },
  utilities: {
    badge: "bg-cyan-400/10 border border-cyan-400/30",
    text: "text-cyan-400",
    fill: "bg-cyan-400",
  },
  other: {
    badge: "bg-panel border border-border",
    text: "text-muted",
    fill: "bg-muted",
  },
};

const FALLBACK: SectorPalette = PALETTE.other;

/** Normalize a sector string for lookup. "Consumer  Staples" → "consumer staples". */
function normalize(sector: string | null | undefined): string {
  if (!sector) return "other";
  return sector.trim().replace(/\s+/g, " ").toLowerCase();
}

export function sectorPalette(sector: string | null | undefined): SectorPalette {
  return PALETTE[normalize(sector)] ?? FALLBACK;
}

/** Convenience: single classnames string for a pill badge with text. */
export function sectorBadgeClass(sector: string | null | undefined): string {
  const p = sectorPalette(sector);
  return `inline-flex items-center text-[10px] font-semibold uppercase tracking-wider rounded px-1.5 py-0.5 ${p.badge} ${p.text}`;
}
