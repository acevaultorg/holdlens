import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { TICKER_INDEX } from "@/lib/tickers";
import { getConviction, formatSignedScore } from "@/lib/conviction";
import { MANAGER_QUALITY } from "@/lib/signals";
import { MANAGERS } from "@/lib/managers";

// /hidden-gems — the opposite of a crowded trade.
//
// Dataroma surfaces whatever is popular. HoldLens surfaces what smart money
// QUIETLY owns that the crowd hasn't noticed yet. The criteria:
//
//   conviction >= +15  AND
//   ownerCount BETWEEN 1 AND 3  AND
//   at least one top-tier owner (quality >= 8)
//
// These are tickers where a Buffett-class manager took a big bet with
// conviction but hasn't been copied yet. By definition, these have ZERO
// crowding penalty in the ConvictionScore model — so the signal is pure.

export const metadata: Metadata = {
  title: "Hidden gems — high conviction, low ownership",
  description:
    "Tickers where a top-tier superinvestor has taken a high-conviction position but the crowd hasn't noticed. The opposite of a crowded trade.",
  alternates: { canonical: "https://holdlens.com/hidden-gems" },
  openGraph: {
    title: "HoldLens hidden gems — quiet conviction",
    description: "Smart money's underowned picks — single-digit ownership, double-digit conviction.",
    url: "https://holdlens.com/hidden-gems",
    type: "article",
  },
  robots: { index: true, follow: true },
};

type Gem = {
  symbol: string;
  name: string;
  sector?: string;
  ownerCount: number;
  convictionScore: number;
  totalPct: number;
  topOwner: {
    name: string;
    slug: string;
    fund: string;
    pct: number;
    quality: number;
    thesis?: string;
  };
};

function topTierQualityManagerSlugs(): Set<string> {
  const out = new Set<string>();
  for (const [slug, q] of Object.entries(MANAGER_QUALITY)) {
    if (q >= 8) out.add(slug);
  }
  return out;
}

function computeGems(): Gem[] {
  const topTier = topTierQualityManagerSlugs();
  const managerBySlug = new Map(MANAGERS.map((m) => [m.slug, m]));
  const out: Gem[] = [];

  for (const t of Object.values(TICKER_INDEX)) {
    if (t.ownerCount < 1 || t.ownerCount > 3) continue;
    const conv = getConviction(t.symbol);
    if (conv.score < 15) continue;

    // Find the strongest top-tier owner of this ticker by pct
    const topTierOwners = t.owners
      .filter((o) => topTier.has(o.slug))
      .sort((a, b) => b.pct - a.pct);
    if (topTierOwners.length === 0) continue;

    const bestOwner = topTierOwners[0];
    const managerRec = managerBySlug.get(bestOwner.slug);
    const quality = MANAGER_QUALITY[bestOwner.slug] ?? 0;

    out.push({
      symbol: t.symbol,
      name: t.name,
      sector: t.sector,
      ownerCount: t.ownerCount,
      convictionScore: conv.score,
      totalPct: t.totalConviction,
      topOwner: {
        name: bestOwner.manager,
        slug: bestOwner.slug,
        fund: managerRec?.fund ?? "",
        pct: bestOwner.pct,
        quality,
        thesis: bestOwner.thesis,
      },
    });
  }

  out.sort(
    (a, b) =>
      b.convictionScore - a.convictionScore ||
      b.topOwner.quality - a.topOwner.quality ||
      b.topOwner.pct - a.topOwner.pct,
  );
  return out;
}

export default function HiddenGemsPage() {
  const gems = computeGems();
  const soloGems = gems.filter((g) => g.ownerCount === 1);
  const avgConv =
    gems.length > 0
      ? Math.round(gems.reduce((s, g) => s + g.convictionScore, 0) / gems.length)
      : 0;
  const top3 = gems.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">
        Hidden gems · quiet conviction
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        The opposite of a crowded trade.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        {gems.length} tickers where a{" "}
        <span className="text-brand font-semibold">top-tier superinvestor</span> (quality ≥ 8)
        has taken a high-conviction position —{" "}
        <span className="text-emerald-400 font-semibold">ConvictionScore ≥ +15</span> — but
        only 1&ndash;3 managers own the name.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        By definition, hidden gems have zero crowding penalty in the smart-money model. The
        signal is pure. If one of these compounds, the crowd will catch up — and by then the
        first-mover has already been paid.
      </p>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-emerald-400">{gems.length}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Hidden gems
          </div>
        </div>
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-brand">{soloGems.length}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Solo-owner picks
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums text-text">
            {formatSignedScore(avgConv)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Avg conviction
          </div>
        </div>
      </div>

      {/* Top 3 podium */}
      {top3.length === 3 && (
        <section className="mb-12">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">
            Top 3 · highest-conviction hidden gems
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Where the best managers are early
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {top3.map((g, i) => (
              <a
                key={g.symbol}
                href={`/signal/${g.symbol}`}
                className="block rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5 hover:bg-emerald-400/10 transition"
              >
                <div className="flex items-baseline justify-between">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">
                    #{i + 1}
                  </div>
                  <div className="text-lg font-bold tabular-nums text-emerald-400">
                    {formatSignedScore(g.convictionScore)}
                  </div>
                </div>
                <div className="mt-2 text-2xl font-bold text-text">{g.symbol}</div>
                <div className="text-xs text-dim truncate">{g.name}</div>
                <div className="mt-3 text-[11px] text-muted">
                  {g.ownerCount === 1 ? "Solo owner" : `${g.ownerCount} owners`} · q{g.topOwner.quality}
                </div>
                <div className="mt-2 text-[11px] text-text truncate">
                  {g.topOwner.name} · {g.topOwner.pct.toFixed(1)}%
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {gems.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-10 text-center text-muted">
          No hidden gems in the current window. Every high-conviction name currently has ≥4
          owners, meaning smart money has already crowded into everything the model likes.
          Check <a href="/best-now" className="underline">/best-now</a> for the consensus
          ranking.
        </div>
      ) : (
        <section className="mt-12">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">
            Full list · all {gems.length} hidden gems
          </div>
          <h2 className="text-2xl font-bold mb-4">Every gem, sorted by conviction</h2>
          <div className="rounded-2xl border border-border bg-panel overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-bg/40 border-b border-border">
                <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Ticker</th>
                  <th className="px-4 py-3 text-right">Conviction</th>
                  <th className="px-4 py-3 text-right">Owners</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Top owner</th>
                  <th className="px-4 py-3 text-right hidden lg:table-cell">Weight</th>
                </tr>
              </thead>
              <tbody>
                {gems.map((g, i) => (
                  <tr
                    key={g.symbol}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`/signal/${g.symbol}`}
                        className="font-mono font-semibold text-brand hover:underline"
                      >
                        {g.symbol}
                      </a>
                      <div className="text-[11px] text-dim truncate max-w-[14rem]">
                        {g.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-emerald-400">
                      {formatSignedScore(g.convictionScore)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold ${
                          g.ownerCount === 1
                            ? "bg-brand/15 text-brand border border-brand/30"
                            : "bg-bg/40 text-text border border-border"
                        }`}
                      >
                        {g.ownerCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <a
                        href={`/investor/${g.topOwner.slug}`}
                        className="text-text hover:text-brand transition text-xs font-semibold"
                      >
                        {g.topOwner.name}
                      </a>
                      <div className="text-[10px] text-dim truncate max-w-[14rem]">
                        {g.topOwner.fund} · q{g.topOwner.quality}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-brand font-semibold hidden lg:table-cell">
                      {g.topOwner.pct.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <AdSlot format="horizontal" />

      {/* Thesis cards for top 6 — shown full width so copy can breathe */}
      {gems.slice(0, 6).some((g) => g.topOwner.thesis) && (
        <section className="mt-12">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-3">
            Why they own it
          </div>
          <h2 className="text-2xl font-bold mb-4">Top-6 thesis in one line</h2>
          <div className="space-y-3">
            {gems
              .slice(0, 6)
              .filter((g) => g.topOwner.thesis)
              .map((g) => (
                <div
                  key={g.symbol}
                  className="rounded-xl border border-border bg-panel p-4"
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <div>
                      <a
                        href={`/signal/${g.symbol}`}
                        className="font-bold text-text hover:text-brand text-base"
                      >
                        {g.symbol}
                      </a>
                      <span className="text-[11px] text-dim ml-2">
                        · {g.topOwner.name} ({g.topOwner.pct.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="text-sm font-bold tabular-nums text-emerald-400">
                      {formatSignedScore(g.convictionScore)}
                    </div>
                  </div>
                  <p className="text-sm text-muted leading-snug">{g.topOwner.thesis}</p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Methodology */}
      <section className="mt-12 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2">
          How hidden gems are selected
        </div>
        <h2 className="text-xl font-bold mb-3">Three strict filters</h2>
        <ul className="text-sm text-muted space-y-2 leading-relaxed mb-4">
          <li>
            <span className="text-text font-semibold">1. Conviction ≥ +15.</span>{" "}
            The unified <a href="/methodology" className="text-brand hover:underline">
            ConvictionScore</a> must be solidly positive, not a marginal buy.
          </li>
          <li>
            <span className="text-text font-semibold">2. Owner count 1&ndash;3.</span>{" "}
            Only stocks held by three or fewer tracked superinvestors qualify. Four or more
            owners means the idea is already crowding into consensus territory — see{" "}
            <a href="/consensus" className="text-brand hover:underline">/consensus</a>.
          </li>
          <li>
            <span className="text-text font-semibold">3. At least one top-tier owner.</span>{" "}
            At least one holder must have a manager-quality score of 8 or higher (Buffett,
            Klarman, Druckenmiller, Marks, Akre, Ackman, Ubben, Halvorsen, Mandel, Smith,
            Greenblatt, Hohn, Li Lu, etc.). Quality &lt; 8 gets filtered out.
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          This is the cleanest possible read on &ldquo;where is smart money early?&rdquo; —
          a signal that is mathematically <span className="text-text">uncrowded</span>,
          structurally high-conviction, and sourced from managers with track records.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Not investment advice. 13F filings are delayed 45 days and report long-only
        positions. <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
