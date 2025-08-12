// deno run -A src/lib/randomiser/logsavefile.ts [pokeemerald.sav] [pokeemerald-BST.sav]
// Lightweight CLI to print Trainer IDs from two saves using trainerIdExtractor.ts.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;

import { splitSaveIntoChunks, getTrainerIdFromSectors } from "./trainerIdExtractor.ts";

function fmtPath(p: string) {
  try {
    const url = new URL(p, import.meta.url);
    return url.pathname ?? p;
  } catch {
    return p;
  }
}

async function main() {
  const defaultA = new URL("./pokeemerald.sav", import.meta.url);
  const defaultB = new URL("./pokeemerald-BST.sav", import.meta.url);
  const fileA = Deno.args[0] ?? defaultA;
  const fileB = Deno.args[1] ?? defaultB;

  console.log(`[Info] Reading Trainer IDs using trainerIdExtractor.ts`);

  const [aBuf, bBuf] = await Promise.all([
    (async () => new Uint8Array(await (await fetch(String(fileA))).arrayBuffer()))(),
    (async () => new Uint8Array(await (await fetch(String(fileB))).arrayBuffer()))(),
  ]);
  const aSectors = splitSaveIntoChunks(aBuf);
  const bSectors = splitSaveIntoChunks(bBuf);
  const aIds = getTrainerIdFromSectors(aSectors);
  const bIds = getTrainerIdFromSectors(bSectors);

  console.log(`\nA) ${fmtPath(String(fileA))}`);
  console.log(`  trainerId=${aIds.trainerId} secretId=${aIds.secretId} full=${aIds.fullId}`);

  console.log(`\nB) ${fmtPath(String(fileB))}`);
  console.log(`  trainerId=${bIds.trainerId} secretId=${bIds.secretId} full=${bIds.fullId}`);
}

main().catch((err) => {
  console.error("[Error]", err);
  Deno.exit(1);
});
