"use client";
import { useState } from "react";
import FundLogo from "@/components/FundLogo";

type Row = {
  slug: string;
  name: string;
  fund: string;
  cagr10y: number;
  alpha10y: number;
  winRate: number;
  cumulative10y: number;
  worstYear: number;
  quality0to10: number;
};

type SortKey = "alpha10y" | "cagr10y" | "winRate" | "cumulative10y" | "worstYear" | "quality0to10";

const COLUMNS: { key: SortKey; label: string; align?: "right" | "left"; hidden?: string }[] = [
  { key: "cagr10y", label: "10y CAGR", align: "right" },
  { key: "alpha10y", label: "Alpha", align: "right" },
  { key: "winRate", label: "Win rate", align: "right", hidden: "hidden md:table-cell" },
  { key: "cumulative10y", label: "Cumulative", align: "right", hidden: "hidden lg:table-cell" },
  { key: "worstYear", label: "Worst yr", align: "right", hidden: "hidden md:table-cell" },
  { key: "quality0to10", label: "Quality", align: "right" },
];

export default function LeaderboardTable({ rows: initialRows }: { rows: Row[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("alpha10y");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = [...initialRows].sort((a, b) => {
    let av = a[sortKey] as number;
    let bv = b[sortKey] as number;
    // For "worst year", less negative is better — invert so default desc shows least-bad first
    if (sortKey === "worstYear") {
      av = -av;
      bv = -bv;
    }
    return sortDir === "desc" ? bv - av : av - bv;
  });

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden">
      <table className="w-full text-sm">
        <thead className="text-dim text-[10px] uppercase tracking-wider">
          <tr className="border-b border-border">
            <th className="text-left px-5 py-3 w-12">#</th>
            <th className="text-left px-5 py-3">Manager</th>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`px-5 py-3 cursor-pointer hover:text-text transition select-none ${col.align === "right" ? "text-right" : "text-left"} ${col.hidden || ""}`}
                onClick={() => handleSort(col.key)}
                title={`Sort by ${col.label}`}
              >
                {col.label}
                {sortKey === col.key && (
                  <span className="text-brand ml-1">{sortDir === "desc" ? "▼" : "▲"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, i) => (
            <tr key={r.slug} className="border-b border-border last:border-0 hover:bg-bg/40 transition">
              <td className="px-5 py-3 text-dim tabular-nums font-bold">{i + 1}</td>
              <td className="px-5 py-3">
                <a href={`/investor/${r.slug}`} className="inline-flex items-center gap-2 font-semibold text-text hover:text-brand transition">
                  <FundLogo slug={r.slug} name={r.name} size={24} />
                  {r.name}
                </a>
                <div className="text-[11px] text-dim truncate ml-8">{r.fund}</div>
              </td>
              <td className="px-5 py-3 text-right tabular-nums font-semibold text-text">
                {r.cagr10y.toFixed(1)}%
              </td>
              <td
                className={`px-5 py-3 text-right tabular-nums font-bold ${
                  r.alpha10y >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {r.alpha10y >= 0 ? "+" : ""}
                {r.alpha10y.toFixed(1)}%
              </td>
              <td className="px-5 py-3 text-right tabular-nums text-muted hidden md:table-cell">
                {(r.winRate * 100).toFixed(0)}%
              </td>
              <td className="px-5 py-3 text-right tabular-nums text-muted hidden lg:table-cell">
                {(r.cumulative10y / 100 + 1).toFixed(1)}×
              </td>
              <td className="px-5 py-3 text-right tabular-nums text-rose-400/80 hidden md:table-cell">
                {r.worstYear.toFixed(0)}%
              </td>
              <td className="px-5 py-3 text-right">
                <QualityBadge score={r.quality0to10} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QualityBadge({ score }: { score: number }) {
  let color = "text-muted bg-panel border-border";
  if (score >= 9) color = "text-brand bg-brand/10 border-brand/40";
  else if (score >= 7.5) color = "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
  else if (score >= 6) color = "text-text bg-bg/40 border-border";
  return (
    <span className={`inline-flex items-center text-xs font-bold tabular-nums px-2 py-0.5 rounded border ${color}`}>
      {score.toFixed(1)}
    </span>
  );
}
