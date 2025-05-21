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
  const items = useMapStore((state) => state.selectedMapItems);
  const dexNavIsOpen = useMapStore((state) => state.dexNavIsOpen);
  const [springs] = useSpring(
    {
      // from: { opacity: 0, translateY: (window.innerHeight * 2) / 5 },
      opacity: dexNavIsOpen ? 1 : 0,
      translateY: dexNavIsOpen ? 0 : (window.innerHeight * 2) / 5,
      // config: { duration: 500 },
    },
    [dexNavIsOpen],
  );
  return (
    <animated.nav
      style={springs}
      className="map-place-info-textbox-gradient w-70 fixed bottom-7 left-10 right-10 h-2/5 overflow-scroll rounded-sm py-2 pl-3 shadow-lg"
    >
      <div className="flex justify-between text-white">
        <h1 className="cool-font pb-2 font-bold text-neutral-700">
          {formatMapString(selectedMap || "")}
        </h1>
      </div>
      <div className="font-pkmnem flex flex-col rounded-sm">
        {items.length === 0 && (
          <p className="text-center text-xs font-bold text-neutral-700">
            No items found
          </p>
        )}
        {items.map((item) => (
          <div key={item.name} className="h-10">
            <p className="cool-font text-xs font-bold">{item.name}</p>
            <p className="leading-4">{item.qualifier}</p>
          </div>
        ))}
      </div>
    </animated.nav>
  );
});
export default Dexnav;
