import { create } from "zustand";
import encounters from "@/data/map/cleanEncounters.json";
import maps from "@/data/map/mapsvgs.json";
import pokemon from "@/data/speciesData.json";
// import svgData from "@/data/map/mapsvgs.json";
// import parseSvg from "@/utils/parseSvg";
// import parseSvg from "svg-path-parser";
import { Pokemon } from "@/types";
import ItemSearch, { Item } from "@/utils/itemsData";

const getMap = (map: string) => maps.filter((m) => m.id === map);
const Encounters = new Map(encounters.map((obj) => [obj.map, obj]));
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
  selectedMap: string | null;
  selectedMapLandMons: EncounterMons[] | undefined;
  selectedMapWaterMons: EncounterMons[] | undefined;
  selectedMapFishingMons: EncounterMons[] | undefined;
  selectedPokemon: Pokemon | null;
  selectedCoordinates: number[];
  storedCoordinates: Map<string, number[]>;
  // setStoredCoordinates: (map: string, coords: number[]) => void;
  mapScale: number;
  mapOffset: number[];
  hoveredMap: string | null;
  hoveredCoordinates: number[];
  dexNavIsOpen: boolean;
  selectedMapItems: Item[];
  deselectMap: () => void;
  setSelectedMap: (map: string) => void;
  setSelectedPokemon: (name_no_prefix: string) => void;
  setSelectedCoordinates: (coords: number[]) => void;
  setMapScale: (n: number) => void;
  setMapOffset: (offset: number[]) => void;
  setHoveredMap: (map: string) => void;
  setDexnavIsOpen: (isOpen: boolean) => void;
  setHoveredCoordinates: (coords: number[]) => void;
  searchItemByName: (name: string) => Item[];
};
const UnderscoreRegex = new RegExp(/^[^_]*_/);

const putIdOnEncounter: (
  enc: EncounterMonsFromJSON[],
  monsNameKeys: Map<string, number>,
) => asserts enc is EncounterMons[] = (enc, monsNameKeys) => {
  enc.forEach((specie, index) => {
    let specieIndex = monsNameKeys.get(specie.species);
    if (specieIndex === undefined) {
      // "iron_valiant" from encounters file -> iron valiant in nameKeys
      specieIndex = monsNameKeys.get(
        specie.species.replace("_", " ").toLowerCase(),
      );
      if (specieIndex === undefined) {
        // If it gets this far, the mon in 'Encounters' doesn't specify its form so fuck it
        const monInJson = pokemon.findIndex(
          (p) => p.speciesName.toLowerCase() === specie.species,
        );
        if (monInJson === -1) {
          console.error(
            "Error: %s not found in encounters.json or speciesData.json",
            specie.species,
          );
          return;
        }
        specieIndex = pokemon[monInJson].index;
      }
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
export const useMapStore = create<MapStore>((set) => {
  // const storedCoordinates = new Map<string, number[]>();
  // maps.forEach((map) => {
  //   const mapName = map.map;
  //   const mapCoords = svgData.find((m) => {
  //     if (m.d) {
  //       console.log(m.id);
  //       console.log(parseSvg(m.d));
  //     }
  //     m.id === mapName;
  //   });
  //   if (mapCoords) {
  //     const coords = [];
  //   }
  // });
  return {
    selectedMap: null,
    selectedMapLandMons: undefined,
    selectedMapWaterMons: undefined,
    selectedMapFishingMons: undefined,
    selectedCoordinates: [400, 340],
    storedCoordinates: new Map<string, number[]>(),
    mapScale: 1,
    mapOffset: [0, 0],
    hoveredMap: null,
    hoveredCoordinates: [0, 0],
    dexNavIsOpen: false,
    selectedMapItems: [],
    deselectMap: () => set({ selectedMap: null }),
    setSelectedMap: (map: string) => {
      if (map === null) {
        set({ selectedMap: null });
        return;
      }
      const targetMap = getMap(map);
      if (targetMap.length === 0) {
        console.error("Error selecting map %s", map);
        return;
      }
      const targetMapEncounters = Encounters.get(targetMap[0].id);

      let landEncounters, waterEncounters, fishingEncounters;
      if (targetMapEncounters) {
        /** Put ID on each mon so we can get their sprite andn info later
         * Build a Map so we don't have to `map` through the `encounters` json for each lookup :3
         */
        const monsNameKeys = new Map<string, number>([]);
        pokemon.forEach((p) => {
          monsNameKeys.set(p.nameKey.toLowerCase().replace(/-/g, "_"), p.index);
          // monsNameKeys.set(p.speciesName.replace("-", "_").toLowerCase(), p.index);
        }); //nameKey cause it probly matches encounter Data
        if (targetMapEncounters && targetMapEncounters.land_mons) {
          putIdOnEncounter(targetMapEncounters.land_mons.mons, monsNameKeys);
          landEncounters = putEncounterRate(
            targetMapEncounters.land_mons?.mons,
          );
        }
        if (targetMapEncounters && targetMapEncounters.water_mons) {
          putIdOnEncounter(targetMapEncounters.water_mons.mons, monsNameKeys);
          waterEncounters = putEncounterRate(
            targetMapEncounters.water_mons?.mons,
          );
        }
        if (targetMapEncounters && targetMapEncounters.fishing_mons) {
          putIdOnEncounter(targetMapEncounters.fishing_mons.mons, monsNameKeys);
          fishingEncounters = putEncounterRate(
            targetMapEncounters.fishing_mons.mons,
          );
        }
      }
      // console.error("Encounters not found for map %s", map);

      /** Parse Out Items for Map */
      const selectedMapItems = ItemSearch.byMap(map);
      if (selectedMapItems.length === 0) {
        console.error("Error selecting items for map %s", map);
      }
      set({
        selectedMap: map,
        selectedMapLandMons: landEncounters,
        selectedMapWaterMons: waterEncounters,
        selectedMapFishingMons: fishingEncounters,
        selectedMapItems,
      });
    },
    setSelectedPokemon: (name: string) => {
      const poke = pokemon.filter(
        (p) =>
          p.speciesName.toUpperCase() === name.replace(UnderscoreRegex, ""),
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
    searchItemByName: (name: string) => {
      return ItemSearch.search(name);
    },
    // setStoredCoordinates: (map: string, coords: number[]) =>{}
    // set(() => {
    // const newCoords = new Map(state.coordinates);
    // newCoords.set(map, coords);
    //  { coordinates: newCoords };
    // }),
  };
});

export default useMapStore;
