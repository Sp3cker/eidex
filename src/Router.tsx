import { lazy, Suspense } from "react";
import { Route, Router, Switch, useLocation } from "wouter";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const PokemonModal = lazy(
  () => import("./components/PokemonModal/PokemonModal"),
);
const Map = lazy(() => import("./components/Map/Map"));
const App = lazy(() => import("./App"));
import Header from "@/components/ui/Header";
import Footer from "./components/ui/Footer";

const MapComponent = () => (
  <Suspense
    fallback={
      <div className="flex h-full w-full bg-zinc-500">
        <h1>Loading Map!</h1>
      </div>
    }
  >
    <Map />
  </Suspense>
);
const useLocToScroll = () => {
  const [location] = useLocation();
  if (location === "/dex") return "overflow-auto";
  else return "overflow-hidden";
};
const AppRouter = () => {
  const scrollClase = useLocToScroll();
  return (
    <div className="flex h-screen flex-col bg-zinc-800">
      <Header />
      <main className={`flex-1 ${scrollClase}`}>
        <Router>
          <Switch>
            <Route
              path="/dex"
              component={() => (
                <Suspense fallback={<p>Loading...</p>}>
                  <App />
                </Suspense>
              )}
            />
            <Route path="/map/*" component={MapComponent} />
            <Route path="/map" component={MapComponent} />
            <Route path="/roamers" component={MapComponent} />

            <Route path="/" component={MapComponent} />
          </Switch>
        </Router>
      </main>

      <Footer />
      <Suspense fallback={<span/>}>
        <PokemonModal />
      </Suspense>
    </div>
  );
};

export default AppRouter;
