import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import CsvExportButton from "@/components/CsvExportButton";
import TickerLogo from "@/components/TickerLogo";
import { MERGED_MOVES, QUARTERS, QUARTER_LABELS, type Quarter } from "@/lib/moves";
import { MANAGERS } from "@/lib/managers";
import { TICKER_INDEX } from "@/lib/tickers";
import { getConviction, formatSignedScore } from "@/lib/conviction";

// /exits — the scariest page. Every FULL exit recorded in the last 8
// quarters, sorted newest first. An "add" or "trim" could mean anything.
// An "exit" means: "I no longer own this stock. Zero. Gone."
//
// Dataroma shows exits in the activity feed but you have to hunt for them.
// This page is ONLY exits — the rawest capitulation signal in smart money.

export const metadata: Metadata = {
  title: "Exits — every full exit by a superinvestor",
  description:
    "Every full-exit 13F move by the superinvestors we track. The capitulation signal: who fully gave up on which stock, when, and what the smart-money model says now.",
  alternates: { canonical: "https://holdlens.com/exits" },
  openGraph: {
    title: "HoldLens exits — the capitulation feed",
    description: "Every full exit by a superinvestor, newest first, with current conviction.",
    url: "https://holdlens.com/exits",
    type: "article",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "HoldLens — 30 superinvestors, one ConvictionScore" }],
  },
  robots: { index: true, follow: true },
};

type ExitRow = {
  quarter: string;
  filedAt: string;
  managerSlug: string;
  managerName: string;
  fund: string;
  ticker: string;
  name: string;
  sector: string;
  convictionScore: number;
  // Is the model still bullish on this name? If so, the exit is contrarian.
  modelDisagrees: boolean;
};

function managerInfo(slug: string): { name: string; fund: string } {
  const m = MANAGERS.find((x) => x.slug === slug);
  return { name: m?.name ?? slug, fund: m?.fund ?? "" };
}

function computeExits(): ExitRow[] {
  const quarterOrder = new Map<string, number>();
  QUARTERS.forEach((q, i) => quarterOrder.set(q, i));
  const tracked = new Set<string>(QUARTERS);

  const out: ExitRow[] = [];
  for (const mv of MERGED_MOVES) {
    if (mv.action !== "exit") continue;
    if (!tracked.has(mv.quarter)) continue;
    const td = TICKER_INDEX[mv.ticker];
    const conv = getConviction(mv.ticker);
    const info = managerInfo(mv.managerSlug);
    out.push({
      quarter: mv.quarter,
      filedAt: mv.filedAt,
      managerSlug: mv.managerSlug,
      managerName: info.name,
      fund: info.fund,
      ticker: mv.ticker,
      name: mv.name ?? td?.name ?? mv.ticker,
      sector: td?.sector ?? "Other",
      convictionScore: conv.score,
      modelDisagrees: conv.score > 20, // model still bullish → exit is contrarian
    });
  }

  // Sort: newest quarter first, then alphabetical ticker
  out.sort((a, b) => {
    const qa = quarterOrder.get(a.quarter) ?? 999;
    const qb = quarterOrder.get(b.quarter) ?? 999;
    return qa - qb || a.ticker.localeCompare(b.ticker);
  });
  return out;
}

export default function ExitsPage() {
  const rows = computeExits();
  const contrarianExits = rows.filter((r) => r.modelDisagrees);
  const recentCount = rows.filter((r) => r.quarter === QUARTERS[0]).length;

  // Group by quarter for a feed layout
  const byQuarter = new Map<string, ExitRow[]>();
  for (const r of rows) {
    if (!byQuarter.has(r.quarter)) byQuarter.set(r.quarter, []);
    byQuarter.get(r.quarter)!.push(r);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-3">
        Exits · capitulation feed
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        Who fully gave up on which stock?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        {rows.length} full-exit 13F moves across the last 8 quarters. Every row is a
        superinvestor who <span className="text-rose-400 font-semibold">sold every share</span>{" "}
        of a position — zero remaining, no cost averaging back in, fully gone.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-6">
        Exits are the rawest capitulation signal. An &ldquo;add&rdquo; or &ldquo;trim&rdquo;
        is ambiguous. An exit means the thesis broke.
      </p>
      <div className="mb-10 flex items-center gap-2 flex-wrap">
        <CsvExportButton
          endpoint="/api/v1/exits.json"
          filename="holdlens-exits"
          label="Export exits CSV"
        />
        <span className="text-xs text-dim">Free download — no signup.</span>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="rounded-2xl border border-border bg-panel p-5">
          <div className="text-3xl font-bold tabular-nums text-text">{rows.length}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Total exits 8Q
          </div>
        </div>
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-rose-400">{recentCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Latest quarter
          </div>
        </div>
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
          <div className="text-3xl font-bold tabular-nums text-brand">
            {contrarianExits.length}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mt-1">
            Contrarian exits
          </div>
        </div>
      </div>

      {/* Contrarian exits callout */}
      {contrarianExits.length > 0 && (
        <section className="mb-12 rounded-2xl border border-brand/30 bg-brand/5 p-6">
          <div className="text-[10px] uppercase tracking-widest font-bold text-brand mb-2">
            Contrarian exits · model still bullish
          </div>
          <h2 className="text-xl font-bold mb-3 text-text">
            They walked away. The model still says buy.
          </h2>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            These are the exits where the smart-money ConvictionScore is still{" "}
            <span className="font-semibold text-emerald-400">&gt; +20</span>. Either the
            manager was early, the model is wrong, or the thesis shifted in ways the model
            hasn&rsquo;t caught yet.
          </p>
          <div className="space-y-2">
            {contrarianExits.slice(0, 10).map((r, i) => (
              <a
                key={`${r.ticker}-${r.managerSlug}-${r.quarter}-${i}`}
                href={`/signal/${r.ticker}`}
                className="flex items-baseline justify-between gap-3 rounded-lg bg-bg/40 border border-border p-3 hover:bg-bg/60 transition"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <TickerLogo symbol={r.ticker} size={18} />
                  <span className="font-bold text-text">{r.ticker}</span>
                  <span className="text-xs text-dim truncate">
                    · {r.managerName} · {QUARTER_LABELS[r.quarter as Quarter]}
                  </span>
                </div>
                <div className="text-sm font-bold tabular-nums text-emerald-400 shrink-0">
                  {formatSignedScore(r.convictionScore)}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Feed by quarter */}
      <section className="mt-12">
        <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-3">
          Full feed · newest quarter first
        </div>
        <h2 className="text-2xl font-bold mb-6">Every exit, in order</h2>
        <div className="space-y-8">
          {[...byQuarter.entries()].map(([quarter, items]) => (
            <div key={quarter}>
              <div className="flex items-baseline justify-between mb-3 border-b border-border pb-2">
                <div className="text-lg font-bold text-text">
                  {QUARTER_LABELS[quarter as Quarter] ?? quarter}
                </div>
                <div className="text-xs text-dim">{items.length} exits</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {items.slice(0, 60).map((r, i) => (
                  <a
                    key={`${r.ticker}-${r.managerSlug}-${quarter}-${i}`}
                    href={`/signal/${r.ticker}`}
                    className="block rounded-xl border border-border bg-panel p-4 hover:bg-bg/40 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <TickerLogo symbol={r.ticker} size={20} />
                        <div className="font-bold text-text text-base">{r.ticker}</div>
                      </div>
                      <div
                        className={`text-xs font-bold tabular-nums ${
                          r.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {formatSignedScore(r.convictionScore)}
                      </div>
                    </div>
                    <div className="text-[11px] text-dim truncate mt-0.5">{r.name}</div>
                    <div className="text-xs text-muted mt-2 truncate">
                      exit · <span className="text-text">{r.managerName}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <AdSlot format="horizontal" />

      <section className="mt-12 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold mb-2">
          How exits are surfaced
        </div>
        <h2 className="text-xl font-bold mb-3">Full-exit actions only</h2>
        <p className="text-sm text-muted leading-relaxed mb-3">
          We filter the merged 13F move feed for <code className="text-text bg-bg/40 px-1">action = &ldquo;exit&rdquo;</code>{" "}
          only. &ldquo;Trim&rdquo; moves are excluded — a trim means the manager still
          owns the stock. Exits mean the position went to zero.
        </p>
        <p className="text-sm text-muted leading-relaxed">
          &ldquo;Contrarian exits&rdquo; are the subset where our current{" "}
          <a href="/conviction-leaders" className="text-brand hover:underline">
            ConvictionScore
          </a>{" "}
          is still <span className="text-emerald-400 font-semibold">&gt; +20</span> — i.e.
          the model disagrees with the capitulation.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Not investment advice. 13F filings are delayed 45 days and report long-only
        positions. <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
