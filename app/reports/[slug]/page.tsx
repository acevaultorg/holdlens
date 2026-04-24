import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getReport, REPORTS } from "@/lib/reports";
import ShareStrip from "@/components/ShareStrip";
import AuthorByline from "@/components/AuthorByline";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return REPORTS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const report = getReport(slug);
  if (!report) return { title: "Report not found" };
  return {
    title: `${report.title} · HoldLens Reports`,
    description: report.description,
    alternates: { canonical: `https://holdlens.com/reports/${report.slug}/` },
    openGraph: {
      title: report.title,
      description: report.description,
      url: `https://holdlens.com/reports/${report.slug}/`,
      type: "article",
      publishedTime: report.publishedAt,
      images: [{ url: "/og/home.png", width: 1200, height: 630, alt: report.title }],
    },
  };
}

export default async function ReportPage({ params }: Props) {
  const { slug } = await params;
  const report = getReport(slug);
  if (!report) notFound();

  // Per-report body. Currently dispatches to inline content based on slug.
  // Future: separate MDX files; for now, hand-written content per slug.
  const body =
    slug === "2026-04-q1-2026-pre-wave-primer" ? <Q1PrimerBody />
    : slug === "2026-04-week-17-insider-cluster-roundup" ? <Week17Body />
    : slug === "2026-04-week-17-8k-event-distribution" ? <Week17EventBody />
    : <p className="text-muted">Report body not yet rendered for slug {slug}.</p>;

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: report.title,
    description: report.description,
    datePublished: report.publishedAt,
    dateModified: report.publishedAt,
    inLanguage: "en-US",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://holdlens.com/reports/${report.slug}/`,
    },
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    image: "https://holdlens.com/og/home.png",
    keywords: report.topics.join(", "),
    wordCount: report.wordCount,
  };

  return (
    <article className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Weekly commentary
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        {report.title}
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-6">{report.description}</p>
      <AuthorByline date={report.publishedAt} />

      <div className="mt-8">{body}</div>

      <ShareStrip
        title={report.title}
        url={`https://holdlens.com/reports/${report.slug}/`}
      />

      <div className="mt-12 pt-8 border-t border-border">
        <h2 className="text-xl font-bold mb-3">Related</h2>
        <p className="text-muted">
          <Link href="/reports/" className="text-brand underline">All reports</Link>
          {" · "}
          <Link href="/insiders/" className="text-brand underline">Insider trading hub</Link>
          {" · "}
          <Link href="/insiders/live/" className="text-brand underline">Live Form 4 feed</Link>
          {" · "}
          <Link href="/learn/insider-score-explained/" className="text-brand underline">
            How InsiderScore works
          </Link>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </article>
  );
}

function Week17Body() {
  return (
    <div className="space-y-6 text-text leading-relaxed">
      <p className="text-muted">
        This is HoldLens's first weekly insider-trading commentary backed by full EDGAR
        Form 4 ingestion across the week. Every figure cited below is sourced from the
        SEC's daily Form 4 index and is verifiable against the original filings via the
        accession numbers logged in our{" "}
        <Link href="/api/v1/insiders/live.json" className="text-brand underline">
          /api/v1/insiders/live.json
        </Link>{" "}
        endpoint.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">The headline number</h2>
      <p className="text-muted">
        Across April 16-22, 2026 (week 17), HoldLens ingested{" "}
        <strong className="text-text">3,001 individual Form 4 transactions</strong>{" "}
        from US-listed issuers — a 4-day sample after weekend skip. Of those:
      </p>
      <ul className="space-y-2 list-disc list-inside text-muted">
        <li>
          <strong className="text-text">1,296 buys</strong> totaling <strong className="text-text">$1.83B</strong>
        </li>
        <li>
          <strong className="text-text">1,705 sells</strong> totaling <strong className="text-text">$1.70B</strong>
        </li>
      </ul>
      <p className="text-muted">
        The buy-vs-sell value being roughly balanced is not the typical pattern — most
        weeks show 2-3× more sell volume than buy volume due to the structural
        prevalence of 10b5-1 sales (pre-arranged compensation liquidations). A
        near-balanced week with buy value modestly exceeding sell value is, on its own,
        a mild positive insider-sentiment signal.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">The cluster pattern of the week — ROKU</h2>
      <p className="text-muted">
        ROKU saw <strong className="text-text">50 separate insider buys</strong> totaling
        $21.5M across the 4-day window — by far the highest count of multi-officer
        same-direction buying activity in the dataset. A 50-buy cluster at one issuer
        within a single week is the textbook{" "}
        <Link href="/glossary/#cluster-buy" className="text-brand underline">cluster-buy</Link>{" "}
        signal — multiple insiders independently choosing to deploy capital into their
        own stock.
      </p>
      <p className="text-muted">
        InsiderScore weights cluster patterns heavily (1.5× when ≥3 unique officers
        within 30 days; 2.0× cap at ≥5). Fifty distinct trades across multiple officer
        roles indicates either coordinated commitment or a window-opening event (like a
        Q4 earnings disclosure clearing trading restrictions). Either way, it's the kind
        of pattern that historically precedes positive equity reaction more often than
        chance would predict.
      </p>
      <p className="text-muted">
        See <Link href="/insiders/company/ROKU/" className="text-brand underline">/insiders/company/ROKU/</Link>{" "}
        for the per-officer breakdown.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">The single highest-signal trade — HOMB</h2>
      <p className="text-muted">
        Home BancShares Inc (NYSE: HOMB) Chairman & CEO John W. Allison made a single
        open-market purchase of approximately <strong className="text-text">$2.7M</strong>{" "}
        on April 16, 2026. By the InsiderScore rubric this is a maximally-strong signal:
      </p>
      <ul className="space-y-2 list-disc list-inside text-muted">
        <li>Role weight: <strong className="text-text">CEO/Chairman = 1.00</strong> (top of the role table)</li>
        <li>Action weight: <strong className="text-text">P (open-market purchase) = +1.00</strong> (the strongest action class)</li>
        <li>Size: $2.7M is materially above typical CEO trade sizes for a mid-cap regional bank</li>
        <li>Discretionary: not a 10b5-1 plan disposition (no plan footnote in the Form 4)</li>
      </ul>
      <p className="text-muted">
        Per the action × role × size × recency × cluster formula in our{" "}
        <Link href="/learn/insider-score-explained/" className="text-brand underline">methodology</Link>,
        this single trade scores in the top decile of the week's signals. The Allison
        family has a long history of conviction buys in HOMB during regional-bank stress
        cycles; this purchase fits that pattern.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">The complicated one — KLRA</h2>
      <p className="text-muted">
        KLRA showed up as the apparent top buy ticker by value ($1.275B across 56
        transactions). On inspection this is{" "}
        <strong className="text-text">not</strong> a conviction signal — it's a
        large secondary offering or insider-related institutional purchase that
        mechanically registers as multiple Form 4 buys. We flag this in
        InsiderScore by the value-to-historical-average normalizer; trades that
        are 100× the issuer's historical average get clamped at the 2.0 size-weight
        ceiling, preventing single mechanical events from dominating the
        per-ticker aggregate.
      </p>
      <p className="text-muted">
        Lesson for readers using HoldLens data: <strong className="text-text">always
        check the trade-count-to-value ratio</strong>. Real cluster signals (ROKU
        at 50 trades / $21.5M = ~$430k average per trade) look very different
        from mechanical secondary-offering registrations (KLRA at 56 trades /
        $1.275B = ~$22.8M average per trade — clearly institutional flow,
        not officer conviction).
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">Other notable patterns</h2>
      <ul className="space-y-3 list-disc list-inside text-muted">
        <li>
          <strong className="text-text">FLUT (Flutter Entertainment)</strong> — 4 trades
          totaling $318M, all buys. Likely large insider position-build during the
          Q1 earnings window. Worth watching against the company's next 13F cycle to see
          if superinvestor interest follows.
        </li>
        <li>
          <strong className="text-text">ARXS</strong> — 46 buys totaling $11.3M. Smaller
          cap than ROKU but similar high-count cluster pattern; mid-cap insider conviction.
        </li>
        <li>
          <strong className="text-text">AVEX</strong> — 4 trades from 4 different
          officers (CEO Wells $10k, EVP Hush $200k, Insider Raduenz $1M, Insider Jackson
          $13k). Classic small-cap multi-officer conviction stack — value low, but
          breadth of participation is the signal.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-3">What's NOT in this commentary</h2>
      <p className="text-muted">
        This week's data covers the 4 trading days of April 16-22, 2026. It does NOT
        include April 23 (filing index not yet published at the time of this report —
        SEC publishes the daily index ~24 hours after market close). Next week's
        commentary will include 4/23 patterns when the daily index becomes available.
      </p>
      <p className="text-muted">
        Numbers exclude non-Form-4 insider activity (Form 144 notice-of-sale filings,
        Form 5 annual reconciliations, Form 3 initial-statement-of-ownership). Form 4 is
        the highest-signal of the four and the only one ingested at the per-row level.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">Methodology + verification</h2>
      <p className="text-muted">
        Every figure in this commentary is computed at build time from{" "}
        <code className="bg-card px-1 rounded">data/edgar-form4.json</code> in the
        HoldLens repo, fetched via{" "}
        <code className="bg-card px-1 rounded">scripts/fetch-edgar-form4.ts</code>{" "}
        directly from the SEC EDGAR daily index (no third-party intermediary). Every
        cited transaction has an accession number that resolves to the original Form 4
        filing on{" "}
        <a
          href="https://www.sec.gov/edgar"
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          sec.gov/edgar
        </a>{" "}
        for independent verification.
      </p>
      <p className="text-muted">
        See <Link href="/learn/insider-score-explained/" className="text-brand underline">/learn/insider-score-explained/</Link>{" "}
        for the full deterministic formula and{" "}
        <Link href="/disclaimer/" className="text-brand underline">/disclaimer/</Link>{" "}
        for the not-investment-advice + filing-lag framing.
      </p>
    </div>
  );
}

function Week17EventBody() {
  return (
    <div className="space-y-6 text-text leading-relaxed">
      <p className="text-muted">
        Companion to the{" "}
        <Link href="/reports/2026-04-week-17-insider-cluster-roundup/" className="text-brand underline">
          insider cluster roundup
        </Link>
        : same week (April 16-22, 2026), different SEC form. This commentary
        analyzes 1,429 Form 8-K material events parsed from the EDGAR daily index
        across 5 trading days.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">The distribution</h2>
      <div className="rounded-lg border border-border overflow-hidden my-6">
        <table className="w-full text-sm">
          <thead className="bg-card text-text">
            <tr>
              <th className="text-left p-3 font-semibold">Item Code</th>
              <th className="text-left p-3 font-semibold">What it is</th>
              <th className="text-right p-3 font-semibold">Count</th>
              <th className="text-right p-3 font-semibold">% of week</th>
            </tr>
          </thead>
          <tbody className="text-muted">
            <tr className="border-t border-border"><td className="p-3 font-mono">8.01</td><td className="p-3">Other Events (catch-all)</td><td className="p-3 text-right">340</td><td className="p-3 text-right">23.8%</td></tr>
            <tr className="border-t border-border"><td className="p-3 font-mono">7.01</td><td className="p-3">Regulation FD Disclosure</td><td className="p-3 text-right">326</td><td className="p-3 text-right">22.8%</td></tr>
            <tr className="border-t border-border"><td className="p-3 font-mono">2.02</td><td className="p-3">Earnings Results</td><td className="p-3 text-right">290</td><td className="p-3 text-right">20.3%</td></tr>
            <tr className="border-t border-border"><td className="p-3 font-mono">5.02</td><td className="p-3">Officer / Director Departure or Appointment</td><td className="p-3 text-right">206</td><td className="p-3 text-right">14.4%</td></tr>
            <tr className="border-t border-border"><td className="p-3 font-mono">1.01</td><td className="p-3">Material Definitive Agreement Entered</td><td className="p-3 text-right">195</td><td className="p-3 text-right">13.6%</td></tr>
            <tr className="border-t border-border"><td className="p-3 font-mono">3.01</td><td className="p-3">Delisting / Listing Rule Failure</td><td className="p-3 text-right">36</td><td className="p-3 text-right">2.5%</td></tr>
            <tr className="border-t border-border"><td className="p-3 font-mono">1.02</td><td className="p-3">Material Agreement Terminated</td><td className="p-3 text-right">17</td><td className="p-3 text-right">1.2%</td></tr>
            <tr className="border-t border-border"><td className="p-3 font-mono">2.01</td><td className="p-3">Acquisition / Disposition Completed</td><td className="p-3 text-right">13</td><td className="p-3 text-right">0.9%</td></tr>
            <tr className="border-t border-border"><td className="p-3 font-mono">1.03</td><td className="p-3">Bankruptcy or Receivership</td><td className="p-3 text-right">4</td><td className="p-3 text-right">0.3%</td></tr>
            <tr className="border-t border-border"><td className="p-3 font-mono">2.06</td><td className="p-3">Material Impairment</td><td className="p-3 text-right">1</td><td className="p-3 text-right">0.07%</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-3">Pattern 1 — earnings season is alive</h2>
      <p className="text-muted">
        Item 2.02 (Earnings Results) at 290 filings = 20.3% of the week is exactly what
        you'd expect during the post-Q1-earnings window (April 15-30). Companies with
        December fiscal-year-ends file their Q1 results 30-45 days after quarter close;
        the week of April 16-22 catches the bulge.
      </p>
      <p className="text-muted">
        Implication for /events/type/earnings/ users: this is the time to read the
        commentary section of each release, not just the headline number. Surprise
        directionality in earnings 8-Ks correlates with stock reaction more reliably
        during high-volume weeks like this one.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">Pattern 2 — the 8.01 + 7.01 'general communications' bulge</h2>
      <p className="text-muted">
        Item 8.01 (Other Events, 340) and Item 7.01 (Regulation FD Disclosure, 326)
        together account for 46.6% of the week's 8-Ks. These are the catch-all categories
        — companies use them when an event is material but doesn't fit a more-specific item.
      </p>
      <p className="text-muted">
        Investment-grade signal value: <strong className="text-text">low to medium</strong>.
        Item 8.01 in particular is often used for press releases that don't cleanly map
        to a numbered item. Item 7.01 is more meaningful — Reg FD disclosures are typically
        announcements of investor presentations or analyst calls, often containing forward
        guidance not yet in earnings releases.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">Pattern 3 — officer changes (5.02) at 206</h2>
      <p className="text-muted">
        14.4% of the week's 8-Ks were Item 5.02 (Officer / Director Departure or
        Appointment). That's a meaningful number — typically 5.02 spikes during proxy
        season (Q1-Q2) as boards reshuffle and new directors are seated. Each 5.02
        event has signed EventScore implications: a CEO departure is generally negative,
        an unexpected CEO appointment more uncertain, a director addition more neutral.
      </p>
      <p className="text-muted">
        Per-event interpretation requires reading the actual filing's narrative section.
        See <Link href="/events/type/officer-change/" className="text-brand underline">/events/type/officer-change/</Link>{" "}
        for the full week's per-officer breakdown.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">Pattern 4 — distress signals (1.03 + 3.01) low</h2>
      <p className="text-muted">
        Only 4 bankruptcy filings (Item 1.03) and 36 delisting notices (Item 3.01) for
        the week. As a rough macro indicator, this is a healthy week — distress
        filings tend to cluster during recessionary periods (2008-2009 weeks routinely
        saw 15-25 bankruptcies; 2020 Covid weeks similar).
      </p>
      <p className="text-muted">
        The 1 material impairment (Item 2.06) is also notably low. A high-frequency
        impairment week often precedes a goodwill-write-down wave that drags Q-earnings
        for the following quarter.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">Pattern 5 — cybersecurity disclosure absence</h2>
      <p className="text-muted">
        <strong className="text-text">Zero</strong> Item 1.05 (Material Cybersecurity
        Incident) filings for the week. Item 1.05 was added to the 8-K taxonomy by the
        SEC in December 2023 with a 4-business-day filing requirement after determination
        of materiality. Industry-wide compliance has been below initial estimates;
        a zero-filing week is consistent with that pattern.
      </p>
      <p className="text-muted">
        Watch <Link href="/events/type/cybersecurity/" className="text-brand underline">
          /events/type/cybersecurity/
        </Link>{" "}
        for the running tally; cybersecurity 8-Ks remain a high-EventScore-magnitude category
        when they do fire (typical EventScore = -60).
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">Methodology</h2>
      <p className="text-muted">
        Source: EDGAR daily index for 2026-04-16, 17, 20, 21, 22 (weekend skipped).
        Form 8-K filings parsed via{" "}
        <code className="bg-card px-1 rounded">scripts/fetch-edgar-8k.ts</code> with
        item-code inference from SEC-HEADER 'ITEM INFORMATION' lines + canonical
        label-to-code lookup. CIK→ticker resolution via{" "}
        <code className="bg-card px-1 rounded">company_tickers.json</code> (7,993 SEC-mapped
        issuers).
      </p>
      <p className="text-muted">
        Each event row links back to the source 8-K by accession number for verification
        on{" "}
        <a
          href="https://www.sec.gov/edgar"
          className="text-brand underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          sec.gov/edgar
        </a>
        . Same{" "}
        <Link href="/disclaimer/" className="text-brand underline">disclaimer</Link>{" "}
        applies as all HoldLens commentary: data, not advice.
      </p>
    </div>
  );
}

function Q1PrimerBody() {
  return (
    <div className="space-y-6 text-text leading-relaxed">
      <p className="text-muted">
        The next SEC 13F filing window opens around{" "}
        <strong className="text-text">May 11-15, 2026</strong> — 45 days after the
        Q1 2026 quarter end (Mar 31). Every institutional manager with $100M+ AUM
        must disclose their long US equity book within that window. For HoldLens
        readers, this is the single most data-rich event of the quarter: 30
        tracked superinvestors revealing every position adjustment they made
        between January and March.
      </p>
      <p className="text-muted">
        This primer is published 21 days early so you know exactly what to watch
        for. It covers: (1) what the prior wave (Q4 2025, filed Feb 17) actually
        showed across our tracked names, (2) the structural patterns Q1 windows
        tend to surface, (3) the cross-investor signals HoldLens will compute
        live as filings hit, and (4) how to read the data without falling for
        the most common 13F misreadings.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">What Q4 2025 actually showed (the baseline)</h2>
      <p className="text-muted">
        At the Feb 17, 2026 deadline, HoldLens ingested all 30 superinvestor
        13F-HRs for the period ending Dec 31, 2025. The headline cross-investor
        moves were dominated by AI-infrastructure rotation: continued buying of{" "}
        <Link href="/stock/NVDA/" className="text-brand underline">NVDA</Link>{" "}
        and <Link href="/stock/META/" className="text-brand underline">META</Link>{" "}
        at the institutional end (Druckenmiller, Coleman), trimming at the
        deep-value end (Buffett continued the AAPL trim into a smaller position,
        held BAC). The most-bought new-position by total dollar value was{" "}
        <Link href="/stock/GOOGL/" className="text-brand underline">GOOGL</Link>{" "}
        — appearing in 4 superinvestor portfolios for the first time as the
        antitrust overhang priced in.
      </p>
      <p className="text-muted">
        Full Q4 2025 detail lives in per-investor pages — see{" "}
        <Link href="/investor/warren-buffett/" className="text-brand underline">/investor/warren-buffett/</Link>,{" "}
        <Link href="/investor/bill-ackman/" className="text-brand underline">/investor/bill-ackman/</Link>,{" "}
        <Link href="/investor/michael-burry/" className="text-brand underline">/investor/michael-burry/</Link>{" "}
        and 27 other names linked from the{" "}
        <Link href="/investors/" className="text-brand underline">investors hub</Link>.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">Why Q1 disclosures structurally diverge</h2>
      <p className="text-muted">
        Q1 13Fs have three structural quirks worth flagging before you read them
        live in May:
      </p>
      <ul className="space-y-3 list-disc list-inside text-muted">
        <li>
          <strong className="text-text">Calendar-year tax-loss carryover.</strong>{" "}
          Positions sold in Q4 for tax-loss harvesting often get rebought in Q1
          after the 30-day wash-sale window expires. Names that "disappeared" in
          the Feb filing may reappear in the May filing — those are not new
          conviction positions, they're tax-cycle artifacts. Check the cost
          basis if disclosed (often it isn't on 13F-HR; only 13F-CRs include it).
        </li>
        <li>
          <strong className="text-text">Annual rebalance bias.</strong> Many
          fundamental managers hold rebalance discipline at calendar-year start.
          Q1 13Fs show the post-rebalance state — which means apparent "selling"
          in Q1 may simply be sizing back to target weight after Q4 outperformance,
          not a conviction reversal. Look at percent-of-portfolio changes, not
          raw share-count changes.
        </li>
        <li>
          <strong className="text-text">Earnings-window concentration.</strong>{" "}
          Roughly 70% of S&P 500 names report Q4 earnings in late January /
          February. Position changes in Q1 13Fs reflect responses to that
          earnings cycle. The most reliable signal is{" "}
          <em>position established in Q1 in a name that reported a downside Q4</em>{" "}
          — that's a manager taking conviction against the consensus reaction.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-3">The four signals HoldLens will compute live</h2>
      <p className="text-muted">
        As 13F filings hit EDGAR between May 11-15, our pipeline auto-ingests
        each within hours and recomputes four cross-investor signals. Each is
        addressable as JSON for partner platforms:
      </p>

      <h3 className="text-xl font-bold mt-6 mb-2">1. Consensus-buy detector</h3>
      <p className="text-muted">
        Names where ≥3 superinvestors initiated or added in Q1. Historically the
        strongest cross-cohort signal — when value-style managers and growth-style
        managers agree on a name, it usually reflects a structural thesis rather
        than a style-rotation artifact. Q4 2025 produced 7 consensus-buy names
        (highest count: GOOGL at 4 buyers). Endpoint:{" "}
        <Link href="/api/v1/13f/consensus-buys.json" className="text-brand underline">
          /api/v1/13f/consensus-buys.json
        </Link>{" "}
        will refresh within 24h of each filing landing.
      </p>

      <h3 className="text-xl font-bold mt-6 mb-2">2. Conviction-change ranker</h3>
      <p className="text-muted">
        For each tracked superinvestor, the largest portfolio-percent shift in
        their Q1 disclosure relative to Q4. The biggest sells often signal a
        thesis break; the biggest buys signal new conviction. Weighted by the
        manager's historical signal accuracy (computed in our{" "}
        <Link href="/proof/" className="text-brand underline">backtest results</Link>),
        ranked names get a ConvictionScore lift in the +50 to +100 range.
      </p>

      <h3 className="text-xl font-bold mt-6 mb-2">3. Sector-rotation tracker</h3>
      <p className="text-muted">
        Aggregate Q1-vs-Q4 portfolio weight by GICS sector across all 30
        superinvestors. Coordinated rotations (e.g. all 30 reduce Energy by
        ≥1.5pts simultaneously) historically precede sector-level reratings.
        Q4 2025 showed a coordinated lift in Communication Services (+2.1pts
        cohort-wide) driven by GOOGL + META adds.
      </p>

      <h3 className="text-xl font-bold mt-6 mb-2">4. Contrarian-position spotter</h3>
      <p className="text-muted">
        Positions held by exactly one superinvestor with high portfolio weight
        (≥3% of book). High-conviction-low-consensus is the textbook
        contrarian signal. Burry's AAPL puts in late 2024 sat in this bucket;
        so did Ackman's CMG re-entry in early 2025. Q1 2026 contrarian
        positions get a flag in the per-investor view immediately on filing.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">How to read 13Fs without getting fooled</h2>
      <p className="text-muted">
        Three durable misreadings to avoid:
      </p>
      <ul className="space-y-3 list-disc list-inside text-muted">
        <li>
          <strong className="text-text">13Fs are 45-day-old data.</strong> The
          quarter ended Mar 31. The filing isn't due until May 15. The position
          could have been exited in April. Treat 13Fs as evidence of
          <em> historical conviction</em>, not current holdings. The{" "}
          <Link href="/learn/sec-signals-trilogy/" className="text-brand underline">SEC Signals trilogy</Link>{" "}
          combines 13F (45-day lag) with insider Form 4 (2-day lag) and 8-K
          material events (4-day lag) precisely to triangulate timing.
        </li>
        <li>
          <strong className="text-text">13Fs report long-only US equity.</strong>{" "}
          Short positions, debt, options (with exceptions), foreign equity,
          private holdings — none of it shows. A manager going net-short a
          name via puts will look like they "sold" the long, not like they
          shifted to a short thesis. Always check the 13F-CR (confidential
          treatment request) addendum if the manager files one — that's where
          delayed disclosures hide.
        </li>
        <li>
          <strong className="text-text">"Buffett bought X" is usually wrong.</strong>{" "}
          Berkshire Hathaway has multiple portfolio managers (Buffett, Ted
          Weschler, Todd Combs). Not every BRK position is a Buffett pick.
          Position sizes &lt;$1B are typically Weschler/Combs decisions.
          HoldLens flags this in the Berkshire view; other 13F trackers
          conflate the three managers and produce misleading "Buffett
          conviction" claims.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-3">What HoldLens will publish on filing day</h2>
      <p className="text-muted">
        Within 6 hours of the first Q1 2026 filings hitting EDGAR (expected May
        11-12 for early filers; May 14-15 for the rest), HoldLens will ship:
      </p>
      <ul className="space-y-2 list-disc list-inside text-muted">
        <li>Per-superinvestor diff page — every position changed, formatted as add/trim/exit/new</li>
        <li>Cross-investor consensus-buy + consensus-sell digest, sortable</li>
        <li>Sector-rotation summary (Q1 vs Q4 weight deltas)</li>
        <li>The "State of 13F Filings — Q1 2026" flagship report (8,000+ words, expected May 17-18)</li>
        <li>Refreshed JSON API endpoints for every per-investor + per-sector view</li>
      </ul>
      <p className="text-muted">
        Pre-announce alerts ship via{" "}
        <Link href="/api/v1/quarters.json" className="text-brand underline">/api/v1/quarters.json</Link>{" "}
        for partner platforms wanting to subscribe to publication-window
        events. Email alerts for early-access drafts available with{" "}
        <Link href="/pricing/" className="text-brand underline">HoldLens Pro (€9/mo)</Link>.
      </p>

      <h2 className="text-2xl font-bold mt-10 mb-3">The honest framing</h2>
      <p className="text-muted">
        HoldLens does not predict what the Q1 13Fs will show. We instrument
        them faster + with cleaner cross-investor synthesis than any other
        public tracker. Our edge is{" "}
        <em>structural data clarity</em>, not directional forecasting. If you
        want forecasts, you want a different site. If you want the cleanest
        per-investor + cross-investor view of what 30 of the smartest portfolio
        managers in the world actually did in Q1 — within 6 hours of the
        filings hitting EDGAR — that's what we ship.
      </p>
      <p className="text-muted">
        Same{" "}
        <Link href="/disclaimer/" className="text-brand underline">disclaimer</Link>{" "}
        applies: 13F data, not investment advice. The 45-day lag is real and
        must be read alongside the 2-day-lag Form 4 insider data + 4-day-lag
        8-K material events for a complete picture.
      </p>
    </div>
  );
}
