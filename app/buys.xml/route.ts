// RSS feed for buy signals. Forced static so it works with output: 'export'.
import { getBuySignals } from "@/lib/signals";
import { formatSignedScore } from "@/lib/conviction";
import { QUARTER_LABELS, LATEST_QUARTER, QUARTER_FILED } from "@/lib/moves";

export const dynamic = "force-static";

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const signals = getBuySignals().slice(0, 20);
  const quarterLabel = QUARTER_LABELS[LATEST_QUARTER];
  const filed = new Date(QUARTER_FILED[LATEST_QUARTER]).toUTCString();
  const now = new Date().toUTCString();

  const items = signals
    .map((s, i) => {
      const url = `https://holdlens.com/signal/${s.ticker}`;
      const scoreStr = formatSignedScore(s.score);
      const buyerLine =
        s.buyers.length > 0
          ? `${s.buyers.map((b) => b.managerName).join(", ")} ${s.buyers.length === 1 ? "is" : "are"} buying ${s.ticker} (${xmlEscape(s.name)}) this quarter.`
          : `${s.ticker} (${xmlEscape(s.name)}) carries a strong historical buy signal even without fresh activity this quarter.`;
      const title = `${s.ticker} BUY signal · score ${scoreStr} on a −100..+100 scale`;
      const desc =
        `${buyerLine} ` +
        `Unified ConvictionScore: ${scoreStr} (positive = buy, negative = sell). ` +
        (s.buyers.length > 0
          ? `Quality-weighted buyer list: ${s.buyers.map((b) => `${b.managerName} (Q${b.quality})`).join(", ")}.`
          : `Score reflects historical conviction, insider activity, and trend streaks.`);
      return `    <item>
      <title>${xmlEscape(title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}?rank=${i + 1}</guid>
      <description>${xmlEscape(desc)}</description>
      <pubDate>${filed}</pubDate>
      <category>${xmlEscape(s.sector || "Stocks")}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>HoldLens — What to buy (${quarterLabel})</title>
    <link>https://holdlens.com/buys</link>
    <atom:link href="https://holdlens.com/buys.xml" rel="self" type="application/rss+xml" />
    <description>Top buy signals from the best portfolio managers in the world — ranked on a single signed −100..+100 ConvictionScore where +100 is the strongest possible buy. Updated every 13F filing deadline.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${filed}</pubDate>
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
