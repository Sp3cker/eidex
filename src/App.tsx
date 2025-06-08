import { lazy, Suspense } from "react";
import "./App.css";

// Lazy load components
const FilterBar = lazy(() => import("./components/Filter/FilterBar"));
const PokemonList = lazy(() => import("./components/PokemonList/PokemonList"));
const PokemonModal = lazy(() => import("./components/PokemonModal/PokemonModal"));
const CreditsButton = lazy(() => import("./components/CreditsButton"));
const ShinySwitch = lazy(() => import("./components/ui/ShinySwitch"));

// Loading fallback component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
    <span className="ml-2 text-gray-400">Loading...</span>
  </div>
);

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
        <Suspense fallback={<LoadingSpinner />}>
          <FilterBar />
        </Suspense>

        {/* Shiny toggle UI */}
        <div className="flex select-none items-center justify-between gap-2 bg-neutral-800/30 px-3 py-2">
          <span className="flex flex-row items-center gap-1">
            <img
              src="shinycharm.png"
              className="h-7 w-7 object-contain"
              alt="Shiny charm"
            />
            <Suspense fallback={<LoadingSpinner />}>
              <ShinySwitch />
            </Suspense>
          </span>
          <Suspense fallback={<LoadingSpinner />}>
            <CreditsButton />
          </Suspense>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <PokemonList />
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <PokemonModal />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
