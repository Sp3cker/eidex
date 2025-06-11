// Utility functions for working with the item spritesheet
import spritesheetCoords from "@/data/pokemon-front-coords.json";

interface SpriteCoordinate {
  spriteName: string;
  coords: number[]; // JSON has number[] not tuple
}

// Create a map for O(1) lookups
const coordsMap = new Map<string, [number, number]>();
spritesheetCoords.forEach((coord: SpriteCoordinate) => {
  // Convert to tuple
  coordsMap.set(coord.spriteName, [coord.coords[0], coord.coords[1]]);
});

/**
 * Get sprite coordinates for an item by ID
 * @param itemId - The item ID in ITEM_ format (e.g., "ITEM_POKE_BALL")
 * @returns [x, y] coordinates or null if not found
 */
export function getItemSpriteCoords(itemId: number): [number, number] | null {
  const [x, y] = spritesheetCoords[itemId - 1].coords;

  if (typeof x !== "number" && typeof y !== "number") return null;
  return [x, y];
}

/**
 * Get CSS background-position for an item sprite
 * @param itemId - The item ID in ITEM_ format
 * @param spriteSize - Size of each sprite (default: 64px)
 * @returns CSS background-position string or null if not found
 */
export function getPokemonSpriteStyle(
  itemId: number,
  spriteSize: number = 64,
): React.CSSProperties | null {
  const coords = getItemSpriteCoords(itemId);

  if (!coords) return null;

  const [x, y] = coords;

  // Spritesheet dimensions (from generation script)
  const sourceSize = 64; // Individual sprite size in spritesheet
  const scale = spriteSize / sourceSize;

  // Calculate the scaled spritesheet dimensions
  // Original spritesheet: 1054x2506px (from the generation output)
  const originalSheetWidth = 1054;
  const originalSheetHeight = 6334;
  const scaledSheetWidth = originalSheetWidth * scale;
  const scaledSheetHeight = originalSheetHeight * scale;

  const style: React.CSSProperties = {
    width: `${spriteSize}px`,
    height: `${spriteSize}px`,
    overflow: "hidden",
    filter: `drop-shadow(0 0 2px rgba(0, 0, 0, 0.3))`,
    imageRendering: "crisp-edges",
    // Safari/WebKit-specific fixes for background-image rendering
    WebkitBackfaceVisibility: "hidden",
  };

  return style;
}

/**
 * Get CSS properties for rendering a sprite using an img element with proper positioning
 * This approach uses transform and overflow:hidden to crop the sprite from the spritesheet
 * @param itemId - The item ID in ITEM_ format
 * @param spriteSize - Size of each sprite (default: 64px)
 * @returns CSS properties for img element or null if not found
 */
export function getPokemonImgStyle(
  itemId: number, 
  spriteSize: number = 64
): React.CSSProperties | null {
  const coords = getItemSpriteCoords(itemId);

  if (!coords) return null;

  const [x, y] = coords;

  // Spritesheet dimensions
  const sourceSize = 64; // Individual sprite size in spritesheet
  const scale = spriteSize / sourceSize;

  // Original spritesheet: 1054x6334px (from the generation output)
  const originalSheetWidth = 1054;
  const originalSheetHeight = 6334;
  const scaledSheetWidth = originalSheetWidth * scale;
  const scaledSheetHeight = originalSheetHeight * scale;

  return {
    // Use translate3d for hardware acceleration and better Safari support
    transform: `translate3d(-${x * scale}px, -${y * scale}px, 0)`,
    imageRendering: "crisp-edges",
    width: `${scaledSheetWidth}px`,
    height: `${scaledSheetHeight}px`,
    display: "block",
    // Additional properties for smoother rendering
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transformStyle: "preserve-3d",
    WebkitTransformStyle: "preserve-3d",
  };
}



/**
 * Alternative approach using img elements with transform3d and overflow:hidden container
 * This method provides better Safari compatibility and hardware acceleration
 * 
 * Usage example:
 *
 * const imgStyle = getPokemonImgStyle(pokemon.index, 64);
 * const containerStyle = getSpriteContainerStyle(64);
 *
 * {imgStyle ? (
 *   <div style={containerStyle}>
 *     <img src="/spritesheet-pokemon-front.webp" alt="sprite" style={imgStyle} />
 *   </div>
 * ) : (
 *   <div>No sprite</div>
 * )}
 */

/**
 * Check if an item has a sprite available
 * @param itemId - The item ID in ITEM_ format
 * @returns true if sprite exists
 */
export function hasItemSprite(itemId: number): boolean {
  return getItemSpriteCoords(itemId) !== null;
}

/**
 * Get all available item IDs in the spritesheet (for debugging)
 */
export function getAvailableItemIds(): string[] {
  return Array.from(coordsMap.keys()).sort();
}

// /**
//  * Debug function to log sprite information
//  * @param itemId - The item ID to debug
//  */
// export function debugSprite(itemId: string): void {
//   const coords = getItemSpriteCoords(itemId);
//   const style32 = getItemSpriteStyle32(itemId);
//   const style64 = getItemSpriteStyle64(itemId);

//   console.log(`Debug sprite for ${itemId}:`, {
//     coords,
//     style32: style32
//       ? {
//           backgroundPosition: style32.backgroundPosition,
//           backgroundSize: style32.backgroundSize,
//           width: style32.width,
//           height: style32.height,
//         }
//       : null,
//     style64: style64
//       ? {
//           backgroundPosition: style64.backgroundPosition,
//           backgroundSize: style64.backgroundSize,
//           width: style64.width,
//           height: style64.height,
//         }
//       : null,
//   });
// }
