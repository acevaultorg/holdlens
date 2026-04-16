import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import FoundersNudge from "@/components/FoundersNudge";
import LiveQuote from "@/components/LiveQuote";
import { getTicker, topTickers } from "@/lib/tickers";
import { getConviction, convictionLabel, formatSignedScore } from "@/lib/conviction";

// Generate top-N × top-N comparisons. Limit to 15 × 15 = 225 pages to keep build sane.
const TOP_N = 15;

export async function generateStaticParams() {
  const top = topTickers(TOP_N).map((t) => t.symbol);
  const params: { pair: string }[] = [];
  // Generate BOTH orderings — users type either direction and Google may index
  // either; both must return 200. Previously only a<b was generated, which 404'd
  // on the reverse. Page count doubles to ~420 which is still tiny.
  for (const a of top) {
    for (const b of top) {
      if (a !== b) params.push({ pair: `${a.toLowerCase()}-vs-${b.toLowerCase()}` });
    }
  }
  return params;
}

function parsePair(pair: string): [string, string] | null {
  const m = pair.match(/^(.+)-vs-(.+)$/);
  if (!m) return null;
  return [m[1].toUpperCase(), m[2].toUpperCase()];
}

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return { title: "Comparison not found" };
  const [a, b] = parsed;
  const ta = getTicker(a);
  const tb = getTicker(b);
  if (!ta || !tb) return { title: "Comparison not found" };
  const convA = getConviction(a);
  const convB = getConviction(b);
  return {
    title: `${a} vs ${b} — Hedge fund ownership compared · HoldLens`,
    description: `Compare ${a} (${ta.name}) vs ${b} (${tb.name}) by superinvestor ownership, conviction signals, and shared managers. ${a}: ${formatSignedScore(convA.score)} signal. ${b}: ${formatSignedScore(convB.score)} signal.`,
    alternates: { canonical: `https://holdlens.com/compare/${a.toLowerCase()}-vs-${b.toLowerCase()}` },
    twitter: { card: "summary_large_image", title: `${a} vs ${b} · HoldLens` },
    openGraph: {
      title: `${a} vs ${b} — Smart money ownership diff`,
      description: `Overlap Venn, unique-only managers, and conviction comparison. ${a} vs ${b}.`,
    },
  };
}

export default async function ComparePairPage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) notFound();
  const [a, b] = parsed;

  const ta = getTicker(a);
  const tb = getTicker(b);
  if (!ta || !tb) notFound();

  const convA = getConviction(a);
  const convB = getConviction(b);
  const labelA = convictionLabel(convA.score);
  const labelB = convictionLabel(convB.score);

  // Three-set Venn split
  const bOwnerSlugs = new Set(tb.owners.map((o) => o.slug));
  const aOwnerSlugs = new Set(ta.owners.map((o) => o.slug));
  const onlyA = ta.owners.filter((o) => !bOwnerSlugs.has(o.slug)).sort((x, y) => y.pct - x.pct);
  const onlyB = tb.owners.filter((o) => !aOwnerSlugs.has(o.slug)).sort((x, y) => y.pct - x.pct);
  const sharedA = ta.owners.filter((o) => bOwnerSlugs.has(o.slug)).sort((x, y) => y.pct - x.pct);
  // Enrich shared with B positions for the convergence chart
  const shared = sharedA.map((o) => ({
    slug: o.slug,
    manager: o.manager,
    aPct: o.pct,
    bPct: tb.owners.find((x) => x.slug === o.slug)?.pct ?? 0,
    thesis: o.thesis,
  }));

  const total = onlyA.length + shared.length + onlyB.length;
  const pctOnlyA = total ? Math.round((onlyA.length / total) * 100) : 33;
  const pctBoth = total ? Math.round((shared.length / total) * 100) : 34;
  const pctOnlyB = 100 - pctOnlyA - pctBoth;

  // Convergence: for each shared manager, do they prefer A or B?
  const preferA = shared.filter((s) => s.aPct >= s.bPct).length;
  const preferB = shared.length - preferA;

  // v1.21 — BreadcrumbList + ComparePage-ish Article schema. schema.org has
  // no dedicated "comparison" type, but Article with "about" array naming
  // both entities is the pattern Google uses for competitor/head-to-head
  // pages. Publisher joins the site-wide @id. Image falls back to home OG
  // until a per-pair OG image is generated (follow-up).
  const pageUrl = `https://holdlens.com/compare/${a.toLowerCase()}-vs-${b.toLowerCase()}`;
  const LD = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
        { "@type": "ListItem", position: 2, name: "Compare", item: "https://holdlens.com/compare" },
        { "@type": "ListItem", position: 3, name: `${a} vs ${b}`, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${a} vs ${b} — hedge fund ownership compared`,
      description: `Compare ${a} (${ta.name}) vs ${b} (${tb.name}) by superinvestor ownership, conviction signals, and shared managers. ${a}: ${formatSignedScore(convA.score)} signal. ${b}: ${formatSignedScore(convB.score)} signal.`,
      author: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
      publisher: { "@id": "https://holdlens.com/#organization" },
      mainEntityOfPage: pageUrl,
      about: [
        { "@type": "Corporation", name: ta.name, tickerSymbol: a },
        { "@type": "Corporation", name: tb.name, tickerSymbol: b },
      ],
      inLanguage: "en-US",
      image: "https://holdlens.com/og/home.png",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }}
      />
      <a href="/compare" className="text-xs text-muted hover:text-text transition">← All comparisons</a>

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">
        Ownership Diff · {a} vs {b}
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-2">
        <span className="text-brand">{a}</span>
        <span className="text-dim"> vs </span>
        <span className="text-brand">{b}</span>
      </h1>
      <p className="text-muted text-lg mb-2">
        {ta.name} · {tb.name}
      </p>
      <p className="text-dim text-sm">
        Superinvestor ownership overlap, unique holders, and conviction comparison.
      </p>

      {/* Conviction strip */}
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <ConvictionCard symbol={a} name={ta.name} score={convA.score} label={labelA.label} color={labelA.color} sector={ta.sector} ownerCount={ta.ownerCount} />
        <ConvictionCard symbol={b} name={tb.name} score={convB.score} label={labelB.label} color={labelB.color} sector={tb.sector} ownerCount={tb.ownerCount} />
      </div>

      {/* Venn-style ownership fingerprint */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-2">Ownership fingerprint</h2>
        <p className="text-muted text-sm mb-6">
          Who holds {a} only, who holds {b} only, and who holds both.
        </p>

        {/* Visual diverging bar */}
        <div className="rounded-2xl border border-border bg-panel p-6 mb-6">
          <div className="flex text-xs font-semibold mb-3 gap-4 flex-wrap">
            <span className="text-blue-400">■ {a} only ({onlyA.length})</span>
            <span className="text-purple-400">■ Both ({shared.length})</span>
            <span className="text-orange-400">■ {b} only ({onlyB.length})</span>
          </div>
          <div className="flex h-8 rounded-lg overflow-hidden">
            {onlyA.length > 0 && (
              <div
                className="bg-blue-500/60 flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${pctOnlyA}%` }}
                title={`${onlyA.length} managers hold only ${a}`}
              >
                {onlyA.length > 0 && pctOnlyA > 8 ? `${a} only` : ""}
              </div>
            )}
            {shared.length > 0 && (
              <div
                className="bg-purple-500/70 flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${pctBoth}%` }}
                title={`${shared.length} managers hold both`}
              >
                {pctBoth > 8 ? `Both` : ""}
              </div>
            )}
            {onlyB.length > 0 && (
              <div
                className="bg-orange-500/60 flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${pctOnlyB}%` }}
                title={`${onlyB.length} managers hold only ${b}`}
              >
                {onlyB.length > 0 && pctOnlyB > 8 ? `${b} only` : ""}
              </div>
            )}
            {total === 0 && (
              <div className="bg-dim/20 flex items-center justify-center text-xs text-dim w-full">
                No tracked managers hold either ticker
              </div>
            )}
          </div>

          {shared.length > 0 && (
            <p className="text-xs text-dim mt-4">
              Of {shared.length} shared manager{shared.length !== 1 ? "s" : ""},{" "}
              <span className="text-blue-400 font-semibold">{preferA} weight {a} heavier</span>
              {" "}and{" "}
              <span className="text-orange-400 font-semibold">{preferB} weight {b} heavier</span>.
            </p>
          )}
        </div>

        {/* Three-column split: Only A | Both | Only B */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Only A */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <div className="text-[10px] uppercase tracking-widest font-bold text-blue-400 mb-3">
              Only {a} · {onlyA.length}
            </div>
            {onlyA.length === 0 ? (
              <p className="text-xs text-dim">All {a} holders also hold {b}.</p>
            ) : (
              <ul className="space-y-2">
                {onlyA.slice(0, 8).map((o) => (
                  <li key={o.slug} className="flex items-baseline justify-between gap-2">
                    <a href={`/investor/${o.slug}`} className="text-xs font-semibold text-text hover:text-brand transition truncate">
                      {o.manager}
                    </a>
                    <span className="text-xs tabular-nums text-blue-400 shrink-0">{o.pct.toFixed(1)}%</span>
                  </li>
                ))}
                {onlyA.length > 8 && <li className="text-xs text-dim">+{onlyA.length - 8} more</li>}
              </ul>
            )}
          </div>

          {/* Both */}
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
            <div className="text-[10px] uppercase tracking-widest font-bold text-purple-400 mb-3">
              Both · {shared.length}
            </div>
            {shared.length === 0 ? (
              <p className="text-xs text-dim">No manager holds both {a} and {b}.</p>
            ) : (
              <ul className="space-y-2">
                {shared.slice(0, 8).map((o) => (
                  <li key={o.slug} className="flex items-baseline justify-between gap-2">
                    <a href={`/investor/${o.slug}`} className="text-xs font-semibold text-text hover:text-brand transition truncate">
                      {o.manager}
                    </a>
                    <span className="text-xs tabular-nums text-purple-400 shrink-0">
                      {o.aPct.toFixed(1)} / {o.bPct.toFixed(1)}%
                    </span>
                  </li>
                ))}
                {shared.length > 8 && <li className="text-xs text-dim">+{shared.length - 8} more</li>}
              </ul>
            )}
          </div>

          {/* Only B */}
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
            <div className="text-[10px] uppercase tracking-widest font-bold text-orange-400 mb-3">
              Only {b} · {onlyB.length}
            </div>
            {onlyB.length === 0 ? (
              <p className="text-xs text-dim">All {b} holders also hold {a}.</p>
            ) : (
              <ul className="space-y-2">
                {onlyB.slice(0, 8).map((o) => (
                  <li key={o.slug} className="flex items-baseline justify-between gap-2">
                    <a href={`/investor/${o.slug}`} className="text-xs font-semibold text-text hover:text-brand transition truncate">
                      {o.manager}
                    </a>
                    <span className="text-xs tabular-nums text-orange-400 shrink-0">{o.pct.toFixed(1)}%</span>
                  </li>
                ))}
                {onlyB.length > 8 && <li className="text-xs text-dim">+{onlyB.length - 8} more</li>}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Convergence chart — shared managers, A% vs B% bars */}
      {shared.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-2">Shared manager conviction</h2>
          <p className="text-muted text-sm mb-6">
            For managers holding both: how hard do they bet on each? Longer bar = bigger position.
          </p>
          <div className="rounded-2xl border border-border bg-panel p-5 space-y-5">
            {(() => {
              const maxPct = Math.max(...shared.flatMap((s) => [s.aPct, s.bPct]), 1);
              return shared.map((o) => (
                <div key={o.slug}>
                  <a
                    href={`/investor/${o.slug}`}
                    className="text-sm font-semibold text-text hover:text-brand transition block mb-2"
                  >
                    {o.manager}
                  </a>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-blue-400 w-8 text-right shrink-0">{a}</span>
                      <div className="flex-1 h-2 bg-bg/60 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500/70"
                          style={{ width: `${(o.aPct / maxPct) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-blue-400 w-10 text-right shrink-0">
                        {o.aPct.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-orange-400 w-8 text-right shrink-0">{b}</span>
                      <div className="flex-1 h-2 bg-bg/60 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-orange-500/70"
                          style={{ width: `${(o.bPct / maxPct) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-orange-400 w-10 text-right shrink-0">
                        {o.bPct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  {o.thesis && (
                    <div className="text-xs text-dim mt-1.5 italic max-w-xl">&ldquo;{o.thesis}&rdquo;</div>
                  )}
                </div>
              ));
            })()}
          </div>
        </section>
      )}

      <AdSlot format="horizontal" />
      <FoundersNudge context={`You're comparing smart-money positions in ${a} vs ${b}.`} />

      {/* Cross-links */}
      <div className="mt-12 grid md:grid-cols-2 gap-4 text-sm">
        <a href={`/signal/${a}`} className="rounded-xl border border-border bg-panel p-4 hover:border-brand/40 transition block">
          <div className="text-xs text-dim mb-1">Full dossier →</div>
          <div className="font-bold text-brand">{a}</div>
          <div className="text-muted text-xs">{ta.name}</div>
        </a>
        <a href={`/signal/${b}`} className="rounded-xl border border-border bg-panel p-4 hover:border-brand/40 transition block">
          <div className="text-xs text-dim mb-1">Full dossier →</div>
          <div className="font-bold text-brand">{b}</div>
          <div className="text-muted text-xs">{tb.name}</div>
        </a>
      </div>

      <p className="text-xs text-dim mt-12">
        Sourced from SEC 13F filings ({new Date().getFullYear()}). Not investment advice.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}

function ConvictionCard({
  symbol,
  name,
  score,
  label,
  color,
  sector,
  ownerCount,
}: {
  symbol: string;
  name: string;
  score: number;
  label: string;
  color: string;
  sector?: string;
  ownerCount: number;
}) {
  const borderColor =
    color === "emerald"
      ? "border-emerald-500/30 bg-emerald-500/5"
      : color === "rose"
      ? "border-rose-500/30 bg-rose-500/5"
      : "border-border bg-panel";
  const scoreColor =
    color === "emerald" ? "text-emerald-400" : color === "rose" ? "text-rose-400" : "text-muted";

  return (
    <div className={`rounded-2xl border p-5 ${borderColor}`}>
      <a href={`/signal/${symbol}`} className="block mb-3">
        <div className="font-mono text-2xl font-bold text-brand">{symbol}</div>
        <div className="text-sm text-text mt-1 leading-tight">{name}</div>
        {sector && <div className="text-xs text-dim mt-0.5">{sector}</div>}
      </a>
      <div className="space-y-2 text-sm border-t border-border/50 pt-3">
        <div className="flex justify-between items-baseline">
          <span className="text-muted text-xs">ConvictionScore</span>
          <span className={`font-bold tabular-nums ${scoreColor}`}>{formatSignedScore(score)}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-muted text-xs">Signal</span>
          <span className={`text-xs font-semibold uppercase tracking-wider ${scoreColor}`}>{label}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-muted text-xs">Tracked owners</span>
          <span className="tabular-nums font-semibold">{ownerCount}</span>
        </div>
        <div className="mt-2">
          <LiveQuote symbol={symbol} size="sm" refreshMs={0} />
        </div>
      </div>
    </div>
  );
}
