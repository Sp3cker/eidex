import "./map.css";
import { ErrorBoundary } from "react-error-boundary";
import Search from "./Search";
import NewMap from "./ReactSvg";
import Dexnav from "./ItemsBox";
import MapPlaceInfo from "./MapPlaceInfo";
import MapContainer from "./MapContainer";
import Selecta from "./Selecta";
import "./grid.css";
document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener("gesturechange", (e) => e.preventDefault());
const Map = () => {
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
    </div>
  );
};

export default Map;
