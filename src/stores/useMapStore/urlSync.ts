import { StateCreator } from "zustand";
import { MapStore } from "./types";

// URL synchronization middleware for zustand
export const urlSync = <T extends MapStore>(
  config: StateCreator<T>
): StateCreator<T> => (set, get, api) => {
  const store = config(set, get, api);
  
  // Override setSelectedMap to update URL
  const originalSetSelectedMap = store.setSelectedMap;
  store.setSelectedMap = (mapName: string) => {
    const result = originalSetSelectedMap(mapName);
    
    // Update URL without triggering a page reload
    const currentState = get();
    if (currentState.selectedTrainer) {
      const trainerName = encodeURIComponent(currentState.selectedTrainer.trainerName);
      window.history.replaceState({}, "", `/map/${mapName}/${trainerName}`);
    } else {
      window.history.replaceState({}, "", `/map/${mapName}`);
    }
    
    return result;
  };
  
  // Override setSelectedTrainer to update URL
  const originalSetSelectedTrainer = store.setSelectedTrainer;
  store.setSelectedTrainer = (trainer) => {
    const result = originalSetSelectedTrainer(trainer);
    
    // Update URL
    const currentState = get();
    if (trainer && currentState.selectedMap) {
      const trainerName = encodeURIComponent(trainer.trainerName);
      window.history.replaceState({}, "", `/map/${currentState.selectedMap}/${trainerName}`);
    } else if (currentState.selectedMap) {
      window.history.replaceState({}, "", `/map/${currentState.selectedMap}`);
    }
    
    return result;
  };
  
  return store;
};

// Helper function to parse URL and return state
export const parseURLForMapState = (url: string) => {
  const path = new URL(url, window.location.origin).pathname;
  const mapMatch = path.match(/^\/map\/([^/]+)$/);
  const trainerMatch = path.match(/^\/map\/([^/]+)\/([^/]+)$/);
  
  if (trainerMatch) {
    const [, mapName, trainerName] = trainerMatch;
    return {
      selectedMap: mapName,
      trainerName: decodeURIComponent(trainerName),
      shouldOpenTrainersList: true,
    };
  } else if (mapMatch) {
    return {
      selectedMap: mapMatch[1],
      trainerName: null,
      shouldOpenTrainersList: false,
    };
  }
  
  return {
    selectedMap: null,
    trainerName: null,
    shouldOpenTrainersList: false,
  };
};
