import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getSelectedMapInfo,
  getSelectedLevel,
  getInitialMapLevelData,
} from "./setSelectedMap";
import ItemSearch from "@/utils/itemsData"; 

vi.mock("@/data/pokemon", () => ({
  pokemonData: [
    { speciesId: 1, nameKey: "bulbasaur", speciesName: "Bulbasaur" },
    { speciesId: 4, nameKey: "charmander", speciesName: "Charmander" },
    { speciesId: 7, nameKey: "squirtle", speciesName: "Squirtle" },
    { speciesId: 25, nameKey: "pikachu", speciesName: "Pikachu" },
    { speciesId: 152, nameKey: "chikorita_key", speciesName: "Chikorita" },
  ],
}));

vi.mock("@/data/map", () => ({
  LevelsInfo: {
    MAP_TEST_ROUTE_1: [
      {
        levelLabel: "Route 1 - Area 1",
        thisLevelsId: "ROUTE_1_AREA_1",
        baseMap: "MAP_TEST_ROUTE_1_ENCOUNTERS",
        image: "route1_area1.png",
      },
      {
        levelLabel: "Route 1 - Area 2", 
        thisLevelsId: "ROUTE_1_AREA_2",
        baseMap: "MAP_TEST_ROUTE_1_ENCOUNTERS",
        image: "route1_area2.png",
      },
    ],
    MAP_NO_LEVELS_DEFINED: [],
    MAP_SINGLE_NO_ENCOUNTER_LEVEL: [
      {
        levelLabel: "Cave Entrance",
        thisLevelsId: "CAVE_ENTRANCE",
        baseMap: "MAP_CAVE_NO_ENCOUNTERS_DEFINED",
        image: "cave_entrance.png",
      },
    ],
    MAP_MULTI_LEVEL_ENCOUNTERS: [
      {
        levelLabel: "Forest Path",
        thisLevelsId: "FOREST_PATH",
        baseMap: "MAP_FOREST_ENCOUNTERS_KEY",
        image: "forest_path.png",
      },
      {
        levelLabel: "Forest Clearing",
        thisLevelsId: "FOREST_CLEARING",
        baseMap: "MAP_FOREST_ENCOUNTERS_KEY",
        image: "forest_clearing.png",
      },
      {
        levelLabel: "Forest Deep Woods",
        thisLevelsId: "FOREST_DEEP_WOODS",
        baseMap: "MAP_FOREST_ENCOUNTERS_KEY",
        image: "forest_deep.png",
      },
    ],
    MAP_ALL_LEVELS_NO_ENCOUNTERS: [
      {
        levelLabel: "Desert Area 1",
        thisLevelsId: "DESERT_AREA_1",
        baseMap: "MAP_DESERT_ENCOUNTERS_KEY",
        image: "desert1.png",
      },
      {
        levelLabel: "Desert Area 2",
        thisLevelsId: "DESERT_AREA_2",
        baseMap: "MAP_DESERT_ENCOUNTERS_KEY",
        image: "desert2.png",
      },
    ],
  },
  Encounters: {
    MAP_TEST_ROUTE_1_ENCOUNTERS: [
      {
        map: "ROUTE_1_AREA_1",
        land_mons: {
          mons: [
            { species: "pikachu", min_level: 2, max_level: 5 },
            { species: "chikorita", min_level: 3, max_level: 4 },
          ],
        },
      },
      {
        map: "ROUTE_1_AREA_2",
      },
    ],
    MAP_FOREST_ENCOUNTERS_KEY: [
      {
        map: "FOREST_PATH",
      },
      {
        map: "FOREST_CLEARING",
        land_mons: {
          mons: [{ species: "bulbasaur", min_level: 5, max_level: 5 }],
        },
        water_mons: {
          mons: [{ species: "squirtle", min_level: 6, max_level: 6 }],
        },
      },
      {
        map: "FOREST_DEEP_WOODS",
        fishing_mons: {
          mons: [{ species: "charmander", min_level: 7, max_level: 7 }],
        },
      },
    ],
    MAP_DESERT_ENCOUNTERS_KEY: [
      { map: "DESERT_AREA_1" },
      { map: "DESERT_AREA_2" },
    ],
    MAP_DUPLICATE_SPECIES_ENCOUNTERS: [
      {
        map: "DUPLICATE_LAND",
        land_mons: {
          mons: [
            { species: "pikachu", min_level: 2, max_level: 5 },
            { species: "bulbasaur", min_level: 3, max_level: 4 },
            { species: "pikachu", min_level: 2, max_level: 5 },
          ],
        },
      },
    ],
    MAP_UNKNOWN_MON_ENCOUNTERS: [
      {
        map: "UNKNOWN_MON_LEVEL",
        land_mons: {
          mons: [
            { species: "unknown_species", min_level: 1, max_level: 1 },
            { species: "pikachu", min_level: 2, max_level: 5 },
          ],
        },
      },
    ],
  },
}));

vi.mock("@/utils/itemsData", () => ({
  default: {
    byMap: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(ItemSearch.byMap).mockImplementation((mapName: string) => {
    if (mapName === "MAP_TEST_ROUTE_1")
      return { 
        scriptedGives: [], 
        shopItems: [{ id: "potion", name: "Potion", description: "A basic healing item", price: 200 }], 
        pickupItems: [] 
      };
    if (mapName === "MAP_MULTI_LEVEL_ENCOUNTERS")
      return { 
        scriptedGives: [], 
        shopItems: [{ id: "super_potion", name: "Super Potion", description: "A stronger healing item", price: 700 }], 
        pickupItems: [] 
      };
    return { scriptedGives: [], shopItems: [], pickupItems: [] };
  });

  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getSelectedMapInfo", () => {
  it("should return encounter data for a valid map and levelId with land encounters", () => {
    const result = getSelectedMapInfo(
      "MAP_TEST_ROUTE_1_ENCOUNTERS",
      "ROUTE_1_AREA_1",
    );
    expect(result).toBeDefined();
    expect(result?.landEncounters).toHaveLength(2);
    expect(result?.landEncounters?.[0].species).toBe("pikachu");
    expect(result?.landEncounters?.[0].index).toBe(25);
    expect(result?.landEncounters?.[0].rate).toBe(20);
    expect(result?.landEncounters?.[1].species).toBe("chikorita");
    expect(result?.landEncounters?.[1].index).toBe(152);
    expect(result?.landEncounters?.[1].rate).toBe(20);
    expect(result?.waterEncounters).toBeUndefined();
    expect(result?.fishingEncounters).toBeUndefined();
  });

  it("should correctly map species name via fallback if nameKey fails", () => {
    const result = getSelectedMapInfo(
      "MAP_TEST_ROUTE_1_ENCOUNTERS",
      "ROUTE_1_AREA_1",
    );
    const chikoritaEncounter = result?.landEncounters?.find(
      (e) => e.species === "chikorita",
    );
    expect(chikoritaEncounter).toBeDefined();
    expect(chikoritaEncounter?.index).toBe(152); // chikorita's speciesId
  });

  it("should return combined rates for duplicate species in the same encounter type", () => {
    const result = getSelectedMapInfo(
      "MAP_DUPLICATE_SPECIES_ENCOUNTERS",
      "DUPLICATE_LAND",
    );
    expect(result?.landEncounters).toHaveLength(2);
    const pikachu = result?.landEncounters?.find(
      (m) => m.species === "pikachu",
    );
    expect(pikachu?.rate).toBe(30); // 20 + 10
    const bulbasaur = result?.landEncounters?.find(
      (m) => m.species === "bulbasaur",
    );
    expect(bulbasaur?.rate).toBe(20);
  });

  it("should return undefined for land/water/fishing if not present", () => {
    const result = getSelectedMapInfo(
      "MAP_FOREST_ENCOUNTERS_KEY",
      "FOREST_DEEP_WOODS",
    );
    expect(result).toBeDefined();
    expect(result?.landEncounters).toBeUndefined();
    expect(result?.waterEncounters).toBeUndefined();
    expect(result?.fishingEncounters).toHaveLength(1);
    expect(result?.fishingEncounters?.[0].species).toBe("charmander");
  });

  it("should return undefined if the encounter group (id) does not exist", () => {
    const result = getSelectedMapInfo("MAP_DOES_NOT_EXIST", "ANY_LEVEL");
    expect(result).toBeUndefined();
    expect(console.warn).toHaveBeenCalledWith(
      "No encounters for map %s",
      "MAP_DOES_NOT_EXIST",
    );
  });

  it("should return undefined if the levelId does not exist within an existing encounter group", () => {
    const result = getSelectedMapInfo(
      "MAP_TEST_ROUTE_1_ENCOUNTERS",
      "LEVEL_ID_NOT_IN_GROUP",
    );
    expect(result).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      "Error selecting encounters %s, level %s",
      "MAP_TEST_ROUTE_1_ENCOUNTERS",
      "LEVEL_ID_NOT_IN_GROUP",
    );
  });

  it("should return empty encounter types if levelId exists but has no specific mons list", () => {
    const result = getSelectedMapInfo(
      "MAP_TEST_ROUTE_1_ENCOUNTERS",
      "ROUTE_1_AREA_2",
    );
    expect(result).toBeDefined();
    expect(result?.landEncounters).toBeUndefined();
    expect(result?.waterEncounters).toBeUndefined();
    expect(result?.fishingEncounters).toBeUndefined();
  });

  it("should log an error and skip a mon if its species is not found in pokemonData", () => {
    const result = getSelectedMapInfo(
      "MAP_UNKNOWN_MON_ENCOUNTERS",
      "UNKNOWN_MON_LEVEL",
    );
    expect(console.error).toHaveBeenCalledWith(
      "Error: %s not found in encounters.json or speciesData.json",
      "unknown_species",
    );
    // The function should still return all encounters since the filtering happens elsewhere
    expect(result?.landEncounters).toHaveLength(2);
    expect(result?.landEncounters?.[0].species).toBe("unknown_species");
    expect(result?.landEncounters?.[1].species).toBe("pikachu");
  });
});

describe("getSelectedLevel", () => {
  it("should return full level data when encounters are present", () => {
    vi.mocked(ItemSearch.byMap).mockReturnValue({ 
      scriptedGives: [], 
      shopItems: [{ id: "test-item", name: "Test Item", description: "Test description", price: 100 }], 
      pickupItems: [] 
    });
    const result = getSelectedLevel({
      baseMapName: "MAP_TEST_ROUTE_1",
      levelIndex: 0,
    });

    expect(result).toBeDefined();
    expect(result?.hasEncounters).toBe(true);
    expect(result?.mapLabel).toBe("Route 1 - Area 1");
    expect(result?.selectedImageName).toBe("route1_area1.png");
    expect(result?.selectedLevelId).toBe("ROUTE_1_AREA_1");
    expect(result?.landEncounters).toHaveLength(2);
    expect(result?.selectedMapItems).toEqual({
      scriptedGives: [],
      shopItems: [{ id: "test-item", name: "Test Item", description: "Test description", price: 100 }],
      pickupItems: []
    });
    expect(vi.mocked(ItemSearch.byMap)).toHaveBeenCalledWith("MAP_TEST_ROUTE_1");
    expect(result?.selectedMapsLevels).toEqual([
      "ROUTE_1_AREA_1",
      "ROUTE_1_AREA_2",
    ]);
    expect(result?.selectedMapEncounterLevels).toEqual([
      "ROUTE_1_AREA_1",
      "ROUTE_1_AREA_2",
    ]);
  });

  it("should return level data with hasEncounters false and empty mapLabel if no encounters", () => {
    vi.mocked(ItemSearch.byMap).mockReturnValue({ scriptedGives: [], shopItems: [], pickupItems: [] });
    const result = getSelectedLevel({
      baseMapName: "MAP_TEST_ROUTE_1",
      levelIndex: 1,
    });

    expect(result).toBeDefined();
    expect(result?.hasEncounters).toBe(false);
    expect(result?.mapLabel).toBe("");
    expect(result?.selectedImageName).toBe("route1_area2.png");
    expect(result?.selectedLevelId).toBe("ROUTE_1_AREA_2");
    expect(result?.landEncounters).toBeUndefined();
    expect(result?.selectedMapItems).toEqual({
      scriptedGives: [],
      shopItems: [],
      pickupItems: []
    });
  });

  it("should return undefined if baseMapName is invalid", () => {
    const result = getSelectedLevel({
      baseMapName: "INVALID_MAP_NAME",
      levelIndex: 0,
    });
    expect(result).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      "Error selecting map level %s, %s",
      0,
      "INVALID_MAP_NAME",
    );
  });

  it("should throw an error if levelIndex is out of bounds", () => {
    expect(() => {
      getSelectedLevel({ baseMapName: "MAP_TEST_ROUTE_1", levelIndex: 99 });
    }).toThrow("Error selecting map level 99");
  });

  it("should handle cases where Encounters group for baseMap is missing for selectedMapEncounterLevels", () => {
    const result = getSelectedLevel({
      baseMapName: "MAP_SINGLE_NO_ENCOUNTER_LEVEL",
      levelIndex: 0,
    });
    expect(result).toBeDefined();
    expect(result?.selectedMapEncounterLevels).toEqual([]);
    expect(result?.hasEncounters).toBe(false);
    expect(result?.mapLabel).toBe("");
  });
});

describe("getInitialMapLevelData", () => {
  it("should return undefined if mapDetails or levels are not found", () => {
    let result = getInitialMapLevelData("MAP_DOES_NOT_EXIST_IN_LEVELSINFO");
    expect(result).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      "No levels found for map: MAP_DOES_NOT_EXIST_IN_LEVELSINFO in getInitialMapLevelData",
    );

    result = getInitialMapLevelData("MAP_NO_LEVELS_DEFINED");
    expect(result).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      "No levels found for map: MAP_NO_LEVELS_DEFINED in getInitialMapLevelData",
    );
  });

  it("should select the first level (index 0) if it has encounters", () => {
    vi.mocked(ItemSearch.byMap).mockReturnValue({ scriptedGives: [], shopItems: [{ id: "potion", name: "Potion", description: "Basic healing item", price: 200 }], pickupItems: [] });
    const result = getInitialMapLevelData("MAP_TEST_ROUTE_1");

    expect(result).toBeDefined();
    expect(result?.chosenLevelIndex).toBe(0);
    expect(result?.selectedLevelId).toBe("ROUTE_1_AREA_1");
    expect(result?.hasEncounters).toBe(true);
    expect(result?.mapLabel).toBe("Route 1 - Area 1");
  });

  it("should select the first available level with encounters if index 0 does not have them", () => {
    vi.mocked(ItemSearch.byMap).mockReturnValue({
      scriptedGives: [],
      shopItems: [{ id: "super_potion", name: "Super Potion", description: "Better healing item", price: 700 }],
      pickupItems: []
    });
    const result = getInitialMapLevelData("MAP_MULTI_LEVEL_ENCOUNTERS");

    expect(result).toBeDefined();
    expect(result?.chosenLevelIndex).toBe(1);
    expect(result?.selectedLevelId).toBe("FOREST_CLEARING");
    expect(result?.hasEncounters).toBe(true);
    expect(result?.mapLabel).toBe("Forest Clearing");
  });

  it("should select the first level (index 0) if no levels on the map have encounters", () => {
    vi.mocked(ItemSearch.byMap).mockReturnValue([]);
    const result = getInitialMapLevelData("MAP_ALL_LEVELS_NO_ENCOUNTERS");

    expect(result).toBeDefined();
    expect(result?.chosenLevelIndex).toBe(0);
    expect(result?.selectedLevelId).toBe("DESERT_AREA_1");
    expect(result?.hasEncounters).toBe(false);
    expect(result?.mapLabel).toBe("");
  });

  it("should handle a map with a single level that has no encounters", () => {
    vi.mocked(ItemSearch.byMap).mockReturnValue([]);
    const result = getInitialMapLevelData("MAP_SINGLE_NO_ENCOUNTER_LEVEL");

    expect(result).toBeDefined();
    expect(result?.chosenLevelIndex).toBe(0);
    expect(result?.selectedLevelId).toBe("CAVE_ENTRANCE");
    expect(result?.hasEncounters).toBe(false);
    expect(result?.mapLabel).toBe("");
  });
});
