"use client";

import { useEffect } from "react";

// WebMCP — exposes HoldLens data tools to browser-side AI agents that
// implement the emerging navigator.modelContext API. Silent no-op if the
// browser doesn't support it. Closes the WebMCP check on isitagentready.com
// and opens a direct agent-integration surface.

export default function WebMCP() {
  useEffect(() => {
    const nav = navigator as unknown as {
      modelContext?: {
        provideContext?: (ctx: {
          tools: Array<{
            name: string;
            description: string;
            inputSchema: object;
            execute: (input: Record<string, unknown>) => Promise<unknown>;
          }>;
        }) => void;
      };
    };

    if (!nav.modelContext?.provideContext) return;

    nav.modelContext.provideContext({
      tools: [
        {
          name: "get_conviction_score",
          description:
            "Get HoldLens ConvictionScore (-100..+100) for any US-listed ticker. Computed from SEC 13F filings of 30 tier-1 portfolio managers, recency-weighted.",
          inputSchema: {
            type: "object",
            properties: {
              ticker: {
                type: "string",
                description: "US-listed ticker symbol (e.g. AAPL, NVDA, BRK.B)",
              },
            },
            required: ["ticker"],
          },
          execute: async ({ ticker }: Record<string, unknown>) => {
            const sym = String(ticker).toUpperCase();
            const res = await fetch(`/api/v1/scores/${sym}.json`);
            if (!res.ok) throw new Error(`No ConvictionScore data for ${sym}`);
            return res.json();
          },
        },
        {
          name: "get_manager_holdings",
          description:
            "Get full 13F holdings for a tracked superinvestor (Buffett, Ackman, Burry, Klarman, etc.)",
          inputSchema: {
            type: "object",
            properties: {
              slug: {
                type: "string",
                description:
                  "Manager slug (e.g. warren-buffett, michael-burry, bill-ackman)",
              },
            },
            required: ["slug"],
          },
          execute: async ({ slug }: Record<string, unknown>) => {
            const res = await fetch(`/api/v1/managers/${String(slug)}.json`);
            if (!res.ok) throw new Error(`No holdings data for manager ${slug}`);
            return res.json();
          },
        },
        {
          name: "get_best_now",
          description:
            "Top 50 buy candidates right now, ranked by ConvictionScore × position-size × recency.",
          inputSchema: { type: "object", properties: {} },
          execute: async () => {
            const res = await fetch("/api/v1/best-now.json");
            if (!res.ok) throw new Error("best-now feed unavailable");
            return res.json();
          },
        },
      ],
    });
  }, []);

  return null;
}
