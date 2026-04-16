"use client";
// Fires gtag('event', 'purchase', ...) once per session on the thank-you page.
// Deduplicates via sessionStorage so a page refresh doesn't double-count.
// Value defaults to 9 (founders rate) but prefers the `value` URL param
// if Stripe Payment Links ever passes it back via redirect_url params.
import { useEffect } from "react";

export default function PurchaseTracker() {
  useEffect(() => {
    try {
      const dedupeKey = "holdlens_purchase_fired";
      if (sessionStorage.getItem(dedupeKey)) return;

      // Prefer ?value= from URL (future Stripe redirect_url param support)
      const params = new URLSearchParams(window.location.search);
      const rawValue = params.get("value");
      const value = rawValue ? parseFloat(rawValue) : 9;

      // Stable transaction_id: session_id from Stripe if present, else date-based
      const sessionId = params.get("session_id");
      const transactionId = sessionId || `hl-${Date.now()}`;

      const w = window as Window & { gtag?: (...args: unknown[]) => void };
      if (typeof w.gtag === "function") {
        w.gtag("event", "purchase", {
          currency: "EUR",
          value,
          transaction_id: transactionId,
          items: [
            {
              item_id: "holdlens_pro",
              item_name: "HoldLens Pro",
              price: value,
              quantity: 1,
            },
          ],
        });
        sessionStorage.setItem(dedupeKey, "1");
      }
    } catch {
      // never let analytics block UX
    }
  }, []);

  return null;
}
