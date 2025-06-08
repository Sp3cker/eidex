import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMapStore } from "./useMapStore";

// Mock the dependencies
vi.mock("@/data/speciesData.json", () => ({
  default: [
    {
      speciesName: "PIKACHU",
      dexNumber: 25,
      type1: "Electric",
      type2: null,
    },
    {
      speciesName: "CHARIZARD",
      dexNumber: 6,
      type1: "Fire",
      type2: "Flying",
    },
  ],
}));

vi.mock("@/utils/itemsData", () => ({
  default: {
    search: vi.fn(() => []),
    byMap: vi.fn(() => ({})),
  },
}));

vi.mock("./setSelectedMap", () => ({
  getSelectedLevel: vi.fn((map: string) => {
    if (map === "test-map") {
      return {
        mapLabel: "Test Map Level 1",
        selectedMapsLevels: 3,
        landEncounters: [],
        waterEncounters: [],
        fishingEncounters: [],
        selectedMapItems: {},
        selectedImageName: "test-map.webp",
        selectedLevelId: "test-map-1",
      };
    }
    return undefined;
  }),
}));

vi.mock("./helmetUpdater", () => ({
  updateMapHelmet: vi.fn(),
}));

describe("useMapStore", () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useMapStore());
    act(() => {
      result.current.deselectMap();
    });
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should initialize with correct default values", () => {
      const { result } = renderHook(() => useMapStore());
      const state = result.current;

      expect(state.selectedMap).toBeNull();
      expect(state.selectedMapLevel).toBe(0);
      expect(state.selectedMapsLevels).toBe(0);
      expect(state.selectedLevelLabel).toBe("");
      expect(state.selectedPokemon).toBeNull();
      expect(state.selectedCoordinates).toEqual([400, 340]);
      expect(state.mapScale).toBe(1);
      expect(state.mapOffset).toEqual([0, 0]);
      expect(state.hoveredMap).toBeNull();
      expect(state.hoveredCoordinates).toEqual([0, 0]);
      expect(state.viewingImage).toBe(false);
      expect(state.selectedImageName).toBeNull();
      expect(state.selectedLevelId).toBeNull();
      expect(state.storedCoordinates).toBeInstanceOf(Map);
    });
  });

  describe("Map Selection", () => {
    it("should set selected map correctly", () => {
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setSelectedMap("test-map");
      });

      expect(result.current.selectedMap).toBe("test-map");
      expect(result.current.selectedLevelLabel).toBe("Test Map Level 1");
      expect(result.current.selectedMapsLevels).toBe(3);
      expect(result.current.selectedImageName).toBe("test-map.webp");
      expect(result.current.selectedLevelId).toBe("test-map-1");
      expect(window.history.pushState).toHaveBeenCalledWith({}, "", "/map/test-map");
    });

    it("should handle invalid map selection", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setSelectedMap("invalid-map");
      });

      expect(result.current.selectedMap).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith("Error selecting map %s", "invalid-map");
      
      consoleSpy.mockRestore();
    });

    it("should deselect map and reset state", () => {
      const { result } = renderHook(() => useMapStore());

      // First select a map
      act(() => {
        result.current.setSelectedMap("test-map");
      });

      // Then deselect it
      act(() => {
        result.current.deselectMap();
      });

      expect(result.current.selectedMap).toBeNull();
      expect(result.current.selectedLevelLabel).toBe("");
      expect(result.current.selectedMapLevel).toBe(0);
      expect(window.history.pushState).toHaveBeenCalledWith({}, "", "");
    });
  });

  describe("Map Level Selection", () => {
    it("should set selected map level correctly when map is selected", () => {
      const { result } = renderHook(() => useMapStore());

      // First select a map
      act(() => {
        result.current.setSelectedMap("test-map");
      });

      // Then change the level
      act(() => {
        result.current.setSelectedMapLevel(1);
      });

      expect(result.current.selectedMapLevel).toBe(1);
    });

    it("should handle level selection when no map is selected", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setSelectedMapLevel(1);
      });

      expect(consoleSpy).toHaveBeenCalledWith("No map selected");
      consoleSpy.mockRestore();
    });
  });

  describe("Pokemon Selection", () => {
    it("should set selected pokemon correctly", () => {
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setSelectedPokemon("PIKACHU");
      });

      expect(result.current.selectedPokemon).toEqual({
        speciesName: "PIKACHU",
        dexNumber: 25,
        type1: "Electric",
        type2: null,
      });
    });

    it("should handle ambiguous pokemon names", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setSelectedPokemon("NONEXISTENT");
      });

      expect(result.current.selectedPokemon).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith("Ambiguous findings for %s", "NONEXISTENT");
      consoleSpy.mockRestore();
    });
  });

  describe("Coordinates and UI State", () => {
    it("should set selected coordinates", () => {
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setSelectedCoordinates([100, 200]);
      });

      expect(result.current.selectedCoordinates).toEqual([100, 200]);
    });

    it("should set map scale", () => {
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setMapScale(2.5);
      });

      expect(result.current.mapScale).toBe(2.5);
    });

    it("should set map offset", () => {
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setMapOffset([50, 75]);
      });

      expect(result.current.mapOffset).toEqual([50, 75]);
    });

    it("should set hovered map", () => {
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setHoveredMap("hovered-map");
      });

      expect(result.current.hoveredMap).toBe("hovered-map");
    });

    it("should set hovered coordinates", () => {
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setHoveredCoordinates([25, 30]);
      });

      expect(result.current.hoveredCoordinates).toEqual([25, 30]);
    });

    it("should set viewing image state", () => {
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setViewingImage(true);
      });

      expect(result.current.viewingImage).toBe(true);

      act(() => {
        result.current.setViewingImage(false);
      });

      expect(result.current.viewingImage).toBe(false);
    });
  });

  describe("Stored Coordinates", () => {
    it("should set and use stored coordinates", () => {
      const { result } = renderHook(() => useMapStore());
      const coordsMap = new Map([
        ["map1", [100, 200]],
        ["map2", [300, 400]],
      ]);

      act(() => {
        result.current.setStoredCoordinates(coordsMap);
      });

      expect(result.current.storedCoordinates).toBe(coordsMap);

      // Test that stored coordinates are used when selecting a map
      act(() => {
        result.current.setSelectedMap("test-map");
      });

      // Should use default coordinates since test-map isn't in stored coords
      expect(result.current.selectedCoordinates).toEqual([400, 340]);
    });
  });

  describe("URL State Management", () => {
    it("should set state from URL for map route", () => {
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setStateFromURL("map", "test-map");
      });

      expect(result.current.selectedMap).toBe("test-map");
    });

    it("should ignore non-map routes", () => {
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setStateFromURL("pokemon", "pikachu");
      });

      expect(result.current.selectedMap).toBeNull();
    });
  });

  describe("Item Search", () => {
    it("should search items by name", () => {
      const { result } = renderHook(() => useMapStore());
      const mockItems = [{ name: "Potion", id: 1 }];
      
      // Mock the search function to return our test data
      const ItemSearch = require("@/utils/itemsData").default;
      ItemSearch.search.mockReturnValue(mockItems);

      const searchResult = result.current.searchItemByName("Potion");

      expect(ItemSearch.search).toHaveBeenCalledWith("Potion");
      expect(searchResult).toEqual(mockItems);
    });
  });
});
