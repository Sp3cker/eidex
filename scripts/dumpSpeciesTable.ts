// Deno script: dump SpeciesTable for MON_RANDOM_BST (mode = 1)
// Usage:
//   deno run -A scripts/dumpSpeciesTable.ts
//   deno run -A scripts/dumpSpeciesTable.ts --mode 1
//   deno run -A scripts/dumpSpeciesTable.ts --pretty
//
// Outputs JSON to stdout containing table arrays if --dump is passed:
// { mode, groupData: number[], groupIndexToSpecies: number[], speciesToGroupIndex: number[] }

import {
  validateSpeciesTable,
  buildSpeciesTableFromSpecies,
  RandomizerSpeciesMode,
  RandomizerPerSpeciesMode,
  type SpeciesInfoEntry,
} from "../src/lib/randomiser/buildSpeciesTable.ts";
function parseArgs(args: string[]) {
  const opts: { mode?: number; pretty?: boolean; dump?: boolean } = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--mode" && i + 1 < args.length) {
      const v = Number(args[++i]);
      if (!Number.isNaN(v)) opts.mode = v;
    } else if (a === "--pretty") {
      opts.pretty = true;
    } else if (a === "--dump") {
      opts.dump = true;
    }
  }
  return opts;
}

const opts = parseArgs(Deno.args ?? []);
const mode = (opts.mode ?? 1) as number; // default to MON_RANDOM_BST
// Read species directly from public/mapsandspecies.json (bypass Vite fetch)
async function readPublicSpecies(): Promise<SpeciesInfoEntry[]> {
  const jsonUrl = new URL("../public/mapsandspecies.json", import.meta.url);
  const raw = await Deno.readTextFile(jsonUrl);
  const data = JSON.parse(raw) as { species?: unknown };
  const src = Array.isArray(data.species) ? (data.species as Record<string, unknown>[]) : [];
  const MAX = 1535;
  const speciesInfo: SpeciesInfoEntry[] = new Array(MAX);
  for (let i = 0; i < src.length; i++) {
    const e = src[i] as Record<string, unknown>;
    const id = typeof e.id === "number" ? (e.id as number) : (e.ID as number);
    if (typeof id === "number" && id >= 0 && id < MAX) {
      speciesInfo[id] = {
        id,
        baseStat: (e.baseStat as number) ?? 0,
        isLegendary: (e.isLegendary as boolean) ?? false,
        mode: ((e.mode as number) ?? RandomizerPerSpeciesMode.MON_RANDOMIZER_NORMAL) as RandomizerPerSpeciesMode,
      };
    }
  }
  for (let i = 0; i < MAX; i++) {
    if (!speciesInfo[i]) {
      speciesInfo[i] = {
        id: i,
        baseStat: 0,
        isLegendary: false,
        mode: RandomizerPerSpeciesMode.MON_RANDOMIZER_INVALID,
      };
    }
  }
  return speciesInfo;
}

const speciesInfo = await readPublicSpecies();
// Validate sorting and reverse indices from the injected species data
const validation = validateSpeciesTable(
  mode as RandomizerSpeciesMode,
  speciesInfo,
  { sampleIds: [1, 2, 3, 25, 150, 403, 1000, 1200, 1500] },
);
console.error(`validateSpeciesTable ok=${validation.ok} errors=${validation.errors.length}`);
if (!validation.ok) for (const e of validation.errors) console.error(e);

// Optionally build and dump the table
if (opts.dump) {
  const table = buildSpeciesTableFromSpecies(mode as RandomizerSpeciesMode, speciesInfo);
  const out = {
    mode,
    groupData: table.groupData,
    groupIndexToSpecies: table.groupIndexToSpecies,
    speciesToGroupIndex: table.speciesToGroupIndex,
  };
  const json = JSON.stringify(out, null, opts.pretty ? 1 : 0);
  console.log(json);
}

if (mode !== RandomizerSpeciesMode.MON_RANDOM_BST) {
  console.warn(
    `Warning: requested mode ${mode}, MON_RANDOM_BST is ${RandomizerSpeciesMode.MON_RANDOM_BST}. Proceeding...`,
  );
}
// Done.
