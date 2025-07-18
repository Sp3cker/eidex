import { create } from "zustand";
import createSelectors from "@/stores/createSelectors";

import levelCaps from "@/data/caps.json";
type CapsState = {
  caps: number[];
  currentCap: number;
  setCurrentCap: (capIndex: number) => void;
};

const capStore = createSelectors(
  create<CapsState>((set, get) => ({
    caps: levelCaps.map((cap) => cap.cap),
    currentCap: levelCaps[0].cap,
    setCurrentCap: (capValue: number) => {
      const validCaps = get().caps;
      if (!validCaps.includes(capValue)) {
        return;
      }
      set({ currentCap: capValue });
    },
  })),
);

export default capStore;
