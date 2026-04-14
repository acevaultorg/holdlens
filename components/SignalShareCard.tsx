"use client";
// SignalShareCard — per-ticker viral wedge on /signal/[ticker].
//
// Pattern mirrors PortfolioShareCard but scoped to ONE ticker's verdict. The
// card is a 1200x630 canvas-rendered PNG (Twitter + OpenGraph spec) with the
// ticker, verdict, unified signed score, buyer/seller counts, top streak
// highlight, and HoldLens branding. One click = download PNG + copy a
// pre-filled tweet that links back to this signal page.
//
// Why this component exists: /signal/[ticker] is the conversion surface we
// send traffic to. Every share of a BUY or SELL verdict card = brand impression
// × follower count, and the reader lands on the full dossier. Zero infra cost
// (runs on the user's device) and works under `output: 'export'`.
//
// Parent is a server component; all data is passed as props so this file does
// not import from @/lib/signals (keeps the client bundle lean — no moves
// dataset, no manager roster).

import { useEffect, useRef, useState } from "react";

export type SignalShareVerdict = "BUY" | "SELL" | "NEUTRAL";

type Props = {
  ticker: string;
  name: string;
  sector?: string;
  verdict: SignalShareVerdict;
  /** Signed −100..+100 unified ConvictionScore. */
  score: number;
  /** Short conviction label (e.g. "STRONG BUY", "WEAK SELL"). */
  convictionLabel: string;
  buyerCount: number;
  sellerCount: number;
  /** Max consecutive-quarter streak on this ticker in the verdict direction. 0 if none. */
  topStreak: number;
  /** Total tracked managers holding this ticker. */
  ownerCount: number;
};

export default function SignalShareCard({
  ticker,
  name,
  sector,
  verdict,
  score,
  convictionLabel,
  buyerCount,
  sellerCount,
  topStreak,
  ownerCount,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);
  const [downloadState, setDownloadState] = useState<"idle" | "done">("idle");
  const [copyState, setCopyState] = useState<"idle" | "done">("idle");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render to canvas whenever props change
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Twitter large card spec
    const W = 1200;
    const H = 630;
    canvas.width = W;
    canvas.height = H;

    // Verdict colors — mirror the page's verdict card palette
    const accent =
      verdict === "BUY" ? "#34d399" : verdict === "SELL" ? "#fb7185" : "#9ca3af";

    // Background — dark gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0a0a0a");
    grad.addColorStop(1, "#141414");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Brand strip top
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(0, 0, W, 6);

    // Logo + brand (top-left)
    ctx.fillStyle = "#fbbf24";
    ctx.font = 'bold 36px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText("◉", 60, 90);
    ctx.fillStyle = "#e5e5e5";
    ctx.font = 'bold 36px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText("HoldLens", 110, 90);

    // Tagline
    ctx.fillStyle = "#9ca3af";
    ctx.font = '18px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText("Signal dossier · what the best portfolio managers are doing", 60, 120);

    // Thin divider
    ctx.fillStyle = "#262626";
    ctx.fillRect(60, 150, W - 120, 1);

    // Ticker symbol (big, brand-colored)
    ctx.fillStyle = "#fbbf24";
    ctx.font = 'bold 144px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText(ticker, 60, 290);

    // Company name + sector (under ticker)
    ctx.fillStyle = "#e5e5e5";
    ctx.font = '26px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText(truncate(name, 40), 60, 330);
    if (sector) {
      ctx.fillStyle = "#6b7280";
      ctx.font = '18px -apple-system, "SF Pro Display", system-ui, sans-serif';
      ctx.fillText(sector, 60, 358);
    }

    // Right side: verdict badge + score (starts around x=680)
    const rightX = 680;

    // Verdict label
    ctx.fillStyle = "#9ca3af";
    ctx.font = '14px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText("HOLDLENS VERDICT", rightX, 200);

    // The big verdict word (BUY / SELL / NEUTRAL)
    ctx.fillStyle = accent;
    ctx.font = 'bold 96px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText(verdict, rightX, 290);

    // Signed score (prominent)
    ctx.fillStyle = "#9ca3af";
    ctx.font = '14px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText("SCORE · −100..+100 SCALE", rightX, 340);
    ctx.fillStyle = accent;
    ctx.font = 'bold 64px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText(formatSignedScore(score), rightX, 400);

    // Conviction label (STRONG BUY / WEAK SELL / etc)
    ctx.fillStyle = "#e5e5e5";
    ctx.font = 'bold 18px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText(convictionLabel, rightX, 430);

    // Bottom metrics row — buyer count, seller count, streak
    const metricsY = 510;
    ctx.fillStyle = "#262626";
    ctx.fillRect(60, metricsY - 30, W - 120, 1);

    drawMetric(ctx, 60, metricsY, "BUYERS", String(buyerCount), "#34d399");
    drawMetric(ctx, 260, metricsY, "SELLERS", String(sellerCount), "#fb7185");
    drawMetric(
      ctx,
      460,
      metricsY,
      "TOP STREAK",
      topStreak > 0 ? `${topStreak}Q` : "—",
      "#fbbf24"
    );
    drawMetric(ctx, 660, metricsY, "HELD BY", String(ownerCount), "#e5e5e5");

    // Bottom right: URL + tagline
    ctx.fillStyle = "#fbbf24";
    ctx.font = 'bold 22px -apple-system, "SF Pro Display", system-ui, sans-serif';
    const url = `holdlens.com/signal/${ticker}`;
    const urlW = ctx.measureText(url).width;
    ctx.fillText(url, W - 60 - urlW, H - 50);

    ctx.fillStyle = "#6b7280";
    ctx.font = '14px -apple-system, "SF Pro Display", system-ui, sans-serif';
    const tag = "Free · No signup · Live data";
    const tagW = ctx.measureText(tag).width;
    ctx.fillText(tag, W - 60 - tagW, H - 28);
  }, [
    mounted,
    ticker,
    name,
    sector,
    verdict,
    score,
    convictionLabel,
    buyerCount,
    sellerCount,
    topStreak,
    ownerCount,
  ]);

  function downloadCard() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `holdlens-${ticker.toLowerCase()}-signal.png`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadState("done");
      setTimeout(() => setDownloadState("idle"), 1500);
    }, "image/png");
    // Plausible custom event
    try {
      const w = window as Window & {
        plausible?: (name: string, opts?: object) => void;
      };
      w.plausible?.("Signal Share Download", { props: { ticker, verdict } });
    } catch {
      // ignore
    }
  }

  // Single composed string used for both copy AND tweet intent. Including the
  // URL in the text (rather than Twitter's separate url= param) guarantees the
  // pasted tweet is not a dead-end when copied to LinkedIn / Slack / Discord.
  const tweetText = composeTweet({
    ticker,
    verdict,
    score,
    convictionLabel,
    buyerCount,
    sellerCount,
    topStreak,
  });

  function copyPost() {
    navigator.clipboard.writeText(tweetText).then(
      () => {
        setCopyState("done");
        setTimeout(() => setCopyState("idle"), 1500);
      },
      () => {}
    );
  }

  function shareToX() {
    const url = `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    try {
      const w = window as Window & {
        plausible?: (name: string, opts?: object) => void;
      };
      w.plausible?.("Signal Share X", { props: { ticker, verdict } });
    } catch {
      // ignore
    }
  }

  function shareLinkedIn() {
    const urlToShare = `https://holdlens.com/signal/${ticker}`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(urlToShare)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    try {
      const w = window as Window & {
        plausible?: (name: string, opts?: object) => void;
      };
      w.plausible?.("Signal Share LinkedIn", { props: { ticker, verdict } });
    } catch {
      // ignore
    }
  }

  if (!mounted) {
    // SSR-safe placeholder — render a skeleton with the same aspect ratio to
    // avoid layout shift when the client bundle hydrates.
    return (
      <div className="rounded-2xl border border-border bg-panel p-6" aria-busy="true">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
          Share this signal
        </div>
        <div className="h-[2px] bg-border/40 rounded mb-5" />
        <div
          className="rounded-xl border border-border bg-bg/60"
          style={{ aspectRatio: "1200/630" }}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-brand/40 bg-brand/5 p-6">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
        Share this signal
      </div>
      <h3 className="text-xl font-bold mb-1">
        {ticker} · {verdict} · a card worth sharing
      </h3>
      <p className="text-sm text-muted mb-5">
        One-click PNG of the {ticker} verdict + score, a pre-filled post, and a direct link
        back to this dossier. Share it — every click is a new visitor.
      </p>

      {/* Card preview — scaled down */}
      <div className="rounded-xl border border-border bg-bg/60 overflow-hidden mb-5">
        <canvas
          ref={canvasRef}
          className="w-full h-auto block"
          style={{ aspectRatio: "1200/630" }}
          role="img"
          aria-label={`HoldLens ${verdict} signal card for ${ticker} (${name}). Unified ConvictionScore ${formatSignedScore(score)} on a −100 to +100 scale.`}
        />
      </div>

      {/* Pre-filled post */}
      <div className="mb-5">
        <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-2">
          Post preview (editable when posting)
        </div>
        <div className="rounded-lg border border-border bg-bg/60 p-4 text-sm text-text font-sans whitespace-pre-line">
          {composeTweet({ ticker, verdict, score, convictionLabel, buyerCount, sellerCount, topStreak })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          onClick={downloadCard}
          className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-text border border-border hover:border-brand/40 rounded-lg px-3 py-2.5 bg-panel transition"
        >
          {downloadState === "done" ? "Downloaded ✓" : "Download PNG"}
        </button>
        <button
          onClick={copyPost}
          className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-text border border-border hover:border-brand/40 rounded-lg px-3 py-2.5 bg-panel transition"
        >
          {copyState === "done" ? "Copied ✓" : "Copy post"}
        </button>
        <button
          onClick={shareToX}
          className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-text border border-border hover:border-brand/40 rounded-lg px-3 py-2.5 bg-panel transition"
        >
          Share to X
        </button>
        <button
          onClick={shareLinkedIn}
          className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-text border border-border hover:border-brand/40 rounded-lg px-3 py-2.5 bg-panel transition"
        >
          Share to LinkedIn
        </button>
      </div>
    </div>
  );
}

// ---------- helpers ----------

function drawMetric(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  value: string,
  color: string
) {
  ctx.fillStyle = "#9ca3af";
  ctx.font = '12px -apple-system, "SF Pro Display", system-ui, sans-serif';
  ctx.fillText(label, x, y);
  ctx.fillStyle = color;
  ctx.font = 'bold 40px -apple-system, "SF Pro Display", system-ui, sans-serif';
  ctx.fillText(value, x, y + 46);
}

function formatSignedScore(score: number): string {
  const rounded = Math.round(score);
  if (rounded > 0) return `+${rounded}`;
  if (rounded < 0) return `${rounded}`;
  return "0";
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

function composeTweet({
  ticker,
  verdict,
  score,
  convictionLabel,
  buyerCount,
  sellerCount,
  topStreak,
}: {
  ticker: string;
  verdict: SignalShareVerdict;
  score: number;
  convictionLabel: string;
  buyerCount: number;
  sellerCount: number;
  topStreak: number;
}): string {
  const scoreStr = formatSignedScore(score);
  const url = `https://holdlens.com/signal/${ticker}`;

  if (verdict === "BUY") {
    const streakLine =
      topStreak >= 2
        ? `\n\n${topStreak}+ consecutive quarters of buying from the best portfolio managers in the world.`
        : "";
    return `🟢 BUY on ${ticker} — score ${scoreStr} / +100 (${convictionLabel})\n\n${buyerCount} tracked manager${buyerCount === 1 ? "" : "s"} buying.${streakLine}\n\nFull dossier — free, no signup:\n${url}`;
  }
  if (verdict === "SELL") {
    const streakLine =
      topStreak >= 2
        ? `\n\n${topStreak}+ consecutive quarters of selling from the best portfolio managers in the world.`
        : "";
    return `🔴 SELL on ${ticker} — score ${scoreStr} / −100 (${convictionLabel})\n\n${sellerCount} tracked manager${sellerCount === 1 ? "" : "s"} selling.${streakLine}\n\nFull dossier — free, no signup:\n${url}`;
  }
  return `${ticker} — HoldLens verdict NEUTRAL · score ${scoreStr}\n\nMixed or absent signals from the best portfolio managers in the world. Full dossier:\n${url}`;
}
