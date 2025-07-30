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
  // const handleScroll = (e) => {
  //   const scrollTop = e.currentTarget.scrollTop;
  //   console.log(scrollTop);
  //   // Trigger overlay effect after scrolling past 40px
  //   setIsHeaderOverlaying(scrollTop > 40);
  // };
  // Web Animations API for header opacity
  useEffect(() => {
    if (!headerRef.current) return;

    const headerElement = headerRef.current; // The sticky div container
    if (!headerElement) return;

    // Cancel any existing animation
    const existingAnimations = headerElement.getAnimations();
    existingAnimations.forEach((animation) => animation.cancel());

    // Target opacity based on overlay state
    const targetOpacity = isHeaderOverlaying ? 0.1 : 1;
    const targetBackdropFilter = isHeaderOverlaying ? "blur(8px)" : "blur(0px)";

    // Animate opacity and backdrop blur
    const animation = headerElement.animate(
      [
        {
          opacity: headerElement.style.opacity || "1",
          backdropFilter: headerElement.style.backdropFilter || "blur(0px)",
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

    // Clean up on unmount
    return () => {
      animation.cancel();
    };
  }, [isHeaderOverlaying]);
  const mapLabel =
    typeof selectedMap === "string" ? formatMapString(selectedMap) : "";
  return (
    <div className="flex h-full flex-col rounded rounded-l-lg">
      <div
        ref={headerRef}
        className="sticky top-0 z-10 flex items-center justify-between"
      >
        <span className="flex flex-row items-center justify-center gap-3">
          {mapLabel && (
            <h2 className="cool-font md:text-md cursor-pointer text-left text-sm font-bold text-neutral-700 transition-colors">
              {mapLabel}
            </h2>
          )}
        </span>
        <CameraIcon setViewingImage={setViewingImage} />
      </div>
      <div
        ref={firstItemRef}
        className="font-pkmnem flex flex-1 flex-col rounded-sm"
      >
        <ItemsList />
      </div>
    </div>
  );
});

export default ItemsBox;
