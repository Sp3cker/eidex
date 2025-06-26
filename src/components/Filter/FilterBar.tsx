import NameCombobox from "./FilterParts/NameCombobox";
import FilterModal from "./FilterModal";

function FilterBar() {
  return (
    <div className="flex select-none flex-col">
      <div className="flex flex-col items-center justify-between gap-3 rounded-t-lg bg-neutral-900/90 px-3 py-2 shadow-lg">
        <NameCombobox />
        <FilterModal />
        <div className="mt-auto p-4 text-center">
          <p className="font-pkmnem text-lg text-neutral-200">
            The <a className="underline hover:bg-gray-600" href="https://dex.emeraldimperium.net/">Official Pokédex has more filtering + Randomizer support</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
