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
  title: "Chase Coleman's Q1 2026 13F moves — Tiger Global piles into AI hardware, halves Microsoft",
  description:
    "Tiger Global's Q1 2026 13F (filed May 15, 2026) shows Chase Coleman leaning hard into AI hardware — Nvidia added to 9.2%, TSMC up 49% to 8.2%, Applied Materials up 85% — while halving Microsoft (−54% by share count, down to 4.1%) and trimming a basket of software, fintech, and gaming names. Alphabet stays the top holding at 13.4%; Meta added. Reconstructable from public EDGAR filings.",
  alternates: { canonical: "https://holdlens.com/learn/coleman-q1-2026-moves" },
  openGraph: {
    title: "Chase Coleman's Q1 2026 moves — Tiger Global piles into AI hardware, halves Microsoft",
    description:
      "Tiger Global Q1 2026: Nvidia to 9.2%, TSMC +49%, Applied Materials +85%; Microsoft halved to 4.1%; Take-Two −66%, Apollo −47%, Reddit −35% trimmed. Alphabet top at 13.4%. EDGAR-reconstructable.",
    url: "https://holdlens.com/learn/coleman-q1-2026-moves",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — superinvestor 13F tracking with ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chase Coleman's Q1 2026 13F moves",
    description: "Tiger Global piles into AI hardware (NVDA, TSM +49%, AMAT +85%), halves Microsoft to 4.1%, trims software/fintech.",
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
      { "@type": "ListItem", position: 3, name: "Coleman Q1 2026 moves", item: "https://holdlens.com/learn/coleman-q1-2026-moves" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Chase Coleman's Q1 2026 13F moves — Tiger Global piles into AI hardware as Microsoft is halved",
    description:
      "Tiger Global Management Q1 2026 13F: Nvidia added to 9.2%, TSMC up 49% by share count to 8.2%, Applied Materials up 85% to 2.5%, Lam Research held — a clear lean into AI hardware. Microsoft cut 54% by share count to 4.1%; Take-Two (−66%), Apollo (−47%), Block (−37%), Reddit (−35%), ServiceNow (−29%) and AppLovin (−23%) trimmed. Meta added; MercadoLibre new. Alphabet remains the top holding at 13.4%; Amazon and Sea held. 53 positions. EDGAR-reconstructable.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/coleman-q1-2026-moves",
    datePublished: "2026-05-28",
    dateModified: "2026-05-28",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Chase Coleman Q1 2026",
      "Tiger Global 13F May 2026",
      "Tiger Global Nvidia TSMC",
      "Coleman Microsoft trim",
      "Tiger Global AI hardware",
      "Tiger Global Management 13F filing analysis",
      "Chase Coleman quarterly recap",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens superinvestor quarterly recaps",
      url: "https://holdlens.com/learn",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001167483&type=13F-HR",
      "https://en.wikipedia.org/wiki/Chase_Coleman_III",
      "https://en.wikipedia.org/wiki/Tiger_Global_Management",
      "https://holdlens.com/reports/2026-05-q1-2026-13f-signal-summary",
      "https://holdlens.com/api/v1/snapshot/2026-Q1.json",
      "https://holdlens.com/investor/chase-coleman",
    ],
    about: [
      { "@type": "Person", name: "Chase Coleman" },
      { "@type": "Organization", name: "Tiger Global Management" },
      { "@type": "Corporation", name: "NVIDIA Corp", tickerSymbol: "NVDA" },
      { "@type": "Corporation", name: "Taiwan Semiconductor Manufacturing", tickerSymbol: "TSM" },
      { "@type": "Corporation", name: "Applied Materials Inc.", tickerSymbol: "AMAT" },
      { "@type": "Corporation", name: "Microsoft Corp", tickerSymbol: "MSFT" },
      { "@type": "Corporation", name: "Alphabet Inc.", tickerSymbol: "GOOGL" },
      { "@type": "Corporation", name: "Meta Platforms Inc.", tickerSymbol: "META" },
    ],
  },
];

export default function ColemanQ12026Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Quarterly recaps</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
        Chase Coleman&apos;s Q1 2026 13F moves
      </h1>

      <AuthorByline date="2026-05-28" />
      <ShareStrip url="https://holdlens.com/learn/coleman-q1-2026-moves" title="Chase Coleman's Q1 2026 13F moves" />

      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Tiger Global Management&apos;s Q1 2026 13F-HR (filed 2026-05-15) shows{" "}
          <strong>a decisive lean into AI hardware</strong>: Nvidia added to 9.2% of the book,{" "}
          <Link href="/ticker/TSM" className="text-brand underline">TSMC</Link> up 49% by share
          count to 8.2%, Applied Materials up 85% to 2.5%, with Lam Research held. Funding it,
          Coleman <strong>halved Microsoft</strong> (−54% by share count, down to 4.1%) and trimmed
          a broad basket of software, fintech and gaming names — Take-Two (−66%), Apollo (−47%),
          Block (−37%), Reddit (−35%), ServiceNow (−29%), AppLovin (−23%). Meta was added;
          MercadoLibre is new.{" "}
          <Link href="/ticker/GOOGL" className="text-brand underline">Alphabet</Link> stays the top
          holding at 13.4%, with Amazon and Sea Ltd held. Every move is{" "}
          <Link href="/learn/edgar-explained" className="text-brand underline">
            reconstructable from EDGAR
          </Link>{" "}
          using Form 13F-HR.
        </TldrCard>

        <h2 className="text-2xl font-bold mt-12 mb-3">The Q1 2026 picture</h2>
        <p>
          Tiger Global is a different animal from the concentrated value managers in this
          quarter&apos;s recaps. Coleman runs a broad, 53-position growth book — Julian Robertson
          seeded the fund in 2001, and it has been one of the largest tech-focused hedge funds ever
          since, famously rebuilding after the 2022 drawdown. Because the portfolio is wide, the
          signal is in <em>where the weight shifts</em>, not in single-name concentration. And in
          Q1 2026 the weight shifted clearly toward the picks-and-shovels of AI.
        </p>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">The AI-hardware build (where capital went)</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">
                <Link href="/ticker/NVDA" className="text-brand underline">Nvidia (NVDA)</Link>
              </strong>{" "}
              — added ~1.0M shares (+9% by share count); now the #2 position at 9.2% of the book.
            </li>
            <li>
              <strong className="text-text">
                <Link href="/ticker/TSM" className="text-brand underline">TSMC (TSM)</Link>
              </strong>{" "}
              — added ~1.84M shares (+49%); up to 8.2%. The biggest proportional add among the
              large positions.
            </li>
            <li>
              <strong className="text-text">Applied Materials (AMAT)</strong> — added ~0.76M shares
              (+85%); to 2.5%. Semiconductor-equipment exposure roughly doubled.
            </li>
            <li>
              <strong className="text-text">Lam Research (LRCX)</strong> — held at 3.6%. Alongside
              the TSMC and AMAT adds, the semi-cap-equipment sleeve is now a deliberate cluster, not
              a single bet.
            </li>
            <li>
              <strong className="text-text">
                <Link href="/ticker/META" className="text-brand underline">Meta Platforms (META)</Link>
              </strong>{" "}
              — added ~0.34M shares (+12%); to 7.7%. Tiger&apos;s longest-held name (since 2012),
              reinforced.
            </li>
            <li>
              <strong className="text-text">Brookfield (BN) +25%, Spotify (SPOT) +25%, Coupang
              (CPNG) +32%</strong> — added across infrastructure-adjacent and consumer-internet
              names; MercadoLibre (MELI) opened new at 1.0%.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">The funding source — Microsoft + a software/fintech trim</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">
                <Link href="/ticker/MSFT" className="text-brand underline">Microsoft (MSFT)</Link>
              </strong>{" "}
              — cut ~2.98M shares (−54% by share count), down to 4.1%. The headline reduction: a
              core mega-cap roughly halved in a single quarter.
            </li>
            <li>
              <strong className="text-text">Take-Two (TTWO) −66%, Apollo (APO) −47%, Block (XYZ)
              −37%, Reddit (RDDT) −35%, ServiceNow (NOW) −29%, AppLovin (APP) −23%, Chime −22%</strong>{" "}
              — a broad trim across high-multiple software, fintech, and gaming. Capital pulled from
              the &ldquo;application&rdquo; layer and rotated toward the hardware that powers it.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">What the pattern signals</h2>
        <p>
          The cleanest read is a <strong>rotation down the AI stack</strong> — from application and
          software platforms toward the semiconductors and equipment that supply them. Coleman
          added to Nvidia, sharply increased TSMC and Applied Materials, and held Lam Research,
          while halving Microsoft and trimming a basket of software, fintech, and gaming names. It
          is not a wholesale tech exit: Alphabet remains the top holding, Meta was added, and Amazon
          and Sea were held. The shift is in <em>which part</em> of tech Tiger wants exposure to.
        </p>
        <p>
          The 13F alone cannot tell us <em>why</em>. The Microsoft cut could be valuation, a
          relative-value call against the hardware names, or position management in a 53-stock book.
          What the public record establishes is direction: at Q1 prices, Tiger Global moved capital
          toward the AI supply chain and away from the higher-multiple software and fintech layer.
        </p>
        <p>
          For comparison, this quarter&apos;s recaps show several distinct mega-tech reads. Chris
          Hohn{" "}
          <Link href="/learn/hohn-q1-2026-moves" className="text-brand underline">
            gutted Microsoft to deepen GE + Visa
          </Link>
          . Bill Ackman{" "}
          <Link href="/learn/ackman-q1-2026-moves" className="text-brand underline">
            swapped Alphabet for Microsoft
          </Link>
          . David Tepper{" "}
          <Link href="/learn/tepper-q1-2026-moves" className="text-brand underline">
            rotated China into US tech
          </Link>
          . Coleman&apos;s version trades the software layer for the hardware beneath it — the same
          public EDGAR record, four different conclusions.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-12 mb-3">How to verify this yourself</h2>
        <p>
          Every position change above is reconstructable from public SEC EDGAR filings. Steps:
        </p>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2 leading-relaxed mt-4">
          <li>
            Open{" "}
            <Link href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001167483&type=13F-HR" className="text-brand underline">
              Tiger Global Management&apos;s 13F-HR filing history
            </Link>{" "}
            on EDGAR (CIK 0001167483).
          </li>
          <li>
            Compare the Q1 2026 13F (filed 2026-05-15, report date 2026-03-31) line-by-line against
            the Q4 2025 13F (filed Feb 2026).
          </li>
          <li>
            Position changes appear as: increased share counts (the NVDA, TSM, AMAT, META adds),
            decreased share counts (the Microsoft cut and the software/fintech trims), and new CUSIP
            rows (MercadoLibre).
          </li>
          <li>
            Cross-reference with HoldLens&apos;s machine-readable{" "}
            <Link href="/api/v1/snapshot/2026-Q1.json" className="text-brand underline">
              /api/v1/snapshot/2026-Q1.json
            </Link>{" "}
            and the live{" "}
            <Link href="/investor/chase-coleman" className="text-brand underline">Chase Coleman portfolio page</Link>.
          </li>
        </ol>

        <OurView>
          Tiger Global&apos;s Q1 2026 13F is one of the cleaner thesis statements this cycle:
          buy the AI supply chain, lighten the AI application layer. Halving Microsoft while adding
          Nvidia, sharply increasing TSMC and Applied Materials, and holding Lam Research is a
          coherent move down the stack toward picks-and-shovels — and the simultaneous trim of
          Take-Two, Apollo, Block, Reddit, ServiceNow and AppLovin shows where the funding came
          from. It is not a tech retreat; Alphabet is still the largest position and Meta was added.
          Whether the call proves correct is something only time and Q2 returns can answer; the
          public record tells us how Tiger is positioned <em>right now</em> — tilted toward the
          hardware that makes the models run.
        </OurView>

        <FamousTradesBlock currentSlug="coleman-q1-2026-moves" />

        <CiteThisPage />

        <InvestingBooks />

        <LearnReadNext currentSlug="coleman-q1-2026-moves" />

        <p className="text-xs text-dim pt-6 border-t border-border mt-10">
          Not investment advice. Sourced from public SEC EDGAR Form 13F-HR filings (Tiger Global
          Management CIK 0001167483). All position changes verifiable from Form 13F-HR alone.
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
