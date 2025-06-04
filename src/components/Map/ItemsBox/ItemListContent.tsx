import React from "react";

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
  T extends { name: string; description: string },
>({ items }: { items: T[] }) {
  if (items.length === 0) {
    return <EmptyState message={"No items here"} />;
  }

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.name}
          className="cool-font items-list-item mb-1 flex cursor-pointer flex-col rounded border border-slate-200 p-2 text-slate-700 shadow-sm transition-colors hover:bg-slate-100 md:py-2"
        >
          <h3 className="text-xs/4 font-bold md:text-sm">{item.name}</h3>
          <p className="font-pkmnem text-shadow-2xs leading-4">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
});

export default ItemListContent;
