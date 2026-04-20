import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import TickerLogo from "@/components/TickerLogo";
import {
  recentAuthorizations,
  formatBuybackAmount,
} from "@/lib/buybacks";

export const metadata: Metadata = {
  title: "Largest buyback authorizations — newly announced S&P share repurchase programs",
  description:
    "Board-approved share-repurchase authorizations ranked by size and recency. Forward-looking view of which companies have the most capital earmarked for buybacks.",
  alternates: { canonical: "https://holdlens.com/buybacks/largest-authorizations" },
  openGraph: {
    title: "HoldLens — Largest Buyback Authorizations",
    description:
      "Board-approved buyback programs by size and announcement date. SEC 8-K-sourced, updated as filings appear.",
    url: "https://holdlens.com/buybacks/largest-authorizations",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens largest buyback authorizations" }],
  },
  robots: { index: true, follow: true },
};

export default function LargestAuthorizationsPage() {
  const byDate = recentAuthorizations();
  const bySize = [...byDate]
    .filter((p) => p.authorizationSize != null)
    .sort((a, b) => (b.authorizationSize ?? 0) - (a.authorizationSize ?? 0));

  const pageUrl = "https://holdlens.com/buybacks/largest-authorizations";
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Largest buyback authorizations — newly announced S&P share repurchase programs",
    description: "Board-approved share-repurchase programs ranked by size and recency.",
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
      { "@type": "ListItem", position: 3, name: "Authorizations", item: pageUrl },
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
        Forward-looking · Board authorizations
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Largest buyback authorizations.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-8">
        Authorizations are board-approved dollar limits on how much stock a
        company can repurchase before needing a new approval. They&rsquo;re
        announced via SEC Form 8-K. Authorization ≠ execution &mdash; a $100B
        program may take years to complete or be paused on valuation grounds.
        But big authorizations signal management&rsquo;s stance on capital
        return.
      </p>

      <section className="mb-14">
        <div className="text-[11px] uppercase tracking-widest font-bold text-emerald-400 mb-1">
          Ranked by size
        </div>
        <h2 className="text-2xl font-bold mb-5">Largest active authorizations</h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-right">Authorization</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Est. remaining</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Approved</th>
              </tr>
            </thead>
            <tbody>
              {bySize.map((p, i) => (
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
                  <td className="px-4 py-3 text-right tabular-nums font-bold">
                    {formatBuybackAmount(p.authorizationSize ?? 0)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums hidden sm:table-cell">
                    {p.authRemainingEstimate
                      ? formatBuybackAmount(p.authRemainingEstimate)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums hidden md:table-cell text-[11px]">
                    {p.authDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AdSlot format="horizontal" />

      <section className="my-14">
        <div className="text-[11px] uppercase tracking-widest font-bold text-brand mb-1">
          Ranked by date
        </div>
        <h2 className="text-2xl font-bold mb-5">Newest authorizations</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {byDate.map((p) => (
            <a
              key={p.ticker}
              href={`/buybacks/${p.ticker}/`}
              className="block rounded-2xl border border-border bg-panel p-5 hover:border-brand/40 transition"
            >
              <div className="flex items-center gap-2 mb-3">
                <TickerLogo symbol={p.ticker} size={24} />
                <div className="font-mono font-bold text-brand">{p.ticker}</div>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-dim mb-1">
                Authorization
              </div>
              <div className="text-2xl font-bold tabular-nums mb-1">
                {p.authorizationSize ? formatBuybackAmount(p.authorizationSize) : "—"}
              </div>
              <div className="text-xs text-muted">Approved {p.authDate}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-10 text-sm text-dim leading-relaxed max-w-2xl">
        Authorization data from each company&rsquo;s most recent 8-K. Remaining
        estimates are approximate (companies don&rsquo;t report program
        drawdown on a fixed cadence). Cross-reference with the{" "}
        <a href="/learn/how-to-read-buyback-disclosures" className="text-brand hover:underline">
          buyback methodology guide
        </a>
        .
      </section>
    </div>
  );
}
