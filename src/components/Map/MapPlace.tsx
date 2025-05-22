import useMapStore from "@/stores/useMapStore";
import { SharedGestureState, useGesture } from "@use-gesture/react";
import { useEffect, useState } from "react";

interface MapPlaceProps {
  item: Record<string, any>;
}

const MapPlace = ({ item }: MapPlaceProps) => {
  const setSelectedCoordinates = useMapStore(
    (state) => state.setSelectedCoordinates,
  );
  const mapScale = useMapStore((state) => state.mapScale);
  const setSelectedMap = useMapStore((state) => state.setSelectedMap);
  const [isSelectedMap, setIsSelectedMap] = useState(false);
  const setDexNavIsOpen = useMapStore((state) => state.setDexnavIsOpen);

  const handleClick = (state: SharedGestureState) => {
    //@ts-ignore
    const element = state.event?.currentTarget;
    const rect = element.getBoundingClientRect();
    //@ts-ignore
    const mapRect = document.getElementById("map").getBoundingClientRect();
    const centerX = (rect.left + rect.width / 2 - mapRect.left) / mapScale;
    const centerY = (rect.top + rect.height / 2 - mapRect.top) / mapScale;

    setSelectedCoordinates([centerX, centerY + 100]);
    setSelectedMap(item.id);
    setDexNavIsOpen(true);
  };

  const bind = useGesture({
    onMouseDown: (state) => handleClick(state),
    onTouchStart: (state) => handleClick(state),
  });

  useEffect(() => {
    const unsub = useMapStore.subscribe((state) => {
      setIsSelectedMap(state.selectedMap === item.id);
    });
    return () => {
      unsub();
    };
  }, [item.id]);

  return (
    <g
      key={item.id}
      id={item.id}
      transform={item.transform}
      className={`${isSelectedMap ? "selected-place " : "fill-yellow-900/10 hover:fill-yellow-300/50 touch-none"} border-yellow stroke-yellow-900 stroke-1 transition-all md:stroke-0`}
      {...bind()}
    >
      {item.type === "rect" && (
        <rect
          x={item.x}
          y={item.y}
          width={item.width}
          height={item.height}
          {...item.style}
          className={`border-yellow ${isSelectedMap ? " fill-yellow-800/50" : "fill-yellow-900/10 hover:fill-yellow-300/50 touch-none"}`}
        />
      )}
      {item.type === "path" && <path d={item.d} {...item.style} />}
      {item.type === "circle" && (
        <circle cx={item.cx} cy={item.cy} r={item.r} {...item.style} />
      )}
      {item.type === "use" && (
        <use
          xlinkHref={item.xlinkHref}
          x={item.x}
          y={item.y}
          width={item.width}
          height={item.height}
        />
      )}
    </g>
  );
};

export default MapPlace;