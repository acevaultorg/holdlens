// Cloudflare Pages Function — /api/thesis
//
// Generates an AI investment thesis for a ticker based on 13F positioning data.
// The client sends the relevant context (ticker, managers, scores) and this
// function calls Claude Haiku to synthesise it into a 2-paragraph thesis.
//
// Activation: set ANTHROPIC_API_KEY in Cloudflare Pages → Thesis generation
// goes live. Without the key, the endpoint returns a graceful pre-activation
// response so the UI degrades cleanly.
//
// Rate limiting: 5 requests per IP per cold-start instance (in-memory, resets
// on CF Worker recycle — acceptable for this use case). If you see abuse,
// add a KV-backed rate limiter or set THESIS_RATE_LIMIT=0 to disable entirely.
//
// Security:
// - Body size capped at 8 KB (rejects oversized payloads)
// - All string fields truncated server-side before being sent to Claude
// - No user-provided text is ever included verbatim in the prompt
// - ANTHROPIC_API_KEY never exposed to the client

interface Env {
  ANTHROPIC_API_KEY?: string;
  THESIS_RATE_LIMIT?: string; // "0" to disable, default "5"
}

interface OwnerInput {
  name: string;
  fund: string;
  positionPct: number;
  philosophy?: string;
  thesis?: string;   // the manager's own one-line thesis for this ticker
  action?: string;   // "new" | "add" | "trim" | "exit" — latest quarter action
  qualityScore?: number; // 1-10
}

interface ThesisBody {
  ticker: string;
  tickerName: string;
  sector?: string;
  signedScore: number;        // -100..+100 conviction score
  verdict: string;            // "BUY" | "SELL" | "NEUTRAL"
  ownerCount: number;
  topOwners: OwnerInput[];    // up to 5, ordered by position size
}

// In-memory rate limit — per IP, resets on cold start
const ipHits = new Map<string, number>();
const DEFAULT_RATE_LIMIT = 5;

type PagesCtx = { request: Request; env: Env };

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "access-control-allow-origin": "https://holdlens.com",
    },
  });
}

export const onRequestPost = async ({ request, env }: PagesCtx): Promise<Response> => {
  // ---------- Rate limit ----------
  const rateLimit =
    env.THESIS_RATE_LIMIT === "0"
      ? Infinity
      : parseInt(env.THESIS_RATE_LIMIT ?? String(DEFAULT_RATE_LIMIT), 10);
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const hits = (ipHits.get(ip) ?? 0) + 1;
  ipHits.set(ip, hits);
  if (hits > rateLimit) {
    return json({ ok: false, error: "rate_limited", pending: false }, 429);
  }

  // ---------- Body size guard ----------
  const raw = await request.text();
  if (raw.length > 8192) {
    return json({ ok: false, error: "payload_too_large" }, 413);
  }

  let body: ThesisBody;
  try {
    body = JSON.parse(raw) as ThesisBody;
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  // ---------- Validate required fields ----------
  const ticker = (body.ticker ?? "").toUpperCase().replace(/[^A-Z.]/g, "").slice(0, 10);
  const tickerName = (body.tickerName ?? "").slice(0, 80).replace(/[<>"']/g, "");
  const sector = (body.sector ?? "").slice(0, 40).replace(/[<>"']/g, "");
  const verdict = ["BUY", "SELL", "NEUTRAL"].includes(body.verdict) ? body.verdict : "NEUTRAL";
  const signedScore = Math.min(100, Math.max(-100, Number(body.signedScore) || 0));
  const ownerCount = Math.min(200, Math.max(0, Number(body.ownerCount) || 0));
  const topOwners = (body.topOwners ?? []).slice(0, 5).map((o) => ({
    name: String(o.name ?? "").slice(0, 60).replace(/[<>"']/g, ""),
    fund: String(o.fund ?? "").slice(0, 60).replace(/[<>"']/g, ""),
    positionPct: Math.min(100, Math.max(0, Number(o.positionPct) || 0)),
    philosophy: String(o.philosophy ?? "").slice(0, 120).replace(/[<>"']/g, ""),
    thesis: String(o.thesis ?? "").slice(0, 120).replace(/[<>"']/g, ""),
    action: ["new", "add", "trim", "exit"].includes(o.action ?? "") ? o.action! : "",
    qualityScore: Math.min(10, Math.max(1, Number(o.qualityScore) || 5)),
  }));

  if (!ticker || !tickerName) {
    return json({ ok: false, error: "missing_required_fields" }, 400);
  }

  // ---------- Pre-activation mode ----------
  if (!env.ANTHROPIC_API_KEY) {
    return json({
      ok: true,
      pending: true,
      thesis:
        `AI thesis generation is not yet active for ${ticker}. ` +
        `Set ANTHROPIC_API_KEY in Cloudflare Pages environment variables to enable this feature.`,
    });
  }

  // ---------- Build prompt ----------
  const scoreDescription =
    signedScore >= 50
      ? "very strong buy signal"
      : signedScore >= 20
      ? "moderate buy signal"
      : signedScore <= -50
      ? "very strong sell signal"
      : signedScore <= -20
      ? "moderate sell signal"
      : "neutral / no clear signal";

  const ownerLines = topOwners
    .map((o) => {
      const actionStr = o.action === "new" ? "(new position)" : o.action === "add" ? "(added)" : o.action === "trim" ? "(trimmed)" : o.action === "exit" ? "(exited)" : "";
      const thesisStr = o.thesis ? ` Their stated view: "${o.thesis}"` : "";
      const philStr = o.philosophy ? ` Philosophy: "${o.philosophy}"` : "";
      return `- ${o.name} (${o.fund}): ${o.positionPct.toFixed(1)}% of portfolio ${actionStr}.${thesisStr}${philStr}`;
    })
    .join("\n");

  const userPrompt = `Write a concise 2-paragraph investment thesis for ${ticker} (${tickerName}${sector ? `, ${sector} sector` : ""}), based on the 13F institutional positioning data below.

HoldLens conviction score: ${signedScore > 0 ? "+" : ""}${signedScore.toFixed(0)} out of ±100 (${scoreDescription}). ${ownerCount} tracked superinvestors currently hold this position.

Top institutional positions:
${ownerLines || "No top owner data available."}

Guidelines:
- Paragraph 1: Summarise what the smart money data shows about conviction level and trends. Reference specific managers by name where relevant.
- Paragraph 2: Explain what the positioning pattern implies about the investment thesis — what are these investors seeing, and what would need to change for the signal to reverse?
- Write in third person, past tense for manager actions. Do not give investment advice or price targets. Keep each paragraph under 80 words. Do not include a heading or title.`;

  // ---------- Call Claude Haiku ----------
  let thesis: string;
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 400,
        system:
          "You are a senior equity research analyst summarising institutional 13F filing data for retail investors. Write factual, data-driven thesis summaries. Never give financial advice or price targets. Always note that 13F data is 45 days old at publication.",
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error(`Anthropic API error ${response.status}: ${errText}`);
      return json({ ok: false, error: "ai_error" }, 502);
    }

    const data = (await response.json()) as {
      content?: Array<{ type: string; text: string }>;
    };
    thesis = data.content?.[0]?.text ?? "";
    if (!thesis) {
      return json({ ok: false, error: "empty_response" }, 502);
    }
  } catch (err) {
    console.error("Thesis generation failed:", err);
    return json({ ok: false, error: "ai_error" }, 502);
  }

  return json({ ok: true, pending: false, thesis });
};

// CORS preflight
export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "https://holdlens.com",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
};
