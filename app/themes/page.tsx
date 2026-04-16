import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";
import FoundersNudge from "@/components/FoundersNudge";
import { MANAGERS } from "@/lib/managers";
import { MANAGER_QUALITY } from "@/lib/signals";
import { TICKER_INDEX } from "@/lib/tickers";
import { getConviction, formatSignedScore } from "@/lib/conviction";

// /themes — hand-curated ticker baskets, cross-referenced against tracked
// superinvestors. Each theme answers "what do smart money investors hold
// in [AI | Energy | Banks | China ADRs | Mag 7 | Healthcare | Defensive]?"
//
// This is a search-intent play. People Google "what AI stocks do hedge
// funds own" constantly. Dataroma doesn't group by theme — it groups by
// manager. HoldLens fills the gap.
//
// Aggregation: for each theme, sum topHoldings pct across member tickers
// across all managers. Rank members by summed pct. Also rank managers by
// their total theme exposure.

export const metadata: Metadata = {
  title: "Themes — smart money by investing theme (AI, Energy, Banks, Mag 7)",
  description:
    "What do the world's best hedge funds hold in AI, Energy, Banks, China, Magnificent 7, Healthcare? Ranked smart-money exposure by theme.",
  alternates: { canonical: "https://holdlens.com/themes" },
  openGraph: {
    title: "HoldLens themes — smart money by investing theme",
    description:
      "Curated theme baskets. What does smart money hold in AI? Energy? Banks? China ADRs?",
    url: "https://holdlens.com/themes",
    type: "article",
  },
  robots: { index: true, follow: true },
};

type ThemeKey =
  | "ai"
  | "magnificent-7"
  | "energy"
  | "banks"
  | "china-adr"
  | "healthcare"
  | "defensive"
  | "cloud";

type ThemeDef = {
  key: ThemeKey;
  label: string;
  tagline: string;
  color: "brand" | "emerald" | "rose" | "amber" | "sky";
  classes: { text: string; border: string; bg: string };
  tickers: string[];
};

const THEMES: ThemeDef[] = [
  {
    key: "ai",
    label: "AI & Accelerators",
    tagline: "Chips, models, tooling. The pick-and-shovel build-out.",
    color: "brand",
    classes: {
      text: "text-brand",
      border: "border-brand/30",
      bg: "bg-brand/5",
    },
    tickers: [
      "NVDA",
      "MSFT",
      "GOOGL",
      "GOOG",
      "META",
      "AMZN",
      "TSM",
      "AVGO",
      "AMD",
      "MU",
      "ASML",
      "COHR",
      "ESTC",
      "CRWD",
      "SNOW",
      "DDOG",
    ],
  },
  {
    key: "magnificent-7",
    label: "Magnificent 7",
    tagline: "The seven names that drove the index for two years.",
    color: "emerald",
    classes: {
      text: "text-emerald-400",
      border: "border-emerald-400/30",
      bg: "bg-emerald-400/5",
    },
    tickers: ["AAPL", "MSFT", "GOOGL", "GOOG", "AMZN", "NVDA", "META", "TSLA"],
  },
  {
    key: "energy",
    label: "Energy",
    tagline: "Oil, gas, pipelines. Cyclical cash cows.",
    color: "amber",
    classes: {
      text: "text-amber-400",
      border: "border-amber-400/30",
      bg: "bg-amber-400/5",
    },
    tickers: [
      "OXY",
      "CVX",
      "XOM",
      "COP",
      "EOG",
      "CVI",
      "PR",
      "SHEL",
      "WMB",
      "KMI",
      "VST",
      "FE",
      "TRMD",
    ],
  },
  {
    key: "banks",
    label: "Banks & Financials",
    tagline: "Deposits, loans, insurance, networks. The balance-sheet economy.",
    color: "sky",
    classes: {
      text: "text-sky-400",
      border: "border-sky-400/30",
      bg: "bg-sky-400/5",
    },
    tickers: [
      "JPM",
      "BAC",
      "WFC",
      "C",
      "GS",
      "MS",
      "COF",
      "SCHW",
      "AXP",
      "V",
      "MA",
      "MCO",
      "CB",
      "BRO",
      "FIS",
      "BRK.B",
      "BN",
      "FNF",
      "ALLY",
      "LNC",
    ],
  },
  {
    key: "china-adr",
    label: "China ADRs",
    tagline: "Contrarian bets on the second-largest economy.",
    color: "rose",
    classes: {
      text: "text-rose-400",
      border: "border-rose-400/30",
      bg: "bg-rose-400/5",
    },
    tickers: ["BABA", "JD", "BIDU", "TCEHY", "PDD", "NTES", "TME"],
  },
  {
    key: "healthcare",
    label: "Healthcare",
    tagline: "Payers, providers, pharma. Recession-resistant.",
    color: "emerald",
    classes: {
      text: "text-emerald-400",
      border: "border-emerald-400/30",
      bg: "bg-emerald-400/5",
    },
    tickers: ["UNH", "CVS", "DVA", "BHC", "VTRS", "HUM", "CI", "ELV", "MRK", "JNJ", "PFE", "LLY"],
  },
  {
    key: "defensive",
    label: "Consumer Defensive",
    tagline: "Brands you buy in a recession. Moats and dividends.",
    color: "brand",
    classes: {
      text: "text-brand",
      border: "border-brand/30",
      bg: "bg-brand/5",
    },
    tickers: ["KO", "PEP", "PM", "MO", "HSY", "KHC", "CL", "PG", "COST", "WMT", "DPZ"],
  },
  {
    key: "cloud",
    label: "Cloud & SaaS",
    tagline: "Infrastructure and subscription compounders.",
    color: "sky",
    classes: {
      text: "text-sky-400",
      border: "border-sky-400/30",
      bg: "bg-sky-400/5",
    },
    tickers: ["MSFT", "AMZN", "GOOGL", "CRM", "NOW", "ADBE", "ORCL", "DDOG", "SNOW", "CFLT", "MDB", "NET"],
  },
];

type MemberRanked = {
  ticker: string;
  name: string;
  ownerCount: number;
  sumPct: number;
  convictionScore: number;
};

type ManagerRanked = {
  slug: string;
  name: string;
  fund: string;
  quality: number;
  totalPct: number;
  holdings: { ticker: string; pct: number }[];
};

type ThemeComputed = ThemeDef & {
  members: MemberRanked[];
  topManagers: ManagerRanked[];
  totalManagerExposure: number;
  managerCount: number;
};

function computeTheme(theme: ThemeDef): ThemeComputed {
  const tickerSet = new Set(theme.tickers.map((t) => t.toUpperCase()));

  // Members: aggregate across all managers' topHoldings
  const memberAgg = new Map<string, { name: string; sumPct: number; ownerCount: number }>();
  // Managers: aggregate theme exposure per manager
  const managerAgg = new Map<
    string,
    { slug: string; name: string; fund: string; quality: number; totalPct: number; holdings: { ticker: string; pct: number }[] }
  >();

  for (const m of MANAGERS) {
    let managerTotal = 0;
    const managerHoldings: { ticker: string; pct: number }[] = [];
    for (const h of m.topHoldings) {
      const t = h.ticker.toUpperCase();
      if (!tickerSet.has(t)) continue;
      // Member aggregation
      if (!memberAgg.has(t)) {
        memberAgg.set(t, { name: h.name, sumPct: 0, ownerCount: 0 });
      }
      const cell = memberAgg.get(t)!;
      cell.sumPct += h.pct;
      cell.ownerCount++;
      // Manager aggregation
      managerTotal += h.pct;
      managerHoldings.push({ ticker: t, pct: h.pct });
    }
    if (managerTotal > 0) {
      managerAgg.set(m.slug, {
        slug: m.slug,
        name: m.name,
        fund: m.fund,
        quality: MANAGER_QUALITY[m.slug] ?? 6,
        totalPct: managerTotal,
        holdings: managerHoldings.sort((a, b) => b.pct - a.pct),
      });
    }
  }

  const members: MemberRanked[] = Array.from(memberAgg.entries())
    .map(([ticker, v]) => ({
      ticker,
      name: v.name,
      sumPct: v.sumPct,
      ownerCount: v.ownerCount,
      convictionScore: getConviction(ticker).score,
    }))
    .sort(
      (a, b) =>
        b.sumPct - a.sumPct ||
        b.ownerCount - a.ownerCount ||
        b.convictionScore - a.convictionScore,
    );

  const topManagers: ManagerRanked[] = Array.from(managerAgg.values())
    .sort((a, b) => b.totalPct - a.totalPct || b.quality - a.quality)
    .slice(0, 6);

  const totalManagerExposure = Array.from(managerAgg.values()).reduce(
    (s, v) => s + v.totalPct,
    0,
  );

  return {
    ...theme,
    members,
    topManagers,
    totalManagerExposure,
    managerCount: managerAgg.size,
  };
}

export default function ThemesPage() {
  const computed = THEMES.map(computeTheme);
  const totalThemes = computed.length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Themes · smart money by sector bet
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        What does smart money hold, by theme?
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-4">
        HoldLens cross-references {totalThemes} hand-curated theme baskets &mdash;
        AI, Magnificent 7, Energy, Banks, China ADRs, Healthcare, Defensive,
        Cloud &mdash; against every tracked superinvestor. For each theme, you
        get the ranked members (biggest aggregate weight) and the managers with
        the heaviest exposure.
      </p>
      <p className="text-dim text-sm max-w-2xl mb-10">
        Dataroma groups by manager. HoldLens adds the theme layer &mdash; the
        question isn&rsquo;t just &ldquo;what does Buffett own,&rdquo; but &ldquo;which
        superinvestors are the AI bulls right now, and which names are they
        actually buying?&rdquo;
      </p>

      {/* Jump nav */}
      <div className="flex flex-wrap gap-2 mb-10">
        {computed.map((t) => (
          <a
            key={t.key}
            href={`#theme-${t.key}`}
            className={`inline-flex items-center gap-2 rounded-lg border ${t.classes.border} ${t.classes.bg} px-3 py-2 hover:opacity-80 transition text-xs`}
          >
            <span className={`font-semibold ${t.classes.text}`}>{t.label}</span>
            <span className="text-dim tabular-nums">
              {t.managerCount}mgrs · {t.totalManagerExposure.toFixed(0)}%
            </span>
          </a>
        ))}
      </div>

      <FoundersNudge tone="emerald" context="You're looking at curated smart-money themes — AI, Mag 7, Energy, Banks, Healthcare and more." />
      <AdSlot format="horizontal" />

      {/* Per-theme sections */}
      <div className="space-y-16 mt-12">
        {computed.map((t) => (
          <section key={t.key} id={`theme-${t.key}`} className="scroll-mt-12">
            <div className={`text-xs uppercase tracking-widest font-semibold mb-3 ${t.classes.text}`}>
              {t.label}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {t.managerCount} managers · {t.totalManagerExposure.toFixed(1)}% total exposure
            </h2>
            <p className="text-sm text-muted mb-4">{t.tagline}</p>

            {t.members.length === 0 ? (
              <div className="rounded-2xl border border-border bg-panel p-8 text-center text-muted text-sm">
                No tracked superinvestors hold any{" "}
                <span className="text-text">{t.label}</span> members in their top
                holdings.
              </div>
            ) : (
              <>
                {/* Member table */}
                <div className="rounded-2xl border border-border bg-panel overflow-hidden mb-5">
                  <div className="px-4 py-3 border-b border-border bg-bg/40 text-[10px] uppercase tracking-wider text-dim font-semibold">
                    Top members · {t.members.length} held · ranked by summed weight
                  </div>
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr className="text-[10px] uppercase tracking-wider text-dim font-semibold">
                        <th className="px-4 py-3 text-left">#</th>
                        <th className="px-4 py-3 text-left">Ticker</th>
                        <th className="px-4 py-3 text-right">Sum wt</th>
                        <th className="px-4 py-3 text-right">Owners</th>
                        <th className="px-4 py-3 text-right hidden md:table-cell">Conviction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.members.slice(0, 12).map((m, i) => (
                        <tr
                          key={m.ticker}
                          className="border-b border-border last:border-0 hover:bg-bg/40 transition"
                        >
                          <td className="px-4 py-3 text-dim tabular-nums">{i + 1}</td>
                          <td className="px-4 py-3">
                            <a
                              href={`/signal/${m.ticker}`}
                              className="font-mono font-semibold text-brand hover:underline"
                            >
                              {m.ticker}
                            </a>
                            <div className="text-[11px] text-dim truncate max-w-[14rem]">
                              {m.name}
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-right tabular-nums font-semibold ${t.classes.text}`}>
                            {m.sumPct.toFixed(1)}%
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums text-text">
                            {m.ownerCount}
                          </td>
                          <td
                            className={`px-4 py-3 text-right font-semibold tabular-nums hidden md:table-cell ${
                              m.convictionScore >= 0 ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {formatSignedScore(m.convictionScore)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Top managers in theme */}
                {t.topManagers.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-2">
                      Top 6 managers by theme exposure
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {t.topManagers.map((mgr, i) => (
                        <a
                          key={mgr.slug}
                          href={`/investor/${mgr.slug}`}
                          className={`block rounded-xl border ${t.classes.border} ${t.classes.bg} p-4 hover:opacity-80 transition`}
                        >
                          <div className="flex items-baseline justify-between gap-2 mb-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-[10px] text-dim font-semibold">
                                #{i + 1}
                              </span>
                              <span className="text-sm font-bold text-text">
                                {mgr.name}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-semibold">
                                q{mgr.quality}
                              </span>
                            </div>
                            <span className={`text-sm font-bold tabular-nums ${t.classes.text}`}>
                              {mgr.totalPct.toFixed(1)}%
                            </span>
                          </div>
                          <div className="text-[10px] text-dim mb-2">{mgr.fund}</div>
                          <div className="flex flex-wrap gap-1">
                            {mgr.holdings.slice(0, 6).map((h) => (
                              <span
                                key={h.ticker}
                                className="text-[10px] font-mono text-text bg-bg/40 rounded px-1.5 py-0.5 border border-border"
                              >
                                {h.ticker} {h.pct.toFixed(1)}
                              </span>
                            ))}
                            {mgr.holdings.length > 6 && (
                              <span className="text-[10px] text-dim">
                                +{mgr.holdings.length - 6}
                              </span>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        ))}
      </div>

      {/* Methodology */}
      <section className="mt-16 rounded-2xl border border-border bg-panel p-6">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          How themes are curated
        </div>
        <h2 className="text-xl font-bold mb-3">Hand-curated ticker lists</h2>
        <ul className="text-sm text-muted space-y-2 leading-relaxed mb-4">
          <li>
            <span className="text-text font-semibold">1. Ticker lists.</span>{" "}
            Each theme has a hand-curated list of symbols that most observers
            would agree belong to the theme. Not algorithmic &mdash; we choose to
            surface the obvious AI names, not every stock with an AI mention.
          </li>
          <li>
            <span className="text-text font-semibold">2. Membership.</span>{" "}
            Tickers can belong to more than one theme (MSFT is in AI, Mag 7,
            and Cloud). We don&rsquo;t double-count aggregate exposure across
            themes &mdash; each theme is read independently.
          </li>
          <li>
            <span className="text-text font-semibold">3. Ranking within theme.</span>{" "}
            Members ranked by summed top-holding pct across all tracked
            managers, tiebroken by owner count and live ConvictionScore.
            Managers ranked by their own total exposure to the theme.
          </li>
        </ul>
        <p className="text-sm text-muted leading-relaxed">
          The theme list is opinionated. If a theme is missing &mdash; say,
          uranium or lithium &mdash; open a{" "}
          <a href="/contact" className="underline">contact form</a> and we&rsquo;ll
          consider adding it.
        </p>
      </section>

      <p className="text-xs text-dim mt-12">
        Not investment advice. Theme membership reflects curated editorial
        choices, not a systematic classification.{" "}
        <a href="/methodology" className="underline">Methodology</a>.
      </p>
    </div>
  );
}
