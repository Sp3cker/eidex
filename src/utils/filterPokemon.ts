import { FilterOptions, Pokemon } from "../types";
// import { getMoveData, getTMMove, getTutorMove } from "./moveData";

function matchesNameFilter(pokemon: Pokemon, name?: string): boolean {
  return name
    ? pokemon.nameKey.toLowerCase().includes(name.toLowerCase())
    : true;
}

function matchesTypeFilter(
  pokemon: Pokemon,
  typeId?: [number, number] | undefined,
): boolean {
  if (!typeId) return true;

  // If it's a tuple, check if Pokemon has both types
  if (Array.isArray(typeId)) {
    const [type1, type2] = typeId;
    if (type2 === undefined) {
      return pokemon.types.includes(type1);
    }
    return pokemon.types.includes(type1) && pokemon.types.includes(type2);
  }
  return true;
}

function matchesStatFilter(
  pokemon: Pokemon,
  chosenStat?: number,
  statType?: string,
  isStatMax?: boolean,
): boolean {
  if (chosenStat === undefined) return true;

  if (statType === "bst" || !statType) {
    const bst = pokemon.stats.reduce((a, b) => a + b, 0);
    return isStatMax ? bst <= chosenStat : bst >= chosenStat;
  }

  const statIndex: Record<string, number> = {
    hp: 0,
    attack: 1,
    defense: 2,
    speed: 3,
    spAtk: 4,
    spDef: 5,
  };
  const idx = statIndex[statType];
  if (idx == undefined) {
    return true;
  }
  return isStatMax
    ? pokemon.stats[idx] <= chosenStat
    : pokemon.stats[idx] >= chosenStat;
}

function matchesAbilityFilter(
  pokemon: Pokemon,
  abilityId: number | null,
): boolean {
  if (!abilityId) return true;
  return pokemon.abilities.some((id) => id === abilityId);
}

// function matchesLevelupMove(pokemon: Pokemon, move?: string): boolean {
//   if (!move) return true;
//   // Each entry in levelupMoves is [moveId, level]
//   return pokemon.levelupMoves.some(([moveId]) => {
//     const moveData = getMoveData(moveId);
//     return moveData?.name.toLowerCase().includes(move.toLowerCase());
//   });
// }

// function matchesTmMove(pokemon: Pokemon, move?: string): boolean {
//   if (!move) return true;
//   if (!pokemon.tmMoves) return false;
//   return pokemon.tmMoves.some((tmIndex) => {
//     const tmMove = getTMMove(tmIndex);
//     return tmMove?.name.toLowerCase().includes(move.toLowerCase());
//   });
// }

// function matchesTutorMove(pokemon: Pokemon, move?: string): boolean {
//   if (!move) return true;
//   if (!pokemon.tutorMoves) return false;
//   return pokemon.tutorMoves.some((tutorIndex) => {
//     const tutorMove = getTutorMove(tutorIndex);
//     return tutorMove?.name.toLowerCase().includes(move.toLowerCase());
//   });
// }

function matchesMove(
  pokemon: Pokemon,
  moveId?: number,
  source?: "all" | "levelup" | "tm" | "egg",
): boolean {
  if (!moveId) return true;

  // Helper to check TM moves
  const hasTmMove = pokemon.tmMoves
    ? pokemon.tmMoves.some((id) => id === moveId)
    : false;
  const hasEggMove = pokemon.eggMoves
    ? pokemon.eggMoves.some((id) => id === moveId)
    : false;

  // Helper to check Tutor moves

  switch (source) {
    case "levelup":
      return pokemon.levelUpMoves.some(([id]) => id === moveId);
    case "tm":
      return hasTmMove;
    case "egg":
      return hasEggMove;
    case "all":
    default:
      return pokemon.levelUpMoves.some(([id]) => id === moveId) || hasTmMove;
  }
}

function sortPokemon(
  filteredPokemon: Pokemon[],
  sortBy: string = "dexId",
): Pokemon[] {
  return [...filteredPokemon].sort((a, b) => {
    let result = 0;
    switch (sortBy) {
      case "name":
        result = a.nameKey.localeCompare(b.nameKey);
        break;
      case "index":
        result = a.dexId - b.dexId;
        break;
      case "dexId":
        if (a.dexId !== b.dexId) result = a.dexId - b.dexId;
        else result = a.dexId - b.dexId;
        break;

      default:
        if (!sortBy || sortBy === "bst") {
          const bstA = a.stats.reduce((x, y) => x + y, 0);
          const bstB = b.stats.reduce((x, y) => x + y, 0);
          result = bstA - bstB;
        } else {
          const statIndex: Record<string, number> = {
            hp: 0,
            attack: 1,
            defense: 2,
            speed: 3,
            spAtk: 4,
            spDef: 5,
          };
          const idx = statIndex[sortBy];
          result = (a.stats[idx] ?? 0) - (b.stats[idx] ?? 0);
        }
        break;
    }
    return result;
  });
}

export function filterPokemon(
  pokemons: Pokemon[],
  filters: FilterOptions,
): Pokemon[] {
  const filtered = pokemons.filter(
    (pokemon) =>
      matchesNameFilter(pokemon, filters.name) &&
      matchesTypeFilter(pokemon, filters.typeId) &&
      matchesStatFilter(
        pokemon,
        filters.chosenStat,
        filters.statType,
        filters.isStatMax,
      ) &&
      matchesAbilityFilter(pokemon, filters.abilityId) &&
      matchesMove(pokemon, filters.moveId, filters.moveSource),
  );

  // Default to true if filters.ascending is undefined
  return sortPokemon(filtered, filters.sortBy);
}
