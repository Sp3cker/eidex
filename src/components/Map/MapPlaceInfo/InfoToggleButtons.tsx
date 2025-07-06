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

  // const handleHover = useCallback(
  //   (index: number | null) => {
  //     if (index === selectedIndex) return;
  //     // hover over selected, return
  //     // on select, wiggle up 2/2
  //     api.start((i) => {
  //       if (i === index) {
  //         // hover over not selected, wiggle up 1/2
  //         return {
  //           y: -0.2,
  //           config: { tension: 300, mass: 2 },
  //         };
  //       } else {
  //         // Reset to default for non-hovered items OR after cursor leaves hovered
  //         return {
  //           y: 0,
  //           config: { tension: 300, mass: 2 },
  //         };
  //       }
  //     });
  //   },
  //   [selectedIndex],
  // );
  const [springs] = useSprings(
    labels.length,
    (i: number) => ({
      filter: i === selectedIndex ? 2 : 0,
      y: i === selectedIndex ? 0 : 0.2,
      scale: i === selectedIndex ? 1 : 0.99,
      config: config.stiff,
    }),
    [trainersListOpen, selectedIndex],
  );
  // useEffect(() => {
  // Initialize springs based on the selected index
  // api.start((i) => {
  //   if (i === selectedIndex) {
  //     return {
  //       backgroundColor: gray700,
  //       y: 0.3,
  //       config: { tension: 300, mass: 2 },
  //     };
  //   } else {
  //     return {
  //       filter: ""
  //       y: 0,
  //       config: { tension: 300, mass: 2 },
  //     };
  //   }
  // });
  // }, []);

  // Update springs whenever selection/hover changes
  // const updateSprings = useCallback(() => {
  //   api.start((i) => {
  //     const isSelected = i === selectedIndex;
  //     const isHovered = i === hoveredIndex;
  //     return {
  //       backgroundColor: isSelected ? (isHovered ? gray700 : gray600) : gray500,
  //       x: isSelected ? 0.4 : isHovered ? 0.2 : 0,
  //       config: { tension: 300, mass: 2 },
  //     };
  //   });
  // }, [api, selectedIndex, hoveredIndex]);

  // updateSprings();

  const bind = useGesture({
    // onHover: ({ active, args: [index] }) => {
    //   // setHoveredIndex(active ? index : null);
    //   handleHover(active ? index : null);
    // },
    onClick: ({ args: [index] }) => {
      handleSelect(index);
    },
  });

  return (
    <div className="font-pkmnem pkmnem-face-shadow flex flex-row gap-2 p-1">
      {/* Render animated buttons */}
      {springs.map((spring, idx) => (
        <animated.div
          role="button"
          key={labels[idx]}
          {...bind(idx)}
          style={{
            transform: spring.y.to((x) => `translateY(${x}rem)`),
          }}
          className={`cursor-pointer ${selectedIndex == idx ? "ring ring-1 bg-[#C03232]" : "bg-[#9A2828]"} rounded-sm  px-2 py-1 text-sm font-bold leading-none text-neutral-200 md:text-base`}
        >
          {labels[idx]}
        </animated.div>
      ))}
    </div>
  );
};

export default InfoToggleButtons;
