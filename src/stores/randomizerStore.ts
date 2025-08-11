import { createStore, useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { RandomizerSpeciesMode } from "@/lib/randomiser/buildSpeciesTable";
import { encounterStore } from "@/data/map/encounters";
import {
  splitSaveIntoChunks,
  getTrainerIdFromSectors,
  getRandomizerModeFromSectors,
} from "@/lib/randomiser/trainerIdExtractor";

export type TrainerIdInfo = {
  trainerId: number;
  secretId: number;
  fullId: number;
  randomizerMode: RandomizerSpeciesMode;
};

interface RandomiserStore {
  isUploading: boolean;
  isProcessing: boolean;
  error: string | null;
  uploadSuccess: boolean;
  didRunInit: boolean;
  isRandomiserActive: boolean;
  trainerIdInfo: TrainerIdInfo | null;

  setTrainerIdInfo: (info: TrainerIdInfo | null | undefined) => void;
  toggleRandomiserActive: () => void;
  disableRandomiserActive: () => void;
  handleUpload: (file: File) => Promise<void>;
  clearError: () => void;
  clearEverything: () => void;
  reset: () => void;
  onInit: () => Promise<void>;
}

export const randomizerStore = createStore<RandomiserStore>()(
  persist(
    (set, get) => ({
      isUploading: false,
      isProcessing: false,
      error: null,
      uploadSuccess: false,
      trainerIdInfo: null,
      didRunInit: false,
      isRandomiserActive: false,
      setTrainerIdInfo: (info) => set({ trainerIdInfo: info }),
      toggleRandomiserActive: () =>
        set((state) => ({ isRandomiserActive: !state.isRandomiserActive })),
      disableRandomiserActive: () => set(() => ({ isRandomiserActive: false })),
      clearEverything: () => {
        set({
          isUploading: false,
          isProcessing: false,
          error: null,
          uploadSuccess: false,
          trainerIdInfo: null,
          didRunInit: false,
          isRandomiserActive: false,
        });
        window.indexedDB.databases().then((dbs) => {
          dbs.forEach((db) => {
            if (db.name) {
              window.indexedDB.deleteDatabase(db.name);
            }
          });
        });
        // encounterStore.reset();
      },
      // Actions
      handleUpload: async (file: File) => {
        const { reset } = get();
        try {
          reset();
          set({ isUploading: true });
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
          const arrayBuffer = await file.arrayBuffer();

          set({ isProcessing: true });

          const sectors = splitSaveIntoChunks(arrayBuffer);

          const trainerIdData = getTrainerIdFromSectors(sectors);
          const randomizerData = getRandomizerModeFromSectors(sectors);

          const trainerData = {
            trainerId: trainerIdData.trainerId,
            secretId: trainerIdData.secretId,
            fullId: trainerIdData.fullId,
            randomizerMode: randomizerData.mappedMode,
          };

          await encounterStore.randomizeEncountersWithTrainerSeed(
            trainerData.fullId,
            trainerData.randomizerMode,
          );

          set({
            isUploading: false,
            isProcessing: false,
            uploadSuccess: true,
            trainerIdInfo: trainerData,
            isRandomiserActive: true,
            error: null,
          });
        } catch (error) {
          console.error("Upload processing error:", error);
          get().clearEverything();
        }
      },
      clearError: () => set({ error: null }),

      reset: () =>
        set({
          isUploading: false,
          isProcessing: false,
          error: null,
          uploadSuccess: false,
          trainerIdInfo: null,
          didRunInit: false,
        }),

      onInit: async () => {

        const { trainerIdInfo, didRunInit } = get();
        if (didRunInit) {
          return;
        }
        if (!trainerIdInfo) {
          return;
        }
        if (trainerIdInfo.randomizerMode === undefined) {
          get().clearEverything();
          return;
        }
        const { fullId, randomizerMode } = trainerIdInfo;

        await encounterStore.randomizeEncountersWithTrainerSeed(
          fullId,
          randomizerMode,
        );
        set({ isRandomiserActive: true, didRunInit: true });
      },
    }),
    {
      name: "eimap-trainer-id", // storage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        trainerIdInfo: state.trainerIdInfo,
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
