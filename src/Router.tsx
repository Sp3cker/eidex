import Map from "./components/Map/Map";
import { lazy, Suspense } from "react";
import { Route, Router, Switch } from "wouter";
import PokemonModal from "./components/PokemonModal/PokemonModal";
const App = lazy(() => import("./App"));
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

const AppRouter = () => {
  return (
    <div className="flex h-screen flex-col bg-zinc-800">
      <Header />
      <div className="flex-2 overflow-auto">
        <Router base={import.meta.env.BASE_PATH || "/"}>
          <Switch>
            <Route path="/" component={Map} />
          </Switch>
          <Switch>
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
