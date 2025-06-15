import { useSprings, animated as a } from "react-spring";
import { useGesture } from "@use-gesture/react";
import { useFilterStore } from "@/stores/filterStore";
import { getTypeColor, getTypeName, validTypes } from "@/utils/typeInfo";
import adjustTypeForDevice from "@/utils/adjustType";
import { useCallback } from "react";

const normal = {
  x: 0,
  backgroundColor: "var(--color-gray-500)",
  config: {
    tension: 300,
  },
};
const selectedStlyes = {
  x: 0.4,
  backgroundColor: "var(--color-gray-700)",
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
        api.start((i) => {
          if (i === index) {
            return active
              ? { x: 0.2 }
              : { x: 0 };
          }
          return;
        });
      }
    },

    onClick: ({ args: [index] }) => {
      handleSelect(index);
    },
  });
  const handleSelect = useCallback((index: number) => {
    const selectedTypeId = validTypes[index];
    setFilter("typeValue", selectedTypeId);
  }, []);

  return (
    <div className="grid w-full grid-cols-4 grid-rows-4 items-center justify-center gap-2 px-2 py-2 text-neutral-50">
      {validTypes.map((typeId, index) => (
        <a.div
          key={typeId}
          {...bind(index)}
          style={{
            borderColor: getTypeColor(typeId)[0],
            backgroundColor: springs[index].backgroundColor,
            transform: springs[index].x.to((x) => `translateX(${x}rem)`),
          }}
          className="cursor-pointer rounded-lg border-2 p-1 text-center"
        >
          <p className={`font-pkmnem font-bold tracking-wider`}>
            {adjustTypeForDevice(getTypeName(typeId), "md")}
          </p>
        </a.div>
      ))}
    </div>
  );
};

export default Types;
