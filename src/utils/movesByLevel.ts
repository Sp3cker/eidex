import moveData from "@/data/moveData.json";
import { pokemonDataMap } from "@/data/pokemon";
import { getMoveTypeNames, getTypeCSSColors } from "@/utils/typeInfo";
import adjustTypeForDevice from "./adjustType";

/**
 * Gets move IDs for a Pokémon at a given level with optional custom moves
 * @param speciesId - The Pokémon's species ID
 * @param level - The level to get moves for
 * @param customMoves - Optional array of custom move IDs to replace oldest natural moves
 * @returns Array of move IDs (up to 4 moves)
 */
export function getPokemonMoveIdsAtLevel(
  speciesId: number,
  level: number,
  customMoves: number[] = [],
): number[] {
  const pokemon = pokemonDataMap.get(speciesId.toString());
  if (!pokemon?.levelUpMoves) {
    return [];
  }

  // Get natural moves learned at or before the target level
  const naturalMoves: Array<{ moveId: number; level: number }> = [];

  for (const [moveId, learnLevel] of pokemon.levelUpMoves as [
    number,
    number,
  ][]) {
    if (learnLevel <= level) {
      naturalMoves.push({ moveId, level: learnLevel });
    }
  }

  // Sort by learning level to maintain chronological order
  naturalMoves.sort((a, b) => a.level - b.level);

  // Calculate final move IDs based on custom moves
  let finalMoveIds: number[] = [];

  if (customMoves.length === 0) {
    // No custom moves - use natural moves (last 4)
    finalMoveIds = naturalMoves.slice(-4).map((move) => move.moveId);
  } else {
    // Has custom moves - replace oldest natural moves
    const naturalMovesToKeep = Math.max(0, 4 - customMoves.length);
    const keptNaturalMoves = naturalMoves.slice(-naturalMovesToKeep);

    // Add kept natural moves
    finalMoveIds = keptNaturalMoves.map((move) => move.moveId);

    // Add custom moves (limit to 4 total)
    const customMovesToAdd = customMoves.slice(0, 4 - finalMoveIds.length);
    finalMoveIds.push(...customMovesToAdd);
  }

  return finalMoveIds.slice(0, 4);
}

/**
 * Gets detailed move information for an array of move IDs
 * @param moveIds - Array of move IDs to get details for
 * @returns Array of move objects with name, power, type name, and type colors
 */
export function getMoveDetails(moveIds: number[]): Array<{
  id: number;
  description: string;
  name: string;
  power: number;
  typeName: string;
  typeColors: string;
}> {
  if (!moveIds || moveIds.length === 0) {
    return [];
  }

  // Get move data for all moves efficiently
  const moveTypeIds = moveIds.map((moveId) => {
    const move = moveData.find((m) => m.id === moveId);
    return move?.type || 1; // Default to Normal type
  });

  // Get type names and colors efficiently for all moves at once
  const typeNames = getMoveTypeNames(moveTypeIds).map((tn) =>
    adjustTypeForDevice(tn, "sm"),
  );
  const typeColors = getTypeCSSColors(moveTypeIds);

  // Build final result with all move data
  return moveIds.map((moveId, index) => {
    const move = moveData.find((m) => m.id === moveId);

    return {
      id: moveId,
      description: move?.description ?? "",
      name: move?.name || `Move ${moveId}`,
      power: move?.power || 0,
      typeName: typeNames[index] || "Normal",
      typeColors: typeColors[index],
    };
  });
}
