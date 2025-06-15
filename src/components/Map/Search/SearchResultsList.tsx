import { useSprings, useTransition, animated as a } from "react-spring";
import { useGesture } from "@use-gesture/react";
import { animConfigs, animFn as fn } from "./misc";
import { formatMapString } from "@/utils/formatMapString";
import { useMemo } from "react";
interface SearchResult {
  name: string;
  id?: string;
  maps?: string[];
}

interface SearchResultsListProps {
  results: SearchResult[];
  onItemClick: (item: SearchResult, index: number) => void;
  getItemKey: (item: SearchResult) => string;
  getItemDisplayName: (item: SearchResult) => string;
  visible?: boolean;
  monStyling: boolean;
}

export const SearchResultsList = ({
  results,
  monStyling,
  onItemClick,
  getItemKey,
  getItemDisplayName,
  visible = true,
}: SearchResultsListProps) => {
  const [springs, api] = useSprings(
    results.length,
    () => ({ ...animConfigs.initial, config: { friction: 50, tension: 500 } }),
    [results],
  );
  const RESULT_SPACING = useMemo(() => (monStyling ? 60 : 40), []);
  const transitions = useTransition(results, {
    key: getItemKey,
    from: (_, index) => ({
      translateX: 100,
      translateY: index * RESULT_SPACING + 10,
    }),
    enter: (_, index) => {
      return {
        translateY: index * RESULT_SPACING,
        translateX: 0,
      };
    },
    update: (_, index) => {
      return {
        translateY: index * RESULT_SPACING,
        translateX: 0,
      };
    },
    config: { frequency: 0.21, damping: 1.2 },
    trail: 21,
  });

  const bind = useGesture({
    onClick: ({ args: [item, index] }) => {
      onItemClick(item, index);
    },
    onDrag: ({ down, args: [, index] }) => {
      api.start((i) => {
        if (index !== i) return;
        return down ? animConfigs.click : animConfigs.hover;
      });
    },
    onHover: ({ active, args: [, index] }) => {
      api.start((i) => {
        if (index !== i) return;
        return fn(active);
      });
    },
  });

  if (!visible) return null;

  return (
    <ul className="relative">
      {transitions((styles, item, _, index) => (
        <a.li
          {...bind(item, index)}
          className={`search-result will-translate my-dib absolute w-full cursor-pointer rounded-sm bg-neutral-100 p-2`}
          style={{
            scale: springs[index]?.scale,
            boxShadow: springs[index]?.shadow.to(
              (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`,
            ),
            ...styles,
          }}
        >
          <span className="flex flex-col">
            <p className="text-sm">{getItemDisplayName(item)}</p>
            {monStyling && (
              <p className="font-pkmnem">
                {item.maps && item.maps.length > 0 ? (
                  <strong>{item.maps.map(formatMapString).join(",")}</strong>
                ) : (
                  "View in Dex"
                )}
              </p>
            )}
          </span>
        </a.li>
      ))}
    </ul>
  );
};
