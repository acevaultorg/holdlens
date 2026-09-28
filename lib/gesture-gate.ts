// @fleet/kit gesture-gate (Kit 3, card muh0qdb4epmv91, 2026-09-28) — ported verbatim from
// tooling/fleet-kit/gesture-gate/gesture-gate.mjs. Single source for both halves on holdlens:
// app/layout.tsx puts MINT_JS in an inline <head> script; functions/go/[[path]].ts requires
// hasFreshGesture() on every affiliate route.
//
// WHY: the gate trusted Sec-Fetch-* headers, which any HTTP client can send, so
// affiliate-gate-probe.sh reached tagged Amazon URLs. cc_g is a short-lived first-party cookie
// that only page JavaScript mints, inside a browser-dispatched (isTrusted) click on one of the
// site's own /go/ links. Fresh = minted within 10 min, not more than 60 s in the future.

export const MAX_AGE_MS = 600000;
export const SKEW_MS = 60000;

export const MINT_JS = "(function(){function m(e){try{if(!e.isTrusted)return;if(e.type==='auxclick'&&e.button!==1)return;var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a||a.host!==location.host||a.pathname.indexOf('/go/')!==0)return;document.cookie='cc_g='+Date.now().toString(36)+'; Path=/go/; Max-Age=600; SameSite=Lax; Secure'}catch(x){}}try{document.addEventListener('click',m,true);document.addEventListener('auxclick',m,true)}catch(x){}})();";

export function gestureTime(request: Request): number | null {
  const c = (request.headers.get("cookie") || "").match(/(?:^|;\s*)cc_g=([0-9a-z]{6,12})(?:;|$)/);
  if (!c) return null;
  const ts = parseInt(c[1], 36);
  return Number.isFinite(ts) ? ts : null;
}

export function hasFreshGesture(request: Request, now: number = Date.now()): boolean {
  const ts = gestureTime(request);
  return ts !== null && ts <= now + SKEW_MS && now - ts < MAX_AGE_MS;
}
