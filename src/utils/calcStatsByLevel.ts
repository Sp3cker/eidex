import { pokemonDataMap } from "@/data/pokemon";
// Global nature adjustments mapping
const NATURE_ADJUSTMENTS: Record<string, { boosted: number; reduced: number }> = {
    hardy:    { boosted: -1, reduced: -1 }, // No change
    lonely:   { boosted: 0,  reduced: 1  }, // +Atk, -Def
    brave:    { boosted: 0,  reduced: 4  }, // +Atk, -Speed
    adamant:  { boosted: 0,  reduced: 2  }, // +Atk, -SpAtk
    naughty:  { boosted: 0,  reduced: 3  }, // +Atk, -SpDef
    bold:     { boosted: 1,  reduced: 0  }, // +Def, -Atk
    docile:   { boosted: -1, reduced: -1 }, // No change
    relaxed:  { boosted: 1,  reduced: 4  }, // +Def, -Speed
    impish:   { boosted: 1,  reduced: 2  }, // +Def, -SpAtk
    lax:      { boosted: 1,  reduced: 3  }, // +Def, -SpDef
    timid:    { boosted: 4,  reduced: 0  }, // +Speed, -Atk
    hasty:    { boosted: 4,  reduced: 1  }, // +Speed, -Def
    serious:  { boosted: -1, reduced: -1 }, // No change
    jolly:    { boosted: 4,  reduced: 2  }, // +Speed, -SpAtk
    naive:    { boosted: 4,  reduced: 3  }, // +Speed, -SpDef
    modest:   { boosted: 2,  reduced: 0  }, // +SpAtk, -Atk
    mild:     { boosted: 2,  reduced: 1  }, // +SpAtk, -Def
    quiet:    { boosted: 2,  reduced: 4  }, // +SpAtk, -Speed
    bashful:  { boosted: -1, reduced: -1 }, // No change
    rash:     { boosted: 2,  reduced: 3  }, // +SpAtk, -SpDef
    calm:     { boosted: 3,  reduced: 0  }, // +SpDef, -Atk
    gentle:   { boosted: 3,  reduced: 1  }, // +SpDef, -Def
    sassy:    { boosted: 3,  reduced: 4  }, // +SpDef, -Speed
    careful:  { boosted: 3,  reduced: 2  }, // +SpDef, -SpAtk
    quirky:   { boosted: -1, reduced: -1 }, // No change
};

// Stat indices (0-indexed)
const STAT_INDICES = Object.freeze({
  HP: 0,
  ATTACK: 1,
  DEFENSE: 2,
  SPATK: 3,
  SPDEF: 4,
  SPEED: 5,
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
    throw new Error(`Unknown nature: ${nature}`);
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

/**
 * Gets the nature adjustment values for a given nature
 * @param nature - The nature name
 * @returns Object with boosted and reduced stat indices, or null if neutral
 */
function getNatureAdjustments(
  nature: string,
): { boosted: number; reduced: number } | null {
  const adjustment = NATURE_ADJUSTMENTS[nature];

  if (!adjustment) {
    throw new Error(`Unknown nature: ${nature}`);
  }

  // Return null for neutral natures (no adjustments)
  if (adjustment.boosted === -1 && adjustment.reduced === -1) {
    return null;
  }

  return {
    boosted: adjustment.boosted,
    reduced: adjustment.reduced,
  };
}

function calculateStats(
  speciesId: number,
  level: number,
  iv: number[] = [31, 31, 31, 31, 31, 31],
  ev: number[] = [0, 0, 0, 0, 0, 0],
  nature: 
): number[] | null {
  const species = pokemonDataMap.get(`${speciesId}`);
  if (!species) return null;
  const [baseHp, baseAtk, baseDef, baseSpAtk, baseSpDef, baseSpeed] =
    species.stats;

  // HP calculation
  const hp =
    Math.floor(((2 * baseHp + iv[0] + Math.floor(ev[0] / 4)) * level) / 100) +
    level +
    10;

  // Other stats (attack, defense, etc.)
  const calcStat = (base: number, iv: number, ev: number, nat: number) =>
    Math.floor(
      (Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5) *
        nat,
    );

  const attack = calcStat(baseAtk, iv[1], ev[1], nature[1]);
  const defense = calcStat(baseDef, iv[2], ev[2], nature[2]);
  const spAtk = calcStat(baseSpAtk, iv[3], ev[3], nature[3]);
  const spDef = calcStat(baseSpDef, iv[4], ev[4], nature[4]);
  const speed = calcStat(baseSpeed, iv[5], ev[5], nature[5]);

  return [hp, attack, defense, spAtk, spDef, speed];
}
