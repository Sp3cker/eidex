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
  const opts: { mode?: number; pretty?: boolean; dump?: boolean; assoc?: boolean; csv?: boolean } = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--mode" && i + 1 < args.length) {
      const v = Number(args[++i]);
      if (!Number.isNaN(v)) opts.mode = v;
    } else if (a === "--pretty") {
      opts.pretty = true;
    } else if (a === "--dump") {
      opts.dump = true;
    } else if (a === "--assoc" || a === "--associations") {
      opts.assoc = true;
    } else if (a === "--csv") {
      opts.csv = true;
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

// Build once (used by dump and associations)
const table = buildSpeciesTableFromSpecies(mode as RandomizerSpeciesMode, speciesInfo);

// Optionally dump raw arrays
if (opts.dump) {
  const out = {
    mode,
    groupData: table.groupData,
    groupIndexToSpecies: table.groupIndexToSpecies,
    speciesToGroupIndex: table.speciesToGroupIndex,
  };
  const json = JSON.stringify(out, null, opts.pretty ? 1 : 0);
  console.log(json);
}

// Optionally emit per-species association triples to verify BST indexing
if (opts.assoc) {
  type AssocRow = {
    species: number;
    groupDataIndex: number; // equals speciesToGroupIndex[species]
    speciesToGroupIndex: number;
    groupIndexToSpecies: number; // should equal species
    bstFromTable: number; // table.groupData[groupDataIndex]
    bstFromSource: number; // speciesInfo[species].baseStat
    bstMatches: boolean;
    consistentMapping: boolean; // groupIndexToSpecies[groupDataIndex] === species
  };
  const rows: AssocRow[] = [];
  for (let s = 0; s < speciesInfo.length; s++) {
    const gdi = table.speciesToGroupIndex[s];
    const gis = gdi >= 0 && gdi < table.groupIndexToSpecies.length
      ? table.groupIndexToSpecies[gdi]
      : -1;
    const bstTable = gdi >= 0 && gdi < table.groupData.length ? table.groupData[gdi] : -1;
    const bstSource = speciesInfo[s]?.baseStat ?? 0;
    rows.push({
      species: s,
      groupDataIndex: gdi,
      speciesToGroupIndex: gdi,
      groupIndexToSpecies: gis,
      bstFromTable: bstTable,
      bstFromSource: bstSource,
      bstMatches: bstTable === bstSource,
      consistentMapping: gis === s,
    });
  }

  if (opts.csv) {
    console.log(
      [
        "species",
        "groupDataIndex",
        "speciesToGroupIndex",
        "groupIndexToSpecies",
        "bstFromTable",
        "bstFromSource",
        "bstMatches",
        "consistentMapping",
      ].join(","),
    );
    for (const r of rows) {
      console.log(
        [
          r.species,
          r.groupDataIndex,
          r.speciesToGroupIndex,
          r.groupIndexToSpecies,
          r.bstFromTable,
          r.bstFromSource,
          r.bstMatches ? 1 : 0,
          r.consistentMapping ? 1 : 0,
        ].join(","),
      );
    }
  } else {
    const json = JSON.stringify(rows, null, opts.pretty ? 1 : 0);
    console.log(json);
  }
}

if (mode !== RandomizerSpeciesMode.MON_RANDOM_BST) {
  console.warn(
    `Warning: requested mode ${mode}, MON_RANDOM_BST is ${RandomizerSpeciesMode.MON_RANDOM_BST}. Proceeding...`,
  );
}
// Done.
