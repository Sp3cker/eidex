import { useHotkeys, type HotkeyCallback } from "react-hotkeys-hook";
import { useMapStore } from "@/stores/useMapStore";
import { shallow } from "zustand/shallow";

const useMapHotkeys = () => {
  const [
    isPlaceListOpen,
    setPlaceList,
    isTrainersListOpen,
    setTrainersList,
    viewingImage,
    deSelectMap,
  ] = useMapStore(
    (state) => [
      state.isPlacesListOpen,
      state.setPlacesListOpen,
      state.isTrainersListOpen,
      state.setTrainersListOpen,
      state.viewingImage,
      state.deselectMap,
    ],
    shallow,
  );

  const hotkeyHandler: HotkeyCallback = (e, h) => {
    if (!h.keys || h.keys.length === 0) {
      return;
    }
    switch (h.keys[0]) {
      case "e":
        e.preventDefault();
        setPlaceList(!isPlaceListOpen);
        break;
      case "t":
        e.preventDefault();
        setTrainersList(!isTrainersListOpen);
        break;
      case "escape":
        if (viewingImage) {
          return;
        }
        e.preventDefault();
        deSelectMap();
    }
  };
  useHotkeys(["e", "t", "escape"], hotkeyHandler);
};

export { useMapHotkeys };
