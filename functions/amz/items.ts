// CF Pages Function — GET /amz/items?a=ASIN1,ASIN2 — live price/image data for the
// Amili Kit Amazon top card (components/AmazonTopBar.tsx, ported from
// lib/kit/amazon-ad.ts's makeItemsHandler, same contract as cabinpets.com/watchspecdb.com).
//
// Needs Cloudflare Pages secrets CREATORS_API_CREDENTIAL_ID + CREATORS_API_SECRET, which are
// NOT YET set on this project (verified 2026-09-29: `wrangler pages secret list --project-name
// holdlens` lists only ANTHROPIC_API_KEY + RESEND_API_KEY). Until an operator adds them, this
// endpoint returns {ok:false, reason:'no-credentials'} by design — the kit's own AD_JS then
// leaves the card in its compliant typographic state (our own title + benefit line + CTA, no
// image, no price — never fabricated). Adding the two secrets in the CF Pages dashboard is the
// ONLY step needed to light up real cover images/prices; no code change required.
import { makeItemsHandler } from "../../lib/kit/amazon-ad";
import { AMAZON_TAG } from "../../lib/amazon-gate";

// The only ASINs this endpoint will ever serve — the two books in AmazonTopBar's PICKS.
const ALLOW = ["0060555661", "1578643643"];

export const onRequestGet = makeItemsHandler({ tag: AMAZON_TAG, allow: ALLOW });
