import useMapStore from "@/stores/useMapStore";
import {
  FullGestureState,
  SharedGestureState,
  useGesture,
} from "@use-gesture/react";
import { useCallback } from "react";

interface MapPlaceProps {
  item: Record<string, any>;
  // map: string; //name of map "MAP_ROUTE111"
  // type: string;
}
const MapPlace = ({ item }: MapPlaceProps) => {
  const setHoveredCoordinates = useMapStore(
    (state) => state.setHoveredCoordinates,
  );
  const setSelectedCoordinates = useMapStore(
    (state) => state.setSelectedCoordinates,
  );
  const mapScale = useMapStore((state) => state.mapScale);
  const setSelectedMap = useMapStore((state) => state.setSelectedMap);
  const selectedMap = useMapStore((state) => state.selectedMap);
  const setHoveredMap = useMapStore((state) => state.setHoveredMap);
  const setDexNavIsOpen = useMapStore((state) => state.setDexnavIsOpen);
  const handleHover = useCallback(
    (
      state: Omit<FullGestureState<"hover">, "event"> & {
        event: PointerEvent;
      },
    ) => {
      const { hovering } = state;
      // const e = state.event as unknown as React.PointerEvent;
      const element = state.event.currentTarget; // The clicked element
      //@ts-ignore
      const rect = element.getBoundingClientRect();
      //@ts-ignore
      const mapRect = document.getElementById("map").getBoundingClientRect(); // Adjust to your map's container
      // const scale = useMapStore.getState().scale || 1; // Get current scale from store or component
      const centerX = (rect.left + rect.width / 2 - mapRect.left) / mapScale;
      const centerY = (rect.top + rect.height / 2 - mapRect.top) / mapScale;
      if (hovering) {
        setHoveredCoordinates([centerX, centerY + 100]);
        setHoveredMap(item.id);
        return;
      }
    },
    [item.id, mapScale],
  );
  const handleClick = (state: SharedGestureState) => {
    //@ts-ignore
    const element = state.event.currentTarget; // The clicked element
    const rect = element.getBoundingClientRect();
    //@ts-ignore
    const mapRect = document.getElementById("map").getBoundingClientRect(); // Adjust to your map's container
    // const scale = useMapStore.getState().scale || 1; // Get current scale from store or component
    const centerX = (rect.left + rect.width / 2 - mapRect.left) / mapScale;
    const centerY = (rect.top + rect.height / 2 - mapRect.top) / mapScale;

    // useMapStore.getState().setSelectedCoordinates([centerX, centerY]);
    setSelectedCoordinates([centerX, centerY + 100]); // Adjust Y offset
    setSelectedMap(item.id);
    setDexNavIsOpen(true);
    if (state) {
      // State isn't passed on desktop.
      handleHover(state as any);
    }
  };
  const bind = useGesture(
    {
      onHover: (state) => handleHover(state),
      onMouseDown: (state) => handleClick(state),
      onTouchStart: (state) => handleClick(state),
    },
    { hover: {} },
  );
  return (
    <g
      key={item.id}
      id={item.id}
      transform={item.transform}
      className={`${selectedMap === item.id ? "selected-place ring" : "touch-none fill-yellow-900/10 hover:fill-yellow-300/50"} border-yellow stroke-yellow-900 stroke-1 transition-all md:stroke-0`}
      {...bind()}
    >
      {item.type === "rect" && (
        <rect
          x={item.x}
          y={item.y}
          width={item.width}
          height={item.height}
          className={`${selectedMap === item.id ? "fill-yellow-800/50" : "fill-yellow-900/10 hover:fill-yellow-300/50"} border-yellow transition-all`}

          // style={item.style}
        />
      )}
      {item.type === "path" && <path d={item.d} style={item.style} />}
      {item.type === "circle" && (
        <circle cx={item.cx} cy={item.cy} r={item.r} style={item.style} />
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
