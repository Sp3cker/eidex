import { createWithEqualityFn as create } from "zustand/traditional";
import { FilterOptions, MoveSource, SortBy } from "@/types";
import { ComboBoxEntry } from "@/components/Filter/FilterParts/GenericComboBox";
import { typeDataArray } from "@/utils/typeInfo";
import { combine } from "zustand/middleware";

interface FilterState {
  // Core filter values

  // Stat filter specific state
  // chosenStat: number | undefined;
  // statType: string | undefined;
  // isStatMax: boolean;

  // Move filter state
  moveSource: MoveSource;
  moveValue: ComboBoxEntry | null;

  // Type
  typeValue: [number, number] | undefined;
  typeOptions: { typeID: number | undefined; typeName: string }[];

  //Ability filter
  abilityValue: ComboBoxEntry | null;

  // Sort state
  sortBy: SortBy;
  // sortStat: string | undefined;
  descending: boolean;

  // Name filter
  nameValue: string;

  // Actions
  // setChosenStat: (stat: number | undefined) => void;
  // setStatType: (type: string | undefined) => void;
  // toggleStatMax: () => void;
  setMoveSource: (source: MoveSource) => void;
  setMoveValue: (value: ComboBoxEntry | null) => void;
  setTypeValue: (typeIds: [number, number] | undefined) => void;
  getSelectedTypes: () => [number, number] | undefined;
  setAbilityValue: (ability: ComboBoxEntry | null) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortStat: (stat: string | undefined) => void;
  toggleSortDirection: () => void;
  setNameValue: (name: string) => void;
  resetFilters: () => void;

  setFilter: ({ key, value }: { key: string; value: any }) => void;
}

export const useFilterStore = create(
  combine(
    {
      name: "",
      typeId: undefined,
      chosenStat: undefined,
      statType: undefined,
      isStatMax: false,
      sortBy: "dexId",
      sortStat: undefined,
      descending: false,
      moveSource: "all",

      // Type options
      typeOptions: [
        { typeID: undefined, typeName: "All" },
        ...typeDataArray.filter(Boolean),
      ],

      // Individual state slices

      moveValue: null,
      typeValue: undefined,
      abilityValue: null,

      nameValue: "",
    },
    (set, get) => ({
      setFilter: ({ key, value }: { key: string; value: any }) => {
        set((state) => {
          const updates: Partial<FilterState> = {
            [key]: value,
          };

          // Update the filters object if the key exists there or has a mapping
          if (key === "typeValue") {
            // Map typeValue to typeId in filters
            updates.filters = {
              ...state.filters,
              typeId: value as [number, number] | undefined,
            };
          } else if (key in state.filters) {
            updates.filters = { ...state.filters, [key]: value };
          }

          return updates;
        });
      },
      resetFilters: () =>
        set({
          filters: {
            name: "",
            typeId: undefined,
            chosenStat: undefined,
            statType: undefined,
            isStatMax: false,
            sortBy: "dexId",
            sortStat: undefined,
            descending: false,
            moveSource: "all",
          },
          // chosenStat: undefined,
          // statType: undefined,
          // isStatMax: false,
          moveSource: "all",
          moveValue: null,
          typeValue: undefined,
          abilityValue: null,
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
