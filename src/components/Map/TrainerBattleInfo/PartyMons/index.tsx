import { memo, useCallback, useEffect, useState } from "react";
import {
  useTransition as springTransition,
  animated,
  useSpring,
  to,
  SpringValue,
} from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import PartyMon from "./PartyMon";
import { TrainerPartyMon } from "@/data/map/trainers";
import PartyMonsButtons from "./PartyMonsButtons";
const PartyMons = memo(function PartyMons({
  party,
}: {
  party: TrainerPartyMon[];
}) {
  const [[selectedMon, dir], setSelectedMon] = useState<number[]>([0, 0]);

  // Drag spring for real-time drag offset
  const [dragSpring, dragApi] = useSpring(() => ({
    dragX: 0,
    scaleX: 1,
    config: { tension: 300, friction: 22 },
  }));

  const shuffleTransition = springTransition(party[selectedMon], {
    key: (item: TrainerPartyMon) => item.id,
    from: {
      translateX: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    },
    initial: {
      translateX: "0%",
      opacity: 0,
    },
    enter: {
      translateX: "0%",

      opacity: 1,
    },
    leave: {
      translateX: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    },
    config: {
      tension: 280,
      friction: 25,
      mass: 0.8,
    },
    // onRest: handleResizeTrainerInfo,
  });

  const handleSelectMon = useCallback((next: number) => {
    setSelectedMon((prevState) => [next, next > prevState[0] ? 1 : -1]);
  }, []);

  // Drag handler
  const bind = useDrag(
    ({ movement: [mx], dragging, direction: [dirX] }) => {
      // Prevent default touch behavior on mobile
      // if (event) {
      //   event.preventDefault();
      //   event.stopPropagation();
      // }

      if (dragging) {
        // Apply real-time drag feedback
        dragApi.start({
          dragX: mx,
          scaleX: 0.9,
        });
      } else {
        // Reset drag offset
        dragApi.start({ dragX: 0, scaleX: 1 });

        // Check threshold for navigation
        const THRESHOLD = 100;
        if (Math.abs(mx) > THRESHOLD) {
          if (dirX > 0 && selectedMon > 0) {
            // Dragged right -> previous pokemon (up the list)
            handleSelectMon(selectedMon - 1);
          } else if (dirX < 0 && selectedMon < party.length - 1) {
            // Dragged left -> next pokemon (down the list)
            handleSelectMon(selectedMon + 1);
          }
        }
      }
    },
    {
      preventDefault: true,
      filterTaps: true,
      axis: "x", // Only horizontal dragging
      pointer: { touch: true }, // Enable touch events
      from: () => [0, 0], // Start from origin
    },
  );
  const transform = useCallback(
    (transitionX: SpringValue, dragX: SpringValue, scaleX: SpringValue) =>
      `translateX(calc(${transitionX} + ${dragX}px)) scaleX(${scaleX})`,
    [],
  );
  useEffect(() => {
    if (selectedMon >= party.length) {
      setSelectedMon([0, 0]);
    }
  }, [party.length]);

  if (party.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-center text-lg font-bold text-gray-500">
          No Pokémon in this party.
        </p>
      </div>
    );
  }
  // Dont touch this css
  return (
    <div className="flex h-full w-full flex-col">
      <PartyMonsButtons
        party={party}
        selectedMon={selectedMon}
        setSelectedMon={handleSelectMon}
      />
      <div className="h-200 relative flex w-full overflow-hidden">
        {shuffleTransition((style, item) => (
          <animated.div
            key={item.id}
            {...bind()}
            className="absolute bottom-0 left-1 right-0 top-0 touch-pan-y overflow-y-auto"
            style={{
              ...style,
              transform: to(
                [style.translateX, dragSpring.dragX, dragSpring.scaleX],
                transform,
              ),
              touchAction: "pan-y", // Allow vertical scrolling, prevent horizontal
              userSelect: "none", // Prevent text selection during drag
            }}
          >
            <PartyMon pokemon={item} />
          </animated.div>
        ))}
      </div>
    </div>
  );
});
export default PartyMons;
