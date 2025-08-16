import { pokemonData } from "@/data/pokemon"; // Assuming this is Object.values(speciesDataJson)
import { encounterStore } from "@/data/map/encounters"; // Or your processed encounter data
import { superNormalizeName } from "@/utils/normalizeName";

const encReducer = (acc: number[], curr: { species?: number }) => {
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
  private encounterMap: Map<number, string[]>; // Pokemon name -> array of level IDs
  private allSpeciesNames: string[]; // For quick prefix searching
  private monNameKeys: Map<string, number> = new Map<string, number>([]); // Map of name in `encounters` format to their `speciesId`

  constructor() {
    this.encounterMap = new Map();
    pokemonData.forEach((p) => {
      if (typeof p.formId !== "undefined" && p.formId !== 0) return;

      const baseSpeciesKey = superNormalizeName(p.nameKey);

      this.monNameKeys.set(baseSpeciesKey, p.baseForm || p.speciesId); // important for not getting mega forms
    });

    this.allSpeciesNames = Array.from(this.monNameKeys.keys());
    this._initialize();
  }

  _initialize() {
    // 1. Build the encounterMap from encountersStore
    //    Key: Normalized Pokémon species name (e.g., "gligar")
    //    Value: Array of levelID strings (e.g., ["MAP_GRANITE_CAVE_B1F", ...])
    this.encounterMap.clear(); // Clear previous data
    const levels = encounterStore.getEncounterData();

    for (const mapBaseName in levels) {
      if (!levels[mapBaseName]) continue;
      levels[mapBaseName].forEach((encounter) => {
        const { fish, land, water, rock } = encounter;
        const levelEncounters = [];
        if (land) {
          levelEncounters.push(...land.mons.reduce(encReducer, []));
        }
        if (water) {
          levelEncounters.push(...water.mons.reduce(encReducer, []));
        }
        if (fish) {
          levelEncounters.push(...fish.mons.reduce(encReducer, []));
        }
        if (rock) {
          levelEncounters.push(...rock.mons.reduce(encReducer, []));
        }

        levelEncounters.forEach((speciesId: number) => {
          if (!this.encounterMap.has(speciesId)) {
            this.encounterMap.set(speciesId, []);
          }

          this.encounterMap.get(speciesId)!.push(encounter.map);
        });
      });
    }
    // Repeat for other encounter types if necessary (water_mons_flat, etc.)
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
      .map((result) => {
        const id = this.monNameKeys.get(result);
        debugger
        return {
          id, // name not `speciesName` to match what search result uses
          name: result, // name not `speciesName` to match what search result uses
          maps: this.encounterMap.get(id ?? 0) ?? [],
        };
      });
  }

  /**
   * After a user selects a full Pokémon name from suggestions,
   * this function checks if it's in encounters and returns location info.
   */
  public getPokemonEncounterInfo(fullPokemonName: string) {
    const speciesId = this.monNameKeys.get(superNormalizeName(fullPokemonName));

    let foundLevels: string[] | undefined;
    if (speciesId) {
      foundLevels = this.encounterMap.get(speciesId);
    }

    if (foundLevels && foundLevels.length > 0) {
      return {
        speciesId,
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

    const locations: DetailedEncounterLocation[] = [];
    const levels = encounterStore.getEncounterData();
    if (!levels) return [specificFormOfSpecies, speciesId, locations];

    // Search through all encounter data to find this species
    Object.entries(levels).forEach(([, encounterGroups]) => {
      encounterGroups.forEach((encounterData) => {
        const mapName = encounterData.map;

        // Check land encounters
        if (encounterData.land) {
          encounterData.land.mons.forEach((mon) => {
            if (mon.species === speciesId) {
              locations.push({
                mapName,
                encounterType: "land",
                minLevel: mon.min_level,
                maxLevel: mon.max_level,
                encounterRate: encounterData.land.encounter_rate,
              });
            }
          });
        }

        // Check water encounters
        if (encounterData.water) {
          encounterData.water.mons.forEach((mon) => {
            if (mon.species === speciesId) {
              locations.push({
                mapName,
                encounterType: "water",
                minLevel: mon.min_level,
                maxLevel: mon.max_level,
                encounterRate: encounterData.water.encounter_rate,
              });
            }
          });
        }

        // Check fishing encounters
        if (encounterData.fish) {
          encounterData.fish.mons.forEach((mon) => {
            if (mon.species === speciesId) {
              locations.push({
                mapName,
                encounterType: "fishing",
                minLevel: mon.min_level,
                maxLevel: mon.max_level,
                encounterRate: encounterData.fish.encounter_rate,
              });
            }
          });
        }

        // Check rock smash encounters
        if (encounterData.rock) {
          encounterData.rock.mons.forEach((mon) => {
            if (mon.species === speciesId) {
              locations.push({
                mapName,
                encounterType: "rock_smash",
                minLevel: mon.min_level,
                maxLevel: mon.max_level,
                encounterRate: encounterData.rock.encounter_rate,
              });
            }
          });
        }
      });
    });

    return [specificFormOfSpecies, speciesId, locations];
  }
}

export const pokemonSearchStore = new PokemonSearchStore();
