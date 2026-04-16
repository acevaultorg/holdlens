"use client";

import { useEffect, useState } from "react";
import { csvExportsRemaining, recordCsvExport } from "@/lib/pro";

// <CsvExportButton /> — CSV export with a generous free tier (10/month).
// WhaleWisdom + GuruFocus paywall exports; HoldLens free tier is already
// better than their free offering. Pro users get unlimited exports with no
// interruption. Free users see a friendly upgrade nudge at the limit —
// no hard block, no dark patterns, just honest context.
//
// Pro upgrade: NEXT_PUBLIC_STRIPE_PAYMENT_LINK / _FOUNDERS env vars control
// the checkout link (set in Cloudflare Pages env → redeploy to activate).
//
// Usage:
//   <CsvExportButton endpoint="/api/v1/best-now.json" filename="holdlens-best-now" />

type Props = {
  /** Pre-built rows to export (legacy path — still used by /sells, /value, /screener, /grand, /this-week). */
  rows?: Array<Record<string, unknown>>;
  /** Absolute URL or site-relative path of a HoldLens JSON endpoint. When set,
   *  the button fetches + serializes on click instead of using `rows`. */
  endpoint?: string;
  /** File name (legacy: full name) OR file prefix (when endpoint is set; date suffix auto-appended). */
  filename?: string;
  /** Optional label override. */
  label?: string;
};

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  let s: string;
  if (typeof value === "object") {
    try {
      s = JSON.stringify(value);
    } catch {
      s = String(value);
    }
  } else {
    s = String(value);
  }
  // RFC 4180: wrap in quotes if contains delimiter, quote, or newline; double embedded quotes.
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function rowsToCsv(rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) return "";
  // Collect union of keys across all rows, preserving first-seen order.
  const keySeen = new Set<string>();
  const keys: string[] = [];
  for (const row of rows) {
    for (const k of Object.keys(row)) {
      if (!keySeen.has(k)) {
        keySeen.add(k);
        keys.push(k);
      }
    }
  }
  const header = keys.map(csvEscape).join(",");
  const body = rows
    .map((row) => keys.map((k) => csvEscape(row[k])).join(","))
    .join("\n");
  return `${header}\n${body}\n`;
}

function triggerDownload(csv: string, fname: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fname;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const STRIPE_LINK =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_FOUNDERS ||
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ||
  "https://holdlens.com/pricing/";

export default function CsvExportButton({ rows, endpoint, filename, label }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "error" | "gate">("idle");
  // Track remaining quota client-side (re-reads after each download).
  const [remaining, setRemaining] = useState<number>(Infinity);

  useEffect(() => {
    // Initialize remaining count once mounted (localStorage is only available in the browser).
    setRemaining(csvExportsRemaining());
  }, []);

  async function download() {
    // Check quota before doing any work.
    const quota = csvExportsRemaining();
    if (quota <= 0) {
      setState("gate");
      return;
    }

    // Legacy path: rows supplied directly → serialize synchronously.
    if (rows && !endpoint) {
      const csv = rowsToCsv(rows);
      triggerDownload(csv, filename ?? "holdlens.csv");
      recordCsvExport();
      setRemaining(csvExportsRemaining());
      return;
    }

    // Endpoint path: fetch + serialize.
    if (!endpoint) return;
    setState("loading");
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const rawRows = Array.isArray(json) ? json : json?.data ?? [];
      let fetched: Array<Record<string, unknown>>;
      if (Array.isArray(rawRows)) {
        fetched = rawRows;
      } else if (rawRows && typeof rawRows === "object" && Array.isArray((rawRows as { tickers?: unknown }).tickers)) {
        fetched = (rawRows as { tickers: Array<Record<string, unknown>> }).tickers;
      } else {
        fetched = [rawRows as Record<string, unknown>];
      }
      const csv = rowsToCsv(fetched);
      const today = new Date().toISOString().slice(0, 10);
      const prefix = filename ?? "holdlens";
      // If filename already has a .csv extension, treat as full name (legacy).
      const fname = prefix.endsWith(".csv") ? prefix : `${prefix}-${today}.csv`;
      triggerDownload(csv, fname);
      recordCsvExport();
      setRemaining(csvExportsRemaining());
      setState("idle");
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }

  // Upgrade gate — shown inline when free limit is reached.
  if (state === "gate") {
    return (
      <span className="inline-flex items-center gap-2 text-xs rounded-md border border-amber-500/40 bg-amber-500/5 px-3 py-1.5">
        <span className="text-amber-400 font-semibold">10 exports/month on the free tier.</span>
        <a
          href={STRIPE_LINK}
          className="text-brand font-semibold hover:underline whitespace-nowrap"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go Pro →
        </a>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="text-dim hover:text-text transition ml-1"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </span>
    );
  }

  const buttonLabel =
    state === "loading"
      ? "Preparing…"
      : state === "error"
        ? "Failed — retry"
        : label ?? "Export CSV";

  // Show remaining count as a tooltip hint for free users nearing the limit.
  const showQuotaHint = remaining !== Infinity && remaining <= 3 && remaining > 0;

  return (
    <button
      type="button"
      onClick={download}
      disabled={state === "loading"}
      title={showQuotaHint ? `${remaining} free export${remaining === 1 ? "" : "s"} left this month` : undefined}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand bg-brand/10 border border-brand/30 hover:bg-brand/20 transition rounded-md px-2.5 py-1.5 disabled:opacity-50"
      aria-label="Download this list as CSV"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {buttonLabel}
      {showQuotaHint && (
        <span className="text-amber-400 font-normal">({remaining} left)</span>
      )}
    </button>
  );
}
