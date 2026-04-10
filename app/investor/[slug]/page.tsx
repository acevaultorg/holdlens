import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EmailCapture from "@/components/EmailCapture";
import LiveQuote from "@/components/LiveQuote";
import PortfolioValue from "@/components/PortfolioValue";
import InvestorMoves from "@/components/InvestorMoves";
import ManagerROICard from "@/components/ManagerROICard";
import { MANAGERS, getManager, type Manager } from "@/lib/managers";
import { LATEST_FILINGS, nextFilingDeadline, daysSince } from "@/lib/filings";
import { MANAGER_QUALITY } from "@/lib/signals";

// Find managers whose top 10 holdings overlap with this manager's top 10.
// Scored by count of shared tickers. Returns the top 3 related.
function relatedManagers(m: Manager): { manager: Manager; shared: number; commonTickers: string[] }[] {
  const myTickers = new Set(m.topHoldings.map((h) => h.ticker));
  return MANAGERS
    .filter((other) => other.slug !== m.slug)
    .map((other) => {
      const shared = other.topHoldings.filter((h) => myTickers.has(h.ticker));
      return { manager: other, shared: shared.length, commonTickers: shared.map((h) => h.ticker) };
    })
    .filter((r) => r.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3);
}

export async function generateStaticParams() {
  // warren-buffett has its own dedicated static page; exclude here to avoid route conflict.
  return MANAGERS.filter((m) => m.slug !== "warren-buffett").map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getManager(slug);
  if (!m) return { title: "Investor not found" };
  return {
    title: `${m.name} portfolio — ${m.fund} holdings`,
    description: `Track ${m.name}'s ${m.fund} portfolio. Top holdings, conviction analysis, and quarterly moves.`,
    openGraph: {
      title: `${m.name} · ${m.fund}`,
      description: `${m.name}'s top holdings, updated each quarter.`,
    },
  };
}

export default async function InvestorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getManager(slug);
  if (!m) notFound();

  const total = m.topHoldings.reduce((s, h) => s + h.pct, 0);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.name,
    jobTitle: m.role,
    worksFor: { "@type": "Organization", name: m.fund },
    description: m.bio,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HoldLens", item: "https://holdlens.com/" },
      { "@type": "ListItem", position: 2, name: "Investors", item: "https://holdlens.com/investor" },
      { "@type": "ListItem", position: 3, name: m.name, item: `https://holdlens.com/investor/${m.slug}` },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <a href="/investor" className="text-xs text-muted hover:text-text">← All investors</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">Investor profile</div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2">{m.name}</h1>
      <p className="text-muted text-lg">{m.fund} · {m.role} · Net worth: {m.netWorth}</p>
      <p className="mt-4 text-text leading-relaxed max-w-2xl">{m.bio}</p>
      <div className="mt-3 text-sm text-muted italic">"{m.philosophy}"</div>

      {(() => {
        const filing = LATEST_FILINGS[m.slug];
        const nextDue = nextFilingDeadline();
        if (!filing) return null;
        const d = daysSince(filing.latestDate);
        return (
          <div className="mt-6 flex items-center gap-3 flex-wrap text-xs">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-panel text-muted">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand" />
              Latest 13F: <span className="text-text font-semibold">{filing.quarter}</span>
              <span className="text-dim">({d}d ago)</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-panel text-muted">
              Next due: <span className="text-text font-semibold">{nextDue.quarter}</span>
              <span className="text-dim">by {nextDue.date}</span>
            </span>
            {filing.edgarUrl && (
              <a
                href={filing.edgarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border bg-panel text-muted hover:text-text hover:border-brand/40 transition"
              >
                View on SEC EDGAR →
              </a>
            )}
          </div>
        );
      })()}

      <div className="mt-12 grid md:grid-cols-3 gap-4">
        <Stat label="Tracked positions" value={m.topHoldings.length.toString()} />
        <Stat label="Top concentration" value={`${total.toFixed(0)}%`} />
        <Stat label="Longest holding" value={m.longestHolding} />
      </div>

      {/* Realized 10-year track record */}
      <section className="mt-8">
        <ManagerROICard slug={m.slug} />
      </section>

      <section className="mt-6">
        <PortfolioValue holdings={m.topHoldings.map((h) => ({ ticker: h.ticker, sharesMn: h.sharesMn, pct: h.pct }))} label={`${m.name.split(" ")[0]}'s portfolio value`} />
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-2xl font-bold">Recent moves</h2>
          <div className="text-xs text-dim">
            Manager quality score:{" "}
            <span className="text-brand font-semibold">{MANAGER_QUALITY[m.slug] ?? 6}/10</span>
          </div>
        </div>
        <p className="text-muted text-sm mb-6 max-w-2xl">
          Every tracked 13F move — buys, adds, trims, and exits — over the last two quarters.
        </p>
        <InvestorMoves slug={m.slug} />
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Top holdings</h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-xs uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-5 py-4">Ticker</th>
                <th className="text-left px-5 py-4">Company</th>
                <th className="text-right px-5 py-4 hidden md:table-cell">Price · Today</th>
                <th className="text-right px-5 py-4">% Portfolio</th>
                <th className="text-right px-5 py-4 hidden md:table-cell">Shares (M)</th>
              </tr>
            </thead>
            <tbody>
              {m.topHoldings.map((h) => (
                <tr key={h.ticker} className="border-b border-border last:border-0 align-top">
                  <td className="px-5 py-4 font-mono font-semibold">
                    <a href={`/ticker/${h.ticker}`} className="text-brand hover:underline">{h.ticker}</a>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-text">{h.name}</div>
                    <div className="text-dim text-xs mt-1 max-w-md">{h.thesis}</div>
                  </td>
                  <td className="px-5 py-4 text-right hidden md:table-cell">
                    <LiveQuote symbol={h.ticker} size="sm" refreshMs={0} />
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums">{h.pct.toFixed(1)}%</td>
                  <td className="px-5 py-4 text-right tabular-nums hidden md:table-cell text-muted">
                    {h.sharesMn.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-panel p-8">
        <h2 className="text-2xl font-bold mb-3">Want {m.name.split(" ")[0]} move-alerts?</h2>
        <p className="text-muted mb-6">
          One email per 13F filing. Summarizes every new position, exit, and trim.
        </p>
        <EmailCapture />
      </section>

      {(() => {
        const related = relatedManagers(m);
        if (related.length === 0) return null;
        return (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-4">Similar investors</h2>
            <p className="text-muted text-sm mb-6">
              Tracked managers whose top positions overlap with {m.name.split(" ")[0]}'s portfolio.
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              {related.map((r) => (
                <a key={r.manager.slug} href={`/investor/${r.manager.slug}`}
                   className="rounded-xl border border-border bg-panel p-4 hover:border-brand transition group">
                  <div className="font-semibold group-hover:text-brand transition">{r.manager.name}</div>
                  <div className="text-xs text-muted mt-1">{r.manager.fund}</div>
                  <div className="text-xs text-dim mt-2">
                    {r.shared} shared position{r.shared > 1 ? "s" : ""}: {r.commonTickers.join(", ")}
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })()}

      {m.slug === "warren-buffett" && (
        <section className="mt-16">
          <h3 className="text-lg font-semibold mb-3">Try the Buffett backtest</h3>
          <p className="text-muted mb-4">How much would you have made if you'd copied Buffett 15 years ago?</p>
          <a
            href="/simulate/buffett"
            className="inline-block bg-brand text-black font-semibold rounded-xl px-6 py-3 hover:opacity-90 transition"
          >
            Run the backtest →
          </a>
        </section>
      )}

      <p className="text-xs text-dim mt-16">
        Data sourced from {m.fund} 13F filings with the SEC. Approximate snapshot. Not investment advice.
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
