import { pokemonData } from "@/data/pokemon"; // Assuming this is Object.values(speciesDataJson)
import encountersData from "@/data/map/cleanEncounters.json"; // Or your processed encounter data
import { superNormalizeName } from "@/utils/normalizeName";

interface EncounterLocationInfo {
  foundInEncounters: boolean;
  levelIDs?: string[]; // Array of map/level string IDs where it's found
  // Undefined or empty if not foundInEncounters
}
const encReducer = (acc: string[], curr: { species?: string }) => {
  if (curr.species && !acc.includes(curr.species)) {
    acc.push(curr.species);
  }
  return acc;
};

interface DetailedEncounterLocation {
  mapName: string;
  encounterType: "land" | "water" | "fishing" | "rock_smash";
  minLevel: number;
  maxLevel: number;
  encounterRate?: number;
  rod?: string;
}

class PokemonSearchStore {
  private encounterMap: Map<string, string[]>; // Pokemon name -> array of level IDs
  private allSpeciesNames: string[]; // For quick prefix searching
  private monNameKeys: Map<string, number> = new Map<string, number>([]); // Map of name in `encounters` format to their `speciesId`

  constructor() {
    this.encounterMap = new Map();
    pokemonData.forEach((p) => {
      if (typeof p.formId !== "undefined" && p.formId !== 0) return;

      const baseSpeciesKey = superNormalizeName(p.speciesName);

      const nameKey = superNormalizeName(p.nameKey);
      // if (nameKey.includes("gallade")) {
      //   debugger;
      // }
      this.monNameKeys.set(nameKey, p.baseForm || p.speciesId); // important for not getting mega forms
      // Sometimes encounter data doesn't specify the form of a mon, ie `Deerling` doesn't exist; its always a specific form
      // However, we need to have a `Deerling` key for the encounter map
      if (this.monNameKeys.has(baseSpeciesKey)) {
        //
        return;
      }
      if (baseSpeciesKey !== nameKey) {
        // if `Deerling` !== `Deerling_F`
        // this.monNameKeys.set(baseSpeciesKey, p.speciesId); // More specific, this would only get overwritten
        this.monNameKeys.set(baseSpeciesKey, p.baseForm || p.speciesId); // important for not getting mega forms
      }
    });

    this.allSpeciesNames = Array.from(this.monNameKeys.keys());
    this._initialize();
  }

  private normalizeName(name: string): string[] {
    const lowerName = name.toLowerCase();
    // Returns an array of possible normalizations to check against encounterMap keys
    return [
      lowerName,
      lowerName.replace(/[- ]/g, "_"), // Replace hyphens/spaces with underscores
      lowerName.replace(/_/g, "-"), // Replace underscores with hyphens
      lowerName.replace(/_/g, " "), // Replace underscores with spaces
    ];
  }

  private _initialize() {
    // 1. Build the encounterMap from cleanEncounters.json
    //    Key: Normalized Pokémon species name (e.g., "gligar")
    //    Value: Array of levelID strings (e.g., ["MAP_GRANITE_CAVE_B1F", ...])
    for (const levelID in encountersData) {
      const { fishing_mons, land_mons, water_mons } = encountersData[levelID];
      const fishing = fishing_mons
        ? fishing_mons.mons.reduce(encReducer, [])
        : [];
      const water = water_mons ? water_mons.mons.reduce(encReducer, []) : [];
      const land = land_mons ? land_mons.mons.reduce(encReducer, []) : [];
      const levelEncounters = [...land, ...water, ...fishing];

      levelEncounters.forEach((encounter: string) => {
        const normalizedSpeciesKeys = this.normalizeName(encounter);
        // Use the first successful normalization as the primary key, or a consistent one
        const primaryKey =
          normalizedSpeciesKeys.find((key) => key.includes("_")) ||
          normalizedSpeciesKeys[0] ||
          encounter.toLowerCase();

        if (!this.encounterMap.has(primaryKey)) {
          this.encounterMap.set(primaryKey, []);
        }

        this.encounterMap.get(primaryKey)!.push(encountersData[levelID].map);
      });

      // Repeat for other encounter types if necessary (water_mons_flat, etc.)
    }
    // I dont think i use this but it's late
    // 2. Build heldItemsMap: itemId (number) -> list of maps where it can be obtained via held Pokémon
  }

  /**
   * Provides a list of Pokémon names from speciesData.json that match the prefix.
   * This is for search suggestions.
   */
  public getSearchSuggestions(
    prefix: string,
  ): { name: string; maps: string[] }[] {
    if (!prefix || prefix.trim().length < 1) {
      // Or a min length like 2 or 3

      return [];
    }

    const lowerPrefix = prefix.toLowerCase();
    return this.allSpeciesNames
      .filter((name) => name.toLowerCase().startsWith(lowerPrefix))
      .slice(0, 6)
      .map((result) => ({
        name: result, // name not `speciesName` to match what search result uses
        maps: this.encounterMap.get(result) ?? [],
      }));
  }

  /**
   * After a user selects a full Pokémon name from suggestions,
   * this function checks if it's in encounters and returns location info.
   */
  public getPokemonEncounterInfo(
    fullPokemonName: string,
  ): EncounterLocationInfo {
    const possibleKeys = this.normalizeName(fullPokemonName);
    let foundLevels: string[] | undefined;

    for (const key of possibleKeys) {
      if (this.encounterMap.has(key)) {
        foundLevels = this.encounterMap.get(key);
        break;
      }
    }

    if (foundLevels && foundLevels.length > 0) {
      return {
        foundInEncounters: true,
        levelIDs: [...new Set(foundLevels)], // Ensure unique level IDs
      };
    }
    return {
      foundInEncounters: false,
    };
  }

  /**
   * Helper to get the dexId for a Pokémon name, typically used when
   * it's NOT found in encounters and you need to open the modal.
   */
  public getPokemonDexId(pokemonEncounterName: string): number | undefined {
    const lowerName = pokemonEncounterName.toLowerCase();

    const id = this.monNameKeys.get(lowerName);
    if (!id) {
      console.error(`pokemonSearchStore: Error getting ID for ${lowerName}`);
      return;
    }
    return id;
  }

  /**
   * Given an `itemId` (numeric), return array of Pokémon species names that can hold this item.
   */
  public getPokemonWithHeldItem(itemId: number): string[] {
    const speciesNames: string[] = [];

    for (const p of pokemonData) {
      // Ignore alternate forms – only consider default formId === 0 so we do not double-count
      if (p.formId && p.formId !== 0) continue;

      if (!p.heldItems || p.heldItems.length === 0) continue;

      // Check if this Pokémon can hold the specified item
      if (p.heldItems.includes(itemId)) {
        speciesNames.push(p.speciesName);
      }
    }

    return speciesNames;
  }

  /**
   * Get detailed encounter information for a Pokemon species
   * Returns an array of detailed encounter locations with level ranges and encounter types
   */
  public getDetailedEncounterInfo(speciesId: number) {
    const species = pokemonData.find((p) => p.speciesId === speciesId);
    if (!species) {
      console.error("pokemonSearchStore: getDetailedEncounterInfo", speciesId);
      return [];
    }

    // Convert species name to the format used in encounter data
    // Convert the "pretty" species name into the canonical key that our
    // encounter data now stores (see convertSpecies in src/data/map/encounters.ts)
    const specificFormOfSpecies = species.nameKey;
    const formOfNameUsedInEncounters = superNormalizeName(
      specificFormOfSpecies,
    );

    const locations: DetailedEncounterLocation[] = [];

    // Search through all encounter data to find this species
    Object.entries(encountersData).forEach(([, encounterData]) => {
      const mapName = encounterData.map;

      // Check land encounters
      if (encounterData.land_mons) {
        encounterData.land_mons.mons.forEach((mon) => {
          if (mon.species === formOfNameUsedInEncounters) {
            locations.push({
              mapName,
              encounterType: "land",
              minLevel: mon.min_level,
              maxLevel: mon.max_level,
              encounterRate: encounterData.land_mons.encounter_rate,
            });
          }
        });
      }

      // Check water encounters
      if (encounterData.water_mons) {
        encounterData.water_mons.mons.forEach((mon) => {
          if (mon.species === formOfNameUsedInEncounters) {
            locations.push({
              mapName,
              encounterType: "water",
              minLevel: mon.min_level,
              maxLevel: mon.max_level,
              encounterRate: encounterData.water_mons.encounter_rate,
            });
          }
        });
      }

      // Check fishing encounters
      if (encounterData.fishing_mons) {
        encounterData.fishing_mons.mons.forEach((mon) => {
          if (mon.species === formOfNameUsedInEncounters) {
            locations.push({
              mapName,
              encounterType: "fishing",
              minLevel: mon.min_level,
              maxLevel: mon.max_level,
              encounterRate: encounterData.fishing_mons.encounter_rate,
            });
          }
        });
      }

      // Check rock smash encounters
      if (encounterData.rock_smash_mons) {
        encounterData.rock_smash_mons.mons.forEach((mon) => {
          if (mon.species === formOfNameUsedInEncounters) {
            locations.push({
              mapName,
              encounterType: "rock_smash",
              minLevel: mon.min_level,
              maxLevel: mon.max_level,
              encounterRate: encounterData.rock_smash_mons.encounter_rate,
            });
          }
        });
      }
    });

    return [specificFormOfSpecies, speciesId, locations];
  }
}

export const pokemonSearchStore = new PokemonSearchStore();
