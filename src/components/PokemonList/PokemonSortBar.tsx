import { PiSortAscending } from "react-icons/pi";
import { PiSortDescending } from "react-icons/pi";
import { Button } from "@headlessui/react";
import React, { useCallback } from "react";
import { useFilterStore } from "@/stores/filterStore";

const sortOptions: { label: string; statType?: string }[] = [
  { label: "ID", statType: "speciesId" },
  { label: "Name", statType: "name" },
  { label: "BST", statType: "bst" },
  { label: "HP", statType: "hp" },
  { label: "Atk", statType: "attack" },
  { label: "Def", statType: "defense" },
  { label: "SpA", statType: "spAtk" },
  { label: "SpD", statType: "spDef" },
  { label: "Spe", statType: "speed" },
];

export const SortBar = React.memo(function SortBar() {
  // const selected = statType ? `${sortBy}:${statType}` : sortBy;
  const { sortBy, sortDirection, setSort } = useFilterStore((state) => ({
    sortBy: state.sortBy,
    sortDirection: state.sortDirection,
    setSort: state.setSort,
  }));
  const handleChange = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!e.currentTarget.title) return;
      setSort(e.currentTarget.title, "down");
    },
    [],
  );
  return (
    <div className="flex w-full items-center justify-between bg-neutral-900/90">
      <div className="ml-3 flex h-9 flex-1 text-nowrap">
        {sortOptions.map((option) => {
          const isSelected = sortBy === option.statType;
          return (
            <Button
              title={option.statType}
              key={option.label}
              data-selected={isSelected}
              className="cursor-pointer hover:text-emerald-400 font-pkmnem min-w-max border-b-4 border-transparent px-2 font-bold text-gray-300 data-[selected=true]:border-emerald-500 data-[selected=true]:text-emerald-500"
              onClick={handleChange}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
      <div
        className="cursor-pointer select-none pr-3 text-emerald-300"
        onClick={() => {
          setSort(sortBy, sortDirection === "up" ? "down" : "up");
        }}
      >
        {sortDirection === "down" ? (
          <PiSortAscending size={22} />
        ) : (
          <PiSortDescending size={22} />
        )}
      </div>
    </div>
  );
});
