import {
  randomizerRandSeed,
  randomizerNextRange,
  RANDOMIZER_REASON_WILD_ENCOUNTER,
  Sfc32State,
} from "./randomiser.ts";
import { buildSpeciesTable, SpeciesDataTable } from "./buildSpeciesTable.ts";
import { encounterStore } from "../encounters.ts";
import mapConstants from "../map_constants.json" with { type: "json" };
// /**
//  * Internal enum mirroring the C `enum WildArea` (we only need three entries).
//  */
const enum WildArea {
  LAND = 0,
  WATER = 1,
  FISHING = 2,
}

const enum RandomizerSpeciesMode {
  // Any valid species can be randomized to any other valid species.
  MON_RANDOM = 0,
  MON_RANDOM_LEGEND_AWARE = 1,
  MON_RANDOM_BST = 2,
  MON_EVOLUTION = 3,
}
// export interface EncounterLists {
//   land_mons: string[];
//   water_mons: string[];
//   fishing_mons: string[];
// }

// export type EncounterDictionary = Record<string, EncounterLists>;

// /**
//  * Convert Pokémon species constant (e.g. "SPECIES_PIDGEY") to numeric ID.
//  * Falls back to 0 if unknown.
//  */
// function speciesNameToId(name: string, idMap: Record<string, number>): number {
//   return idMap[slugify(name)] ?? 0;
// }

/**
 * Randomise every encounter table in the decomp JSON and return a dictionary
 * suitable for front-end consumption.
 *
 * Needs the trainer see
 *
 */
/**
 * Main function to calculate a randomized wild encounter.
 * @param originalSpecies The species that would have appeared originally.
 * @param seed The unique seed calculated from map, area, and slot.
 * @returns The new, randomized species ID.
 */
function calculateRandomizedEncounter(
  originalSpecies: number,
  baseMap: string,
  levelId: string,
  area: WildArea,
  trainerId: number
): number {
  const mode = RandomizerSpeciesMode.MON_RANDOM;
  const mapEncounterLevels = encounterStore.getEncounterData()[baseMap];
  const specificLevelEncounters = mapEncounterLevels.find(
    (level) => level.map === levelId
  );
  if (!specificLevelEncounters) {
    throw new Error(
      `No encounter data found for map ${baseMap} and level ${levelId}`
    );
  }
  const key: string =
    area === WildArea.FISHING
      ? "fish"
      : area === WildArea.WATER
      ? "water"
      : "land";

  //@ts-ignore
  const originalSpeciesSlotIndex = specificLevelEncounters[key].mons.findIndex(
    (enc: any) => enc.species === originalSpecies
  );
  // Now we look at the seeds for this map and return the seed
  // in the slot for `originalSpeciesSlotIndex`
  if (originalSpeciesSlotIndex === -1) {
    throw new Error(
      `Original species ${originalSpecies} not found in map ${baseMap} at level ${levelId}`
    );
  }
  //@ts-ignore
  const mapData = mapConstants[baseMap];
  if (!mapData) {
    throw new Error(`No map data found for ${baseMap}`);
  }
  // The seed is a combination of the map group, map number, area, and slot index
  const seed =
    (mapData.group << 24) | (mapData.num << 16) | (area << 8) | originalSpeciesSlotIndex;
  // 1. Seed the RNG
  console.log(seed)
  const state = randomizerRandSeed(
    RANDOMIZER_REASON_WILD_ENCOUNTER,
    seed, // In this context, the map/slot seed is `data1`
    originalSpecies, // The original species is `data2`
    trainerId
  );

  // // 2. Perform the lookup
  return randomizeMonTableLookup(state, mode, originalSpecies);
}

function randomizeMonTableLookup(
  state: Sfc32State,
  mode: RandomizerSpeciesMode,
  species: number
): number {
  // In a real app, you'd cache this table
  const table = buildSpeciesTable(mode);

  // Debug: Check if species exists in the lookup
  if (species >= table.speciesToGroupIndex.length) {
    console.error(`Species ${species} is out of bounds for speciesToGroupIndex array of length ${table.speciesToGroupIndex.length}`);
    return species;
  }

  const groupIndex = table.speciesToGroupIndex[species];
  if (groupIndex >= table.groupData.length) {
    console.error(`Group index ${groupIndex} for species ${species} is out of bounds for groupData array of length ${table.groupData.length}`);
    return species;
  }

  // Get the group (BST) of the original species
  const originalGroup = table.groupData[groupIndex];
  console.log(`Species ${species} -> groupIndex ${groupIndex} -> originalGroup ${originalGroup}`);
  
  if (originalGroup === 0xffff) return species; // GROUP_INVALID

  // Calculate the valid BST range (+/- ~10%)
  const base = originalGroup * 1024;
  const minGroup = Math.max(0, Math.floor((base - originalGroup * 100) / 1024));
  const maxGroup = Math.min(
    0xfffe,
    Math.floor((base + originalGroup * 100) / 1024)
  );

  // Find the start/end indices in the sorted table for this BST range
  const { start, end } = getIndicesFromGroupRange(table, minGroup, maxGroup);
  const count = end - start + 1;
  if (count <= 0) return species; // No valid species found in range

  // Pick a random index from that slice
  const randomIndex = randomizerNextRange(state, count);
  const finalIndex = start + randomIndex;

  console.log(`Random index: ${randomIndex}, final index: ${finalIndex}, count: ${count}, start: ${start}, end: ${end}`);
  console.log(`Final species ID: ${table.groupIndexToSpecies[finalIndex]}`);

  // Return the new species
  return table.groupIndexToSpecies[finalIndex];
}

function getIndicesFromGroupRange(
  table: SpeciesDataTable,
  minGroup: number,
  maxGroup: number
): { start: number; end: number } {
  const maxRightBound = table.groupData.length - 1;
  maxGroup = Math.min(0xfffe, maxGroup);
  minGroup = Math.min(0xfffe, minGroup);
  
  let leftBound = 0;
  let rightBound = table.groupData.length - 1;
  let maxRightBoundAdjusted = maxRightBound;

  // Left-most binary search to find first index >= minGroup
  while (leftBound < rightBound) {
    const index = Math.floor((leftBound + rightBound) / 2);
    const leftFoundGroup = table.groupData[index];
    
    if (leftFoundGroup < minGroup) {
      leftBound = index + 1;
    } else {
      if (leftFoundGroup > maxGroup) {
        maxRightBoundAdjusted = index;
      }
      rightBound = index;
    }
  }
  const start = leftBound;
  
  rightBound = maxRightBoundAdjusted;
  
  // Right-most binary search to find last index <= maxGroup
  while (leftBound < rightBound) {
    const index = Math.floor((leftBound + rightBound) / 2);
    if (table.groupData[index] > maxGroup) {
      rightBound = index;
    } else {
      leftBound = index + 1;
    }
  }
  const end = rightBound - 1;
  
  return { start, end };
}

// function randomizerNextRange(state: Sfc32State, range: number): number {
//   if (range < 2) return 0;

//   // Fast way to get the next power of two
//   let nextPowerOfTwo = range - 1;
//   nextPowerOfTwo |= nextPowerOfTwo >> 1;
//   nextPowerOfTwo |= nextPowerOfTwo >> 2;
//   nextPowerOfTwo |= nextPowerOfTwo >> 4;
//   nextPowerOfTwo |= nextPowerOfTwo >> 8;
//   nextPowerOfTwo |= nextPowerOfTwo >> 16;
//   nextPowerOfTwo += 1;

//   const mask = nextPowerOfTwo - 1;
//   let result;

//   // Rejection sampling: keep trying until we get a number in the desired range
//   do {
//     result = state.nextStream() & mask;
//   } while (result >= range);

//   return result;
// }
// const randomizeAreaMons = (
//   mapNum: number,
//   mapGroup: number,
//   area: number,
//   slot: number,
// ) => {
//   let seed = mapGroup << 24;
//   seed |= mapNum << 16;
//   seed |= area << 8;
//   seed |= slot;

//   const state = randomizerRandSeed(
//     RANDOMIZER_REASON_WILD_ENCOUNTER,
//     seed,
//     speciesId,
//     trainerId,
//   );
//   const randomized = allSpecies[randomizerNextRange(state, allSpecies.length)];
// };

// export function randomizeEncounters(
//   encounterData: Record<string, EncounterGroup[]>,
// ) {
//   const trainerSeed = trainerId.fullId;

//   const output: EncounterDictionary = {};

//   // The JSON structure: wild_encounter_groups[0].encounters[]
// const mapKeys = Object.keys(mapConstants);
// const encounters = encounterStore.getEncounterData();
//   mapKeys.forEach((mapKey) => {
//     //@ts-ignore
//     const mapNumAndGroup = mapConstants[mapKey];
//     const encountersForMap = encounters[mapKey];
//     // for each encounterLevel, there could be water, land, fishing – each area will match one of the  WildArea enums
//     for (const area of ['water', 'land', 'fishing']) {
//       let areaEnum: WildArea;

//       switch (area) {
//         case 'water':
//           areaEnum = WildArea.WATER;
//           break;
//         case 'land':
//           areaEnum = WildArea.LAND;
//           break;
//         case 'fishing':
//           areaEnum = WildArea.FISHING;
//           break;
//       }
//       encountersForMap.forEach((level) => {
//         if (areaEnum === WildArea.FISHING && !level.fish?.mons?.length) {
//           const randomFishingMons = randomizeAreaMons(mapNumAndGroup.num, mapNumAndGroup.group, areaEnum, level.fish.mons);
//           const seed = makeSeedFromMapDeets(mapNumAndGroup.num, mapNumAndGroup.group, areaEnum, level.);
//         }
//         if (areaEnum === WildArea.LAND && !level.land?.mons?.length) {
//           return;
//         }
//         if (areaEnum === WildArea.WATER && !level.water?.mons?.length) {
//           return;
//         }
//       }
// // need to derive the `area`

//     // Helper to process an array of mons from JSON
//     const processMons = (area: WildArea, mons: any[], pushTo: string[]) => {
//       mons.forEach((mon: any, slot: number) => {
//         const originalSpeciesName: string = mon.species;
//         const speciesId = speciesNameToId(originalSpeciesName, idMap);
//         const seed = makeSeedFromMapDeets(mapNum, mapGroup, area, slot);
//         const state = randomizerRandSeed(
//           RANDOMIZER_REASON_WILD_ENCOUNTER,
//           seed,
//           speciesId,
//           trainerId,
//         );
//         const randomized =
//           allSpecies[randomizerNextRange(state, allSpecies.length)];
//         pushTo.push(randomized);
//       });
//     };

//     if (enc.land_mons?.mons?.length) {
//       processMons(WildArea.LAND, enc.land_mons.mons, lists.land_mons);
//     }
//     if (enc.water_mons?.mons?.length) {
//       processMons(WildArea.WATER, enc.water_mons.mons, lists.water_mons);
//     }
//     if (enc.fishing_mons?.mons?.length) {
//       // The JSON nests fishing mons under old/good/super rod groups, flatten them.
//       const flatFishMons: any[] = [];
//       if (Array.isArray(enc.fishing_mons.mons)) {
//         flatFishMons.push(...enc.fishing_mons.mons);
//       } else {
//         // Structure is { old_rod:[indexes], good_rod:[...], super_rod:[...] }
//         Object.values(enc.fishing_mons).forEach((v: any) => {
//           if (Array.isArray(v)) flatFishMons.push(...v);
//         });
//       }
//       processMons(WildArea.FISHING, flatFishMons, lists.fishing_mons);
//     }

//     output[mapName] = lists;
//   });

//   return output;
// }

export { calculateRandomizedEncounter };
