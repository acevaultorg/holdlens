import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import FoundersNudge from "@/components/FoundersNudge";
import BrokerCta from "@/components/BrokerCta";
import { MANAGERS } from "@/lib/managers";
import { topReplicatingETFs } from "@/lib/etf-overlap";

export const metadata: Metadata = {
  title: { absolute: "Which ETF replicates each superinvestor's portfolio? — HoldLens" },
  description: "Per-manager portfolio-overlap rankings against 12 major US ETFs. Which ETF most closely mirrors Buffett, Ackman, Druckenmiller, or 27 other tracked superinvestors? Free analysis. Cited holdings.",
  alternates: { canonical: "https://holdlens.com/etf-by-superinvestor/" },
  openGraph: {
    title: "ETF by superinvestor — which fund mirrors which manager",
    description: "30 superinvestors × 12 ETFs = 360 overlap rankings. Discover which low-cost index ETF replicates a manager's disclosed top holdings.",
    url: "https://holdlens.com/etf-by-superinvestor/",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — ETF by superinvestor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Which ETF replicates each superinvestor's portfolio?",
    images: ["/og/home.png"],
  },
};

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
    { "@type": "ListItem", position: 2, name: "ETF by superinvestor", item: "https://holdlens.com/etf-by-superinvestor/" },
  ],
};

const COLLECTION_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "ETF by superinvestor",
  description: "Per-manager rankings of major US ETFs by portfolio-overlap with each superinvestor's disclosed top holdings.",
  url: "https://holdlens.com/etf-by-superinvestor/",
  inLanguage: "en-US",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: MANAGERS.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://holdlens.com/etf-by-superinvestor/${m.slug}/`,
      name: `Which ETF replicates ${m.name}'s portfolio?`,
    })),
  },
};

export default function ETFBySuperinvestorHub() {
  // For each manager, find their #1 ETF match (or null if zero overlap).
  const rows = MANAGERS.map((m) => {
    const top = topReplicatingETFs(m, 1);
    return { manager: m, topMatch: top[0] };
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COLLECTION_LD) }} />

      <a href="/" className="text-xs text-muted hover:text-text">← HoldLens</a>

      <header className="mt-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
          ETF by superinvestor
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Which ETF replicates each superinvestor&apos;s portfolio?
        </h1>
        <p className="text-muted text-lg mt-4 leading-relaxed">
          For every tracked manager, we score 12 major US ETFs by portfolio-overlap with their disclosed top-10 holdings. The score weights each shared ticker by both the manager&apos;s position size and the ETF&apos;s holding weight — a ticker held heavily by both contributes much more than one held marginally by either. Click through to a manager for the full ranked list and per-ticker breakdown.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Closest ETF match per manager</h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-[10px] uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold">Manager</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Fund</th>
                <th className="text-left px-4 py-3 font-semibold">Closest ETF</th>
                <th className="text-right px-4 py-3 font-semibold">Score</th>
              </tr>
            </thead>
            <tbody>
              {rows
                .sort((a, b) => (b.topMatch?.score ?? 0) - (a.topMatch?.score ?? 0))
                .map(({ manager, topMatch }) => (
                  <tr
                    key={manager.slug}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/etf-by-superinvestor/${manager.slug}/`}
                        className="font-semibold text-text hover:text-brand"
                      >
                        {manager.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs hidden md:table-cell">{manager.fund}</td>
                    <td className="px-4 py-3 text-text">
                      {topMatch ? (
                        <span className="font-mono">{topMatch.etf.ticker}</span>
                      ) : (
                        <span className="text-dim italic">none in top-10</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-400 tabular-nums">
                      {topMatch ? topMatch.score.toFixed(1) : "—"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Why this is approximate</h2>
        <div className="rounded-xl border border-border bg-panel p-5 text-sm text-muted leading-relaxed space-y-3">
          <p>
            Managers disclose ~10-50 positions in 13F filings, and HoldLens tracks each manager&apos;s top-10. ETFs hold hundreds of positions; HoldLens tracks each ETF&apos;s top-10 disclosed weights. So this overlap-score reads <em>tip-of-the-iceberg vs tip-of-the-iceberg</em> — useful for the most-conviction positions, weak for tail exposure.
          </p>
          <p>
            A high score means the manager&apos;s biggest names are also the ETF&apos;s biggest names. A low score means the manager has either (a) ran very different concentrated positions or (b) holds tickers outside the ETF&apos;s top-10. Either way, the score does not predict tracking error against the ETF; it measures top-10 holdings overlap as a quote-ready signal.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Related</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <a href="/etf/" className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition block">
            <div className="text-brand text-xs uppercase tracking-widest font-bold mb-1">All ETFs</div>
            <div className="font-semibold text-text">12 tracked ETFs with top-10 holdings + weights</div>
            <div className="text-xs text-muted mt-1">VOO, VTI, SPY, QQQ, IWM, SCHD, VYM, XLK, XLF, XLE, ARKK, JEPI.</div>
          </a>
          <a href="/managers-by-style/" className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition block">
            <div className="text-brand text-xs uppercase tracking-widest font-bold mb-1">Managers by style</div>
            <div className="font-semibold text-text">Investing styles: value, growth, activist, macro, long-short</div>
            <div className="text-xs text-muted mt-1">30 managers grouped by their dominant style.</div>
          </a>
        </div>
      </section>

      <FoundersNudge tone="brand" context="You're seeing which ETFs match each tracked manager's style — Buffett-clone, Burry-clone, etc." />
      <BrokerCta context="Replicating a superinvestor via ETFs? Open a brokerage account." />
      <AdSlot format="horizontal" />

      <p className="mt-16 text-xs text-dim">
        Educational analysis based on disclosed top-10 holdings. Not a recommendation to buy any ETF or stock. Holdings change quarterly (managers) or daily (ETFs); scores reflect snapshots.
      </p>
    </div>
  );
}
