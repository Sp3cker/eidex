import useMapStore from "@/stores/useMapStore";
import { useGesture } from "@use-gesture/react";
import { useCallback, useEffect, useRef, memo, startTransition } from "react";

interface MapPlaceProps {
  item: Record<string, any>;
}
const renderElement = (
  elem: Record<string, any>,
  isSelectedMap: boolean,
  ref: React.Ref<SVGElement> | null = null,
) => {
  if (elem.type === "g") {
    return (
      <g
        key={elem.id || `g-${Math.random()}`}
        id={elem.id}
        transform={elem.transform}
        className={`${isSelectedMap ? "selected-place" : "touch-none"} cursor-pointer stroke-1 transition-all md:stroke-0`}
      >
        {elem.children?.map((child: Record<string, any>, index: number) =>
          renderElement(
            {
              ...child,
              id: child.id || `${elem.id}-child-${index}`,
            },
            isSelectedMap,
            ref,
          ),
        )}
      </g>
    );
  }

  if (elem.type === "rect") {
    return (
      <rect
        key={elem.id}
        id={elem.id}
        x={elem.x}
        y={elem.y}
        width={elem.width}
        height={elem.height}
        {...elem.style}
        className={`${isSelectedMap ? "selected-place fill-emerald-800 stroke-amber-600" : "fill-yellow-900/10 hover:fill-yellow-300/50"} border-yellow cursor-pointer transition-colors`}
        ref={ref}
      />
    );
  }

  if (elem.type === "path") {
    return (
      <path
        className={`${isSelectedMap ? "fill-emerald-600" : ""} cursor-pointer transition-colors`}
        key={elem.id}
        id={elem.id}
        d={elem.d}
        style={elem.style}
        {...elem.style}
        ref={ref}
      />
    );
  }

  if (elem.type === "circle") {
    return (
      <circle
        key={elem.id}
        id={elem.id}
        cx={elem.cx}
        cy={elem.cy}
        r={elem.r}
        {...elem.style}
        ref={ref}
      />
    );
  }

  if (elem.type === "use") {
    return null;
  }

  return null;
};
const MapPlace = memo(
  function MapPlace({ item }: MapPlaceProps) {
    const mapScale = useMapStore((state) => state.mapScale);
    const setSelectedMap = useMapStore((state) => state.setSelectedMap);
    const isSelectedMap = useMapStore((state) => state.selectedMap === item.id);
    const ref = useRef<any>(null);

    const handleClick = useCallback(() => {
      startTransition(() => {
        // const stored = useMapStore.getState().storedCoordinates;
        // const myCoords = stored.get(item.id);
        // if (myCoords === undefined) {
        //   console.error("Error getting coords for MapPlace $s", item.id);
        //   return;
        // }
        setSelectedMap(item.id);
      });
    }, []);

    useGesture(
      {
        onClick: () => handleClick(),
      },
      { target: ref },
    );

    useEffect(() => {
      if (!ref.current) return;
      if (item.id.slice(0, 4).includes("MAP_") === false) return;
      const rect = ref.current.getBoundingClientRect();
      const mapRect = document.getElementById("map")?.getBoundingClientRect();
      if (!mapRect) return;
      const centerX = (rect.left + rect.width / 2 - mapRect.left) / mapScale;
      const centerY = (rect.top + rect.height / 2 - mapRect.top) / mapScale;
      // Register coordinates in your global store here
      useMapStore.getState().storedCoordinates.set(item.id, [centerX, centerY]);
    }, [mapScale, item.id]);
    // Render function for individual elements

    return renderElement(item, isSelectedMap, ref);
  },
  (curr, next) => curr.item.id === next.item.id,
);

export default MapPlace;
