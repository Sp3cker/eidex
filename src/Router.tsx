import Map from "./components/Map/Map";
import { Route, Router, Switch } from "wouter";
import PokemonModal from "./components/PokemonModal/PokemonModal";
import App from "./App";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
const AppRouter = () => {
  return (
    <div className="flex flex-col ">
      <Header />
      <div className="flex min-h-screen justify-center bg-zinc-800">
        <Router base={import.meta.env.BASE_PATH || "/"}>
          <Switch>
            <Route path="/" component={Map} />
          </Switch>
          <Switch>
            <Route path="/dex" component={App} />
          </Switch>
        </Router>
        <PokemonModal />
      </div>
      <Footer />
    </div>
  );
};

export default AppRouter;
