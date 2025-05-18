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
  const setSelectedCoordinates = useMapStore(
    (state) => state.setSelectedCoordinates,
  );
  const mapScale = useMapStore((state) => state.mapScale);
  const setSelectedMap = useMapStore((state) => state.setSelectedMap);
  const selectedMap = useMapStore((state) => state.selectedMap);
  const setHoveredMap = useMapStore((state) => state.setHoveredMap);
  const handleHover = useCallback(
    (
      state: Omit<FullGestureState<"hover">, "event"> & {
        event: PointerEvent;
      },
    ) => {
      const { hovering } = state;
      if (hovering) {
        const e = state.event as unknown as React.PointerEvent;

        //@ts-ignore
        const childRect = e.currentTarget.getBoundingClientRect();
        setSelectedCoordinates([childRect.x, childRect.y]);
        setHoveredMap(item.id);
      }
    },
    [item.id, mapScale],
  );
  const handleClick = (state?: SharedGestureState) => {
    setSelectedMap(item.id);
    if (state) {
      // State isn't passed on desktop.
      handleHover(state as any);
    }
  };
  const bind = useGesture(
    {
      onHover: (state) => handleHover(state),
      onMouseDown: () => handleClick(),
      onTouchStart: (state) => handleClick(state),
    },
    { hover: {} },
  );
  return (
    <g
      key={item.id}
      id={item.id}
      transform={item.transform}
      className={`${selectedMap === item.id ? "fill-neutral-800" : "touch-none fill-yellow-900/10 hover:fill-yellow-300/50"} border-yellow transition-all`}
      {...bind()}
    >
      {item.type === "rect" && (
        <rect
          x={item.x}
          y={item.y}
          width={item.width}
          height={item.height}
          className={`${selectedMap === item.id ? "fill-amber-800/50" : "fill-yellow-900/10 hover:fill-yellow-300/50"} border-yellow transition-all`}

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
