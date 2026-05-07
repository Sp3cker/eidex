import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { spawnSync } from "node:child_process";

const ROOT = new URL("../", import.meta.url);
const ITERATIONS = Number.parseInt(process.env.ITERATIONS ?? "100", 10);
const SEED = Number.parseInt(process.env.SEED ?? "2779096485", 10);
const MAX_SPECIES = Number.parseInt(process.env.MAX_SPECIES ?? "1535", 10);
const STRATEGY = process.env.STRATEGY ?? "all";
const CHILD_MARKER = "__ENCOUNTER_BENCH_RESULT__";

const AREA_KEYS = ["land", "water", "fish", "rock"];

function readJson(path) {
  return JSON.parse(readFileSync(new URL(path, ROOT), "utf8"));
}

const rawEncounters = readJson("src/data/map/encounters.json");
const speciesData = readJson("src/data/speciesData.json");

const pokemonNameBySpecies = new Map(
  Object.values(speciesData).map((pokemon) => [
    pokemon.speciesId,
    pokemon.nameKey,
  ]),
);

function forceGc() {
  globalThis.gc?.();
}

function heapMb() {
  forceGc();
  return process.memoryUsage().heapUsed / 1024 / 1024;
}

function formatMs(value) {
  return `${value.toFixed(2)} ms`;
}

function formatMb(value) {
  return `${value.toFixed(2)} MB`;
}

function time(fn) {
  const start = performance.now();
  const result = fn();
  return {
    result,
    duration: performance.now() - start,
  };
}

function baseLabelToMap(baseLabel) {
  return (
    "MAP_" +
    baseLabel
      .replace(/^g/, "")
      .replace(/([A-Z])/g, "_$1")
      .replace(/^_/, "")
      .toUpperCase()
  );
}

function convertSpecies(mons) {
  return mons.map((mon) => {
    if (mon.min_level === undefined || mon.max_level === undefined) {
      throw new Error("Missing min_level or max_level in encounter data");
    }

    return {
      min_level: mon.min_level,
      max_level: mon.max_level,
      species: mon.species,
      name: pokemonNameBySpecies.get(mon.species) ?? "Unknown",
    };
  });
}

function convertArea(area) {
  if (!area) return undefined;

  return {
    encounter_rate: area.encounter_rate,
    mons: convertSpecies(area.mons),
  };
}

function parseAndConvertSpecies(jsonData) {
  const mainEncounterGroup = jsonData.wild_encounter_groups.find(
    (group) => group.for_maps,
  );

  if (!mainEncounterGroup?.encounters) {
    throw new Error("Could not find main encounters group");
  }

  return mainEncounterGroup.encounters.map((mapObj) => ({
    ...mapObj,
    land: convertArea(mapObj.land),
    water: convertArea(mapObj.water),
    fish: convertArea(mapObj.fish),
    rock: convertArea(mapObj.rock),
  }));
}

function groupEncounterData(flatData) {
  const grouped = {};
  for (const encounter of flatData) {
    const key = encounter.base_label.includes("Underwater")
      ? baseLabelToMap(encounter.base_label.replace(/_/g, ""))
      : baseLabelToMap(encounter.base_label.split("_")[0]);

    grouped[key] ??= [];
    grouped[key].push(encounter);
  }
  return grouped;
}

function buildProcessedDefault() {
  return groupEncounterData(parseAndConvertSpecies(rawEncounters));
}

function pseudoRandomizedSpecies(originalSpecies, mapName, areaIndex, slotIndex) {
  let value = originalSpecies >>> 0;
  value ^= SEED;
  value = Math.imul(value ^ mapName.length, 1664525) >>> 0;
  value = (value + Math.imul(areaIndex + 1, 1013904223) + slotIndex) >>> 0;
  return (value % MAX_SPECIES) + 1;
}

function withRandomizedName(species) {
  return pokemonNameBySpecies.get(species) ?? "Unknown";
}

function randomizeMutable(groupedData) {
  for (const encounterGroups of Object.values(groupedData)) {
    for (const group of encounterGroups) {
      AREA_KEYS.forEach((areaKey, areaIndex) => {
        const areaBlock = group[areaKey];
        if (!areaBlock?.mons?.length) return;

        areaBlock.mons.forEach((mon, slotIndex) => {
          const species = pseudoRandomizedSpecies(
            mon.species,
            group.map,
            areaIndex,
            slotIndex,
          );

          mon.species = species;
          mon.name = withRandomizedName(species);
        });
      });
    }
  }

  return groupedData;
}

function cloneRandomizedArea(areaBlock, mapName, areaIndex) {
  if (!areaBlock) return undefined;

  return {
    encounter_rate: areaBlock.encounter_rate,
    mons: areaBlock.mons.map((mon, slotIndex) => {
      const species = pseudoRandomizedSpecies(
        mon.species,
        mapName,
        areaIndex,
        slotIndex,
      );

      return {
        ...mon,
        species,
        name: withRandomizedName(species),
      };
    }),
  };
}

function randomizeImmutableFull(groupedData) {
  return Object.fromEntries(
    Object.entries(groupedData).map(([baseMapName, encounterGroups]) => [
      baseMapName,
      encounterGroups.map((group) => ({
        ...group,
        land: cloneRandomizedArea(group.land, group.map, 0),
        water: cloneRandomizedArea(group.water, group.map, 1),
        fish: cloneRandomizedArea(group.fish, group.map, 2),
        rock: cloneRandomizedArea(group.rock, group.map, 3),
      })),
    ]),
  );
}

function buildSlotOverrideMap(groupedData) {
  const overrides = new Map();

  for (const [baseMapName, encounterGroups] of Object.entries(groupedData)) {
    for (const group of encounterGroups) {
      AREA_KEYS.forEach((areaKey, areaIndex) => {
        const areaBlock = group[areaKey];
        if (!areaBlock?.mons?.length) return;

        areaBlock.mons.forEach((mon, slotIndex) => {
          const species = pseudoRandomizedSpecies(
            mon.species,
            group.map,
            areaIndex,
            slotIndex,
          );

          overrides.set(
            `${baseMapName}:${group.map}:${areaKey}:${slotIndex}`,
            species,
          );
        });
      });
    }
  }

  return overrides;
}

function createSlotOverrideState() {
  return {
    defaultData: immutableDefault,
    overrides: new Map(),
  };
}

function randomizeSlotOverrideState(state) {
  return {
    defaultData: state.defaultData,
    overrides: buildSlotOverrideMap(state.defaultData),
  };
}

function clearSlotOverrideState(state) {
  state.overrides.clear();
  return {
    defaultData: state.defaultData,
    overrides: state.overrides,
  };
}

function runStrategy(name, createDefault, randomize, clear) {
  forceGc();
  const beforeHeap = heapMb();

  const setup = time(createDefault);
  let state = setup.result;

  forceGc();
  const afterSetupHeap = heapMb();

  let randomizeTotal = 0;
  let clearTotal = 0;
  let retainedRandomizedHeap = 0;
  let retainedClearedHeap = 0;

  for (let i = 0; i < ITERATIONS; i++) {
    const randomized = time(() => randomize(state));
    state = randomized.result;
    randomizeTotal += randomized.duration;

    if (i === 0) {
      retainedRandomizedHeap = heapMb();
    }

    const cleared = time(() => clear(state));
    state = cleared.result;
    clearTotal += cleared.duration;

    if (i === 0) {
      retainedClearedHeap = heapMb();
    }
  }

  forceGc();
  const finalHeap = heapMb();

  return {
    name,
    setupMs: setup.duration,
    randomizeAvgMs: randomizeTotal / ITERATIONS,
    clearAvgMs: clearTotal / ITERATIONS,
    setupHeapMb: afterSetupHeap - beforeHeap,
    randomizedRetainedMb: retainedRandomizedHeap - beforeHeap,
    clearedRetainedMb: retainedClearedHeap - beforeHeap,
    finalHeapMb: finalHeap - beforeHeap,
  };
}

const strategies = [
  {
    id: "mutable",
    name: "mutable rebuild on clear",
    createDefault: () => mutableDefault,
    randomize: randomizeMutable,
    clear: () => mutableDefault,
  },
  {
    id: "immutable",
    name: "immutable full randomized copy",
    createDefault: () => immutableDefault,
    randomize: randomizeImmutableFull,
    clear: () => immutableDefault,
  },
  {
    id: "slot-overrides",
    name: "slot override map",
    createDefault: createSlotOverrideState,
    randomize: randomizeSlotOverrideState,
    clear: clearSlotOverrideState,
  },
  {
    id: "mock-indexeddb-restore",
    name: "mock IndexedDB pristine restore",
    createDefault: readPristineFromMockIndexedDb,
    randomize: randomizeMutable,
    clear: reapplyPristineFromMockIndexedDb,
  },
];

function runSingleStrategy(strategyId) {
  const strategy = strategies.find((candidate) => candidate.id === strategyId);
  if (!strategy) {
    throw new Error(`Unknown strategy: ${strategyId}`);
  }

  return runStrategy(
    strategy.name,
    strategy.createDefault,
    strategy.randomize,
    strategy.clear,
  );
}

function runStrategyProcess(strategyId) {
  const child = spawnSync(
    process.execPath,
    ["--expose-gc", new URL(import.meta.url).pathname],
    {
      cwd: new URL(".", ROOT),
      env: {
        ...process.env,
        STRATEGY: strategyId,
      },
      encoding: "utf8",
    },
  );

  if (child.status !== 0) {
    process.stdout.write(child.stdout);
    process.stderr.write(child.stderr);
    throw new Error(`Benchmark strategy process failed: ${strategyId}`);
  }

  const line = child.stdout
    .split("\n")
    .find((entry) => entry.startsWith(CHILD_MARKER));

  if (!line) {
    process.stdout.write(child.stdout);
    process.stderr.write(child.stderr);
    throw new Error(`Benchmark strategy process produced no result: ${strategyId}`);
  }

  return JSON.parse(line.slice(CHILD_MARKER.length));
}

function printResults(results, processMode) {
  console.log(`Encounter strategy benchmark`);
  console.log(`Iterations: ${ITERATIONS}`);
  console.log(`Process mode: ${processMode}`);
  console.log(`encounters.json bytes: ${readFileSync(new URL("src/data/map/encounters.json", ROOT)).byteLength}`);
  console.log("");

  console.table(
    results.map((result) => ({
      strategy: result.name,
      "setup avg": formatMs(result.setupMs),
      "randomize avg": formatMs(result.randomizeAvgMs),
      "clear avg": formatMs(result.clearAvgMs),
      "setup heap": formatMb(result.setupHeapMb),
      "randomized retained": formatMb(result.randomizedRetainedMb),
      "cleared retained": formatMb(result.clearedRetainedMb),
      "final heap": formatMb(result.finalHeapMb),
    })),
  );

  if (!globalThis.gc) {
    console.log("");
    console.log(
      "Tip: run with node --expose-gc for less noisy heap measurements.",
    );
  }
}

const immutableDefault = buildProcessedDefault();
const mutableDefault = buildProcessedDefault();
const indexedDbPristineSnapshot = buildProcessedDefault();

function readPristineFromMockIndexedDb() {
  return structuredClone(indexedDbPristineSnapshot);
}

function reapplyPristineFromMockIndexedDb() {
  return readPristineFromMockIndexedDb();
}

if (STRATEGY !== "all") {
  console.log(`${CHILD_MARKER}${JSON.stringify(runSingleStrategy(STRATEGY))}`);
} else {
  const results = strategies.map((strategy) => runStrategyProcess(strategy.id));
  printResults(results, "separate V8 process per strategy");
}
