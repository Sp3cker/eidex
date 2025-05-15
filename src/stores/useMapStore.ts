import { create } from "zustand";
import encounters from "@/data/map/encounters.json";
const getMap = (map: string) => encounters.filter((m) => m.map === map);
type Encounters = {
  map: string;
  land_mons?: {
    encounter_rate: number;
    mons: Array<{
      min_level: number;
      max_level: number;
      species: string;
    }>;
  };
  water_mons?: {
    encounter_rate: number;
    mons: Array<{
      min_level: number;
      max_level: number;
      species: string;
    }>;
  };
  fishing_mons?: {
    encounter_rate: number;
    mons: Array<{
      min_level: number;
      max_level: number;
      species: string;
    }>;
  };
};

type MapStore = {
  encounters: any[];
  selectedMap: Encounters | null;
  deselectMap: () => void;
  setSelectedMap: (map: string) => void;
};

const useMapStore = create<MapStore>((set) => ({
  encounters,
  selectedMap: null,
  deselectMap: () => set({ selectedMap: null }),
  setSelectedMap: (map: string) => {
    const targetMapArr = getMap(map);
    if (targetMapArr.length === 0) {
      console.error("Error selecting map %s", map);
      return;
    }
    set({ selectedMap: targetMapArr[0] });
  },
}));

export default useMapStore;
