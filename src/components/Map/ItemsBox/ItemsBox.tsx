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
      className="dexnav-grid dexnav-z max-h-[70vh] w-full overflow-y-auto rounded-lg border border-gray-200 bg-gradient-to-br from-emerald-50 via-white to-gray-100 p-4 shadow-xl md:w-96"
    >
      <div className="sticky top-0 z-10 flex justify-between bg-gradient-to-br from-emerald-50 via-white to-gray-100 pb-2">
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
