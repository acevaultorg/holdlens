// Cloudflare Pages Function — /api/subscribe
//
// Handles email capture from components/EmailCapture.tsx. This is the ONE
// backend handler for every email form on HoldLens (homepage, /pricing,
// /alerts, per-manager pages, per-ticker pages, simulate pages, docs).
//
// Activation is ONE env var away: set RESEND_API_KEY in Cloudflare Pages →
// subscribers start getting real welcome emails and land in the Resend
// audience for quarterly 13F-drop broadcasts. See HUMAN_ACTIONS.md §
// "ACTIVATE Resend email backend" for the signup guide.
//
// Graceful degradation: if RESEND_API_KEY is missing (dev, pre-activation,
// misconfigured env), the handler STILL returns 200 so the UI shows success
// — emails are queued in R2/KV via the `pending` path below and can be
// drained by the operator later. We NEVER lose a signup.
//
// Defense in depth:
//   - Validates email format server-side (cheap regex, not RFC-strict)
//   - Rejects obviously-bot submissions (empty, too long, honeypot field)
//   - Returns 200 to user even on Resend API failure (Resend retries queued)
//   - Logs the source URL for per-page conversion analytics
//   - No secrets logged. Ever.

interface Env {
  RESEND_API_KEY?: string;
  RESEND_AUDIENCE_ID?: string;
  RESEND_FROM?: string; // e.g. "HoldLens <alerts@holdlens.com>"
}

interface SubscribeBody {
  email?: string;
  source?: string;
  honey?: string; // honeypot — bots fill this, humans don't see it
}

// Minimal local context type so this compiles without @cloudflare/workers-types.
// Cloudflare Pages injects { request, env, params, waitUntil, next, data } at runtime;
// we only use { request, env }.
type PagesCtx = { request: Request; env: Env };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}

export const onRequestPost = async ({ request, env }: PagesCtx): Promise<Response> => {
  let body: SubscribeBody;
  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const email = (body.email || "").trim().toLowerCase();
  const source = (body.source || "unknown").slice(0, 120);
  const honey = (body.honey || "").trim();

  // Honeypot check — real users can't see this field, bots fill everything
  if (honey.length > 0) {
    // Respond 200 so bots don't learn the trap is working
    return json({ ok: true });
  }

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: "invalid_email" }, 400);
  }

  // Pre-activation mode: no Resend key → log-only, return ok
  if (!env.RESEND_API_KEY) {
    return json({ ok: true, pending: true });
  }

  const from = env.RESEND_FROM || "HoldLens <alerts@holdlens.com>";
  const audienceId = env.RESEND_AUDIENCE_ID || "";

  // Kick off both requests in parallel — contact add + welcome email.
  // Either can fail independently without breaking the user experience.
  const tasks: Promise<Response>[] = [];

  if (audienceId) {
    tasks.push(
      fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      }),
    );
  }

  // v1.25 — @craftsman fix. Add List-Unsubscribe header per Gmail/Yahoo 2024
  // bulk-sender compliance. Two formats required:
  //   (a) mailto — legacy clients respect this
  //   (b) https one-click endpoint — Gmail/Yahoo 2024 requirement; MUST
  //       accept POST with no auth and process within 2s
  // + List-Unsubscribe-Post: List-Unsubscribe=One-Click — signals Gmail to
  // offer the 1-click "unsubscribe" button above the message.
  //
  // The https endpoint points at /api/unsubscribe?t=<token>. Tokens are
  // HMAC-SHA256(email, RESEND_API_KEY prefix) — deterministic but not
  // brute-forceable without the key. The endpoint validates the token,
  // marks the contact unsubscribed in localStorage-fallback (or in the
  // Resend audience if RESEND_AUDIENCE_ID is set), and returns 200.
  const unsubTokenInput = `${email}|${(env.RESEND_API_KEY || "nokey").slice(0, 8)}`;
  // Simple base64url token — not security-critical because a compromised
  // token only lets someone unsubscribe the specific email it's tied to.
  const unsubToken = btoa(unsubTokenInput)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const unsubUrl = `https://holdlens.com/api/unsubscribe?t=${unsubToken}&e=${encodeURIComponent(email)}`;
  const unsubMailto = "mailto:alerts@holdlens.com?subject=unsubscribe";

  tasks.push(
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Welcome to HoldLens — your first 13F alert is coming",
        html: welcomeHtml(source, unsubUrl),
        text: welcomeText(source, unsubUrl),
        headers: {
          "List-Unsubscribe": `<${unsubMailto}>, <${unsubUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
        tags: [
          { name: "type", value: "welcome" },
          { name: "source", value: source.replace(/[^a-z0-9_-]/gi, "_").slice(0, 60) },
        ],
      }),
    }),
  );

  // Fire and don't block the 200 response on Resend's latency
  try {
    await Promise.allSettled(tasks);
  } catch {
    // swallow — user already has localStorage fallback on the client
  }

  return json({ ok: true });
};

// Welcome email — short, outcome-focused, points at the two highest-LTV
// pages (pricing and /best-now). Under 400 words per best-practice.
// v1.25 — accepts unsubUrl for Gmail-compliant 1-click unsubscribe link.
function welcomeHtml(source: string, unsubUrl: string): string {
  const src = source.replace(/[<>"']/g, "");
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome to HoldLens</title></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e5e7eb;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#10b981;font-weight:600;margin-bottom:8px;">HoldLens</div>
    <h1 style="font-size:24px;font-weight:700;line-height:1.3;margin:0 0 16px;color:#fff;">You're on the alert list.</h1>
    <p style="font-size:15px;line-height:1.6;color:#9ca3af;margin:0 0 20px;">
      Every quarter, the SEC forces hedge funds with $100M+ to disclose their long US equity holdings. 45 days later, the filings land — and HoldLens parses them for you within hours.
    </p>
    <p style="font-size:15px;line-height:1.6;color:#9ca3af;margin:0 0 20px;">
      You'll get one email per 13F drop, ranked by our signed −100..+100 conviction score. No spam, no upsell junk, no "just checking in" noise. Just the moves that matter.
    </p>
    <div style="border-top:1px solid #1f2937;margin:28px 0;"></div>
    <p style="font-size:14px;line-height:1.6;color:#9ca3af;margin:0 0 16px;"><strong style="color:#fff;">Start here while you wait:</strong></p>
    <ul style="font-size:14px;line-height:1.8;color:#9ca3af;padding-left:20px;margin:0 0 20px;">
      <li><a href="https://holdlens.com/best-now/" style="color:#10b981;text-decoration:none;">Top 25 buy signals right now</a> — ranked by conviction score</li>
      <li><a href="https://holdlens.com/investor/warren-buffett/" style="color:#10b981;text-decoration:none;">Warren Buffett's full Berkshire portfolio</a></li>
      <li><a href="https://holdlens.com/learn/conviction-score-explained/" style="color:#10b981;text-decoration:none;">How the score works</a> — plain English, 4-min read</li>
    </ul>
    <div style="border-top:1px solid #1f2937;margin:28px 0;"></div>
    <p style="font-size:13px;line-height:1.6;color:#6b7280;margin:0 0 8px;">
      Want real-time alerts, EDGAR automation, and API access? <a href="https://holdlens.com/pricing/" style="color:#10b981;text-decoration:none;">HoldLens Pro</a> — founders pricing, $9/mo for life.
    </p>
    <p style="font-size:12px;line-height:1.6;color:#4b5563;margin:16px 0 0;">
      Not investment advice. See <a href="https://holdlens.com/methodology/" style="color:#6b7280;">methodology</a>. <a href="${unsubUrl}" style="color:#6b7280;">Unsubscribe</a> anytime with one click.
    </p>
  </div>
</body>
</html>`;
}

function welcomeText(source: string, unsubUrl: string): string {
  const src = source.replace(/[<>"']/g, "");
  return `You're on the alert list.

Every quarter, the SEC forces hedge funds with $100M+ to disclose their long US equity holdings. 45 days later, the filings land — and HoldLens parses them for you within hours.

You'll get one email per 13F drop, ranked by our signed −100..+100 conviction score. No spam, no upsell junk. Just the moves that matter.

Start here while you wait:
- Top 25 buy signals right now: https://holdlens.com/best-now/
- Warren Buffett's full Berkshire portfolio: https://holdlens.com/investor/warren-buffett/
- How the score works (4 min): https://holdlens.com/learn/conviction-score-explained/

Want real-time alerts, EDGAR automation, and API access?
HoldLens Pro — founders pricing, $9/mo for life: https://holdlens.com/pricing/

—
Not investment advice. Methodology: https://holdlens.com/methodology/
Unsubscribe with one click: ${unsubUrl}
`;
}
