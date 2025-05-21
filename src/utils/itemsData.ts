import items from "@/data/map/items.json";
import TrieSearch from "trie-search";

export type Item = { number?: string; name: string; map: string; qualifier: string };

class ItemSearch {
  trie: TrieSearch<Item>;
  constructor() {
    this.trie = new TrieSearch<Item>("name", { min: 3, idFieldOrFunction: "name" });
    this.trie.addAll(items);
  }

  search(query: string) {
    return this.trie.search(query);
  }
  byMap(map: string) {
    return items.filter((item) => item.map === map);
  }
}

export default new ItemSearch();
