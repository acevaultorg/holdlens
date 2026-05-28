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
  title: "Mohnish Pabrai's Q1 2026 13F moves — a three-stock book, 68% in met coal",
  description:
    "Pabrai Investment Funds' Q1 2026 13F (filed May 15, 2026) is the most concentrated filing HoldLens tracks: just three positions. Warrior Met Coal (39.9%) and Alpha Metallurgical (28.1%, added) make met coal 68% of the US book; Transocean (32%) was trimmed 25% and Valaris exited entirely. A pure deep-value commodity-cyclical bet. Reconstructable from public EDGAR filings.",
  alternates: { canonical: "https://holdlens.com/learn/pabrai-q1-2026-moves" },
  openGraph: {
    title: "Mohnish Pabrai's Q1 2026 moves — a three-stock book, 68% met coal",
    description:
      "Pabrai Q1 2026: three holdings only — Warrior Met Coal (39.9%) + Alpha Metallurgical (28.1%, added) = 68% met coal; Transocean trimmed 25%, Valaris exited. EDGAR-reconstructable.",
    url: "https://holdlens.com/learn/pabrai-q1-2026-moves",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — superinvestor 13F tracking with ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohnish Pabrai's Q1 2026 13F moves",
    description: "A three-stock book — 68% met coal (Warrior + Alpha), Transocean trimmed, Valaris exited. The most concentrated 13F we track.",
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
      { "@type": "ListItem", position: 3, name: "Pabrai Q1 2026 moves", item: "https://holdlens.com/learn/pabrai-q1-2026-moves" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Mohnish Pabrai's Q1 2026 13F moves — a three-stock book concentrated in met coal",
    description:
      "Pabrai Investment Funds Q1 2026 13F: just three US-listed positions. Warrior Met Coal (39.9%) and Alpha Metallurgical (28.1%, added 7%) make metallurgical coal 68% of the book; Transocean (32%) trimmed 25%; Valaris exited entirely. The most concentrated 13F HoldLens tracks — a pure deep-value commodity-cyclical bet. EDGAR-reconstructable.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/pabrai-q1-2026-moves",
    datePublished: "2026-05-28",
    dateModified: "2026-05-28",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Mohnish Pabrai Q1 2026",
      "Pabrai Investment Funds 13F May 2026",
      "Pabrai Warrior Met Coal",
      "Pabrai Alpha Metallurgical",
      "Pabrai Transocean Valaris",
      "Pabrai concentrated portfolio 13F",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens superinvestor quarterly recaps",
      url: "https://holdlens.com/learn",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001549575&type=13F-HR",
      "https://en.wikipedia.org/wiki/Mohnish_Pabrai",
      "https://holdlens.com/reports/2026-05-q1-2026-13f-signal-summary",
      "https://holdlens.com/api/v1/snapshot/2026-Q1.json",
      "https://holdlens.com/investor/monish-pabrai",
    ],
    about: [
      { "@type": "Person", name: "Mohnish Pabrai" },
      { "@type": "Organization", name: "Pabrai Investment Funds" },
      { "@type": "Corporation", name: "Warrior Met Coal Inc.", tickerSymbol: "HCC" },
      { "@type": "Corporation", name: "Alpha Metallurgical Resources", tickerSymbol: "AMR" },
      { "@type": "Corporation", name: "Transocean Ltd.", tickerSymbol: "RIG" },
      { "@type": "Corporation", name: "Valaris Ltd.", tickerSymbol: "VAL" },
    ],
  },
];

export default function PabraiQ12026Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Quarterly recaps</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
        Mohnish Pabrai&apos;s Q1 2026 13F moves
      </h1>

      <AuthorByline date="2026-05-28" />
      <ShareStrip url="https://holdlens.com/learn/pabrai-q1-2026-moves" title="Mohnish Pabrai's Q1 2026 13F moves" />

      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Pabrai Investment Funds&apos; Q1 2026 13F-HR (filed 2026-05-15) is the{" "}
          <strong>most concentrated filing HoldLens tracks: just three positions</strong>. Warrior
          Met Coal (39.9%) and Alpha Metallurgical (28.1%, added 7%) together make metallurgical
          coal 68% of the US book. Transocean (32%) was trimmed 25%, and Valaris was exited
          entirely. The result is a near-pure deep-value bet on two cyclical commodities — met coal
          and offshore drilling — with the coal side now dominant. Every move is{" "}
          <Link href="/learn/edgar-explained" className="text-brand underline">
            reconstructable from EDGAR
          </Link>{" "}
          using Form 13F-HR.
        </TldrCard>

        <h2 className="text-2xl font-bold mt-12 mb-3">The Q1 2026 picture</h2>
        <p>
          Mohnish Pabrai built his reputation on cloning the best investors and concentrating
          ruthlessly — &ldquo;heads I win, tails I don&apos;t lose much.&rdquo; His US 13F has
          always been small, because much of his capital sits in international names (notably India)
          that a US Form 13F does not capture. But even by his standards, Q1 2026 is extreme: the
          entire reported US book is <strong>three stocks</strong>.
        </p>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">The entire three-stock book</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Warrior Met Coal (HCC) — 39.9%</strong>. The largest
              position, held; a pure-play metallurgical (steelmaking) coal producer.
            </li>
            <li>
              <strong className="text-text">Transocean (RIG) — 32%, trimmed 25%</strong>. The
              offshore-drilling contractor, reduced but still the second-largest holding.
            </li>
            <li>
              <strong className="text-text">Alpha Metallurgical (AMR) — 28.1%, added 7%</strong>.
              A second metallurgical-coal producer, increased.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">The exit</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Valaris (VAL) — exited</strong>. The other
              offshore-drilling name was sold out of the book entirely. Combined with the Transocean
              trim, Pabrai reduced offshore-drilling exposure while increasing met coal.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">What the pattern signals</h2>
        <p>
          The book is a <strong>concentrated cyclical-commodity bet, tilting harder into met
          coal</strong>. Warrior plus Alpha now make steelmaking coal 68% of the reported US
          positions, while offshore drilling was reduced (Transocean trimmed, Valaris exited). These
          are deep-value, out-of-favour industries — the kind of contrarian, low-expectation bets
          Pabrai has favoured throughout his career.
        </p>
        <p>
          Two cautions on interpretation. First, this is only the US 13F: Pabrai&apos;s
          international holdings are not disclosed here, so the three stocks are not his whole
          portfolio. Second, with so few names, a single price move materially changes the
          weights — the concentration is the strategy, not an accident.
        </p>
        <p>
          It is a striking contrast with the AI-themed books elsewhere this quarter — where{" "}
          <Link href="/learn/coleman-q1-2026-moves" className="text-brand underline">
            Tiger Global bought AI hardware
          </Link>{" "}
          and{" "}
          <Link href="/learn/mandel-q1-2026-moves" className="text-brand underline">
            Lone Pine bought AI&apos;s power and infrastructure
          </Link>
          , Pabrai is in steelmaking coal and offshore rigs. Same EDGAR record, opposite ends of
          the market.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-12 mb-3">How to verify this yourself</h2>
        <p>
          Every position change above is reconstructable from public SEC EDGAR filings. Steps:
        </p>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2 leading-relaxed mt-4">
          <li>
            Open{" "}
            <Link href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001549575&type=13F-HR" className="text-brand underline">
              Pabrai Investment Funds&apos; 13F-HR filing history
            </Link>{" "}
            on EDGAR (CIK 0001549575).
          </li>
          <li>
            Compare the Q1 2026 13F (filed 2026-05-15, report date 2026-03-31) line-by-line against
            the Q4 2025 13F (filed Feb 2026).
          </li>
          <li>
            Position changes appear as: an increased Alpha Metallurgical share count, a decreased
            Transocean share count, and a removed Valaris CUSIP row (the exit).
          </li>
          <li>
            Cross-reference with HoldLens&apos;s machine-readable{" "}
            <Link href="/api/v1/snapshot/2026-Q1.json" className="text-brand underline">
              /api/v1/snapshot/2026-Q1.json
            </Link>{" "}
            and the live{" "}
            <Link href="/investor/monish-pabrai" className="text-brand underline">Mohnish Pabrai portfolio page</Link>.
          </li>
        </ol>

        <OurView>
          A three-stock US 13F is about as pure a conviction statement as the public record
          produces. Pabrai is betting on two beaten-down cyclical industries — metallurgical coal
          and offshore drilling — and within them, leaning harder into coal (Warrior held, Alpha
          added) while reducing rigs (Transocean trimmed, Valaris exited). It is the deep-value,
          contrarian playbook taken to its concentration limit. The key caveat: this is only the
          US-listed sleeve, so it understates the diversification of his full book. Whether the bet
          proves correct is something only time and the commodity cycle can answer; the public
          record tells us where Pabrai&apos;s US capital is concentrated <em>right now</em>.
        </OurView>

        <FamousTradesBlock currentSlug="pabrai-q1-2026-moves" />

        <CiteThisPage />

        <InvestingBooks />

        <LearnReadNext currentSlug="pabrai-q1-2026-moves" />

        <p className="text-xs text-dim pt-6 border-t border-border mt-10">
          Not investment advice. Sourced from public SEC EDGAR Form 13F-HR filings (Pabrai
          Investment Funds CIK 0001549575). All position changes verifiable from Form 13F-HR alone.
          A 13F shows only long U.S.-listed positions — Pabrai&apos;s international holdings are not
          disclosed. 13F-HR data is a 45-day-lagged snapshot — see{" "}
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
