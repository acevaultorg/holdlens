"use client";

// DividendTaxCalc — inline retention feature on /ticker/[X] + /investor/[X]
// pages. Answers: "If I'm a resident of country A, and I receive dividends
// from a company domiciled in country B, what will I actually keep per
// $100 dividend?" Data is pre-seeded per data/dividend-tax.json; cells
// without a verified primary source return a `needs_research` fallback
// that shows the operator-facing "data pending verification" message
// rather than a fabricated number (AP-3 enforcement).
//
// Static-export-safe: client-side computation, no network, no dynamic
// import, no SSR-only hooks. Works under `output: 'export'`.

import { useEffect, useMemo, useState } from "react";
import {
  COUNTRIES,
  COMMON_PAYER_COUNTRIES,
  DEFAULT_INVESTOR_COUNTRY,
  computeNetAfterWithholding,
  getCountry,
  resolveEffectiveRate,
  type CountryCode,
} from "@/lib/dividend-tax";
import DividendTaxShareButton from "@/components/DividendTaxShareButton";

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string | number> }) => void;
  }
}

type Mode = "inline" | "full";

type Props = {
  /** Fixed payer-country override (e.g. on a ticker page we already know
   * the domicile of the dividend-paying company). If omitted the user
   * picks the payer from the dropdown too. */
  fixedPayerCountry?: CountryCode;
  /** Default investor country the dropdown opens on. Falls back to US. */
  defaultInvestorCountry?: CountryCode;
  /** Compact variant for embed on ticker pages (single row). Full mode
   * used on /dividend-tax/ hub + per-investor-country pages. */
  mode?: Mode;
  /** Ticker symbol if placed inline on a ticker page — surfaces in event
   * props and in the UI copy. */
  tickerContext?: string;
  /** Investor-slug context if placed inline on an investor page. */
  investorContext?: string;
};

const DEFAULT_DIVIDEND = 1000;

export default function DividendTaxCalc({
  fixedPayerCountry,
  defaultInvestorCountry = DEFAULT_INVESTOR_COUNTRY,
  mode = "inline",
  tickerContext,
  investorContext,
}: Props) {
  const [investor, setInvestor] = useState<CountryCode>(defaultInvestorCountry);
  const [payer, setPayer] = useState<CountryCode>(
    fixedPayerCountry ?? "US",
  );
  const [amount, setAmount] = useState<number>(DEFAULT_DIVIDEND);
  const [fired, setFired] = useState(false);

  // Reorder investor list so COMMON_PAYER_COUNTRIES are at the top, rest alpha.
  const investorOptions = useMemo(() => {
    const common = COMMON_PAYER_COUNTRIES
      .map((c) => getCountry(c))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
    const commonCodes = new Set(common.map((c) => c.code));
    const rest = COUNTRIES.filter((c) => !commonCodes.has(c.code));
    return { common, rest };
  }, []);

  const payerOptions = useMemo(() => {
    if (fixedPayerCountry) return null;
    const common = COMMON_PAYER_COUNTRIES
      .map((c) => getCountry(c))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
    const commonCodes = new Set(common.map((c) => c.code));
    const rest = COUNTRIES.filter((c) => !commonCodes.has(c.code));
    return { common, rest };
  }, [fixedPayerCountry]);

  const payerCountry = getCountry(payer);
  const resolved = resolveEffectiveRate(investor, payer);

  const effectiveRatePct =
    resolved.kind === "verified" || resolved.kind === "derived"
      ? resolved.rate_pct
      : resolved.kind === "needs_research"
        ? resolved.statutory_rate_pct
        : 0;

  const { withheld, net } = computeNetAfterWithholding(amount, effectiveRatePct);

  // Fire Plausible activation event once per mount.
  useEffect(() => {
    if (fired) return;
    if (typeof window === "undefined") return;
    window.plausible?.("tax_calc_view", {
      props: {
        mode,
        ticker: tickerContext ?? "",
        investor_slug: investorContext ?? "",
        default_investor: defaultInvestorCountry,
      },
    });
    setFired(true);
  }, [fired, mode, tickerContext, investorContext, defaultInvestorCountry]);

  function onInvestorChange(code: CountryCode) {
    setInvestor(code);
    window.plausible?.("tax_country_selected", {
      props: { role: "investor", code, ticker: tickerContext ?? "" },
    });
  }

  function onPayerChange(code: CountryCode) {
    setPayer(code);
    window.plausible?.("tax_country_selected", {
      props: { role: "payer", code, ticker: tickerContext ?? "" },
    });
  }

  const compact = mode === "inline";

  return (
    <div
      className={
        compact
          ? "rounded-2xl border border-border bg-panel p-5"
          : "rounded-2xl border border-border bg-panel p-6 md:p-8"
      }
      data-testid="dividend-tax-calc"
    >
      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-brand mb-1">
            Dividend tax by country
          </div>
          <h3 className="text-lg sm:text-xl font-bold leading-tight">
            {tickerContext
              ? `What will you keep of every $100 in ${tickerContext} dividend?`
              : "Estimate your withholding on cross-border dividends"}
          </h3>
        </div>
      </header>

      <div className={`mt-5 grid ${fixedPayerCountry ? "sm:grid-cols-2" : "sm:grid-cols-3"} gap-3`}>
        <label className="block">
          <span className="text-[11px] uppercase tracking-wider text-dim font-semibold mb-1 block">
            Your country of residence
          </span>
          <select
            aria-label="Investor country of residence"
            value={investor}
            onChange={(e) => onInvestorChange(e.target.value)}
            className="w-full rounded-xl bg-panel-hi border border-border text-text px-3 py-3 text-sm min-h-[44px] focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          >
            <optgroup label="Common">
              {investorOptions.common.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </optgroup>
            <optgroup label="Other supported countries">
              {investorOptions.rest.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </optgroup>
          </select>
        </label>

        {!fixedPayerCountry && payerOptions && (
          <label className="block">
            <span className="text-[11px] uppercase tracking-wider text-dim font-semibold mb-1 block">
              Company is domiciled in
            </span>
            <select
              aria-label="Payer country (company domicile)"
              value={payer}
              onChange={(e) => onPayerChange(e.target.value)}
              className="w-full rounded-xl bg-panel-hi border border-border text-text px-3 py-3 text-sm min-h-[44px] focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            >
              <optgroup label="Common">
                {payerOptions.common.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </optgroup>
              <optgroup label="Other supported countries">
                {payerOptions.rest.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </optgroup>
            </select>
          </label>
        )}

        <label className="block">
          <span className="text-[11px] uppercase tracking-wider text-dim font-semibold mb-1 block">
            Gross dividend (example)
          </span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dim text-sm">$</span>
            <input
              aria-label="Gross dividend amount"
              type="number"
              inputMode="decimal"
              min={0}
              step={1}
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
              className="w-full rounded-xl bg-panel-hi border border-border text-text pl-7 pr-3 py-3 text-sm min-h-[44px] tabular-nums focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </label>
      </div>

      <div className="mt-5 grid sm:grid-cols-3 gap-3">
        <ResultCell
          label="Withholding rate"
          value={`${effectiveRatePct.toFixed(effectiveRatePct % 1 === 0 ? 0 : 2)}%`}
          sub={
            resolved.kind === "verified" || resolved.kind === "derived"
              ? "Treaty rate"
              : resolved.kind === "needs_research"
                ? "Statutory (non-treaty)"
                : ""
          }
        />
        <ResultCell
          label="Tax withheld"
          value={`$${withheld.toFixed(2)}`}
          sub=""
          tone="muted"
        />
        <ResultCell
          label="You'd receive"
          value={`$${net.toFixed(2)}`}
          sub={`Of $${amount.toFixed(0)} gross`}
          tone="brand"
        />
      </div>

      {/* Source / citation block OR needs_research notice */}
      <div className="mt-5">
        {(resolved.kind === "verified" || resolved.kind === "derived") && (
          <div className="rounded-xl border border-border bg-panel-hi p-4 text-xs text-muted leading-relaxed">
            <div className="font-semibold text-text text-sm mb-1">
              Source &amp; treaty reference
            </div>
            <div className="mb-1">
              <strong className="text-text">Treaty:</strong> {resolved.treaty_reference}
            </div>
            <div className="mb-1">
              <strong className="text-text">Citation:</strong> {resolved.source_citation}
            </div>
            {resolved.notes && (
              <div className="mt-2 text-muted">{resolved.notes}</div>
            )}
            {payerCountry && (
              <div className="mt-2 text-dim">
                Statutory non-treaty rate in {payerCountry.name}:{" "}
                <span className="tabular-nums">
                  {payerCountry.statutory_dividend_wht_pct}%
                </span>
                . Treaty rate shown assumes proper documentation (e.g. Form W-8BEN for US treaty benefit).
              </div>
            )}
          </div>
        )}
        {resolved.kind === "needs_research" && (
          <div className="rounded-xl border border-brand/40 bg-brand/5 p-4 text-xs leading-relaxed">
            <div className="font-semibold text-text text-sm mb-1">
              ⚠️ Data pending verification
            </div>
            <p className="text-muted">{resolved.message}</p>
            <p className="text-dim mt-2">
              Until verified, we show the payer-country statutory non-treaty rate as an upper-bound estimate.
            </p>
          </div>
        )}
        {resolved.kind === "no_payer" && (
          <div className="rounded-xl border border-border bg-panel-hi p-4 text-xs text-muted">
            {resolved.message}
          </div>
        )}
      </div>

      {/* Share button — only when the rate is verified (not for
          needs_research fallbacks). Sharing a "data pending verification"
          result is low-quality viral; gate the advocacy moment to
          high-confidence data only. */}
      {(resolved.kind === "verified" || resolved.kind === "derived") && (
        <DividendTaxShareButton
          investorCountry={investor}
          payerCountry={payer}
          effectiveRatePct={effectiveRatePct}
          gross={amount}
          net={net}
          surface={tickerContext || investorContext || (compact ? "inline" : "hub")}
        />
      )}

      {/* Disclaimer — mandatory on every page per adsense-compliance + YMYL-adjacent */}
      <p className="mt-4 text-[11px] text-dim leading-relaxed">
        Estimates for educational purposes only. Tax rules change; consult a qualified tax professional for your specific situation. Dividend-tax treatment depends on holding period, account type (taxable vs. retirement), investor type (individual vs. pension vs. mutual fund), limitation-on-benefits tests, and other factors not modeled here.
      </p>

      {/* Deep-link to the per-investor-country page for more context */}
      {compact && (
        <div className="mt-4">
          <a
            href={`/dividend-tax/${investor.toLowerCase()}/`}
            className="inline-flex items-center gap-1 text-sm text-brand hover:underline font-semibold"
          >
            Full dividend-tax rules for {getCountry(investor)?.name ?? investor} investors →
          </a>
        </div>
      )}
    </div>
  );
}

function ResultCell({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "brand" | "muted";
}) {
  const valueTone = tone === "brand" ? "text-brand" : tone === "muted" ? "text-muted" : "text-text";
  return (
    <div className="rounded-xl border border-border bg-panel-hi px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-dim font-semibold">{label}</div>
      <div className={`text-xl font-bold mt-1 tabular-nums ${valueTone}`}>{value}</div>
      {sub && <div className="text-[11px] text-dim mt-0.5">{sub}</div>}
    </div>
  );
}
