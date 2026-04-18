import type { Metadata } from "next";
import EmailCapture from "@/components/EmailCapture";
import BuySellSignals from "@/components/BuySellSignals";
import LiveStats from "@/components/LiveStats";
import LatestMoves from "@/components/LatestMoves";
import SinceLastVisit from "@/components/SinceLastVisit";
import FaqSchema, { type FaqItem } from "@/components/FaqSchema";
import TickerLogo from "@/components/TickerLogo";
import FundLogo from "@/components/FundLogo";
import { MANAGERS } from "@/lib/managers";
import { topTickers, TICKER_INDEX } from "@/lib/tickers";
import { getAllConvictionScores } from "@/lib/conviction";
import { LATEST_FILINGS } from "@/lib/filings";

// v1.42 — explicit homepage metadata. Prior state: homepage inherited
// layout.metadata.title.default ("30 superinvestors, one ConvictionScore —
// HoldLens") for <title> while the LAYOUT'S own openGraph.title said
// something DIFFERENT ("HoldLens — 30 superinvestors on one −100..+100
// ConvictionScore"). Twitter cards on social shares and the <title> a user
// sees in a tab pointed at the same page but didn't match. This is a
// consistency fix, not a content change — one source of truth for the
// homepage's three title slots.
export const metadata: Metadata = {
  title: "30 superinvestors, one ConvictionScore — HoldLens",
  description:
    "Every 13F move from Buffett, Ackman, Burry and 27 other top portfolio managers — scored on a signed +100 buy / −100 sell scale. SEC-sourced. Live prices. New filings every quarter.",
  alternates: { canonical: "https://holdlens.com/" },
  openGraph: {
    title: "30 superinvestors, one ConvictionScore — HoldLens",
    description:
      "Every 13F move from Buffett, Ackman, Burry and 27 other top portfolio managers, scored on a signed +100 buy / −100 sell scale. Live prices. Free core.",
    url: "https://holdlens.com/",
    siteName: "HoldLens",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "30 superinvestors, one ConvictionScore — HoldLens",
    description:
      "Every 13F move from Buffett, Ackman, Burry and 27 other top portfolio managers, on a signed +100 buy / −100 sell scale.",
    images: ["/og/home.png"],
  },
};

const HOMEPAGE_FAQ: FaqItem[] = [
  {
    q: "What is a ConvictionScore?",
    a: "A signed number from −100 to +100 that tells you how strongly tracked superinvestors are buying or selling a stock. +100 is the strongest possible buy signal; −100 is the strongest possible sell signal. The score combines consensus (how many managers agree), track record (weighted by each manager's historical alpha), concentration (position size as % of book), trend (multi-quarter streaks), and a dissent penalty for managers selling.",
  },
  {
    q: "How often is HoldLens updated?",
    a: "Every time a tracked portfolio manager files a 13F with the SEC, which happens quarterly within 45 days of quarter end. HoldLens re-parses filings, recomputes every ConvictionScore, regenerates all pages, and ships to Cloudflare Pages within a few hours of new filings appearing on EDGAR.",
  },
  {
    q: "Is HoldLens free?",
    a: `Yes — the core product (every page, every ConvictionScore, every manager profile, 150+ JSON API endpoints, 30 tracked managers) is free and always will be. Ad-supported via Google AdSense and an affiliate relationship with Interactive Brokers. An optional Pro tier (€9/mo founders rate, first 100 subscribers) adds email alerts on every 13F filing, the full 80+ manager EDGAR universe, a 10,000 req/day API key, a per-ticker AI thesis generator, and removes ads. Free users never lose functionality.`,
  },
  {
    q: "How is HoldLens different from Dataroma?",
    a: "Dataroma lists holdings. HoldLens scores them. Every ticker has a signed −100..+100 ConvictionScore plus 16 distinct signal pages (best-now, big-bets, rotation, consensus, contrarian, crowded-trades, first-movers, accelerators, trend-streaks, and more), a 150-endpoint public JSON API, live prices, and a mobile-optimized UI built on Next.js static export.",
  },
  {
    q: "Is this investment advice?",
    a: "No. HoldLens surfaces public SEC 13F filings and derives signals from them. Nothing on the site is a recommendation to buy or sell any security. 13F filings are lagged by up to 45 days and only show long US equity positions — an incomplete picture of any manager's portfolio. Do your own research.",
  },
  {
    q: "How many portfolio managers does HoldLens track?",
    a: `${MANAGERS.length} of the world's best active superinvestors, including Warren Buffett, Bill Ackman, Stanley Druckenmiller, Seth Klarman, Howard Marks, David Tepper, Michael Burry, Chris Hohn, Chase Coleman, Li Lu, and others across value, growth, activist, macro, and long-short strategies.`,
  },
];

export default function HomePage() {
  const featuredManagers = MANAGERS.slice(0, 6);
  const top = topTickers(6);
  const allScores = getAllConvictionScores();
  const buySignals = allScores.filter((s) => s.score > 0).length;
  const sellSignals = allScores.filter((s) => s.score < 0).length;
  const tickerCount = Object.keys(TICKER_INDEX).length;

  // v1.39 — compute the fleet-latest 13F for the "Since your last visit"
  // return-motivator banner. Uses the EDGAR-derived LATEST_FILINGS map
  // (v1.37) so the banner is sourced from actual ingested 13F data, never
  // a hardcoded string. Pick the freshest filingDate across all tracked
  // managers — that's the newest thing the site has to show a returning
  // visitor.
  const allFilings = Object.values(LATEST_FILINGS);
  const fleetLatest = allFilings.reduce(
    (best, f) => (f.latestDate > best.latestDate ? f : best),
    allFilings[0],
  );

  // v1.20 — site-wide schema.org declarations for SERP enhancements.
  // Organization + WebSite + SearchAction unlock three Google features:
  //   1. Brand sitelinks box on "holdlens.com" SERP (autogenerated by Google
  //      from these types + internal link structure)
  //   2. SearchAction = sitelinks search box inside the sitelinks panel
  //   3. Organization logo appearance in rich result cards
  // These are ONE-TIME declarations (shipped on homepage only — site-wide
  // per schema.org spec; ignored on subordinate pages). Paired with FAQ
  // schema (already shipped via FaqSchema) + OG/Twitter card (already in
  // layout metadata), the home page is now a fully-decorated entry surface.
  const siteWideSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://holdlens.com/#organization",
        name: "HoldLens",
        url: "https://holdlens.com/",
        description: `Track ${MANAGERS.length} of the world's best portfolio managers on a single signed −100..+100 ConvictionScore. Free forever.`,
        logo: {
          "@type": "ImageObject",
          "@id": "https://holdlens.com/#logo",
          url: "https://holdlens.com/apple-icon.svg",
          contentUrl: "https://holdlens.com/apple-icon.svg",
          caption: "HoldLens",
          width: 180,
          height: 180,
        },
        foundingDate: "2026",
        // The operator is not directly promoting; brand handle only surfaces
        // through the X share flow when a ship goes viral.
      },
      {
        "@type": "WebSite",
        "@id": "https://holdlens.com/#website",
        url: "https://holdlens.com/",
        name: "HoldLens",
        description:
          "13F superinvestor tracker — every move from Buffett, Ackman, Burry and 27 others, scored on a signed +100 buy / −100 sell scale.",
        publisher: { "@id": "https://holdlens.com/#organization" },
        inLanguage: "en-US",
        potentialAction: {
          // Sitelinks search box — Google offers an in-SERP search box
          // against holdlens.com when it detects SearchAction. URL pattern
          // routes to our /ticker prefix handler which already does lookups.
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://holdlens.com/ticker/{search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        // v1.41 — DefinedTerm schema for the unique "ConvictionScore" metric.
        // Goal: authoritative single-source definition that LLMs (ChatGPT,
        // Claude, Perplexity, Google SGE) can cite when users ask "what is
        // HoldLens ConvictionScore?" or when HoldLens is quoted in LLM
        // responses. DefinedTerm is the canonical schema.org type for
        // glossary entries; pairing it with inDefinedTermSet makes it
        // navigable for future additions (e.g., "Net Signal", "Dissent
        // Penalty"). Zero page-weight cost — one inline JSON-LD entry.
        "@type": "DefinedTerm",
        "@id": "https://holdlens.com/#term-conviction-score",
        name: "ConvictionScore",
        alternateName: ["Conviction Score", "HoldLens ConvictionScore", "Unified ConvictionScore"],
        description:
          "HoldLens's signed −100 to +100 ConvictionScore is a unified metric that scores every tracked stock based on smart-money consensus (how many of the 30 tracked superinvestors are buying vs. selling), track record (weighted by each manager's historical alpha), concentration (position size as % of book), trend (multi-quarter streaks), insider activity, and a dissent penalty. +100 is the strongest possible buy signal; −100 is the strongest possible sell signal. Computed quarterly from SEC 13F filings.",
        inDefinedTermSet: "https://holdlens.com/#term-set",
        url: "https://holdlens.com/methodology",
        sameAs: "https://holdlens.com/methodology",
      },
      {
        "@type": "DefinedTermSet",
        "@id": "https://holdlens.com/#term-set",
        name: "HoldLens methodology terms",
        description: "Metrics and signals computed by HoldLens from SEC 13F filings.",
        url: "https://holdlens.com/methodology",
        hasDefinedTerm: { "@id": "https://holdlens.com/#term-conviction-score" },
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Site-wide schema — MUST be rendered first in the DOM for Google's
          first-scan pickup. Stringify once; hidden from users. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteWideSchema) }}
      />
      {/* Hero — v0.90 honest-outcome rewrite. Prior "Spot smart money moves
          before the market does" implied an information edge that 13F's 45-day
          lag cannot deliver (data is already public when it arrives on the
          site). New copy promises interpretation, not front-running. Subcopy
          trimmed from 7 named managers to 3 for scannability. Trust row
          retargeted from dev-speak (API endpoints, static pages) to
          audience-aligned signals (quarters of data, investor count). */}
      {/* v1.07 — tightened hero: pt-20→pt-12 (under 70px header+banner the
          prior 80px top-padding stacked to 150px+ before content started).
          Trust row cut to 3 items (was 4 — too dense). Removed border-y
          divider on the BuySellSignals section that fragmented hero → card
          flow. All three are spacing-consistency fixes flagged by operator. */}
      <section className="pt-12 pb-10 text-center">
        <div className="inline-block text-xs font-semibold tracking-widest text-brand uppercase mb-6">
          SEC-sourced · {MANAGERS.length} investors tracked · updated every quarter
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight tracking-tight">
          Understand every move by the
          <br />
          {/* v1.39 — gradient hero text for first-paint dopamine lift. Base
              `text-brand` stays as a fallback on browsers that don't support
              bg-clip-text + text-transparent (Safari < 15, ancient Edge). On
              evergreen browsers the brand amber subtly shimmers into a deeper
              amber, reading as premium without changing brand identity. */}
          <span className="text-brand bg-gradient-to-br from-brand to-amber-500 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            smartest investors in the world.
          </span>
        </h1>
        <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
          Every 13F move from Buffett, Ackman, Burry and {MANAGERS.length - 3} other top portfolio
          managers — scored on a signed{" "}
          <span className="text-emerald-400 font-semibold">+100 buy</span> /{" "}
          <span className="text-rose-400 font-semibold">−100 sell</span> scale.{" "}
          <span className="text-text font-semibold">Live prices. New filings every quarter.</span>
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/best-now"
            className="bg-brand text-black font-semibold rounded-xl px-6 py-4 hover:opacity-90 transition"
          >
            See the top buy signals →
          </a>
          <a
            href="/biggest-sells"
            className="border border-rose-400/40 bg-rose-400/5 text-rose-400 font-semibold rounded-xl px-6 py-4 hover:bg-rose-400/10 transition"
          >
            See the top sell signals →
          </a>
        </div>
        <div className="mt-5 text-xs text-dim">
          SEC-sourced · 8 quarters of data · not investment advice
        </div>
      </section>

      {/* v1.39 — returning-visitor banner. Silent on first visit; appears
          only when the localStorage `last-visit` cursor is ≥ 48h old. Tells
          the user the real human gap + the freshest 13F filing on file,
          with a "see what changed" link to /activity. Dismissible. Core
          return-motivator — honest, no fake counts, no FOMO. */}
      <SinceLastVisit
        latestQuarter={fleetLatest.quarter}
        latestFilingDate={fleetLatest.latestDate}
      />

      {/* Buy/Sell signal card — the headline feature. v1.07 removed
          border-y divider: the card already has its own borders per column,
          the extra horizontal rule fragmented the flow from hero to card. */}
      <section className="pb-10">
        <BuySellSignals />
      </section>

      {/* Live stats — computed client-side */}
      <LiveStats />

      {/* Latest big moves — Dataroma's biggest engagement lever, now native to
          HoldLens. Eight highest-portfolio-impact 13F moves across the
          tracked book, action-coded, clickable, zero client JS. */}
      <LatestMoves />

      {/* Signal explorer — discovery grid for the forward-looking pages.
          This is what Dataroma does not have: eight distinct views on smart
          money, each answering a different question. */}
      <section className="py-16 border-t border-border">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
              Signal explorer
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Nineteen ways to read smart money</h2>
            <p className="text-muted mt-2 max-w-xl">
              Every card below answers a different question Dataroma can&rsquo;t.
              Pick the angle, not the ticker.
            </p>
          </div>
          <a href="/vs/dataroma" className="text-sm text-brand hover:text-text font-semibold">
            vs Dataroma →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SignalCard
            href="/best-now"
            tone="brand"
            label="Buy now"
            title="Best stocks now"
            body="Top positive ConvictionScores across every tracked manager."
          />
          <SignalCard
            href="/conviction-leaders"
            tone="emerald"
            label="Leaders"
            title="Conviction leaders"
            body="Managers ranked by weighted conviction of their top picks."
          />
          <SignalCard
            href="/consensus"
            tone="emerald"
            label="Consensus"
            title="Consensus picks"
            body="≥5 owners, positive conviction, net-buying flow."
          />
          <SignalCard
            href="/hidden-gems"
            tone="emerald"
            label="Quiet"
            title="Hidden gems"
            body="High conviction, 1–3 owners, top-tier manager."
          />
          <SignalCard
            href="/contrarian-bets"
            tone="brand"
            label="Split"
            title="Contrarian bets"
            body="Managers buying while others sell. The disagreement signal."
          />
          <SignalCard
            href="/crowded-trades"
            tone="rose"
            label="Crowded"
            title="Crowded trades"
            body="Most-owned tickers, with unwind warning when the crowd exits."
          />
          <SignalCard
            href="/exits"
            tone="rose"
            label="Capitulation"
            title="Full exits"
            body="Every position that went to zero, newest quarter first."
          />
          <SignalCard
            href="/concentration"
            tone="brand"
            label="Conviction"
            title="Concentration"
            body="Who's all-in vs diversified — top-1, top-3, top-5 weights."
          />
          <SignalCard
            href="/trend-streak"
            tone="emerald"
            label="Compounding"
            title="Trend streaks"
            body="Managers who keep buying the same name quarter after quarter."
          />
          <SignalCard
            href="/accelerators"
            tone="brand"
            label="Crowd forming"
            title="Accelerators"
            body="Tickers where aggregate ownership has grown 3+ quarters in a row."
          />
          <SignalCard
            href="/overlap"
            tone="brand"
            label="Consensus"
            title="Manager overlap"
            body="Which pairs of superinvestors own the same stocks."
          />
          <SignalCard
            href="/by-philosophy"
            tone="emerald"
            label="Schools"
            title="By philosophy"
            body="What value, growth, activist, and macro investors each hold."
          />
          <SignalCard
            href="/quarter/2025-q4"
            tone="brand"
            label="Archive"
            title="Quarter digest"
            body="Historical 13F recap — 8 quarters deep, like Dataroma archive."
          />
          <SignalCard
            href="/first-movers"
            tone="brand"
            label="Who was early"
            title="First movers"
            body="The managers who opened a position first, before the crowd arrived."
          />
          <SignalCard
            href="/biggest-buys"
            tone="emerald"
            label="All-in"
            title="Biggest buys"
            body="The single trades that pushed past 10% of a manager's book."
          />
          <SignalCard
            href="/themes"
            tone="brand"
            label="Baskets"
            title="Themes"
            body="AI, Mag 7, Energy, Banks, China, Healthcare. Smart money by sector bet."
          />
          <SignalCard
            href="/biggest-sells"
            tone="rose"
            label="Exits"
            title="Biggest sells"
            body="Conviction collapses. 1,300+ exits and trims ranked by magnitude."
          />
          <SignalCard
            href="/fresh-conviction"
            tone="brand"
            label="Rarest"
            title="Fresh conviction"
            body="New positions in tickers nobody else in the fleet holds. Contrarian by construction."
          />
          <SignalCard
            href="/investor/bill-ackman/q/2025-q4"
            tone="brand"
            label="Quarter"
            title="Per-manager quarter digest"
            body="What did your favorite manager do in Q4? Every buy, sell, new, exit — scored."
          />
        </div>
      </section>

      {/* Backtest gallery — the viral wedge front and center */}
      <section className="py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
              The viral wedge
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">What if you'd copied them?</h2>
            <p className="text-muted mt-2">Interactive backtests. Drag a year, drop in a dollar amount.</p>
          </div>
          <a href="/simulate" className="text-sm text-muted hover:text-text">All backtests →</a>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <BacktestCard slug="buffett" name="Warren Buffett" fund="Berkshire Hathaway" desc="1999-2025 · Compounding legend" />
          <BacktestCard slug="ackman" name="Bill Ackman" fund="Pershing Square" desc="2014-2025 · Activist concentrated" />
          <BacktestCard slug="druckenmiller" name="Druckenmiller" fund="Duquesne Family Office" desc="2010-2025 · No losing years" />
        </div>
      </section>

      {/* Top picks preview */}
      <section className="py-16 border-t border-border">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
              Consensus picks
            </div>
            <h2 className="text-3xl font-bold">Most-owned stocks</h2>
            <p className="text-muted mt-1">Ranked by how many superinvestors hold them.</p>
          </div>
          <a href="/top-picks" className="text-sm text-muted hover:text-text">See all →</a>
        </div>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-xs uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-5 py-4 w-12">#</th>
                <th className="text-left px-5 py-4">Ticker</th>
                <th className="text-left px-5 py-4">Company</th>
                <th className="text-right px-5 py-4">Owners</th>
              </tr>
            </thead>
            <tbody>
              {top.map((t, i) => (
                <tr key={t.symbol} className="border-b border-border last:border-0 hover:bg-bg/50 transition">
                  <td className="px-5 py-3 text-dim tabular-nums">{i + 1}</td>
                  <td className="px-5 py-3 font-mono font-semibold">
                    <a href={`/ticker/${t.symbol}`} className="inline-flex items-center gap-2 text-brand hover:underline">
                      <TickerLogo symbol={t.symbol} size={22} />
                      {t.symbol}
                    </a>
                  </td>
                  <td className="px-5 py-3 text-text">{t.name}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{t.ownerCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Manager grid */}
      <section className="py-16 border-t border-border">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
              The best, out loud
            </div>
            <h2 className="text-3xl font-bold">The portfolio managers we watch</h2>
          </div>
          <a href="/investor" className="text-sm text-muted hover:text-text">All {MANAGERS.length} →</a>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {featuredManagers.map((m) => (
            <a key={m.slug} href={`/investor/${m.slug}`}
               className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition group">
              <div className="flex items-center gap-3 mb-1">
                <FundLogo slug={m.slug} name={m.name} size={36} />
                <div className="min-w-0">
                  <div className="font-semibold group-hover:text-brand transition truncate">{m.name}</div>
                  <div className="text-xs text-muted truncate">{m.fund}</div>
                </div>
              </div>
              <div className="text-xs text-dim mt-2 flex items-center gap-1.5">
                Top:
                {m.topHoldings[0] && <TickerLogo symbol={m.topHoldings[0].ticker} size={14} />}
                <span className="font-mono text-brand">{m.topHoldings[0]?.ticker}</span>
                ({m.topHoldings[0]?.pct.toFixed(1)}%)
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Activity CTA */}
      <section className="py-12 border-t border-border">
        <div className="rounded-2xl border border-border bg-panel p-8 md:p-10 text-center">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
            Every buy, every sell, every quarter
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            The full activity feed.
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-6">
            Every tracked 13F move in chronological order, grouped by quarter. The fastest way to see what just changed.
          </p>
          <a
            href="/activity"
            className="inline-block bg-brand text-black font-semibold rounded-xl px-6 py-3 hover:opacity-90 transition"
          >
            Open activity feed →
          </a>
        </div>
      </section>

      {/* Why different */}
      <section className="py-16 border-t border-border grid md:grid-cols-3 gap-8">
        <Feature title="One signed score" body="Every stock gets one number on a −100..+100 scale. A ticker shows up on exactly one list — never both sides at once. The META problem is solved." />
        <Feature title="Always current" body="SEC filings parsed within hours. Email alerts fire the moment Buffett, Ackman, or Icahn file a new 13F." />
        <Feature title="Backtest anything" body="Interactive simulators: 'If you had copied Buffett starting in 2010, you'd have…' — share-ready charts for every manager." />
      </section>

      {/* Social proof — real numbers */}
      <section className="py-16 border-t border-border">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
            By the numbers
          </div>
          <h2 className="text-3xl font-bold">Built on real SEC filings, not vibes</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value={MANAGERS.length} label="Portfolio managers tracked" />
          <StatCard value={tickerCount} label="Stocks scored" />
          <StatCard value={buySignals} label="Active buy signals" />
          <StatCard value={sellSignals} label="Active sell signals" />
        </div>
        <p className="text-xs text-dim text-center mt-6">
          Every number is derived from SEC 13F filings. No paid placements. No sponsored signals.
        </p>
      </section>

      {/* Social proof — trust + founders urgency */}
      <section className="py-16 border-t border-border">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Data source trust */}
          <div>
            <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
              Where the data comes from
            </div>
            <div className="space-y-4">
              <TrustRow
                icon="SEC"
                title="SEC EDGAR 13F filings"
                desc="Every data point traces back to a regulatory filing. No rumors, no tips."
              />
              <TrustRow
                icon="$"
                title="Live market prices"
                desc="Real-time quotes via Yahoo Finance. ConvictionScores update every session."
              />
              <TrustRow
                icon="10y"
                title="10-year backtests"
                desc="Simulated returns from 2010-2025. No cherry-picked windows."
              />
            </div>
          </div>

          {/* Founders rate urgency */}
          <div className="rounded-2xl border border-brand/30 bg-brand/5 p-8">
            <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
              Early access
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Founders rate: $9/mo for life
            </h3>
            <p className="text-muted text-sm leading-relaxed mb-6">
              The first 100 Pro members lock in $9/mo permanently. Standard price
              goes to $14/mo after that. You keep the rate as long as you stay subscribed.
            </p>
            <ul className="text-sm text-muted space-y-2 mb-6">
              <li className="flex gap-2"><span className="text-emerald-400">+</span> Email alerts on every 13F filing</li>
              <li className="flex gap-2"><span className="text-emerald-400">+</span> EDGAR automation — 80+ managers</li>
              <li className="flex gap-2"><span className="text-emerald-400">+</span> AI-generated thesis per ticker</li>
              <li className="flex gap-2"><span className="text-emerald-400">+</span> API access (1,000 calls/mo)</li>
            </ul>
            <a
              href="/pricing"
              className="inline-block bg-brand text-black font-semibold rounded-xl px-6 py-3 hover:opacity-90 transition text-sm"
            >
              See pricing →
            </a>
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="py-20 border-t border-border text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Get alerts the moment they move.</h2>
        <p className="mt-4 text-muted max-w-xl mx-auto">
          One email per 13F filing. No spam, no advice, just the data. Unsubscribe anytime.
        </p>
        <div className="max-w-md mx-auto mt-8">
          <EmailCapture size="lg" />
        </div>
        <div className="text-xs text-dim mt-4">Free forever. ~3 emails per week during filing seasons.</div>
      </section>

      {/* FAQ — visible copy + matching JSON-LD for Google rich results */}
      <section className="py-16 border-t border-border">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
            Frequently asked
          </div>
          <h2 className="text-3xl font-bold">What HoldLens does, in plain English</h2>
        </div>
        <div className="space-y-4">
          {HOMEPAGE_FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-border bg-panel px-5 py-4 open:border-brand/40 transition"
            >
              <summary className="cursor-pointer list-none flex items-baseline justify-between gap-4">
                <span className="font-semibold text-text text-lg">{item.q}</span>
                <span className="text-brand text-xl shrink-0 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-muted leading-relaxed text-sm">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <FaqSchema id="homepage-faq-ld" items={HOMEPAGE_FAQ} />
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted leading-relaxed">{body}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-6 text-center">
      <div className="text-4xl md:text-5xl font-bold text-brand tabular-nums">{value}</div>
      <div className="text-sm text-muted mt-2">{label}</div>
    </div>
  );
}

function BacktestCard({ slug, name, fund, desc }: { slug: string; name: string; fund: string; desc: string }) {
  return (
    <a href={`/simulate/${slug}`}
       className="rounded-2xl border border-border bg-panel p-6 hover:border-brand transition group">
      <div className="text-xs text-dim uppercase tracking-wider">Backtest</div>
      <div className="text-xl font-bold mt-2 group-hover:text-brand transition">{name}</div>
      <div className="text-sm text-muted mt-1">{fund}</div>
      <div className="text-xs text-dim mt-3">{desc}</div>
      <div className="text-brand text-sm mt-4">Run →</div>
    </a>
  );
}

function SignalCard({
  href,
  tone,
  label,
  title,
  body,
}: {
  href: string;
  tone: "brand" | "emerald" | "rose";
  label: string;
  title: string;
  body: string;
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-400/25 hover:border-emerald-400/60 hover:bg-emerald-400/5"
      : tone === "rose"
      ? "border-rose-400/25 hover:border-rose-400/60 hover:bg-rose-400/5"
      : "border-brand/25 hover:border-brand hover:bg-brand/5";
  const labelClass =
    tone === "emerald"
      ? "text-emerald-400"
      : tone === "rose"
      ? "text-rose-400"
      : "text-brand";
  return (
    <a
      href={href}
      className={`rounded-2xl border bg-panel p-5 transition block h-full ${toneClass}`}
    >
      <div className={`text-[10px] uppercase tracking-widest font-bold mb-2 ${labelClass}`}>
        {label}
      </div>
      <div className="text-base font-bold text-text mb-2">{title}</div>
      <div className="text-xs text-muted leading-relaxed">{body}</div>
    </a>
  );
}

function TrustRow({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 rounded-lg bg-panel border border-border flex items-center justify-center text-xs font-bold text-brand shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-sm text-muted mt-0.5">{desc}</div>
      </div>
    </div>
  );
}
