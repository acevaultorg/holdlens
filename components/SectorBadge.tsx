import { sectorPalette } from "@/lib/sector-colors";

// <SectorBadge sector="Technology" /> — consistent sector pill used on
// every surface that displays a sector name. Wraps sectorPalette() so
// future palette changes don't require touching 20 files.
//
// Renders as a link to /sector/[slug] so the badge doubles as SEO-friendly
// internal navigation from any table row, ticker card, or detail header.
// Pass `linked={false}` to render a non-navigating pill (use-case: inside
// a <tr> that's itself a link).

type Props = {
  sector: string | null | undefined;
  linked?: boolean;
  className?: string;
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "-");
}

export default function SectorBadge({ sector, linked = true, className = "" }: Props) {
  if (!sector) return null;
  const p = sectorPalette(sector);
  const base = `inline-flex items-center text-[10px] font-semibold uppercase tracking-wider rounded px-1.5 py-0.5 ${p.badge} ${p.text} ${className}`;
  if (!linked) {
    return <span className={base}>{sector}</span>;
  }
  return (
    <a
      href={`/sector/${slugify(sector)}`}
      className={`${base} hover:opacity-90 transition`}
      aria-label={`All stocks in ${sector}`}
    >
      {sector}
    </a>
  );
}
