import randoSeeds from "../randomize.json" with { type: "json" } 
// import { species } from "../data/species.json" with { type: "json" };
interface SpeciesRandomizations {
  id: number;
  isLegendary?: boolean;
  mode: number;
  baseStat: number;
  // Add other properties as needed
}
//@ts-ignore
const species: SpeciesRandomizations[] = randoSeeds;
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

function leftChildIndex(index: number): number {
  return 2 * index + 1;
}

function swapSpeciesAndGroup(table: SpeciesDataTable, indexA: number, indexB: number): void {
  // Swap group data
  const tempGroup = table.groupData[indexA];
  table.groupData[indexA] = table.groupData[indexB];
  table.groupData[indexB] = tempGroup;
  
  // Swap species
  const tempSpecies = table.groupIndexToSpecies[indexA];
  table.groupIndexToSpecies[indexA] = table.groupIndexToSpecies[indexB];
  table.groupIndexToSpecies[indexB] = tempSpecies;
}

export function buildSpeciesTable(
  mode: RandomizerSpeciesMode,
): SpeciesDataTable {
  const RANDOMIZER_SPECIES_COUNT = species.length;
  if (RANDOMIZER_SPECIES_COUNT !== 1535) { 
    throw new Error(`Expected 1535 species, but got ${RANDOMIZER_SPECIES_COUNT}`);
   }
  // Initialize arrays with exact size
  const table: SpeciesDataTable = {
    groupData: new Array(RANDOMIZER_SPECIES_COUNT),
    groupIndexToSpecies: new Array(RANDOMIZER_SPECIES_COUNT),
    speciesToGroupIndex: new Array(RANDOMIZER_SPECIES_COUNT).fill(0),
  };
  
  // Fill the table based on mode (like C's FillSpeciesGroups functions)
  // Key: Use species array INDEX as the table index, not species ID
  for (let i = 0; i < RANDOMIZER_SPECIES_COUNT; i++) {
    const speciesData = species[i];
    const speciesId = speciesData.id;
    
    // This matches C: groupIndexToSpecies[i] = i (but we use species ID from our data)
    table.groupIndexToSpecies[i] = speciesId;
    
    if (mode === 0) {
      // MON_RANDOM mode - all permitted species get group 0
      if (isSpeciesPermitted(speciesId, mode)) {
        table.groupData[i] = 0;
      } else {
        table.groupData[i] = 0xFFFF; // GROUP_INVALID
      }
    } else {
      // BST mode - calculate BST sum
      let group = 0xFFFF; // GROUP_INVALID
      
      if (isSpeciesPermitted(speciesId, mode)) {
        group = speciesData.baseStat; // BST sum
      }
      
      table.groupData[i] = group;
    }
  }
  
  // Heap sort the table (matches C implementation exactly)
  let start = Math.floor(RANDOMIZER_SPECIES_COUNT / 2);
  let end = RANDOMIZER_SPECIES_COUNT - 1;
  
  while (end > 1) {
    if (start > 0) {
      start = start - 1;
    } else {
      end = end - 1;
      swapSpeciesAndGroup(table, end, 0);
    }
    
    let root = start;
    while (leftChildIndex(root) < end) {
      let child = leftChildIndex(root);
      
      if (child + 1 < end && table.groupData[child] < table.groupData[child + 1]) {
        child = child + 1;
      }
      
      if (table.groupData[root] < table.groupData[child]) {
        swapSpeciesAndGroup(table, root, child);
        root = child;
      } else {
        break;
      }
    }
  }

  // Build the species index reverse lookup (matches C exactly)
  for (let i = 0; i < RANDOMIZER_SPECIES_COUNT; i++) {
    const targetSpeciesId = table.groupIndexToSpecies[i];
    table.speciesToGroupIndex[targetSpeciesId] = i;
  }

  return table;
}
