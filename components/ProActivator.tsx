"use client";

import { useEffect } from "react";
import { activatePro } from "@/lib/pro";

// <ProActivator /> — drops into the /thank-you page to flip the local
// Pro flag on first render. Stripe redirects here after successful
// checkout with `?session=<cs_...>&email=<buyer>` in the URL; we persist
// that metadata so a future "activate on another device" flow can use
// it as a recovery code.
//
// Client-only (localStorage access). Renders nothing.

export default function ProActivator() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const session = params.get("session") ?? params.get("session_id") ?? undefined;
    const email = params.get("email") ?? undefined;
    activatePro({ session, email });
  }, []);
  return null;
}
