// eidex/src/components/Map/ItemsBox/ItemsBox.tsx
import { memo } from "react";
import { formatMapString, useMapStore } from "@/stores/useMapStore";
import { useSpring, animated } from "react-spring";
import ItemsList from "./ItemsList";

const ItemsBox = memo(function ItemsBox() {
  const selectedMap = useMapStore((state) => state.selectedMap);
  // const setSelectedImage = useMapStore((state) => state.setSelectedImage);

  const [springs] = useSpring(
    {
      opacity: selectedMap ? 1 : 0,
      translateY: selectedMap ? 0 : (window.innerHeight * 2) / 5,
      config: { mass: 1, damping: 0.2 },
    },
    [selectedMap],
  );

  // const handleImageClick = () => {
  //   if (typeof selectedMap === "string" || selectedMap === null) {
  //     setSelectedImage(selectedMap);
  //   }
  // };

  const mapLabel =
    typeof selectedMap === "string" ? formatMapString(selectedMap) : "";

  return (
    <animated.nav
      style={springs}
      className="dexnav-grid dexnav-z max-h-[70vh] w-full overflow-y-auto rounded-lg border border-gray-200 bg-gradient-to-br from-emerald-50 via-white to-gray-100 p-4 shadow-xl md:w-96"
    >
      <div className="sticky top-0 z-10 flex justify-between">
        <h3 className="cool-font md:text-md pb-2 text-sm font-bold text-neutral-700">
          {mapLabel}
   
        </h3>
      </div>
      {/* <button onClick={handleImageClick}>Image</button> */}
      <div className="font-pkmnem flex flex-col rounded-sm">
        <ItemsList />
      </div>
    </animated.nav>
  );
});

export default ItemsBox;
