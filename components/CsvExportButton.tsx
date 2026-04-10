"use client";
import { useState } from "react";

type Row = Record<string, string | number>;

type Props = {
  filename: string;
  rows: Row[];
  label?: string;
};

export default function CsvExportButton({ filename, rows, label = "Download CSV" }: Props) {
  const [state, setState] = useState<"idle" | "done">("idle");

  function onClick() {
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]);
    const escape = (v: string | number) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setState("done");
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-text border border-border hover:border-brand/40 rounded-lg px-3 py-2 bg-panel transition"
      aria-label={label}
    >
      <DownloadIcon />
      {state === "done" ? "Downloaded ✓" : label}
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
