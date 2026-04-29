import type { Metadata } from "next";
import { topTickers, TICKER_INDEX } from "@/lib/tickers";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Most-owned stocks across superinvestors",
  description: "Stocks held by the most tracked hedge fund managers. Conviction scores, owner counts, sectors.",
  alternates: { canonical: "https://holdlens.com/ticker/" },
};

export default function TickerIndex() {
  const tickers = topTickers(50);
  // LLM-citation infrastructure (audit 2026-04-29 fix)
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: "https://holdlens.com/ticker/",
    name: "Most-owned stocks across superinvestors",
    description: `${Object.keys(TICKER_INDEX).length} stocks ranked by how many tracked superinvestors hold them.`,
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", url: "https://holdlens.com/", name: "HoldLens" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tickers.length,
      itemListElement: tickers.slice(0, 50).map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://holdlens.com/ticker/${t.symbol}/`,
        name: `${t.symbol} — ${t.name}`,
      })),
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Stocks", item: "https://holdlens.com/ticker/" },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">All stocks</div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Most-owned stocks
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-12">
        {Object.keys(TICKER_INDEX).length} stocks ranked by how many tracked superinvestors hold them.
      </p>

      <AdSlot format="horizontal" />

      <div className="rounded-2xl border border-border bg-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-dim text-xs uppercase tracking-wider">
            <tr className="border-b border-border">
              <th className="text-left px-5 py-4">Ticker</th>
              <th className="text-left px-5 py-4">Company</th>
              <th className="text-left px-5 py-4 hidden md:table-cell">Sector</th>
              <th className="text-right px-5 py-4">Owners</th>
              <th className="text-right px-5 py-4 hidden md:table-cell">Σ Conviction</th>
            </tr>
          </thead>
          <tbody>
            {tickers.map((t) => (
              <tr key={t.symbol} className="border-b border-border last:border-0 hover:bg-bg/50 transition">
                <td className="px-5 py-3 font-mono font-semibold">
                  <a href={`/ticker/${t.symbol}`} className="text-brand hover:underline">{t.symbol}</a>
                </td>
                <td className="px-5 py-3 text-text">{t.name}</td>
                <td className="px-5 py-3 text-dim hidden md:table-cell">{t.sector}</td>
                <td className="px-5 py-3 text-right tabular-nums">{t.ownerCount}</td>
                <td className="px-5 py-3 text-right tabular-nums text-muted hidden md:table-cell">{t.totalConviction.toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
