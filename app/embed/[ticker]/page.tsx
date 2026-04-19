import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TICKER_INDEX } from "@/lib/tickers";
import { getConviction, convictionLabel, formatSignedScore } from "@/lib/conviction";

export async function generateStaticParams() {
  return Object.keys(TICKER_INDEX).map((ticker) => ({ ticker }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>;
}): Promise<Metadata> {
  const { ticker } = await params;
  const sym = ticker.toUpperCase();
  const td = TICKER_INDEX[sym];
  if (!td) return { title: "Not found" };
  return {
    title: `${sym} ConvictionScore — HoldLens`,
    description: `${sym} conviction badge — 30 superinvestors, one signed score.`,
    robots: { index: false, follow: false },
  };
}

// Colour tokens — must match globals.css so the widget is on-brand
const COLOR = {
  emerald: { text: "#34d399", bg: "rgba(52,211,153,0.10)", border: "rgba(52,211,153,0.25)" },
  rose:    { text: "#fb7185", bg: "rgba(251,113,133,0.10)", border: "rgba(251,113,133,0.25)" },
  muted:   { text: "#9ca3af", bg: "transparent",           border: "rgba(156,163,175,0.20)" },
} as const;

export default async function EmbedTickerPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const sym = ticker.toUpperCase();
  if (!TICKER_INDEX[sym]) notFound();

  const conviction = getConviction(sym);
  const { label, color } = convictionLabel(conviction.score);
  const signed = formatSignedScore(conviction.score);
  const c = COLOR[color as keyof typeof COLOR] ?? COLOR.muted;

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-5 text-center select-none"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Big signed score */}
      <div
        className="font-black tabular-nums leading-none mb-2"
        style={{ fontSize: "clamp(3rem,12vw,4.5rem)", color: c.text }}
      >
        {signed}
      </div>

      {/* Verdict pill */}
      <div
        className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5"
        style={{ color: c.text, background: c.bg, border: `1px solid ${c.border}` }}
      >
        {label}
      </div>

      {/* Ticker + name */}
      <div className="font-bold mb-0.5" style={{ color: "#e5e5e5", fontSize: "0.95rem" }}>
        {sym}
      </div>
      <div
        className="mb-3 overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px]"
        style={{ color: "#9ca3af", fontSize: "0.78rem" }}
      >
        {conviction.name}
      </div>

      {/* Owner count */}
      <div className="mb-5" style={{ color: "#6b7280", fontSize: "0.72rem" }}>
        {conviction.ownerCount} / 30 superinvestors hold
      </div>

      {/* Divider */}
      <div className="w-8 mb-4" style={{ height: "1px", background: "#262626" }} />

      {/* Attribution — opens full signal page in new tab */}
      <a
        href={`https://holdlens.com/signal/${sym}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-70"
        style={{ color: "#fbbf24", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.05em" }}
      >
        holdlens.com ↗
      </a>
    </div>
  );
}
