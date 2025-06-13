import NameCombobox from "./FilterParts/NameCombobox";
import FilterModal from "./FilterModal";


function FilterBar() {

  return (
    <div className="flex select-none flex-col">
      <div className="flex flex-col items-center justify-between gap-3 rounded-t-lg bg-neutral-900/90 px-3 py-2 shadow-lg">
        <NameCombobox  />
        <FilterModal />
      </div>
  
    </div>
  );
}

export default FilterBar;
