import { memo } from "react";
import { formatMapString, useMapStore } from "@/stores/useMapStore";
import { useSpring, animated } from "react-spring";

// const useMapAndItems = () =>
//   useMapStore((state) => ({
//     selectedMap: state.selectedMapItems,
//     items: state.selectedMapItems,
//   }));

const Dexnav = memo(function Dexnav() {
  const selectedMap = useMapStore((state) => state.selectedMap);
  const selectedMapLabel = useMapStore((state) => state.selectedLevelLabel);
  const items = useMapStore((state) => state.selectedMapItems);
  const [springs] = useSpring(
    {
      // from: { opacity: 0, translateY: (window.innerHeight * 2) / 5 },
      opacity: selectedMap ? 1 : 0,
      translateY: selectedMap ? 0 : (window.innerHeight * 2) / 5,
      config: { mass: 1, damping: 0.2 },
      // config: { duration: 500 },
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
        {items.length === 0 ? (
          <p className="text-center text-xs font-bold text-neutral-700">
            No items found
          </p>
        ) : (
          items.map((item) => (
            <div key={item.name + item.qualifier} className="h-10">
              <p className="cool-font text-xs font-bold">{item.name}</p>
              <p className="leading-4">{item.qualifier ? item.qualifier : 'Received from quest'}</p>
            </div>
          ))
        )}
      </div>
    </animated.nav>
  );
});
export default Dexnav;
