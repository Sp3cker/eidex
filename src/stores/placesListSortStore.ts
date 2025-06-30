import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SortMode = "alphabetical" | "grouped";

interface PlacesListSortState {
  sortMode: SortMode;
  setSortMode: (mode: SortMode) => void;
}

export const usePlacesListSortStore = create<PlacesListSortState>()(
  persist(
    (set) => ({
      sortMode: "alphabetical",
      setSortMode: (mode: SortMode) => set({ sortMode: mode }),
    }),
    {
      name: "places-list-sort-storage", // unique name for localStorage
      partialize: (state) => ({ sortMode: state.sortMode }), // only persist sortMode
    }
  )
);
