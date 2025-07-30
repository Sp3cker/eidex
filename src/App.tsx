import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { lazy, Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

const PokemonList = lazy(() => import("./components/PokemonList/PokemonList"));
const DrawerContainer = lazy(() => import("./components/Drawer"));
function App() {
  useEffect(() => {
    document.title = "Emerald Imperium Dex";

    // Check if it's time to show the alert (every 3 days)
    const lastAlertTimestamp = localStorage.getItem("lastDexAlertTimestamp");
    const currentTime = Date.now();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

    if (!lastAlertTimestamp || (currentTime - parseInt(lastAlertTimestamp)) >= threeDaysInMs) {
      alert(
        "Hello! Long-story short, don't use this dex. Use the Official Emerald Imperium Dex instead.",
      );
      localStorage.setItem("lastDexAlertTimestamp", currentTime.toString());
    }
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
