import NameCombobox from "./FilterParts/NameCombobox";
import FilterModal from "./FilterModal";

function FilterBar() {
  return (
    <div className="flex select-none flex-col">
      <div className="flex flex-col items-center justify-between gap-3 rounded-t-lg bg-neutral-900/90 px-3 py-2 shadow-lg">
        <NameCombobox />
        <FilterModal />
        <div className="font-pkmnem mt-auto p-4 text-center text-2xl text-neutral-200">
          <p>This dex doesn't have all forms of Pokémon.</p>
          <p className="font-pkmnem text-2xl text-neutral-200">
            Kildemal's{" "}
            <a
              className="underline hover:bg-gray-600"
              href="https://dex.emeraldimperium.net/"
            >
              Official Emerald Imperium Pokédex{" "}
            </a>
            has:
          </p>
          <ul className="list-disc space-y-1 pl-5 text-left text-2xl">
            <li> Better filtering than this one</li>
            <li> Randomizer support</li>
            <li> All forms of Pokémon</li>
          </ul>
          <p className="text-left">
            I keep this version so I can play with these buttons :3
          </p>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
