import React from "react";
import { pokemonDataMap } from "@/data/pokemon";
import EvolutionSprite from "./EvolutionSprite"; // Your existing sprite component

interface EvolutionNodeCardProps {
  speciesId: number;
  type: "current" | "parent" | "descendant";
  method?: string;
  depth?: number;
  title: string;
  onPokemonClick?: (speciesId: number) => void;
  isCompact?: boolean;
}

const EvolutionNodeCard: React.FC<EvolutionNodeCardProps> = ({
  speciesId,
  type,
  method,
  depth = 0,
  title,
  onPokemonClick,
  isCompact = false,
}) => {
  const pokemon = pokemonDataMap[speciesId.toString()];

  if (!pokemon) {
    return (
      <div className="rounded-md border border-gray-400 bg-gray-600/30 p-3 text-center">
        <p className="text-gray-300">Unknown Pokémon (ID: {speciesId})</p>
      </div>
    );
  }

  const handleClick = () => {
    onPokemonClick?.(speciesId);
  };

  // Color scheme based on type
  const colorSchemes = {
    current: {
      bg: "bg-blue-600/30",
      border: "border-blue-400",
      titleColor: "text-blue-200",
      badgeColor: "bg-blue-500",
    },
    parent: {
      bg: "bg-green-600/30",
      border: "border-green-400",
      titleColor: "text-green-200",
      badgeColor: "bg-green-500",
    },
    descendant: {
      bg: "bg-purple-600/30",
      border: "border-purple-400",
      titleColor: "text-purple-200",
      badgeColor: "bg-purple-500",
    },
  };

  const colors = colorSchemes[type];
  const indentLevel = type === "descendant" ? depth - 1 : 0;

  if (isCompact) {
    // Compact horizontal layout
    return (
      <div className="flex flex-col items-center space-y-1 p-2">
        <EvolutionSprite pokemon={pokemon} onClick={handleClick} />
        <div className="text-center">
          <div className="text-xs font-medium text-gray-200">
            {pokemon.speciesName}
          </div>
          {type === 'current' && (
            <div className="text-xs text-blue-300 mt-1">Current</div>
          )}
        </div>
      </div>
    );
  }

  // Regular vertical layout
  return (
    <div
      className={`${colors.bg} rounded-md p-3 border ${colors.border}`}
    >
      {title && (
        <h4 className={`font-semibold ${colors.titleColor} mb-2`}>{title}</h4>
      )}
      <div 
        className="flex flex-col items-center space-y-2"
        style={{ marginLeft: `${indentLevel * 20}px` }}
      >
        <Evolution pokemon={pokemon} onClick={handleClick} />

        <div className="text-center">
          <span
            className={`${colors.badgeColor} rounded px-3 py-1 font-medium text-white`}
          >
            {depth > 1 && type === "descendant" && "└─ "}
            ID: {speciesId} - {pokemon.speciesName}
          </span>
          {method && (
            <div className={`text-xs ${colors.titleColor} mt-1`}>
              Method: {method}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvolutionNodeCard;
