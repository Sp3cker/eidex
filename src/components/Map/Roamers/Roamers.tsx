import React, { useEffect } from "react";
import { useLocation } from "wouter";
import legendaries from "@/data/map/legendaries-with-maps.json";
import useMapStore from "@/stores/useMapStore";
import { getPokemonBySpecies } from "@/stores/pokemonStore";

interface LegendaryInfo {
  Location: string;
  Flavor: string;
  nameKey: string;
  Pokémon?: string;
  mapBasename?: string | null;
  index?: number;
  speciesName?: string;
}

const RoamersInfoContent = ({ info }: { info: LegendaryInfo }) => {
  return (
    <>
      <p className="font-pkmnem text-lg font-bold">{info.Location}</p>
      <p className="leading-tight">{info.Flavor}</p>
    </>
  );
};

const RoamersInfo = ({ selectedRoamer }: { selectedRoamer: string | null }) => {
  const selectedRInfo = legendaries.find((le) => le.nameKey === selectedRoamer);

  return (
    <div className="content-visibility fade-in-background roamers-info-grid font-calamity rounded-md border border-amber-200 p-2 text-neutral-50">
      <h3>{selectedRoamer ? selectedRoamer : ""}</h3>
      {selectedRInfo ? <RoamersInfoContent info={selectedRInfo} /> : null}
    </div>
  );
};

const Roamers = React.memo(function Roamers() {
  const [location] = useLocation();
  const { deselectMap, setSelectedRoamer, selectedRoamer } = useMapStore(
    (state) => ({
      deselectMap: state.deselectMap,
      setSelectedRoamer: state.setSelectedRoamer,
      selectedRoamer: state.selectedRoamer,
    }),
  );

  const legendaryRoamers = legendaries
    .filter((l) => l.mapBasename === "MAP_HOENN")
    .map((p) => {
      const monTypeNColor = getPokemonBySpecies(p.nameKey);

      return {
        ...p,
        type: monTypeNColor.type,
        color: monTypeNColor ? monTypeNColor.color : ["#efefef"],
      };
    });

  useEffect(() => {
    if (location === "/roamers") {
      deselectMap();
    }
  }, [location, deselectMap]);

  const handleWheel = React.useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
  }, []);

  const handleClick = React.useCallback(
    (nameKey: string) => {
      setSelectedRoamer(nameKey);
    },
    [setSelectedRoamer],
  );

  // Only render when on legendaries route
  if (location !== "/roamers") {
    return null;
  }

  return (
    <>
      <div
        onWheel={handleWheel}
        className="content-visibility roamers-grid content-visibility fade-in-background will-translate font-calamity cursor-touch flex h-full w-[150px] flex-col overflow-scroll overscroll-contain rounded-lg pb-1"
      >
        {legendaryRoamers.map((l) => (
          <div
            onClick={() => handleClick(l.nameKey)}
            key={l.speciesName}
            className={`mb-2 flex flex-row items-center rounded-md border border-amber-200 p-2 ${
              selectedRoamer === l.nameKey ? "bg-amber-100/20" : ""
            }`}
          >
            <div className="icon-sprite-box">
              <img
                className="pokemon-icon-sprite"
                src={`/icon/${l.index}/icon.webp`}
                alt={l.Pokémon}
              />
            </div>
            <h3 className="font-calamity text-xs text-neutral-50">
              {l.Pokémon}
            </h3>
          </div>
        ))}
      </div>
      <RoamersInfo selectedRoamer={selectedRoamer} />
    </>
  );
});

export default Roamers;
