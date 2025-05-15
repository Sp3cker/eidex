import App from "./App";
import Map from "./components/Map/Map";
import { Route, Router, Switch } from "wouter";
const AppRouter = () => {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-800">
      <Router base="/eidex">
        <Switch>
          <Route path="/" component={Map} />
        </Switch>
      </Router>
    </div>
  );
};

export default AppRouter;
