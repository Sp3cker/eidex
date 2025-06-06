import React from "react";
import { getItemSpriteStyle } from "@/utils/itemSprites";

export const EmptyState = React.memo(function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <p className="cool-font py-2 text-center text-sm text-gray-500">
      {message}
    </p>
  );
});

export const ItemListContent = React.memo(function ItemsGrid<
  T extends { name: string; description: string, id: string },
>({ items }: { items: T[] }) {
  if (items.length === 0) {
    return <EmptyState message={"No items here"} />;
  }

  return (
    <div>
      {items.map((item) => {
        // Use 32px display size for better layout, but keep 64px source for crisp quality
        const spriteStyle = getItemSpriteStyle(item.id, 32);
        
        return (
          <div
            key={item.name}
            className="cool-font items-list-item mb-1 flex cursor-pointer items-center gap-3 rounded border border-slate-200 p-2 text-slate-700 shadow-sm transition-colors hover:bg-slate-100 md:py-2"
          >
            {spriteStyle ? (
              <div 
                className="flex-shrink-0 rendering-crisp-edges"
                style={spriteStyle}
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 text-xs text-gray-500 flex-shrink-0">
                ?
              </div>
            )}
            
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className="text-xs/4 font-bold md:text-sm">{item.name}</h3>
              <p className="font-pkmnem text-shadow-2xs leading-4">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default ItemListContent;
