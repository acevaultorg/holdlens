import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import InvestingBooks from "@/components/InvestingBooks";
import AuthorByline from "@/components/AuthorByline";
import ShareStrip from "@/components/ShareStrip";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";
import TldrCard from "@/components/learn/TldrCard";
import OurView from "@/components/learn/OurView";
import CiteThisPage from "@/components/learn/CiteThisPage";

export const metadata: Metadata = {
  title: "How to interpret position changes in a 13F — read the delta",
  description:
    "A quarter-over-quarter 13F change can mean four things: new stake, full exit, add, or trim. Here's the methodology for reading the delta correctly — compare share counts not dollar values, weigh changes by portfolio share, and know which moves are noise.",
  alternates: { canonical: "https://holdlens.com/learn/how-to-interpret-changes-in-positions" },
  openGraph: {
    title: "How to interpret position changes in a 13F",
    description:
      "New stake, exit, add, trim — the read-the-delta methodology, and the traps that make most 13F change-reading wrong.",
    url: "https://holdlens.com/learn/how-to-interpret-changes-in-positions",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to interpret position changes in a 13F",
    description: "Compare share counts, not dollar values — and four more rules for reading quarterly deltas.",
    images: ["/og/home.png"],
  },
};

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Learn", item: "https://holdlens.com/learn" },
      { "@type": "ListItem", position: 3, name: "How to interpret position changes", item: "https://holdlens.com/learn/how-to-interpret-changes-in-positions" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "How to interpret position changes in a 13F — read the delta",
    description:
      "Methodology guide to reading quarter-over-quarter changes in 13F filings: the four delta types, share-count vs market-value comparison, portfolio-weight context, and the structural traps (lag, shorts, options, quarter-end snapshots) that distort naive readings.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/how-to-interpret-changes-in-positions",
    datePublished: "2026-06-11",
    dateModified: "2026-06-11",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "13F position changes",
      "how to interpret 13F changes",
      "new position 13F",
      "13F quarter over quarter",
      "hedge fund portfolio changes",
      "share count vs market value",
    ],
    citation: [
      "https://www.sec.gov/divisions/investment/13ffaq",
      "https://www.investor.gov/introduction-investing/investing-basics/glossary/form-13f",
      "https://www.sec.gov/files/form13f.pdf",
    ],
    about: [
      {
        "@type": "DefinedTerm",
        name: "Position delta",
        description:
          "The quarter-over-quarter change in a holding between two consecutive 13F filings. Four types: new position (absent → present), exit (present → absent), add (share count up), and trim (share count down).",
      },
      {
        "@type": "DefinedTerm",
        name: "Share count vs market value",
        description:
          "13Fs report both shares held and the position's market value at quarter-end. Market value moves with the stock price even when no shares were traded — so only the share count tells you whether the manager actually bought or sold.",
      },
      {
        "@type": "DefinedTerm",
        name: "Quarter-end snapshot",
        description:
          "A 13F shows holdings on one day — the last day of the quarter. Anything bought and sold within the quarter never appears, and positions can be adjusted right before the snapshot date.",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://holdlens.com/learn/how-to-interpret-changes-in-positions#faq",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why did a position's value change if the manager didn't trade?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Because 13Fs report market value at quarter-end. If a stock rose 30% during the quarter, the position's dollar value rises 30% with zero shares traded. Always compare share counts between quarters — never dollar values — to detect actual buying or selling.",
        },
      },
      {
        "@type": "Question",
        name: "Is a new 13F position a fresh idea?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not necessarily fresh — the filing arrives up to 45 days after quarter-end, so the purchase could be more than four months old. And a small new position may be a starter stake, a merger-arbitrage leg, or one side of a hedged trade rather than a high-conviction commitment.",
        },
      },
      {
        "@type": "Question",
        name: "Does a trim mean the manager turned negative on the stock?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Often not. Trims commonly reflect risk management after a big run-up, redemption-driven selling, or rebalancing. A trim that still leaves the position as a top holding reads very differently from a 90% liquidation — portfolio weight is the context that gives the delta meaning.",
        },
      },
    ],
  },
];

export default function HowToInterpretChangesPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/learn" className="text-xs text-muted hover:text-text">← Learn</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">How to interpret position changes in a 13F</h1>
      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Quarter-over-quarter, a 13F holding can do four things: appear (<strong className="text-text">new</strong>),
          disappear (<strong className="text-text">exit</strong>), grow (<strong className="text-text">add</strong>), or shrink
          (<strong className="text-text">trim</strong>). To read the delta correctly: compare{" "}
          <strong className="text-text">share counts, never dollar values</strong> (prices move values without any
          trading), weigh every change by its <strong className="text-text">share of the portfolio</strong>, and
          remember the data is a <a href="/learn/45-day-lag-explained" className="text-brand underline">45-day-lagged</a>,
          long-only, quarter-end snapshot.
        </TldrCard>

        <p className="text-lg text-muted">
          The raw fact of a change is easy to spot. The discipline is in deciding{" "}
          <strong className="text-text">how much information the change actually carries</strong> — and most naive
          readings get it wrong in one of five ways.
        </p>

        <AuthorByline date="2026-06-11" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The four delta types</h2>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">New position</strong> — absent last quarter, present now. The most-watched delta, and the most over-read: it may be a conviction stake or a tiny starter/arbitrage leg.</li>
          <li><strong className="text-text">Exit</strong> — present last quarter, gone now. Usually the cleanest signal in the set: a full liquidation is a deliberate decision, not drift.</li>
          <li><strong className="text-text">Add</strong> — share count increased. Meaning scales with size: +3% is rebalancing noise; doubling a top-10 holding is a statement.</li>
          <li><strong className="text-text">Trim</strong> — share count decreased. The most ambiguous delta: profit-taking, redemptions, and risk limits all produce trims without a view change.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Rule 1 — compare share counts, never dollar values</h2>
        <p className="text-muted">
          A 13F line item reports both <em>shares held</em> and <em>market value at quarter-end</em>. The
          value column moves with the stock price even when the manager did nothing. A position that
          &ldquo;grew 30%&rdquo; in dollars while the share count stayed flat means exactly one thing:{" "}
          <strong className="text-text">the stock went up</strong>. Every change-detection method that diffs dollar
          values instead of share counts manufactures phantom trades.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Rule 2 — weigh the change by portfolio share</h2>
        <p className="text-muted">
          A $50&nbsp;million add means nothing without the denominator. For a $40&nbsp;billion book it is a
          rounding error; for a $500&nbsp;million concentrated fund it is a tenth of the portfolio. Express
          every delta as a <strong className="text-text">change in portfolio weight</strong>, and check whether the
          holding sits in the manager&rsquo;s top 10 — that is where concentrated managers express actual
          conviction, per <a href="/learn/conviction-score-explained" className="text-brand underline">how ConvictionScore weighs positions</a>.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-10 mb-3">Rule 3 — respect what the snapshot can't show</h2>
        <ul className="text-muted space-y-2 list-disc list-inside">
          <li><strong className="text-text">The lag</strong> — filings land up to 45 days after quarter-end; the trade itself may be 135 days old. The manager may already have reversed it.</li>
          <li><strong className="text-text">Long-only view</strong> — a &ldquo;bullish-looking&rdquo; long can be one leg of a hedged or arbitrage trade whose <a href="/learn/why-13f-doesnt-show-shorts" className="text-brand underline">short side is invisible</a>.</li>
          <li><strong className="text-text">One-day snapshot</strong> — positions opened and closed inside the quarter never appear at all.</li>
          <li><strong className="text-text">Options entries</strong> — 13Fs disclose listed puts and calls as share-equivalents; a &ldquo;new position&rdquo; line can be an options overlay, not common stock.</li>
          <li><strong className="text-text">No cost basis</strong> — the filing never says what the manager paid or whether the position is profitable.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Rule 4 — clusters carry more information than singles</h2>
        <p className="text-muted">
          One manager initiating a stake is an anecdote. <strong className="text-text">Several unrelated managers
          initiating the same name in the same quarter</strong> is a pattern — independent research processes
          arriving at the same conclusion at similar prices. This is the descriptive logic behind
          HoldLens&rsquo;s <a href="/learn/conviction-score-explained" className="text-brand underline">ConvictionScore</a>:
          it aggregates the tracked cohort&rsquo;s net buying and selling per stock into one −100&nbsp;to&nbsp;+100
          measure of <em>what the cohort did</em> — cohort behavior, not a recommendation.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Rule 5 — know the boring explanations first</h2>
        <p className="text-muted">
          Before reading meaning into a delta, eliminate the mechanical causes: index inclusion
          rebalancing, redemption-driven selling across the whole book (every position trimmed
          proportionally), tax-loss harvesting in Q4, risk limits triggered by a run-up, and spin-offs or
          mergers that convert one line item into another. A manager-level pattern — <em>everything</em>{" "}
          trimmed 8% — is a flow story, not fifty separate opinions.
        </p>

        <OurView>
          <p>
            Most 13F commentary fails at Rule 1 and Rule 2 simultaneously — headlines about a fund
            &ldquo;pouring money into&rdquo; a stock that, checked against share counts and portfolio weight, turn
            out to be price drift on an unchanged position. The delta table is not the analysis; it is
            the input to the analysis.
          </p>
          <p>
            Our backtest of 221 ticker-quarter pairs found{" "}
            <a href="/learn/do-hedge-fund-signals-work" className="text-brand underline">no predictive correlation</a>{" "}
            between cohort position changes and next-quarter returns. We publish the deltas because they
            are genuinely informative about <em>what disciplined investors are doing with real money</em> —
            not because following them mechanically works. Read the delta as evidence, not instruction.
          </p>
        </OurView>

        <InvestingBooks
          heading="Learn position analysis from the source"
          sub="The managers whose deltas are worth reading learned position sizing and selling discipline from these books."
        />

        <p className="text-xs text-dim pt-8 border-t border-border mt-12">
          Not investment advice. 13F mechanics summarized from SEC Form 13F instructions and FAQ; verify
          against the primary sources linked above. See <a href="/methodology" className="underline">methodology</a> for
          how HoldLens computes quarter-over-quarter deltas and cohort aggregates.
        </p>

        <CiteThisPage />
        <LearnReadNext currentSlug="how-to-interpret-changes-in-positions" />

        <ShareStrip url="https://holdlens.com/learn/how-to-interpret-changes-in-positions" title="How to interpret position changes in a 13F" />

        <AdSlot format="horizontal" priority="secondary" />

        <section className="mt-10 border-t border-border pt-6">
          <h2 className="text-base font-bold text-text mb-3">See every delta computed live on HoldLens</h2>
          <p className="text-sm text-muted leading-relaxed">
            <a href="/new-positions/" className="text-brand hover:underline">New positions this quarter</a>
            {", "}
            <a href="/exits/" className="text-brand hover:underline">full exits</a>
            {", and "}
            <a href="/conviction-leaders/" className="text-brand hover:underline">conviction leaders</a>
            {" across the 30 tracked superinvestors — share-count-based, portfolio-weighted, lag-labeled. "}
            {"Related explainers: "}
            <a href="/learn/how-to-read-a-13f" className="text-brand hover:underline">how to read a 13F</a>
            {", "}
            <a href="/learn/copy-trading-myth" className="text-brand hover:underline">the copy-trading myth</a>
            {", "}
            <a href="/learn/how-do-hedge-funds-disclose-positions" className="text-brand hover:underline">the full disclosure matrix</a>
            {"."}
          </p>
        </section>
      </div>
    </div>
  );
}
