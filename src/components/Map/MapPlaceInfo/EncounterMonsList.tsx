import { useEncounter } from "./useEncounter";
import React from "react";
import { EncounterTypeBadge } from "./EncounterTypeBadge";

import { useMapStore } from "@/stores/useMapStore";
import { EncounterMons } from "@/stores/useMapStore/types";
import {
  makeCaughtEncounterKey,
  useCaughtEncounterStore,
} from "@/stores/caughtEncounterStore";
import { PokeballStatusIcon } from "./PokeballStatusIcon";
import type { EncounterZone } from "@/stores/useMapStore/types";
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

const CaughtText = ({ isCaught }: { isCaught: boolean }) => {
  return (
    <p
      className={`font-pkmnem fade-scale-rotate text-shadow-xs absolute -top-1 right-0 text-xl font-bold text-gray-600 ${
        isCaught ? "block" : "hidden"
      }`}
    >
      Caught
    </p>
  );
};
const EncounterMonListItem = ({
  mon,
  zone,
  setSelectedEncounter,
}: {
  mon: EncounterMons & { types: [number, number] };
  zone: EncounterZone;
  setSelectedEncounter: (speciesId: number, zone: EncounterZone) => void;
}) => {
  const isSelected = useMapStore(
    (state) =>
      state.selectedEncounter === mon.species &&
      state.selectedEncounterZone === zone,
  );
  const selectedEncounterLevel = useMapStore(
    (state) => state.selectedEncounterLevel!,
  );
  const caughtStatus = useCaughtEncounterStore((state) => state.status);
  const caughtKeys = useCaughtEncounterStore((state) => state.caughtKeys);
  const toggleCaught = useCaughtEncounterStore((state) => state.toggleCaught);
  const warmDb = useCaughtEncounterStore((state) => state.beginLazyLoad);
  const zoneColor = zoneToTextColor(zone);
  const handleClick = () => {
    if (!isSelected) {
      setSelectedEncounter(mon.species, zone);
      warmDb();
      return;
      // Next click set mon as captured
    }

    toggleCaught({
      levelId: selectedEncounterLevel,
      zone,
      speciesId: mon.species,
    });
  };
  const caughtKey = makeCaughtEncounterKey({
    levelId: selectedEncounterLevel,
    zone,
    speciesId: mon.species,
  });

  const isCaught = caughtKey !== "" && caughtKeys.has(caughtKey);
  const iconState =
    caughtStatus !== "ready"
      ? "hidden"
      : isCaught
        ? "closed"
        : isSelected
          ? "open"
          : "hidden";
  return (
    <button
      type="button"
      key={`${mon.species}`}
      className={`duration-65 flex w-full cursor-pointer items-start gap-1 overflow-hidden rounded p-0 pl-2 text-left transition-colors md:pr-2 ${zoneToBgColor(zone)} ${isSelected ? "bg-emerald-100" : ""}`}
      onClick={handleClick}
    >
      <div className="relative overflow-hidden drop-shadow-md">
        <img
          className="pixelated aspect-square h-8 w-8"
          src={`/icon/${mon.species}/icon.webp`}
          alt={mon.name}
        />
        <PokeballStatusIcon state={iconState} />
      </div>
      <div className="relative grow pr-0">
        <CaughtText isCaught={isCaught} />
        <h3
          className={`text-shadow-2xs text-shadow-stone-200 max-w-20 text-xs font-bold ${zoneColor}`}
        >
          {mon.name}
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
    </button>
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
