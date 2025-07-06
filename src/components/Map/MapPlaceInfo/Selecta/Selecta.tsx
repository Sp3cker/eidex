import useMapStore from "@/stores/useMapStore";
import { useMemo } from "react";
import { animated, useSpring } from "@react-spring/web";
import { shallow } from "zustand/shallow";
import { useScreenWidth } from "@/hooks/useScreenWidth";
const translatesTo = {
  lg: 45,
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
    trainerListOpen,
  } = useMapStore(
    (state) => ({
      selectedMapEncounterLevels: state.selectedMapEncounterLevels,
      setSelectedEncounterLevel: state.setSelectedEncounterLevel,
      selectedEncounterLevel: state.selectedEncounterLevel,
      selectedLevelLabel: state.selectedLevelLabel,
      trainerListOpen: state.isTrainersListOpen,
    }),
    shallow,
  );
  const shouldShow = !trainerListOpen && selectedMapEncounterLevels.length > 1;

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
      translateY: shouldShow ? translatesTo[screenWidth] : 0,
      config: { mass: 0.8, tension: 200, friction: 18 },
    }),
    [shouldShow, screenWidth],
  );

  return (
    <animated.aside
      style={spring}
      className={`selecta-grid selecta-z xs:max-w-37 md:max-w-120 flex h-10 w-full min-w-[120px] select-none flex-row items-center rounded-lg border border-gray-600 bg-gray-800 px-1 py-1 drop-shadow-lg ${
        shouldShow ? "fade-in" : "fade-out"
      }`}
    >
      <button
        className="selecta-button-animation bg-fieldset font-pkmnem hover:bg-fieldset/80 font-pkmnem h-8 w-8 shrink-0 rounded-lg text-xs text-neutral-100 shadow-md"
        onClick={handleDownClick}
        disabled={currentLevelIndex <= 0}
        title="Go down one floor"
      >
        ▼
      </button>

      <p className="font-pkmnem text-md flex-1 text-ellipsis text-wrap px-2 text-center font-bold leading-tight text-neutral-100">
        {selectedLevelLabel || "N/A"}
      </p>

      <button
        className="selecta-button-animation bg-fieldset font-pkmnem hover:bg-fieldset/80 font-pkmnem h-8 w-8 shrink-0 rounded-lg text-xs text-neutral-100 shadow-md disabled:opacity-50"
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
