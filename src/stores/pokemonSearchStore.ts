import { pokemonData } from "@/data/pokemon"; // Assuming this is Object.values(speciesDataJson)
import encountersData from "@/data/map/cleanEncounters.json"; // Or your processed encounter data

interface EncounterLocationInfo {
  foundInEncounters: boolean;
  levelIDs?: string[]; // Array of map/level string IDs where it's found
  // Undefined or empty if not foundInEncounters
}

class PokemonSearchStore {
  private encounterMap: Map<string, string[]>; // Pokemon name -> array of level IDs
  private allSpeciesNames: string[]; // For quick prefix searching

  constructor() {
    this.encounterMap = new Map();
    this.allSpeciesNames = [];
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
      // @ts-ignore
      const levelEncounters = encountersData[levelID];
      if (levelEncounters && levelEncounters.land_mons_flat) {
        // Or whatever your structure is
        // @ts-ignore
        levelEncounters.land_mons_flat.forEach((encounter: any) => {
          if (encounter && encounter.species) {
            const normalizedSpeciesKeys = this.normalizeName(encounter.species);
            // Use the first successful normalization as the primary key, or a consistent one
            const primaryKey =
              normalizedSpeciesKeys.find((key) => key.includes("_")) ||
              normalizedSpeciesKeys[0] ||
              encounter.species.toLowerCase();

            if (!this.encounterMap.has(primaryKey)) {
              this.encounterMap.set(primaryKey, []);
            }
            this.encounterMap.get(primaryKey)!.push(levelID);
          }
        });
      }
      // Repeat for other encounter types if necessary (water_mons_flat, etc.)
    }

    // 2. Populate allSpeciesNames from pokemonData (speciesData.json)
    this.allSpeciesNames = pokemonData
      .map((p) => p.speciesName || p.nameKey)
      .filter(Boolean);
  }

  /**
   * Provides a list of Pokémon names from speciesData.json that match the prefix.
   * This is for search suggestions.
   */
  public getSearchSuggestions(prefix: string): string[] {
    if (!prefix || prefix.trim().length < 1) {
      // Or a min length like 2 or 3
      return [];
    }
    const lowerPrefix = prefix.toLowerCase();
    return this.allSpeciesNames.filter((name) =>
      name.toLowerCase().startsWith(lowerPrefix),
    );
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
  public getPokemonDexId(fullPokemonName: string): number | null {
    const lowerName = fullPokemonName.toLowerCase();
    const pokemon = pokemonData.find(
      (p) =>
        p.speciesName?.toLowerCase() === lowerName ||
        p.nameKey?.toLowerCase() === lowerName,
    );
    return pokemon?.dexId ?? null;
  }
}

export const pokemonSearchStore = new PokemonSearchStore();
