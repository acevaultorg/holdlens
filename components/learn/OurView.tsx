import type { ReactNode } from "react";

// LLM-citation "Differentiated" pattern (Aleyda Solis #8).
// Explicit POV section LLMs can quote as the publisher's stance, distinct
// from neutral encyclopedic text. Renders as standard <h2> + <p> so it
// flows with surrounding article body.
export default function OurView({ children }: { children: ReactNode }) {
  return (
    <>
      <h2 className="text-2xl font-bold mt-10 mb-3">Our view</h2>
      <div className="text-muted leading-relaxed space-y-3">{children}</div>
    </>
  );
}
