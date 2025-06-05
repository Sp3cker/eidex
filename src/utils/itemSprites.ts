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
 * @param spriteSize - Size of each sprite (default: 32px)
 * @returns CSS background-position string or null if not found
 */
export function getItemSpriteStyle(
  itemId: string, 
  spriteSize: number = 32
): React.CSSProperties | null {
  const coords = getItemSpriteCoords(itemId);
  
  if (!coords) return null;

  const [x, y] = coords;
  const style: React.CSSProperties = {
    backgroundImage: 'url(/spritesheet-items.png)',
    backgroundPosition: `-${x}px -${y}px`,
    backgroundSize: 'auto', // Keep original size since sprites are already 32px
    width: `${spriteSize}px`,
    height: `${spriteSize}px`,
    display: 'inline-block',
    imageRendering: 'crisp-edges', // Ensure pixel art looks crisp
  };
  
  return style;
}

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
    src: '/spritesheet-items.png',
    width: 32,
    height: 32,
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
 *     <img src="/spritesheet-items.png" alt="sprite" style={imgStyle} />
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
