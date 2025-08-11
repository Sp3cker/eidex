const CHUNK_SIZE = 0x1000; // 4096
export const MGBA_SIZE = 0x20010; // 131088
export const TOTAL_SIZE = 0x20000; // 131072
const NUM_CHUNKS = 32;
const SIGNATURE = 0x08012025;

type SectorInfo = {
  id: number;
  checksum: number;
  signature: number;
  counter: number;
  validSignature: boolean;
  raw: Uint8Array;
};

export function splitSaveIntoChunks(arrayBuffer: ArrayBuffer): SectorInfo[] {
  if (arrayBuffer.byteLength === MGBA_SIZE) {
    // Trim the extra 8 bytes at the end (mGBA footer)
    arrayBuffer = arrayBuffer.slice(0, TOTAL_SIZE);
  }
  if (arrayBuffer.byteLength < TOTAL_SIZE) {
    throw new Error("Save file must be at least 128KB");
  }

  const chunks: SectorInfo[] = [];

  for (let i = 0; i < NUM_CHUNKS; i++) {
    const start = i * CHUNK_SIZE;
    const raw = new Uint8Array(arrayBuffer.slice(start, start + CHUNK_SIZE));
    const id = raw[4084] | (raw[4085] << 8);
    const checksum = raw[4086] | (raw[4087] << 8);
    const signature =
      raw[4088] | (raw[4089] << 8) | (raw[4090] << 16) | (raw[4091] << 24);
    const counter =
      raw[4092] | (raw[4093] << 8) | (raw[4094] << 16) | (raw[4095] << 24);

    chunks.push({
      id,
      checksum,
      signature,
      counter,
      validSignature: signature === SIGNATURE,
      raw,
    });
  }

  return chunks;
}

export function getTrainerIdFromSectors(sectors: SectorInfo[]) {
  // Pick the latest valid logical sector id 0 by highest counter
  const sector = getLatestValidSectorById(sectors, 0);
  if (!sector) throw new Error("No valid sector with logical id = 0");

  const data = sector.raw;
  const trainerId = data[0x0a] | (data[0x0b] << 8);
  const secretId = data[0x0c] | (data[0x0d] << 8);
  const fullId = (secretId << 16) | trainerId;

  return {
    trainerId,
    secretId,
    fullId,
    sectorIndex: sectors.indexOf(sector),
  };
}

export async function extractTrainerIdFromFile(path: string) {
  const data = await Deno.readFile(path);
  const sectors = splitSaveIntoChunks(data.buffer);
  return getTrainerIdFromSectors(sectors);
}

// Utilities for logical sector selection
function getLatestValidSectorById(
  sectors: SectorInfo[],
  logicalId: number
): SectorInfo | undefined {
  const candidates = sectors.filter(
    (s) => s.validSignature && s.id === logicalId
  );
  if (candidates.length === 0) return undefined;
  // Choose the one with the highest counter
  let latest = candidates[0];
  for (let i = 1; i < candidates.length; i++) {
    if (candidates[i].counter > latest.counter) latest = candidates[i];
  }
  return latest;
}

// Randomizer mode extraction from SaveBlock1.vars[0x52]
// Location: SaveBlock1 offset 0x1440 -> logical sector id 2, data offset 0x044C
import { RandomizerSpeciesMode } from "./buildSpeciesTable.ts";

export function getRandomizerModeFromSectors(sectors: SectorInfo[]): {
  rawMode: number;
  mappedMode: RandomizerSpeciesMode;
  sectorIndex: number;
} {
  const sector = getLatestValidSectorById(sectors, 2);
  if (!sector) throw new Error("No valid sector with logical id = 2");

  const dataOffset = 0x044c;
  const data = sector.raw;
  const rawMode = data[dataOffset] | (data[dataOffset + 1] << 8);

  // Clamp to known enum range; default to MON_RANDOM when out of range
  const mappedMode =
    rawMode in RandomizerSpeciesMode
      ? (rawMode as unknown as RandomizerSpeciesMode)
      : RandomizerSpeciesMode.MON_RANDOM;

  return {
    rawMode,
    mappedMode,
    sectorIndex: sectors.indexOf(sector),
  };
}

export async function extractRandomizerModeFromFile(path: string) {
  const data = await Deno.readFile(path);
  const sectors = splitSaveIntoChunks(data.buffer);
  return getRandomizerModeFromSectors(sectors);
}

// Minimal-return convenience helpers
export function getTrainerIdOnlyFromSectors(sectors: SectorInfo[]): number {
  const { fullId } = getTrainerIdFromSectors(sectors);
  return fullId;
}

export async function readTrainerIdFromFile(path: string): Promise<number> {
  const data = await Deno.readFile(path);
  const sectors = splitSaveIntoChunks(data.buffer);
  return getTrainerIdOnlyFromSectors(sectors);
}

export function getRandomizerModeOnlyFromSectors(
  sectors: SectorInfo[]
): RandomizerSpeciesMode {
  const { mappedMode } = getRandomizerModeFromSectors(sectors);
  return mappedMode;
}

export async function readRandomizerModeFromFile(
  path: string
): Promise<RandomizerSpeciesMode> {
  const data = await Deno.readFile(path);
  const sectors = splitSaveIntoChunks(data.buffer);
  return getRandomizerModeOnlyFromSectors(sectors);
}

export async function extractRandomizerSettingsFromFile(path: string): Promise<{
  trainerId: number;
  randomizerMode: RandomizerSpeciesMode;
}> {
  const data = await Deno.readFile(path);
  const sectors = splitSaveIntoChunks(data.buffer);
  return {
    trainerId: getTrainerIdOnlyFromSectors(sectors),
    randomizerMode: getRandomizerModeOnlyFromSectors(sectors),
  };
}
