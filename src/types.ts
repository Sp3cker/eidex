export interface PokemonChanges {
  stats?: number[];
  type?: number[];
  abilities?: (string | number[])[];
}

export type SortBy = "dexId" | "name" | "stat" | "index";

export type StatArray = [number, number, number, number, number, number];

export type Ability = number;
export type Abilities = Ability[];

export type MoveSource = "all" | "levelup" | "tm" | "egg";

export interface Pokemon {
  speciesId: number;
  speciesName: string;
  types: number[];
  stats: number[];
  abilities: number[];
  heldItems?: number[];
  levelUpMoves: number[][];
  tmMoves?: number[];
  eggMoves?: number[] | null;
  dexId: number;
  evolutions?: number[][] | null;
  forms: string[] | null;
  formId?: number;
  nameKey: string;
  siblings?: number[];
  baseForm?: number;
  tutorMoves?: number[];
  items?: number[];
  eggGroup?: number[];
  ancestor?: number;
  order?: number;
  changes?: PokemonChanges | string;

  // Legacy properties for compatibility
  index?: number;
}

export interface SpeciesData {
  [id: string]: Pokemon;
}

export interface FilterOptions {
  name?: string;
  typeId?: [number, number] | undefined;
  chosenStat?: number;
  sortBy?: string;
  statType?: string;
  isStatMax?: boolean;
  sortStat?: string;
  ability?: string;
  abilityId: number | null;
  levelupMove?: string;
  tmMove?: string;
  descending?: boolean;
  tutorMove?: string;
  moveName?: string;
  moveId?: number;
  moveSource?: MoveSource;
}

export interface Move {
  id: number;
  name: string;
  desc: string | null;
  power: number;
  type: number;
  cat: number;
  acc: number;
  pp?: number;
  description?: string;
  secondaryEffectChance?: number;
  target?: number;
  priority?: number;
  properties?: string[];
}

export type MoveData = Record<string, Move>;
export type MoveMap = Record<string, number>;

export interface TypeData {
  typeID: number;
  typeName: string;
  color: string;
  colorEnd: string;
  matchup: number[];
  cssClass: string;
}
