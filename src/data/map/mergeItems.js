import { readFileSync, writeFileSync } from "fs";
import path from "path";

const itemNames = JSON.parse(
  readFileSync(path.resolve("src/data/map/items.json"), "utf8"),
);
const itemDesc = JSON.parse(
  readFileSync("src/data/map/item_descriptions.json", "utf8"),
);
const foundItemDesc = new Set();
for (const item of itemNames) {
    foundItemDesc.add(item.id);
  itemDesc.forEach((desc) => {
    if (item.id === desc.name) {
      foundItemDesc.delete(item.id);
      item.description = desc.description;
    }
  });
}
console.log(foundItemDesc.values())
writeFileSync("goodItems.json", JSON.stringify(itemNames, null, 2), "utf8");
