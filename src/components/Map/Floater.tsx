import { useMapStore, formatMapString } from "@/stores/useMapStore";
import { memo, useLayoutEffect, useRef } from "react";
import { animated, to, useSpring } from "@react-spring/web";
import useMousePosition from "@/hooks/useMousePosition";

const Floater = memo(function Floater() {
  const selectedCoordinates = useMapStore((state) => state.selectedCoordinates);
  const mousePosition = useMousePosition();
  const hoveredMap = useMapStore((state) => state.hoveredMap);
  const selectedMap = useMapStore((state) => state.selectedMap);
  const ref = useRef<HTMLDivElement>(null);
  const [{ pos }, api] = useSpring(
    () => ({
      pos: [0, 0],
    }),
    [selectedCoordinates],
  );

  useLayoutEffect(() => {
    if (selectedCoordinates[0]) {
      const mapScale = useMapStore.getState().mapScale;
      const mapOffset = useMapStore.getState().mapOffset;
      const floaterSize = ref?.current?.clientHeight || 0; // Moves floater up so you can click thru it.

      const x = selectedCoordinates[0] - mapOffset[0];
      // const xx = selectedCoordinates[0];
      const y = selectedCoordinates[1] - mapOffset[1] - floaterSize;
      // const { x: mouseX, y: mouseY } = mousePosition;

      api.start({
        pos: [x + (x * mapScale - x), y + (y * mapScale - y)],
      });
    }
  }, [selectedCoordinates, mousePosition, api]);
  return (
    <animated.div
      ref={ref}
      style={{
        touchAction: "none",
        transformOrigin: " left",
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
