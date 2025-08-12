import { loadSpeciesData } from "./data.ts";

// Per-species randomizer mode constants (from C enum)
export enum RandomizerPerSpeciesMode {
  MON_RANDOMIZER_NORMAL = 0,
  MON_RANDOMIZER_RANDOM_FORM = 1,
  MON_RANDOMIZER_SPECIAL_FORM = 2,
  MON_RANDOMIZER_INVALID = 3,
}

const RANDOMIZER_SPECIES_COUNT = 1535;
const GROUP_INVALID = 0xffff;

export enum RandomizerSpeciesMode {
  MON_RANDOM = 0,
  MON_RANDOM_BST = 1,
  MON_RANDOM_LEGEND_AWARE = 2,
  // MON_EVOLUTION = 3,
  MAX_MON_MODE = 4,
}

// const speciesById: SpeciesRandomizations[] = (() => {
//   const arr: SpeciesRandomizations[] = new Array(RANDOMIZER_SPECIES_COUNT);
//   const sentinel: SpeciesRandomizations = {
//     id: 0,
//     isLegendary: false,
//     mode: RandomizerPerSpeciesMode.MON_RANDOMIZER_INVALID,
//     baseStat: 0,
//   };
//   for (let i = 0; i < RANDOMIZER_SPECIES_COUNT; i++)
//     arr[i] = { ...sentinel, id: i };
//   const src: RandomizeJsonEntry[] =
//     randoSeeds as unknown as RandomizeJsonEntry[];
//   for (const entry of src) {
//     const speciesId = entry.ID;
//     if (speciesId >= 0 && speciesId < RANDOMIZER_SPECIES_COUNT) {
//       arr[speciesId] = {
//         id: speciesId,
//         isLegendary: entry.isLegendary,
//         mode: entry.mode,
//         baseStat: entry.baseStat,
//       };
//     }
//   }
//   return arr;
// })();

export interface SpeciesDataTable {
  groupData: number[]; // Sorted groups (after heap sort)
  groupIndexToSpecies: number[]; // Maps sorted index -> species ID
  speciesToGroupIndex: number[]; // Maps species ID -> sorted index
}

export interface SpeciesInfoEntry {
  id: number;
  baseStat: number;
  isLegendary?: boolean;
  mode: RandomizerPerSpeciesMode;
}

class SpeciesTable implements SpeciesDataTable {
  groupData: number[];
  groupIndexToSpecies: number[];
  speciesToGroupIndex: number[];
  private speciesInfo: ReadonlyArray<SpeciesInfoEntry> = [];
  constructor(speciesInfo: ReadonlyArray<SpeciesInfoEntry>) {
    if (speciesInfo.length !== RANDOMIZER_SPECIES_COUNT) {
      throw new Error(
        `Expected ${RANDOMIZER_SPECIES_COUNT} species, got ${speciesInfo.length}`,
      );
    }
    this.speciesInfo = speciesInfo;
    this.groupData = new Array(RANDOMIZER_SPECIES_COUNT);
    this.groupIndexToSpecies = new Array(RANDOMIZER_SPECIES_COUNT);
    this.speciesToGroupIndex = new Array(RANDOMIZER_SPECIES_COUNT).fill(0);
  }
  buildSpeciesTable(mode: RandomizerSpeciesMode): SpeciesDataTable {
    // initialize arrays
    this.groupData = new Array(RANDOMIZER_SPECIES_COUNT);
    this.groupIndexToSpecies = new Array(RANDOMIZER_SPECIES_COUNT);
    this.speciesToGroupIndex = new Array(RANDOMIZER_SPECIES_COUNT).fill(0);

    switch (mode) {
      case RandomizerSpeciesMode.MON_RANDOM_LEGEND_AWARE:
        this.fillSpeciesGroupsLegendary();
        break;
      case RandomizerSpeciesMode.MON_RANDOM_BST:
        this.fillSpeciesGroupsBST();
        break;
      // case RandomizerSpeciesMode.MON_EVOLUTION:
      //   this.fillSpeciesGroupsEvolution(); // TODO real evolution stage grouping
      //   break;
      case RandomizerSpeciesMode.MON_RANDOM:
      default:
        this.fillSpeciesGroupsRandom();
    }

    // Heapsort (max-heap with exclusive end) resulting in ASCENDING order by group value (mirrors fixed C implementation)
    let start = Math.floor(RANDOMIZER_SPECIES_COUNT / 2);
    let end = RANDOMIZER_SPECIES_COUNT; // exclusive upper bound
    while (end > 1) {
      if (start > 0) {
        start -= 1;
      } else {
        end -= 1;
        this.swapSpeciesAndGroup(end, 0);
      }
      let root = start;
      while (this.leftChildIndex(root) < end) {
        let child = this.leftChildIndex(root);
        if (
          child + 1 < end &&
          this.groupData[child] < this.groupData[child + 1]
        ) {
          child += 1;
        }
        if (this.groupData[root] < this.groupData[child]) {
          this.swapSpeciesAndGroup(root, child);
          root = child;
        } else {
          break;
        }
      }
    }

    // Build reverse lookup
    for (let i = 0; i < RANDOMIZER_SPECIES_COUNT; i++) {
      const speciesId = this.groupIndexToSpecies[i];
      if (speciesId >= 0 && speciesId < RANDOMIZER_SPECIES_COUNT) {
        this.speciesToGroupIndex[speciesId] = i;
      }
    }

    return {
      groupData: this.groupData,
      groupIndexToSpecies: this.groupIndexToSpecies,
      speciesToGroupIndex: this.speciesToGroupIndex,
    };
  }

  fillSpeciesGroupsLegendary(): void {
    for (let i = 0; i < RANDOMIZER_SPECIES_COUNT; i++) {
      this.groupIndexToSpecies[i] = i;
      this.groupData[i] = this.isSpeciesPermitted(i)
        ? this.speciesInfo[i]?.isLegendary
          ? 1
          : 0
        : GROUP_INVALID;
    }
  }

  fillSpeciesGroupsBST(): void {
    for (let i = 0; i < RANDOMIZER_SPECIES_COUNT; i++) {
      this.groupIndexToSpecies[i] = i;
      this.groupData[i] = this.isSpeciesPermitted(i)
        ? (this.speciesInfo[i]?.baseStat ?? 0)
        : GROUP_INVALID;
    }
  }

  fillSpeciesGroupsEvolution(): void {
    for (let i = 0; i < RANDOMIZER_SPECIES_COUNT; i++) {
      this.groupIndexToSpecies[i] = i;
      this.groupData[i] = this.isSpeciesPermitted(i) ? 0 : GROUP_INVALID;
    }
  }
  isSpeciesPermitted(speciesId: number): boolean {
    if (speciesId === 0) return false; // SPECIES_NONE
    const info = this.speciesInfo[speciesId];
    if (!info) return false;
    if (info.mode === RandomizerPerSpeciesMode.MON_RANDOMIZER_INVALID)
      return false;
    if (info.baseStat === 0) return false; // disabled placeholder
    return true;
  }

  private leftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  swapSpeciesAndGroup(indexA: number, indexB: number): void {
    const tempGroup = this.groupData[indexA];
    this.groupData[indexA] = this.groupData[indexB];
    this.groupData[indexB] = tempGroup;
    const tempSpecies = this.groupIndexToSpecies[indexA];
    this.groupIndexToSpecies[indexA] = this.groupIndexToSpecies[indexB];
    this.groupIndexToSpecies[indexB] = tempSpecies;
  }

  // Fillers replicating C logic
  fillSpeciesGroupsRandom(): void {
    for (let i = 0; i < RANDOMIZER_SPECIES_COUNT; i++) {
      this.groupIndexToSpecies[i] = i;
      this.groupData[i] = this.isSpeciesPermitted(i) ? 0 : GROUP_INVALID;
    }
  }
}

// Cache: ensure we only build once per mode and reuse thereafter
const speciesTablePromiseByMode = new Map<
  RandomizerSpeciesMode,
  SpeciesDataTable
>();

export async function getSpeciesTable(
  mode: RandomizerSpeciesMode,
  options?: { refresh?: boolean },
): Promise<SpeciesDataTable> {
  if (!options?.refresh) {
    const existing = speciesTablePromiseByMode.get(mode);
    if (existing) return existing;
  }
  const speciesById = (await loadSpeciesData()) as unknown as SpeciesInfoEntry[];
  const buildPromise = new SpeciesTable(speciesById).buildSpeciesTable(mode);
  speciesTablePromiseByMode.set(mode, buildPromise);
  return buildPromise;
}

export function clearSpeciesTableCache(mode?: RandomizerSpeciesMode): void {
  if (mode === undefined) {
    speciesTablePromiseByMode.clear();
  } else {
    speciesTablePromiseByMode.delete(mode);
  }
}

// Dev-only sanity checker to validate sorting and reverse index mappings
export function validateSpeciesTable(
  mode: RandomizerSpeciesMode,
  speciesInfo: ReadonlyArray<SpeciesInfoEntry>,
  options: { sampleIds: number[] },
): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const table = new SpeciesTable(speciesInfo).buildSpeciesTable(mode);

  // 1) Verify ascending order (ignoring trailing GROUP_INVALID at the end)
  let last = -Infinity;
  for (let i = 0; i < table.groupData.length; i++) {
    const cur = table.groupData[i];
    if (cur === GROUP_INVALID) break;
    if (cur < last) {
      errors.push(`groupData not ascending at i=${i}: ${cur} < ${last}`);
      break;
    }
    last = cur;
  }

  // 2) Verify mapping: groupData[speciesToGroupIndex[id]] equals that id's expected group value
  const speciesIds = options?.sampleIds ?? [1, 2, 3, 25, 150, 403, 1000, 1200, 1500];
  for (const id of speciesIds) {
    if (id < 0 || id >= RANDOMIZER_SPECIES_COUNT) continue;
    const idx = table.speciesToGroupIndex[id];
    if (idx < 0 || idx >= table.groupData.length) {
      errors.push(`speciesToGroupIndex out of bounds for id=${id}: idx=${idx}`);
      continue;
    }
    const val = table.groupData[idx];
    // Compute expected from speciesInfo and mode
    const info = speciesInfo[id];
    if (id === 403) console.log(info, val)
    const permitted =
      id !== 0 &&
      !!info &&
      info.mode !== RandomizerPerSpeciesMode.MON_RANDOMIZER_INVALID &&
      info.baseStat !== 0;
    let expected: number;
    if (!permitted) {
      expected = GROUP_INVALID;
    } else {
      switch (mode) {
        case RandomizerSpeciesMode.MON_RANDOM_BST:
          expected = info.baseStat;
          break;
        case RandomizerSpeciesMode.MON_RANDOM_LEGEND_AWARE:
          expected = info.isLegendary ? 1 : 0;
          break;
        case RandomizerSpeciesMode.MON_RANDOM:
        default:
          expected = 0;
          break;
      }
    }
    if (val !== expected) {
      errors.push(
        `Mismatch for id=${id}: table has ${val}, expected ${expected}`,
      );
    }

    // Reverse mapping consistency
    const backId = table.groupIndexToSpecies[idx];
    if (backId !== id) {
      errors.push(
        `Reverse map mismatch for id=${id}: groupIndexToSpecies[speciesToGroupIndex[id]] = ${backId}`,
      );
    }
  }

  return { ok: errors.length === 0, errors };
}

// Build a SpeciesDataTable directly from preloaded speciesInfo (DI helper)
export function buildSpeciesTableFromSpecies(
  mode: RandomizerSpeciesMode,
  speciesInfo: ReadonlyArray<SpeciesInfoEntry>,
): SpeciesDataTable {
  return new SpeciesTable(speciesInfo).buildSpeciesTable(mode);
}
