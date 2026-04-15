import { redirect } from "next/navigation";
import { TICKER_INDEX } from "@/lib/tickers";

// /stock/[ticker] — SEO alias for /signal/[ticker].
//
// People search "AAPL stock", "NVDA stock", etc. This route captures
// that traffic and immediately sends them to the full signal dossier.
// Static export: generateStaticParams pre-renders one HTML page per
// ticker, each with an immediate redirect to /signal/[ticker].

export async function generateStaticParams() {
  return Object.keys(TICKER_INDEX).map((ticker) => ({ ticker }));
}

export default async function StockAlias({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  redirect(`/signal/${ticker.toUpperCase()}`);
}
