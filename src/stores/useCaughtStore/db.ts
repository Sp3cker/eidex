import { deleteDB, openDB, type IDBPDatabase } from "idb";
import type { CaughtEncounterRecord } from "./types";
// `store.ts` should be th eonly thing importing the DB below.
export const CAUGHT_TRACKER_DB_NAME = "eidex-caught-tracker";
export const CAUGHT_TRACKER_STORE_NAME = "caught-encounters";
export const CAUGHT_TRACKER_DB_VERSION = 1;

export type CaughtTrackerDb = {
  readAllCaught: () => Promise<CaughtEncounterRecord[]>;
  hasCaughtRecords: () => Promise<boolean>;
  writeCaught: (record: CaughtEncounterRecord) => Promise<void>;
  deleteCaught: (key: string) => Promise<void>;
  clearCaught: () => Promise<void>;
  recreate: () => Promise<void>;
};

let dbPromise: Promise<IDBPDatabase> | null = null;

export function canUseIndexedDB(): boolean {
  return typeof window !== "undefined" && Boolean(window.indexedDB);
}

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

export const caughtTrackerDb: CaughtTrackerDb = {
  async readAllCaught() {
    const db = await openCaughtDb();
    return db.getAll(CAUGHT_TRACKER_STORE_NAME);
  },

  async hasCaughtRecords() {
    const db = await openCaughtDb();
    return (await db.count(CAUGHT_TRACKER_STORE_NAME)) > 0;
  },

  async writeCaught(record) {
    const db = await openCaughtDb();
    await db.put(CAUGHT_TRACKER_STORE_NAME, record);
  },

  async deleteCaught(key) {
    const db = await openCaughtDb();
    await db.delete(CAUGHT_TRACKER_STORE_NAME, key);
  },

  async clearCaught() {
    const db = await openCaughtDb();
    await db.clear(CAUGHT_TRACKER_STORE_NAME);
  },

  async recreate() {
    dbPromise = null;
    await deleteDB(CAUGHT_TRACKER_DB_NAME);
    await openCaughtDb();
  },
};
