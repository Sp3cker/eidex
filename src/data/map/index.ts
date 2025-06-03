import encounters from "./encounterGroup.json";
import levels from "./groupedData.json";

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
export const LevelsInfo = levels as Record<string, Level[]>;
export const Encounters = encounters as Record<string, EncounterGroup[]>;
