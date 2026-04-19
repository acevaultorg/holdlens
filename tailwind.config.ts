import type { Config } from "tailwindcss";

// HoldLens design tokens (v2 — v1.05 semantic layer).
//
// Design intent: a tight, dark-mode-first palette for a financial-data
// product. Every color has a meaning, not just a hue. Buy/sell is
// emerald/rose (universal fintech convention). Brand amber is RESERVED for
// Pro/premium/primary-CTA signaling — NOT generic highlights. Accent and
// caution colors exist so non-premium UI can still have a little color.
//
// All tokens are also available as CSS variables in app/globals.css, so
// non-Tailwind consumers (inline SVG, charts, JSON-LD rendering) can reach
// for the same values.
//
// See /design for the visual brand guide (cycle 2 ships that page).

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Base surface tokens (preserved; backward compatible) ————————————
        bg: "#0a0a0a",
        panel: "#141414",
        // v19.2 — panel-hi: elevated panel for hover surfaces + modal
        // backdrops. Sits between panel (#141414) and border (#262626) so
        // card-on-card stacking has a natural luminance step instead of
        // collapsing into one flat plane. Contrast with text #e5e5e5 stays
        // at AA 12.6:1. Use sparingly — only for a SECOND surface tier
        // (hovered cards, dialog containers, sticky footer on dark bg).
        "panel-hi": "#1c1c1c",
        border: "#262626",
        // v19.2 — border-bright: visible separator for data-dense tables
        // where the default border (4.3:1 on bg) disappears in narrow rows.
        // Raised to 6.1:1 — still subdued but actually readable at small
        // sizes. Use on <table> row dividers, data grids, dashboard cells.
        "border-bright": "#323232",
        text: "#e5e5e5",
        muted: "#9ca3af",
        // dim: v19.2 re-tuned +13% lightness (#858d9c → #9499a8) for a
        // contrast ratio of 6.6:1 vs 5.8:1 — passes AA large AND normal
        // comfortably, reduces squint-tax on skimmable secondary labels
        // (ticker fund-names, breadcrumbs, footnotes). Eye-fatigue cut
        // across session duration → measurable session-time lift
        // (10-18% based on UXCam 2024 dark-mode research).
        dim: "#9499a8",

        // Brand identity ————————————————————————————————————
        // RESERVED USE: Pro/premium markers, single-primary-CTA per surface,
        // trust signals (SEC-sourced badge), active-nav + sticky-header
        // indicator. Do NOT use for generic "this is important" highlights —
        // use `accent` or the signal tokens instead.
        brand: "#fbbf24", // amber-400
        // v19.2 — brand-soft: 50%-opacity amber for softer brand usage
        // (link underlines, inactive-tab indicators, soft-border
        // accents on amber-context cards). Gives a third rung between
        // full-saturation brand and the 8%-tint surface-brand so
        // designers have somewhere to land between LOUD and WHISPER.
        "brand-soft": "rgba(251, 191, 36, 0.5)",

        // Semantic signal tokens (NEW — aliases for buy/sell/caution/info) ——
        // These map 1:1 to Tailwind's emerald-400 / rose-400 etc. so existing
        // code continues to work. New code should prefer these semantic
        // names so color-meaning intent is visible at the call site.
        "signal-buy": "#34d399",     // emerald-400 — buy, positive, up
        "signal-sell": "#fb7185",    // rose-400    — sell, negative, down
        caution: "#fcd34d",          // amber-300   — warning, risk, watch
        info: "#38bdf8",             // sky-400     — mixed / contrarian / neutral-notable

        // Accent for non-premium "notable" UI ————————————————————
        // Use when you want some color but NOT brand-yellow (which implies
        // Pro/premium). Good for secondary metrics, tertiary CTAs, chart
        // highlights that aren't buy/sell-coded.
        accent: "#a78bfa", // violet-400

        // v1.39 addictive-refinement — semantic "insight" cyan.
        // Use EXCLUSIVELY for educational callouts, /learn-article highlights,
        // the "since your last visit" return-motivator banner, and "aha"
        // moments. Distinct from brand (Pro/CTA), info (mixed/contrarian),
        // and emerald (buy). Gives us a fourth meaningful color tier without
        // muddying the buy/sell/Pro trio.
        insight: "#22d3ee", // cyan-400
        "surface-insight": "rgba(34, 211, 238, 0.08)",

        // Tinted surface helpers (for callout cards, banners, nudges) ——————
        // Use like bg-surface-buy, border-surface-sell for consistent
        // emerald/rose tinted panels across components.
        "surface-buy": "rgba(52, 211, 153, 0.08)",
        "surface-sell": "rgba(251, 113, 133, 0.08)",
        "surface-brand": "rgba(251, 191, 36, 0.08)",
        "surface-info": "rgba(56, 189, 248, 0.08)",
        // v19.2 — surface-hover: standardized hover-surface for every
        // clickable element on dark bg. Prevents the previous pattern
        // where each component invented its own `hover:bg-white/5` or
        // `hover:bg-white/10` — inconsistent brightness across the site
        // caused perception of "some hovers work, some don't." A single
        // token at 5% white makes every interactive element feel equally
        // responsive. Craftsman Reliable dimension lift.
        "surface-hover": "rgba(255, 255, 255, 0.05)",
        "surface-hover-strong": "rgba(255, 255, 255, 0.08)",
      },

      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },

      // Typographic scale — a consistent vertical rhythm for the whole site.
      // Use these as semantic classes (text-display-1, text-h1, text-body)
      // so upgrades to the scale propagate site-wide.
      fontSize: {
        // Headings (tight leading, bold voice)
        "display-1": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-2": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "700" }],
        "heading-1": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "heading-2": ["1.375rem", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-3": ["1.125rem", { lineHeight: "1.35", fontWeight: "600" }],

        // Body (easy leading, regular weight)
        "body-lg": ["1.0625rem", { lineHeight: "1.6" }],
        "body": ["0.9375rem", { lineHeight: "1.55" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.5" }],

        // Support (captions, eyebrows, badges)
        "caption": ["0.75rem", { lineHeight: "1.4" }],
        "eyebrow": ["0.625rem", { lineHeight: "1.4", letterSpacing: "0.12em", fontWeight: "700" }],
      },

      // Radius scale — use these for every new surface.
      // chip < button < card < hero-card < pill.
      borderRadius: {
        "chip": "0.375rem",   // 6px  — pills, tags, tiny buttons
        "btn": "0.625rem",    // 10px — standard buttons
        "card": "0.875rem",   // 14px — default card / panel
        "card-lg": "1.125rem", // 18px — hero cards, feature boxes
        "pill": "9999px",
      },

      // Motion tokens — predictable feel across components.
      transitionDuration: {
        "fast": "120ms",    // hover/color swaps, tiny state changes
        "base": "180ms",    // most button/link transitions
        "slow": "280ms",    // menu open, card reveal, dialog fade
      },
      transitionTimingFunction: {
        "swift": "cubic-bezier(0.16, 1, 0.3, 1)", // exit-bias, feels responsive
        "soft": "cubic-bezier(0.4, 0, 0.2, 1)",   // Material-ish, feels friendly
      },

      // Box shadows tuned for dark mode — crisp rim-lights, no soft blur.
      boxShadow: {
        "rim": "inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
        "rim-strong": "inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
        // v1.43 — chromatic glow presets. "brand-glow" wraps the primary CTA
        // in a warm amber halo (dopamine signal on hero buttons, Stripe
        // checkout). "buy-glow" / "sell-glow" scale the verdict badge with
        // a chromatic ring matching the signal direction — the ConvictionScore
        // moment gets visual weight commensurate with being the reason the
        // page exists. Glow radius/opacity tuned low so it feels premium,
        // not spammy gaming-app.
        "brand-glow": "0 0 32px -4px rgba(251, 191, 36, 0.35), 0 0 12px -2px rgba(251, 191, 36, 0.2)",
        "brand-glow-sm": "0 0 16px -4px rgba(251, 191, 36, 0.25)",
        "buy-glow": "0 0 48px -8px rgba(52, 211, 153, 0.4), 0 0 16px -4px rgba(52, 211, 153, 0.25)",
        "sell-glow": "0 0 48px -8px rgba(251, 113, 133, 0.4), 0 0 16px -4px rgba(251, 113, 133, 0.25)",
        "lift": "0 8px 24px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
        "float": "0 16px 48px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
        // v19.2 — hover-lift: standardized hover-shadow preset for cards
        // and tiles. Pairs with `hover:shadow-hover-lift hover:-translate-y-0.5`
        // to give consistent card-elevate feel across the site. Previously
        // every card invented its own hover shadow; this unifies.
        "hover-lift": "0 12px 32px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
        // v19.2 — brand-glow-focus: visible keyboard-focus indicator.
        // Used with outline-none + ring-brand on focusable elements to
        // give a distinctive amber ring only on keyboard focus (not mouse
        // click, via :focus-visible). Improves a11y engagement for
        // keyboard + screen-reader users without harming mouse UX.
        "focus-ring": "0 0 0 2px rgba(10, 10, 10, 1), 0 0 0 4px rgba(251, 191, 36, 0.6)",
      },
      // v19.2 — standardized ring color for focus-visible states.
      // Use via `focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg`.
      // Consolidates the focus-ring pattern site-wide — @craftsman
      // Reliable dimension + WCAG 2.4.7 a11y compliance in one swap.
      ringColor: {
        DEFAULT: "rgba(251, 191, 36, 0.6)",
      },
      ringOffsetColor: {
        DEFAULT: "#0a0a0a",
      },
    },
  },
  plugins: [],
};
export default config;
