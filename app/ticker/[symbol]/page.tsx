import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EmailCapture from "@/components/EmailCapture";
import LiveQuote from "@/components/LiveQuote";
import LiveChart from "@/components/LiveChart";
import StarButton from "@/components/StarButton";
import { TICKER_INDEX, getTicker } from "@/lib/tickers";

export async function generateStaticParams() {
  return Object.keys(TICKER_INDEX).map((symbol) => ({ symbol }));
}

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
  const { symbol } = await params;
  const t = getTicker(symbol);
  if (!t) return { title: "Ticker not found" };
  return {
    title: `Who owns ${t.symbol}? ${t.ownerCount} hedge funds hold ${t.name}`,
    description: `${t.ownerCount} tracked superinvestors hold ${t.symbol}. See exact positions, % of portfolio, and conviction scores.`,
    openGraph: {
      title: `${t.symbol} · Hedge fund ownership`,
      description: `${t.ownerCount} superinvestors hold ${t.name}. See full ownership.`,
    },
  };
}

export default async function TickerPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const t = getTicker(symbol);
  if (!t) notFound();

  const ld = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: t.name,
    tickerSymbol: t.symbol,
    description: `${t.name} (${t.symbol}) is held by ${t.ownerCount} tracked superinvestors.`,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Stocks", item: "https://holdlens.com/ticker" },
      { "@type": "ListItem", position: 3, name: t.symbol, item: `https://holdlens.com/ticker/${t.symbol}` },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <a href="/ticker" className="text-xs text-muted hover:text-text">← All tickers</a>

      <div className="mt-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">Stock ownership · Live</div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="text-brand">{t.symbol}</span>
          </h1>
          <p className="text-muted text-lg mt-2">{t.name} · {t.sector}</p>
        </div>
        <StarButton symbol={t.symbol} />
      </div>

      {/* Live quote block */}
      <section className="mt-8">
        <LiveQuote symbol={t.symbol} size="xl" />
      </section>

      {/* Live price chart */}
      <section className="mt-8">
        <LiveChart symbol={t.symbol} defaultRange="1y" />
      </section>

      <div className="mt-12 grid md:grid-cols-3 gap-4">
        <Stat label="Tracked owners" value={t.ownerCount.toString()} />
        <Stat label="Sum of conviction" value={`${t.totalConviction.toFixed(0)}%`} />
        <Stat label="Sector" value={t.sector || "Other"} />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-2">Hedge funds holding {t.symbol}</h2>
        <p className="text-muted text-sm mb-6">
          {t.ownerCount} superinvestor{t.ownerCount > 1 ? "s" : ""} hold {t.name} as a top position. Sorted by % of portfolio.
        </p>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-xs uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-5 py-4">Manager</th>
                <th className="text-right px-5 py-4">% Portfolio</th>
              </tr>
            </thead>
            <tbody>
              {[...t.owners].sort((a, b) => b.pct - a.pct).map((o) => (
                <tr key={o.slug} className="border-b border-border last:border-0 align-top">
                  <td className="px-5 py-4">
                    <a href={`/investor/${o.slug}`} className="text-text hover:text-brand transition font-semibold">
                      {o.manager}
                    </a>
                    <div className="text-dim text-xs mt-1 max-w-md">{o.thesis}</div>
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-brand font-semibold">{o.pct.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-panel p-8">
        <h2 className="text-2xl font-bold mb-3">Get alerts when they buy or sell {t.symbol}</h2>
        <p className="text-muted mb-6">
          One email per 13F filing — you'll know within hours if any tracked manager moves on {t.symbol}.
        </p>
        <EmailCapture />
      </section>

      <p className="text-xs text-dim mt-16">
        Data sourced from SEC 13F filings. {t.symbol} ownership reflects publicly disclosed long positions only.
        Not investment advice.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-panel px-5 py-4">
      <div className="text-xs uppercase tracking-wider text-dim">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}
