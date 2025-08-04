import { pokemonData } from "@/data/pokemon";
import useMapStore from "@/stores/useMapStore";
import { EncounterMons } from "@/stores/useMapStore/types";
const putTypeOnEncounter = (
  enc: EncounterMons[],
): (EncounterMons & { types: [number, number] })[] => {
  return enc.map((encounter) => {
    const species = pokemonData.find((p) => p.speciesId === encounter.species);
    if (species) {
      Object.defineProperty(encounter, "types", {
        value: species.types,
        writable: false,
        enumerable: true,
        configurable: false,
      });
    }
    return encounter as EncounterMons & { types: [number, number] };
  });
};
const useEncounter = (zone: "water" | "land" | "fishing") => {
  const encounter = useMapStore((state) => {
    if (zone === "water") return state.selectedLevelWaterMons;
    if (zone === "land") return state.selectedLevelLandMons;
    if (zone === "fishing") return state.selectedLevelFishingMons;
    return [];
  });
  if (!encounter || encounter.length === 0) {
    return [];
  }
  return putTypeOnEncounter(encounter);
};

export { useEncounter, putTypeOnEncounter };