import { useUIStore } from "@/stores/uiStore";
import { useEncounter } from "./useEncounter";
import React from "react";
import { EncounterTypeBadge } from "./EncounterTypeBadge";
import { formatMapString } from "@/utils/formatMapString";
// Reads species from pokemon by ID, puts type, ie 'Normal' or 'Fire' on encounter
// This is used to display the type of the encounter in the UI

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

const EncounterDescriptor = ({
  minLevel,
  maxLevel,
  zone,
  rate,
  rod,
  types,
}: any) => {
  return (
    <div className="font-pkmnem text-sm/1 leading-tight flex flex-row justify-between">
      <span>
        <p className={`text-base/5 md:text-base/5 ${zoneToTextColor(zone)} font-bold`}>
          {rod ? rod : rate + " %"}
        </p>
        <div className="text-sm/1 h-3 flex flex-col">
          <p>
            Lv.{"\u200a"}
            {minLevel}
            {"\u200a"}-{"\u200a"}
            {maxLevel}
          </p>
        </div>
      </span>
      <EncounterTypeBadge types={types} />
    </div>
  );
};
const EncounterMonsList = React.memo(function EncounterList({
  zone,
}: {
  zone: "water" | "land" | "fishing";
}) {
  const setSelectedPokemon = useUIStore(
    (state) => state.setSelectedPokemonByIndex,
  );
  const encounter = useEncounter(zone);
  if (!encounter || encounter.length === 0) {
    return (
      <h4 className="font-pkmnem py-2 text-center text-sm/3 font-bold text-gray-500">
        No {zone} encounters in this area.
      </h4>
    );
  }
  return (
    <div className="flex flex-col gap-0.5">
      {encounter.map((mon, index) => (
        <div
          key={`${mon.index}${index}`}
          className={`align-center w-37 md:w-full md:pr-2 flex cursor-pointer items-center gap-1 overflow-hidden rounded p-0 pl-2 transition-colors ${zoneToBgColor(zone)}`}
          onMouseDown={() => setSelectedPokemon(mon.index)}
        >
          <div className="icon-sprite-box mb-1">
            <img
              className="pokemon-icon-sprite"
              src={`/icon/${mon.index}/icon.webp`}
              alt={formatMapString(mon.species)}
            />
          </div>
          <div className="grow pr-0">
            <h3
              className={`font-bold ${zoneToTextColor(zone)} text-shadow-2xs text-shadow-stone-200 max-w-20 text-xs`}
            >
              {formatMapString(mon.species)}
            </h3>

            <EncounterDescriptor
              zone={zone}
              minLevel={mon.min_level}
              maxLevel={mon.max_level}
              rate={mon.rate}
              rod={mon.rod}
              types={mon.types}
            />
          </div>
        </div>
      ))}
    </div>
  );
});

export default EncounterMonsList;
