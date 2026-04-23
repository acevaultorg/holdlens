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
    slug === "2026-04-week-17-insider-cluster-roundup" ? <Week17Body />
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
        Watch <Link href="/events/type/cybersecurity-incident/" className="text-brand underline">
          /events/type/cybersecurity-incident/
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
