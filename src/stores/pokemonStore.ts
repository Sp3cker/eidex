import { pokemonData as pokemon } from "@/data/pokemon";
import { useFilterStore } from "./filterStore";
import { useMemo } from "react";
import { filterPokemon } from "@/utils/filterPokemon";
import { Pokemon } from "@/types";
import excludeForms from "@/utils/excludeForms";
import { getTypeColor, getTypeNamesArr } from "@/utils/typeInfo";
export const getPokemonBySpecies = (species: string): any => {
  const mon = pokemon.find((p) => p.nameKey === species);
  if (!mon) {
    console.error("Mon not found", species);
    return null;
  }
  const type = getTypeNamesArr(mon.types);
  const color = getTypeColor(mon.types[0]);
  return {
    ...mon,
    type,
    color,
  };
};
const usePokemonStore = () => {
  const filters = useFilterStore();

  // // Memoized filtered Pokémon list (only updates when filters change)
  const ignoreList: number[] = [1435, 1522];

  const filteredPokemon = useMemo(() => {
    const mon = filterPokemon(pokemon as Pokemon[], filters).filter(
      (pokemon) =>
        !ignoreList.includes(pokemon.speciesId) && !excludeForms(pokemon.forms),
    );

    if (filters.sortDirection === "up") {
      mon.reverse();
    }

    return mon;
  }, [
    filters.name,
    filters.moveId,
    filters.abilityId,
    filters.id,
    filters.typeId,
    filters.chosenStat,
    filters.statType,
    filters.isStatMax,
    filters.sortBy,
    filters.sortStat,
    filters.sortDirection,
    filters.moveSource,
    filters.nameValue,
  ]);

  return filteredPokemon;
};

export default usePokemonStore;
