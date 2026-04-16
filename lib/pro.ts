// Pro status — client-side flag for the "No ads, ever" promise on the
// pricing page.
//
// Why a localStorage flag rather than an auth session: HoldLens is a
// static export with no backend. When a user subscribes via Stripe they
// land on /thank-you?session=<stripe_checkout_session_id>. That page
// writes a Pro flag into localStorage; every subsequent visit reads it
// and suppresses ads across the site.
//
// The flag is deliberately NOT cryptographically enforced — Pro is an
// honour-system tier for a consumer product. The ad revenue a motivated
// cheater could siphon away is a rounding error vs. the complexity of
// running an auth stack. Users who want more than the honour system
// will be upsold to a cookie-scoped account in a later cycle.

const PRO_KEY = "holdlens_pro_v1";

/**
 * Returns true if the current browser is authenticated as Pro. SSR-safe
 * (returns false during static export, flag only materializes in the
 * browser).
 */
export function isProUser(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(PRO_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { activatedAt?: number };
    return typeof parsed.activatedAt === "number" && parsed.activatedAt > 0;
  } catch {
    return false;
  }
}

/**
 * Activate Pro on this browser. Called from /thank-you after a
 * successful Stripe checkout.
 */
export function activatePro(metadata: { session?: string; email?: string } = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      PRO_KEY,
      JSON.stringify({
        activatedAt: Date.now(),
        session: metadata.session ?? null,
        email: metadata.email ?? null,
      }),
    );
    // Fire an event so any mounted AdSlots can re-render without reload.
    window.dispatchEvent(new CustomEvent("holdlens:pro:activated"));
  } catch {
    /* swallow — localStorage full / disabled */
  }
}

/**
 * Deactivate Pro (e.g. user clicks "Revert to free tier" in settings).
 */
export function deactivatePro(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PRO_KEY);
    window.dispatchEvent(new CustomEvent("holdlens:pro:deactivated"));
  } catch {
    /* swallow */
  }
}

// ---------------------------------------------------------------------------
// CSV export quota — free tier gets 10 exports / calendar month.
// Pro users are unlimited. The count resets automatically on the 1st of
// each month (keyed by "YYYY-MM"). Honor-system: same philosophy as the
// Pro flag itself — no server enforcement, no hard block, just a soft
// gate that tells honest users they've hit the free limit.
// ---------------------------------------------------------------------------

const CSV_KEY = "holdlens_csv_v1";
const FREE_MONTHLY_EXPORTS = 10;

interface CsvRecord {
  count: number;
  month: string; // "YYYY-MM"
}

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function readCsvRecord(): CsvRecord {
  const m = currentMonth();
  if (typeof window === "undefined") return { count: 0, month: m };
  try {
    const raw = window.localStorage.getItem(CSV_KEY);
    if (!raw) return { count: 0, month: m };
    const parsed = JSON.parse(raw) as CsvRecord;
    // New month → reset
    return parsed.month === m ? parsed : { count: 0, month: m };
  } catch {
    return { count: 0, month: m };
  }
}

/**
 * Returns how many CSV exports remain this month for free-tier users.
 * Always returns Infinity for Pro users.
 */
export function csvExportsRemaining(): number {
  if (isProUser()) return Infinity;
  const rec = readCsvRecord();
  return Math.max(0, FREE_MONTHLY_EXPORTS - rec.count);
}

/**
 * Record one CSV export. Call AFTER a successful download.
 * No-ops for Pro users and SSR.
 */
export function recordCsvExport(): void {
  if (typeof window === "undefined" || isProUser()) return;
  try {
    const rec = readCsvRecord();
    window.localStorage.setItem(
      CSV_KEY,
      JSON.stringify({ count: rec.count + 1, month: rec.month }),
    );
  } catch {
    /* swallow */
  }
}
