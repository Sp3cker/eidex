import { useSprings, animated as a } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { useFilterStore } from "@/stores/filterStore";
import {
  // getTypeColor,
  getTypeCSSColors,
  getTypeName,
  validTypes,
} from "@/utils/typeInfo";
import adjustTypeForDevice from "@/utils/adjustType";
import { useCallback, useState } from "react";

// had problems using CSS VAriables
// const gray500 = "#6b7280"; // Tailwind gray-500
// const gray600 = "#4b5563"; // Tailwind gray-600
// const gray700 = "#374151"; // Tailwind gray-700

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

     return {
      x: isSelected ? 0.4 : isHovered ? 0.2 : 0,
      // backgroundColor: isSelected
      //   ? isHovered
      //     ? gray700
      //     : gray600
      //   : "transparent",
      config: {
        tension: 300,
        mass:2

      },
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
    <div className="grid w-full grid-cols-4 grid-rows-4 items-center justify-center gap-2 px-2 py-2 text-neutral-100">
      {springs.map((spring, index) => {
        const isSelected = selectedFilter?.includes(validTypes[index]);

        return (
          <a.div
            role="button"
            key={index}
            {...bind(index)}
            style={{
              // backgroundColor: spring.backgroundColor,
              transform: spring.x.to((x) => `translateX(${x}rem)`),
            }}
            className={`cursor-pointer rounded-lg p-1 text-center`}
          >
            <p
              className={`font-pkmnem pkmnem-face-shadow font-bold ${isSelected ? "ring-2 ring-white" : ""} tracking-wider ${getTypeCSSColors([validTypes[index], 0])[0]}`}
            >
              {adjustTypeForDevice(getTypeName(validTypes[index]), "md")}
            </p>
          </a.div>
        );
      })}
    </div>
  );
};

export default Types;
