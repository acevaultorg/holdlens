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
  title: "Seth Klarman's Q1 2026 13F moves — Baupost makes Amazon its top holding, opens Aon + Visa",
  description:
    "Baupost Group's Q1 2026 13F (filed May 15, 2026) shows Seth Klarman — the Margin of Safety author and dean of value investing — adding Amazon 47% to make it the top holding at 12.7%, adding Alphabet and Ferguson, and opening new Aon, Visa and Teleflex positions, while trimming Willis Towers Watson and Liberty. A concentrated 22-position book. Reconstructable from public EDGAR filings.",
  alternates: { canonical: "https://holdlens.com/learn/klarman-q1-2026-moves" },
  openGraph: {
    title: "Seth Klarman's Q1 2026 moves — Baupost makes Amazon #1, opens Aon + Visa",
    description:
      "Baupost Q1 2026: Amazon +47% to top holding (12.7%), Alphabet + Ferguson added, new Aon / Visa / Teleflex; Willis Towers Watson trimmed. EDGAR-reconstructable.",
    url: "https://holdlens.com/learn/klarman-q1-2026-moves",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — superinvestor 13F tracking with ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seth Klarman's Q1 2026 13F moves",
    description: "Baupost makes Amazon its top holding (+47%, 12.7%), opens Aon + Visa + Teleflex, adds Alphabet + Ferguson.",
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
      { "@type": "ListItem", position: 3, name: "Klarman Q1 2026 moves", item: "https://holdlens.com/learn/klarman-q1-2026-moves" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Seth Klarman's Q1 2026 13F moves — Baupost makes Amazon its top holding",
    description:
      "Baupost Group Q1 2026 13F: Amazon added 47% by share count to become the top holding at 12.7%; Alphabet (+9%) and Ferguson (+27%) added; new positions in Aon (4.9%), Visa (4.1%) and Teleflex (3.7%); Americold added 124%. Willis Towers Watson trimmed 34%, Liberty 42%, Eagle Materials 25%. A concentrated 22-position value book. EDGAR-reconstructable.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/klarman-q1-2026-moves",
    datePublished: "2026-05-28",
    dateModified: "2026-05-28",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Seth Klarman Q1 2026",
      "Baupost Group 13F May 2026",
      "Klarman Amazon top holding",
      "Baupost Aon Visa Teleflex",
      "Klarman Margin of Safety portfolio",
      "Baupost Group 13F filing analysis",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens superinvestor quarterly recaps",
      url: "https://holdlens.com/learn",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001061768&type=13F-HR",
      "https://en.wikipedia.org/wiki/Seth_Klarman",
      "https://en.wikipedia.org/wiki/Baupost_Group",
      "https://holdlens.com/reports/2026-05-q1-2026-13f-signal-summary",
      "https://holdlens.com/api/v1/snapshot/2026-Q1.json",
      "https://holdlens.com/investor/seth-klarman",
    ],
    about: [
      { "@type": "Person", name: "Seth Klarman" },
      { "@type": "Organization", name: "Baupost Group" },
      { "@type": "Corporation", name: "Amazon.com Inc.", tickerSymbol: "AMZN" },
      { "@type": "Corporation", name: "Alphabet Inc.", tickerSymbol: "GOOG" },
      { "@type": "Corporation", name: "Ferguson plc", tickerSymbol: "FERG" },
      { "@type": "Corporation", name: "Aon plc", tickerSymbol: "AON" },
      { "@type": "Corporation", name: "Visa Inc.", tickerSymbol: "V" },
    ],
  },
];

export default function KlarmanQ12026Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Quarterly recaps</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
        Seth Klarman&apos;s Q1 2026 13F moves
      </h1>

      <AuthorByline date="2026-05-28" />
      <ShareStrip url="https://holdlens.com/learn/klarman-q1-2026-moves" title="Seth Klarman's Q1 2026 13F moves" />

      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Baupost Group&apos;s Q1 2026 13F-HR (filed 2026-05-15) shows Seth Klarman — the{" "}
          <em>Margin of Safety</em> author and one of the most respected value investors alive —{" "}
          <strong>making Amazon his top holding</strong>, adding 47% by share count to 12.7% of the
          book. He also added{" "}
          <Link href="/ticker/GOOG" className="text-brand underline">Alphabet</Link> (+9%) and
          Ferguson (+27%), and opened new positions in Aon (4.9%),{" "}
          <Link href="/ticker/V" className="text-brand underline">Visa</Link> (4.1%) and Teleflex
          (3.7%), while trimming Willis Towers Watson (−34%) and Liberty (−42%). A concentrated
          22-position book. Every move is{" "}
          <Link href="/learn/edgar-explained" className="text-brand underline">
            reconstructable from EDGAR
          </Link>{" "}
          using Form 13F-HR.
        </TldrCard>

        <h2 className="text-2xl font-bold mt-12 mb-3">The Q1 2026 picture</h2>
        <p>
          Few investors carry Klarman&apos;s reputation. Baupost has compounded for four decades on
          a doctrine of capital preservation, and <em>Margin of Safety</em> is one of the most
          sought-after investing books ever written. So a 13F that adds aggressively to a mega-cap
          growth name is worth reading carefully — and Q1 2026 has exactly that: Amazon, already a
          position, was lifted 47% by share count to become the single largest holding in a
          concentrated 22-name book.
        </p>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Amazon to the top + adds</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">
                <Link href="/ticker/AMZN" className="text-brand underline">Amazon (AMZN)</Link>
              </strong>{" "}
              — added 47% by share count to 12.7%, the top holding.
            </li>
            <li>
              <strong className="text-text">Alphabet (GOOG) +9% to 6.6%, Ferguson (FERG) +27% to
              6.6%</strong> — a mega-cap platform and a building-products distributor added in size.
            </li>
            <li>
              <strong className="text-text">Americold (COLD) +124% to 1.7%</strong> — the cold-storage
              REIT roughly doubled.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">New positions</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Aon (AON) 4.9%, Visa (V) 4.1%, Teleflex (TFX) 3.7%</strong>{" "}
              — brand-new stakes in an insurance broker, a payment network, and a medical-device
              maker. Quality-franchise businesses, characteristically value-priced entries.
            </li>
            <li>
              <strong className="text-text">Norwegian Cruise Line (NCLH) 1.3%, Vaxcyte (PCVX) 0.9%</strong>{" "}
              — smaller new positions.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Trims</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Willis Towers Watson (WTW) −34% to 5.1%, Liberty
              (LBTYK) −42% to 3.1%, Eagle Materials (EXP) −25% to 3.3%</strong> — the largest
              reductions, funding the adds and new positions.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">What the pattern signals</h2>
        <p>
          The quarter reads as a <strong>rotation toward quality franchises</strong> within a
          value framework. Amazon to the top, Alphabet and Ferguson added, and new Aon, Visa and
          Teleflex positions all point to durable-business quality — bought, in Klarman&apos;s
          style, when the price offered a margin of safety. The trims (Willis Towers Watson,
          Liberty, Eagle Materials) funded the shift rather than signalling a directional retreat.
        </p>
        <p>
          The 13F shows only US-listed long positions and omits Baupost&apos;s well-known private,
          credit and distressed exposures — so this is a partial window. But on the public-equity
          sleeve, the direction is clear: more weight in large, durable compounders at Q1 prices.
        </p>
        <p>
          Notably, Klarman is not alone in adding Amazon this quarter:{" "}
          <Link href="/learn/halvorsen-q1-2026-moves" className="text-brand underline">
            several tracked managers reshaped their mega-cap exposure
          </Link>
          , and Visa appears as a fresh or growing position across multiple recaps.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-12 mb-3">How to verify this yourself</h2>
        <p>
          Every position change above is reconstructable from public SEC EDGAR filings. Steps:
        </p>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2 leading-relaxed mt-4">
          <li>
            Open{" "}
            <Link href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001061768&type=13F-HR" className="text-brand underline">
              Baupost Group&apos;s 13F-HR filing history
            </Link>{" "}
            on EDGAR (CIK 0001061768).
          </li>
          <li>
            Compare the Q1 2026 13F (filed 2026-05-15, report date 2026-03-31) line-by-line against
            the Q4 2025 13F (filed Feb 2026).
          </li>
          <li>
            Position changes appear as: increased share counts (Amazon, Alphabet, Ferguson,
            Americold adds), new CUSIP rows (Aon, Visa, Teleflex, Norwegian, Vaxcyte), and decreased
            share counts (Willis Towers Watson, Liberty, Eagle Materials trims).
          </li>
          <li>
            Cross-reference with HoldLens&apos;s machine-readable{" "}
            <Link href="/api/v1/snapshot/2026-Q1.json" className="text-brand underline">
              /api/v1/snapshot/2026-Q1.json
            </Link>{" "}
            and the live{" "}
            <Link href="/investor/seth-klarman" className="text-brand underline">Seth Klarman portfolio page</Link>.
          </li>
        </ol>

        <OurView>
          For a value investor whose reputation rests on caution, making Amazon the top holding is a
          notable statement — but a characteristic one: Klarman has long argued that quality and
          value are not opposites when the price is right. The pattern across the quarter — Amazon,
          Alphabet, Ferguson added; Aon, Visa, Teleflex opened — is a tilt toward durable franchises
          rather than a style change. Because the 13F hides Baupost&apos;s private and credit book,
          read this as the public-equity sleeve only. Whether the call proves correct is something
          only time can answer; the public record tells us how Baupost&apos;s long-equity book is
          positioned <em>right now</em> — concentrated in large, durable businesses.
        </OurView>

        <FamousTradesBlock currentSlug="klarman-q1-2026-moves" />

        <CiteThisPage />

        <InvestingBooks />

        <LearnReadNext currentSlug="klarman-q1-2026-moves" />

        <p className="text-xs text-dim pt-6 border-t border-border mt-10">
          Not investment advice. Sourced from public SEC EDGAR Form 13F-HR filings (Baupost Group
          CIK 0001061768). All position changes verifiable from Form 13F-HR alone. A 13F shows only
          long U.S.-listed positions — Baupost&apos;s private, credit and distressed holdings are
          not disclosed. 13F-HR data is a 45-day-lagged snapshot — see{" "}
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
