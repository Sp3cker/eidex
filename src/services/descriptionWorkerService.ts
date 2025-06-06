// Service to manage the description generation Web Worker
// Provides a clean interface for helmet updates with rich map descriptions

interface WorkerResponse {
  type: 'DESCRIPTION_READY' | 'PREPROCESSING_COMPLETE' | 'ERROR' | 'DATA_LOADED';
  payload: {
    mapId?: string;
    levelLabel?: string;
    description?: string;
    error?: string;
    cacheSize?: number;
    processedCount?: number;
    success?: boolean;
  };
}

class DescriptionWorkerService {
  private worker: Worker | null = null;
  private callbacks = new Map<string, (description: string) => void>();
  private isDataLoaded = false;
  private isInitialized = false;

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker(): void {
    try {
      // Create worker from the JavaScript file (simpler than TypeScript compilation)
      this.worker = new Worker(
        new URL('../workers/descriptionWorker.js', import.meta.url),
        { type: 'module' }
      );

      this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        this.handleWorkerMessage(event.data);
      };

      this.worker.onerror = (error) => {
        console.error('[DescriptionWorkerService] Worker error:', error);
      };

      // Load data when worker is created
      this.worker.postMessage({ type: 'LOAD_DATA', payload: {} });

      console.log('[DescriptionWorkerService] Worker initialized');
    } catch (error) {
      console.error('[DescriptionWorkerService] Failed to initialize worker:', error);
      this.worker = null;
    }
  }

  private handleWorkerMessage(response: WorkerResponse): void {
    switch (response.type) {
      case 'DATA_LOADED': {
        console.log('[DescriptionWorkerService] Data loaded successfully');
        this.isDataLoaded = true;
        // Start preprocessing once data is loaded
        if (this.worker) {
          this.worker.postMessage({ type: 'PREPROCESS_ALL', payload: {} });
        }
        break;
      }

      case 'DESCRIPTION_READY': {
        const { mapId, levelLabel, description } = response.payload;
        if (mapId && description) {
          const callbackKey = levelLabel ? `${mapId}:${levelLabel}` : `${mapId}:main`;
          const callback = this.callbacks.get(callbackKey);
          
          if (callback) {
            callback(description);
            this.callbacks.delete(callbackKey);
          }
        }
        break;
      }

      case 'PREPROCESSING_COMPLETE': {
        const { cacheSize, processedCount } = response.payload;
        console.log(`[DescriptionWorkerService] Preprocessing complete. ${processedCount} descriptions generated, ${cacheSize} cached.`);
        this.isInitialized = true;
        break;
      }

      case 'ERROR': {
        const { error } = response.payload;
        console.error('[DescriptionWorkerService] Worker error:', error);
        break;
      }
    }
  }

  /**
   * Request a rich description for a map and optional level
   * Returns a promise that resolves with the generated description
   */
  public async getMapDescription(mapId: string, levelLabel?: string): Promise<string> {
    return new Promise((resolve) => {
      if (!this.worker || !this.isDataLoaded) {
        // Fallback if worker isn't ready
        const fallbackDescription = levelLabel 
          ? `Explore ${mapId} - ${levelLabel} in Pokémon Emerald Imperium.`
          : `Explore ${mapId} in Pokémon Emerald Imperium.`;
        resolve(fallbackDescription);
        return;
      }

      const callbackKey = levelLabel ? `${mapId}:${levelLabel}` : `${mapId}:main`;
      const timeoutId = setTimeout(() => {
        this.callbacks.delete(callbackKey);
        // Provide fallback description on timeout
        const fallbackDescription = levelLabel 
          ? `Explore ${mapId} - ${levelLabel} in Pokémon Emerald Imperium.`
          : `Explore ${mapId} in Pokémon Emerald Imperium.`;
        resolve(fallbackDescription);
      }, 2000); // 2 second timeout

      this.callbacks.set(callbackKey, (description: string) => {
        clearTimeout(timeoutId);
        resolve(description);
      });

      // Request description from worker
      this.worker.postMessage({
        type: 'GENERATE_DESCRIPTION',
        payload: { mapId, levelLabel }
      });
    });
  }

  /**
   * Get description synchronously with fallback if worker is busy
   * Useful for immediate updates while worker processes in background
   */
  public getMapDescriptionSync(mapId: string, levelLabel?: string): string {
    // Always provide immediate fallback
    const fallbackDescription = levelLabel 
      ? `Explore ${mapId} - ${levelLabel} in Pokémon Emerald Imperium.`
      : `Explore ${mapId} in Pokémon Emerald Imperium.`;

    // Trigger async update in background
    this.getMapDescription(mapId, levelLabel).then(richDescription => {
      // Only update if the description is different and richer
      if (richDescription !== fallbackDescription && richDescription.length > fallbackDescription.length) {
        // Update the head again with the rich description
        this.updateHeadWithDescription(richDescription);
      }
    }).catch(console.error);

    return fallbackDescription;
  }

  private updateHeadWithDescription(description: string): void {
    // Update meta description
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Update all relevant meta tags with rich description
    updateMetaTag('description', description);
    updateMetaTag('og:description', description, true);
    updateMetaTag('twitter:description', description);
  }

  /**
   * Check if the worker has finished preprocessing
   */
  public get isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Cleanup method
   */
  public terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.callbacks.clear();
  }
}

// Export singleton instance
export const descriptionWorkerService = new DescriptionWorkerService();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    descriptionWorkerService.terminate();
  });
}
