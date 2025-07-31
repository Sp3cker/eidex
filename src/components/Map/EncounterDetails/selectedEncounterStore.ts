import { atom } from "jotai";

// the ID
export const selectedEncounterAtom = atom<number | null>(null);
export const showEncounterAtom = atom<boolean>(false);

export const syncEncounterAtom = atom(
  (get) => get(selectedEncounterAtom), // Read from selectedEncounterAtom
  (get, set, newValue: number | null) => {
    set(selectedEncounterAtom, newValue); // Update selectedEncounterAtom
    if (typeof newValue === "number") {
      set(showEncounterAtom, true); // Set showEncounterAtom to true if newValue is a number
    }
  },
);
