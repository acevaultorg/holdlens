import type { Metadata } from "next";
import Logo from "@/components/Logo";

// /design — HoldLens brand guide. Single-page visual reference documenting
// every token and design rule. Serves three audiences:
//   1. Internal: the operator + AcePilot agents reviewing UI work
//   2. Contributors: anyone adding UI needs to know the system
//   3. Press / trust: a public design system signals craft + seriousness
//
// Pure server component. No client JS. Uses every token in-page so the doc
// is also a visual test — any regression in tokens shows up here first.

export const metadata: Metadata = {
  title: "HoldLens Brand Guide — design tokens, colors, type, components",
  description:
    "The complete HoldLens design system. Every color, type scale, radius, shadow, and motion token documented with usage rules.",
  alternates: { canonical: "https://holdlens.com/design" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "HoldLens Brand Guide",
    description: "The complete design system — colors, type, components, tokens, rules.",
    type: "article",
  },
};

type Swatch = { name: string; token: string; hex: string; use: string; contrastOnBg?: string };

const BASE_SWATCHES: Swatch[] = [
  { name: "Background", token: "bg", hex: "#0a0a0a", use: "Page background, the deepest layer." },
  { name: "Panel", token: "panel", hex: "#141414", use: "Cards, dialogs, raised surfaces." },
  { name: "Border", token: "border", hex: "#262626", use: "Hairlines, dividers, card outlines." },
  { name: "Text", token: "text", hex: "#e5e5e5", use: "Primary body copy. ~15:1 on bg." },
  { name: "Muted", token: "muted", hex: "#9ca3af", use: "Secondary body. ~7.8:1 on bg." },
  { name: "Dim", token: "dim", hex: "#858d9c", use: "Captions, timestamps, labels. ~5.8:1 on bg — WCAG AA floor." },
];

const BRAND_SWATCHES: Swatch[] = [
  { name: "Brand", token: "brand", hex: "#fbbf24", use: "RESERVED — Pro, primary CTA, trust signal only. Never generic 'important'." },
];

const SIGNAL_SWATCHES: Swatch[] = [
  { name: "Signal Buy", token: "signal-buy", hex: "#34d399", use: "Buy signals, positive deltas, upward trends. Emerald-400 alias." },
  { name: "Signal Sell", token: "signal-sell", hex: "#fb7185", use: "Sell signals, negative deltas, downward trends. Rose-400 alias." },
  { name: "Caution", token: "caution", hex: "#fcd34d", use: "Warnings, risk flags, watch-list states. Distinct from brand amber." },
  { name: "Info", token: "info", hex: "#38bdf8", use: "Mixed / contrarian / neutral-notable. Sector-map default hue." },
  { name: "Accent", token: "accent", hex: "#a78bfa", use: "Secondary non-premium highlights. When you want color but NOT Pro signal." },
];

function SwatchCard({ swatch }: { swatch: Swatch }) {
  return (
    <div className="rounded-card-lg border border-border bg-panel p-5 flex flex-col gap-3">
      <div
        className="h-20 rounded-card"
        style={{ background: swatch.hex, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)" }}
        aria-hidden
      />
      <div>
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div className="font-semibold text-text">{swatch.name}</div>
          <code className="text-[11px] font-mono text-dim tabular-nums">{swatch.hex}</code>
        </div>
        <div className="text-[11px] font-mono text-dim mt-0.5">
          <span className="opacity-60">tailwind:</span> <span className="text-muted">{swatch.token}</span>
        </div>
        <p className="text-[13px] text-muted mt-2 leading-snug">{swatch.use}</p>
      </div>
    </div>
  );
}

function TypeSample({
  size,
  token,
  sample,
  ruleOfThumb,
}: {
  size: string;
  token: string;
  sample: string;
  ruleOfThumb: string;
}) {
  return (
    <div className="rounded-card border border-border bg-panel p-5">
      <div className="flex items-baseline justify-between mb-3 gap-2 flex-wrap">
        <code className="text-[11px] font-mono text-dim">text-{token}</code>
        <span className="text-[11px] font-mono text-dim tabular-nums">{size}</span>
      </div>
      <div className={`text-${token}`}>{sample}</div>
      <p className="text-[12px] text-muted mt-3 leading-snug">{ruleOfThumb}</p>
    </div>
  );
}

export default function DesignPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="mb-16">
        <div className="text-[10px] uppercase tracking-widest font-bold text-brand mb-3">
          Brand guide · v1.05
        </div>
        <h1 className="text-display-1 text-text">HoldLens design system.</h1>
        <p className="text-body-lg text-muted mt-4 max-w-2xl">
          Every color, every size, every shape. One source of truth. If it's not in
          this guide, it shouldn't be on the site.
        </p>
      </div>

      {/* Logo mark */}
      <section className="mb-16">
        <div className="text-eyebrow text-brand mb-3">Logo mark</div>
        <h2 className="text-display-2 mb-4">The lens, the iris, the light-catch.</h2>
        <p className="text-body text-muted max-w-2xl mb-8">
          HoldLens — a lens for smart money. The mark is a lens body (outer
          ring), an off-center iris (directional energy, not flat symmetry),
          and a highlight dot catching imaginary light from the top-left. It
          reads at 16px (favicon) and scales to 400px+ (OG, press). One form,
          one meaning.
        </p>
        <div className="grid md:grid-cols-4 gap-5">
          <div className="rounded-card-lg border border-border bg-panel p-6 flex flex-col items-center gap-4">
            <Logo size={64} className="text-brand" />
            <div className="text-center">
              <div className="text-caption font-mono text-dim">brand · 64px</div>
              <div className="text-body-sm text-muted mt-1">Primary usage</div>
            </div>
          </div>
          <div className="rounded-card-lg border border-border bg-panel p-6 flex flex-col items-center gap-4">
            <Logo size={40} className="text-brand" />
            <div className="text-center">
              <div className="text-caption font-mono text-dim">brand · 40px</div>
              <div className="text-body-sm text-muted mt-1">Featured cards</div>
            </div>
          </div>
          <div className="rounded-card-lg border border-border bg-panel p-6 flex flex-col items-center gap-4">
            <Logo size={24} className="text-brand" />
            <div className="text-center">
              <div className="text-caption font-mono text-dim">brand · 24px</div>
              <div className="text-body-sm text-muted mt-1">Site header</div>
            </div>
          </div>
          <div className="rounded-card-lg border border-border bg-panel p-6 flex flex-col items-center gap-4">
            <Logo size={16} className="text-brand" />
            <div className="text-center">
              <div className="text-caption font-mono text-dim">brand · 16px</div>
              <div className="text-body-sm text-muted mt-1">Favicon / inline</div>
            </div>
          </div>
        </div>

        {/* Alternate color variants */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="rounded-card border border-border bg-panel p-5 flex items-center justify-center gap-3">
            <Logo size={32} className="text-brand" />
            <span className="text-body-sm text-muted">on panel</span>
          </div>
          <div className="rounded-card border border-border bg-bg p-5 flex items-center justify-center gap-3">
            <Logo size={32} className="text-brand" />
            <span className="text-body-sm text-muted">on bg</span>
          </div>
          <div className="rounded-card border border-brand bg-brand p-5 flex items-center justify-center gap-3">
            <Logo size={32} className="text-black" />
            <span className="text-body-sm text-black/70">on brand</span>
          </div>
        </div>

        <div className="mt-8 rounded-card border border-border bg-panel p-5">
          <div className="text-eyebrow text-signal-buy mb-3">Logo rules</div>
          <ul className="text-body-sm text-muted space-y-2 leading-snug">
            <li>
              <span className="text-signal-buy font-semibold">✓ Do:</span> render
              at 16, 24, 32, 40, or 64px sizes. Use <code className="text-muted font-mono">text-brand</code>{" "}
              or <code className="text-muted font-mono">text-text</code> as color. Always on a solid
              background (bg, panel, or brand itself).
            </li>
            <li>
              <span className="text-signal-sell font-semibold">✗ Don&apos;t:</span> rotate, shear,
              recolor with gradients, add drop shadows, crop the iris, or place on
              busy photographic backgrounds.
            </li>
            <li>
              <span className="text-info font-semibold">•</span> Clear-space: minimum
              padding of 0.5× the logo size on all sides.
            </li>
          </ul>
        </div>
      </section>

      {/* Brand identity */}
      <section className="mb-16">
        <div className="text-eyebrow text-brand mb-3">Brand identity</div>
        <h2 className="text-display-2 mb-4">Amber is earned, not free.</h2>
        <p className="text-body text-muted max-w-2xl mb-8">
          <span className="text-text font-semibold">Brand amber</span> marks a
          Pro feature, the single primary CTA on a surface, or a trust signal
          (SEC-sourced, live prices). It does not mean &quot;this is
          important&quot; — if you want attention, use{" "}
          <span className="text-accent font-semibold">accent</span> or a signal
          color. Amber is currency; spend it sparingly.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {BRAND_SWATCHES.map((s) => <SwatchCard key={s.token} swatch={s} />)}
          {/* Example: correct vs incorrect brand usage */}
          <div className="rounded-card-lg border border-border bg-panel p-5 md:col-span-1">
            <div className="text-eyebrow text-signal-buy mb-3">Usage rules</div>
            <ul className="text-[13px] text-muted space-y-2 leading-snug">
              <li>
                <span className="text-signal-buy font-semibold">✓ Do:</span>{" "}
                primary CTA, Pro card borders, founders-rate badge, &quot;live&quot; dots
              </li>
              <li>
                <span className="text-signal-sell font-semibold">✗ Don&apos;t:</span>{" "}
                section eyebrows, regular link text, inline emphasis, ticker
                symbols
              </li>
              <li>
                <span className="text-info font-semibold">•</span> One brand CTA per
                surface. If there are two, one is not a primary.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Signal colors */}
      <section className="mb-16">
        <div className="text-eyebrow text-signal-buy mb-3">Signals</div>
        <h2 className="text-display-2 mb-4">Every hue has a meaning.</h2>
        <p className="text-body text-muted max-w-2xl mb-8">
          Financial data leans on color for instant comprehension. Each signal
          color has one job — don&apos;t overload them.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SIGNAL_SWATCHES.map((s) => <SwatchCard key={s.token} swatch={s} />)}
        </div>
      </section>

      {/* Surface colors */}
      <section className="mb-16">
        <div className="text-eyebrow text-info mb-3">Surfaces & text</div>
        <h2 className="text-display-2 mb-4">Dark-mode first, contrast always.</h2>
        <p className="text-body text-muted max-w-2xl mb-8">
          Three surface levels (bg → panel → border) and three text weights
          (text → muted → dim). Every combination meets WCAG AA contrast on
          the default background.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BASE_SWATCHES.map((s) => <SwatchCard key={s.token} swatch={s} />)}
        </div>
      </section>

      {/* Tinted surfaces */}
      <section className="mb-16">
        <div className="text-eyebrow text-accent mb-3">Tinted surfaces</div>
        <h2 className="text-display-2 mb-4">Callout cards, matched semantically.</h2>
        <p className="text-body text-muted max-w-2xl mb-8">
          Use <code className="text-muted font-mono text-[13px]">bg-surface-*</code> paired with{" "}
          <code className="text-muted font-mono text-[13px]">border-*-400/40</code> for color-coded
          callouts without custom CSS.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-card border border-signal-buy/40 bg-surface-buy p-5">
            <div className="text-eyebrow text-signal-buy mb-2">Buy</div>
            <div className="text-body-sm text-text">9 managers buying · +41 ConvictionScore</div>
          </div>
          <div className="rounded-card border border-signal-sell/40 bg-surface-sell p-5">
            <div className="text-eyebrow text-signal-sell mb-2">Sell</div>
            <div className="text-body-sm text-text">21 managers selling · −20 ConvictionScore</div>
          </div>
          <div className="rounded-card border border-brand/40 bg-surface-brand p-5">
            <div className="text-eyebrow text-brand mb-2">Pro</div>
            <div className="text-body-sm text-text">Founders rate · €9/mo for life</div>
          </div>
          <div className="rounded-card border border-info/40 bg-surface-info p-5">
            <div className="text-eyebrow text-info mb-2">Info</div>
            <div className="text-body-sm text-text">Mixed consensus · 3 buy, 3 sell</div>
          </div>
        </div>
      </section>

      {/* Type scale */}
      <section className="mb-16">
        <div className="text-eyebrow text-brand mb-3">Typography</div>
        <h2 className="text-display-2 mb-4">One scale. Five voices.</h2>
        <p className="text-body text-muted max-w-2xl mb-8">
          Use the semantic sizes. They compound across pages — changing{" "}
          <code className="text-muted font-mono text-[13px]">text-display-1</code> updates every hero.
        </p>
        <div className="space-y-3">
          <TypeSample size="48px / 1.05" token="display-1" sample="Smartest investors in the world." ruleOfThumb="Hero headline only. One per page." />
          <TypeSample size="36px / 1.1" token="display-2" sample="Where conviction meets opportunity." ruleOfThumb="Section heroes. Strong visual punctuation." />
          <TypeSample size="28px / 1.2" token="heading-1" sample="Top buy signals this quarter" ruleOfThumb="Page h1 on non-hero pages." />
          <TypeSample size="22px / 1.3" token="heading-2" sample="9 managers, $2.8B committed" ruleOfThumb="Section h2. Cards + detail headings." />
          <TypeSample size="18px / 1.35" token="heading-3" sample="Concentration profile" ruleOfThumb="Sub-section h3. Card titles." />
          <TypeSample size="17px / 1.6" token="body-lg" sample="The simple idea: track what the best portfolio managers actually own, not what they say." ruleOfThumb="Marketing paragraphs, hero subcopy." />
          <TypeSample size="15px / 1.55" token="body" sample="Every 13F move scored on a signed −100 to +100 scale." ruleOfThumb="Default body copy. Use everywhere unless you mean otherwise." />
          <TypeSample size="13px / 1.5" token="body-sm" sample="Filed Feb 14, 2026 · +3.2% since filing" ruleOfThumb="Compact data rows, table cells, secondary detail." />
          <TypeSample size="12px / 1.4" token="caption" sample="Not investment advice. Data sourced from SEC Form 13F filings." ruleOfThumb="Captions, footnotes, legal." />
        </div>
      </section>

      {/* Eyebrow */}
      <section className="mb-16">
        <div className="text-eyebrow text-brand mb-3">Eyebrow label</div>
        <h2 className="text-display-2 mb-4">Always all-caps, wide tracking.</h2>
        <p className="text-body text-muted max-w-2xl mb-8">
          Every section opens with an eyebrow — a one- or two-word
          orientation above the headline. Reinforces hierarchy without
          competing with the heading.
        </p>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="rounded-card border border-border bg-panel p-5">
            <div className="text-eyebrow text-brand">Top signals · Q4 2025</div>
            <div className="text-heading-2 mt-2 text-text">What to buy</div>
          </div>
          <div className="rounded-card border border-border bg-panel p-5">
            <div className="text-eyebrow text-signal-buy">Proof</div>
            <div className="text-heading-2 mt-2 text-text">Does it work?</div>
          </div>
          <div className="rounded-card border border-border bg-panel p-5">
            <div className="text-eyebrow text-info">SEC-sourced</div>
            <div className="text-heading-2 mt-2 text-text">30 investors tracked</div>
          </div>
        </div>
      </section>

      {/* Radius */}
      <section className="mb-16">
        <div className="text-eyebrow text-signal-buy mb-3">Radius</div>
        <h2 className="text-display-2 mb-4">Shape hierarchy, smaller → larger.</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { token: "rounded-chip", label: "chip · 6px", use: "Pills, tags, tiny buttons" },
            { token: "rounded-btn", label: "btn · 10px", use: "Standard buttons" },
            { token: "rounded-card", label: "card · 14px", use: "Default cards, callouts" },
            { token: "rounded-card-lg", label: "card-lg · 18px", use: "Hero cards, feature boxes" },
          ].map((r) => (
            <div key={r.token} className="flex flex-col items-center text-center gap-3">
              <div className={`${r.token} w-full h-20 bg-panel border border-border`} aria-hidden />
              <code className="text-[11px] font-mono text-dim">{r.label}</code>
              <p className="text-[12px] text-muted leading-snug">{r.use}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Motion */}
      <section className="mb-16">
        <div className="text-eyebrow text-info mb-3">Motion</div>
        <h2 className="text-display-2 mb-4">Three durations, two curves.</h2>
        <p className="text-body text-muted max-w-2xl mb-8">
          Respect <code className="text-muted font-mono text-[13px]">prefers-reduced-motion</code>.
          Everything below 280ms is non-intrusive enough that users with vestibular
          sensitivity won&apos;t notice.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { dur: "fast · 120ms", use: "Hover color swaps, link underlines, tooltip fades" },
            { dur: "base · 180ms", use: "Button states, card borders, most UI transitions" },
            { dur: "slow · 280ms", use: "Dialog fade, accordion open, carousel slides" },
          ].map((m) => (
            <div key={m.dur} className="rounded-card border border-border bg-panel p-5">
              <code className="text-[11px] font-mono text-dim">{m.dur}</code>
              <p className="text-body-sm text-muted mt-2 leading-snug">{m.use}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Components — buttons */}
      <section className="mb-16">
        <div className="text-eyebrow text-brand mb-3">Buttons</div>
        <h2 className="text-display-2 mb-4">One primary, one secondary.</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <button type="button" className="bg-brand text-black font-semibold rounded-btn px-6 py-3 hover:opacity-90 transition-base">
            Primary CTA
          </button>
          <button type="button" className="border border-signal-sell/40 bg-surface-sell text-signal-sell font-semibold rounded-btn px-6 py-3 hover:bg-signal-sell/10 transition-base">
            Sell action
          </button>
          <button type="button" className="border border-signal-buy/40 bg-surface-buy text-signal-buy font-semibold rounded-btn px-6 py-3 hover:bg-signal-buy/10 transition-base">
            Buy action
          </button>
          <button type="button" className="border border-border bg-panel text-text font-semibold rounded-btn px-6 py-3 hover:border-brand/40 transition-base">
            Tertiary
          </button>
        </div>
      </section>

      {/* Writing voice */}
      <section className="mb-16">
        <div className="text-eyebrow text-accent mb-3">Writing</div>
        <h2 className="text-display-2 mb-4">Outcome-first. Concrete. Honest.</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-card border border-signal-buy/40 bg-surface-buy p-6">
            <div className="text-eyebrow text-signal-buy mb-3">Good</div>
            <ul className="text-body-sm text-text space-y-2">
              <li>&quot;Understand every move by the smartest investors in the world.&quot;</li>
              <li>&quot;9 managers buying · 4 selling&quot;</li>
              <li>&quot;Lock in €9/mo for life&quot;</li>
              <li>&quot;Live prices. No signup. Free forever.&quot;</li>
            </ul>
          </div>
          <div className="rounded-card border border-signal-sell/40 bg-surface-sell p-6">
            <div className="text-eyebrow text-signal-sell mb-3">Avoid</div>
            <ul className="text-body-sm text-text space-y-2">
              <li>&quot;Spot smart money moves before the market does.&quot; <span className="text-dim">(promises alpha 13F can&apos;t deliver)</span></li>
              <li>&quot;Revolutionary AI-powered insights&quot; <span className="text-dim">(vague buzzwords)</span></li>
              <li>&quot;Get started in minutes&quot; <span className="text-dim">(generic)</span></li>
              <li>&quot;Join thousands&quot; <span className="text-dim">(fake social proof)</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* The Love Score rubric */}
      <section className="mb-16">
        <div className="text-eyebrow text-brand mb-3">Quality</div>
        <h2 className="text-display-2 mb-4">The Love Score rubric.</h2>
        <p className="text-body text-muted max-w-2xl mb-8">
          Every public-facing ship is scored across 5 dimensions before PR.
          Mean ≥ 0.5 ships; below is slop and gets flagged.
        </p>
        <div className="grid md:grid-cols-5 gap-3">
          {[
            { k: "Useful", rule: "Solves a real problem better than alternatives" },
            { k: "Delightful", rule: "Feels good to use, not just functional" },
            { k: "Reliable", rule: "Works every path, every device, every time" },
            { k: "Clear", rule: "Value obvious in ≤10 seconds" },
            { k: "Unique", rule: "Specifically better than any competitor" },
          ].map((d) => (
            <div key={d.k} className="rounded-card border border-border bg-panel p-4">
              <div className="text-heading-3 text-text mb-2">{d.k}</div>
              <p className="text-[12px] text-muted leading-snug">{d.rule}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-border text-caption text-dim">
        <p className="mb-2">
          This page lives at <code className="font-mono text-muted">/design</code>. Update{" "}
          <code className="font-mono text-muted">tailwind.config.ts</code> and{" "}
          <code className="font-mono text-muted">app/globals.css</code> together — the
          Tailwind config mirrors the CSS variables.
        </p>
        <p>
          Version 1.05 · semantic layer introduced · backward compatible with raw
          emerald-400 / rose-400 usage.
        </p>
      </footer>
    </div>
  );
}
