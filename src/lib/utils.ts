import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Partition the indices of an array into `truthy` and `falsey` groups based on
 * a predicate. By default the predicate uses JavaScript's `Boolean` cast.
 *
 * Example:
 * const [truthy, falsey] = partitionIndices([0, 1, null, "a"])
 * // truthy -> [1, 3], falsey -> [0, 2]
 */
export function partitionIndices<T>(
  arr: readonly T[],
  predicate: (value: T, index: number, arr: readonly T[]) => boolean = (
    v: any,
  ) => Boolean(v),
): [truthy: number[], falsey: number[]] {
  const truthy: number[] = [];
  const falsey: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    (predicate(arr[i], i, arr) ? truthy : falsey).push(i);
  }
  return [truthy, falsey];
}

/** Convenience helpers for boolean partitioning */
export const indicesOfTruthy = <T>(arr: readonly T[]) => partitionIndices(arr)[0];
export const indicesOfFalsey = <T>(arr: readonly T[]) => partitionIndices(arr)[1];

/**
 * Partition the values of an array into `truthy` and `falsey` groups.
 * Single-pass, no intermediate index arrays.
 *
 * Example:
 * const [truthy, falsey] = partitionValues([0, 1, null, "a"])
 * // truthy -> [1, "a"], falsey -> [0, null]
 */
export function partitionValues<T>(
  arr: readonly T[],
  predicate: (value: T, index: number, arr: readonly T[]) => boolean = (
    v: any,
  ) => Boolean(v),
): [truthy: T[], falsey: T[]] {
  const truthy: T[] = [];
  const falsey: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    (predicate(arr[i], i, arr) ? truthy : falsey).push(arr[i]);
  }
  return [truthy, falsey];
}

/**
 * Given two arrays, partition arrB into duplicates (items also in arrA) and uniques (items only in arrB).
 * Uses a key function to determine equality. O(n + m) using a Set.
 *
 * Example:
 * const [dupes, uniques] = findDupesAndUniques([1, 2, 3], [2, 3, 4], x => x)
 * // dupes -> [2, 3], uniques -> [4]
 */
export function findDupesAndUniques<T, K = T>(
  arrA: readonly T[],
  arrB: readonly T[],
  keyFn: (value: T) => K = (v) => v as unknown as K,
): [dupes: T[], uniques: T[]] {
  const dupes: T[] = [];
  const uniques: T[] = [];

  // Build a set of keys from arrA
  const aKeys = new Set<K>();
  for (let i = 0; i < arrA.length; i++) {
    aKeys.add(keyFn(arrA[i]));
  }

  // Partition arrB based on whether items exist in arrA
  for (let i = 0; i < arrB.length; i++) {
    const key = keyFn(arrB[i]);
    if (aKeys.has(key)) {
      dupes.push(arrB[i]);
    } else {
      uniques.push(arrB[i]);
    }
  }

  return [dupes, uniques];
}
