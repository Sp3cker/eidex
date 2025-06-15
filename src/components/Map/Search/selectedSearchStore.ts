import { create } from "zustand";

// Define the state and actions for the store
interface SearchSelectionState {
  itemSearchSelected: boolean;
  setSearchSelected: (bool: boolean) => void;
}

// Create the Zustand store, export it for use in Search and PokeSearch
export const useSearchSelectionStore = create<SearchSelectionState>((set) => ({
  itemSearchSelected: true, // Default to 'item' search, or choose based on your preference
  setSearchSelected: (bool: boolean) => set({ itemSearchSelected: bool }),
}));
