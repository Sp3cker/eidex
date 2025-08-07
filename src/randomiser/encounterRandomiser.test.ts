import { describe, it, expect } from "vitest";
import { calculateRandomizedEncounter } from "./encounterRandomiser";
import mapsWithSeeds from '../data/map_constants.json'
// Example test parameters (replace with your own values)
const TEST_CASES = [
  {
    originalSpecies: 16, // Pikachu
    mapName: 'MAP_ROUTE101',
    expected: 138, // Fill in expected value if known
  },
  {
    originalSpecies: 1, // Bulbasaur
    seed: 0xabcdef,
    trainerId: 39344,
    expected: undefined, // Fill in expected value if known
  },
];
type MapWithSeeds = {
    "num": number,
    "group": number,
    "seeds":{land_mons: number[],
    water_mons: number[],
    fish_mons: number[]},
}
// Add more test cases as needed

describe("calculateRandomizedEncounter", () => {
  TEST_CASES.forEach(({ originalSpecies, mapName,expected }, idx) => {
    it(`should randomize encounter for test case #${idx + 1}`, () => {
        //@ts-ignore
        const map: MapWithSeeds = mapsWithSeeds[mapName];
        const encounterSeed = map.
        // Replace with actual map ID if needed
      const result = calculateRandomizedEncounter(originalSpecies, seed, trainerId);
      // If you know the expected value, use strict equality
      if (expected !== undefined) {
        expect(result).toBe(expected);
      } else {
        // Otherwise, just check that it's a number and not the original species
        expect(typeof result).toBe("number");
        expect(result).not.toBe(originalSpecies);
      }
    });
  });
});
