// Deno type declarations for this script
declare const Deno: {
  readFile(path: string): Promise<Uint8Array>;
  args?: string[];
};

const SECTORS = 32;
const SECTOR_SIZE = 4096;
const DATA_SIZE = 4084;
const SIG_OFF = 4088;
const SIGNATURE = 0x08012025;

const SB1_ID_START = 1;

const FLAGS_BASE = 0x1270;
const VARS_BASE = 0x139C;
const VARS_START = 0x4000;

const FLAG_RANDOMIZER_ENABLED = 0x0264; // include/constants/flags.h
const VAR_RANDOMIZER_MODE = 0x4052;     // include/constants/vars.h

type SectorInfo = {
  physIndex: number;
  id: number;           // logical id
  counter: number;
  data: Uint8Array;     // first 4084 bytes
};

function u16le(buf: Uint8Array, off: number) {
  return buf[off] | (buf[off + 1] << 8);
}
function u32le(buf: Uint8Array, off: number) {
  return (buf[off] |
         (buf[off + 1] << 8) |
         (buf[off + 2] << 16) |
         (buf[off + 3] << 24)) >>> 0;
}

function parseSectors(save: Uint8Array): SectorInfo[] {
  const out: SectorInfo[] = [];
  for (let i = 0; i < SECTORS; i++) {
    const base = i * SECTOR_SIZE;
    const data = save.subarray(base, base + DATA_SIZE);
    const id = u16le(save, base + DATA_SIZE);
    // const checksum = u16le(save, base + DATA_SIZE + 2); // Not used currently
    const sig = u32le(save, base + SIG_OFF);
    const counter = u32le(save, base + SIG_OFF + 4);
    if (sig !== SIGNATURE) continue; // ignore invalid sectors
    // Optional: verify checksum if you know expected size for this id.
    out.push({ physIndex: i, id, counter, data });
  }
  return out;
}

function latestByLogicalId(sectors: SectorInfo[], logicalId: number): SectorInfo | undefined {
  let best: SectorInfo | undefined;
  for (const s of sectors) {
    if (s.id !== logicalId) continue;
    if (!best || s.counter > best.counter) best = s;
  }
  return best;
}

function sb1LocToSector(off: number) {
  const idx = Math.floor(off / DATA_SIZE);        // 0-based chunk index
  const logicalId = SB1_ID_START + idx;           // 1..16
  const dataOff = off % DATA_SIZE;                // within sector data
  return { logicalId, dataOff };
}

function readFlag(save: Uint8Array, flagId: number): boolean {
  const byteIndex = Math.floor(flagId / 8);
  const bit = flagId & 7;
  const absOff = FLAGS_BASE + byteIndex;
  const { logicalId, dataOff } = sb1LocToSector(absOff);
  const sector = latestByLogicalId(parseSectors(save), logicalId);
  if (!sector) throw new Error(`Sector for id ${logicalId} not found`);
  const byte = sector.data[dataOff];
  return ((byte >> bit) & 1) === 1;
}

function readVarU16(save: Uint8Array, varId: number): number {
  const absOff = VARS_BASE + 2 * (varId - VARS_START);
  const { logicalId, dataOff } = sb1LocToSector(absOff);
  const sector = latestByLogicalId(parseSectors(save), logicalId);
  if (!sector) throw new Error(`Sector for id ${logicalId} not found`);
  return u16le(sector.data, dataOff);
}

// Convenience wrapper
export function extractRandomizer(buffer: Uint8Array) {
  if (buffer.length < SECTORS * SECTOR_SIZE) throw new Error("Invalid save length");
  const save = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);

  const enabled = readFlag(save, FLAG_RANDOMIZER_ENABLED);
  const mode = readVarU16(save, VAR_RANDOMIZER_MODE);

  // Enum mapping (include/config/randomizer.h)
  const modeName =
    mode === 0 ? "MON_RANDOM" :
    mode === 1 ? "MON_RANDOM_LEGEND_AWARE" :
    mode === 2 ? "MON_RANDOM_BST" :
    mode === 3 ? "MON_EVOLUTION" :
    mode === 4 ? "MAX_MON_MODE" : `UNKNOWN_${mode}`;

  return { enabled, mode, modeName, active: enabled && mode !== 4 };
}

// Example usage with Deno
async function main() {
  try {
    // Read the save file
    const saveFilePath = "/Users/spencer/dev/reactProjects/eidex/src/lib/randomiser/pokeemerald-BST.sav";
    const saveFile = await Deno.readFile(saveFilePath);
    
    // Extract randomizer information
    const result = extractRandomizer(saveFile);
    
    console.log("Randomizer Status:");
    console.log(`  Enabled: ${result.enabled}`);
    console.log(`  Mode: ${result.mode} (${result.modeName})`);
    console.log(`  Active: ${result.active}`);
    
    // Example: Read a specific flag
    const randomizerFlag = readFlag(saveFile, FLAG_RANDOMIZER_ENABLED);
    console.log(`\nRandomizer flag (${FLAG_RANDOMIZER_ENABLED}): ${randomizerFlag}`);
    
    // Example: Read a specific variable
    const randomizerMode = readVarU16(saveFile, VAR_RANDOMIZER_MODE);
    console.log(`Randomizer mode variable (${VAR_RANDOMIZER_MODE}): ${randomizerMode}`);
    
  } catch (error) {
    console.error("Error reading save file:", error);
  }
}

// Run if this file is executed directly
if (typeof Deno !== 'undefined' && Deno.args !== undefined) {
  main();
}