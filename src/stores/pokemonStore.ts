import pokemon from "@/data/speciesData.json";
import { useFilterStore } from "./filterStore";
import { useEffect, useMemo, useState } from "react";
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
const usePokemonStore = (visibleCount = 10) => {
  const filters = useFilterStore();
  
  const [visible, setVisibleCount] = useState(visibleCount);
  // // Memoized filtered Pokémon list (only updates when filters change)
  const ignoreList: number[] = [1435];

  const filteredPokemon = useMemo(() => {
    return filterPokemon(pokemon as Pokemon[], filters)
      .slice(0, visible)
      .filter(
        (pokemon) =>
          !ignoreList.includes(pokemon.index) && !excludeForms(pokemon.forms),
      );
  }, [filters]);
  //Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        setVisibleCount((prev) => Math.min(prev + 10, pokemon.length));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pokemon.length]);

  return filteredPokemon;
};

export default usePokemonStore;
