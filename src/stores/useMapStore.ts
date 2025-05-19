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
  rate: number;
};
type EncounterMonsFromJSON = {
  min_level: number;
  max_level: number;
  species: string;
  index?: number; // doesn't exist until we derive it
};

type MapStore = {
  encounters: any[];
  selectedMap: string | null;
  selectedMapLandMons: EncounterMons[] | undefined;
  selectedMapWaterMons: EncounterMons[] | undefined;
  selectedMapFishingMons: EncounterMons[] | undefined;
  selectedPokemon: Pokemon | null;
  selectedCoordinates: number[];
  mapScale: number;
  mapOffset: number[];
  hoveredMap: string | null;
  hoveredCoordinates: number[];
  dexNavIsOpen: boolean;
  deselectMap: () => void;
  setSelectedMap: (map: string) => void;
  setSelectedPokemon: (name_no_prefix: string) => void;
  setSelectedCoordinates: (coords: number[]) => void;
  setMapScale: (n: number) => void;
  setMapOffset: (offset: number[]) => void;
  setHoveredMap: (map: string) => void;
  setDexnavIsOpen: (isOpen: boolean) => void;
  setHoveredCoordinates: (coords: number[]) => void;
};
const UnderscoreRegex = new RegExp(/^[^_]*_/);

const putIdOnEncounter: (
  enc: EncounterMonsFromJSON[],
  monsNameKeys: Map<string, number>,
) => asserts enc is EncounterMons[] = (enc, monsNameKeys) => {
  enc.forEach((specie, index) => {
    const specieIndex = monsNameKeys.get(specie.species);
    if (specieIndex === undefined) {
      return;
    }
    return (enc[index].index = specieIndex);
  });
};
const putEncounterRate = (mons: EncounterMons[]) => {
  const rates = [20, 20, 10, 10, 10, 10, 5, 5, 4, 4, 1, 1];
  const encounterRates = new Map<string, number>();
  const monsterProps = new Map<string, EncounterMons>();
  // Calculate total rates for each monster
  mons.forEach((encounter, index) => {
    if (index < rates.length) {
      // let currentRate = arr[index].rate || 0
      // currentRate += rates[index];
      const currentRate = encounterRates.get(encounter.species) || 0;
      encounterRates.set(encounter.species, currentRate + rates[index]);
      const monsNewRate = encounterRates.get(encounter.species) || 0;
      monsterProps.set(encounter.species, {
        species: encounter.species,
        max_level: encounter.max_level,
        min_level: encounter.min_level,
        index: encounter.index,
        rate: monsNewRate,
      });
    }
  });

  return Array.from(monsterProps.values()) as EncounterMons[];
};
export function formatMapString(mapNameFromJson: string) {
  return (
    mapNameFromJson
      .replace(/^MAP_/, "") // Remove 'MAP_' prefix
      // .toLowerCase() // Convert to lowercase
      .replace(
        /([A-Z]+)_?/g,
        (_, p1) => p1.charAt(0).toUpperCase() + p1.slice(1).toLowerCase() + " ",
      )
      .trim()
      .replace(/(^|_)([a-z])/g, (_: any, __: any, letter: string) =>
        letter.toUpperCase(),
      ) // Capitalize first letter and after underscores
  );
}
export const useMapStore = create<MapStore>((set) => ({
  encounters,
  selectedMap: null,
  selectedMapLandMons: undefined,
  selectedMapWaterMons: undefined,
  selectedMapFishingMons: undefined,
  selectedCoordinates: [400, 340, 0, 0],
  mapScale: 1,
  mapOffset: [0, 0],
  hoveredMap: null,
  hoveredCoordinates: [0, 0],
  dexNavIsOpen: false,
  deselectMap: () => set({ selectedMap: null }),
  setSelectedMap: (map: string) => {
    if (map === null) {
      set({ selectedMap: null });
      return;
    }
    const targetMapArr = getMap(map);
    if (targetMapArr.length === 0) {
      console.error("Error selecting map %s", map);
      return;
    }
    /** Put ID on each mon so we can get their sprite andn info later
     * Build a Map so we don't have to `map` through the `encounters` json for each lookup :3
     */
    const monsNameKeys = new Map<string, number>([]);
    pokemon.forEach((p) => {
      monsNameKeys.set(p.speciesName.toLowerCase(), p.index);
      monsNameKeys.set(p.nameKey.replace("-", "_").toLowerCase(), p.index);
    }); //nameKey cause it probly matches encounter Data
    // targetMapArr[0].land_mons.mons.map((p) => p.species),
    let landEncounters, waterEncounters, fishingEncounters;
    if (targetMapArr[0].land_mons) {
      putIdOnEncounter(targetMapArr[0].land_mons.mons, monsNameKeys);
      landEncounters = putEncounterRate(targetMapArr[0].land_mons?.mons);
    }
    if (targetMapArr[0].water_mons) {
      putIdOnEncounter(targetMapArr[0].water_mons.mons, monsNameKeys);
      waterEncounters = putEncounterRate(targetMapArr[0].water_mons?.mons);
    }
    if (targetMapArr[0].fishing_mons) {
      putIdOnEncounter(targetMapArr[0].fishing_mons.mons, monsNameKeys);
      fishingEncounters = putEncounterRate(targetMapArr[0].fishing_mons.mons);
    }
    set({
      selectedMap: targetMapArr[0].map,
      selectedMapLandMons: landEncounters,
      selectedMapWaterMons: waterEncounters,
      selectedMapFishingMons: fishingEncounters,
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
  setSelectedCoordinates: (coords) => {
    set({ selectedCoordinates: coords });
  },
  setMapScale: (n) => set({ mapScale: n }),
  setMapOffset: (offset) => set({ mapOffset: offset }),
  setHoveredMap: (map: string) => set({ hoveredMap: map }),
  setHoveredCoordinates: (coords: number[]) =>
    set({ hoveredCoordinates: coords }),
  setDexnavIsOpen: (isOpen) => set({ dexNavIsOpen: isOpen }),
}));

export default useMapStore;
