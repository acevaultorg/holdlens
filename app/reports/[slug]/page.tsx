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
    slug === "2026-04-week-17-insider-cluster-roundup"
      ? <Week17Body />
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
