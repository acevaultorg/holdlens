// Embed layout — strips the root layout's nav/header/footer for iframe embeds.
// Uses position:fixed + z-[100] to visually cover the root layout content so
// the iframe viewport shows only the conviction badge widget.
export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {children}
    </div>
  );
}
