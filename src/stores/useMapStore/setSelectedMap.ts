import ItemSearch from "@/utils/itemsData";
import { LevelsInfo, EncounterGroup } from "@/data/map";

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

const getSelectedEncounters = (id: string, levelId: string, time?: string) => {
  const encounters = encounterStore.getEncounterData(id) as
    | EncounterGroup[]
    | undefined;

  if (encounters === undefined) {
    console.warn("No encounters for map %s", id);
    return;
  }

  const targetMapEncounters = encounters
    .filter((enc) => {
      if (enc.time === undefined) {
        return true;
      }
      if (time) {
        return enc.time === time;
      }
      return true; // if no time specified, return all
    })
    .find((enc) => enc.map === levelId);

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
      landEncounters = targetMapEncounters.land?.mons as EncounterMons[];
    }
    if (targetMapEncounters && targetMapEncounters.water) {
      waterEncounters = targetMapEncounters.water?.mons as EncounterMons[];
    }
    if (targetMapEncounters && targetMapEncounters.fish) {
      fishingEncounters = targetMapEncounters.fish.mons as EncounterMons[];
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
  time,
}: {
  baseMapName: string;
  levelIndex: number;
  time?: string;
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

  const thisLevelEncounterData = getSelectedEncounters(
    targetLevel.baseMap, // Key for Encounters data (e.g., "MAP_PETALBURG_CITY_LAND")
    targetLevel.thisLevelsId, // Specific sub-level ID (e.g., "MAP_PETALBURG_CITY_LAND_MAIN")
    time,
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

  const encounterGroupForThisBaseMapKey = encounterStore.getEncounterData(
    targetLevel.baseMap,
  ) as EncounterGroup[] | undefined;

  /* the selector in the map func below is the unique property for each encounter level
  For Hearth, it's the base_map. EI is map */
  const encounterLevelIdsForSelecta = encounterGroupForThisBaseMapKey
    ? encounterGroupForThisBaseMapKey.map((lv) => lv.base_label)
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
const getInitialMapLevelData = (baseMapName: string, time: string) => {
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
    const encounterData = getSelectedEncounters(
      currentLevelDetails.baseMap, // Key for Encounters data (e.g., "MAP_PETALBURG_CITY_LAND")
      currentLevelDetails.thisLevelsId, // Specific sub-level ID (e.g., "MAP_PETALBURG_CITY_LAND_MAIN")
      time,
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
    time,
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

export { getSelectedEncounters, getSelectedLevel, getInitialMapLevelData };
