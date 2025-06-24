import "./map.css";
import { ErrorBoundary } from "react-error-boundary";
import NewMap from "./ReactSvg";
import Dexnav from "./ItemsBox";

import MapContainer from "./MapContainer";
import Selecta from "./MapPlaceInfo/Selecta";
import "./grid.css";
import useMapStore from "@/stores/useMapStore";
import { lazy, Suspense, useLayoutEffect } from "react";
import Roamers from "./Roamers";
import SearchContainer from "./Search/SearchContainer";
import LoadingSpinner from "../ui/LoadingSpinner";
import PlacesList from "./PlacesList";

document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener("gesturechange", (e) => e.preventDefault());
const MapPlaceInfo = lazy(() => import("./MapPlaceInfo/MapPlaceInfo"));
const PokemonModal = lazy(() => import("@/components/PokemonModal"));
const ImageViewer = lazy(() => import("./ImageViewer"));
const Map = () => {
  const setStateFromURL = useMapStore((state) => state.setStateFromURL);
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
        <Suspense fallback={<LoadingSpinner />}>
          <MapPlaceInfo />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Dexnav />
      </ErrorBoundary>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<p>Loading...</p>}>
          <ImageViewer />
        </Suspense>
      </ErrorBoundary>
      <Roamers />
      <ErrorBoundary
        fallback={<div>something went wrong with place list </div>}
      >
        <PlacesList />
      </ErrorBoundary>

      <Suspense fallback={<div className="hidden"></div>}>
        <PokemonModal />
      </Suspense>
    </div>
  );
};

export default Map;
