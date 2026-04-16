import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import { MANAGERS, getManager } from "@/lib/managers";
import {
  MERGED_MOVES,
  QUARTERS,
  QUARTER_LABELS,
  QUARTER_FILED,
  type Quarter,
  type Move,
} from "@/lib/moves";
import { MANAGER_QUALITY } from "@/lib/signals";
import { getConviction, formatSignedScore } from "@/lib/conviction";

// /investor/[slug]/q/[quarter] — per-manager per-quarter digest.
//
// This is the bread and butter of the Dataroma search-intent surface:
// "What did Bill Ackman do in Q3 2025?" is a question users type into
// Google constantly. HoldLens answers it with a full decomposition of
// the quarter's moves, conviction reads, and the resulting portfolio
// snapshot.
//
// Route: all 29 dynamic-slug managers × 8 quarters = 232 static pages.
// Warren Buffett uses his own hard-coded /investor/warren-buffett page
// and is excluded from dynamic generation to avoid a route collision.

type Props = {
  params: Promise<{ slug: string; quarter: string }>;
};

function isQuarter(q: string): q is Quarter {
  return (QUARTERS as readonly string[]).includes(q);
}

export async function generateStaticParams() {
  const slugs = MANAGERS.map((m) => m.slug).filter((s) => s !== "warren-buffett");
  // Quarter slug uses "2025-q4" lowercase — match the /quarter/[slug] route.
  const quarterSlugs = QUARTERS.map((q) => q.toLowerCase());
  const out: { slug: string; quarter: string }[] = [];
  for (const slug of slugs) {
    for (const q of quarterSlugs) {
      out.push({ slug, quarter: q });
    }
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const m = getManager(p.slug);
  const qUpper = p.quarter.toUpperCase();
  if (!m || !isQuarter(qUpper)) {
    return { title: "Quarter not found" };
  }
  const label = QUARTER_LABELS[qUpper];
  return {
    title: `${m.name} · ${label} — every buy, sell, and new position`,
    description: `What ${m.name} (${m.fund}) bought and sold in ${label}. Full 13F-filing decomposition with HoldLens ConvictionScore.`,
    alternates: {
      canonical: `https://holdlens.com/investor/${m.slug}/q/${p.quarter}`,
    },
    openGraph: {
      title: `${m.name} ${label} · HoldLens`,
      description: `Every move, scored. ${m.name}'s ${label} 13F on HoldLens.`,
      url: `https://holdlens.com/investor/${m.slug}/q/${p.quarter}`,
      type: "article",
    },
  };
}

type ClassifiedMove = Move & {
  convictionScore: number;
};

function classify(moves: Move[]): {
  news: ClassifiedMove[];
  adds: ClassifiedMove[];
  trims: ClassifiedMove[];
  exits: ClassifiedMove[];
} {
  const news: ClassifiedMove[] = [];
  const adds: ClassifiedMove[] = [];
  const trims: ClassifiedMove[] = [];
  const exits: ClassifiedMove[] = [];
  for (const mv of moves) {
    const conv = getConviction(mv.ticker);
    const enriched: ClassifiedMove = { ...mv, convictionScore: conv.score };
    if (mv.action === "new") news.push(enriched);
    else if (mv.action === "add") adds.push(enriched);
    else if (mv.action === "trim") trims.push(enriched);
    else if (mv.action === "exit") exits.push(enriched);
  }
  const byImpact = (a: ClassifiedMove, b: ClassifiedMove) =>
    (b.portfolioImpactPct ?? 0) - (a.portfolioImpactPct ?? 0);
  news.sort(byImpact);
  adds.sort(byImpact);
  trims.sort(byImpact);
  exits.sort(byImpact);
  return { news, adds, trims, exits };
}

export default async function ManagerQuarterPage({ params }: Props) {
  const p = await params;
  const m = getManager(p.slug);
  const qUpper = p.quarter.toUpperCase();
  if (!m || !isQuarter(qUpper)) notFound();

  const quarter = qUpper;
  const label = QUARTER_LABELS[quarter];
  const filedAt = QUARTER_FILED[quarter];
  const quality = MANAGER_QUALITY[m.slug] ?? 6;

  const quarterMoves = MERGED_MOVES.filter(
    (mv) => mv.managerSlug === m.slug && mv.quarter === quarter,
  );
  const { news, adds, trims, exits } = classify(quarterMoves);
  const totalMoves = quarterMoves.length;

  // Adjacent quarter links
  const chrono = [...QUARTERS].reverse(); // oldest → newest
  const qIdx = chrono.indexOf(quarter);
  const prevQ = qIdx > 0 ? chrono[qIdx - 1] : null;
  const nextQ = qIdx < chrono.length - 1 ? chrono[qIdx + 1] : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        <a href={`/investor/${m.slug}`} className="hover:underline">
          {m.name}
        </a>{" "}
        · quarter digest
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        What {m.name} did in {label}
      </h1>
      <p className="text-muted text-lg max-w-3xl mb-4">
        <span className="text-text font-semibold">{m.fund}</span> filed{" "}
        <span className="text-text">{totalMoves}</span> moves in {label}:{" "}
        <span className="text-emerald-400 font-semibold">{news.length} new</span>,{" "}
        <span className="text-emerald-400 font-semibold">{adds.length} add</span>,{" "}
        <span className="text-rose-400 font-semibold">{trims.length} trim</span>,{" "}
        <span className="text-rose-400 font-semibold">{exits.length} exit</span>.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-6">
        13F filed {filedAt}. Manager quality score:{" "}
        <span className="text-emerald-400 font-semibold">q{quality}</span>.
        Philosophy: <span className="text-muted italic">{m.philosophy}</span>
      </p>

      {/* Adjacent quarter nav */}
      <div className="flex items-center gap-2 mb-10 text-xs">
        {prevQ ? (
          <a
            href={`/investor/${m.slug}/q/${prevQ.toLowerCase()}`}
            className="inline-flex items-center gap-1 rounded border border-border bg-panel px-3 py-2 hover:border-brand transition text-muted"
          >
            ← {QUARTER_LABELS[prevQ]}
          </a>
        ) : (
          <span className="rounded border border-border/50 bg-panel/30 px-3 py-2 text-dim">
            ← (archive start)
          </span>
        )}
        <a
          href={`/quarter/${quarter.toLowerCase()}`}
          className="inline-flex items-center gap-1 rounded border border-brand bg-brand/10 px-3 py-2 hover:bg-brand/20 transition text-brand font-semibold"
        >
          {label} · fleet digest
        </a>
        {nextQ ? (
          <a
            href={`/investor/${m.slug}/q/${nextQ.toLowerCase()}`}
            className="inline-flex items-center gap-1 rounded border border-border bg-panel px-3 py-2 hover:border-brand transition text-muted"
          >
            {QUARTER_LABELS[nextQ]} →
          </a>
        ) : (
          <span className="rounded border border-border/50 bg-panel/30 px-3 py-2 text-dim">
            (archive end) →
          </span>
        )}
      </div>

      {totalMoves === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-8 text-center text-muted">
          No moves recorded for {m.name} in {label}. Either the archive
          doesn&rsquo;t cover this filing, or the manager was inactive this
          quarter.
        </div>
      ) : (
        <>
          {/* News */}
          {news.length > 0 && (
            <section className="mb-10">
              <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2">
                New positions · {news.length}
              </div>
              <h2 className="text-2xl font-bold mb-4">Fresh money</h2>
              <div className="space-y-3">
                {news.map((mv) => (
                  <MoveCard key={`n-${mv.ticker}`} mv={mv} tone="emerald" />
                ))}
              </div>
            </section>
          )}

          {adds.length > 0 && (
            <section className="mb-10">
              <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2">
                Adds · {adds.length}
              </div>
              <h2 className="text-2xl font-bold mb-4">Adding to conviction</h2>
              <div className="space-y-3">
                {adds.map((mv) => (
                  <MoveCard key={`a-${mv.ticker}`} mv={mv} tone="emerald" />
                ))}
              </div>
            </section>
          )}

          <AdSlot format="horizontal" />

          {trims.length > 0 && (
            <section className="mt-10 mb-10">
              <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
                Trims · {trims.length}
              </div>
              <h2 className="text-2xl font-bold mb-4">Taking chips off</h2>
              <div className="space-y-3">
                {trims.map((mv) => (
                  <MoveCard key={`t-${mv.ticker}`} mv={mv} tone="rose" />
                ))}
              </div>
            </section>
          )}

          {exits.length > 0 && (
            <section className="mb-10">
              <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
                Exits · {exits.length}
              </div>
              <h2 className="text-2xl font-bold mb-4">Closed positions</h2>
              <div className="space-y-3">
                {exits.map((mv) => (
                  <MoveCard key={`e-${mv.ticker}`} mv={mv} tone="rose" />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Current snapshot */}
      <section className="mt-16">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          Current top holdings
        </div>
        <h2 className="text-2xl font-bold mb-4">
          {m.name}&rsquo;s book, latest snapshot
        </h2>
        <div className="rounded-2xl border border-border bg-panel overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Ticker</th>
                <th className="px-4 py-3 text-right">Weight</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Conviction</th>
              </tr>
            </thead>
            <tbody>
              {m.topHoldings.slice(0, 15).map((h, i) => {
                const conv = getConviction(h.ticker);
                return (
                  <tr
                    key={h.ticker}
                    className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                  >
                    <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`/signal/${h.ticker}`}
                        className="font-mono font-semibold text-brand hover:underline"
                      >
                        {h.ticker}
                      </a>
                      <div className="text-[11px] text-dim truncate max-w-[14rem]">
                        {h.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-text font-semibold">
                      {h.pct.toFixed(1)}%
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold tabular-nums hidden md:table-cell ${
                        conv.score >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {formatSignedScore(conv.score)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* v1.16 — cross-quarter internal linking. Every per-quarter page gets
          links to the 7 sibling quarters for the same manager (prev/next
          context + full quarter grid). Closes a major SEO + UX gap: Google
          previously had to infer the relationship; now each page explicitly
          links to its siblings. Users who land on Q4 2024 can jump straight
          to Q3 2024 or Q1 2025 without going back to the manager index. */}
      <section className="mt-16 pt-10 border-t border-border">
        <div className="text-xs uppercase tracking-widest text-dim font-semibold mb-3">
          Other quarters for {m.name}
        </div>
        <div className="flex flex-wrap gap-2">
          {QUARTERS.map((qOther) => {
            const isCurrent = qOther === quarter;
            const href = `/investor/${m.slug}/q/${qOther.toLowerCase()}`;
            const label = QUARTER_LABELS[qOther] ?? qOther;
            return isCurrent ? (
              <span
                key={qOther}
                aria-current="page"
                className="rounded-chip border border-brand/40 bg-brand/10 px-3 py-1.5 text-xs text-brand font-semibold"
              >
                {label}
              </span>
            ) : (
              <a
                key={qOther}
                href={href}
                className="rounded-chip border border-border bg-panel hover:border-brand/50 hover:text-text px-3 py-1.5 text-xs text-muted transition"
              >
                {label}
              </a>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
          <a href={`/investor/${m.slug}`} className="hover:text-text transition">
            ← Full profile
          </a>
          <a href="/investor" className="hover:text-text transition">
            All managers
          </a>
          <a href="/leaderboard" className="hover:text-text transition">
            Leaderboard
          </a>
          <a
            href={`/investor/${m.slug}/feed.xml`}
            className="hover:text-text transition"
            rel="alternate"
            type="application/rss+xml"
          >
            RSS feed
          </a>
        </div>
      </section>

      <p className="text-xs text-dim mt-12">
        Not investment advice. Data from 13F filings with HoldLens parsing.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}

function MoveCard({
  mv,
  tone,
}: {
  mv: { ticker: string; name?: string; action: string; deltaPct?: number; shareChange?: number; portfolioImpactPct?: number; note?: string; convictionScore: number };
  tone: "emerald" | "rose";
}) {
  const toneCls =
    tone === "emerald"
      ? { border: "border-emerald-400/30", bg: "bg-emerald-400/5", text: "text-emerald-400" }
      : { border: "border-rose-400/30", bg: "bg-rose-400/5", text: "text-rose-400" };
  const actionLabel =
    mv.action === "new"
      ? "NEW"
      : mv.action === "exit"
      ? "EXIT"
      : mv.action === "add"
      ? `ADD ${mv.deltaPct != null ? `+${mv.deltaPct}%` : ""}`
      : `TRIM ${mv.deltaPct != null ? `${mv.deltaPct}%` : ""}`;
  return (
    <div className={`rounded-xl border ${toneCls.border} ${toneCls.bg} p-4`}>
      <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
        <div className="flex items-baseline gap-3">
          <a
            href={`/signal/${mv.ticker}`}
            className="text-lg font-mono font-bold text-text hover:underline"
          >
            {mv.ticker}
          </a>
          <span className="text-dim text-xs truncate max-w-[16rem]">{mv.name}</span>
        </div>
        <div className="flex items-baseline gap-3 text-[11px] tabular-nums">
          <span className={`font-bold ${toneCls.text}`}>{actionLabel}</span>
          {mv.portfolioImpactPct != null && (
            <>
              <span className="text-dim">·</span>
              <span className="text-text font-semibold">
                {mv.portfolioImpactPct.toFixed(1)}% book
              </span>
            </>
          )}
          <span className="text-dim">·</span>
          <span
            className={`font-semibold ${
              mv.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {formatSignedScore(mv.convictionScore)}
          </span>
        </div>
      </div>
      {mv.note && (
        <p className="text-[11px] text-muted italic leading-relaxed">
          &ldquo;{mv.note}&rdquo;
        </p>
      )}
    </div>
  );
}
