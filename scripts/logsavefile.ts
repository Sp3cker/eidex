// deno run -A scripts/logsavefile.ts [pokeemerald.sav] [pokeemerald-BST.sav]
// Compares the 32-byte window around the RANDOMIZER_VAR_SPECIES_MODE location in both saves.

import { splitSaveIntoChunks } from "../src/lib/randomiser/trainerIdExtractor.ts";

// Constants from the game's save layout
const CHUNK_SIZE = 0x1000; // 4096
const SECTOR_DATA_SIZE = 0x0ff4; // 4084
const SIGNATURE = 0x08012025;

// Randomizer mode var location details (from C):
const VARS_START = 0x4000;
const VAR_ID = 0x4052; // RANDOMIZER_VAR_SPECIES_MODE
const VAR_INDEX = VAR_ID - VARS_START; // 0x52
const VARS_BASE_IN_SB1 = 0x139c; // SaveBlock1.vars start
const VAR_SIZE_BYTES = 2; // u16
const BYTE_OFFSET_IN_SB1 = VARS_BASE_IN_SB1 + VAR_INDEX * VAR_SIZE_BYTES; // 0x1440
const TARGET_SECTOR_ID = 1 + Math.floor(BYTE_OFFSET_IN_SB1 / SECTOR_DATA_SIZE); // 2
const WITHIN_OFFSET = BYTE_OFFSET_IN_SB1 % SECTOR_DATA_SIZE; // 0x044C

type SectorInfo = {
  id: number;
  checksum: number;
  signature: number;
  counter: number;
  validSignature: boolean;
  raw: Uint8Array;
};

function hex(n: number, pad = 0) {
  return "0x" + n.toString(16).toUpperCase().padStart(pad, "0");
}

function pickLatestValidSectorById(
  sectors: SectorInfo[],
  logicalId: number,
): SectorInfo | undefined {
  const candidates = sectors.filter(
    (s) => s.validSignature && s.id === logicalId,
  );
  if (candidates.length === 0) return undefined;
  let latest = candidates[0];
  for (let i = 1; i < candidates.length; i++) {
    if (candidates[i].counter > latest.counter) latest = candidates[i];
  }
  return latest;
}

async function readWindow32(filePath: string) {
  const raw = await Deno.readFile(filePath);
  const sectors = splitSaveIntoChunks(raw.buffer) as unknown as SectorInfo[];
  const sector = pickLatestValidSectorById(sectors, TARGET_SECTOR_ID);
  if (!sector) throw new Error(`No valid sector with logical id = ${TARGET_SECTOR_ID}`);
  const physIdx = sectors.indexOf(sector);
  const absOffset = physIdx * CHUNK_SIZE + WITHIN_OFFSET;

  const start = Math.max(0, WITHIN_OFFSET - 0x20);
  const end = Math.min(sector.raw.length, WITHIN_OFFSET + 0x20 + 1);
  const bytes = Array.from(sector.raw.slice(start, end));

  return {
    filePath,
    physIdx,
    withinOffset: WITHIN_OFFSET,
    startWithin: start,
    endWithinExclusive: end,
    absOffset,
    bytes,
  };
}

function formatWindow(prefix: string, w: Awaited<ReturnType<typeof readWindow32>>) {
  const hexBytes = w.bytes.map((b) => b.toString(16).padStart(2, "0")).join(" ");
  console.log(
    `${prefix} window32 [${hex(w.startWithin)}..${hex(w.endWithinExclusive - 1)}] (sector phys=${w.physIdx}, within=${hex(w.withinOffset)}, abs=${hex(w.absOffset)}): ${hexBytes}`,
  );
}

function compareWindows(
  a: Awaited<ReturnType<typeof readWindow32>>,
  b: Awaited<ReturnType<typeof readWindow32>>,
): void {
  const len = Math.min(a.bytes.length, b.bytes.length);
  const diffs: { idx: number; offA: number; byteA: number; byteB: number }[] = [];
  for (let i = 0; i < len; i++) {
    if (a.bytes[i] !== b.bytes[i]) {
      diffs.push({ idx: i, offA: a.startWithin + i, byteA: a.bytes[i], byteB: b.bytes[i] });
    }
  }
  if (diffs.length === 0) {
    console.log(`[Compare] No differences within +/- 32 bytes around target.`);
    return;
  }
  console.log(`[Compare] ${diffs.length} differing byte(s):`);
  for (const d of diffs) {
    console.log(
      `  within=${hex(d.offA)} a=${a.bytes[d.idx].toString(16).padStart(2, "0")} b=${b.bytes[d.idx].toString(16).padStart(2, "0")}`,
    );
  }
}

async function main() {
  const fileA = Deno.args[0] ?? "pokeemerald.sav"; // default
  const fileB = Deno.args[1] ?? "pokeemerald-BST.sav"; // default

  console.log(`[Info] Comparing windows around RANDOMIZER_VAR_SPECIES_MODE (varId=${hex(VAR_ID)})`);
  console.log(
    `[Info] SaveBlock1.vars @ ${hex(VARS_BASE_IN_SB1)}, varIndex=${hex(VAR_INDEX)}, byteOffsetInSB1=${hex(BYTE_OFFSET_IN_SB1)}, sectorId=${TARGET_SECTOR_ID}, within=${hex(WITHIN_OFFSET)}`,
  );

  const [wA, wB] = await Promise.all([readWindow32(fileA), readWindow32(fileB)]);
  formatWindow(`[${fileA}]`, wA);
  formatWindow(`[${fileB}]`, wB);
  compareWindows(wA, wB);

  // Scan all sectors with logical id = TARGET_SECTOR_ID and print value at WITHIN_OFFSET
  async function scanAll(filePath: string) {
    const raw = await Deno.readFile(filePath);
    const sectors = splitSaveIntoChunks(raw.buffer) as unknown as SectorInfo[];
    console.log(`\n[ScanAll] ${filePath} — all sectors with logical id=${TARGET_SECTOR_ID}`);
    const rows = sectors
      .map((s, idx) => ({ ...s, idx }))
      .filter((s) => s.validSignature && s.id === TARGET_SECTOR_ID)
      .sort((a, b) => a.counter - b.counter);
    if (rows.length === 0) {
      console.log(`[ScanAll] No candidates found.`);
      return;
    }
    for (const r of rows) {
      const b0 = r.raw[WITHIN_OFFSET] ?? 0;
      const b1 = r.raw[WITHIN_OFFSET + 1] ?? 0;
      const val = b0 | (b1 << 8);
      console.log(
        `  phys=${r.idx} counter=${r.counter} within=${hex(WITHIN_OFFSET)} abs=${hex(r.idx * CHUNK_SIZE + WITHIN_OFFSET)} bytes=${b0
          .toString(16)
          .padStart(2, "0")} ${b1.toString(16).padStart(2, "0")} val=${val}`,
      );
    }
  }

  await scanAll(fileA);
  await scanAll(fileB);
}

main().catch((err) => {
  console.error(err);
  Deno.exit(1);
});


