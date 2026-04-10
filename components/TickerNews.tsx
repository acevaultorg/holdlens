"use client";
import { useEffect, useState } from "react";
import { getNews, fmtRelativeTime, type NewsItem } from "@/lib/news";

export default function TickerNews({ symbol, count = 6 }: { symbol: string; count?: number }) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");

  useEffect(() => {
    let cancelled = false;
    getNews(symbol, count).then((data) => {
      if (cancelled) return;
      if (data.length === 0) {
        setState("err");
      } else {
        setItems(data);
        setState("ok");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [symbol, count]);

  if (state === "loading") {
    return (
      <div className="rounded-2xl border border-border bg-panel p-6 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 rounded bg-bg/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (state === "err" || items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-panel p-6 text-sm text-dim text-center">
        No news available for <span className="font-mono font-semibold text-text">{symbol}</span> right now.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-panel overflow-hidden">
      <ul className="divide-y divide-border">
        {items.map((n) => (
          <li key={n.uuid}>
            <a
              href={n.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 px-5 py-4 hover:bg-bg/40 transition group"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm text-text font-semibold leading-snug group-hover:text-brand transition">
                  {n.title}
                </div>
                <div className="text-xs text-dim mt-1.5 flex items-center gap-2">
                  <span className="font-semibold text-muted">{n.publisher}</span>
                  {n.publishedAt > 0 && (
                    <>
                      <span>·</span>
                      <span>{fmtRelativeTime(n.publishedAt)}</span>
                    </>
                  )}
                  {n.type === "VIDEO" && (
                    <>
                      <span>·</span>
                      <span className="text-brand">video</span>
                    </>
                  )}
                </div>
              </div>
              <ExternalArrow />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExternalArrow() {
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
      className="text-dim group-hover:text-brand transition shrink-0 mt-1"
      aria-hidden
    >
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}
