import { createStore, useStore } from "zustand";
import { createCaughtActions } from "./actions";
import { canUseIndexedDB, caughtTrackerDb } from "./db";
import type { CaughtEncounterStatus, CaughtEncounterStore } from "./types";

function getInitialStatus(): CaughtEncounterStatus {
  return canUseIndexedDB() ? "dormant" : "unavailable";
}

export const caughtEncounterStore = createStore<CaughtEncounterStore>()(
  (_, get, store) => ({
    status: getInitialStatus(),
    caughtKeys: new Set(),
    ...createCaughtActions(
      {
        getState: get,
        setState: store.setState,
      },
      caughtTrackerDb,
    ),
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
