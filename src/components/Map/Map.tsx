import useMapStore from "@/stores/useMapStore";
import "./map.css";
import maps from "@/data/map/maps.json";
import EncounterZone from "./EncounterZone";
import { useSpring, animated, config } from "@react-spring/web";
import { usePinch } from "@use-gesture/react";
import { useRef } from "react";
const Map = () => {
  const { setSelectedMap, selectedMap } = useMapStore();
  const [{ scale }, api] = useSpring(() => ({ scale: 1, config: config.stiff }));
  const targetRef = useRef<HTMLDivElement>(null);
  // Pinch-to-zoom
  usePinch(
    ({ offset: [s] }) => {
      api.start({ scale: Math.min(Math.max(s, 0.5), 3) }); // Limit: 0.5x to 3x
    },
    { target: targetRef, scaleBounds: { min: 0.5, max: 3 } },
  );
  return (
    <div className="flex h-screen flex-col overflow-x-auto bg-gray-200">
      <animated.div
        ref={targetRef}
        style={{
          transform: scale.to((s) => `scale(${s})`),
          transformOrigin: "top left",
        }}
        className="cool-font inline-block min-w-[200%]  p-4 pb-[133vh]"
      >
        <div className="container h-[680px] w-[800px]">
          {maps.map((m) => (
            <div
              key={m.map}
              className={`${m.map} ${m.type}`}
              title={m.map}
              onClick={() => setSelectedMap(m.map)}
            ></div>
          ))}
        </div>
      </animated.div>
      <nav className="fixed bottom-0 left-0 right-0 z-10 h-1/3 overflow-scroll rounded-lg border-4 border-blue-600 bg-amber-600 bg-gray-300 p-2">
        <div className="flex justify-between text-white">
          <h1 className="cool-font font-bold text-neutral-800">
            {selectedMap}
          </h1>
        </div>
        <div className="flex flex-col cool-font">

            <div className="bg-blue-600 px-2 text-white">Water</div>
            <div className="flex flex-row bg-amber-100">
              <EncounterZone zone="water" />
            </div>
            <div className="bg-brown-600 px-2 text-neutral-800">Land</div>
            <div className="flex w-full flex-row flex-wrap">
              <EncounterZone zone="land" />
            </div>

          {/* <div className="w-32 bg-gray-300 p-2">
            <div className="text-lg font-bold">Zubat</div>
            <div className="flex space-x-1">
              <span className="bg-pink-500 px-1 text-white">PSN</span>
              <span className="bg-gray-400 px-1 text-white">FLY</span>
            </div>
            <div className="mt-1 text-red-600">SEARCH LEVEL</div>
            <div className="text-lg">255</div>
            <div className="mt-1 text-red-600">METHOD</div>
            <div className="text-lg">Ha1k</div>
            <div className="mt-1 text-red-600">HIDDEN ABILITY</div>
            <div className="text-lg">Corrosion</div>
            <div className="mt-1 text-red-600">HELD ITEMS</div>
            <div className="text-lg">----------</div>
          </div> */}
        </div>
      </nav>
    </div>
  );
};

export default Map;
