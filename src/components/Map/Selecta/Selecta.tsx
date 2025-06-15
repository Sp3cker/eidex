import useMapStore from "@/stores/useMapStore";
import { useMemo } from "react";
import { animated, useSpring } from "@react-spring/web";
import { shallow } from "zustand/shallow";

const Selecta = () => {
  const {
    selectedMapEncounterLevels,
    setSelectedEncounterLevel,
    selectedEncounterLevel,
  } = useMapStore(
    (state) => ({
      selectedMapEncounterLevels: state.selectedMapEncounterLevels,
      setSelectedEncounterLevel: state.setSelectedEncounterLevel,
      selectedEncounterLevel: state.selectedEncounterLevel,
    }),
    shallow,
  );

  const currentLevelIndex = useMemo(() => {
    if (selectedMapEncounterLevels.length === 0) {
      return -1;
    }
    return selectedMapEncounterLevels.findIndex((l) => {
      return l === selectedEncounterLevel;
    });
  }, [selectedEncounterLevel, selectedMapEncounterLevels]);

  const handleUpClick = () => {
    if (currentLevelIndex === -1) return;
    const nextIndex = currentLevelIndex + 1;

    if (nextIndex < selectedMapEncounterLevels.length) {
      setSelectedEncounterLevel(selectedMapEncounterLevels[nextIndex]);
    }
  };

  const handleDownClick = () => {
    if (currentLevelIndex === -1 || selectedMapEncounterLevels.length === 0)
      return;
    const prevIndex = currentLevelIndex - 1;
    if (prevIndex >= 0) {
      setSelectedEncounterLevel(selectedMapEncounterLevels[prevIndex]);
    }
  };

  const [spring] = useSpring(
    () => ({
      opacity: selectedMapEncounterLevels.length > 1 ? 1 : 0,
      translateY: selectedMapEncounterLevels.length > 1 ? 70 : 0,
      // config: (key) => (key === "translateY" ? {} : {}),
    }),
    [selectedMapEncounterLevels],
  );

  return (
    <animated.aside style={spring} className="selecta-grid selecta-z flex w-8">
      <div className={`flex flex-row`}>
        <animated.button
          className="selecta-button-animation font-pkmnem m-auto rounded-sm bg-neutral-300 px-2 text-xl shadow-lg"
          onClick={handleDownClick}
        >
          ←
        </animated.button>
        <p className="font-pkmnem pl-0.25 text-shadow-sm text-xl font-bold text-neutral-50">
          Level
        </p>
        <animated.button
          className="selecta-button-animation font-pkmnem m-auto rounded-sm bg-neutral-300 px-2 text-xl shadow-lg"
          onClick={handleUpClick}
        >
          →
        </animated.button>
      </div>
    </animated.aside>
  );
};
export default Selecta;
