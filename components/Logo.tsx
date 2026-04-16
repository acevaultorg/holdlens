// <Logo /> — HoldLens brand mark. A lens with an offset iris.
// Reads at 16px (favicon) up to 400px+ (OG images, press).
//
// Design concept (v1.10 simplification):
//   • Outer ring = the lens body (strokeWidth 1.75, currentColor)
//   • Inner disc = the iris — filled solid with currentColor, slightly
//     offset up-and-right so the mark has directional energy instead of
//     flat symmetry. This offset is the distinguishing detail —
//     instantly recognizable, hard to accidentally reproduce.
//
// Previous versions had a third circle (a "light-catch" dot filled with
// the background color). In practice that dot scaled to a sub-pixel speck
// at favicon sizes (16/24px) where it read as a defect rather than a
// highlight. Removed. Great logos are 1-2 shapes, not 3.
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
  /** Override the full accessible label. Default: "HoldLens logo". */
  title?: string;
};

export default function Logo({
  size = 24,
  className = "",
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
      {/* Iris — offset up-and-right for directional energy. This offset
          (NOT centered) is what makes it read as a lens looking somewhere
          vs. a flat target/bullseye. */}
      <circle cx="13.2" cy="10.8" r="4.2" fill="currentColor" />
    </svg>
  );
}
