import encounters from "./encounterGroup.json";
import levels from "./levels.json";
import items from "./items.json";

export type EncounterGroup = {
  map: string;
  base_label: string;
  land_mons?: {
    encounter_rate: number;
    mons: { min_level: number; max_level: number; species: string }[];
  };
  water_mons?: {
    encounter_rate: number;
    mons: { min_level: number; max_level: number; species: string }[];
  };
  fishing_mons?: {
    encounter_rate: number;
    mons: { min_level: number; max_level: number; species: string }[];
  };
};

type Level = {
  baseMap: string;
  levelLabel: string;
  thisLevelsId: string;
  scriptedGives: {
    scriptName: string;
    items: string[];
    pokemon: string[];
  }[];
  shopItems: {
    label: string;
    mart: string;
    items: string[];
    levelLabel: string;
    scriptname: string;
  }[];
  trainers: {
    coords: number[];
    trainer_type: string;
    script: string;
  }[];
  pickupItems: {
    coords: number[];
    item: string;
    type: string;
  }[];
  image: string;
};

export type Item = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  [key: string]: unknown;
};

export type ItemWithCoords = Item & {
  coords: number[];
};

export type PickupItem = Level['pickupItems'][number];

export const LevelsInfo = levels as Record<string, Level[]>;
export const Encounters = encounters as Record<string, EncounterGroup[]>;
export const Items = new Map<string, Item>(
  items.map((item) => [item.id, item]),
);
