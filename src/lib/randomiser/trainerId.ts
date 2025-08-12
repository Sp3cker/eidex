// deno-lint-ignore-file no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Deno: any;
import { getLatestValidSectorById, SectorInfo, splitSaveIntoChunks } from "./trainerIdExtractor";

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
// Deprecated randomizer mode extraction removed; users set mode via randomizerStore
