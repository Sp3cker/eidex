import { memo, useEffect, useRef } from "react";
import { useMapStore } from "@/stores/useMapStore";
import { useSearchSelectionStore } from "../Search/selectedSearchStore";

interface OpenButtonProps {
  className?: string;
}
let currentAnimation: Animation | null = null;

const moveAnimation = (ref: HTMLButtonElement, dir: string) => {
  if (currentAnimation) {
    currentAnimation.cancel();
    currentAnimation = null;
  }

  const animation = [
    { transform: "translateX(0%)" },
    { transform: "translateX(-89%)" },
  ];

  if (dir === "back") {
    animation.reverse();
  }

  currentAnimation = ref.animate(animation, {
    duration: 200,
    easing: "ease-out",
    fill: "forwards",
  });

  currentAnimation.addEventListener("finish", () => {
    currentAnimation = null;
  });

  currentAnimation.addEventListener("cancel", () => {
    currentAnimation = null;
  });

  return currentAnimation;
};
const OpenButton = memo(function OpenButton({ className }: OpenButtonProps) {
  const setPlacesListOpen = useMapStore((state) => state.setPlacesListOpen);
  const itemSearchFocused = useSearchSelectionStore(
    (state) => state.itemSearchFocused,
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    // Example: animate based on itemSearchSelected state
    if (itemSearchFocused) {
      moveAnimation(buttonRef.current, "forward");
    } else {
      moveAnimation(buttonRef.current, "back");
    }
  }, [itemSearchFocused]);
  return (
    <button
      ref={buttonRef}
      className={`places-list-button-z fixed left-0 top-1/5 content-visibilty -translate-y-1/2 cursor-pointer rounded-r-lg border border-l-0 border-gray-200 bg-gradient-to-br from-emerald-50 via-white to-gray-100 px-2 py-4 shadow-lg transition-all duration-200 hover:bg-emerald-100 ${className || ""}`}
      onClick={() => setPlacesListOpen(true)}
    >
      <p>Ξ</p>
    </button>
  );
});

export default OpenButton;
