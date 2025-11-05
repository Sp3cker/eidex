import { getItemSpriteStyle } from "@/utils/itemSprites";
import { BaseListContent } from "./BaseListContent";
import { Item, ItemWithAmount } from "@/data/map";
const ItemListRender = (showPrice: boolean) => (item: ItemWithAmount) => (
  <hgroup className="min-w-0">
    <div className="flex min-w-0 flex-row items-start justify-between gap-2">
      <h3 className="font-pixel text-shadow-2xs min-w-0 flex-1 break-words pl-1 font-light md:text-sm">
        {(item as { name?: string }).name || "Unnamed"}
      </h3>
      <p className="font-pkmnem text-shadow-xs shrink-0 pr-4 leading-4">
        {showPrice ? "$" + item.price : "x" + item.amount}
      </p>
    </div>
    {(item as { description?: string }).description && (
      <p className="font-pkmnem break-words pl-1 text-xs leading-3 md:leading-4">
        {(item as { description?: string }).description}
      </p>
    )}
  </hgroup>
);
const renderIcon = (item: Item) => {
  const spriteStyle = getItemSpriteStyle(item.id, 24); // Changed from 64 to 32

  return spriteStyle ? (
    <img
      src="/spritesheet-items-16.webp"
      className="shrink-0"
      style={spriteStyle}
    />
  ) : (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">
      ?
    </div>
  );
};

export const ItemListContent = function ItemListContent<
  T extends ItemWithAmount,
>({ items, showPrice }: { items: T[]; showPrice: boolean }) {
  const getKey = (item: T) => item.name;

  return (
    <BaseListContent
      renderContent={ItemListRender(showPrice)}
      items={items}
      emptyMessage="No items here"
      className="items-list-item border-slate-200 text-slate-700 md:py-2"
      renderIcon={renderIcon}
      getKey={getKey}
    />
  );
};

export default ItemListContent;
