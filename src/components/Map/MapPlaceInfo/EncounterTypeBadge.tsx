import { getTypeCSSColors, getTypeName } from "@/utils/typeInfo";
import adjustTypeForDevice from "@/utils/adjustType";
import { memo } from "react";
/**
 *
 * @param color class name from 'types-colors.css'
 * @param typeName NRM, FIR...
 * @returns
 */
const Badge = (props: { color: string; typeName: string }) => (
    <p
      className={`w-7 ${props.color} font-pkmnem pkmnem-face-shadow font-bold tracking-wider h-4`}
    >
      {props.typeName}
    </p>

);
const EncounterTypeBadge = memo(function ETypeBadge({
  types,
}: {
  types: [number, number];
}) {
  const typeColors = getTypeCSSColors(types);
  return (
    <div className="flex flex-row text-center gap-[1px]">
      <Badge
        typeName={adjustTypeForDevice(getTypeName(types[0]), "sm")}
        color={typeColors[0]}
      />
      {types[1] && (
        <Badge
          typeName={adjustTypeForDevice(getTypeName(types[1]), "sm")}
          color={typeColors[1]}
        />
      )}
    </div>
  );
});

export { EncounterTypeBadge };
