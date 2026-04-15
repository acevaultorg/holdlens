import type { Metadata } from "next";

// /support — dedicated surface for users who want to keep HoldLens free.
//
// HoldLens's core (unified ConvictionScore, signal dossiers, JSON API, live
// prices) is free forever. That costs real money to operate: EDGAR parsing,
// static hosting bandwidth, the live-quote worker proxy. Pro subscriptions
// cover most of it, but some readers want to contribute without locking into
// a subscription.
//
// This page lists every zero-approval tip-jar platform HoldLens supports.
// Each platform activates with one env var in Cloudflare Pages:
//   NEXT_PUBLIC_KOFI_USERNAME, NEXT_PUBLIC_BMAC_USERNAME,
//   NEXT_PUBLIC_LIBERAPAY_USERNAME, NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME
//
// If NONE is set, the page still renders — it shows the explanation and
// routes people to /pricing (the Pro subscription is the best support).

export const metadata: Metadata = {
  title: "Support HoldLens — keep it free",
  description:
    "HoldLens is free and will stay free. If it saved you a trade, buy us a coffee or grab Pro. Four zero-approval tip-jar options, plus Pro at €9/mo founders rate.",
  alternates: { canonical: "https://holdlens.com/support" },
  openGraph: {
    title: "Support HoldLens",
    description:
      "Keep HoldLens free. Ko-fi, Buy Me a Coffee, Liberapay, GitHub Sponsors — pick what works.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

type Platform = {
  key: string;
  brand: string;
  pitch: string;
  buildHref: (username: string) => string;
  accent: "brand" | "emerald" | "rose" | "text";
};

const PLATFORMS: Platform[] = [
  {
    key: "kofi",
    brand: "Ko-fi",
    pitch: "One-time or monthly tip. No platform fees on tips; Ko-fi is supported by an optional gold membership.",
    buildHref: (u) => `https://ko-fi.com/${encodeURIComponent(u)}`,
    accent: "brand",
  },
  {
    key: "bmac",
    brand: "Buy Me a Coffee",
    pitch: "€5 tip. No signup required for supporters. Clean, friendly, the classic.",
    buildHref: (u) => `https://buymeacoffee.com/${encodeURIComponent(u)}`,
    accent: "emerald",
  },
  {
    key: "liberapay",
    brand: "Liberapay",
    pitch: "Weekly recurring micro-donations. Non-profit, open-source, zero platform fee.",
    buildHref: (u) => `https://liberapay.com/${encodeURIComponent(u)}`,
    accent: "text",
  },
  {
    key: "github",
    brand: "GitHub Sponsors",
    pitch: "Monthly sponsorship via GitHub. Good fit if you're a developer and already use GitHub for your own stuff.",
    buildHref: (u) => `https://github.com/sponsors/${encodeURIComponent(u)}`,
    accent: "text",
  },
];

function readUsername(key: string): string | undefined {
  switch (key) {
    case "kofi":
      return process.env.NEXT_PUBLIC_KOFI_USERNAME;
    case "bmac":
      return process.env.NEXT_PUBLIC_BMAC_USERNAME;
    case "liberapay":
      return process.env.NEXT_PUBLIC_LIBERAPAY_USERNAME;
    case "github":
      return process.env.NEXT_PUBLIC_GITHUB_SPONSORS_USERNAME;
  }
  return undefined;
}

function accentBorder(a: Platform["accent"]): string {
  switch (a) {
    case "brand":
      return "border-brand/40 hover:border-brand";
    case "emerald":
      return "border-emerald-400/40 hover:border-emerald-400";
    case "rose":
      return "border-rose-400/40 hover:border-rose-400";
    default:
      return "border-border hover:border-text";
  }
}

function accentText(a: Platform["accent"]): string {
  switch (a) {
    case "brand":
      return "text-brand";
    case "emerald":
      return "text-emerald-400";
    case "rose":
      return "text-rose-400";
    default:
      return "text-text";
  }
}

export default function SupportPage() {
  const active = PLATFORMS.map((p) => {
    const u = readUsername(p.key);
    return { ...p, username: u, href: u ? p.buildHref(u) : undefined };
  });
  const anyLive = active.some((p) => p.href);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs uppercase tracking-widest text-brand font-semibold mb-4">
        Support
      </div>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
        HoldLens is free and will stay free.
      </h1>
      <p className="text-muted text-lg leading-relaxed mb-8">
        The full recommendation engine — the unified ConvictionScore, the signal dossiers, the live
        prices, the public JSON API, the multi-quarter trend detection — is free forever. That's
        not a Pro upsell trick; it's the core product. Pro (€9/mo founders rate) is for people who
        want email alerts on every 13F filing, EDGAR coverage for 80+ managers, weekly digests, and
        no ads.
      </p>
      <p className="text-muted leading-relaxed mb-8">
        If HoldLens saved you time on a trade and you don't want a subscription — or just want to
        say thanks — one of these works. Every option below is a direct tip; no platform middleman
        fees on the receiving end beyond the standard payment processing.
      </p>

      {/* Pro callout — highest-value support path */}
      <section className="rounded-2xl border-2 border-brand bg-brand/10 p-6 md:p-8 mb-10">
        <div className="text-[11px] uppercase tracking-widest text-brand font-bold mb-2">
          The best support → Pro subscription
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">€9/mo founders rate</h2>
        <p className="text-muted mb-5">
          If HoldLens is genuinely useful to your portfolio research, Pro is the right move —
          €9/mo locked for life (first 100 subscribers) gives you weekly digests, 13F filing
          alerts, EDGAR coverage for 80+ managers, and no ads. Pro is what funds the free core.
        </p>
        <a
          href="/pricing"
          className="inline-flex items-center bg-brand text-black font-bold rounded-lg px-5 py-3 hover:opacity-90 transition"
        >
          See Pro pricing →
        </a>
      </section>

      <h2 className="text-xl font-bold mb-4">Or tip us directly</h2>
      <div className="grid gap-3 sm:grid-cols-2 mb-10">
        {active.map((p) => {
          const cardClasses = `block rounded-xl border p-5 transition ${accentBorder(p.accent)} ${
            p.href ? "bg-panel" : "bg-panel/40 cursor-not-allowed opacity-70"
          }`;
          const inner = (
            <>
              <div className={`text-[11px] uppercase tracking-widest font-bold ${accentText(p.accent)} mb-1`}>
                {p.brand}
              </div>
              <div className="font-semibold text-text mb-1.5">
                {p.href ? "Open →" : "Not yet activated"}
              </div>
              <div className="text-[12px] text-muted leading-relaxed">{p.pitch}</div>
            </>
          );
          if (p.href) {
            return (
              <a
                key={p.key}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                // Tagged Plausible event — matches SupportBar so operator can
                // compare tip-platform conversion between footer chip and /support card.
                className={`plausible-event-name=Tip+Click plausible-event-platform=${p.key} plausible-event-surface=support-page ${cardClasses}`}
              >
                {inner}
              </a>
            );
          }
          return (
            <div key={p.key} className={cardClasses} aria-disabled>
              {inner}
            </div>
          );
        })}
      </div>

      {!anyLive && (
        <div className="rounded-xl border border-dashed border-border bg-panel/40 p-5 text-sm text-muted mb-10">
          Tip jars activate the moment the operator drops a platform username into the environment.
          In the meantime, the best support path is{" "}
          <a href="/pricing" className="text-brand hover:underline">
            Pro at €9/mo
          </a>
          .
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">What doesn't support us</h2>
      <ul className="space-y-3 text-sm text-muted leading-relaxed mb-10">
        <li>
          <strong className="text-text">Adblocker on.</strong> That's fine — we have Pro for a
          reason, and the ads are non-intrusive AdSense banners, not pop-unders. No dark patterns.
        </li>
        <li>
          <strong className="text-text">Following us on X.</strong> Thanks — but engagement on a
          social feed doesn't pay the EDGAR parser's bandwidth bill. A €5 one-time tip on Ko-fi
          does more.
        </li>
        <li>
          <strong className="text-text">Referring friends.</strong> Actually, this one is real — the
          more people who find HoldLens organically, the more Pro signups we get, and the more we
          can invest in more managers, more data. Share the{" "}
          <a href="/learn/superinvestor-handbook" className="text-brand hover:underline">
            handbook
          </a>{" "}
          with your investing group.
        </li>
      </ul>

      <p className="text-xs text-dim">
        HoldLens does not provide investment advice. We surface public SEC 13F filings and derive
        signals. Your donation does not create any advisory relationship — if it did, regulators
        would have a lot to say about it.
      </p>
    </div>
  );
}
