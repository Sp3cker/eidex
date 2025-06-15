import { pokemonData } from "@/data/pokemon"; // Assuming this is Object.values(speciesDataJson)
import encountersData from "@/data/map/cleanEncounters.json"; // Or your processed encounter data

interface EncounterLocationInfo {
  foundInEncounters: boolean;
  levelIDs?: string[]; // Array of map/level string IDs where it's found
  // Undefined or empty if not foundInEncounters
}
const encReducer = (acc: string[], curr: any) => {
  if (curr.species && !acc.includes(curr.species)) {
    acc.push(curr.species);
  }
  return acc;
};
class PokemonSearchStore {
  private encounterMap: Map<string, string[]>; // Pokemon name -> array of level IDs
  private allSpeciesNames: string[]; // For quick prefix searching
  private monNameKeys: Map<string, number> = new Map<string, number>(); // Map of name in `encounters` format to their `speciesId`
  constructor() {
    this.encounterMap = new Map();
    this.monNameKeys = new Map<string, number>([]);
    pokemonData.forEach((p) => {
      if (p.formId !== 0) return;
      this.monNameKeys.set(
        p.speciesName.toLowerCase().replace(/-/g, "_"),
        p.speciesId,
      );
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

      // Or whatever your structure is
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

    // 2. Populate allSpeciesNames from pokemonData (speciesData.json)
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
}

export const pokemonSearchStore = new PokemonSearchStore();
