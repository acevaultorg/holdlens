// The call-to-action line inside every text-only book card (InvestingBooks, /reading,
// /reading/[topic]). These cards never carry a live price, so the label is always
// "See price on Amazon" — "View on Amazon" is reserved for a card showing a live, dated
// price (the homepage top card, components/AmazonTopBar.tsx). The whole card is the link;
// this is its visible label, with an inline arrow icon in currentColor.
export default function SeePriceOnAmazon() {
  return (
    <span className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-[13px] font-medium text-brand">
      See price on Amazon
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        aria-hidden="true"
        focusable="false"
        className="transition group-hover:translate-x-0.5"
      >
        <path
          d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
