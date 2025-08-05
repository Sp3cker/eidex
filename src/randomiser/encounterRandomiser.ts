// Browser-friendly implementation – no Node APIs.

// Import JSON assets that the build pipeline exposes.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – vite / webpack will inline the JSON
// Encounter Seed is based on mapGroup, mapNumber, encounterZone, encounterSlot
// import speciesData from "./speciesData.json";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – bundled asset cleaned up beforehand

import {
  randomizerRandSeed,
  randomizerNextRange,
  RANDOMIZER_REASON_WILD_ENCOUNTER,
} from "./randomiser";
import { EncounterGroup, encounterStore } from "@/data/map/encounters";
import mapConstants from "@/data/map/map_constants.json";
// We're using the trainerId already parsed by the randomiser store.
// import { useRandomiserStore } from "@/stores/randomiserStore";
const trainerId = {
  fullId: -1716499767,
  secretId: 39344,
  sectorIndex: 2,
  trainerId: 19145,
};

// /**
//  * Simple string-hash (djb2) that returns a 32-bit unsigned value.
//  */
// function hash32(str: string): number {
//   let hash = 5381;
//   for (let i = 0; i < str.length; i++) {
//     hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0; // hash * 33 + c
//   }
//   return hash >>> 0;
// }

// // Build species arrays from the bundled JSON once.
// interface SpeciesJsonEntry {
//   speciesId: number;
//   nameKey: string; // e.g. "Bulbasaur" or "Vulpix_Alola"
// }

// let _speciesList: string[] | null = null;
// let _speciesIdMap: Record<string, number> | null = null;

// function slugify(name: string): string {
//   return name
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "_")
//     .replace(/^_+|_+$/g, "");
// }
// // Should take `encounterStore.getEncounterData()` as input
// // and modify each `species` field in-place to a randomized species.
// function loadSpeciesData(): { list: string[]; idMap: Record<string, number> } {
//   if (_speciesList && _speciesIdMap) return { list: _speciesList, idMap: _speciesIdMap };

//   const list: string[] = [];
//   const idMap: Record<string, number> = {};

//   const entries = speciesData as Record<string, SpeciesJsonEntry>;
//   Object.values(entries).forEach((entry) => {
//     const slug = slugify(entry.nameKey);
//     if (slug === "none" || slug === "egg") return;
//     list.push(slug);
//     idMap[slug] = entry.speciesId;
//   });

//   _speciesList = list;
//   _speciesIdMap = idMap;
//   return { list, idMap };
// }

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
};
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

const randomizeAreaMons = (
  mapNum: number,
  mapGroup: number,
  area: number,
  slot: number,
) => {
  let seed = mapGroup << 24;
  seed |= mapNum << 16;
  seed |= area << 8;
  seed |= slot;

  const state = randomizerRandSeed(
    RANDOMIZER_REASON_WILD_ENCOUNTER,
    seed,
    speciesId,
    trainerId,
  );
  const randomized =
    allSpecies[randomizerNextRange(state, allSpecies.length)];
};


export function randomizeEncounters(
  encounterData: Record<string, EncounterGroup[]>,
) {
  const trainerSeed = trainerId.fullId;

  const output: EncounterDictionary = {};

  // The JSON structure: wild_encounter_groups[0].encounters[]
const mapKeys = Object.keys(mapConstants);
const encounters = encounterStore.getEncounterData();
  mapKeys.forEach((mapKey) => {
    //@ts-ignore
    const mapNumAndGroup = mapConstants[mapKey];
    const encountersForMap = encounters[mapKey];
    // for each encounterLevel, there could be water, land, fishing – each area will match one of the  WildArea enums
    for (const area of ['water', 'land', 'fishing']) {
      let areaEnum: WildArea;

      switch (area) {
        case 'water':
          areaEnum = WildArea.WATER;
          break;
        case 'land':
          areaEnum = WildArea.LAND;
          break;
        case 'fishing':
          areaEnum = WildArea.FISHING;
          break;
      }
      encountersForMap.forEach((level) => {
        if (areaEnum === WildArea.FISHING && !level.fish?.mons?.length) {
          const randomFishingMons = randomizeAreaMons(mapNumAndGroup.num, mapNumAndGroup.group, areaEnum, level.fish.mons);
          const seed = makeSeedFromMapDeets(mapNumAndGroup.num, mapNumAndGroup.group, areaEnum, level.);
        }
        if (areaEnum === WildArea.LAND && !level.land?.mons?.length) {
          return;
        }
        if (areaEnum === WildArea.WATER && !level.water?.mons?.length) {
          return;
        }
      }
// need to derive the `area` 

    
    // Helper to process an array of mons from JSON
    const processMons = (area: WildArea, mons: any[], pushTo: string[]) => {
      mons.forEach((mon: any, slot: number) => {
        const originalSpeciesName: string = mon.species;
        const speciesId = speciesNameToId(originalSpeciesName, idMap);
        const seed = makeSeedFromMapDeets(mapNum, mapGroup, area, slot);
        const state = randomizerRandSeed(
          RANDOMIZER_REASON_WILD_ENCOUNTER,
          seed,
          speciesId,
          trainerId,
        );
        const randomized =
          allSpecies[randomizerNextRange(state, allSpecies.length)];
        pushTo.push(randomized);
      });
    };

    if (enc.land_mons?.mons?.length) {
      processMons(WildArea.LAND, enc.land_mons.mons, lists.land_mons);
    }
    if (enc.water_mons?.mons?.length) {
      processMons(WildArea.WATER, enc.water_mons.mons, lists.water_mons);
    }
    if (enc.fishing_mons?.mons?.length) {
      // The JSON nests fishing mons under old/good/super rod groups, flatten them.
      const flatFishMons: any[] = [];
      if (Array.isArray(enc.fishing_mons.mons)) {
        flatFishMons.push(...enc.fishing_mons.mons);
      } else {
        // Structure is { old_rod:[indexes], good_rod:[...], super_rod:[...] }
        Object.values(enc.fishing_mons).forEach((v: any) => {
          if (Array.isArray(v)) flatFishMons.push(...v);
        });
      }
      processMons(WildArea.FISHING, flatFishMons, lists.fishing_mons);
    }

    output[mapName] = lists;
  });

  return output;
}
