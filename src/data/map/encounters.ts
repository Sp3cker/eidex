import defaultEncounters from "./encounters.json";
import { EncounterGroup } from "./index";
import { pokemonDataMap } from "../pokemon";

interface Mon {
  min_level?: number;
  max_level?: number;
  species: number;
}
// Base types for encounter data
type EncounterListing = {
  min_level: number;
  max_level: number;
  species: number;
  name: string;
};

interface WildEncounterData {
  wild_encounter_groups: Array<{
    label: string;
    for_maps: boolean;
    encounters: EncounterGroup[];
  }>;
}
/** looks like this
 * "MAP_ROUTE102" :{
 *  "land": {
 *    "encounter_rate": 20,
 *    "mons": [
 *      {
 *        "min_level": 3,
 *        "max_level": 5,}
 *      }
 *    ]
 *  }
 * }
 */
class EncounterStore {
  private static readonly USER_ENCOUNTERS_KEY = "userEncounterData";
  private processedDefaultEncounters: Record<string, EncounterGroup[]>;

  public dataSource = "default" as "default" | "next";
  constructor() {
    // Process default encounters the same way as user-provided data
    const processedData = this.parseAndConvertSpecies(
      defaultEncounters as unknown as WildEncounterData,
    );

    this.processedDefaultEncounters = this.groupEncounterData(processedData);
  }

  // TAKES encounter data base label, like `gPetalburgWoods` returns `MAP_PETALBURG_WOODS`
  private baseLabelToMap(baseLabel: string): string {
    return (
      "MAP_" +
      baseLabel
        .replace(/^g/, "")
        .replace(/([A-Z])/g, "_$1")
        .replace(/^_/, "")
        .toUpperCase()
    );
  }
  private parseAndConvertSpecies(
    jsonData: WildEncounterData,
  ): EncounterGroup[] {
    // Get the main encounters array (first group that has for_maps: true)
    const mainEncounterGroup = jsonData.wild_encounter_groups.find(
      (group) => group.for_maps,
    );

    if (!mainEncounterGroup || !mainEncounterGroup.encounters) {
      throw new Error("Could not find main encounters group");
    }

    const convertSpecies = (mons: Mon[]): EncounterListing[] => {
      return mons.map((mon) => {
        if (mon.min_level === undefined || mon.max_level === undefined) {
          throw new Error("Missing min_level or max_level in encounter data");
        }

        const speciesData = pokemonDataMap.get(mon.species.toString());
        const name = speciesData ? speciesData.nameKey : "Unknown";

        return {
          min_level: mon.min_level,
          max_level: mon.max_level,
          species: mon.species, // Directly use the species as a number
          name, // Add the name property
        };
      });
    };

    return mainEncounterGroup.encounters.map((mapObj: EncounterGroup) => {
      const newMapObj: EncounterGroup = { ...mapObj };

      if (newMapObj.land) {
        newMapObj.land = {
          encounter_rate: newMapObj.land.encounter_rate,
          mons: convertSpecies(newMapObj.land.mons),
        };
      }

      if (newMapObj.water) {
        newMapObj.water = {
          encounter_rate: newMapObj.water.encounter_rate,
          mons: convertSpecies(newMapObj.water.mons),
        };
      }

      if (newMapObj.fish) {
        newMapObj.fish = {
          encounter_rate: newMapObj.fish.encounter_rate,
          mons: convertSpecies(newMapObj.fish.mons),
        };
      }

      if (newMapObj.rock) {
        newMapObj.rock = {
          encounter_rate: newMapObj.rock.encounter_rate,
          mons: convertSpecies(newMapObj.rock.mons),
        };
      }

      return newMapObj;
    });
  }

  private groupEncounterData(
    flatData: EncounterGroup[],
  ): Record<string, EncounterGroup[]> {
    const grouped: Record<string, EncounterGroup[]> = {};
    for (const encounter of flatData) {
      const key = encounter.base_label.includes("Underwater")
        ? this.baseLabelToMap(encounter.base_label.replace(/_/g, ""))
        : this.baseLabelToMap(encounter.base_label.split("_")[0]);
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(encounter);
    }
    return grouped;
  }

  get storedEncounterData() {
    const storedData = localStorage.getItem(EncounterStore.USER_ENCOUNTERS_KEY);
    if (storedData) {
      return JSON.parse(storedData) as Record<string, EncounterGroup[]>;
    }
  }
  /** Main getter and setter */
  public getEncounterData() {
    if (this.dataSource === "default") {
      return this.processedDefaultEncounters;
    }
    if (!this.storedEncounterData) {
      throw new Error("No encounter data found");
    }
    return this.storedEncounterData;
  }
  public isStoredEncounterData(): boolean {
    const storedData = localStorage.getItem(EncounterStore.USER_ENCOUNTERS_KEY);

    return !!storedData;
  }
  public setEncounterData(rawJson: WildEncounterData) {
    if (
      !rawJson.wild_encounter_groups ||
      !Array.isArray(rawJson.wild_encounter_groups)
    ) {
      throw new Error(
        "Invalid file format: 'wild_encounter_groups' array not found.",
      );
    }
    const processedData = this.parseAndConvertSpecies(rawJson);
    const groupedData = this.groupEncounterData(processedData);
    localStorage.setItem(
      EncounterStore.USER_ENCOUNTERS_KEY,
      JSON.stringify(groupedData),
    );
  }

  public clearEncounterData() {
    localStorage.removeItem(EncounterStore.USER_ENCOUNTERS_KEY);
  }
}

export const encounterStore = new EncounterStore();
