import { memo, useMemo } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  selectedEncounterAtom,
  showEncounterAtom,
  syncEncounterAtom,
} from "./selectedEncounterStore";
import { encounterStore } from "@/data/map/encounters";
import { pokemonData } from "@/data/pokemon";
import { getSpeciesName } from "@/utils/speciesData";
import CloseButton from "@/components/ui/CloseButton";

// Utility function to get species name from ID (reverse of the process in setSelectedMap)
const getSpeciesNameFromId = (speciesId: number): string => {
  const species = pokemonData.find((p) => p.speciesId === speciesId);
  if (!species) return "Unknown";

  // Convert to the format used in encounter data (lowercase, replace spaces with underscores)
  return species.speciesName
    .toLowerCase()
    .replace(/♂/g, "_m")
    .replace(/♀/g, "_f")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
};

// Interface for encounter location data
interface EncounterLocation {
  mapName: string;
  encounterType: "land" | "water" | "fishing" | "rock_smash";
  minLevel: number;
  maxLevel: number;
  encounterRate?: number;
  rod?: string;
}

const EncounterDetails = memo(() => {
  const selectedMon = useAtomValue(selectedEncounterAtom);
  const showEncounter = useSetAtom(showEncounterAtom);
  const closeEncounter = () => showEncounter(false)
  const encounterLocations = useMemo(() => {
    if (!selectedMon) return [];

    const locations: EncounterLocation[] = [];
    const encounterData = encounterStore.getEncounterData();
    const speciesName = getSpeciesNameFromId(selectedMon);

    // Search through all encounter data to find this species
    Object.entries(encounterData).forEach(([mapName, encounterGroups]) => {
      encounterGroups.forEach((encounterGroup) => {
        // Check land encounters
        if (encounterGroup.land_mons) {
          encounterGroup.land_mons.mons.forEach((mon) => {
            if (mon.species === speciesName) {
              locations.push({
                mapName,
                encounterType: "land",
                minLevel: mon.min_level,
                maxLevel: mon.max_level,
              });
            }
          });
        }

        // Check water encounters
        if (encounterGroup.water_mons) {
          encounterGroup.water_mons.mons.forEach((mon) => {
            if (mon.species === speciesName) {
              locations.push({
                mapName,
                encounterType: "water",
                minLevel: mon.min_level,
                maxLevel: mon.max_level,
              });
            }
          });
        }

        // Check fishing encounters
        if (encounterGroup.fishing_mons) {
          encounterGroup.fishing_mons.mons.forEach((mon) => {
            if (mon.species === speciesName) {
              locations.push({
                mapName,
                encounterType: "fishing",
                minLevel: mon.min_level,
                maxLevel: mon.max_level,
              });
            }
          });
        }

        // Check rock smash encounters
        if (encounterGroup.rock_smash_mons) {
          encounterGroup.rock_smash_mons.mons.forEach((mon) => {
            if (mon.species === speciesName) {
              locations.push({
                mapName,
                encounterType: "rock_smash",
                minLevel: mon.min_level,
                maxLevel: mon.max_level,
              });
            }
          });
        }
      });
    });

    return locations;
  }, [selectedMon]);

  if (!selectedMon) {
    return (
      <div className="p-4 text-gray-500">
        Select a Pokemon to view encounter locations
      </div>
    );
  }

  const speciesName = getSpeciesName(selectedMon);
  
  return (
    <div className="p-4">
      <CloseButton className="absolute right-1 top-1 text-neutral-500" onClick={closeEncounter}/>
      <h3 className="mb-4 text-lg font-semibold">
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
                  <h4 className="font-medium text-gray-900">
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
