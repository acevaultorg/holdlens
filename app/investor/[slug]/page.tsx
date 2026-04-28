import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EmailCapture from "@/components/EmailCapture";
import ShareStrip from "@/components/ShareStrip";
import LiveQuote from "@/components/LiveQuote";
import PortfolioValue from "@/components/PortfolioValue";
import InvestorMoves from "@/components/InvestorMoves";
import ManagerROICard from "@/components/ManagerROICard";
import SectorBreakdown from "@/components/SectorBreakdown";
import AdSlot from "@/components/AdSlot";
import FoundersNudge from "@/components/FoundersNudge";
import TickerLink from "@/components/TickerLink";
import FundLogo from "@/components/FundLogo";
import TickerLogo from "@/components/TickerLogo";
import InvestorConcentration from "@/components/InvestorConcentration";
import DividendTaxCalc from "@/components/DividendTaxCalc";
import { DailyMoveForInvestor, getDailySnapshotTimestamp } from "@/components/DailyMove";
import { MANAGERS, getManager, type Manager } from "@/lib/managers";
import { LATEST_FILINGS, nextFilingDeadline, daysSince } from "@/lib/filings";
import { styleOf, STYLES_BY_SLUG, managersByStyle } from "@/lib/manager-styles";
import { topReplicatingETFs } from "@/lib/etf-overlap";

// Build-time timestamp — signals to LLM crawlers + Googlebot when this
// static profile was last regenerated. Per v19.4 freshness_per_page archetype.
// Prefer the daily snapshot timestamp over the build timestamp when available —
// that's the honest dateModified for LLM crawlers: a real price refresh occurred.
const BUILD_ISO = getDailySnapshotTimestamp() ?? new Date().toISOString();
import { MANAGER_QUALITY, getManagerQuality } from "@/lib/signals";
import { QUARTERS, QUARTER_LABELS, type Quarter } from "@/lib/moves";
import { getEdgarHoldings } from "@/lib/edgar-data";

type ActiveHolding = { ticker: string; name: string; pct: number; sharesMn: number; thesis: string };

// v1.36 — prefer EDGAR's latest filed positions over hand-curated topHoldings.
// The hand-curated list rots between filings (Burry's 2023-era BABA/JD/BIDU
// positions shouldn't linger after his 2025-Q3 PLTR 66% pivot). EDGAR has the
// current position weights; we overlay the curated `thesis` string where the
// ticker still appears.
function getActiveHoldings(m: Manager): ActiveHolding[] {
  const edgar = getEdgarHoldings(m.slug);
  if (edgar && edgar.holdings.length > 0) {
    const thesisByTicker = new Map(m.topHoldings.map((h) => [h.ticker, h.thesis]));
    return edgar.holdings
      .slice(0, 10)
      .map((h) => ({
        ticker: h.ticker,
        name: h.name,
        pct: h.pct,
        sharesMn: h.sharesMn,
        thesis: thesisByTicker.get(h.ticker) ?? "",
      }));
  }
  // No EDGAR data → fall back to curated list.
  return m.topHoldings.map((h) => ({
    ticker: h.ticker,
    name: h.name,
    pct: h.pct,
    sharesMn: h.sharesMn,
    thesis: h.thesis,
  }));
}

// Find managers whose top 10 holdings overlap with this manager's top 10.
// Scored by count of shared tickers. Returns the top 3 related.
function relatedManagers(m: Manager): { manager: Manager; shared: number; commonTickers: string[] }[] {
  const myTickers = new Set(m.topHoldings.map((h) => h.ticker));
  return MANAGERS
    .filter((other) => other.slug !== m.slug)
    .map((other) => {
      const shared = other.topHoldings.filter((h) => myTickers.has(h.ticker));
      return { manager: other, shared: shared.length, commonTickers: shared.map((h) => h.ticker) };
    })
    .filter((r) => r.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3);
}

export async function generateStaticParams() {
  // warren-buffett has its own dedicated static page; exclude here to avoid route conflict.
  return MANAGERS.filter((m) => m.slug !== "warren-buffett").map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getManager(slug);
  if (!m) return { title: "Investor not found" };
  const ogImage = `/og/investor/${m.slug}.png`;

  // v1.40 SEO CTR rewrite — lead with the manager's #1 current position
  // (%-of-book, EDGAR-sourced so honest). Finance searchers scan SERPs for
  // specific names: "warren buffett aapl", "burry pltr", "ackman nike".
  // Title that surfaces the #1 bet captures both head-queries + branded.
  const edgar = getEdgarHoldings(m.slug);
  const top = edgar && edgar.holdings.length > 0 ? edgar.holdings[0] : null;

  const title = top
    ? `${m.name} portfolio — ${top.ticker} ${top.pct.toFixed(0)}% top bet (${edgar!.quarter} 13F)`
    : `${m.name} portfolio — ${m.fund} holdings`;

  const desc = top
    ? `${m.name}'s ${m.fund} portfolio — ${top.ticker} is the #1 position at ${top.pct.toFixed(1)}% as of ${edgar!.quarter}. All top 10 holdings, 8-quarter move history, conviction breakdown, sector split. SEC-sourced 13F data.`
    : `Track ${m.name}'s ${m.fund} portfolio. Top holdings, conviction analysis, and quarterly moves.`;

  return {
    title,
    description: desc,
    openGraph: {
      title: `${m.name} · ${m.fund}`,
      description: desc,
      url: `https://holdlens.com/investor/${m.slug}`,
      siteName: "HoldLens",
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${m.name} portfolio card` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${m.name} · ${m.fund}`,
      description: desc,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://holdlens.com/investor/${m.slug}`,
      types: {
        "application/rss+xml": `https://holdlens.com/investor/${m.slug}/feed.xml`,
        // JSON API discoverability — LLM crawlers + automated agents prefer
        // structured data over HTML scraping. The /api/v1/managers/[slug].json
        // endpoint returns full holdings + ConvictionScore + ROI + moves.
        "application/json": `https://holdlens.com/api/v1/managers/${m.slug}.json`,
      },
    },
  };
}

export default async function InvestorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getManager(slug);
  if (!m) notFound();

  const activeHoldings = getActiveHoldings(m);
  const total = activeHoldings.reduce((s, h) => s + h.pct, 0);
  const filing = LATEST_FILINGS[m.slug];

  // Quote-ready TL;DR — the single block LLM crawlers extract verbatim.
  // Aleyda Solis 10-characteristic checklist: hits C2 (Useful), C4
  // (Extractable), C7 (Credible — sourced from SEC), C8 (Differentiated
  // — has POV via style + closest-ETF synthesis), C9 (Fresh — quarter
  // tag inline). Single paragraph above-fold + plain-prose so any LLM
  // reading the HTML can cite the exact sentence as the answer to
  // "what is X's portfolio?" / "what does X invest in?" queries.
  const tldrTopETF = topReplicatingETFs(m, 1)[0];
  const tldrStyle = styleOf(m.slug);
  const tldrTopHolding = activeHoldings[0];
  const tldrQuarter = filing?.quarter;

  // v1.41 — enhanced Person + Organization schema for knowledge-graph +
  // LLM-citation leverage. Prior shape had the minimum (name/jobTitle/
  // worksFor/description). New shape adds:
  //   - mainEntityOfPage: canonical URL so Google knows which page to index
  //   - image: fund-logo PNG so Knowledge Graph has a visual
  //   - sameAs: EDGAR CIK deeplink so entities reconcile to SEC's authoritative
  //     source (huge E-E-A-T lift for YMYL finance domain)
  //   - knowsAbout: philosophy tag so LLMs can route "value investing" /
  //     "macro" / "activist" queries to the right investor
  //   - worksFor now a full Organization entity with URL
  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `https://holdlens.com/investor/${m.slug}#person`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://holdlens.com/investor/${m.slug}`,
    },
    name: m.name,
    jobTitle: m.role,
    description: m.bio,
    image: `https://holdlens.com/og/investor/${m.slug}.png`,
    knowsAbout: m.philosophy,
    worksFor: {
      "@type": "Organization",
      "@id": `https://holdlens.com/investor/${m.slug}#fund`,
      name: m.fund,
      url: `https://holdlens.com/investor/${m.slug}`,
    },
    ...(filing?.edgarUrl
      ? {
          // sameAs reconciles this Person entity to SEC EDGAR's authoritative
          // 13F-filer record. Google's Knowledge Graph uses sameAs heavily;
          // LLMs use it to deduplicate "Michael Burry" vs "the hedge fund
          // manager Michael Burry" vs "Scion Asset Management's portfolio
          // manager".
          sameAs: [filing.edgarUrl],
        }
      : {}),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Investors", item: "https://holdlens.com/investor" },
      { "@type": "ListItem", position: 3, name: m.name, item: `https://holdlens.com/investor/${m.slug}` },
    ],
  };
  // ProfilePage schema carries freshness signals (datePublished = latest
  // 13F filing date; dateModified = build timestamp) while the Person
  // entity above keeps its clean Knowledge-Graph semantics. LLM crawlers
  // use dateModified to decide which version to cite.
  const profilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `https://holdlens.com/investor/${m.slug}`,
    url: `https://holdlens.com/investor/${m.slug}`,
    name: `${m.name} — holdings, 13F filings, and smart-money signal`,
    description: `${m.name}'s latest 13F positions, moves, and ConvictionScore from HoldLens.`,
    mainEntity: { "@id": `https://holdlens.com/investor/${m.slug}#person` },
    ...(filing?.latestDate ? { datePublished: `${filing.latestDate}T00:00:00Z` } : {}),
    dateModified: BUILD_ISO,
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <a href="/investor" className="text-xs text-muted hover:text-text">← All investors</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Investor profile</div>
      <div className="flex items-center gap-4 mb-2">
        <FundLogo slug={m.slug} name={m.name} size={56} />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">{m.name}</h1>
      </div>
      <p className="text-muted text-lg">{m.fund} · {m.role} · Net worth: {m.netWorth}</p>
      <p className="mt-4 text-text leading-relaxed max-w-2xl">{m.bio}</p>
      <div className="mt-3 text-sm text-muted italic">"{m.philosophy}"</div>

      {/* TL;DR — above-fold quote-ready summary. LLMs (GPTBot, ClaudeBot,
          PerplexityBot, Googlebot-Extended) extract this paragraph as
          the canonical answer to "what is X's portfolio?". Every fact
          below is SEC 13F-sourced (no fabrication; AP-3 compliant). */}
      <aside
        aria-label="Portfolio summary"
        className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.04] px-5 py-4"
      >
        <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-2">
          TL;DR
        </div>
        <p className="text-sm text-text leading-relaxed">
          <strong>{m.name}</strong> runs <strong>{m.fund}</strong> as {m.role.toLowerCase()}.
          {tldrTopHolding && (
            <>
              {" "}
              The largest disclosed position
              {tldrQuarter ? ` as of ${tldrQuarter}` : ""} is{" "}
              <strong className="font-mono">{tldrTopHolding.ticker}</strong> ({tldrTopHolding.name})
              at <strong>{tldrTopHolding.pct.toFixed(1)}%</strong> of the {activeHoldings.length}
              -position book. Top-10 holdings = <strong>{total.toFixed(0)}%</strong> concentration.
            </>
          )}
          {tldrStyle && (
            <>
              {" "}
              Investing style:{" "}
              <a href={`/managers-by-style/${tldrStyle}/`} className="text-brand hover:underline">
                {tldrStyle.replace("-", " ")}
              </a>
              .
            </>
          )}
          {tldrTopETF && (
            <>
              {" "}
              Closest replicating ETF:{" "}
              <a href={`/etf/${tldrTopETF.etf.ticker}/`} className="text-brand hover:underline font-mono">
                {tldrTopETF.etf.ticker}
              </a>{" "}
              (overlap score {tldrTopETF.score.toFixed(1)} across{" "}
              {tldrTopETF.sharedTickers.length} shared top-10 name
              {tldrTopETF.sharedTickers.length === 1 ? "" : "s"}).
            </>
          )}
        </p>
      </aside>

      {/* Share strip — placed above-fold right after TL;DR so visitors see
          it at peak engagement. Pre-composed share text uses the actual
          headline fact (#1 holding + %) so shared links arrive with
          context, not generic "check this out". */}
      <ShareStrip
        title={
          tldrTopHolding
            ? `${m.name} runs ${m.fund} — top position: ${tldrTopHolding.ticker} at ${tldrTopHolding.pct.toFixed(1)}% of book`
            : `${m.name} portfolio — ${m.fund} 13F holdings on HoldLens`
        }
        url={`https://holdlens.com/investor/${m.slug}/`}
      />

      <DailyMoveForInvestor slug={m.slug} />

      {(() => {
        const nextDue = nextFilingDeadline();
        if (!filing) return null;
        const d = daysSince(filing.latestDate);
        return (
          <div className="mt-6 flex items-center gap-3 flex-wrap text-xs">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-panel text-muted">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand" />
              Latest 13F: <span className="text-text font-semibold">{filing.quarter}</span>
              <span className="text-dim">({d}d ago)</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-panel text-muted">
              Next due: <span className="text-text font-semibold">{nextDue.quarter}</span>
              <span className="text-dim">by {nextDue.date}</span>
            </span>
            {filing.edgarUrl && (
              <a
                href={filing.edgarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border bg-panel text-muted hover:text-text hover:border-brand/40 transition"
              >
                View on SEC EDGAR →
              </a>
            )}
            <a
              href={`/investor/${m.slug}/feed.xml`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border bg-panel text-muted hover:text-emerald-400 hover:border-emerald-400/40 transition"
              title={`Subscribe to ${m.name} 13F moves via RSS`}
            >
              <span className="text-emerald-400">●</span> RSS — move alerts
            </a>
          </div>
        );
      })()}

      <div className="mt-12 grid md:grid-cols-3 gap-4">
        <Stat label="Tracked positions" value={activeHoldings.length.toString()} />
        <Stat label="Top concentration" value={`${total.toFixed(0)}%`} />
        <Stat label="Longest holding" value={m.longestHolding} />
      </div>

      {/* Concentration profile — v0.85 — Top-1/5/10 percentages,
          diversification verdict, and a stacked bar showing how the
          portfolio distributes across the biggest bets. Pure server. */}
      <InvestorConcentration
        holdings={activeHoldings.map((h) => ({ ticker: h.ticker, pct: h.pct, name: h.name }))}
        managerFirstName={m.name.split(" ")[0]}
      />

      {/* Realized 10-year track record */}
      <section className="mt-8">
        <ManagerROICard slug={m.slug} />
      </section>

      <section className="mt-6">
        <PortfolioValue holdings={activeHoldings.map((h) => ({ ticker: h.ticker, sharesMn: h.sharesMn, pct: h.pct }))} label={`${m.name.split(" ")[0]}'s portfolio value`} />
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-2xl font-bold">
            {m.name}&apos;s recent 13F moves: buys, adds, trims, and exits
          </h2>
          <div className="text-xs text-dim">
            Manager quality score:{" "}
            {/* v4.2 — derived-ROI quality. Audit showed hand-coded
                MANAGER_QUALITY correlated only 0.232 with actual returns.
                Shown as X.X/10 rounded to one decimal since derived is
                continuous 0.0-10.0 (unlike hand integers 6-10). */}
            <span className="text-brand font-semibold">{getManagerQuality(m.slug).toFixed(1)}/10</span>
          </div>
        </div>
        <p className="text-muted text-sm mb-6 max-w-2xl">
          Every tracked 13F move — buys, adds, trims, and exits — over the last two quarters.
        </p>
        <InvestorMoves slug={m.slug} />
      </section>

      <SectorBreakdown
        holdings={activeHoldings.map((h) => ({ ticker: h.ticker, pct: h.pct }))}
        label={`${m.name.split(" ")[0]}'s sector breakdown`}
      />

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">
          {m.name}&apos;s top {activeHoldings.length} disclosed holdings
          {filing?.quarter ? ` (${filing.quarter})` : ""}
        </h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-xs uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-5 py-4">Ticker</th>
                <th className="text-left px-5 py-4">Company</th>
                <th className="text-right px-5 py-4 hidden md:table-cell">Price · Today</th>
                <th className="text-right px-5 py-4">% Portfolio</th>
                <th className="text-right px-5 py-4 hidden md:table-cell">Shares (M)</th>
              </tr>
            </thead>
            <tbody>
              {activeHoldings.map((h) => (
                <tr key={h.ticker} className="border-b border-border last:border-0 align-top">
                  <td className="px-5 py-4 font-mono font-semibold">
                    <TickerLink symbol={h.ticker} className="inline-flex items-center gap-2 text-brand hover:underline">
                      <TickerLogo symbol={h.ticker} size={22} />
                      {h.ticker}
                    </TickerLink>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-text">{h.name}</div>
                    <div className="text-dim text-xs mt-1 max-w-md">{h.thesis}</div>
                  </td>
                  <td className="px-5 py-4 text-right hidden md:table-cell">
                    <LiveQuote symbol={h.ticker} size="sm" refreshMs={0} />
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums">{h.pct.toFixed(1)}%</td>
                  <td className="px-5 py-4 text-right tabular-nums hidden md:table-cell text-muted">
                    {h.sharesMn.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <FoundersNudge context={`You're reading ${m.name}'s full 13F portfolio and conviction signals.`} />
      <AdSlot format="horizontal" />

      {/* Dividend tax calculator — retention hook on investor pages.
          After reading the full portfolio, investors commonly ask
          "if I replicated the top positions, what tax would I actually
          pay on the dividends?" This widget lets them model that
          instantly. payer defaults to US (most HoldLens-tracked
          positions). Never fabricates — needs_research cells fall
          back to statutory rate with a clear disclaimer (AP-3). */}
      <section className="mt-12">
        <DividendTaxCalc mode="inline" investorContext={m.slug} />
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-panel p-8">
        <h2 className="text-2xl font-bold mb-3">Want {m.name.split(" ")[0]} move-alerts?</h2>
        <p className="text-muted mb-6">
          One email per 13F filing. Summarizes every new position, exit, and trim.
        </p>
        <EmailCapture />
      </section>

      {(() => {
        const related = relatedManagers(m);
        if (related.length === 0) return null;
        return (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-4">
              Investors with portfolios similar to {m.name}
            </h2>
            <p className="text-muted text-sm mb-6">
              Tracked managers whose top positions overlap with {m.name.split(" ")[0]}'s portfolio.
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              {related.map((r) => (
                <a key={r.manager.slug} href={`/investor/${r.manager.slug}`}
                   className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition group">
                  <div className="font-semibold group-hover:text-brand transition">{r.manager.name}</div>
                  <div className="text-xs text-muted mt-1">{r.manager.fund}</div>
                  <div className="text-xs text-dim mt-2">
                    {r.shared} shared position{r.shared > 1 ? "s" : ""}: {r.commonTickers.join(", ")}
                  </div>
                </a>
              ))}
            </div>
            {/* Ship #8 v1 cross-link — full Jaccard-ranked similarity
                for all 29 other tracked investors. Top-of-funnel for
                retention via discovery loop: /investor/[X] → /similar-to/[X]
                → /investor/[Y] → repeat. */}
            <div className="mt-4">
              <a
                href={`/similar-to/${m.slug}`}
                className="inline-flex items-center gap-1 text-sm text-brand hover:underline font-semibold"
              >
                See all 29 investors ranked by portfolio similarity →
              </a>
            </div>
          </section>
        );
      })()}

      {m.slug === "warren-buffett" && (
        <section className="mt-16">
          <h3 className="text-lg font-semibold mb-3">Try the Buffett backtest</h3>
          <p className="text-muted mb-4">How much would you have made if you'd copied Buffett 15 years ago?</p>
          <a
            href="/simulate/buffett"
            className="inline-block bg-brand text-black font-semibold rounded-xl px-6 py-3 hover:opacity-90 transition"
          >
            Run the backtest →
          </a>
        </section>
      )}

      {/* Discovery cross-links — ETF replication + style cluster.
          One template edit produces 30 internal-link improvements.
          Each card is its own SEO target page; this is the hub spoke. */}
      {(() => {
        const style = styleOf(m.slug);
        const styleMeta = style ? STYLES_BY_SLUG[style] : undefined;
        const peerCount = style ? managersByStyle(style).length - 1 : 0;
        const topETF = topReplicatingETFs(m, 1)[0];
        return (
          <section className="mt-16 grid md:grid-cols-2 gap-3">
            <a
              href={`/etf-by-superinvestor/${m.slug}/`}
              className="rounded-xl border border-border bg-panel p-5 hover:border-brand transition group"
            >
              <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-2">
                ETF replication
              </div>
              <div className="font-semibold text-text group-hover:text-brand transition">
                Which ETF replicates {m.name.split(" ")[0]}&apos;s portfolio?
              </div>
              <div className="text-xs text-muted mt-2 leading-relaxed">
                {topETF ? (
                  <>
                    Closest match:{" "}
                    <span className="font-mono text-text">{topETF.etf.ticker}</span> · overlap score{" "}
                    <span className="font-mono text-text">{topETF.score.toFixed(1)}</span> across{" "}
                    {topETF.sharedTickers.length} shared top-10 names. Full ranked list of 5 ETFs →
                  </>
                ) : (
                  <>
                    None of the 12 tracked ETFs has top-10 overlap with {m.name.split(" ")[0]}
                    &apos;s holdings — concentrated picks outside the most-AUM index ETFs. See full
                    analysis →
                  </>
                )}
              </div>
            </a>
            {styleMeta && (
              <a
                href={`/managers-by-style/${style}/`}
                className="rounded-xl border border-border bg-panel p-5 hover:border-brand transition group"
              >
                <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-2">
                  Investing style
                </div>
                <div className="font-semibold text-text group-hover:text-brand transition">
                  {m.name.split(" ")[0]} is a {styleMeta.name.toLowerCase()} investor
                </div>
                <div className="text-xs text-muted mt-2 leading-relaxed">
                  See {peerCount} other {styleMeta.name.toLowerCase()} manager
                  {peerCount === 1 ? "" : "s"} tracked. {styleMeta.signature}
                </div>
              </a>
            )}
          </section>
        );
      })()}

      {/* Embed-this card — discoverability for the iframe widget. Each
          embed = permanent backlink + recurring discovery channel. Per
          audit's 🔴 fix (Embeddability dimension), this is the entry path
          finance-blog authors and LLM-citation tools use to find the
          drop-in widget. */}
      <section className="mt-12">
        <details className="rounded-2xl border border-border bg-panel overflow-hidden group">
          <summary className="cursor-pointer px-6 py-4 list-none flex items-center justify-between hover:bg-bg/40 transition">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-1">
                Embed on your site
              </div>
              <div className="text-sm font-semibold text-text">
                Drop {m.name.split(" ")[0]}&apos;s portfolio into your blog or wiki
              </div>
            </div>
            <span className="text-brand text-sm group-open:rotate-90 transition-transform">→</span>
          </summary>
          <div className="px-6 pb-5 border-t border-border">
            <p className="text-xs text-muted leading-relaxed mt-4 mb-3">
              600px-wide iframe. Top-3 holdings + closest replicating ETF + investing-style tag.
              Updates when the underlying 13F filing updates. Free, attribution-only.
            </p>
            <pre className="rounded-lg border border-border bg-bg/80 p-3 text-[11px] font-mono text-text overflow-x-auto leading-relaxed">
              <code>{`<iframe src="https://holdlens.com/embed/investor/${m.slug}/" width="600" height="360" frameborder="0" loading="lazy" title="${m.name} portfolio — HoldLens"></iframe>`}</code>
            </pre>
            <div className="mt-3 flex items-center gap-4 text-xs">
              <Link
                href={`/embed/investor/${m.slug}/`}
                target="_blank"
                className="text-brand hover:underline font-semibold"
              >
                Preview embed →
              </Link>
              <Link href="/embed/" className="text-muted hover:text-text">
                See all embed widgets
              </Link>
              <a
                href={`/api/v1/managers/${m.slug}.json`}
                className="text-muted hover:text-text font-mono"
              >
                JSON API →
              </a>
            </div>
          </div>
        </details>
      </section>

      {/* Per-quarter digest cross-links — SEO crawlability + discovery.
          Without this section these 232 pages were orphaned from the main investor
          page even though they exist in the sitemap. */}
      <section className="mt-16 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          Per-quarter digests
        </div>
        <h2 className="text-xl font-bold mb-1">
          What {m.name} did, quarter by quarter
        </h2>
        <p className="text-sm text-muted mb-4">
          Full move-by-move breakdown for each of the last 8 filed quarters.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(QUARTERS as readonly Quarter[]).map((q) => (
            <a
              key={q}
              href={`/investor/${m.slug}/q/${q.toLowerCase()}`}
              className="rounded-lg border border-border bg-bg/50 px-3 py-2 text-center text-sm font-semibold text-text hover:border-brand/40 hover:text-brand transition"
            >
              {QUARTER_LABELS[q]}
            </a>
          ))}
        </div>
      </section>

      <p className="text-xs text-dim mt-16">
        Data sourced from {m.fund} 13F filings with the SEC. Approximate snapshot. Not investment advice.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-panel px-5 py-4">
      <div className="text-xs uppercase tracking-wider text-dim">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}
