import React from "react";
import { getItemSpriteStyle } from "@/utils/itemSprites";
import { BaseListContent } from "./BaseListContent";

export const ItemListContent = React.memo(function ItemListContent<
  T extends { name: string; description: string; id: string },
>({ items }: { items: T[] }) {
  const renderIcon = (item: T) => {
    const spriteStyle = getItemSpriteStyle(item.id, 32);
    
    return spriteStyle ? (
      <div
        className="rendering-crisp-edges flex-shrink-0"
        style={spriteStyle}
      />
    ) : (
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">
        ?
      </div>
    );
  };

  const getKey = (item: T) => item.name;

  return (
    <BaseListContent
      items={items}
      emptyMessage="No items here"
      className="items-list-item border-slate-200 text-slate-700 hover:bg-slate-100 md:py-2"
      renderIcon={renderIcon}
      getKey={getKey}
    />
  );
});

export default ItemListContent;
