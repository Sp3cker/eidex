import useMapStore from "@/stores/useMapStore";
import { Item } from "@/data/map";
import { ItemsByMap } from "@/utils/itemsData";
import { useMemo } from "react";

export interface ItemWithAmount extends Item {
  amount: number;
}
export type TabType = "story" | "marts" | "pickup";
export type ItemsToReturn =
  | {
      type: "story";
      items: { scriptName: string; items: Item[]; pokemon: string[] }[];
    }
  | { type: "marts"; items: Item[] }
  | { type: "pickup"; items: Item[] };

export const hasAnyItems = (items: ItemsByMap | null): boolean => {
  return (
    items !== null &&
    (items.pickupItems.length > 0 || items.scriptedGives.length > 0)
  );
};

export const useItemsData = (selectedTab: TabType): ItemsToReturn => {
  const items = useMapStore((state) => state.selectedMapItems);

  const processedData = useMemo(() => {
    if (!items) {
      if (selectedTab === "story") {
        return { type: "story" as const, items: [] };
      } else if (selectedTab === "marts") {
        return { type: "marts" as const, items: [] };
      } else {
        return { type: "pickup" as const, items: [] };
      }
    }
    if (selectedTab === "story") {
      return { type: "story" as const, items: items.scriptedGives };
    } else if (selectedTab === "marts") {
      return { type: "marts" as const, items: items.shopItems };
    } else {
      return { type: "pickup" as const, items: items.pickupItems };
    }
  }, [items, selectedTab]);

  return processedData;
};

function isStoryItems(
  data: ItemsToReturn
): data is Extract<ItemsToReturn, { type: "story" }> {
  return data.type === "story";
}

function isMartsItems(
  data: ItemsToReturn
): data is Extract<ItemsToReturn, { type: "marts" }> {
  return data.type === "marts";
}

function isPickupItems(
  data: ItemsToReturn
): data is Extract<ItemsToReturn, { type: "pickup" }> {
  return data.type === "pickup";
}

export { isStoryItems, isMartsItems, isPickupItems };
