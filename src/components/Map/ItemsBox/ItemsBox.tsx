import { memo } from "react";
import { formatMapString, useMapStore } from "@/stores/useMapStore";
import { useSpring, animated } from "react-spring";
import ItemsList from "./ItemsList";

const Dexnav = memo(function Dexnav() {
  const selectedMap = useMapStore((state) => state.selectedMap);
  const selectedMapLabel = useMapStore((state) => state.selectedLevelLabel);
  const [springs] = useSpring(
    {
      opacity: selectedMap ? 1 : 0,
      translateY: selectedMap ? 0 : (window.innerHeight * 2) / 5,
      config: { mass: 1, damping: 0.2 },
    },
    [selectedMap],
  );
  return (
    <animated.nav
      style={springs}
      className="map-place-info-textbox-gradient dexnav-grid dexnav-z overflow-scroll rounded-sm py-2 pl-3 shadow-lg"
    >
      <div className="flex justify-between text-white">
        <h1 className="cool-font md:text-md pb-2 text-sm font-bold text-neutral-700">
          {formatMapString(selectedMap || "")}
          {selectedMapLabel && ` - ${selectedMapLabel}`}
        </h1>
      </div>
      <div className="font-pkmnem flex flex-col rounded-sm">
        <ItemsList />
      </div>
    </animated.nav>
  );
});
export default Dexnav;
