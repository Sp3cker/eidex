export interface PokemonChanges {
  stats?: number[];
  type?: number[];
  abilities?: (string | number[])[];
}

export type Ability = number[];
export type Abilities = Ability[];

export type MoveSource = "all" | "levelup" | "tm" | "tutor";

export interface Pokemon {
  ID: number;
  name: string; // Base pokemon name. Same name for other forms of pokemon
  stats: number[]; // [HP, Attack, Defense, Speed, Sp. Atk, Sp. Def]
  type: number[]; // Type IDs
  abilities: Abilities; // [Ability ID, index]
  eggGroup: number[]; // Egg group IDs
  items: number[]; // Item IDs
  levelupMoves: number[][]; // [Move ID, Level]
  evolutions?: number[][];
  tmMoves?: number[]; // TM IDs
  tutorMoves?: number[]; // Tutor move IDs
  nameKey: string; // Display name
  dexID: number; // National Dex ID
  ancestor: number; // Pre-evolution's ID
  eggMoves?: number[]; // Egg move IDs
  order?: number;
  changes?: PokemonChanges | string;
}

export interface SpeciesData {
  [id: string]: Pokemon;
}

export interface FilterOptions {
  name?: string;
  typeId?: number;
  minStat?: number;
  statType?: string;
  ability?: string;
  abilityId?: number
  levelupMove?: string;
  tmMove?: string;
  tutorMove?: string;
  moveName?: string;
  moveId?: number;
  moveSource?: MoveSource;
}

export interface Move {
  ID: number;
  name: string;
  power: number;
  type: number;
  accuracy: number;
  pp: number;
  secondaryEffectChance: number;
  target: number;
  priority: number;
  split: number;
  description: string;
}

export type MoveData = Record<string, Move>;
export type MoveMap = Record<string, number>;

export interface TypeData {
  typeID: number;
  typeName: string;
  color: string;
  colorEnd: string;
  matchup: number[];
}

export interface Item {
  ID: number;
  name: string;
  description: string;
}

export type ItemData = Record<string, Item>;
export type ItemMap = Record<string, number>;
