
import { pokemonDataMap, PreEvolutionLookup, EvoMap } from "@/data/pokemon";

export interface FamilyTreeNode {
  speciesId: number;
  children: FamilyTreeNode[];
  method?: string; // How this node was evolved into
}

function findEvolutionRoot(speciesId: number): number {
  let currentId = speciesId;
  while (PreEvolutionLookup[currentId.toString()]) {
    currentId = PreEvolutionLookup[currentId.toString()][0].fromSpeciesId;
  }
  return currentId;
}

/**
 Recursively builds a LEAN evolution tree from a ancestor mon.
 */
function buildLeanTreeFromRoot(rootId: number): FamilyTreeNode {

  // Create the lean node with only essential data
  const node: FamilyTreeNode = {
    speciesId: rootId,
    children: [],
  };

  const childrenToProcess = EvoMap.get(rootId);
  if (childrenToProcess) {
    for (const child of childrenToProcess) {
      const childNode = buildLeanTreeFromRoot(child.childId); // Recursive call
      childNode.method = child.method;
      node.children.push(childNode);
    }
  }
  return node;
}

// --- Main creation function now produces a lean tree ---

function createPrecomputedFamilyMaps(): {
  rootLookupMap: Map<number, number>;
  familyTreeMap: Map<number, FamilyTreeNode>; // <-- This now stores the lean tree
} {
  const rootLookupMap = new Map<number, number>();
  const familyTreeMap = new Map<number, FamilyTreeNode>();
  const processedRoots = new Set<number>();

  for (const [, pokemon] of pokemonDataMap) {
    const rootId = findEvolutionRoot(pokemon.speciesId);
    rootLookupMap.set(pokemon.speciesId, rootId);

    if (!processedRoots.has(rootId)) {
      // Build the lean tree instead of the heavy one
      const leanTree = buildLeanTreeFromRoot(rootId);
      familyTreeMap.set(rootId, leanTree);
      processedRoots.add(rootId);
    }
  }

  return { rootLookupMap, familyTreeMap };
}

// --- Final Exports ---
const { rootLookupMap, familyTreeMap } = createPrecomputedFamilyMaps();

/**
 * Map from any speciesId to the ID of its family's root ancestor.
 * e.g., get(Charizard) -> Charmander's ID
 */
export const RootLookupMap = rootLookupMap;

/**
 * Map from a root ancestor's ID to its complete, pre-built, and LEAN family tree.
 * e.g., get(Charmander's ID) -> { speciesId: 4, speciesName: "Charmander", ... }
 */
export const FamilyTreeMap = familyTreeMap;
