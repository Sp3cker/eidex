import { get, set } from "idb-keyval";

type RandoJson = {
  maps: any;
  species: any;
};
type MapConstant = {
  group: number;
  num: number;
};
// reserved cache key (kept documented for future grouping needs)
// const RANDOMISER_CACHE_KEY = "randomiserData";
// interface SpeciesRandomizations {
//   id: number;
//   isLegendary?: boolean;
//   mode: number; // per-species randomizer mode (form behavior / validity)
//   baseStat: number;
// }
// type kept for reference if needed later
type RandomizeJsonEntry = {
  id: number;
  baseStat: number;
  isLegendary?: boolean;
  mode: number;
};

function buildPublicUrl(relativePath: string): string {
  const base = (import.meta.env.BASE_URL || "/").toString();
  const baseNormalized = base.endsWith("/") ? base : `${base}/`;
  const relNormalized = relativePath.startsWith("/")
    ? relativePath.slice(1)
    : relativePath;
  return `${baseNormalized}${relNormalized}`;
}

async function fetchJsonFromPublic<T>(
  relativePath: string,
  init?: RequestInit,
): Promise<T> {
  try {
    const url = buildPublicUrl(relativePath);
    const response = await fetch(url, init);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${relativePath}: ${response.status} ${response.statusText}`,
      );
    }
    return (await response.json()) as T;
  } catch (e) {
    throw "Could not fetch:" + e;
  }
}

// export async function loadOptionalJson<T>(
//   relativePath: string,
//   cacheKey: string,
// ): Promise<T> {
//   const cached = (await get(cacheKey)) as T | undefined;
//   if (cached !== undefined) return cached;

//   await set(cacheKey, data);
//   return data;
// }

async function loadRandomiserData(): Promise<RandoJson> {
  const data = await fetchJsonFromPublic<RandoJson>("mapsandspecies.json");
  if (!data || typeof data !== "object" || (data as any).maps === undefined) {
    throw new Error("Could not fetch mapsandspecies.json");
  }
  if (data.species) {
    data.species.forEach((species: RandomizeJsonEntry) => {
      //@ts-ignore
      species.id = species.ID;
    });
  }
  Promise.all([set("mapsdata", data.maps), set("randomspecies", data.species)]);
  return {
    maps: data.maps,
    species: data.species,
  };
}
export async function loadSpeciesData(): Promise<RandomizeJsonEntry[]> {
  const randomSpecies = await get("randomspecies");
  if (randomSpecies !== undefined) return randomSpecies;
  const data = await loadRandomiserData();

  return data.species;
}

export async function loadMapsData(): Promise<Record<string, MapConstant>> {
  const cachedMapsData = await get("mapsdata");
  if (cachedMapsData !== undefined) return cachedMapsData;
  const data = await loadRandomiserData();

  return data.maps;
}
export async function getMapConstant(mapId: string): Promise<MapConstant> {
  const mapsData = await loadMapsData();
  if (mapsData[mapId]) return mapsData[mapId];
  throw new Error(`Map constant ${mapId} not found`);
}
export { buildPublicUrl };
