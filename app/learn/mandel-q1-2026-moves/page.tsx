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
  title: "Stephen Mandel's Q1 2026 13F moves — Lone Pine bets on AI's power bill, not its chips",
  description:
    "Lone Pine Capital's Q1 2026 13F (filed May 15, 2026) shows Stephen Mandel building the physical infrastructure of AI — Vistra (7.4%, top holding) and Talen Energy (+41%) for datacenter power, plus ASML, new Teradyne, new Corning, Carpenter Technology (+38%) and new MasTec for equipment and materials — while halving TSMC (−54%). AppLovin added 88%. A concentrated 36-position growth book. Reconstructable from public EDGAR filings.",
  alternates: { canonical: "https://holdlens.com/learn/mandel-q1-2026-moves" },
  openGraph: {
    title: "Stephen Mandel's Q1 2026 moves — Lone Pine bets on AI's power + infrastructure",
    description:
      "Lone Pine Q1 2026: Vistra top at 7.4%, Talen Energy +41% (AI datacenter power), new Teradyne + Corning + MasTec, Carpenter +38%, AppLovin +88%; TSMC halved (−54%). EDGAR-reconstructable.",
    url: "https://holdlens.com/learn/mandel-q1-2026-moves",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — superinvestor 13F tracking with ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stephen Mandel's Q1 2026 13F moves",
    description: "Lone Pine bets on AI's power + infrastructure — Vistra, Talen, Teradyne, Corning, MasTec — while halving TSMC.",
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
      { "@type": "ListItem", position: 3, name: "Mandel Q1 2026 moves", item: "https://holdlens.com/learn/mandel-q1-2026-moves" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Stephen Mandel's Q1 2026 13F moves — Lone Pine bets on the physical infrastructure of AI",
    description:
      "Lone Pine Capital Q1 2026 13F: Vistra is the top holding at 7.4% and Talen Energy was added 41% (independent power producers for AI datacenters); ASML (+8%), Carpenter Technology (+38%), new Teradyne, new Corning and new MasTec build a semiconductor-equipment, materials and construction sleeve; AppLovin added 88%; Nu Holdings added. TSMC trimmed 54% and Brookfield 37%. A concentrated 36-position long-only growth book. EDGAR-reconstructable.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/mandel-q1-2026-moves",
    datePublished: "2026-05-28",
    dateModified: "2026-05-28",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Stephen Mandel Q1 2026",
      "Lone Pine Capital 13F May 2026",
      "Lone Pine Vistra Talen",
      "Mandel AI power infrastructure",
      "Lone Pine Teradyne Corning",
      "Lone Pine Capital 13F filing analysis",
      "Stephen Mandel quarterly recap",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens superinvestor quarterly recaps",
      url: "https://holdlens.com/learn",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001061165&type=13F-HR",
      "https://en.wikipedia.org/wiki/Stephen_Mandel_(hedge_fund_manager)",
      "https://en.wikipedia.org/wiki/Lone_Pine_Capital",
      "https://holdlens.com/reports/2026-05-q1-2026-13f-signal-summary",
      "https://holdlens.com/api/v1/snapshot/2026-Q1.json",
      "https://holdlens.com/investor/stephen-mandel",
    ],
    about: [
      { "@type": "Person", name: "Stephen Mandel" },
      { "@type": "Organization", name: "Lone Pine Capital" },
      { "@type": "Corporation", name: "Vistra Corp", tickerSymbol: "VST" },
      { "@type": "Corporation", name: "Talen Energy Corp", tickerSymbol: "TLN" },
      { "@type": "Corporation", name: "ASML Holding", tickerSymbol: "ASML" },
      { "@type": "Corporation", name: "Teradyne Inc.", tickerSymbol: "TER" },
      { "@type": "Corporation", name: "Corning Inc.", tickerSymbol: "GLW" },
      { "@type": "Corporation", name: "Taiwan Semiconductor Manufacturing", tickerSymbol: "TSM" },
    ],
  },
];

export default function MandelQ12026Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Quarterly recaps</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
        Stephen Mandel&apos;s Q1 2026 13F moves
      </h1>

      <AuthorByline date="2026-05-28" />
      <ShareStrip url="https://holdlens.com/learn/mandel-q1-2026-moves" title="Stephen Mandel's Q1 2026 13F moves" />

      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Lone Pine Capital&apos;s Q1 2026 13F-HR (filed 2026-05-15) shows Stephen Mandel making one
          of the cleaner thematic bets this quarter: <strong>the physical infrastructure of
          AI</strong>. The top holding is Vistra (7.4%), and Talen Energy was added 41% — two
          independent power producers positioned for datacenter electricity demand. Around them sits
          a semiconductor-equipment, materials and construction sleeve: ASML (+8%), Carpenter
          Technology (+38%), and brand-new positions in Teradyne, Corning and MasTec. AppLovin was
          added 88%. Funding it, he trimmed{" "}
          <Link href="/ticker/TSM" className="text-brand underline">TSMC</Link> by 54% and
          Brookfield by 37%. Every move is{" "}
          <Link href="/learn/edgar-explained" className="text-brand underline">
            reconstructable from EDGAR
          </Link>{" "}
          using Form 13F-HR.
        </TldrCard>

        <h2 className="text-2xl font-bold mt-12 mb-3">The Q1 2026 picture</h2>
        <p>
          Lone Pine is a long-only growth fund — Mandel founded it in 1997 after Tiger Management,
          and it has compounded quietly into one of the most successful growth books of the last
          three decades. At 36 positions it is concentrated enough that the top names carry a real
          thesis. In Q1 2026 that thesis is unusually legible: rather than owning the AI chips
          directly, Lone Pine bought the <em>power</em> and the <em>plumbing</em> that AI compute
          depends on.
        </p>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">The AI-power bet (the headline)</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Vistra (VST)</strong> — the top holding at 7.4%, added
              19%. An independent power producer whose nuclear and gas fleet is a direct play on
              datacenter electricity demand.
            </li>
            <li>
              <strong className="text-text">Talen Energy (TLN)</strong> — added 41% to 4.6%. Another
              independent power producer, well-known for datacenter power-supply agreements. Two of
              the top holdings are now merchant-power names.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Equipment, materials + construction (the plumbing)</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">ASML</strong> — added 8% to 6.9%, the #2 position. The
              lithography monopoly that every advanced chip depends on.
            </li>
            <li>
              <strong className="text-text">Carpenter Technology (CRS) +38% to 5.7%</strong> —
              specialty alloys for aerospace and industrial demand.
            </li>
            <li>
              <strong className="text-text">Teradyne (TER), Corning (GLW), MasTec (MTZ)</strong> —
              all brand-new positions (~4% each): semiconductor test equipment, optical-fibre and
              materials, and infrastructure construction. Together with Clean Harbors (+27%), this
              is a deliberate real-economy-infrastructure cluster.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Other adds + the funding trims</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">AppLovin (APP) +88% to 4.6%, Nu Holdings (NU) +28%,
              Tenet Healthcare (THC) +26%</strong>; new US Foods. Growth names added outside the
              infrastructure theme.
            </li>
            <li>
              <strong className="text-text">
                <Link href="/ticker/TSM" className="text-brand underline">TSMC (TSM)</Link> −54%,
                Brookfield (BN) −37%
              </strong>{" "}
              — the largest reductions. Notably, he cut the foundry (TSMC) while adding the
              equipment maker (ASML) and the test-equipment maker (Teradyne).
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">What the pattern signals</h2>
        <p>
          The thesis is <strong>own the infrastructure of AI, not the chips</strong>. Power
          producers (Vistra, Talen), semiconductor equipment (ASML, Teradyne), materials (Corning,
          Carpenter) and construction (MasTec) all gained weight, while the chip foundry (TSMC) was
          halved. It is a bet that the bottleneck — and the durable margin — in the AI build-out is
          electricity, equipment and materials rather than the leading-edge silicon itself.
        </p>
        <p>
          The 13F alone cannot tell us <em>why</em>, and Lone Pine&apos;s 13F shows only the long
          book. But the direction is unusually coherent for a 36-name fund: a concentrated tilt
          toward the physical supply chain of compute.
        </p>
        <p>
          For comparison, this quarter&apos;s recaps show the AI trade expressed many ways. Chase
          Coleman{" "}
          <Link href="/learn/coleman-q1-2026-moves" className="text-brand underline">
            bought the chips and equipment directly
          </Link>{" "}
          (Nvidia, TSMC, Applied Materials). Andreas Halvorsen{" "}
          <Link href="/learn/halvorsen-q1-2026-moves" className="text-brand underline">
            tilted toward quality industrials
          </Link>
          . Mandel went one layer further down — into the power and plumbing. Same macro theme,
          materially different expressions, all in the public EDGAR record.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-12 mb-3">How to verify this yourself</h2>
        <p>
          Every position change above is reconstructable from public SEC EDGAR filings. Steps:
        </p>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2 leading-relaxed mt-4">
          <li>
            Open{" "}
            <Link href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001061165&type=13F-HR" className="text-brand underline">
              Lone Pine Capital&apos;s 13F-HR filing history
            </Link>{" "}
            on EDGAR (CIK 0001061165).
          </li>
          <li>
            Compare the Q1 2026 13F (filed 2026-05-15, report date 2026-03-31) line-by-line against
            the Q4 2025 13F (filed Feb 2026).
          </li>
          <li>
            Position changes appear as: increased share counts (Vistra, Talen, ASML, Carpenter,
            AppLovin adds), decreased share counts (the TSMC and Brookfield trims), and new CUSIP
            rows (Teradyne, Corning, MasTec, US Foods).
          </li>
          <li>
            Cross-reference with HoldLens&apos;s machine-readable{" "}
            <Link href="/api/v1/snapshot/2026-Q1.json" className="text-brand underline">
              /api/v1/snapshot/2026-Q1.json
            </Link>{" "}
            and the live{" "}
            <Link href="/investor/stephen-mandel" className="text-brand underline">Stephen Mandel portfolio page</Link>.
          </li>
        </ol>

        <OurView>
          Lone Pine&apos;s Q1 2026 13F is the most thematically legible book in this quarter&apos;s
          recaps. Owning Vistra and Talen at the top, building a semiconductor-equipment and
          materials sleeve (ASML, Teradyne, Corning, Carpenter), and adding a construction name
          (MasTec) while halving the TSMC foundry is a clean statement: the durable money in the AI
          build-out may sit in the power, equipment and materials layer rather than the
          leading-edge chip. It is the picks-and-shovels argument taken one step further than most.
          Whether it proves correct is something only time and Q2 returns can answer; the public
          record tells us how Mandel is positioned <em>right now</em>, and it is squarely behind the
          physical infrastructure of compute.
        </OurView>

        <FamousTradesBlock currentSlug="mandel-q1-2026-moves" />

        <CiteThisPage />

        <InvestingBooks />

        <LearnReadNext currentSlug="mandel-q1-2026-moves" />

        <p className="text-xs text-dim pt-6 border-t border-border mt-10">
          Not investment advice. Sourced from public SEC EDGAR Form 13F-HR filings (Lone Pine
          Capital CIK 0001061165). All position changes verifiable from Form 13F-HR alone. A 13F
          shows only long U.S.-listed positions. 13F-HR data is a 45-day-lagged snapshot — see{" "}
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
