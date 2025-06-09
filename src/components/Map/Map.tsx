import "./map.css";
import { ErrorBoundary } from "react-error-boundary";
import Search from "./Search";
import NewMap from "./ReactSvg";
import Dexnav from "./ItemsBox";
import MapPlaceInfo from "./MapPlaceInfo";
import MapContainer from "./MapContainer";
import Selecta from "./Selecta";
import "./grid.css";
import useMapStore from "@/stores/useMapStore";
import { lazy, Suspense, useLayoutEffect } from "react";
import Roamers from "./Roamers";
document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener("gesturechange", (e) => e.preventDefault());
const ImageViewer = lazy(() => import("./ImageViewer"));
const Map = () => {
  const setStateFromURL = useMapStore((state) => state.setStateFromURL);

  useLayoutEffect(() => {
    const segments = window.location.pathname.split("/");
    const [_, route, param] = segments;
    if (route && param) {
      // const secondPath = segments.length > 2 ? segments[2] : null;
      setStateFromURL(route, param);
    }
  }, []);
  return (
    <div className="parent">
      <MapContainer>
        <NewMap />
      </MapContainer>
      <Selecta />
      <Search />
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <MapPlaceInfo />
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
    </div>
  );
};

export default Map;
