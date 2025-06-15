import { createWithEqualityFn as create } from "zustand/traditional";
import ItemSearch from "@/utils/itemsData";
import { getInitialMapLevelData, getSelectedLevel } from "./setSelectedMap";
import { MapStore } from "./types";
import { subscribeWithSelector } from "zustand/middleware";
import { updateMapHelmet } from "./helmetUpdater";
import {
  initializeLevelIdLookup,
  levelIdToLocationMap,
} from "./levelIdtoLocationMap";

initializeLevelIdLookup();


export const useMapStore = create<MapStore>()(
  subscribeWithSelector((set, get) => {
    const initialState = {
      currentRoute: window.location.href,
      selectedMap: null,
      selectedMapLevel: 0,
      selectedMapsLevels: [],
      selectedMapEncounterLevels: [],
      selectedEncounterLevel: null,
      selectedLevelLabel: "", // Added missing property
      selectedLevelLandMons: undefined,
      selectedLevelWaterMons: undefined,
      selectedLevelFishingMons: undefined,
      selectedMapItems: null,
      selectedImageName: null,
      viewingImage: false,
      selectedLevelId: null,
      selectedRoamer: null,
      dragging: false,
    };
    return {
      ...initialState,
      selectedCoordinates: [400, 340],
      storedCoordinates: new Map<string, number[]>(),
      mapScale: 1,

      mapOffset: [0, 0],
      hoveredMap: null,
      hoveredCoordinates: [0, 0],

      deselectMap: () => {
        window.history.pushState({}, "", "");
        window.location.hash = "";
        set({ ...initialState });
      },
      setSelectedMap: (mapName: string) => {
        const currentRoute = window.location.href;
        if (!currentRoute.includes(mapName)) {
          window.history.pushState({}, "", `/map/${mapName}`);
        }
        // updateMapHelmet(mapName);

        const initialMapData = getInitialMapLevelData(mapName);

        if (!initialMapData) {
          console.error(
            `Failed to get initial data for map: ${mapName}. Deselecting map.`,
          );
          get().deselectMap(); // Call deselectMap if no data could be resolved
          return;
        }

        const {
          chosenLevelIndex,
          landEncounters,
          waterEncounters,
          fishingEncounters,
          selectedMapItems,
          selectedMapsLevels,
          selectedMapEncounterLevels,
          selectedLevelId,
          mapLabel, // This label is for the chosenLevelIndex
          selectedImageName,
          // hasEncounters, // Can be used if needed, but mapLabel implies it
        } = initialMapData;

        const storedCoords = get().storedCoordinates.get(mapName) || [400, 340];

        set({
          selectedMap: mapName,
          selectedMapLevel: chosenLevelIndex, // Use the index returned by the utility
          selectedLevelLandMons: landEncounters,
          selectedLevelWaterMons: waterEncounters,
          selectedLevelFishingMons: fishingEncounters,
          selectedMapItems,
          selectedMapsLevels,
          selectedMapEncounterLevels,
          selectedLevelId,
          selectedLevelLabel: mapLabel,
          selectedImageName,
          selectedEncounterLevel: selectedLevelId, // Sync Selecta with the chosen level
          selectedCoordinates: storedCoords,
          selectedRoamer: null,
          viewingImage: false,
        });
      },
      setSelectedMapLevel: (levelId: string) => {
        const baseMapAndLevelIndex = levelIdToLocationMap.get(levelId);

        if (!baseMapAndLevelIndex) {
          console.error("No map selected");
          return;
        }
        const targetMap = getSelectedLevel(baseMapAndLevelIndex);
        if (targetMap === undefined) {
          console.error(
            "Error selecting map level %s, %s",
            baseMapAndLevelIndex.baseMapName,
          );
          return;
        }
        const storedCoords = get().storedCoordinates.get(
          baseMapAndLevelIndex.baseMapName,
        );
        window.history.pushState(
          {},
          "",
          `/map/${baseMapAndLevelIndex.baseMapName}`,
        );

        set({
          selectedMap: baseMapAndLevelIndex.baseMapName,
          selectedCoordinates: storedCoords,
          selectedMapEncounterLevels: targetMap.selectedMapEncounterLevels,
          selectedMapLevel: baseMapAndLevelIndex.levelIndex,
          selectedMapsLevels: targetMap.selectedMapsLevels,
          selectedLevelLabel: targetMap.mapLabel,
          selectedLevelLandMons: targetMap.landEncounters,
          selectedLevelWaterMons: targetMap.waterEncounters,
          selectedLevelFishingMons: targetMap.fishingEncounters,
          selectedMapItems: targetMap.selectedMapItems,
          selectedImageName: targetMap.selectedImageName,
          selectedLevelId: targetMap.selectedLevelId,
        });
      },
      setSelectedEncounterLevel: (levelId: string) => {
        const baseMapAndLevelIndex = levelIdToLocationMap.get(levelId);
        if (!baseMapAndLevelIndex) {
          console.error("No map selected");
          return;
        }
        const targetMap = getSelectedLevel(baseMapAndLevelIndex);
        if (targetMap === undefined) {
          console.error(
            "Error selecting map level %s, %s",
            baseMapAndLevelIndex.baseMapName,
          );
          return;
        }
        set({
          selectedEncounterLevel: levelId,
          selectedLevelLabel: targetMap.mapLabel,
          selectedLevelLandMons: targetMap.landEncounters,
          selectedLevelWaterMons: targetMap.waterEncounters,
          selectedLevelFishingMons: targetMap.fishingEncounters,
        });
      },
      setSelectedCoordinates: (coords) => {
        set({ selectedCoordinates: coords });
      },
      setMapScale: (n) => set({ mapScale: n }),
      setMapOffset: (offset) => set({ mapOffset: offset }),
      setHoveredMap: (map: string) => set({ hoveredMap: map }),
      setHoveredCoordinates: (coords: number[]) =>
        set({ hoveredCoordinates: coords }),

      searchItemByName: (name: string) => {
        return ItemSearch.search(name);
      },
      setStoredCoordinates: (mapCoords: Map<string, number[]>) => {
        set({
          storedCoordinates: mapCoords,
        });
      },
      setStateFromURL: (route: string, routeParam: string) => {
        if (route === "map") {
          get().setSelectedMap(routeParam);
        }
      },

      setViewingImage: (viewing: boolean) => {
        set({ viewingImage: viewing });
      },
      setSelectedRoamer: (nameKey: string) => set({ selectedRoamer: nameKey }),
      deselectRoamer: () => set({ selectedRoamer: null }),
      setDragging: (dragging: boolean) => {
        set({ dragging });
      },
    };
  }),
);

export default useMapStore;

// Subscribe to map changes and update head tags
useMapStore.subscribe(
  (state) => ({
    selectedMap: state.selectedMap,
    selectedLevelLabel: state.selectedLevelLabel,
  }),
  ({ selectedMap, selectedLevelLabel }) => {
    if (!selectedMap) return;
    updateMapHelmet(selectedMap, selectedLevelLabel);
  },
  {
    equalityFn: (a, b) =>
      a.selectedMap === b.selectedMap &&
      a.selectedLevelLabel === b.selectedLevelLabel,
  },
);

window.addEventListener("popstate", () => {
  const path = window.location.pathname;
  const match = path.match(/^\/map\/(.+)$/);
  if (match) {
    useMapStore.getState().setSelectedMap(match[1]);
  }
});
