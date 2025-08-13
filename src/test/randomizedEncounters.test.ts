import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the randomizer engine to avoid depending on IndexedDB/fetch and to make results deterministic
vi.mock("@/lib/randomiser/engine.ts", () => {
  return {
    randomizeSpeciesForSlot: vi.fn(
      (
        originalSpecies: number,
        mode: number,
        trainerSeed: number,
        _levelId: string,
        areaEnum: number,
        slotIndex: number,
      ) => {
        const maxSpecies = 1535; // SPECIES_NONE excluded
        const delta = ((trainerSeed >>> 0) & 0xff) + (mode >>> 0) + areaEnum + slotIndex;
        let result = (originalSpecies + delta) % maxSpecies;
        if (result === 0) result = 1;
        return result;
      },
    ),
  };
});

// Helper to load a fresh encounterStore instance per test
async function loadFreshEncounterStore() {
  await vi.resetModules();
  const mod = await import("../data/map/encounters.ts");
  return mod.encounterStore as typeof mod.encounterStore;
}

type AreaKey = "land" | "water" | "fish" | "rock";
type EncounterArea = { encounter_rate: number; mons: Array<{ species: number }> };
type EncounterGroupView = {
  base_label: string;
  map: string;
  land?: EncounterArea;
  water?: EncounterArea;
  fish?: EncounterArea;
  rock?: EncounterArea;
};

async function getRandomizedEncountersForMap(
  trainerId: number,
  baseLabel: string,
  mode: number,
) {
  const store = await loadFreshEncounterStore();
  // Capture original before randomization for comparison
  const originalData = store.getEncounterData() as Record<string, { base_label: string; [k: string]: unknown }[]>;
  // Find the key that contains the requested baseLabel
  let mapKey: string | undefined;
  for (const [key, groups] of Object.entries(originalData)) {
    if (groups.some((g: { base_label: string }) => g.base_label === baseLabel)) {
      mapKey = key;
      break;
    }
  }
  if (!mapKey) throw new Error(`Base label not found: ${baseLabel}`);

  // Randomize in-place
  await store.randomizeEncountersWithTrainerSeed(trainerId, mode);

  // Return only the groups for the requested baseLabel
  const groups = (store.getEncounterData() as Record<string, { base_label: string; [k: string]: unknown }[]>)[mapKey] ?? [];
  return groups.filter((g) => g.base_label === baseLabel);
}

describe("randomized encounters by map", () => {
  let baseLabelSample: string;

  beforeEach(async () => {
    const store = await loadFreshEncounterStore();
    const data = store.getEncounterData();
    const firstKey = Object.keys(data)[0];
    const firstGroups = data[firstKey];
    baseLabelSample = firstGroups[0].base_label;
  });

  it("returns randomized encounters for a given baseLabel and trainerId", async () => {
    const trainerId = 0x12345678;
    const mode = 1; // MON_RANDOM_BST (but mocked engine just uses the number)

    const store = await loadFreshEncounterStore();
    // Capture original species for that baseLabel
    const originalData = store.getEncounterData() as Record<string, { base_label: string; [k: string]: unknown }[]>;
    let originalGroups: { base_label: string; [k: string]: unknown }[] = [];
    for (const [, groups] of Object.entries(originalData)) {
      if (groups.some((g: { base_label: string }) => g.base_label === baseLabelSample)) {
        originalGroups = groups.filter((g: { base_label: string }) => g.base_label === baseLabelSample);
        break;
      }
    }

    const randomizedGroups = await getRandomizedEncountersForMap(
      trainerId,
      baseLabelSample,
      mode,
    );

    expect(randomizedGroups.length).toBeGreaterThan(0);
    // Ensure at least one species changed in any available area
    const AREA_KEYS: AreaKey[] = ["land", "water", "fish", "rock"];
    let changed = false;
    outer: for (let i = 0; i < randomizedGroups.length; i++) {
      const r = randomizedGroups[i] as { [k in AreaKey]?: { mons?: Array<{ species: number }> } };
      const o = originalGroups[i] as { [k in AreaKey]?: { mons?: Array<{ species: number }> } };
      for (const k of AREA_KEYS) {
        if (r[k]?.mons?.length && o[k]?.mons?.length) {
          for (let s = 0; s < Math.min(r[k]!.mons!.length, o[k]!.mons!.length); s++) {
            if (r[k]!.mons![s].species !== o[k]!.mons![s].species) {
              changed = true;
              break outer;
            }
          }
        }
      }
    }
    expect(changed).toBe(true);
  });

  it("produces different results for different randomization modes", async (vi) => {
    const normalRandID = -1716499767;
    const bstRandId = -494598815;
    const modeA = 0;
    const modeB = 2;

    const resultA = await getRandomizedEncountersForMap(
      normalRandID,
      baseLabelSample,
      modeA,
    );
    const resultB = await getRandomizedEncountersForMap(
      bstRandId,
      baseLabelSample,
      modeB,
    );

    // Compare first available slot species across any area in first group
    const firstSpecies = (g?: EncounterGroupView) =>
      g?.land?.mons?.[0]?.species ??
      g?.water?.mons?.[0]?.species ??
      g?.fish?.mons?.[0]?.species ??
      g?.rock?.mons?.[0]?.species;

    const firstA = firstSpecies(resultA[0] as EncounterGroupView);
    const firstB = firstSpecies(resultB[0] as EncounterGroupView);
    console.log(firstA, firstB);
    expect(firstA).toBeTypeOf("number");
    expect(firstB).toBeTypeOf("number");
    expect(firstA).not.toEqual(firstB);
  });
});


