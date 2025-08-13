import { getMapConstant, getSpeciesData } from "./data.ts";
import {
  RANDOMIZER_REASON_WILD_ENCOUNTER,
  randomizerRandSeed,
} from "./sfc32.ts";
import { randomizerNextRange, Sfc32State } from "./sfc32.ts";
import SpeciesTable, {
  RandomizerSpeciesMode,
  RandomizerPerSpeciesMode,
  SpeciesDataTable,
  SpeciesInfoEntry,
  RANDOMIZER_SPECIES_COUNT,
} from "./SpeciesTable.ts";
import {
  getSpeciesGroup,
  getIndicesFromGroupRange,
  getGroupRange,
} from "./groupRanges.ts";

// Cache: ensure we only build once per mode and reuse thereafter

const speciesTablePromiseByMode = new Map<
  RandomizerSpeciesMode,
  SpeciesDataTable
>();
export async function getSpeciesTable(
  mode: RandomizerSpeciesMode,
): Promise<SpeciesDataTable> {

  const raw = (await getSpeciesData()) as unknown as ReadonlyArray<
    Partial<SpeciesInfoEntry> & { ID?: number; id?: number }
  >;
  const MAX = RANDOMIZER_SPECIES_COUNT - 1;
  const speciesById: SpeciesInfoEntry[] = new Array(MAX);
  // Initialize all entries as invalid placeholders
  for (let i = 0; i < MAX; i++) {
    speciesById[i] = {
      id: i,
      baseStat: 0,
      isLegendary: false,
      mode: RandomizerPerSpeciesMode.MON_RANDOMIZER_INVALID,
    };
  }
  // Place provided entries at their ID indices
  for (let i = 0; i < raw.length; i++) {
    const e = raw[i] ?? {};
    const id = (typeof e.id === "number" ? e.id : e.ID) as number | undefined;
    if (typeof id === "number" && id >= 0 && id < MAX) {
      speciesById[id] = {
        id,
        baseStat: (e.baseStat as number) ?? 0,
        isLegendary: (e.isLegendary as boolean) ?? false,
        mode: ((e.mode as number) ??
          RandomizerPerSpeciesMode.MON_RANDOMIZER_NORMAL) as RandomizerPerSpeciesMode,
      };
    }
  }
  const table = new SpeciesTable(speciesById).buildSpeciesTable(mode);
  speciesTablePromiseByMode.set(mode, table);
  return table;
}

export function clearSpeciesTableCache(mode?: RandomizerSpeciesMode): void {
  if (mode === undefined) {
    speciesTablePromiseByMode.clear();
  } else {
    speciesTablePromiseByMode.delete(mode);
  }
}

export async function randomizeMonTableLookup(
  state: Sfc32State,
  mode: RandomizerSpeciesMode,
  species: number,
) {
  const table = await getSpeciesTable(mode);

  // Mirror C GetSpeciesGroup: groupData[speciesToGroupIndex[species]]
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
export async function randomizeSpeciesForSlot(
  originalSpecies: number,
  mode: RandomizerSpeciesMode,
  trainerSeed: number,
  levelId: string,
  areaEnum: number,
  slotIndex: number,
) {
  const mapData = await getMapConstant(levelId);
  if (!mapData) return originalSpecies;
  const { group, num } = mapData;
  const seed = (group << 24) | (num << 16) | (areaEnum << 8) | slotIndex;
  const state = randomizerRandSeed(
    RANDOMIZER_REASON_WILD_ENCOUNTER,
    seed,
    originalSpecies,
    trainerSeed,
  );
  return randomizeMonTableLookup(state, mode, originalSpecies);
}
