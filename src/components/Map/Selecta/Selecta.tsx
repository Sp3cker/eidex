import useMapStore from "@/stores/useMapStore";
import { useMemo } from "react";
import { animated, useSpring } from "@react-spring/web";
import { shallow } from "zustand/shallow";

const Selecta = () => {
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
      translateY: selectedMapEncounterLevels.length > 1 ? 70 : 0,
      // config: (key) => (key === "translateY" ? {} : {}),
    }),
    [selectedMapEncounterLevels],
  );

  return (
    <animated.aside 
      style={spring} 
      className="selecta-grid select-none selecta-z flex flex-row items-center bg-gray-800/90 h-10 rounded px-1 py-1 shadow-lg border border-gray-600/50 min-w-[120px]"
    >
      <button
        className="selecta-button-animation font-pkmnem w-8 h-8 rounded bg-blue-500 hover:bg-blue-400 text-white text-xs shadow-md transition-colors disabled:opacity-50 flex-shrink-0"
        onClick={handleDownClick}
        disabled={currentLevelIndex <= 0}
        title="Go down one floor"
      >
        ▼
      </button>
      
      <div className="flex-1 px-2 text-xs font-calamity font-bold text-white text-center truncate">
        {selectedLevelLabel || "N/A"}
      </div>
      
      <button
        className="selecta-button-animation font-pkmnem w-8 h-8 rounded bg-blue-500 hover:bg-blue-400 text-white text-xs shadow-md transition-colors disabled:opacity-50 flex-shrink-0"
        onClick={handleUpClick}
        disabled={currentLevelIndex === -1 || currentLevelIndex >= selectedMapEncounterLevels.length - 1}
        title="Go up one floor"
      >
        ▲
      </button>
    </animated.aside>
  );
};
export default Selecta;
