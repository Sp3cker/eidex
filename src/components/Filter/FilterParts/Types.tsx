import { useSprings, animated as a } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { useFilterStore } from "@/stores/filterStore";
import { getTypeColor, getTypeName, validTypes } from "@/utils/typeInfo";
import adjustTypeForDevice from "@/utils/adjustType";
import { useCallback, useState } from "react";

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [springs] = useSprings(
    validTypes.length,
    (i) => {
      const isSelected = selectedFilter?.includes(validTypes[i]);
      const isHovered = hoveredIndex === i;

      if (isSelected) {
        return {
          ...selectedStlyes,
          backgroundColor: isHovered
            ? "var(--color-gray-600)"
            : "var(--color-gray-700)",

        };
      }
      return {
        ...normal,
        x: isHovered ? 0.2 : 0,
      };
    },
    [selectedFilter, hoveredIndex],
  );

  const bind = useGesture({
    onHover: ({ active, args: [index] }) => {
      setHoveredIndex(active ? index : null);
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
