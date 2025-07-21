import { getAbility } from "@/utils/abilityData";
import itemSearch from "@/utils/itemsData";
import { getItemSpriteStyle } from "@/utils/itemSprites";
import { ErrorBoundary } from "react-error-boundary";

const HeldItemIcon = ({ heldItem }: { heldItem: string }) => {
  const [{ id }] = itemSearch.trie.get(heldItem);
  const spriteStyle = id ? getItemSpriteStyle(id, 24) : undefined;

  return spriteStyle ? (
    <div className="absolute right-2 top-1 mt-auto flex size-max h-8 flex-row items-center rounded-sm pl-1 pr-2 ring-1 ring-stone-300">
      <img
        src="/spritesheet-items-16.webp"
        className="shrink-0"
        style={spriteStyle}
      />
      <p>{heldItem}</p>
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
  return (
    <div
      className={`absolute left-1 flex flex-col h-9 w-max rounded bg-blue-50 px-2`}
    >
      {<p className="font-calamity text-xs/5 text-stone-800">Ability could be:</p>}
      <div className="flex flex-row items-center justify-center gap-x-2 ">
      {abilityNames.map((a, i) =>
        a ? (
          <div key={a?.name} className="">
            <h4
              className={`${abilityNames.length > 1 ? "font-calamity text-xs font-bold" : "font-calamity text-xs/6 font-bold"}`}
            >
              {a.name}
            </h4>
            <p className={`text-sm/1 md:text-base/2 whitespace-nowrap ${i === 2 ? "text-fuchsia-600" : "text-gray-800"}`}>
              {abilityNames.length === 1 && a.description}
            </p>
          </div>
        ) : null,
      )}
      </div>
    </div>
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
