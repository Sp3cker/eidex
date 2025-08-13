import { describe, it, expect } from "vitest";
import mapsAndSpecies from "./mapsandspecies.json" with { type: "json" };
import SpeciesTable from "../lib/randomiser/SpeciesTable.ts";
import {
  RANDOMIZER_SPECIES_COUNT,
  RandomizerSpeciesMode,
  RandomizerPerSpeciesMode,
  type SpeciesDataTable,
  type SpeciesInfoEntry,
} from "../lib/randomiser/SpeciesTable.ts";
import {
  getGroupRange,
  getIndicesFromGroupRange,
  getSpeciesGroup,
} from "../lib/randomiser/groupRanges.ts";
import {
  randomizerRandSeed,
  randomizerNextRange,
  RANDOMIZER_REASON_WILD_ENCOUNTER,
  type Sfc32State,
} from "../lib/randomiser/sfc32.ts";

type JsonSpecies = {
  ID: number;
  baseStat: number;
  isLegendary?: boolean;
  mode: number;
};
type MapsAndSpecies = {
  species: JsonSpecies[];
  maps: Record<string, { group: number; num: number }>;
};

function toSpeciesInfoArray(
  json: MapsAndSpecies["species"],
): SpeciesInfoEntry[] {
  const MAX = RANDOMIZER_SPECIES_COUNT - 1;
  const speciesInfo: SpeciesInfoEntry[] = new Array(MAX);
  for (let i = 0; i < MAX; i++) {
    speciesInfo[i] = {
      id: i,
      baseStat: 0,
      isLegendary: false,
      mode: RandomizerPerSpeciesMode.MON_RANDOMIZER_INVALID,
    };
  }
  for (const e of json) {
    const id = e.ID;
    if (id >= 0 && id < MAX) {
      speciesInfo[id] = {
        id,
        baseStat: e.baseStat ?? 0,
        isLegendary: e.isLegendary ?? false,
        mode: e.mode as RandomizerPerSpeciesMode,
      };
    }
  }
  return speciesInfo;
}

function randomizeMonTableLookupLocal(
  state: Sfc32State,
  mode: RandomizerSpeciesMode,
  species: number,
  table: SpeciesDataTable,
) {
  const originalGroup = getSpeciesGroup(table, species);
  if (originalGroup === 0xffff) return species;
  const { minGroup, maxGroup } = getGroupRange(originalGroup, mode);
  const { start, end } = getIndicesFromGroupRange(table, minGroup, maxGroup);
  const count = end - start + 1;
  if (count <= 0) return species;
  const randomIndex = randomizerNextRange(state, count);
  const finalIndex = start + randomIndex;
  return table.groupIndexToSpecies[finalIndex];
}

describe("SpeciesTable (no IndexedDB)", () => {
  const { species, maps } = mapsAndSpecies as MapsAndSpecies;

  it("builds a species table from JSON", () => {
    expect(species.length).toBe(1535);
    const speciesInfo = toSpeciesInfoArray(species);
    const table = new SpeciesTable(speciesInfo).buildSpeciesTable(
      RandomizerSpeciesMode.MON_RANDOM_BST,
    );
    expect(Array.isArray(table.groupData)).toBe(true);
    expect(table.groupData.length).toBe(RANDOMIZER_SPECIES_COUNT);
    expect(table.speciesToGroupIndex.length).toBe(RANDOMIZER_SPECIES_COUNT);
    expect(table.groupIndexToSpecies.length).toBe(RANDOMIZER_SPECIES_COUNT);
  });

  it("randomizes a species deterministically with seed IN NORMAL MODE", async () => {
    const mode = RandomizerSpeciesMode.MON_RANDOM;
    const speciesInfo = toSpeciesInfoArray(species);
    const table = new SpeciesTable(speciesInfo).buildSpeciesTable(
      RandomizerSpeciesMode.MON_RANDOM,
    );
    const originalSpecies = 16;
    const { group, num } = maps["MAP_ROUTE101"];
    const areaEnum = 0;
    const slotIndex = 2;
    const seed = (group << 24) | (num << 16) | (areaEnum << 8) | slotIndex;
    const trainerSeed = -1716499767;
    const state = randomizerRandSeed(
      RANDOMIZER_REASON_WILD_ENCOUNTER,
      seed,
      originalSpecies,
      trainerSeed,
    );
    const result = await randomizeMonTableLookupLocal(
      state,
      mode,
      originalSpecies,
      table,
    );
    expect(typeof result).toBe("number");
    expect(result).toBe(138);
    expect(result).toBeLessThan(RANDOMIZER_SPECIES_COUNT);
  });

  it("RANDOM BST MODE", async () => {
    const mode = RandomizerSpeciesMode.MON_RANDOM_BST;
    const speciesInfo = toSpeciesInfoArray(species);
    const table = new SpeciesTable(speciesInfo).buildSpeciesTable(
      mode
    );
    const originalSpecies = 403;
    const { group, num } = maps["MAP_ROUTE101"];
    const areaEnum = 0;
    const slotIndex = 0;
    const seed = (group << 24) | (num << 16) | (areaEnum << 8) | slotIndex;
    const trainerSeed = -494598815;
    const state = randomizerRandSeed(
      RANDOMIZER_REASON_WILD_ENCOUNTER,
      seed,
      originalSpecies,
      trainerSeed,
    );
    const result = await randomizeMonTableLookupLocal(
      state,
      mode,
      originalSpecies,
      table,
    );
    expect(typeof result).toBe("number");
    expect(result).toBe(1298);
    expect(result).toBeLessThan(RANDOMIZER_SPECIES_COUNT);
  });
});
