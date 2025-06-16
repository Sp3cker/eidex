import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { lazy, Suspense, useEffect } from "react";
import "./App.css";

const PokemonList = lazy(() => import("./components/PokemonList/PokemonList"));
const DrawerContainer = lazy(() => import("./components/Drawer"));
function App() {
  useEffect(() => {
    document.title = "Emerald Imperium Dex";
  });
  return (
    <div className="flex min-h-screen justify-center bg-zinc-800 md:flex-row">
      <div className="shadow-2xl/60 order-2 flex w-full flex-col rounded-lg border-neutral-900/50 md:order-1 md:w-3/5">
        <Suspense fallback={<LoadingSpinner />}>
          <PokemonList />
        </Suspense>
      </div>
      <div className="order-1 md:order-2 md:w-2/5 md:pl-1 bg-gray-800">
        <Suspense fallback={<LoadingSpinner />}>
          <DrawerContainer />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
