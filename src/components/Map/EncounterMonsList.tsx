import { useUIStore } from "@/stores/uiStore";
import useMapStore, { formatMapString } from "@/stores/useMapStore";
import React from "react";

const zoneToTextColor = (zone: string) => {
  const obj: Record<string, string> = {
    land: "text-emerald-800",
    water: "text-cyan-900",
    fishing: "text-orange-800",
  };
  return obj[zone];
};
const zoneToBgColor = (zone: string) => {
  const obj: Record<string, string> = {
    land: "hover:bg-emerald-100",
    water: "hover:bg-cyan-100",
    fishing: "hover:bg-orange-100",
  };
  return obj[zone];
};
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
      <div className="py-2 text-center text-sm text-gray-500">
        No Pokémon found in this area.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {encounter.map((mon, index) => (
        <div
          key={`${mon.index}${index}`}
          className={`flex cursor-pointer items-center align-center gap-2 rounded p-0 md:p-1 pl-2 transition-colors ${zoneToBgColor(zone)}`}
          onMouseDown={() => setSelectedPokemon(mon.index)}
        >
          <div className="icon-sprite-box">
            <img
              className="pokemon-icon-sprite"
              // style={{ filter: "drop-shadow(1px 0px 3px #2b2b2b50)" }}
              src={`icon/${mon.index}/icon.webp`}
              alt={formatMapString(mon.species)}
            />
          </div>
          <div>
            <p
              className={`font-bold ${zoneToTextColor(zone)} text-xs leading-tight md:text-sm`}
            >
              {formatMapString(mon.species)}
            </p>
            <p className={`font-pkmnem ${zoneToTextColor(zone)} font-bold leading-tight`}>
              {mon.rate}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
});

export default EncounterMonsList;
