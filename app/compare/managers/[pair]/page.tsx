import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import LiveQuote from "@/components/LiveQuote";
import PortfolioValue from "@/components/PortfolioValue";
import { MANAGERS, type Manager } from "@/lib/managers";
import { MANAGER_QUALITY } from "@/lib/signals";
import { getMovesByManager, QUARTER_LABELS, LATEST_QUARTER } from "@/lib/moves";

// Generate a curated list of high-interest pairs rather than the O(n²) matrix.
// Pairs: Tier-1 × Tier-1 (top 8 managers), then each Tier-1 × each other once.
function buildPairs(): { slug: string; a: string; b: string }[] {
  const topSlugs = MANAGERS.map((m) => m.slug)
    .filter((slug) => (MANAGER_QUALITY[slug] ?? 6) >= 8)
    .slice(0, 15); // cap to keep build fast
  const pairs: { slug: string; a: string; b: string }[] = [];
  for (let i = 0; i < topSlugs.length; i++) {
    for (let j = i + 1; j < topSlugs.length; j++) {
      pairs.push({ slug: `${topSlugs[i]}-vs-${topSlugs[j]}`, a: topSlugs[i], b: topSlugs[j] });
    }
  }
  return pairs;
}

export async function generateStaticParams() {
  return buildPairs().map((p) => ({ pair: p.slug }));
}

function resolvePair(pair: string): { a: Manager; b: Manager } | null {
  const idx = pair.indexOf("-vs-");
  if (idx < 0) return null;
  const aSlug = pair.slice(0, idx);
  const bSlug = pair.slice(idx + 4);
  const a = MANAGERS.find((m) => m.slug === aSlug);
  const b = MANAGERS.find((m) => m.slug === bSlug);
  if (!a || !b) return null;
  return { a, b };
}

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
  const { pair } = await params;
  const resolved = resolvePair(pair);
  if (!resolved) return { title: "Comparison not found" };
  const { a, b } = resolved;
  return {
    title: `${a.name} vs ${b.name} — portfolio comparison`,
    description: `${a.name} (${a.fund}) vs ${b.name} (${b.fund}) — side-by-side portfolio comparison with live prices and recent moves.`,
    openGraph: {
      title: `${a.name} vs ${b.name}`,
      description: `Portfolio comparison on HoldLens.`,
    },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const resolved = resolvePair(pair);
  if (!resolved) notFound();
  const { a, b } = resolved;

  const aMoves = getMovesByManager(a.slug, LATEST_QUARTER);
  const bMoves = getMovesByManager(b.slug, LATEST_QUARTER);

  // Shared holdings between the two
  const aTickers = new Set(a.topHoldings.map((h) => h.ticker.toUpperCase()));
  const shared = b.topHoldings.filter((h) => aTickers.has(h.ticker.toUpperCase()));

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <a href="/investor" className="text-xs text-muted hover:text-text">← All investors</a>
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mt-6 mb-4">
        Head-to-head comparison
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
        {a.name} <span className="text-dim">vs</span> {b.name}
      </h1>

      {/* Manager cards */}
      <div className="mt-10 grid md:grid-cols-2 gap-4">
        <ManagerCard m={a} />
        <ManagerCard m={b} />
      </div>

      {/* Live portfolio values */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <PortfolioValue
          holdings={a.topHoldings.map((h) => ({ ticker: h.ticker, sharesMn: h.sharesMn, pct: h.pct }))}
          label={`${a.name.split(" ")[0]}'s portfolio value`}
        />
        <PortfolioValue
          holdings={b.topHoldings.map((h) => ({ ticker: h.ticker, sharesMn: h.sharesMn, pct: h.pct }))}
          label={`${b.name.split(" ")[0]}'s portfolio value`}
        />
      </div>

      {/* Shared holdings */}
      {shared.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-3">Shared conviction</h2>
          <p className="text-muted text-sm mb-6 max-w-2xl">
            Stocks both managers hold as a top position. Overlap in conviction is a strong consensus signal.
          </p>
          <div className="rounded-2xl border border-border bg-panel overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-dim text-xs uppercase tracking-wider">
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3">Ticker</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Company</th>
                  <th className="text-right px-5 py-3 hidden md:table-cell">Price · Today</th>
                  <th className="text-right px-5 py-3">{a.name.split(" ")[0]} %</th>
                  <th className="text-right px-5 py-3">{b.name.split(" ")[0]} %</th>
                </tr>
              </thead>
              <tbody>
                {shared.map((bh) => {
                  const ah = a.topHoldings.find((h) => h.ticker === bh.ticker);
                  return (
                    <tr key={bh.ticker} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-mono font-semibold">
                        <a href={`/ticker/${bh.ticker}`} className="text-brand hover:underline">{bh.ticker}</a>
                      </td>
                      <td className="px-5 py-3 text-text hidden md:table-cell">{bh.name}</td>
                      <td className="px-5 py-3 text-right hidden md:table-cell">
                        <LiveQuote symbol={bh.ticker} size="sm" refreshMs={0} />
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">{ah?.pct.toFixed(1)}%</td>
                      <td className="px-5 py-3 text-right tabular-nums">{bh.pct.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <AdSlot format="horizontal" />

      {/* Side-by-side recent moves */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-3">Recent moves — {QUARTER_LABELS[LATEST_QUARTER]}</h2>
        <p className="text-muted text-sm mb-6 max-w-2xl">
          Latest quarter activity for each manager.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <MovesColumn name={a.name} moves={aMoves} />
          <MovesColumn name={b.name} moves={bMoves} />
        </div>
      </section>

      <p className="text-xs text-dim mt-12">
        Data sourced from 13F filings with the SEC. Overlap in top positions is a
        concrete consensus signal, not investment advice.
      </p>
    </div>
  );
}

function ManagerCard({ m }: { m: Manager }) {
  const quality = MANAGER_QUALITY[m.slug] ?? 6;
  return (
    <div className="rounded-2xl border border-border bg-panel p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <a href={`/investor/${m.slug}`} className="text-xl font-bold text-text hover:text-brand transition block truncate">
            {m.name}
          </a>
          <div className="text-xs text-muted truncate">{m.fund}</div>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-bold text-brand bg-brand/10 border border-brand/30 rounded px-2 py-1 whitespace-nowrap">
          Q{quality}/10
        </span>
      </div>
      <div className="text-xs text-muted italic line-clamp-2">"{m.philosophy}"</div>
      <div className="mt-3 flex gap-4 text-xs text-dim">
        <span>{m.topHoldings.length} positions</span>
        <span>Since {m.startedTracking}</span>
      </div>
    </div>
  );
}

function MovesColumn({
  name,
  moves,
}: {
  name: string;
  moves: ReturnType<typeof getMovesByManager>;
}) {
  if (moves.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-panel p-6 text-sm text-dim text-center">
        No tracked moves for {name.split(" ")[0]} this quarter.
      </div>
    );
  }
  const sorted = [...moves].sort((a, b) => {
    const aBuy = a.action === "new" || a.action === "add";
    const bBuy = b.action === "new" || b.action === "add";
    if (aBuy !== bBuy) return aBuy ? -1 : 1;
    return Math.abs(b.deltaPct ?? 0) - Math.abs(a.deltaPct ?? 0);
  });
  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden">
      <div className="px-5 py-3 border-b border-border text-xs font-bold text-text">{name}</div>
      <ul className="divide-y divide-border">
        {sorted.map((mv, i) => {
          const isBuy = mv.action === "new" || mv.action === "add";
          const color = isBuy ? "text-emerald-400" : "text-rose-400";
          const label =
            mv.action === "new"
              ? "NEW"
              : mv.action === "add"
              ? `ADD${mv.deltaPct != null ? ` +${mv.deltaPct}%` : ""}`
              : mv.action === "trim"
              ? `REDUCE${mv.deltaPct != null ? ` ${mv.deltaPct}%` : ""}`
              : "EXIT";
          return (
            <li key={`${mv.ticker}-${i}`} className="px-5 py-3">
              <div className="flex items-center justify-between gap-3">
                <a href={`/ticker/${mv.ticker}`} className="font-mono font-bold text-brand hover:underline text-sm">
                  {mv.ticker}
                </a>
                <span className={`text-xs font-semibold ${color}`}>{label}</span>
              </div>
              {mv.note && <div className="text-[11px] text-muted italic mt-1">{mv.note}</div>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
