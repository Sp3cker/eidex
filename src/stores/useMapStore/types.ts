import { ItemsByMap } from "@/utils/itemsData";
import { Item, TrainerRef } from "@/data/map";
import { DisplayTrainer } from "@/data/map/trainers";
// import { DisplayTrainer } from "@/components/Map/MapPlaceInfo/TrainersList/useTrainersData";

type EncounterMons = {
  min_level: number;
  max_level: number;
  species: string;
  index: number;

  rate: number;
  rod?: string; // Optional rod type for fishing encounters
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
  selectedMap: string | null; // Map Base Name
  selectedMapEncounterLevels: string[]; // Selecta and EncountersList
  selectedEncounterLevel: string | null; // Selecta and EncountersList
  selectedLevelLandMons: EncounterMons[] | undefined;
  selectedLevelWaterMons: EncounterMons[] | undefined;
  selectedLevelFishingMons: EncounterMons[] | undefined;
  selectedMapItems: ItemsByMap | null;
  selectedMapTrainers: TrainerRef[] | null;

  selectedCoordinates: number[];
  storedCoordinates: Map<string, number[]>;
  selectedMapLevel: number;
  selectedMapsLevels: string[];
  selectedLevelLabel: string;
  mapScale: number;
  mapOffset: number[];
  hoveredMap: string | null;
  hoveredCoordinates: number[];

  viewingImage: boolean;
  selectedImageName: string | null;
  selectedLevelId: string | null;
  selectedRoamer: string | null;
  dragging: boolean;
  hasEncounterDataStored: boolean;
  encounterDataSource: "default" | "next";

  // PlacesList panel state
  isPlacesListOpen: boolean;

  // TrainersList panel state
  isTrainersListOpen: boolean;
  selectedTrainer: DisplayTrainer | null;

  setStateFromURL: (route: string, param: string) => void;
  deselectMap: () => void;
  setSelectedMap: (map: string) => void;
  setMapScale: (n: number) => void;
  setMapOffset: (offset: number[]) => void;
  setHoveredMap: (map: string) => void;

  setHoveredCoordinates: (coords: number[]) => void;
  searchItemByName: (name: string) => Item[];
  setSelectedMapLevel: (level: string) => void;
  setStoredCoordinates: (mapCoords: Map<string, number[]>) => void;
  setViewingImage: (viewing: boolean) => void;
  setSelectedRoamer: (nameKey: string) => void;
  deselectRoamer: () => void;
  setDragging: (dragging: boolean) => void;
  setSelectedEncounterLevel: (levelId: string) => void;
  setEncountersData: (data: any) => void;
  setEncounterDataSource: (to: "default" | "next") => void;
  revertToDefaultEncounters: () => void;

  // PlacesList panel actions
  setPlacesListOpen: (open: boolean) => void;
  togglePlacesList: () => void;

  // TrainersList panel actions
  setTrainersListOpen: (open: boolean) => void;

  setSelectedTrainer: (trainer: DisplayTrainer | null) => void;
  
  // Animation coordination
  setAnimating: (animating: boolean) => void;
  getIsAnimating: () => boolean;
};

export type { EncounterMons, EncounterMonsFromJSON, MapStore, Level };
