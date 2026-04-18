import type { Metadata } from "next";
import ShareStrip from "@/components/ShareStrip";
import AuthorByline from "@/components/AuthorByline";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";

// /learn/survivorship-bias-in-hedge-funds
//
// Target queries:
//   "survivorship bias hedge funds" (~590/mo, low competition)
//   "survivorship bias investing" (~4,400/mo, moderate)
//   "survivorship bias mutual funds" (~1,000/mo)
//   "fund graveyard" (~400/mo, niche)
//   "13F survivorship bias" (near-zero competition, owned)
//
// Unique angle: HoldLens can be honest about its own selection effect
// (we track 30 survivors) in a way no other tracking site admits. That
// honesty is the differentiator that makes this article HCU-safe and
// genuinely useful rather than fluff.
//
// Cross-links: /learn/what-is-alpha, /learn/copy-trading-myth,
// /learn/45-day-lag-explained, /investor, /learn/conviction-score-explained

export const metadata: Metadata = {
  title: "Survivorship Bias in Hedge Funds — Why the Dead Funds Matter",
  description:
    "Why every hedge fund performance number you read is probably wrong. How survivorship bias inflates track records, distorts 13F data, and what it means for how you use smart-money signals.",
  alternates: {
    canonical: "https://holdlens.com/learn/survivorship-bias-in-hedge-funds",
  },
  openGraph: {
    title: "Survivorship Bias in Hedge Funds",
    description:
      "Why the funds that blew up don't show up in the average — and how that makes every hedge fund performance stat you've read an overestimate.",
    url: "https://holdlens.com/learn/survivorship-bias-in-hedge-funds",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Survivorship Bias in Hedge Funds",
  },
};

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "HoldLens",
        item: "https://holdlens.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Learn",
        item: "https://holdlens.com/learn",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Survivorship Bias in Hedge Funds",
        item: "https://holdlens.com/learn/survivorship-bias-in-hedge-funds",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Survivorship Bias in Hedge Funds — Why the Dead Funds Matter",
    description:
      "Why every hedge fund performance number you read is probably wrong — and how survivorship bias distorts both track records and 13F smart-money signals.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage:
      "https://holdlens.com/learn/survivorship-bias-in-hedge-funds",
    datePublished: "2026-04-17",
    dateModified: "2026-04-17",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    about: {
      "@type": "DefinedTerm",
      name: "Survivorship Bias",
      description:
        "The logical error of concentrating on entities that passed a selection process while overlooking those that did not. In investing, it leads to overestimating the performance of active funds by ignoring those that failed and closed.",
    },
  },
];

export default function SurvivorshipBiasPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }}
      />

      <a href="/learn" className="text-xs text-muted hover:text-text">
        ← All guides
      </a>

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">
        Learn
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
        Survivorship bias in hedge funds
      </h1>
      <p className="text-xl text-muted mb-10">
        Every hedge fund performance number you&apos;ve read is probably an
        overestimate.{" "}
        <strong className="text-text">
          The funds that blew up don&apos;t show up in the average.
        </strong>{" "}
        Here&apos;s why that matters for how you use 13F data.
      </p>

      <div className="space-y-6 text-text leading-relaxed">
        <AuthorByline date="2026-04-17" />

        {/* Section 1 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          What is survivorship bias?
        </h2>
        <p className="text-muted">
          Survivorship bias is what happens when you study only the
          entities that made it through a filter — and forget about the ones
          that didn&apos;t.
        </p>
        <p className="text-muted">
          The classic example comes from World War II. The statistician Abraham
          Wald was asked to help the US Air Force determine where to add armor to
          their bombers. They showed him data on bullet holes from planes that
          returned from missions. The obvious answer seemed to be: reinforce the
          parts that got hit most often. Wald said the opposite. The planes that
          took hits in those spots{" "}
          <em>came back</em>. The planes that got hit in the{" "}
          <strong className="text-text">other</strong> spots never returned to be
          counted. Reinforce the blank spots.
        </p>
        <p className="text-muted">
          The same logic applies to hedge funds, stock screens, sports analytics,
          startup advice, and practically anywhere a selection process has been
          running long enough to produce visible winners and invisible losers.
        </p>

        {/* Section 2 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          The hedge fund graveyard
        </h2>
        <p className="text-muted">
          The hedge fund industry is enormous — roughly 30,000 funds managing
          over $4 trillion worldwide as of 2024. It is also brutally Darwinian.
          Estimates vary, but credible research (Ackermann, McEnally &amp;
          Ravenscraft; Liang; more recently Eurekahedge) consistently finds{" "}
          <strong className="text-text">
            approximately 6–10% of hedge funds close every year
          </strong>
          . Some blow up. Some return capital to investors voluntarily. Some
          merge into larger platforms. But they disappear from the data.
        </p>
        <p className="text-muted">
          A fund launched in 2010 that blew up in 2015 after three losing years
          doesn&apos;t show up in a 2026 database query for &quot;hedge fund
          average returns.&quot; Its bad years are simply missing. The result:
          databases composed exclusively of living funds overstate historical
          performance by{" "}
          <strong className="text-text">roughly 2–4 percentage points per year</strong>{" "}
          according to most peer-reviewed estimates. That&apos;s not noise —
          that&apos;s the difference between a mediocre strategy and a great
          one.
        </p>
        <p className="text-muted">
          The HFRI Composite Index — the most cited hedge fund benchmark — has
          historically suffered from this problem. Its index construction
          methodologies have improved over time, but any database that relies
          solely on self-reported returns from living funds will inherit some
          version of it.
        </p>

        {/* Section 3 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          Why it inflates track records
        </h2>
        <p className="text-muted">
          Imagine 100 funds launch in January 2015. By January 2025, 50 of them
          have closed. Now a researcher asks: what was the average annualized
          return of hedge funds that launched in January 2015?
        </p>
        <p className="text-muted">
          If they can only access data from the 50 living funds, they get a
          number. If those 50 survived — even partially because of
          performance — the number is biased upward. The 50 dead funds had, by
          definition, worse trajectories. Missing their data makes the whole
          cohort look better than it was.
        </p>
        <p className="text-muted">
          This compounds over time in a particularly nasty way. A fund that
          loses 40% in Year 1 and closes has its returns counted for Year 1 in
          databases with backfill. But many databases only backfill{" "}
          <em>if</em> the fund voluntarily submitted data before closing —
          which funds with strong early returns are far more likely to do than
          funds that got off to a bad start. The selection bias is present at
          entry, not just at exit.
        </p>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            <strong className="text-text">Backfill bias:</strong> Funds that
            start reporting to a database often submit historical returns going
            back several years — but only if those historical returns were good
            enough to attract investors. Bad early records go unsubmitted.
          </li>
          <li>
            <strong className="text-text">Exit bias:</strong> Funds that close
            often stop reporting to databases in their final months, when
            performance is worst. Their worst quarters disappear.
          </li>
          <li>
            <strong className="text-text">Liquidation bias:</strong> A fund in
            wind-down mode may have illiquid positions that take months to mark
            to market. The final reported NAV may be more flattering than the
            actual recovery value.
          </li>
        </ul>

        {/* Section 4 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          The 13F-specific problem
        </h2>
        <p className="text-muted">
          13F filings are required for any institutional investment manager with
          over $100 million in &quot;Section 13(f) securities&quot; (US-listed
          equities and certain options) at the end of a calendar quarter. A
          fund that drops below $100M in assets — or liquidates — stops filing.
        </p>
        <p className="text-muted">
          This means the 13F universe is, by construction,{" "}
          <strong className="text-text">a live index of surviving funds</strong>.
          A manager who ran $2B in 2019, blew up during March 2020, and returned
          capital by December 2020 does not appear in any 2021 or later 13F
          analysis. Their pre-2020 filings exist in EDGAR, but they&apos;re not
          part of any &quot;what are the best managers doing now&quot; analysis
          because they&apos;re gone.
        </p>
        <p className="text-muted">
          The practical consequence: if you run a screen of &quot;what tickers
          do the top 50 institutional investors hold?&quot; using current 13F
          data, every one of those 50 managers survived whatever the market
          threw at them over the past 5–10 years. That&apos;s not random — it
          correlates, imperfectly, with skill. But it also introduces selection
          effects that are easy to miss.
        </p>

        {/* Section 5 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          The honest position HoldLens takes
        </h2>
        <p className="text-muted">
          HoldLens tracks{" "}
          <a href="/investor" className="text-brand underline">
            30 managers
          </a>{" "}
          — Buffett, Ackman, Druckenmiller, Klarman, Burry, Marks, Loeb, Tepper,
          Hohn, Coleman, and 20 others. Every one of them is still active.
          Every one of them has filed a 13F in the last two quarters.
        </p>
        <p className="text-muted">
          That means we have, definitionally, selected for survivors.
        </p>
        <p className="text-muted">
          We&apos;re not going to pretend otherwise. The managers we track were
          chosen because of their track records — long-term alpha generation,
          concentrated positions, and the kind of documented discipline that
          makes their signals worth following. Those selection criteria
          correlate with survival. We didn&apos;t pick them arbitrarily; we
          picked them because they&apos;re demonstrably good at what they do
          over multi-decade windows. That&apos;s a different kind of selection
          bias than random database survivorship — it&apos;s intentional curation
          of quality. But it&apos;s still a filter.
        </p>
        <p className="text-muted">
          What this means in practice: when you see a{" "}
          <a
            href="/learn/conviction-score-explained"
            className="text-brand underline"
          >
            ConvictionScore
          </a>{" "}
          weighted by a manager&apos;s historical alpha, that alpha was computed
          on a manager who has existed long enough to develop a track record.
          Managers who ran for two years, produced mediocre results, and closed
          are not in our dataset. That&apos;s a feature — we don&apos;t want
          their signals. But it&apos;s worth naming.
        </p>

        {/* Section 6 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          What survivorship bias is NOT saying
        </h2>
        <p className="text-muted">
          None of this means smart-money signals are useless. It&apos;s a
          calibration problem, not a disqualification.
        </p>
        <p className="text-muted">
          The managers we track aren&apos;t just lucky survivors. The academic
          literature on hedge fund persistence is mixed — luck explains much
          short-run outperformance — but at the extremes, over decades, skill
          is separable from luck. A 30+ year track record of compounding at
          20%+ annually is not a coin-flip outcome. Buffett, Druckenmiller,
          Klarman, and a handful of others have demonstrated something real.
        </p>
        <p className="text-muted">
          The lesson of survivorship bias is not &quot;ignore the data.&quot;
          It&apos;s &quot;apply the right discount.&quot;
        </p>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            When a data vendor claims &quot;hedge funds averaged 12% per year
            over the last decade,&quot;{" "}
            <strong className="text-text">
              discount by 2–4 percentage points
            </strong>{" "}
            for survivorship and backfill effects.
          </li>
          <li>
            When you read that &quot;the managers in our database beat the S&amp;P
            in 7 of the last 10 years,&quot;{" "}
            <strong className="text-text">
              ask who is excluded from that database
            </strong>{" "}
            — particularly any fund that closed in those same 10 years.
          </li>
          <li>
            When you use HoldLens signals,{" "}
            <strong className="text-text">
              treat them as research starting points
            </strong>
            , not buy signals. A consensus buy from five long-tenured
            superinvestors is strong evidence that a thesis is worth your
            research time. It is not proof the stock will go up.
          </li>
        </ul>

        {/* Section 7 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          The interaction with the 45-day lag
        </h2>
        <p className="text-muted">
          Survivorship bias interacts with{" "}
          <a href="/learn/45-day-lag-explained" className="text-brand underline">
            the 45-day lag in 13F filings
          </a>{" "}
          in a way that&apos;s easy to miss.
        </p>
        <p className="text-muted">
          When a fund starts closing during a quarter — in orderly wind-down or
          after a crisis — they&apos;re selling positions. If they sell enough
          to drop below the $100M threshold, they may not file for that
          quarter at all. The last 13F you see from a fund that closes is
          typically from before the drawdown that caused the closure. The
          portfolio is frozen in a pre-crisis snapshot that looks nothing like
          what actually happened to those positions.
        </p>
        <p className="text-muted">
          This means that when a manager disappears from the 13F landscape,
          their last known portfolio — often a large, concentrated, pre-blow-up
          book — can persist in aggregated data as if it were still a current
          consensus signal. Systems that don&apos;t explicitly expire or
          down-weight exited managers can spread stale signals.
        </p>
        <p className="text-muted">
          HoldLens addresses this by only including managers who have filed in
          the last two consecutive quarters. An inactive manager — whether
          they&apos;re in the process of closing or simply went below the $100M
          threshold — is automatically excluded from conviction calculations.
          Their historical data remains accessible on their profile page, but
          it&apos;s not weighted in current signals.
        </p>

        {/* Section 8 */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          How to use smart-money signals knowing all of this
        </h2>
        <p className="text-muted">
          Three practical calibrations:
        </p>
        <ol className="list-decimal ml-6 text-muted space-y-4">
          <li>
            <strong className="text-text">
              Weight by tenure, not just recent alpha.
            </strong>{" "}
            A manager with a 5-year track record is more likely to be a lucky
            survivor than one with 25 years. HoldLens&apos;s manager quality
            scores give higher weight to track records that span multiple full
            market cycles, including at least one major bear market. Anything
            less than 10 years deserves a discount.
          </li>
          <li>
            <strong className="text-text">
              Focus on conviction, not just holdings.
            </strong>{" "}
            Survivorship bias inflates the absolute performance numbers of any
            group. But the{" "}
            <em>relative</em> conviction signals — which positions are growing
            vs. shrinking, which are consensus buys across multiple managers
            vs. lone wolves — are less affected by who&apos;s missing from the
            dataset. A stock that five tenured superinvestors are all
            increasing is a stronger signal than absolute performance
            comparisons.
          </li>
          <li>
            <strong className="text-text">
              Never use aggregate hedge fund statistics without asking about
              the sample.
            </strong>{" "}
            &quot;Hedge funds returned X%&quot; is almost never the right
            number. Ask: which hedge funds? Over what period? Does the sample
            include funds that closed? Self-reported or audited? Any number
            that passes without those qualifiers is doing survivorship bias
            work on you.
          </li>
        </ol>

        {/* Section 9 — Alpha connection */}
        <h2 className="text-2xl font-bold mt-10 mb-3">
          The relationship to alpha
        </h2>
        <p className="text-muted">
          Survivorship bias and{" "}
          <a href="/learn/what-is-alpha" className="text-brand underline">
            alpha
          </a>{" "}
          are linked in a counterintuitive way. Because dead funds are excluded
          from most databases, the measured alpha of the &quot;average hedge
          fund&quot; looks higher than it really is. But the{" "}
          <em>existence</em> of survivorship bias also means that detecting
          true alpha is harder, not easier.
        </p>
        <p className="text-muted">
          If you&apos;re trying to determine whether a manager has skill or
          luck, you need to account for the fact that you&apos;re studying a
          manager who passed a multi-year survival test. That test is
          informative (surviving is not random), but it also means some of
          your sample&apos;s luck has already been filtered out at the
          data-collection stage. The remaining returns have already survived
          once. That compresses the noise — which makes the genuine skill
          signals more detectable, but also means you need longer windows to
          draw confident conclusions.
        </p>
        <p className="text-muted">
          In practical terms: don&apos;t conclude a manager has skill until
          you&apos;ve seen them navigate at least one complete market cycle
          including a meaningful drawdown. How they behave when their
          thesis is wrong, when redemptions are coming in, and when the market
          is offering them prices far below fair value — that&apos;s where
          skill separates from luck. Survivorship bias filters out the worst
          outcomes before you even see the data; you need to look hard at how
          your managers behaved during the hard periods they did survive.
        </p>

        {/* Further reading */}
        <h2 className="text-2xl font-bold mt-10 mb-3">Further reading</h2>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            <a href="/learn/what-is-alpha" className="text-brand underline">
              What is alpha?
            </a>{" "}
            — why most professional managers don&apos;t produce it, and what
            the ones who do have in common.
          </li>
          <li>
            <a
              href="/learn/45-day-lag-explained"
              className="text-brand underline"
            >
              The 45-day lag in 13F filings
            </a>{" "}
            — why all 13F data is six weeks stale by design, and how that
            interacts with fund closures.
          </li>
          <li>
            <a href="/learn/copy-trading-myth" className="text-brand underline">
              The copy-trading myth
            </a>{" "}
            — why mechanically copying 13F positions underperforms the
            underlying portfolio — including survivorship dynamics.
          </li>
          <li>
            <a
              href="/learn/conviction-score-explained"
              className="text-brand underline"
            >
              What is a ConvictionScore?
            </a>{" "}
            — how HoldLens weights signals by manager quality and tenure to
            reduce survivorship noise.
          </li>
          <li>
            <a href="/investor" className="text-brand underline">
              The 30 tracked superinvestors
            </a>{" "}
            — profiles with documented track records, including which market
            cycles they navigated.
          </li>
        </ul>

        <div className="border-t border-border pt-6 mt-12">
          <p className="text-dim text-sm">
            HoldLens parses 13F filings from 30 of the world&apos;s best
            long-term investors. Data updates quarterly within 45 days of each
            SEC filing deadline. Not financial advice — treat signals as
            research starting points.
          </p>
        </div>
      </div>

      <LearnReadNext currentSlug="survivorship-bias-in-hedge-funds" />

      <ShareStrip
        url="https://holdlens.com/learn/survivorship-bias-in-hedge-funds"
        title="Survivorship Bias in Hedge Funds — Why the Dead Funds Matter"
      />
    </div>
  );
}
