import levels from "./levels.json";
import items from "./merged-items.json";

type EncounterListing = {
  min_level: number;
  max_level: number;
  species: string;
};
export type TrainerRef = { id: string; script: string };
export type LevelMart = {
  label: string;
  mart: string;
  items: string[];
  levelLabel: string;
  scriptname: string;
};

export type Item = {
  id: string;
  itemId: number;
  name: string;
  description: string;
  price: number | null;
  [key: string]: unknown;
};

export const Items = new Map<string, Item>(
  items.filter((item) => item.id).map((item) => [item.id!, item]) as [string, Item][],
);

export function ByItemId(id: string): string | undefined {
  const item = Items.get(id);
  return item?.name;
}

export type ItemWithAmount = Item & {
  amount: number;
};

/** Raw types from JSON */
type RawLevelScriptedItem = {
  name: string;
  quantity: number;
};

type RawLevelScriptedEvent = {
  explanation: string;
  scriptName: string;
  items: RawLevelScriptedItem[];
  pokemon: LevelScriptedEventMon[];
};

type RawLevel = {
  baseMap: string;
  levelLabel: string;
  thisLevelsId: string;
  scriptedGives: RawLevelScriptedEvent[];
  shopItems: LevelMart[];
  trainerRefs: TrainerRef[];
  pickupItems: LevelPickupItem[];
  image: string;
};

/** Level Types */
export type LevelScriptedEvent = {
  explanation: string;
  scriptName: string;
  items: ItemWithAmount[];
  pokemon: LevelScriptedEventMon[];
};

export type LevelScriptedEventMon = {
  species: string;
  level: number;
  isRandom: boolean;
};

export type LevelPickupItem = {
  coords: number[];
  item: string;
  type: string;
};

export type Level = {
  baseMap: string;
  levelLabel: string;
  thisLevelsId: string;
  scriptedGives: LevelScriptedEvent[];
  shopItems: LevelMart[];
  // trainers: LevelTrainer[];
  pickupItems: LevelPickupItem[];
  image: string;
};
/** End Level Types */

export type ItemWithCoords = Item & {
  coords: number[];
};

export type EncounterGroup = {
  map: string;
  base_label: string;
  land_mons?: {
    encounter_rate: number;
    mons: EncounterListing[];
  };
  water_mons?: {
    encounter_rate: number;
    mons: EncounterListing[];
  };
  fishing_mons?: {
    encounter_rate: number;
    mons: EncounterListing[];
  };
  rock_smash_mons?: {
    encounter_rate: number;
    mons: EncounterListing[];
  };
};

export type PickupItem = Level["pickupItems"][number];

function processLevelsInfo(): Record<string, Level[]> {
  const rawLevels = levels as Record<string, RawLevel[]>;
  const processed: Record<string, Level[]> = {};

  for (const mapName in rawLevels) {
    if (Object.prototype.hasOwnProperty.call(rawLevels, mapName)) {
      processed[mapName] = rawLevels[mapName].map((level: RawLevel) => {
        const processedScriptedGives = level.scriptedGives.map(
          (give: RawLevelScriptedEvent) => {
            const itemsWithAmount = give.items
              .map((item: RawLevelScriptedItem) => {
                const itemDetails = Items.get(item.name);
                if (itemDetails) {
                  return { ...itemDetails, amount: item.quantity };
                }
                return null;
              })
              .filter((i): i is ItemWithAmount => i !== null);
            return { ...give, items: itemsWithAmount };
          },
        );
        return { ...level, scriptedGives: processedScriptedGives };
      });
    }
  }
  return processed;
}

export const LevelsInfo: Record<string, Level[]> = processLevelsInfo();
