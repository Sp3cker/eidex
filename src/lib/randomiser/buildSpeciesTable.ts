import { loadSpeciesData } from "./data.ts";
import SpeciesTable, {
  RandomizerSpeciesMode,
  RandomizerPerSpeciesMode,
  SpeciesDataTable,
  SpeciesInfoEntry,
  RANDOMIZER_SPECIES_COUNT,
  GROUP_INVALID,
} from "./SpeciesTable.ts";
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
  const raw = (await loadSpeciesData()) as unknown as ReadonlyArray<
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
        mode: ((e.mode as number) ?? RandomizerPerSpeciesMode.MON_RANDOMIZER_NORMAL) as RandomizerPerSpeciesMode,
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
  const speciesIds = options?.sampleIds ?? [
    1, 2, 3, 25, 150, 403, 1000, 1200, 1500,
  ];
  for (const id of speciesIds) {
    if (id < 0 || id >= RANDOMIZER_SPECIES_COUNT - 1) continue;
    const idx = table.speciesToGroupIndex[id];
    if (idx < 0 || idx >= table.groupData.length) {
      errors.push(`speciesToGroupIndex out of bounds for id=${id}: idx=${idx}`);
      continue;
    }
    const val = table.groupData[idx];
    // Compute expected from speciesInfo and mode
    const info = speciesInfo[id];
    if (id === 403) console.log(info, val);
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
