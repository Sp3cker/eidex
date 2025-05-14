import { PokemonCard } from "./PokemonCard";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import { SortBar } from "./PokemonSortBar";
import { useUIStore } from "@/stores/uiStore";
import { useFilterStore } from "@/stores/filterStore";
import usePokemonStore from "@/stores/pokemonStore";

export default function PokemonList() {
  const pokemon = usePokemonStore(10);
  // Get UI State from store
  const isModalOpen = useUIStore((state) => state.isModalOpen);

  //Get filter state from store
  const {
    sortBy,
    sortStat,
    descending,
    setSortBy,
    setSortStat,
    toggleSortDirection,
  } = useFilterStore();

  // Prevent background scroll when modal is open
  useBodyScrollLock(isModalOpen);

  return (
    <div className="flex w-full select-none flex-col items-center">
      <SortBar
        sortBy={sortBy}
        statType={sortStat}
        onChange={(newSortBy, newStatType) => {
          setSortBy(newSortBy);
          setSortStat(newStatType);
        }}
        descending={descending}
        onDirectionChange={toggleSortDirection}
      />
      <div className="w-full">
        {pokemon.map((pokemon) => (
          <PokemonCard key={pokemon.index} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
}
