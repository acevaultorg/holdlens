import type { Metadata } from "next";
import Link from "next/link";
import { MERGED_MOVES, QUARTERS, QUARTER_LABELS, type Quarter } from "@/lib/moves";
import { getManager } from "@/lib/managers";
import TickerLogo from "@/components/TickerLogo";

// /divergence — the debate signal. Tickers where ≥2 tracked superinvestors
// are net BUYING (action: new | add) AND ≥2 are net SELLING (action: trim | exit)
// in the SAME quarter. Computed from MERGED_MOVES (curated + EDGAR-parsed
// 13F moves, ~thousands of rows).
//
// Companion page to /consensus (where smart money agrees). Where consensus
// is the low-variance bet, divergence is the asymmetric one — the trades
// where superinvestors actively disagree, often at inflection points.

export const metadata: Metadata = {
  title:
    "Superinvestor Divergence — where the smart money disagrees · HoldLens",
  description:
    "Tickers where ≥2 tracked superinvestors are net buying AND ≥2 are net selling in the same quarter. Computed from 30 manager 13F filings. The debate signal — when conviction is split.",
  alternates: { canonical: "https://holdlens.com/divergence/" },
  openGraph: {
    title: "HoldLens — Superinvestor Divergence",
    description:
      "Where the smart money is split: ≥2 buying, ≥2 selling, same ticker, same quarter. Computed live from 30 superinvestor 13F filings.",
    url: "https://holdlens.com/divergence/",
    type: "website",
    images: [
      { url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens Divergence" },
    ],
  },
  robots: { index: true, follow: true },
};

type DivergenceRow = {
  ticker: string;
  quarter: Quarter;
  buyers: { slug: string; name: string; fund: string; action: string; deltaPct?: number }[];
  sellers: { slug: string; name: string; fund: string; action: string; deltaPct?: number }[];
  intensity: number; // |buyers| × |sellers| × 10
};

function computeDivergence(): DivergenceRow[] {
  // Group moves by quarter+ticker
  const grouped = new Map<
    string,
    {
      ticker: string;
      quarter: Quarter;
      buyers: DivergenceRow["buyers"];
      sellers: DivergenceRow["sellers"];
    }
  >();

  for (const mv of MERGED_MOVES) {
    const key = `${mv.quarter}|${mv.ticker}`;
    let rec = grouped.get(key);
    if (!rec) {
      rec = {
        ticker: mv.ticker,
        quarter: mv.quarter as Quarter,
        buyers: [],
        sellers: [],
      };
      grouped.set(key, rec);
    }
    const mgr = getManager(mv.managerSlug);
    if (!mgr) continue;
    const entry = {
      slug: mv.managerSlug,
      name: mgr.name,
      fund: mgr.fund,
      action: mv.action,
      deltaPct: mv.deltaPct,
    };
    if (mv.action === "new" || mv.action === "add") rec.buyers.push(entry);
    else if (mv.action === "trim" || mv.action === "exit") rec.sellers.push(entry);
  }

  const out: DivergenceRow[] = [];
  for (const rec of grouped.values()) {
    if (rec.buyers.length >= 2 && rec.sellers.length >= 2) {
      out.push({
        ticker: rec.ticker,
        quarter: rec.quarter,
        buyers: rec.buyers,
        sellers: rec.sellers,
        intensity: rec.buyers.length * rec.sellers.length * 10,
      });
    }
  }

  // Sort by quarter (newest first), then intensity desc
  out.sort((a, b) => {
    if (a.quarter !== b.quarter) return a.quarter < b.quarter ? 1 : -1;
    return b.intensity - a.intensity;
  });
  return out;
}

export default function DivergenceHub() {
  const rows = computeDivergence();
  const latestQuarter = QUARTERS[0] as Quarter;
  const latestRows = rows.filter((r) => r.quarter === latestQuarter);
  const recentByQuarter = new Map<Quarter, DivergenceRow[]>();
  for (const r of rows) {
    const arr = recentByQuarter.get(r.quarter) ?? [];
    arr.push(r);
    recentByQuarter.set(r.quarter, arr);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HoldLens Superinvestor Divergence",
    description:
      "Tickers where tracked superinvestors disagree directionally in the same quarter — the debate signal. Computed live from 30-manager 13F filings.",
    url: "https://holdlens.com/divergence/",
    publisher: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: latestRows.length,
      itemListElement: latestRows.slice(0, 20).map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Thing",
          name: `${r.ticker} divergence — ${r.buyers.length} buy, ${r.sellers.length} sell (${QUARTER_LABELS[r.quarter]})`,
        },
      })),
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Cross-Filer Pattern
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Divergence
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-6">
        Where the smart money is split: tickers with{" "}
        <strong className="text-text">≥2 tracked superinvestors net buying</strong>{" "}
        AND <strong className="text-text">≥2 net selling</strong> in the same
        quarter. The debate signal — when conviction actively disagrees.
      </p>
      <p className="text-sm text-dim mb-10">
        Currently <strong className="text-text">{rows.length}</strong> divergence
        events across all tracked quarters · <strong className="text-text">{latestRows.length}</strong>{" "}
        in the latest quarter ({QUARTER_LABELS[latestQuarter]}).
      </p>

      {latestRows.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mt-2 mb-4">
            {QUARTER_LABELS[latestQuarter]} divergence ({latestRows.length})
          </h2>
          <div className="space-y-4">
            {latestRows.slice(0, 12).map((r) => (
              <div
                key={`${r.quarter}-${r.ticker}`}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <TickerLogo symbol={r.ticker} size={36} />
                  <div>
                    <Link
                      href={`/stock/${r.ticker}/`}
                      className="text-lg font-bold text-text hover:text-brand transition"
                    >
                      {r.ticker}
                    </Link>
                    <div className="text-xs text-dim">
                      Intensity score: {r.intensity}
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-emerald-400 font-semibold mb-1">
                      Buying ({r.buyers.length})
                    </div>
                    <ul className="space-y-1 text-muted">
                      {r.buyers.map((b, i) => (
                        <li key={i} className="text-xs">
                          <Link
                            href={`/investor/${b.slug}/`}
                            className="text-text hover:text-brand transition"
                          >
                            {b.name}
                          </Link>{" "}
                          <span className="text-dim">
                            ({b.action}
                            {b.deltaPct ? `, +${b.deltaPct}%` : ""})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-rose-400 font-semibold mb-1">
                      Selling ({r.sellers.length})
                    </div>
                    <ul className="space-y-1 text-muted">
                      {r.sellers.map((s, i) => (
                        <li key={i} className="text-xs">
                          <Link
                            href={`/investor/${s.slug}/`}
                            className="text-text hover:text-brand transition"
                          >
                            {s.name}
                          </Link>{" "}
                          <span className="text-dim">
                            ({s.action}
                            {s.deltaPct ? `, ${s.deltaPct}%` : ""})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {latestRows.length > 12 && (
            <p className="text-sm text-dim mt-4">
              Showing 12 of {latestRows.length}. Older quarters below.
            </p>
          )}
        </section>
      )}

      {rows.length > 0 && recentByQuarter.size > 1 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mt-2 mb-4">By quarter</h2>
          <ul className="space-y-2">
            {Array.from(recentByQuarter.entries())
              .filter(([q]) => q !== latestQuarter)
              .slice(0, 6)
              .map(([q, rs]) => (
                <li
                  key={q}
                  className="rounded border border-border p-3 text-sm flex justify-between items-center"
                >
                  <span className="text-text font-semibold">
                    {QUARTER_LABELS[q]}
                  </span>
                  <span className="text-muted">
                    {rs.length} divergence event{rs.length === 1 ? "" : "s"} ·
                    top:{" "}
                    {rs
                      .slice(0, 3)
                      .map((r) => r.ticker)
                      .join(", ")}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      )}

      <div className="space-y-6 text-text leading-relaxed">
        <h2 className="text-2xl font-bold mt-10 mb-3">The companion to /consensus/</h2>
        <p className="text-muted">
          <Link href="/consensus/" className="text-brand underline">/consensus/</Link>{" "}
          surfaces tickers where smart money agrees (multiple buyers, no sellers).
          /divergence/ surfaces the opposite: tickers where smart money explicitly
          disagrees. Both are valid signals; they answer different questions.
        </p>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li>
            <strong className="text-text">Consensus</strong> = "high conviction this is mispriced." Lower variance, often slower compounding.
          </li>
          <li>
            <strong className="text-text">Divergence</strong> = "smart money is fighting over the thesis." Higher variance, asymmetric bets in either direction.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">What divergence often signals</h2>
        <ul className="space-y-3 list-disc list-inside text-muted">
          <li>
            <strong className="text-text">Inflection-point trades</strong> — value managers exiting on multiple expansion while growth managers building (Tesla 2020-2021)
          </li>
          <li>
            <strong className="text-text">Capital-cycle turning points</strong> — energy, real estate, mining where some superinvestors call top while others call bottom
          </li>
          <li>
            <strong className="text-text">Activist-anticipation</strong> — a famously activist-friendly investor building a position while traditional value players exit (often signals incoming campaign)
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-3">Methodology</h2>
        <p className="text-muted">
          Computed live at build time from{" "}
          <Link href="/13f/" className="text-brand underline">
            13F filings
          </Link>{" "}
          across 30 tracked superinvestors. A ticker meets the divergence threshold
          when at least 2 managers filed an "add" or "new" position AND at least 2
          managers filed a "trim" or "exit" within the same SEC quarterly window.
          Intensity = (buyers × sellers × 10) — peaks when the disagreement is
          large and balanced.
        </p>
        <p className="text-muted">
          Same{" "}
          <Link href="/disclaimer/" className="text-brand underline">
            disclaimer
          </Link>{" "}
          applies — 45-day 13F filing lag is real; this is structured data on past
          conviction, not investment advice.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-3">Related</h2>
        <p className="text-muted">
          <Link href="/consensus/" className="text-brand underline">
            Consensus (where smart money agrees)
          </Link>
          {" · "}
          <Link href="/contrarian-bets/" className="text-brand underline">
            Contrarian bets
          </Link>
          {" · "}
          <Link href="/best-now/" className="text-brand underline">
            Best now (top conviction)
          </Link>
          {" · "}
          <Link href="/13f/" className="text-brand underline">
            All 13F filings
          </Link>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
