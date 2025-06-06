// Web Worker for generating rich map descriptions
// Processes groupedData.json to create detailed descriptions without blocking UI

// Cache for generated descriptions
const descriptionCache = new Map();

// Helper to clean item names
function cleanItemName(itemName) {
  return itemName
    .replace(/^ITEM_/, '')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Helper to format map names
function formatMapName(mapId) {
  return mapId
    .replace(/^MAP_/, '')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Generate rich description for a map
function generateMapDescription(mapId, levelLabel, mapData) {
  if (!mapData || !Array.isArray(mapData)) {
    return `Explore this location in Pokémon Emerald Imperium.`;
  }

  // Find specific level or use first one
  const levelData = levelLabel 
    ? mapData.find(level => level.levelLabel === levelLabel)
    : mapData[0];

  if (!levelData) {
    const mapName = formatMapName(mapId);
    return `Explore ${mapName} in Pokémon Emerald Imperium.`;
  }

  const mapName = formatMapName(mapId);
  const items = [];
  
  // Collect items from all sources
  if (levelData.pickupItems && levelData.pickupItems.length > 0) {
    levelData.pickupItems.forEach(pickup => {
      const cleanName = cleanItemName(pickup.item);
      if (!items.includes(cleanName)) {
        items.push(cleanName);
      }
    });
  }

  if (levelData.scriptedGives && levelData.scriptedGives.length > 0) {
    levelData.scriptedGives.forEach(give => {
      if (give.item) {
        const cleanName = cleanItemName(give.item);
        if (!items.includes(cleanName)) {
          items.push(cleanName);
        }
      }
    });
  }

  if (levelData.shopItems && levelData.shopItems.length > 0) {
    levelData.shopItems.forEach(shop => {
      if (shop.item) {
        const cleanName = cleanItemName(shop.item);
        if (!items.includes(cleanName)) {
          items.push(cleanName);
        }
      }
    });
  }

  const locationName = levelLabel ? `${mapName} - ${levelLabel}` : mapName;
  
  if (items.length === 0) {
    return `Explore ${locationName} in Pokémon Emerald Imperium. Discover Pokémon encounters and hidden secrets.`;
  }

  // Limit items for readability
  const displayItems = items.slice(0, 5);
  const moreItemsText = items.length > 5 ? ` and ${items.length - 5} more items` : '';
  
  return `${locationName} contains ${displayItems.join(', ')}${moreItemsText}. Explore Pokémon encounters and discover hidden treasures.`;
}

// Handle messages from main thread
self.onmessage = async function(event) {
  const { type, payload } = event.data;

  try {
    switch (type) {
      case 'LOAD_DATA': {
        // Load the grouped data when worker starts
        try {
          const response = await fetch('/groupedData.json');
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`);
          }
          const groupedData = await response.json();
          
          // Cache data for future use
          self.groupedData = groupedData;
          
          self.postMessage({
            type: 'DATA_LOADED',
            payload: { success: true }
          });
        } catch (error) {
          // Fallback: try alternative path
          try {
            const response = await fetch('./groupedData.json');
            if (!response.ok) {
              throw new Error(`Fallback fetch failed: ${response.status}`);
            }
            const groupedData = await response.json();
            self.groupedData = groupedData;
            
            self.postMessage({
              type: 'DATA_LOADED',
              payload: { success: true }
            });
          } catch (fallbackError) {
            throw new Error(`Could not load grouped data: ${error.message}, ${fallbackError.message}`);
          }
        }
        break;
      }

      case 'GENERATE_DESCRIPTION': {
        const { mapId, levelLabel } = payload;
        
        if (!mapId) {
          throw new Error('mapId is required');
        }

        if (!self.groupedData) {
          throw new Error('Data not loaded yet');
        }

        // Check cache first
        const cacheKey = levelLabel ? `${mapId}:${levelLabel}` : `${mapId}:main`;
        let description = descriptionCache.get(cacheKey);

        if (!description) {
          const mapData = self.groupedData[mapId];
          description = generateMapDescription(mapId, levelLabel, mapData);
          descriptionCache.set(cacheKey, description);
        }

        self.postMessage({
          type: 'DESCRIPTION_READY',
          payload: {
            mapId,
            levelLabel,
            description
          }
        });
        break;
      }

      case 'PREPROCESS_ALL': {
        if (!self.groupedData) {
          throw new Error('Data not loaded yet');
        }

        const startTime = performance.now();
        let processedCount = 0;

        for (const [mapId, mapData] of Object.entries(self.groupedData)) {
          if (Array.isArray(mapData)) {
            // Main map description
            const mainKey = `${mapId}:main`;
            if (!descriptionCache.has(mainKey)) {
              const description = generateMapDescription(mapId, null, mapData);
              descriptionCache.set(mainKey, description);
              processedCount++;
            }

            // Level-specific descriptions
            mapData.forEach(level => {
              if (level.levelLabel) {
                const levelKey = `${mapId}:${level.levelLabel}`;
                if (!descriptionCache.has(levelKey)) {
                  const description = generateMapDescription(mapId, level.levelLabel, mapData);
                  descriptionCache.set(levelKey, description);
                  processedCount++;
                }
              }
            });
          }
        }

        const endTime = performance.now();
        console.log(`[DescriptionWorker] Preprocessed ${processedCount} descriptions in ${(endTime - startTime).toFixed(2)}ms`);
        
        self.postMessage({
          type: 'PREPROCESSING_COMPLETE',
          payload: {
            cacheSize: descriptionCache.size,
            processedCount
          }
        });
        break;
      }

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      payload: {
        error: error.message || 'Unknown error'
      }
    });
  }
};
