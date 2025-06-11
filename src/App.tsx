import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { lazy, Suspense, useEffect } from "react";
import "./App.css";
import DrawerContainer from "./components/Filter/Drawer";

// Lazy load components

const PokemonList = lazy(() => import("./components/PokemonList/PokemonList"));
const PokemonModal = lazy(
  () => import("./components/PokemonModal/PokemonModal"),
);
// const CreditsButton = lazy(() => import("./components/CreditsButton"));

// Loading fallback component

function App() {
  useEffect(() => {
    document.title = "Emerald Imperium Pokédex";
  });
  return (
    <div className="flex min-h-screen justify-center md:flex-row bg-zinc-800">
        {/* Shiny toggle UI */}
        <div className="shadow-2xl/60 order-2 flex w-full flex-col rounded-lg border-neutral-900/50 md:order-1 md:w-3/4">
          <Suspense fallback={<LoadingSpinner />}>
            <PokemonList />
          </Suspense>
        </div>
        <div className="order-1 w-full md:order-2 md:w-auto md:pl-1">
          <DrawerContainer />
          
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <PokemonModal />
        </Suspense>

    </div>
  );
}

export default App;
