// Web Worker for processing map data and generating rich descriptions
// This prevents UI blocking when processing large datasets

// @ts-ignore - JSON import will be handled by Vite
import groupedData from '../data/map/groupedData.json';

interface MapData {
  baseMap: string;
  levelLabel: string;
  thisLevelsId: string;
  scriptedGives: any[];
  shopItems: any[];
  trainers: any[];
  pickupItems: Array<{
    coords: [number, number];
    item: string;
    type: string;
  }>;
  image: string;
}

interface WorkerMessage {
  type: 'GENERATE_DESCRIPTION' | 'PREPROCESS_ALL';
  payload: {
    mapId?: string;
    levelLabel?: string;
  };
}

interface WorkerResponse {
  type: 'DESCRIPTION_READY' | 'PREPROCESSING_COMPLETE' | 'ERROR';
  payload: {
    mapId?: string;
    levelLabel?: string;
    description?: string;
    error?: string;
    cacheSize?: number;
  };
}

// Cache for generated descriptions
const descriptionCache = new Map<string, string>();

// Helper function to clean item names
function cleanItemName(itemName: string): string {
  return itemName
    .replace(/^ITEM_/, '')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Helper function to format map name
function formatMapName(mapId: string): string {
  return mapId
    .replace(/^MAP_/, '')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Generate rich description for a specific map and level
function generateMapDescription(mapId: string, levelLabel?: string): string {
  const mapData = (groupedData as any)[mapId];
  
  if (!mapData || !Array.isArray(mapData)) {
    return `Explore this location in Pokémon Emerald Imperium.`;
  }

  // Find the specific level data if levelLabel is provided
  const levelData = levelLabel 
    ? mapData.find((level: MapData) => level.levelLabel === levelLabel)
    : mapData[0]; // Default to first level if no specific level

  if (!levelData) {
    const mapName = formatMapName(mapId);
    return `Explore ${mapName} in Pokémon Emerald Imperium.`;
  }

  const mapName = formatMapName(mapId);
  const items: string[] = [];
  
  // Collect all items from different sources
  if (levelData.pickupItems && levelData.pickupItems.length > 0) {
    levelData.pickupItems.forEach((pickup: any) => {
      const cleanName = cleanItemName(pickup.item);
      if (!items.includes(cleanName)) {
        items.push(cleanName);
      }
    });
  }

  if (levelData.scriptedGives && levelData.scriptedGives.length > 0) {
    levelData.scriptedGives.forEach((give: any) => {
      if (give.item) {
        const cleanName = cleanItemName(give.item);
        if (!items.includes(cleanName)) {
          items.push(cleanName);
        }
      }
    });
  }

  if (levelData.shopItems && levelData.shopItems.length > 0) {
    levelData.shopItems.forEach((shop: any) => {
      if (shop.item) {
        const cleanName = cleanItemName(shop.item);
        if (!items.includes(cleanName)) {
          items.push(cleanName);
        }
      }
    });
  }

  // Generate description based on available data
  const locationName = levelLabel ? `${mapName} - ${levelLabel}` : mapName;
  
  if (items.length === 0) {
    return `Explore ${locationName} in Pokémon Emerald Imperium. Discover Pokémon encounters and hidden secrets.`;
  }

  // Limit to most important items for description brevity
  const displayItems = items.slice(0, 5);
  const moreItemsText = items.length > 5 ? `and ${items.length - 5} more items` : '';
  
  return `${locationName} contains ${displayItems.join(', ')}${moreItemsText ? `, ${moreItemsText}` : ''}. Explore Pokémon encounters and discover hidden treasures.`;
}

// Preprocess all maps for faster runtime access
function preprocessAllMaps(): void {
  const startTime = performance.now();
  let processedCount = 0;

  for (const [mapId, mapData] of Object.entries(groupedData as any)) {
    if (Array.isArray(mapData)) {
      // Generate description for main map
      const mainKey = `${mapId}:main`;
      if (!descriptionCache.has(mainKey)) {
        const description = generateMapDescription(mapId);
        descriptionCache.set(mainKey, description);
        processedCount++;
      }

      // Generate descriptions for each level
      mapData.forEach((level: MapData) => {
        if (level.levelLabel) {
          const levelKey = `${mapId}:${level.levelLabel}`;
          if (!descriptionCache.has(levelKey)) {
            const description = generateMapDescription(mapId, level.levelLabel);
            descriptionCache.set(levelKey, description);
            processedCount++;
          }
        }
      });
    }
  }

  const endTime = performance.now();
  console.log(`[DescriptionWorker] Preprocessed ${processedCount} descriptions in ${(endTime - startTime).toFixed(2)}ms`);
  
  // Notify main thread that preprocessing is complete
  self.postMessage({
    type: 'PREPROCESSING_COMPLETE',
    payload: {
      cacheSize: descriptionCache.size
    }
  } as WorkerResponse);
}

// Handle messages from main thread
self.onmessage = function(event: MessageEvent<WorkerMessage>) {
  const { type, payload } = event.data;

  try {
    switch (type) {
      case 'GENERATE_DESCRIPTION': {
        const { mapId, levelLabel } = payload;
        
        if (!mapId) {
          throw new Error('mapId is required');
        }

        // Try to get from cache first
        const cacheKey = levelLabel ? `${mapId}:${levelLabel}` : `${mapId}:main`;
        let description = descriptionCache.get(cacheKey);

        // Generate if not in cache
        if (!description) {
          description = generateMapDescription(mapId, levelLabel);
          descriptionCache.set(cacheKey, description);
        }

        self.postMessage({
          type: 'DESCRIPTION_READY',
          payload: {
            mapId,
            levelLabel,
            description
          }
        } as WorkerResponse);
        break;
      }

      case 'PREPROCESS_ALL': {
        preprocessAllMaps();
        break;
      }

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      payload: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    } as WorkerResponse);
  }
};

// Start preprocessing on worker initialization
preprocessAllMaps();
