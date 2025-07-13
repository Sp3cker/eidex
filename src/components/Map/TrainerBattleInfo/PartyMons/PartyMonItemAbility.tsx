import { getAbility } from "@/utils/abilityData";
import { Items } from "@/data/map";
import { getItemSpriteStyle } from "@/utils/itemSprites";
import { ErrorBoundary } from "react-error-boundary";

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
    a ? (
      <div key={a?.name} className="h-8">
        <h4>{a.name}</h4>
        <p className="text-sm/1">{a.description}</p>
      </div>
    ) : null,
  );
};

const PartyMonItemAbility = ({
  heldItem,
  ability,
}: {
  heldItem?: string;
  ability?: number[];
}) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-2 rounded bg-zinc-200 p-1 pt-0">
      <ErrorBoundary fallback={<div>Error loading ability</div>}>
        {ability && <AbilityDesc ability={ability} />}
      </ErrorBoundary>
      <ErrorBoundary fallback={<div>Error loading held item</div>}>
        {heldItem && <HeldItemIcon heldItem={heldItem} />}
      </ErrorBoundary>
    </div>
  );
};
export default PartyMonItemAbility;
