import type { Metadata } from "next";
import ShareStrip from "@/components/ShareStrip";
import AuthorByline from "@/components/AuthorByline";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";

// /learn/do-hedge-fund-signals-work
//
// Target queries:
//   "do 13f signals work"           (long-tail, ~90/mo)
//   "following hedge fund alpha"    (~210/mo)
//   "13f backtest"                  (~170/mo)
//   "does copying hedge funds work" (~260/mo, competitive)
//   "smart money investing"         (~1,900/mo, very competitive)
//   "13f filings alpha"             (~140/mo)
//   "superinvestor copy trading returns" (long-tail)
//
// Unique angle: HoldLens ran its OWN conviction score against real forward
// returns over 2024-Q4 → 2025-Q3 and found no predictive signal (r=-0.12).
// Most 13F-tracking sites never publish backtests; we're publishing ours
// WITH negative results. The meta-position: honesty is the moat. This
// article is the canonical home for anyone Googling "do 13F signals work"
// — with data, not marketing.
//
// Distribution archetype: original_research_with_dataset +90 (top of the
// Distribution Oracle multiplier table).
//
// Cross-links: /methodology#predictive-validity, /learn/copy-trading-myth,
// /learn/45-day-lag-explained, /learn/survivorship-bias-in-hedge-funds,
// /investor

export const metadata: Metadata = {
  title: "Do 13F signals actually predict stock returns? We ran the backtest",
  description:
    "We backtested our own ConvictionScore against realized returns across 221 ticker-quarter pairs and 4 quarters of SEC 13F data. The result was humbling — r = -0.12, no predictive signal. Here's what we found, why, and what to do with it.",
  alternates: {
    canonical: "https://holdlens.com/learn/do-hedge-fund-signals-work",
  },
  openGraph: {
    title: "Do 13F signals predict returns? Our backtest says no",
    description:
      "We ran our own smart-money score against 14 months of realized returns. The answer was uncomfortable — and more honest than the field gets.",
    url: "https://holdlens.com/learn/do-hedge-fund-signals-work",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Do 13F signals predict returns? Our backtest says no",
  },
};

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Learn", item: "https://holdlens.com/learn" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Do 13F signals actually work?",
        item: "https://holdlens.com/learn/do-hedge-fund-signals-work",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Do 13F signals actually predict stock returns? We ran the backtest",
    description:
      "Original research: we backtested our ConvictionScore against 221 ticker-quarter pairs of realized returns. Pearson r = -0.12. Top-decile 'BUY' signals underperformed SPY by 5pt; bottom-decile 'SELL' signals outperformed by 24pt. Here's why.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/do-hedge-fund-signals-work",
    datePublished: "2026-04-19",
    dateModified: "2026-04-19",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    about: [
      {
        "@type": "DefinedTerm",
        name: "Backtest",
        description:
          "A historical simulation of an investment strategy against real past market data to estimate how it would have performed.",
      },
      {
        "@type": "DefinedTerm",
        name: "Pearson correlation",
        description:
          "A statistical measure (−1 to +1) of the linear relationship between two variables. Near zero = no relationship; +1 = perfect positive relationship; −1 = perfect inverse.",
      },
      {
        "@type": "DefinedTerm",
        name: "Alpha",
        description:
          "Excess return vs. a benchmark. Positive alpha means an investment outperformed the market; negative alpha means it underperformed.",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do 13F filings predict which stocks will go up?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Based on our April 2026 backtest of 221 ticker-quarter pairs across 30 tracked portfolio managers — no. The Pearson correlation between our ConvictionScore (a composite of smart-money positioning) and 6-14 month forward alpha over SPY was -0.12. Top-decile BUY signals underperformed SPY by about 5 percentage points; bottom-decile SELL signals outperformed by 24 points. 13F data is useful as institutional positioning intelligence, but not as a direct predictor of future returns.",
        },
      },
      {
        "@type": "Question",
        name: "Why don't 13F signals work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Three structural reasons. First, contrarian inversion: when managers buy a stock, it's often because it dropped, and the drop continues (momentum beats mean-reversion in the short term). Second, manager-quality drag: several storied managers tracked by the industry have underperformed the S&P over the last decade. Third, the 45-day filing lag: by the time 13F data is public, the news is priced in.",
        },
      },
      {
        "@type": "Question",
        name: "What IS 13F data useful for then?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It's legitimate institutional-positioning intelligence. Knowing what Buffett, Ackman, Burry and Druckenmiller are actually buying and selling is market-color that only becomes public via 13F. It's a transparency tool, a research input, and a way to generate watchlists — just not a direct predictor of alpha. Use it for context, not for trading signals.",
        },
      },
    ],
  },
];

export default function BacktestArticle() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {LD.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}

      <a href="/learn" className="text-xs text-muted hover:text-text">← Back to Learn</a>

      <div className="mt-6 text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Original research · April 2026
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
        Do 13F signals actually predict stock returns? We ran the backtest.
      </h1>

      <AuthorByline date="2026-04-19" />

      <p className="text-muted text-lg leading-relaxed mt-8 mb-6">
        If you&apos;ve ever wondered whether &ldquo;following the smart money&rdquo; through SEC 13F filings
        actually beats the S&amp;P — we did too. So we built the tooling, ran the backtest, and the result
        was humbling enough that we&apos;re publishing it here instead of burying it in a footnote.
      </p>

      <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-5 mb-8">
        <p className="text-text font-semibold mb-2">TL;DR</p>
        <p className="text-muted text-sm leading-relaxed">
          Over 221 ticker-quarter pairs across 4 historical quarters (Q4 2024 through Q3 2025), the
          correlation between our ConvictionScore — a composite of smart-money positioning, insider
          activity, manager track record, multi-quarter trend, concentration, and contrarian bonus —
          and realized forward alpha over SPY was <strong className="text-text">Pearson r = −0.12</strong>.
          In every single quarter of the window, top-decile &ldquo;BUY&rdquo; signals
          <em> underperformed</em> bottom-decile &ldquo;SELL&rdquo; signals by more than 20 percentage
          points. The score does not predict returns over this window. This changes nothing about what
          HoldLens tracks — just what we claim the tracking does.
        </p>
      </div>

      <ShareStrip url="https://holdlens.com/learn/do-hedge-fund-signals-work" title="Do 13F signals predict returns? HoldLens ran the backtest." />

      <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
        1. What we tested
      </h2>
      <p className="text-muted leading-relaxed mb-4">
        HoldLens assigns every tracked stock a single{" "}
        <a href="/learn/conviction-score-explained" className="underline">ConvictionScore</a>{" "}
        from −100 (strongest smart-money consensus SELL) to +100 (strongest BUY). The score
        aggregates six signals — smart-money consensus, insider Form 4 activity, manager
        10-year track record, multi-quarter trend streaks, position concentration, and a
        contrarian bonus — minus dissent and crowding penalties. It&apos;s the same score
        that drives every BUY/SELL ranking on the site.
      </p>
      <p className="text-muted leading-relaxed mb-4">
        The question: does the score predict which stocks will outperform going forward?
        To answer it, we:
      </p>
      <ol className="list-decimal pl-6 text-muted space-y-2 mb-4">
        <li>
          Replayed the score at four historical filing dates (Q4 2024, Q1 2025, Q2 2025,
          Q3 2025) for every ticker in our tracked universe.
        </li>
        <li>
          Fetched 2-year daily closing prices from Yahoo Finance for every ticker plus SPY
          as a benchmark.
        </li>
        <li>
          Computed realized forward return from each ticker&apos;s 13F filing date to today,
          alongside SPY&apos;s return over the same window.
        </li>
        <li>
          Paired each (ticker, quarter) with its score at that quarter and its realized alpha
          (ticker return minus SPY return over the same window).
        </li>
        <li>
          Computed per-quarter and aggregate Pearson correlations, decile analysis, and
          hit-rate statistics.
        </li>
      </ol>
      <p className="text-muted leading-relaxed mb-4">
        The full script is{" "}
        <code className="text-xs px-1.5 py-0.5 bg-panel-hi rounded">scripts/backtest-conviction.ts</code>{" "}
        — deterministic, reproducible, runnable anytime with{" "}
        <code className="text-xs px-1.5 py-0.5 bg-panel-hi rounded">npx tsx scripts/backtest-conviction.ts</code>.
        221 (ticker, quarter) pairs made it through both the scoring and pricing filters. Not
        thousands, but enough for directional correlation analysis.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
        2. What we found
      </h2>
      <p className="text-muted leading-relaxed mb-4">
        Per-quarter correlations between ConvictionScore and realized alpha:
      </p>
      <div className="rounded-2xl border border-border bg-panel overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="text-dim text-xs uppercase tracking-wider">
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3">Filing date</th>
              <th className="text-right px-4 py-3">Window held</th>
              <th className="text-right px-4 py-3">SPY return</th>
              <th className="text-right px-4 py-3">r(score, alpha)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3">Q4 2024 (14 Feb 2025)</td>
              <td className="px-4 py-3 text-right tabular-nums">428d</td>
              <td className="px-4 py-3 text-right tabular-nums">+16.5%</td>
              <td className="px-4 py-3 text-right tabular-nums text-rose-400">−0.04</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3">Q1 2025 (15 May 2025)</td>
              <td className="px-4 py-3 text-right tabular-nums">338d</td>
              <td className="px-4 py-3 text-right tabular-nums">+20.9%</td>
              <td className="px-4 py-3 text-right tabular-nums text-rose-400">−0.18</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3">Q2 2025 (14 Aug 2025)</td>
              <td className="px-4 py-3 text-right tabular-nums">247d</td>
              <td className="px-4 py-3 text-right tabular-nums">+10.1%</td>
              <td className="px-4 py-3 text-right tabular-nums text-rose-400">−0.16</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Q3 2025 (14 Nov 2025)</td>
              <td className="px-4 py-3 text-right tabular-nums">155d</td>
              <td className="px-4 py-3 text-right tabular-nums">+5.7%</td>
              <td className="px-4 py-3 text-right tabular-nums text-rose-400">−0.06</td>
            </tr>
            <tr className="border-t-2 border-border bg-panel-hi font-semibold">
              <td className="px-4 py-3">Aggregate</td>
              <td className="px-4 py-3 text-right tabular-nums">—</td>
              <td className="px-4 py-3 text-right tabular-nums">—</td>
              <td className="px-4 py-3 text-right tabular-nums text-rose-400">−0.12</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-muted leading-relaxed mb-4">
        Every single quarter had a <em>negative</em> correlation. The aggregate is −0.12. For context,
        a score that genuinely predicted returns would show r ≥ +0.15 at minimum; financial research
        considers r ≥ +0.3 strong evidence of a signal.
      </p>

      <p className="text-muted leading-relaxed mb-4">
        Binned by score:
      </p>
      <div className="rounded-2xl border border-border bg-panel overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="text-dim text-xs uppercase tracking-wider">
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3">Score bucket</th>
              <th className="text-right px-4 py-3">N</th>
              <th className="text-right px-4 py-3">Mean return</th>
              <th className="text-right px-4 py-3">Mean alpha vs SPY</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-4 py-3">Sell (−29 to −10)</td>
              <td className="px-4 py-3 text-right tabular-nums">23</td>
              <td className="px-4 py-3 text-right tabular-nums">+35.4%</td>
              <td className="px-4 py-3 text-right tabular-nums text-emerald-400">+22.3%</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3">Weak sell (−9 to −1)</td>
              <td className="px-4 py-3 text-right tabular-nums">34</td>
              <td className="px-4 py-3 text-right tabular-nums">+24.3%</td>
              <td className="px-4 py-3 text-right tabular-nums text-emerald-400">+9.7%</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-4 py-3">Weak buy (+1 to +9)</td>
              <td className="px-4 py-3 text-right tabular-nums">58</td>
              <td className="px-4 py-3 text-right tabular-nums">+25.8%</td>
              <td className="px-4 py-3 text-right tabular-nums text-emerald-400">+13.9%</td>
            </tr>
            <tr className="border-b border-border bg-rose-400/5">
              <td className="px-4 py-3">Buy (+10 to +29)</td>
              <td className="px-4 py-3 text-right tabular-nums">90</td>
              <td className="px-4 py-3 text-right tabular-nums">+8.5%</td>
              <td className="px-4 py-3 text-right tabular-nums text-rose-400">−4.3%</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Strong buy (≥ +30)</td>
              <td className="px-4 py-3 text-right tabular-nums">9</td>
              <td className="px-4 py-3 text-right tabular-nums">+16.3%</td>
              <td className="px-4 py-3 text-right tabular-nums text-emerald-400">+3.1%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-muted leading-relaxed mb-4">
        The biggest bucket by size — our standard &ldquo;BUY&rdquo; category, 90 signals —
        underperformed SPY by 4.3 percentage points. The &ldquo;SELL&rdquo; bucket beat SPY by
        22 percentage points. The score ordering was, over this window, inverse to the outcome.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
        3. Why
      </h2>
      <p className="text-muted leading-relaxed mb-4">
        Three structural reasons, not mutually exclusive:
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-2">Contrarian inversion</h3>
      <p className="text-muted leading-relaxed mb-4">
        Famous value investors buy stocks that have dropped. The headline &ldquo;Buffett added to
        Occidental&rdquo; often comes while OXY is down 15% from its high — that&apos;s why he&apos;s
        buying. In short horizons (6-14 months), momentum beats mean-reversion in most sectors;
        stocks that are falling keep falling. When smart money is selling, they&apos;re typically
        taking profit on a winner — which often keeps winning. The BUY and SELL labels get the
        short-term direction backwards in an up market, which is what we had.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-2">Manager-quality drag</h3>
      <p className="text-muted leading-relaxed mb-4">
        Several of the industry&apos;s most-covered managers have underperformed the S&amp;P over
        the last decade. Our derived{" "}
        <a href="/learn/conviction-score-explained" className="underline">10-year ROI panel</a>{" "}
        on each investor page tells this story: the legendary name is not the legendary recent
        performer. When those managers&apos; picks drive the BUY signal, the signal inherits
        their recent record — which hasn&apos;t beaten the index.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-2">The 45-day lag</h3>
      <p className="text-muted leading-relaxed mb-4">
        By the time we can see &ldquo;Manager X bought stock Y&rdquo; in a 13F, the quarter has
        been over for at least 45 days, often longer. Whatever informational edge the manager had
        at purchase time is stale. The market is efficient enough that the mean-reversion or
        momentum pattern has had weeks to play out. See{" "}
        <a href="/learn/45-day-lag-explained" className="underline">the 45-day lag explained</a>{" "}
        for more.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
        4. So what is 13F data good for?
      </h2>
      <p className="text-muted leading-relaxed mb-4">
        The backtest doesn&apos;t say 13F data is worthless. It says the common claim — &ldquo;follow
        the smart money and you&apos;ll outperform&rdquo; — isn&apos;t supported by data.
        What 13F data legitimately <em>is</em>:
      </p>
      <ul className="list-disc pl-6 text-muted space-y-2 mb-4">
        <li>
          <strong className="text-text">Transparency.</strong> Regulators require 13F so the public can see
          who owns what at the end of each quarter. That&apos;s useful civic infrastructure.
        </li>
        <li>
          <strong className="text-text">Market color.</strong> Knowing that Buffett exited a
          position, or that Ackman is accumulating a new name, is genuinely informative — it tells you
          the holding exists, the magnitude, the conviction relative to their book.
        </li>
        <li>
          <strong className="text-text">Research input.</strong> 13F filings are a great watchlist
          generator. &ldquo;What does Druckenmiller think is interesting right now?&rdquo; is a
          reasonable starting point for deep-dive research.
        </li>
        <li>
          <strong className="text-text">Overlap + divergence analysis.</strong> When three value
          investors independently buy the same name, that&apos;s a stronger signal than any one of
          them buying alone — even if the absolute magnitude of the signal is still modest.
        </li>
      </ul>
      <p className="text-muted leading-relaxed mb-4">
        What it&apos;s NOT: a stock-picker. It&apos;s positional data, not predictive data.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
        5. What this means for HoldLens
      </h2>
      <p className="text-muted leading-relaxed mb-4">
        We&apos;ve re-framed the product. Ranking pages no longer say &ldquo;what to buy&rdquo; —
        they say &ldquo;what tracked superinvestors are buying.&rdquo; The ConvictionScore is
        positioned as a smart-money positioning tracker, not a predictor. Every ranking page shows
        a methodology link back to this backtest, so no user sees the score without seeing the
        caveat.
      </p>
      <p className="text-muted leading-relaxed mb-4">
        We&apos;re also re-running the backtest each quarter as new price data accumulates. If the
        correlation materially changes, we&apos;ll update this article and publish v2 of the
        methodology. Transparency over flattery is the thesis. Full script:{" "}
        <code className="text-xs px-1.5 py-0.5 bg-panel-hi rounded">scripts/backtest-conviction.ts</code>,
        full output:{" "}
        <code className="text-xs px-1.5 py-0.5 bg-panel-hi rounded">.claude/state/CONVICTION_BACKTEST.md</code>,
        both in the{" "}
        <a href="https://github.com/acevaultorg/holdlens" className="underline">public HoldLens repo</a>.
      </p>

      <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4">
        6. How to use HoldLens going forward
      </h2>
      <p className="text-muted leading-relaxed mb-4">
        Use it for what it is:
      </p>
      <ul className="list-disc pl-6 text-muted space-y-2 mb-4">
        <li>
          Check what specific managers you respect are buying/selling. The individual investor
          pages (<a href="/investor" className="underline">/investor</a>) show each manager&apos;s
          portfolio with their own 10-year ROI in the header — so you can see whether the manager
          has earned the right to influence your thinking.
        </li>
        <li>
          Use{" "}
          <a href="/similar-to/warren-buffett" className="underline">portfolio similarity</a>{" "}
          to find investors you haven&apos;t heard of who run books resembling managers you
          trust.
        </li>
        <li>
          Use{" "}
          <a href="/insiders" className="underline">Form 4 insider activity</a>{" "}
          to see which corporate insiders are buying their own stock. Insider buys — real CEO
          dollar, not 10b5-1 schedule — are the one smart-money signal with widely-documented
          positive alpha in the academic literature. Not featured in the ConvictionScore backtest
          but present in the data.
        </li>
        <li>
          Use the{" "}
          <a href="/compare" className="underline">comparison tools</a>{" "}
          to look at overlap between managers on specific tickers. Consensus across multiple
          independent books is more informative than any single position.
        </li>
      </ul>
      <p className="text-muted leading-relaxed mb-6">
        And please — don&apos;t trade off ConvictionScore alone. Do your own research. The
        backtest is the evidence that we mean it.
      </p>

      <p className="text-xs text-dim pt-8 border-t border-border mb-8">
        HoldLens is not a registered investment advisor. Nothing on this site is investment advice.
        Always do your own research. If you find errors in the backtest, email{" "}
        <a href="mailto:hello@holdlens.com" className="underline">hello@holdlens.com</a> —
        corrections are logged publicly with a timestamp.
      </p>

      <LearnReadNext currentSlug="do-hedge-fund-signals-work" />
    </div>
  );
}
