import { readFileSync, writeFileSync } from "fs";
import path from "path";

// Read the source files
const itemsToMerge = JSON.parse(
  readFileSync(path.resolve("src/data/map/itemsToMerge.json"), "utf8"),
);
const mergedItems = JSON.parse(
  readFileSync(path.resolve("src/data/map/merged-items.json"), "utf8"),
);

// Create a lookup map from itemsToMerge by name for faster lookups
const itemsLookup = {};
Object.values(itemsToMerge).forEach((item) => {
  itemsLookup[item.name] = item.constant;
});

// Update merged-items.json by overwriting id field with constant from itemsToMerge
let updatedCount = 0;
let notFoundCount = 0;

mergedItems.forEach((item) => {
  if (itemsLookup[item.name]) {
    item.id = itemsLookup[item.name];
    updatedCount++;
  } else {
    notFoundCount++;
    console.log(`No matching constant found for: "${item.name}"`);
  }
});

console.log(`Updated ${updatedCount} items`);
console.log(`Could not find matches for ${notFoundCount} items`);

// Write the updated merged-items.json
writeFileSync(
  path.resolve("src/data/map/merged-items.json"), 
  JSON.stringify(mergedItems, null, 2), 
  "utf8"
);

console.log("Successfully updated merged-items.json with constants from itemsToMerge.json");
