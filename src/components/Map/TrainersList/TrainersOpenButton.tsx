import { memo, useEffect, useRef } from "react";
import { useMapStore } from "@/stores/useMapStore";
import { useSearchSelectionStore } from "../../Search/selectedSearchStore";

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
    { transform: "translateX(89%)" },
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

const TrainersOpenButton = memo(function TrainersOpenButton({ className }: OpenButtonProps) {
  const setTrainersListOpen = useMapStore((state) => state.setTrainersListOpen);
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
      className={`trainers-list-button-z fixed right-0 bottom-1/5 content-visibilty -translate-y-1/2 cursor-pointer rounded-l-lg border border-r-0 border-gray-200 bg-gradient-to-br from-orange-50 via-white to-red-100 px-2 py-4 shadow-lg transition-all duration-200 hover:bg-orange-100 ${className || ""}`}
      onClick={() => setTrainersListOpen(true)}
    >
      <p>⚔️</p>
    </button>
  );
});

export default TrainersOpenButton;
