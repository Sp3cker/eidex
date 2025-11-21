import { useEffect, useState, useRef, useCallback } from "react";
import { pokemonSearchStore } from "@/stores/pokemonSearchStore";
import { useMapStore } from "@/stores/useMapStore";
import { useUIStore } from "@/stores/uiStore";
import { animated as a, useSpringValue, config } from "@react-spring/web";
import { useSearchSelectionStore } from "./selectedSearchStore";
import { SearchResultsList } from "./SearchResultsList";
type PokeSearchResult = {
  id: number
  name: string;
  maps: string[];
};
const PokeSearch = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { itemSearchSelected, setSearchSelected } = useSearchSelectionStore();
  const width = useSpringValue(window.innerWidth < 640 ? "1rem" : "10rem"); // Initialize with smaller width
  const [searchResults, setSearchResults] = useState<PokeSearchResult[]>([]);
  const setSelectedPokemonByIndex = useUIStore(
    (state) => state.setSelectedPokemonByIndex,
  );
  const setSelectedMapLevel = useMapStore((state) => state.setSelectedMapLevel);
  const setSelectedEncounter = useMapStore(
    (state) => state.setSelectedEncounter,
  );
  const deselectMap = useMapStore((state) => state.deselectMap);
  const [query, setQuery] = useState("");

  // Animate width based on selection state (opposite of Search component)
  useEffect(() => {
    if (itemSearchSelected) {
      if (window.innerWidth < 640) {
        // Shrink when item search is selected
        width.start("1rem", { config: config.gentle });
      }
    } else {
      // Expand when pokemon search is selected
      width.start("10rem");
    }
  }, [itemSearchSelected, width]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === undefined) return;
    const value = e.target.value;
    handleQuery(value);
  };
  const handleQuery = useCallback((value: string) => {
    setQuery(value);

    const results = pokemonSearchStore.getSearchSuggestions(value);
    if (results) {
      setSearchResults(
        results.map((r) => ({
          id: r.id ?? -1,
          name: r.name.charAt(0).toUpperCase() + r.name.slice(1),
          maps: r.maps ?? [],
        })),
      );
    }
    deselectMap();
  }, []);

  const handleFocus = useCallback(() => {
    setSearchSelected(false); // Pokemon search selected = itemSearchSelected false
  }, [setSearchSelected]);

  const handleClick = useCallback(
    (item: { name: string; maps?: string[] }) => {
      // Clear search results immediately
      setSearchResults([]);
      
      // Set the query to the selected pokemon's name (like Search component does)
      handleQuery(item.name);

      const mon = pokemonSearchStore.getPokemonEncounterInfo(item.name);

      if (!mon) {
        console.error("Error selecting mon search result");
        return;
      }
      if (mon.foundInEncounters && mon.speciesId) {
        if (mon.levelIDs && mon.levelIDs.length > 0) {
          setSelectedMapLevel(mon.levelIDs[0]);
          setSelectedEncounter(mon.speciesId);
        }
      } else {
        const dexId = pokemonSearchStore.getPokemonDexId(item.name);
        if (dexId) {
          setSelectedPokemonByIndex(dexId); // Your existing logic
        }
      }
    },
    [setSelectedMapLevel, setSelectedPokemonByIndex],
  );

  return (
    <div className="flex flex-col">
      <div className="relative">
        <a.input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleSearch}
          onFocus={handleFocus}
          style={{
            width: width,
          }}
          className="font-pkmnem font-bold search-input mb-2 w-full rounded-sm border border-neutral-100 p-1  py-0.75 sm:py-1 pl-8 pr-2 sm:text-lg/6 text-stone-50 shadow-inner shadow-xl text-base/6"
          placeholder={itemSearchSelected && window.innerWidth < 640 ? "" : "Find Pokemon"}
        />
        <div
          className={`absolute ${itemSearchSelected ? "translate-x-3 sm:translate-x-2" : "translate-x-2 sm:translate-x-2"} pointer-events-none top-1/2 -translate-y-2.25 transform`}
        >
          <img
            src="/pokeball.svg"
            alt="Pokéball"
            className="h-4 w-4 opacity-60"
          />
        </div>
      </div>
      <SearchResultsList
        monStyling={true}
        results={searchResults}
        // Change onItemClick to pass the full item object to handleClick, and update handleClick to accept the item type.
        onItemClick={(item) => handleClick(item)}
        getItemKey={(item) => item.name}
        getItemDisplayName={(item) => item.name}
        visible={true}
      />
    </div>
  );
};

export default PokeSearch;
