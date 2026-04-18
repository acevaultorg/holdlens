"use client";
// Stripe Payment Link integration — the FASTEST path to actual paid revenue.
//
// Operator activation:
//   1. stripe.com/dashboard → Products → Add Product
//      "HoldLens Pro" — Recurring, $14/mo (or $9/mo founders)
//   2. Generate a Payment Link from that product
//   3. Drop the URL into Cloudflare Pages env var NEXT_PUBLIC_STRIPE_PAYMENT_LINK
//   4. Optional: NEXT_PUBLIC_STRIPE_PAYMENT_LINK_FOUNDERS for the discounted $9 rate
//   5. Redeploy — buttons go live, money flows
//
// Stripe Checkout handles everything — card, Apple Pay, Google Pay, link, customer creation,
// subscription billing, dunning, refunds. Zero backend code on our side. Webhook to Resend
// for welcome email is the only follow-up wire.
//
// Why Payment Links over hosted checkout: zero JS dependency on Stripe, works with output:'export',
// fully reversible (delete the product, button stops working).

// v1.42 — dropped `useEffect`/`useState` imports, component is now pure
// render (no hydration-dependent state). The `"use client"` directive is
// retained because the Stripe link onClick still fires Plausible + GA4
// tracking which need window-global access, but no React state hooks.

const STRIPE_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || "";
const STRIPE_LINK_FOUNDERS = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_FOUNDERS || "";

type Props = {
  variant?: "founders" | "standard";
  label?: string;
  className?: string;
};

export default function StripeCheckoutButton({
  variant = "founders",
  label,
  className = "",
}: Props) {
  const link = variant === "founders" ? STRIPE_LINK_FOUNDERS || STRIPE_LINK : STRIPE_LINK;
  const buttonLabel =
    label ||
    (variant === "founders" ? "Lock in €9/mo founders rate →" : "Subscribe to Pro →");

  // v1.42 — Stripe not configured → honestly label the button. Prior code
  // had a `mounted` guard that rendered "Get notified when Pro launches →"
  // on SSR then flashed to the real "Lock in €9/mo …" label after hydration.
  // That was BOTH a trust-break (label implies checkout, destination is
  // /alerts email capture) AND a paint-flicker. Fix: since the destination
  // is /alerts, the label ALWAYS reads as notify-when-live. Deterministic
  // server render, zero flicker, zero deception.
  if (!link) {
    return (
      <a
        href="/alerts"
        className={`block w-full text-center bg-brand text-black font-bold rounded-xl px-6 py-4 hover:opacity-90 transition ${className}`}
      >
        Get notified when Pro launches →
      </a>
    );
  }

  // Real Stripe Payment Link — the customer goes straight to checkout
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full text-center bg-brand text-black font-bold rounded-xl px-6 py-4 hover:opacity-90 transition ${className}`}
      onClick={() => {
        // Plausible + GA4 begin_checkout events — fire and forget, never block navigation
        try {
          const w = window as Window & {
            plausible?: (name: string, opts?: object) => void;
            gtag?: (...args: unknown[]) => void;
          };
          w.plausible?.("Pro Checkout Click", { props: { variant } });
          // GA4 begin_checkout — opens the conversion funnel in GA4 reports.
          // Allows creating a begin_checkout→purchase funnel without waiting
          // for organic clicks to populate the event in the Admin UI.
          w.gtag?.("event", "begin_checkout", {
            currency: "EUR",
            value: variant === "founders" ? 9 : 14,
            items: [
              {
                item_id: "holdlens_pro",
                item_name: "HoldLens Pro",
                price: variant === "founders" ? 9 : 14,
                quantity: 1,
              },
            ],
          });
        } catch {
          // ignore
        }
      }}
    >
      {buttonLabel}
    </a>
  );
}
