import { getTradersByTicker, formatRange } from "@/lib/congress";

// Server component — conditionally renders a "Congress trades" card on a
// ticker page when any tracked Congressmember has disclosed a trade in
// this ticker. Returns null when no member has traded it. Mirrors
// BuybackSummary / ShortInterestSummary / ActivistSummary cross-link pattern.

export default function CongressSummary({ symbol }: { symbol: string }) {
  const traders = getTradersByTicker(symbol);
  if (traders.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-2">Congressional trades</h2>
      <p className="text-muted text-sm mb-6">
        STOCK Act disclosures from U.S. House and Senate members trading {symbol}.
      </p>
      <div className="rounded-2xl border border-border bg-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg/40 border-b border-border">
            <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-right">Range</th>
              <th className="px-4 py-3 text-right hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {traders.flatMap(({ member, trades }) =>
              trades.map((t, i) => (
                <tr
                  key={`${member.slug}-${t.transactionDate}-${i}`}
                  className="border-b border-border last:border-0 hover:bg-bg/30 transition"
                >
                  <td className="px-4 py-3">
                    <a href={`/congress/${member.slug}/`} className="font-semibold text-text hover:text-brand">
                      {member.name}
                    </a>
                    <div className="text-[11px] text-dim">
                      {member.chamber} · {member.party}-{member.state}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        t.action === "buy"
                          ? "text-emerald-400 font-semibold"
                          : "text-rose-400 font-semibold"
                      }
                    >
                      {t.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">
                    {formatRange(t.amountRangeMin, t.amountRangeMax)}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-muted tabular-nums hidden sm:table-cell">
                    {t.transactionDate}
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
