// Seed builders centralizing all 32-bit seed compositions used by the engine

// Wild encounter: (mapGroup<<24)|(mapNum<<16)|(area<<8)|slotIndex
export function buildWildEncounterSeed(
  mapGroup: number,
  mapNum: number,
  areaEnum: number,
  slotIndex: number,
): number {
  // Mirror C exactly: (group<<24)|(num<<16)|(area<<8)|slot, then coerce to uint32
  return (((mapGroup << 24) | (mapNum << 16) | (areaEnum << 8) | slotIndex) >>> 0);
}

// Trainer party: (trainerId<<16)|(totalMons<<8)|slot
export function buildTrainerPartySeed(
  trainerId: number,
  totalMons: number,
  slotIndex: number,
): number {
  return ((trainerId & 0xffff) << 16) | ((totalMons & 0xff) << 8) | (slotIndex & 0xff);
}

// Fixed encounter: (mapNum<<16)|(mapGroup<<8)|localId
export function buildFixedEncounterSeed(
  mapNum: number,
  mapGroup: number,
  localId: number,
): number {
  return ((mapNum & 0xff) << 16) | ((mapGroup & 0xff) << 8) | (localId & 0xff);
}

// Field item: (mapGroup<<16)|(mapNum<<8)|localId
export function buildFieldItemSeed(
  mapGroup: number,
  mapNum: number,
  localId: number,
): number {
  return ((mapGroup & 0xff) << 16) | ((mapNum & 0xff) << 8) | (localId & 0xff);
}


