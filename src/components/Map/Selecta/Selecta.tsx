import useMapStore from "@/stores/useMapStore";
// import mapsBreakdown from "@/data/map/mapBreakdown.json";
import { useEffect } from "react";
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

const Selecta = () => {
  const setSelectedLevel = useMapStore(
    (state: MapStore) => state.setSelectedMapLevel,
  );
  const handleUpClick = () => {
    const { selectedMapLevel, selectedMapsLevels } = useMapStore.getState();
    const toLevel = selectedMapLevel + 1;
    if (toLevel >= selectedMapsLevels) return;
    setSelectedLevel(toLevel);
  };
  const handleDownClick = () => {
    const { selectedMapLevel } = useMapStore.getState();
    const toLevel = selectedMapLevel - 1;
    if (0 > toLevel) return;
    setSelectedLevel(toLevel);
  };
  const [spring, api] = useSpring(
    () => ({
      opacity: 0,
      translateX: 0,
      // config: (key) => (key === "translateY" ? {} : {}),
    }),
    [],
  );
  useEffect(() => {
    const unsub = useMapStore.subscribe((state: MapStore) => {
      const numOfLevels = state.selectedMapsLevels;
      if (numOfLevels > 1) {
        api.start({ opacity: 1, translateX: 70 });
      } else {
        api.set({ opacity: 0, translateX: 0 });
      }
    });
    return () => {
      unsub();
    };
  }, []);
  return (
    <animated.aside
      style={{ translateX: spring.translateX, opacity: spring.opacity }}
      className="selecta-grid selecta-z flex w-7"
    >
      <div className={`flex flex-col`}>
        <animated.button
          className="selecta-button-animation font-pkmnem m-auto rounded-sm bg-neutral-300 px-2 text-xl shadow-lg"
          onClick={handleDownClick}
        >
          ↓
        </animated.button>
        <p className="font-pkmnem pl-0.25 text-shadow-sm text-xl font-bold text-neutral-50">
          Level
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
};
export default Selecta;
