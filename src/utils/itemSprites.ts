// Utility functions for working with the item spritesheet
import spritesheetCoords from '@/data/spritesheet-coords.json';

interface SpriteCoordinate {
  item: string;
  coords: number[]; // JSON has number[] not tuple
}

// Create a map for O(1) lookups
const coordsMap = new Map<string, [number, number]>();
spritesheetCoords.forEach((coord: SpriteCoordinate) => {
  // Convert to tuple
  coordsMap.set(coord.item, [coord.coords[0], coord.coords[1]]);
});

// Note: itemNameToId function removed - items already have proper ITEM_ format IDs

/**
 * Get sprite coordinates for an item by ID
 * @param itemId - The item ID in ITEM_ format (e.g., "ITEM_POKE_BALL")
 * @returns [x, y] coordinates or null if not found
 */
export function getItemSpriteCoords(itemId: string): [number, number] | null {
  const coords = coordsMap.get(itemId);
  return coords || null;
}

/**
 * Get CSS background-position for an item sprite
 * @param itemId - The item ID in ITEM_ format
 * @param spriteSize - Size of each sprite (default: 64px)
 * @returns CSS background-position string or null if not found
 */
export function getItemSpriteStyle(
  itemId: string, 
  spriteSize: number = 64
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
  const originalSheetHeight = 2506;
  const scaledSheetWidth = originalSheetWidth * scale;
  const scaledSheetHeight = originalSheetHeight * scale;
  
  const style: React.CSSProperties = {
    backgroundImage: 'url(/spritesheet-items.webp)',
    backgroundPosition: `-${x * scale}px -${y * scale}px`,
    backgroundSize: `${scaledSheetWidth}px ${scaledSheetHeight}px`,
    width: `${spriteSize}px`,
    height: `${spriteSize}px`,
    display: 'inline-block',
    imageRendering: 'pixelated',
    overflow: 'hidden',
  };
  
  return style;
}

/**
 * Convenience functions for common sprite sizes
 */
export const getItemSpriteStyle32 = (itemId: string) => getItemSpriteStyle(itemId, 32);
export const getItemSpriteStyle48 = (itemId: string) => getItemSpriteStyle(itemId, 48);
export const getItemSpriteStyle64 = (itemId: string) => getItemSpriteStyle(itemId, 64);

/**
 * Get a simple img src for a single item sprite
 * @param itemId - The item ID in ITEM_ format
 * @returns Object with src attribute and dimensions for an img tag, or null if not found
 */
export function getItemImgProps(itemId: string): { src: string, width: number, height: number } | null {
  const coords = getItemSpriteCoords(itemId);
  if (!coords) return null;
  
  // For now, return the spritesheet with coordinates
  // Note: In a production app, we might want to extract each sprite to its own file
  // or use a canvas to extract just this sprite
  return {
    src: '/spritesheet-items.webp',
    width: 64,
    height: 64,
    // We'll need to handle the sprite cropping in CSS
  };
}

/**
 * Get CSS properties for rendering a sprite using an img element with proper positioning
 * This approach uses transform and overflow:hidden to crop the sprite from the spritesheet
 * @param itemId - The item ID in ITEM_ format
 * @returns CSS properties for img element or null if not found
 */
export function getItemImgStyle(
  itemId: string
): React.CSSProperties | null {
  const coords = getItemSpriteCoords(itemId);
  
  if (!coords) return null;

  const [x, y] = coords;
  
  return {
    transform: `translate(-${x}px, -${y}px)`,
    imageRendering: 'crisp-edges' as const,
    width: 'auto',
    height: 'auto',
    display: 'block',
  };
}

/**
 * Alternative approach using img elements with transform and overflow:hidden container
 * Usage example:
 * 
 * const imgStyle = getItemImgStyle(item.id);
 * 
 * {imgStyle ? (
 *   <div style={{ width: '32px', height: '32px', overflow: 'hidden', position: 'relative' }}>
 *     <img src="/spritesheet-items.webp" alt="sprite" style={imgStyle} />
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
export function hasItemSprite(itemId: string): boolean {
  return getItemSpriteCoords(itemId) !== null;
}

/**
 * Get all available item IDs in the spritesheet (for debugging)
 */
export function getAvailableItemIds(): string[] {
  return Array.from(coordsMap.keys()).sort();
}

/**
 * Debug function to log sprite information
 * @param itemId - The item ID to debug
 */
export function debugSprite(itemId: string): void {
  const coords = getItemSpriteCoords(itemId);
  const style32 = getItemSpriteStyle32(itemId);
  const style64 = getItemSpriteStyle64(itemId);
  
  console.log(`Debug sprite for ${itemId}:`, {
    coords,
    style32: style32 ? {
      backgroundPosition: style32.backgroundPosition,
      backgroundSize: style32.backgroundSize,
      width: style32.width,
      height: style32.height
    } : null,
    style64: style64 ? {
      backgroundPosition: style64.backgroundPosition,
      backgroundSize: style64.backgroundSize,
      width: style64.width,
      height: style64.height
    } : null
  });
}
