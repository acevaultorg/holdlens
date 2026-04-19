import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import FundLogo from "@/components/FundLogo";
import { MANAGERS, type Manager } from "@/lib/managers";
import { MANAGER_QUALITY } from "@/lib/signals";

export const metadata: Metadata = {
  title: "Compare portfolio managers — side-by-side holdings",
  description: "Side-by-side comparisons of the best portfolio managers in the world. Shared convictions, overlap matrix heatmap, live portfolio values, recent moves.",
  openGraph: { title: "Compare portfolio managers — HoldLens" , images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }]},
};

// Count shared tickers between two managers' topHoldings.
function sharedTickers(a: Manager, b: Manager): string[] {
  const setB = new Set(b.topHoldings.map((h) => h.ticker));
  return a.topHoldings.filter((h) => setB.has(h.ticker)).map((h) => h.ticker);
}

export default function CompareManagersIndex() {
  // Same top 15 as /compare/managers/[pair] generateStaticParams
  const topSlugs = MANAGERS.map((m) => m.slug)
    .filter((slug) => (MANAGER_QUALITY[slug] ?? 6) >= 8)
    .slice(0, 15);

  const pairs: { a: string; b: string; slug: string; aName: string; bName: string; aFund: string; bFund: string }[] = [];
  for (let i = 0; i < topSlugs.length; i++) {
    for (let j = i + 1; j < topSlugs.length; j++) {
      const a = MANAGERS.find((m) => m.slug === topSlugs[i])!;
      const b = MANAGERS.find((m) => m.slug === topSlugs[j])!;
      pairs.push({
        a: topSlugs[i],
        b: topSlugs[j],
        slug: `${topSlugs[i]}-vs-${topSlugs[j]}`,
        aName: a.name,
        bName: b.name,
        aFund: a.fund,
        bFund: b.fund,
      });
    }
  }

  // Group by first manager
  const groups: Record<string, typeof pairs> = {};
  for (const p of pairs) {
    if (!groups[p.a]) groups[p.a] = [];
    groups[p.a].push(p);
  }
  const orderedGroups = topSlugs.filter((s) => groups[s]?.length);

  // ---------- OVERLAP MATRIX ----------
  // Square matrix of shared ticker counts for every pair of the top N managers.
  // Data-faithful: derived purely from topHoldings — no external API.
  const matrixMgrs = topSlugs
    .map((s) => MANAGERS.find((m) => m.slug === s))
    .filter((m): m is Manager => !!m);

  const matrix: { shared: string[]; count: number }[][] = matrixMgrs.map((a) =>
    matrixMgrs.map((b) => {
      if (a.slug === b.slug) return { shared: [], count: 0 };
      const s = sharedTickers(a, b);
      return { shared: s, count: s.length };
    })
  );

  const maxOverlap = Math.max(
    1,
    ...matrix.flatMap((row) => row.map((c) => c.count))
  );

  // "Most similar" top pairs — a flat ranking derived from the matrix
  type Pairing = { a: Manager; b: Manager; shared: string[] };
  const pairingList: Pairing[] = [];
  for (let i = 0; i < matrixMgrs.length; i++) {
    for (let j = i + 1; j < matrixMgrs.length; j++) {
      const s = matrix[i][j].shared;
      if (s.length === 0) continue;
      pairingList.push({ a: matrixMgrs[i], b: matrixMgrs[j], shared: s });
    }
  }
  const mostSimilar = pairingList.sort((x, y) => y.shared.length - x.shared.length).slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Head-to-head
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Compare portfolio managers.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-10">
        {pairs.length} head-to-head comparisons between the top {topSlugs.length} Tier-1 managers we
        track. Overlap matrix heatmap below, plus shared holdings, live portfolio values, and
        quarter-over-quarter moves on every pair page.
      </p>

      {/* Overlap matrix heatmap — pure derivation from topHoldings. Data-faithful. */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-2xl font-bold">Overlap matrix</h2>
          <div className="text-xs text-dim">Shared top-10 positions · darker = more overlap</div>
        </div>
        <p className="text-muted text-sm mb-5 max-w-2xl">
          Every cell counts how many tickers two managers share in their top-10 holdings. Click any
          cell to see the full side-by-side comparison. Darker = more consensus. Dataroma has nothing
          like this — it's a raw holding count per manager and you're left to eyeball overlaps yourself.
        </p>
        <div className="rounded-2xl border border-border bg-panel overflow-x-auto">
          <table className="text-[10px] border-collapse mx-auto">
            <thead>
              <tr>
                <th className="p-1"></th>
                {matrixMgrs.map((m) => (
                  <th
                    key={`col-${m.slug}`}
                    className="p-1 text-dim font-normal align-bottom"
                    style={{ height: "7rem", minWidth: "1.6rem" }}
                  >
                    <div
                      className="inline-block whitespace-nowrap text-right"
                      style={{
                        transform: "rotate(-60deg)",
                        transformOrigin: "bottom left",
                        width: "1.6rem",
                      }}
                    >
                      {m.name.split(" ").slice(-1)[0]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixMgrs.map((rowM, i) => (
                <tr key={`row-${rowM.slug}`}>
                  <th className="pr-2 py-1 text-right text-muted font-normal whitespace-nowrap">
                    {rowM.name.split(" ").slice(-1)[0]}
                  </th>
                  {matrixMgrs.map((colM, j) => {
                    const cell = matrix[i][j];
                    const isDiag = i === j;
                    const intensity = cell.count / maxOverlap;
                    // Opacity stepped for accessibility — 5 tiers
                    const tier =
                      cell.count === 0
                        ? 0
                        : cell.count === 1
                        ? 1
                        : cell.count === 2
                        ? 2
                        : cell.count <= 4
                        ? 3
                        : 4;
                    const bg = isDiag
                      ? "rgba(255,255,255,0.04)"
                      : tier === 0
                      ? "rgba(52,211,153,0.02)"
                      : tier === 1
                      ? "rgba(52,211,153,0.18)"
                      : tier === 2
                      ? "rgba(52,211,153,0.36)"
                      : tier === 3
                      ? "rgba(52,211,153,0.58)"
                      : "rgba(52,211,153,0.82)";
                    const textClass = tier >= 3 ? "text-black" : "text-text";
                    const title = isDiag
                      ? rowM.name
                      : cell.count === 0
                      ? `${rowM.name} ↔ ${colM.name}: no top-10 overlap`
                      : `${rowM.name} ↔ ${colM.name}: ${cell.count} shared (${cell.shared.join(", ")})`;
                    // Build comparison URL only for upper-triangle cells so we always
                    // reach the canonical pair page (a-vs-b in the topSlugs order).
                    const [aSlug, bSlug] =
                      i < j ? [rowM.slug, colM.slug] : [colM.slug, rowM.slug];
                    const href =
                      isDiag ? undefined : `/compare/managers/${aSlug}-vs-${bSlug}`;
                    const style: React.CSSProperties = {
                      backgroundColor: bg,
                      width: "1.6rem",
                      height: "1.6rem",
                    };
                    const content = (
                      <span className={`font-semibold tabular-nums ${textClass}`}>
                        {isDiag ? "–" : cell.count || ""}
                      </span>
                    );
                    void intensity; // kept for readability; tier is the derived value
                    return href ? (
                      <td
                        key={`cell-${i}-${j}`}
                        className="p-0 text-center border border-border/40 hover:outline hover:outline-2 hover:outline-brand"
                        style={style}
                      >
                        <a href={href} title={title} className="block w-full h-full leading-[1.6rem]">
                          {content}
                        </a>
                      </td>
                    ) : (
                      <td
                        key={`cell-${i}-${j}`}
                        className="p-0 text-center border border-border/40"
                        style={style}
                        title={title}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-3 mt-4 text-[11px] text-dim flex-wrap">
          <span>Overlap:</span>
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: "rgba(52,211,153,0.18)" }}
            />
            1
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: "rgba(52,211,153,0.36)" }}
            />
            2
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: "rgba(52,211,153,0.58)" }}
            />
            3–4
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: "rgba(52,211,153,0.82)" }}
            />
            5+
          </span>
        </div>
      </section>

      {/* Most-similar top pairs — the overlap matrix distilled to a ranking */}
      {mostSimilar.length > 0 && (
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
            <h2 className="text-2xl font-bold">Most similar pairs</h2>
            <div className="text-xs text-dim">Ranked by shared ticker count</div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {mostSimilar.map((p, i) => (
              <a
                key={`sim-${p.a.slug}-${p.b.slug}`}
                href={`/compare/managers/${p.a.slug}-vs-${p.b.slug}`}
                className="rounded-xl border border-border bg-panel p-4 hover:border-brand/40 transition group"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-semibold text-sm text-text group-hover:text-brand transition truncate">
                    {p.a.name} <span className="text-dim">×</span> {p.b.name}
                  </div>
                  <div className="text-[10px] text-dim tabular-nums">#{i + 1}</div>
                </div>
                <div className="text-[11px] text-muted truncate mt-1">
                  {p.a.fund} · {p.b.fund}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-emerald-400 tabular-nums">
                    {p.shared.length} shared
                  </span>
                  <div className="flex gap-1 flex-wrap">
                    {p.shared.slice(0, 6).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bg text-brand border border-border"
                      >
                        {t}
                      </span>
                    ))}
                    {p.shared.length > 6 && (
                      <span className="text-[10px] text-dim">+{p.shared.length - 6}</span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-8">
        {orderedGroups.map((slug) => {
          const mgr = MANAGERS.find((m) => m.slug === slug)!;
          return (
            <section key={slug}>
              <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                <h2 className="text-lg font-bold text-text inline-flex items-center gap-2">
                  <FundLogo slug={mgr.slug} name={mgr.name} size={22} />
                  {mgr.name}
                </h2>
                <div className="text-xs text-dim">{groups[slug].length} comparisons</div>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                {groups[slug].map((p) => (
                  <a
                    key={p.slug}
                    href={`/compare/managers/${p.slug}`}
                    className="rounded-lg border border-border bg-panel p-3 hover:border-brand/40 transition group"
                  >
                    <div className="text-xs text-dim mb-1">vs</div>
                    <div className="font-semibold text-sm text-text group-hover:text-brand transition truncate">
                      {p.bName}
                    </div>
                    <div className="text-[11px] text-muted truncate">{p.bFund}</div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <AdSlot format="horizontal" />

      <p className="text-xs text-dim mt-16">
        All comparisons include live portfolio values computed from current market prices. Not investment advice.
      </p>
    </div>
  );
}
