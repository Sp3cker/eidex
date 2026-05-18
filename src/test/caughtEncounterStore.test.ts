import { beforeEach, describe, expect, it, vi } from "vitest";

type StoredRecord = { key: string };
type MockDbUpgradeOptions = {
  upgrade?: (db: {
    objectStoreNames: { contains: () => boolean };
    createObjectStore: ReturnType<typeof vi.fn>;
  }) => void;
};

const records = new Map<string, StoredRecord>();
const openDB = vi.fn(async (_name: string, _version: number, options?: MockDbUpgradeOptions) => {
  options?.upgrade?.({
    objectStoreNames: { contains: () => true },
    createObjectStore: vi.fn(),
  });
  return {
    getAll: vi.fn(async () => [...records.values()]),
    count: vi.fn(async () => records.size),
    put: vi.fn(async (_store: string, record: StoredRecord) => {
      records.set(record.key, record);
    }),
    delete: vi.fn(async (_store: string, key: string) => {
      records.delete(key);
    }),
    clear: vi.fn(async () => {
      records.clear();
    }),
  };
});
const deleteDB = vi.fn(async () => {
  records.clear();
});

vi.mock("idb", () => ({
  openDB,
  deleteDB,
}));

async function importStore() {
  const module = await import("@/stores/caughtEncounterStore");
  return module;
}

async function flushMicrotasks() {
  await Promise.resolve();
  await Promise.resolve();
}

describe("caughtEncounterStore", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    records.clear();
    Object.defineProperty(window, "indexedDB", {
      value: {},
      configurable: true,
    });
  });

  it("starts unavailable when IndexedDB is absent", async () => {
    Object.defineProperty(window, "indexedDB", {
      value: undefined,
      configurable: true,
    });

    const { caughtEncounterStore } = await importStore();

    expect(caughtEncounterStore.getState().status).toBe("unavailable");
  });

  it("beginLazyLoad is idempotent", async () => {
    const { caughtEncounterStore } = await importStore();

    await Promise.all([
      caughtEncounterStore.getState().beginLazyLoad(),
      caughtEncounterStore.getState().beginLazyLoad(),
    ]);

    expect(openDB).toHaveBeenCalledTimes(1);
    expect(caughtEncounterStore.getState().status).toBe("ready");
  });

  it("hydrates caughtKeys", async () => {
    records.set("level:land:1", { key: "level:land:1" });
    const { caughtEncounterStore } = await importStore();

    await caughtEncounterStore.getState().beginLazyLoad();

    expect(caughtEncounterStore.getState().caughtKeys.has("level:land:1")).toBe(
      true,
    );
  });

  it("ignores toggleCaught before ready", async () => {
    const { caughtEncounterStore } = await importStore();

    caughtEncounterStore.getState().toggleCaught({
      levelId: "level",
      zone: "land",
      speciesId: 1,
    });

    expect(caughtEncounterStore.getState().caughtKeys.size).toBe(0);
    expect(records.size).toBe(0);
  });

  it("updates memory optimistically when ready", async () => {
    const { caughtEncounterStore } = await importStore();
    await caughtEncounterStore.getState().beginLazyLoad();

    caughtEncounterStore.getState().toggleCaught({
      levelId: "level",
      zone: "land",
      speciesId: 1,
    });

    expect(caughtEncounterStore.getState().caughtKeys.has("level:land:1")).toBe(
      true,
    );
  });

  it("coalesces queued writes by key", async () => {
    const { caughtEncounterStore } = await importStore();
    await caughtEncounterStore.getState().beginLazyLoad();

    caughtEncounterStore.getState().toggleCaught({
      levelId: "level",
      zone: "land",
      speciesId: 1,
    });
    caughtEncounterStore.getState().toggleCaught({
      levelId: "level",
      zone: "land",
      speciesId: 1,
    });
    caughtEncounterStore.getState().toggleCaught({
      levelId: "level",
      zone: "land",
      speciesId: 1,
    });
    await flushMicrotasks();

    expect(records.has("level:land:1")).toBe(true);
    expect(records.size).toBe(1);
  });

  it("clearCaught clears memory and pending writes", async () => {
    const { caughtEncounterStore } = await importStore();
    await caughtEncounterStore.getState().beginLazyLoad();

    caughtEncounterStore.getState().toggleCaught({
      levelId: "level",
      zone: "land",
      speciesId: 1,
    });
    await caughtEncounterStore.getState().clearCaught();
    await flushMicrotasks();

    expect(caughtEncounterStore.getState().caughtKeys.size).toBe(0);
    expect(records.size).toBe(0);
  });

  it("hasCaughtRecords counts without hydrating caughtKeys", async () => {
    records.set("level:land:1", { key: "level:land:1" });
    const { caughtEncounterStore } = await importStore();

    await expect(caughtEncounterStore.getState().hasCaughtRecords()).resolves.toBe(
      true,
    );

    expect(caughtEncounterStore.getState().caughtKeys.size).toBe(0);
    expect(caughtEncounterStore.getState().status).toBe("dormant");
  });
});
