// Amili Kit Amazon ad — HoldLens config (billboard only: top band + one mid slot on every page type).
// The tracking ID is NOT here: /go/amzad and /amz/items are served by the shared amili-amazon-ad Worker
// (pool: VAULT-Fleet tooling/fleet-kit/amazon-ad/pools/holdlens.com.mjs).
export default {
  site: "holdlens.com",
  variant: "none",
  placementAttrs: ["data-event-from", "data-from"],
  disclosure: "As an Amazon Associate, HoldLens earns from qualifying purchases and membership trials at no extra cost to you.",
  billboard: { variant: "auto", top: true, mid: true, midMove: true, headline: "{why}", midHeadline: "{why}" },
  catalog: [
    { asin: "0857197681", name: "The Psychology of Money", why: "Morgan Housel on behaviour, not formulas." },
    { asin: "0471445509", name: "Common Stocks and Uncommon Profits", why: "Philip Fisher's growth-investing classic." },
    { asin: "0966446143", name: "The Essays of Warren Buffett", why: "The shareholder letters, arranged by topic." },
    { asin: "007141228X", name: "Security Analysis", why: "Graham and Dodd on reading the numbers behind a company." },
    { asin: "0231162847", name: "The Most Important Thing Illuminated", why: "Howard Marks on risk and second-level thinking." },
    { asin: "B000FVNX2Q", name: "HP 12C Platinum calculator", why: "The standard for NPV, IRR and bond math." },
  ],
};
