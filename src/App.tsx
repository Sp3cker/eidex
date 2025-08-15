import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { lazy, Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
const root = document.documentElement;
const measure = () => {
  const w = window.innerWidth - root.clientWidth; // body scrollbar width
  if (w > 0) root.style.setProperty("--scrollbar-size", `${w}px`);
};
measure();
window.addEventListener("resize", measure, { passive: true });
const PokemonList = lazy(() => import("./components/PokemonList/PokemonList"));
const DrawerContainer = lazy(() => import("./components/Drawer"));
function App() {
  useEffect(() => {
    document.title = "Emerald Imperium Dex";
  });
  return (
    <div className="flex justify-center bg-zinc-800 md:flex-row">
      <div className="shadow-2xl/60 flex w-full flex-col rounded-lg border-neutral-900/50 md:w-1/2">
        <Suspense fallback={<LoadingSpinner />}>
          <PokemonList />
        </Suspense>
      </div>
      <div className="bg-gray-800 md:w-1/2 md:pl-1">
        <Suspense fallback={<LoadingSpinner />}>
          <ErrorBoundary fallback={<p>whups</p>}>
            <DrawerContainer />
          </ErrorBoundary>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
