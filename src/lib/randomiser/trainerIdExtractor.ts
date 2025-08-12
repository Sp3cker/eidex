export type SectorInfo = {
  id: number;
  checksum: number;
  signature: number;
  counter: number;
  validSignature: boolean;
  raw: Uint8Array;
};

const CHUNK_SIZE = 0x1000; // 4096
const TOTAL_SIZE = 0x20000; // 131072
const MGBA_SIZE = 0x20010; // 131088
const NUM_CHUNKS = 32;
const SIGNATURE = 0x08012025;
// const SECTOR_DATA_SIZE = 0x0ff4; // 4084 (no longer used here)

export function splitSaveIntoChunks(buf: ArrayBuffer): SectorInfo[] {
  let u8 = new Uint8Array(buf);
  if (u8.byteLength === MGBA_SIZE) u8 = u8.subarray(0, TOTAL_SIZE);
  if (u8.byteLength < TOTAL_SIZE)
    throw new Error("Save must be at least 128KB");

  const chunks: SectorInfo[] = [];
  for (let i = 0; i < NUM_CHUNKS; i++) {
    const start = i * CHUNK_SIZE;
    const raw = u8.subarray(start, start + CHUNK_SIZE);
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

export function getLatestValidSectorById(
  sectors: SectorInfo[],
  logicalId: number,
) {
  const cands = sectors.filter((s) => s.validSignature && s.id === logicalId);
  if (!cands.length) return undefined;
  return cands.reduce((a, b) => (b.counter > a.counter ? b : a));
}

// Trainer ID helpers
export function getTrainerIdFromSectors(sectors: SectorInfo[]) {
  // Latest logical sector id 0 (SaveBlock2)
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

export function getTrainerIdOnlyFromSectors(sectors: SectorInfo[]): number {
  const { fullId } = getTrainerIdFromSectors(sectors);
  return fullId;
}
