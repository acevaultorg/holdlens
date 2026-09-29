/**
 * SEC EDGAR text (13F issuer names, Form 4 titles) is stored HTML-escaped in data/*.json
 * ("ELI LILLY &amp; CO"). React escapes again on render, so visitors read a literal "&amp;".
 * Decode ONCE at the load boundary and let the renderer do the only escaping
 * (site-guard card multjtjjsck5gw, 2026-09-29).
 */
const NAMED: Record<string, string> = { amp: "&", apos: "'", quot: '"', lt: "<", gt: ">", nbsp: " " };

export function decodeEntities(s: string): string {
  if (!s.includes("&")) return s;
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const n = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : m;
    }
    return NAMED[e.toLowerCase()] ?? m;
  });
}

/** Deep-decode every string in a JSON value (objects/arrays rebuilt, other values untouched). */
export function decodeDeep<T>(v: T): T {
  if (typeof v === "string") return decodeEntities(v) as unknown as T;
  if (Array.isArray(v)) return v.map(decodeDeep) as unknown as T;
  if (v && typeof v === "object") {
    const o: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) o[k] = decodeDeep(x);
    return o as T;
  }
  return v;
}
