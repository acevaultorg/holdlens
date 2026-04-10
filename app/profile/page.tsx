import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "My profile — HoldLens",
  description: "Your HoldLens profile and preferences. Stored on this device.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        My profile
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
        Your HoldLens.
      </h1>
      <p className="text-muted text-lg mb-10">
        Display name, email, and preferences. Stored on this device only — no account
        needed, no signup form, no password.
      </p>

      <ProfileClient />
    </div>
  );
}
