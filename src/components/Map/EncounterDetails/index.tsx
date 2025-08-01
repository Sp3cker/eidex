import { memo, useMemo } from "react";

import CloseButton from "@/components/ui/CloseButton";
import { useMapStore } from "@/stores/useMapStore";
import { pokemonSearchStore } from "@/stores/pokemonSearchStore";

// Import the type from pokemonSearchStore
type DetailedEncounterLocation = {
  mapName: string;
  encounterType: "land" | "water" | "fishing" | "rock_smash";
  minLevel: number;
  maxLevel: number;
  encounterRate?: number;
  rod?: string;
};

const EncounterDetails = memo(() => {
  const [selectedEncounter, setSelectedEncounter, setShowEncounter]: [
    number | null,
    (encounter: number | null) => void,
    (show: boolean) => void,
  ] = useMapStore((state) => [
    state.selectedEncounter,
    state.setSelectedEncounter,
    state.setShowEncounter,
  ]);

  const encounterInfo = useMemo(() => {
    if (!selectedEncounter) return ["", 0, []];

    return pokemonSearchStore.getDetailedEncounterInfo(selectedEncounter);
  }, [selectedEncounter]) as [string, number, DetailedEncounterLocation[]];

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

  // const speciesName = getSpeciesName(selectedEncounter);

  const closeEncounter = () => {
    setSelectedEncounter(null);
    setShowEncounter(false);
  };

  return (
    <div className="p-4">
      <CloseButton
        className="absolute right-1 top-1 text-neutral-500"
        onClick={closeEncounter}
      />
      <h3 className="mb-4 text-base font-calamity font-semibold">
        Encounter Locations for {speciesName}
      </h3>

      {encounterLocations.length === 0 ? (
        <p className="text-gray-500">
          No encounter locations found for this Pokemon.
        </p>
      ) : (
        <div className="space-y-3">
          {encounterLocations.map((location, index) => (
            <div key={index} className="rounded-lg border bg-gray-50 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold font-calamity text-stone-800">
                    {location.mapName.replace("MAP_", "").replace(/_/g, " ")}
                  </h4>
                  <p className="text-sm capitalize text-gray-600">
                    {location.encounterType.replace("_", " ")} Encounter
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    Level {location.minLevel}-{location.maxLevel}
                  </p>
                  {location.rod && (
                    <p className="text-xs text-gray-500">{location.rod}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

EncounterDetails.displayName = "EncounterDetails";

export default EncounterDetails;
