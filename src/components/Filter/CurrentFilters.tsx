import { useEffect } from "react";
import FilterPill from "./FilterParts/FilterPill";

import { FilterPillValue } from "@/stores/filterPillStore";
import { useFilterStore } from "@/stores/filterStore";
import { Button } from "@headlessui/react";
const syncWithFilters = (filters: Record<string, any>) => {
  if (filters === undefined) return [];

  const newPills: FilterPillValue[] = [];

  // Convert each active filter to a pill
  if (filters.name) {
    newPills.push({
      type: "Name",
      label: filters.name,
    });
  }

  if (filters.typeId !== undefined) {
    const [type1, type2] = filters.typeId;
    let typeLabel;
    if (type2) {
      typeLabel = `${type1} + ${type2}`;
    } else typeLabel = type1;
    newPills.push({
      type: "Type",
      label: typeLabel,
    });
  }

  if (filters.abilityId !== undefined) {
    newPills.push({
      type: "Abl",
      label: filters.abilityId,
    });
  }

  if (filters.moveId !== undefined) {
    newPills.push({
      type: "Move",
      label: `${filters.moveId} from ${filters.moveSource}`,
    });
  }
  return newPills;
};
function CurrentFilters() {
  // const [activePills, ]
  const filters = useFilterStore((state) => ({
    name: state.nameValue,
    move: state.moveValue,
    moveSource: state.moveSource,
    ability: state.abilityValue,
    type: state.typeValue,
  }));
  const pills = syncWithFilters(filters);
  // Sync with filter state whenever the component renders

  // Don't render if no active filters
  if (pills.length === 0) return null;

  return (
    <div className="flex w-full flex-wrap gap-2 py-2">
      {/* {pills.map((pill) => (
        <FilterPill key={pill.type} pill={pill}  />
      ))}
      {pills.length > 1 && (
        // <Button
        //   onClick={clearAllPills}
        //   className="self-center rounded-full bg-zinc-600 px-3 py-1 text-xs text-white hover:bg-rose-500"
        // >
        //   Clear All
        // </Button>
      )} */}
    </div>
  );
}

export default CurrentFilters;
