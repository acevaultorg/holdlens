import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log in — HoldLens",
  description:
    "Log in to your HoldLens account to access your synced watchlist and alert settings.",
  alternates: { canonical: "https://holdlens.com/login/" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
          Welcome back
        </div>
        <h1 className="text-3xl font-bold mb-3">Log in to HoldLens</h1>
        <p className="text-muted text-sm">
          Magic links are the easy path — no password to remember.
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-muted mt-6">
        New here?{" "}
        <Link href="/signup/" className="text-brand hover:underline font-semibold">
          Create account →
        </Link>
      </p>
    </div>
  );
}
