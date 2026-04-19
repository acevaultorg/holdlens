import type { Metadata } from "next";
import ShareStrip from "@/components/ShareStrip";
import AuthorByline from "@/components/AuthorByline";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";

// v1.26 — new /learn/ article. The 45-day lag is the single most misunderstood
// fact about 13F data, and also the one that separates honest sites from
// marketing-first sites. Competitors (Dataroma, StockCircle) bury this fact;
// HoldLens makes it the centerpiece of the trust pitch.
//
// Keywords targeted: "13f 45 day lag", "why 13f is delayed", "13f stale data",
// "13f vs real time", "how old is 13f data". All low-volume individually, high
// combined intent.

export const metadata: Metadata = {
  title: "The 45-day lag problem in 13F filings — and why it's a feature, not a bug",
  description:
    "SEC 13F filings are always 45 days late. Here's why that's by design, what you CAN still learn from them, and what to ignore.",
  alternates: { canonical: "https://holdlens.com/learn/45-day-lag-explained" },
  openGraph: {
    title: "The 45-day lag in 13F filings",
    description: "Why the SEC delays hedge fund disclosures by 45 days, and what it means for you.",
    url: "https://holdlens.com/learn/45-day-lag-explained",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The 45-day lag in 13F filings",
    images: ["/og/home.png"],
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
        name: "The 45-day lag in 13F filings",
        item: "https://holdlens.com/learn/45-day-lag-explained",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The 45-day lag problem in 13F filings — and why it's a feature, not a bug",
    description:
      "SEC 13F filings are always 45 days late. Here's why that's by design, what you CAN still learn from them, and what to ignore.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/45-day-lag-explained",
    datePublished: "2026-04-16",
    dateModified: "2026-04-16",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
  },
];

export default function FortyFiveDayLagPage() {
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
        The 45-day lag in 13F filings
      </h1>
      <p className="text-xl text-muted mb-10">
        Every 13F you read is a snapshot of what a hedge fund held{" "}
        <em>six-to-eleven weeks ago</em>. This is the single most important
        constraint to understand before using 13F data — and once you do, it
        stops being a limitation and starts being an asset.
      </p>

      <div className="space-y-6 text-text leading-relaxed">
        <AuthorByline date="2026-04-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The timeline</h2>
        <p className="text-muted">
          The SEC&apos;s Form 13F rule (§240.13f-1 of the Securities Exchange Act)
          gives institutional investment managers{" "}
          <strong className="text-text">45 calendar days after the end of each
          quarter</strong> to file. That means:
        </p>

        <div className="rounded-xl border border-border bg-panel p-6 my-6 text-sm">
          <div className="grid grid-cols-[100px_1fr] gap-y-3 gap-x-4 text-muted">
            <div className="text-text font-semibold">Q1</div>
            <div>Quarter ends Mar 31 → filings due by <strong className="text-text">May 15</strong></div>
            <div className="text-text font-semibold">Q2</div>
            <div>Quarter ends Jun 30 → filings due by <strong className="text-text">Aug 14</strong></div>
            <div className="text-text font-semibold">Q3</div>
            <div>Quarter ends Sep 30 → filings due by <strong className="text-text">Nov 14</strong></div>
            <div className="text-text font-semibold">Q4</div>
            <div>Quarter ends Dec 31 → filings due by <strong className="text-text">Feb 14</strong></div>
          </div>
        </div>

        <p className="text-muted">
          Most funds file on the last possible day — why disclose sooner than
          you have to? So when you read a Q1 filing on May 14, you&apos;re
          looking at positions{" "}
          <strong className="text-text">
            as they were on March 31, 45 days ago, in a world where the market
            has moved 10-15% in either direction since.
          </strong>
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Why the delay exists</h2>
        <p className="text-muted">
          It&apos;s not sloppy regulation. The 45-day window is a negotiated
          compromise with three constituencies:
        </p>

        <ol className="list-decimal ml-6 text-muted space-y-3">
          <li>
            <strong className="text-text">The funds</strong> get time to accumulate
            or unwind positions without broadcasting their intentions
            real-time. If disclosures were instant, front-runners would trade
            against the fund as soon as a new position appeared.
          </li>
          <li>
            <strong className="text-text">The SEC</strong> gets structured
            disclosure of institutional exposure — the whole point of the
            Securities Exchange Act of 1934. Without 13Fs, nobody outside the
            fund would know what $100M+ of US equities is doing.
          </li>
          <li>
            <strong className="text-text">Retail investors</strong> get a lagged
            but honest view of smart-money positioning. Stale data is better
            than no data, if you know how to use it.
          </li>
        </ol>

        <h2 className="text-2xl font-bold mt-10 mb-3">
          What the lag destroys (and what survives)
        </h2>
        <p className="text-muted">
          A lot of what retail investors try to do with 13Fs is actively
          destroyed by the lag. But not all of it.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-2 text-rose-400">
          What the lag destroys
        </h3>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            <strong className="text-text">Front-running.</strong> By the time
            you read that Ackman bought $420M of Chipotle, Ackman has either
            added more (cheap signal), trimmed (bad copy), or exited entirely
            (catastrophic copy). You cannot out-trade the man who already
            moved.
          </li>
          <li>
            <strong className="text-text">Swing trading.</strong> 13F data is
            useless for entries timed in days or weeks. It&apos;s calibrated
            for quarters or longer.
          </li>
          <li>
            <strong className="text-text">Catalyst-driven plays.</strong> If a
            drug trial reads out in April and Burry sold before it, you find
            out in mid-May — after the stock has already moved 40%.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-2 text-emerald-400">
          What survives the lag
        </h3>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            <strong className="text-text">Conviction clustering.</strong> When
            5-8 tracked managers all buy the same name in the same quarter,
            that&apos;s a strong signal regardless of 45-day lag. The consensus
            is the content, not the timing. See{" "}
            <a href="/consensus" className="text-brand underline">
              /consensus
            </a>.
          </li>
          <li>
            <strong className="text-text">Long-horizon theses.</strong> Buffett
            holding Coca-Cola since 1988 doesn&apos;t care about 45 days.
            Patient positions show up in 13Fs just fine.
          </li>
          <li>
            <strong className="text-text">Manager fingerprinting.</strong>{" "}
            Watching what a specific manager does across many quarters reveals
            their style (concentration, sector tilt, turnover) — and style is
            stable. See{" "}
            <a href="/investor/warren-buffett" className="text-brand underline">
              any manager page
            </a>
            .
          </li>
          <li>
            <strong className="text-text">Sector rotation.</strong> When the
            aggregate of tracked managers moves from financials to energy in
            a quarter, the direction of flow is still useful even at 45-day
            lag. See{" "}
            <a href="/rotation" className="text-brand underline">
              /rotation
            </a>
            .
          </li>
          <li>
            <strong className="text-text">Idea generation.</strong> 13Fs are
            terrible trade signals and excellent research starting points.
            &quot;Five smart people I respect are buying this — should I spend
            an hour understanding why?&quot; is valid. &quot;Five smart people
            bought this, I&apos;ll buy it too&quot; is not.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">
          How HoldLens handles the lag
        </h2>
        <p className="text-muted">
          We make the lag visible, not hidden:
        </p>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            Every move row shows the{" "}
            <strong className="text-text">actual filing date</strong> inline,
            not just the &quot;quarter&quot; — so you can see how old the data
            is at a glance.
          </li>
          <li>
            We render <strong className="text-text">price delta since filing</strong>{" "}
            next to every move (e.g. &quot;+18.3% since filing&quot;) — so you
            can see whether the market has already priced in the news. If the
            stock is up 20% since a superinvestor bought, your entry price is
            NOT their entry price.
          </li>
          <li>
            Our <strong className="text-text">ConvictionScore</strong> doesn&apos;t
            promise to predict next week. It tells you what the aggregate of
            tracked managers believes <em>as of the most recent filings</em>.
          </li>
          <li>
            On every quarter digest page we show the{" "}
            <strong className="text-text">next filing deadline</strong> prominently
            — so you know when the next wave of data arrives.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">The honest take</h2>
        <p className="text-muted">
          13F data is 45 days lagged. That&apos;s a fact. Sites that try to
          sell you &quot;real-time hedge fund signals&quot; are either lying or
          reselling press-release coverage. The legitimate use of 13F data is
          long-horizon, pattern-based, and honest about its limits.
        </p>
        <p className="text-muted">
          If you want to use it well: accept the lag, cluster the conviction,
          respect the concentration, and{" "}
          <a href="/learn/copy-trading-myth" className="text-brand underline">
            don&apos;t mechanically copy anyone
          </a>
          .
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Further reading</h2>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            <a href="/learn/what-is-a-13f" className="text-brand underline">
              What is a 13F filing?
            </a>{" "}
            — if you need the basics on what a 13F even is.
          </li>
          <li>
            <a href="/learn/how-to-read-a-13f" className="text-brand underline">
              How to read a 13F filing in 5 minutes
            </a>{" "}
            — field-by-field walkthrough.
          </li>
          <li>
            <a href="/learn/copy-trading-myth" className="text-brand underline">
              The copy-trading myth
            </a>{" "}
            — the companion piece on why you can&apos;t just mirror a 13F.
          </li>
          <li>
            <a href="/learn/what-is-alpha" className="text-brand underline">
              What is alpha?
            </a>{" "}
            — the concept that makes 13F analysis worthwhile despite the lag.
          </li>
        </ul>

        <div className="border-t border-border pt-6 mt-12">
          <p className="text-dim text-sm">
            HoldLens shows every 13F filing&apos;s actual date, the price
            change since filing, and which managers cluster on which ideas.
            Free, no signup, no paywall.
          </p>
        </div>
      </div>

      <LearnReadNext currentSlug="45-day-lag-explained" />

      <ShareStrip
        title="The 45-day lag in 13F filings — HoldLens"
        url="https://holdlens.com/learn/45-day-lag-explained"
        via="holdlens"
      />
    </div>
  );
}
