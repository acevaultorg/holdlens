"use client";
import { useEffect, useState } from "react";
import { isWatched, toggleWatchlist, subscribeWatchlist } from "@/lib/watchlist";

type Props = {
  symbol: string;
  size?: "sm" | "md" | "lg";
};

export default function StarButton({ symbol, size = "md" }: Props) {
  const [watched, setWatched] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWatched(isWatched(symbol));
    return subscribeWatchlist(() => setWatched(isWatched(symbol)));
  }, [symbol]);

  const onClick = () => {
    const r = toggleWatchlist(symbol);
    setWatched(r.watched);
  };

  const iconSize = size === "lg" ? 22 : size === "sm" ? 14 : 18;
  const padY = size === "lg" ? "py-2.5" : size === "sm" ? "py-1" : "py-2";
  const padX = size === "lg" ? "px-4" : size === "sm" ? "px-2" : "px-3";
  const textSize = size === "lg" ? "text-sm" : size === "sm" ? "text-xs" : "text-xs";

  // Render nothing until mounted to avoid SSR/CSR mismatch
  if (!mounted) {
    return (
      <button
        className={`inline-flex items-center gap-2 ${padX} ${padY} rounded-xl border border-border bg-panel text-muted ${textSize} opacity-0`}
        aria-hidden
      >
        <StarIcon size={iconSize} filled={false} />
        <span>Watch</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 ${padX} ${padY} rounded-xl border ${textSize} font-semibold transition ${
        watched
          ? "border-brand bg-brand/10 text-brand hover:bg-brand/20"
          : "border-border bg-panel text-muted hover:text-text hover:border-brand/40"
      }`}
      aria-pressed={watched}
      aria-label={watched ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
    >
      <StarIcon size={iconSize} filled={watched} />
      <span>{watched ? "Watching" : "Watch"}</span>
    </button>
  );
}

function StarIcon({ size, filled }: { size: number; filled: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
