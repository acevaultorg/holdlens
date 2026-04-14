// Per-manager RSS feed — one feed per tracked investor. Subscribable move alerts
// without email signup. Dataroma has a single universal feed; HoldLens offers
// per-manager syndication so users can follow exactly the investors they care about.
//
// Route: /investor/[slug]/feed.xml — dynamic segment, fully pre-rendered via
// generateStaticParams. warren-buffett routes here too (no dedicated feed page).

import { MANAGERS, getManager } from "@/lib/managers";
import { getMovesByManager, QUARTER_LABELS, QUARTER_FILED, type Quarter } from "@/lib/moves";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return MANAGERS.map((m) => ({ slug: m.slug }));
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

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const manager = getManager(slug);
  if (!manager) {
    return new Response("Not found", { status: 404 });
  }

  // Pull last 4 quarters of moves, newest first.
  const moves = getMovesByManager(slug)
    .slice()
    .sort((a, b) => (a.quarter < b.quarter ? 1 : a.quarter > b.quarter ? -1 : 0))
    .slice(0, 40);

  const now = new Date().toUTCString();
  const feedUrl = `https://holdlens.com/investor/${slug}/feed.xml`;
  const profileUrl = `https://holdlens.com/investor/${slug}`;

  const items = moves
    .map((mv, i) => {
      const ticker = mv.ticker;
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
      const title = `${manager.name}: ${verb} ${ticker}${deltaStr} · ${qLabel}`;
      const desc =
        `${manager.name} (${manager.fund}) ${verb.toLowerCase()} ${ticker}` +
        (mv.name ? ` (${xmlEscape(mv.name)})` : "") +
        ` in ${qLabel}${impactStr}.` +
        (mv.note ? ` ${xmlEscape(mv.note)}` : "");
      const url = `https://holdlens.com/signal/${ticker}`;
      // Unique GUID so feed readers treat each quarter's move on the same ticker as distinct.
      const guid = `${profileUrl}#${mv.quarter}-${ticker}-${mv.action}-${i}`;
      return `    <item>
      <title>${xmlEscape(title)}</title>
      <link>${url}</link>
      <guid isPermaLink="false">${guid}</guid>
      <description>${xmlEscape(desc)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${xmlEscape(mv.action)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(manager.name)} — 13F moves · HoldLens</title>
    <link>${profileUrl}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Every 13F move by ${xmlEscape(manager.name)} (${xmlEscape(manager.fund)}) — buys, adds, trims, exits — as filed with the SEC. Updated after each quarterly filing. Not investment advice.</description>
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
