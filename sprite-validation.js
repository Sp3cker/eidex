// Test validation for sprite utility
import { getItemSpriteCoords, hasItemSprite, getAvailableItemIds } from './src/utils/itemSprites.js';

// Test some common items from items.json
const testItems = [
  "Poké Ball",
  "Great Ball", 
  "Ultra Ball",
  "Master Ball",
  "Safari Ball",
  "Strange Ball",
  "Ability Capsule",
  "Absolite"
];

console.log("=== Item Sprite Validation ===");
console.log(`Total sprites available: ${getAvailableItemIds().length}`);
console.log();

testItems.forEach(itemName => {
  const hasSprite = hasItemSprite(itemName);
  const coords = getItemSpriteCoords(itemName);
  
  console.log(`${itemName}:`);
  console.log(`  Has sprite: ${hasSprite}`);
  if (coords) {
    console.log(`  Coordinates: [${coords[0]}, ${coords[1]}]`);
  }
  console.log();
});

// Show first 10 available item IDs
console.log("First 10 available item IDs:");
getAvailableItemIds().slice(0, 10).forEach(id => console.log(`  ${id}`));
