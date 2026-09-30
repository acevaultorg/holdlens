// AmazonTopBar — the Amili Kit Amazon ad, ported feature-for-feature from how it renders on
// cabinpets.com/watchspecdb.com (tooling/fleet-kit/amazon-ad, vendored verbatim at
// lib/kit/amazon-ad.ts), not a hand-built one-off (per ~/.claude/fleet/AMILI/prompts/
// ui-job-checklist.md). Two prior revisions on this same card (mumlcoqwh2pkpm, then
// mumrr01hhc13tj/mumrri4c3o106i) hand-rolled Tailwind markup that broke at phone width; this
// revision uses the kit's OWN renderAd()/AD_CSS/AD_JS instead of re-deriving the layout.
//
// Image + live price: `api: "/amz/items"` below is a same-origin path exactly like
// cabinpets.com/approvedmodem.com serve it — those sites carry NO local /amz/items code either;
// the shared amili-amazon-ad Worker is bound to a Cloudflare zone-level Workers Route
// (holdlens.com/amz/items*) that intercepts the path before Pages Functions ever run, so this
// site never needs its own Creators API secrets. There is deliberately no functions/amz/ here
// (a local Pages Function would only risk shadowing that route) — the fix for HoldLens's ASINs
// to resolve is the Worker's allow-list, not this repo. Until the kit builder's allow-list add
// is live, /amz/items 404s (no route yet) and the kit's OWN designed fallback shows: our own
// title + benefit line + CTA, no image, no price — never a fabricated image or price.
// kit CTA button (Amazon-yellow #ffd814, kit's own AD_CSS), the info-icon disclosure popover,
// and the /go/ gated link (cfg.gate = "/go/dp", holdlens's existing probe-verified gate) are
// all live now, byte-identical to the other kit sites.
//
// FIT (YMYL): HoldLens is a 13F/investing site, so the two picks are the most load-bearing
// titles in CORE_CANON (data/books.ts) — never a generic product. Products carry `name`/`why`
// straight from that file's existing editorial copy (title/why fields) — zero fabrication.
//
// PLACEMENT: after the hero section (search box + CTAs), not above or inside it — placing a
// card this size ABOVE the hero risks pushing the hero's own search box below the fold at
// 375px, which the operator explicitly ruled out.
import { amazonAsin, booksByTitles } from "@/data/books";
import { renderAd, AD_CSS, AD_JS } from "@/lib/kit/amazon-ad";

const PICKS = ["The Intelligent Investor", "Poor Charlie's Almanack"];

// The kit's own product shape (lib/kit/amazon-ad.ts renderAd/pickProducts) — not exported as a
// TS type from that vendored file (it's plain JS with JSDoc), so declared once here.
// `expect` = the title this card must show: live data for any other title is ignored in the
// browser (the product matching guard; data/books.ts runs the build-time half).
type AmazonAdProduct = { asin: string; name: string; why: string; expect: string; by: string };

// Site-local layout for the two-book card. Every card is a complete title card on its own —
// author, title, one line on why, and the button — so a missing or failed cover never leaves
// an empty box: the image area only appears once a real cover has loaded (`has-img`, set by
// AD_JS on the image's load event). Fixed heights for both states, so nothing shifts.
// Colours follow the site's dark palette instead of the kit's white card.
const TOPBAR_CSS = `
.hl-books .ak-ad{--ak-ad-page:transparent;--ak-ad-bg:#141414;--ak-ad-fg:#e5e5e5;--ak-ad-muted:#9ca3af;--ak-ad-line:#262626;--ak-ad-cta-bg:#fbbf24;--ak-ad-cta-fg:#0a0a0a;--ak-ad-h1d:312px}
.hl-books .ak-ad-v1.ak-duo{padding:0}
.hl-books .ak-ad-v1.ak-duo .ak-ad-in{max-width:none}
.hl-books .ak-ad-v1.ak-duo .ak-ad-track{gap:12px}
.hl-books .ak-ad-v1.ak-duo .ak-ad-link{height:268px;padding:14px;gap:10px;border-radius:14px}
.hl-books .ak-ad-v1.ak-duo .ak-ad-link:hover{border-color:rgba(251,191,36,.4)}
.hl-books .ak-ad-v1.ak-duo .ak-ad-card .ak-ad-img{display:none}
.hl-books .ak-ad-v1.ak-duo .ak-ad-card.has-img .ak-ad-img{display:flex;height:96px;background:transparent}
.hl-books .ak-ad-v1.ak-duo .ak-ad-body{flex:1;gap:4px}
.hl-books .ak-ad-v1.ak-duo .ak-ad-brand{display:block;height:auto;font-size:11px;letter-spacing:.06em;text-transform:uppercase}
.hl-books .ak-ad-v1.ak-duo .ak-ad-title{font-size:15px;line-height:1.25;height:auto;max-height:2.5em}
.hl-books .ak-ad-v1.ak-duo .ak-ad-why{display:-webkit-box;-webkit-line-clamp:3;font-size:12.5px;line-height:1.4}
.hl-books .ak-ad-v1.ak-duo .has-img .ak-ad-why{display:none}
.hl-books .ak-ad-v1.ak-duo .ak-ad-price{height:auto;font-size:15px;margin-top:auto}
.hl-books .ak-ad-v1.ak-duo .ak-ad-cta{display:flex;align-items:center;justify-content:center;gap:6px;align-self:stretch;min-height:44px;margin-top:auto;padding:0 10px;font-size:13px;text-align:center;white-space:normal;line-height:1.2}
.hl-books .ak-ad-v1.ak-duo .has-price .ak-ad-cta{margin-top:6px}
.hl-books .ak-ad-foot{justify-content:flex-start}
`;

export default function AmazonTopBar() {
  const books = booksByTitles(PICKS);
  if (books.length === 0) return null; // both missing -> hide the whole box (kit contract)

  const products: AmazonAdProduct[] = books
    .map((b) => {
      const asin = amazonAsin(b);
      return asin ? { asin, name: b.title, why: b.why, expect: b.title, by: b.author } : null;
    })
    .filter((p): p is AmazonAdProduct => p !== null);
  if (products.length === 0) return null;

  const html = renderAd({
    variant: "v1",
    on: true, // always shown (this site has no A/B assignment) — kit contract, not a fixed hack
    fixed: true, // our own curated order, not the daily rotation
    duo: products.length === 2, // two books side by side, same layout comparison pages use
    n: products.length,
    products,
    disclosure:
      "As an Amazon Associate, HoldLens earns from qualifying purchases at no extra cost to you.",
    api: "/amz/items",
    gate: "/go/dp", // holdlens's existing, affiliate-gate-probe.sh-verified gesture-gated route
    page: "/",
    lang: "en",
    // No live price -> "See price on Amazon"; AD_JS swaps in "View on Amazon" only when a
    // live, dated price from /amz/items is shown on that card.
    labels: { sponsored: "Sponsored · affiliate link", cta: "See price on Amazon", ctaLive: "View on Amazon" },
  });

  return (
    <section
      aria-label="Sponsored: recommended investing books"
      className="hl-books max-w-5xl mx-auto px-6 mt-0 mb-8"
    >
      <h2 className="text-[13px] font-semibold text-dim mb-3 px-1">
        Two classic books on investing
      </h2>
      <style dangerouslySetInnerHTML={{ __html: AD_CSS + TOPBAR_CSS }} />
      <div
        data-akv="v1"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <script dangerouslySetInnerHTML={{ __html: AD_JS }} />
    </section>
  );
}
