import { useUIStore } from "@/stores/uiStore";
import useMapStore, { formatMapString } from "@/stores/useMapStore";
import React from "react";

const EncounterMonsList = React.memo(function EncounterList({
  zone,
}: {
  zone: "water" | "land" | "fishing";
}) {
  const setSelectedPokemon = useUIStore(
    (state) => state.setSelectedPokemonByIndex,
  );
  const encounter = useMapStore((state) => {
    if (zone === "water") return state.selectedMapWaterMons;
    if (zone === "land") return state.selectedMapLandMons;
    if (zone === "fishing") return state.selectedMapFishingMons;
    return [];
  });
  return (encounter || []).map((mon, index) => (
    <div
      key={`${mon.index}${index}`}
      className="relative px-1 h-8 w-1"
      onMouseDown={() => {
        setSelectedPokemon(mon.index);
      }}
    >
      <div className="icon-sprite-box">
        <img
          className="pokemon-icon-sprite"
          style={{
            filter: "drop-shadow(1px 0px 3px #2b2b2b50)",
          }}
          src={`icon/${mon.index}/icon.webp`}
        />
      </div>
      <p className="absolute top-[7px] left-[42px] text-xs font-bold">{formatMapString(mon.species)}</p>
      <p className="absolute font-pkmnem top-[21px] left-[42px] font-bold text-sm/4">{mon.rate}%</p>
    </div>
  ));
});

export default EncounterMonsList;
