import Map from "./components/Map/Map";
import { Route, Router, Switch } from "wouter";
import PokemonModal from "./components/PokemonModal/PokemonModal";
import App from "./App";
const AppRouter = () => {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-800">
      <Router base="/eidex">
        <Switch>
          <Route path="/" component={Map} />
        </Switch>
        <Switch>
          <Route path="/dex" component={App} />
        </Switch>
      </Router>
      <PokemonModal />
    </div>
  );
};

export default AppRouter;
