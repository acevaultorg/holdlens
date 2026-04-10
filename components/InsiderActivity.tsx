// Server component — deterministic, reads from lib/insiders.ts
import { getInsiderTx, fmtInsiderValue, fmtInsiderDate } from "@/lib/insiders";

export default function InsiderActivity({ symbol }: { symbol: string }) {
  const txs = getInsiderTx(symbol);

  if (txs.length === 0) return null;

  const buys = txs.filter((t) => t.action === "buy");
  const sells = txs.filter((t) => t.action === "sell");
  const netBuys = buys.length - sells.length;

  const netSignal = netBuys > 0 ? "INSIDER BUYING" : netBuys < 0 ? "INSIDER SELLING" : "MIXED";
  const netColor =
    netBuys > 0
      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
      : netBuys < 0
      ? "text-rose-400 bg-rose-400/10 border-rose-400/30"
      : "text-muted bg-panel border-border";

  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-1">
            Insider activity (Form 4)
          </div>
          <div className="text-sm text-muted">
            {buys.length} buy{buys.length !== 1 ? "s" : ""} · {sells.length} sell{sells.length !== 1 ? "s" : ""} from corporate insiders
          </div>
        </div>
        <div className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${netColor}`}>
          Net: {netSignal}
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="text-dim text-[10px] uppercase tracking-wider">
          <tr className="border-b border-border">
            <th className="text-left px-5 py-2">Insider</th>
            <th className="text-left px-5 py-2 hidden md:table-cell">Action</th>
            <th className="text-right px-5 py-2 hidden md:table-cell">Shares</th>
            <th className="text-right px-5 py-2">Value</th>
            <th className="text-right px-5 py-2 hidden sm:table-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          {txs.map((tx, i) => {
            const isBuy = tx.action === "buy";
            const color = isBuy ? "text-emerald-400" : "text-rose-400";
            return (
              <tr key={`${tx.insiderName}-${tx.date}-${i}`} className="border-b border-border last:border-0 align-top">
                <td className="px-5 py-3">
                  <div className="font-semibold text-text">{tx.insiderName}</div>
                  <div className="text-[11px] text-dim mt-0.5">{tx.insiderTitle}</div>
                  {tx.note && (
                    <div className="text-[11px] text-muted italic mt-1 max-w-md hidden md:block">{tx.note}</div>
                  )}
                </td>
                <td className={`px-5 py-3 font-bold uppercase text-xs hidden md:table-cell ${color}`}>
                  {tx.action}
                </td>
                <td className="px-5 py-3 text-right tabular-nums hidden md:table-cell text-muted">
                  {tx.shares.toLocaleString("en-US")}
                </td>
                <td className={`px-5 py-3 text-right tabular-nums font-semibold ${color}`}>
                  {fmtInsiderValue(tx.value)}
                </td>
                <td className="px-5 py-3 text-right text-xs text-dim hidden sm:table-cell">
                  {fmtInsiderDate(tx.date)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
