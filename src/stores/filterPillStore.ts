import { create } from "zustand";
import { useFilterStore } from "./filterStore";
import { MoveSource } from "@/types";

// Define FilterType directly in this file
export type FilterType = "name" | "type" | "move" | "ability" | "stat" | "sort";

export type FilterPillValue = { type: string; label: string };

// Define types for our FilterPills


interface FilterPillsState {
  // Track currently active filter pills
  activePills: FilterPillValue[];

  // Utility methods
  addPill: (pill: FilterPillValue) => void;
  removePill: (pillType: string) => void;
  clearAllPills: () => void;

  // Sync pills with filter store
}

export const useFilterPillStore = create<FilterPillsState>((set, get) => ({
  activePills: [],

  addPill: (pill: FilterPill) => {
    set((state) => {
      // If pill already exists, replace it
      const exists = state.activePills.some((p) => p.id === pill.id);
      if (exists) {
        return {
          activePills: state.activePills.map((p) =>
            p.id === pill.id ? pill : p,
          ),
        };
      }

      // Otherwise add new pill
      return {
        activePills: [...state.activePills, pill],
      };
    });
  },

  removePill: (pillId: string) => {
    // First get the pill we're removing (before we remove it from state)
    const pillToRemove = get().activePills.find((p) => p.id === pillId);
    if (!pillToRemove) return;

    // Then remove it from our state
    set((state) => ({
      activePills: state.activePills.filter((p) => p.id !== pillId),
    }));

    // Access the filter store
    const filterStore = useFilterStore.getState();

    // Clear the corresponding filter based on the pill type
    switch (pillToRemove.value.type) {
      case "name":
        filterStore.setNameValue("");
        break;

      case "type":
        filterStore.setTypeValue(undefined);
        break;

      case "ability":
        filterStore.setAbilityValue(null);
        break;

      case "stat":
        // Only reset the stat values, not other filter values
        filterStore.setFilter({ key: "chosenStat", value: undefined });
        filterStore.setFilter({ key: "statType", value: undefined });
        filterStore.setFilter({ key: "isStatMax", value: false });
        break;

      case "move":
        filterStore.setMoveValue(null);
        filterStore.setMoveSource("all");
        break;
    }
  },

  clearAllPills: () => {
    set({ activePills: [] });

    // Reset all filters in filter store
    const filterStore = useFilterStore.getState();
    filterStore.resetFilters();
  },

  syncWithFilters: () => {
    const filterStore = useFilterStore.getState();
    const { filters } = filterStore;
    const newPills: FilterPill[] = [];

    // Convert each active filter to a pill
    if (filters.name) {
      newPills.push({
        id: "name",
        type: "name",
        label: "Name",
        value: { type: "name", value: filters.name },
      });
    }

    if (filters.typeId !== undefined) {
      newPills.push({
        id: "type",
        type: "type",
        label: "Type",
        value: { type: "type", value: filters.typeId },
      });
    }

    if (filters.abilityId !== undefined) {
      newPills.push({
        id: "ability",
        type: "ability",
        label: "Ability",
        value: {
          type: "ability",
          value: {
            id: filters.abilityId,
            name: filters.ability || "",
          },
        },
      });
    }

    if (filters.chosenStat !== undefined) {
      newPills.push({
        id: "stat",
        type: "stat",
        label: filters.statType ? filters.statType.toUpperCase() : "BST",
        value: {
          type: "stat",
          value: {
            stat: filters.chosenStat,
            type: filters.statType,
            isMax: !!filters.isStatMax,
          },
        },
      });
    }

    if (filters.moveId !== undefined) {
      newPills.push({
        id: "move",
        type: "move",
        label: "Move",
        value: {
          type: "move",
          value: {
            id: filters.moveId,
            name: filters.moveName || "",
            source: filters.moveSource as MoveSource,
          },
        },
      });
    }

    set({ activePills: newPills });
  },
}));
