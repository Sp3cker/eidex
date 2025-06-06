import { lazy, Suspense } from "react";
import { Route, Router, Switch } from "wouter";
import PokemonModal from "./components/PokemonModal/PokemonModal";
const Map = lazy(() => import("./components/Map/Map"));
const App = lazy(() => import("./App"));
import Header from "./components/ui/Header";
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
const AppRouter = () => {
  const basePath = import.meta.env.BASE_PATH || "/";

  return (
    <div className="flex h-screen flex-col bg-zinc-800">
      <Header />
      <div className="flex-2 overflow-auto">
        <Router base={basePath}>
          <Switch>
            <Route path="/" component={MapComponent} />
            <Route path="/map/*" component={MapComponent} />

            <Route
              path="/dex"
              component={() => (
                <Suspense fallback={<p>Loading...</p>}>
                  <App />
                </Suspense>
              )}
            />
          </Switch>
        </Router>
      </div>

      <Footer />
      <PokemonModal />
    </div>
  );
};

export default AppRouter;
