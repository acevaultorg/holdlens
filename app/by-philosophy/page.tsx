import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import { MANAGERS } from "@/lib/managers";
import { getConviction, formatSignedScore } from "@/lib/conviction";
import { TICKER_INDEX } from "@/lib/tickers";

// /by-philosophy — group managers by investing school and surface the
// school's collective top picks.
//
// Five schools, mutually exclusive, based on philosophy statements:
//   1. Compounders — Buffett school, hold-forever quality
//   2. Deep Value  — Klarman/Greenblatt school, margin of safety
//   3. Activists   — Ackman/Icahn school, force change
//   4. Macro       — Druckenmiller/Marks school, top-down
//   5. Long-Short  — Tiger Cub school, fundamental long-short
//
// Within each school, aggregate top-holding pct across members. Rank by
// summed weight desc. The result is "what does THIS school collectively
// own right now?" which is exactly how rich-person investing is studied.

export const metadata: Metadata = {
  title: "By philosophy — smart money grouped by investing school",
  description:
    "What do value investors own right now? What do quality compounders hold? Five schools, ranked collective conviction, only on HoldLens.",
  alternates: { canonical: "https://holdlens.com/by-philosophy" },
  openGraph: {
    title: "HoldLens · smart money by investing school",
    description:
      "Deep value, compounders, activists, macro, and long-short — what each school collectively owns.",
    url: "https://holdlens.com/by-philosophy",
    type: "article",
  },
  robots: { index: true, follow: true },
};

type SchoolKey = "compounders" | "deep-value" | "activists" | "macro" | "long-short";

type SchoolMeta = {
  key: SchoolKey;
  label: string;
  tagline: string;
  color: "brand" | "emerald" | "rose" | "amber";
  colorClasses: {
    badge: string;
    border: string;
    text: string;
    headerText: string;
  };
  members: string[];   // manager slugs
};

// Hand-classified from philosophy strings in lib/managers.ts. Mutually exclusive.
const SCHOOLS: SchoolMeta[] = [
  {
    key: "compounders",
    label: "Quality Compounders",
    tagline: "Buy wonderful companies. Hold forever. Don't overpay. Do nothing.",
    color: "emerald",
    colorClasses: {
      badge: "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30",
      border: "border-emerald-400/30 bg-emerald-400/5 hover:bg-emerald-400/10",
      text: "text-emerald-400",
      headerText: "text-emerald-400",
    },
    members: [
      "warren-buffett",
      "chuck-akre",
      "terry-smith",
      "polen-capital",
      "david-rolfe",
      "francois-rochon",
      "dev-kantesaria",
      "tom-slater",
    ],
  },
  {
    key: "deep-value",
    label: "Deep Value",
    tagline: "Margin of safety. Cash is a position. Buy good at cheap.",
    color: "brand",
    colorClasses: {
      badge: "bg-brand/15 text-brand border border-brand/30",
      border: "border-brand/30 bg-brand/5 hover:bg-brand/10",
      text: "text-brand",
      headerText: "text-brand",
    },
    members: [
      "seth-klarman",
      "joel-greenblatt",
      "li-lu",
      "monish-pabrai",
      "prem-watsa",
      "bill-nygren",
      "glenn-greenberg",
    ],
  },
  {
    key: "activists",
    label: "Activists",
    tagline: "Force change. Partner or fight. Concentrate. Win or walk away.",
    color: "amber",
    colorClasses: {
      badge: "bg-amber-400/15 text-amber-400 border border-amber-400/30",
      border: "border-amber-400/30 bg-amber-400/5 hover:bg-amber-400/10",
      text: "text-amber-400",
      headerText: "text-amber-400",
    },
    members: ["bill-ackman", "carl-icahn", "chris-hohn", "jeffrey-ubben"],
  },
  {
    key: "macro",
    label: "Macro / Opportunistic",
    tagline: "Top-down. Second-level thinking. Go big when the setup is right.",
    color: "rose",
    colorClasses: {
      badge: "bg-rose-400/15 text-rose-400 border border-rose-400/30",
      border: "border-rose-400/30 bg-rose-400/5 hover:bg-rose-400/10",
      text: "text-rose-400",
      headerText: "text-rose-400",
    },
    members: ["stanley-druckenmiller", "howard-marks", "michael-burry", "david-tepper"],
  },
  {
    key: "long-short",
    label: "Long-Short Equity",
    tagline: "Tiger Cub fundamental research. Long quality, short fraud.",
    color: "brand",
    colorClasses: {
      badge: "bg-brand/15 text-brand border border-brand/30",
      border: "border-brand/30 bg-brand/5 hover:bg-brand/10",
      text: "text-brand",
      headerText: "text-brand",
    },
    members: [
      "andreas-halvorsen",
      "stephen-mandel",
      "lee-ainslie",
      "chase-coleman",
      "john-armitage",
      "william-von-mueffling",
      "david-einhorn",
    ],
  },
];

type SchoolHolding = {
  ticker: string;
  name: string;
  sumPct: number;
  ownerCount: number;   // within the school
  contributors: { name: string; pct: number }[];
  convictionScore: number;
};

type SchoolComputed = SchoolMeta & {
  memberRecords: { slug: string; name: string; fund: string }[];
  holdings: SchoolHolding[];
  topHoldings: SchoolHolding[];
  totalSumPct: number;
};

function computeSchool(school: SchoolMeta): SchoolComputed {
  const managerBySlug = new Map(MANAGERS.map((m) => [m.slug, m]));
  const memberRecords = school.members
    .map((slug) => {
      const m = managerBySlug.get(slug);
      return m ? { slug: m.slug, name: m.name, fund: m.fund } : null;
    })
    .filter((x): x is { slug: string; name: string; fund: string } => !!x);

  // Sum pct per ticker across all members
  const agg: Map<
    string,
    { ticker: string; name: string; sumPct: number; contributors: { name: string; pct: number }[] }
  > = new Map();

  for (const slug of school.members) {
    const m = managerBySlug.get(slug);
    if (!m) continue;
    for (const h of m.topHoldings) {
      const key = h.ticker.toUpperCase();
      if (!agg.has(key)) {
        agg.set(key, { ticker: key, name: h.name, sumPct: 0, contributors: [] });
      }
      const cell = agg.get(key)!;
      cell.sumPct += h.pct;
      cell.contributors.push({ name: m.name, pct: h.pct });
    }
  }

  const holdings: SchoolHolding[] = Array.from(agg.values()).map((cell) => {
    cell.contributors.sort((a, b) => b.pct - a.pct);
    const conv = getConviction(cell.ticker);
    return {
      ticker: cell.ticker,
      name: cell.name,
      sumPct: cell.sumPct,
      ownerCount: cell.contributors.length,
      contributors: cell.contributors,
      convictionScore: conv.score,
    };
  });

  holdings.sort(
    (a, b) =>
      b.sumPct - a.sumPct ||
      b.ownerCount - a.ownerCount ||
      b.convictionScore - a.convictionScore,
  );

  const totalSumPct = holdings.reduce((s, h) => s + h.sumPct, 0);

  return {
    ...school,
    memberRecords,
    holdings,
    topHoldings: holdings.slice(0, 10),
    totalSumPct,
  };
}

export default function ByPhilosophyPage() {
  const computed = SCHOOLS.map(computeSchool);
  const totalManagers = computed.reduce((s, c) => s + c.memberRecords.length, 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        By philosophy · smart money by school
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        What does each investing school collectively own?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        HoldLens groups the {totalManagers} tracked superinvestors into{" "}
        <span className="text-text font-semibold">{computed.length} schools</span> by
        investing philosophy. Within each school, we sum top-holding weights across
        members and rank by collective conviction.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Dataroma treats every manager equally. The Buffett school and the Tiger Cub
        school should be read differently &mdash; different horizons, different exit
        rules, different risk profiles. The school-level view is where the strategy
        lives.
      </p>

      {/* School overview cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {computed.map((c) => (
          <a
            key={c.key}
            href={`#school-${c.key}`}
            className={`block rounded-2xl border ${c.colorClasses.border} p-5 transition`}
          >
            <div className="flex items-baseline justify-between mb-2">
              <div className={`text-[10px] uppercase tracking-widest font-bold ${c.colorClasses.text}`}>
                {c.label}
              </div>
              <div className={`text-xs font-semibold tabular-nums ${c.colorClasses.text}`}>
                {c.memberRecords.length} managers
              </div>
            </div>
            <div className="text-sm text-text leading-snug mb-3">{c.tagline}</div>
            <div className="flex flex-wrap gap-1">
              {c.memberRecords.slice(0, 6).map((m) => (
                <span
                  key={m.slug}
                  className="text-[10px] text-dim bg-bg/40 rounded px-1.5 py-0.5 border border-border"
                >
                  {m.name.split(" ").slice(-1)[0]}
                </span>
              ))}
              {c.memberRecords.length > 6 && (
                <span className="text-[10px] text-dim">+{c.memberRecords.length - 6}</span>
              )}
            </div>
          </a>
        ))}
      </div>

      <AdSlot format="horizontal" />

      {/* Per-school sections */}
      <div className="space-y-16 mt-12">
        {computed.map((c) => (
          <section key={c.key} id={`school-${c.key}`} className="scroll-mt-12">
            <div className={`text-xs uppercase tracking-widest font-semibold mb-3 ${c.colorClasses.headerText}`}>
              The {c.label}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Top holdings, aggregated across {c.memberRecords.length} managers
            </h2>
            <p className="text-sm text-muted mb-4">{c.tagline}</p>

            {/* Members strip */}
            <div className="flex flex-wrap gap-2 mb-5">
              {c.memberRecords.map((m) => (
                <a
                  key={m.slug}
                  href={`/investor/${m.slug}`}
                  className="inline-flex items-center gap-2 rounded border border-border bg-panel px-3 py-1.5 hover:border-brand transition text-[11px]"
                >
                  <span className="font-semibold text-text">{m.name}</span>
                  <span className="text-dim">· {m.fund}</span>
                </a>
              ))}
            </div>

            {c.topHoldings.length === 0 ? (
              <div className="rounded-2xl border border-border bg-panel p-8 text-center text-muted text-sm">
                No shared holdings in this school.
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-panel overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-bg/40 border-b border-border">
                    <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Ticker</th>
                      <th className="px-4 py-3 text-right">Sum wt</th>
                      <th className="px-4 py-3 text-right">Owners</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Top holder</th>
                      <th className="px-4 py-3 text-right">Conviction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.topHoldings.map((h, i) => (
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
                        <td className={`px-4 py-3 text-right tabular-nums font-semibold ${c.colorClasses.text}`}>
                          {h.sumPct.toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-text">
                          {h.ownerCount}/{c.memberRecords.length}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-[11px] text-muted truncate max-w-[14rem]">
                          {h.contributors[0]?.name} {h.contributors[0]?.pct.toFixed(1)}%
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-semibold tabular-nums ${
                            h.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {formatSignedScore(h.convictionScore)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Methodology */}
      <section className="mt-16 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          How schools are assigned
        </div>
        <h2 className="text-xl font-bold mb-3">Mutually exclusive, hand-classified</h2>
        <ul className="text-sm text-muted space-y-2 leading-relaxed mb-4">
          <li>
            <span className="text-text font-semibold">1. Philosophy strings.</span>{" "}
            Each tracked manager has a short philosophy line on record. We read it and
            place the manager in exactly one school.
          </li>
          <li>
            <span className="text-text font-semibold">2. Aggregate top holdings.</span>{" "}
            Within each school, sum every member&rsquo;s top-holding{" "}
            <span className="text-text">pct</span> across tickers. The ticker with the
            highest summed weight is the school&rsquo;s collective top pick.
          </li>
          <li>
            <span className="text-text font-semibold">3. Show top 10 per school.</span>{" "}
            Sorted by summed weight desc, tiebroken by owner count and ConvictionScore.
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          A manager can only belong to one school. Some edge cases (e.g.,{" "}
          <span className="text-text">Stephen Mandel</span>, a Tiger Cub who runs
          long-only GARP) get placed where the track-record fit is cleanest. The
          classification is curated, not automatic.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Not investment advice. School assignments reflect stated philosophy and
        track-record fit; managers may disagree with their placement.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
