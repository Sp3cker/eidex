import speciesDataJson from "./speciesData.json";
import type { Pokemon } from "@/types";
import { parseShortEvolutions } from "../utils/parseEvo";
export { Pokemon };
// Export both formats for flexibility
/**
 * Lookup [id] to species data as a Map for O(1) access
 * Excludes Gmax forms like pokemonData array
 */
export const pokemonDataMap = new Map<string, Pokemon>(
  Object.entries(speciesDataJson)
  .filter(
    ([, pokemon]) => !pokemon.nameKey.includes("Gmax")
  )
);

export const pokemonData: Pokemon[] = Object.values(speciesDataJson).filter(
  (p) => p.nameKey.includes("Gmax") === false,
);

// --- PRE-EVOLUTION (CHILD -> PARENT) LOOKUP ---

interface PreEvolution {
  fromSpeciesId: number;
  evolutionType: number;
}

type PreEvolutionMap = {
  [targetSpeciesId: string]: PreEvolution[];
};

function createPreEvolutionMap(data: Map<string, Pokemon>): PreEvolutionMap {
  const preEvolutionMap: PreEvolutionMap = {};

  for (const [, sourcePokemon] of data) {
    if (!sourcePokemon?.evolutions) continue;

    for (const evolution of sourcePokemon.evolutions) {
      if (!Array.isArray(evolution) || evolution.length < 2) continue;

      const [evolutionType, targetSpeciesId] = evolution;

      if (typeof targetSpeciesId !== "number") continue;

      const key = targetSpeciesId.toString();
      if (!preEvolutionMap[key]) {
        preEvolutionMap[key] = [];
      }

      preEvolutionMap[key].push({
        fromSpeciesId: sourcePokemon.speciesId,
        evolutionType: evolutionType as number,
      });
    }
  }

  return preEvolutionMap;
}

export const PreEvolutionLookup = createPreEvolutionMap(pokemonDataMap);

// --- FORWARD-EVOLUTION (PARENT -> CHILD) LOOKUP ---

export type EvoChild = {
  childId: number;
  method: string;
};

function createEvoMap(data: Map<string, Pokemon>): Map<number, EvoChild[]> {
  const evoMap = new Map<number, EvoChild[]>();

  for (const [, sourcePokemon] of data) {
    if (!sourcePokemon.evolutions || sourcePokemon.evolutions.length === 0) {
      continue;
    }

    const evolutionsForThisMon: EvoChild[] = [];
    for (const evolution of sourcePokemon.evolutions) {
      if (!Array.isArray(evolution) || evolution.length < 2) continue;

      const [type, targetId] = evolution;
      if (typeof type !== "number" || typeof targetId !== "number") continue;

      const parser = parseShortEvolutions[type];
      if (parser) {
        evolutionsForThisMon.push({
          childId: targetId,
          method: parser(evolution),
        });
      }
    }
    if (evolutionsForThisMon.length > 0) {
      evoMap.set(sourcePokemon.speciesId, evolutionsForThisMon);
    }
  }
  return evoMap;
}

export const EvoMap = createEvoMap(pokemonDataMap);
