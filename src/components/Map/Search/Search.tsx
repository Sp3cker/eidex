// import { useEffect } from "react";
import { useMapStore } from "@/stores/useMapStore";
import { useItemSearch } from "@/utils/itemsData";
import { useTransition, animated as a, useSprings } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";

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

const Search = () => {
  const setSelectedMap = useMapStore((state) => state.setSelectedMap);
  const [searchResults, setSearchName] = useItemSearch();

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
    setSelectedMap(searchResults[index].map);
    setSearchName(searchResults[index].name)
  };

  // const handleMiddleClick = (index: number) => {
  //   window.open(`/?ship=${results[index].name}`, "_blank");
  // };
  // const transFunction = searchResults.map((items, ind) => ({
  //   ...items,
  //   y: ind * SEARCH_RESULT_SPACING,
  // }));
  const transitions = useTransition(searchResults, {
    key: (item: any) => item.name,
    from: (_, index) => ({
      opacity: 0,
      translateX: 100,
      translateY: index * SEARCH_RESULT_SPACING + 10,
    }),
    // leave: { opacity: 0, translateX: 13 },
    enter: (_, index) => {
      return {
        translateY: index * SEARCH_RESULT_SPACING,
        translateX: 0,
        opacity: 1,
      };
    },
    update: (_, index) => {
      return {
        translateY: index * SEARCH_RESULT_SPACING,
        translateX: 0,
        opacity: 1,
      };
    },
    // exitBeforeEnter: true,
    config: { frequency: 0.21, damping: 1.2 },
    trail: 21,
  });
  // useEffect(() => {
  //   if (searchResults.length === 1) {
  //     setSelectedMap(searchResults[0].map);
  //   }
  // }, [searchResults]);

  return (
    <div className="content-visible w-full cool-font search-bar-grid">
      <input
        className="search-input w-full py-1 mb-2 rounded-sm p-1 pl-1 pr-2 text-sm/6 shadow-xl ring-2 ring-blue-500"
        type="search"
        onInput={(e) => setSearchName(e.currentTarget.value)}
        placeholder="Items, TMs..."
      />
      <ul className="relative">
        {transitions((styles, item, _, index) => (
          <a.li
            {...bind(index)}
            className="my-dib absolute w-full cursor-pointer rounded-sm bg-neutral-100 p-2"
            style={{
              // zIndex: results.length - index,
              scale: springs[index]?.scale,
              boxShadow: springs[index]?.shadow.to(
                (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`,
              ),
              ...styles,
            }}
          >
            <span >
              <p className="text-sm">{item.name}</p>
              {/* <SearchResult {...item} key={item.name} /> */}
            </span>
          </a.li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
