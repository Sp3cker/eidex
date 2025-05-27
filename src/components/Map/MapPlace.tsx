import useMapStore from "@/stores/useMapStore";
import { useGesture } from "@use-gesture/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  memo,
} from "react";

interface MapPlaceProps {
  item: Record<string, any>;
}

const MapPlace = memo(function MapPlace({ item }: MapPlaceProps) {
  const mapScale = useMapStore((state) => state.mapScale);
  const setSelectedMap = useMapStore((state) => state.setSelectedMap);
  const [isSelectedMap, setIsSelectedMap] = useState(false);
  const ref = useRef<any>(null);

  const handleClick = useCallback(() => {
    const stored = useMapStore.getState().storedCoordinates;
    const myCoords = stored.get(item.id);
    if (myCoords === undefined) {
      console.error("Error getting coords for MapPlace $s", item.id);
      return;
    }

    // setSelectedCoordinates([myCoords[0], myCoords[1] + 100]);
    setSelectedMap(item.id);
  }, []);

  useGesture(
    {
      onMouseDown: () => handleClick(),
      onTouchStart: () => handleClick(),
    },
    { target: ref },
  );

  useEffect(() => {
    const unsub = useMapStore.subscribe((state) => {
      setIsSelectedMap(state.selectedMap === item.id);
    });
    return () => {
      unsub();
    };
  }, [item.id]);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mapRect = document.getElementById("map")?.getBoundingClientRect();
    if (!mapRect) return;
    const centerX = (rect.left + rect.width / 2 - mapRect.left) / mapScale;
    const centerY = (rect.top + rect.height / 2 - mapRect.top) / mapScale;
    // Register coordinates in your global store here
    useMapStore.getState().storedCoordinates.set(item.id, [centerX, centerY]);
  }, [mapScale, item.id]);
  // Render function for individual elements
  const renderElement = (elem: Record<string, any>) => {
    if (elem.type === "g") {
      return (
        <g
          key={elem.id || `g-${Math.random()}`}
          id={elem.id}
          transform={elem.transform}
          className={`${isSelectedMap ? "selected-place" : "touch-none"} stroke-1 transition-all md:stroke-0`}
          ref={ref}
        >
          {elem.children?.map((child: Record<string, any>, index: number) =>
            renderElement({
              ...child,
              id: child.id || `${elem.id}-child-${index}`,
            }),
          )}
        </g>
      );
    }

    if (elem.type === "rect") {
      return (
        <rect
          key={elem.id || `rect-${Math.random()}`}
          id={elem.id}
          x={elem.x}
          y={elem.y}
          width={elem.width}
          height={elem.height}
          {...elem.style}
          className={`${isSelectedMap ? "selected-place fill-emerald-800 stroke-amber-600" : "fill-yellow-900/10 hover:fill-yellow-300/50"} border-yellow transition-colors`}
          ref={ref}
        />
      );
    }

    if (elem.type === "path") {
      return (
        <path
          className={`${isSelectedMap ? " fill-emerald-600" : ""} transition-colors`}
          key={elem.id || `path-${Math.random()}`}
          id={elem.id}
          d={elem.d}
          {...elem.style}
          ref={ref}
        />
      );
    }

    if (elem.type === "circle") {
      return (
        <circle
          key={elem.id || `circle-${Math.random()}`}
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
      return (
        <use
          key={elem.id || `use-${Math.random()}`}
          id={elem.id}
          xlinkHref={elem["xlink:href"]}
          x={elem.x}
          y={elem.y}
          width={elem.width}
          height={elem.height}
          transform={elem.transform}
          ref={ref}
        />
      );
    }

    return null;
  };

  return renderElement(item);
});

export default MapPlace;
