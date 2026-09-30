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
import { booksByTitles } from "@/data/books";
import { renderAd, AD_CSS, AD_JS } from "@/lib/kit/amazon-ad";

const PICKS = ["The Intelligent Investor", "Poor Charlie's Almanack"];

// The kit's own product shape (lib/kit/amazon-ad.ts renderAd/pickProducts) — not exported as a
// TS type from that vendored file (it's plain JS with JSDoc), so declared once here.
type AmazonAdProduct = { asin: string; name: string; why: string };

export default function AmazonTopBar() {
  const books = booksByTitles(PICKS);
  if (books.length === 0) return null; // both missing -> hide the whole box (kit contract)

  const products: AmazonAdProduct[] = books
    .map((b) => {
      const asin = isbn13to10(b.isbn13);
      return asin ? { asin, name: b.title, why: b.why } : null;
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
    labels: { sponsored: "Sponsored · affiliate link" },
  });

  return (
    <section
      aria-label="Sponsored: recommended investing books"
      className="max-w-5xl mx-auto px-6 mt-0 mb-8"
    >
      <h2 className="text-[13px] font-semibold text-dim mb-2 px-1">
        Books the investors on this page swear by
      </h2>
      <style dangerouslySetInnerHTML={{ __html: AD_CSS }} />
      {/* Override: the kit's own AD_CSS forces the image slot visible (grey #f3f3f3 box) for
          `data-fixed` cards (renderAd's `fixed:true` below), because topCards on other sites are
          derived from the page's own already-in-stock links and always resolve an image. Here the
          image is genuinely optional (Creators API availability), so an unresolved image must stay
          collapsed — never a blank grey rectangle (Paulo, live screenshot 2026-09-30). AD_JS still
          adds `has-img` the moment a real image loads, which this override then shows normally. */}
      <style
        dangerouslySetInnerHTML={{
          __html: ".ak-ad-v1[data-fixed] .ak-ad-card:not(.has-img) .ak-ad-img{display:none}",
        }}
      />
      <div
        data-akv="v1"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <script dangerouslySetInnerHTML={{ __html: AD_JS }} />
    </section>
  );
}

/** ISBN-13 (978 prefix) -> ISBN-10 (== ASIN for print books). Mirrors data/books.ts's
 *  private helper — the kit's product shape takes an ASIN, data/books.ts's Book takes an
 *  ISBN-13, so this is the one place the two vocabularies meet. */
function isbn13to10(isbn13: string | null): string | null {
  if (!isbn13 || isbn13.length !== 13 || !isbn13.startsWith("978")) return null;
  const core = isbn13.slice(3, 12);
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (10 - i) * Number(core[i]);
  const check = (11 - (sum % 11)) % 11;
  const checkChar = check === 10 ? "X" : String(check);
  return core + checkChar;
}
