import { pokemonDataMap } from "@/data/pokemon";
// import * as math from "mathjs";

type StatArray = [number, number, number, number, number, number]; // [hp, atk, def, spatk, spdef, speed]
// Global nature adjustments mapping (indices aligned with [hp, atk, def, spatk, spdef, speed])
const NATURE_ADJUSTMENTS = Object.freeze({
  hardy: { boosted: -1, reduced: -1 }, // No change
  lonely: { boosted: 1, reduced: 2 }, // +Atk, -Def
  brave: { boosted: 1, reduced: 5 }, // +Atk, -Speed
  adamant: { boosted: 1, reduced: 3 }, // +Atk, -SpAtk
  naughty: { boosted: 1, reduced: 4 }, // +Atk, -SpDef
  bold: { boosted: 2, reduced: 1 }, // +Def, -Atk
  docile: { boosted: -1, reduced: -1 }, // No change
  relaxed: { boosted: 2, reduced: 5 }, // +Def, -Speed
  impish: { boosted: 2, reduced: 3 }, // +Def, -SpAtk
  lax: { boosted: 2, reduced: 4 }, // +Def, -SpDef
  timid: { boosted: 5, reduced: 1 }, // +Speed, -Atk
  hasty: { boosted: 5, reduced: 2 }, // +Speed, -Def
  serious: { boosted: -1, reduced: -1 }, // No change
  jolly: { boosted: 5, reduced: 3 }, // +Speed, -SpAtk
  naive: { boosted: 5, reduced: 4 }, // +Speed, -SpDef
  modest: { boosted: 3, reduced: 1 }, // +SpAtk, -Atk
  mild: { boosted: 3, reduced: 2 }, // +SpAtk, -Def
  quiet: { boosted: 3, reduced: 5 }, // +SpAtk, -Speed
  bashful: { boosted: -1, reduced: -1 }, // No change
  rash: { boosted: 3, reduced: 4 }, // +SpAtk, -SpDef
  calm: { boosted: 4, reduced: 1 }, // +SpDef, -Atk
  gentle: { boosted: 4, reduced: 2 }, // +SpDef, -Def
  sassy: { boosted: 4, reduced: 5 }, // +SpDef, -Speed
  careful: { boosted: 4, reduced: 3 }, // +SpDef, -SpAtk
  quirky: { boosted: -1, reduced: -1 }, // No change
});

/**
 * Applies nature adjustments to a Pokémon's stats
 * @param stats - Array of stats in order [hp, attack, defense, spatk, spdef, speed]
 * @param nature - The nature name
 * @returns New array with adjusted stats
 */
function applyNatureAdjustments(
  stats: StatArray,
  nature: string,
): [StatArray, number, number] {
  //@ts-ignore
  const adjustment = NATURE_ADJUSTMENTS[nature];

  if (!adjustment) {
    return [stats, -1, -1];
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

  return [adjustedStats, adjustment.boosted, adjustment.reduced];
}

export function calculateStatsOld(
  speciesId: number,
  level: number,
  iv: boolean,
  ev: number[] = [0, 0, 0, 0, 0, 0],
  nature: string, // "" on no nature
): [number[], number, number] | null {
  const species = pokemonDataMap.get(`${speciesId}`);
  if (!species) return null;
  debugger
  const scaledLevel = level;
  const ivValue = iv ? 31 : 0;

  // Base stats from species with reordered Special Attack and Speed
  const baseStats = species.stats;
  // Rotate: Move SpAtk(3) to Speed(5), SpDef(4) to SpAtk(3), Speed(5) to SpDef(4)
  // const temp = baseStats[3];
  // baseStats[3] = baseStats[4];
  // baseStats[4] = baseStats[5];
  // baseStats[5] = temp;

  const hp =
    Math.floor(
      ((2 * baseStats[0] + ivValue + Math.floor(ev[0] / 4)) * scaledLevel) /
        100,
    ) +
    scaledLevel +
    10;

  // Other stats (attack, defense, etc.)
  const calcStat = (base: number, ivValue: number, ev: number) =>
    Math.floor(
      Math.floor(
        ((2 * base + ivValue + Math.floor(ev / 4)) * scaledLevel) / 100,
      ) + 5,
    );

  return applyNatureAdjustments(
    [
      hp,
      calcStat(baseStats[1], ivValue, ev[1]),
      calcStat(baseStats[2], ivValue, ev[2]),
      calcStat(baseStats[3], ivValue, ev[3]),
      calcStat(baseStats[4], ivValue, ev[4]),
      calcStat(baseStats[5], ivValue, ev[5]),
    ],
    nature,
  );
}

// // Pre-allocated array for stats
// const statsArray = math.matrix([0, 0, 0, 0, 0, 0]);

// // Calculate stats with minimal memory usage and math.js
// export function calculateStats(
//   speciesId: number,
//   level: number,
//   iv: boolean,
//   ev: number[] = [0, 0, 0, 0, 0, 0],
//   nature: string,
// ): [number[], number, number] | null {
//   /**
// 73,
// 67,
// 75,
// 109,
// 81,
// 100, */
//   const species = pokemonDataMap.get(`${speciesId}`);
//   if (!species) return null;
//   const scaledLevel = level;
//   const ivValue = iv ? 31 : 0;

//   // Base stats from species with reordered Special Attack and Speed
//   const baseStats = [...species.stats];
//   // Rotate: Move SpAtk(3) to Speed(5), SpDef(4) to SpAtk(3), Speed(5) to SpDef(4)
//   const temp = baseStats[3];
//   baseStats[3] = baseStats[4];
//   baseStats[4] = baseStats[5];
//   baseStats[5] = temp;

//   // Calculate HP separately
//   statsArray.set(
//     [0],
//     Math.floor(
//       ((2 * baseStats[0] + ivValue + Math.floor(ev[0] / 4)) * scaledLevel) /
//         100,
//     ) +
//       scaledLevel +
//       10,
//   );

//   // Calculate other stats (attack to speed) using vectorized operations
//   const otherStatsBase = math.subset(baseStats, math.index(math.range(1, 6)));
//   const otherEVs = math.subset(ev, math.index(math.range(1, 6)));
//   const otherStats = math.floor(
//     math.add(
//       math.floor(
//         //@ts-ignore
//         math.multiply(
//           math.add(
//             math.multiply(2, otherStatsBase),
//             ivValue,
//             //@ts-ignore
//             math.floor(math.divide(otherEVs, 4)),
//           ),
//           scaledLevel / 100,
//         ),
//       ),
//       5,
//     ),
//   );
//   // Assign other stats back to statsArray
//   for (let i = 0; i < 5; i++) {
//     //@ts-ignore
//     statsArray.set([i + 1], math.number(otherStats[i]));
//   }

//   // Apply nature adjustments in-place
//   //@ts-ignore
//   const adjustment = NATURE_ADJUSTMENTS[nature] || { boosted: -1, reduced: -1 };
//   if (adjustment.boosted >= 0) {
//     statsArray.set(
//       [adjustment.boosted],
//       Math.floor(statsArray.get([adjustment.boosted]) * 1.1),
//     );
//   }
//   if (adjustment.reduced >= 0) {
//     statsArray.set(
//       [adjustment.reduced],
//       Math.floor(statsArray.get([adjustment.reduced]) * 0.9),
//     );
//   }

//   // Return stats array as a plain JS array with adjustment indices
//   return [
//     math.number(statsArray.toArray()) as number[],
//     adjustment.boosted,
//     adjustment.reduced,
//   ];
// }
