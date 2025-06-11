import { useState } from "react";
import { Button} from "@headlessui/react";

import CurrentFilters from "./CurrentFilters";
import TypeDropdown from "./FilterParts/TypeDropdown";
import AbilityCombobox from "./FilterParts/AbilityCombobox";
import MoveFilterGroup from "./FilterParts/MoveFilterGroup";
import StatFilter from "./StatFilter/StatFilter";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import { useFilterStore } from "../../stores/filterStore";

function FilterModal() {
  const [isOpen, setIsOpen] = useState(false);

  const { resetFilters } = useFilterStore();

  useBodyScrollLock(isOpen);

  return (
    <>
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      <div className="fixed inset-0 flex select-none justify-center">
        <h3>Filter Options</h3>

        <div className="flex flex-wrap gap-2">
          <div className="min-w-max flex-1">
            <TypeDropdown />
          </div>
          <div className="min-w-max flex-1">
            <AbilityCombobox />
          </div>
          <div className="min-w-max flex-1">
            <MoveFilterGroup />
          </div>
          <div className="min-w-max flex-1">
            <StatFilter />
          </div>
        </div>
        <div className="my-2 flex">
          <CurrentFilters />
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsOpen(false)}
            className="shadow-md/60 text-sm/2 h-7 w-16 cursor-pointer rounded bg-emerald-700 p-2 text-center text-white"
          >
            Apply
          </Button>
          <Button
            onClick={() => {
              resetFilters();
              setIsOpen(false);
            }}
            className="shadow-md/60 text-sm/2 h-7 w-16 cursor-pointer rounded bg-rose-700 p-2 text-center text-white"
          >
            Reset
          </Button>
        </div>
      </div>
    </>
  );
}

export default FilterModal;
