import { RandomizerSpeciesMode, SpeciesDataTable } from "./SpeciesTable.ts";

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

function getSpeciesGroup(table: SpeciesDataTable, species: number): number {
  if (species < 0 || species >= table.speciesToGroupIndex.length) return 0xffff;
  const groupIndex = table.speciesToGroupIndex[species];
  if (groupIndex < 0 || groupIndex >= table.groupData.length) return 0xffff;
  return table.groupData[groupIndex];
}

export { getGroupRange, getIndicesFromGroupRange, getSpeciesGroup };
