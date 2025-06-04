// import { useEffect } from "react";
import { useMapStore } from "@/stores/useMapStore";
import { useItemSearch } from "@/utils/itemsData";
import { useTransition, animated as a, useSprings } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { useCallback,  useState } from "react";
import SearchSelecta from "./SearchSelecta";

const SEARCH_RESULT_SPACING = window.innerWidth < 400 ? 40 : 40;
const animConfigs = {
  hover: { shadow: 15 },
  initial: { scale: 1, shadow: 1 },
  click: {
    scale: 1.01,
  },
};

const fn = (active: boolean) =>
  active ? animConfigs.hover : animConfigs.initial;
// const clickTo = (down: boolean) => down ? {scale}

const ErrorBanner = ({ show }: { show: boolean }) => {
  const transitions = useTransition(show, {
    from: { opacity: 0, translateY: -40 },
    enter: { opacity: 1, translateY: 0 },
    leave: { opacity: 0, translateY: -40 },
    config: { tension: 300, friction: 30 },
  });
  return transitions((style, item) =>
    item ? (
      <a.div
        style={style}
        className="absolute left-0 right-0 z-50 mx-auto mt-2 w-fit rounded border-2 border-red-500 bg-neutral-100/80 px-4 py-2 text-center font-bold text-red-800 shadow-lg backdrop-blur-md"
      >
        Item Not Available in-game
      </a.div>
    ) : null,
  );
};

const Search = () => {
  const setSelectedMap = useMapStore((state) => state.setSelectedMap);
  const deSelectMap = useMapStore((state) => state.deselectMap);
  const [itemMaps, setItemMaps] = useState<string[]>([]);
  const [
    searchTerm,
    searchResults,
    setSearchName,
    clearSearch,
    getMapsForItem,
  ] = useItemSearch();
  const [showError, setShowError] = useState(false);

  const [springs, api] = useSprings(
    searchResults.length,
    () => ({ ...animConfigs.initial, config: { friction: 50, tension: 500 } }),
    [searchResults],
  );

  const bind = useGesture({
    // onAuxClick: ({ args: [index] }) => handleMiddleClick(index),
    onClick: ({ args: [index] }) => {
      handleClick(index);
    },
    onDrag: ({ down, args: [index] }) => {
      api.start((i) => {
        if (index !== i) return;
        return down ? animConfigs.click : animConfigs.hover;
      });
    },
    onHover: ({ active, args: [index] }) => {
      api.start((i) => {
        if (index !== i) return;
        return fn(active);
      });
    },
  });

  const handleClick = (index: number) => {
    const { name, id } = searchResults[index];
    setSearchName(name);

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
  };

  const transitions = useTransition(searchResults, {
    key: (item: any) => item.name,
    from: (_, index) => ({
      // opacity: 0,
      translateX: 100,
      translateY: index * SEARCH_RESULT_SPACING + 10,
    }),
    // leave: { opacity: 0, translateX: 13 },
    enter: (_, index) => {
      return {
        translateY: index * SEARCH_RESULT_SPACING,
        translateX: 0,
        // opacity: 1,
      };
    },
    update: (_, index) => {
      return {
        translateY: index * SEARCH_RESULT_SPACING,
        translateX: 0,
        // opacity: 1,
      };
    },
    // exitBeforeEnter: true,
    config: { frequency: 0.21, damping: 1.2 },
    trail: 21,
  });
  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    deSelectMap();
    setItemMaps([]);
    setSearchName(e.currentTarget.value);
  }, []);

  return (
    <div className="content-visible cool-font search-bar-grid relative w-full">
      <ErrorBanner show={showError} />
      <input
        value={searchTerm}
        className="search-input mb-2 w-full rounded-sm border border-neutral-100 p-1 py-1 pl-1 pr-2 text-sm/6 text-neutral-50 shadow-inner shadow-xl"
        type="search"
        onInput={handleChange}
        placeholder="Find items, TMs..."
      />
      <ul className="relative">
        {itemMaps.length == 0 && transitions((styles, item, _, index) => (
            <a.li
              {...bind(index)}
              className="search-result will-translate my-dib absolute w-full cursor-pointer rounded-sm bg-neutral-100 p-2"
              style={{
                // zIndex: results.length - index,
                scale: springs[index]?.scale,
                boxShadow: springs[index]?.shadow.to(
                  (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`,
                ),
                ...styles,
              }}
            >
              <span>
                <p className="text-sm">{item.name}</p>
                {/* <SearchResult {...item} key={item.name} /> */}
              </span>
            </a.li>
          ))}
      </ul>
      <SearchSelecta maps={itemMaps} />
    </div>
  );
};

export default Search;
