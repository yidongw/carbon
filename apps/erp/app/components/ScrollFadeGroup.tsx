import { cn } from "@carbon/react";
import { useEffect, useRef, useState } from "react";

// Horizontally scrollable group that fades its edges (matching the Menubar's
// `bg-card`) whenever there's more content off-screen — used to keep the method
// toolbars (item/style, job, quote) usable on narrow/mobile widths. Edge
// gradients only appear when the row actually overflows, so it's a no-op on
// desktop. Renders as a flex-1 element so a sibling (e.g. the version dropdown)
// can stay pinned beside it.
const ScrollFadeGroup = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setEdges({
        left: el.scrollLeft > 1,
        right: el.scrollWidth - el.clientWidth - el.scrollLeft > 1
      });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative min-w-0 flex-1">
      <div
        ref={ref}
        className="overflow-x-auto overscroll-x-contain scrollbar-hide"
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-card to-transparent transition-opacity duration-200",
          edges.left ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-card to-transparent transition-opacity duration-200",
          edges.right ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};

export default ScrollFadeGroup;
