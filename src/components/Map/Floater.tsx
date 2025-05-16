import useMapStore from "@/stores/useMapStore";
import { useLayoutEffect } from "react";
import { animated, to, useSpring } from "@react-spring/web";

const Floater = ({ selectedMap }: { selectedMap: string }) => {
  const selectedCoordinates = useMapStore((state) => state.selectedCoordinates);
  //   const mapScale = useMapStore((state) => state.mapScale);
  const [{ pos }, api] = useSpring(
    () => ({
      pos: [0, 0],
    }),
    [selectedCoordinates],
  );

  useLayoutEffect(() => {
    if (selectedCoordinates[0]) {
      const mapScale = useMapStore.getState().mapScale;

      const x = selectedCoordinates[0] / mapScale;
      const xx = selectedCoordinates[0];
      const y = selectedCoordinates[1] / mapScale;
      const yy = selectedCoordinates[1];
      console.log(`${xx}, ${yy}, but ${x}, ${y} scale ${mapScale}`);
      api.start({
        pos: [x, y],
      });
    }
  }, [selectedCoordinates]);
  return (
    <animated.div
      style={{
        transformOrigin: "center",
        transform: to([pos], ([x, y]) => {
          return `translate3d(${x}px, ${y}px, 0)`;
        }),
      }}
      className="floater rounded-sm bg-gray-300 p-1 text-sm font-bold md:h-[8vh] md:w-[8vw]"
    >
      {selectedMap}
    </animated.div>
  );
};

export default Floater;
