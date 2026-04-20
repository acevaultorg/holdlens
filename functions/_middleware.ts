// CF Pages Function — content-type negotiation for AI agents.
// When a client sends `Accept: text/markdown`, we strip the site chrome
// and return a markdown representation of the page. Humans still get the
// full static HTML (default). No change for requests without the header.
//
// Closes "Markdown for Agents" on isitagentready.com.
// Zero impact on human traffic — only fires when Accept explicitly asks.

interface PagesContext {
  request: Request;
  next: () => Promise<Response>;
}

export const onRequest = async ({ request, next }: PagesContext): Promise<Response> => {
  const accept = request.headers.get("accept") || "";
  const wantsMarkdown = accept.toLowerCase().includes("text/markdown");

  if (!wantsMarkdown) return next();

  const response = await next();
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
