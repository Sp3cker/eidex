import useMapStore from "@/stores/useMapStore";
import "./map.css";
import maps from "@/data/map/maps.json";
import EncounterZone from "./EncounterZone";
import { useSpring, animated, config, to } from "@react-spring/web";
import { useDrag, usePinch, useWheel } from "@use-gesture/react";
import { useRef } from "react";
import Floater from "./Floater";
import MapPlace from "./MapPlace";
const Map = () => {
  const selectedMap = useMapStore((state) => state.selectedMap);
  const setMapScale = useMapStore((state) => state.setMapScale);
  console.log("render");
  const [{ scale, centerOffset }, api] = useSpring(() => ({
    scale: 1,

    centerOffset: [0, 0],
    config: { precision: 0.1, ...config.slow },
  }));
  const targetRef = useRef<HTMLDivElement>(null);
  // Pinch-to-zoom
  usePinch(
    ({ offset: [s] }) => {
      api.start({ scale: Math.min(Math.max(s, 0.5), 1.5) }); // Limit: 0.5x to 3x
    },
    { target: targetRef, scaleBounds: { min: 0.5, max: 1.5 } },
  );
  useWheel(
    ({ delta: [, dy], movement: [, y] }) => {
      const calcY = Math.abs(Math.min(Math.max(y, 0.75), 2));
      setMapScale(calcY);
      api.start({ scale: calcY }); // Limit: 0.5x to 3x
    },
    {
      target: targetRef,
      bounds: { bottom: 1 },
      rubberband: true,
    },
  );
  useDrag(
    ({ offset: [x, y], dragging }) => {
      dragging && api.start({ centerOffset: [x, y] });
    },
    {
      target: targetRef,
      rubberband: true,
      filterTaps: true,
      bounds: { top: -100, bottom: 100, left: -100, right: 100 },
      from: () => {
        console.log(centerOffset.get());
        return [centerOffset.get()[0], centerOffset.get()[1]];
      },
    },
  );
  return (
    <div className="flex h-screen flex-col overflow-auto bg-gray-200">
      <animated.div className="cool-font inline-block p-4">
        <animated.div
          ref={targetRef}
          style={{
            touchAction: "none",
            cursor: "move",
            //@ts-ignore
            transform: to([centerOffset, scale], ([x, y], z) => {
              // console.log(x, y);
              return `translate3d(${x}px,${y}px, ${x * y * 1000}px) scale(${z})`;
            }),
            transformOrigin: "center",
          }}
          className="container h-[680px] w-[800px]"
        >
          <Floater selectedMap={selectedMap} />
          {maps.map((m) => (
            <MapPlace key={m.map} {...m} />
          ))}
        </animated.div>
      </animated.div>
      <nav className="fixed bottom-0 left-0 right-0 z-10 h-1/3 overflow-scroll rounded-lg border-4 border-blue-600 bg-amber-600 bg-gray-300 p-2">
        <div className="flex justify-between text-white">
          <h1 className="cool-font font-bold text-neutral-800">
            {selectedMap}
          </h1>
        </div>
        <div className="cool-font flex flex-col">
          <div className="bg-blue-600 px-2 text-white">Water</div>
          <div className="flex flex-row bg-amber-100">
            <EncounterZone zone="water" />
          </div>
          <div className="bg-brown-600 px-2 text-neutral-800">Land</div>
          <div className="flex w-full flex-row flex-wrap">
            <EncounterZone zone="land" />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Map;
