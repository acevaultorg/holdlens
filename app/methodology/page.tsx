import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: { absolute: "The HoldLens Standard — ConvictionScore methodology v1.0" },
  description:
    "The HoldLens Standard for synthesized SEC-filing intelligence. ConvictionScore methodology v1.0 — seven signal layers + two penalties unified into a signed −100..+100 score. Open methodology, transparent weights, version-tracked.",
  alternates: { canonical: "https://holdlens.com/methodology/" },
  openGraph: {
    title: "The HoldLens Standard — ConvictionScore methodology v1.0",
    description:
      "The canonical methodology for synthesized SEC-filing intelligence. Seven signal layers + two penalties → unified −100..+100 ConvictionScore. Free, open, version-tracked.",
    url: "https://holdlens.com/methodology/",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "The HoldLens Standard — ConvictionScore methodology" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The HoldLens Standard — ConvictionScore methodology v1.0",
    description:
      "Seven signal layers + two penalties → unified −100..+100 ConvictionScore. Open methodology, version-tracked.",
    images: ["/og/home.png"],
  },
};

// DefinedTermSet schema — gives LLMs (Claude/ChatGPT/Perplexity/Gemini)
// canonical machine-readable definitions for HoldLens-specific terms +
// industry terms we synthesize. Per Aleyda Solis 10-characteristic LLM-
// citation checklist (C4 Extractable + C7 Credible): when LLMs answer
// "what is a 13F filing" / "what is ConvictionScore" / "what is overlap
// score", they preferentially cite sources with structured DefinedTerm
// schema. Methodology is the canonical glossary surface; ConvictionScore
// + InsiderScore + EventScore DefinedTerms also live on homepage at
// /#term-set (homepage covers the metrics; methodology covers the full
// glossary including industry terms like 13F + superinvestor).
const GLOSSARY_LD = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": "https://holdlens.com/methodology/#glossary",
  name: "HoldLens glossary",
  description:
    "Canonical definitions for SEC-filing terminology and HoldLens-specific composite metrics.",
  hasDefinedTerm: [
    {
      "@type": "DefinedTerm",
      "@id": "https://holdlens.com/methodology/#term-13f",
      name: "13F filing",
      description:
        "A quarterly portfolio disclosure required by the U.S. Securities and Exchange Commission from every institutional investment manager with at least $100 million in qualifying U.S. equity assets under management. Filed on Form 13F-HR within 45 days of each calendar quarter end. Discloses long equity positions only; shorts and derivatives are not required.",
      url: "https://holdlens.com/learn/what-is-a-13f/",
      inDefinedTermSet: "https://holdlens.com/methodology/#glossary",
    },
    {
      "@type": "DefinedTerm",
      "@id": "https://holdlens.com/methodology/#term-conviction-score",
      name: "ConvictionScore",
      description:
        "HoldLens's signed −100 to +100 composite score derived from how the 30 tracked superinvestors are positioning a specific ticker. Aggregates position size, recency of buys vs. sells, manager track-record weighting, and 8-quarter trend. Snapshot signal, not a forward-return predictor. See methodology section 'Unified ConvictionScore (v4)' for the full formula.",
      url: "https://holdlens.com/methodology/",
      inDefinedTermSet: "https://holdlens.com/methodology/#glossary",
    },
    {
      "@type": "DefinedTerm",
      "@id": "https://holdlens.com/methodology/#term-insider-score",
      name: "InsiderScore",
      description:
        "Daily-updated composite from SEC Form 4 filings tracking CEO/CFO/Chair/Director/10%+ owner trades. Role-weighted (CEO buys outweigh director buys), action-weighted (open-market buys outweigh option exercises), recency-decayed (recent activity dominates), and cluster-aware (multiple insiders buying within a window amplifies the signal).",
      url: "https://holdlens.com/learn/insider-score-explained/",
      inDefinedTermSet: "https://holdlens.com/methodology/#glossary",
    },
    {
      "@type": "DefinedTerm",
      "@id": "https://holdlens.com/methodology/#term-overlap-score",
      name: "Portfolio-overlap score",
      description:
        "HoldLens's metric for how closely an ETF's top-10 holdings match a superinvestor's top-10 13F positions. Computed as the sum, over shared tickers, of (manager-percent × ETF-weight-percent). Higher score = more replicable manager. Used on /etf-by-superinvestor/ to answer 'which ETF most closely tracks Bill Ackman's portfolio?' Top-10 vs top-10 only — does not measure full-portfolio tracking error.",
      url: "https://holdlens.com/etf-by-superinvestor/",
      inDefinedTermSet: "https://holdlens.com/methodology/#glossary",
    },
    {
      "@type": "DefinedTerm",
      "@id": "https://holdlens.com/methodology/#term-superinvestor",
      name: "Superinvestor",
      description:
        "Term used by HoldLens for institutional investment managers with multi-decade track records of outperforming market benchmarks. Includes value investors (Buffett, Klarman), activists (Ackman, Icahn), contrarians (Burry), macro traders (Druckenmiller, Tepper), and growth specialists (Coleman, Mandel). HoldLens tracks 30 such managers' 13F filings on a rolling 8-quarter basis.",
      url: "https://holdlens.com/learn/superinvestor-handbook/",
      inDefinedTermSet: "https://holdlens.com/methodology/#glossary",
    },
  ],
};

export default function MethodologyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(GLOSSARY_LD) }}
      />
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Methodology</div>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        The HoldLens Standard · v1.0
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        The HoldLens Standard — <span className="text-brand">ConvictionScore</span> methodology
      </h1>
      <p className="text-muted text-lg leading-relaxed max-w-2xl mb-10">
        The canonical methodology for synthesized SEC-filing intelligence. Seven signal layers + two penalties unified into a signed −100..+100 ConvictionScore. Open methodology, transparent weights, version-tracked.
      </p>
      <div className="space-y-8 text-text leading-relaxed">

        <section>
          <h2 className="text-2xl font-bold mb-3">Data sources</h2>
          <p className="text-muted">
            Every position on HoldLens comes from <strong className="text-text">SEC EDGAR 13F filings</strong> —
            quarterly disclosures required from any institutional investment manager with over $100M in
            assets under management. We supplement with Form 4 (insider trades) and Form 13G/13D (large position
            disclosures).
          </p>
          <ul className="mt-4 space-y-2 text-muted">
            <li>• <strong className="text-text">13F-HR:</strong> Long US equity positions, filed within 45 days of quarter end</li>
            <li>• <strong className="text-text">Form 4:</strong> Insider buys + sells, filed within 2 business days</li>
            <li>• <strong className="text-text">13G/13D:</strong> Large position changes (5%+), filed in real time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">The 45-day lag (and why it matters)</h2>
          <p className="text-muted">
            13F filings are due 45 days after each quarter ends. Translation: when you see a position on HoldLens,
            the actual buy/sell happened 6 weeks to 4 months ago. We never pretend otherwise. <strong className="text-text">
            HoldLens is for pattern recognition, not copy-trading.</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Unified ConvictionScore (v4)</h2>
          <p className="text-muted">
            Every ticker is assigned ONE signed score on a single scale:
            <span className="text-emerald-400 font-semibold"> +100 is the strongest possible buy</span>,
            <span className="text-rose-400 font-semibold"> −100 the strongest possible sell</span>,
            and zero is no signal. A stock can appear on EXACTLY ONE list (buys or sells) — never both —
            because both lists are filtered views of the same single number.
          </p>
          <p className="text-muted mt-3">
            The score is built from six positive layers minus two penalty layers:
          </p>
          <ul className="mt-3 space-y-2 text-muted">
            <li>• <strong className="text-text">Smart money</strong> — manager-quality × consensus, time-decayed across 8 quarters of 13F data</li>
            <li>• <strong className="text-text">Insider activity</strong> — CEO/CFO open-market buys (the strongest single equity signal). Routine 10b5-1 sells don't count against</li>
            <li>• <strong className="text-text">Track record</strong> — buyer 10-year CAGR weighted by their position size in this stock</li>
            <li>• <strong className="text-text">Trend streak</strong> — multi-quarter compounding (3 quarters in a row ≠ 1 quarter)</li>
            <li>• <strong className="text-text">Concentration</strong> — a 15% position is weighted heavier than a 1% position</li>
            <li>• <strong className="text-text">Contrarian bonus</strong> — under-the-radar stocks (small ownership count + tier-1 buyers)</li>
            <li>• <strong className="text-text">− Dissent penalty</strong> — sellers subtract from the score (×1.2 because exits require more conviction than trims)</li>
            <li>• <strong className="text-text">− Crowding penalty</strong> — when ownership count is high, the signal is already priced in</li>
          </ul>
          <p className="text-muted mt-3">
            <strong className="text-text">Pure sign-based:</strong> a ticker's ranking membership is determined entirely
            by the sign of its single signed score. Positive → buy ranking. Negative → sell ranking. Zero → neither.
            No dead zone. No third bucket. The same number tells you everything: direction by its sign, strength by
            its magnitude.
          </p>
          <p className="text-muted mt-3">
            META used to be #1 on both rankings under the old dual-list scheme. Under the unified score, META has
            ONE conviction value (positive, ~+20) — its 9 buyers slightly outweigh its 5 sellers — so it appears
            in EXACTLY ONE list (buys), with a moderate score that reflects the contested nature of the stock.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">How a label maps to the score</h2>
          <p className="text-muted text-sm mb-3">
            Labels are purely cosmetic — they describe how strong a signal is, but don't affect which list a
            ticker appears in. Only the SIGN of the score does that.
          </p>
          {/* 2026-05-08 Google policy compliance (rules/google-policy-compliance.md
              v19.45): label tiers describe OBSERVED ACCUMULATION/SELLING patterns
              factually rather than verdict-style BUY/SELL recommendations.
              HoldLens is not a registered investment advisor. */}
          <ul className="text-muted space-y-1 text-sm">
            <li><span className="text-emerald-400 font-semibold">Heavy accumulation</span> — score ≥ +70</li>
            <li><span className="text-emerald-400 font-semibold">Net accumulation</span> — score ≥ +40</li>
            <li><span className="text-emerald-400 font-semibold">Slight accumulation</span> — score &gt; +10</li>
            <li><span className="text-muted">Mixed</span> — score in [−10, +10] · still appears on buys or sells based on sign</li>
            <li><span className="text-rose-400 font-semibold">Slight selling</span> — score &lt; −10</li>
            <li><span className="text-rose-400 font-semibold">Net selling</span> — score ≤ −40</li>
            <li><span className="text-rose-400 font-semibold">Heavy selling</span> — score ≤ −70</li>
          </ul>
        </section>

        <AdSlot format="in-article" />

        <section>
          <h2 className="text-2xl font-bold mb-3">What we don't show</h2>
          <ul className="text-muted space-y-2">
            <li>❌ Short positions (not in 13Fs)</li>
            <li>❌ Options exposure (notional only, no detail)</li>
            <li>❌ Non-US equities (not in 13Fs)</li>
            <li>❌ Bonds, crypto, real estate (not in 13Fs)</li>
            <li>❌ Real-time positions (legal floor: 45 days)</li>
          </ul>
          <p className="mt-4 text-dim text-sm">
            If you need real-time, options-aware data, you need a Bloomberg terminal — or more accurately, you
            need to be at one of these funds. HoldLens is the best public data made beautiful.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Updates</h2>
          <p className="text-muted">
            Manager portfolios update within hours of each 13F filing. Email subscribers get a one-line move
            alert per filing. We never delete historical data — every quarter is preserved.
          </p>
        </section>

        <section id="v2-roadmap" className="rounded-xl border border-border bg-panel p-6">
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
            Roadmap · v2.0 (proposed)
          </div>
          <h2 className="text-2xl font-bold mb-3">v2.0 — composite simplification</h2>
          <p className="text-muted leading-relaxed mb-4">
            v1.0 ships seven signal layers + two penalties with internal weight ranges (smart money 0-30, insider activity 0-20, track record 0-20, trend streak 0-10, concentration 0-10, contrarian 0-10, event signal -15..+5; minus dissent 0-40, crowding 0-10). v2.0 proposes a 6-dimension composite with explicit operator-tunable percentage weights:
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead className="text-dim text-xs uppercase tracking-wider">
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2">Dimension</th>
                  <th className="text-right px-3 py-2">Weight</th>
                  <th className="text-left px-3 py-2 hidden sm:table-cell">Maps to v1.0</th>
                </tr>
              </thead>
              <tbody className="text-muted">
                <tr className="border-b border-border">
                  <td className="px-3 py-2"><strong className="text-text">Position Size</strong> — % of portfolio, absolute $, relative to investor's avg</td>
                  <td className="text-right px-3 py-2 tabular-nums">25%</td>
                  <td className="px-3 py-2 hidden sm:table-cell text-xs">Concentration + Smart money (size component)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-2"><strong className="text-text">Holding Tenure</strong> — quarters held continuously, change velocity</td>
                  <td className="text-right px-3 py-2 tabular-nums">20%</td>
                  <td className="px-3 py-2 hidden sm:table-cell text-xs">Trend streak + Smart money (time-decay)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-2"><strong className="text-text">Adding vs Trimming</strong> — recent direction, cumulative QoQ delta, trajectory</td>
                  <td className="text-right px-3 py-2 tabular-nums">15%</td>
                  <td className="px-3 py-2 hidden sm:table-cell text-xs">Smart money (direction) + Dissent penalty</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-2"><strong className="text-text">Cross-Investor Overlap</strong> — how many of N tracked superinvestors hold same ticker</td>
                  <td className="text-right px-3 py-2 tabular-nums">15%</td>
                  <td className="px-3 py-2 hidden sm:table-cell text-xs">Smart money (consensus) - Crowding penalty</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-3 py-2"><strong className="text-text">Insider Buy Alignment</strong> — Form 4 insider purchases on same ticker</td>
                  <td className="text-right px-3 py-2 tabular-nums">15%</td>
                  <td className="px-3 py-2 hidden sm:table-cell text-xs">Insider activity layer (existing)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2"><strong className="text-text">Material Event Context</strong> — recent 8-K, bankruptcy proximity, activist 13D presence</td>
                  <td className="text-right px-3 py-2 tabular-nums">10%</td>
                  <td className="px-3 py-2 hidden sm:table-cell text-xs">Event signal layer (existing)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-3">
            <strong className="text-text">Goal:</strong> single 0-100 magnitude (paired with current −100..+100 directional score) where each dimension has a transparent percentage weight an operator could see + tune. Easier to explain, easier to license as a B2B scoring API, easier to audit.
          </p>
          <p className="text-muted text-sm leading-relaxed mb-3">
            <strong className="text-text">Status:</strong> proposal only — v1.0 is the live scoring system today. v2.0 ships when the simplified weights are validated against the same 4-quarter backtest (target r&nbsp;≥&nbsp;0 vs. v1.0&apos;s r&nbsp;=&nbsp;−0.12) and the methodology delta is documented in this page&apos;s Errors and corrections section.
          </p>
          <p className="text-dim text-xs">
            Track methodology evolution: this page is the canonical version-history surface. Past versions are preserved in git; current version is always the published one above.
          </p>
        </section>

        <section id="predictive-validity">
          <h2 className="text-2xl font-bold mb-3">
            Predictive validity — what our 2026 backtest found
          </h2>
          <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-5 mb-4">
            <p className="text-text font-semibold mb-2">
              The ConvictionScore does not predict forward stock returns.
            </p>
            <p className="text-muted text-sm leading-relaxed">
              In April 2026 we ran a full backtest of the score against realized 6-14 month
              forward returns across 221 ticker-quarter pairs (4 quarters × ~55 scored tickers
              each). The correlation between ConvictionScore and forward alpha over SPY was{" "}
              <strong className="text-text">r = −0.12</strong> — essentially zero, and slightly
              negative in direction. Every single quarter in the window showed negative correlation.
              Top-decile BUYs underperformed SPY by ~5%; bottom-decile SELLs <em>outperformed</em>{" "}
              SPY by ~24%.
            </p>
          </div>

          <h3 className="text-lg font-semibold mt-5 mb-2">Why the score still matters</h3>
          <p className="text-muted leading-relaxed">
            HoldLens is a <strong className="text-text">smart-money positioning tracker</strong>,
            not a return predictor. The ConvictionScore is a clean composite of what the tracked
            portfolio managers are actually doing in their most-recent 13F filings — consensus,
            concentration, multi-quarter trends, insider alignment, dissent. That is
            legitimately useful market intelligence (people want to know what Buffett, Ackman,
            Burry and Druckenmiller are buying and selling).
          </p>
          <p className="text-muted leading-relaxed mt-3">
            What the score is <strong className="text-text">not</strong>: a reliable guide to which
            stocks will outperform. Three structural reasons the backtest data points at:
          </p>
          <ul className="mt-3 space-y-2 text-muted">
            <li>
              • <strong className="text-text">Contrarian inversion.</strong> When tracked managers
              BUY a stock, it&apos;s often because the stock dropped and they&apos;re
              bargain-hunting; the drop continues (momentum). When they SELL, they&apos;re often
              taking profit on a winner that keeps winning.
            </li>
            <li>
              • <strong className="text-text">Manager-quality drag.</strong> Several storied
              managers tracked on HoldLens have materially underperformed the S&amp;P over the
              recent 10-year window (see per-manager ROI panels on the investor pages). Their
              picks drive BUY signals; their picks have underperformed.
            </li>
            <li>
              • <strong className="text-text">45-day filing lag.</strong> By the time we surface
              &ldquo;smart money buying X&rdquo;, the news is usually priced in.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-5 mb-2">Reproducing the backtest</h3>
          <p className="text-muted leading-relaxed">
            The backtest script lives at{" "}
            <code className="text-xs px-1.5 py-0.5 bg-panel-hi rounded">scripts/backtest-conviction.ts</code>
            . It pulls 2-year daily closes from Yahoo Finance for every tracked ticker + SPY, replays
            the ConvictionScore at each of the last 4 historical quarters, pairs it with forward
            return from the 13F filing date to today, and computes Pearson correlation + decile
            alpha spreads. Full output is logged to{" "}
            <code className="text-xs px-1.5 py-0.5 bg-panel-hi rounded">.claude/state/CONVICTION_BACKTEST.md</code>
            . We re-run this every quarter — transparency over flattery.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Errors and corrections</h2>
          <p className="text-muted">
            Found a wrong number? Email <a href="mailto:hello@holdlens.com" className="text-brand hover:underline">hello@holdlens.com</a>.
            Corrections logged publicly with a timestamp. Trust is the moat.
          </p>
        </section>

        <p className="text-xs text-dim pt-8 border-t border-border">
          HoldLens is not a registered investment advisor. Nothing on this site is investment advice. Always do
          your own research. See <a href="/about" className="underline">about</a> for our principles.
        </p>
      </div>
    </div>
  );
}
