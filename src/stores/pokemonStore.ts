import pokemon from "@/data/speciesData.json";
import { useFilterStore } from "./filterStore";
import { useEffect, useMemo, useState } from "react";
import { filterPokemon } from "@/utils/filterPokemon";
import { Pokemon } from "@/types";
import excludeForms from "@/utils/excludeForms";

const usePokemonStore = (visibleCount: number) => {
  const filters = useFilterStore((state) => state.filters);
  const [visible, setVisibleCount] = useState(10);
  // // Memoized filtered Pokémon list (only updates when filters change)
  const ignoreList: number[] = [1435];

  const filteredPokemon = useMemo(() => {
    return filterPokemon(pokemon as Pokemon[], filters)
      .slice(0, visibleCount)
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
