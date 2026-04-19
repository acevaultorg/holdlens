"use client";

// DividendTaxShareButton — lightweight advocacy lever on DividendTaxCalc.
// v1 is intent-URL-only (Twitter intent + clipboard copy); canvas-rendered
// 1200×630 PNG share-card is deferred to v2 after treaty-data coverage
// crosses ~80% verified. Rationale: sharing a "data pending verification"
// result is a poor viral moment, so we gate the share button to
// only-when-rate-is-verified state rather than ship a canvas that
// mostly fires on placeholder data.

import { useState } from "react";
import { getCountry, type CountryCode } from "@/lib/dividend-tax";

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string | number> }) => void;
  }
}

type Props = {
  /** Shown only when resolved kind is verified/derived — never for needs_research. */
  investorCountry: CountryCode;
  payerCountry: CountryCode;
  effectiveRatePct: number;
  /** Gross dividend used in the displayed calculation (currency $). */
  gross: number;
  /** After-withholding net (currency $). */
  net: number;
  /** Parent-surface tag for attribution (e.g. ticker symbol or investor slug or 'hub'). */
  surface: string;
};

export default function DividendTaxShareButton({
  investorCountry,
  payerCountry,
  effectiveRatePct,
  gross,
  net,
  surface,
}: Props) {
  const [copied, setCopied] = useState<"idle" | "done">("idle");

  const investor = getCountry(investorCountry);
  const payer = getCountry(payerCountry);
  if (!investor || !payer) return null;

  const keepPct = 100 - effectiveRatePct;
  const netPer100 = (keepPct).toFixed(keepPct % 1 === 0 ? 0 : 1);

  const pagePath = `/dividend-tax/${investorCountry.toLowerCase()}/`;
  const shareUrl = `https://holdlens.com${pagePath}`;

  const text =
    `As a ${investor.name} investor receiving dividends from a ${payer.name}-domiciled company, ` +
    `I'd keep $${netPer100} of every $100 gross (${effectiveRatePct}% withholding at source). ` +
    `Cross-border dividend tax by country, cited from primary sources:`;

  const twitterIntent =
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinIntent =
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const clipboardText = `${text} ${shareUrl}`;

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(clipboardText);
      setCopied("done");
      setTimeout(() => setCopied("idle"), 2000);
      window.plausible?.("tax_share", {
        props: {
          method: "copy_link",
          surface,
          investor: investorCountry,
          payer: payerCountry,
        },
      });
    } catch {
      // Clipboard access can fail under sandboxed iframes or older
      // browsers — silently ignore; the user still has the share
      // buttons below.
    }
  }

  function onTwitter() {
    window.plausible?.("tax_share", {
      props: {
        method: "twitter_intent",
        surface,
        investor: investorCountry,
        payer: payerCountry,
      },
    });
  }

  function onLinkedIn() {
    window.plausible?.("tax_share", {
      props: {
        method: "linkedin_intent",
        surface,
        investor: investorCountry,
        payer: payerCountry,
      },
    });
  }

  return (
    <div className="mt-5 rounded-xl border border-border bg-panel-hi p-4">
      <div className="text-[11px] uppercase tracking-wider text-dim font-semibold mb-2">
        Share your result
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyToClipboard}
          className="inline-flex items-center gap-2 rounded-lg bg-panel border border-border hover:border-brand hover:text-brand text-text px-3 py-2 text-xs font-semibold min-h-[40px] transition"
          aria-label="Copy share text to clipboard"
        >
          {copied === "done" ? "Copied ✓" : "Copy text + link"}
        </button>
        <a
          href={twitterIntent}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onTwitter}
          className="inline-flex items-center gap-2 rounded-lg bg-panel border border-border hover:border-brand hover:text-brand text-text px-3 py-2 text-xs font-semibold min-h-[40px] transition"
          aria-label="Share on X / Twitter"
        >
          Share on X
        </a>
        <a
          href={linkedinIntent}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLinkedIn}
          className="inline-flex items-center gap-2 rounded-lg bg-panel border border-border hover:border-brand hover:text-brand text-text px-3 py-2 text-xs font-semibold min-h-[40px] transition"
          aria-label="Share on LinkedIn"
        >
          Share on LinkedIn
        </a>
      </div>
      <p className="mt-3 text-[11px] text-dim leading-relaxed">
        Preview: &ldquo;{text}&rdquo;
      </p>
    </div>
  );
}
