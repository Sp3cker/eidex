import { create } from "zustand";
import { combine } from "zustand/middleware";
import encounters from "@/data/map/encounters.json";
const getMap = (map: string) => encounters.filter((m) => m.map === "map");
type MapStore = {
  encounters: any[];
  selectedMap: string | null;
  deselectMap: () => void;
  setSelectedMap: (map: string) => void;
};
const useMapStore = create<MapStore>((set) => ({
  encounters,
  selectedMap: null,
  deselectMap: () => set({ selectedMap: null }),
  setSelectedMap: (map: string) => set({ selectedMap: map }),
}));

export default useMapStore;
