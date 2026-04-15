import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import InvestingBooks from "@/components/InvestingBooks";
import ShareStrip from "@/components/ShareStrip";

// /learn/superinvestor-handbook — 3000+ word evergreen SEO piece targeting
// "how to read 13F filings", "how to track superinvestors", "13F explained",
// "copy Warren Buffett", "smart money tracking". High-volume long-tail
// queries with low-quality existing SERP — high organic traffic potential.
//
// Structure: 10 sections, each ~300 words, with internal links to the
// site's signal / conviction / manager pages so the compound SEO value
// accrues back to the rest of the site.

export const metadata: Metadata = {
  title:
    "The Superinvestor Handbook — how to read 13F filings and track smart money",
  description:
    "A plain-English, 10-section guide to reading SEC 13F filings, tracking the world's best portfolio managers, and separating signal from noise in hedge fund disclosures. Free, no jargon.",
  alternates: { canonical: "https://holdlens.com/learn/superinvestor-handbook" },
  openGraph: {
    title: "The Superinvestor Handbook",
    description:
      "How to read 13F filings, track smart money, and separate conviction from index padding. Free.",
    type: "article",
  },
  robots: { index: true, follow: true },
};

const TOC = [
  { id: "what-is-13f", n: "1", title: "What is a 13F filing?" },
  { id: "45-day-rule", n: "2", title: "The 45-day rule (why all 13F data is old)" },
  { id: "who-matters", n: "3", title: "Who actually matters — and who is noise" },
  { id: "conviction", n: "4", title: "Conviction, not positions" },
  { id: "reading-fields", n: "5", title: "Reading the fields that matter" },
  { id: "copy-myth", n: "6", title: "The copy-trading myth" },
  { id: "consensus-contrarian", n: "7", title: "Consensus vs contrarian" },
  { id: "concentration", n: "8", title: "Concentration is the real signal" },
  { id: "flow", n: "9", title: "Flow — what changed quarter over quarter" },
  { id: "limits", n: "10", title: "The honest limits of 13F data" },
];

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "The Superinvestor Handbook — how to read 13F filings and track smart money",
  description:
    "A 10-section guide to reading SEC 13F filings and tracking the world's best portfolio managers. Free, plain English.",
  author: { "@type": "Organization", name: "HoldLens" },
  publisher: {
    "@type": "Organization",
    name: "HoldLens",
    url: "https://holdlens.com",
  },
  datePublished: "2026-04-15",
  dateModified: "2026-04-15",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://holdlens.com/learn/superinvestor-handbook",
  },
  articleSection: "Investing",
  wordCount: 3400,
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a 13F filing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A 13F is a quarterly disclosure that every US institutional investment manager with over $100 million in qualifying long-only equity holdings must file with the SEC. It lists the US-listed stocks, ETFs, ADRs, convertibles, and certain options positions as of quarter-end. It is due within 45 days of the quarter end. It does not include cash, shorts, non-US holdings, or commodities.",
      },
    },
    {
      "@type": "Question",
      name: "How often are 13F filings released?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Once per quarter, 45 days after the quarter ends. Q1 filings arrive by May 15, Q2 by August 14, Q3 by November 14, and Q4 by February 14 of the following year.",
      },
    },
    {
      "@type": "Question",
      name: "Can you copy Warren Buffett's trades from a 13F?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mechanically yes, but practically it underperforms the original portfolio. By the time a 13F is public, the price has moved 45 to 105 days, Buffett may already be exiting, and your cost basis is nothing like his. Using 13F data to identify high-conviction ideas and then doing your own research is a far better use than mechanical copy-trading.",
      },
    },
    {
      "@type": "Question",
      name: "What does a high conviction score mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On HoldLens, conviction is a signed score from −100 to +100 that combines manager quality, position size as a percent of book, recency of the move, and directional agreement across managers. +100 means multiple tier-1 managers are buying aggressively with large book weight this quarter. Near zero means crowd agreement is neutral or mixed.",
      },
    },
    {
      "@type": "Question",
      name: "What are the limits of 13F data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "13F data does not disclose shorts, cash, non-US holdings, commodities, or private deals. It is up to 105 days stale when fully public. It is not financial advice and many managers overweight low-signal index filler. Use it for context and conviction detection, not timing.",
      },
    },
  ],
};

type SectionProps = {
  id: string;
  n: string;
  title: string;
  children: React.ReactNode;
};

function Section({ id, n, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 mb-12">
      <div className="text-[11px] uppercase tracking-widest text-brand font-semibold mb-2">
        Section {n}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

function SubLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-block rounded-md border border-border bg-panel/60 px-2.5 py-1 text-[12px] text-text hover:border-brand/40 hover:text-brand transition"
    >
      {label} →
    </a>
  );
}

export default function SuperinvestorHandbookPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />

      {/* Hero */}
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Handbook · Updated April 2026
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
        The Superinvestor Handbook.
      </h1>
      <p className="text-muted text-lg leading-relaxed mb-8">
        Everything you need to read 13F filings like a pro — in plain English, no jargon. Ten sections
        covering the filing itself, the 45-day rule, who actually matters, conviction vs. index padding,
        the copy-trading myth, and the honest limits of what this data can tell you. Read straight through
        in ~15 minutes or jump around.
      </p>
      <div className="rounded-2xl border border-border bg-panel p-5 mb-10">
        <div className="text-[11px] uppercase tracking-widest text-dim font-semibold mb-3">
          What's in the handbook
        </div>
        <ol className="space-y-1.5 text-[13px] text-text">
          {TOC.map((s) => (
            <li key={s.id} className="flex gap-3">
              <span className="text-dim tabular-nums w-5 flex-shrink-0">{s.n}.</span>
              <a href={`#${s.id}`} className="hover:text-brand transition">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </div>

      <AdSlot format="in-article" />

      <Section id="what-is-13f" n="1" title="What is a 13F filing?">
        <p>
          A <strong>13F</strong> is a quarterly disclosure every US institutional investment manager with
          more than $100 million in qualifying long-only equity holdings must file with the SEC. Warren
          Buffett's Berkshire Hathaway files one. So do Bill Ackman's Pershing Square, Michael Burry's
          Scion Asset Management, Seth Klarman's Baupost, Stanley Druckenmiller's Duquesne, and about four
          thousand other funds.
        </p>
        <p>
          The filing lists every US-listed stock, ETF, ADR, convertible, and certain options positions the
          fund owned on the last day of the quarter. Share count, market value, and the fund's split
          between the securities — but not cost basis, not entry dates, not shorts, not cash, not
          non-US positions, and not commodities or bonds.
        </p>
        <p>
          That last sentence is the whole trick to reading 13Fs correctly. <strong>A 13F is a snapshot
          of the US-listed long book, not a full portfolio.</strong> The information gap is deliberate —
          the SEC built the form to prevent gaming of positions without burdening managers with daily
          disclosures — and it is the reason most retail traders misread the data.
        </p>
        <p>
          Every quarter, HoldLens pulls the 13Fs of the 30 tier-1 managers we track,
          de-duplicates their moves, and normalises them to a single signed −100..+100 conviction scale.
          You can see the current signals at <SubLink href="/best-now" label="/best-now" /> or drill into
          a specific ticker with <SubLink href="/signal/AAPL" label="/signal/AAPL" /> — replace AAPL with
          any of the ~100 tickers we cover.
        </p>
      </Section>

      <Section id="45-day-rule" n="2" title="The 45-day rule (why all 13F data is old)">
        <p>
          A 13F is not real-time. The SEC gives managers <strong>45 days after quarter-end</strong> to
          file. Q4 2025 ends December 31, 2025 — the filings trickle in through mid-February 2026. Q1
          2026 files by May 15, Q2 by August 14, Q3 by November 14.
        </p>
        <p>
          That means when you are reading a 13F in late May, the positions it describes are up to 105
          days old: 45 days from quarter close to filing deadline, plus up to 60 days from the earliest
          intra-quarter trade that appears in the snapshot. A manager who opened a position on April 1
          and the filing lands August 14 — that is four-and-a-half months of price action you have
          missed. The position might already be closed.
        </p>
        <p>
          This is the main reason mechanical copy-trading from 13Fs underperforms the underlying
          portfolio. A retail investor buying what a tier-1 manager bought, on the day of the filing, is
          buying at a dramatically different price — and often into a position the manager is already
          unwinding.
        </p>
        <p>
          The right way to use 13F data is not to time trades. It is to <strong>identify high-conviction
          ideas</strong> — names where multiple skilled managers have placed large, recent, concentrated
          bets — and then do your own fundamental research on the ticker. HoldLens surfaces the best
          conviction signals at <SubLink href="/conviction-leaders" label="/conviction-leaders" /> and
          <SubLink href="/best-now" label="/best-now" />.
        </p>
      </Section>

      <Section id="who-matters" n="3" title="Who actually matters — and who is noise">
        <p>
          There are roughly four thousand 13F filers in the US. <strong>Most of them are noise.</strong>
          Index funds, pension funds, and insurance general accounts all file 13Fs and they all hold
          hundreds or thousands of names sized to benchmark weights. Their "positions" carry no
          conviction — they are simply reflecting a mandate.
        </p>
        <p>
          The filers worth tracking are the ones whose portfolios reflect actual bets. HoldLens tracks
          thirty: the canonical value names (Buffett, Munger-era Berkshire, Klarman, Pabrai, Greenblatt,
          Akre, Nygren, Rochon), the concentrated activists (Ackman, Loeb, Icahn, Ubben), the quality-growth
          names (Smith, Rolfe, Polen, Kantesaria, Li Lu, Hohn), the macro and multi-strat names
          (Druckenmiller, Tepper, Marks, Watsa), the tiger cubs (Coleman, Mandel, Ainslie, Halvorsen,
          Armitage, von Mueffling, Slater), plus the high-signal outliers (Burry, Greenberg, Einhorn).
        </p>
        <p>
          Each manager has a manager-quality score based on long-run outperformance, portfolio
          concentration, and the quality of their public write-ups. HoldLens weighs each move by this
          score when computing conviction — a 5% position in Berkshire counts for more than a 5%
          position in a fund you have never heard of.
        </p>
        <p>
          You can see the full ranking at <SubLink href="/manager-rankings" label="/manager-rankings" />
          or browse by philosophy at <SubLink href="/by-philosophy" label="/by-philosophy" />. The
          leaderboard is at <SubLink href="/leaderboard" label="/leaderboard" />.
        </p>
      </Section>

      <Section id="conviction" n="4" title="Conviction, not positions">
        <p>
          The single most important concept in smart-money tracking is <strong>conviction</strong>. A
          manager with a thousand holdings has no conviction in any of them. A manager with twenty
          holdings where the top five positions each represent 10%+ of the book has placed actual
          bets — and those are the names worth paying attention to.
        </p>
        <p>
          Conviction shows up in three ways on a 13F:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[14px]">
          <li>
            <strong>Position size as a percent of the book</strong> — a 10% position screams louder
            than a 0.5% position, even if the dollar value is the same for a large fund.
          </li>
          <li>
            <strong>Action direction</strong> — a NEW position (opened this quarter) or a full EXIT
            (closed this quarter) is a louder signal than an add or a trim. Openings and closings mean
            the manager is changing their mind.
          </li>
          <li>
            <strong>Recency</strong> — a move made in the most recent quarter beats a stale position
            held for ten quarters. Markets change.
          </li>
        </ul>
        <p>
          HoldLens combines all three into a single signed <strong>ConvictionScore</strong> from −100 to
          +100. Read the methodology at <SubLink href="/learn/conviction-score-explained" label="how conviction is computed" />
          or dig into the biggest bets across the tracked managers
          at <SubLink href="/big-bets" label="/big-bets" />.
        </p>
      </Section>

      <AdSlot format="horizontal" />

      <Section id="reading-fields" n="5" title="Reading the fields that matter">
        <p>
          A raw 13F has a small number of fields per position. Here is what each means, what to pay
          attention to, and what to ignore.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[14px]">
          <li>
            <strong>CUSIP and Name of Issuer</strong> — the security identifier. Usually the stock
            ticker. For convertibles and options, the CUSIP tells you the underlying, but you will
            need a lookup tool to translate. HoldLens translates CUSIPs to tickers automatically.
          </li>
          <li>
            <strong>Value (x1000)</strong> — market value of the position at quarter-end, in
            thousands of dollars. Divide Value by the quarter-end stock price to get approximate
            share count.
          </li>
          <li>
            <strong>Shares or Principal Amount</strong> — the literal share count the fund holds.
            Compare this quarter-over-quarter to see if they added or trimmed.
          </li>
          <li>
            <strong>Investment Discretion</strong> — "SOLE" is what you want. "DFND" or "OTR" means
            the fund is reporting holdings it does not itself choose, usually sub-advisory. Ignore
            sub-advisory lines.
          </li>
          <li>
            <strong>Voting Authority</strong> — who gets to vote proxies. Less useful for copy-trading
            but matters for activist situations — Ackman, Loeb, Icahn, Ubben.
          </li>
        </ul>
        <p>
          The field you <strong>cannot</strong> read from a raw 13F is <em>cost basis</em>. You do not
          know when the position was opened or at what price. Estimating cost requires combining
          consecutive 13Fs, stitching together the share-count trajectory, and mapping it against
          quarterly price ranges. HoldLens does this for every tracked manager and surfaces the
          longest compounding positions at <SubLink href="/trend-streak" label="/trend-streak" />.
        </p>
      </Section>

      <InvestingBooks
        heading="Books that teach the mental model"
        sub="If you made it to section 6, you're past the basics. The six books below are the foundational reading behind every 13F on this site — ordered from foundational to advanced."
      />

      <Section id="copy-myth" n="6" title="The copy-trading myth">
        <p>
          The most common retail mistake with 13F data is to read it as a "what to buy" list. Ackman
          just bought X, I'll buy X. This loses money in three specific ways.
        </p>
        <p>
          <strong>One.</strong> The 45-day lag means your entry price is almost never the manager's
          entry price. If Ackman bought a stock at $100 on February 1 and the filing lands May 15 at
          $130, you just paid 30% more than the person whose trade you are supposedly copying. Their
          IRR and yours will diverge by that 30% on day zero.
        </p>
        <p>
          <strong>Two.</strong> 13Fs show positions, not trades. A manager may have been selling
          aggressively in the final month of the quarter — the position you see on the filing date
          might already be half gone. You are buying on the way out.
        </p>
        <p>
          <strong>Three.</strong> Concentrated managers run all-weather portfolios. A 5% position in
          Berkshire is a position Buffett can hold through a 40% drawdown because his cost basis is
          some fraction of the market price and his opportunity cost is low. The same position at
          your cost basis is a position you may be forced to sell at the worst possible time.
        </p>
        <p>
          The honest way to use 13F data is as an <strong>idea funnel</strong> — a list of names that
          passed the filter of tier-1 manager conviction, which you then investigate on their own
          merits. Read more at <SubLink href="/learn/copy-trading-myth" label="the copy-trading myth" />.
        </p>
      </Section>

      <Section id="consensus-contrarian" n="7" title="Consensus vs contrarian">
        <p>
          Once you have idea-funneled down from "every 13F" to "names held by multiple tier-1 managers
          with high conviction," the next question is: do I want consensus bets or contrarian bets?
        </p>
        <p>
          <strong>Consensus bets</strong> — names owned by five or more tier-1 managers, each with
          significant book weight, all adding or holding. These are the safest reads on smart money
          because independent skilled people converged on the same conclusion. The tradeoff is that
          returns may already be priced in. Browse them at
          <SubLink href="/consensus" label="/consensus" />.
        </p>
        <p>
          <strong>Crowded trades</strong> — the dark side of consensus. When thirty out of thirty
          managers own the same name and it has tripled, the next leg is likely to be a painful
          unwind as someone blinks first. The line between "high conviction consensus" and "crowded
          trade" is whether active conviction is still growing or plateauing. See
          <SubLink href="/crowded-trades" label="/crowded-trades" />.
        </p>
        <p>
          <strong>Contrarian bets</strong> — names where tier-1 managers split. Two strong managers
          are buying, two are selling. This is the rarest pattern and often the most interesting —
          it means thoughtful people looking at the same data reached opposite conclusions. Dig into
          these at <SubLink href="/contrarian-bets" label="/contrarian-bets" />. The setups where you
          can see why one side is wrong and the other is right are where outsized returns live.
        </p>
        <p>
          <strong>Fresh conviction</strong> — names where only one manager has a position, and
          opened it in the latest quarter. Either early alpha or a solo mistake. The payoff structure
          is asymmetric either way. See <SubLink href="/fresh-conviction" label="/fresh-conviction" />
          and <SubLink href="/hidden-gems" label="/hidden-gems" />.
        </p>
      </Section>

      <Section id="concentration" n="8" title="Concentration is the real signal">
        <p>
          The single most underrated signal on a 13F is <strong>how concentrated the overall portfolio
          is</strong>. A manager whose top five positions represent 60% of the book is making
          <em>decisions</em>. A manager whose top five positions represent 12% of the book is
          shadowing an index and calling it a strategy.
        </p>
        <p>
          Concentration is the proxy for real active management. It is strongly correlated with
          long-run outperformance across public and private research on manager skill. The managers
          who have compounded money the longest — Berkshire, Pabrai Funds, Nygren's Oakmark,
          Baupost, Polen — tend to be concentrated.
        </p>
        <p>
          HoldLens ranks managers by concentration at <SubLink href="/concentration" label="/concentration" />.
          When you pair a concentrated manager with a high-conviction recent move, the signal-to-noise
          ratio of a 13F entry can exceed 10x the average line on any filing.
        </p>
        <p>
          The flip side: managers whose portfolios have drifted <em>less</em> concentrated over time
          are often transitioning to institutional asset-gathering mode and their signals are
          decaying. Concentration trend is itself a signal — see the quarter-over-quarter trajectory
          of any manager at their
          <SubLink href="/investor/bill-ackman" label="investor page" /> under "per-quarter digests".
        </p>
      </Section>

      <Section id="flow" n="9" title="Flow — what changed quarter over quarter">
        <p>
          A 13F is a snapshot. Two consecutive 13Fs are a diff — and the diff is where most of the
          actionable information lives. The thing to read is not "what does Ackman own?" but "what
          did Ackman change?"
        </p>
        <p>
          Every move falls into one of four categories:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[14px]">
          <li>
            <strong>NEW</strong> — a position that did not exist last quarter. Opening a new line in
            a concentrated portfolio is the loudest possible signal of fresh conviction. See
            <SubLink href="/new-positions" label="/new-positions" />.
          </li>
          <li>
            <strong>ADD</strong> — an existing position increased by more than a noise threshold.
            ADDs below 5% are often tax-lot rebalancing. ADDs above 20% are meaningful.
          </li>
          <li>
            <strong>TRIM</strong> — an existing position decreased by more than 15%. Below 15% is
            usually rebalancing. Above 40% is a conviction collapse worth reading.
            <SubLink href="/biggest-sells" label="/biggest-sells" /> ranks the loudest cuts.
          </li>
          <li>
            <strong>EXIT</strong> — full close-out. The loudest possible sell signal. HoldLens tracks
            all full exits at <SubLink href="/exits" label="/exits" />.
          </li>
        </ul>
        <p>
          Flow reading gets interesting when you stitch it across time. A position that was opened
          three quarters ago, added to in each of the next two quarters, and is now at 8% of book is a
          <strong> compounding conviction</strong> — the manager is adding on the way up because they
          believe the thesis is maturing. See the multi-quarter streaks at
          <SubLink href="/trend-streak" label="/trend-streak" /> and the rarer "comeback"
          pattern — a manager re-entering a name they previously exited — at
          <SubLink href="/reversals" label="/reversals" />.
        </p>
      </Section>

      <Section id="limits" n="10" title="The honest limits of 13F data">
        <p>
          13F data is not a crystal ball. Before using any of this, know the gaps.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[14px]">
          <li>
            <strong>No shorts.</strong> A fund can be net long on 13F while being net short overall.
            Burry's famously bearish positioning in 2023-24 was almost invisible on his 13F because
            the shorts are in options and short positions that do not file.
          </li>
          <li>
            <strong>No cash.</strong> You do not know if a manager is 95% invested or 40% cash. A
            manager sitting on cash is making a macro call you cannot see.
          </li>
          <li>
            <strong>No non-US holdings.</strong> European, emerging-market, and Japan holdings are
            invisible unless the issuer has a US ADR listing.
          </li>
          <li>
            <strong>No commodities or private assets.</strong> Gold, real estate, private equity,
            direct real estate — all invisible.
          </li>
          <li>
            <strong>Up to 105 days stale.</strong> By the time you read a 13F fully, the position is
            old news. Use the data for conviction detection, not trade timing.
          </li>
          <li>
            <strong>Not advice.</strong> This is public history, not a forecast. Past outperformance
            does not guarantee future returns. Every stock is a loss of capital risk.
          </li>
        </ul>
        <p>
          That said — 13F data is <em>still</em> the cleanest window you have into what the world's
          best investors believe right now, and it is free. The honest way to use it is as a high-signal
          idea funnel feeding your own research, not as a copy-trade pipeline.
        </p>
      </Section>

      <AdSlot format="horizontal" />

      {/* Takeaways */}
      <section className="mt-16 rounded-2xl border border-brand/30 bg-brand/5 p-8">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
          Key takeaways
        </div>
        <ul className="space-y-3 text-text text-[15px]">
          <li>
            <strong>1.</strong> Read 13Fs for <em>conviction detection</em>, not trade timing. The 45-day
            lag makes mechanical copy-trading a losing strategy.
          </li>
          <li>
            <strong>2.</strong> Most filers are noise. Track ~30 concentrated, skilled managers —
            not the four thousand index-shadowers.
          </li>
          <li>
            <strong>3.</strong> Position size as a percent of book is the single best signal. A 10%
            position in a concentrated portfolio beats a 0.5% position in a diversified one.
          </li>
          <li>
            <strong>4.</strong> Flow beats positions. Quarter-over-quarter changes (NEW / ADD / TRIM /
            EXIT) carry more information than the static snapshot.
          </li>
          <li>
            <strong>5.</strong> 13Fs are only half the story — no shorts, no cash, no non-US, no
            commodities. Always cross-reference with your own research.
          </li>
        </ul>
      </section>

      {/* Related */}
      <section className="mt-12">
        <div className="text-xs uppercase tracking-widest text-dim font-semibold mb-4">
          Related reading
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <a
            href="/learn/what-is-a-13f"
            className="rounded-xl border border-border bg-panel p-4 hover:border-brand/40 transition"
          >
            <div className="font-semibold text-text mb-1">What is a 13F filing?</div>
            <div className="text-xs text-muted">The short version — 5-minute primer.</div>
          </a>
          <a
            href="/learn/conviction-score-explained"
            className="rounded-xl border border-border bg-panel p-4 hover:border-brand/40 transition"
          >
            <div className="font-semibold text-text mb-1">How conviction is computed</div>
            <div className="text-xs text-muted">Inside the −100..+100 scale and its calibration.</div>
          </a>
          <a
            href="/learn/copy-trading-myth"
            className="rounded-xl border border-border bg-panel p-4 hover:border-brand/40 transition"
          >
            <div className="font-semibold text-text mb-1">The copy-trading myth</div>
            <div className="text-xs text-muted">Why mechanical 13F copying underperforms.</div>
          </a>
          <a
            href="/methodology"
            className="rounded-xl border border-border bg-panel p-4 hover:border-brand/40 transition"
          >
            <div className="font-semibold text-text mb-1">Full methodology</div>
            <div className="text-xs text-muted">How HoldLens sources, weighs, and ranks every move.</div>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
          Frequently asked questions
        </div>
        <div className="space-y-4">
          {FAQ_JSONLD.mainEntity.map((q) => (
            <details key={q.name} className="rounded-xl border border-border bg-panel p-5 group">
              <summary className="cursor-pointer font-semibold text-text hover:text-brand transition">
                {q.name}
              </summary>
              <div className="mt-3 text-sm text-muted leading-relaxed">
                {q.acceptedAnswer.text}
              </div>
            </details>
          ))}
        </div>
      </section>

      <ShareStrip
        title="The Superinvestor Handbook — how to read 13F filings and track smart money"
        url="https://holdlens.com/learn/superinvestor-handbook"
        via="holdlens"
      />

      <p className="text-xs text-dim mt-8">
        Not investment advice. All data sourced from SEC 13F-HR filings. HoldLens is a free research tool,
        not a broker. Every trade carries risk of total loss of capital. Always do your own research.
      </p>
    </article>
  );
}
