/**
 * Pre-build script: generate per-ticker OG images for /signal/[ticker].
 *
 * Usage: npx tsx scripts/generate-og-images.ts
 *
 * Outputs 1200×630 PNG to public/og/signal/[TICKER].png.
 * Imported by generateMetadata() in app/signal/[ticker]/page.tsx.
 */

import satori from "satori";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { TICKER_INDEX } from "@/lib/tickers";
import { getConviction, convictionLabel, formatSignedScore } from "@/lib/conviction";

const WIDTH = 1200;
const HEIGHT = 630;
const OUT_DIR = join(process.cwd(), "public", "og", "signal");

async function loadFont(): Promise<ArrayBuffer> {
  // Fetch Inter Bold from Google Fonts CDN
  const res = await fetch(
    "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf"
  );
  return res.arrayBuffer();
}

async function main() {
  console.log("Generating OG images for signal pages...");

  await mkdir(OUT_DIR, { recursive: true });

  const fontData = await loadFont();
  const tickers = Object.keys(TICKER_INDEX);

  let count = 0;
  for (const symbol of tickers) {
    const conviction = getConviction(symbol);
    const { score, direction, buyerCount, sellerCount, ownerCount, name, sector } = conviction;
    const label = convictionLabel(score).label;
    const scoreText = formatSignedScore(score);

    const verdictColor =
      direction === "BUY" ? "#34d399" : direction === "SELL" ? "#fb7185" : "#9ca3af";
    const verdictBg =
      direction === "BUY"
        ? "rgba(52,211,153,0.08)"
        : direction === "SELL"
        ? "rgba(251,113,133,0.08)"
        : "rgba(156,163,175,0.05)";

    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            width: WIDTH,
            height: HEIGHT,
            backgroundColor: "#0a0a0a",
            padding: "48px 56px",
            fontFamily: "Inter",
            color: "#e5e5e5",
          },
          children: [
            // Top bar: brand + sector
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "32px",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: { display: "flex", alignItems: "center", gap: "10px" },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: { color: "#fbbf24", fontSize: "28px" },
                            children: "◉",
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: { fontSize: "22px", fontWeight: 700, color: "#e5e5e5" },
                            children: "HoldLens",
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "14px",
                        color: "#6b7280",
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.1em",
                      },
                      children: sector ?? "Signal Dossier",
                    },
                  },
                ],
              },
            },
            // Ticker + company
            {
              type: "div",
              props: {
                style: { display: "flex", flexDirection: "column", marginBottom: "24px" },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "72px",
                        fontWeight: 700,
                        color: "#fbbf24",
                        lineHeight: 1,
                      },
                      children: symbol,
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: { fontSize: "24px", color: "#9ca3af", marginTop: "8px" },
                      children: name,
                    },
                  },
                ],
              },
            },
            // Verdict box
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: verdictBg,
                  borderRadius: "16px",
                  border: `2px solid ${verdictColor}33`,
                  padding: "24px 32px",
                  flex: 1,
                },
                children: [
                  // Left: verdict + label
                  {
                    type: "div",
                    props: {
                      style: { display: "flex", flexDirection: "column" },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              fontSize: "56px",
                              fontWeight: 700,
                              color: verdictColor,
                              lineHeight: 1,
                            },
                            children: direction,
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              fontSize: "16px",
                              color: verdictColor,
                              opacity: 0.8,
                              marginTop: "6px",
                            },
                            children: label,
                          },
                        },
                      ],
                    },
                  },
                  // Right: score
                  {
                    type: "div",
                    props: {
                      style: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              fontSize: "64px",
                              fontWeight: 700,
                              color: verdictColor,
                              lineHeight: 1,
                            },
                            children: scoreText,
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: { fontSize: "14px", color: "#6b7280", marginTop: "6px" },
                            children: "ConvictionScore",
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            // Bottom: stats bar
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "24px",
                  fontSize: "14px",
                  color: "#6b7280",
                },
                children: [
                  {
                    type: "div",
                    props: {
                      children: `${buyerCount} buyers · ${sellerCount} sellers · ${ownerCount} holders`,
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: { color: "#fbbf24" },
                      children: "holdlens.com/signal/" + symbol,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        width: WIDTH,
        height: HEIGHT,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            weight: 700,
            style: "normal",
          },
        ],
      }
    );

    const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();
    await writeFile(join(OUT_DIR, `${symbol}.png`), png);
    count++;
  }

  console.log(`Generated ${count} OG images in ${OUT_DIR}`);
}

main().catch((err) => {
  console.error("OG image generation failed:", err);
  process.exit(1);
});
