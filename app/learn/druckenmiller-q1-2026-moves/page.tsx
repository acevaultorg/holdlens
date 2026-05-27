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
  title: "Stanley Druckenmiller's Q1 2026 13F moves — Natera at 18%, YPF + Alcoa + ST-Micro adds",
  description:
    "Duquesne Family Office's Q1 2026 13F (filed May 15, 2026) reveals a diversification pivot away from mega-tech: Natera conviction deepened to 18.1% of the portfolio, brand-new positions in YPF (Argentine oil), Alcoa, ST-Microelectronics, and BBB Foods (Mexican discount retail), while Amazon and Alphabet exits or trims continue. AUM contracted 25% to $3.38B; holdings count rose to 68. Reconstructable from public EDGAR filings.",
  alternates: { canonical: "https://holdlens.com/learn/druckenmiller-q1-2026-moves" },
  openGraph: {
    title: "Druckenmiller's Q1 2026 moves — Natera 18%, YPF/Alcoa/ST-Micro new, AUM down 25%",
    description:
      "Duquesne Family Office Q1 2026: Natera conviction at 18.1%, new macro/commodity bets in YPF, Alcoa, ST-Micro, BBB Foods. Mega-tech further trimmed. EDGAR-reconstructable.",
    url: "https://holdlens.com/learn/druckenmiller-q1-2026-moves",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Druckenmiller's Q1 2026 13F moves",
    description: "Natera 18.1%, YPF + Alcoa + ST-Micro new positions, AUM down 25%. Q1 2026 EDGAR reconstruction.",
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
      { "@type": "ListItem", position: 3, name: "Druckenmiller Q1 2026 moves", item: "https://holdlens.com/learn/druckenmiller-q1-2026-moves" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": ["Article", "Report"],
    headline: "Stanley Druckenmiller's Q1 2026 13F moves — diversification pivot as AUM contracts 25%",
    description:
      "Duquesne Family Office Q1 2026 13F: Natera doubled-down to 18.1% of the $3.38B portfolio (single largest position), new positions in YPF, Alcoa, ST-Microelectronics, BBB Foods, and NewAmsterdam Pharma, plus continued mega-tech trims. Holdings count rose from 59 to 68; AUM contracted 24.7% from Q4. EDGAR-reconstructable.",
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    mainEntityOfPage: "https://holdlens.com/learn/druckenmiller-q1-2026-moves",
    datePublished: "2026-05-27",
    dateModified: "2026-05-27",
    inLanguage: "en-US",
    image: "https://holdlens.com/og/home.png",
    keywords: [
      "Stanley Druckenmiller Q1 2026",
      "Duquesne Family Office 13F May 2026",
      "Druckenmiller Natera position",
      "Druckenmiller YPF Argentina",
      "Druckenmiller Alcoa",
      "Druckenmiller ST-Microelectronics",
      "Duquesne 13F filing analysis",
      "Druckenmiller quarterly recap",
    ],
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: "HoldLens superinvestor quarterly recaps",
      url: "https://holdlens.com/learn",
    },
    citation: [
      "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001536411&type=13F-HR",
      "https://en.wikipedia.org/wiki/Stanley_Druckenmiller",
      "https://en.wikipedia.org/wiki/Duquesne_Capital",
      "https://holdlens.com/reports/2026-05-q1-2026-13f-signal-summary",
      "https://holdlens.com/api/v1/snapshot/2026-Q1.json",
      "https://holdlens.com/investor/stanley-druckenmiller",
    ],
    about: [
      { "@type": "Person", name: "Stanley Druckenmiller" },
      { "@type": "Organization", name: "Duquesne Family Office" },
      { "@type": "Corporation", name: "Natera Inc.", tickerSymbol: "NTRA" },
      { "@type": "Corporation", name: "YPF Sociedad Anonima", tickerSymbol: "YPF" },
      { "@type": "Corporation", name: "Alcoa Corp", tickerSymbol: "AA" },
      { "@type": "Corporation", name: "STMicroelectronics N.V.", tickerSymbol: "STM" },
      { "@type": "Corporation", name: "Insmed Inc.", tickerSymbol: "INSM" },
      { "@type": "Corporation", name: "Taiwan Semiconductor Manufacturing", tickerSymbol: "TSM" },
      { "@type": "Corporation", name: "NewAmsterdam Pharma", tickerSymbol: "NAMS" },
      { "@type": "Corporation", name: "BBB Foods Inc.", tickerSymbol: "TBBB" },
    ],
  },
];

export default function DruckenmillerQ12026Page() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
      <a href="/" className="text-xs text-muted hover:text-text">← Home</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Learn · Quarterly recaps</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8">
        Stanley Druckenmiller&apos;s Q1 2026 13F moves
      </h1>

      <AuthorByline date="2026-05-27" />
      <ShareStrip url="https://holdlens.com/learn/druckenmiller-q1-2026-moves" title="Stanley Druckenmiller's Q1 2026 13F moves" />

      <div className="space-y-6 text-text leading-relaxed">
        <TldrCard>
          Duquesne Family Office&apos;s Q1 2026 13F-HR (filed 2026-05-15) shows{" "}
          <strong>a diversification pivot</strong>: Natera conviction deepened to 18.1% of the
          portfolio (single largest position), brand-new positions in YPF (Argentina oil), Alcoa,
          STMicroelectronics, BBB Foods (Mexico discount retail), and NewAmsterdam Pharma, while
          Amazon and Alphabet were trimmed out of the top 12. Total AUM contracted 24.7% to
          $3.38B from $4.49B in Q4; holdings count rose from 59 to 68. Every move is{" "}
          <Link href="/learn/edgar-explained" className="text-brand underline">
            reconstructable from EDGAR
          </Link>{" "}
          using Form 13F-HR.
        </TldrCard>

        <h2 className="text-2xl font-bold mt-12 mb-3">The Q1 2026 picture</h2>
        <p>
          Druckenmiller&apos;s Q1 2026 13F is shaped by two overlapping forces. First, the
          portfolio shrank — total reported AUM dropped from $4.49B at Q4 close to $3.38B at Q1
          close, a 24.7% contraction. Second, despite the smaller portfolio, the holdings count
          rose from 59 to 68 — meaning Duquesne added more positions while reducing size in
          several existing ones. The combined effect is a more diversified, less concentrated
          book at lower aggregate dollars.
        </p>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">New positions (top 12)</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">YPF Sociedad Anonima (YPF)</strong> — Argentine
              national-oil-company stake at 4.4% of the portfolio. YPF is a macro bet on
              Argentina&apos;s reform trajectory and Vaca Muerta shale economics. Adding YPF
              while trimming AMZN is the cleanest signal of the macro rotation.
            </li>
            <li>
              <strong className="text-text">BBB Foods Inc. (TBBB)</strong> — Mexican
              discount-retail operator (Tiendas 3B) at 3.3%. Hard-discount grocery in emerging
              Mexico — a classic Druckenmiller &ldquo;long-runway secular growth&rdquo; pattern.
            </li>
            <li>
              <strong className="text-text">Alcoa (AA)</strong> — aluminum at 2.9%. Materials /
              commodity exposure has been almost absent from Duquesne&apos;s recent books; the
              new position signals either an aluminum-supply thesis or a broader commodity tilt.
            </li>
            <li>
              <strong className="text-text">NewAmsterdam Pharma (NAMS)</strong> — clinical-stage
              biotech at 2.9%. Druckenmiller has historically held both early-stage biotech (NTRA,
              INSM) and large-cap pharma (TEVA).
            </li>
            <li>
              <strong className="text-text">STMicroelectronics (STM)</strong> — European
              semiconductor at 2.7%. Sitting alongside TSM (5.0%), the position extends Duquesne&apos;s
              global-semi exposure beyond Asia.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Position adds / conviction increases</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Natera (NTRA)</strong> — already the largest position
              going into Q1; weighting deepened from 12.8% to 18.1% of a smaller portfolio. The
              absolute dollar value also climbed ($575M → $612M). NTRA is now Duquesne&apos;s
              clearest single-name conviction holding.
            </li>
            <li>
              <strong className="text-text">iShares Inc. (broad-market ETF)</strong> — climbed
              from 5.5% to 8.7% as the portfolio shrank around it. Indexed exposure deepening is
              consistent with a more-diversified-less-concentrated stance.
            </li>
          </ul>
        </div>

        <div className="rounded-card border border-border bg-surface-muted p-5 my-4">
          <h3 className="text-base font-bold text-text mb-3">Trims and exits (top-12 changes)</h3>
          <ul className="list-disc list-inside text-sm text-muted space-y-2 leading-relaxed">
            <li>
              <strong className="text-text">Amazon (AMZN)</strong> — was 4.3% in Q4, no longer
              in the top 12 (now under 2.2%). Mega-tech weight continues to decline across the
              book.
            </li>
            <li>
              <strong className="text-text">Alphabet (GOOGL)</strong> — was 2.7% in Q4, no longer
              in the top 12 (now under 2.2%). Trimmed alongside AMZN.
            </li>
            <li>
              <strong className="text-text">Teva Pharmaceutical (TEVA)</strong> — was 8.3% in Q3,
              4.1% in Q4, and no longer in the top 12 in Q1. The TEVA position has been a
              multi-quarter wind-down.
            </li>
            <li>
              <strong className="text-text">Coupang (CPNG)</strong> — was 3.6% in Q4, no longer
              in the top 12. Korean e-commerce exposure reduced.
            </li>
            <li>
              <strong className="text-text">Woodward (WWD)</strong> — trimmed from 4.0% in Q4 to
              2.2% in Q1. Aerospace/defense engineering exposure reduced.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">What the pattern signals</h2>
        <p>
          The combined picture is{" "}
          <strong>macro + commodity diversification away from mega-cap tech</strong>. The new
          YPF, Alcoa, BBB Foods, and STMicroelectronics positions span emerging-market resources,
          European semis, and discount retail — categories Duquesne held little of in Q3-Q4 2025.
          Meanwhile AMZN, GOOGL, and CPNG all fell out of the top 12, continuing a multi-quarter
          drift away from the late-2024 mega-tech concentration.
        </p>
        <p>
          The Natera move is the more interesting standalone signal. Going from 12.8% to 18.1%
          of the portfolio — at the same time the broader portfolio shrank — is a deepening of
          conviction in a single name, not just relative weighting math. NTRA is the kind of
          long-horizon biotech bet (cell-free DNA testing for cancer + transplant + reproductive
          health) where multi-year holding is plausible and 13F-traceable.
        </p>
        <p>
          The 24.7% AUM contraction is worth context: Duquesne Family Office is a single-family
          office, so AUM changes can reflect tax-driven distributions, charitable giving (the
          Druckenmiller Foundation has been an active donor), or strategic risk-off. The 13F
          alone cannot distinguish among these — it only shows the long U.S.-listed equity book
          at quarter-end.
        </p>

        <AdSlot format="in-article" priority="primary" />

        <h2 className="text-2xl font-bold mt-12 mb-3">How to verify this yourself</h2>
        <p>
          Every position change above is reconstructable from public SEC EDGAR filings. Steps:
        </p>
        <ol className="list-decimal list-inside text-sm text-muted space-y-2 leading-relaxed mt-4">
          <li>
            Open <Link href="https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001536411&type=13F-HR" className="text-brand underline">Duquesne Family Office&apos;s 13F-HR filing history</Link> on EDGAR (CIK 0001536411).
          </li>
          <li>
            Compare the Q1 2026 13F (filed 2026-05-15) line-by-line against the Q4 2025 13F (filed Feb 2026).
          </li>
          <li>
            Position changes appear as: new CUSIP rows (new positions like YPF and Alcoa), increased share counts (adds like NTRA), decreased share counts (trims like Woodward), removed CUSIP rows (exits or out-of-top-12 trims).
          </li>
          <li>
            Cross-reference with HoldLens&apos;s machine-readable{" "}
            <Link href="/api/v1/snapshot/2026-Q1.json" className="text-brand underline">
              /api/v1/snapshot/2026-Q1.json
            </Link>{" "}
            for a pre-computed summary across all 30 tracked managers including Duquesne.
          </li>
        </ol>

        <OurView>
          Druckenmiller&apos;s Q1 2026 is the clearest macro-rotation 13F in recent quarters.
          Argentine oil (YPF), aluminum (Alcoa), Mexican hard-discount (BBB Foods), and European
          semis (ST-Micro) are not the names a portfolio leaning into tech-cycle late-stage would
          add. Combined with continued AMZN and GOOGL trims, the new positions read as a
          deliberate tilt toward harder, less-correlated assets at the margin. Whether the macro
          read proves correct is something only Q2 2026 returns can settle; what the public
          record tells us is how Duquesne is positioned <em>now</em>, and the positioning is
          notably different from a quarter ago.
        </OurView>

        <FamousTradesBlock currentSlug="druckenmiller-q1-2026-moves" />

        <CiteThisPage />

        <InvestingBooks />

        <LearnReadNext currentSlug="druckenmiller-q1-2026-moves" />

        <p className="text-xs text-dim pt-6 border-t border-border mt-10">
          Not investment advice. Sourced from public SEC EDGAR Form 13F-HR filings (Duquesne
          Family Office CIK 0001536411). All position changes verifiable from Form 13F-HR alone.
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
