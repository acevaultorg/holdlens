import type { Metadata } from "next";
import Link from "next/link";
import ShareStrip from "@/components/ShareStrip";
import AuthorByline from "@/components/AuthorByline";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";

// /learn/insider-score-explained
//
// Target queries (long-tail, high-intent):
//   "how to score insider buying"
//   "form 4 signal score"
//   "insider buying vs selling signal"
//   "10b5-1 vs discretionary insider trade"
//   "cluster insider buy meaning"
//   "ceo insider buy signal"
//
// Companion to /learn/conviction-score-explained (13F) and
// /learn/event-score-explained (8-K). Completes the LLM-citation-ready
// coverage of all three branded HoldLens metrics. Cross-linked from the
// trilogy article and from /insiders/.

export const metadata: Metadata = {
  title: "InsiderScore Explained — how HoldLens scores SEC Form 4 trades",
  description:
    "The deterministic formula behind HoldLens's InsiderScore. How officer role, action type, transaction size, cluster detection, and recency decay combine into a signed −100 to +100 score for every insider transaction.",
  alternates: {
    canonical: "https://holdlens.com/learn/insider-score-explained/",
  },
  openGraph: {
    title: "InsiderScore Explained",
    description:
      "How HoldLens scores corporate insider trades from SEC Form 4. Officer role, action type, size, cluster detection, recency — full formula.",
    url: "https://holdlens.com/learn/insider-score-explained/",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens InsiderScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "InsiderScore Explained",
    images: ["/og/home.png"],
  },
};

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "InsiderScore Explained — how HoldLens scores SEC Form 4 trades",
    description:
      "The deterministic formula behind HoldLens's InsiderScore. How officer role, action type, transaction size, cluster detection, and recency decay combine into a signed −100 to +100 score for every insider transaction.",
    datePublished: "2026-04-23",
    dateModified: "2026-04-23",
    inLanguage: "en-US",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://holdlens.com/learn/insider-score-explained/",
    },
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    image: "https://holdlens.com/og/home.png",
    about: [
      {
        "@type": "DefinedTerm",
        name: "InsiderScore",
        inDefinedTermSet: "https://holdlens.com/glossary/",
        url: "https://holdlens.com/glossary/#insiderscore",
      },
      { "@type": "Thing", name: "SEC Form 4", url: "https://holdlens.com/glossary/#form-4" },
      { "@type": "Thing", name: "Cluster buy", url: "https://holdlens.com/glossary/#cluster-buy" },
      { "@type": "Thing", name: "Rule 10b5-1 plan", url: "https://holdlens.com/glossary/#10b5-1" },
    ],
  },
];

export default function InsiderScoreExplainedArticle() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        InsiderScore, explained
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-6">
        Every SEC Form 4 transaction gets a single signed number from −100 to +100 on HoldLens. Here's
        exactly how it's computed — and the half of insider trades that get filtered to nearly zero signal.
      </p>

      <AuthorByline date="2026-04-23" />

      <div className="space-y-6 text-text leading-relaxed mt-8">
        <h2 className="text-2xl font-bold mt-10 mb-3">Why score insider trades at all?</h2>
        <p className="text-muted">
          A CEO buying $500k of their own stock, a CFO selling 60% of their position via a quarterly 10b5-1
          plan, and a director receiving an annual stock grant are all <em>technically</em> insider
          transactions. They all show up on{" "}
          <Link href="/glossary/#form-4" className="text-brand underline">SEC Form 4</Link>. They all hit our
          ingestion pipeline within 24 hours of EDGAR publication.
        </p>
        <p className="text-muted">
          But they are not equivalent signals. Treating them as equivalent would drown the discretionary
          buys (the ones that historically have predictive value) in routine compensation noise. InsiderScore
          is the formula that separates them.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">The InsiderScore formula</h2>
        <p className="text-muted">Deterministic. Reproducible. No machine learning.</p>
        <pre className="text-xs bg-card border border-border rounded-lg p-4 my-4 overflow-x-auto">
          <code className="text-text">
{`InsiderScore = role_weight(officer_title)
             × action_weight(transaction_code)
             × size_weight(value / officer_historical_avg)
             × cluster_bonus
             × recency_decay
  (clamped to [−100, +100])`}
          </code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-2">1. Role weight</h3>
        <p className="text-muted">
          Different officer titles carry different signal levels. The CEO and CFO have the most complete
          inside view; directors see a board-level view; 10%+ owners are big shareholders but often less
          informed about operations.
        </p>
        <div className="rounded-lg border border-border overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead className="bg-card text-text">
              <tr>
                <th className="text-left p-3 font-semibold">Role</th>
                <th className="text-right p-3 font-semibold">Weight</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              <tr className="border-t border-border"><td className="p-3">CEO / Founder-CEO</td><td className="p-3 text-right">1.00</td></tr>
              <tr className="border-t border-border"><td className="p-3">CFO</td><td className="p-3 text-right">0.85</td></tr>
              <tr className="border-t border-border"><td className="p-3">Chairman</td><td className="p-3 text-right">0.80</td></tr>
              <tr className="border-t border-border"><td className="p-3">President / COO</td><td className="p-3 text-right">0.70</td></tr>
              <tr className="border-t border-border"><td className="p-3">Director</td><td className="p-3 text-right">0.55</td></tr>
              <tr className="border-t border-border"><td className="p-3">10%+ owner</td><td className="p-3 text-right">0.45</td></tr>
              <tr className="border-t border-border"><td className="p-3">Other officer (SVP, GC, etc.)</td><td className="p-3 text-right">0.40</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-2">2. Action weight (the most important factor)</h3>
        <p className="text-muted">
          The SEC Form 4 transaction code is the single most powerful filter we apply. Two pieces of common
          wisdom drive the weights:
        </p>
        <ol className="space-y-3 list-decimal list-inside text-muted">
          <li>
            <strong className="text-text">"Insiders sell for many reasons; they buy for one."</strong>{" "}
            Discretionary buys (code P) carry the strongest signal. Sells can be diversification, tax,
            divorce, planned spending — any of a hundred non-thesis reasons.
          </li>
          <li>
            <strong className="text-text">10b5-1 sales are pre-arranged, not opportunistic.</strong> A
            10b5-1 plan is set up months in advance. The insider can't time it on news. So a 10b5-1 sale
            (code S with the 10b5-1 flag) carries far less information than a discretionary sale on the
            same day.
          </li>
        </ol>
        <div className="rounded-lg border border-border overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead className="bg-card text-text">
              <tr>
                <th className="text-left p-3 font-semibold">Code</th>
                <th className="text-left p-3 font-semibold">Action</th>
                <th className="text-right p-3 font-semibold">Weight</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              <tr className="border-t border-border"><td className="p-3 font-mono">P</td><td className="p-3">Open-market purchase (discretionary)</td><td className="p-3 text-right text-emerald-400">+1.00</td></tr>
              <tr className="border-t border-border"><td className="p-3 font-mono">S</td><td className="p-3">Open-market sale (discretionary)</td><td className="p-3 text-right text-rose-400">−0.70</td></tr>
              <tr className="border-t border-border"><td className="p-3 font-mono">S (10b5-1)</td><td className="p-3">Pre-scheduled sale</td><td className="p-3 text-right">−0.15</td></tr>
              <tr className="border-t border-border"><td className="p-3 font-mono">A</td><td className="p-3">Grant / award (compensation)</td><td className="p-3 text-right">0.00</td></tr>
              <tr className="border-t border-border"><td className="p-3 font-mono">M</td><td className="p-3">Option exercise</td><td className="p-3 text-right">+0.05</td></tr>
              <tr className="border-t border-border"><td className="p-3 font-mono">F</td><td className="p-3">Tax withholding on vesting</td><td className="p-3 text-right">0.00</td></tr>
              <tr className="border-t border-border"><td className="p-3 font-mono">G</td><td className="p-3">Bona-fide gift</td><td className="p-3 text-right">0.00</td></tr>
              <tr className="border-t border-border"><td className="p-3 font-mono">D</td><td className="p-3">Disposition to issuer</td><td className="p-3 text-right">−0.10</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted text-sm">
          Translation: an open-market CEO buy (P × 1.00) gets multiplied by +1.00; an annual director grant
          (A × 0.55) gets multiplied by 0.00. The grant scores zero. That's the whole point.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">3. Size weight</h3>
        <p className="text-muted">
          A $1M buy from a CEO who normally trades $5k positions is a vastly stronger signal than a $1M buy
          from a CEO who routinely trades $50M positions. Size weight normalizes against each insider's
          12-month historical average:
        </p>
        <pre className="text-xs bg-card border border-border rounded-lg p-4 my-4 overflow-x-auto">
          <code className="text-text">
{`size_weight = log10(transaction_value / officer_avg) + 1
  clamped to [0.5, 2.0]`}
          </code>
        </pre>
        <p className="text-muted">
          A trade equal to historical average gets size_weight = 1.0. A 10× outlier gets 2.0 (the cap). A
          tiny trade (1/10th of average) gets 0.5 (the floor).
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">4. Cluster bonus</h3>
        <p className="text-muted">
          Multiple officers at the same company trading the same direction within a 30-day window is the
          single highest-signal pattern in insider data. The cluster bonus multiplies the score by 1.5 when
          ≥3 officers act in the same direction within 30 days, capped at 2.0 for ≥5 officers. See{" "}
          <Link href="/glossary/#cluster-buy" className="text-brand underline">cluster buy</Link> in the
          glossary for the full definition.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">5. Recency decay</h3>
        <p className="text-muted">
          A trade made yesterday carries more signal than one made 3 months ago. Recency decay halves the
          score over 90 days, zeros it out after 240 days. This is how stale insider data gradually fades
          out of per-ticker InsiderScore aggregates.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">What InsiderScore is NOT</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li>
            <strong className="text-text">Not a prediction.</strong> A high positive InsiderScore means
            "this insider, in this role, made this discretionary trade at this size, and historically that
            pattern has carried information." It does not mean "the stock will go up." See{" "}
            <Link href="/disclaimer/" className="text-brand underline">disclaimer</Link>.
          </li>
          <li>
            <strong className="text-text">Not anti-shorting / anti-trading.</strong> Selling carries valid
            signal too — just less than buying. We score sells, we don't ignore them.
          </li>
          <li>
            <strong className="text-text">Not 10b5-1-blind.</strong> 10b5-1 sales DO show up; they're
            scored at ~20% of discretionary-sale weight. They're not zero — a cluster of 10b5-1 sales right
            before bad news is still a pattern, just a much weaker one.
          </li>
          <li>
            <strong className="text-text">Not anti-grant.</strong> Stock grants and option exercises score
            near zero — but they ARE in the data. We don't pretend they happened to a different person.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Per-company aggregation</h2>
        <p className="text-muted">
          Each ticker's overall InsiderScore is the recency-weighted sum of all per-trade scores in the last
          240 days, divided by trade count, with cluster bonuses applied across the rolling window. New
          discretionary buys push the aggregate up; old grants fade quietly. Tickers with no recent insider
          activity show InsiderScore = null (absence ≠ neutral).
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Where to use InsiderScore</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li>
            <Link href="/insiders/" className="text-brand underline">/insiders/</Link> — the full insider-activity hub
          </li>
          <li>
            <Link href="/insiders/live/" className="text-brand underline">/insiders/live/</Link> —
            chronological firehose of recent Form 4 filings
          </li>
          <li>
            Per-ticker pages (e.g.,{" "}
            <Link href="/ticker/AAPL/" className="text-brand underline">/ticker/AAPL/</Link>) show the
            ticker's InsiderScore alongside its ConvictionScore (13F) and EventScore (8-K). Read all three
            together — see{" "}
            <Link href="/learn/sec-signals-trilogy/" className="text-brand underline">
              The SEC Signals Trilogy
            </Link>
            . For the head-to-head between Form 4 and 13F specifically — speed, scope, signal strength —
            see{" "}
            <Link href="/learn/form-4-vs-13f/" className="text-brand underline">
              Form 4 vs 13F
            </Link>
            .
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">The honesty trail</h2>
        <p className="text-muted">
          Every per-trade row on /insiders/ links back to its source SEC Form 4 filing by accession number.
          If a trade looks mis-scored, click to the source filing and verify. If you find an error — wrong
          role classification, wrong action code, wrong 10b5-1 flag — email{" "}
          <a href="mailto:contact@editnative.com" className="text-brand underline">
            contact@editnative.com
          </a>{" "}
          and we correct verified errors within 48 hours.
        </p>
        <p className="text-muted text-sm mt-4">
          Full role-weight + action-weight tables, edge cases (joint-officer titles, derivative
          instruments, gifts to charity), and the cluster-detection algorithm pseudocode live in the{" "}
          <Link href="/methodology" className="text-brand underline">methodology page</Link>.
        </p>
      </div>

      <ShareStrip
        title="InsiderScore Explained — how HoldLens scores SEC Form 4 trades"
        url="https://holdlens.com/learn/insider-score-explained/"
      />

      <LearnReadNext currentSlug="insider-score-explained" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }}
      />
    </article>
  );
}
