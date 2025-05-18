import { memo } from "react";
import EncounterZone from "./EncounterZone";
import { useMapStore, formatMapString } from "@/stores/useMapStore";

const Dexnav = memo(function Dexnav() {
  const selectedMap = useMapStore((state) => state.selectedMap);
  return (
    <nav className="fixed bottom-7 left-10 right-10 h-2/5 overflow-scroll rounded-sm bg-neutral-700 p-2 shadow-lg">
      <div className="flex justify-between text-white">
        <h1 className="cool-font text-white-500 pl-1 font-bold">
          {formatMapString(selectedMap || "")}
        </h1>
      </div>
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
        <div className="flex flex-wrap ">
          <EncounterZone zone="water" />
        </div>
        <div className="fishing-zone rounded-sm px-2">
          <p className=" text-neutral-100 pkmnem-face-shadow">Fishing</p>
        </div>
        <div className="flex w-full flex-row flex-wrap">
          <EncounterZone zone="fishing" />
        </div>
      </div>
    </nav>
  );
});
export default Dexnav;
