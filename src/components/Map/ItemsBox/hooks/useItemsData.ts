import useMapStore from "@/stores/useMapStore";

import type { Item, LevelScriptedEvent } from "@/data/map";
import type { ItemsByMap } from "@/utils/itemsData";
import { useMemo, useEffect, useState } from "react";

export interface ItemWithAmount extends Item {
  amount: number;
}
export type TabType = "story" | "marts" | "pickup";
export type ItemsToReturn = {
  whatToShow: {
    story: boolean;
    marts: boolean;
    pickup: boolean;
  };
  items:
    | {
        type: "story";
        items: LevelScriptedEvent[];
      }
    | { type: "marts"; items: Item[] }
    | { type: "pickup"; items: Item[] };
};

export const hasAnyItems = (items: ItemsByMap | null): boolean => {
  return (
    items !== null &&
    (items.pickupItems.length > 0 || items.scriptedGives.length > 0)
  );
};
/** Zustand state comparator */
function itemsArrayEqual(
  a?: ItemsByMap | null,
  b?: ItemsByMap | null,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  // Helper to compare arrays of items by id
  const compareItemArrays = (arrA: Item[] = [], arrB: Item[] = []) => {
    if (arrA.length !== arrB.length) return false;
    for (let i = 0; i < arrA.length; i++) {
      if (arrA[i].id !== arrB[i].id) return false;
    }
    return true;
  };

  // Compare shopItems and pickupItems
  if (!compareItemArrays(a.shopItems, b.shopItems)) return false;
  if (!compareItemArrays(a.pickupItems, b.pickupItems)) return false;

  // Compare scriptedGives by scriptName and their items
  if (a.scriptedGives.length !== b.scriptedGives.length) return false;
  for (let i = 0; i < a.scriptedGives.length; i++) {
    const giveA = a.scriptedGives[i];
    const giveB = b.scriptedGives[i];
    if (giveA.scriptName !== giveB.scriptName) return false;
    if (!compareItemArrays(giveA.items, giveB.items)) return false;
    // Optionally compare pokemon arrays if needed
    if (
      giveA.pokemon.length !== giveB.pokemon.length ||
      giveA.pokemon.some((p, idx) => p !== giveB.pokemon[idx])
    )
      return false;
  }

  return true;
}
function sumItemsByName<T extends { name: string }>(items: T[]): T[] {
  const map = new Map<string, T & { amount: number }>();
  for (const item of items) {
    if (map.has(item.name)) {
      map.get(item.name)!.amount += 1;
    } else {
      map.set(item.name, { ...item, amount: 1 });
    }
  }
  return Array.from(map.values());
}
export const useItemsData = (selectedTab: TabType): ItemsToReturn => {
  const [items, setItems] = useState<ItemsByMap | null>(
    () => useMapStore.getState().selectedMapItems,
  );

  useEffect(() => {
    const currentItems = useMapStore.getState().selectedMapItems;
    if (!itemsArrayEqual(currentItems, items)) {
      setItems(currentItems);
    }

    const unsubscribe = useMapStore.subscribe(
      (state) => state.selectedMapItems,
      (newItems) => setItems(newItems ?? null),
      {
        equalityFn: itemsArrayEqual,
        fireImmediately: false,
      },
    );

    return unsubscribe;
  }, []);

  const processedData = useMemo(() => {
    if (!items) {
      const whatToShow = {
        story: false,
        marts: false,
        pickup: false,
      };
      if (selectedTab === "story") {
        return { whatToShow, items: { type: "story" as const, items: [] } };
      } else if (selectedTab === "marts") {
        return { whatToShow, items: { type: "marts" as const, items: [] } };
      } else {
        return { whatToShow, items: { type: "pickup" as const, items: [] } };
      }
    }
    const whatToShow = {
      story: items.scriptedGives.length > 0,
      marts: items.shopItems.length > 0,
      pickup: items.pickupItems.length > 0,
    };
    if (selectedTab === "story") {
      // const groupedAndSummed = Object.values(
      //   items.scriptedGives.reduce<
      //     Record<
      //       string,
      //       LevelScriptedEvent & {
      //         items: Item[];
      //         pokemon: LevelScriptedEventMon[];
      //       }
      //     >
      //   >((acc, curr) => {
      //     if (!acc[curr.explanation]) {
      //       acc[curr.explanation] = {
      //         scriptName: curr.scriptName,
      //         explanation: curr.explanation,
      //         items: [],
      //         pokemon: [],
      //       };
      //     }
      //     acc[curr.explanation].items.push(...curr.items);
      //     acc[curr.explanation].pokemon.push(...curr.pokemon);
      //     return acc;
      //   }, {}),
      // ).map((group) => ({
      //   explanation: group.explanation,
      //   scriptName: group.scriptName,
      //   items: sumItemsByName(group.items) as ItemWithAmount[],
      //   pokemon: group.pokemon,
      // })) as LevelScriptedEvent[];

      return {
        whatToShow,
        items: { type: "story" as const, items: items.scriptedGives },
      };
    } else if (selectedTab === "marts") {
      return {
        whatToShow,
        items: { type: "marts" as const, items: items.shopItems },
      };
    } else {
      return {
        whatToShow,
        items: {
          type: "pickup" as const,
          items: sumItemsByName(items.pickupItems),
        },
      };
    }
  }, [items, selectedTab]);

  return processedData;
};

function isStoryItems(
  data: ItemsToReturn,
): data is Extract<ItemsToReturn, { type: "story" }> {
  return data.items.type === "story";
}

function isMartsItems(
  data: ItemsToReturn,
): data is Extract<ItemsToReturn, { type: "marts" }> {
  return data.items.type === "marts";
}

function isPickupItems(
  data: ItemsToReturn,
): data is Extract<ItemsToReturn, { type: "pickup" }> {
  return data.items.type === "pickup";
}

export { isStoryItems, isMartsItems, isPickupItems };
