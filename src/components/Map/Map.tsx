import useMapStore from "@/stores/useMapStore";
import "./map.css";
import { useSpring, animated, config, to } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useRef } from "react";
import Floater from "./Floater";
import HoennMap from "./FUCK.tsx";
import Dexnav from "./Dexnax.tsx";
const Map = () => {
  const setMapOffset = useMapStore((state) => state.setMapOffset);
  console.log("render");
  const [{ scale, centerOffset }, api] = useSpring(
    () => ({
      scale: 1,
      centerOffset: [0, 0],
      config: { precision: 0.1, ...config.slow },
      onRest: () => {
        setMapOffset(centerOffset.toJSON());
      },
    }),
    [],
  );
  const targetRef = useRef<HTMLDivElement>(null);
  // Pinch-to-zoom
  // usePinch(
  //   ({ offset: [s] }) => {
  //     api.start({ scale: Math.min(Math.max(s, 0.5), 1.5) }); // Limit: 0.5x to 3x
  //   },
  //   { target: targetRef, scaleBounds: { min: 0.5, max: 1.5 } },
  // );
  // useWheel(
  //   ({ movement: [, y] }) => {
  //     const calcY = Math.abs(Math.min(Math.max(y, 0.75), 2));
  //     setMapScale(calcY);
  //     api.start({ scale: calcY }); // Limit: 0.5x to 3x
  //   },
  //   {
  //     target: targetRef,
  //     bounds: { bottom: 1 },
  //   },
  // );
  useDrag(
    ({ offset: [x, y], dragging }) => {
      if (dragging) {
        api.start({ centerOffset: [x, y] });
      }
    },
    {
      target: targetRef,
      rubberband: true,
      filterTaps: true,
      bounds: { top: -100, bottom: 100, left: -500, right: 100 },
      from: () => {
        console.log(centerOffset.get());
        return [centerOffset.get()[0], centerOffset.get()[1]];
      },
    },
  );
  return (
    <div className="flex h-screen w-full flex-col overflow-auto bg-sky-700">
      <animated.div className="cool-font">
        <animated.div
          ref={targetRef}
          style={{
            touchAction: "none",
            cursor: "move",
            //@ts-ignore
            transform: to([centerOffset, scale], ([x, y], z) => {
              return `translate3d(${x}px,${y}px, ${x * y * 1000}px) scale(${z})`;
            }),
            transformOrigin: "center",
          }}
          className="h-[680px] w-[800px] shadow-sm"
        >
          <Floater />
          <HoennMap />
        </animated.div>
      </animated.div>
      <Dexnav />
    </div>
  );
};

export default Map;
