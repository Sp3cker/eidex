import items from "@/data/map/items.json";
import { useEffect, useState } from "react";
import TrieSearch from "trie-search";

export type Item = {
  number?: string;
  name: string;
  map: string;
  qualifier: string;
};

class ItemSearch {
  trie: TrieSearch<Item>;
  constructor() {
    this.trie = new TrieSearch<Item>("name", {
      min: 2,
      cache: true,

      idFieldOrFunction: "name",
    });
    this.trie.addAll(items);
  }

  search(query: string) {
    return this.trie.search(query).slice(0, 5);
  }
  byMap(map: string) {
    return items.filter((item) => item.map === map);
  }
}
const itemSearch = new ItemSearch();
const useItemSearch = (): [
  Item[],
  React.Dispatch<React.SetStateAction<string>>
] => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  useEffect(() => {
    setSearchResults(itemSearch.search(searchTerm));
  }, [searchTerm]);
  return [searchResults, setSearchTerm];
};
export { useItemSearch };
export default itemSearch;
