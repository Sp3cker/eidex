import { memo, useCallback, useEffect, useState } from "react";
import { useTransition as springTransition, animated } from "@react-spring/web";
import PartyMon from "./PartyMon";
import { TrainerPartyMon } from "@/data/map/trainers";
import PartyMonsButtons from "./PartyMonsButtons";
const PartyMons = memo(function PartyMons({
  party,
}: {
  party: TrainerPartyMon[];
}) {
  const [[selectedMon, dir], setSelectedMon] = useState<number[]>([0, 0]);

  const shuffleTransition = springTransition(party[selectedMon], {
    key: (item: TrainerPartyMon) => item.id,
    from: {
      translateX: dir > 0 ? "100%" : "-100%",
      opacity: 0,
      skewX: 1,
    },
    initial: {
      translateX: "0%",
      opacity: 0,
    },
    enter: {
      translateX: "0%",
      // skewX: 0,
      opacity: 1,
    },
    leave: {
      translateX: dir > 0 ? "-100%" : "100%",
      // skewX: 0.2,
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

  useEffect(() => {
    if (selectedMon >= party.length) {
      setSelectedMon([0, 0]);
    }
  }, [party]);
  if (party.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-center text-lg font-bold text-gray-500">
          No Pokémon in this party.
        </p>
      </div>
    );
  }

  return (
    <div className="h-200 relative py-2">
      <div className="flex h-full w-full flex-col">
        <PartyMonsButtons
          party={party}
          selectedMon={selectedMon}
          setSelectedMon={handleSelectMon}
        />
        <div className="h-200 relative flex w-full">
          {shuffleTransition((style, item) => (
            <animated.div
              key={item.id}
              className="absolute bottom-0 left-0 right-0 top-0 overflow-y-auto p-2"
              style={style}
            >
              <PartyMon pokemon={item} />
            </animated.div>
          ))}
        </div>
      </div>
    </div>
  );
});
export default PartyMons;
