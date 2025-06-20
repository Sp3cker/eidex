import React from "react";
import { useEvolutionData } from "@/hooks/useEvolutionData";
import { pokemonDataMap } from "@/data/pokemon";
import { useUIStore } from "@/stores/uiStore";
import { RootLookupMap, FamilyTreeMap, type FamilyTreeNode } from "../../utils/evolutionFamilies";
import EvolutionChain from "./EvolutionChain";
import BranchingEvolutionTree from "./BranchingEvolutionTree";
import './evolutions.css'
interface EvolutionDetailsProps {
  speciesId: number;
}

const EvolutionDetails: React.FC<EvolutionDetailsProps> = ({ speciesId }) => {
  const selectedPokemon = useUIStore((state) => state.selectedPokemon);
  const setSelectedPokemon = useUIStore((state) => state.setSelectedPokemon);
  const evolutionData = useEvolutionData(speciesId);

  const handlePokemonClick = (id: number) => {
    const pokemon = pokemonDataMap[id.toString()];
    if (pokemon) {
      console.log(`Clicked on ${pokemon.speciesName}`, pokemon);
      setSelectedPokemon(pokemon);
      // You can add navigation logic here if needed
    }
  };

  if (!evolutionData) {
    return (
      <div className="neutral-box rounded-md p-2 text-sm text-gray-200">
        <p>No evolution data found for this Pokémon.</p>
      </div>
    );
  }

  const { parentId, allDescendants } = evolutionData;
  const currentPokemon = pokemonDataMap[speciesId.toString()];
  const parentPokemon = parentId ? pokemonDataMap[parentId.toString()] : null;

  // Determine if we should use branching layout
  const shouldUseBranchingLayout = () => {
    const rootId = RootLookupMap.get(speciesId);
    if (!rootId) return false;
    
    const familyTree = FamilyTreeMap.get(rootId);
    if (!familyTree) return false;
    
    // Check if any node in the tree has multiple children (branching)
    const hasMultipleChildren = (node: FamilyTreeNode): boolean => {
      if (node.children.length > 1) return true;
      return node.children.some((child: FamilyTreeNode) => hasMultipleChildren(child));
    };
    
    return hasMultipleChildren(familyTree);
  };

  const useBranchingLayout = shouldUseBranchingLayout();

  return (
    <div className="neutral-box space-y-4 rounded-md mx-[-1rem] text-sm text-gray-200">
      <h3 className="text-center text-lg font-bold">
        Evolution Chain:{" "}
        {selectedPokemon?.speciesName ||
          currentPokemon?.speciesName ||
          "Unknown"}
      </h3>

      {/* Evolution Chain - Choose layout based on tree structure */}
      <div className="rounded-lg mx-[-2] bg-gray-800/50 overflow-hidden">
        {useBranchingLayout ? (
          <BranchingEvolutionTree
            speciesId={speciesId}
            onPokemonClick={handlePokemonClick}
          />
        ) : (
          <EvolutionChain
            speciesId={speciesId}
            onPokemonClick={handlePokemonClick}
          />
        )}
      </div>

      {/* No evolutions message */}
      {!parentPokemon && allDescendants.length === 0 && (
        <div className="rounded-md border border-gray-400 bg-gray-600/30 p-3 text-center">
          <p className="text-gray-300">
            This Pokémon has no evolution relationships.
          </p>
        </div>
      )}
    </div>
  );
};

export default EvolutionDetails;
