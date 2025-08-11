import "./map.css";
import { ErrorBoundary } from "react-error-boundary";
import NewMap from "./ReactSvg";

import MapContainer from "./MapContainer";
import Selecta from "./MapPlaceInfo/Selecta";
import "./grid.css";
import useMapStore from "@/stores/useMapStore";
import { lazy, Suspense, useLayoutEffect } from "react";

import SearchContainer from "./Search/SearchContainer";
import PlacesList from "./PlacesList";
import { useMapHotkeys } from "@/hooks/useHotkeys";
import { useRandomizerStore } from "@/stores/randomizerStore";
document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener("gesturechange", (e) => e.preventDefault());
const MapPlaceInfo = lazy(() => import("./MapPlaceInfo/MapPlaceInfo"));
const PokemonModal = lazy(() => import("@/components/PokemonModal"));
const ImageViewer = lazy(() => import("./ImageViewer"));
const Dexnav = lazy(() => import("./ItemsBox"));
const Map = () => {
  const {} = useRandomizerStore(); // this is here to ensure the store is initialized
  const setStateFromURL = useMapStore((state) => state.setStateFromURL);
  useMapHotkeys();
  useLayoutEffect(() => {
    const segments = window.location.pathname.split("/");
    const [, route, param] = segments;
    if (route && param) {
      setStateFromURL(route, param);
    }
  }, []);

  return (
    <div className="parent">
      <MapContainer>
        <NewMap />
      </MapContainer>
      <SearchContainer />
      <Selecta />
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense>
          <MapPlaceInfo />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense>
          <Dexnav />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense>
          <ImageViewer />
        </Suspense>
      </ErrorBoundary>
      {/* <Roamers /> */}
      <ErrorBoundary
        fallback={<div>something went wrong with place list </div>}
      >
        <Suspense>
          <PlacesList />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary
        fallback={<div>something went wrong with trainers list </div>}
      ></ErrorBoundary>

      <Suspense>
        <PokemonModal />
      </Suspense>
    </div>
  );
};

export default Map;
