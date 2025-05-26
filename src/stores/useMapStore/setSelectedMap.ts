import ItemSearch from "@/utils/itemsData";
import encounters from "@/data/map/cleanEncounters.json";
import pokemon from "@/data/speciesData.json";
import mapLevels from "@/data/map/mapBreakdown.json";

import {
  EncounterMons,
  EncounterMonsFromJSON,

} from "@/stores/useMapStore/types";
/** Works off of `mapBreakDown`, pass it `MAP_SIMPLE_NAME `
 * IT WILl return the baseName, the `id` of the map, and levels
 */
const getMap = (map: string) => {
  return mapLevels.filter(
    (m: { id: string; mapBaseName: string }) => m.mapBaseName === map,
  );
};
const Encounters = new Map(encounters.map((obj) => [obj.map, obj]));

const putIdOnEncounter: (
  enc: EncounterMonsFromJSON[],
  monsNameKeys: Map<string, number>,
) => asserts enc is EncounterMons[] = (enc, monsNameKeys) => {
  enc.forEach((specie, index) => {
    let specieIndex = monsNameKeys.get(specie.species);
    if (specieIndex === undefined) {
      // "iron_valiant" from encounters file -> iron valiant in nameKeys
      specieIndex = monsNameKeys.get(
        specie.species.replace("_", " ").toLowerCase(),
      );
      if (specieIndex === undefined) {
        // If it gets this far, the mon in 'Encounters' doesn't specify its form so fuck it
        const monInJson = pokemon.findIndex(
          (p) => p.speciesName.toLowerCase() === specie.species,
        );
        if (monInJson === -1) {
          console.error(
            "Error: %s not found in encounters.json or speciesData.json",
            specie.species,
          );
          return;
        }
        specieIndex = pokemon[monInJson].index;
      }
    }
    return (enc[index].index = specieIndex);
  });
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
      });
    }
  });

  return Array.from(monsterProps.values()) as EncounterMons[];
};

const getSelectedMapInfo = (id: string) => {
  //   if (map === null) {
  //     return null;
  //   }

  //   if (targetMap.length === 0) {
  //     console.error("Error selecting map element %s", map);
  //     return;
  //   }
  //   const { id } = targetMap[0];
  const targetMapEncounters = Encounters.get(id);

  let landEncounters, waterEncounters, fishingEncounters;
  if (targetMapEncounters) {
    /** Put ID on each mon so we can get their sprite andn info later
     * Build a Map so we don't have to `map` through the `encounters` json for each lookup :3
     */
    const monsNameKeys = new Map<string, number>([]);
    pokemon.forEach((p) => {
      monsNameKeys.set(p.nameKey.toLowerCase().replace(/-/g, "_"), p.index);
      // monsNameKeys.set(p.speciesName.replace("-", "_").toLowerCase(), p.index);
    }); //nameKey cause it probly matches encounter Data
    if (targetMapEncounters && targetMapEncounters.land_mons) {
      putIdOnEncounter(targetMapEncounters.land_mons.mons, monsNameKeys);
      landEncounters = putEncounterRate(targetMapEncounters.land_mons?.mons);
    }
    if (targetMapEncounters && targetMapEncounters.water_mons) {
      putIdOnEncounter(targetMapEncounters.water_mons.mons, monsNameKeys);
      waterEncounters = putEncounterRate(targetMapEncounters.water_mons?.mons);
    }
    if (targetMapEncounters && targetMapEncounters.fishing_mons) {
      putIdOnEncounter(targetMapEncounters.fishing_mons.mons, monsNameKeys);
      fishingEncounters = putEncounterRate(
        targetMapEncounters.fishing_mons.mons,
      );
    }
  }
  // console.error("Encounters not found for map %s", map);

  /** Parse Out Items for Map */

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
const getSelectedLevel = (map: string, level: number) => {
  const targetMap = getMap(map);
  if (targetMap.length === 0) {
    console.error("Error selecting map level %s", level);
  }

  const { levels, mapBaseName } = targetMap[0];

  const targetLevel = levels[level]; // Use ID to get map information from Encounters
  if (!targetLevel) {
    throw new Error(`Error selecting map level ${level}`);
  }
  const thisLevelEncounter = getSelectedMapInfo(targetLevel.id);
  const thisLevelsItems = ItemSearch.byMap(mapBaseName);
  
  return {
    ...thisLevelEncounter,
    selectedMapsLevels: levels.length,
    selectedMapItems: thisLevelsItems,
    mapLabel: targetLevel.levelLabel,
  };
};
export { getSelectedMapInfo, getSelectedLevel };
