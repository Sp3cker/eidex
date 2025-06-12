import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { lazy, Suspense, useEffect } from "react";
import "./App.css";
// Lazy load components

const PokemonList = lazy(() => import("./components/PokemonList/PokemonList"));

const DrawerContainer = lazy(() => import("./components/Filter/Drawer"));
// const CreditsButton = lazy(() => import("./components/CreditsButton"));

// Loading fallback component

function App() {
  useEffect(() => {
    document.title = "Emerald Imperium Pokédex";
  });
  return (
    <div className="flex min-h-screen justify-center bg-zinc-800 md:flex-row">
      <div className="shadow-2xl/60 order-2 flex w-full flex-col rounded-lg border-neutral-900/50 md:order-1 md:w-3/4">
        <Suspense fallback={<LoadingSpinner />}>
          <PokemonList />
        </Suspense>
      </div>
      <div className="order-1 md:order-2 md:w-auto md:pl-1">
        <Suspense fallback={<LoadingSpinner />}>
          <DrawerContainer />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
