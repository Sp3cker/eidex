import { create } from "zustand";
import pokemon from "@/data/speciesData.json";
import ItemSearch from "@/utils/itemsData";
import { getSelectedLevel } from "./setSelectedMap";
import { MapStore } from "./types";

const UnderscoreRegex = new RegExp(/^[^_]*_/);

export function formatMapString(mapNameFromJson: string) {
  return (
    mapNameFromJson
      .replace(/^MAP_/, "") // Remove 'MAP_' prefix
      // .toLowerCase() // Convert to lowercase
      .replace(
        /([A-Z]+)_?/g,
        (_, p1) => p1.charAt(0).toUpperCase() + p1.slice(1).toLowerCase() + " ",
      )
      .trim()
      .replace(/(^|_)([a-z])/g, (_: any, __: any, letter: string) =>
        letter.toUpperCase(),
      ) // Capitalize first letter and after underscores
  );
}
export const useMapStore = create<MapStore>((set, get) => {
  const initialState = {
    selectedMap: null,
    selectedMapLevel: 0,
    selectedMapsLevels: 0,
    selectedLevelLabel: "", // Added missing property
    selectedMapLandMons: undefined,
    selectedMapWaterMons: undefined,
    selectedMapFishingMons: undefined,
    selectedMapItems: undefined,
  };
  return {
    ...initialState,
    selectedCoordinates: [400, 340],
    storedCoordinates: new Map<string, number[]>(),
    mapScale: 1,
    mapOffset: [0, 0],
    hoveredMap: null,
    hoveredCoordinates: [0, 0],
    dexNavIsOpen: false,
    deselectMap: () => set({ ...initialState }),
    setSelectedMap: (map: string) => {
      const targetLevel = getSelectedLevel(map, 0);
      set({
        selectedMap: map,
        selectedMapLevel: 0,
        selectedLevelLabel: targetLevel.mapLabel,
        selectedMapsLevels: targetLevel.selectedMapsLevels,
        selectedMapLandMons: targetLevel.landEncounters,
        selectedMapWaterMons: targetLevel.waterEncounters,
        selectedMapFishingMons: targetLevel.fishingEncounters,
        selectedMapItems: targetLevel.selectedMapItems,
      });
    },
    setSelectedMapLevel: (level: number) => {
      const currMap = get().selectedMap;
      if (!currMap) {
        console.error("No map selected");
        return;
      }
      const targetMap = getSelectedLevel(currMap, level);

      set({
        selectedMapLevel: level,
        selectedMapsLevels: targetMap.selectedMapsLevels,
        selectedLevelLabel: targetMap.mapLabel,
        selectedMapLandMons: targetMap.landEncounters,
        selectedMapWaterMons: targetMap.waterEncounters,
        selectedMapFishingMons: targetMap.fishingEncounters,
        selectedMapItems: targetMap.selectedMapItems,
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
    setDexnavIsOpen: (isOpen) => set({ dexNavIsOpen: isOpen }),
    searchItemByName: (name: string) => {
      return ItemSearch.search(name);
    },
  };
});

export default useMapStore;
