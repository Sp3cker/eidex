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
      sortBy: "dexId" as SortBy,
      sortStat: undefined as string | undefined,
      descending: false,
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
          // Map typeValue to typeId in state
          updates.typeId = props as [number, number] | undefined;
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
          descending: false,
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
    }),
  ),
);
