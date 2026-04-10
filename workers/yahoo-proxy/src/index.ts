// Yahoo Finance proxy Worker for holdlens.com
//
// Why this exists:
//   - query1.finance.yahoo.com returns 503 to most cloud-egress IPs unless a
//     real browser User-Agent is set. Browsers add it automatically; serverless
//     fetches do not. Adding it server-side makes the request work.
//   - corsproxy.io is rate-limited / 403'd in production. We need our own proxy.
//   - Cloudflare Workers free tier = 100k req/day, no API key, edge-cached.
//
// Routes (all GET):
//   /quote/:symbol?range=1y     → Yahoo v8 chart endpoint
//   /search/:symbol?count=8     → Yahoo v1 search endpoint (news)
//   /summary/:symbol            → Yahoo v10 quoteSummary endpoint (earnings)
//
// CORS: Allow-Origin: *  (single-purpose proxy, public market data)
// Cache: 60s for quote/summary, 15min for search

const ALLOWED_HOSTS = new Set([
  "query1.finance.yahoo.com",
  "query2.finance.yahoo.com",
]);

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function corsHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    ...extra,
  };
}

async function proxyYahoo(targetUrl: string, cacheSeconds: number): Promise<Response> {
  const u = new URL(targetUrl);
  if (!ALLOWED_HOSTS.has(u.hostname)) {
    return new Response(JSON.stringify({ error: "host not allowed" }), {
      status: 400,
      headers: corsHeaders({ "Content-Type": "application/json" }),
    });
  }

  // Use Cloudflare's edge cache
  const cache = caches.default;
  const cacheKey = new Request(targetUrl, { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) {
    return new Response(cached.body, {
      status: cached.status,
      headers: {
        ...Object.fromEntries(cached.headers),
        ...corsHeaders({ "X-Cache": "HIT" }),
      },
    });
  }

  // Fetch upstream with a real browser User-Agent
  const upstream = await fetch(targetUrl, {
    method: "GET",
    headers: {
      "User-Agent": UA,
      Accept: "application/json,text/plain,*/*",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://finance.yahoo.com/",
    },
  });

  const body = await upstream.text();
  const responseHeaders = corsHeaders({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": `public, max-age=${cacheSeconds}`,
    "X-Cache": "MISS",
    "X-Upstream-Status": String(upstream.status),
  });

  // Only cache successful responses
  if (upstream.ok) {
    const cacheable = new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": `public, max-age=${cacheSeconds}`,
      },
    });
    // Fire-and-forget cache write
    await cache.put(cacheKey, cacheable.clone());
  }

  return new Response(body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }
    if (request.method !== "GET") {
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders(),
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // /quote/:symbol  → v8 chart endpoint
    let m = path.match(/^\/quote\/([A-Z0-9.\-]+)\/?$/i);
    if (m) {
      const symbol = m[1].toUpperCase();
      const range = url.searchParams.get("range") || "1y";
      const target = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=${encodeURIComponent(range)}`;
      return proxyYahoo(target, 60);
    }

    // /search/:query  → v1 search endpoint (news)
    m = path.match(/^\/search\/([A-Z0-9.\-]+)\/?$/i);
    if (m) {
      const q = m[1];
      const count = url.searchParams.get("count") || "8";
      const target = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=0&newsCount=${encodeURIComponent(count)}&enableFuzzyQuery=false&lang=en-US&region=US`;
      return proxyYahoo(target, 900); // 15 min for news
    }

    // /summary/:symbol → v10 quoteSummary endpoint (earnings calendar)
    m = path.match(/^\/summary\/([A-Z0-9.\-]+)\/?$/i);
    if (m) {
      const symbol = m[1].toUpperCase();
      const target = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=calendarEvents,earnings,defaultKeyStatistics`;
      return proxyYahoo(target, 3600); // 1 hr for earnings
    }

    // Health check / discoverability
    if (path === "/" || path === "/health") {
      return new Response(
        JSON.stringify({
          name: "holdlens-yahoo-proxy",
          routes: [
            "/quote/:symbol?range=1y",
            "/search/:symbol?count=8",
            "/summary/:symbol",
          ],
          status: "ok",
        }),
        {
          status: 200,
          headers: corsHeaders({ "Content-Type": "application/json" }),
        }
      );
    }

    return new Response("Not found", {
      status: 404,
      headers: corsHeaders(),
    });
  },
};
