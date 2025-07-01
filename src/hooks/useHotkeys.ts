import { useHotkeys } from "react-hotkeys-hook";
import { useMapStore } from "@/stores/useMapStore";
import { HotkeysEvent } from "react-hotkeys-hook/packages/react-hotkeys-hook/dist/types";

const useMapHotkeys = () => {
  const [isPlaceListOpen, setPlaceList, isTrainersListOpen, setTrainersList, viewingImage, deSelectMap] =
    useMapStore((state) => [
      state.isPlacesListOpen,
      state.setPlacesListOpen,
      state.isTrainersListOpen,
      state.setTrainersListOpen,
      state.viewingImage,
      state.deselectMap,
    ]);

  const hotkeyHandler = (e: KeyboardEvent, h: HotkeysEvent) => {
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
  useHotkeys(["e", "t", 'escape'], hotkeyHandler);
};

export { useMapHotkeys };
