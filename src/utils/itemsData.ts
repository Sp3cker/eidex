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
// type SelectedItemSearchResult = {
//   name: string;
//   maps: string[];
// };
class ItemSearch {
  /**
   * Search for an item
   */
  trie: TrieSearch<Item>;
  /**
   * Get an array of places to find item via
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
    for (const map of Object.values(itemsByMap)) {
      //@ts-ignore
      debugger
      // const itemsInThisMap = Object.values(itemsByMap[map]).flat() as string[];
      const itemsInThisMap = 
      itemsInThisMap.forEach((item) => {
        if (this.itemsToMap.has(item)) {
          const currPlacesToGetItem = this.itemsToMap.get(item);
          currPlacesToGetItem?.push(map); // so item: 'apple', places: ['tree', 'ground',....]
          return;
        }
        this.itemsToMap.set(item, [map]);
      });
    }
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
  byMap(map: string):
    | {
        [location: string]: Item[];
      }
    | undefined {
    //@ts-ignore
    const items = itemsByMap[map]
    if (items === undefined) {
      return undefined;
    }
    const keys = Object.keys(items);
    const returnObj = new Map<string, Item[]>();

    keys.forEach((k) => {
      const startingArray = items[k];
      const itemsWithData = startingArray.flatMap((itm) => {
        return itemsData
          .filter((i) => i.id === itm)
          .map((i) => (i.price === null ? { ...i, price: undefined } : i));
      });

      returnObj.set(k, itemsWithData);
    });
    return Object.fromEntries(returnObj);
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
