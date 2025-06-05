// eidex/src/components/Map/ItemsBox/ItemsBox.tsx
import { memo, useCallback } from "react";
import { formatMapString, useMapStore } from "@/stores/useMapStore";
import { useSpring, animated, config } from "react-spring";
import ItemsList from "./ItemsList";

const ItemsBox = memo(function ItemsBox() {
  const selectedMap = useMapStore((state) => state.selectedMap);
  const setViewingImage = useMapStore((state) => state.setViewingImage);

  const [springs] = useSpring(
    {
      opacity: selectedMap ? 1 : 0,
      translateY: selectedMap ? 0 : (window.innerHeight * 2) / 5,
      config: { mass: 1, damping: 0.2 },
    },
    [selectedMap],
  );
  const [buttonSpring, buttonSpringApi] = useSpring(
    {
      rotate: -30,

      config: config.gentle,
    },
    [],
  );
  const handleImageClick = () => {
    setViewingImage(true);
  };
  const wiggleIcon = useCallback(() => {
    buttonSpringApi.start({ from: { rotate: 25 }, rotate: -30, reset: true });
  }, []);
  const mapLabel =
    typeof selectedMap === "string" ? formatMapString(selectedMap) : "";

  return (
    <animated.nav
      style={springs}
      className="dexnav-grid dexnav-z max-h-[70vh] w-full overflow-y-auto rounded-lg border border-gray-200 bg-gradient-to-br from-emerald-50 via-white to-gray-100 p-4 shadow-xl md:w-96"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between">
        <h3 className="cool-font md:text-md pb-2 text-sm font-bold text-neutral-700">
          {mapLabel}
        </h3>
        <button
          onMouseEnter={wiggleIcon}
          onClick={handleImageClick}
          className="cursor-pointer rounded-md transition-all hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 active:bg-gray-300"
        >
          <animated.img
            onClick={handleImageClick}
            src="/camera.webp"
            alt={`View image of ${mapLabel}`}
            className="h-10 w-10"
            style={{
              transform: buttonSpring.rotate
                .to({
                  range: [0, 10, 25, 50, -50],
                  output: [0, -4, 4, 2, 0],
                })
                .to((r) => `rotate(${r}deg)`),
            }}
          />
        </button>
      </div>
      <div className="font-pkmnem flex flex-col rounded-sm">
        <ItemsList />
      </div>
    </animated.nav>
  );
});

export default ItemsBox;
