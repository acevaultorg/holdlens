import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import CsvExportButton from "@/components/CsvExportButton";
import ValueClient, { type ValueCandidate } from "./ValueClient";
import { getTopBuys } from "@/lib/conviction";
import { MANAGERS } from "@/lib/managers";

export const metadata: Metadata = {
  title: "Smart money near the 52-week low — the best value buys right now",
  description: `Buy signals from ${MANAGERS.length} of the best portfolio managers that are ALSO trading near their 52-week low. The killer combo Dataroma doesn't show: smart money + cheap price.`,
  alternates: { canonical: "https://holdlens.com/value" },
  openGraph: {
    title: "HoldLens — Smart money × 52-week low",
    description: "The only screen that combines conviction scoring with 52-week-low proximity. Cheap stocks the best investors are already buying.",
  },
};

export default function ValuePage() {
  // Pre-compute the top 50 buy candidates server-side. Client filters by 52w-low
  // proximity. 50 is enough headroom that even a strict ≤15% threshold returns
  // a usable list without starving the page.
  const buys = getTopBuys(50);
  const candidates: ValueCandidate[] = buys.map((c) => ({
    ticker: c.ticker,
    name: c.name,
    sector: c.sector,
    score: c.score,
    buyerCount: c.buyerCount,
    sellerCount: c.sellerCount,
    ownerCount: c.ownerCount,
    expectedReturnPct: c.expectedReturnPct,
    topBuyers: c.topBuyers,
  }));

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Smart money × 52-week low
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        The best investors are buying this.{" "}
        <span className="text-emerald-400">And it&apos;s cheap.</span>
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-3">
        The killer combo. Buy signals from {MANAGERS.length} of the world&apos;s best portfolio managers —
        filtered to only the ones trading near their 52-week low.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Dataroma shows you who&apos;s buying. It doesn&apos;t tell you which of those picks are on
        sale. This page does. The value score blends conviction × discount so the top row is both
        high-conviction and close to the bottom.
      </p>

      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <AdSlot format="horizontal" className="flex-1 min-w-0" />
        <CsvExportButton
          endpoint="/api/v1/value.json"
          filename="holdlens-value"
          label="Export value picks CSV"
        />
      </div>

      <ValueClient candidates={candidates} />

      {/* Explainer */}
      <section className="mt-16 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          Why this combo
        </div>
        <h2 className="text-xl font-bold mb-3">Smart money finds the business. Low price finds the entry.</h2>
        <p className="text-sm text-muted leading-relaxed mb-3">
          Most retail investors either chase what&apos;s hot (and pay a premium) or hunt for cheap
          stocks with no catalyst. Neither works alone. The best entries are businesses that
          great operators are already buying AND whose price has come down to the low end of its
          52-week range.
        </p>
        <p className="text-sm text-muted leading-relaxed mb-3">
          <span className="text-text font-semibold">Buffett in KHC at ~$30 (2019).</span>{" "}
          <span className="text-text font-semibold">Ackman in CMG at ~$400 (2016).</span>{" "}
          <span className="text-text font-semibold">Munger in BABA at ~$90 (2022).</span>{" "}
          Every time the masters load up near a cycle low, it&apos;s the same pattern — and it&apos;s
          almost never priced in at the moment.
        </p>
        <p className="text-xs text-dim">
          The value score = conviction × (1 − proximity-to-low). A conviction-70 stock right at
          its 52w low beats a conviction-85 stock that&apos;s 20% above its low. Cheap beats hot.
        </p>
      </section>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <a
          href="/best-now"
          className="rounded-xl border border-border bg-panel p-5 hover:border-brand transition"
        >
          <div className="text-sm font-semibold text-text mb-1">Top buys overall →</div>
          <div className="text-xs text-muted">
            Highest conviction regardless of price
          </div>
        </a>
        <a
          href="/screener"
          className="rounded-xl border border-border bg-panel p-5 hover:border-brand transition"
        >
          <div className="text-sm font-semibold text-text mb-1">Full screener →</div>
          <div className="text-xs text-muted">
            All sliders: score, owners, sector, 52w range
          </div>
        </a>
        <a
          href="/insiders"
          className="rounded-xl border border-border bg-panel p-5 hover:border-brand transition"
        >
          <div className="text-sm font-semibold text-text mb-1">Insider buys →</div>
          <div className="text-xs text-muted">
            CEO/CFO open-market purchases
          </div>
        </a>
      </div>

      <p className="text-xs text-dim mt-12 text-center">
        52-week range from Yahoo Finance (live, 60s cache). Conviction scores from SEC 13F filings.
        Not investment advice. <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
