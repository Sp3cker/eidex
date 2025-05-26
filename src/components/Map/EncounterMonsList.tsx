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

  if (!encounter || encounter.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 py-2">
        No Pokémon found in this area.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {encounter.map((mon, index) => (
        <div
          key={`${mon.index}${index}`}
          className="flex items-center gap-2 p-1 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors cursor-pointer"
          onMouseDown={() => setSelectedPokemon(mon.index)}
        >
          <div className="icon-sprite-box ">
            <img
              className="pokemon-icon-sprite"
              style={{ filter: "drop-shadow(1px 0px 3px #2b2b2b50)" }}
              src={`icon/${mon.index}/icon.webp`}
              alt={formatMapString(mon.species)}
            />
          </div>
          <div>
            <p className="font-bold text-emerald-900 text-sm leading-tight">
              {formatMapString(mon.species)}
            </p>
            <p className="font-pkmnem text-emerald-700 text-xs leading-tight">
              {mon.rate}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
});

export default EncounterMonsList;
