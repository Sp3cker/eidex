import "./map.css";

import HoennMap from "./HoennMap";
// import Dexnav from "./Dexnax";
import MapPlaceInfo from "./MapPlaceInfo";
import MapContainer from "./MapContainer";
document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener("gesturechange", (e) => e.preventDefault());
const Map = () => {
  return (
    <>
    <MapPlaceInfo />
      <MapContainer>
        <HoennMap />
      </MapContainer>

      {/* <Floater /> */}
      {/* <Dexnav /> */}
    </>
  );
};

export default Map;
