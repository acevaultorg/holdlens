import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import TickerLogo from "@/components/TickerLogo";
import {
  topBuybackYields,
  formatBuybackAmount,
} from "@/lib/buybacks";

export const metadata: Metadata = {
  title: "Buyback yield leaderboard — highest share-repurchase yields in the S&P 500",
  description:
    "Companies returning the highest percentage of market cap via share repurchases. Buyback yield = trailing-12-month repurchases ÷ current market cap. SEC-sourced, ranked.",
  alternates: { canonical: "https://holdlens.com/buybacks/yield" },
  openGraph: {
    title: "HoldLens Buyback Yield Leaderboard",
    description:
      "The most aggressive capital-return programs ranked by yield, not headline dollar volume.",
    url: "https://holdlens.com/buybacks/yield",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens buyback yield leaderboard" }],
  },
  robots: { index: true, follow: true },
};

export default function BuybackYieldPage() {
  const ranked = topBuybackYields();
  const pageUrl = "https://holdlens.com/buybacks/yield";
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Buyback yield leaderboard — highest share-repurchase yields in the S&P 500",
    description: "Ranked list of public companies by buyback yield, SEC-sourced.",
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    url: pageUrl,
    author: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com" },
    publisher: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com",
      logo: { "@type": "ImageObject", url: "https://holdlens.com/logo.png" },
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://holdlens.com" },
      { "@type": "ListItem", position: 2, name: "Buybacks", item: "https://holdlens.com/buybacks" },
      { "@type": "ListItem", position: 3, name: "Yield", item: pageUrl },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <a href="/buybacks" className="text-xs text-muted hover:text-text">
        ← All buybacks
      </a>

      <div className="mt-3 text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Buyback yield · Ranked
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Highest buyback yields.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-8">
        Buyback yield = trailing-12-month share-repurchase dollars divided by
        current market cap. Unlike headline dollar volume (which favors the
        biggest companies), yield normalizes — it tells you how aggressively a
        company is returning capital relative to its own size.
      </p>

      <aside
        className="mt-2 mb-10 rounded-card border border-insight/30 bg-surface-insight p-4"
        aria-label="HoldLens read on buyback yield"
      >
        <div className="text-[10px] uppercase tracking-widest text-insight font-bold mb-1.5">
          HoldLens read
        </div>
        <p className="text-sm text-text leading-relaxed">
          Financials dominate this list &mdash; post-Fed-CCAR capital-return
          approvals drive multi-year highs in buyback yield for the largest US
          banks. Energy majors follow (Chevron, ExxonMobil), reflecting
          post-2022 cash-flow windfalls. Tech giants have large dollar volume
          but middling yield because their market caps have scaled with the
          programs.
        </p>
      </aside>

      <div className="rounded-2xl border border-border bg-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg/40 border-b border-border">
            <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Ticker</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Sector</th>
              <th className="px-4 py-3 text-right">Yield</th>
              <th className="px-4 py-3 text-right hidden sm:table-cell">FY repurchased</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((p, i) => (
              <tr
                key={p.ticker}
                className="border-b border-border last:border-0 hover:bg-bg/30 transition"
              >
                <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                <td className="px-4 py-3">
                  <a
                    href={`/buybacks/${p.ticker}/`}
                    className="inline-flex items-center gap-2 font-mono font-bold text-brand hover:underline"
                  >
                    <TickerLogo symbol={p.ticker} size={20} />
                    {p.ticker}
                  </a>
                  <div className="text-[11px] text-dim">{p.companyName}</div>
                </td>
                <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
                  {p.sector}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-bold text-emerald-400">
                  {p.buybackYieldPct}%
                </td>
                <td className="px-4 py-3 text-right tabular-nums hidden sm:table-cell">
                  {formatBuybackAmount(p.latestFyRepurchased)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdSlot format="horizontal" />

      <section className="mt-10 text-sm text-dim leading-relaxed max-w-2xl">
        High yield is not automatically bullish. A buyback yield spiking because
        the market cap cratered tells a different story than one rising because
        the board announced a larger program. Always cross-reference against
        total-return performance and the authorization trajectory on the{" "}
        <a href="/buybacks" className="text-brand hover:underline">
          main tracker
        </a>
        .
      </section>
    </div>
  );
}
