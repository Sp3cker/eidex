import { getTypeName, getTypeSnapColor } from "@/utils/typeInfo";
import { typeIcons } from "@/utils/typeIcons";
import adjustTypeForDevice from "@/utils/adjustType";
import React from "react";

const makeBackgroundStyle = (typeColor: string, screenWidth: string) =>
  `linear-gradient(120deg, ${typeColor} 0 ${screenWidth === "md" ? "36%" : "40%"}, var(--color-stone-700) 33% 100%)`;

const TypeBadge = React.memo(function TypeBadge({
  typeId,
  screenWidth,
}: {
  typeId: number;
  screenWidth: string;
}) {
  const name = adjustTypeForDevice(getTypeName(typeId), screenWidth);
  const color = getTypeSnapColor(typeId);
  const icon = typeIcons[typeId];
  const width = screenWidth === 'sm' ? 'w-[4.5rem]':'w-[5rem]'
  const spriteBackground = makeBackgroundStyle(color, screenWidth);

  return (
    <div
      className={`relative inline-flex h-[1.25rem] pt-0.25 ${width} select-none items-center overflow-hidden rounded-full`}
      style={{ background: spriteBackground }}
    >
      <span className="flex h-full w-full flex-row items-center">
        {/* Icon container */}
        <span className="flex h-full w-[2rem] items-center">
          {icon && (
            <img
              src={icon}
              alt={name}
              className="h-6 w-20 object-contain"
              aria-hidden="true"
            />
          )}
        </span>
        {/* Name container */}
        <span className="flex h-full flex-1 items-center justify-center">
          <p className="pr-1 font-pkmnem text-lg sm:text-md font-bold text-neutral-100/90 ">
            {name}
          </p>
        </span>
      </span>
    </div>
  );
});

export { TypeBadge };
