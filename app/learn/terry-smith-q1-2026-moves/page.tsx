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
  title: "Terry Smith's Q1 2026 13F moves — Fundsmith trims almost its entire US book",
  description:
    "Fundsmith's Q1 2026 13F (filed May 15, 2026) shows Terry Smith — the 'English Warren Buffett' — trimming nearly every top US-listed position: Marriott, Stryker, Waters, Visa, Alphabet, Pfizer, Interactive Brokers and ADP all reduced, with MSCI (−61%) and Rollins (−58%) near-exited. A uniform pullback across a 34-name quality-compounder book. Reconstructable from public EDGAR filings.",
  alternates: { canonical: "https://holdlens.com/learn/terry-smith-q1-2026-moves" },
  openGraph: {
    title: "Terry Smith's Q1 2026 moves — Fundsmith trims almost its entire US book",
    description:
      "Fundsmith Q1 2026: a near-uniform trim — Marriott, Stryker, Waters, Visa, Alphabet, Pfizer, Interactive Brokers, ADP all reduced; MSCI −61%, Rollins −58%. EDGAR-reconstructable.",
    url: "https://holdlens.com/learn/terry-smith-q1-2026-moves",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — superinvestor 13F tracking with ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terry Smith's Q1 2026 13F moves",
    description: "Fundsmith trims almost its entire US book — Marriott, Stryker, Waters, Visa, Alphabet, Pfizer all reduced. A uniform pullback.",
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
      { "@type": "ListItem", position: 3, name: "Terry Smith Q1 2026 moves", item: "https://holdlens.com/learn/terry-smith-q1-2026-moves" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Terry Smith's Q1 2026 13F moves — Fundsmith trims almost its entire US book",
    description:
      "Fundsmith Q1 2026 13F: a near-uniform reduction across the US-listed book. Marriott (−15%), Stryker (−17%), Waters (−10%), Visa (−12%), Alphabet (−16%), Pfizer (−17%), Interactive Brokers (−22%) and ADP (−8%) all trimmed; MSCI cut 61% and Rollins 58% to near-exits. 34 positions of quality compounders. EDGAR-reconstructable.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/terry-smith-q1-2026-moves",
    datePublished: "2026-05-28",
    dateModified: "2026-05-28",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Terry Smith Q1 2026",
      "Fundsmith 13F May 2026",
      "Fundsmith trims",
      "Terry Smith Visa Alphabet",
      "Fundsmith Marriott Stryker",
      "Fundsmith 13F filing analysis",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens superinvestor quarterly recaps",
      url: "https://holdlens.com/learn",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001569205&type=13F-HR",
      "https://en.wikipedia.org/wiki/Terry_Smith_(fund_manager)",
      "https://en.wikipedia.org/wiki/Fundsmith",
      "https://holdlens.com/reports/2026-05-q1-2026-13f-signal-summary",
      "https://holdlens.com/api/v1/snapshot/2026-Q1.json",
      "https://holdlens.com/investor/terry-smith",
    ],
    about: [
      { "@type": "Person", name: "Terry Smith" },
      { "@type": "Organization", name: "Fundsmith" },
      { "@type": "Corporation", name: "Marriott International", tickerSymbol: "MAR" },
      { "@type": "Corporation", name: "Stryker Corp", tickerSymbol: "SYK" },
      { "@type": "Corporation", name: "Visa Inc.", tickerSymbol: "V" },
      { "@type": "Corporation", name: "Alphabet Inc.", tickerSymbol: "GOOGL" },
      { "@type": "Corporation", name: "Pfizer Inc.", tickerSymbol: "PFE" },
    ],
  },
];

export default function TerrySmithQ12026Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Quarterly recaps</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
        Terry Smith&apos;s Q1 2026 13F moves
      </h1>

      <AuthorByline date="2026-05-28" />
      <ShareStrip url="https://holdlens.com/learn/terry-smith-q1-2026-moves" title="Terry Smith's Q1 2026 13F moves" />

      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Fundsmith&apos;s Q1 2026 13F-HR (filed 2026-05-15) shows Terry Smith — the
          &ldquo;English Warren Buffett&rdquo; — doing something unusual:{" "}
          <strong>trimming almost every top position at once</strong>. Marriott (−15%), Stryker
          (−17%), Waters (−10%),{" "}
          <Link href="/ticker/V" className="text-brand underline">Visa</Link> (−12%),{" "}
          <Link href="/ticker/GOOGL" className="text-brand underline">Alphabet</Link> (−16%),{" "}
          <Link href="/ticker/PFE" className="text-brand underline">Pfizer</Link> (−17%),
          Interactive Brokers (−22%) and ADP (−8%) were all reduced, with MSCI (−61%) and Rollins
          (−58%) cut to near-exits. There are no offsetting adds among the top moves — a uniform
          pullback across a 34-name quality-compounder book. Every move is{" "}
          <Link href="/learn/edgar-explained" className="text-brand underline">
            reconstructable from EDGAR
          </Link>{" "}
          using Form 13F-HR.
        </TldrCard>

        <h2 className="text-2xl font-bold mt-12 mb-3">The Q1 2026 picture</h2>
        <p>
          Fundsmith&apos;s doctrine is famously simple: &ldquo;buy good companies, don&apos;t
          overpay, do nothing.&rdquo; The &ldquo;do nothing&rdquo; is what makes Q1 2026 notable —
          because Fundsmith did quite a lot, and all in one direction. Every one of the largest
          US-listed positions was trimmed. This is the US-listed sleeve of a UK-domiciled global
          fund, so it is a partial view, but the pattern within it is unusually uniform.
        </p>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Broad trims across the top of the book</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Marriott (MAR) −15% to 8.6%, Stryker (SYK) −17% to 7.8%,
              Waters (WAT) −10% to 7.5%</strong> — the three largest positions, all reduced.
            </li>
            <li>
              <strong className="text-text">Visa (V) −12% to 7.3%, Alphabet (GOOGL) −16% to 6.6%,
              Pfizer (PFE) −17% to 6.6%, Interactive Brokers (IBKR) −22% to 6.4%, ADP −8% to 6.1%</strong>{" "}
              — the mid-book quality names, also trimmed.
            </li>
            <li>
              <strong className="text-text">MSCI −61% to 0.3%, Rollins −58% to 0.3%</strong> — cut
              to token positions, effectively near-exits.
            </li>
            <li>
              <strong className="text-text">Fortinet (−6%), Otis (−12%)</strong> — further small
              reductions. No top-position adds appear in the quarter.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">What the pattern signals</h2>
        <p>
          The defining feature is <strong>uniformity</strong>: a broad, simultaneous reduction
          rather than a rotation from one name into another. When a long-only fund trims nearly its
          whole book at once and adds nothing material, the usual explanations are net selling —
          raising cash, meeting redemptions, or a fund-level rebalancing — rather than a series of
          individual stock calls. Fundsmith has publicly discussed flows in recent years, but the
          13F alone cannot confirm which of these drove the quarter; it shows the <em>what</em>, not
          the <em>why</em>.
        </p>
        <p>
          What it is <em>not</em> is a thesis change on any single company: the same quality names
          (Marriott, Stryker, Waters, Visa, Alphabet, Microsoft, Meta) remain the core of the book,
          just at lower weights. The portfolio still looks like Fundsmith — high-quality,
          cash-generative compounders — only lighter.
        </p>
        <p>
          It also contrasts sharply with the buyers this quarter. Where{" "}
          <Link href="/learn/klarman-q1-2026-moves" className="text-brand underline">
            Seth Klarman was adding
          </Link>{" "}
          and{" "}
          <Link href="/learn/mandel-q1-2026-moves" className="text-brand underline">
            Lone Pine was building new positions
          </Link>
          , Fundsmith spent the quarter lightening. Same public record, opposite posture.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-12 mb-3">How to verify this yourself</h2>
        <p>
          Every position change above is reconstructable from public SEC EDGAR filings. Steps:
        </p>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2 leading-relaxed mt-4">
          <li>
            Open{" "}
            <Link href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001569205&type=13F-HR" className="text-brand underline">
              Fundsmith&apos;s 13F-HR filing history
            </Link>{" "}
            on EDGAR (CIK 0001569205).
          </li>
          <li>
            Compare the Q1 2026 13F (filed 2026-05-15, report date 2026-03-31) line-by-line against
            the Q4 2025 13F (filed Feb 2026).
          </li>
          <li>
            Position changes appear as decreased share counts across nearly every top holding (the
            broad trim), with MSCI and Rollins reduced to token sizes.
          </li>
          <li>
            Cross-reference with HoldLens&apos;s machine-readable{" "}
            <Link href="/api/v1/snapshot/2026-Q1.json" className="text-brand underline">
              /api/v1/snapshot/2026-Q1.json
            </Link>{" "}
            and the live{" "}
            <Link href="/investor/terry-smith" className="text-brand underline">Terry Smith portfolio page</Link>.
          </li>
        </ol>

        <OurView>
          A near-uniform trim with no offsetting adds is a different kind of signal from a stock
          call. The most likely reading is fund-level selling — cash, flows, or rebalancing — rather
          than Smith turning bearish on Marriott, Visa or Alphabet individually; the book still
          holds the same quality compounders at lower weights. The one firm conclusion the 13F
          supports is that Fundsmith&apos;s US-listed sleeve carried less equity exposure at the end
          of Q1 than at the start. As always with a 13F, this is the US long book only, and the
          &ldquo;why&rdquo; is not disclosed — only the &ldquo;what.&rdquo;
        </OurView>

        <FamousTradesBlock currentSlug="terry-smith-q1-2026-moves" />

        <CiteThisPage />

        <InvestingBooks />

        <LearnReadNext currentSlug="terry-smith-q1-2026-moves" />

        <p className="text-xs text-dim pt-6 border-t border-border mt-10">
          Not investment advice. Sourced from public SEC EDGAR Form 13F-HR filings (Fundsmith CIK
          0001569205). All position changes verifiable from Form 13F-HR alone. A 13F shows only the
          US-listed long sleeve of this UK-domiciled fund. 13F-HR data is a 45-day-lagged snapshot —
          see{" "}
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
