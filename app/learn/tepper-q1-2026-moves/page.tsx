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
  title: "David Tepper's Q1 2026 13F moves — Amazon to #1, China unwind, memory/semis adds",
  description:
    "Appaloosa Management's Q1 2026 13F (filed May 15, 2026) shows a clean China-to-US-tech rotation: Amazon doubled to #1 holding at 15.2% of the $5.93B portfolio, Alibaba trimmed from #1 to #6, Uber returned big at 7.7%, Micron deepened to 9.5%, plus new positions in SanDisk and Corning. JD.com, Qualcomm, KraneShares China ETF, American Airlines and Whirlpool fell out of the top 15. Holdings concentration tightened from 38 to 31 positions. Reconstructable from public EDGAR filings.",
  alternates: { canonical: "https://holdlens.com/learn/tepper-q1-2026-moves" },
  openGraph: {
    title: "Tepper's Q1 2026 moves — Amazon to #1, Alibaba trim, memory/semis adds",
    description:
      "Appaloosa Q1 2026: Amazon doubled to #1 at 15.2%, BABA from #1 to #6, MU at 9.5%, UBER returned at 7.7%, SanDisk + Corning new. Most concentrated stance in recent quarters. EDGAR-reconstructable.",
    url: "https://holdlens.com/learn/tepper-q1-2026-moves",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tepper's Q1 2026 13F moves",
    description: "Amazon to #1 at 15.2%, Alibaba trim from #1 to #6, MU + UBER + TSM build, SanDisk + Corning new. Q1 2026 EDGAR reconstruction.",
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
      { "@type": "ListItem", position: 3, name: "Tepper Q1 2026 moves", item: "https://holdlens.com/learn/tepper-q1-2026-moves" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "David Tepper's Q1 2026 13F moves — Appaloosa's clean China-to-US-tech rotation",
    description:
      "Appaloosa Management Q1 2026 13F: Amazon doubled to #1 holding at 15.2%, Alibaba trimmed from #1 to #6, Uber added back at 7.7%, Micron deepened to 9.5%, Vistra climbed to 5.1%, new SanDisk and Corning positions. JD.com, KraneShares China ETF, Qualcomm, American Airlines, and Whirlpool fell out of the top 15. Holdings concentrated from 38 to 31. AUM contracted to $5.93B. EDGAR-reconstructable.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/tepper-q1-2026-moves",
    datePublished: "2026-05-27",
    dateModified: "2026-05-27",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "David Tepper Q1 2026",
      "Appaloosa Management 13F May 2026",
      "Tepper Amazon position",
      "Tepper Alibaba trim",
      "Tepper Micron Uber",
      "Tepper SanDisk Corning",
      "Appaloosa 13F filing analysis",
      "David Tepper quarterly recap",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens superinvestor quarterly recaps",
      url: "https://holdlens.com/learn",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001006438&type=13F-HR",
      "https://en.wikipedia.org/wiki/David_Tepper",
      "https://en.wikipedia.org/wiki/Appaloosa_Management",
      "https://holdlens.com/reports/2026-05-q1-2026-13f-signal-summary",
      "https://holdlens.com/api/v1/snapshot/2026-Q1.json",
      "https://holdlens.com/investor/david-tepper",
      "https://holdlens.com/learn/tepper-bank-stocks-2009",
    ],
    about: [
      { "@type": "Person", name: "David Tepper" },
      { "@type": "Organization", name: "Appaloosa Management LP" },
      { "@type": "Corporation", name: "Amazon.com Inc.", tickerSymbol: "AMZN" },
      { "@type": "Corporation", name: "Alibaba Group Holding", tickerSymbol: "BABA" },
      { "@type": "Corporation", name: "Micron Technology", tickerSymbol: "MU" },
      { "@type": "Corporation", name: "Uber Technologies", tickerSymbol: "UBER" },
      { "@type": "Corporation", name: "Taiwan Semiconductor Manufacturing", tickerSymbol: "TSM" },
      { "@type": "Corporation", name: "Vistra Corp", tickerSymbol: "VST" },
      { "@type": "Corporation", name: "SanDisk Corp", tickerSymbol: "SNDK" },
      { "@type": "Corporation", name: "Corning Inc.", tickerSymbol: "GLW" },
    ],
  },
];

export default function TepperQ12026Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Quarterly recaps</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
        David Tepper&apos;s Q1 2026 13F moves
      </h1>

      <AuthorByline date="2026-05-27" />
      <ShareStrip url="https://holdlens.com/learn/tepper-q1-2026-moves" title="David Tepper's Q1 2026 13F moves" />

      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Appaloosa Management&apos;s Q1 2026 13F-HR (filed 2026-05-15) shows{" "}
          <strong>a clean China-to-US-tech rotation</strong>: Amazon doubled in weight to become
          the #1 holding at 15.2% of the $5.93B portfolio, Alibaba trimmed from #1 (10.9%) to #6
          (7.3%), Uber added back to 7.7%, Micron deepened to 9.5%, plus brand-new positions in
          SanDisk and Corning. JD.com, KraneShares China ETF, Qualcomm, American Airlines, and
          Whirlpool fell out of the top 15. Holdings count tightened from 38 to 31 — Appaloosa&apos;s
          most concentrated stance in recent quarters. Every move is{" "}
          <Link href="/learn/edgar-explained" className="text-brand underline">
            reconstructable from EDGAR
          </Link>{" "}
          using Form 13F-HR.
        </TldrCard>

        <h2 className="text-2xl font-bold mt-12 mb-3">The Q1 2026 picture</h2>
        <p>
          Tepper&apos;s Q1 2026 13F continues a multi-quarter trajectory: holdings count keeps
          falling (45 → 38 → 31 across three quarters), AUM has contracted ($7.4B → $6.9B →
          $5.9B), and the largest positions are being concentrated further. The Q1 2026 standout
          is the clean swap inside the top-of-the-book — Amazon now occupies the seat Alibaba
          held a quarter ago.
        </p>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Position adds (and conviction increases)</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Amazon (AMZN)</strong> — doubled in weight from 7.3%
              in Q4 to 15.2% in Q1, becoming the single largest position. AMZN was already a
              meaningful position; the Q1 add is the kind of weighting move Tepper has
              historically made when his conviction crystallizes.
            </li>
            <li>
              <strong className="text-text">Micron Technology (MU)</strong> — deepened from 7.2%
              to 9.5%, now the #2 holding. MU was a new Q4 2025 position; consecutive-quarter add
              suggests the memory-cycle thesis is compounding.
            </li>
            <li>
              <strong className="text-text">Uber Technologies (UBER)</strong> — climbed back into
              the top 5 at 7.7%. UBER was a 3.2% position in Q3, absent from top 15 in Q4, and
              returns at scale in Q1 — a notable round-trip.
            </li>
            <li>
              <strong className="text-text">Taiwan Semiconductor (TSM)</strong> — added from 5.0%
              to 7.6%, climbing to a top-5 position alongside MU. Combined with Q1&apos;s new
              SanDisk + Corning positions, the semi/memory/glass-substrate thematic now spans
              four meaningful holdings.
            </li>
            <li>
              <strong className="text-text">Vistra (VST)</strong> — added back from absent in Q4
              top 15 to 5.1% in Q1. Combined with continued NRG exposure (4.3%), Tepper&apos;s
              independent-power-producer thematic is intact.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">New positions (top 15)</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">SanDisk (SNDK)</strong> — brand-new at 3.0% of the
              portfolio. SanDisk re-listed as an independent storage business in 2025; the
              position adds to Tepper&apos;s memory/storage thematic (alongside MU at 9.5%).
            </li>
            <li>
              <strong className="text-text">Corning (GLW)</strong> — brand-new at 2.6%. Corning&apos;s
              optical-glass and display-substrate exposure overlaps with the AI-infrastructure
              read (fiber for data centers; glass for displays and devices).
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Trims and out-of-top-15 changes</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Alibaba (BABA)</strong> — biggest weighting move of
              the quarter: from #1 holding at 10.9% in Q4 to #6 at 7.3% in Q1. BABA had been
              Tepper&apos;s flagship China bet through 2024-2025; the de-emphasis tracks the
              broader China-trim across the book.
            </li>
            <li>
              <strong className="text-text">JD.com (JD)</strong> — was 2.9% in Q3, no longer in
              the top 15 in Q1. Continues the China trim alongside the KraneShares China ETF
              dropping out of the top 15.
            </li>
            <li>
              <strong className="text-text">KraneShares China ETF (KWEB)</strong> — was 4.2% in
              Q3, 2.3% in Q4, no longer in the top 15. The broad China-tech beta exposure has
              been steadily reduced over two quarters.
            </li>
            <li>
              <strong className="text-text">Whirlpool (WHR)</strong> — multi-quarter unwind:
              5.9% Q3, 4.1% Q4, 1.8% Q1. Consumer-durables exposure reduced sharply.
            </li>
            <li>
              <strong className="text-text">American Airlines (AAL)</strong> — was 3.1% in Q4,
              no longer in the top 15. Airline exposure trimmed.
            </li>
            <li>
              <strong className="text-text">Qualcomm (QCOM)</strong> — was 2.8% in Q4, no longer
              in the top 15. Trimmed below the threshold even as TSM and SanDisk were added.
            </li>
            <li>
              <strong className="text-text">Meta (META) + Nvidia (NVDA)</strong> — both trimmed:
              META 5.7% → 4.2%, NVDA 4.6% → 4.3%. Held but smaller.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">What the pattern signals</h2>
        <p>
          The headline read is the{" "}
          <strong>China-to-US-tech rotation at the top of the book</strong>. Alibaba was the
          largest position for several quarters; in Q1 it&apos;s the #6 position while Amazon
          steps into the #1 seat at nearly double its prior weighting. Combined with the JD.com
          and KraneShares trims, the China-beta exposure has been materially reduced over the
          last two quarters.
        </p>
        <p>
          The secondary read is{" "}
          <strong>memory + semis + power consolidation</strong>: Micron at 9.5%, TSM at 7.6%,
          SanDisk new at 3.0%, Corning new at 2.6%, Vistra back at 5.1% — five holdings, 27.8%
          of the portfolio, all in different links of the AI-infrastructure chain (memory,
          fab, storage, optical substrates, power generation). Tepper has historically taken
          thematic concentrated positions; this looks like the current thematic.
        </p>
        <p>
          The third read is{" "}
          <strong>continued portfolio tightening</strong>. Holdings count fell from 45 in Q3 to
          31 in Q1 — a roughly 31% reduction in position count over two quarters. AUM contracted
          ~20% over the same window. The picture is a smaller, more concentrated book by design,
          not a portfolio drifting smaller through losses (the holdings concentration math is
          deliberate). For context on how Tepper structures concentrated bets, see our{" "}
          <Link href="/learn/tepper-bank-stocks-2009" className="text-brand underline">
            2009 bank-stocks deep dive
          </Link>
          .
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-12 mb-3">How to verify this yourself</h2>
        <p>
          Every position change above is reconstructable from public SEC EDGAR filings. Steps:
        </p>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2 leading-relaxed mt-4">
          <li>
            Open <Link href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001006438&type=13F-HR" className="text-brand underline">Appaloosa Management&apos;s 13F-HR filing history</Link> on EDGAR (CIK 0001006438).
          </li>
          <li>
            Compare the Q1 2026 13F (filed 2026-05-15) line-by-line against the Q4 2025 13F (filed Feb 2026).
          </li>
          <li>
            Position changes appear as: new CUSIP rows (new positions like SanDisk and Corning), increased share counts (adds like AMZN and MU), decreased share counts (trims like BABA, WHR, NVDA), removed CUSIP rows (full exits or out-of-top-15 trims like JD, KWEB, QCOM, AAL).
          </li>
          <li>
            Cross-reference with HoldLens&apos;s machine-readable{" "}
            <Link href="/api/v1/snapshot/2026-Q1.json" className="text-brand underline">
              /api/v1/snapshot/2026-Q1.json
            </Link>{" "}
            for a pre-computed summary across all 30 tracked managers including Appaloosa.
          </li>
        </ol>

        <OurView>
          Tepper&apos;s Q1 2026 is the cleanest China-to-US-tech rotation in the superinvestor
          recap series this quarter. The Amazon move alone — doubling weight to become the #1
          holding — is a top-of-book reorganization that takes deliberate conviction. The
          parallel reduction of Alibaba from #1 to #6 makes the swap explicit rather than
          implicit. Whether the timing proves right is something only Q2 + Q3 returns can
          answer; the public record tells us how Appaloosa is positioned <em>now</em>, and
          the position is meaningfully different from a quarter ago.
        </OurView>

        <FamousTradesBlock currentSlug="tepper-q1-2026-moves" />

        <CiteThisPage />

        <InvestingBooks />

        <LearnReadNext currentSlug="tepper-q1-2026-moves" />

        <p className="text-xs text-dim pt-6 border-t border-border mt-10">
          Not investment advice. Sourced from public SEC EDGAR Form 13F-HR filings (Appaloosa
          Management CIK 0001006438). All position changes verifiable from Form 13F-HR alone.
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
