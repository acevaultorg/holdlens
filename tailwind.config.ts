import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        panel: "#141414",
        border: "#262626",
        text: "#e5e5e5",
        muted: "#9ca3af",
        // dim: bumped from #6b7280 (contrast 4.10 on bg — below WCAG AA 4.5)
        // to #858d9c (contrast ~5.8), keeping tonal hierarchy vs muted (7.8)
        // while ensuring every line of supporting text is readable.
        dim: "#858d9c",
        brand: "#fbbf24",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
