import { species } from "@/data/randomize.json";
// const buildSpeciesTable = (mode: number = 0) => {
export type RandomizerSpeciesMode = number;
// }
export interface SpeciesDataTable {
  // The sorted group values (BSTs)
  groupData: number[];
  // The sorted species IDs, parallel to groupData
  groupIndexToSpecies: number[];
  // A map from species ID -> index in the sorted tables
  speciesToGroupIndex: number[];
}
function isSpeciesPermitted(speciesId: number, mode: number): boolean {
  if (mode === 0) return true; // If no mode is specified, allow all species

  if (speciesId === 0) return false; // SPECIES_NONE
  const speciesInfo = species.find((s) => s.id === speciesId);
  if (!speciesInfo || speciesInfo.isLegendary === true) {
    return false;
  }

  return true;
}

export function buildSpeciesTable(
  mode: RandomizerSpeciesMode,
): SpeciesDataTable {
  const table: SpeciesDataTable = {
    groupData: [],
    groupIndexToSpecies: [],
    // Initialize with zeros, size needs to be based on max species ID
    speciesToGroupIndex: new Array(species.length).fill(0),
  };
  if (mode === 0) {
    for (let i = 1; i < species.length; i++) {
      // For random mode, the "group" is just 0 for all permitted species
      // and the tables are not sorted by a metric.
      table.groupIndexToSpecies[i] = i;
      table.speciesToGroupIndex[i] = i; // Direct 1-to-1 mapping
      if (isSpeciesPermitted(i, mode)) {
        table.groupData[i] = 0;
      } else {
        table.groupData[i] = -1; // Use a sentinel for invalid/unpermitted
      }
    }
    return table;
  }
  const unsortedPairs: { species: number; bst: number }[] = [];
  // 1. Fill the table with species and their BSTs (like FillSpeciesGroupsBST)
  for (let i = 1; i < species.length; i++) {
    let group = 0;
    if (isSpeciesPermitted(i, mode)) {
      group = species[i].baseStat;
    }
    unsortedPairs.push({ species: i, bst: group });
  }

  // 2. Sort the pairs based on BST
  unsortedPairs.sort((a, b) => a.bst - b.bst);

  // 3. Create the final table from the sorted pairs

  unsortedPairs.forEach((pair, index) => {
    table.groupData[index] = pair.bst;
    table.groupIndexToSpecies[index] = pair.species;
  });

  // 4. Build the reverse lookup map (speciesToGroupIndex)
  table.groupIndexToSpecies.forEach((speciesId, sortedIndex) => {
    if (speciesId !== 0) {
      table.speciesToGroupIndex[speciesId] = sortedIndex;
    }
  });

  return table;
}
