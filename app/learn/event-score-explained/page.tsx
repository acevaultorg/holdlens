import type { Metadata } from "next";
import Link from "next/link";
import ShareStrip from "@/components/ShareStrip";
import AuthorByline from "@/components/AuthorByline";
import { AUTHOR_SCHEMA, PUBLISHER_REF } from "@/lib/author";
import LearnReadNext from "@/components/LearnReadNext";

// /learn/event-score-explained
//
// Target queries (long-tail, high-intent):
//   "sec 8-k event significance"
//   "how to score 8-k filings"
//   "event score sec"
//   "material event 8-k explained"
//   "what makes an 8-k material"
//   "8-k item 1.05 cybersecurity"
//   "8-k item 4.02 restatement"
//
// The only explainer on the web that walks through an entire 8-K scoring
// framework with item-type severity table, cluster-bonus mechanics, and
// decay math. Companion to /learn/conviction-score-explained (13F) and
// /learn/sec-signals-trilogy (the three together).

export const metadata: Metadata = {
  title: "EventScore Explained — how HoldLens scores SEC 8-K material events",
  description:
    "The deterministic formula behind HoldLens's EventScore. How item-type severity, market-cap weight, recency decay, and event-cluster detection combine into a signed −100 to +100 score for every SEC Form 8-K filing.",
  alternates: {
    canonical: "https://holdlens.com/learn/event-score-explained/",
  },
  openGraph: {
    title: "EventScore Explained",
    description:
      "How HoldLens scores material SEC 8-K events. Item-type severity, market-cap weight, recency, and cluster detection — the full formula.",
    url: "https://holdlens.com/learn/event-score-explained/",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens EventScore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EventScore Explained",
    images: ["/og/home.png"],
  },
};

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "EventScore Explained — how HoldLens scores SEC 8-K material events",
    description:
      "The deterministic formula behind HoldLens's EventScore. How item-type severity, market-cap weight, recency decay, and event-cluster detection combine into a signed −100 to +100 score for every SEC Form 8-K filing.",
    datePublished: "2026-04-23",
    dateModified: "2026-04-23",
    inLanguage: "en-US",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://holdlens.com/learn/event-score-explained/",
    },
    author: AUTHOR_SCHEMA,
    publisher: PUBLISHER_REF,
    image: "https://holdlens.com/og/home.png",
    about: [
      {
        "@type": "DefinedTerm",
        name: "EventScore",
        inDefinedTermSet: "https://holdlens.com/glossary/",
        url: "https://holdlens.com/glossary/#eventscore",
      },
      { "@type": "Thing", name: "SEC Form 8-K", url: "https://holdlens.com/glossary/#form-8k" },
    ],
  },
];

export default function EventScoreExplainedArticle() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Learn</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        EventScore, explained
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-6">
        Every SEC Form 8-K filing gets a single signed number from −100 to +100 on HoldLens. This is exactly
        how that number is computed.
      </p>

      <AuthorByline date="2026-04-23" />

      <div className="space-y-6 text-text leading-relaxed mt-8">
        <h2 className="text-2xl font-bold mt-10 mb-3">Why score 8-Ks at all?</h2>
        <p className="text-muted">
          SEC Form 8-K is a company's own disclosure of material events to the market. Companies file a 8-K
          within 4 business days of any event they determine is material. The event types range from{" "}
          <strong className="text-text">earnings announcements</strong> (routine, high volume) to{" "}
          <strong className="text-text">bankruptcy filings</strong> (rare, existential) to{" "}
          <strong className="text-text">material cybersecurity incidents</strong> (added 2023, high variance).
        </p>
        <p className="text-muted">
          Treating all 8-Ks as equal is wrong — a quarterly earnings release and a CEO-departure 8-K are not
          the same thing. Treating them as unequal but without a formula is worse — it introduces opinion.
          Both failure modes are avoidable.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">The EventScore formula</h2>
        <p className="text-muted">
          EventScore is deterministic. Given the same 8-K filing, it always produces the same number. It is
          a transformation, not a prediction. The formula is:
        </p>
        <pre className="text-xs bg-card border border-border rounded-lg p-4 my-4 overflow-x-auto">
          <code className="text-text">
{`EventScore = base_severity(item_type)
           × market_cap_weight
           × recency_decay
           × cluster_bonus
  (clamped to [−100, +100])`}
          </code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-2">1. Base severity by item type</h3>
        <p className="text-muted">
          Each SEC 8-K item number has a canonical severity assigned based on how much it historically moves
          stock prices and how much it changes the forward picture. Sample values (full table in{" "}
          <Link href="/methodology" className="text-brand underline">methodology</Link>):
        </p>

        <div className="rounded-lg border border-border overflow-hidden my-4">
          <table className="w-full text-sm">
            <thead className="bg-card text-text">
              <tr>
                <th className="text-left p-3 font-semibold">Item</th>
                <th className="text-left p-3 font-semibold">Event type</th>
                <th className="text-right p-3 font-semibold">Base</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              <tr className="border-t border-border">
                <td className="p-3 font-mono">1.03</td>
                <td className="p-3">Bankruptcy or Receivership</td>
                <td className="p-3 text-right">−95</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3 font-mono">4.02</td>
                <td className="p-3">Non-reliance on prior financials (restatement)</td>
                <td className="p-3 text-right">−75</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3 font-mono">1.05</td>
                <td className="p-3">Material Cybersecurity Incident</td>
                <td className="p-3 text-right">−60</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3 font-mono">5.02</td>
                <td className="p-3">Officer Departure (CEO/CFO)</td>
                <td className="p-3 text-right">−30 to +10 (signed by surrounding context)</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3 font-mono">2.02</td>
                <td className="p-3">Earnings Results</td>
                <td className="p-3 text-right">signed by beat vs miss</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3 font-mono">1.01</td>
                <td className="p-3">Material Definitive Agreement</td>
                <td className="p-3 text-right">+30 (typical M&A signing)</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3 font-mono">2.01</td>
                <td className="p-3">Completed Acquisition or Disposition</td>
                <td className="p-3 text-right">+40 (close completed)</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-3 font-mono">2.06</td>
                <td className="p-3">Material Impairments</td>
                <td className="p-3 text-right">−55</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-2">2. Market-cap weight</h3>
        <p className="text-muted">
          An 8-K from a $2B small-cap carries more per-event signal than an 8-K from a $2T mega-cap — the
          small-cap's price moves proportionally more on the same event. Market-cap weight is a logarithmic
          scaler: <code className="text-text bg-card px-1 rounded">weight = log10(1e12 / market_cap) / 2</code>,
          clamped to [0.8, 1.5]. Micro-caps see their signal slightly amplified; mega-caps see it slightly
          dampened, but nothing approaches "zero signal."
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">3. Recency decay</h3>
        <p className="text-muted">
          An 8-K filed yesterday carries more signal than one filed a month ago — not because the event
          itself changes, but because markets have had more time to price in the old one. Recency decay is a
          gentle exponential: the score degrades by about 50% over 90 days, zero-ing out after about 240 days.
          This is how we avoid stale events dominating per-ticker EventScore aggregates.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">4. Cluster bonus</h3>
        <p className="text-muted">
          Multiple material events at the same company within a 30-day window get an amplification bonus of
          ×1.25 per additional event (capped at ×1.75). The reasoning: one 8-K is an event; three material
          8-Ks in three weeks is a pattern. Restatement + CEO departure + cybersecurity incident in rapid
          succession is almost never coincidence.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">What EventScore is NOT</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li>
            <strong className="text-text">Not a prediction.</strong> A high negative EventScore says "this
            thing just happened and historically that kind of thing matters." It does not say "the stock
            will go down." See our{" "}
            <Link href="/disclaimer/" className="text-brand underline">disclaimer</Link>.
          </li>
          <li>
            <strong className="text-text">Not a news feed.</strong> EventScore only scores SEC 8-K filings.
            Earnings calls, analyst downgrades, and macro news are all higher-signal than most 8-Ks but live
            elsewhere.
          </li>
          <li>
            <strong className="text-text">Not sentiment analysis.</strong> Item-type severity is a fixed
            table based on historical effect, not an NLP sentiment pass over the 8-K's text. We don't
            estimate tone from prose; we look at WHAT was filed, not HOW it was worded.
          </li>
          <li>
            <strong className="text-text">Not a replacement for reading.</strong> EventScore is a
            triage layer — it tells you which 8-Ks are worth reading in depth. The filings themselves are
            still the source of truth; we cite them on every /events/ detail page with direct SEC EDGAR
            links.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">How EventScore aggregates per-ticker</h2>
        <p className="text-muted">
          Each ticker's overall EventScore is the recency-weighted sum of all per-8-K scores in the last 240
          days, divided by the count. New events push the aggregate toward their direction; old events fade
          into the baseline. Tickers with zero recent 8-Ks have EventScore = null, not 0 — absence of signal
          ≠ neutral signal.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Where to use EventScore</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li>
            <Link href="/events/" className="text-brand underline">/events/</Link> — the full material-events
            hub, live feed + per-company + per-item-type
          </li>
          <li>
            <Link href="/events/type/cybersecurity-incident/" className="text-brand underline">
              /events/type/cybersecurity-incident/
            </Link>{" "}
            and the 8 other item-type drilldowns
          </li>
          <li>
            Every per-ticker page (e.g.,{" "}
            <Link href="/ticker/AAPL/" className="text-brand underline">/ticker/AAPL/</Link>) shows the ticker's
            EventScore alongside its ConvictionScore and InsiderScore — read all three together (see{" "}
            <Link href="/learn/sec-signals-trilogy/" className="text-brand underline">
              The SEC Signals Trilogy
            </Link>
            )
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">The invariant</h2>
        <p className="text-muted">
          Every data row on /events/ links back to the source SEC EDGAR filing by accession number. If you
          want to verify a score, click through to the 8-K itself. If you find a scoring error — wrong
          item-type classification, wrong base severity — email{" "}
          <a href="mailto:contact@editnative.com" className="text-brand underline">
            contact@editnative.com
          </a>{" "}
          with the accession number and we correct verified errors within 48 hours.
        </p>
        <p className="text-muted text-sm mt-4">
          Full score table + edge-case rules (amended filings with /A suffix, multi-item 8-Ks, correction
          filings) live in the{" "}
          <Link href="/methodology" className="text-brand underline">methodology page</Link>.
        </p>
      </div>

      <ShareStrip
        title="EventScore Explained — how HoldLens scores SEC 8-K material events"
        url="https://holdlens.com/learn/event-score-explained/"
      />

      <LearnReadNext currentSlug="event-score-explained" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }}
      />
    </article>
  );
}
