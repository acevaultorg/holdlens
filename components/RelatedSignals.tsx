import { TICKER_INDEX, type TickerData } from "@/lib/tickers";
import { getConviction } from "@/lib/conviction";

// <RelatedSignals /> — time-on-site booster ported from SeekingAlpha /
// SimplyWall.st "related content" pattern. On any signal page, surface two
// groups of sibling tickers:
//
//   1. Same-sector: top conviction names in the same sector (ex-self).
//   2. Co-owned: tickers held by ≥2 of the same managers as the current
//      ticker (implicit "smart money cluster").
//
// Internally this becomes a dense cross-link graph: 94 signal pages × 10
// links per page = ~940 new internal edges. That compounds the SEO
// authority-flow across the cluster and cuts bounce rate on the head page.
//
// Server component, zero client JS. Module-level memoization avoids
// recomputing ownership maps during the 94-page static export.

type Related = {
  symbol: string;
  name: string;
  sector: string;
  convictionScore: number;
  sharedOwners: number;
};

function buildOwnersIndex(): Map<string, Set<string>> {
  const idx = new Map<string, Set<string>>();
  for (const t of Object.values(TICKER_INDEX)) {
    const slugs = new Set<string>();
    for (const o of t.owners ?? []) slugs.add(o.slug);
    idx.set(t.symbol, slugs);
  }
  return idx;
}

let OWNERS_INDEX_CACHE: Map<string, Set<string>> | null = null;
function ownersIndex(): Map<string, Set<string>> {
  if (!OWNERS_INDEX_CACHE) OWNERS_INDEX_CACHE = buildOwnersIndex();
  return OWNERS_INDEX_CACHE;
}

function computeSameSector(self: TickerData): Related[] {
  if (!self.sector) return [];
  const rows: Related[] = [];
  for (const t of Object.values(TICKER_INDEX)) {
    if (t.symbol === self.symbol) continue;
    if (t.sector !== self.sector) continue;
    const conv = getConviction(t.symbol);
    rows.push({
      symbol: t.symbol,
      name: t.name,
      sector: t.sector,
      convictionScore: conv.score,
      sharedOwners: 0,
    });
  }
  rows.sort((a, b) => b.convictionScore - a.convictionScore);
  return rows.slice(0, 5);
}

function computeCoOwned(self: TickerData): Related[] {
  const idx = ownersIndex();
  const selfOwners = idx.get(self.symbol) ?? new Set<string>();
  if (selfOwners.size === 0) return [];

  const rows: Related[] = [];
  for (const t of Object.values(TICKER_INDEX)) {
    if (t.symbol === self.symbol) continue;
    const otherOwners = idx.get(t.symbol) ?? new Set<string>();
    let shared = 0;
    for (const slug of otherOwners) if (selfOwners.has(slug)) shared += 1;
    if (shared < 2) continue;
    const conv = getConviction(t.symbol);
    rows.push({
      symbol: t.symbol,
      name: t.name,
      sector: t.sector ?? "Other",
      convictionScore: conv.score,
      sharedOwners: shared,
    });
  }
  rows.sort((a, b) => b.sharedOwners - a.sharedOwners || b.convictionScore - a.convictionScore);
  return rows.slice(0, 5);
}

export default function RelatedSignals({ symbol }: { symbol: string }) {
  const sym = symbol.toUpperCase();
  const self = TICKER_INDEX[sym];
  if (!self) return null;

  const sameSector = computeSameSector(self);
  const coOwned = computeCoOwned(self);

  if (sameSector.length === 0 && coOwned.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
        <h2 className="text-2xl font-bold">Related smart-money signals</h2>
        <div className="text-xs text-dim">Derived from the same 13F filings</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {sameSector.length > 0 && (
          <RelatedColumn
            title={`Same sector · ${self.sector ?? "Other"}`}
            subtitle="Top conviction in this sector"
            rows={sameSector}
            showShared={false}
            linkHref={
              self.sector
                ? `/sector/${self.sector.toLowerCase().replace(/\s+/g, "-")}`
                : "/rotation"
            }
            linkLabel={`All ${self.sector ?? "Other"} names →`}
          />
        )}
        {coOwned.length > 0 && (
          <RelatedColumn
            title="Same owners hold these"
            subtitle={`Tickers owned by ≥2 of ${sym}'s holders`}
            rows={coOwned}
            showShared={true}
            linkHref="/overlap"
            linkLabel="Full overlap matrix →"
          />
        )}
      </div>
    </section>
  );
}

function RelatedColumn({
  title,
  subtitle,
  rows,
  showShared,
  linkHref,
  linkLabel,
}: {
  title: string;
  subtitle: string;
  rows: Related[];
  showShared: boolean;
  linkHref: string;
  linkLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-5">
      <div className="text-[10px] uppercase tracking-widest font-bold text-brand mb-1">
        {title}
      </div>
      <div className="text-xs text-dim mb-4">{subtitle}</div>
      <ol className="space-y-3">
        {rows.map((r, i) => (
          <li key={r.symbol}>
            <a
              href={`/signal/${r.symbol}`}
              className="flex items-baseline justify-between gap-3 rounded-lg px-3 py-2 -mx-3 hover:bg-bg/40 transition"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-dim tabular-nums w-5 shrink-0">{i + 1}.</span>
                  <span className="font-mono font-semibold text-brand">{r.symbol}</span>
                  <span className="text-sm text-text truncate">{r.name}</span>
                </div>
                {showShared && r.sharedOwners > 0 && (
                  <div className="text-[11px] text-dim ml-7 mt-0.5">
                    {r.sharedOwners} shared owner{r.sharedOwners > 1 ? "s" : ""}
                  </div>
                )}
              </div>
              <div
                className={`text-sm font-bold tabular-nums shrink-0 ${
                  r.convictionScore > 0
                    ? "text-emerald-400"
                    : r.convictionScore < 0
                      ? "text-rose-400"
                      : "text-dim"
                }`}
              >
                {r.convictionScore > 0 ? "+" : ""}
                {r.convictionScore}
              </div>
            </a>
          </li>
        ))}
      </ol>
      <a
        href={linkHref}
        className="inline-block mt-3 text-xs font-semibold text-brand hover:text-text transition"
      >
        {linkLabel}
      </a>
    </div>
  );
}
