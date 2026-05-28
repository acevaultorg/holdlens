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
  title: "Andreas Halvorsen's Q1 2026 13F moves — Viking pushes Visa to #1, builds quality industrials",
  description:
    "Viking Global's Q1 2026 13F (filed May 15, 2026) shows Andreas Halvorsen lifting Visa to the top holding (+59% by share count, 5.4%), building a quality-industrials and healthcare-tools cluster (Danaher, Fortive, Thermo Fisher +110%, new Air Products, Lennox +153%), and adding aggressively to Carvana (+162%) and Tesla (+47%) — while trimming Microsoft (−28%), Alphabet (−10%) and TSMC. New Apple position. A broad 77-name long-short book tilting toward quality and away from mega-cap software. Reconstructable from public EDGAR filings.",
  alternates: { canonical: "https://holdlens.com/learn/halvorsen-q1-2026-moves" },
  openGraph: {
    title: "Andreas Halvorsen's Q1 2026 moves — Viking pushes Visa to #1, trims mega-cap software",
    description:
      "Viking Global Q1 2026: Visa to #1 (+59%), quality-industrials build (Danaher, Fortive, Thermo Fisher +110%, Air Products new), Carvana +162%, Tesla +47%; Microsoft −28%, Alphabet −10% trimmed. EDGAR-reconstructable.",
    url: "https://holdlens.com/learn/halvorsen-q1-2026-moves",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — superinvestor 13F tracking with ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Andreas Halvorsen's Q1 2026 13F moves",
    description: "Viking pushes Visa to #1 (+59%), builds quality industrials, trims Microsoft + Alphabet. New Apple.",
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
      { "@type": "ListItem", position: 3, name: "Halvorsen Q1 2026 moves", item: "https://holdlens.com/learn/halvorsen-q1-2026-moves" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Andreas Halvorsen's Q1 2026 13F moves — Viking pushes Visa to the top as quality industrials build",
    description:
      "Viking Global Investors Q1 2026 13F: Visa added 59% by share count to the #1 holding (5.4%); a quality-industrials and healthcare-tools cluster built across Danaher (+19%), Fortive (+17%), Thermo Fisher (+110%), new Air Products, and Lennox (+153%); aggressive adds to Carvana (+162%) and Tesla (+47%); Schwab and JPMorgan added. New Apple position. Microsoft trimmed 28%, Alphabet 10%, TSMC 9%, BridgeBio 18%. A diversified 77-position long-short book. EDGAR-reconstructable.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/halvorsen-q1-2026-moves",
    datePublished: "2026-05-28",
    dateModified: "2026-05-28",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Andreas Halvorsen Q1 2026",
      "Viking Global 13F May 2026",
      "Viking Global Visa",
      "Halvorsen quality industrials",
      "Viking Global Carvana Tesla",
      "Viking Global Investors 13F filing analysis",
      "Andreas Halvorsen quarterly recap",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens superinvestor quarterly recaps",
      url: "https://holdlens.com/learn",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001103804&type=13F-HR",
      "https://en.wikipedia.org/wiki/Ole_Andreas_Halvorsen",
      "https://en.wikipedia.org/wiki/Viking_Global_Investors",
      "https://holdlens.com/reports/2026-05-q1-2026-13f-signal-summary",
      "https://holdlens.com/api/v1/snapshot/2026-Q1.json",
      "https://holdlens.com/investor/andreas-halvorsen",
    ],
    about: [
      { "@type": "Person", name: "Andreas Halvorsen" },
      { "@type": "Organization", name: "Viking Global Investors" },
      { "@type": "Corporation", name: "Visa Inc.", tickerSymbol: "V" },
      { "@type": "Corporation", name: "Danaher Corp", tickerSymbol: "DHR" },
      { "@type": "Corporation", name: "Fortive Corp", tickerSymbol: "FTV" },
      { "@type": "Corporation", name: "Thermo Fisher Scientific", tickerSymbol: "TMO" },
      { "@type": "Corporation", name: "Microsoft Corp", tickerSymbol: "MSFT" },
      { "@type": "Corporation", name: "Carvana Co.", tickerSymbol: "CVNA" },
    ],
  },
];

export default function HalvorsenQ12026Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Quarterly recaps</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
        Andreas Halvorsen&apos;s Q1 2026 13F moves
      </h1>

      <AuthorByline date="2026-05-28" />
      <ShareStrip url="https://holdlens.com/learn/halvorsen-q1-2026-moves" title="Andreas Halvorsen's Q1 2026 13F moves" />

      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Viking Global&apos;s Q1 2026 13F-HR (filed 2026-05-15) shows Andreas Halvorsen tilting a
          broad long-short book <strong>toward quality and away from mega-cap software</strong>.{" "}
          <Link href="/ticker/V" className="text-brand underline">Visa</Link> — his longest-held
          name (since 2015) — was added 59% by share count to become the top holding at 5.4%. A
          cluster of quality industrials and healthcare-tools was built: Danaher (+19%), Fortive
          (+17%), Thermo Fisher (+110%), a new Air Products stake, and Lennox (+153%). He added
          aggressively to Carvana (+162%) and{" "}
          <Link href="/ticker/TSLA" className="text-brand underline">Tesla</Link> (+47%), and opened
          a new Apple position — while trimming{" "}
          <Link href="/ticker/MSFT" className="text-brand underline">Microsoft</Link> (−28%),
          Alphabet (−10%) and TSMC (−9%). Every move is{" "}
          <Link href="/learn/edgar-explained" className="text-brand underline">
            reconstructable from EDGAR
          </Link>{" "}
          using Form 13F-HR.
        </TldrCard>

        <h2 className="text-2xl font-bold mt-12 mb-3">The Q1 2026 picture</h2>
        <p>
          Viking Global is a Tiger Cub long-short fund — Halvorsen co-founded it in 1999 after
          leaving Julian Robertson&apos;s Tiger Management — and runs one of the largest and most
          respected fundamental books in the business. The 13F shows the long side only, and at 77
          positions it is deliberately diversified: no single name is above 5.4%. The signal,
          therefore, is in the <em>tilt</em> — which sectors gained weight and which lost it — and
          Q1 2026 has a clear one.
        </p>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Visa to the top + a quality-compounder build</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">
                <Link href="/ticker/V" className="text-brand underline">Visa (V)</Link>
              </strong>{" "}
              — added 59% by share count to 5.4%, taking Halvorsen&apos;s longest-held position to
              the top of the book.
            </li>
            <li>
              <strong className="text-text">Danaher (DHR) +19% to 3.6%, Fortive (FTV) +17% to 3.5%,
              Thermo Fisher (TMO) +110% to 2.3%</strong> — a deliberate build across
              healthcare-tools and quality-industrial compounders.
            </li>
            <li>
              <strong className="text-text">Air Products (APD)</strong> — brand-new at 3.3%, and{" "}
              <strong className="text-text">Lennox International (LII) +153% to 2.0%</strong> —
              industrial names added in size.
            </li>
            <li>
              <strong className="text-text">Schwab (SCHW) +6% to 3.9%, JPMorgan (JPM) +42% to 2.2%</strong>{" "}
              — financials reinforced alongside Visa.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Aggressive single-name adds + a new Apple stake</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Carvana (CVNA) +162% to 2.4%</strong> and{" "}
              <strong className="text-text">
                <Link href="/ticker/TSLA" className="text-brand underline">Tesla (TSLA)</Link> +47%
                to 2.6%
              </strong>{" "}
              — the most aggressive proportional adds among the larger positions.
            </li>
            <li>
              <strong className="text-text">Apple (AAPL)</strong> — brand-new at 2.6%.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">What was trimmed</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">
                <Link href="/ticker/MSFT" className="text-brand underline">Microsoft (MSFT)</Link>{" "}
                −28% to 2.4%, Alphabet (GOOGL) −10% to 1.9%
              </strong>{" "}
              — mega-cap software lightened.
            </li>
            <li>
              <strong className="text-text">
                <Link href="/ticker/TSM" className="text-brand underline">TSMC (TSM)</Link> −9% to
                4.2%, BridgeBio (BBIO) −18% to 2.5%
              </strong>{" "}
              — modest reductions.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">What the pattern signals</h2>
        <p>
          The tilt is toward <strong>quality compounders and financials</strong> and away from
          mega-cap software. Visa to the top, a healthcare-tools and industrials cluster (Danaher,
          Fortive, Thermo Fisher, Air Products, Lennox), and reinforced financials (Schwab,
          JPMorgan) sit on one side; trims of Microsoft, Alphabet and TSMC sit on the other. The
          aggressive Carvana and Tesla adds and the new Apple stake show Halvorsen is not running
          from risk — he is reshaping which risks the book carries.
        </p>
        <p>
          The 13F shows only the long side of a long-short fund, so the picture is partial: hedges
          and shorts are invisible (see{" "}
          <Link href="/learn/form-4-vs-13f" className="text-brand underline">what a 13F does and doesn&apos;t show</Link>
          ). What the public record establishes is direction on the long book: more weight in
          quality industrials, healthcare-tools and payments; less in the largest software names.
        </p>
        <p>
          For comparison, this quarter&apos;s recaps show several distinct reads. Chase Coleman{" "}
          <Link href="/learn/coleman-q1-2026-moves" className="text-brand underline">
            piled into AI hardware and halved Microsoft
          </Link>
          . Chris Hohn{" "}
          <Link href="/learn/hohn-q1-2026-moves" className="text-brand underline">
            gutted Microsoft to deepen GE + Visa
          </Link>
          . Two of the three fellow funds here trimmed Microsoft too — but Halvorsen&apos;s
          redeployment is the broadest, spread across quality industrials rather than a single
          thesis.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-12 mb-3">How to verify this yourself</h2>
        <p>
          Every position change above is reconstructable from public SEC EDGAR filings. Steps:
        </p>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2 leading-relaxed mt-4">
          <li>
            Open{" "}
            <Link href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001103804&type=13F-HR" className="text-brand underline">
              Viking Global Investors&apos; 13F-HR filing history
            </Link>{" "}
            on EDGAR (CIK 0001103804).
          </li>
          <li>
            Compare the Q1 2026 13F (filed 2026-05-15, report date 2026-03-31) line-by-line against
            the Q4 2025 13F (filed Feb 2026).
          </li>
          <li>
            Position changes appear as: increased share counts (the Visa, Danaher, Thermo Fisher,
            Carvana, Tesla adds), decreased share counts (the Microsoft, Alphabet, TSMC trims), and
            new CUSIP rows (Air Products and Apple).
          </li>
          <li>
            Cross-reference with HoldLens&apos;s machine-readable{" "}
            <Link href="/api/v1/snapshot/2026-Q1.json" className="text-brand underline">
              /api/v1/snapshot/2026-Q1.json
            </Link>{" "}
            and the live{" "}
            <Link href="/investor/andreas-halvorsen" className="text-brand underline">Andreas Halvorsen portfolio page</Link>.
          </li>
        </ol>

        <OurView>
          Viking&apos;s Q1 2026 13F is a tilt, not a pivot — which is what you would expect from a
          77-name long-short book. The consistent thread is quality: Visa to the top, a deliberate
          healthcare-tools and industrials cluster, and financials reinforced, funded partly by
          lightening the largest software names. The aggressive Carvana and Tesla adds keep the
          book&apos;s risk appetite intact. Because a 13F hides Viking&apos;s short book and hedges,
          read this as the long-side direction only — but that direction is clearly toward
          durable-compounder quality at Q1 prices. Whether it proves correct is something only time
          and Q2 returns can answer; the public record tells us how the long book is positioned{" "}
          <em>right now</em>.
        </OurView>

        <FamousTradesBlock currentSlug="halvorsen-q1-2026-moves" />

        <CiteThisPage />

        <InvestingBooks />

        <LearnReadNext currentSlug="halvorsen-q1-2026-moves" />

        <p className="text-xs text-dim pt-6 border-t border-border mt-10">
          Not investment advice. Sourced from public SEC EDGAR Form 13F-HR filings (Viking Global
          Investors CIK 0001103804). All position changes verifiable from Form 13F-HR alone. A 13F
          shows only long U.S.-listed positions — Viking&apos;s shorts and hedges are not disclosed.
          13F-HR data is a 45-day-lagged snapshot — see{" "}
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
