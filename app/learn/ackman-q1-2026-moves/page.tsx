import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import InvestingBooks from "@/components/InvestingBooks";
import AuthorByline from "@/components/AuthorByline";
import ShareStrip from "@/components/ShareStrip";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";
import FamousTradesBlock from "@/components/FamousTradesBlock";
import TldrCard from "@/components/learn/TldrCard";
import OurView from "@/components/learn/OurView";
import CiteThisPage from "@/components/learn/CiteThisPage";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bill Ackman's Q1 2026 13F moves — Microsoft new at 15%, Alphabet near-exit",
  description:
    "Pershing Square's Q1 2026 13F (filed May 15, 2026) reveals the year's biggest tech rebalance: a brand-new Microsoft position at 15.3% of the $13.7B portfolio, a near-full exit of Alphabet (GOOG + GOOGL combined dropped from ~14% to ~0.8%), a full Hilton exit, plus Amazon and Restaurant Brands adds. Eleven holdings throughout — concentration intact. Reconstructable from public EDGAR filings.",
  alternates: { canonical: "https://holdlens.com/learn/ackman-q1-2026-moves" },
  openGraph: {
    title: "Ackman's Q1 2026 moves — Microsoft new at 15%, Alphabet near-exit",
    description:
      "Pershing Square's biggest tech swap in years. MSFT new at 15.3%, Alphabet ~95% trim, Hilton exit, AMZN + QSR adds. EDGAR-reconstructable.",
    url: "https://holdlens.com/learn/ackman-q1-2026-moves",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ackman's Q1 2026 13F moves",
    description: "Microsoft new at 15.3%, Alphabet ~95% trim, Hilton full exit. Q1 2026 EDGAR reconstruction.",
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
      { "@type": "ListItem", position: 3, name: "Ackman Q1 2026 moves", item: "https://holdlens.com/learn/ackman-q1-2026-moves" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Bill Ackman's Q1 2026 13F moves — Pershing Square's biggest tech rebalance in years",
    description:
      "Pershing Square Q1 2026 13F: new Microsoft position at 15.3% of $13.7B AUM, near-full Alphabet exit (combined GOOG + GOOGL trimmed ~95%), full Hilton exit, Amazon and Restaurant Brands adds, Brookfield and Howard Hughes trims. Eleven holdings throughout. EDGAR-reconstructable.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/ackman-q1-2026-moves",
    datePublished: "2026-05-27",
    dateModified: "2026-05-27",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Bill Ackman Q1 2026",
      "Pershing Square 13F May 2026",
      "Ackman Microsoft position",
      "Pershing Square Alphabet exit",
      "Ackman Hilton exit",
      "Ackman Amazon add",
      "Pershing Square 13F filing analysis",
      "Bill Ackman quarterly recap",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens superinvestor quarterly recaps",
      url: "https://holdlens.com/learn",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001336528&type=13F-HR",
      "https://en.wikipedia.org/wiki/Bill_Ackman",
      "https://en.wikipedia.org/wiki/Pershing_Square_Capital_Management",
      "https://holdlens.com/reports/2026-05-q1-2026-13f-signal-summary",
      "https://holdlens.com/api/v1/snapshot/2026-Q1.json",
      "https://holdlens.com/investor/bill-ackman",
    ],
    about: [
      { "@type": "Person", name: "Bill Ackman" },
      { "@type": "Organization", name: "Pershing Square Capital Management" },
      { "@type": "Corporation", name: "Microsoft Corporation", tickerSymbol: "MSFT" },
      { "@type": "Corporation", name: "Alphabet Inc.", tickerSymbol: "GOOG" },
      { "@type": "Corporation", name: "Amazon.com Inc.", tickerSymbol: "AMZN" },
      { "@type": "Corporation", name: "Brookfield Corporation", tickerSymbol: "BN" },
      { "@type": "Corporation", name: "Hilton Worldwide Holdings", tickerSymbol: "HLT" },
      { "@type": "Corporation", name: "Restaurant Brands International", tickerSymbol: "QSR" },
      { "@type": "Corporation", name: "Uber Technologies", tickerSymbol: "UBER" },
      { "@type": "Corporation", name: "Howard Hughes Holdings", tickerSymbol: "HHH" },
    ],
  },
];

export default function AckmanQ12026Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Quarterly recaps</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
        Bill Ackman&apos;s Q1 2026 13F moves
      </h1>

      <AuthorByline date="2026-05-27" />
      <ShareStrip url="https://holdlens.com/learn/ackman-q1-2026-moves" title="Bill Ackman's Q1 2026 13F moves" />

      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Pershing Square Capital Management&apos;s Q1 2026 13F-HR (filed 2026-05-15) discloses{" "}
          <strong>the year&apos;s biggest tech rebalance</strong>: a brand-new Microsoft position
          worth roughly $2.09B (15.3% of the $13.7B portfolio), a near-full exit of Alphabet
          (combined GOOG + GOOGL trimmed from about 14% of the portfolio in Q4 to under 1% in Q1),
          a full Hilton exit, plus adds in Amazon and Restaurant Brands. Eleven holdings throughout
          — Ackman&apos;s signature concentration intact. Every transaction is{" "}
          <Link href="/learn/edgar-explained" className="text-brand underline">
            reconstructable from EDGAR
          </Link>{" "}
          using Form 13F-HR.
        </TldrCard>

        <h2 className="text-2xl font-bold mt-12 mb-3">The Q1 2026 changes</h2>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">New position</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Microsoft (MSFT)</strong> — brand-new position at about
              $2.09B, an immediate 15.3% of the portfolio. This is Pershing Square&apos;s largest
              single new-position entry since the firm built its Alphabet stake in 2023. The size
              alone signals high conviction: a 15%+ allocation on day one is the kind of sizing
              Ackman has historically reserved for positions he expects to hold multi-year.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Position adds</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Amazon (AMZN)</strong> — climbed from $2.22B in Q4 to
              $2.39B in Q1 (17.4% of portfolio, second-largest holding). AMZN was a new position in
              Q4 2025 at $1.28B; the consecutive-quarter add suggests the thesis is compounding
              rather than fading.
            </li>
            <li>
              <strong className="text-text">Restaurant Brands International (QSR)</strong> —
              steady third-consecutive-quarter add: $1.47B → $1.56B → $1.67B. QSR now sits at
              12.2% of the portfolio. Ackman has been involved with QSR (Burger King, Tim Hortons,
              Popeyes, Firehouse Subs) since the 3G Capital sponsorship era.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Full exits</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Hilton Worldwide (HLT)</strong> — held through 2025 at
              roughly $786–870M, fully exited in Q1 2026. Hotels and lodging now drop out of
              Pershing Square&apos;s book.
            </li>
            <li>
              <strong className="text-text">Alphabet — effectively</strong> — both share classes
              still appear on the 13F (GOOG at $89.4M, GOOGL at $9.3M) but combined they are now
              under 1% of the portfolio versus ~14% in Q4. By dollar value this is the largest
              single-quarter reduction Pershing Square has ever made in a tech holding. Treating
              it as a near-full exit is the honest read.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Trims (positions reduced but held)</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Brookfield (BN)</strong> — modest trim from $2.82B to
              $2.42B. BN remains the largest position at 17.6% of the portfolio. The trim is
              consistent with rebalancing rather than thesis change.
            </li>
            <li>
              <strong className="text-text">Uber (UBER)</strong> — trimmed from $2.47B to $2.15B,
              dropping from second-largest holding in Q4 to third in Q1. The position has been
              steadily declining: $2.97B → $2.47B → $2.15B across three quarters.
            </li>
            <li>
              <strong className="text-text">Howard Hughes Holdings (HHH)</strong> — trimmed from
              $1.50B to $1.19B. HHH is Ackman&apos;s longstanding real-estate holding (he chairs
              the board). The position sizing is unusual to read — partial trims of a board-seat
              holding are noteworthy.
            </li>
            <li>
              <strong className="text-text">Meta Platforms (META)</strong> — trimmed from $1.76B
              to $1.52B. Meta was a Q4 2025 new position; the Q1 trim is the first reduction since
              entry but the position remains material at 11.1%.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">What the pattern signals</h2>
        <p>
          Q1 2026 is the most active tech rebalance in Pershing Square&apos;s recent history.{" "}
          <strong>The headline move is a swap inside megacap tech</strong>: Alphabet out (near
          full), Microsoft in (at 15.3%). Both companies are global-platform incumbents with
          dominant moats, but the bet structures differ — Alphabet&apos;s revenue is concentrated
          in advertising while Microsoft&apos;s is spread across cloud, productivity, and
          enterprise AI.
        </p>
        <p>
          The Microsoft sizing — 15.3% on entry — is the second-largest single-position weighting
          in the portfolio after Brookfield. Ackman has historically built positions over multiple
          quarters; the day-one 15%+ allocation suggests either (a) the firm accumulated quietly
          before quarter-end and the 13F is the first public disclosure, or (b) the thesis is
          large enough to justify entering at full size immediately. Either interpretation
          signals high conviction.
        </p>
        <p>
          Beyond the tech swap, the secondary pattern is{" "}
          <strong>continued consolidation around fewer themes</strong>: Brookfield + Amazon +
          Microsoft + Uber together represent 65.9% of the portfolio. The Hilton exit removes
          lodging/travel exposure entirely. Restaurant Brands (QSR) compounding suggests the
          franchise/quick-service thesis is steady. Howard Hughes (HHH) trimming is the only move
          that departs from Ackman&apos;s public narrative around the position — worth watching in
          subsequent quarters.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-12 mb-3">How to verify this yourself</h2>
        <p>
          Every position change above is reconstructable from public SEC EDGAR filings. Steps:
        </p>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2 leading-relaxed mt-4">
          <li>
            Open <Link href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001336528&type=13F-HR" className="text-brand underline">Pershing Square Capital Management&apos;s 13F-HR filing history</Link> on EDGAR (CIK 0001336528).
          </li>
          <li>
            Compare the Q1 2026 13F (filed 2026-05-15) line-by-line against the Q4 2025 13F (filed Feb 2026).
          </li>
          <li>
            Position changes appear as: new CUSIP rows (new positions like Microsoft), increased share counts (adds like Amazon and QSR), decreased share counts (trims like Brookfield and Uber), removed CUSIP rows (exits like Hilton).
          </li>
          <li>
            Cross-reference with HoldLens&apos;s machine-readable{" "}
            <Link href="/api/v1/snapshot/2026-Q1.json" className="text-brand underline">
              /api/v1/snapshot/2026-Q1.json
            </Link>{" "}
            for a pre-computed summary across all 30 tracked managers including Pershing Square.
          </li>
        </ol>

        <OurView>
          A 15.3% day-one Microsoft position is the most assertive single-position entry Ackman has
          made in years. Combined with the near-elimination of Alphabet — a position the firm
          built deliberately in 2023 — the Q1 2026 13F reads as a real conviction shift inside
          megacap tech, not a portfolio drift. Whether the swap proves directionally correct is
          something only time and Q2 2026 returns can answer; what the public record tells us is
          how Pershing Square is positioned <em>right now</em>, and that positioning is
          dramatically different from a quarter ago.
        </OurView>

        <FamousTradesBlock currentSlug="ackman-q1-2026-moves" />

        <CiteThisPage />

        <InvestingBooks />

        <LearnReadNext currentSlug="ackman-q1-2026-moves" />

        <p className="text-xs text-dim pt-6 border-t border-border mt-10">
          Not investment advice. Sourced from public SEC EDGAR Form 13F-HR filings (Pershing Square
          CIK 0001336528). All position changes verifiable from Form 13F-HR alone. 13F-HR data is
          a 45-day-lagged snapshot of long-only U.S.-listed positions — see{" "}
          <Link href="/learn/45-day-lag-explained" className="text-brand underline">
            45-day lag explained
          </Link>{" "}
          and{" "}
          <Link href="/methodology" className="text-brand underline">methodology</Link>.
        </p>
      </div>
    </div>
  );
}
