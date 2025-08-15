import { lazy, Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import MapContainer from "./MapContainer";
import Selecta from "./MapPlaceInfo/Selecta";
import useMapStore from "@/stores/useMapStore";

import PlacesList from "./PlacesList";
import { useMapHotkeys } from "@/hooks/useHotkeys";
import { useRandomizerStore } from "@/stores/randomizerStore";
import LoadingSpinner from "../ui/LoadingSpinner";
import "./map.css";
import "./grid.css";
document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener("gesturechange", (e) => e.preventDefault());
const MapPlaceInfo = lazy(() => import("./MapPlaceInfo/MapPlaceInfo"));

const ImageViewer = lazy(() => import("./ImageViewer"));
const Dexnav = lazy(() => import("./ItemsBox"));
const NewMap = lazy(() => import("./ReactSvg"));
const Search = lazy(() => import("./Search/SearchContainer"));
const Map = () => {
  const {} = useRandomizerStore(); // this is here to ensure the store is initialized
  const setStateFromURL = useMapStore((state) => state.setStateFromURL);
  useMapHotkeys();
  useEffect(() => {
    const segments = window.location.pathname.split("/");
    const [, route, param] = segments;
    if (route && param) {
      setStateFromURL(route, param);
    }
  }, []);

  return (
    <div className="parent">
      <MapContainer>
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <LoadingSpinner />
            </div>
          }
        >
          <NewMap />
        </Suspense>
      </MapContainer>
      <Suspense>
        <Search />
      </Suspense>

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
    </div>
  );
};

export default Map;
