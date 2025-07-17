import { getAbility } from "@/utils/abilityData";
import { Items } from "@/data/map";
import { getItemSpriteStyle } from "@/utils/itemSprites";
import { ErrorBoundary } from "react-error-boundary";

const HeldItemIcon = ({ heldItem }: { heldItem: string }) => {
  const spriteStyle = getItemSpriteStyle(heldItem, 24); // Changed from 64 to 32
  const itemName = Items.get(heldItem);

  return spriteStyle ? (
    <div className="absolute right-2 top-1 mt-auto flex size-max h-8 flex-row items-center rounded-sm pl-1 pr-2 ring-1 ring-stone-300">
      <img
        src="/spritesheet-items-16.webp"
        className="shrink-0"
        style={spriteStyle}
      />
      <p>{itemName?.name}</p>
    </div>
  ) : (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">
      Item not found (ID: ${heldItem})
    </div>
  );
};

const AbilityDesc = ({ ability }: { ability: number[] }) => {
  const abilityNames = ability.map(getAbility);

  if (abilityNames.length === 0) {
    return <div className="text-red-500">Unknown Ability \(${ability})</div>;
  }
  return abilityNames.map((a) =>
    a ? (
      <div key={a?.name} className="absolute left-1 h-8 w-max">
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
  const show = heldItem || ability;
  return (
    <div
      className={`relative h-10 gap-x-2 rounded ${show ? "bg-blue-50" : "bg-gray-200"} px-2 ring-1 ring-blue-100`}
    >
      {!heldItem && !ability ? (
        <div className="absolute left-0 right-0 top-1/2 mx-auto h-7 w-fit -translate-y-1/2 transform rounded bg-blue-50 px-2 pt-1 ring-1 ring-blue-100">
          <p className="font-calamity text-center text-xs text-[var(--color-blue-text)]">
            No item or ability
          </p>
        </div>
      ) : (
        <>
          <ErrorBoundary fallback={<div>Error loading ability</div>}>
            {ability && <AbilityDesc ability={ability} />}
          </ErrorBoundary>
          <ErrorBoundary fallback={<div>Error loading held item</div>}>
            {heldItem && <HeldItemIcon heldItem={heldItem} />}
          </ErrorBoundary>
        </>
      )}
    </div>
  );
};
export default PartyMonItemAbility;
