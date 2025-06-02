import itemsByMap from "@/data/map/groupedData.json";
import itemsData from "@/data/map/items.json";

import { useCallback, useEffect, useState } from "react";
import TrieSearch from "trie-search";

export type Item = {
  id: string;
  name: string;
  description: string;
  price?: number;
  [key: string]: any;
};
type ScriptedGive = {
  scriptName: string;
  items: string[];
  pokemon: string[];
};
export type ItemsByMap = {
  scriptedGives: { items: Item[]; pokemon: string[] };
  shopItems: Item[];
  pickupItems: Item[];
}; // type SelectedItemSearchResult = {
//   name: string;
//   maps: string[];
// };
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
    //@ts-ignore
    this.trie.addAll(itemsData);
    this.itemsToMap = new Map();

    // We gotta get all the items and write down
    // where all you can get it, so item: name, places: [...]

    for (const mapLevels of Object.values(itemsByMap)) {
      //@ts-ignore
      // const itemsInThisMap = Object.values(itemsByMap[map]).flat() as string[];
      mapLevels.forEach((map: any) => {
        /** Go through each level, putting all the items available
         * there into the itemsToMap map, with the levelID added to that
         * item's array of places to get it.
         */
        map.items.forEach((item: { coords: string[]; item: string }) => {
          this.throwOnPile(item.item, map.baseMap);
        });
        /** Scripted Items are nested pretty deep... */
        map.scriptedGives.forEach(
          (script: { scriptName: string; items: string[]; pokemon: [] }) => {
            script.items.forEach((item: string) =>
              this.throwOnPile(item, map.baseMap),
            );
            script.pokemon.forEach((pokemon: string) =>
              this.throwOnPile(pokemon, map.baseMap),
            );
          },
        );

        map.shopItems.forEach(
          (shop: {
            label: string;
            mart: string;
            items: string[];
            levelLabel: string;
            scriptname: string;
          }) => {
            shop.items.forEach((item: string) =>
              this.throwOnPile(item, map.baseMap),
            );
          },
        );
      });
    }
  }
  /**
   *
   * @param item item ID "ITEM_DEEZ"
   * @param mapBaseName "MAP_SOOTOPOLIS_CITY"
   * @returns
   */
  private throwOnPile(item: string, mapBaseName: string) {
    if (this.itemsToMap.has(item)) {
      const currPlacesToGetItem = this.itemsToMap.get(item);
      currPlacesToGetItem?.push(mapBaseName); // so item: 'apple', places: ['tree', 'ground',....]
      return;
    }
    this.itemsToMap.set(item, [mapBaseName]);
  }
  /**returns the map IDs this item is gettable on */
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
  /**
   *
   * @param map map Base Name "MAP_SOOTOPOLIS_CITY"
   */
  byMap(mapBaseName: string): ItemsByMap | undefined {
    //@ts-ignore
    const levels = itemsByMap[mapBaseName];
    if (levels === undefined || levels.length === 0) {
      return undefined;
    }

    const returnObj: ItemsByMap = {
      scriptedGives: { items: [], pokemon: [] },
      shopItems: [] as Item[],
      pickupItems: [],
    };

    for (const level of levels) {
      level.scriptedGives.forEach((itm: ScriptedGive) => {
        returnObj.scriptedGives.pokemon = itm.pokemon as string[];
        returnObj.scriptedGives.items = itm.items
          .flatMap((i) => itemsData.filter((item) => item.id === i))
          .map((i) => (i.price === null ? { ...i, price: undefined } : i));
      });

      level.shopItems.forEach((shop: { items: string[] }) => {
        returnObj.shopItems = shop.items
          .flatMap((i) => itemsData.filter((item) => item.id === i))
          .map((i) => (i.price === null ? { ...i, price: undefined } : i));
      });
      level.items.forEach((item: { coords: string[]; item: string }) => {
        const itemData = itemsData.find((i) => i.id === item.item);
        if (itemData) {
          returnObj.pickupItems.push(
            itemData.price === null
              ? { ...itemData, price: undefined }
              : itemData,
          );
        }
      });
    }
    debugger;
    return returnObj;
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
