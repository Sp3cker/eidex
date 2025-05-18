import useMapStore from "@/stores/useMapStore";
import "./map.css";
import { useSpring, animated, to } from "@react-spring/web";
import { useDrag, usePinch } from "@use-gesture/react";
import { useRef } from "react";
import Floater from "./Floater";
import HoennMap from "./HoennMap";
import Dexnav from "./Dexnax";
document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener("gesturechange", (e) => e.preventDefault());
const Map = () => {
  const setMapOffset = useMapStore((state) => state.setMapOffset);
  const mapRef = useRef<HTMLDivElement>(null);
  // const { zoomingState } = usePinchZoom(mapRef);

  const [{ scale, centerOffset }, api] = useSpring(
    () => ({
      scale: 1,
      centerOffset: [0, 0],
      config: { mass: 5, tension: 2000, friction: 200 },
      onRest: () => {
        setMapOffset(centerOffset.toJSON());
      },
    }),
    [],
  );

  const targetRef = useRef<HTMLDivElement>(null);
  // Pinch-to-zoom
  usePinch(
    ({ offset: [s] }) => {

      api.set({ scale: Math.min(Math.max(s, 0.5), 1.5) }); // Limit: 0.5x to 3x
    },
    {
      target: mapRef,
      scaleBounds: { min: 0.5, max: 1.5 },
    },
  );
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
      bounds: {
        top: -200 ^ scale.toJSON(),
        bottom: 200 ^ scale.toJSON(),
        left: -500 ^ scale.toJSON(),
        right: 100 ^ scale.toJSON(),
      },
      from: () => {
        // console.log(centerOffset.get());
        return [centerOffset.get()[0], centerOffset.get()[1]];
      },
    },
  );
  return (
    <div
      ref={targetRef}
      className="flex font-calamity h-screen w-full touch-none flex-col overflow-auto bg-sky-700"
    >
      <animated.div
        ref={targetRef}
        style={{ scale: scale }}
        className="cool-font"
      >
        <animated.div
          style={{
            touchAction: "none",
            cursor: "move",
            //@ts-ignore
            transform: to([centerOffset, scale], ([x, y], z) => {
              return `translate3d(${x}px,${y}px, ${x}px)`;
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
