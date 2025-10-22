import { animated, config, useSprings } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { useCallback, startTransition } from "react";
import { useMapStore } from "@/stores/useMapStore";

/**
 * Animated toggle buttons that switch between the Pokémon list and Trainers list.
 * - Hover: button shifts 0.2rem to the right
 * - Selected: button shifts 0.4rem to the right
 */

const labels = ["Pokémon", "Trainers"] as const;

const InfoToggleButtons = () => {
  const trainersListOpen = useMapStore((s) => s.isTrainersListOpen);
  const setTrainersListOpen = useMapStore((s) => s.setTrainersListOpen);

  // 0 => Pokémon, 1 => Trainers
  const selectedIndex = trainersListOpen ? 1 : 0;
  // const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleSelect = useCallback(
    (index: number) => {
      startTransition(() => {
        setTrainersListOpen(index === 1);
      });
    },
    [setTrainersListOpen],
  );

  const [springs] = useSprings(
    labels.length,
    (i: number) => ({
      transform: `translateY(${i === selectedIndex ? 0 : 0.2}rem)`,
      scale: i === selectedIndex ? 1 : 0.99,
      config: config.stiff,
    }),
    [selectedIndex],
  );

  const bind = useGesture({
    onClick: ({ args: [index] }) => {
      handleSelect(index);
    },
  });

  return (
    <div className="font-pkmnem pkmnem-face-shadow pointer-events-auto flex flex-row gap-2 p-1 justify-center">
      {/* Render animated buttons */}
      {springs.map((spring, idx) => (
        <animated.div
          role="button"
          key={labels[idx]}
          {...bind(idx)}
          style={spring}
          className={`cursor-pointer ${selectedIndex == idx ? "bg-[#C03232] ring ring-1" : "bg-[#9A2828]"} rounded-sm px-2 py-1 text-sm font-bold leading-none text-neutral-200 md:text-base`}
        >
          {labels[idx]}
        </animated.div>
      ))}
    </div>
  );
};

export default InfoToggleButtons;
