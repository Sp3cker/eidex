import { useMapStore } from "@/stores/useMapStore";
import { memo, useLayoutEffect, useRef } from "react";
import { animated, to, useSpring } from "@react-spring/web";
import { formatMapString } from "@/utils/formatMapString";

const Floater = memo(function Floater() {
  const hoveredCoordinates = useMapStore((state) => state.hoveredCoordinates);
  const hoveredMap = useMapStore((state) => state.hoveredMap);
  const selectedMap = useMapStore((state) => state.selectedMap);

  const ref = useRef<HTMLDivElement>(null);
  const [{ pos }, api] = useSpring(
    () => ({
      pos: [0, 0],
    }),
    [],
  );

  useLayoutEffect(() => {
    if (hoveredCoordinates[0]) {
      const centerX = hoveredCoordinates[0];
      const centerY = hoveredCoordinates[1];
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
