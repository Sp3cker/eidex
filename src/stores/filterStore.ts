import { createWithEqualityFn as create } from "zustand/traditional";
import { MoveSource, SortBy } from "@/types";
import { ComboBoxEntry } from "@/components/Filter/FilterParts/GenericComboBox";
import { typeDataArray } from "@/utils/typeInfo";
import { combine } from "zustand/middleware";

export const useFilterStore = create(
  combine(
    {
      name: "",
      id: null,
      typeId: undefined as [number, number] | undefined,
      chosenStat: undefined as number | undefined,
      statType: undefined as string | undefined,
      isStatMax: false,
      sortBy: "dexId",
      sortStat: undefined as string | undefined,
      sortDirection: "down",
      moveSource: "all" as MoveSource,

      // Type options
      typeOptions: [
        { typeID: undefined, typeName: "All" },
        ...typeDataArray.filter(Boolean),
      ],

      // Individual state slices
      moveValue: null as ComboBoxEntry | null,
      typeValue: undefined as [number, number] | undefined,
      abilityId: null,

      nameValue: "",
    },
    (set, get) => ({
      setFilter: (key: string, props: any) => {
        const updates: Record<string, unknown> = {
          [key]: props,
        };

        // Handle special mappings
        if (key === "typeValue") {
          const curr = get().typeValue; // Current selection (may be undefined)
          const newValue = props; // Get the first value to toggle

          debugger
          // Case 1: No current selection - add the new value
          if (!curr) {
            updates.typeValue = [newValue];
            updates.typeId = [newValue];
          }
          // Case 2: Current selection includes the new value - remove it
          else if (curr.includes(newValue)) {
            const remaining = curr.filter((id) => id !== newValue);
            if (remaining.length === 0) {
              updates.typeValue = undefined;
              updates.typeId = undefined;
            } else {
              updates.typeValue = [remaining[0]];
              updates.typeId = [remaining[0]];
            }
          }
          // Case 3: Already have two values - replace the first with the new one
          else if (curr.length === 2) {
            updates.typeValue = [curr[1], newValue] as [number, number];
            updates.typeId = [curr[1], newValue] as [number, number];
          }
          // Case 4: Have one value - add the new value as second
          else {
            updates.typeValue = [curr[0], newValue] as [number, number];
            updates.typeId = [curr[0], newValue] as [number, number];
          }
        }

        set({ ...updates });
      },
      resetFilters: () =>
        set({
          name: "",
          typeId: undefined,
          chosenStat: undefined,
          statType: undefined,
          isStatMax: false,
          sortBy: "dexId" as SortBy,
          sortStat: undefined,
          sortDirection: "down",
          moveSource: "all" as MoveSource,
          moveValue: null,
          typeValue: undefined,
          abilityId: null,
          nameValue: "",
        }),

      // Selector function for getting selected types
      getSelectedTypes: () => {
        const state = get();
        return state.typeValue;
      },
      setSort: (by: string, direction: "up" | "down") => {
        set({ sortBy: by, sortDirection: direction ?? "down" });
      },
    }),
  ),
);
