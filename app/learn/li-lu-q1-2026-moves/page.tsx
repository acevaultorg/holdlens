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
  title: "Li Lu's Q1 2026 13F moves — Himalaya cuts its 15-year Bank of America anchor 71%",
  description:
    "Himalaya Capital's Q1 2026 13F (filed May 15, 2026) shows Li Lu — Munger's protégé and one of the most concentrated value investors tracked — trimming Bank of America 71% (from a ~28.6% top holding to 4.6%), the most significant de-concentration in years. Four new positions opened: Moody's, MSCI, Tencent Music, and H&R Block. Crocs added 41%. Reconstructable from public EDGAR filings.",
  alternates: { canonical: "https://holdlens.com/learn/li-lu-q1-2026-moves" },
  openGraph: {
    title: "Li Lu's Q1 2026 moves — Himalaya cuts its 15-year BAC anchor 71%",
    description:
      "Himalaya Capital Q1 2026: Bank of America trimmed 71% (28.6%→4.6%), four new positions (Moody's, MSCI, Tencent Music, H&R Block), Crocs +41%. EDGAR-reconstructable.",
    url: "https://holdlens.com/learn/li-lu-q1-2026-moves",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — superinvestor 13F tracking with ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Li Lu's Q1 2026 13F moves",
    description: "Himalaya cuts 15-year BAC anchor 71% (28.6%→4.6%); opens Moody's, MSCI, Tencent Music, H&R Block.",
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
      { "@type": "ListItem", position: 3, name: "Li Lu Q1 2026 moves", item: "https://holdlens.com/learn/li-lu-q1-2026-moves" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Li Lu's Q1 2026 13F moves — Himalaya Capital cuts its 15-year Bank of America anchor by 71%",
    description:
      "Himalaya Capital Q1 2026 13F: Bank of America trimmed 71% by share count (resulting weight ~28.6%→4.6%) — Li Lu's most significant single-position de-concentration in years. Four new positions opened: Moody's (MCO), MSCI, Tencent Music (TME), H&R Block (HRB). Crocs added 41%. Long-held Alphabet, Berkshire Hathaway, Meta, and Alibaba positions show no reported Q1 change. EDGAR-reconstructable.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/li-lu-q1-2026-moves",
    datePublished: "2026-05-28",
    dateModified: "2026-05-28",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Li Lu Q1 2026",
      "Himalaya Capital 13F May 2026",
      "Li Lu Bank of America trim",
      "Li Lu Moody's MSCI",
      "Li Lu Tencent Music",
      "Himalaya Capital 13F filing analysis",
      "Li Lu quarterly recap",
      "Charlie Munger protégé portfolio",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens superinvestor quarterly recaps",
      url: "https://holdlens.com/learn",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001709323&type=13F-HR",
      "https://en.wikipedia.org/wiki/Li_Lu",
      "https://holdlens.com/reports/2026-05-q1-2026-13f-signal-summary",
      "https://holdlens.com/api/v1/snapshot/2026-Q1.json",
      "https://holdlens.com/investor/li-lu",
    ],
    about: [
      { "@type": "Person", name: "Li Lu" },
      { "@type": "Organization", name: "Himalaya Capital Management" },
      { "@type": "Corporation", name: "Bank of America Corp", tickerSymbol: "BAC" },
      { "@type": "Corporation", name: "Moody's Corp", tickerSymbol: "MCO" },
      { "@type": "Corporation", name: "MSCI Inc.", tickerSymbol: "MSCI" },
      { "@type": "Corporation", name: "Tencent Music Entertainment Group", tickerSymbol: "TME" },
      { "@type": "Corporation", name: "H&R Block Inc.", tickerSymbol: "HRB" },
      { "@type": "Corporation", name: "Crocs Inc.", tickerSymbol: "CROX" },
    ],
  },
];

export default function LiLuQ12026Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Quarterly recaps</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
        Li Lu&apos;s Q1 2026 13F moves
      </h1>

      <AuthorByline date="2026-05-28" />
      <ShareStrip url="https://holdlens.com/learn/li-lu-q1-2026-moves" title="Li Lu's Q1 2026 13F moves" />

      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Himalaya Capital&apos;s Q1 2026 13F-HR (filed 2026-05-15) shows{" "}
          <strong>Li Lu cutting his 15-year Bank of America anchor by 71%</strong> — the position
          drops from a roughly 28.6% top holding to 4.6% of the book, the most significant
          de-concentration this famously patient investor has made in years. The freed capital
          fans out into <strong>four brand-new positions</strong> — Moody&apos;s, MSCI, Tencent
          Music, and H&amp;R Block — plus a 41% add to Crocs. Long-held Alphabet, Berkshire
          Hathaway, Meta, and Alibaba show no reported Q1 change. Every move is{" "}
          <Link href="/learn/edgar-explained" className="text-brand underline">
            reconstructable from EDGAR
          </Link>{" "}
          using Form 13F-HR.
        </TldrCard>

        <h2 className="text-2xl font-bold mt-12 mb-3">The Q1 2026 picture</h2>
        <p>
          Li Lu — Charlie Munger&apos;s protégé, whom Munger called &ldquo;the Asian Warren
          Buffett&rdquo; and to whom he entrusted a large share of his personal capital — runs one
          of the most concentrated, lowest-turnover portfolios HoldLens tracks. Himalaya Capital
          typically holds a dozen-or-so names for years at a time. That is what makes the Q1 2026
          13F notable: it contains the kind of decisive reshaping Li Lu almost never makes.
        </p>
        <p>
          The single dominant move is the{" "}
          <Link href="/ticker/BAC" className="text-brand underline">Bank of America</Link> trim.
          BAC had been Himalaya&apos;s largest position and its longest-held name (since 2009),
          built up across multiple consecutive quarters. In Q1 2026 it was cut by 71% of its share
          count — roughly 7.4 million shares sold — collapsing its portfolio weight from about
          28.6% at the end of Q4 2025 to 4.6%. For an investor whose entire reputation rests on
          conviction and patience, taking a near-double-digit-year anchor from one-quarter-of-the-book
          to a small residual is the headline.
        </p>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">The Bank of America trim (the headline)</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Bank of America (BAC)</strong> — trimmed 71% by share
              count (~7.4M shares sold). Resulting portfolio weight: ~28.6% (end Q4 2025) →{" "}
              <strong>4.6% (Q1 2026)</strong>. A 15-year top holding reduced to a residual
              position in a single quarter. The capital did not exit the portfolio — it
              redistributed into the new positions below and re-weighted the long-held names.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Four new positions (where the capital went)</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">
                <Link href="/ticker/MCO" className="text-brand underline">Moody&apos;s (MCO)</Link>
              </strong>{" "}
              — brand-new at 1.6% of the book (~118k shares). A wide-moat credit-ratings franchise
              with toll-booth economics — exactly the kind of durable-quality compounder the
              Munger/Buffett school favors.
            </li>
            <li>
              <strong className="text-text">
                <Link href="/ticker/MSCI" className="text-brand underline">MSCI Inc. (MSCI)</Link>
              </strong>{" "}
              — brand-new at 0.3% (~19k shares). The index and analytics franchise, another
              toll-booth data business. A small starter position.
            </li>
            <li>
              <strong className="text-text">Tencent Music Entertainment (TME)</strong> — brand-new
              at 1.9% (~6.6M shares). A return to China-listed exposure, consistent with Li Lu&apos;s
              long-standing China expertise (he has held Alibaba for years).
            </li>
            <li>
              <strong className="text-text">H&amp;R Block (HRB)</strong> — brand-new at 1.6% (~1.6M
              shares). A cash-generative, capital-returning consumer-tax franchise.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Add + holds</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Crocs (CROX)</strong> — added 41% by share count
              (~259k shares), bringing the position to 2.3% of the book.
            </li>
            <li>
              <strong className="text-text">Alphabet, Berkshire Hathaway, Meta, Alibaba</strong> —
              no reported Q1 change. These long-held positions did not trade this quarter; with BAC
              cut to 4.6%, they mechanically become a larger share of the book and now anchor the
              top of the portfolio.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">What the pattern signals</h2>
        <p>
          The shape of the quarter is <strong>de-concentration into quality-compounder
          breadth</strong>. A single oversized bank position is cut down, and the proceeds seed a
          set of smaller, durable, toll-booth-style franchises — Moody&apos;s and MSCI are textbook
          wide-moat data businesses, and the China and tax-services additions round out the new
          names. It is the rare Himalaya quarter where the holding count rises and the top position
          shrinks at the same time.
        </p>
        <p>
          The 13F alone cannot tell us <em>why</em>. The BAC trim could be valuation discipline
          after a long run, a risk-reduction in financials, or a reallocation toward businesses Li
          Lu rates as higher-quality at current prices. What the public record establishes is the
          direction: less concentrated, more compounder-flavored than a quarter ago.
        </p>
        <p>
          For comparison, this quarter&apos;s recaps show several distinct value-investor moves.
          Chris Hohn{" "}
          <Link href="/learn/hohn-q1-2026-moves" className="text-brand underline">
            gutted Microsoft to deepen GE + Visa
          </Link>
          . Warren Buffett ran{" "}
          <Link href="/learn/buffett-q1-2026-moves" className="text-brand underline">
            Berkshire&apos;s most active quarter in years
          </Link>
          . David Tepper{" "}
          <Link href="/learn/tepper-q1-2026-moves" className="text-brand underline">
            rotated China into US tech
          </Link>
          . Li Lu&apos;s version is a de-concentration of his single largest, longest-held anchor —
          a different signature from a manager who almost never makes one.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-12 mb-3">How to verify this yourself</h2>
        <p>
          Every position change above is reconstructable from public SEC EDGAR filings. Steps:
        </p>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2 leading-relaxed mt-4">
          <li>
            Open{" "}
            <Link href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001709323&type=13F-HR" className="text-brand underline">
              Himalaya Capital Management&apos;s 13F-HR filing history
            </Link>{" "}
            on EDGAR (CIK 0001709323).
          </li>
          <li>
            Compare the Q1 2026 13F (filed 2026-05-15, report date 2026-03-31) line-by-line against
            the Q4 2025 13F (filed Feb 2026).
          </li>
          <li>
            Position changes appear as: decreased share counts (the Bank of America trim is the
            headline), new CUSIP rows (Moody&apos;s, MSCI, Tencent Music, H&amp;R Block are all
            new), and increased share counts (the Crocs add).
          </li>
          <li>
            Cross-reference with HoldLens&apos;s machine-readable{" "}
            <Link href="/api/v1/snapshot/2026-Q1.json" className="text-brand underline">
              /api/v1/snapshot/2026-Q1.json
            </Link>{" "}
            and the live{" "}
            <Link href="/investor/li-lu" className="text-brand underline">Li Lu portfolio page</Link>.
          </li>
        </ol>

        <OurView>
          For most managers, a 71% trim of the top position would be unremarkable. For Li Lu it is
          the loudest signal the 13F can carry, precisely because he so rarely moves. Cutting a
          15-year Bank of America anchor from ~28.6% to 4.6% while opening four new
          quality-franchise positions reads as a deliberate shift from single-name concentration
          toward compounder breadth — not a panic, given the patient way the proceeds were
          redeployed. Whether the call proves correct is something only time and subsequent
          filings can answer; the public record tells us how Himalaya is positioned{" "}
          <em>right now</em>, and the positioning is materially less bank-concentrated than a
          quarter ago.
        </OurView>

        <FamousTradesBlock currentSlug="li-lu-q1-2026-moves" />

        <CiteThisPage />

        <InvestingBooks />

        <LearnReadNext currentSlug="li-lu-q1-2026-moves" />

        <p className="text-xs text-dim pt-6 border-t border-border mt-10">
          Not investment advice. Sourced from public SEC EDGAR Form 13F-HR filings (Himalaya
          Capital Management CIK 0001709323). All position changes verifiable from Form 13F-HR
          alone. 13F-HR data is a 45-day-lagged snapshot of long-only U.S.-listed positions — see{" "}
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
