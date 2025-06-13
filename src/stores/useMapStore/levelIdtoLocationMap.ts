import { LevelsInfo } from "@/data/map";

interface LevelLocation {
  baseMapName: string;
  levelIndex: number;
  //   levelData: any; // The actual level object from LevelsInfo
}

const levelIdToLocationMap = new Map<string, LevelLocation>();

function initializeLevelIdLookup() {
  if (levelIdToLocationMap.size > 0) return;

  for (const baseMapName in LevelsInfo) {
    const levels = LevelsInfo[baseMapName];
    if (Array.isArray(levels)) {
      levels.forEach((level, index) => {
        if (level && level.thisLevelsId) {
          levelIdToLocationMap.set(level.thisLevelsId, {
            baseMapName: baseMapName,
            levelIndex: index,
          });
        }
      });
    }
  }
}
export { initializeLevelIdLookup, levelIdToLocationMap };
