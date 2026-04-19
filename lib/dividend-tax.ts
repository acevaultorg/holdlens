// Dividend tax data access layer. Static JSON-backed (matches existing
// data/ + lib/ pattern in holdlens — no DB, static export compatible).
//
// Source of truth: data/dividend-tax.json. Every cell cites a primary
// source; cells without verification ship as `state: needs_research`
// per AP-3 (never fabricate data-site content). Consumers MUST handle
// the needs_research fallback path and show the operator-facing
// "data pending verification" message rather than inventing a rate.

import raw from "@/data/dividend-tax.json";

export type TreatyState = "verified" | "derived" | "needs_research";

export type CountryCode = string; // ISO 3166-1 alpha-2

export type Country = {
  code: CountryCode;
  name: string;
  flag: string; // emoji flag for UI
  /**
   * Domestic statutory withholding rate on dividends paid to non-residents
   * (i.e. what the payer-country's tax authority withholds before any treaty).
   * Percentage, 0-100.
   */
  statutory_dividend_wht_pct: number;
  /**
   * One-line note about how RESIDENTS of this country are taxed on foreign
   * dividends they receive (foreign tax credit availability etc.).
   */
  resident_note: string;
};

export type TreatyCell = {
  investor_country: CountryCode;
  payer_country: CountryCode;
  /** Treaty-reduced withholding tax rate at source, 0-100. */
  withholding_rate_pct: number;
  treaty_reference: string;
  source_citation: string;
  state: TreatyState;
  last_verified: string; // ISO date
  notes?: string;
};

export type DividendTaxMeta = {
  schema_version: string;
  last_verified: string;
  disclaimer: string;
  primary_sources: Record<string, string>;
  state_flags: Record<TreatyState, string>;
};

type RawShape = {
  _meta: DividendTaxMeta;
  countries: Country[];
  treaties: TreatyCell[];
};

const data = raw as RawShape;

export const META: DividendTaxMeta = data._meta;

export const COUNTRIES: Country[] = [...data.countries].sort((a, b) =>
  a.name.localeCompare(b.name),
);

const COUNTRIES_BY_CODE: Record<string, Country> = Object.fromEntries(
  data.countries.map((c) => [c.code, c]),
);

export function getCountry(code: CountryCode): Country | undefined {
  return COUNTRIES_BY_CODE[code.toUpperCase()];
}

const TREATY_INDEX: Record<string, TreatyCell> = Object.fromEntries(
  data.treaties.map((t) => [
    `${t.investor_country.toUpperCase()}::${t.payer_country.toUpperCase()}`,
    t as TreatyCell,
  ]),
);

/**
 * Look up the treaty cell for investor_country receiving dividends from
 * payer_country. Returns `undefined` if the pair is not yet populated —
 * callers MUST treat undefined as `needs_research` and show the
 * operator-facing fallback, NOT invent a rate.
 */
export function getTreatyCell(
  investor: CountryCode,
  payer: CountryCode,
): TreatyCell | undefined {
  return TREATY_INDEX[`${investor.toUpperCase()}::${payer.toUpperCase()}`];
}

export type EffectiveRateResult =
  | {
      kind: "verified" | "derived";
      rate_pct: number;
      treaty_reference: string;
      source_citation: string;
      notes?: string;
      /** If treaty rate > 0 we also surface the payer-country statutory rate for context. */
      statutory_rate_pct: number;
    }
  | {
      kind: "needs_research";
      /** Falls back to the payer-country statutory non-treaty rate as an upper bound. */
      statutory_rate_pct: number;
      message: string;
    }
  | {
      kind: "no_payer";
      message: string;
    };

/**
 * Resolve the withholding rate a given investor_country pays on dividends
 * from payer_country. Never fabricates: if the treaty cell is absent or
 * state=needs_research, returns `kind: "needs_research"` and the caller
 * must display the "data pending verification" message rather than a
 * guessed number.
 */
export function resolveEffectiveRate(
  investor: CountryCode,
  payer: CountryCode,
): EffectiveRateResult {
  const payerCountry = getCountry(payer);
  if (!payerCountry) {
    return {
      kind: "no_payer",
      message: `Unknown payer country: ${payer}`,
    };
  }

  const cell = getTreatyCell(investor, payer);

  if (!cell || cell.state === "needs_research") {
    return {
      kind: "needs_research",
      statutory_rate_pct: payerCountry.statutory_dividend_wht_pct,
      message:
        "Treaty rate for this country pair has not been verified yet from a primary source. The statutory non-treaty rate is shown as an upper-bound reference only — your actual rate depends on the bilateral tax treaty in force. Please consult a qualified tax professional for your specific situation.",
    };
  }

  return {
    kind: cell.state,
    rate_pct: cell.withholding_rate_pct,
    treaty_reference: cell.treaty_reference,
    source_citation: cell.source_citation,
    notes: cell.notes,
    statutory_rate_pct: payerCountry.statutory_dividend_wht_pct,
  };
}

/**
 * For a given gross-dividend amount, compute what the investor keeps at
 * source (after withholding only — does NOT model the investor's
 * domestic income tax, which depends on bracket and foreign tax credit).
 */
export function computeNetAfterWithholding(
  grossDividend: number,
  effectiveRatePct: number,
): { withheld: number; net: number } {
  const rate = Math.max(0, Math.min(100, effectiveRatePct)) / 100;
  const withheld = grossDividend * rate;
  const net = grossDividend - withheld;
  return { withheld, net };
}

/**
 * Coverage summary — used by the hub page + admin views to show
 * "X of Y country pairs verified" without exposing cell-level data.
 */
export function getCoverageStats(): {
  total_pairs: number;
  verified_pairs: number;
  needs_research_pairs: number;
  investor_countries: number;
  payer_countries: number;
} {
  const investors = new Set(data.treaties.map((t) => t.investor_country));
  const payers = new Set(data.treaties.map((t) => t.payer_country));
  const verified = data.treaties.filter(
    (t) => t.state === "verified" || t.state === "derived",
  ).length;
  return {
    total_pairs: COUNTRIES.length * COUNTRIES.length,
    verified_pairs: verified,
    needs_research_pairs: COUNTRIES.length * COUNTRIES.length - verified,
    investor_countries: Math.max(investors.size, 1),
    payer_countries: Math.max(payers.size, 1),
  };
}

/** Default investor country for the inline widget (anonymous first load). */
export const DEFAULT_INVESTOR_COUNTRY: CountryCode = "US";

/**
 * Top N payer countries to surface on ticker pages by default. These are
 * the most common corporate domiciles for tickers held by HoldLens
 * superinvestors — US domestic (vast majority), plus a handful of
 * Ireland- / Switzerland- / Netherlands- / UK-domiciled multinationals.
 */
export const COMMON_PAYER_COUNTRIES: CountryCode[] = [
  "US",
  "UK",
  "IE",
  "CH",
  "NL",
  "DE",
  "FR",
  "CA",
  "JP",
];
