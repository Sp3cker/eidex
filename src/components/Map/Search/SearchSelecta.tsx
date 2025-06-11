import useMapStore from "@/stores/useMapStore";
// import mapsBreakdown from "@/data/map/mapBreakdown.json";
import React, { useEffect } from "react";
import { MapStore } from "@/stores/useMapStore/types";
import { animated, useSpring } from "@react-spring/web";

// const MMAAPPSS = new Set(
//   mapsBreakdown
//     .filter((m) => {
//       if (m.levels.length > 1) {
//         return true;
//       }
//     })
//     .map((m) => m.mapBaseName),
// );

const SearchSelecta = React.memo(function SSelecta({
  maps,
}: {
  maps: string[];
}) {
  const setSelectedMap = useMapStore((state: MapStore) => state.setSelectedMap);
  const handleUpClick = () => {
    const { selectedMap } = useMapStore.getState();
    if (!selectedMap) {
      return;
    }
    const currMapInd = maps.indexOf(selectedMap);
    if (maps[currMapInd + 1]) { // if map next in arr
      setSelectedMap(maps[currMapInd + 1]);
    } else {
      setSelectedMap(maps[0]);
    }
  };
  const handleDownClick = () => {
    const { selectedMap } = useMapStore.getState();
    if (!selectedMap) {
      return;
    }

    const currMapInd = maps.indexOf(selectedMap);
    if (maps[currMapInd - 1]) {
      setSelectedMap(maps[currMapInd - 1]);
    } else {
      setSelectedMap(maps[maps.length - 1]);
    }
  };
  const [spring, api] = useSpring(() => ({
    opacity: 0,
    translateY: -50,
    // config: (key) => (key === "translateY" ? {} : {}),
  }));
  useEffect(() => {
    if (maps && maps.length > 1) {
      api.start({ translateY: 10, opacity: 1 });
    } else if (maps.length === 0) {
      api.start({ translateY: -50, opacity: 0 });
    }
    // const unsub = useMapStore.subscribe((state: MapStore) => {
    //   const numOfLevels = state.selectedMapsLevels;
    //   if (numOfLevels > 1) {
    //     api.start({ opacity: 1, translateX: 70 });
    //   } else {
    //     api.set({ opacity: 0, translateX: 0 });
    //   }
    // });
    // return () => {
    //   unsub();
    // };
  }, [maps.length]);
  return (
    <animated.aside
      style={spring}
      className="selecta-grid selecta-z flex w-7 flex-row"
    >
      <div className={`flex flex-row`}>
        <animated.button
          className="selecta-button-animation font-pkmnem m-auto rounded-sm bg-neutral-300 px-2 text-xl shadow-lg"
          onClick={handleDownClick}
        >
          ↓
        </animated.button>
        <p className="font-pkmnem pl-0.25 text-shadow-sm text-xl font-bold text-neutral-50">
          Location
        </p>
        <animated.button
          className="selecta-button-animation font-pkmnem m-auto rounded-sm bg-neutral-300 px-2 text-xl shadow-lg"
          onClick={handleUpClick}
        >
          ↑
        </animated.button>
      </div>
    </animated.aside>
  );
}, (prev, next) => prev.maps.length === next.maps.length);
export default SearchSelecta;
