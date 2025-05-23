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
    const element = state.event.currentTarget;
    const rect = element.getBoundingClientRect();
    const mapRect = document.getElementById("map")?.getBoundingClientRect();
    if (!mapRect) return;
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

  // Render function for individual elements
  const renderElement = (elem: Record<string, any>) => {
    if (elem.type === "g") {
      return (
        <g
          key={elem.id || `g-${Math.random()}`}
          id={elem.id}
          transform={elem.transform}
          className={`${isSelectedMap ? "selected-place ring" : "touch-none"} border-yellow stroke-yellow-900 stroke-1 transition-all md:stroke-0`}
          {...bind()}
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
          className={`${isSelectedMap ? "fill-yellow-800/50" : "fill-yellow-900/10 hover:fill-yellow-300/50"} border-yellow transition-colors`}
          {...bind()}
        />
      );
    }

    if (elem.type === "path") {
      return (
        <path
          key={elem.id || `path-${Math.random()}`}
          id={elem.id}
          d={elem.d}
          {...elem.style}
          {...bind()}
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
          {...bind()}
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
          {...bind()}
        />
      );
    }

    return null;
  };

  return renderElement(item);
};

export default MapPlace;
