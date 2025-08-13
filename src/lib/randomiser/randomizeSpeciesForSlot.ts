import { getMapConstant } from "./data.ts";
import {
  RANDOMIZER_REASON_WILD_ENCOUNTER,
  randomizerRandSeed,
} from "./sfc32.ts";
import { randomizeMonTableLookup } from "./engine.ts";
import type { RandomizerSpeciesMode } from "./SpeciesTable.ts";

async function randomizeSpeciesForSlot(
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

export { randomizeSpeciesForSlot };
