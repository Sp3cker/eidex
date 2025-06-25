import { getItemSpriteStyle } from "@/utils/itemSprites";
import { BaseListContent } from "./BaseListContent";
import { Item, ItemWithAmount } from "@/data/map";
const ItemListRender = (showPrice: boolean) => (item: ItemWithAmount) => (
  <hgroup>
    <div className="flex flex-row justify-between">
      <h3 className="text-xs/4 font-bold md:text-sm">
        {(item as { name?: string }).name || "Unnamed"}
      </h3>
      <p className="font-pkmnem text-shadow-xs pr-4 text-lg leading-4">
        {showPrice ? "$" + item.price : "x" + item.amount}
      </p>
    </div>
    {(item as { description?: string }).description && (
      <p className="font-pkmnem text-shadow-2xs leading-3 md:leading-4">
        {(item as { description?: string }).description}
      </p>
    )}
  </hgroup>
);
const renderIcon = (item: Item) => {
  const spriteStyle = getItemSpriteStyle(item.id,24); // Changed from 64 to 32

  return spriteStyle ? (
      <img
        src="/spritesheet-items-16.webp"
        className=" flex-shrink-0"
        style={spriteStyle}
      />

  ) : (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">
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
      className="items-list-item border-slate-200 text-slate-700 hover:bg-slate-100 md:py-2"
      renderIcon={renderIcon}
      getKey={getKey}
    />
  );
};

export default ItemListContent;
