import type { StoreApi } from "zustand";
import type {
  CaughtEncounterActions,
  CaughtEncounterStore,
  CaughtEncounterRecord,
  PendingCaughtWrite,
} from "./types";
import type { CaughtTrackerDb } from "./db";
import { canUseIndexedDB } from "./db";
import { makeCaughtEncounterKey } from "./keys";

type CaughtStoreApi = Pick<
  StoreApi<CaughtEncounterStore>,
  "getState" | "setState"
>;

export function createCaughtActions(
  store: CaughtStoreApi,
  db: CaughtTrackerDb,
): CaughtEncounterActions {
  let loadPromise: Promise<void> | null = null;
  let flushQueued = false;
  let writeGeneration = 0;
  let storageGeneration = 0;
  const pendingWrites = new Map<string, PendingCaughtWrite>();

  async function flushPendingWrites(generation: number): Promise<void> {
    flushQueued = false;

    if (generation !== writeGeneration || pendingWrites.size === 0) {
      return;
    }

    const writes = [...pendingWrites];
    pendingWrites.clear();

    try {
      if (generation !== writeGeneration) {
        return;
      }

      for (const [key, record] of writes) {
        if (record) {
          await db.writeCaught(record);
        } else {
          await db.deleteCaught(key);
        }
      }
    } catch {
      store.setState({
        status: "unavailable",
        caughtKeys: new Set(),
      });
    }
  }

  function queueFlush(): void {
    if (flushQueued) {
      return;
    }

    flushQueued = true;
    const generation = writeGeneration;
    queueMicrotask(() => {
      void flushPendingWrites(generation);
    });
  }

  return {
    beginLazyLoad: async () => {
      const { status } = store.getState();

      if (status === "unavailable" || status === "ready") {
        return;
      }
      if (loadPromise) {
        return loadPromise;
      }

      const loadGeneration = storageGeneration;
      store.setState({ status: "loading" });
      loadPromise = (async () => {
        try {
          const records = await db.readAllCaught();
          const caughtKeys =
            loadGeneration === storageGeneration
              ? new Set(
                  (records as CaughtEncounterRecord[]).map(
                    (record) => record.key,
                  ),
                )
              : new Set<string>();
          store.setState({ status: "ready", caughtKeys });
        } catch {
          try {
            await db.recreate();
            store.setState({ status: "ready", caughtKeys: new Set() });
          } catch {
            store.setState({ status: "unavailable", caughtKeys: new Set() });
          }
        } finally {
          loadPromise = null;
        }
      })();

      return loadPromise;
    },

    hasCaughtRecords: async () => {
      if (!canUseIndexedDB()) {
        return false;
      }
      if (store.getState().status === "ready") {
        return store.getState().caughtKeys.size > 0;
      }

      try {
        return await db.hasCaughtRecords();
      } catch {
        return false;
      }
    },

    toggleCaught: (input) => {
      if (store.getState().status !== "ready") {
        return;
      }

      const key = makeCaughtEncounterKey(input);
      const caughtKeys = new Set(store.getState().caughtKeys);

      if (caughtKeys.has(key)) {
        caughtKeys.delete(key);
        pendingWrites.set(key, null);
      } else {
        caughtKeys.add(key);
        pendingWrites.set(key, {
          key,
          levelId: input.levelId,
          zone: input.zone,
          speciesId: input.speciesId,
        });
      }

      store.setState({ caughtKeys });
      queueFlush();
    },

    clearCaught: async () => {
      if (!canUseIndexedDB()) {
        return;
      }

      writeGeneration += 1;
      storageGeneration += 1;
      pendingWrites.clear();

      if (store.getState().status === "ready") {
        store.setState({ caughtKeys: new Set() });
      }

      try {
        await db.clearCaught();
      } catch {
        try {
          await db.recreate();
        } catch {
          store.setState({ status: "unavailable", caughtKeys: new Set() });
        }
      }
    },
  };
}
