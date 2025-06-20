import React from 'react';
import { type FamilyTreeNode } from '@/utils/evolutionFamilies';
import { RootLookupMap, FamilyTreeMap } from '@/utils/evolutionFamilies';
import EvolutionNodeCard from './EvolutionNodeCard';

interface BranchingEvolutionTreeProps {
  speciesId: number;
  onPokemonClick?: (speciesId: number) => void;
}

// Component for rendering a single evolution stage with branching
interface EvolutionStageProps {
  node: FamilyTreeNode;
  currentSpeciesId: number;
  onPokemonClick?: (speciesId: number) => void;
  level: number;
}

const EvolutionStage: React.FC<EvolutionStageProps> = ({ 
  node, 
  currentSpeciesId, 
  onPokemonClick,
  level 
}) => {
  const hasChildren = node.children.length > 0;
  const isCurrent = node.speciesId === currentSpeciesId;
  
  // Calculate spacing for children - each child needs space for the card + method text
  const childSpacing = 140; // Space per child (card width + padding)
  const totalChildrenWidth = hasChildren ? node.children.length * childSpacing : 0;
  
  return (
    <div className="flex flex-col items-center">
      {/* The parent node */}
      <div className="relative mb-8">
        <EvolutionNodeCard
          speciesId={node.speciesId}
          type={isCurrent ? 'current' : level === 0 ? 'parent' : 'descendant'}
          title=""
          onPokemonClick={onPokemonClick}
          isCompact={true}
        />
        
        {/* Connection lines for children */}
        {hasChildren && (
          <div className="absolute" style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}>
            {/* Vertical line down from parent */}
            <div 
              className="evolution-connection-line mx-auto"
              style={{ 
                width: '2px', 
                height: '30px' 
              }} 
            />
            
            {/* Horizontal line spanning all children positions */}
            <div 
              className="evolution-connection-line relative"
              style={{ 
                height: '2px',
                width: `${Math.max(totalChildrenWidth - childSpacing + 80, 80)}px`,
                left: '50%',
                transform: 'translateX(-50%)'
              }} 
            >
              {/* Vertical lines down to each child */}
              {node.children.map((_, index) => {
                const childPosition = (index - (node.children.length - 1) / 2) * childSpacing;
                return (
                  <div
                    key={index}
                    className="absolute evolution-connection-line"
                    style={{
                      width: '2px',
                      height: '30px',
                      top: '0px',
                      left: `calc(50% + ${childPosition}px)`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Children level */}
      {hasChildren && (
        <div 
          className="flex items-start justify-center min-w-max"
          style={{ 
            gap: `${childSpacing - 80}px`,
            width: `${Math.max(totalChildrenWidth, 300)}px`
          }}
        >
          {node.children.map((child) => (
            <div key={child.speciesId} className="flex flex-col items-center flex-shrink-0" style={{ width: '80px' }}>
              {/* Evolution method positioned between line and card */}
              {child.method && (
                <div className="text-xs text-gray-400 text-center mb-3 px-1 leading-tight min-h-[32px] flex items-center justify-center evolution-method-badge rounded px-2 py-1">
                  <span className="break-words font-medium">{child.method}</span>
                </div>
              )}
              
              {/* Child node - recursively render if it has its own children */}
              <EvolutionStage
                node={child}
                currentSpeciesId={currentSpeciesId}
                onPokemonClick={onPokemonClick}
                level={level + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BranchingEvolutionTree: React.FC<BranchingEvolutionTreeProps> = ({ 
  speciesId, 
  onPokemonClick 
}) => {
  // Get the complete family tree starting from the root
  const rootId = RootLookupMap.get(speciesId);
  if (!rootId) return null;

  const familyTree = FamilyTreeMap.get(rootId);
  if (!familyTree) return null;

  return (
    <div className="evolution-tree-container overflow-x-auto overflow-y-visible py-8 px-1">
      <div className="flex flex-col items-center justify-start min-w-max">
        <EvolutionStage
          node={familyTree}
          currentSpeciesId={speciesId}
          onPokemonClick={onPokemonClick}
          level={0}
        />
      </div>
    </div>
  );
};

export default BranchingEvolutionTree;
