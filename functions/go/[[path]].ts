// CF Pages Function — the Amazon affiliate link gate (rules/affiliate-link-gate.md).
// Fleet Design A (same contract as meeplepick/colorcombinations): fail CLOSED
// unless the request carries browser navigation metadata. A harvester sends no
// Sec-Fetch-* headers and is bounced home untagged; an unknown /go/ shape also
// goes home, never a dead end on a money path. Hosts are hardcoded, so this can
// never become an open redirect. Since 2026-09-28 (Kit 3) it also requires a fresh
// cc_g gesture cookie, minted by the inline <head> script in app/layout.tsx.
import { AMAZON_TAG, AMAZON_BOOKS_DEPT, AUDIBLE_DEST } from "../../lib/amazon-gate";
import { hasFreshGesture } from "../../lib/gesture-gate";

const ASIN = /^[A-Z0-9]{10}$/;
const SWS_DEST = "https://goto.simplywall.st/c/7598036/3201528/40071";

function go(location: string): Response {
  return new Response(null, {
    status: 302,
    headers: { Location: location, "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

export const onRequest = async ({ request }: { request: Request }): Promise<Response> => {
  const url = new URL(request.url);
  const home = go(url.origin + "/");
  const path = url.pathname.replace(/\/+$/, "");

  const mode = request.headers.get("sec-fetch-mode");
  const site = request.headers.get("sec-fetch-site");
  const navOk = mode === "navigate" && (site === "same-origin" || site === "same-site");
  if (!navOk) return home;
  // Kit 3 (2026-09-28): Sec-Fetch alone is forgeable by any HTTP client. Every affiliate route
  // below also requires the cc_g cookie that only page JS mints on a trusted click (lib/gesture-gate.ts).
  if (!hasFreshGesture(request)) return home;

  if (path === "/go/audible") return go(AUDIBLE_DEST);
  // Simply Wall St (Impact campaign 40071, approved 2026-09-08 on Caslon 7598036, 55% of first paid
  // subscription, 90d). Behind the same gesture gate so crawlers never reach the Impact tracking link.
  if (path === "/go/sws") return go(SWS_DEST);
  if (path === "/go/dp") {
    const a = url.searchParams.get("a");
    if (!a || !ASIN.test(a)) return home;
    return go("https://www.amazon.com/dp/" + a + "?tag=" + AMAZON_TAG);
  }
  if (path === "/go/s") {
    const k = url.searchParams.get("k");
    if (!k) return home;
    return go("https://www.amazon.com/s?k=" + encodeURIComponent(k.slice(0, 160)) + "&i=" + AMAZON_BOOKS_DEPT + "&tag=" + AMAZON_TAG);
  }
  return home;
};
