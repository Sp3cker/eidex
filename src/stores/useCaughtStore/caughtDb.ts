import { CaughtEncounterRecord } from "./caughtEncounterStore"
import { openDB, deleteDB, type IDBPDatabase } from "idb";

type CaughtDbApi = {
    readAllCaught: () => Promise<CaughtEncounterRecord[]>;
    hasCaughtRecords: () => Promise<boolean>;
    writeCaught: (record: CaughtEncounterRecord) => Promise<void>
    deleteCaught: (key: string) => Promise<void>;
    recreate: () => Promise<void>;
}


export function makeCaughtEncounterKey({
    levelId,
    zone,
    speciesId,
}: CaughtEncounterInput): string {
    return `${levelId}:${zone}:${speciesId}`;
}
function createCaughtActions(
    store: Pick<StoreApi<CaughtEncounterStore>, "setState" | "getState">,
    db: CaughtDbApi
)
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
