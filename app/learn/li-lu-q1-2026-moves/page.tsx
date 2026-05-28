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
    "Himalaya Capital's Q1 2026 13F (filed May 15, 2026) shows Li Lu — Munger's protégé and one of the most concentrated value investors tracked — trimming his 15-year Bank of America anchor 71% (from ~28.6% to 4.6%), his most significant single-position cut in years. Four new positions opened: Moody's, MSCI, Tencent Music, and H&R Block. Crocs added 41%. The book stays highly concentrated — Alphabet (GOOGL + GOOG) near 45% combined, Pinduoduo, Berkshire, and East West Bancorp held unchanged. Reconstructable from public EDGAR filings.",
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
      "Himalaya Capital Q1 2026 13F: Bank of America trimmed 71% by share count (resulting weight ~28.6%→4.6%) — Li Lu's most significant single-position cut in years, though East West Bancorp (9.4%) was held, so not a banking-sector exit. Four new positions opened: Moody's (MCO), MSCI, Tencent Music (TME), H&R Block (HRB). Crocs added 41%. Long-held Alphabet (GOOGL + GOOG, ~45% combined), Pinduoduo, Berkshire Hathaway, East West Bancorp, Occidental, and Apple show no reported Q1 change. EDGAR-reconstructable.",
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
          drops from roughly 28.6% of the book to 4.6%, his most significant single-position cut
          in years. The freed capital fans out into <strong>four brand-new positions</strong> —
          Moody&apos;s, MSCI, Tencent Music, and H&amp;R Block — plus a 41% add to Crocs. The book
          stays highly concentrated: Alphabet (Class A + C) is now nearly 45% combined, with
          Pinduoduo, Berkshire Hathaway, and East West Bancorp held unchanged. Notably he kept East
          West Bancorp — another bank — so the BAC trim is position-specific, not a banking-sector
          exit. Every move is{" "}
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
          BAC had been one of Himalaya&apos;s largest positions and its longest-held name (since
          2009), built up across multiple consecutive quarters. In Q1 2026 it was cut by 71% of its
          share count — roughly 7.4 million shares sold — collapsing its portfolio weight from
          about 28.6% at the end of Q4 2025 to 4.6%. For an investor whose entire reputation rests
          on conviction and patience, taking a 15-year, quarter-of-the-book anchor down to a small
          residual is the headline.
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
              at 1.9% (~6.6M shares). It deepens Li Lu&apos;s China exposure, which already runs
              through his large Pinduoduo position — consistent with the China expertise he is
              known for.
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
              <strong className="text-text">Alphabet (GOOGL ~23.2% + GOOG ~22.3%), Pinduoduo
              (PDD ~14.9%), Berkshire Hathaway (~13.7%), East West Bancorp (EWBC ~9.4%), Occidental
              (~3.0%), Apple (~0.9%)</strong> — no reported Q1 change. These long-held positions
              did not trade this quarter; with BAC cut to 4.6%, they become a larger share of the
              book, and Alphabet&apos;s two share classes now make up nearly 45% of the portfolio
              between them. Notably, East West Bancorp — also a bank — was left untouched, so the
              BAC reduction is a position-specific call, not a retreat from the banking sector.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">What the pattern signals</h2>
        <p>
          The shape of the quarter is a <strong>position-specific exit from the BAC anchor</strong>,
          not a broad de-concentration. The book stays intensely concentrated — Alphabet&apos;s two
          share classes alone are near 45%, and Pinduoduo, Berkshire, and East West Bancorp round
          out a top-heavy portfolio. What changed is that the single oldest holding was cut down and
          the proceeds seeded four small, durable franchises: Moody&apos;s and MSCI are textbook
          wide-moat &ldquo;toll-booth&rdquo; data businesses, Tencent Music adds China exposure
          alongside the long-held Pinduoduo stake, and H&amp;R Block is a cash-generative consumer
          franchise. Himalaya added names this quarter rather than thinning the book.
        </p>
        <p>
          The 13F alone cannot tell us <em>why</em>. The BAC trim could be valuation discipline
          after a long run, or a reallocation toward businesses Li Lu rates as higher-quality at
          current prices. One thing it is <em>not</em>: a retreat from banking — East West Bancorp,
          a 9.4% position, was left untouched. The public record establishes the direction: the
          15-year BAC anchor is no longer a core position, while the Alphabet-and-China core
          remains firmly in place.
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
          For most managers, a 71% trim of a major position would be unremarkable. For Li Lu it is
          the loudest signal the 13F can carry, precisely because he so rarely moves. Cutting his
          15-year Bank of America anchor from ~28.6% to 4.6% is the headline — but read it
          carefully: this is not a turn toward diversification. Alphabet&apos;s two share classes
          alone are near 45% of the book, and the China-heavy, top-concentrated character is fully
          intact. What we see is the patient retirement of the single oldest position into four
          small quality-franchise starters, not a fire sale. Whether the call proves correct is
          something only time and subsequent filings can answer; the public record tells us how
          Himalaya is positioned <em>right now</em> — the BAC anchor is no longer core, while the
          Alphabet-and-China conviction stays firmly in place.
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
