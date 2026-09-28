import moveData from "@/data/moveData.json";
import { pokemonDataMap } from "@/data/pokemon";
import { getMoveTypeNames, getTypeCSSColors, getTypeName } from "@/utils/typeInfo";
import adjustTypeForDevice from "./adjustType";

/**
 * Gets move IDs for a Pokémon at a given level.
 * Trainers with a custom moveset use those slots verbatim (0 = MOVE_NONE);
 * others use the last 4 level-up moves learned at or before the level.
 * @param speciesId - The Pokémon's species ID
 * @param level - The level to get moves for
 * @param customMoves - Trainer-defined moveset, if any
 * @returns The custom set verbatim, else up to 4 natural move IDs
 */
export function getPokemonMoveIdsAtLevel(
  speciesId: number,
  level: number,
  customMoves: number[] = [],
): number[] {
  // Custom moveset: the game copies trainer-specified slots verbatim.
  // Return a copy so callers can't mutate the cached trainers.json array.
  if (customMoves.length > 0) {
    return [...customMoves];
  }

  // Levels above 199 are level-cap-scaled; no natural moveset is derivable.
  if (level > 199) {
    return [];
  }

  const pokemon = pokemonDataMap.get(speciesId.toString());
  if (!pokemon?.levelUpMoves) {
    return [];
  }

  // Last 4 level-up moves learned at or before the target level.
  const last4: number[] = [];
  for (const [moveId, learnLevel] of pokemon.levelUpMoves as [
    number,
    number,
  ][]) {
    if (learnLevel <= level) {
      if (last4.length === 4) {
        last4.shift();
      }
      last4.push(moveId);
    }
  }
  return last4;
}
const moveDataMap = new Map(moveData.map((move) => [move.id, move]));
/**
 * Gets detailed move information for an array of move IDs
 * @param moveIds - Array of move IDs to get details for
 * @returns Array of move objects with name, power, type name, and type colors
 */
export function getMoveDetails(moveIds: number[], hpType?: number) {
  if (!moveIds || moveIds.length === 0) {
    return [];
  }


  // Get move data for all moves efficiently
  return moveIds.map((moveId) => {
    const move = moveDataMap.get(moveId);
    // hpType is a typeID; never mutate the shared moveData entry.
    const name =
      move?.name === "Hidden Power" && hpType !== undefined
        ? `Hidden Power (${getTypeName(hpType)})`
        : move?.name || `Move ${moveId}`;
    return {
      id: moveId,
      description: move?.desc ?? "",
      name,
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
