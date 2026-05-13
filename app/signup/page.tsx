import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Create account — HoldLens",
  description:
    "Save a watchlist that syncs across devices, set 13F alerts, and unlock Pro features. Free account, no card.",
  alternates: { canonical: "https://holdlens.com/signup/" },
  robots: { index: false, follow: true }, // auth pages don't need to rank
};

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Create account
        </div>
        <h1 className="text-3xl font-bold mb-3">Save your watchlist + get alerts</h1>
        <p className="text-muted text-sm">
          Free account. No card. Your watchlist syncs across browsers.
        </p>
      </div>

      <SignupForm />

      <p className="text-center text-sm text-muted mt-6">
        Already have an account?{" "}
        <Link href="/login/" className="text-brand hover:underline font-semibold">
          Log in →
        </Link>
      </p>

      <div className="mt-12 pt-8 border-t border-border text-xs text-dim leading-relaxed text-center">
        By creating an account, you agree to HoldLens&apos;s{" "}
        <Link href="/terms/" className="underline hover:text-text">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy/" className="underline hover:text-text">
          privacy policy
        </Link>
        . HoldLens stores your email and watchlist — nothing more.
        We never sell your data.
      </div>
    </div>
  );
}
