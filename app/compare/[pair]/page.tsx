import InvestingBooks from "@/components/InvestingBooks";
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
  // v1.23 — per-pair OG image for top-10×top-10 combos. File existence is
  // checked at build time when Satori wrote it; if not present, fallback to
  // the site-wide home OG (still valid, just generic). We can't check
  // existsSync here without an IO hit; instead, we ship the URL to the pair
  // image confidently for top tickers and let CF Pages 404 gracefully for
  // low-traffic pairs (Google + X re-fetch the fallback on 404).
  const ogImage = `/og/compare/${a.toLowerCase()}-vs-${b.toLowerCase()}.png`;
  return {
    // Information-gain gate (2026-05-29): compare pages carry real ownership data
    // (median 11, range 5-19 tracked holders) plus a data-derived synthesis section,
    // so they are indexed. The >=4-holder floor noindexes only genuinely sparse
    // future pairs (kept live for users; pruner drops noindex from the sitemap).
    robots: {
      index: new Set([...ta.owners.map((o) => o.slug), ...tb.owners.map((o) => o.slug)]).size >= 4,
      follow: true,
    },
    title: `${a} vs ${b} — Hedge fund ownership compared · HoldLens`,
    description: `Compare ${a} (${ta.name}) vs ${b} (${tb.name}) by superinvestor ownership, conviction signals, and shared managers. ${a}: ${formatSignedScore(convA.score)} signal. ${b}: ${formatSignedScore(convB.score)} signal.`,
    alternates: { canonical: `https://holdlens.com/compare/${a.toLowerCase()}-vs-${b.toLowerCase()}` },
    twitter: {
      card: "summary_large_image",
      title: `${a} vs ${b} · HoldLens`,
      images: [ogImage],
    },
    openGraph: {
      title: `${a} vs ${b} — Smart money ownership diff`,
      description: `Overlap Venn, unique-only managers, and conviction comparison. ${a} vs ${b}.`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${a} vs ${b} · HoldLens ownership comparison` }],
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
  // FAQPage — AEO Part 14 minimums per rules/seo-geo-mastery.md.
  // PAA-style questions for ticker X-vs-Y ownership lookups. Factual answers
  // derived from ta.owners.length, tb.owners.length, shared, onlyA, onlyB.
  // No verdict labels — preserves I-43 compliance (data-display-only per
  // Pivot A). One FAQ block per page (v18 LEARNED faq_schema_spam × -10).
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: `Which has more hedge-fund owners: ${a} or ${b}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${a} (${ta.name}) is held by ${ta.owners.length} tracked superinvestors; ${b} (${tb.name}) is held by ${tb.owners.length}. ${ta.owners.length > tb.owners.length ? a : (tb.owners.length > ta.owners.length ? b : "Both")} has ${Math.abs(ta.owners.length - tb.owners.length)} more tracked holder${Math.abs(ta.owners.length - tb.owners.length) === 1 ? "" : "s"}${ta.owners.length === tb.owners.length ? " (tied)" : ""}. Full ranking by % of portfolio in the table below.`,
        },
      },
      {
        "@type": "Question",
        name: `What managers hold both ${a} and ${b}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${shared.length} tracked superinvestor${shared.length === 1 ? " holds" : "s hold"} both ${a} and ${b} based on the latest SEC 13F filings.${shared[0] ? ` Largest dual-holder: ${shared[0].manager} (${shared[0].aPct.toFixed(1)}% ${a} · ${shared[0].bPct.toFixed(1)}% ${b}).` : ""} Full overlap table below.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the overlap between ${a} and ${b} institutional ownership?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Across ${total} unique tracked holders: ${onlyA.length} hold only ${a} (${pctOnlyA}%), ${shared.length} hold both (${pctBoth}%), ${onlyB.length} hold only ${b} (${pctOnlyB}%). The full Venn split + per-manager position % is on this page.`,
        },
      },
      ...(shared.length > 0 ? [{
        "@type": "Question",
        name: `Among managers holding both ${a} and ${b}, which do they prefer?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Of ${shared.length} managers holding both, ${preferA} weight ${a} higher and ${preferB} weight ${b} higher in their portfolios. ${preferA === preferB ? "Even split." : (preferA > preferB ? `${a} is the preferred conviction position for the majority.` : `${b} is the preferred conviction position for the majority.`)} Per-manager positions are in the convergence table below.`,
        },
      }] : []),
    ],
  };
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
    faqLd,
  ];

  return <> {(
    <div className="max-w-4xl mx-auto px-8 sm:px-6 py-16">
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

      {/* Synthesis — data-derived interpretation (information-gain enrichment).
          Descriptive cohort-behavior language only; no verdict labels (Pivot A / I-43). */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">What the ownership overlap reveals</h2>
        <div className="rounded-2xl border border-border bg-panel p-6 text-muted leading-relaxed space-y-3 text-[15px]">
          <p>
            Across {total} tracked superinvestor{total === 1 ? "" : "s"},{" "}
            {shared.length === 0 ? (
              <>no manager holds both {a} and {b} — the two names draw on entirely separate pools of smart money.</>
            ) : (
              <>
                {shared.length} hold both {a} and {b} ({pctBoth}% of the combined holder base)
                {shared[0] ? <>, led by {shared[0].manager} ({shared[0].aPct.toFixed(1)}% {a} · {shared[0].bPct.toFixed(1)}% {b})</> : null}.
              </>
            )}{" "}
            {a} appears in {ta.owners.length} tracked {ta.owners.length === 1 ? "portfolio" : "portfolios"};{" "}
            {b} in {tb.owners.length}
            {ta.owners.length !== tb.owners.length ? <>, so {ta.owners.length > tb.owners.length ? a : b} is the more widely held of the two among tracked managers</> : <> — an even split in breadth of ownership</>}.
          </p>
          <p>
            {ta.sector === tb.sector ? (
              <>Both sit in {ta.sector}, so the overlap reflects manager preference <em>within</em> one sector rather than a cross-sector divide.</>
            ) : (
              <>{a} is a {ta.sector} holding while {b} sits in {tb.sector} — the overlap (or lack of it) partly tracks how each manager allocates across sectors.</>
            )}{" "}
            On the latest 13F cohort, {a}&rsquo;s ConvictionScore reads {formatSignedScore(convA.score)} ({labelA.label.toLowerCase()}) against {b}&rsquo;s {formatSignedScore(convB.score)} ({labelB.label.toLowerCase()});{" "}
            {convA.score === convB.score
              ? <>the two carry the same net reading across tracked managers</>
              : <>{convA.score > convB.score ? a : b} shows the stronger net-accumulation reading of the pair</>}.
          </p>
          {shared.length > 0 && (
            <p>
              Among the {shared.length} manager{shared.length === 1 ? "" : "s"} holding both, {preferA} size {a} larger and {preferB} size {b} larger —{" "}
              {preferA === preferB ? "an even conviction split" : (preferA > preferB ? <>a lean toward {a}</> : <>a lean toward {b}</>)}.
              {" "}A name held with higher weight by managers who own both is one the shared cohort is more concentrated in.
            </p>
          )}
          <p className="text-dim text-xs">
            Descriptive comparison of SEC Form 13F filings (45-day reporting lag; filings can be 1&ndash;3 months old). Not investment advice — see <a href="/methodology" className="underline hover:text-text">methodology</a>.
          </p>
        </div>
      </section>

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

      {/* AEO FAQ — Frequently asked questions (mirrors faqLd JSON-LD for
          Google rich-result + AI Overview eligibility on X-vs-Y ownership
          queries per Part 14.4). Factual answers only — no verdict labels
          (preserves Pivot A I-43 compliance). Visible <details> accordion. */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Frequently asked questions</h2>
        <div className="space-y-3">
          {(faqLd.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>).map((q, i) => (
            <details key={i} className="rounded-xl border border-border bg-panel p-4 open:border-brand/40">
              <summary className="cursor-pointer font-semibold text-text">{q.name}</summary>
              <p className="hl-faq-answer mt-3 text-sm text-muted leading-relaxed">
                {q.acceptedAnswer.text}
              </p>
            </details>
          ))}
        </div>
      </section>

      <p className="text-xs text-dim mt-12">
        Sourced from SEC 13F filings ({new Date().getFullYear()}). Not investment advice.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  )} <div className="mx-auto max-w-5xl px-6"><InvestingBooks heading="Reading for your research" sub="Optional background reading on interpreting company disclosures and investing methods. These books do not validate a signal or predict returns." showAudible={false} limit={2} /></div> </>;
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
