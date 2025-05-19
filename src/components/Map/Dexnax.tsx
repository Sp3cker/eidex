import { memo } from "react";
import EncounterZone from "./EncounterZone";
import { useMapStore } from "@/stores/useMapStore";
import { useSpring, animated } from "react-spring";

const Dexnav = memo(function Dexnav() {
  // const selectedMap = useMapStore((state) => state.selectedMap);
  const dexNavIsOpen = useMapStore((state) => state.dexNavIsOpen);
  const springs = useSpring({
    // from: { opacity: 0, translateY: (window.innerHeight * 2) / 5 },
    opacity: dexNavIsOpen ? 1 : 0,
    translateY: dexNavIsOpen ? 0 : (window.innerHeight * 2) / 5,
    // config: { duration: 500 },
  });
  return (
    <animated.nav
      style={springs}
      className="fixed bottom-7 left-10 right-10 h-2/5 overflow-scroll rounded-sm bg-neutral-700 p-2 shadow-lg"
    >
      {/* <div className="flex justify-between text-white">
        <h1 className="cool-font text-white-500 pl-1 font-bold">
          {formatMapString(selectedMap || "")}
        </h1>
      </div> */}
      <div className="cool-font flex flex-col rounded-sm">
        <div className="land-zone rounded-sm px-2">
          <p className="pkmnem-face-shadow text-neutral-100">Land</p>
        </div>
        <div className="flex w-full flex-row flex-wrap">
          <EncounterZone zone="land" />
        </div>
        <div className="water-zone rounded-sm px-2">
          <p className="pkmnem-face-shadow text-neutral-100">Water</p>
        </div>
        <div className="flex flex-wrap">
          <EncounterZone zone="water" />
        </div>
        <div className="fishing-zone rounded-sm px-2">
          <p className="pkmnem-face-shadow text-neutral-100">Fishing</p>
        </div>
        <div className="flex w-full flex-row flex-wrap">
          <EncounterZone zone="fishing" />
        </div>
      </div>
    </animated.nav>
  );
});
export default Dexnav;
