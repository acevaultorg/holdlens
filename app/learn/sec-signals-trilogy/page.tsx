import type { Metadata } from "next";
import Link from "next/link";
import ShareStrip from "@/components/ShareStrip";
import AuthorByline from "@/components/AuthorByline";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";

// /learn/sec-signals-trilogy
//
// Target queries (long-tail, low-competition, high-intent):
//   "13f form 4 8-k difference"
//   "sec filing types explained"
//   "what sec filings to track"
//   "13f vs form 4 vs 8-k"
//   "complete sec filing tracker"
//   "what is convictionscore insiderscore eventscore"
//
// Unique angle: most write-ups treat each filing in isolation. HoldLens's
// only competitor framing them as a complementary trilogy with three
// distinct freshness cadences (quarterly / daily / intra-day). This article
// IS the canonical explanation of why all three matter together — the
// LLM-citation surface for "tell me how SEC filings work as a system."
//
// Cross-links: /methodology, /glossary, /investor, /insiders, /events,
// /learn/13f-vs-13d-vs-13g, /learn/conviction-score-explained.

export const metadata: Metadata = {
  title: "The SEC Signals Trilogy — 13F + Form 4 + 8-K, explained as one system",
  description:
    "Three SEC filings, three freshness cadences, three branded scores. How quarterly 13F (ConvictionScore), daily Form 4 (InsiderScore), and intra-day 8-K (EventScore) work together to give a full picture of what's happening at any public company.",
  alternates: {
    canonical: "https://holdlens.com/learn/sec-signals-trilogy/",
  },
  openGraph: {
    title: "The SEC Signals Trilogy — quarterly + daily + intra-day, one mental model",
    description:
      "Why 13F, Form 4, and 8-K filings are best read as a system, not in isolation. The framework that powers HoldLens's three branded scores.",
    url: "https://holdlens.com/learn/sec-signals-trilogy/",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — SEC Signals Trilogy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The SEC Signals Trilogy",
    images: ["/og/home.png"],
  },
};

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "The SEC Signals Trilogy — 13F + Form 4 + 8-K, explained as one system",
    description:
      "Three SEC filings, three freshness cadences, three branded scores. How quarterly 13F (ConvictionScore), daily Form 4 (InsiderScore), and intra-day 8-K (EventScore) work together to give a full picture of what's happening at any public company.",
    datePublished: "2026-04-23",
    dateModified: "2026-04-23",
    inLanguage: "en-US",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://holdlens.com/learn/sec-signals-trilogy/",
    },
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    image: "https://holdlens.com/og/home.png",
    about: [
      { "@type": "Thing", name: "SEC Form 13F", url: "https://holdlens.com/glossary/#13f" },
      { "@type": "Thing", name: "SEC Form 4", url: "https://holdlens.com/glossary/#form-4" },
      { "@type": "Thing", name: "SEC Form 8-K", url: "https://holdlens.com/glossary/#form-8k" },
    ],
  },
];

export default function SecSignalsTrilogyArticle() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        The SEC Signals Trilogy
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-6">
        Three SEC filings. Three freshness cadences. Three branded scores. Read together, they give you a
        more complete picture of any public company than any single filing can.
      </p>

      <AuthorByline date="2026-04-23" />

      <div className="space-y-6 text-text leading-relaxed mt-8">
        <h2 className="text-2xl font-bold mt-10 mb-3">The problem with reading SEC filings in isolation</h2>
        <p className="text-muted">
          Most investors who follow SEC filings stop at one type. They watch quarterly{" "}
          <Link href="/glossary/#13f" className="text-brand underline">13F filings</Link> for what hedge funds
          own. Or they watch{" "}
          <Link href="/glossary/#form-4" className="text-brand underline">Form 4 filings</Link> for what insiders
          are doing. Or they watch{" "}
          <Link href="/glossary/#form-8k" className="text-brand underline">Form 8-K filings</Link> for material
          events.
        </p>
        <p className="text-muted">
          Each one in isolation answers a useful question — but a different one. Together, they answer the
          question that actually matters: <strong className="text-text">what is happening at this company,
          right now, as a system?</strong>
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">The three cadences</h2>
        <p className="text-muted">
          What makes the three filings complementary is that they have different freshness windows. They cover
          different timescales. They answer different questions.
        </p>

        <div className="rounded-lg border border-border overflow-hidden my-6">
          <table className="w-full text-sm">
            <thead className="bg-card text-text">
              <tr>
                <th className="text-left p-3 font-semibold">Filing</th>
                <th className="text-left p-3 font-semibold">Cadence</th>
                <th className="text-left p-3 font-semibold">Lag</th>
                <th className="text-left p-3 font-semibold">Question it answers</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              <tr className="border-t border-border">
                <td className="p-3"><strong className="text-text">13F</strong></td>
                <td className="p-3">Quarterly</td>
                <td className="p-3">45 days</td>
                <td className="p-3">What did the smartest investors decide to own at the end of last quarter?</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3"><strong className="text-text">Form 4</strong></td>
                <td className="p-3">Per-event (daily)</td>
                <td className="p-3">2 business days</td>
                <td className="p-3">What are this company's own officers actually doing with their stock right now?</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3"><strong className="text-text">Form 8-K</strong></td>
                <td className="p-3">Per-event (intra-day)</td>
                <td className="p-3">4 business days</td>
                <td className="p-3">What material things has this company itself just announced?</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-3">The three scores</h2>
        <p className="text-muted">
          HoldLens computes one branded composite score from each filing type. Each is a deterministic
          transformation of public SEC data — fully reproducible from the source filings, no machine
          learning, no opinion, just a formula. The exact formulas live in our{" "}
          <Link href="/methodology" className="text-brand underline">methodology page</Link>.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          <Link href="/glossary/#convictionscore" className="text-brand underline">ConvictionScore</Link> — the 13F score
        </h3>
        <p className="text-muted">
          A signed score from −100 to +100 capturing the strength of a superinvestor's conviction in a single
          position, computed from 8 quarters of 13F filings. Inputs: position size, quarter-over-quarter
          change, persistence across 8 quarters, peer overlap. <strong className="text-text">Use it
          when:</strong> you want to know which positions reflect deep, durable conviction vs. mechanical
          rebalancing.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          <Link href="/glossary/#insiderscore" className="text-brand underline">InsiderScore</Link> — the Form 4 score
        </h3>
        <p className="text-muted">
          A signed score from −100 to +100 measuring the signal quality of corporate-insider transactions.
          Inputs: officer role (CEO {">"} CFO {">"} director {">"} 10%-owner), action type (discretionary buy
          {" > "}sell; 10b5-1 sales discounted), transaction size relative to historical norm,{" "}
          <Link href="/glossary/#cluster-buy" className="text-brand underline">cluster detection</Link>{" "}
          (multiple officers trading the same direction within 30 days), recency decay.{" "}
          <strong className="text-text">Use it when:</strong> you want to see what the company's own
          officers think about their stock right now — much fresher than 13F.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          <Link href="/glossary/#eventscore" className="text-brand underline">EventScore</Link> — the 8-K score
        </h3>
        <p className="text-muted">
          A signed score from −100 to +100 measuring the material significance of an SEC Form 8-K filing.
          Inputs: item-type severity (bankruptcy {">"} CEO departure {">"} material agreement), market-cap
          weight, recency decay, event-cluster bonus. <strong className="text-text">Use it when:</strong> you
          want to know what the company itself has just told the market about — the freshest signal of the
          three.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">How to read the trilogy together</h2>
        <p className="text-muted">
          Reading any single one is useful. Reading all three for the same company at the same moment is
          where the picture gets sharp. A few patterns to look for:
        </p>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li>
            <strong className="text-text">High ConvictionScore + cluster buy + positive 8-K event:</strong> a
            superinvestor's quarterly thesis is being confirmed by both insider behavior and management
            action. Strong triangulated signal.
          </li>
          <li>
            <strong className="text-text">High ConvictionScore + cluster sell + negative 8-K event:</strong>{" "}
            the superinvestor's stale 13F is being undermined by fresher signals. Worth re-reading the 13F
            position with skepticism.
          </li>
          <li>
            <strong className="text-text">No 13F position + heavy insider buying:</strong> insiders see
            something that the smartest outside money hasn't reacted to yet. Watch the next 13F cycle.
          </li>
          <li>
            <strong className="text-text">Bankruptcy 8-K + heavy insider 10b5-1 sales in prior weeks:</strong>{" "}
            10b5-1 plans don't generally indicate signal — but a clean cluster of pre-arranged sales right
            before a bankruptcy 8-K is a pattern that has shown up in more than one corporate failure.
          </li>
          <li>
            <strong className="text-text">Restatement 8-K + recent activist 13D filing:</strong> activist
            pressure forced earnings re-examination. Activist's thesis is being validated by management's own
            disclosure.
          </li>
        </ul>
        <p className="text-muted">
          None of these are guaranteed signals — every market regime breaks every pattern eventually. But
          reading the trilogy together filters far more noise than reading any single filing in isolation.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Where the three live on HoldLens</h2>
        <p className="text-muted">
          Each filing type has a dedicated surface, and each per-company page (e.g., for{" "}
          <Link href="/ticker/AAPL/" className="text-brand underline">AAPL</Link>) cross-links to all three
          for that ticker.
        </p>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li>
            <Link href="/investor/" className="text-brand underline">/investor/</Link> — per-superinvestor
            13F holdings + ConvictionScore trends across 8 quarters
          </li>
          <li>
            <Link href="/insiders/" className="text-brand underline">/insiders/</Link> — daily insider
            transactions + InsiderScore + cluster-buy detection
          </li>
          <li>
            <Link href="/events/" className="text-brand underline">/events/</Link> — material 8-K filings +
            EventScore + per-item-type drilldowns (cybersecurity, bankruptcy, M&A, etc.)
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Honest about what the three CAN'T do</h2>
        <p className="text-muted">
          The trilogy is a research tool, not a predictive system. Every signal can be wrong. Every cluster
          buy that looked smart in retrospect was preceded by ten that looked smart at the time and wrong six
          months later. Every restatement 8-K that crashed a stock was preceded by ten that didn't.
        </p>
        <p className="text-muted">
          What the trilogy <em>does</em> do is reduce the surface area where you have to guess. Instead of
          reading one stale 13F and trying to extrapolate, you have three independently-sourced data streams
          to triangulate against. That's a better decision-making position than any of the three alone, but
          it's not a crystal ball.
        </p>
        <p className="text-muted text-sm mt-4">
          See our{" "}
          <Link href="/disclaimer/" className="text-brand underline">disclaimer</Link>{" "}
          for the full statement on data lag, accuracy, and the explicit not-investment-advice framing.
        </p>
      </div>

      <ShareStrip
        title="The SEC Signals Trilogy — 13F + Form 4 + 8-K, explained as one system"
        url="https://holdlens.com/learn/sec-signals-trilogy/"
      />

      <LearnReadNext currentSlug="sec-signals-trilogy" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }}
      />
    </article>
  );
}
