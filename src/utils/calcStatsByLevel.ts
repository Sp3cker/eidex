import { pokemonDataMap } from "@/data/pokemon";

// Global nature adjustments mapping
const NATURE_ADJUSTMENTS: Record<string, { boosted: number; reduced: number }> =
  Object.freeze({
    hardy: { boosted: -1, reduced: -1 }, // No change
    lonely: { boosted: 0, reduced: 1 }, // +Atk, -Def
    brave: { boosted: 0, reduced: 4 }, // +Atk, -Speed
    adamant: { boosted: 0, reduced: 2 }, // +Atk, -SpAtk
    naughty: { boosted: 0, reduced: 3 }, // +Atk, -SpDef
    bold: { boosted: 1, reduced: 0 }, // +Def, -Atk
    docile: { boosted: -1, reduced: -1 }, // No change
    relaxed: { boosted: 1, reduced: 4 }, // +Def, -Speed
    impish: { boosted: 1, reduced: 2 }, // +Def, -SpAtk
    lax: { boosted: 1, reduced: 3 }, // +Def, -SpDef
    timid: { boosted: 4, reduced: 0 }, // +Speed, -Atk
    hasty: { boosted: 4, reduced: 1 }, // +Speed, -Def
    serious: { boosted: -1, reduced: -1 }, // No change
    jolly: { boosted: 4, reduced: 2 }, // +Speed, -SpAtk
    naive: { boosted: 4, reduced: 3 }, // +Speed, -SpDef
    modest: { boosted: 2, reduced: 0 }, // +SpAtk, -Atk
    mild: { boosted: 2, reduced: 1 }, // +SpAtk, -Def
    quiet: { boosted: 2, reduced: 4 }, // +SpAtk, -Speed
    bashful: { boosted: -1, reduced: -1 }, // No change
    rash: { boosted: 2, reduced: 3 }, // +SpAtk, -SpDef
    calm: { boosted: 3, reduced: 0 }, // +SpDef, -Atk
    gentle: { boosted: 3, reduced: 1 }, // +SpDef, -Def
    sassy: { boosted: 3, reduced: 4 }, // +SpDef, -Speed
    careful: { boosted: 3, reduced: 2 }, // +SpDef, -SpAtk
    quirky: { boosted: -1, reduced: -1 }, // No change
  });

type StatArray = [number, number, number, number, number, number]; // [hp, atk, def, spatk, spdef, speed]

/**
 * Applies nature adjustments to a Pokémon's stats
 * @param stats - Array of stats in order [hp, attack, defense, spatk, spdef, speed]
 * @param nature - The nature name
 * @returns New array with adjusted stats
 */
function applyNatureAdjustments(stats: StatArray, nature: string): StatArray {
  const adjustment = NATURE_ADJUSTMENTS[nature];

  if (!adjustment) {
    return stats;
  }

  // Create a copy of the stats array
  const adjustedStats: StatArray = [...stats];

  // Apply adjustments (HP is never affected by nature)
  if (adjustment.boosted >= 0) {
    // Apply +10% to boosted stat
    adjustedStats[adjustment.boosted] = Math.floor(
      adjustedStats[adjustment.boosted] * 1.1,
    );
  }

  if (adjustment.reduced >= 0) {
    // Apply -10% to reduced stat
    adjustedStats[adjustment.reduced] = Math.floor(
      adjustedStats[adjustment.reduced] * 0.9,
    );
  }

  return adjustedStats;
}

export function calculateStats(
  speciesId: number,
  level: number,
  iv: boolean,
  ev: number[] = [0, 0, 0, 0, 0, 0],
  nature: string, // "" on no nature
): StatArray | null {
  const species = pokemonDataMap.get(`${speciesId}`);
  if (!species) return null;
  let scaledLevel = level > 199 ? 50 : level; // Scale level to 50 if above 199
  const hp =
    Math.floor(
      ((2 * species.stats[0] + (iv ? 31 : 0) + Math.floor(ev[0] / 4)) *
        scaledLevel) /
        100,
    ) +
    level +
    10;

  // Other stats (attack, defense, etc.)
  const calcStat = (base: number, iv: number, ev: number) =>
    Math.floor(
      Math.floor(
        ((2 * base + (iv ? 31 : 0) + Math.floor(ev / 4)) * scaledLevel) / 100,
      ) + 5,
    );

  return applyNatureAdjustments(
    [
      hp,
      calcStat(species.stats[1], iv ? 31 : 0, ev[1]),
      calcStat(species.stats[2], iv ? 31 : 0, ev[2]),
      calcStat(species.stats[3], iv ? 31 : 0, ev[3]),
      calcStat(species.stats[4], iv ? 31 : 0, ev[4]),
      calcStat(species.stats[5], iv ? 31 : 0, ev[5]),
    ],
    nature,
  );
}
