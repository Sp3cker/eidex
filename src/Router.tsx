import Map from "./components/Map/Map";
import { lazy, Suspense } from "react";
import { Route, Router, Switch } from "wouter";
import PokemonModal from "./components/PokemonModal/PokemonModal";
const App = lazy(() => import("./App"));
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

const AppRouter = () => {
  return (
    <div className="">
      <Header />
      <div className="flex min-h-screen justify-center bg-zinc-800">
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
        <PokemonModal />
      </div>
      <Footer />
    </div>
  );
};

export default AppRouter;
