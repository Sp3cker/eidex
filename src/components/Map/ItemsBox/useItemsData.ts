import useMapStore from "@/stores/useMapStore";
import { Item } from "@/data/map";
import { ItemsByMap } from "@/utils/itemsData";
import { useMemo } from "react";

export interface ItemWithAmount extends Item {
  amount: number;
}
export type TabType = "story" | "marts" | "pickup";


export const hasAnyItems = (items: ItemsByMap | null): boolean => {
  return (
    items !== null &&
    (items.pickupItems.length > 0 || items.scriptedGives.length > 0)
  );
};

export const useItemsData = (selectedTab: TabType) => {
  const items = useMapStore((state) => state.selectedMapItems);

  const processedData = useMemo(() => {
    if (!items) {
      return {
        items: null,
        hasItems: false,
        hasMarts: false,
        filteredItems: [],
      };
    }

    const hasItems = hasAnyItems(items);
    const hasMarts =
      items.shopItems !== undefined && items.shopItems.length > 0;

    return {
      items,
      hasItems,
      hasMarts,
    };
  }, [items, selectedTab]);

  return processedData;
};
