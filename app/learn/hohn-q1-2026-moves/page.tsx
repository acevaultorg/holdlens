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
  title: "Chris Hohn's Q1 2026 13F moves — TCI guts Microsoft, deepens GE + Visa to 58% of book",
  description:
    "TCI Fund Management's Q1 2026 13F (filed May 15, 2026) shows the most concentrated stance in years: Microsoft trimmed from 17.1% to 2.6% (the headline move), GE Aerospace deepened to 34.4%, Visa to 23.5%, Moody's to 16.0%, Canadian Pacific to 9.3%. GE + V alone now 57.9% of the $39.2B portfolio. Alphabet added (combined GOOG + GOOGL to 8.3%). Just 9 holdings — Hohn's signature ultra-concentration intact. Reconstructable from public EDGAR filings.",
  alternates: { canonical: "https://holdlens.com/learn/hohn-q1-2026-moves" },
  openGraph: {
    title: "Hohn's Q1 2026 moves — TCI guts Microsoft, GE + Visa to 58% concentration",
    description:
      "TCI Fund Management Q1 2026: MSFT 17.1%→2.6% gutted, GE deepened to 34.4%, Visa to 23.5%. 9 holdings, $39.2B AUM. EDGAR-reconstructable.",
    url: "https://holdlens.com/learn/hohn-q1-2026-moves",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hohn's Q1 2026 13F moves",
    description: "TCI guts MSFT to 2.6%, GE to 34.4%, Visa to 23.5%, combined 58%. 9 holdings, $39.2B AUM.",
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
      { "@type": "ListItem", position: 3, name: "Hohn Q1 2026 moves", item: "https://holdlens.com/learn/hohn-q1-2026-moves" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Chris Hohn's Q1 2026 13F moves — TCI guts Microsoft as GE + Visa concentration deepens to 58%",
    description:
      "TCI Fund Management Q1 2026 13F: Microsoft cut from 17.1% to 2.6% (top-3 holding to bottom-of-book), GE Aerospace deepened to 34.4%, Visa to 23.5%, Moody's added to 16.0%, Canadian Pacific to 9.3%, Alphabet split-position added. Just 9 holdings; GE + Visa now 57.9% of the $39.2B portfolio. AUM contracted 17.5% from Q4. EDGAR-reconstructable.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/hohn-q1-2026-moves",
    datePublished: "2026-05-27",
    dateModified: "2026-05-27",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Chris Hohn Q1 2026",
      "TCI Fund Management 13F May 2026",
      "Hohn Microsoft trim",
      "TCI GE Aerospace concentration",
      "Hohn Visa Moody's",
      "Children's Investment Fund 13F",
      "TCI 13F filing analysis",
      "Chris Hohn quarterly recap",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens superinvestor quarterly recaps",
      url: "https://holdlens.com/learn",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001647251&type=13F-HR",
      "https://en.wikipedia.org/wiki/Christopher_Hohn",
      "https://en.wikipedia.org/wiki/The_Children%27s_Investment_Fund_Management",
      "https://holdlens.com/reports/2026-05-q1-2026-13f-signal-summary",
      "https://holdlens.com/api/v1/snapshot/2026-Q1.json",
      "https://holdlens.com/investor/chris-hohn",
    ],
    about: [
      { "@type": "Person", name: "Christopher Hohn" },
      { "@type": "Organization", name: "TCI Fund Management" },
      { "@type": "Corporation", name: "GE Aerospace", tickerSymbol: "GE" },
      { "@type": "Corporation", name: "Visa Inc.", tickerSymbol: "V" },
      { "@type": "Corporation", name: "Microsoft Corp", tickerSymbol: "MSFT" },
      { "@type": "Corporation", name: "Moody's Corp", tickerSymbol: "MCO" },
      { "@type": "Corporation", name: "Canadian Pacific Kansas City", tickerSymbol: "CP" },
      { "@type": "Corporation", name: "Alphabet Inc.", tickerSymbol: "GOOG" },
      { "@type": "Corporation", name: "Ferrovial SE", tickerSymbol: "FER" },
    ],
  },
];

export default function HohnQ12026Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Quarterly recaps</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
        Chris Hohn&apos;s Q1 2026 13F moves
      </h1>

      <AuthorByline date="2026-05-27" />
      <ShareStrip url="https://holdlens.com/learn/hohn-q1-2026-moves" title="Chris Hohn's Q1 2026 13F moves" />

      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          TCI Fund Management&apos;s Q1 2026 13F-HR (filed 2026-05-15) shows{" "}
          <strong>the most concentrated stance in years</strong>: Microsoft cut from a 17.1%
          top-3 holding to just 2.6% (the headline move), GE Aerospace deepened to 34.4% of the
          $39.2B portfolio, Visa to 23.5%, Moody&apos;s added to 16.0%, and Canadian Pacific to
          9.3%. GE + Visa together now hold 57.9% of the entire book. Just 9 holdings — Hohn&apos;s
          signature ultra-concentration intact. Every move is{" "}
          <Link href="/learn/edgar-explained" className="text-brand underline">
            reconstructable from EDGAR
          </Link>{" "}
          using Form 13F-HR.
        </TldrCard>

        <h2 className="text-2xl font-bold mt-12 mb-3">The Q1 2026 picture</h2>
        <p>
          TCI is the most concentrated 13F filer HoldLens tracks. Q4 2025 held 8 positions; Q1
          2026 holds 9 (a split-class Alphabet add). With under 10 positions in a $39B portfolio,
          every percentage-point move is a meaningful capital reallocation. The Q1 2026 13F has
          one such move that dwarfs the rest: <strong>Microsoft trimmed from 17.1% to 2.6%</strong>{" "}
          — a top-3 holding cut to a token position. That capital didn&apos;t leave; it
          redistributed inside the already-concentrated GE + Visa + Moody&apos;s + CP core.
        </p>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">The Microsoft move (the headline)</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Microsoft (MSFT)</strong> — 18.2% in Q3 2025, 17.1% in
              Q4 2025, <strong>2.6% in Q1 2026</strong>. From a roughly $8.1B position to roughly
              $1.0B in a single quarter. MSFT had been a TCI top-3 holding for multiple
              consecutive quarters; the Q1 reduction removes that status and effectively re-tags
              MSFT as a residual rather than core holding.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Concentration deepenings (where the capital went)</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">GE Aerospace (GE)</strong> — 30.2% → 30.8% → 34.4%.
              Already TCI&apos;s largest position; the Q1 add takes the weight above one-third of
              the entire book. Hohn has historically been a board-level activist at GE and
              supported the 2024 Aerospace/Vernova split; the concentration reads as long-thesis
              continuation.
            </li>
            <li>
              <strong className="text-text">Visa (V)</strong> — 20.3% → 20.5% → 23.5%. The
              payment-network thesis deepens. With GE + V combined at 57.9% of the book, TCI is
              effectively a two-name conviction fund at the top.
            </li>
            <li>
              <strong className="text-text">Moody&apos;s (MCO)</strong> — 13.4% → 14.3% → 16.0%.
              Credit-ratings franchise added through the quarter. MCO is a long-running TCI
              holding aligned with the &ldquo;global infrastructure of capital markets&rdquo; thesis.
            </li>
            <li>
              <strong className="text-text">Canadian Pacific Kansas City (CP)</strong> — 7.9% →
              7.4% → 9.3%. Rail infrastructure exposure deepened despite cyclical pressure on
              freight.
            </li>
            <li>
              <strong className="text-text">Ferrovial (FERROVIAL SE)</strong> — 2.4% → 2.8% →
              3.4%. Infrastructure-operator (toll roads, airports) position steadily added.
            </li>
            <li>
              <strong className="text-text">Canadian National Railway (CNI)</strong> — 3.7% →
              2.1% → 2.6%. Small add after a Q4 trim.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Alphabet split-position (added)</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Alphabet Class C (GOOG)</strong> — added from 5.0% to
              6.5%.
            </li>
            <li>
              <strong className="text-text">Alphabet Class A (GOOGL)</strong> — brand-new at 1.8%.
              The combined Alphabet weight is now 8.3%, up from 5.0% in Q4. Notable that TCI
              added Alphabet while gutting Microsoft — these are the two large-cap mega-tech names
              TCI has historically held, and the Q1 13F reads as &ldquo;swap inside mega-tech&rdquo;
              of a different shape than Tepper or Ackman (see comparison below).
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">What the pattern signals</h2>
        <p>
          The headline pattern is{" "}
          <strong>even-tighter conviction within an already ultra-concentrated book</strong>. GE
          + Visa combined now control 57.9% of the portfolio (vs 51.3% in Q4). Adding Moody&apos;s
          and CP, the top-4 positions hold 83.2% of the book. With just 9 names total, TCI is the
          purest single-thesis-cluster portfolio HoldLens tracks: aerospace infrastructure +
          payment networks + ratings agency + rail infrastructure + Spanish toll roads. The
          common-thread is &ldquo;hard infrastructure with toll-booth economics.&rdquo;
        </p>
        <p>
          The Microsoft reduction is the single most-interpreted move. The position had been
          built deliberately and held at scale for multiple quarters. Cutting it from 17.1% to
          2.6% in one quarter — while simultaneously <em>adding</em> Alphabet — reads either as
          (a) thesis-revision specific to MSFT, or (b) a relative-value pivot inside mega-tech
          (GOOG looked better than MSFT at Q1 prices). The 13F alone cannot distinguish between
          these; subsequent commentary or follow-on filings will clarify.
        </p>
        <p>
          For comparison: this quarter&apos;s superinvestor recaps have shown four distinct mega-tech
          patterns. Tepper rotated{" "}
          <Link href="/learn/tepper-q1-2026-moves" className="text-brand underline">
            China-to-US-tech with AMZN at #1
          </Link>
          . Ackman{" "}
          <Link href="/learn/ackman-q1-2026-moves" className="text-brand underline">
            swapped Alphabet for Microsoft at 15.3%
          </Link>
          . Druckenmiller{" "}
          <Link href="/learn/druckenmiller-q1-2026-moves" className="text-brand underline">
            trimmed both AMZN and GOOGL
          </Link>
          . Hohn gutted MSFT and added Alphabet. Four superinvestors, four different reads on
          mega-tech — and each fully public in the EDGAR record.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-12 mb-3">How to verify this yourself</h2>
        <p>
          Every position change above is reconstructable from public SEC EDGAR filings. Steps:
        </p>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2 leading-relaxed mt-4">
          <li>
            Open <Link href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001647251&type=13F-HR" className="text-brand underline">TCI Fund Management&apos;s 13F-HR filing history</Link> on EDGAR (CIK 0001647251).
          </li>
          <li>
            Compare the Q1 2026 13F (filed 2026-05-15) line-by-line against the Q4 2025 13F (filed Feb 2026).
          </li>
          <li>
            Position changes appear as: new CUSIP rows (Alphabet Class A is new), increased share counts (adds like GE, V, MCO), decreased share counts (the Microsoft trim is the headline), and removed CUSIP rows (none this quarter — all Q4 holdings remain).
          </li>
          <li>
            Cross-reference with HoldLens&apos;s machine-readable{" "}
            <Link href="/api/v1/snapshot/2026-Q1.json" className="text-brand underline">
              /api/v1/snapshot/2026-Q1.json
            </Link>{" "}
            for a pre-computed summary across all 30 tracked managers including TCI.
          </li>
        </ol>

        <OurView>
          TCI&apos;s Q1 2026 13F is the most assertive single-position reduction we&apos;ve seen
          from a top-10 manager this cycle. A 17.1% → 2.6% trim isn&apos;t a position trim — it&apos;s
          a position effectively closed, with the residual share-count likely held for tax or
          transition reasons. Combined with the GE + Visa + Moody&apos;s + CP concentration
          deepening, the picture is TCI choosing &ldquo;harder&rdquo; toll-booth businesses over
          software platforms at Q1 prices. Whether the call proves correct is something only
          time and Q2 returns can answer; the public record tells us how Hohn is positioned
          <em> right now</em>, and the positioning is materially tighter on infrastructure-style
          businesses than a quarter ago.
        </OurView>

        <FamousTradesBlock currentSlug="hohn-q1-2026-moves" />

        <CiteThisPage />

        <InvestingBooks />

        <LearnReadNext currentSlug="hohn-q1-2026-moves" />

        <p className="text-xs text-dim pt-6 border-t border-border mt-10">
          Not investment advice. Sourced from public SEC EDGAR Form 13F-HR filings (TCI Fund
          Management CIK 0001647251). All position changes verifiable from Form 13F-HR alone.
          13F-HR data is a 45-day-lagged snapshot of long-only U.S.-listed positions — see{" "}
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
