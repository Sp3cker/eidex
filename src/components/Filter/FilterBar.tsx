import NameCombobox from "./FilterParts/NameCombobox";
import { ComboBoxEntry } from "./FilterParts/GenericComboBox";
import FilterModal from "./FilterModal";
import CurrentFilters from "./CurrentFilters";
import { useFilterStore } from "@/stores/filterStore";

function FilterBar() {

  return (
    <div className="flex select-none flex-col">
      <div className="flex flex-col items-center justify-between gap-3 rounded-t-lg bg-neutral-900/90 px-3 py-2 shadow-lg">
        <NameCombobox  />
        <FilterModal />
      </div>
      <div className="px-3">
        <CurrentFilters />
      </div>
    </div>
  );
}

export default FilterBar;
