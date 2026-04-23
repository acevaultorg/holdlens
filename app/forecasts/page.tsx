import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ForecastLens — calibration ledger for HoldLens predictions · HoldLens",
  description:
    "Every forecast HoldLens publishes — backtested predictions, projected vs. actual, calibration accuracy by score band. Honest ledger of what the trilogy got right and wrong.",
  alternates: { canonical: "https://holdlens.com/forecasts/" },
  openGraph: {
    title: "ForecastLens — Calibration Ledger",
    description:
      "Honest predict-vs-actual scoreboard for ConvictionScore, InsiderScore, and EventScore signals.",
    url: "https://holdlens.com/forecasts/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens ForecastLens" }],
  },
  robots: { index: true, follow: true },
};

export default function ForecastsHub() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "ForecastLens — HoldLens calibration ledger",
    description:
      "Append-only ledger of every signal HoldLens published, with projected and realized outcomes 7d / 30d / 90d post-prediction.",
    url: "https://holdlens.com/forecasts/",
    publisher: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
    keywords: ["forecast calibration", "investing predictions", "13F signals backtested"],
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Calibration</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        ForecastLens
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-10">
        Every prediction HoldLens publishes — written down, dated, then measured against
        what actually happened 7, 30, and 90 days later. The honest scoreboard for
        ConvictionScore, InsiderScore, and EventScore signals.
      </p>

      <div className="space-y-6 text-text leading-relaxed">
        <h2 className="text-2xl font-bold mt-10 mb-3">Why this exists</h2>
        <p className="text-muted">
          A scoring system that can't show its track record is a vibe, not a signal.
          ForecastLens is the append-only ledger that makes HoldLens's three branded
          metrics falsifiable — anyone can check whether a +75 ConvictionScore on AAPL
          on a specific date was followed by outperformance, underperformance, or noise.
        </p>
        <p className="text-muted">
          Inspired by Tetlock's superforecaster framework: write the prediction down,
          date it, score it later. No retroactive editing — corrections go through a
          dedicated <em>Corrections</em> log so the original miss stays visible.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">What gets measured</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li>
            <strong className="text-text">ConvictionScore predictions</strong> — every
            signal at score ≥ +50 (strong buy) or ≤ −50 (strong sell), measured at 7d /
            30d / 90d / 180d vs SPY benchmark
          </li>
          <li>
            <strong className="text-text">InsiderScore predictions</strong> — every
            cluster-buy + every CEO open-market purchase ≥ $1M, measured at 30d / 90d
          </li>
          <li>
            <strong className="text-text">EventScore predictions</strong> — every 8-K
            with EventScore magnitude ≥ 50, measured at 5d (event reaction) and 30d
            (medium-term)
          </li>
        </ul>

        <h2 className="text-2xl function-bold mt-10 mb-3">Calibration metrics published</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li>
            <strong className="text-text">Hit rate by score band</strong> — what fraction
            of +75 to +100 ConvictionScore signals beat the benchmark over 90d?
          </li>
          <li>
            <strong className="text-text">Brier score</strong> — overall calibration
            quality across all signals (lower is better; 0.25 = no skill, &lt;0.20 = real edge)
          </li>
          <li>
            <strong className="text-text">Sharpe-of-signals</strong> — risk-adjusted return
            of a portfolio that mechanically follows top decile signals
          </li>
          <li>
            <strong className="text-text">Honesty markers</strong> — explicit "this signal
            failed" rows for every signal that underperformed
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Status</h2>
        <p className="text-muted">
          ForecastLens Phase 1 is the calibration ledger itself. Every signal published
          since site launch is being backfilled into the ledger; new signals automatically
          enter on emission. First public calibration report ships with the next quarterly
          report (May 2026).
        </p>
        <p className="text-muted">
          Initial backtest data lives at
          <Link href="/proof/" className="text-brand underline mx-1">/proof/</Link>
          — that's the methodology audit. ForecastLens is the live ongoing measurement
          layer that grows from here.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">What ForecastLens is NOT</h2>
        <ul className="space-y-2 list-disc list-inside text-muted">
          <li>Not investment advice (see <Link href="/disclaimer/" className="text-brand underline">disclaimer</Link>)</li>
          <li>Not a guarantee that historical hit rate continues</li>
          <li>Not a replacement for your own due diligence — every cited signal links back to its source SEC filing</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Related</h2>
        <p className="text-muted">
          <Link href="/proof/" className="text-brand underline">Backtest methodology</Link>
          {" · "}
          <Link href="/methodology/" className="text-brand underline">Score formulas</Link>
          {" · "}
          <Link href="/learn/sec-signals-trilogy/" className="text-brand underline">SEC Signals trilogy</Link>
          {" · "}
          <Link href="/disclaimer/" className="text-brand underline">Disclaimer</Link>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
