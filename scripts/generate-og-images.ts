/**
 * Pre-build script: generate static OG images via Satori + Sharp.
 *
 * Usage: npx tsx scripts/generate-og-images.ts
 *
 * Outputs:
 *   public/og/signal/[TICKER].png   — per-ticker signal dossier (1200×630)
 *   public/og/investor/[slug].png   — per-manager portfolio card (1200×630)
 *   public/og/sector/[slug].png     — per-sector smart-money card (1200×630)
 */

import satori from "satori";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { TICKER_INDEX, SECTOR_MAP } from "@/lib/tickers";
import { getConviction, convictionLabel, formatSignedScore } from "@/lib/conviction";
import { MANAGERS } from "@/lib/managers";
import { getManagerROI } from "@/lib/manager-roi";

const SECTORS = [
  "Technology", "Financials", "Energy", "Healthcare",
  "Consumer Discretionary", "Consumer Staples", "Industrials",
  "Materials", "Real Estate", "Communication", "Utilities",
];
function slugify(s: string) { return s.toLowerCase().replace(/\s+/g, "-"); }

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

  console.log(`Generated ${count} signal OG images in ${OUT_DIR}`);

  // ── Investor OG images ─────────────────────────────────────────────────────
  console.log("Generating OG images for investor pages...");
  const investorDir = join(process.cwd(), "public", "og", "investor");
  await mkdir(investorDir, { recursive: true });

  let investorCount = 0;
  for (const m of MANAGERS) {
    const roi = getManagerROI(m.slug);
    const cagrText = roi.cagr10y !== 0
      ? `${roi.cagr10y >= 0 ? "+" : ""}${roi.cagr10y.toFixed(1)}% 10y CAGR`
      : "";
    const alphaText = roi.alpha10y !== 0
      ? `${roi.alpha10y >= 0 ? "+" : ""}${roi.alpha10y.toFixed(1)}% vs S&P`
      : "";
    const top3 = m.topHoldings.slice(0, 3).map((h) => h.ticker);

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
            // Top bar: brand + "Portfolio Card"
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
                      children: "Portfolio Card",
                    },
                  },
                ],
              },
            },
            // Manager name + fund
            {
              type: "div",
              props: {
                style: { display: "flex", flexDirection: "column", marginBottom: "20px" },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "56px",
                        fontWeight: 700,
                        color: "#fbbf24",
                        lineHeight: 1,
                      },
                      children: m.name,
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: { fontSize: "22px", color: "#9ca3af", marginTop: "8px" },
                      children: m.fund,
                    },
                  },
                ],
              },
            },
            // Philosophy quote
            {
              type: "div",
              props: {
                style: {
                  fontSize: "16px",
                  color: "#6b7280",
                  fontStyle: "italic" as const,
                  marginBottom: "24px",
                  maxWidth: "680px",
                  lineHeight: 1.5,
                },
                children: `"${m.philosophy}"`,
              },
            },
            // Stats + top holdings row
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "rgba(251,191,36,0.06)",
                  borderRadius: "16px",
                  border: "2px solid rgba(251,191,36,0.15)",
                  padding: "20px 28px",
                  flex: 1,
                },
                children: [
                  // Left: performance stats
                  {
                    type: "div",
                    props: {
                      style: { display: "flex", flexDirection: "column", gap: "6px" },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: { fontSize: "24px", fontWeight: 700, color: "#fbbf24" },
                            children: cagrText || m.role,
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: { fontSize: "16px", color: "#9ca3af" },
                            children: alphaText || `Tracked since ${m.startedTracking}`,
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: { fontSize: "14px", color: "#6b7280", marginTop: "4px" },
                            children: `${m.topHoldings.length} tracked positions`,
                          },
                        },
                      ],
                    },
                  },
                  // Right: top 3 ticker chips
                  {
                    type: "div",
                    props: {
                      style: { display: "flex", gap: "12px", alignItems: "center" },
                      children: top3.map((ticker) => ({
                        type: "div",
                        props: {
                          style: {
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#fbbf24",
                            backgroundColor: "rgba(251,191,36,0.08)",
                            border: "1px solid rgba(251,191,36,0.25)",
                            borderRadius: "8px",
                            padding: "8px 14px",
                          },
                          children: ticker,
                        },
                      })),
                    },
                  },
                ],
              },
            },
            // URL footer
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "16px",
                  fontSize: "14px",
                  color: "#fbbf24",
                },
                children: `holdlens.com/investor/${m.slug}`,
              },
            },
          ],
        },
      },
      {
        width: WIDTH,
        height: HEIGHT,
        fonts: [{ name: "Inter", data: fontData, weight: 700, style: "normal" }],
      }
    );

    const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();
    await writeFile(join(investorDir, `${m.slug}.png`), png);
    investorCount++;
  }
  console.log(`Generated ${investorCount} investor OG images in ${investorDir}`);

  // ── Sector OG images ───────────────────────────────────────────────────────
  console.log("Generating OG images for sector pages...");
  const sectorDir = join(process.cwd(), "public", "og", "sector");
  await mkdir(sectorDir, { recursive: true });

  let sectorCount = 0;
  for (const sector of SECTORS) {
    const slug = slugify(sector);
    // Gather tickers in this sector
    const tickers = Object.keys(TICKER_INDEX).filter((sym) => SECTOR_MAP[sym] === sector);
    const tickerConvictions = tickers
      .map((sym) => ({ sym, c: getConviction(sym) }))
      .sort((a, b) => b.c.score - a.c.score);
    const top3Sector = tickerConvictions.slice(0, 3);
    const netFlow = tickerConvictions.reduce((acc, t) => acc + t.c.score, 0);
    const flowDir = netFlow > 5 ? "NET BUYING" : netFlow < -5 ? "NET SELLING" : "MIXED";
    const flowColor = netFlow > 5 ? "#34d399" : netFlow < -5 ? "#fb7185" : "#9ca3af";
    const totalOwners = tickers.reduce((acc, sym) => acc + (TICKER_INDEX[sym]?.ownerCount ?? 0), 0);

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
            // Top bar: brand + "Sector Signal"
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
                      children: "Sector Smart Money",
                    },
                  },
                ],
              },
            },
            // Sector name
            {
              type: "div",
              props: {
                style: { display: "flex", flexDirection: "column", marginBottom: "24px" },
                children: [
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "64px",
                        fontWeight: 700,
                        color: "#fbbf24",
                        lineHeight: 1,
                      },
                      children: sector,
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: { fontSize: "20px", color: "#9ca3af", marginTop: "8px" },
                      children: `${tickers.length} stocks · ${totalOwners} ownership positions tracked`,
                    },
                  },
                ],
              },
            },
            // Net flow verdict box
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: `${flowColor}0d`,
                  borderRadius: "16px",
                  border: `2px solid ${flowColor}33`,
                  padding: "20px 28px",
                  flex: 1,
                },
                children: [
                  // Left: flow verdict
                  {
                    type: "div",
                    props: {
                      style: { display: "flex", flexDirection: "column" },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: { fontSize: "36px", fontWeight: 700, color: flowColor, lineHeight: 1 },
                            children: flowDir,
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: { fontSize: "15px", color: "#6b7280", marginTop: "8px" },
                            children: "Net superinvestor conviction",
                          },
                        },
                      ],
                    },
                  },
                  // Right: top 3 tickers with scores
                  {
                    type: "div",
                    props: {
                      style: { display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" },
                      children: top3Sector.map(({ sym, c }) => ({
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          },
                          children: [
                            {
                              type: "div",
                              props: {
                                style: {
                                  fontSize: "16px",
                                  fontWeight: 700,
                                  color: "#fbbf24",
                                  backgroundColor: "rgba(251,191,36,0.08)",
                                  border: "1px solid rgba(251,191,36,0.25)",
                                  borderRadius: "6px",
                                  padding: "4px 10px",
                                  minWidth: "56px",
                                  textAlign: "center" as const,
                                },
                                children: sym,
                              },
                            },
                            {
                              type: "div",
                              props: {
                                style: {
                                  fontSize: "15px",
                                  color: c.score > 0 ? "#34d399" : c.score < 0 ? "#fb7185" : "#9ca3af",
                                  fontWeight: 700,
                                  minWidth: "52px",
                                  textAlign: "right" as const,
                                },
                                children: formatSignedScore(c.score),
                              },
                            },
                          ],
                        },
                      })),
                    },
                  },
                ],
              },
            },
            // URL footer
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "16px",
                  fontSize: "14px",
                  color: "#fbbf24",
                },
                children: `holdlens.com/sector/${slug}`,
              },
            },
          ],
        },
      },
      {
        width: WIDTH,
        height: HEIGHT,
        fonts: [{ name: "Inter", data: fontData, weight: 700, style: "normal" }],
      }
    );

    const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();
    await writeFile(join(sectorDir, `${slug}.png`), png);
    sectorCount++;
  }
  console.log(`Generated ${sectorCount} sector OG images in ${sectorDir}`);

  // ── Homepage OG (v0.94) ────────────────────────────────────────────────────
  // Prior to this, holdlens.com had NO og:image, so every share on Twitter /
  // Slack / LinkedIn / WhatsApp / iMessage rendered as a text-only card. Now
  // the root `/` gets a branded 1200×630 hero matching the in-site palette
  // and lifts the exact value-prop copy off the homepage.
  console.log("Generating homepage OG image...");
  const homeDir = join(process.cwd(), "public", "og");
  await mkdir(homeDir, { recursive: true });

  const managerCount = MANAGERS.length;
  const tickerCount = Object.keys(TICKER_INDEX).length;

  const homeSvg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          width: WIDTH,
          height: HEIGHT,
          backgroundColor: "#0a0a0a",
          padding: "56px 64px",
          fontFamily: "Inter",
          color: "#e5e5e5",
        },
        children: [
          // Brand row
          {
            type: "div",
            props: {
              style: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "36px" },
              children: [
                { type: "div", props: { style: { color: "#fbbf24", fontSize: "36px" }, children: "◉" } },
                { type: "div", props: { style: { fontSize: "28px", fontWeight: 700 }, children: "HoldLens" } },
              ],
            },
          },
          // Kicker
          {
            type: "div",
            props: {
              style: {
                fontSize: "18px",
                color: "#fbbf24",
                textTransform: "uppercase" as const,
                letterSpacing: "0.12em",
                marginBottom: "18px",
                fontWeight: 700,
              },
              children: `SEC-FILED · ${managerCount} SUPERINVESTORS TRACKED`,
            },
          },
          // Hero
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                fontSize: "64px",
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: "28px",
              },
              children: [
                { type: "div", props: { style: { color: "#e5e5e5" }, children: "Spot smart money moves" } },
                { type: "div", props: { style: { color: "#fbbf24" }, children: "before the market does." } },
              ],
            },
          },
          // Sub
          {
            type: "div",
            props: {
              style: { fontSize: "22px", color: "#9ca3af", lineHeight: 1.4, marginBottom: "auto" },
              children: `Every 13F move scored on one signed −100..+100 ConvictionScore. Live prices. Free forever.`,
            },
          },
          // Footer strip: stats + domain
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid #262626",
                paddingTop: "22px",
                fontSize: "16px",
                color: "#858d9c",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { display: "flex", gap: "20px" },
                    children: [
                      { type: "div", props: { children: `${managerCount} managers` } },
                      { type: "div", props: { children: "·" } },
                      { type: "div", props: { children: `${tickerCount} tickers` } },
                      { type: "div", props: { children: "·" } },
                      { type: "div", props: { children: "150+ JSON endpoints" } },
                    ],
                  },
                },
                {
                  type: "div",
                  props: { style: { color: "#fbbf24", fontWeight: 700 }, children: "holdlens.com" },
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
      fonts: [{ name: "Inter", data: fontData, weight: 700, style: "normal" }],
    },
  );
  const homePng = await sharp(Buffer.from(homeSvg)).png({ quality: 92 }).toBuffer();
  await writeFile(join(homeDir, "home.png"), homePng);
  console.log(`Generated homepage OG image at ${homeDir}/home.png`);
}

main().catch((err) => {
  console.error("OG image generation failed:", err);
  process.exit(1);
});
