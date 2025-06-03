import React from "react";
import { Item, ScriptedGive } from "@/data/map";
import { TabType } from "./useItemsData";
import { ItemsByMap } from "@/utils/itemsData";

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

export const SelectedItems = React.memo(function ItemsGrid({
  items,
}: {
  selectedTab: TabType;
  items: Item[];
}) {
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
          <p className="text-xs/4 font-bold md:text-sm">{item.name}</p>
          <p className="font-pkmnem text-shadow-2xs leading-4">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
});
const ItemsListContent = ({ item }: { item: ScriptedGive }) => (
  <>
    <h3
      key={item.scriptName}
      className="cool-font md:text-md mb-2 mt-2 border-b-2 border-stone-400 pb-1 text-xs font-bold"
    >
      {item.scriptName}
    </h3>
    <SelectedItems items={item.items} />
  </>
);
export default ItemsListContent;
