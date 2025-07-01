import useMapStore from "@/stores/useMapStore";
import { useMemo } from "react";
import { animated, useSpring } from "@react-spring/web";
import { shallow } from "zustand/shallow";
import { useScreenWidth } from "@/hooks/useScreenWidth";
const translatesTo = {
  lg: 50,
  md: 3,
  sm: 70,
  xs: 70,
};
const Selecta = () => {
  const screenWidth = useScreenWidth();
  const {
    selectedMapEncounterLevels,
    setSelectedEncounterLevel,
    selectedEncounterLevel,
    selectedLevelLabel,
  } = useMapStore(
    (state) => ({
      selectedMapEncounterLevels: state.selectedMapEncounterLevels,
      setSelectedEncounterLevel: state.setSelectedEncounterLevel,
      selectedEncounterLevel: state.selectedEncounterLevel,
      selectedLevelLabel: state.selectedLevelLabel,
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
      translateY:
        selectedMapEncounterLevels.length > 1 ? translatesTo[screenWidth] : 0,
      // config: (key) => (key === "translateY" ? {} : {}),
    }),
    [selectedMapEncounterLevels, screenWidth],
  );

  return (
    <animated.aside
      style={spring}
      className="selecta-grid selecta-z flex h-10 min-w-[120px] max-w-[9.25rem] select-none flex-row items-center rounded-lg border border-gray-600/50 bg-gray-800/90 px-1 py-1 shadow-lg md:max-w-[30rem]"
    >
      <button
        className="selecta-button-animation bg-fieldset font-pkmnem hover:bg-fieldset/80 font-pkmnem h-8 w-8 flex-shrink-0 rounded-lg text-xs text-neutral-100 shadow-md"
        onClick={handleDownClick}
        disabled={currentLevelIndex <= 0}
        title="Go down one floor"
      >
        ▼
      </button>

      <p className="font-pkmnem text-ellipsis leading-tight flex-1 text-wrap px-2 text-center text-md font-bold text-neutral-100">
        {selectedLevelLabel || "N/A"}
      </p>

      <button
        className="selecta-button-animation bg-fieldset font-pkmnem hover:bg-fieldset/80 font-pkmnem h-8 w-8 flex-shrink-0 rounded-lg text-xs text-neutral-100 shadow-md disabled:opacity-50"
        onClick={handleUpClick}
        disabled={
          currentLevelIndex === -1 ||
          currentLevelIndex >= selectedMapEncounterLevels.length - 1
        }
        title="Go up one floor"
      >
        ▲
      </button>
    </animated.aside>
  );
};
export default Selecta;
