"use client";
// AiThesisCard — on-demand AI investment thesis generation per ticker.
//
// Calls /api/thesis (CF Pages Function) with the ticker's 13F context data
// and renders a 2-paragraph thesis from Claude Haiku.
//
// Activation: operator must set ANTHROPIC_API_KEY in Cloudflare Pages env.
// Without it, the function returns pending:true and we show a "coming soon" state.
//
// Caching: thesis is stored in sessionStorage by ticker symbol so navigating
// away and back does not re-fetch. Cache key: `hl_thesis_<TICKER>`.
//
// Rate limiting: the CF function allows 5 requests per IP per cold-start.
// The component disables the button after a successful generation to prevent
// accidental re-fetches.

import { useState, useEffect, useCallback } from "react";

interface OwnerInput {
  name: string;
  fund: string;
  positionPct: number;
  philosophy?: string;
  thesis?: string;
  action?: string;
  qualityScore?: number;
}

interface AiThesisCardProps {
  ticker: string;
  tickerName: string;
  sector?: string;
  signedScore: number;
  verdict: string;
  ownerCount: number;
  topOwners: OwnerInput[];
}

type State =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "done"; thesis: string; pending: boolean }
  | { phase: "error"; message: string };

const CACHE_PREFIX = "hl_thesis_";

function getCached(ticker: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(CACHE_PREFIX + ticker.toUpperCase());
  } catch {
    return null;
  }
}

function setCache(ticker: string, thesis: string): void {
  try {
    sessionStorage.setItem(CACHE_PREFIX + ticker.toUpperCase(), thesis);
  } catch {
    // sessionStorage full — skip
  }
}

export default function AiThesisCard({
  ticker,
  tickerName,
  sector,
  signedScore,
  verdict,
  ownerCount,
  topOwners,
}: AiThesisCardProps) {
  const [state, setState] = useState<State>({ phase: "idle" });

  // Restore from sessionStorage on mount (avoids re-fetch after navigation)
  useEffect(() => {
    const cached = getCached(ticker);
    if (cached) {
      setState({ phase: "done", thesis: cached, pending: false });
    }
  }, [ticker]);

  const generate = useCallback(async () => {
    if (state.phase === "loading" || state.phase === "done") return;
    setState({ phase: "loading" });

    try {
      const res = await fetch("/api/thesis", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ticker,
          tickerName,
          sector,
          signedScore,
          verdict,
          ownerCount,
          topOwners: topOwners.slice(0, 5),
        }),
      });

      const data = (await res.json()) as {
        ok: boolean;
        thesis?: string;
        pending?: boolean;
        error?: string;
      };

      if (!data.ok || !data.thesis) {
        setState({
          phase: "error",
          message:
            data.error === "rate_limited"
              ? "Rate limit reached — try again later."
              : "Thesis generation failed. Try again shortly.",
        });
        return;
      }

      if (!data.pending) {
        setCache(ticker, data.thesis);
      }

      setState({ phase: "done", thesis: data.thesis, pending: data.pending ?? false });
    } catch {
      setState({ phase: "error", message: "Network error — check your connection." });
    }
  }, [state.phase, ticker, tickerName, sector, signedScore, verdict, ownerCount, topOwners]);

  const verdictColor =
    verdict === "BUY"
      ? "text-emerald-400"
      : verdict === "SELL"
      ? "text-rose-400"
      : "text-muted";

  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-1">
            AI thesis
          </div>
          <div className="text-sm text-muted">
            Claude Haiku synthesis of{" "}
            <span className={`font-semibold ${verdictColor}`}>{verdict}</span> positioning from{" "}
            {ownerCount} institutional filers
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-dim">
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand inline-block" />
            Powered by Claude Haiku
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5">
        {state.phase === "idle" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-sm text-muted text-center max-w-sm">
              Generate a 2-paragraph investment thesis synthesising{" "}
              <span className="text-text font-medium">{ownerCount} institutional holdings</span> and
              the{" "}
              <span className={`font-semibold ${verdictColor}`}>
                {signedScore > 0 ? "+" : ""}
                {signedScore.toFixed(0)}
              </span>{" "}
              conviction score.
            </p>
            <button
              onClick={generate}
              className="inline-flex items-center gap-2 rounded-xl bg-brand text-black font-semibold text-sm px-5 py-2.5 hover:bg-brand/90 active:scale-95 transition"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Generate AI thesis
            </button>
          </div>
        )}

        {state.phase === "loading" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="h-6 w-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            <p className="text-sm text-muted">Analysing 13F data…</p>
          </div>
        )}

        {state.phase === "done" && (
          <div className="space-y-4">
            {state.pending ? (
              <div className="rounded-xl border border-border bg-bg/40 p-4 text-sm text-muted">
                AI thesis generation is being set up for {ticker}. Check back soon — or{" "}
                <a href="/alerts" className="text-brand hover:underline">get notified</a>{" "}
                when it goes live.
              </div>
            ) : (
              <>
                <div className="text-sm text-text leading-relaxed whitespace-pre-wrap">
                  {state.thesis}
                </div>
                <p className="text-[11px] text-dim border-t border-border pt-3 leading-relaxed">
                  AI-generated based on 13F filing data (45-day delay). Not investment advice.
                  HoldLens and Anthropic make no warranty as to accuracy.{" "}
                  <a
                    href="/methodology/"
                    className="text-muted underline decoration-dotted hover:text-text"
                  >
                    Methodology
                  </a>
                  .
                </p>
              </>
            )}
          </div>
        )}

        {state.phase === "error" && (
          <div className="flex flex-col items-center gap-3 py-4">
            <p className="text-sm text-rose-400">{state.message}</p>
            <button
              onClick={() => setState({ phase: "idle" })}
              className="text-xs text-muted hover:text-text underline decoration-dotted"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
