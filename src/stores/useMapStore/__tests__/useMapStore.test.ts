import { describe, it, expect, beforeEach, vi } from "vitest";
import { useMapStore } from "@/stores/useMapStore/useMapStore";
import { act, renderHook } from "@testing-library/react";
import ItemSearch from "@/utils/itemsData";
import { getSelectedLevel } from "@/stores/useMapStore/setSelectedMap";

// Mock the data dependencies
vi.mock("@/data/speciesData.json", () => ({
  default: [
    {
      speciesName: "PIKACHU",
      dexNum: 25,
      types: ["Electric"],
    },
    {
      speciesName: "CHARMANDER",
      dexNum: 4,
      types: ["Fire"],
    },
  ],
}));

vi.mock("@/utils/itemsData", () => {
  const mockItemSearch = {
    search: vi.fn(() => []),
  };
  return {
    default: mockItemSearch,
  };
});

vi.mock("@/stores/useMapStore/setSelectedMap", () => ({
  getSelectedLevel: vi.fn(() => ({
    mapLabel: "Test Map Label",
    selectedMapsLevels: ["level1", "level2"],
    landEncounters: [],
    waterEncounters: [],
    fishingEncounters: [],
    selectedMapItems: null,
    selectedImageName: "test-image.png",
    selectedLevelId: "test-level-1",
    selectedMapEncounterLevels: ["level1", "level2"],
  })),
  getInitialMapLevelData: vi.fn((mapName: string) => {
    if (mapName === "test-map" || mapName === "test-map-url") {
      return {
        chosenLevelIndex: 0,
        landEncounters: [],
        waterEncounters: [],
        fishingEncounters: [],
        selectedMapItems: null,
        selectedMapsLevels: 3,
        selectedMapEncounterLevels: ["level1", "level2"],
        selectedLevelId: "test-level-1",
        mapLabel: "Test Map Label",
        selectedImageName: "test-image.png",
        hasEncounters: true,
      };
    }
    return undefined; // This will cause the store to log an error
  }),
}));

vi.mock("@/stores/useMapStore/helmetUpdater", () => ({
  updateMapHelmet: vi.fn(),
}));

describe("useMapStore", () => {
  beforeEach(() => {
    // Reset the store to initial state before each test
    useMapStore.getState().deselectMap();
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = useMapStore.getState();

      expect(state.selectedMap).toBeNull();
      expect(state.selectedMapLevel).toBe(0);
      expect(state.selectedMapsLevels).toEqual([]);
      expect(state.selectedLevelLabel).toBe("");
      expect(state.selectedLevelLandMons).toBeUndefined();
      expect(state.selectedLevelWaterMons).toBeUndefined();
      expect(state.selectedLevelFishingMons).toBeUndefined();
      expect(state.selectedMapItems).toBeNull();
      expect(state.selectedImageName).toBeNull();
      expect(state.viewingImage).toBe(false);
      expect(state.selectedLevelId).toBeNull();
      expect(state.selectedCoordinates).toEqual([400, 340]);
      expect(state.storedCoordinates).toBeInstanceOf(Map);
      expect(state.mapScale).toBe(1);
      expect(state.mapOffset).toEqual([0, 0]);
      expect(state.hoveredMap).toBeNull();
      expect(state.hoveredCoordinates).toEqual([0, 0]);
    });
  });

  describe("Map Selection", () => {
    it("should select a map successfully", () => {
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setSelectedMap("test-map");
      });

      const state = useMapStore.getState();
      expect(state.selectedMap).toBe("test-map");
      expect(state.selectedMapLevel).toBe(0);
      expect(state.selectedLevelLabel).toBe("Test Map Label");
      expect(state.selectedMapsLevels).toBe(3);
      expect(state.selectedImageName).toBe("test-image.png");
      expect(state.selectedLevelId).toBe("test-level-1");
    });

    it("should deselect map and reset to initial state", () => {
      const { result } = renderHook(() => useMapStore());

      // First select a map
      act(() => {
        result.current.setSelectedMap("test-map");
      });

      // Then deselect
      act(() => {
        result.current.deselectMap();
      });

      const state = useMapStore.getState();
      expect(state.selectedMap).toBeNull();
      expect(state.selectedMapLevel).toBe(0);
      expect(state.selectedLevelLabel).toBe("");
      expect(state.selectedImageName).toBeNull();
    });

    it("should update stored coordinates when selecting a map", () => {
      const { result } = renderHook(() => useMapStore());
      const testCoords = [100, 200];

      // Store coordinates for a map
      act(() => {
        const coordsMap = new Map();
        coordsMap.set("test-map", testCoords);
        result.current.setStoredCoordinates(coordsMap);
      });

      // Select the map
      act(() => {
        result.current.setSelectedMap("test-map");
      });

      const state = useMapStore.getState();
      expect(state.selectedCoordinates).toEqual(testCoords);
    });
  });

  describe("Map Level Selection", () => {
    it("should set map level when a map is selected", () => {
      const { result } = renderHook(() => useMapStore());

      // First select a map
      act(() => {
        result.current.setSelectedMap("test-map");
      });

      // Then set level
      act(() => {
        result.current.setSelectedMapLevel("level-2");
      });

      const state = useMapStore.getState();
      expect(state.selectedMapLevel).toBe(0); // This will be set by the mock
    });

    it("should log error when trying to set level without selected map", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setSelectedMapLevel("level-1");
      });

      expect(consoleSpy).toHaveBeenCalledWith("No map selected");
      consoleSpy.mockRestore();
    });
  });

  describe("Coordinates and Viewport", () => {
    it("should set selected coordinates", () => {
      const { result } = renderHook(() => useMapStore());
      const newCoords = [500, 600];

      act(() => {
        result.current.setSelectedCoordinates(newCoords);
      });

      expect(useMapStore.getState().selectedCoordinates).toEqual(newCoords);
    });

    it("should set map scale", () => {
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setMapScale(2.5);
      });

      expect(useMapStore.getState().mapScale).toBe(2.5);
    });

    it("should set map offset", () => {
      const { result } = renderHook(() => useMapStore());
      const newOffset = [10, 20];

      act(() => {
        result.current.setMapOffset(newOffset);
      });

      expect(useMapStore.getState().mapOffset).toEqual(newOffset);
    });

    it("should set hovered map", () => {
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setHoveredMap("hovered-map");
      });

      expect(useMapStore.getState().hoveredMap).toBe("hovered-map");
    });

    it("should set hovered coordinates", () => {
      const { result } = renderHook(() => useMapStore());
      const hoveredCoords = [300, 400];

      act(() => {
        result.current.setHoveredCoordinates(hoveredCoords);
      });

      expect(useMapStore.getState().hoveredCoordinates).toEqual(hoveredCoords);
    });
  });

  describe("Stored Coordinates", () => {
    it("should set stored coordinates map", () => {
      const { result } = renderHook(() => useMapStore());
      const coordsMap = new Map();
      coordsMap.set("map1", [100, 200]);
      coordsMap.set("map2", [300, 400]);

      act(() => {
        result.current.setStoredCoordinates(coordsMap);
      });

      const state = useMapStore.getState();
      expect(state.storedCoordinates.get("map1")).toEqual([100, 200]);
      expect(state.storedCoordinates.get("map2")).toEqual([300, 400]);
    });
  });

  describe("Image Viewing", () => {
    it("should set viewing image state", () => {
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setViewingImage(true);
      });

      expect(useMapStore.getState().viewingImage).toBe(true);

      act(() => {
        result.current.setViewingImage(false);
      });

      expect(useMapStore.getState().viewingImage).toBe(false);
    });
  });

  describe("URL State Management", () => {
    it("should set state from URL for map route", () => {
      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setStateFromURL("map", "test-map-url");
      });

      const state = useMapStore.getState();
      expect(state.selectedMap).toBe("test-map-url");
    });

    it("should not set state for non-map routes", () => {
      const { result } = renderHook(() => useMapStore());
      const initialState = useMapStore.getState();

      act(() => {
        result.current.setStateFromURL("pokemon", "pikachu");
      });

      const newState = useMapStore.getState();
      expect(newState.selectedMap).toBe(initialState.selectedMap);
    });
  });

  describe("Item Search", () => {
    it("should search items by name", () => {
      const { result } = renderHook(() => useMapStore());
      const mockItems = [{ name: "Potion", id: 1 }];
      
      // Mock the return value using the imported mock
      vi.mocked(ItemSearch.search).mockReturnValue(mockItems);

      const searchResult = result.current.searchItemByName("Potion");
      
      expect(ItemSearch.search).toHaveBeenCalledWith("Potion");
      expect(searchResult).toEqual(mockItems);
    });
  });

  describe("Store Persistence", () => {
    it("should maintain state across multiple hook instances", () => {
      const { result: result1 } = renderHook(() => useMapStore());
      
      act(() => {
        result1.current.setMapScale(3);
      });

      const { result: result2 } = renderHook(() => useMapStore());
      
      expect(result2.current.mapScale).toBe(3);
    });
  });

  describe("Error Handling", () => {
    it("should handle errors when getSelectedLevel returns undefined", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      
      // Mock getSelectedLevel to return undefined using the imported mock
      vi.mocked(getSelectedLevel).mockReturnValueOnce(undefined);

      const { result } = renderHook(() => useMapStore());

      act(() => {
        result.current.setSelectedMap("invalid-map");
      });

      expect(consoleSpy).toHaveBeenCalledWith("Failed to get initial data for map: invalid-map. Deselecting map.");
      expect(useMapStore.getState().selectedMap).toBeNull(); // Should remain unchanged
      
      consoleSpy.mockRestore();
    });
  });
});
