import {
  LevelsInfo,
  Item,
  Items,
  ItemWithCoords,
  LevelScriptedEvent,
  LevelScriptedEventMon,
  LevelMart,
  ItemWithAmount,
} from "@/data/map";
import { useCallback, useEffect, useState } from "react";

import TrieSearch from "trie-search";

/**
 * This is the processed version of `LevelScriptedEvent`
 * `items` has an amount, price, etc...
 */
export type ItemsByMap = {
  scriptedGives: LevelScriptedEvent[];
  shopItems: Item[];
  pickupItems: ItemWithCoords[];
};

class ItemSearch {
  /**
   * Search for an item
   */
  trie: TrieSearch<Item>;
  /**
   * Array of places to find items.
   */
  itemsToMap: Map<string, string[]>;
  constructor() {
    this.trie = new TrieSearch<Item>("name", {
      min: 2,
      cache: true,
      idFieldOrFunction: "name",
    });

    this.trie.addAll(Array.from(Items.values()));

    this.itemsToMap = new Map();

    for (const mapLevels of Object.values(LevelsInfo)) {
      mapLevels.forEach((map) => {
        map.pickupItems.forEach((item) => {
          this.throwOnPile(item.item, map.baseMap);
        });
        map.scriptedGives.forEach((script) => {
          script.items.forEach((item: ItemWithAmount) =>
            this.throwOnPile(item.id, map.baseMap),
          );
          script.pokemon.forEach((pokemon: LevelScriptedEventMon) =>
            this.throwOnPile(pokemon.species, map.baseMap),
          );
        });

        map.shopItems.forEach((shop: LevelMart) => {
          shop.items.forEach((item: string) =>
            this.throwOnPile(item, map.baseMap),
          );
        });
      });
    }
  }
  private throwOnPile(item: string, mapBaseName: string) {
    if (this.itemsToMap.has(item)) {
      const currPlacesToGetItem = this.itemsToMap.get(item);
      if (currPlacesToGetItem?.includes(mapBaseName)) return;
      currPlacesToGetItem?.push(mapBaseName);
      return;
    }
    this.itemsToMap.set(item, [mapBaseName]);
  }
  getMapsForItem(itemId: string): string[] | null {
    const mapsArr = this.itemsToMap.get(itemId);
    if (mapsArr === undefined) {
      return null;
    }
    return mapsArr;
  }
  search(query: string) {
    return this.trie.search(query).slice(0, 5);
  }
  byMap(mapBaseName: string): ItemsByMap | undefined {
    const levelsInThisMap = LevelsInfo[mapBaseName];

    if (!levelsInThisMap || levelsInThisMap.length === 0) {
      return undefined;
    }

    const returnObj: ItemsByMap = {
      scriptedGives: [],
      shopItems: [],
      pickupItems: [],
    };

    for (const level of levelsInThisMap) {
      returnObj.scriptedGives.push(...level.scriptedGives);

      level.shopItems.forEach((shop) => {
        const shopItems = shop.items
          .map((i) => Items.get(i))
          .filter((i): i is Item => i !== undefined);
        returnObj.shopItems.push(...shopItems);
      });

      level.pickupItems.forEach((item) => {
        const pickupItem = Items.get(item.item);
        if (pickupItem) {
          returnObj.pickupItems.push({
            ...pickupItem,
            coords: item.coords,
          });
        }
      });
    }

    return returnObj;
  }

  byLevel(levelName: string): ItemWithCoords[] | undefined {
    for (const mapLevels of Object.values(LevelsInfo)) {
      const level = mapLevels.find((lvl) => lvl.thisLevelsId === levelName);
      if (level) {
        return level.pickupItems
          .map((item) => {
            const itemData = Items.get(item.item);
            if (itemData) {
              return {
                ...itemData,
                coords: item.coords,
              };
            }
            return undefined;
          })
          .filter((item): item is ItemWithCoords => item !== undefined);
      }
    }
    return undefined;
  }
}

const itemSearch = new ItemSearch();
const useItemSearch = (): [
  string,
  Item[],
  React.Dispatch<React.SetStateAction<string>>,
  () => void,
  (itemId: string) => string[] | null,
] => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Item[]>([]);

  useEffect(() => {
    if (searchTerm === "") return;
    const results = itemSearch.search(searchTerm);

    if (results.length === 1 && searchTerm === results[0].name) {
      setSearchResults([]);
      return;
    }
    setSearchResults(results);
  }, [searchTerm]);

  const getMapsForItem = useCallback((itemId: string) => {
    return itemSearch.getMapsForItem(itemId);
  }, []);

  return [
    searchTerm,
    searchResults,
    setSearchTerm,
    () => setSearchResults([]),
    getMapsForItem,
  ];
};
export { useItemSearch };
export default itemSearch;
