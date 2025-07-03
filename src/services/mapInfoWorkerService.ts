/**not used NOT USED NOT USED NOT USED NOT USED
 * Service wrapper around `mapInfoWorker.ts` to make retrieving encounter data
 * feel like an async function call from the main thread.
 * Usage:
 *   import { mapInfoWorkerService } from '@/services/mapInfoWorkerService';
 *   const data = await mapInfoWorkerService.getMapInfo('MAP_PETALBURG_CITY', 'MAP_PETALBURG_CITY_LAND_MAIN');
 */

interface GetMapInfoRequest {
  type: 'GET_MAP_INFO';
  payload: { mapId: string; levelId: string; requestId: string };
}

interface MapInfoResult {
  landEncounters?: unknown;
  waterEncounters?: unknown;
  fishingEncounters?: unknown;
}

interface MapInfoReadyResponse {
  type: 'MAP_INFO_READY';
  payload: { requestId: string; data?: MapInfoResult; error?: string };
}

class MapInfoWorkerService {
  private worker: Worker | null = null;
  private callbacks = new Map<string, (data: MapInfoResult | undefined) => void>();

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    try {
      this.worker = new Worker(
        // Worker is emitted as JS after build – keep the extension .js like other services
        new URL('../workers/mapInfoWorker.js', import.meta.url),
        { type: 'module' },
      );

      this.worker.onmessage = (evt: MessageEvent<MapInfoReadyResponse>) => {
        const { type, payload } = evt.data;
        if (type !== 'MAP_INFO_READY') return;

        const { requestId, data, error } = payload;
        const cb = this.callbacks.get(requestId);
        if (cb) {
          cb(error ? undefined : data);
          this.callbacks.delete(requestId);
        }
        if (error) {
          // eslint-disable-next-line no-console
          console.error('[MapInfoWorkerService] error:', error);
        }
      };

      this.worker.onerror = (e) => {
        // eslint-disable-next-line no-console
        console.error('[MapInfoWorkerService] Worker failed:', e);
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[MapInfoWorkerService] Could not create worker', e);
      this.worker = null;
    }
  }

  public async getMapInfo(mapId: string, levelId: string): Promise<MapInfoResult | undefined> {
    if (!this.worker) {
      // Worker failed – graceful fallback to undefined so callers can decide.
      return undefined;
    }

    return new Promise((resolve) => {
      const requestId = `${mapId}_${levelId}_${Date.now().toString(36)}`;
      this.callbacks.set(requestId, resolve);

      const msg: GetMapInfoRequest = {
        type: 'GET_MAP_INFO',
        payload: { mapId, levelId, requestId },
      };
      this.worker!.postMessage(msg);
    });
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.callbacks.clear();
  }
}

export const mapInfoWorkerService = new MapInfoWorkerService();

// Clean up on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    mapInfoWorkerService.terminate();
  });
} 