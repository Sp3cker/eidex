import { CSSProperties, useEffect } from "react";
import { useSprings, animated as a } from "react-spring";
import { useGesture } from "@use-gesture/react";
import { useFilterStore } from "@/stores/filterStore";
import { validTypes } from "@/utils/typeInfo";
type FilterItemsWrapperProps = {
  filterItems: string[];
  selector: any;
  imgStyle: CSSProperties;
  /**
   * Map of the urls the image will use.
   */
  urlMap: Map<string, string>;
};
// const StyledMenuItem = a(styled.div`
//   display: flex;
//   align-items: center;
//   padding: 0.25rem 0.5rem;
//   transform-origin: left;
//   cursor: pointer;
//   border-radius: 8px;
// `);

const normal = {
  x: 0,

  boxShadow: "0px 0px 1px 4px #00000000",
  config: {
    tension: 300,
    // clamp: true,
  },
};
const selectedStlyes = {
  x: 8,
  //   backgroundColor: COLORS.LIGHT_BLUE,
  boxShadow: "0px 0px 2px 2px #17171780",
};
const Types = () => {
  const [selectedFilter, setFilter] = useFilterStore((state) => [
    state.typeValue,
    state.setTypeValue,
  ]);
  const [springs, api] = useSprings(validTypes.length, (i) => {
    if (!selectedFilter) {
      return normal;
    }
    // Check if this type is selected (either as first or second type in tuple)
    const typeId = validTypes[i];
    const isSelected = Array.isArray(selectedFilter)
      ? selectedFilter.includes(typeId)
      : selectedFilter === typeId;

    if (isSelected) {
      return { ...selectedStlyes, immediate: true };
    }
    return normal;
  });

  const bind = useGesture({
    onHover: ({ active, args: [index] }) => {
      if (selectedFilter === validTypes[index]) return;
      api.start((i) => {
        if (index !== i) return;
        return active ? { x: 4 } : { x: 0 };
      });
    },
    onClick: ({ args: [index] }) => {
      handleSelect(index);
    },
  });
  const handleSelect = (index: number) => {
    const selNat = validTypes[index];
    if (selNat === selectedFilter) {
      setFilter(null);
      return;
    }
    //@ts-ignore
    setFilter(selNat);
    api.start((i) => {
      if (i !== index) return normal;
      return selectedStlyes;
    });
  };

  useEffect(() => {
    if (selectedFilter === null) {
      api.start(() => {
        return normal;
      });
    }
  }, [selectedFilter, api]);

  return <div>Hello</div>;
};

export default Types;
