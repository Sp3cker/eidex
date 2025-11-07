// eidex/src/components/Map/ItemsBox/ItemsBox.tsx
import { memo, useEffect, useRef, useState } from "react";
import { useMapStore } from "@/stores/useMapStore";
import { formatMapString } from "@/utils/formatMapString";

import ItemsList from "./ItemsList";
import CameraIcon from "./CameraIcon";

const ItemsBox = memo(function ItemsBox() {
  const selectedMap = useMapStore((state) => state.selectedMap);
  const setViewingImage = useMapStore((state) => state.setViewingImage);
  const [isHeaderOverlaying, setIsHeaderOverlaying] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLDivElement>(null); // Ref for first item in list

  useEffect(() => {
    // Find the actual scrolling container by traversing up the DOM
    const findScrollContainer = (element: HTMLElement): HTMLElement | null => {
      if (!element || element === document.body) return null;

      const styles = window.getComputedStyle(element);
      const hasScroll =
        styles.overflowY === "auto" || styles.overflowY === "scroll";

      if (hasScroll && element.scrollHeight > element.clientHeight) {
        return element;
      }

      return findScrollContainer(element.parentElement!);
    };

    const scrollContainer = firstItemRef.current
      ? findScrollContainer(firstItemRef.current)
      : null;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      // Trigger overlay effect after scrolling past 40px
      setIsHeaderOverlaying(scrollTop > 40);
    };

    // Set initial state
    handleScroll();

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [selectedMap]); // Re-initialize when selected map changes

  // Web Animations API for header opacity
  useEffect(() => {
    if (!headerRef.current) return;

    const headerElement = headerRef.current;

    // Cancel any existing animation
    const existingAnimations = headerElement.getAnimations();
    existingAnimations.forEach((animation) => animation.cancel());

    // Use rAF to ensure animation starts on next frame
    const animationFrame = requestAnimationFrame(() => {
      const targetOpacity = isHeaderOverlaying ? 0.1 : 1;
      const targetBackdropFilter = isHeaderOverlaying
        ? "blur(8px)"
        : "blur(0px)";

      const currentOpacity = window.getComputedStyle(headerElement).opacity;
      const currentBackdropFilter =
        window.getComputedStyle(headerElement).backdropFilter;

      headerElement.animate(
        [
          {
            opacity: currentOpacity,
            backdropFilter:
              currentBackdropFilter === "none"
                ? "blur(0px)"
                : currentBackdropFilter,
          },
          {
            opacity: targetOpacity.toString(),
            backdropFilter: targetBackdropFilter,
          },
        ],
        {
          duration: 200,
          easing: "cubic-bezier(0.2, 0, 0, 1)",
          fill: "forwards",
        },
      );
    });

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isHeaderOverlaying]);

  const mapLabel =
    typeof selectedMap === "string" ? formatMapString(selectedMap) : "";

  return (
    <div className="flex h-full min-w-0 flex-col rounded rounded-l-lg">
      <div
        ref={headerRef}
        className="sticky top-0 z-10 flex min-w-0 items-center justify-between overflow-hidden"
      >
        <span className="flex min-w-0 flex-row items-center justify-center gap-3">
          {mapLabel && (
            <h2 className="font-calamity pb-2 min-w-0 truncate pr-2 text-left font-bold text-stone-50 text-shadow-xs transition-colors">
              {mapLabel}
            </h2>
          )}
        </span>
        <CameraIcon setViewingImage={setViewingImage} />
      </div>
      <div
        ref={firstItemRef}
        className="flex min-w-0 flex-1 flex-col rounded-sm"
      >
        <ItemsList />
      </div>
    </div>
  );
});

export default ItemsBox;
