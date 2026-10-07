// Partner (non-Amazon) affiliate destinations — ONE place, read by both halves:
//   functions/go/[[path]].ts  (the gesture-gated redirect; crawlers never reach these URLs)
//   components/AffiliateCTA.tsx (renders a partner line only when its link here is non-empty)
// Tracked in git on purpose: a gitignored .env value is lost by any fresh checkout (the Headway trap).

// Simply Wall St — Impact campaign 40071 on Caslon 7598036, approved 2026-09-08; 55% of first paid subscription, 90d.
export const SWS_LINK = "https://goto.simplywall.st/c/7598036/3201528/40071";

// TradingView partner program — Paulo joined 2026-10-06 (thought mux4x3co86f2iv); link not received yet.
// Paste his personal referral link between the quotes, then `npm run deploy`. Empty = the TradingView line
// renders nowhere and /go/tv sends visitors home. Never put a guessed or placeholder link here.
export const TRADINGVIEW_LINK = "https://www.tradingview.com/?aff_id=1171933";
