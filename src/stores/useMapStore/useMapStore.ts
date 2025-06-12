import { createWithEqualityFn as create } from "zustand/traditional";
import { pokemonData as pokemon } from "@/data/pokemon";
import ItemSearch from "@/utils/itemsData";
import { getSelectedLevel } from "./setSelectedMap";
import { MapStore } from "./types";
import { subscribeWithSelector } from "zustand/middleware";
import { updateMapHelmet } from "./helmetUpdater";

const UnderscoreRegex = new RegExp(/^[^_]*_/);

export const useMapStore = create<MapStore>()(
  subscribeWithSelector((set, get) => {
    const initialState = {
      currentRoute: window.location.href,
      selectedMap: null,
      selectedMapLevel: 0,
      selectedMapsLevels: 0,
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
      setSelectedMap: (map: string) => {
        const targetLevel = getSelectedLevel(map, 0);
        if (targetLevel === undefined) {
          console.error("Error selecting map %s", map);
          return;
        }
        const storedCoords = get().storedCoordinates.get(map);
        window.history.pushState({}, "", `/map/${map}`);

        set({
          selectedMap: map,
          selectedMapLevel: 0,
          selectedLevelLabel: targetLevel.mapLabel,
          selectedMapsLevels: targetLevel.selectedMapsLevels,
          selectedLevelLandMons: targetLevel.landEncounters,
          selectedLevelWaterMons: targetLevel.waterEncounters,
          selectedLevelFishingMons: targetLevel.fishingEncounters,
          selectedMapItems: targetLevel.selectedMapItems,
          selectedCoordinates: storedCoords || [400, 340],
          selectedImageName: targetLevel.selectedImageName,
          selectedLevelId: targetLevel.selectedLevelId,
        });
      },
      setSelectedMapLevel: (level: number) => {
        const currMap = get().selectedMap;
        if (!currMap) {
          console.error("No map selected");
          return;
        }
        const targetMap = getSelectedLevel(currMap, level);
        if (targetMap === undefined) {
          console.error("Error selecting map level %s, %s", level, currMap);
          return;
        }

        set({
          selectedMapLevel: level,
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
      setSelectedPokemon: (name: string) => {
        const poke = pokemon.filter(
          (p) =>
            p.speciesName.toUpperCase() === name.replace(UnderscoreRegex, ""),
        );
        if (poke.length !== 1) {
          console.error("Ambiguous findings for %s", name);
          return;
        }
        set({ selectedPokemon: poke[0] });
      },
      selectedPokemon: null,
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
