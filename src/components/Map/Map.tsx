import "./map.css";
import { ErrorBoundary } from "react-error-boundary";
import HoennMap from "./HoennMap";
import Dexnav from "./Dexnax";
import MapPlaceInfo from "./MapPlaceInfo";
import MapContainer from "./MapContainer";
document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener("gesturechange", (e) => e.preventDefault());
const Map = () => {
  return (
    <>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <MapPlaceInfo />
      </ErrorBoundary>
      <MapContainer>
        <HoennMap />
      </MapContainer>

      {/* <Floater /> */}
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Dexnav />
      </ErrorBoundary>
    </>
  );
};

export default Map;
