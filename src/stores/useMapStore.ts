import { create } from "zustand";
import encounters from "@/data/map/cleanEncounters.json";
import pokemon from "@/data/speciesData.json";
import { Pokemon } from "@/types";
const getMap = (map: string) => encounters.filter((m) => m.map === map);
type EncounterMons = {
  min_level: number;
  max_level: number;
  species: string;
  index: number;
};
type EncounterMonsFromJSON = {
  min_level: number;
  max_level: number;
  species: string;
  index?: number; // doesn't exist until we derive it
};

type EncounterZone = {
  encounter_rate: number;
  mons: EncounterMons;
};

type MapStore = {
  encounters: any[];
  selectedMap: string | null;
  selectedMapLandMons: EncounterMons[] | undefined;
  selectedMapWaterMons: EncounterMons[] | undefined;
  selectedMapFishingMons: EncounterMons[] | undefined;
  selectedPokemon: Pokemon | null;
  deselectMap: () => void;
  setSelectedMap: (map: string) => void;
  setSelectedPokemon: (name_no_prefix: string) => void;
};
const UnderscoreRegex = new RegExp(/^[^_]*_/);

const putIdOnEncounter: (
  enc: EncounterMonsFromJSON[],
  monsNameKeys: Map<string, number>,
) => asserts enc is EncounterMons[] = (enc, monsNameKeys) => {
  enc.forEach((specie, index) => {
    const specieIndex = monsNameKeys.get(specie.species);
    if (specieIndex !== undefined) {
      enc[index].index = specieIndex;
    }
  });
  // const nameKeysId = monsNameKeys.get()
};

const useMapStore = create<MapStore>((set) => ({
  encounters,
  selectedMap: null,
  selectedMapLandMons: undefined,
  selectedMapWaterMons: undefined,
  selectedMapFishingMons: undefined,
  deselectMap: () => set({ selectedMap: null }),
  setSelectedMap: (map: string) => {
    const targetMapArr = getMap(map);
    if (targetMapArr.length === 0) {
      console.error("Error selecting map %s", map);
      return;
    }
    /** Put ID on each mon so we can get their sprite andn info later
     * Build a Set so we don't have to `map` through the `encounters` json for each lookup :3
     */
    const monsNameKeys = new Map(
      pokemon.map((p) => [p.nameKey.toLowerCase(), p.index]), //nameKey cause it probly matches encounter Data
      // targetMapArr[0].land_mons.mons.map((p) => p.species),
    );
    if (targetMapArr[0].land_mons) {
      putIdOnEncounter(targetMapArr[0].land_mons.mons, monsNameKeys);
    }
    if (targetMapArr[0].water_mons) {
      putIdOnEncounter(targetMapArr[0].water_mons.mons, monsNameKeys);
    }
    if (targetMapArr[0].fishing_mons) {
      putIdOnEncounter(targetMapArr[0].fishing_mons.mons, monsNameKeys);
    }
    set({
      selectedMap: targetMapArr[0].base_label,
      selectedMapFishingMons: targetMapArr[0].fishing_mons
        ?.mons as EncounterMons[],
      selectedMapLandMons: targetMapArr[0].land_mons?.mons as EncounterMons[],
      selectedMapWaterMons: targetMapArr[0].water_mons?.mons as EncounterMons[],
    });
  },
  setSelectedPokemon: (name: string) => {
    const poke = pokemon.filter(
      (p) => p.speciesName.toUpperCase() === name.replace(UnderscoreRegex, ""),
    );
    if (poke.length !== 1) {
      console.error("Ambiguous findings for %s", name);
      return;
    }
    set({ selectedPokemon: poke[0] });
  },
  selectedPokemon: null,
}));

export default useMapStore;
