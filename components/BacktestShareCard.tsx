"use client";
// BacktestShareCard — viral share card for backtest results.
//
// Renders a 1200x630 canvas PNG with the manager name, investment amount,
// final value, multiple, CAGR, and vs S&P comparison. Download + tweet + share.
// Pattern follows SignalShareCard. Works under `output: 'export'`.

import { useEffect, useRef, useState } from "react";

type Props = {
  managerName: string;
  startYear: number;
  amount: number;
  finalValue: number;
  multiple: number;
  cagr: number;
  spyFinal: number;
  spyMultiple: number;
  years: number;
};

const W = 1200;
const H = 630;

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function BacktestShareCard({
  managerName,
  startYear,
  amount,
  finalValue,
  multiple,
  cagr,
  spyFinal,
  spyMultiple,
  years,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  const beat = finalValue > spyFinal;
  const beatAmount = Math.abs(finalValue - spyFinal);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, W, H);

    // Brand
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
    ctx.fillText("◉", 48, 60);
    ctx.fillStyle = "#e5e5e5";
    ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
    ctx.fillText("HoldLens", 84, 60);

    // Sector tag
    ctx.fillStyle = "#6b7280";
    ctx.font = "600 14px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("BACKTEST SIMULATOR", W - 56, 58);
    ctx.textAlign = "left";

    // Manager name
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 56px system-ui, -apple-system, sans-serif";
    ctx.fillText(managerName, 56, 130);

    // Scenario line
    ctx.fillStyle = "#9ca3af";
    ctx.font = "400 20px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${fmt(amount)} invested in ${startYear} · ${years} years`, 56, 170);

    // Result box
    const boxY = 200;
    const boxH = 240;
    const resultColor = beat ? "#34d399" : "#fb7185";
    ctx.fillStyle = beat ? "rgba(52,211,153,0.06)" : "rgba(251,113,133,0.06)";
    roundRect(ctx, 48, boxY, W - 96, boxH, 16);
    ctx.fill();
    ctx.strokeStyle = beat ? "rgba(52,211,153,0.2)" : "rgba(251,113,133,0.2)";
    ctx.lineWidth = 2;
    roundRect(ctx, 48, boxY, W - 96, boxH, 16);
    ctx.stroke();

    // Final value
    ctx.fillStyle = resultColor;
    ctx.font = "bold 64px system-ui, -apple-system, sans-serif";
    ctx.fillText(fmt(finalValue), 80, boxY + 72);

    // Multiple + CAGR
    ctx.fillStyle = "#e5e5e5";
    ctx.font = "bold 24px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${multiple.toFixed(1)}x your money`, 80, boxY + 115);
    ctx.fillStyle = "#9ca3af";
    ctx.font = "400 18px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${(cagr * 100).toFixed(1)}% annualized`, 80, boxY + 148);

    // vs S&P
    ctx.fillStyle = "#6b7280";
    ctx.font = "400 16px system-ui, -apple-system, sans-serif";
    const vsLine = beat
      ? `Beat S&P 500 by ${fmt(beatAmount)} (S&P: ${fmt(spyFinal)}, ${spyMultiple.toFixed(1)}x)`
      : `S&P 500 won by ${fmt(beatAmount)} (S&P: ${fmt(spyFinal)}, ${spyMultiple.toFixed(1)}x)`;
    ctx.fillText(vsLine, 80, boxY + 200);

    // Bottom bar
    ctx.fillStyle = "#6b7280";
    ctx.font = "400 14px system-ui, -apple-system, sans-serif";
    ctx.fillText("Past performance does not predict future results.", 56, H - 40);

    ctx.fillStyle = "#fbbf24";
    ctx.textAlign = "right";
    ctx.fillText("holdlens.com/simulate", W - 56, H - 40);
    ctx.textAlign = "left";

    setReady(true);
  }, [managerName, startYear, amount, finalValue, multiple, cagr, spyFinal, spyMultiple, years, beat, beatAmount]);

  function download() {
    const c = canvasRef.current;
    if (!c) return;
    const link = document.createElement("a");
    link.download = `holdlens-backtest-${managerName.toLowerCase().replace(/\s+/g, "-")}-${startYear}.png`;
    link.href = c.toDataURL("image/png");
    link.click();
    if ((window as any).plausible) {
      (window as any).plausible("Backtest Share Download", {
        props: { manager: managerName, startYear: String(startYear) },
      });
    }
  }

  function copyTweet() {
    const text = beat
      ? `If you'd copied ${managerName} in ${startYear}, ${fmt(amount)} → ${fmt(finalValue)} (${multiple.toFixed(1)}x). Beat the S&P by ${fmt(beatAmount)}.\n\nBacktest it yourself on HoldLens:`
      : `${managerName} backtest: ${fmt(amount)} in ${startYear} → ${fmt(finalValue)} (${multiple.toFixed(1)}x).\n\nRun your own on HoldLens:`;
    navigator.clipboard.writeText(text + " https://holdlens.com/simulate");
    if ((window as any).plausible) {
      (window as any).plausible("Backtest Share Copy", {
        props: { manager: managerName, startYear: String(startYear) },
      });
    }
  }

  function shareTweet() {
    const text = beat
      ? `If you'd copied ${managerName} in ${startYear}, ${fmt(amount)} → ${fmt(finalValue)} (${multiple.toFixed(1)}x). Beat the S&P 500 by ${fmt(beatAmount)}.`
      : `${managerName} backtest: ${fmt(amount)} in ${startYear} → ${fmt(finalValue)} (${multiple.toFixed(1)}x).`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent("https://holdlens.com/simulate")}`,
      "_blank"
    );
    if ((window as any).plausible) {
      (window as any).plausible("Backtest Share Tweet", {
        props: { manager: managerName, startYear: String(startYear) },
      });
    }
  }

  return (
    <div className="mt-6">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Share this backtest
      </div>
      <div className="rounded-2xl border border-border bg-panel overflow-hidden">
        <div style={{ aspectRatio: "1200/630" }} className="relative bg-bg">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="w-full h-full"
          />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center text-dim text-sm">
              Rendering...
            </div>
          )}
        </div>
        <div className="p-4 flex flex-wrap gap-3">
          <button
            onClick={download}
            className="bg-brand text-black font-semibold rounded-lg px-4 py-2 text-sm hover:opacity-90 transition"
          >
            Download PNG
          </button>
          <button
            onClick={copyTweet}
            className="border border-border bg-panel text-text font-semibold rounded-lg px-4 py-2 text-sm hover:border-brand transition"
          >
            Copy tweet
          </button>
          <button
            onClick={shareTweet}
            className="border border-border bg-panel text-text font-semibold rounded-lg px-4 py-2 text-sm hover:border-brand transition"
          >
            Share to Twitter
          </button>
        </div>
      </div>
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
