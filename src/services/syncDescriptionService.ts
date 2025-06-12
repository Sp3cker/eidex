// Synchronous description generator for SEO-friendly head updates
// Uses ItemSearch to get map data instead of loading groupedData directly
import itemSearch from "@/utils/itemsData";

class SyncDescriptionService {
  constructor() {
    // ItemSearch is already initialized, no need to load data
  }

  private formatMapName(mapId: string): string {
    return mapId
      .replace(/^MAP_/, "")
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  private generateDescription(mapId: string, levelLabel?: string): string {
    // Use ItemSearch to get map data
    const mapData = itemSearch.byMap(mapId);
    
    if (!mapData) {
      return `Explore this location in Pokémon Emerald Imperium.`;
    }

    const mapName = this.formatMapName(mapId);
    const locationName = levelLabel ? `${mapName} - ${levelLabel}` : mapName;

    const items: string[] = [];

    // Collect pickup items
    if (mapData.pickupItems && mapData.pickupItems.length > 0) {
      mapData.pickupItems.forEach((item) => {
        if (item.name && !items.includes(item.name)) {
          items.push(item.name);
        }
      });
    }

    // Collect shop items
    if (mapData.shopItems && mapData.shopItems.length > 0) {
      mapData.shopItems.forEach((item) => {
        if (item.name && !items.includes(item.name)) {
          items.push(item.name);
        }
      });
    }

    // Collect scripted items
    if (mapData.scriptedGives && mapData.scriptedGives.length > 0) {
      mapData.scriptedGives.forEach((scriptedGive) => {
        if (scriptedGive.items && scriptedGive.items.length > 0) {
          scriptedGive.items.forEach((item) => {
            if (item.name && !items.includes(item.name)) {
              items.push(item.name);
            }
          });
        }
      });
    }

    if (items.length === 0) {
      return `Explore ${locationName} in Pokémon Emerald Imperium. Pokémon locations and hidden items.`;
    }

    // Create rich description
    const itemList = items.slice(0, 8).join(", "); // Limit to 8 items to keep description reasonable
    let description = `${locationName} contains ${itemList}`;

    description += ` in Pokémon Emerald Imperium. `;

    if (items.length > 8) {
      description += `Plus ${items.length - 8} more items to discover. `;
    }

    return description;
  }

  /**
   * Get description synchronously - returns fallback immediately if data not available,
   * or rich description if data is available
   */
  public getMapDescriptionSync(mapId: string, levelLabel?: string): string {
    try {
      const richDescription = this.generateDescription(mapId, levelLabel);
      return richDescription;
    } catch (error) {
      console.error(
        "[SyncDescriptionService] Error generating description:",
        error,
      );
      return levelLabel
        ? `Explore ${this.formatMapName(mapId)} - ${levelLabel} in Pokémon Emerald Imperium.`
        : `Explore ${this.formatMapName(mapId)} in Pokémon Emerald Imperium.`;
    }
  }

  /**
   * Get description with async enhancement - for progressive enhancement
   */
  public async getMapDescriptionAsync(
    mapId: string,
    levelLabel?: string,
  ): Promise<string> {
    return this.getMapDescriptionSync(mapId, levelLabel);
  }

  /**
   * Check if data is ready - ItemSearch is always ready
   */
  public get isReady(): boolean {
    return true;
  }
}

// Export singleton instance
export const syncDescriptionService = new SyncDescriptionService();
