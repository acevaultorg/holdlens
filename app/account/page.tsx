import type { Metadata } from "next";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "Account — HoldLens",
  description:
    "Manage your HoldLens account, watchlist, and alert preferences.",
  alternates: { canonical: "https://holdlens.com/account/" },
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Account
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">
        Your HoldLens account
      </h1>
      <p className="text-muted mb-10">
        Manage your watchlist, alerts, and subscription. Everything stays
        private — we never sell your data.
      </p>

      <AccountClient />
    </div>
  );
}
