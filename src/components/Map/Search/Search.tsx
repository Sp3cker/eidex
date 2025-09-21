import { useMapStore } from "@/stores/useMapStore";
import itemSearch, { useItemSearch } from "@/utils/itemsData";
import { animated as a, useSpringValue } from "@react-spring/web";
import { useCallback, useState, useRef, useEffect } from "react";
import SearchSelecta from "./SearchSelecta";
import { ErrorBanner } from "./misc";
import { useSearchSelectionStore } from "./selectedSearchStore";
import { SearchResultsList } from "./SearchResultsList";
const Search = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const setSelectedMap = useMapStore((state) => state.setSelectedMap);
  const deSelectMap = useMapStore((state) => state.deselectMap);
  const { itemSearchSelected, setSearchSelected, setItemSearchFocused } =
    useSearchSelectionStore();
  const [itemMaps, setItemMaps] = useState<string[]>([]);
  const [
    searchTerm,
    searchResults,
    setSearchName,
    clearSearch,
    getMapsForItem,
  ] = useItemSearch();
  const [showToast, setShowToast] = useState<{
    show: boolean;
    type: "held" | "error";
    species?: string[];
  }>({ show: false, type: "error" });
  const width = useSpringValue("10rem"); // Initialize with CSS value
  // Animate width based on selection state
  useEffect(() => {
    if (itemSearchSelected) {
      // Expand to full width when selected
      width.start("10rem");
    } else if (window.innerWidth < 640) {
      // Shrink to a smaller width when not selected
      width.start("4rem");
    }
  }, [itemSearchSelected, width]);
  const refocusSearch = useCallback(() => {
    inputRef.current?.focus();
  }, [inputRef]);
  const handleClick = useCallback(
    (item: { name: string; id?: string }) => {
      const { name, id } = item;
      setSearchName(name);
      refocusSearch();

      if (!id) return;

      const maps = getMapsForItem(id);
      if (maps && maps.length > 0) {
        setItemMaps(maps);
        clearSearch();
        setSelectedMap(maps[0]);
        setShowToast({ show: false, type: "error" });
        return;
      }
      const pokemons = itemSearch.getMonIdsWithHeldItem(id);
      if (pokemons && pokemons.length > 0) {
        setShowToast({ show: true, type: "held", species: pokemons });
        setTimeout(() => setShowToast({ show: false, type: "held" }), 3300);
        return;
      } else {
        setShowToast({ show: true, type: "error" });
        setTimeout(() => setShowToast({ show: false, type: "error" }), 3300);
      }
      // Do NOT clear the search term here!
    },
    [
      searchResults,
      setSearchName,
      getMapsForItem,
      setItemMaps,
      clearSearch,
      setSelectedMap,
      setShowToast,
    ],
  );

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      deSelectMap();
      setItemMaps([]);
      setSearchName(e.currentTarget.value);
    },
    [deSelectMap, setItemMaps, setSearchName],
  );

  const handleFocus = useCallback(() => {
    setSearchSelected(true);
    setItemSearchFocused(true);
  }, [setSearchSelected]);
  const handleBlur = useCallback(() => {
    setItemSearchFocused(false);
  }, []);
  return (
    <div className="flex flex-col">
      <ErrorBanner
        show={showToast.show}
        type={showToast.type}
        species={showToast.species}
      />
      <a.input
        ref={inputRef}
        value={searchTerm}
        className="font-pkmnem search-input py-0.75 sm: mb-2 w-full rounded-sm border border-neutral-100 p-1 pr-2 text-base/6 sm:text-lg/6 font-bold text-stone-50 shadow-inner shadow-xl placeholder:text-gray-500 sm:py-1 "
        style={{
          width: width,
        }}
        type="search"
        onInput={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Find items, TMs..."
      />
      <SearchResultsList
        monStyling={false}
        results={searchResults}
        onItemClick={handleClick}
        getItemKey={(item) => item.name}
        getItemDisplayName={(item) => item.name}
        visible={itemMaps.length === 0}
      />
      <SearchSelecta maps={itemMaps} />
    </div>
  );
};

export default Search;
