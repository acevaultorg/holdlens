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

import { useEffect, useState } from "react";

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const link = variant === "founders" ? STRIPE_LINK_FOUNDERS || STRIPE_LINK : STRIPE_LINK;
  const buttonLabel =
    label ||
    (variant === "founders" ? "Lock in €9/mo founders rate →" : "Subscribe to Pro →");

  // Not configured yet — render the same button but link to /alerts so the click captures
  // an email instead of bouncing the user. Operator drops in the link, user gets the real
  // checkout next time.
  if (!link) {
    return (
      <a
        href="/alerts"
        className={`block w-full text-center bg-brand text-black font-bold rounded-xl px-6 py-4 hover:opacity-90 transition ${className}`}
      >
        {mounted ? buttonLabel : "Get notified when Pro launches →"}
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
        // Plausible custom event — already loaded site-wide
        try {
          const w = window as Window & {
            plausible?: (name: string, opts?: object) => void;
          };
          w.plausible?.("Pro Checkout Click", { props: { variant } });
        } catch {
          // ignore
        }
      }}
    >
      {buttonLabel}
    </a>
  );
}
