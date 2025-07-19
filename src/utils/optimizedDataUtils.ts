/**
 * Utility functions for working with optimized data formats
 * that use numeric keys and lookup tables to reduce bundle size
 */

export interface OptimizedData<T> {
  lookups: Record<string, Record<string, string | number>>;
  data: T;
}

export interface OptimizedPokemon {
  n: string; // name
  t: number[]; // types
  s: number[]; // stats
  a: number[]; // abilities
  h: number[]; // heldItems
  l: [number, number][]; // levelUpMoves
  tm: number[]; // tmMoves
  e: number[] | null; // eggMoves
  d: number; // dexId
  ev: [number, number, number][] | null; // evolutions
  f: any | null; // forms
  fi: number; // formId
  nk: string; // nameKey
}

export interface OptimizedMove {
  i: number; // id
  n: string; // name
  t: number; // type
  d: string; // description
  p: number; // power
  a: number; // accuracy
  c: number; // category
  pr: number[]; // properties
}

/**
 * Create a lookup function for optimized data
 */
export function createLookup<T extends OptimizedData<any>>(
  data: T,
  lookupKey: keyof T['lookups']
): (id: string | number) => string {
  const lookup = data.lookups[lookupKey as string];
  return (id: string | number) => {
    const key = id.toString();
    return lookup[key]?.toString() || key;
  };
}

/**
 * Get type name from type ID
 */
export function getTypeName(data: OptimizedData<any>, typeId: number): string {
  return createLookup(data, 'types')(typeId);
}

/**
 * Get ability name from ability ID
 */
export function getAbilityName(data: OptimizedData<any>, abilityId: number): string {
  return createLookup(data, 'abilities')(abilityId);
}

/**
 * Get move category name from category ID
 */
export function getMoveCategory(data: OptimizedData<any>, categoryId: number): string {
  return createLookup(data, 'categories')(categoryId);
}

/**
 * Convert optimized Pokemon data to full format
 */
export function expandPokemonData(
  optimized: OptimizedPokemon,
  lookups: OptimizedData<any>['lookups']
): any {
  const typeLookup = createLookup({ lookups } as any, 'types');
  const abilityLookup = createLookup({ lookups } as any, 'abilities');

  return {
    speciesId: optimized.d,
    speciesName: optimized.n,
    types: optimized.t.map(id => ({
      id,
      name: typeLookup(id)
    })),
    stats: optimized.s,
    abilities: optimized.a.map(id => ({
      id,
      name: abilityLookup(id)
    })),
    heldItems: optimized.h,
    levelUpMoves: optimized.l,
    tmMoves: optimized.tm,
    eggMoves: optimized.e,
    dexId: optimized.d,
    evolutions: optimized.ev,
    forms: optimized.f,
    formId: optimized.fi,
    nameKey: optimized.nk
  };
}

/**
 * Convert optimized Move data to full format
 */
export function expandMoveData(
  optimized: OptimizedMove,
  lookups: OptimizedData<any>['lookups']
): any {
  const typeLookup = createLookup({ lookups } as any, 'types');
  const categoryLookup = createLookup({ lookups } as any, 'categories');

  return {
    id: optimized.i,
    name: optimized.n,
    type: {
      id: optimized.t,
      name: typeLookup(optimized.t)
    },
    description: optimized.d,
    power: optimized.p,
    accuracy: optimized.a,
    category: {
      id: optimized.c,
      name: categoryLookup(optimized.c)
    },
    properties: optimized.pr
  };
}

/**
 * Create a Map for O(1) lookups from optimized data
 */
export function createOptimizedMap<T>(
  data: OptimizedData<T[]>,
  keyExtractor: (item: T) => string | number
): Map<string, T> {
  const map = new Map<string, T>();
  data.data.forEach(item => {
    const key = keyExtractor(item).toString();
    map.set(key, item);
  });
  return map;
}

/**
 * Lazy loading utility for large datasets
 */
export class LazyDataLoader<T> {
  private data: T | null = null;
  private loadPromise: Promise<T> | null = null;

  constructor(private loader: () => Promise<T>) {}

  async getData(): Promise<T> {
    if (this.data) return this.data;
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = this.loader().then(data => {
      this.data = data;
      return data;
    });

    return this.loadPromise;
  }

  clearCache(): void {
    this.data = null;
    this.loadPromise = null;
  }
}