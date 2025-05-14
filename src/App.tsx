import { useMemo } from "react";
import "./App.css";
import FilterBar from "./components/Filter/FilterBar";
import PokemonList from "./components/PokemonList/PokemonList";
import PokemonModal from "./components/PokemonModal/PokemonModal";
import CreditsButton from "./components/CreditsButton";

import ShinySwitch from "./components/ui/ShinySwitch";

function App() {
  // Get filter state from Zustand store
  // const { filters } = useFilterStore();

  // // Get UI state from Zustand store
  // const { isShiny, toggleShiny, selectedPokemon, isModalOpen } =
  //   useUIStore();

  // // Memoized filtered Pokémon list (only updates when filters change)
  // const filteredPokemon = useMemo(() => {
  //   return filterPokemon(pokemonData as Pokemon[], filters);
  // }, [filters]);

  return (
    <div className="flex min-h-screen justify-center bg-zinc-800">
      <div className="border-1 shadow-2xl/60 flex w-full max-w-3xl flex-col rounded-lg border-neutral-900/50">
        <FilterBar />

        {/* Shiny toggle UI */}
        <div className="flex select-none items-center justify-between gap-2 bg-neutral-800/30 px-3 py-2">
          <span className="flex flex-row items-center gap-1">
            <img
              src="shinycharm.png"
              className="h-7 w-7 object-contain"
              alt="Shiny charm"
            />
            <ShinySwitch />
          </span>
          <CreditsButton />
        </div>

        <PokemonList />

        <PokemonModal />
      </div>
    </div>
  );
}

export default App;
