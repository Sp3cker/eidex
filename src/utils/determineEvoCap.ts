import caps from "@/data/caps.json";
import { pokemonData } from "@/data/pokemon";
import { parseShortEvoutions } from "./parseEvo";
/**
 * Mons with these evo methods are returned immediatly
 * for now
 */
const nonLevelupMethods = [
  0, 7, 27, 29, 31, 32, 35, 36, 37, 38, 39, 40, 41, 43, 44, 47, 48, 49, 50, 51,
  52,
];
const evolveWithItem = [5, 6];
const crazy = [
  21, // Level + item (day)
  22, // Level + item (day)
  23, // Level + Move
  24, // Level + frend + item
  25, // √
  26, // Levelup param, male/female
];
// Filter out mon from `pokemonData`
// Where `evolutions[0]`  matches what user
// chooses from `caps`
// Mons with `evolutions[0]` that match one of `nonLevelupMethods`
// do not evolve by level, so they might
// be available *before* a level cap,
// depending...
