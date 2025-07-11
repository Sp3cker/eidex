import { memo, useEffect, useState } from "react";
import { useTransition as springTransition, animated } from "@react-spring/web";
import PartyMon from "./PartyMon";
import { TrainerPartyMon } from "@/data/map/trainers";
import PartyMonsButtons from "./PartyMonsButtons";
const PartyMons = memo(function PartyMons({
  party,
}: {
  party: TrainerPartyMon[];
}) {
  const [selectedMon, setSelectedMon] = useState<number>(0);

  const shuffleTransition = springTransition(selectedMon, {
    from: {
      translateX: "-0%",
      opacity: 0,
    },
    enter: {
      translateX: "0%",
      opacity: 1,
    },
    leave: {
      translateX: "-100%",
      opacity: 0,
    },
    config: {
      tension: 380,
      friction: 25,
      mass: 0.8,
    },
    // onRest: handleResizeTrainerInfo,
  });
  useEffect(() => {
    setSelectedMon(0);
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
          setSelectedMon={setSelectedMon}
        />
        <div className="h-200 relative flex w-full">
          {shuffleTransition((style, item) => (
            <animated.div
              className="absolute bottom-0 left-0 right-0 top-0 overflow-y-auto p-2"
              style={style}
            >
              <PartyMon pokemon={party[item]} />
            </animated.div>
          ))}
        </div>
      </div>
    </div>
  );
});
export default PartyMons;
