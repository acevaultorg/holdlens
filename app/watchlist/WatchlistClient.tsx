"use client";
import { useEffect, useState } from "react";
import LiveQuote from "@/components/LiveQuote";
import SinceFilingDelta from "@/components/SinceFilingDelta";
import StarButton from "@/components/StarButton";
import { getWatchlist, subscribeWatchlist } from "@/lib/watchlist";
import { TICKER_INDEX } from "@/lib/tickers";
import { LATEST_QUARTER, QUARTER_FILED } from "@/lib/moves-types";

export default function WatchlistClient() {
  const [list, setList] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setList(getWatchlist());
    return subscribeWatchlist(setList);
  }, []);

  if (!mounted) {
    return <div className="h-40 rounded-2xl border border-border bg-panel animate-pulse" />;
  }

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-panel p-10 text-center">
        <div className="text-2xl font-bold mb-2">No tickers yet</div>
        <p className="text-muted mb-6 max-w-md mx-auto">
          Tap the star button on any ticker page to add it here. Your list stays private on this device.
        </p>
        <a
          href="/top-picks"
          className="inline-block bg-brand text-black font-semibold rounded-xl px-6 py-3 hover:opacity-90 transition"
        >
          Browse top picks →
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden">
      <table className="w-full text-sm">
        <thead className="text-dim text-xs uppercase tracking-wider">
          <tr className="border-b border-border">
            <th className="text-left px-5 py-4">Ticker</th>
            <th className="text-left px-5 py-4 hidden md:table-cell">Company</th>
            <th className="text-right px-5 py-4">Price · Today</th>
            <th className="text-right px-5 py-4 hidden md:table-cell">Owners</th>
            <th className="text-right px-5 py-4 w-32"></th>
          </tr>
        </thead>
        <tbody>
          {list.map((sym) => {
            const meta = TICKER_INDEX[sym];
            return (
              <tr key={sym} className="border-b border-border last:border-0 hover:bg-bg/50 transition">
                <td className="px-5 py-4 font-mono font-semibold">
                  <a href={`/ticker/${sym}`} className="text-brand hover:underline">
                    {sym}
                  </a>
                </td>
                <td className="px-5 py-4 text-text hidden md:table-cell">
                  {meta?.name || <span className="text-dim">Not in coverage</span>}
                </td>
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <LiveQuote symbol={sym} size="md" />
                  <div className="text-[10.5px] mt-0.5">
                    <SinceFilingDelta
                      ticker={sym}
                      filedAt={QUARTER_FILED[LATEST_QUARTER]}
                      label="since filing"
                    />
                  </div>
                </td>
                <td className="px-5 py-4 text-right tabular-nums hidden md:table-cell text-muted">
                  {meta?.ownerCount ?? "—"}
                </td>
                <td className="px-5 py-4 text-right">
                  <StarButton symbol={sym} size="sm" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
