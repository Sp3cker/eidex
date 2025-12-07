import defaultEncounters from "./wild_encounters.json" with { type: "json" };
import mapConstants from "./map_constants.json" with { type: "json" };
import hearthMaps from "./hearth-map.json" with { type: "json" };
import { randomizeSpeciesForSlot } from "../../lib/randomiser/engine.ts";
import { RandomizerSpeciesMode } from "../../lib/randomiser/SpeciesTable.ts";
import { pokemonDataMap } from "../pokemon.ts";
import { findDupesAndUniques } from "@/lib/utils.ts";

// --- Raw JSON Types ---
interface RawMon {
  min_level?: number;
  max_level?: number;
  species: number;
}

interface RawEncounterGroup {
  map: string;
  base_label: string;
  time: "day" | "night";
  land?: {
    encounter_rate: number;
    mons: RawMon[];
  };
  water?: {
    encounter_rate: number;
    mons: RawMon[];
  };
  fish?: {
    encounter_rate: number;
    mons: RawMon[];
  };
  rock?: {
    encounter_rate: number;
    mons: RawMon[];
  };
}

interface RawWildEncounterData {
  wild_encounter_groups: Array<{
    label: string;
    for_maps: boolean;
    encounters: RawEncounterGroup[];
  }>;
}

export type EncounterListing = {
  min_level: number;
  max_level: number;
  species: number;
  name: string;
  rate: number;
  nightRate?: number;
  rod?: string;
};

export type EncounterGroup = {
  map: string;
  base_label: string;
  time: "day" | "night";
  land: {
    encounter_rate: number;
    mons: EncounterListing[];
  };
  water: {
    encounter_rate: number;
    mons: EncounterListing[];
  };
  fish: {
    encounter_rate: number;
    mons: EncounterListing[];
  };
  rock: {
    encounter_rate: number;
    mons: EncounterListing[];
  };
};

const stripVowels = (str: string) => {
  return str.replace(/[aeiou]/gi, "");
};
const putEncounterRate = (mons: EncounterListing[]) => {
  const rates = [20, 20, 10, 10, 10, 10, 5, 5, 4, 4, 1, 1];

  // Calculate total rates for each monster
  const encounterRates = mons.reduce((currRatesMap, encounter, index) => {
    if (index >= rates.length) return currRatesMap;
    const prev = currRatesMap.get(encounter.species);
    const newRate =
      prev?.rate === undefined ? rates[index] : prev.rate + rates[index];
    currRatesMap.set(encounter.species, {
      species: encounter.species,
      max_level: encounter.max_level,
      min_level: encounter.min_level,
      rate: newRate,
      name: encounter.name,
      rod: encounter.rod,
    });
    return currRatesMap;
  }, new Map<number, EncounterListing>());

  return Array.from(encounterRates.values()) as EncounterListing[];
};
const putRodUsed = (mons: EncounterListing[]) => {
  // If a mon appears in multiple rod types, it will be combined into a single string like "Old/Good Rod" or "Good/Super Rod"

  const rodsByIndex: string[] = [];
  const speciesByIndex: number[] = [];
  // First pass: assign rod type based on slot
  mons.forEach((mon, slot) => {
    speciesByIndex.push(mon.species);
    if (slot <= 2) {
      // 0, 1, 2
      rodsByIndex.push("Old");
    } else if (slot >= 3 && slot <= 5) {
      // 3, 4, 5
      rodsByIndex.push("Gd.");
    } else {
      rodsByIndex.push("Spr");
    }
  });
  // look through speciesByIndex, match each index to it's rodsByIndex
  // If a species appears in multiple rod types, combine them into a single string like "Old/Good Rod" or "Good/Super Rod"
  const speciesByRod = new Map<number, string>();
  speciesByIndex.forEach((species, index) => {
    const rod = rodsByIndex[index];
    const currentRod = speciesByRod.get(species);
    if (!currentRod) {
      speciesByRod.set(species, rod);
      return;
    }
    if (currentRod.includes(rod)) {
      // Don't want Old/Old/Old Rod
      return;
    }
    // If a species appears in multiple rod types, combine them into a single string like "Old/Good Rod" or "Good/Super Rod"
    speciesByRod.set(species, stripVowels(currentRod) + "/" + stripVowels(rod));
  });
  mons.forEach((mon, index) => {
    const rodLabel = speciesByRod.get(speciesByIndex[index]);
    mon.rod = (rodLabel ? rodLabel : "") + " Rod";
  });
};

class EncounterStore {
  private static readonly USER_ENCOUNTERS_KEY = "userEncounterData";
  private processedDefaultEncounters: Record<string, EncounterGroup[]>;

  public dataSource = "default" as "default" | "next";
  constructor() {
    // Process default encounters the same way as user-provided data
    this.processedDefaultEncounters = {};
    this.resetEncounterData();
  }
  resetEncounterData() {
    const processedData = this.parseAndConvertSpecies(
      defaultEncounters as unknown as RawWildEncounterData,
    );

    const groupedData = this.groupEncounterData(processedData);
    this.processedDefaultEncounters = this.flattenEncounterTimes(groupedData);
  }
  // TAKES encounter data base label, like `gPetalburgWoods` returns `MAP_PETALBURG_WOODS`
  private baseLabelToMap(baseLabel: string): string {
    return (
      "MAP_" +
      baseLabel
        .replace(/^g/, "")
        .replace(/(?:Lunchtime|Day|Night)$/gi, "")
        .replace(/([A-Z])/g, "_$1")
        .replace(/^_/, "")
        .replace(/\d+$/, "")
        .toUpperCase()
    );
  }
  private flattenEncounterTimes(groupedData: Record<string, EncounterGroup[]>) {
    const flattened: Record<string, EncounterGroup[]> = {};
    /* The goal is to 
    1. Merge the day and night encounters into 1 array.
    2. For encounters that are both day and night, they will have a `nightRate` and a `rate` property.
    3. If they're only night, they'll still have a `nigthRate` property.
    4. If they're only day, they'll just have a `rate` property.
    To do this, we first have to look at the map's levels and see what they have.
    If it's just day encounters, we can bail early.
    If it's just night encounters, we must change the `rate` property to `nightRate`.
    */
    for (const [mapKey, lvlEncsArr] of Object.entries(groupedData)) {
      const [nightEncs] = lvlEncsArr.filter((enc) => enc.time === "night");
      if (nightEncs === undefined) {
        // There's no night encounters, just keep as is
        flattened[mapKey] = lvlEncsArr;
        continue;
      }
      const indexOfDayEncs = lvlEncsArr.findIndex((enc) => enc.time === "day");
      // If no day encounters, we will just append to the first entry (night)
      if (indexOfDayEncs === -1) {
        flattened[mapKey] = [lvlEncsArr[0]];
        continue;
        // The encounters array will now only have 1 time
      }
      // const dayEncs = lvlEncsArr.findIndex((enc) => enc.time === "day");

      const { hasLandDay, hasWaterDay, hasFishDay, hasRockDay } = {
        hasLandDay:
          lvlEncsArr[indexOfDayEncs].land &&
          lvlEncsArr[indexOfDayEncs].land.mons.length > 0,
        hasWaterDay:
          lvlEncsArr[indexOfDayEncs].water &&
          lvlEncsArr[indexOfDayEncs].water.mons.length > 0,
        hasFishDay:
          lvlEncsArr[indexOfDayEncs].fish &&
          lvlEncsArr[indexOfDayEncs].fish.mons.length > 0,
        hasRockDay:
          lvlEncsArr[indexOfDayEncs].rock &&
          lvlEncsArr[indexOfDayEncs].rock.mons.length > 0,
      };
      const { hasLandNight, hasWaterNight, hasFishNight, hasRockNight } = {
        hasLandNight: nightEncs.land && nightEncs.land.mons.length > 0,
        hasWaterNight: nightEncs.water && nightEncs.water.mons.length > 0,
        hasFishNight: nightEncs.fish && nightEncs.fish.mons.length > 0,
        hasRockNight: nightEncs.rock && nightEncs.rock.mons.length > 0,
      };

      const toNight =
        (dupeEncs: any[]) =>
        (enc: EncounterListing, index: number, arr: EncounterListing[]) => {
          const nightMon = dupeEncs.find(
            (nightEnc: any) => nightEnc.species === enc.species,
          );
          if (nightMon) {
            // If we found a matching mon, we set the nightRate
            arr[index].nightRate = nightMon.rate;
          }
        };
      const nightifyRate = (u: EncounterListing) => {
        u.nightRate = u.rate;
        u.rate = 0;
        return u;
      };
      // Once we get here, we need to find species in night that are in day
      // and copy the `rate` property from the night encounter to the similar day encounter

      if (hasLandDay && hasLandNight) {
        const [dupes, uniques] = findDupesAndUniques(
          lvlEncsArr[indexOfDayEncs].land.mons,
          nightEncs.land.mons,
          (a) => a.species,
        );
        lvlEncsArr[indexOfDayEncs].land.mons.forEach(toNight(dupes));
        lvlEncsArr[indexOfDayEncs].land.mons.push(...uniques.map(nightifyRate));
      }
      if (hasWaterDay && hasWaterNight) {
        const [dupes, uniques] = findDupesAndUniques(
          lvlEncsArr[indexOfDayEncs].water.mons,
          nightEncs.water.mons,
          (a) => a.species,
        );
        lvlEncsArr[indexOfDayEncs].water.mons.forEach(toNight(dupes));
        lvlEncsArr[indexOfDayEncs].water.mons.push(
          ...uniques.map(nightifyRate),
        );
      }
      if (hasRockDay && hasRockNight) {
        const [dupes, uniques] = findDupesAndUniques(
          lvlEncsArr[indexOfDayEncs].rock.mons,
          nightEncs.rock.mons,
          (a) => a.species,
        );
        lvlEncsArr[indexOfDayEncs].rock.mons.forEach(toNight(dupes));
        lvlEncsArr[indexOfDayEncs].rock.mons.push(...uniques.map(nightifyRate));
      }
      if (hasFishDay && hasFishNight) {
        const [dupes, uniques] = findDupesAndUniques(
          lvlEncsArr[indexOfDayEncs].fish.mons,
          nightEncs.fish.mons,
          (a) => a.species,
        );
        lvlEncsArr[indexOfDayEncs].fish.mons.forEach(toNight(dupes));
        lvlEncsArr[indexOfDayEncs].fish.mons.push(...uniques.map(nightifyRate));
      }
      flattened[mapKey] = [lvlEncsArr[indexOfDayEncs]];
    }

    return flattened;
  }
  private parseAndConvertSpecies(jsonData: RawWildEncounterData) {
    // Get the main encounters array (first group that has for_maps: true)
    const mainEncounterGroup = jsonData.wild_encounter_groups[0];

    if (!mainEncounterGroup || !mainEncounterGroup.encounters) {
      throw new Error("Could not find main encounters group");
    }

    const convertSpecies = (mons: RawMon[]): EncounterListing[] => {
      //@ts-ignore
      return mons.map((mon) => {
        if (mon.min_level === undefined || mon.max_level === undefined) {
          throw new Error("Missing min_level or max_level in encounter data");
        }
        const speciesData = pokemonDataMap.get(mon.species.toString());
        const name = speciesData ? speciesData.nameKey : "Unknown";

        return {
          min_level: mon.min_level,
          max_level: mon.max_level,
          species: mon.species,
          name, // Add the name property
          rate: 0, // Initialize rate, will be filled later
        };
      });
    };

    mainEncounterGroup.encounters
      .filter((map) => hearthMaps.includes(map.map))
      .forEach((mapObj: any) => {
        if (mapObj.land) {
          mapObj.land = {
            encounter_rate: mapObj.land.encounter_rate,
            mons: putEncounterRate(convertSpecies(mapObj.land.mons)),
          };
        }

        if (mapObj.water) {
          mapObj.water = {
            encounter_rate: mapObj.water.encounter_rate,
            mons: putEncounterRate(convertSpecies(mapObj.water.mons)),
          };
        }

        if (mapObj.fish) {
          mapObj.fish = {
            encounter_rate: mapObj.fish.encounter_rate,
            mons: putEncounterRate(convertSpecies(mapObj.fish.mons)),
          };
          putRodUsed(mapObj.fish.mons);
        }

        if (mapObj.rock) {
          mapObj.rock = {
            encounter_rate: mapObj.rock.encounter_rate,
            mons: putEncounterRate(convertSpecies(mapObj.rock.mons)),
          };
        }
      });
    //@ts-ignore
    return mainEncounterGroup.encounters.filter((map) =>
      hearthMaps.includes(map.map),
    ) as EncounterGroup[];
  }

  private groupEncounterData(
    flatData: EncounterGroup[],
  ): Record<string, EncounterGroup[]> {
    const grouped: Record<string, EncounterGroup[]> = {};
    for (const encounter of flatData) {
      const key = encounter.base_label.includes("time")
        ? this.baseLabelToMap(encounter.base_label.replace(/_/g, ""))
        : this.baseLabelToMap(encounter.base_label.split("_")[0]);
      // debugger;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      encounter.time = encounter.base_label.includes("Night") ? "night" : "day";
      grouped[key].push(encounter);
    }
    return grouped;
  }

  get storedEncounterData(): Record<string, EncounterGroup[]> | null {
    const storedData = localStorage.getItem(EncounterStore.USER_ENCOUNTERS_KEY);
    if (storedData) {
      return JSON.parse(storedData) as Record<string, EncounterGroup[]>;
    }
    return null;
  }
  getEncounterData(): Record<string, EncounterGroup[]>;
  getEncounterData(id: string): EncounterGroup[];
  /* This could return undefined! */
  public getEncounterData(id?: string) {
    if (this.dataSource === "default") {
      if (id) {
        return this.processedDefaultEncounters[id];
      }
      return this.processedDefaultEncounters;
    }
    if (!this.storedEncounterData) {
      throw new Error("No encounter data found");
    }
    if (id) {
      return this.storedEncounterData[id];
    }
    return this.storedEncounterData;
  }
  public isStoredEncounterData(): boolean {
    const storedData = localStorage.getItem(EncounterStore.USER_ENCOUNTERS_KEY);

    return !!storedData;
  }
  public setEncounterData(rawJson: RawWildEncounterData) {
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

  /**
   * Randomize all encounters in-place using trainerSeed (full 32-bit seed) & species mode.

   * @param trainerSeed full 32-bit randomizer seed (trainer fullId)
   * @param mode species randomization mode
   * @param options optional flags 
   */
  public async randomizeEncountersWithTrainerSeed(
    trainerSeed: number,
    mode: number,
  ) {
    const MAX_SPECIES = 1535;
    const encounterData = this.getEncounterData();
    // Only iterate maps that actually have encounter data
    const encounterBaseMapKeys: string[] = Object.keys(encounterData);

    const AREA_KEYS: Array<"land" | "water" | "fish" | "rock"> = [
      "land",
      "water",
      "fish",
      "rock",
    ];

    const mapConstIndexed = mapConstants as Record<
      string,
      { group: number; num: number }
    >;
    for (const baseMapKey of encounterBaseMapKeys) {
      const mapEncounterLevels = encounterData[baseMapKey];
      if (!mapEncounterLevels || mapEncounterLevels.length === 0) {
        console.warn(
          `[encounterStore.randomize] Base map ${baseMapKey} has 0 encounter groups.`,
        );
        continue;
      }
      for (const group of mapEncounterLevels) {
        const levelMapName = group.map; // This is the actual level map constant key
        const levelMapMeta = mapConstIndexed[levelMapName];
        if (!levelMapMeta) {
          console.warn(
            `[encounterStore.randomize] No mapConstants entry for level map ${levelMapName} (base ${baseMapKey}), skipping this group.`,
          );
          continue;
        }
        for (const areaKey of AREA_KEYS) {
          const areaBlock = group[areaKey] as
            | { encounter_rate: number; mons: EncounterListing[] }
            | undefined;
          if (
            !areaBlock ||
            !Array.isArray(areaBlock.mons) ||
            areaBlock.mons.length === 0
          ) {
            continue; // skip silently
          }
          // Determine area enum (must mirror C ordering)
          const areaEnum = (() => {
            switch (areaKey) {
              case "land":
                return 0; // WildArea.LAND
              case "water":
                return 1; // WildArea.WATER
              case "rock":
                return 2; // WildArea.FISHING
              case "fish":
                return 3; // custom extension (not in original C subset used earlier)
            }
          })();
          const mons = areaBlock.mons;
          for (let slot = 0; slot < mons.length; slot++) {
            const mon = mons[slot];
            if (mon.species >= MAX_SPECIES) {
              throw new Error(
                `Species id ${mon.species} out of bounds at ${levelMapName}:${areaKey}[${slot}]`,
              );
            }
            const original = mon.species;
            const randomized = await randomizeSpeciesForSlot(
              original,
              mode as RandomizerSpeciesMode,
              trainerSeed,
              levelMapName,
              areaEnum,
              slot,
            );

            mon.species = randomized;
            //@ts-ignore
            mon.name = pokemonDataMap.get(randomized.toString())?.nameKey;
          }
        }
      }
    }
  }
}

export const encounterStore = new EncounterStore();
