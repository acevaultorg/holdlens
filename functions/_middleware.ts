// CF Pages Function — content-type negotiation for AI agents + soft-404 recovery.
//
// 1. `Accept: text/markdown` → strip site chrome, return markdown representation
//    (closes "Markdown for Agents" on isitagentready.com).
// 2. 404 on /signal/[X] or /ticker/[X] → render soft-200 "not tracked" page that
//    explains coverage + links to what IS tracked. Stops ~15,000/wk of wasted AI
//    crawler 4xx (SNAP, KR, MRK, PG, DHR etc. — plausible tickers outside our
//    30-investor coverage). CF Pages middleware runs AFTER static-asset lookup,
//    so AAPL/NVDA/etc pages still serve their real content — only missing paths
//    hit this fallback. Documented constraint: we do NOT use _redirects wildcards
//    (v2026-04-20a broke production by matching before static assets).

interface PagesContext {
  request: Request;
  next: () => Promise<Response>;
}

const TRACKED_SAMPLE = [
  "AAPL", "MSFT", "NVDA", "GOOG", "META", "AMZN", "TSLA", "BRK.B",
  "JPM", "V", "KO", "MA", "SPGI", "NFLX", "LLY", "SHOP",
] as const;

const SOFT_404_HEADERS = {
  "x-robots-tag": "noindex, follow",
  "cache-control": "public, max-age=3600, s-maxage=7200",
  "x-commercial-license": "https://holdlens.com/api-terms",
};

// Vulnerability scanner probes — WordPress admin, env file, git config, xmlrpc.
// These aren't AI bots, they're script kiddies sweeping for misconfigured hosts.
// Return 410 Gone (RFC 9110: "intentionally and permanently gone") so scanners
// tagged the path as dead and slow their retry rate. Saves ~2,834/wk edge 404s
// + stops the noise cluttering CF analytics. Single-slash-normalized path to
// catch `//shop/wp-includes/wlwmanifest.xml` style double-slash probes.
const ATTACK_PATH_RE = /\/(?:wp-(?:admin|includes|login|content|config)|wordpress|xmlrpc\.php|wp-login\.php|wp-config\.php|\.env(?:\.bak)?|\.git\/config)(?:$|\/)/i;

export const onRequest = async ({ request, next }: PagesContext): Promise<Response> => {
  const url = new URL(request.url);
  const normalizedPath = url.pathname.replace(/\/+/g, "/");
  if (ATTACK_PATH_RE.test(normalizedPath)) {
    return new Response("410 Gone. Not a WordPress site.", {
      status: 410,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=86400, s-maxage=604800",
        "x-robots-tag": "noindex",
      },
    });
  }

  const response = await next();

  // Soft-404 recovery for missing signal/ticker pages (81% of weekly 4xx leak).
  if (response.status === 404) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "");
    const match = path.match(/^\/(signal|ticker)\/([^/]+)$/);
    if (match) {
      const type = match[1] as "signal" | "ticker";
      const raw = decodeURIComponent(match[2] || "").toUpperCase();
      // Validate ticker shape — letters/digits/dot/hyphen, 1-10 chars — rejects
      // garbage paths + defence-in-depth against injection into rendered HTML.
      if (/^[A-Z0-9.\-_]{1,10}$/.test(raw)) {
        const accept = request.headers.get("accept") || "";
        const wantsMarkdown = accept.toLowerCase().includes("text/markdown");
        const body = wantsMarkdown
          ? renderNotTrackedMarkdown(type, raw)
          : renderNotTrackedHTML(type, raw);
        return new Response(body, {
          status: 200,
          headers: {
            ...SOFT_404_HEADERS,
            "content-type": wantsMarkdown
              ? "text/markdown; charset=utf-8"
              : "text/html; charset=utf-8",
          },
        });
      }
    }
  }

  // Markdown-for-Agents content negotiation (existing behaviour).
  const accept = request.headers.get("accept") || "";
  if (!accept.toLowerCase().includes("text/markdown")) return response;
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  const html = await response.text();
  const markdown = htmlToMarkdown(html);

  return new Response(markdown, {
    status: response.status,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(markdown.split(/\s+/).filter(Boolean).length),
      "access-control-allow-origin": "*",
      "cache-control": "public, max-age=300, s-maxage=3600",
      "x-commercial-license": "https://holdlens.com/api-terms",
    },
  });
};

function escapeHTML(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function renderNotTrackedHTML(type: "signal" | "ticker", ticker: string): string {
  const t = escapeHTML(ticker);
  const typeLabel = type === "signal" ? "Signal" : "Ticker";
  const hubPath = type === "signal" ? "/signals/" : "/tickers/";
  const hubLabel = type === "signal" ? "Signal Explorer" : "Ticker Directory";
  const sampleLinks = TRACKED_SAMPLE
    .map((s) => `<li><a href="/${type}/${encodeURIComponent(s)}/">${escapeHTML(s)}</a></li>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${t} not tracked — HoldLens ${typeLabel}</title>
<meta name="description" content="${t} is not currently held by the 30 superinvestors HoldLens tracks. See tracked ${type}s and recent 13F filings.">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="https://holdlens.com${hubPath}">
<meta name="theme-color" content="#0b0f14">
<style>
:root{--bg:#0b0f14;--fg:#e4e7eb;--mu:#8892a0;--ac:#facc15;--bd:#1e2530;--card:#151c27}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:var(--bg);color:var(--fg);line-height:1.6;padding:2rem 1rem;min-height:100vh}
.w{max-width:42rem;margin:0 auto}
.crumbs{color:var(--mu);font-size:.875rem;margin-bottom:2rem}
.crumbs a{color:var(--mu)}
h1{font-size:1.75rem;margin-bottom:1rem;font-weight:600}
h2{font-size:1.125rem;margin:2rem 0 .75rem;color:var(--fg);font-weight:600}
p{color:var(--mu);margin-bottom:1rem}
p.lead{color:var(--fg)}
a{color:var(--ac);text-decoration:none}
a:hover{text-decoration:underline}
ul.tickers{list-style:none;display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.5rem}
ul.tickers li a{display:inline-block;padding:.375rem .75rem;background:var(--card);border:1px solid var(--bd);border-radius:.375rem;font-size:.875rem;color:var(--fg)}
ul.tickers li a:hover{border-color:var(--ac);text-decoration:none}
.cta{display:inline-block;padding:.625rem 1.25rem;background:var(--ac);color:var(--bg);border-radius:.5rem;font-weight:600;margin-top:.5rem}
.cta:hover{text-decoration:none;opacity:.9}
strong{color:var(--fg)}
</style>
</head>
<body>
<main class="w">
<nav class="crumbs"><a href="/">HoldLens</a> › <a href="${hubPath}">${hubLabel}</a> › ${t}</nav>
<h1>${t} is not currently tracked</h1>
<p class="lead">HoldLens tracks the 13F holdings of <strong>30 tier-1 superinvestors</strong> — Warren Buffett, Bill Ackman, Michael Burry, Seth Klarman, Stanley Druckenmiller, and others. <strong>${t}</strong> is not currently held by any of them, or it's held below our significance threshold.</p>
<h2>What happens when coverage changes</h2>
<p>If a tracked superinvestor buys ${t} in an upcoming 13F filing, this page will automatically populate with their conviction score, position size, and entry quarter within hours of the filing going live on SEC EDGAR.</p>
<h2>Tickers currently tracked</h2>
<p>Click any ticker to see which superinvestors hold it and their multi-quarter conviction trend:</p>
<ul class="tickers">${sampleLinks}</ul>
<p><a class="cta" href="${hubPath}">Browse all ${hubLabel.toLowerCase()} →</a></p>
<h2>Related</h2>
<p><a href="/investor/">All 30 superinvestors</a> · <a href="/methodology/">How conviction scoring works</a> · <a href="/api/">API access</a></p>
</main>
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${ticker} — Not Currently Tracked`,
    description: `${ticker} is not currently in HoldLens' tracked 13F coverage of 30 superinvestors.`,
    isPartOf: { "@type": "WebSite", name: "HoldLens", url: "https://holdlens.com/" },
    publisher: { "@type": "Organization", name: "HoldLens", url: "https://holdlens.com/" },
  })}</script>
</body>
</html>`;
}

function renderNotTrackedMarkdown(type: "signal" | "ticker", ticker: string): string {
  const typeLabel = type === "signal" ? "signal" : "ticker";
  const hubPath = type === "signal" ? "/signals/" : "/tickers/";
  const sampleLines = TRACKED_SAMPLE.map((s) => `- [${s}](https://holdlens.com/${type}/${encodeURIComponent(s)}/)`).join("\n");
  return `# ${ticker} — not currently tracked

> ${ticker} is not held by the 30 superinvestors HoldLens tracks. Below: what's covered and how coverage updates.

HoldLens tracks the 13F holdings of 30 tier-1 superinvestors — Warren Buffett, Bill Ackman, Michael Burry, Seth Klarman, Stanley Druckenmiller, and others. **${ticker}** is not currently held by any of them, or is held below our significance threshold.

If a tracked superinvestor buys ${ticker} in an upcoming 13F filing, this page will populate with their conviction score, position size, and entry quarter within hours of the filing going live on SEC EDGAR.

## Sample tickers currently tracked

${sampleLines}

Browse all tracked ${typeLabel}s: https://holdlens.com${hubPath}

---

Full HTML at the same URL without \`Accept: text/markdown\`. Data licensed under [HoldLens API terms](https://holdlens.com/api-terms).
`;
}


function htmlToMarkdown(html: string): string {
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let body = mainMatch ? mainMatch[1] : html;

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? stripTags(titleMatch[1]).trim() : "";

  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  const description = descMatch ? descMatch[1].trim() : "";

  body = body
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "");

  body = body
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n\n# $1\n\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n\n## $1\n\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n\n### $1\n\n")
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n\n#### $1\n\n")
    .replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "\n\n##### $1\n\n")
    .replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "\n\n###### $1\n\n")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")
    .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*")
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "*$1*")
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "\n```\n$1\n```\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*/gi, "\n\n")
    .replace(/<\/div>\s*/gi, "\n")
    .replace(/<\/(ul|ol)>/gi, "\n");

  body = stripTags(body);

  body = body
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, "\"")
    .replace(/&rdquo;/g, "\"")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&#x2014;/g, "—");

  body = body
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const header = [
    title ? `# ${title}` : "",
    description ? `> ${description}` : "",
    "",
    "_Markdown representation. Full HTML at the same URL without the `Accept: text/markdown` header. Data licensed under [HoldLens API terms](https://holdlens.com/api-terms)._",
    "",
    "---",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  return header + "\n" + body + "\n";
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "");
}
