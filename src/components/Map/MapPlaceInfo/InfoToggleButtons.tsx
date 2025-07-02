import { animated, useSprings } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { useState, useCallback } from "react";
import { useMapStore } from "@/stores/useMapStore";

/**
 * Animated toggle buttons that switch between the Pokémon list and Trainers list.
 * - Hover: button shifts 0.2rem to the right
 * - Selected: button shifts 0.4rem to the right
 */
const gray500 = "#6b7280"; // Tailwind gray-500
const gray600 = "#4b5563"; // Tailwind gray-600
const gray700 = "#374151"; // Tailwind gray-700

const labels = ["Pokémon", "Trainers"] as const;

const InfoToggleButtons = () => {
  const trainersListOpen = useMapStore((s) => s.isTrainersListOpen);
  const setTrainersListOpen = useMapStore((s) => s.setTrainersListOpen);

  // 0 => Pokémon, 1 => Trainers
  const selectedIndex = trainersListOpen ? 1 : 0;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleSelect = useCallback(
    (index: number) => {
      // Trainers view when index === 1
      setTrainersListOpen(index === 1);
    },
    [setTrainersListOpen],
  );

  const [springs, api] = useSprings(labels.length, () => ({
    x: 0,
  }));

  // Update springs whenever selection/hover changes
  const updateSprings = useCallback(() => {
    api.start((i) => {
      const isSelected = i === selectedIndex;
      const isHovered = i === hoveredIndex;
      return {
        backgroundColor: isSelected ? (isHovered ? gray700 : gray600) : gray500,
        x: isSelected ? 0.4 : isHovered ? 0.2 : 0,
        config: { tension: 300, mass: 2 },
      };
    });
  }, [api, selectedIndex, hoveredIndex]);

  updateSprings();

  const bind = useGesture({
    onHover: ({ active, args: [index] }) => {
      setHoveredIndex(active ? index : null);
    },
    onClick: ({ args: [index] }) => {
      handleSelect(index);
    },
  });

  return (
    <div className="font-pkmnem pkmnem-face-shadow flex flex-row gap-2">
      {springs.map((spring, idx) => (
        <animated.div
          role="button"
          key={labels[idx]}
          {...bind(idx)}
          style={{
            transform: spring.x.to((x) => `translateX(${x}rem)`),
            ...spring,
          }}
          className="cursor-pointer px-2 py-1 text-sm font-bold leading-none text-neutral-800"
        >
          {labels[idx]}
        </animated.div>
      ))}
    </div>
  );
};

export default InfoToggleButtons;
