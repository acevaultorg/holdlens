"use client";
// PortfolioShareCard — the viral wedge.
//
// Generates a branded PNG image of the user's portfolio (rendered to <canvas>),
// downloads it, and pre-fills a tweet text. Each share = brand impression × the
// user's follower count, distributed across networks.
//
// Why canvas (not server-rendered): static export, no backend, runs on the user's
// device with their localStorage data. Zero infrastructure cost. Works offline.
//
// The card content is designed to be FLEX-WORTHY:
//   - Total portfolio value (live)
//   - Today's P&L (the dopamine hit)
//   - "Smart money agrees with X of N stocks" (social proof + utility)
//   - HoldLens branding bottom-right
//
// Sharing pattern: tweet = "My portfolio: $X · +Y% today · Z BUY signals matching
// the world's best PMs. holdlens.com/portfolio". The reader sees the card as the
// twitter card image (since we export PNG), reads the brand-rich tweet, clicks through.

import { useEffect, useRef, useState } from "react";
import { getProfile, subscribeProfile, type Holding } from "@/lib/profile";
import { getQuotes, type LiveQuote } from "@/lib/live";
import { getNetSignal } from "@/lib/signals";

export default function PortfolioShareCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [quotes, setQuotes] = useState<Record<string, LiveQuote | null>>({});
  const [mounted, setMounted] = useState(false);
  const [downloadState, setDownloadState] = useState<"idle" | "done">("idle");
  const [copyState, setCopyState] = useState<"idle" | "done">("idle");

  useEffect(() => {
    setMounted(true);
    setHoldings(getProfile().holdings);
    return subscribeProfile((p) => setHoldings(p.holdings));
  }, []);

  useEffect(() => {
    if (holdings.length === 0) return;
    let cancelled = false;
    async function load() {
      const symbols = holdings.map((h) => h.ticker);
      const q = await getQuotes(symbols, "1mo");
      if (!cancelled) setQuotes(q);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [holdings.map((h) => h.ticker).join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  // Compute totals
  const totals = (() => {
    let value = 0;
    let prevValue = 0;
    let buyCount = 0;
    let sellCount = 0;
    for (const h of holdings) {
      const q = quotes[h.ticker.toUpperCase()];
      if (q) {
        value += q.price * h.shares;
        prevValue += q.prevClose * h.shares;
      }
      const sig = getNetSignal(h.ticker);
      if (sig?.direction === "BUY") buyCount++;
      else if (sig?.direction === "SELL") sellCount++;
    }
    const dayPnL = value - prevValue;
    const dayPct = prevValue > 0 ? (dayPnL / prevValue) * 100 : 0;
    return { value, dayPnL, dayPct, buyCount, sellCount, count: holdings.length };
  })();

  // Render to canvas whenever data changes
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Twitter card spec: 1200x630 or 1200x675
    const W = 1200;
    const H = 630;
    canvas.width = W;
    canvas.height = H;

    // Background — dark with subtle gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0a0a0a");
    grad.addColorStop(1, "#141414");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Brand strip top
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(0, 0, W, 6);

    // Logo + brand
    ctx.fillStyle = "#fbbf24";
    ctx.font = 'bold 36px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText("◉", 60, 90);
    ctx.fillStyle = "#e5e5e5";
    ctx.font = 'bold 36px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText("HoldLens", 110, 90);

    // Tagline
    ctx.fillStyle = "#9ca3af";
    ctx.font = '20px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText("My portfolio · cross-checked with the best PMs in the world", 60, 124);

    if (holdings.length === 0) {
      // Empty state
      ctx.fillStyle = "#6b7280";
      ctx.font = '32px -apple-system, "SF Pro Display", system-ui, sans-serif';
      ctx.fillText("Add your stocks at holdlens.com/portfolio", 60, 350);
      return;
    }

    // Big total value
    ctx.fillStyle = "#9ca3af";
    ctx.font = '14px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText("PORTFOLIO VALUE", 60, 200);
    ctx.fillStyle = "#e5e5e5";
    ctx.font = 'bold 88px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText(fmtMoney(totals.value), 60, 290);

    // Day P&L pill
    const pnlColor = totals.dayPnL >= 0 ? "#34d399" : "#fb7185";
    const pnlText = `${totals.dayPnL >= 0 ? "▲" : "▼"} ${fmtMoney(Math.abs(totals.dayPnL))} (${totals.dayPct >= 0 ? "+" : ""}${totals.dayPct.toFixed(2)}%)`;
    ctx.fillStyle = pnlColor;
    ctx.font = 'bold 32px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText(pnlText, 60, 340);
    ctx.fillStyle = "#6b7280";
    ctx.font = '16px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText("today", 60, 370);

    // Smart money signals — the social proof
    const sigY = 430;
    ctx.fillStyle = "#9ca3af";
    ctx.font = '14px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText("SMART MONEY SIGNALS", 60, sigY);

    // Big number
    ctx.fillStyle = "#fbbf24";
    ctx.font = 'bold 48px -apple-system, "SF Pro Display", system-ui, sans-serif';
    const sigText = `${totals.buyCount} of my ${totals.count} stocks have BUY signals`;
    ctx.fillText(sigText, 60, sigY + 50);

    // From the best in the world
    ctx.fillStyle = "#9ca3af";
    ctx.font = '20px -apple-system, "SF Pro Display", system-ui, sans-serif';
    ctx.fillText("from the best portfolio managers in the world", 60, sigY + 80);

    // Bottom right: URL
    ctx.fillStyle = "#fbbf24";
    ctx.font = 'bold 24px -apple-system, "SF Pro Display", system-ui, sans-serif';
    const url = "holdlens.com";
    const urlW = ctx.measureText(url).width;
    ctx.fillText(url, W - 60 - urlW, H - 50);

    // Bottom right tagline
    ctx.fillStyle = "#6b7280";
    ctx.font = '14px -apple-system, "SF Pro Display", system-ui, sans-serif';
    const tag = "Free · No signup · Live data";
    const tagW = ctx.measureText(tag).width;
    ctx.fillText(tag, W - 60 - tagW, H - 28);
  }, [holdings, quotes, totals.value, totals.dayPnL, totals.dayPct, totals.buyCount, totals.count, mounted]);

  function downloadCard() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "holdlens-portfolio.png";
      a.click();
      URL.revokeObjectURL(url);
      setDownloadState("done");
      setTimeout(() => setDownloadState("idle"), 1500);
    }, "image/png");
  }

  function copyTweet() {
    const text = composeTweet(totals);
    navigator.clipboard.writeText(text).then(
      () => {
        setCopyState("done");
        setTimeout(() => setCopyState("idle"), 1500);
      },
      () => {}
    );
  }

  function shareTwitter() {
    const text = composeTweet(totals);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://holdlens.com/portfolio")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (!mounted) return null;
  if (holdings.length === 0) return null;

  return (
    <div className="rounded-2xl border border-brand/40 bg-brand/5 p-6">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-2">
        Share your portfolio
      </div>
      <h3 className="text-xl font-bold mb-1">A flex-worthy card · ready to tweet</h3>
      <p className="text-sm text-muted mb-5">
        We rendered a branded PNG of your portfolio + a pre-formatted tweet. Download it, share it,
        every click drives a new visitor.
      </p>

      {/* Card preview — scaled down */}
      <div className="rounded-xl border border-border bg-bg/60 overflow-hidden mb-5">
        <canvas
          ref={canvasRef}
          className="w-full h-auto block"
          style={{ aspectRatio: "1200/630" }}
        />
      </div>

      {/* Pre-filled tweet */}
      <div className="mb-5">
        <div className="text-[10px] uppercase tracking-wider text-dim font-semibold mb-2">
          Tweet preview (editable when posting)
        </div>
        <div className="rounded-lg border border-border bg-bg/60 p-4 text-sm text-text font-sans whitespace-pre-line">
          {composeTweet(totals)}
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
          onClick={copyTweet}
          className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-text border border-border hover:border-brand/40 rounded-lg px-3 py-2.5 bg-panel transition"
        >
          {copyState === "done" ? "Copied ✓" : "Copy tweet"}
        </button>
        <button
          onClick={shareTwitter}
          className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-text border border-border hover:border-brand/40 rounded-lg px-3 py-2.5 bg-panel transition"
        >
          Share to Twitter
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

function fmtMoney(n: number): string {
  if (Math.abs(n) >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function composeTweet(totals: { value: number; dayPnL: number; dayPct: number; buyCount: number; sellCount: number; count: number }): string {
  const valueStr = fmtMoney(totals.value);
  const dayStr = `${totals.dayPnL >= 0 ? "+" : ""}${totals.dayPct.toFixed(2)}%`;

  if (totals.buyCount > 0) {
    return `My portfolio: ${valueStr} · ${dayStr} today\n\n${totals.buyCount} of my ${totals.count} stocks have BUY signals from the best portfolio managers in the world.\n\nBuilt on holdlens.com — free, live data, no signup`;
  }
  return `My portfolio: ${valueStr} · ${dayStr} today\n\nCross-checked against ${30} of the best portfolio managers in the world on holdlens.com — free, live data, no signup.`;
}
