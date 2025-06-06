// Synchronous description generator for SEO-friendly head updates
// Loads and processes groupedData.json directly for immediate descriptions

interface MapLevel {
  baseMap: string;
  levelLabel: string;
  thisLevelsId: string;
  scriptedGives: any[];
  shopItems: any[];
  trainers: any[];
  pickupItems: { item: string; type: string; coords: number[] }[];
  image: string;
}

interface GroupedData {
  [mapId: string]: MapLevel[];
}

class SyncDescriptionService {
  private groupedData: GroupedData | null = null;
  private isLoaded = false;
  private loadPromise: Promise<void> | null = null;

  constructor() {
    // Start loading immediately but don't block
    this.loadData();
  }

  private async loadData(): Promise<void> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = (async () => {
      try {
        const response = await fetch('/groupedData.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        this.groupedData = await response.json();
        this.isLoaded = true;
        console.log('[SyncDescriptionService] Data loaded successfully');
      } catch (error) {
        console.error('[SyncDescriptionService] Failed to load data:', error);
        this.groupedData = null;
      }
    })();

    return this.loadPromise;
  }

  private cleanItemName(itemName: string): string {
    return itemName
      .replace(/^ITEM_/, '')
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private formatMapName(mapId: string): string {
    return mapId
      .replace(/^MAP_/, '')
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private generateDescription(mapId: string, levelLabel?: string): string {
    if (!this.groupedData || !Array.isArray(this.groupedData[mapId])) {
      return `Explore this location in Pokémon Emerald Imperium.`;
    }

    const mapData = this.groupedData[mapId];
    const levelData = levelLabel 
      ? mapData.find(level => level.levelLabel === levelLabel)
      : mapData[0];

    if (!levelData) {
      const mapName = this.formatMapName(mapId);
      return `Explore ${mapName} in Pokémon Emerald Imperium.`;
    }

    const mapName = this.formatMapName(mapId);
    const items: string[] = [];

    // Collect all items
    if (levelData.pickupItems && levelData.pickupItems.length > 0) {
      levelData.pickupItems.forEach(pickup => {
        if (pickup.item && typeof pickup.item === 'string') {
          const cleanName = this.cleanItemName(pickup.item);
          if (!items.includes(cleanName)) {
            items.push(cleanName);
          }
        }
      });
    }

    if (levelData.shopItems && levelData.shopItems.length > 0) {
      levelData.shopItems.forEach(shop => {
        if (shop.item && typeof shop.item === 'string') {
          const cleanName = this.cleanItemName(shop.item);
          if (!items.includes(cleanName)) {
            items.push(cleanName);
          }
        }
      });
    }

    if (levelData.scriptedGives && levelData.scriptedGives.length > 0) {
      levelData.scriptedGives.forEach(give => {
        if (give.item && typeof give.item === 'string') {
          const cleanName = this.cleanItemName(give.item);
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

    // Create rich description
    const itemList = items.slice(0, 8).join(', '); // Limit to 8 items to keep description reasonable
    const trainerCount = levelData.trainers?.length || 0;
    
    let description = `${locationName} contains ${itemList}`;
    
    if (trainerCount > 0) {
      description += ` and ${trainerCount} trainer${trainerCount > 1 ? 's' : ''}`;
    }
    
    description += ` in Pokémon Emerald Imperium. `;
    
    if (items.length > 8) {
      description += `Plus ${items.length - 8} more items to discover. `;
    }
    
    description += `Interactive map with detailed encounter data and item locations.`;
    
    return description;
  }

  /**
   * Get description synchronously - returns fallback immediately if data not loaded,
   * or rich description if data is available
   */
  public getMapDescriptionSync(mapId: string, levelLabel?: string): string {
    if (!this.isLoaded || !this.groupedData) {
      // Return fallback immediately - data will load in background
      const fallback = levelLabel 
        ? `Explore ${mapId} - ${levelLabel} in Pokémon Emerald Imperium.`
        : `Explore ${mapId} in Pokémon Emerald Imperium.`;
      
      console.log('[SyncDescriptionService] Data not loaded, using fallback');
      return fallback;
    }

    try {
      const richDescription = this.generateDescription(mapId, levelLabel);
      console.log('[SyncDescriptionService] Generated rich description:', richDescription.substring(0, 100) + '...');
      return richDescription;
    } catch (error) {
      console.error('[SyncDescriptionService] Error generating description:', error);
      return levelLabel 
        ? `Explore ${mapId} - ${levelLabel} in Pokémon Emerald Imperium.`
        : `Explore ${mapId} in Pokémon Emerald Imperium.`;
    }
  }

  /**
   * Get description with async enhancement - for progressive enhancement
   */
  public async getMapDescriptionAsync(mapId: string, levelLabel?: string): Promise<string> {
    await this.loadData();
    return this.getMapDescriptionSync(mapId, levelLabel);
  }

  /**
   * Check if data is loaded
   */
  public get isReady(): boolean {
    return this.isLoaded;
  }
}

// Export singleton instance
export const syncDescriptionService = new SyncDescriptionService();
