// Per-ticker RSS feed — one feed per tracked symbol. Subscribable "who's buying
// or selling this ticker" firehose without email signup.
//
// Route: /ticker/[symbol]/feed.xml — dynamic segment pre-rendered for every
// ticker in TICKER_INDEX via generateStaticParams. Mirrors the per-manager
// feed architecture (app/investor/[slug]/feed.xml) so power users can follow
// either dimension.
//
// Why this matters for retention (Layer 2 in the "line always goes up" plan):
// the per-ticker feed is the lowest-friction return trigger for a user who's
// researching AAPL, NVDA, or any single stock — no account, no email, no app
// required. Every time a new 13F lands moving that ticker, their feed reader
// pulls the update and re-engages them with HoldLens. This compounds.
//
// Retention Oracle archetype: notification_quality × +0.025 × user_reach.
// Low absolute user count (power users who use RSS) but very high per-user
// retention lift — RSS users tend to come back weekly.

import { TICKER_INDEX } from "@/lib/tickers";
import { getMovesByTicker } from "@/lib/moves";
import { getManager } from "@/lib/managers";
import { QUARTER_LABELS, QUARTER_FILED, type Quarter } from "@/lib/moves";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return Object.keys(TICKER_INDEX).map((symbol) => ({ symbol }));
}

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function actionVerb(action: "new" | "add" | "trim" | "exit"): string {
  switch (action) {
    case "new":
      return "NEW POSITION";
    case "add":
      return "ADDED";
    case "trim":
      return "TRIMMED";
    case "exit":
      return "EXITED";
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const sym = symbol.toUpperCase();
  const tickerInfo = TICKER_INDEX[sym];
  if (!tickerInfo) {
    return new Response("Not found", { status: 404 });
  }

  // Pull last 40 moves on this ticker, newest quarter first. Tie-break by
  // largest |deltaPct| so the most consequential moves lead the feed within
  // a quarter (shareChange would overweight mega-cap positions irrelevantly).
  const moves = getMovesByTicker(sym)
    .slice()
    .sort((a, b) => {
      if (a.quarter !== b.quarter) return a.quarter < b.quarter ? 1 : -1;
      const aDelta = Math.abs(a.deltaPct ?? 0);
      const bDelta = Math.abs(b.deltaPct ?? 0);
      return bDelta - aDelta;
    })
    .slice(0, 40);

  const now = new Date().toUTCString();
  const feedUrl = `https://holdlens.com/ticker/${sym}/feed.xml`;
  const tickerUrl = `https://holdlens.com/ticker/${sym}`;

  const items = moves
    .map((mv, i) => {
      const manager = getManager(mv.managerSlug);
      const managerName = manager?.name ?? mv.managerSlug;
      const fund = manager?.fund ?? "";
      const qLabel = QUARTER_LABELS[mv.quarter as Quarter] ?? mv.quarter;
      const filed = QUARTER_FILED[mv.quarter as Quarter];
      const pubDate = filed ? new Date(filed).toUTCString() : now;
      const verb = actionVerb(mv.action);
      const deltaStr =
        mv.deltaPct != null
          ? ` (${mv.deltaPct > 0 ? "+" : ""}${mv.deltaPct.toFixed(0)}%)`
          : "";
      const impactStr =
        mv.portfolioImpactPct != null
          ? ` · ${mv.portfolioImpactPct.toFixed(1)}% of portfolio`
          : "";
      const title = `${managerName}: ${verb} ${sym}${deltaStr} · ${qLabel}`;
      const desc =
        `${managerName}${fund ? ` (${xmlEscape(fund)})` : ""} ${verb.toLowerCase()} ${sym} in ${qLabel}${impactStr}.` +
        (mv.note ? ` ${xmlEscape(mv.note)}` : "");
      // Link to /signal/[ticker] — the consensus view, richer than the
      // per-ticker page for a feed reader click-through.
      const url = `https://holdlens.com/signal/${sym}`;
      // Unique GUID so each quarter's move by each manager is a distinct item.
      const guid = `${tickerUrl}#${mv.quarter}-${mv.managerSlug}-${mv.action}-${i}`;
      return `    <item>
      <title>${xmlEscape(title)}</title>
      <link>${url}</link>
      <guid isPermaLink="false">${guid}</guid>
      <description>${xmlEscape(desc)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${xmlEscape(mv.action)}</category>
      <author>noreply@holdlens.com (${xmlEscape(managerName)})</author>
    </item>`;
    })
    .join("\n");

  const tickerName = tickerInfo.name ?? sym;
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(sym)} — Smart money 13F moves · HoldLens</title>
    <link>${tickerUrl}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Every 13F move on ${xmlEscape(sym)}${tickerName !== sym ? ` (${xmlEscape(tickerName)})` : ""} by the 30 tracked portfolio managers — buys, adds, trims, exits — as filed with the SEC. Updated after each quarterly filing wave. Not investment advice.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
