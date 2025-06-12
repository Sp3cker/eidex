import { useState } from "react";
import TypeDropdown from "./FilterParts/TypeDropdown";
import AbilityCombobox from "./FilterParts/AbilityCombobox";
import MoveFilterGroup from "./FilterParts/MoveFilterGroup";
import Types from "./FilterParts/Types";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

function FilterModal() {
  const [isOpen] = useState(false);

  useBodyScrollLock(isOpen);

  return (
    <>
      <div className="flex select-none flex-col justify-center">
        <div className="flex flex-wrap gap-2">
          <div className="min-w-max flex-1">
            <AbilityCombobox />
          </div>
          <div className="min-w-max flex-1">
            <MoveFilterGroup />
          </div>
        </div>
        <div >
          <Types />
        </div>
      </div>
    </>
  );
}

export default FilterModal;
