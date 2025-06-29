import { useMemo } from "react";
import {
  RootLookupMap,
  FamilyTreeMap,
  type FamilyTreeNode,
} from "../utils/evolutionFamilies";
import { PreEvolutionLookup } from "@/data/pokemon";
// VIBE CODED BULLSHIT
// Tree traversal utilities
const findNodeById = (
  node: FamilyTreeNode,
  targetId: number,
): FamilyTreeNode | null => {
  if (node.speciesId === targetId) return node;
  for (const child of node.children) {
    const found = findNodeById(child, targetId);
    if (found) return found;
  }
  return null;
};

// Recursively collect all descendants (children, grandchildren, etc.)
const getAllDescendants = (
  node: FamilyTreeNode,
): Array<{ node: FamilyTreeNode; depth: number }> => {
  const descendants: Array<{ node: FamilyTreeNode; depth: number }> = [];

  const collectDescendants = (currentNode: FamilyTreeNode, depth: number) => {
    for (const child of currentNode.children) {
      descendants.push({ node: child, depth });
      collectDescendants(child, depth + 1); // Recursively collect grandchildren
    }
  };

  collectDescendants(node, 1); // Start at depth 1 (direct children)
  return descendants;
};

export interface EvolutionData {
  currentNode: FamilyTreeNode;
  parentId?: number;
  allDescendants: Array<{ node: FamilyTreeNode; depth: number }>;
}
// VIBE CODED BULLSHIT

export const useEvolutionData = (speciesId: number): EvolutionData | null => {
  return useMemo(() => {
    // Get the root ID for this species
    const rootId = RootLookupMap.get(speciesId);
    if (!rootId) return null;

    // Get the complete family tree
    const familyTree = FamilyTreeMap.get(rootId);
    if (!familyTree) return null;

    const currentNode = findNodeById(familyTree, speciesId);
    if (!currentNode) return null;

    // Get parent info from PreEvolutionLookup
    const parentInfo = PreEvolutionLookup[speciesId.toString()];
    const parentId = parentInfo?.[0]?.fromSpeciesId;

    // Get all descendants (not just direct children)
    const allDescendants = getAllDescendants(currentNode);

    return {
      currentNode,
      parentId,
      allDescendants,
    };
  }, [speciesId]);
};
