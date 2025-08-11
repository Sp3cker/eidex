import {
  randomizerRandSeed,
  randomizerNextRange,
  Sfc32State,
  RANDOMIZER_REASON_WILD_ENCOUNTER,
} from "./sfc32.ts";
import {
  RandomizerSpeciesMode,
  SpeciesDataTable,
  getSpeciesTable,
} from "./buildSpeciesTable.ts";
import { getMapConstant } from "./data.ts";

// Need to import map_constants here and just
// get passed which map we're talking about
// instead of caller needs to know about map_constants.

function getGroupRange(
  originalGroup: number,
  mode: RandomizerSpeciesMode,
): { minGroup: number; maxGroup: number } {
  if (originalGroup === 0xffff) return { minGroup: 0xffff, maxGroup: 0xffff };
  if (mode === RandomizerSpeciesMode.MON_RANDOM_BST) {
    const base = originalGroup * 1024;
    const minScaled = (base - originalGroup * 100) / 1024;
    const maxScaled = (base + originalGroup * 100) / 1024;
    const minGroup = Math.max(0, Math.floor(minScaled));
    const maxGroup = Math.min(0xfffe, Math.floor(maxScaled));
    return { minGroup, maxGroup };
  }
  return { minGroup: originalGroup, maxGroup: originalGroup };
}

function getIndicesFromGroupRange(
  table: SpeciesDataTable,
  minGroup: number,
  maxGroup: number,
): { start: number; end: number } {
  const maxRightBound = table.groupData.length - 1;
  maxGroup = Math.min(0xfffe, maxGroup);
  minGroup = Math.min(0xfffe, minGroup);

  let leftBound = 0;
  let rightBound = table.groupData.length - 1;
  let maxRightBoundAdjusted = maxRightBound;

  // Left-most binary search to find first index >= minGroup
  while (leftBound < rightBound) {
    const index = Math.floor((leftBound + rightBound) / 2);
    const leftFoundGroup = table.groupData[index];
    if (leftFoundGroup < minGroup) {
      leftBound = index + 1;
    } else {
      if (leftFoundGroup > maxGroup) {
        maxRightBoundAdjusted = index;
      }
      rightBound = index;
    }
  }
  const start = leftBound;

  rightBound = maxRightBoundAdjusted;

  // Right-most binary search to find last index <= maxGroup
  while (leftBound < rightBound) {
    const index = Math.floor((leftBound + rightBound) / 2);
    if (table.groupData[index] > maxGroup) {
      rightBound = index;
    } else {
      leftBound = index + 1;
    }
  }
  const end = rightBound - 1;
  return { start, end };
}

async function randomizeMonTableLookup(
  state: Sfc32State,
  mode: RandomizerSpeciesMode,
  species: number,
) {
  const table = await getSpeciesTable(mode);

  if (species >= table.speciesToGroupIndex.length) return species;
  const groupIndex = table.speciesToGroupIndex[species];
  if (groupIndex >= table.groupData.length) return species;
  const originalGroup = table.groupData[groupIndex];
  if (originalGroup === 0xffff) return species;
  const { minGroup, maxGroup } = getGroupRange(originalGroup, mode);
  const { start, end } = getIndicesFromGroupRange(table, minGroup, maxGroup);
  const count = end - start + 1;
  if (count <= 0) return species;
  const randomIndex = randomizerNextRange(state, count);
  const finalIndex = start + randomIndex;
  return table.groupIndexToSpecies[finalIndex];
}

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
