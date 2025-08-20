import { useEncounter } from "./useEncounter";
import React from "react";
import { EncounterTypeBadge } from "./EncounterTypeBadge";

import { useMapStore } from "@/stores/useMapStore";
import { EncounterMons } from "@/stores/useMapStore/types";
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
    <div className="font-pkmnem text-sm/1 flex flex-row items-start justify-between text-nowrap leading-tight">
      <span>
        <p>
          Lv.{"\u200a"}
          {minLevel}
          {"\u200a"}-{"\u200a"}
          {maxLevel}
        </p>
        <EncounterTypeBadge types={types} />
      </span>
      <div className="text-sm/1 flex h-3 flex-col">
        <p
          className={`text-base/5 md:text-lg/5 ${zoneToTextColor(zone)} font-bold`}
        >
          {rod ? rod : rate + " %"}
        </p>
      </div>
    </div>
  );
};
const EncounterMonListItem = ({
  mon,
  zone,
  setSelectedEncounter,
}: {
  mon: EncounterMons & { types: [number, number] };
  zone: "water" | "land" | "fishing";
  setSelectedEncounter: (speciesId: number) => void;
}) => {
  const isSelected = useMapStore(
    (state) => state.selectedEncounter === mon.species,
  );
  const zoneColor = zoneToTextColor(zone);
  const handleClick = () => {
    setSelectedEncounter(mon.species);
  };
  return (
    <div
      key={`${mon.species}`}
      className={`w-37 flex w-full  cursor-pointer items-start gap-1 duration-65 overflow-hidden rounded p-0 pl-2 transition-colors md:pr-2 ${zoneToBgColor(zone)} ${isSelected ? "bg-emerald-100" : ""}`}
      onMouseDown={handleClick}
    >
      <div className="relative overflow-hidden drop-shadow-md">
        <img
          className="pixelated aspect-square h-8 w-8"
          src={`/icon/${mon.species}/icon.webp`}
          alt={mon.name}
        />
      </div>
      <div className="grow pr-0 relative">

          <h3
            className={`font-bold text-shadow-2xs text-shadow-stone-200 max-w-20 text-xs ${zoneColor}`}
            >
            {mon.name}
          </h3>
            {isSelected && <p className={`absolute right-2.5 -top-1 text-xl font-bold  fade-scale-rotate ${zoneColor}`}>☼</p>}


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
  );
};
const EncounterMonsList = React.memo(function EncounterList({
  zone,
}: {
  zone: "water" | "land" | "fishing";
}) {
  const setSelectedEncounter = useMapStore(
    (state) => state.setSelectedEncounter,
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
        <EncounterMonListItem
          key={`${mon.name}${index}`}
          mon={mon}
          zone={zone}
          setSelectedEncounter={setSelectedEncounter}
        />
      ))}
    </div>
  );
});

export default EncounterMonsList;
