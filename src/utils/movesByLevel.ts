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
  // If mon's level is above 199, we cannot determine proper moves, and assume
  // custom moves are provided.
  if (level > 199 || customMoves.length === 4) {
    return customMoves;
  }

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
      if (naturalMoves.length >= 4) {
        naturalMoves.splice(0, 1).push({ moveId, level: learnLevel });
      }
      naturalMoves.push({ moveId, level: learnLevel });
    }
  }

  // Sort by learning level to maintain chronological order
  naturalMoves.sort((a, b) => a.level - b.level);

  // Calculate final move IDs based on custom moves

  if (customMoves.length === 0) {
    // No custom moves - use natural moves (last 4)
    return naturalMoves.slice(-4).map((move) => move.moveId);
  }
  // First, remove custom moves that are already in natural moves
  for (let i = 0; i < customMoves.length; i++) {
    const customMoveId = customMoves[i];
    if (naturalMoves.some((move) => move.moveId === customMoveId)) {
      customMoves.splice(i, 1); // Remove from custom moves
    }
  }
  // customMoves is now just moves that mon shoulnt have at this lvl.
  // We replace the earliest natural moves with custom moves
  if (customMoves.length === 0) {
    return naturalMoves.map((m) => m.moveId); // No custom moves to add, return natural moves
  }
  return naturalMoves
    .map((m) => m.moveId)
    .splice(0, customMoves.length, ...customMoves);
  // Has custom moves - replace oldest natural moves
  // const naturalMovesToKeep = Math.max(0, 4 - customMoves.length);
  // const keptNaturalMoves = naturalMoves.slice(-naturalMovesToKeep);

  // Add kept natural moves
  // finalMoveIds = keptNaturalMoves.map((move) => move.moveId);

  // Add custom moves (limit to 4 total)
  // const customMovesToAdd = customMoves.slice(0, 4 - finalMoveIds.length);
  // finalMoveIds.push(...customMovesToAdd);

  // return finalMoveIds.slice(0, 4);
}
const hiddenPwTypes = [
  "Fighting",
  "Flying",
  "Poison",
  "Ground",
  "Rock",
  "Bug",
  "Ghost",
  "Steel",
];
/**
 * Gets detailed move information for an array of move IDs
 * @param moveIds - Array of move IDs to get details for
 * @returns Array of move objects with name, power, type name, and type colors
 */
export function getMoveDetails(moveIds: number[], hpType?: number) {
  if (!moveIds || moveIds.length === 0) {
    return [];
  }

  // Create a map of move data for efficient lookup
  const moveDataMap = moveData.reduce(
    (acc, move) => {
      acc[move.id] = move;

      return acc;
    },
    {} as Record<number, (typeof moveData)[0]>,
  );

  // Get move data for all moves efficiently
  return moveIds.map((moveId) => {
    const move = moveDataMap[moveId];
    if (move.name === "Hidden Power" && hpType !== undefined) {
      debugger;
      move.name = `Hidden Power (${hiddenPwTypes[hpType - 1]})`;
    }
    return {
      id: moveId,
      description: move?.desc ?? "",
      name: move?.name || `Move ${moveId}`,
      power: move?.power || 0,
      typeName: move?.type
        ? adjustTypeForDevice(getMoveTypeNames([move.type])[0], "sm")
        : "Normal",
      typeColors: move?.type
        ? getTypeCSSColors([move.type])[0]
        : getTypeCSSColors([1])[0], // Default to Normal type colors
    };
  });
}
