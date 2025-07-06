import { useRef, useEffect, ReactNode } from "react";
const styleOpacity = Object.freeze({
  opacity: 0,
});
export function FadeInWAAPI({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      // Only animate if we detect we're mounting after an async boundary
      const frame = requestAnimationFrame(() => {
        ref.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 130,
          easing: "ease",
          fill: "forwards",
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  return (
    <div ref={ref} style={styleOpacity}>
      {children}
    </div>
  );
}
