import defaultEncounters from "./wild_encounters.json";
import { EncounterGroup } from "./index";
import { superNormalizeName } from "@/utils/normalizeName";

interface Mon {
  min_level?: number;
  max_level?: number;
  species: string;
}
// Base types for encounter data
type EncounterListing = {
  min_level: number;
  max_level: number;
  species: string;
};

export interface WildEncounterData {
  wild_encounter_groups: Array<{
    label: string;
    for_maps: boolean;
    encounters: EncounterGroup[];
  }>;
}

class EncounterStore {
  private static readonly USER_ENCOUNTERS_KEY = "userEncounterData";
  private processedDefaultEncounters: Record<string, EncounterGroup[]>;

  public dataSource = "default" as "default" | "next";
  constructor() {
    // Process default encounters the same way as user-provided data
    const processedData = this.parseAndConvertSpecies(
      defaultEncounters as WildEncounterData,
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
      // Map of edge–case species names coming from the encounters file ➡️ the
      // canonical keys used inside speciesData.json (and therefore inside
      // MONNAMEKEYS). Doing this translation once during initialisation means
      // we don't need to repeat the edge-case logic every time a map is
      // selected.


      return mons.map((mon) => {
        if (mon.min_level === undefined || mon.max_level === undefined) {
          throw new Error("Missing min_level or max_level in encounter data");
        }

        // Remove the COMPILER enum prefix and use the shared normalization function
        const speciesKey = superNormalizeName(mon.species.replace(/^SPECIES_/, ""));
        // if (speciesKey.includes("sneasel_hisu")) {
        //   debugger
        // }
        return {
          min_level: mon.min_level,
          max_level: mon.max_level,
          species: speciesKey,
        };
      });
    };

    return mainEncounterGroup.encounters.map((mapObj: EncounterGroup) => {
      const newMapObj: EncounterGroup = { ...mapObj };

      if (newMapObj.land_mons) {
        newMapObj.land_mons = {
          ...newMapObj.land_mons,
          mons: convertSpecies(newMapObj.land_mons.mons),
        };
      }

      if (newMapObj.water_mons) {
        newMapObj.water_mons = {
          ...newMapObj.water_mons,
          mons: convertSpecies(newMapObj.water_mons.mons),
        };
      }

      if (newMapObj.fishing_mons) {
        newMapObj.fishing_mons = {
          ...newMapObj.fishing_mons,
          mons: convertSpecies(newMapObj.fishing_mons.mons),
        };
      }

      if (newMapObj.rock_smash_mons) {
        newMapObj.rock_smash_mons = {
          ...newMapObj.rock_smash_mons,
          mons: convertSpecies(newMapObj.rock_smash_mons.mons),
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
  public getEncounterData(): Record<string, EncounterGroup[]> {
    if (this.dataSource === "default") {
      return this.processedDefaultEncounters;
    }
    //@ts-expect-error - storedEncounterData may be undefined but we're handling it
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
