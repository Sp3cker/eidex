
export function buildWildEncounterSeed(
  mapGroup: number,
  mapNum: number,
  areaEnum: number,
  slotIndex: number,
): number {
  return (((mapGroup << 24) | (mapNum << 16) | (areaEnum << 8) | slotIndex) >>> 0);
}


export function buildTrainerPartySeed(
  trainerId: number,
  totalMons: number,
  slotIndex: number,
): number {
  return ((trainerId & 0xffff) << 16) | ((totalMons & 0xff) << 8) | (slotIndex & 0xff);
}

export function buildFixedEncounterSeed(
  mapNum: number,
  mapGroup: number,
  localId: number,
): number {
  return ((mapNum & 0xff) << 16) | ((mapGroup & 0xff) << 8) | (localId & 0xff);
}

export function buildFieldItemSeed(
  mapGroup: number,
  mapNum: number,
  localId: number,
): number {
  return ((mapGroup & 0xff) << 16) | ((mapNum & 0xff) << 8) | (localId & 0xff);
}


