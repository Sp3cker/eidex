import ItemSearch from "@/utils/itemsData";
import { LevelsInfo } from "@/data/map";

import { EncounterMons } from "@/stores/useMapStore/types";
import { encounterStore } from "@/data/map/encounters";
/**  pass it `MAP_SIMPLE_NAME `
 * IT WILl return the baseName, the `id` of the map, and levels
 */
const getMap = (map: string) => {
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

const putRodUsed = (mons: EncounterMons[]) => {
  // If a mon appears in multiple rod types, it will be combined into a single string like "Old/Good Rod" or "Good/Super Rod"

  if (!mons || mons.length === 0) {
    return mons; // Return early if no mons are provided
  }

  const rodsByIndex: string[] = [];
  const speciesByIndex: number[] = [];
  // First pass: assign rod type based on slot
  mons.forEach((mon, slot) => {
    speciesByIndex.push(mon.species);
    if (slot <= 2) {
      // 0, 1, 2
      rodsByIndex.push("Old");
    } else if (slot >= 3 && slot <= 5) {
      // 3, 4, 5
      rodsByIndex.push("Good");
    } else {
      rodsByIndex.push("Super");
    }
  });
  // look through speciesByIndex, match each index to it's rodsByIndex
  // If a species appears in multiple rod types, combine them into a single string like "Old/Good Rod" or "Good/Super Rod"
  const speciesByRod = new Map<number, string>();
  speciesByIndex.forEach((species, index) => {
    const rod = rodsByIndex[index];
    const currentRod = speciesByRod.get(species);
    if (!currentRod) {
      speciesByRod.set(species, rod);
      return;
    }
    if (currentRod.includes(rod)) {
      // Don't want Old/Old/Old Rod
      return;
    }
    // If a species appears in multiple rod types, combine them into a single string like "Old/Good Rod" or "Good/Super Rod"
    speciesByRod.set(species, currentRod + "/" + rod);
  });
  mons.forEach((mon, index) => {
    mon.rod = speciesByRod.get(speciesByIndex[index]) + " Rod";
  });
};

const putEncounterRate = (mons: EncounterMons[]) => {
  const rates = [20, 20, 10, 10, 10, 10, 5, 5, 4, 4, 1, 1];
  const encounterRates = new Map<number, number>();
  const monsterProps = new Map<number, EncounterMons>();
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
        rate: monsNewRate,
        name: encounter.name,
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
    queueMicrotask(() => {
      console.error("Error selecting encounters %s, level %s", id, levelId);
    });
    return;
  }

  let landEncounters, waterEncounters, fishingEncounters;
  if (targetMapEncounters) {
    /** Put ID on each mon so we can get their sprite andn info later
     * Build a Map so we don't have to `map` through the `encounters` json for each lookup :3
     */
    //nameKey cause it probly matches encounter Data
    if (targetMapEncounters && targetMapEncounters.land) {
      landEncounters = putEncounterRate(
        targetMapEncounters.land?.mons as EncounterMons[],
      );
    }
    if (targetMapEncounters && targetMapEncounters.water) {
      waterEncounters = putEncounterRate(
        targetMapEncounters.water?.mons as EncounterMons[],
      );
    }
    if (targetMapEncounters && targetMapEncounters.fish) {
      putRodUsed(targetMapEncounters.fish.mons as EncounterMons[]); // Add rod information
      fishingEncounters = putEncounterRate(
        targetMapEncounters.fish.mons as EncounterMons[],
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
