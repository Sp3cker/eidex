import { createStore, useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { RandomizerSpeciesMode } from "../lib/randomiser/SpeciesTable.ts";
import { encounterStore } from "../data/map/encounters.ts";
import {
  splitSaveIntoChunks,
  getTrainerIdFromSectors,
} from "../lib/randomiser/trainerIdExtractor.ts";
//const { pokemonSearchStore } = await import("./pokemonSearchStore.ts");
// ^ REQUIRED BELOW!!!!

export type TrainerIdInfo = {
  trainerId: number;
  secretId: number;
  fullId: number;
};

interface RandomiserStore {
  isUploading: boolean;
  isProcessing: boolean;
  error: string | null;
  uploadSuccess: boolean;
  didRunInit: boolean;
  isRandomiserActive: boolean;
  trainerIdInfo: TrainerIdInfo | null;
  userRandomizerMode: RandomizerSpeciesMode;

  setTrainerIdInfo: (info: TrainerIdInfo | null | undefined) => void;
  toggleRandomiserActive: () => void;
  disableRandomiserActive: () => void;
  handleUpload: (file: File) => Promise<void>;
  clearError: () => void;
  reset: () => void;
  onInit: () => Promise<void>;
  setUserRandomizerMode: (mode: RandomizerSpeciesMode) => void;
}

// A simple readiness gate so other modules can wait until encounters are ready
let encountersReadyResolve: (() => void) | null = null;
let encountersReadyPromise: Promise<void> | null = null;
function resetEncountersReady() {
  encountersReadyPromise = new Promise<void>((resolve) => {
    encountersReadyResolve = resolve;
  });
}
// initialize gate on first import
resetEncountersReady();

export function waitForEncountersReady(): Promise<void> {
  // Safety: always return a promise
  return encountersReadyPromise ?? Promise.resolve();
}
function markEncountersReady() {
  // Resolve the current promise if pending
  encountersReadyResolve?.();
  encountersReadyResolve = null;
}

export const randomizerStore = createStore<RandomiserStore>()(
  persist(
    (set, get) => ({
      isUploading: false,
      isProcessing: false,
      error: null,
      uploadSuccess: false,
      trainerIdInfo: null,
      userRandomizerMode: null as unknown as RandomizerSpeciesMode, // default to null
      didRunInit: false,
      isRandomiserActive: false,
      setTrainerIdInfo: (info) => set({ trainerIdInfo: info }),
      setUserRandomizerMode: (mode) => set({ userRandomizerMode: mode }),
      toggleRandomiserActive: () =>
        set((state) => ({ isRandomiserActive: !state.isRandomiserActive })),
      disableRandomiserActive: () => set(() => ({ isRandomiserActive: false })),
      reset: () => {
        set({
          isUploading: false,
          isProcessing: false,
          error: null,
          uploadSuccess: false,
          trainerIdInfo: null,
          // didRunInit: false,
          isRandomiserActive: false,
          userRandomizerMode: null as unknown as RandomizerSpeciesMode,
        });
        encounterStore.clearEncounterData();
        encounterStore.resetEncounterData();
        // window.indexedDB.databases().then((dbs) => {
        //   dbs.forEach((db) => {
        //     if (db.name) {
        //       window.indexedDB.deleteDatabase(db.name);
        //     }
        //   });
        // });
        // encounterStore.reset();
      },
      // Actions
      handleUpload: async (file: File) => {
        // const { reset } = get();
        try {
          const randomizerMode = get().userRandomizerMode;
          if (randomizerMode === null) {
            throw new Error("No randomizer mode set");
          }
          // reset();
          set({ isUploading: true, error: null });
          if (!file) {
            throw new Error("No file provided");
          }

          // Check file size (must be at least 128KB, up to ~131KB for mGBA)
          if (file.size < 128 * 1024) {
            throw new Error("Save file must be at least 128KB");
          }
          if (file.size > 132 * 1024) {
            throw new Error("Save file is too large (max 132KB)");
          }
          const trainerData: TrainerIdInfo = {
            trainerId: 0,
            secretId: 0,
            fullId: 0,
          };

          set({ isProcessing: true });
          requestAnimationFrame(async () => {
            const arrayBuffer = await file.arrayBuffer();

            const sectors = splitSaveIntoChunks(arrayBuffer);

            const trainerIdData = getTrainerIdFromSectors(sectors);

            trainerData.trainerId = trainerIdData.trainerId;
            trainerData.secretId = trainerIdData.secretId;
            trainerData.fullId = trainerIdData.fullId;

            await encounterStore.randomizeEncountersWithTrainerSeed(
              trainerData.fullId,
              randomizerMode,
            );
            markEncountersReady();
            const { pokemonSearchStore } = await import("./pokemonSearchStore.ts");
            pokemonSearchStore._initialize();
            set({
              isUploading: false,
              isProcessing: false,
              uploadSuccess: true,
              trainerIdInfo: trainerData,
              isRandomiserActive: true,
              // error: null,
            });
          });
          // Encounters are now randomized and ready
        } catch (error) {
          set({ error: error as string });
          console.error("Upload processing error:", error);
          get().reset();
        }
      },
      clearError: () => set({ error: null }),

      onInit: async () => {
        const { trainerIdInfo, didRunInit, userRandomizerMode } = get();
        if (didRunInit) {
          // If we've already initialized, assume encounters are ready
          markEncountersReady();
          return;
        }
        if (!trainerIdInfo || !trainerIdInfo.fullId) {
          // No trainer data means nothing to wait for
          // This also avoids setting encounters with bad randos
          markEncountersReady();
          get().reset();
          return;
        }
        const { fullId } = trainerIdInfo;

        requestAnimationFrame(async () => {
          await encounterStore.randomizeEncountersWithTrainerSeed(
            fullId,
            userRandomizerMode,
          );
          const { pokemonSearchStore } = await import("./pokemonSearchStore.ts");
          pokemonSearchStore._initialize();
          // Signal that randomized encounters are ready for consumers
          markEncountersReady();
        });
        set({ isRandomiserActive: true, didRunInit: true });
      },
    }),
    {
      name: "eimap-trainer-id", // storage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        trainerIdInfo: state.trainerIdInfo,
        userRandomizerMode: state.userRandomizerMode,
        isRandomiserActive: state.isRandomiserActive,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Error rehydrating storage:", error);
        }
        if (state) {
          queueMicrotask(() => {
            // guard inside onInit prevents double-run
            state.onInit();
          });
        }
      },
    },
  ),
);

export function useRandomizerStore(): RandomiserStore;
export function useRandomizerStore<T>(
  selector: (state: RandomiserStore) => T,
): T;
export function useRandomizerStore<T>(
  selector?: (state: RandomiserStore) => T,
) {
  if (selector) return useStore(randomizerStore, selector);
  return useStore(randomizerStore);
}
