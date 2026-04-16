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
        border: "#262626",
        text: "#e5e5e5",
        muted: "#9ca3af",
        // dim: contrast bump (4.10 → 5.8 on bg) for WCAG AA readability
        dim: "#858d9c",

        // Brand identity ————————————————————————————————————
        // RESERVED USE: Pro/premium markers, single-primary-CTA per surface,
        // trust signals (SEC-sourced badge), active-nav + sticky-header
        // indicator. Do NOT use for generic "this is important" highlights —
        // use `accent` or the signal tokens instead.
        brand: "#fbbf24", // amber-400

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

        // Tinted surface helpers (for callout cards, banners, nudges) ——————
        // Use like bg-surface-buy, border-surface-sell for consistent
        // emerald/rose tinted panels across components.
        "surface-buy": "rgba(52, 211, 153, 0.08)",
        "surface-sell": "rgba(251, 113, 133, 0.08)",
        "surface-brand": "rgba(251, 191, 36, 0.08)",
        "surface-info": "rgba(56, 189, 248, 0.08)",
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
        "lift": "0 8px 24px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
        "float": "0 16px 48px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
