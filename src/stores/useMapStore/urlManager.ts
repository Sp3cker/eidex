export interface URLState {
  mapName: string | null;
  trainerName: string | null;
}

export class URLManager {
  private static instance: URLManager;
  private pendingUpdate: URLState | null = null;
  private isAnimating = false;

  private constructor() {}

  static getInstance(): URLManager {
    if (!URLManager.instance) {
      URLManager.instance = new URLManager();
    }
    return URLManager.instance;
  }

  /**
   * Parse current URL and return state
   */
  parseCurrentURL(): URLState {
    const path = window.location.pathname;
    const mapMatch = path.match(/^\/map\/([^/]+)$/);
    const trainerMatch = path.match(/^\/map\/([^/]+)\/([^/]+)$/);
    
    if (trainerMatch) {
      const [, mapName, trainerName] = trainerMatch;
      return {
        mapName,
        trainerName: decodeURIComponent(trainerName),
      };
    } else if (mapMatch) {
      return {
        mapName: mapMatch[1],
        trainerName: null,
      };
    }
    
    return {
      mapName: null,
      trainerName: null,
    };
  }

  /**
   * Build URL from state
   */
  buildURL(mapName: string | null, trainerName: string | null): string {
    if (!mapName) {
      return "/map";
    }
    
    if (trainerName) {
      const encodedTrainerName = encodeURIComponent(trainerName);
      return `/map/${mapName}/${encodedTrainerName}`;
    }
    
    return `/map/${mapName}`;
  }

  /**
   * Update URL immediately (for map selection)
   */
  updateURLImmediate(mapName: string | null, trainerName: string | null = null): void {
    const newURL = this.buildURL(mapName, trainerName);
    
    if (window.location.pathname !== newURL) {
      window.history.pushState({}, "", newURL);
    }
  }

  /**
   * Request URL update (will be delayed if animation is running)
   */
  requestURLUpdate(mapName: string | null, trainerName: string | null = null): void {
    const newState: URLState = { mapName, trainerName };
    
    if (this.isAnimating) {
      // Store pending update
      this.pendingUpdate = newState;
      return;
    }
    
    // Update immediately if not animating
    this.updateURLImmediate(mapName, trainerName);
  }

  /**
   * Set animation state
   */
  setAnimating(animating: boolean): void {
    this.isAnimating = animating;
    
    // If animation finished and we have a pending update, apply it
    if (!animating && this.pendingUpdate) {
      this.updateURLImmediate(this.pendingUpdate.mapName, this.pendingUpdate.trainerName);
      this.pendingUpdate = null;
    }
  }

  /**
   * Check if currently animating
   */
  getIsAnimating(): boolean {
    return this.isAnimating;
  }
}

export const urlManager = URLManager.getInstance();
