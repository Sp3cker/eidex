import { lazy, Suspense } from "react";
import { Route, Router, Switch, useLocation } from "wouter";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import "./types-colors.css";
const Map = lazy(() => import("./components/Map/Map"));

import Header from "@/components/ui/Header";
import Footer from "./components/ui/Footer";

const MapComponent = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Map />
  </Suspense>
);
const useLocToScroll = () => {
  const [location] = useLocation();
  if (location === "/dex") return "overflow-auto";
  else return "overflow-hidden";
};
const RouterWrapper = () => {
  return (
    <div className="flex h-screen flex-col bg-zinc-800">
      <Header />
      <AppRouter />
      <Footer />
    </div>
  );
};
const AppRouter = () => {
  const scrollClase = useLocToScroll();

  return (
    <main className={`flex-1 ${scrollClase}`}>
      <Router>
        <Switch>
          <Route path="/map/*" component={MapComponent} />
          <Route path="/map" component={MapComponent} />
          <Route path="/roamers" component={MapComponent} />

          <Route path="/*" component={MapComponent} />
        </Switch>
      </Router>
    </main>
  );
};
export default RouterWrapper;
