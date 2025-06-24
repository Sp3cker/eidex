// eidex/src/components/Map/ItemsBox/ItemsBox.tsx
import { memo } from "react";
import { useMapStore } from "@/stores/useMapStore";
import { formatMapString } from "@/utils/formatMapString";
import { useSpring, animated } from "@react-spring/web";
import ItemsList from "./ItemsList";
import CameraIcon from "./CameraIcon";
const ItemsBox = memo(function ItemsBox() {
  const selectedMap = useMapStore((state) => state.selectedMap);
  const setViewingImage = useMapStore((state) => state.setViewingImage);
  const togglePlacesList = useMapStore((state) => state.togglePlacesList);
  const show = useMapStore((state) => {
    return state.selectedMap !== null && state.dragging === false;
  });
  const [springs] = useSpring(
    {
      opacity: selectedMap ? 1 : 0,
      translateY: show ? 0 : (window.innerHeight * 2) / 5,
      config: { mass: 1, damping: 0.2 },
    },
    [show, selectedMap],
  );

  const mapLabel =
    typeof selectedMap === "string" ? formatMapString(selectedMap) : "";

  return (
    <animated.nav
      style={springs}
      className="dexnav-grid dexnav-z max-h-[70vh] w-full overflow-y-auto rounded-lg border border-gray-200 bg-gradient-to-br from-emerald-50 via-white to-gray-100 p-4 shadow-xl md:w-96"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between">
        <span className="flex flex-row gap-3 justify-center items-center">
          <button
            className="bg-fieldset px-1 rounded-sm"
            onClick={togglePlacesList}
            title="Click to view all locations"
          >
            »
          </button>
          <h2 className="cool-font md:text-md cursor-pointer text-left text-sm font-bold text-neutral-700 transition-colors hover:text-blue-600">
            {mapLabel}
          </h2>
        </span>
        <CameraIcon mapLabel={mapLabel} setViewingImage={setViewingImage} />
      </div>
      <div className="font-pkmnem flex flex-col rounded-sm">
        <ItemsList />
      </div>
    </animated.nav>
  );
});

export default ItemsBox;
