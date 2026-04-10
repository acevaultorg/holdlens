import type { Metadata } from "next";
import EmailCapture from "@/components/EmailCapture";
import LiveQuote from "@/components/LiveQuote";
import PortfolioValue from "@/components/PortfolioValue";
import InvestorMoves from "@/components/InvestorMoves";
import { BUFFETT_TOP } from "@/lib/holdings";
import { LATEST_FILINGS, nextFilingDeadline, daysSince } from "@/lib/filings";

export const metadata: Metadata = {
  title: "Warren Buffett portfolio — what Berkshire Hathaway holds",
  description:
    "Live tracker of Warren Buffett's Berkshire Hathaway portfolio. Top holdings, conviction analysis, and quarterly moves.",
};

export default function BuffettPage() {
  const total = BUFFETT_TOP.reduce((s, h) => s + h.pctPortfolio, 0);
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Investor profile
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2">Warren Buffett</h1>
      <p className="text-muted text-lg">Berkshire Hathaway · CEO since 1970 · Net worth: ~$140B</p>

      {(() => {
        const filing = LATEST_FILINGS["warren-buffett"];
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
        <Stat label="Tracked positions" value={BUFFETT_TOP.length.toString()} />
        <Stat label="Top 10 concentration" value={`${total.toFixed(0)}%`} />
        <Stat label="Longest holding" value="Coca-Cola (37yr)" />
      </div>

      <section className="mt-8">
        <PortfolioValue
          holdings={BUFFETT_TOP.map((h) => ({ ticker: h.ticker, sharesMn: h.sharesMn, pct: h.pctPortfolio }))}
          label="Buffett's portfolio value"
        />
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Recent moves</h2>
        <p className="text-muted text-sm mb-6 max-w-2xl">
          Every tracked Berkshire 13F move — buys, adds, trims, and exits — over the last two quarters.
        </p>
        <InvestorMoves slug="warren-buffett" />
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
              {BUFFETT_TOP.map((h) => (
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
                  <td className="px-5 py-4 text-right tabular-nums">{h.pctPortfolio.toFixed(1)}%</td>
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
        <h2 className="text-2xl font-bold mb-3">Want Buffett move-alerts?</h2>
        <p className="text-muted mb-6">
          One email per 13F. Summarizes every new position, every exit, every trim, and what it might mean.
        </p>
        <EmailCapture />
      </section>

      <section className="mt-16">
        <h3 className="text-lg font-semibold mb-3">Try the backtest</h3>
        <p className="text-muted mb-4">
          How much would you have made if you'd copied Buffett 15 years ago?
        </p>
        <a
          href="/simulate/buffett"
          className="inline-block bg-brand text-black font-semibold rounded-xl px-6 py-3 hover:opacity-90 transition"
        >
          Run the Buffett backtest →
        </a>
      </section>

      <p className="text-xs text-dim mt-16">
        Data sourced from Berkshire Hathaway 13F filings with the SEC. Approximate snapshot; updated after each
        quarterly filing. Not investment advice.
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
