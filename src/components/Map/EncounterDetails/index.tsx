import { memo, useCallback, useMemo } from "react";

import CloseButton from "@/components/ui/CloseButton";
import { useMapStore } from "@/stores/useMapStore";
import { pokemonSearchStore } from "@/stores/pokemonSearchStore";
import { formatMapString } from "@/utils/formatMapString";
// Import the type from pokemonSearchStore
type DetailedEncounterLocation = {
  mapName: string;
  encounterType: "land" | "water" | "fishing" | "rock_smash";
  minLevel: number;
  maxLevel: number;
  encounterRate?: number;
  rod?: string;
};
const LocationCard = ({
  location,
  onClick,
}: {
  location: DetailedEncounterLocation;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      className="hover-active-button pointer-events-all cursor-pointer rounded-lg border bg-gray-50 p-3"
      data-map={location.mapName}
      onClick={onClick}
    >
      <div className="flex cursor-pointer items-start justify-between">
        <hgroup>
          <h4 className="font-calamity text-sm font-semibold text-stone-800">
            {formatMapString(location.mapName)}
          </h4>
          <p className="font-pkmnem text-lg capitalize text-gray-600">
            {location.encounterType.replace("_", " ")} Encounter
          </p>
        </hgroup>
        <div className="text-right">
          <p className="font-pkmnem text-lg font-bold">
            Lv. {location.minLevel}-{location.maxLevel}
          </p>
          {location.rod && (
            <p className="text-xs text-gray-500">{location.rod}</p>
          )}
        </div>
      </div>
    </div>
  );
};
const EncounterDetails = memo(() => {
  const [
    selectedEncounter,
    setSelectedEncounter,
    setShowEncounter,
    setSelectedMapLevel,
  ]: [
    number | null,
    (encounter: number | null) => void,
    (show: boolean) => void,
    (level: string) => void,
  ] = useMapStore((state) => [
    state.selectedEncounter,
    state.setSelectedEncounter,
    state.setShowEncounter,
    state.setSelectedMapLevel,
  ]);

  const encounterInfo = useMemo(() => {
    if (!selectedEncounter) return ["", 0, []];

    return pokemonSearchStore.getDetailedEncounterInfo(selectedEncounter);
  }, [selectedEncounter]) as [string, number, DetailedEncounterLocation[]];
  const closeEncounter = () => {
    setSelectedEncounter(null);
    setShowEncounter(false);
  };
  const handleMapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const map = e.currentTarget.dataset.map;
    if (map) {
      setSelectedMapLevel(map);
    }
  }, []);

  const [speciesName, speciesIndex, encounterLocations] = encounterInfo;

  if (
    !selectedEncounter ||
    !speciesName ||
    !speciesIndex ||
    !encounterLocations
  ) {
    return (
      <div className="p-4 text-gray-500">
        Select a Pokemon to view encounter locations
      </div>
    );
  }

  return (
    <div className="p-2">
      <CloseButton
        className="absolute right-1 top-1 text-neutral-500"
        onClick={closeEncounter}
      />
      <h3 className="font-calamity mb-4 text-sm font-bold ">
        Encounter Locations for {speciesName}
      </h3>

      {encounterLocations.length === 0 ? (
        <p className="text-gray-500">
          No encounter locations found for this Pokemon.
        </p>
      ) : (
        <div className="space-y-3">
          {encounterLocations.map((location, index) => (
            <LocationCard
              key={index}
              location={location}
              onClick={handleMapClick}
            />
          ))}
        </div>
      )}
    </div>
  );
});

EncounterDetails.displayName = "EncounterDetails";

export default EncounterDetails;
