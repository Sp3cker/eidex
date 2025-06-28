import ItemSearch from "@/utils/itemsData";
import { LevelsInfo } from "@/data/map";

import { pokemonData as pokemon } from "@/data/pokemon";

import {
  EncounterMons,
  EncounterMonsFromJSON,
} from "@/stores/useMapStore/types";
import { encounterStore } from "@/data/map/encounters";
/** Works off of `mapBreakDown`, pass it `MAP_SIMPLE_NAME `
 * IT WILl return the baseName, the `id` of the map, and levels
 */
const getMap = (map: string) => {
  //@ts-ignore
  const targetMap = LevelsInfo[map];
  if (targetMap === undefined) {
    console.error("Error selecting map %s", map);
    return undefined;
  }

  return {
    mapBaseName: map,
    levels: targetMap,
  };
  // return mapLevels.filter(
  //   (m: { id: string; mapBaseName: string }) => m.mapBaseName === map,
  // );
};
const MONNAMEKEYS = new Map<string, number>([]); // 'darmanitan_galar' -> 990
pokemon.forEach((p) => {
  MONNAMEKEYS.set(p.nameKey.toLowerCase().replace(/-/g, "_"), p.speciesId);
  // monsNameKeys.set(p.speciesName.replace("-", "_").toLowerCase(), p.dexId);
});
const putIdOnEncounter: (
  enc: EncounterMonsFromJSON[],
  monsNameKeys: Map<string, number>,
) => asserts enc is EncounterMons[] = (enc, monsNameKeys) => {
  enc.forEach((specie, index) => {
    let specieIndex = monsNameKeys.get(specie.species);
    if (specie.species === "darmanitan_galar") {
      // Special case for darmanitan_galar, which is stored as darmanitan in encounters.json
      specieIndex = 990; // darmanitan_galar is 990 in pokemon.json
    }
    if (specieIndex === undefined) {
      // "iron_valiant" from encounters file -> iron valiant in nameKeys
      specieIndex = monsNameKeys.get(
        specie.species.replace("_", " ").toLowerCase(),
      );
      if (specieIndex === undefined) {
        // If it gets this far, the mon in 'Encounters' doesn't specify its form so fuck it
        const monInJson = pokemon.findIndex(
          (p) =>
            p.speciesName
              .toLowerCase()
              .replace("flabébé", "flabebe")
              .replace(/♂/g, "_m")
              .replace(/♀/g, "_f") === specie.species,
        );
        if (monInJson === -1) {
          console.error(
            "Error: %s not found in encounters.json or speciesData.json",
            specie.species,
          );
          return;
        }
        // We found them, now to use their Baseform if its there
        if (pokemon[monInJson].baseForm) {
          specieIndex = pokemon[monInJson].baseForm;
        }
        specieIndex = pokemon[monInJson].speciesId;
      }
    }
    return (enc[index].index = specieIndex);
  });
};

const putRodUsed = (mons: EncounterMons[]) => {
  // First pass: assign rod type based on slot
  mons.forEach((mon, slot) => {
    let rod: string;
    if (slot === 0 || slot === 1) {
      rod = "Old Rod";
    } else if (slot >= 2 && slot <= 4) {
      rod = "Good Rod";
    } else if (slot >= 5 && slot <= 9) {
      rod = "Super Rod";
    } else {
      rod = "Super Rod"; // Default for higher indices
    }
    mon.rod = rod;
  });

  // Second pass: determine chance level for each species within each rod type
  const rodGroups: { [rodType: string]: { [species: string]: number[] } } = {};

  // Group by rod type and species, tracking slot indices
  mons.forEach((mon, slot) => {
    if (!mon.rod) return;

    if (!rodGroups[mon.rod]) {
      rodGroups[mon.rod] = {};
    }
    if (!rodGroups[mon.rod][mon.species]) {
      rodGroups[mon.rod][mon.species] = [];
    }
    rodGroups[mon.rod][mon.species].push(slot);
  });

  // Third pass: combine rod types for species that appear across multiple rods
  const speciesRodSummary: { [species: string]: { rods: Set<string> } } = {};

  // Collect all rod types for each species
  Object.keys(rodGroups).forEach((rodType) => {
    Object.keys(rodGroups[rodType]).forEach((species) => {
      if (!speciesRodSummary[species]) {
        speciesRodSummary[species] = { rods: new Set() };
      }
      speciesRodSummary[species].rods.add(rodType);
    });
  });

  // Assign combined rod strings
  mons.forEach((mon) => {
    if (!mon.rod) return;

    const summary = speciesRodSummary[mon.species];
    if (!summary) return;

    // Create combined rod string
    const rodArray = Array.from(summary.rods);
    const rodOrder = ["Old Rod", "Good Rod", "Super Rod"];
    const sortedRods = rodArray.sort(
      (a, b) => rodOrder.indexOf(a) - rodOrder.indexOf(b),
    );
    const combinedRodString =
      sortedRods.join("/").replace(/ Rod/g, "").replace(/\//g, "/") + " Rod";

    mon.rod = combinedRodString;
  });

  return mons;
};

const putEncounterRate = (mons: EncounterMons[]) => {
  const rates = [20, 20, 10, 10, 10, 10, 5, 5, 4, 4, 1, 1];
  const encounterRates = new Map<string, number>();
  const monsterProps = new Map<string, EncounterMons>();
  // Calculate total rates for each monster
  mons.forEach((encounter, index) => {
    if (index < rates.length) {
      // let currentRate = arr[index].rate || 0
      // currentRate += rates[index];
      const currentRate = encounterRates.get(encounter.species) || 0;
      encounterRates.set(encounter.species, currentRate + rates[index]);
      const monsNewRate = encounterRates.get(encounter.species) || 0;
      monsterProps.set(encounter.species, {
        species: encounter.species,
        max_level: encounter.max_level,
        min_level: encounter.min_level,
        index: encounter.index,
        rate: monsNewRate,
        rod: encounter.rod, // Preserve rod property if it exists
      });
    }
  });

  return Array.from(monsterProps.values()) as EncounterMons[];
};

const getSelectedMapInfo = (id: string, levelId: string) => {
  const Encounters = encounterStore.getEncounterData();
  const targetMapEncounterGroup = Encounters[id];
  if (targetMapEncounterGroup === undefined) {
    console.warn("No encounters for map %s", id);
    return;
  }

  const targetMapEncounters = targetMapEncounterGroup.find(
    (enc) => enc.map === levelId,
  );
  if (targetMapEncounters === undefined) {
    console.error("Error selecting encounters %s, level %s", id, levelId);
    return;
  }

  let landEncounters, waterEncounters, fishingEncounters;
  if (targetMapEncounters) {
    /** Put ID on each mon so we can get their sprite andn info later
     * Build a Map so we don't have to `map` through the `encounters` json for each lookup :3
     */
    //nameKey cause it probly matches encounter Data
    if (targetMapEncounters && targetMapEncounters.land_mons) {
      putIdOnEncounter(targetMapEncounters.land_mons.mons, MONNAMEKEYS);
      landEncounters = putEncounterRate(targetMapEncounters.land_mons?.mons);
    }
    if (targetMapEncounters && targetMapEncounters.water_mons) {
      putIdOnEncounter(targetMapEncounters.water_mons.mons, MONNAMEKEYS);
      waterEncounters = putEncounterRate(targetMapEncounters.water_mons?.mons);
    }
    if (targetMapEncounters && targetMapEncounters.fishing_mons) {
      putIdOnEncounter(targetMapEncounters.fishing_mons.mons, MONNAMEKEYS);
      putRodUsed(targetMapEncounters.fishing_mons.mons); // Add rod information
      fishingEncounters = putEncounterRate(
        targetMapEncounters.fishing_mons.mons,
      );
    }
  }
  return {
    landEncounters,
    waterEncounters,
    fishingEncounters,
  };
};
/**
 * This gets passed the `baseName` of the map.
 * It asks `getSelectedMapInfo` for the encounters and items for that level
 * @param map
 * @param level
 * @returns
 */
const getSelectedLevel = ({
  baseMapName,
  levelIndex,
}: {
  baseMapName: string;
  levelIndex: number;
}) => {
  const targetMap = getMap(baseMapName);
  if (targetMap === undefined) {
    console.error("Error selecting map level %s, %s", levelIndex, baseMapName);
    return;
  }

  const { levels, mapBaseName } = targetMap;

  const targetLevel = levels[levelIndex]; // Use ID to get map information from Encounters
  if (!targetLevel) {
    throw new Error(`Error selecting map level ${levelIndex}`);
  }

  const thisLevelEncounterData = getSelectedMapInfo(
    targetLevel.baseMap, // Key for Encounters data (e.g., "MAP_PETALBURG_CITY_LAND")
    targetLevel.thisLevelsId, // Specific sub-level ID (e.g., "MAP_PETALBURG_CITY_LAND_MAIN")
  );
  const thisLevelsItems = ItemSearch.byMap(mapBaseName);

  let finalMapLabel = ""; // Default to empty string

  const hasEncounters =
    thisLevelEncounterData &&
    (thisLevelEncounterData.landEncounters?.length ||
      thisLevelEncounterData.waterEncounters?.length ||
      thisLevelEncounterData.fishingEncounters?.length);

  if (hasEncounters) {
    finalMapLabel = targetLevel.levelLabel || ""; // Ensure levelLabel itself isn't undefined
  }
  // Get encounter level IDs for Selecta ("MAP_SHOAL_CAVE_LOW_TIDE_XXX")
  // Encounters are keyed by targetLevel.baseMap
  const encounterGroupForThisBaseMapKey =
    encounterStore.getEncounterData()[targetLevel.baseMap];
  const encounterLevelIdsForSelecta = encounterGroupForThisBaseMapKey
    ? encounterGroupForThisBaseMapKey.map((lv) => lv.map)
    : [];

  return {
    ...thisLevelEncounterData,
    hasEncounters: !!hasEncounters, // Explicit boolean for easier checking

    selectedMapsLevels: levels.map((lv) => lv.thisLevelsId),
    selectedMapEncounterLevels: encounterLevelIdsForSelecta, // Selecta
    selectedLevelId: targetLevel.thisLevelsId, // Used in ImageViewer to find it's pickup items
    selectedMapItems: thisLevelsItems,
    mapLabel: finalMapLabel, // MapInfoBox
    selectedImageName: targetLevel.image,
  };
};
export const getInitialMapLevelData = (baseMapName: string) => {
  const mapDetails = getMap(baseMapName);
  if (!mapDetails || !mapDetails.levels || mapDetails.levels.length === 0) {
    console.error(
      `No levels found for map: ${baseMapName} in getInitialMapLevelData`,
    );
    return undefined;
  }

  let chosenLevelIndex = 0; // Default to the first level

  // First, try to find a level with encounters by checking getSelectedMapInfo
  for (let i = 0; i < mapDetails.levels.length; i++) {
    const currentLevelDetails = mapDetails.levels[i]; // { levelLabel, thisLevelsId, baseMap, image }

    // Call getSelectedMapInfo to check for encounters on this specific level
    // Returns `undefined` early so shouldn't worry
    // aobut calling in loop
    const encounterData = getSelectedMapInfo(
      currentLevelDetails.baseMap, // Key for Encounters data (e.g., "MAP_PETALBURG_CITY_LAND")
      currentLevelDetails.thisLevelsId, // Specific sub-level ID (e.g., "MAP_PETALBURG_CITY_LAND_MAIN")
    );

    if (
      encounterData &&
      (encounterData.landEncounters?.length ||
        encounterData.waterEncounters?.length ||
        encounterData.fishingEncounters?.length)
    ) {
      chosenLevelIndex = i;

      break; // Found a level with encounters, use this index
    }
  }

  // If no level had encounters after the loop, chosenLevelIndex will still be 0.
  // Now, call getSelectedLevel ONCE with the chosenLevelIndex.
  // This chosenLevelIndex is either 0 (if level 0 had encounters OR no levels had encounters)
  // or the index of the first level found with encounters.
  const derivedLevelData = getSelectedLevel({
    baseMapName,
    levelIndex: chosenLevelIndex,
  });

  if (!derivedLevelData) {
    // This would be an unexpected error if mapDetails.levels[chosenLevelIndex] was valid
    console.error(
      `FATAL: Could not derive level data for map ${baseMapName} at index ${chosenLevelIndex}`,
    );
    return undefined;
  }

  // The 'hasEncounters' property in derivedLevelData will correctly reflect
  // the encounter status of the 'chosenLevelIndex'.
  // If foundLevelWithEncounters is true, then derivedLevelData.hasEncounters should also be true.
  // If foundLevelWithEncounters is false, then derivedLevelData.hasEncounters will be false (for level 0).

  return {
    ...derivedLevelData, // Contains all data from getSelectedLevel for the chosen index
    chosenLevelIndex, // The actual index of the level whose data is being returned
  };
};

export { getSelectedMapInfo, getSelectedLevel };
