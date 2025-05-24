import "./map.css";
import { ErrorBoundary } from "react-error-boundary";
import Search from "./Search";
import NewMap from "./ReactSvg";
import Dexnav from "./Dexnax";
import MapPlaceInfo from "./MapPlaceInfo";
import MapContainer from "./MapContainer";
import Selecta from "./Selecta";
document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener("gesturechange", (e) => e.preventDefault());
const Map = () => {
  return (
    <>
      <MapContainer>
        <NewMap />
      </MapContainer>
      <Search />
      <Selecta />
      {/* <Floater /> */}
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <MapPlaceInfo />
      </ErrorBoundary>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Dexnav />
      </ErrorBoundary>
    </>
  );
};

export default Map;
