import { useState } from "react";
import { useSprings } from "@react-spring/web";
import { getAbility } from "@/utils/abilityData";
import { Items } from "@/data/map";
import { getItemSpriteStyle } from "@/utils/itemSprites";

const HeldItemIcon = ({ heldItem }: { heldItem: string }) => {
  const spriteStyle = getItemSpriteStyle(heldItem, 24); // Changed from 64 to 32
  const itemName = Items.get(heldItem);
  return spriteStyle ? (
    <div className="flex size-max flex-row items-center px-1 ring-1 ring-stone-300">
      <img
        src="/spritesheet-items-16.webp"
        className="shrink-0"
        style={spriteStyle}
      />
      <p>{itemName?.name}</p>
    </div>
  ) : (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">
      ?
    </div>
  );
};

const AbilityDesc = ({ ability }: { ability: number[] }) => {
  const abilityNames = ability.map(getAbility);

  if (abilityNames.length === 0) {
    return <div className="text-red-500">Unknown Ability</div>;
  }
  return abilityNames.map((a) =>
    a ? <div key={a?.name}>{a.name}</div> : null,
  );
};

const PartyMonItemAbility = ({
  item,
  ability,
}: {
  item?: string;
  ability?: number[];
}) => {
  const [selectedItem, setSelectedItem] = useState(0); // 0 item, 1 ability, 2 nature
  const tooltipSpring = useSprings();
  return (
    <div className="flex flex-row items-center justify-between gap-x-2 rounded bg-zinc-100 p-1">
      {ability && <AbilityDesc ability={ability} />}
      {item && <HeldItemIcon heldItem={item} />}
    </div>
  );
};
