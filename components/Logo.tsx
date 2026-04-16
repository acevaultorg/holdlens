// <Logo /> — HoldLens brand mark. A lens with an offset iris and a crisp
// highlight dot. Reads at 16px (favicon) up to 400px+ (OG images, press).
//
// Design concept:
//   • Outer ring = the lens body (strokeWidth 1.75, currentColor)
//   • Inner disc = the iris — filled solid with currentColor, slightly
//     offset up-and-right so the mark has directional energy instead of
//     flat symmetry. This is the "distinguishing detail" @craftsman looks
//     for: instantly recognizable after one glance, hard to accidentally
//     reproduce.
//   • Light-catch dot = top-left on the iris, filled with the background
//     color. Gives the mark life — makes it a lens, not a target.
//
// Default size 24, default color currentColor so it inherits from parent.
// Use text-brand on the wrapping element to color it amber.
//
// Usage:
//   <Logo size={32} className="text-brand" />
//   <Logo size={20} className="text-text" /> (neutral)

type Props = {
  size?: number;
  className?: string;
  /**
   * Background color for the light-catch highlight dot. Should match the
   * surface the logo renders on. Default: CSS var --hl-bg.
   */
  bgColor?: string;
  /** Override the full accessible label. Default: "HoldLens logo". */
  title?: string;
};

export default function Logo({
  size = 24,
  className = "",
  bgColor = "var(--hl-bg, #0a0a0a)",
  title = "HoldLens logo",
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      {/* Outer lens ring */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      {/* Iris — offset up-and-right for directional energy */}
      <circle cx="13.2" cy="10.8" r="4.2" fill="currentColor" />
      {/* Light-catch highlight — top-left on the iris */}
      <circle cx="11.2" cy="9" r="1.15" fill={bgColor} />
    </svg>
  );
}
