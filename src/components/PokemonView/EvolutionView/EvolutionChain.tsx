import React from 'react';
import { type FamilyTreeNode } from '@/utils/evolutionFamilies';
import { RootLookupMap, FamilyTreeMap } from '@/utils/evolutionFamilies';
import EvolutionNodeCard from './EvolutionNodeCard';

interface HorizontalEvolutionChainProps {
  speciesId: number;
  onPokemonClick?: (speciesId: number) => void;
}

const ArrowIcon = () => (
  <div className="flex flex-col items-center justify-center px-3">
    <svg 
      className="w-6 h-6 text-gray-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M13 7l5 5m0 0l-5 5m5-5H6" 
      />
    </svg>
  </div>
);

const HorizontalEvolutionChain: React.FC<HorizontalEvolutionChainProps> = ({ 
  speciesId, 
  onPokemonClick 
}) => {
  // Get the complete family tree starting from the root
  const rootId = RootLookupMap.get(speciesId);
  if (!rootId) return null;

  const familyTree = FamilyTreeMap.get(rootId);
  if (!familyTree) return null;

  // Build a linear chain by traversing from root to all possible endpoints
  const buildLinearChain = (node: FamilyTreeNode): FamilyTreeNode[][] => {
    if (node.children.length === 0) {
      // This is a leaf node, return it as a single-item chain
      return [[node]];
    }

    const allChains: FamilyTreeNode[][] = [];
    for (const child of node.children) {
      const childChains = buildLinearChain(child);
      for (const chain of childChains) {
        allChains.push([node, ...chain]);
      }
    }
    return allChains;
  };

  const allEvolutionChains = buildLinearChain(familyTree);

  // Find the chain that contains our current species
  const currentChain = allEvolutionChains.find(chain => 
    chain.some(node => node.speciesId === speciesId)
  );

  if (!currentChain) return null;

  return (
    <div className="font-calamity flex items-center justify-center overflow-x-auto min-h-[140px] py-6 px-4">
      <div className="flex items-center space-x-4">
        {currentChain.map((node, index) => (
          <React.Fragment key={node.speciesId}>
            <div className="shrink-0">
              <EvolutionNodeCard
                speciesId={node.speciesId}
                type={node.speciesId === speciesId ? 'current' : 'parent'}
                method={node.method}
                title=""
                onPokemonClick={onPokemonClick}
                isCompact={true}
              />
            </div>
            
            {/* Show arrow and method if this is not the last item */}
            {index < currentChain.length - 1 && (
              <div className="flex font-pmknem flex-col items-center justify-center shrink-0">
                <ArrowIcon />
                {currentChain[index + 1].method && (
                  <div className="font-bold text-lg font-pkmnem text-gray-400 text-center max-w-[90px] leading-tight">
                    {currentChain[index + 1].method}
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default HorizontalEvolutionChain;
