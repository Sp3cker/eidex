import { pokemonData } from "@/data/pokemon";
import moveData from "@/data/moveData.json";
import abilityData from "@/data/abilityData.json";

// Lazy-loaded trainers data store
let trainersData: Record<string, Trainer[]> | null = null;
let isLoading = false;
let loadPromise: Promise<Record<string, Trainer[]>> | null = null;

const DEFAULT_EVS = [0, 0, 0, 0, 0, 0];

type RawTrainerPokemon = {
  species: string;
  nickname?: string | null;
  gender?: string;
  level: number;
  item?: string | null;
  ability?: string | null;
  nature?: string | null;
  ball?: string | null;
  friendship?: number | null;
  shiny?: boolean;
  dynamaxLevel?: number | null;
  gigantamaxFactor?: boolean;
  teraType?: string | null;
  evs?: number[];
  ivs?: number[];
  moves?: string[];
  tags?: string[];
  hpType?: number | null;
};

type RawTrainer = {
  battlePic: string;
  id: string;
  name: string;
  sprite: string;
  aiFlags: string[];
  items: string[];
  level: string;
  party: RawTrainerPokemon[];
};

type RawTrainerData = Record<string, RawTrainer[]>;

export type TrainerPartyMon = {
  id: number;
  lvl: number;
  moves: number[];
  ev: number[];
  ivs?: number[];
  iv?: boolean;
  nature: string;
  ability?: number[];
  item: string | null;
  hpType?: number;
  gender?: string;
  shiny?: boolean;
  tags?: string[];
  ball?: string | null;
  nickname?: string | null;
};

/** Trainer data loaded from `trainers.json` */
export interface Trainer {
  id: string;
  trainerName: string;
  battlePic: string;
  aiFlags: string[];
  sprite: string;
  hard?: boolean;
  level: string;
  party: TrainerPartyMon[];
  items: string[];
}

export type DisplayTrainer = Trainer;

const pokemonLookup = new Map<string, number>();
for (const mon of pokemonData) {
  if (mon.speciesName) {
    pokemonLookup.set(mon.speciesName.toLowerCase(), mon.speciesId);
  }
  if (mon.nameKey) {
    pokemonLookup.set(mon.nameKey.toLowerCase(), mon.speciesId);
  }
}

const moveLookup = new Map<string, number>();
for (const move of moveData) {
  moveLookup.set(move.name.toLowerCase(), move.id);
}

const abilityLookup = new Map<string, number>();
for (const ability of abilityData) {
  abilityLookup.set(ability.name.toLowerCase(), ability.id);
}

const normalizeAiFlag = (flag: string): string => {
  if (!flag) return "0";
  return flag
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_");
};

const toAbsoluteSpritePath = (relativePath: string): string => {
  if (!relativePath) return "";
  if (relativePath.startsWith("/")) {
    return relativePath;
  }
  return `/icon/generated/${relativePath}`.replace(/\/{2,}/g, "/");
};

const toAbsoluteBattlePic = (relativePath: string): string => {
  if (!relativePath) return "";
  return relativePath.startsWith("/")
    ? relativePath
    : `/${relativePath}`.replace(/\/{2,}/g, "/");
};

const normalizePartyMon = (mon: RawTrainerPokemon): TrainerPartyMon => {
  const speciesId =
    pokemonLookup.get(mon.species?.toLowerCase?.() ?? "") ?? 0;
  const moves =
    mon.moves
      ?.map((move) => moveLookup.get(move.toLowerCase()) || 0)
      .filter((id): id is number => id > 0) ?? [];
  const abilityId = mon.ability
    ? abilityLookup.get(mon.ability.toLowerCase())
    : undefined;

  return {
    id: speciesId,
    lvl: mon.level ?? 1,
    moves,
    ev: mon.evs && mon.evs.length === 6 ? mon.evs : DEFAULT_EVS.slice(),
    ivs: mon.ivs && mon.ivs.length === 6 ? mon.ivs : undefined,
    nature: (mon.nature ?? "").toLowerCase(),
    ability: abilityId ? [abilityId] : undefined,
    item: mon.item ?? null,
    hpType: mon.hpType ?? undefined,
    gender: mon.gender,
    shiny: mon.shiny ?? false,
    tags: mon.tags ?? [],
    ball: mon.ball ?? null,
    nickname: mon.nickname ?? null,
  };
};

const normalizeTrainer = (trainer: RawTrainer): Trainer => {
  return {
    id: trainer.id,
    trainerName: trainer.name,
    battlePic: toAbsoluteBattlePic(trainer.battlePic),
    sprite: toAbsoluteSpritePath(trainer.sprite),
    aiFlags: trainer.aiFlags?.map(normalizeAiFlag) ?? [],
    items: trainer.items ?? [],
    level: trainer.level ?? "Unknown",
    party: trainer.party?.map(normalizePartyMon) ?? [],
  };
};

const normalizeTrainerData = (
  data: RawTrainerData,
): Record<string, Trainer[]> => {

  return Object.entries(data).reduce((acc, [mapId, trainers]) => {
    acc[mapId] = trainers.map(normalizeTrainer);
    return acc;
  }, {} as Record<string, Trainer[]>);
};

// Lazy load trainers data only when first requested
export const getTrainersData = async (): Promise<Record<string, Trainer[]>> => {
  // If already loaded, return cached data
  if (trainersData !== null) {
    return trainersData;
  }

  // If currently loading, return the existing promise
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // Start loading
  isLoading = true;
  loadPromise = fetch("/trainers.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load trainers.json: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data: RawTrainerData) => {
      trainersData = normalizeTrainerData(data);
      isLoading = false;
      return trainersData;
    })
    .catch((error) => {
      isLoading = false;
      loadPromise = null;
      console.error("Error loading trainers data:", error);
      throw error;
    });

  return loadPromise;
};

// Get trainers for a specific map
export const getTrainersForMap = async (mapId: string): Promise<Trainer[]> => {
  const allTrainers = await getTrainersData();
  return allTrainers[mapId] || [];
};

// Get cached trainers for a map without loading (returns empty array if not loaded)
export const getCachedTrainersForMap = (mapId: string): Trainer[] => {
  if (trainersData === null) {
    return [];
  }
  return trainersData[mapId] || [];
};

// Get all cached data without loading (returns null if not loaded)
export const getCachedTrainersData = (): Record<string, Trainer[]> | null => {
  return trainersData;
};
