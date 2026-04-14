import type { Metadata } from "next";
import Link from "next/link";
import {
  INSIDER_TX,
  fmtInsiderValue,
  fmtInsiderDate,
  type InsiderTx,
} from "@/lib/insiders";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Insider Activity — Recent CEO/CFO Buys & Sells",
  description:
    "Hand-curated SEC Form 4 insider transactions from CEOs, CFOs, and directors across major tickers. Open-market insider buys are one of the strongest single equity signals — see who's backing their own company with real money.",
  alternates: { canonical: "https://holdlens.com/insiders/" },
  openGraph: {
    title: "Insider Activity — CEO/CFO Buys & Sells",
    description:
      "Curated Form 4 insider transactions. Buys are rare and bullish — see which CEOs are backing their own companies with real money.",
    url: "https://holdlens.com/insiders/",
    type: "website",
  },
};

// Force static — this page is hand-curated data, no runtime fetching.
export const dynamic = "force-static";

function sortByDateDesc(a: InsiderTx, b: InsiderTx): number {
  return a.date < b.date ? 1 : -1;
}

// A sell is "notable" (i.e. not a routine 10b5-1 schedule) if its note
// doesn't contain 10b5-1 language. Discretionary sells carry more signal.
function isDiscretionarySell(tx: InsiderTx): boolean {
  const note = (tx.note || "").toLowerCase();
  return !note.includes("10b5-1");
}

export default function InsidersPage() {
  const buys: InsiderTx[] = INSIDER_TX.filter((tx) => tx.action === "buy").sort(sortByDateDesc);
  const sells: InsiderTx[] = INSIDER_TX.filter((tx) => tx.action === "sell").sort(sortByDateDesc);

  const totalBuyValue = buys.reduce((sum, tx) => sum + tx.value, 0);
  const totalSellValue = sells.reduce((sum, tx) => sum + tx.value, 0);
  const discretionarySellValue = sells
    .filter(isDiscretionarySell)
    .reduce((sum, tx) => sum + tx.value, 0);
  const netBuyValue = totalBuyValue - discretionarySellValue;
  const uniqueBuyTickers = new Set(buys.map((tx) => tx.ticker)).size;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "HoldLens Insider Activity",
    description:
      "Hand-curated SEC Form 4 insider transactions across major tickers.",
    url: "https://holdlens.com/insiders/",
    creator: {
      "@type": "Organization",
      name: "HoldLens",
      url: "https://holdlens.com",
    },
    license: "https://holdlens.com/about/",
    variableMeasured: [
      { "@type": "PropertyValue", name: "Insider name" },
      { "@type": "PropertyValue", name: "Title" },
      { "@type": "PropertyValue", name: "Action (buy/sell)" },
      { "@type": "PropertyValue", name: "Share count" },
      { "@type": "PropertyValue", name: "Price per share" },
      { "@type": "PropertyValue", name: "Total value" },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Insider Activity
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Who&apos;s buying. Who&apos;s selling.
      </h1>
      <p className="text-muted text-lg leading-relaxed mb-4 max-w-2xl">
        Hand-curated SEC Form 4 transactions from CEOs, CFOs, and directors at major public
        companies. <strong className="text-text">Open-market insider buys are one of the
        strongest single signals in public equity markets</strong> — insiders have the most
        information and are legally barred from trading on it, so when they buy with their
        own money, they&apos;re putting conviction behind the price.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-12">
        Most sells are 10b5-1 scheduled plans (pre-committed months in advance to avoid
        insider-trading liability) and carry far less signal than buys. This dataset folds
        directly into the per-ticker{" "}
        <Link href="/signal/" className="underline hover:text-text">
          ConvictionScore
        </Link>{" "}
        via the insider-activity layer.
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5">
          <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-1">
            Insider buys
          </div>
          <div className="text-3xl font-bold text-text tabular-nums">{buys.length}</div>
          <div className="text-xs text-dim mt-1">{fmtInsiderValue(totalBuyValue)} total</div>
        </div>
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/5 p-5">
          <div className="text-[10px] uppercase tracking-widest text-rose-400 font-bold mb-1">
            Insider sells
          </div>
          <div className="text-3xl font-bold text-text tabular-nums">{sells.length}</div>
          <div className="text-xs text-dim mt-1">{fmtInsiderValue(totalSellValue)} total</div>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-[10px] uppercase tracking-widest text-brand font-bold mb-1">
            Net insider flow
          </div>
          <div
            className={`text-3xl font-bold tabular-nums ${
              netBuyValue >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {netBuyValue >= 0 ? "+" : "−"}
            {fmtInsiderValue(Math.abs(netBuyValue))}
          </div>
          <div className="text-xs text-dim mt-1">buys − discretionary sells</div>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">
            Tickers with buys
          </div>
          <div className="text-3xl font-bold text-text tabular-nums">{uniqueBuyTickers}</div>
          <div className="text-xs text-dim mt-1">unique companies</div>
        </div>
      </div>

      {/* Buys table */}
      <section className="mb-16">
        <div className="flex items-baseline gap-3 mb-4 flex-wrap">
          <h2 className="text-2xl md:text-3xl font-bold text-text">
            <span className="text-emerald-400">Insider buys</span> — the signal
          </h2>
          <span className="text-sm text-muted">{buys.length} transactions</span>
        </div>
        <p className="text-muted text-sm mb-6 leading-relaxed max-w-2xl">
          Open-market CEO/CFO buys historically outperform the market. An insider who buys
          with their own money is signaling they expect the stock to rise more than any
          schedule would predict.
        </p>

        {buys.length === 0 ? (
          <div className="rounded-2xl border border-border bg-panel p-10 text-center text-muted">
            No tracked insider buys in the current dataset.
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-dim text-[10px] uppercase tracking-wider">
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 font-semibold">Ticker</th>
                    <th className="text-left px-5 py-3 font-semibold">Insider</th>
                    <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">
                      Title
                    </th>
                    <th className="text-right px-5 py-3 font-semibold">Value</th>
                    <th className="text-right px-5 py-3 font-semibold hidden sm:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {buys.map((tx, i) => (
                    <tr
                      key={`buy-${tx.ticker}-${tx.date}-${i}`}
                      className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/signal/${tx.ticker}/`}
                          className="font-mono font-bold text-brand hover:underline"
                        >
                          {tx.ticker}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-text">{tx.insiderName}</td>
                      <td className="px-5 py-3 text-muted text-xs hidden md:table-cell">
                        {tx.insiderTitle}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-semibold text-emerald-400 tabular-nums">
                        {fmtInsiderValue(tx.value)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-[11px] text-dim whitespace-nowrap hidden sm:table-cell">
                        {fmtInsiderDate(tx.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notable buys with notes */}
        {buys.some((tx) => tx.note) && (
          <div className="mt-8 space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-dim font-semibold">
              Notable with context
            </h3>
            {buys
              .filter((tx) => tx.note)
              .map((tx, i) => (
                <div
                  key={`buy-note-${tx.ticker}-${i}`}
                  className="border-l-2 border-emerald-400/50 pl-4 py-1"
                >
                  <div className="text-sm text-text">
                    <Link
                      href={`/signal/${tx.ticker}/`}
                      className="font-mono font-bold text-brand hover:underline"
                    >
                      {tx.ticker}
                    </Link>{" "}
                    — {tx.insiderName}{" "}
                    <span className="text-dim">({tx.insiderTitle})</span>
                  </div>
                  <div className="text-sm text-muted mt-1">{tx.note}</div>
                </div>
              ))}
          </div>
        )}
      </section>

      <AdSlot format="horizontal" />

      {/* Sells table */}
      <section className="mb-16">
        <div className="flex items-baseline gap-3 mb-4 flex-wrap">
          <h2 className="text-2xl md:text-3xl font-bold text-text">Insider sells</h2>
          <span className="text-sm text-muted">{sells.length} transactions</span>
        </div>
        <p className="text-muted text-sm mb-6 leading-relaxed max-w-2xl">
          Most sells are 10b5-1 scheduled plans — pre-committed months in advance to avoid
          insider-trading liability. These say little about short-term outlook. Watch for
          unscheduled or unusually large sells.
        </p>

        {sells.length === 0 ? (
          <div className="rounded-2xl border border-border bg-panel p-10 text-center text-muted">
            No tracked insider sells in the current dataset.
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-dim text-[10px] uppercase tracking-wider">
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 font-semibold">Ticker</th>
                    <th className="text-left px-5 py-3 font-semibold">Insider</th>
                    <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">
                      Title
                    </th>
                    <th className="text-right px-5 py-3 font-semibold">Value</th>
                    <th className="text-right px-5 py-3 font-semibold hidden sm:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sells.map((tx, i) => {
                    const scheduled = !isDiscretionarySell(tx);
                    return (
                      <tr
                        key={`sell-${tx.ticker}-${tx.date}-${i}`}
                        className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                      >
                        <td className="px-5 py-3">
                          <Link
                            href={`/signal/${tx.ticker}/`}
                            className="font-mono font-bold text-brand hover:underline"
                          >
                            {tx.ticker}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-text">{tx.insiderName}</td>
                        <td className="px-5 py-3 text-muted text-xs hidden md:table-cell">
                          {tx.insiderTitle}
                          {scheduled && (
                            <span className="ml-1 text-[9px] uppercase tracking-wider text-dim">
                              · 10b5-1
                            </span>
                          )}
                        </td>
                        <td
                          className={`px-5 py-3 text-right font-mono tabular-nums ${
                            scheduled ? "text-dim" : "text-rose-400 font-semibold"
                          }`}
                        >
                          {fmtInsiderValue(tx.value)}
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-[11px] text-dim whitespace-nowrap hidden sm:table-cell">
                          {fmtInsiderDate(tx.date)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Explainer */}
      <section className="border-t border-border pt-12 mb-12">
        <h2 className="text-xl font-bold text-text mb-4">Why we track insider activity</h2>
        <div className="space-y-4 text-muted text-sm leading-relaxed max-w-2xl">
          <p>
            Every insider transaction at a US public company must be reported to the SEC on{" "}
            <strong className="text-text">Form 4</strong> within two business days. The
            filings are public. We curate the most notable — large dollar amounts, CEO/CFO
            purchases, deviations from 10b5-1 plans — rather than every routine disclosure.
          </p>
          <p>
            <strong className="text-text">Signal beats noise.</strong> A CEO putting fresh
            capital into their own stock is worth more than a dozen routine option exercises.
            We&apos;ll be replacing this curated dataset with a full Form 4 EDGAR scraper
            in v0.2.
          </p>
          <p>
            This feeds directly into the HoldLens{" "}
            <Link href="/learn/conviction-score-explained/" className="underline hover:text-text">
              unified ConvictionScore
            </Link>{" "}
            — the insider layer is one of six positive signal layers in the model.
            Not investment advice. See our{" "}
            <Link href="/learn/copy-trading-myth/" className="underline hover:text-text">
              copy-trading myth explainer
            </Link>{" "}
            before acting on any single indicator.
          </p>
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-border pt-12">
        <h2 className="text-xl font-bold text-text mb-6">Related</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/buys/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-emerald-400/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Top buy signals</div>
            <div className="text-xs text-muted">
              Stocks with the strongest unified ConvictionScore — insider activity
              contributes to the score.
            </div>
          </Link>
          <Link
            href="/best-now/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">Best now</div>
            <div className="text-xs text-muted">
              Highest-conviction ideas across all tracked managers, with the insider layer
              folded into the model.
            </div>
          </Link>
          <Link
            href="/learn/conviction-score-explained/"
            className="rounded-xl border border-border bg-panel p-5 hover:border-brand/40 transition block"
          >
            <div className="text-sm font-semibold text-text mb-1">
              How the score works
            </div>
            <div className="text-xs text-muted">
              Full breakdown of the six-layer signal model — including why insider buys
              are the strongest single equity signal.
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
