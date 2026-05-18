import { openDB, deleteDB, type IDBPDatabase } from "idb";
import { createStore, useStore } from "zustand";

export const CAUGHT_TRACKER_DB_NAME = "eidex-caught-tracker";
export const CAUGHT_TRACKER_STORE_NAME = "caught-encounters";
export const CAUGHT_TRACKER_DB_VERSION = 1;

export type EncounterZone = "land" | "water" | "fishing";
export type CaughtEncounterStatus =
  | "unavailable"
  | "dormant"
  | "loading"
  | "ready";

export type CaughtEncounterRecord = {
  key: string;
  levelId: string;
  zone: EncounterZone;
  speciesId: number;
  caughtAt: number;
};

export type CaughtEncounterInput = {
  levelId: string;
  zone: EncounterZone;
  speciesId: number;
};

type PendingWrite = CaughtEncounterRecord | null;

type CaughtEncounterStore = {
  status: CaughtEncounterStatus;
  caughtKeys: Set<string>;
  beginLazyLoad: () => Promise<void>;
  hasCaughtRecords: () => Promise<boolean>;
  toggleCaught: (input: CaughtEncounterInput) => void;
  clearCaught: () => Promise<void>;
};

export function makeCaughtEncounterKey({
  levelId,
  zone,
  speciesId,
}: CaughtEncounterInput): string {
  return `${levelId}:${zone}:${speciesId}`;
}

function canUseIndexedDB(): boolean {
  return typeof window !== "undefined" && Boolean(window.indexedDB);
}

function getInitialStatus(): CaughtEncounterStatus {
  return canUseIndexedDB() ? "dormant" : "unavailable";
}

let dbPromise: Promise<IDBPDatabase> | null = null;
let loadPromise: Promise<void> | null = null;
let flushQueued = false;
let writeGeneration = 0;
let storageGeneration = 0;
const pendingWrites = new Map<string, PendingWrite>();

function openCaughtDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(CAUGHT_TRACKER_DB_NAME, CAUGHT_TRACKER_DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(CAUGHT_TRACKER_STORE_NAME)) {
          db.createObjectStore(CAUGHT_TRACKER_STORE_NAME, { keyPath: "key" });
        }
      },
    });
  }

  return dbPromise;
}

async function recreateCaughtDb(): Promise<IDBPDatabase> {
  dbPromise = null;
  await deleteDB(CAUGHT_TRACKER_DB_NAME);
  return openCaughtDb();
}

async function flushPendingWrites(generation: number): Promise<void> {
  flushQueued = false;

  if (generation !== writeGeneration || pendingWrites.size === 0) {
    return;
  }

  const writes = [...pendingWrites];
  pendingWrites.clear();

  try {
    const db = await openCaughtDb();
    if (generation !== writeGeneration) {
      return;
    }

    for (const [key, record] of writes) {
      if (record) {
        await db.put(CAUGHT_TRACKER_STORE_NAME, record);
      } else {
        await db.delete(CAUGHT_TRACKER_STORE_NAME, key);
      }
    }
  } catch {
    caughtEncounterStore.setState({
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

export const caughtEncounterStore = createStore<CaughtEncounterStore>()(
  (set, get) => ({
    status: getInitialStatus(),
    caughtKeys: new Set(),
    beginLazyLoad: async () => {
      const status = get().status;

      if (status === "unavailable" || status === "ready") {
        return;
      }
      if (loadPromise) {
        return loadPromise;
      }

      const loadGeneration = storageGeneration;
      set({ status: "loading" });
      loadPromise = (async () => {
        try {
          const db = await openCaughtDb();
          const records = await db.getAll(CAUGHT_TRACKER_STORE_NAME);
          const caughtKeys =
            loadGeneration === storageGeneration
              ? new Set(
                  (records as CaughtEncounterRecord[]).map(
                    (record) => record.key,
                  ),
                )
              : new Set<string>();
          set({ status: "ready", caughtKeys });
        } catch {
          try {
            await recreateCaughtDb();
            set({ status: "ready", caughtKeys: new Set() });
          } catch {
            set({ status: "unavailable", caughtKeys: new Set() });
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
      if (get().status === "ready") {
        return get().caughtKeys.size > 0;
      }

      try {
        const db = await openCaughtDb();
        return (await db.count(CAUGHT_TRACKER_STORE_NAME)) > 0;
      } catch {
        return false;
      }
    },
    toggleCaught: (input) => {
      if (get().status !== "ready") {
        return;
      }

      const key = makeCaughtEncounterKey(input);
      const caughtKeys = new Set(get().caughtKeys);

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
          caughtAt: Date.now(),
        });
      }

      set({ caughtKeys });
      queueFlush();
    },
    clearCaught: async () => {
      if (!canUseIndexedDB()) {
        return;
      }

      writeGeneration += 1;
      storageGeneration += 1;
      pendingWrites.clear();

      if (get().status === "ready") {
        set({ caughtKeys: new Set() });
      }

      try {
        const db = await openCaughtDb();
        await db.clear(CAUGHT_TRACKER_STORE_NAME);
      } catch {
        try {
          await recreateCaughtDb();
        } catch {
          set({ status: "unavailable", caughtKeys: new Set() });
        }
      }
    },
  }),
);

export function useCaughtEncounterStore(): CaughtEncounterStore;
export function useCaughtEncounterStore<T>(
  selector: (state: CaughtEncounterStore) => T,
): T;
export function useCaughtEncounterStore<T>(
  selector?: (state: CaughtEncounterStore) => T,
) {
  if (selector) return useStore(caughtEncounterStore, selector);
  return useStore(caughtEncounterStore);
}
