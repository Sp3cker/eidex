import { Item } from "@/utils/itemsData";
import { Pokemon } from "@/types";
type EncounterMons = {
  min_level: number;
  max_level: number;
  species: string;
  index: number;
  rate: number;
};
type EncounterMonsFromJSON = {
  min_level: number;
  max_level: number;
  species: string;

  index?: number; // doesn't exist until we derive it
};
type Level = {
  /**What the levels indexable by in `cleanEncounters.json */
  id: string;
  levelLabel?: string;
};
type MapStore = {
  selectedMap: string | null;
  selectedMapLandMons: EncounterMons[] | undefined;
  selectedMapWaterMons: EncounterMons[] | undefined;
  selectedMapFishingMons: EncounterMons[] | undefined;
  selectedPokemon: Pokemon | null;
  selectedCoordinates: number[];
  storedCoordinates: Map<string, number[]>;
  selectedMapLevel: number;
  selectedMapsLevels: number;
  selectedLevelLabel: string;
  mapScale: number;
  mapOffset: number[];
  hoveredMap: string | null;
  hoveredCoordinates: number[];
  dexNavIsOpen: boolean;
  selectedMapItems: { [location: string]: Item[] } | undefined;
  deselectMap: () => void;
  setSelectedMap: (map: string) => void;
  setSelectedPokemon: (name_no_prefix: string) => void;
  setSelectedCoordinates: (coords: number[]) => void;
  setMapScale: (n: number) => void;
  setMapOffset: (offset: number[]) => void;
  setHoveredMap: (map: string) => void;
  setDexnavIsOpen: (isOpen: boolean) => void;
  setHoveredCoordinates: (coords: number[]) => void;
  searchItemByName: (name: string) => Item[];
  setSelectedMapLevel: (level: number) => void;
  setStoredCoordinates: (mapCoords: Map<string, number[]>) => void;
};

export type { EncounterMons, EncounterMonsFromJSON, MapStore, Level };
