import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { MANAGERS } from "@/lib/managers";
import { MANAGER_QUALITY } from "@/lib/signals";

export const metadata: Metadata = {
  title: "Compare portfolio managers — side-by-side holdings",
  description: "Side-by-side comparisons of the best portfolio managers in the world. Shared convictions, live portfolio values, recent moves.",
  openGraph: { title: "Compare portfolio managers — HoldLens" },
};

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

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Head-to-head
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Compare portfolio managers.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-10">
        {pairs.length} head-to-head comparisons between the top {topSlugs.length} Tier-1 managers we
        track. Live portfolio values, shared holdings, and quarter-over-quarter moves side-by-side.
      </p>

      <div className="space-y-8">
        {orderedGroups.map((slug) => {
          const mgr = MANAGERS.find((m) => m.slug === slug)!;
          return (
            <section key={slug}>
              <div className="flex items-baseline justify-between mb-3 border-b border-border pb-2">
                <h2 className="text-lg font-bold text-text">{mgr.name}</h2>
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
