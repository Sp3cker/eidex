import { useRandomizerStore } from "@/stores/randomizerStore";

export function useMapController() {
  const { isRandomiserActive } = useRandomizerStore((s) => ({
    isRandomiserActive: s.isRandomiserActive,
  }));

  return { isRandomiserActive };
}
