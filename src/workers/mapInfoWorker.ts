/**
 * NOT USED NOT USED NOT USED NOT USED
 * Web Worker to compute encounter information for a given map + level.
 * It replicates the logic that previously lived in getSelectedMapInfo so the
 * main thread is free from the heavier filtering / mapping work.
 *
 * The worker expects messages shaped as:
 *   { type: 'GET_MAP_INFO', payload: { mapId: string; levelId: string; requestId: string } }
 * and responds with
 *   { type: 'MAP_INFO_READY', payload: { requestId: string; data: MapInfoResult } }
 */

/// <reference lib="webworker" />

// ---------------------------------------------------------------------------
// Imports (note the paths are relative to the worker file location)
// ---------------------------------------------------------------------------
// Encounters grouped by map-base key ➜ Array<EncounterGroup>
import encounterGroupJson from "../data/map/encounterGroup.json";

// Pokemon species list used to resolve sprite indexes / nameKeys
import { pokemonData as pokemon } from "../data/pokemon";

// ---------------------------------------------------------------------------
// Type helpers – kept intentionally minimal to avoid leaking app-specific types.
// ---------------------------------------------------------------------------
interface EncounterMonRaw {
  species: string;
  min_level: number;
  max_level: number;
  rod?: string;
  index?: number;
}

interface EncounterMon extends EncounterMonRaw {
  index: number; // sprite / dex id
  rate?: number; // cumulative encounter chance after weighting
  rod?: string;  // "Old Rod" | "Good Rod" | "Super Rod" | etc.
}

export interface MapInfoResult {
  landEncounters?: EncounterMon[];
  waterEncounters?: EncounterMon[];
  fishingEncounters?: EncounterMon[];
}

// ---------------------------------------------------------------------------
// PRE-COMPUTED lookup tables
// ---------------------------------------------------------------------------
const MONNAMEKEYS = new Map<string, number>();
pokemon.forEach((p) => {
  MONNAMEKEYS.set(p.nameKey.toLowerCase().replace(/-/g, "_"), p.speciesId);
});

// ---------------------------------------------------------------------------
// Utility helpers (mostly copied from original implementation)
// ---------------------------------------------------------------------------
const putIdOnEncounter = (
  enc: EncounterMonRaw[],
  monsNameKeys: Map<string, number>,
): EncounterMon[] => {
  enc.forEach((specie, index) => {
    let specieIndex = monsNameKeys.get(specie.species);

    // Special-case form names that deviate from canonical naming in the jsons
    if (specie.species === "darmanitan_galar") {
      specieIndex = 990;
    }
    if (specie.species === "mr_mime_galar") {
      specieIndex = 981;
    }
    if (specie.species === "mr_mime") {
      specieIndex = 122;
    }

    if (specieIndex === undefined) {
      // Try once more, converting underscores to spaces etc.
      specieIndex = monsNameKeys.get(
        specie.species.replace(/_/g, " ").toLowerCase(),
      );
    }

    if (specieIndex === undefined) {
      // Fallback – inspect pokemon list for a match on speciesName
      const monInJson = pokemon.findIndex(
        (p) =>
          p.speciesName
            .toLowerCase()
            .replace("flabébé", "flabebe")
            .replace(/♂/g, "_m")
            .replace(/♀/g, "_f") === specie.species,
      );

      if (monInJson !== -1) {
        specieIndex = pokemon[monInJson].baseForm || pokemon[monInJson].speciesId;
      }
    }

    // If we STILL don't have a match, leave index undefined and log – the UI can handle it.
    if (specieIndex === undefined) {
      console.warn(`[mapInfoWorker] Failed to resolve species id for %s`, specie.species);
      return;
    }

    enc[index].index = specieIndex;
  });
  return enc as EncounterMon[];
};

// Assign rod info (Old/Good/Super Rod) per species then collapse duplicates into combined string
const putRodUsed = (mons: EncounterMon[]): EncounterMon[] => {
  mons.forEach((mon, slot) => {
    let rod: string;
    if (slot <= 1) rod = "Old Rod";
    else if (slot <= 4) rod = "Good Rod";
    else rod = "Super Rod";
    mon.rod = rod;
  });

  const speciesToRods: Record<string, Set<string>> = {};
  mons.forEach((m) => {
    if (!m.rod) return;
    speciesToRods[m.species] = speciesToRods[m.species] || new Set();
    speciesToRods[m.species].add(m.rod);
  });

  const order = ["Old Rod", "Good Rod", "Super Rod"];
  mons.forEach((m) => {
    const rods = speciesToRods[m.species];
    if (!rods) return;
    m.rod = [...rods]
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .join("/")
      .replace(/ Rod/g, "") + " Rod";
  });
  return mons;
};

// Weight table copied from in-app logic
const RATE_WEIGHTS = [20, 20, 10, 10, 10, 10, 5, 5, 4, 4, 1, 1];

const putEncounterRate = (mons: EncounterMon[]): EncounterMon[] => {
  const totals = new Map<string, number>();
  const bySpecies = new Map<string, EncounterMon>();

  mons.forEach((enc, idx) => {
    if (idx >= RATE_WEIGHTS.length) return;
    const current = totals.get(enc.species) || 0;
    totals.set(enc.species, current + RATE_WEIGHTS[idx]);
    bySpecies.set(enc.species, { ...enc });
  });

  bySpecies.forEach((enc) => {
    enc.rate = totals.get(enc.species) || 0;
  });

  return [...bySpecies.values()];
};

// ---------------------------------------------------------------------------
// Core logic – mirrors original getSelectedMapInfo implementation
// ---------------------------------------------------------------------------

import type { EncounterGroup } from "../data/map";

const encounterGroup = encounterGroupJson as Record<string, EncounterGroup[]>;

const getSelectedMapInfoInternal = (
  mapId: string,
  levelId: string,
): MapInfoResult | undefined => {
  const mapEncounterGroup = encounterGroup[mapId] as EncounterGroup[] | undefined;
  if (!mapEncounterGroup) return undefined;

  const targetLevelEncounters = mapEncounterGroup.find((e) => e.map === levelId);
  if (!targetLevelEncounters) return undefined;

  let landEncounters: EncounterMon[] | undefined;
  let waterEncounters: EncounterMon[] | undefined;
  let fishingEncounters: EncounterMon[] | undefined;

  if (targetLevelEncounters.land_mons) {
    const landMonsRaw = targetLevelEncounters.land_mons.mons as EncounterMonRaw[];
    const landMons = putIdOnEncounter(landMonsRaw, MONNAMEKEYS);
    landEncounters = putEncounterRate(landMons);
  }
  if (targetLevelEncounters.water_mons) {
    const waterMonsRaw = targetLevelEncounters.water_mons.mons as EncounterMonRaw[];
    const waterMons = putIdOnEncounter(waterMonsRaw, MONNAMEKEYS);
    waterEncounters = putEncounterRate(waterMons);
  }
  if (targetLevelEncounters.fishing_mons) {
    const fishMonsRaw = targetLevelEncounters.fishing_mons.mons as EncounterMonRaw[];
    const fishMons = putIdOnEncounter(fishMonsRaw, MONNAMEKEYS);
    putRodUsed(fishMons);
    fishingEncounters = putEncounterRate(fishMons);
  }

  return { landEncounters, waterEncounters, fishingEncounters };
};

// ---------------------------------------------------------------------------
// Message handling – keep it minimal and focused on the one heavy task.
// ---------------------------------------------------------------------------

interface GetMapInfoRequest {
  type: "GET_MAP_INFO";
  payload: { mapId: string; levelId: string; requestId: string };
}

interface MapInfoReadyResponse {
  type: "MAP_INFO_READY";
  payload: { requestId: string; data?: MapInfoResult; error?: string };
}

self.onmessage = (evt: MessageEvent<GetMapInfoRequest>) => {
  const { type, payload } = evt.data;
  if (type !== "GET_MAP_INFO") return;

  const { mapId, levelId, requestId } = payload;
  try {
    const data = getSelectedMapInfoInternal(mapId, levelId);
    const response: MapInfoReadyResponse = {
      type: "MAP_INFO_READY",
      payload: {
        requestId,
        data,
      },
    };
    (self as DedicatedWorkerGlobalScope).postMessage(response);
  } catch (err) {
    const response: MapInfoReadyResponse = {
      type: "MAP_INFO_READY",
      payload: {
        requestId,
        error: err instanceof Error ? err.message : "Unknown error",
      },
    };
    (self as DedicatedWorkerGlobalScope).postMessage(response);
  }
}; 