"use client";
import { useState } from "react";

// v0.1 — share buttons for backtest pages. Encourages viral distribution.
// Twitter, Reddit, LinkedIn, and copy-link. No tracking, no external scripts.
export default function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const buttons = [
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "Reddit",
      href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-xs text-dim uppercase tracking-wider">Share:</span>
      {buttons.map((b) => (
        <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer"
           className="text-sm text-muted hover:text-brand transition px-3 py-2 rounded-lg border border-border bg-panel">
          {b.label}
        </a>
      ))}
      <button onClick={copyLink}
              className="text-sm text-muted hover:text-brand transition px-3 py-2 rounded-lg border border-border bg-panel">
        {copied ? "✓ Copied" : "Copy link"}
      </button>
    </div>
  );
}
