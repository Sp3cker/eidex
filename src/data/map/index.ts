import encounters from "./encounterGroup.json";
import levels from './groupedData.json';

const Level = {
   baseMap: string;
   "levelLabel": string;
   "thisLevelsId": string;
   "scriptedGives": [];
   "shopItems": [];
   "trainers": [];
   "items": [
   {
   "coords": number[];,
   "item": "ITEM_STORAGE_KEY",
   "type": "object_event"
   }]
   "image"
}export type EncounterGroup = {
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

export const Encounters = encounters as Record<string, EncounterGroup[]>;
