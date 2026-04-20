import { etfsHoldingTicker, formatAum } from "@/lib/etfs";

// Server component — conditionally renders an "ETFs holding this stock"
// card on a ticker page when any tracked ETF holds the ticker. Returns
// null when none do. Mirrors BuybackSummary / ShortInterestSummary /
// ActivistSummary / CongressSummary pattern. Zero client JS.

export default function EtfSummary({ symbol }: { symbol: string }) {
  const holders = etfsHoldingTicker(symbol);
  if (holders.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-2">ETF holders</h2>
      <p className="text-muted text-sm mb-6">
        Tracked US ETFs with {symbol} in their top-10 holdings.
      </p>
      <div className="rounded-2xl border border-border bg-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg/40 border-b border-border">
            <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
              <th className="px-4 py-3 text-left">ETF</th>
              <th className="px-4 py-3 text-right">% Fund</th>
              <th className="px-4 py-3 text-right hidden sm:table-cell">AUM</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Category</th>
            </tr>
          </thead>
          <tbody>
            {holders.map(({ etf, weight }) => (
              <tr
                key={etf.ticker}
                className="border-b border-border last:border-0 hover:bg-bg/30 transition"
              >
                <td className="px-4 py-3">
                  <a
                    href={`/etf/${etf.ticker}/`}
                    className="font-mono font-bold text-brand hover:underline"
                  >
                    {etf.ticker}
                  </a>
                  <div className="text-[11px] text-dim">{etf.name}</div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold">
                  {weight.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-right tabular-nums hidden sm:table-cell text-xs text-muted">
                  {formatAum(etf.aumUsd)}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-xs text-muted">
                  {etf.category}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
