import type { Metadata } from "next";
import ShareStrip from "@/components/ShareStrip";
import AuthorByline from "@/components/AuthorByline";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";

// v1.24 — new /learn/ article. "What is alpha?" is a foundational concept
// that every investing site promises to explain and almost every one does it
// badly — either math-heavy without intuition (CFA textbook) or hand-wavy
// without rigor (YouTube). HoldLens can answer honestly because our whole
// product is about sorting managers who have alpha from managers who don't.
//
// This article links into /investor/[slug] (each manager has an alpha story),
// /learn/copy-trading-myth (why raw copy doesn't transfer alpha),
// /learn/conviction-score-explained (how we weight managers by alpha), and
// /simulate/* (backtest pages that show alpha in action).

export const metadata: Metadata = {
  title: "What is alpha? A plain English guide to the hedge fund edge",
  description:
    "The single concept behind every hedge fund's marketing deck. What alpha means, why 85% of managers don't have any, and how to spot the 15% who do.",
  alternates: { canonical: "https://holdlens.com/learn/what-is-alpha" },
  openGraph: {
    title: "What is alpha? The hedge fund edge, explained",
    description:
      "Why most professional investors don't beat the market — and what the 15% who do have in common.",
    url: "https://holdlens.com/learn/what-is-alpha",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "What is alpha?",
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
        name: "What is alpha?",
        item: "https://holdlens.com/learn/what-is-alpha",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "What is alpha? A plain English guide to the hedge fund edge",
    description:
      "The single concept behind every hedge fund's marketing deck — explained without jargon, with real numbers from tracked superinvestors.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/what-is-alpha",
    datePublished: "2026-04-16",
    dateModified: "2026-04-16",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    about: {
      "@type": "DefinedTerm",
      name: "Alpha",
      description:
        "In finance, alpha is the excess return of an investment strategy over its benchmark after adjusting for risk.",
    },
  },
];

export default function WhatIsAlphaPage() {
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
        What is alpha?
      </h1>
      <p className="text-xl text-muted mb-10">
        The number behind every hedge fund&apos;s marketing deck. In plain
        English: <strong className="text-text">alpha is the return you get that the market
        didn&apos;t give you for free.</strong>
      </p>

      <div className="space-y-6 text-text leading-relaxed">
        <AuthorByline date="2026-04-16" />

        <h2 className="text-2xl font-bold mt-10 mb-3">The 10-second definition</h2>
        <p className="text-muted">
          If the S&amp;P 500 returned 10% last year and your portfolio returned
          15%, your raw outperformance was 5 percentage points. Of those 5, some
          came from taking on more risk (leverage, concentration, small-caps).
          The rest — the part that came from{" "}
          <em>actually picking better</em> — is your alpha.
        </p>
        <p className="text-muted">
          Formally:{" "}
          <strong className="text-text">
            Alpha = Your return − (Risk-free rate + Beta × (Market return − Risk-free rate))
          </strong>
          . But don&apos;t get hung up on the formula. The thing you want to
          internalize: <strong className="text-text">alpha is the part of a return that
          skill produced, not exposure.</strong>
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Why most investors have none</h2>
        <p className="text-muted">
          The uncomfortable truth from four decades of research: 85% of active
          US fund managers underperform their benchmark after fees over any 10
          year window. The median &quot;professional&quot; investor has{" "}
          <strong className="text-text">negative alpha</strong>.
        </p>
        <p className="text-muted">
          This isn&apos;t because they&apos;re dumb. It&apos;s because:
        </p>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            <strong className="text-text">Markets are close to efficient.</strong>{" "}
            When thousands of smart people with trillions of dollars all look at
            the same public data, the easy edges get arbitraged away fast.
          </li>
          <li>
            <strong className="text-text">Fees eat excess return.</strong> A 1.5%
            management fee on a strategy that earns 1% alpha/year is a net −0.5%
            vs. the benchmark. The math has to clear a high bar.
          </li>
          <li>
            <strong className="text-text">Style drift kills compounding.</strong>{" "}
            Most funds drift toward benchmark-hugging because deviating costs
            them jobs if they underperform for 18 months — even if the long-run
            thesis was right.
          </li>
          <li>
            <strong className="text-text">Survivorship bias inflates the average.</strong>{" "}
            The funds that blew up don&apos;t show up in today&apos;s
            &quot;average active fund&quot; number. The true failure rate is
            higher than the brochures suggest.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">What the 15% have in common</h2>
        <p className="text-muted">
          The managers who <em>do</em> produce persistent alpha share
          surprisingly few traits. Looking at the{" "}
          <a href="/investor" className="text-brand underline">
            30 tracked superinvestors on HoldLens
          </a>{" "}
          — Buffett, Ackman, Klarman, Druckenmiller, Burry, Marks, Tepper, Hohn,
          Coleman, Li Lu — the common threads are not what most retail
          investors think:
        </p>
        <ol className="list-decimal ml-6 text-muted space-y-3">
          <li>
            <strong className="text-text">Concentration.</strong> Most run 20-40
            positions, not 300. Their top 10 positions are typically 60-85% of
            the book. <strong className="text-emerald-400">You can&apos;t outperform
            by owning everything.</strong>
          </li>
          <li>
            <strong className="text-text">Patience.</strong> Average holding period
            for Buffett&apos;s core positions is 15+ years. Druckenmiller famously
            holds some trades for weeks — but when he&apos;s wrong, he&apos;s out
            the next morning, not hoping.
          </li>
          <li>
            <strong className="text-text">A structural information edge.</strong>{" "}
            Hohn&apos;s TCI has a reputation for regulatory/legal depth no retail
            analyst can match. Druckenmiller has a macro network most
            generalists can&apos;t replicate. Value investors like Klarman run
            screens on esoteric securities (distressed debt, cross-holdings,
            special situations) that most funds don&apos;t touch.
          </li>
          <li>
            <strong className="text-text">Willingness to look wrong.</strong>{" "}
            Burry shorted housing in 2005 while his fund was down 20%. Buffett
            sat on $150B+ in cash through 2024&apos;s melt-up. Being alone with
            a thesis for 2+ years is what generates alpha — not consensus
            correctness.
          </li>
          <li>
            <strong className="text-text">Explicit loss aversion over gain
            seeking.</strong> Howard Marks wrote 20 years of memos before
            anyone cared. His central idea — &quot;the best investors make
            fewer mistakes&quot; — is boring, obvious, and almost never
            practiced.
          </li>
        </ol>

        <h2 className="text-2xl font-bold mt-10 mb-3">
          Alpha vs. beta, in pictures
        </h2>
        <p className="text-muted">
          <strong className="text-text">Beta</strong> is your portfolio&apos;s
          sensitivity to the market. A beta of 1.0 means you move with the S&amp;P.
          A beta of 1.5 means you move 1.5× as much. A beta of 0 (theoretically)
          means you&apos;re uncorrelated.
        </p>
        <p className="text-muted">
          <strong className="text-text">Alpha</strong> is everything else. If your
          portfolio&apos;s beta is 1.2 and the market returned 10%, your
          &quot;market exposure return&quot; was 12%. If your actual return was
          15%, your alpha is 3 percentage points. If your actual return was 9%,
          your alpha is <strong className="text-rose-400">−3</strong> — you
          underperformed even adjusting for your higher market exposure.
        </p>
        <p className="text-muted">
          This is why a 30% year for a tech-heavy fund during a tech bull market
          isn&apos;t impressive. And it&apos;s why a 4% year for a macro fund
          when the market dropped 20% is exceptional.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">
          How HoldLens uses alpha
        </h2>
        <p className="text-muted">
          Every manager on HoldLens has a quality score derived from their
          historical alpha-over-benchmark. When you see{" "}
          <a href="/learn/conviction-score-explained" className="text-brand underline">
            the signed −100..+100 ConvictionScore
          </a>
          , it&apos;s weighted by this quality — a buy from a manager with a
          decade of +8% alpha counts more than a buy from a manager with a
          decade of +0.2% alpha.
        </p>
        <p className="text-muted">
          That&apos;s the honest use case. We don&apos;t claim to predict
          tomorrow&apos;s alpha — we rank today&apos;s smart-money conviction
          by yesterday&apos;s demonstrated ability to produce it.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">
          What not to do with this knowledge
        </h2>
        <p className="text-muted">
          Mechanically copying a high-alpha manager&apos;s 13F doesn&apos;t
          transfer their alpha to you.{" "}
          <a href="/learn/copy-trading-myth" className="text-brand underline">
            The copy-trading myth
          </a>{" "}
          explains why in detail, but the short version: alpha lives in
          decisions you don&apos;t see (cost basis, position sizing, timing of
          trims), in instruments that never touch a 13F (shorts, options,
          foreign equities), and in the willingness to hold through drawdowns
          that retail copycats almost never stomach.
        </p>
        <p className="text-muted">
          Treat 13F signals as <em>research starting points</em>, not{" "}
          <em>trades</em>. A consensus buy from five high-alpha managers tells
          you where to spend your own research time. It doesn&apos;t tell you
          when to click buy.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Further reading</h2>
        <ul className="list-disc ml-6 text-muted space-y-2">
          <li>
            <a href="/learn/copy-trading-myth" className="text-brand underline">
              Can you actually copy Warren Buffett?
            </a>{" "}
            — the full case for why transferring alpha doesn&apos;t work.
          </li>
          <li>
            <a href="/learn/how-to-read-a-13f" className="text-brand underline">
              How to read a 13F filing in 5 minutes
            </a>{" "}
            — so you can evaluate alpha claims yourself from primary source
            data.
          </li>
          <li>
            <a href="/learn/conviction-score-explained" className="text-brand underline">
              What is a ConvictionScore?
            </a>{" "}
            — our alpha-weighted aggregation of manager buy/sell signals.
          </li>
          <li>
            <a href="/simulate" className="text-brand underline">
              Manager backtests
            </a>{" "}
            — concrete alpha numbers for Buffett, Ackman, Druckenmiller,
            Klarman, Burry.
          </li>
          <li>
            <a href="/investor" className="text-brand underline">
              The 30 tracked superinvestors
            </a>{" "}
            — profiles with philosophy, longest-held position, and current
            portfolio.
          </li>
        </ul>

        <div className="border-t border-border pt-6 mt-12">
          <p className="text-dim text-sm">
            HoldLens parses 13F filings from 30 of the world&apos;s best
            portfolio managers — ranked by alpha, not AUM. Free, no signup, no
            paywall.
          </p>
        </div>
      </div>

      <LearnReadNext currentSlug="what-is-alpha" />

      <ShareStrip
        title="What is alpha? A plain English guide to the hedge fund edge — HoldLens"
        url="https://holdlens.com/learn/what-is-alpha"
        via="holdlens"
      />
    </div>
  );
}
