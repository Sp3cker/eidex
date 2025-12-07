import { useEncounter } from "./useEncounter";
import React from "react";
import { EncounterTypeBadge } from "./EncounterTypeBadge";

import { useMapStore } from "@/stores/useMapStore";
import { EncounterMons } from "@/stores/useMapStore/types";
// Reads species from pokemon by ID, puts type, ie 'Normal' or 'Fire' on encounter
// This is used to display the type of the encounter in the UI

const zoneToTextColor = (zone: string) => {
  const obj: Record<string, string> = {
    land: "text-[#45764A]",
    water: "text-[#5E718E]",
    fishing: "text-[#C58741]",
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
  rate,
  rod,
  types,
  nightRate,
}: any) => {
  return (
    <div className="font-pkmnem flex flex-row items-start justify-between text-nowrap text-sm leading-tight">
      <span>
        <p>
          Lv.{"\u200a"}
          {minLevel}
          {"\u200a"}-{"\u200a"}
          {maxLevel}
        </p>
        <EncounterTypeBadge types={types} />
      </span>

      <div className="font-calamity flex flex-col text-right">
        <p className={`text-xs/3 font-light text-stone-600 md:text-sm/4`}>
          {rate !== undefined && <>⛅{rod ? rod : rate + "%"}</>}
        </p>
        <p
          className={`text-xs/3 font-light text-[var(--hearth-blue)] md:text-sm/4`}
        >
          {nightRate && <>☾{rod ? rod : nightRate + "%"}</>}
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
      className={`duration-65 flex h-14 w-full cursor-pointer items-start gap-1 overflow-hidden rounded p-0 pl-2 transition-colors md:pr-2 ${zoneToBgColor(zone)} ${isSelected ? "bg-emerald-100" : ""}`}
      onMouseDown={handleClick}
    >
      <div className="relative overflow-hidden drop-shadow-md">
        <img
          className="pixelated aspect-square h-8 w-8"
          src={`/icon/generated/species_overworld/animated/${mon.species}.webp`}
          alt={mon.name}
        />
      </div>
      <div className="relative grow pr-0">
        <h3
          className={`text-shadow-2xs text-shadow-stone-200 max-w-20 text-xs font-bold ${zoneColor}`}
        >
          {mon.name}
        </h3>
        {isSelected && (
          <p
            className={`fade-scale-rotate absolute -top-1 right-2.5 text-xl font-bold ${zoneColor}`}
          >
            ☼
          </p>
        )}

        <EncounterDescriptor
          zone={zone}
          minLevel={mon.min_level}
          maxLevel={mon.max_level}
          rate={mon.rate}
          nightRate={mon.nightRate}
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
      <h4 className="font-pkmnem py-2 text-center text-sm/3 font-bold text-[var(--color-misc-error)]">
        No {zone} encounters in this area.
      </h4>
    );
  }
  return (
    <div className="xs:gap-0.5 flex flex-col md:gap-1">
      {encounter
        .filter((m) => m.species !== 0)
        .map((mon, index) => (
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
