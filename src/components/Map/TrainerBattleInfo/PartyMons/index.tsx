import React, { memo, useState } from "react";
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
  const shuffleTransition = springTransition(party, {
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

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-neutral-50 p-2 shadow-md">
      <PartyMonsButtons
        party={party}
        selectedMon={selectedMon}
        setSelectedMon={setSelectedMon}
      />
      {shuffleTransition((style, item) => (
        <animated.div
          className="absolute bottom-0 left-0 right-0 top-0 overflow-y-auto p-2"
          style={style}
        >
          <PartyMon pokemon={item} />
        </animated.div>
      ))}
    </div>
  );
});
export default PartyMons;
