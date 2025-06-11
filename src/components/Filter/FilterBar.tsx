import NameCombobox from "./FilterParts/NameCombobox";
import { ComboBoxEntry } from "./FilterParts/GenericComboBox";
import FilterModal from "./FilterModal";
import CurrentFilters from "./CurrentFilters";
import { useFilterStore } from "@/stores/filterStore";

function FilterBar() {
  // Use the filter store directly
  const setNameValue = useFilterStore((state) => state.setNameValue);

  // State to force remount of NameCombobox for clearing

  const handleNameSelect = (entry: ComboBoxEntry | null) => {
    setNameValue(entry ? entry.name : "");
  };

  return (
    <div className="flex select-none flex-col">
      <div className="flex flex-col items-center justify-between gap-3 rounded-t-lg bg-neutral-900/90 px-3 py-2 shadow-lg">
        <NameCombobox onSelect={handleNameSelect} />
        <FilterModal />
      </div>
      <div className="px-3">
        <CurrentFilters />
      </div>
    </div>
  );
}

export default FilterBar;
