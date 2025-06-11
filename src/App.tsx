import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { lazy, Suspense, useEffect } from "react";
import "./App.css";

// Lazy load components
const FilterBar = lazy(() => import("./components/Filter/FilterBar"));
const PokemonList = lazy(() => import("./components/PokemonList/PokemonList"));
const PokemonModal = lazy(
  () => import("./components/PokemonModal/PokemonModal"),
);
// const CreditsButton = lazy(() => import("./components/CreditsButton"));

// Loading fallback component

function App() {
  useEffect(() => {
    document.title = 'Emerald Imperium Pokédex'
  })
  return (
    <div className="flex min-h-screen justify-center bg-zinc-800">
      <div className="border-1 shadow-2xl/60 flex w-full max-w-3xl flex-col rounded-lg border-neutral-900/50">
        <Suspense fallback={<LoadingSpinner />}>
          <FilterBar />
        </Suspense>

        {/* Shiny toggle UI */}
        <div className="flex select-none items-center justify-between gap-2 bg-neutral-800/30 px-3 py-2">
          {/* <Suspense fallback={<LoadingSpinner />}>
            <CreditsButton />
          </Suspense> */}
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
