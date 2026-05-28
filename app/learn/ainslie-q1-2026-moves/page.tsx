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
  title: "Lee Ainslie's Q1 2026 13F moves — Maverick trims broadly, opens new Meta + Alphabet",
  description:
    "Maverick Capital's Q1 2026 13F (filed May 15, 2026) shows Lee Ainslie trimming across the book — Carpenter Technology (−61%), MasTec (−65%), Live Nation (−73%), CRH (−27%), Somnigroup (−33%), TSMC (−35%) and the top Amazon holding (−10%) — while opening brand-new positions in Meta, Alphabet and bitcoin miner Hut 8. A rotation out of industrials and materials into mega-cap tech. Reconstructable from public EDGAR filings.",
  alternates: { canonical: "https://holdlens.com/learn/ainslie-q1-2026-moves" },
  openGraph: {
    title: "Lee Ainslie's Q1 2026 moves — Maverick trims broadly, opens new Meta + Alphabet",
    description:
      "Maverick Q1 2026: broad trims (Carpenter −61%, MasTec −65%, Live Nation −73%, Amazon −10%, TSMC −35%) and new Meta + Alphabet + Hut 8. EDGAR-reconstructable.",
    url: "https://holdlens.com/learn/ainslie-q1-2026-moves",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — superinvestor 13F tracking with ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lee Ainslie's Q1 2026 13F moves",
    description: "Maverick trims broadly (Carpenter −61%, MasTec −65%, Live Nation −73%) and opens new Meta + Alphabet + Hut 8.",
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
      { "@type": "ListItem", position: 3, name: "Ainslie Q1 2026 moves", item: "https://holdlens.com/learn/ainslie-q1-2026-moves" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Lee Ainslie's Q1 2026 13F moves — Maverick trims broadly, opens new Meta and Alphabet",
    description:
      "Maverick Capital Q1 2026 13F: broad trims across the book — Carpenter Technology (−61%), MasTec (−65%), Live Nation (−73%), CRH (−27%), Somnigroup (−33%), TSMC (−35%), Danaher (−12%) and the top Amazon position (−10%) — alongside brand-new positions in Meta, Alphabet and bitcoin miner Hut 8. A rotation out of industrials and materials into mega-cap tech. EDGAR-reconstructable.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/ainslie-q1-2026-moves",
    datePublished: "2026-05-28",
    dateModified: "2026-05-28",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Lee Ainslie Q1 2026",
      "Maverick Capital 13F May 2026",
      "Maverick Carpenter MasTec trim",
      "Ainslie Meta Alphabet new",
      "Maverick Amazon trim",
      "Maverick Capital 13F filing analysis",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens superinvestor quarterly recaps",
      url: "https://holdlens.com/learn",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001040273&type=13F-HR",
      "https://en.wikipedia.org/wiki/Lee_Ainslie",
      "https://en.wikipedia.org/wiki/Maverick_Capital",
      "https://holdlens.com/reports/2026-05-q1-2026-13f-signal-summary",
      "https://holdlens.com/api/v1/snapshot/2026-Q1.json",
      "https://holdlens.com/investor/lee-ainslie",
    ],
    about: [
      { "@type": "Person", name: "Lee Ainslie" },
      { "@type": "Organization", name: "Maverick Capital" },
      { "@type": "Corporation", name: "Amazon.com Inc.", tickerSymbol: "AMZN" },
      { "@type": "Corporation", name: "Carpenter Technology Corp", tickerSymbol: "CRS" },
      { "@type": "Corporation", name: "MasTec Inc.", tickerSymbol: "MTZ" },
      { "@type": "Corporation", name: "Meta Platforms Inc.", tickerSymbol: "META" },
      { "@type": "Corporation", name: "Alphabet Inc.", tickerSymbol: "GOOGL" },
    ],
  },
];

export default function AinslieQ12026Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Quarterly recaps</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
        Lee Ainslie&apos;s Q1 2026 13F moves
      </h1>

      <AuthorByline date="2026-05-28" />
      <ShareStrip url="https://holdlens.com/learn/ainslie-q1-2026-moves" title="Lee Ainslie's Q1 2026 13F moves" />

      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Maverick Capital&apos;s Q1 2026 13F-HR (filed 2026-05-15) shows Lee Ainslie — a Tiger Cub
          running a long-short book — <strong>trimming broadly while rotating into mega-cap
          tech</strong>. Carpenter Technology (−61%), MasTec (−65%), Live Nation (−73%), CRH (−27%),
          Somnigroup (−33%), TSMC (−35%), Danaher (−12%) and even the top holding{" "}
          <Link href="/ticker/AMZN" className="text-brand underline">Amazon</Link> (−10%) were all
          reduced, while brand-new positions were opened in{" "}
          <Link href="/ticker/META" className="text-brand underline">Meta</Link>,{" "}
          <Link href="/ticker/GOOGL" className="text-brand underline">Alphabet</Link> and bitcoin
          miner Hut 8. Every move is{" "}
          <Link href="/learn/edgar-explained" className="text-brand underline">
            reconstructable from EDGAR
          </Link>{" "}
          using Form 13F-HR.
        </TldrCard>

        <h2 className="text-2xl font-bold mt-12 mb-3">The Q1 2026 picture</h2>
        <p>
          Maverick is one of the original Tiger Cubs — Ainslie launched it after Julian
          Robertson&apos;s Tiger Management — and runs a fundamental long-short book. The 13F shows
          only the long side, but the Q1 2026 long book has a clear shape: a broad de-emphasis of
          industrials, materials and miscellaneous names, paired with fresh entries into the
          largest tech platforms.
        </p>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Broad trims</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Carpenter Technology (CRS) −61%, MasTec (MTZ) −65%,
              Live Nation (LYV) −73%</strong> — the deepest cuts: specialty alloys, infrastructure
              construction, and live entertainment, each more than halved.
            </li>
            <li>
              <strong className="text-text">CRH −27% to 9.6%, Somnigroup −33% to 8.1%, TSMC (TSM)
              −35% to 4.5%, Danaher (DHR) −12% to 4.8%</strong> — building materials, bedding,
              foundry and life-science tools all reduced.
            </li>
            <li>
              <strong className="text-text">
                <Link href="/ticker/AMZN" className="text-brand underline">Amazon (AMZN)</Link> −10%
              </strong>{" "}
              — even the top holding (still 19.4%) was trimmed.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">New positions</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Meta (META) 2.5%, Alphabet (GOOGL) 2.4%</strong> —
              brand-new mega-cap platform stakes, opened as the industrials were cut.
            </li>
            <li>
              <strong className="text-text">Hut 8 (HUT) 2.0%</strong> — a new position in the
              bitcoin miner / compute-infrastructure name.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">What the pattern signals</h2>
        <p>
          The rotation is <strong>out of industrials and materials, into mega-cap tech</strong>.
          The deepest trims hit Carpenter, MasTec, CRH, Somnigroup and Live Nation, while the only
          new positions were Meta, Alphabet and a bitcoin miner. Amazon stays the anchor but was
          lightened. On the long side, Maverick moved toward the platform names and away from the
          real-economy cyclicals.
        </p>
        <p>
          One cross-fund detail is striking. The two industrials Ainslie cut hardest — Carpenter
          Technology (−61%) and MasTec (−65%) — are the exact names{" "}
          <Link href="/learn/mandel-q1-2026-moves" className="text-brand underline">
            Lone Pine&apos;s Stephen Mandel was buying
          </Link>{" "}
          (Carpenter +38%, MasTec brand-new) as part of his AI-infrastructure bet. Two respected
          managers took opposite sides of the same two stocks in the same quarter — both fully
          visible in the public EDGAR record.
        </p>
        <p>
          As with any long-short fund, the 13F hides Maverick&apos;s shorts and hedges, so this is
          the long-side direction only. But that direction is clear: lighter on cyclicals, fresh
          weight in the largest tech platforms.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-12 mb-3">How to verify this yourself</h2>
        <p>
          Every position change above is reconstructable from public SEC EDGAR filings. Steps:
        </p>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2 leading-relaxed mt-4">
          <li>
            Open{" "}
            <Link href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001040273&type=13F-HR" className="text-brand underline">
              Maverick Capital&apos;s 13F-HR filing history
            </Link>{" "}
            on EDGAR (CIK 0001040273).
          </li>
          <li>
            Compare the Q1 2026 13F (filed 2026-05-15, report date 2026-03-31) line-by-line against
            the Q4 2025 13F (filed Feb 2026).
          </li>
          <li>
            Position changes appear as: decreased share counts (the Carpenter, MasTec, Live Nation,
            CRH, Somnigroup, TSMC, Amazon trims) and new CUSIP rows (Meta, Alphabet, Hut 8).
          </li>
          <li>
            Cross-reference with HoldLens&apos;s machine-readable{" "}
            <Link href="/api/v1/snapshot/2026-Q1.json" className="text-brand underline">
              /api/v1/snapshot/2026-Q1.json
            </Link>{" "}
            and the live{" "}
            <Link href="/investor/lee-ainslie" className="text-brand underline">Lee Ainslie portfolio page</Link>.
          </li>
        </ol>

        <OurView>
          Maverick&apos;s Q1 long book reads as a rotation toward the largest tech platforms at the
          expense of real-economy cyclicals — new Meta and Alphabet stakes funded by deep cuts to
          Carpenter, MasTec, CRH and Live Nation, with even Amazon trimmed. The opposite-side bet
          against Lone Pine on Carpenter and MasTec is a reminder that a 13F shows conviction, not
          consensus: two strong managers can read the same names in completely different directions.
          Because Maverick&apos;s shorts are invisible here, treat this as long-side direction only.
          Whether the rotation proves correct is something only time and Q2 returns can answer; the
          public record tells us how the long book is positioned <em>right now</em>.
        </OurView>

        <FamousTradesBlock currentSlug="ainslie-q1-2026-moves" />

        <CiteThisPage />

        <InvestingBooks />

        <LearnReadNext currentSlug="ainslie-q1-2026-moves" />

        <p className="text-xs text-dim pt-6 border-t border-border mt-10">
          Not investment advice. Sourced from public SEC EDGAR Form 13F-HR filings (Maverick Capital
          CIK 0001040273). All position changes verifiable from Form 13F-HR alone. A 13F shows only
          long U.S.-listed positions — Maverick&apos;s shorts and hedges are not disclosed. 13F-HR
          data is a 45-day-lagged snapshot — see{" "}
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
