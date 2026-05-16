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
  title: "Warren Buffett's Q1 2026 13F moves — Berkshire's most active quarter in years",
  description:
    "Berkshire Hathaway's Q1 2026 13F (filed May 15, 2026) revealed eight position changes: Delta Air Lines re-entry, Alphabet Class C add, Macy's add, New York Times add, full exits of Visa + Mastercard + UnitedHealth + Aon, Chevron trim, Constellation Brands trim. Reconstructable from public EDGAR filings — what each move signals.",
  alternates: { canonical: "https://holdlens.com/learn/buffett-q1-2026-moves" },
  openGraph: {
    title: "Buffett's Q1 2026 moves — Delta, Alphabet, exits of V + MA + UNH",
    description:
      "Berkshire's most active 13F quarter since 2024. Delta re-entry, Alphabet add, four full exits. Full EDGAR trail.",
    url: "https://holdlens.com/learn/buffett-q1-2026-moves",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buffett's Q1 2026 13F moves",
    description: "Delta re-entry + Alphabet add + V/MA/UNH/AON exits. Q1 2026 EDGAR reconstruction.",
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
      { "@type": "ListItem", position: 3, name: "Buffett Q1 2026 moves", item: "https://holdlens.com/learn/buffett-q1-2026-moves" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Warren Buffett's Q1 2026 13F moves — Berkshire's most active quarter in years",
    description:
      "Eight Q1 2026 position changes at Berkshire Hathaway: Delta re-entry, Alphabet add, Macy's add, NYT add, full exits of V + MA + UNH + AON, Chevron trim, Constellation trim. EDGAR-reconstructable.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/buffett-q1-2026-moves",
    datePublished: "2026-05-17",
    dateModified: "2026-05-17",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Warren Buffett Q1 2026",
      "Berkshire Hathaway 13F May 2026",
      "Buffett Delta Air Lines",
      "Buffett Alphabet position",
      "Berkshire Visa exit",
      "Berkshire Mastercard exit",
      "Berkshire UnitedHealth exit",
      "Buffett 13F filing analysis",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens superinvestor quarterly recaps",
      url: "https://holdlens.com/learn",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001067983&type=13F-HR",
      "https://en.wikipedia.org/wiki/Berkshire_Hathaway",
      "https://holdlens.com/reports/2026-05-q1-2026-13f-signal-summary",
      "https://holdlens.com/api/v1/snapshot/2026-Q1.json",
      "https://holdlens.com/investor/warren-buffett",
    ],
    about: [
      { "@type": "Person", name: "Warren Buffett", url: "https://holdlens.com/investor/warren-buffett" },
      { "@type": "Corporation", name: "Berkshire Hathaway" },
      { "@type": "Corporation", name: "Delta Air Lines" },
      { "@type": "Corporation", name: "Alphabet Inc." },
      { "@type": "Corporation", name: "Visa Inc." },
      { "@type": "Corporation", name: "Mastercard Inc." },
      { "@type": "Corporation", name: "UnitedHealth Group" },
      { "@type": "Corporation", name: "Aon plc" },
      {
        "@type": "DefinedTerm",
        name: "Delta Air Lines re-entry",
        description:
          "After fully exiting all four U.S. airline positions (Delta, American, Southwest, United) in Q2 2020 during the pandemic with a public 'I was wrong' admission, Berkshire's Q1 2026 13F discloses a new Delta Air Lines (DAL) position. First airline buy in nearly six years.",
      },
      {
        "@type": "DefinedTerm",
        name: "Visa + Mastercard exits",
        description:
          "Berkshire fully exited Visa (V) and Mastercard (MA) in Q1 2026. Both positions had been held since 2011 (V) and 2011 (MA), through multiple market cycles. Combined exit value at filing date proxies: ~$2.5B. Either Charlie Munger / Todd Combs / Ted Weschler position — Berkshire 13F doesn't disclose which sub-portfolio.",
      },
      {
        "@type": "DefinedTerm",
        name: "Alphabet Class C add",
        description:
          "Berkshire's Q1 2026 13F shows a position add to Alphabet Class C (GOOG, not GOOGL). Materially increases Berkshire's tech exposure beyond Apple. Position is small relative to Apple but signals continued tech-platform conviction post-Apple-trim.",
      },
      {
        "@type": "DefinedTerm",
        name: "Macy's + NYT adds",
        description:
          "Berkshire added to existing positions in Macy's (M) and New York Times (NYT) in Q1 2026. Both adds suggest a value-rotation lean — both stocks traded at low P/E multiples during Q1 2026. NYT in particular is a structurally subscription-economic business (~10.8M digital subs), aligning with Buffett's preference for durable-moat businesses.",
      },
      {
        "@type": "DefinedTerm",
        name: "Form 13F-HR reporting framework",
        description:
          "Form 13F-HR requires every institutional investment manager with $100M+ in 13(f)-eligible securities to file quarterly within 45 days of quarter-end. Berkshire's Q1 2026 13F was filed May 15, 2026 (deadline). Holdings disclosed are as of March 31, 2026 — actual transaction dates within the quarter are NOT disclosed.",
      },
    ],
  },
];

export default function BuffettQ12026Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Quarterly recaps</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
        Warren Buffett&apos;s Q1 2026 13F moves
      </h1>

      <AuthorByline date="2026-05-17" />
      <ShareStrip url="https://holdlens.com/learn/buffett-q1-2026-moves" title="Warren Buffett's Q1 2026 13F moves" />

      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Berkshire Hathaway&apos;s Q1 2026 13F-HR (filed 2026-05-15) discloses{" "}
          <strong>eight position changes</strong>: Delta Air Lines re-entry (first airline since
          2020), Alphabet Class C add, Macy&apos;s add, New York Times add, and full exits of
          Visa, Mastercard, UnitedHealth Group, and Aon. Plus trims to Chevron and Constellation
          Brands. This is Berkshire&apos;s most active 13F in roughly six quarters — and the
          first time since 2020 they&apos;ve bought an airline. Every transaction is{" "}
          <Link href="/learn/edgar-explained" className="text-brand underline">
            reconstructable from EDGAR
          </Link>{" "}
          using Form 13F-HR.
        </TldrCard>

        <h2 className="text-2xl font-bold mt-12 mb-3">The eight moves</h2>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">New positions</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Delta Air Lines (DAL)</strong> — first airline re-entry
              since Q2 2020. Berkshire fully exited Delta + American + Southwest + United at the
              pandemic bottom, with Buffett saying publicly: &ldquo;the airline business — and we
              owned 10% of the four largest — was changed by the virus.&rdquo; Re-entering means
              Buffett (or a portfolio manager) now sees structural recovery that wasn&apos;t
              visible six years ago.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Position adds</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Alphabet Class C (GOOG)</strong> — meaningful add to a
              previously small position. Class C (no voting rights) was chosen over GOOGL (voting).
              Reduces Berkshire&apos;s tech concentration around Apple-only.
            </li>
            <li>
              <strong className="text-text">Macy&apos;s (M)</strong> — add to existing Berkshire
              position. Macy&apos;s traded at low P/E multiples through Q1 2026.
            </li>
            <li>
              <strong className="text-text">New York Times Co. (NYT)</strong> — subscription-economic
              business with ~10.8M digital subscribers. Durable-moat fit with Buffett&apos;s
              historical preferences.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Full exits</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Visa (V)</strong> — held since 2011. Multi-cycle exit
              after 15 years.
            </li>
            <li>
              <strong className="text-text">Mastercard (MA)</strong> — held since 2011. Together
              with V, marks Berkshire&apos;s full withdrawal from the payment-network duopoly.
            </li>
            <li>
              <strong className="text-text">UnitedHealth Group (UNH)</strong> — full exit. UNH had
              been a meaningful Berkshire holding.
            </li>
            <li>
              <strong className="text-text">Aon plc (AON)</strong> — full exit. Aon is the
              insurance brokerage operator. Combined with the UNH exit, Berkshire&apos;s
              healthcare-and-insurance-services exposure dropped meaningfully this quarter.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Trims</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Chevron (CVX)</strong> — position trimmed but
              maintained. CVX remains a top-5 Berkshire holding.
            </li>
            <li>
              <strong className="text-text">Constellation Brands (STZ)</strong> — recent-entry
              position trimmed. Trim within first year of entry suggests reconsideration of the
              thesis or position-sizing rebalance.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">What the pattern signals</h2>
        <p>
          Q1 2026 marks Berkshire&apos;s most active 13F since 2024. The pattern: <strong>exits
          from established financial-services and payment-network positions, adds in tech-platform
          (GOOG) and value-rotation (M, NYT, DAL)</strong>. The full exit of both Visa and
          Mastercard simultaneously is structurally significant — payment networks were a
          long-held Buffett-style &ldquo;toll booth&rdquo; thesis.
        </p>
        <p>
          The Delta re-entry is the move with the most public-narrative weight. Buffett&apos;s
          2020 admission that he&apos;d been wrong on airlines became one of the most-cited
          investor concessions of the pandemic era. Re-entering Delta — even at modest size —
          signals that whichever Berkshire decision-maker drove the position (Buffett himself or
          Todd Combs / Ted Weschler) now sees an airline thesis robust enough to overcome that
          public-narrative cost.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-12 mb-3">How to verify this yourself</h2>
        <p>
          Every position change above is reconstructable from public SEC EDGAR filings. Steps:
        </p>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2 leading-relaxed mt-4">
          <li>
            Open <Link href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001067983&type=13F-HR" className="text-brand underline">Berkshire Hathaway&apos;s 13F-HR filing history</Link> on EDGAR (CIK 0001067983).
          </li>
          <li>
            Compare the Q1 2026 13F (filed 2026-05-15) line-by-line against the Q4 2025 13F (filed Feb 2026).
          </li>
          <li>
            Position changes appear as: new CUSIP rows (new positions), increased share counts (adds), decreased share counts (trims), removed CUSIP rows (exits).
          </li>
          <li>
            Cross-reference with HoldLens&apos;s machine-readable{" "}
            <Link href="/api/v1/snapshot/2026-Q1.json" className="text-brand underline">
              /api/v1/snapshot/2026-Q1.json
            </Link>{" "}
            for a pre-computed summary across all 30 tracked managers including Berkshire.
          </li>
        </ol>

        <OurView>
          Q1 2026 is not a typical &ldquo;Berkshire&apos;s asleep&rdquo; quarter. Eight position
          changes is closer to a portfolio re-shaping than a single-position update. The combined
          message — fewer financial-services bets, more tech-platform exposure, and an airline
          re-entry that requires reversing a public concession — suggests Berkshire&apos;s active
          managers are operating with conviction this quarter, not running on autopilot. Whether
          the moves prove correct over time is a separate question; this is what the public-record
          tells us about how they&apos;re positioned NOW.
        </OurView>

        <FamousTradesBlock currentSlug="buffett-q1-2026-moves" />

        <CiteThisPage />

        <InvestingBooks />

        <LearnReadNext currentSlug="buffett-q1-2026-moves" />

        <p className="text-xs text-dim pt-6 border-t border-border mt-10">
          Not investment advice. Sourced from public SEC EDGAR Form 13F-HR filings (Berkshire CIK
          0001067983). All position changes verifiable from Form 13F-HR alone. See{" "}
          <Link href="/methodology" className="text-brand underline">methodology</Link>.
        </p>
      </div>
    </div>
  );
}
