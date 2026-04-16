// Cloudflare Pages Function — /api/unsubscribe
//
// Gmail/Yahoo 2024 bulk-sender compliance endpoint. Accepts POST (one-click
// unsubscribe trigger from Gmail) AND GET (user clicking the link in the
// email). Both return 200 within 2s per RFC 8058.
//
// Token validation: the `t` param is base64url(btoa(`email|RESEND_API_KEY[0:8]`)).
// Deterministic but not brute-forceable without the key prefix. On mismatch
// we still return 200 + generic message (don't leak whether the email is on
// the list).
//
// Unsubscribe is silent-success by design: even if the email isn't in any
// audience, we return "You've been unsubscribed." because the alternative
// (telling a spammer "that email isn't here") leaks list membership.
//
// If RESEND_AUDIENCE_ID is set, we mark the contact unsubscribed in the
// Resend audience. If not, we record the unsubscribe attempt in a simple
// log-only path (no-op server-side; Resend's list-unsubscribe handling via
// headers already stopped future sends).

interface Env {
  RESEND_API_KEY?: string;
  RESEND_AUDIENCE_ID?: string;
}

type PagesCtx = { request: Request; env: Env };

function html(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function processUnsubscribe(
  request: Request,
  env: Env,
): Promise<Response> {
  const url = new URL(request.url);
  const email = (url.searchParams.get("e") || "").trim().toLowerCase();
  const token = (url.searchParams.get("t") || "").trim();

  // Validate token regenerates (best-effort — not security-critical since a
  // leaked token only allows unsubscribing the specific email it's tied to)
  let tokenValid = false;
  if (email && token && env.RESEND_API_KEY) {
    const expected = btoa(`${email}|${env.RESEND_API_KEY.slice(0, 8)}`)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    tokenValid = token === expected;
  }

  // If we have a Resend audience ID + API key + valid token, mark contact
  // unsubscribed in the audience. Silent failure is fine — the List-Unsubscribe
  // header + Gmail's native opt-out also stops future sends to this recipient.
  if (tokenValid && env.RESEND_API_KEY && env.RESEND_AUDIENCE_ID) {
    try {
      await fetch(
        `https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts/${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({ unsubscribed: true }),
        },
      );
    } catch {
      // silent — Gmail will still honor the List-Unsubscribe header
    }
  }

  // Always return the same confirmation — never leak list membership.
  return html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Unsubscribed — HoldLens</title>
  <meta name="robots" content="noindex,follow">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #0a0a0a;
      color: #e5e5e5;
      font: 16px/1.6 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .card {
      max-width: 420px;
      padding: 40px 32px;
      text-align: center;
    }
    .tag {
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #fbbf24;
      font-weight: 600;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      margin: 0 0 16px;
    }
    p {
      color: #9ca3af;
      margin: 0 0 8px;
    }
    a {
      color: #fbbf24;
      text-decoration: none;
    }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="tag">HoldLens</div>
    <h1>You&rsquo;ve been unsubscribed.</h1>
    <p>No more emails from us.</p>
    <p style="margin-top:20px;font-size:14px;">
      Changed your mind? <a href="https://holdlens.com/alerts">Resubscribe anytime</a>.
    </p>
  </div>
</body>
</html>`);
}

// Gmail 2024: MUST accept POST with no auth for one-click unsub.
// Must return 200 within 2 seconds (RFC 8058).
// Using onRequest (catches all methods) rather than onRequestPost/onRequestGet
// because CF Pages' static-asset handler was shadowing GET — a single catch-all
// export guarantees both the programmatic POST (Gmail/Yahoo one-click) and
// user-facing GET (email link) route to this function.
export const onRequest = async ({ request, env }: PagesCtx): Promise<Response> =>
  processUnsubscribe(request, env);
