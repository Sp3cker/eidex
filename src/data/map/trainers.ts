// Lazy-loaded trainers data store
let trainersData: Record<string, Trainer[]> | null = null;
let isLoading = false;
let loadPromise: Promise<Record<string, Trainer[]>> | null = null;
export type TrainerPartyMon = {
  moves?: number[];
  lvl?: number;
  id: number;
  ev?: number[];
  iv?: "perfect";
  nature?: string;
  ability?: number[];
  item?: string;
};
/** Trainer data loaded from `trainers.json` */
export interface Trainer {
  id: string;
  trainerName: string;
  script: string;
  coords: [number, number];
  battlePic: string;
  doubleBattle?: boolean;
  aiFlags: string[];
  sprite: string;
  hard?: boolean; // Optional, if this trainer is a hard fight
  level: string; // Can be used to group into level encountered at
  party: TrainerPartyMon[];
  youPicked?: "Treecko" | "Torchic" | "Mudkip"; // Optional, only for rival trainers
  rematch?: true; // If battle is rematch.
}
export type RivalTrainer = Omit<Trainer, "party" | "youPicked"> & {
  parties: Record<"Treecko" | "Torchic" | "Mudkip", any[]>;
};

export type DisplayTrainer = Trainer | RivalTrainer;

// Add more trainer properties as needed

// Lazy load trainers data only when first requested
export const getTrainersData = async (): Promise<Record<string, Trainer[]>> => {
  // If already loaded, return cached data
  if (trainersData !== null) {
    return trainersData;
  }

  // If currently loading, return the existing promise
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // Start loading
  isLoading = true;
  loadPromise = fetch("/trainers.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load trainers.json: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data: Record<string, Trainer[]>) => {
      trainersData = data;
      isLoading = false;
      return trainersData;
    })
    .catch((error) => {
      isLoading = false;
      loadPromise = null;
      console.error("Error loading trainers data:", error);
      throw error;
    });

  return loadPromise;
};

// Get trainers for a specific map
export const getTrainersForMap = async (mapId: string): Promise<Trainer[]> => {
  const allTrainers = await getTrainersData();
  return allTrainers[mapId] || [];
};

// Get cached trainers for a map without loading (returns empty array if not loaded)
export const getCachedTrainersForMap = (mapId: string): Trainer[] => {
  if (trainersData === null) {
    return [];
  }
  return trainersData[mapId] || [];
};
// Check if trainers data is already loaded (for UI state)
export const isTrainersDataLoaded = (): boolean => {
  return trainersData !== null;
};

// Get all cached data without loading (returns null if not loaded)
export const getCachedTrainersData = (): Record<string, Trainer[]> | null => {
  return trainersData;
};

// Reset the cache (for development/testing)
export const resetTrainersCache = (): void => {
  trainersData = null;
  isLoading = false;
  loadPromise = null;
};
