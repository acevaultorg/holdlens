"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isAuthConfigured, subscribeAuth, type AuthUser } from "@/lib/auth";

// AuthStatus — tiny navbar pill. Shows "Sign in" when logged out OR auth
// not configured (graceful fallback); shows truncated email + → /account/
// when logged in. Renders client-side (auth state lives in localStorage
// via Supabase SDK). Zero impact on static-export pages.

export default function AuthStatus({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsub = subscribeAuth(setUser);
    return unsub;
  }, []);

  // SSR/build placeholder — render a neutral state so static export
  // hydrates cleanly without layout shift.
  if (!mounted) {
    return variant === "desktop" ? (
      <span className="ml-1 text-muted text-xs opacity-50">·</span>
    ) : null;
  }

  // Not signed in OR auth not configured → show "Sign in" link.
  if (!user) {
    return (
      <Link
        href={isAuthConfigured() ? "/login/" : "/signup/"}
        className={
          variant === "desktop"
            ? "ml-1 inline-flex items-center gap-1 text-muted hover:text-text transition text-sm font-semibold"
            : "block text-text font-semibold py-2"
        }
      >
        Sign in
      </Link>
    );
  }

  // Signed in — show truncated email + link to /account/.
  const label = user.email
    ? user.email.length > 18
      ? user.email.slice(0, 16) + "…"
      : user.email
    : "Account";

  return (
    <Link
      href="/account/"
      className={
        variant === "desktop"
          ? "ml-1 inline-flex items-center gap-1.5 text-text hover:text-brand transition text-sm font-semibold"
          : "block text-text font-semibold py-2"
      }
      title={user.email ?? "Account"}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden />
      <span>{label}</span>
    </Link>
  );
}
