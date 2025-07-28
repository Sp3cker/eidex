// Browser-friendly implementation – no Node APIs.

// Import JSON assets that the build pipeline exposes.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – vite / webpack will inline the JSON
// Encounter Seed is based on mapGroup, mapNumber, encounterZone, encounterSlot
import speciesData from "./speciesData.json";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – bundled asset cleaned up beforehand
import cleanEncounters from "./cleanEncounters_1_3.json";

import { randomizerRandSeed, randomizerNextRange, RANDOMIZER_REASON_WILD_ENCOUNTER } from "./randomiser";

// We're using the trainerId already parsed by the randomiser store.
import { useRandomiserStore } from "@/stores/randomiserStore";

/**
 * Simple string-hash (djb2) that returns a 32-bit unsigned value.
 */
function hash32(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0; // hash * 33 + c
  }
  return hash >>> 0;
}

// Build species arrays from the bundled JSON once.
interface SpeciesJsonEntry {
  speciesId: number;
  nameKey: string; // e.g. "Bulbasaur" or "Vulpix_Alola"
}

let _speciesList: string[] | null = null;
let _speciesIdMap: Record<string, number> | null = null;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function loadSpeciesData(): { list: string[]; idMap: Record<string, number> } {
  if (_speciesList && _speciesIdMap) return { list: _speciesList, idMap: _speciesIdMap };

  const list: string[] = [];
  const idMap: Record<string, number> = {};

  const entries = speciesData as Record<string, SpeciesJsonEntry>;
  Object.values(entries).forEach((entry) => {
    const slug = slugify(entry.nameKey);
    if (slug === "none" || slug === "egg") return;
    list.push(slug);
    idMap[slug] = entry.speciesId;
  });

  _speciesList = list;
  _speciesIdMap = idMap;
  return { list, idMap };
}

/**
 * Internal enum mirroring the C `enum WildArea` (we only need three entries).
 */
const enum WildArea {
  LAND = 0,
  WATER = 1,
  FISHING = 2,
}

export interface EncounterLists {
  land_mons: string[];
  water_mons: string[];
  fishing_mons: string[];
}

export type EncounterDictionary = Record<string, EncounterLists>;

/**
 * Convert Pokémon species constant (e.g. "SPECIES_PIDGEY") to numeric ID.
 * Falls back to 0 if unknown.
 */
function speciesNameToId(name: string, idMap: Record<string, number>): number {
  return idMap[slugify(name)] ?? 0;
}

/**
 * Randomise every encounter table in the decomp JSON and return a dictionary
 * suitable for front-end consumption.
 */
export function randomizeEncounters(): EncounterDictionary {
  const trainerId = useRandomiserStore.getState().trainerIdInfo?.fullId ?? 0;
  const { list: allSpecies, idMap } = loadSpeciesData();

  const output: EncounterDictionary = {};

  // The JSON structure: wild_encounter_groups[0].encounters[]
  const encountersArray = cleanEncounters as any[];

  encountersArray.forEach((enc: any) => {
    const mapName: string = enc.map;
    const mapHash = hash32(mapName);
    const mapGroup = (mapHash >> 8) & 0xff;
    const mapNum = mapHash & 0xff;

    const lists: EncounterLists = {
      land_mons: [],
      water_mons: [],
      fishing_mons: [],
    };

    // Helper to process an array of mons from JSON
    const processMons = (
      area: WildArea,
      mons: any[],
      pushTo: string[],
    ) => {
      mons.forEach((mon: any, slot: number) => {
        const originalSpeciesName: string = mon.species;
        const speciesId = speciesNameToId(originalSpeciesName, idMap);
        const seed =
          ((mapGroup << 24) | (mapNum << 16) | (area << 8) | slot) >>> 0;
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