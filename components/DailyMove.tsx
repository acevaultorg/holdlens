import Link from "next/link";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// Server component. Reads the daily snapshot at build time and renders
// a compact strip with today's portfolio move for a given investor slug
// OR today's price move for a given ticker symbol.
//
// Added to /investor/[slug]/ + /ticker/[X]/ pages to inject freshness
// signal (new dateModified per day = legit, not dateModified-spam).

type DailyData = {
  meta: { generated_at: string; trading_date: string };
  investors: Array<{
    slug: string;
    name: string;
    weightedDayPct: number;
    biggestLoser: { ticker: string; dayChangePct: number } | null;
    biggestWinner: { ticker: string; dayChangePct: number } | null;
  }>;
};

type MoversData = {
  meta: { generated_at: string; trading_date: string };
  all: Array<{ ticker: string; price: number; dayChangePct: number }>;
};

function loadDaily(): DailyData | null {
  const path = join(process.cwd(), "public", "api", "v1", "daily.json");
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as DailyData;
  } catch {
    return null;
  }
}

function loadMovers(): MoversData | null {
  const path = join(process.cwd(), "public", "api", "v1", "movers.json");
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as MoversData;
  } catch {
    return null;
  }
}

function pct(n: number): string {
  return `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
}
function colorFor(n: number): string {
  if (n > 0.5) return "text-green-400";
  if (n < -0.5) return "text-red-400";
  return "text-[#8892a0]";
}

export function DailyMoveForInvestor({ slug }: { slug: string }) {
  const daily = loadDaily();
  if (!daily) return null;
  const entry = daily.investors.find((i) => i.slug === slug);
  if (!entry) return null;

  return (
    <div className="bg-[#151c27] border border-[#1e2530] rounded-lg p-4 my-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-widest text-[#8892a0] font-semibold">
          Today — {daily.meta.trading_date}
        </div>
        <Link href="/today/" className="text-xs text-[#facc15] hover:underline">
          All movers →
        </Link>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 items-baseline">
        <div>
          <span className="text-xs text-[#8892a0] mr-2">Portfolio day:</span>
          <span className={`text-xl font-bold ${colorFor(entry.weightedDayPct)}`}>
            {pct(entry.weightedDayPct)}
          </span>
        </div>
        {entry.biggestWinner && (
          <div>
            <span className="text-xs text-[#8892a0] mr-2">Biggest winner:</span>
            <span className={`text-sm font-semibold ${colorFor(entry.biggestWinner.dayChangePct)}`}>
              <Link href={`/ticker/${entry.biggestWinner.ticker}/`} className="hover:text-[#facc15]">
                {entry.biggestWinner.ticker}
              </Link>{" "}
              {pct(entry.biggestWinner.dayChangePct)}
            </span>
          </div>
        )}
        {entry.biggestLoser && (
          <div>
            <span className="text-xs text-[#8892a0] mr-2">Biggest loser:</span>
            <span className={`text-sm font-semibold ${colorFor(entry.biggestLoser.dayChangePct)}`}>
              <Link href={`/ticker/${entry.biggestLoser.ticker}/`} className="hover:text-[#facc15]">
                {entry.biggestLoser.ticker}
              </Link>{" "}
              {pct(entry.biggestLoser.dayChangePct)}
            </span>
          </div>
        )}
      </div>
      <div className="text-xs text-[#8892a0] mt-2">
        Positions: Q4 2025 13F · Prices: EOD {daily.meta.trading_date}
      </div>
    </div>
  );
}

export function DailyMoveForTicker({ ticker }: { ticker: string }) {
  const movers = loadMovers();
  if (!movers) return null;
  const entry = movers.all.find((t) => t.ticker === ticker);
  if (!entry) return null;

  return (
    <div className="bg-[#151c27] border border-[#1e2530] rounded-lg p-4 my-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-widest text-[#8892a0] font-semibold">
          Today — {movers.meta.trading_date}
        </div>
        <Link href="/today/" className="text-xs text-[#facc15] hover:underline">
          All movers →
        </Link>
      </div>
      <div className="flex items-baseline gap-4">
        <div>
          <span className="text-xs text-[#8892a0] mr-2">Last:</span>
          <span className="text-xl font-bold">${entry.price.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-xs text-[#8892a0] mr-2">Day:</span>
          <span className={`text-xl font-bold ${colorFor(entry.dayChangePct)}`}>
            {pct(entry.dayChangePct)}
          </span>
        </div>
      </div>
      <div className="text-xs text-[#8892a0] mt-2">
        Source: Yahoo Finance EOD {movers.meta.trading_date}
      </div>
    </div>
  );
}

/** Helper to return the snapshot's generated_at ISO string — used by pages
 *  to set their schema.org dateModified honestly on days with fresh data. */
export function getDailySnapshotTimestamp(): string | null {
  const daily = loadDaily();
  return daily?.meta?.generated_at ?? null;
}
