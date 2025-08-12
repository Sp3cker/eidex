// deno run -A scripts/logsavefile.ts [pokeemerald.sav] [pokeemerald-BST.sav]
// Delegates to src/lib/randomiser/trainerIdExtractor.ts to avoid duplicated layout logic.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;

import {
  extractRandomizerModeFromFile,
  extractTrainerIdFromFile,
} from "../src/lib/randomiser/trainerIdExtractor.ts";

function fmtPath(p: string) {
  try {
    const url = new URL(p, import.meta.url);
    return url.pathname ?? p;
  } catch {
    return p;
  }
}

async function main() {
  const defaultA = new URL("../src/lib/randomiser/pokeemerald.sav", import.meta.url);
  const defaultB = new URL("../src/lib/randomiser/pokeemerald-BST.sav", import.meta.url);
  const fileA = Deno.args[0] ?? defaultA;
  const fileB = Deno.args[1] ?? defaultB;

  console.log(`[Info] Reading RANDOMIZATION_MODE and Trainer IDs using trainerIdExtractor.ts`);

  const [aMode, bMode, aIds, bIds] = await Promise.all([
    extractRandomizerModeFromFile(String(fileA)),
    extractRandomizerModeFromFile(String(fileB)),
    extractTrainerIdFromFile(String(fileA)),
    extractTrainerIdFromFile(String(fileB)),
  ]);

  console.log(`\nA) ${fmtPath(String(fileA))}`);
  console.log(`  trainerId=${aIds.trainerId} secretId=${aIds.secretId} full=${aIds.fullId}`);
  console.log(`  RANDOMIZATION_MODE raw=${aMode.rawMode} mapped=${aMode.mappedMode} (sectorIdx=${aMode.sectorIndex})`);

  console.log(`\nB) ${fmtPath(String(fileB))}`);
  console.log(`  trainerId=${bIds.trainerId} secretId=${bIds.secretId} full=${bIds.fullId}`);
  console.log(`  RANDOMIZATION_MODE raw=${bMode.rawMode} mapped=${bMode.mappedMode} (sectorIdx=${bMode.sectorIndex})`);

  const same = aMode.rawMode === bMode.rawMode;
  console.log(`\nCompare: RANDOMIZATION_MODE ${same ? "MATCH" : "DIFFER"} (A=${aMode.rawMode}, B=${bMode.rawMode})`);
}

main().catch((err) => {
  console.error("[Error]", err);
  Deno.exit(1);
});


