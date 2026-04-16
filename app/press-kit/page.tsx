import type { Metadata } from "next";
import PressKitClient from "./PressKitClient";

export const metadata: Metadata = {
  title: "Launch kit — ready-to-paste Show HN, Reddit, and X copy",
  description: "Pre-written launch posts for HoldLens. One-click copy for Show HN, r/investing, r/SecurityAnalysis, r/ValueInvesting, X threads, ProductHunt.",
  robots: { index: false, follow: false },
};

export default function PressKitPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-3">
        Operator launch kit · internal
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3">
        Ready to launch.
      </h1>
      <p className="text-muted text-lg max-w-2xl mb-10">
        Pre-written posts for every channel. Copy → paste → drive 5k–50k visitors per launch.
        Pick one channel per day to avoid burning all the goodwill at once.
      </p>

      <PressKitClient />
    </div>
  );
}
