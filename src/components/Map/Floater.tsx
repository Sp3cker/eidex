import { useMapStore, formatMapString } from "@/stores/useMapStore";
import { memo, useLayoutEffect, useRef } from "react";
import { animated, to, useSpring } from "@react-spring/web";
import useMousePosition from "@/hooks/useMousePosition";

const Floater = memo(function Floater() {
  const selectedCoordinates = useMapStore((state) => state.selectedCoordinates);
  const hoveredCoordinates = useMapStore(state => state.hoveredCoordinates);
  const hoveredMap = useMapStore((state) => state.hoveredMap);
  const selectedMap = useMapStore((state) => state.selectedMap);
  const centerOffset = useMapStore((state) => state.mapOffset || [0, 0]);
  const mapScale = useMapStore((state) => state.mapScale || 1);
  const ref = useRef<HTMLDivElement>(null);
  const [{ pos }, api] = useSpring(
    () => ({
      pos: [0, 0],
    }),
    [],
  );

  useLayoutEffect(() => {
    if (hoveredCoordinates[0]) {
      const floaterSize = ref?.current?.clientHeight || 0; // Moves floater up so you can click thru it.
      const centerX = hoveredCoordinates[0]
      const centerY = hoveredCoordinates[1]
      api.start({
        pos: [centerX, centerY],
      });
    }
  }, [hoveredCoordinates]);
  return (
    <animated.div
      ref={ref}
      style={{
        touchAction: "none",
        transform: to([pos], ([x, y]) => {
          return `translate3d(${x}px, ${y}px, 0px)`;
        }),
      }}
      className="floater rounded-sm bg-gray-300 p-1 text-sm font-bold opacity-75 md:h-[5vh]"
    >
      {formatMapString(hoveredMap || selectedMap || "")}
    </animated.div>
  );
});

export default Floater;
