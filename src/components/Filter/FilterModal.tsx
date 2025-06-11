import { useState } from "react";
import TypeDropdown from "./FilterParts/TypeDropdown";
import AbilityCombobox from "./FilterParts/AbilityCombobox";
import MoveFilterGroup from "./FilterParts/MoveFilterGroup";
import StatFilter from "./StatFilter/StatFilter";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";


function FilterModal() {
  const [isOpen] = useState(false);



  useBodyScrollLock(isOpen);

  return (
    <>
      <div className="flex flex-col select-none justify-center">
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



      </div>
    </>
  );
}

export default FilterModal;
