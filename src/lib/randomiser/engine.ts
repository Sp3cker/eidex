import { randomizerNextRange, Sfc32State } from "./sfc32.ts";
import { getSpeciesTable } from "./buildSpeciesTable.ts";
import { RandomizerSpeciesMode } from "./SpeciesTable.ts";
import {
  getSpeciesGroup,
  getIndicesFromGroupRange,
  getGroupRange,
} from "./groupRanges.ts";

// Need to import map_constants here and just
// get passed which map we're talking about
// instead of caller needs to know about map_constants.

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
