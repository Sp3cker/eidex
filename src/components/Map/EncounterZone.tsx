import { useUIStore } from "@/stores/uiStore";
import { useMapStore, formatMapString } from "@/stores/useMapStore";
import {} from "@/stores/useMapStore";
import React from "react";

const EncounterZone = React.memo(function EncounterZone({
  zone,
}: {
  zone: string;
}) {
  const setSelectedPokemon = useUIStore(
    (state) => state.setSelectedPokemonByIndex,
  );

  const encounter = useMapStore((state) => {
    if (zone === "water") return state.selectedMapWaterMons;
    if (zone === "land") return state.selectedMapLandMons;
    if (zone === "fishing") return state.selectedMapFishingMons;
  });
  return (
    <div className={`flex flex-wrap`}>
      {encounter &&
        encounter.map((mon, index) => (
          <div
            key={`${mon}${index}`}
            className="flex w-[80px] flex-col content-center items-center px-1"
            onMouseDown={() => {
              setSelectedPokemon(mon.index);
            }}
          >
            <p className="-mb-1 text-center text-xs text-neutral-100 shadow-md">
              {formatMapString(mon.species)}
            </p>
            <div className="icon-sprite-box -mt-0">
              <img
                className="pokemon-icon-sprite"
                style={{
                  filter: "drop-shadow(1px 0px 3px #2b2b2b50)",
                }}
                src={`icon/${mon.index}/icon.webp`}
              />
            </div>
            <p className="float text-start text-[8px] mb-1 text-neutral-100">
              {mon.rate}%
            </p>
          </div>
        ))}
    </div>
  );
});
export default EncounterZone;
