"use client";
import { useEffect, useMemo, useState } from "react";
import { getQuotes, fmtPrice, fmtPct, fmtMarketCap, type LiveQuote as LiveQuoteData } from "@/lib/live";
import { addHolding, removeHolding, getProfile, subscribeProfile, type Holding } from "@/lib/profile";

type Totals = {
  totalValue: number;
  totalCost: number;
  unrealizedPnL: number;
  unrealizedPct: number;
  todayPnL: number;
  todayPct: number;
};

export default function PortfolioManager() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [quotes, setQuotes] = useState<Record<string, LiveQuoteData | null>>({});
  const [mounted, setMounted] = useState(false);

  // Add-form state
  const [newTicker, setNewTicker] = useState("");
  const [newShares, setNewShares] = useState("");
  const [newCost, setNewCost] = useState("");

  useEffect(() => {
    setMounted(true);
    setHoldings(getProfile().holdings);
    return subscribeProfile((p) => setHoldings(p.holdings));
  }, []);

  useEffect(() => {
    if (holdings.length === 0) return;
    let cancelled = false;
    async function load() {
      const symbols = holdings.map((h) => h.ticker);
      const q = await getQuotes(symbols, "1mo");
      if (!cancelled) setQuotes(q);
    }
    load();
    const id = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [holdings.map((h) => h.ticker).join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const totals = useMemo<Totals | null>(() => {
    if (holdings.length === 0) return null;
    let totalValue = 0;
    let totalCost = 0;
    let prevValue = 0;
    let valueWithCostKnown = 0;
    for (const h of holdings) {
      const q = quotes[h.ticker.toUpperCase()];
      if (!q) continue;
      const v = q.price * h.shares;
      totalValue += v;
      prevValue += q.prevClose * h.shares;
      if (h.costBasis != null && h.costBasis > 0) {
        totalCost += h.costBasis;
        valueWithCostKnown += v;
      }
    }
    return {
      totalValue,
      totalCost,
      unrealizedPnL: valueWithCostKnown - totalCost,
      unrealizedPct: totalCost > 0 ? ((valueWithCostKnown - totalCost) / totalCost) * 100 : 0,
      todayPnL: totalValue - prevValue,
      todayPct: prevValue > 0 ? ((totalValue - prevValue) / prevValue) * 100 : 0,
    };
  }, [holdings, quotes]);

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    const ticker = newTicker.trim().toUpperCase();
    const shares = parseFloat(newShares);
    const cost = newCost ? parseFloat(newCost) : undefined;
    if (!ticker || !Number.isFinite(shares) || shares <= 0) return;
    addHolding({
      ticker,
      shares,
      costBasis: cost && Number.isFinite(cost) ? cost : undefined,
      addedAt: new Date().toISOString(),
    });
    setNewTicker("");
    setNewShares("");
    setNewCost("");
  }

  if (!mounted) {
    return <div className="rounded-2xl border border-border bg-panel h-64 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      {/* Totals */}
      {totals && (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                Total value · live
              </div>
              <div className="text-3xl font-bold tabular-nums mt-1">
                {fmtMarketCap(totals.totalValue)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                Today's P&amp;L
              </div>
              <div
                className={`text-3xl font-bold tabular-nums mt-1 ${
                  totals.todayPnL >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {totals.todayPnL >= 0 ? "+" : ""}
                {fmtMarketCap(totals.todayPnL)}
              </div>
              <div className={`text-xs mt-0.5 ${totals.todayPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {fmtPct(totals.todayPct)}
              </div>
            </div>
            {totals.totalCost > 0 && (
              <>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                    Cost basis
                  </div>
                  <div className="text-2xl font-bold tabular-nums mt-1 text-text">
                    {fmtMarketCap(totals.totalCost)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                    Unrealized P&amp;L
                  </div>
                  <div
                    className={`text-2xl font-bold tabular-nums mt-1 ${
                      totals.unrealizedPnL >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {totals.unrealizedPnL >= 0 ? "+" : ""}
                    {fmtMarketCap(totals.unrealizedPnL)}
                  </div>
                  <div className={`text-xs mt-0.5 ${totals.unrealizedPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {fmtPct(totals.unrealizedPct)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add holding form */}
      <form onSubmit={onAdd} className="rounded-2xl border border-border bg-panel p-5">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Add a holding
        </div>
        <div className="grid sm:grid-cols-4 gap-3">
          <input
            type="text"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
            placeholder="Ticker (e.g. AAPL)"
            className="bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-brand outline-none uppercase font-mono"
            required
            maxLength={10}
          />
          <input
            type="number"
            value={newShares}
            onChange={(e) => setNewShares(e.target.value)}
            placeholder="Shares"
            step="any"
            min="0"
            className="bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-brand outline-none tabular-nums"
            required
          />
          <input
            type="number"
            value={newCost}
            onChange={(e) => setNewCost(e.target.value)}
            placeholder="Cost basis $ (optional)"
            step="any"
            min="0"
            className="bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-brand outline-none tabular-nums"
          />
          <button
            type="submit"
            className="bg-brand text-black font-semibold rounded-lg px-4 py-2 hover:opacity-90 transition text-sm"
          >
            Add holding
          </button>
        </div>
        <p className="text-[11px] text-dim mt-3">
          Stored on this device only. Nothing leaves your browser. We never see your holdings.
        </p>
      </form>

      {/* Holdings list */}
      {holdings.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center">
          <div className="text-2xl font-bold mb-2">Your portfolio is empty</div>
          <p className="text-muted max-w-md mx-auto mb-6 text-sm">
            Add a holding above to see live valuation, day P&amp;L, and how your stocks rank against
            what the best portfolio managers in the world are doing.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-dim text-[10px] uppercase tracking-wider">
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3">Ticker</th>
                <th className="text-right px-5 py-3">Shares</th>
                <th className="text-right px-5 py-3 hidden md:table-cell">Price · Today</th>
                <th className="text-right px-5 py-3">Value</th>
                <th className="text-right px-5 py-3 hidden md:table-cell">Unrealized</th>
                <th className="text-right px-5 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const q = quotes[h.ticker.toUpperCase()];
                const value = q ? q.price * h.shares : 0;
                const unrealized = h.costBasis ? value - h.costBasis : 0;
                const unrealizedPct = h.costBasis && h.costBasis > 0 ? (unrealized / h.costBasis) * 100 : 0;
                return (
                  <tr key={h.ticker} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-mono font-semibold">
                      <a href={`/signal/${h.ticker}`} className="text-brand hover:underline">
                        {h.ticker}
                      </a>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-text">{h.shares.toLocaleString("en-US")}</td>
                    <td className="px-5 py-3 text-right hidden md:table-cell">
                      {q ? (
                        <div className="tabular-nums">
                          <div className="text-text">{fmtPrice(q.price, q.currency)}</div>
                          <div className={`text-[11px] ${q.dayChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {fmtPct(q.dayChangePct)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-dim">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold">
                      {q ? fmtMarketCap(value) : "—"}
                    </td>
                    <td className="px-5 py-3 text-right hidden md:table-cell">
                      {h.costBasis ? (
                        <div className="tabular-nums">
                          <div className={unrealized >= 0 ? "text-emerald-400" : "text-rose-400"}>
                            {unrealized >= 0 ? "+" : ""}
                            {fmtMarketCap(unrealized)}
                          </div>
                          <div className={`text-[11px] ${unrealized >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {fmtPct(unrealizedPct)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-dim text-xs">add cost basis</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => removeHolding(h.ticker)}
                        className="text-dim hover:text-rose-400 transition text-xs"
                        aria-label={`Remove ${h.ticker}`}
                        title={`Remove ${h.ticker}`}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
