import { useMapStore } from "@/stores/useMapStore";
import { useItemSearch } from "@/utils/itemsData";
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
  const [showError, setShowError] = useState(false);
  const width = useSpringValue("10rem"); // Initialize with CSS value
  // Animate width based on selection state
  useEffect(() => {
    if (itemSearchSelected) {
      // Expand to full width when selected
      width.start("10rem");
    } else {
      // Shrink to a smaller width when not selected
      width.start("4rem");
    }
  }, [itemSearchSelected, width]);

  const handleClick = useCallback(
    (_: any, index: number) => {
      const { name, id } = searchResults[index];
      setSearchName(name);

      if (!id) return;

      const maps = getMapsForItem(id);
      if (maps && maps.length > 0) {
        setItemMaps(maps);
        clearSearch();
        setSelectedMap(maps[0]);
        setShowError(false);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 2000);
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
      setShowError,
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
      <ErrorBanner show={showError} />
      <a.input
        ref={inputRef}
        value={searchTerm}
        className="search-input mb-2 w-full rounded-sm border border-neutral-100 p-1 py-1 pl-1 pr-2 text-sm/6 text-neutral-50 shadow-inner shadow-xl"
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
