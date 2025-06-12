import { CSSProperties, useEffect } from "react";
import { useSprings, animated as a } from "react-spring";
import { useGesture } from "@use-gesture/react";
import { useFilterStore } from "@/stores/filterStore";
import { getTypeName, validTypes } from "@/utils/typeInfo";
import { TypeBadge } from "@/components/TypeBadges/TypeBadge";

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
  // boxShadow: "0px 0px 1px 4px #00000000",
  backgroundColor: "var(--color-gray-500)",
  config: {
    tension: 300,

  },
};
const selectedStlyes = {
  x: 0.4,
  backgroundColor: "var(--color-gray-700)",
  // boxShadow: "0px 0px 2px 2px #17171780",
};

const Types = () => {
  const [selectedFilter, setFilter] = useFilterStore((state) => [
    state.typeValue,
    state.setFilter,
  ]);
  const [springs, api] = useSprings(
    validTypes.length,
    (i) => {
      if (!selectedFilter) {
        return normal;
      }
      // Check if this type is selected (either as first or second type in tuple)
      const typeId = validTypes[i];
      const isSelected = selectedFilter.includes(typeId);

      if (isSelected) {
        return { ...selectedStlyes };
      }
      return normal;
    },
    [selectedFilter],
  );

  const bind = useGesture({
    onHover: ({ active, args: [index] }) => {
      const hoveredType = validTypes[index];
      const isSelected = selectedFilter?.includes(hoveredType) || false;

      if (isSelected) {
        // Hovering on currently selected Type
        api.start((i) => {
          if (i === index) {
            return active
              ? { backgroundColor: "var(--color-gray-600)" }
              : { backgroundColor: "var(--color-gray-700)" }; // Back to selected color
          }
          return;
        });
      } else {
        // Unselected items: animate x translation on hover
        api.start((i) => {
          if (i === index) {
            return active
              ? { x: 0.2 } // Slide on hover
              : { x: 0 }; // Back to normal position
          }
          return;
        });
      }
    },

    onClick: ({ args: [index] }) => {
      debugger;
      handleSelect(index);
    },
  });
  const handleSelect = (index: number) => {
    const selectedTypeId = validTypes[index];
    setFilter("typeValue", selectedTypeId);
  };

  // useEffect(() => {
  //   if (!selectedFilter) {
  //     api.start(() => normal);
  //   }
  // }, [selectedFilter, api]);

  return (
    <div className="grid grid-cols-4 grid-rows-4 w-full items-center justify-center gap-2 px-2 py-2 text-neutral-50">
      {validTypes.map((typeId, index) => (
        <a.div
          key={typeId}
          {...bind(index)}
          style={{
            backgroundColor: springs[index].backgroundColor,
            transform: springs[index].x.to((x) => `translateX(${x}rem)`),
          }}
          className="cursor-pointer rounded-lg border-2 border-gray-300 p-2 hover:border-blue-400"
        >
          {/* Your type display content here */}
          <TypeBadge typeId={typeId} screenWidth="sm"/>
        </a.div>
      ))}
    </div>
  );
};

export default Types;
