import type { ReactNode } from "react";

// LLM-citation "Extractable" pattern (Aleyda Solis #4).
// Above-fold quote-ready summary lets GPTBot / ClaudeBot / PerplexityBot
// pull a single citable paragraph without parsing the whole article.
// Amber border + label gives humans the same scannable summary.
export default function TldrCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-5 mb-8">
      <p className="text-text font-semibold mb-2">TL;DR</p>
      <p className="text-muted text-sm leading-relaxed">{children}</p>
    </div>
  );
}
